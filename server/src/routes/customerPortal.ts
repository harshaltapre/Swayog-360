import { AppointmentStatus, InvoiceStatus, Priority, Role, ServiceRequestStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Router, type Request } from "express";
import { z } from "zod";
import { createAppointmentCode, createCustomerActivity, createCustomerNotification, createServiceRequestCode, getCustomerByUserId, serializeProfile } from "../lib/customerPortal";
import { prisma } from "../lib/prisma";
import { getStripeClient, isStripeConfigured } from "../lib/stripe";
import { requireAuth, requireRole } from "../middleware/auth";

export const customerPortalRouter = Router();

const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  language: z.string().min(2).max(60),
  twoFactorEnabled: z.boolean(),
  billingAddress: z.object({
    line1: z.string().min(2).max(120),
    line2: z.string().max(120).optional().or(z.literal("")),
    city: z.string().min(2).max(80),
    state: z.string().min(2).max(80),
    postalCode: z.string().min(4).max(12),
    country: z.string().min(2).max(80)
  }),
  notificationPreferences: z.object({
    systemAlerts: z.boolean(),
    financialReports: z.boolean(),
    marketingUpdates: z.boolean(),
    maintenanceAlerts: z.boolean(),
    projectUpdates: z.boolean()
  })
});

const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "New password and confirm password must match.",
    path: ["confirmPassword"]
  });

const serviceRequestCreateSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(8).max(1000),
  priority: z.nativeEnum(Priority),
  category: z.string().min(2).max(80),
  attachmentName: z.string().max(200).optional(),
  attachmentUrl: z.string().url().optional()
});

const serviceAppointmentCreateSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(500).optional(),
  serviceRequestId: z.string().optional(),
  scheduledFor: z.string().datetime(),
  location: z.string().min(2).max(120)
});

const feedbackCreateSchema = z.object({
  category: z.string().min(2).max(80),
  subject: z.string().min(3).max(160),
  message: z.string().min(8).max(1000),
  rating: z.number().min(1).max(5).optional()
});

const syncPaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1)
});

async function requireCustomerContext(userId: string) {
  const customer = await getCustomerByUserId(prisma, userId);
  if (!customer) {
    throw new Error("Customer profile not found.");
  }
  return customer;
}

async function ensureStripeCustomer(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: { user: true }
  });

  if (!customer) {
    throw new Error("Customer profile not found.");
  }

  if (customer.stripeCustomerId) {
    return customer.stripeCustomerId;
  }

  const stripe = getStripeClient();
  const created = await stripe.customers.create({
    email: customer.email ?? customer.user?.email ?? undefined,
    name: customer.name,
    phone: customer.phone ?? customer.user?.phone ?? undefined,
    metadata: {
      customerId: customer.id,
      userId: customer.userId ?? ""
    }
  });

  await prisma.customer.update({
    where: { id: customer.id },
    data: { stripeCustomerId: created.id }
  });

  return created.id;
}

async function upsertStripePaymentMethod(customerId: string, paymentMethodId: string) {
  const stripe = getStripeClient();
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  if (paymentMethod.type !== "card") {
    throw new Error("Only card payment methods are currently supported.");
  }

  const existingCount = await prisma.paymentMethod.count({ where: { customerId } });

  const upserted = await prisma.paymentMethod.upsert({
    where: { stripePaymentMethodId: paymentMethod.id },
    update: {
      brand: paymentMethod.card?.brand ?? null,
      last4: paymentMethod.card?.last4 ?? null,
      expMonth: paymentMethod.card?.exp_month ?? null,
      expYear: paymentMethod.card?.exp_year ?? null
    },
    create: {
      customerId,
      stripePaymentMethodId: paymentMethod.id,
      brand: paymentMethod.card?.brand ?? null,
      last4: paymentMethod.card?.last4 ?? null,
      expMonth: paymentMethod.card?.exp_month ?? null,
      expYear: paymentMethod.card?.exp_year ?? null,
      isDefault: existingCount === 0
    }
  });

  return upserted;
}

function resolveAppBaseUrl(req: Request) {
  const forwardedHost = req.get("x-forwarded-host");
  const forwardedProto = req.get("x-forwarded-proto") ?? req.protocol;

  if (forwardedHost && forwardedProto) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = req.get("host");
  if (host) {
    return `${req.protocol}://${host}`;
  }

  return process.env.APP_BASE_URL ?? process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
}

customerPortalRouter.use(requireAuth, requireRole([Role.CUSTOMER]));

customerPortalRouter.get("/profile", async (req, res) => {
  try {
    const customer = await requireCustomerContext(req.user!.id);
    res.json({ profile: serializeProfile(customer) });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Customer profile not found." });
  }
});

customerPortalRouter.patch("/profile", async (req, res) => {
  const parsed = profileUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  try {
    const customer = await requireCustomerContext(req.user!.id);
    const payload = parsed.data;

    const updated = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: req.user!.id },
        data: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          avatarUrl: payload.avatarUrl || null
        }
      });

      return tx.customer.update({
        where: { id: customer.id },
        include: { user: true },
        data: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          avatarUrl: payload.avatarUrl || null,
          language: payload.language,
          billingAddressLine1: payload.billingAddress.line1,
          billingAddressLine2: payload.billingAddress.line2 || null,
          billingCity: payload.billingAddress.city,
          billingState: payload.billingAddress.state,
          billingPostalCode: payload.billingAddress.postalCode,
          billingCountry: payload.billingAddress.country,
          notificationSystemAlerts: payload.notificationPreferences.systemAlerts,
          notificationFinancialReports: payload.notificationPreferences.financialReports,
          notificationMarketingUpdates: payload.notificationPreferences.marketingUpdates,
          notificationMaintenanceAlerts: payload.notificationPreferences.maintenanceAlerts,
          notificationProjectUpdates: payload.notificationPreferences.projectUpdates,
          twoFactorEnabled: payload.twoFactorEnabled
        }
      });
    });

    await createCustomerActivity(prisma, {
      customerId: customer.id,
      type: "profile",
      title: "Account settings updated",
      description: "Your account preferences were saved successfully.",
      link: "/customer/settings"
    });

    res.json({ profile: serializeProfile(updated) });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Unable to update profile." });
  }
});

customerPortalRouter.post("/profile/password", async (req, res) => {
  const parsed = passwordUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!valid) {
    res.status(400).json({ message: "Current password is incorrect." });
    return;
  }

  const password = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password }
  });

  const customer = await requireCustomerContext(req.user!.id);
  await createCustomerActivity(prisma, {
    customerId: customer.id,
    type: "security",
    title: "Password updated",
    description: "Your account password was updated successfully.",
    link: "/customer/settings"
  });

  res.json({ success: true });
});

customerPortalRouter.get("/dashboard", async (req, res) => {
  try {
    const customer = await requireCustomerContext(req.user!.id);

    const [installation, openServiceRequests, pendingInvoices, allInvoices, recentActivity, recentMetrics, unreadNotifications, upcomingAppointments] = await Promise.all([
      prisma.installation.findUnique({ where: { customerId: customer.id } }),
      prisma.serviceRequest.findMany({
        where: { customerId: customer.id, status: { in: [ServiceRequestStatus.OPEN, ServiceRequestStatus.IN_PROGRESS] } },
        orderBy: { updatedAt: "desc" },
        take: 5
      }),
      prisma.invoice.findMany({
        where: { customerId: customer.id, status: { in: [InvoiceStatus.PENDING, InvoiceStatus.OVERDUE, InvoiceStatus.SENT] } },
        include: { lineItems: true },
        orderBy: { dueDate: "asc" }
      }),
      prisma.invoice.findMany({
        where: { customerId: customer.id },
        orderBy: { createdAt: "desc" }
      }),
      prisma.activityEvent.findMany({
        where: { customerId: customer.id },
        orderBy: { occurredAt: "desc" },
        take: 8
      }),
      prisma.installationMetric.findMany({
        where: { installation: { customerId: customer.id } },
        orderBy: { metricDate: "desc" },
        take: 7
      }),
      prisma.notification.count({
        where: { customerId: customer.id, isRead: false }
      }),
      prisma.serviceAppointment.findMany({
        where: {
          customerId: customer.id,
          scheduledFor: { gte: new Date() },
          status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] }
        },
        orderBy: { scheduledFor: "asc" },
        take: 3
      })
    ]);

    const totalPaid = allInvoices
      .filter((invoice) => invoice.status === InvoiceStatus.PAID)
      .reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    const totalOutstanding = pendingInvoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0);

    res.json({
      customer: {
        name: customer.name,
        email: customer.email,
        zone: customer.zone
      },
      installation,
      kpis: {
        systemStatus: installation?.status ?? "UNKNOWN",
        openServiceRequestCount: openServiceRequests.length,
        nextPaymentDue: pendingInvoices[0] ?? null,
        totalEnergySavedMwh: installation?.totalEnergySavedMwh ?? "0",
        totalPaid,
        totalOutstanding
      },
      pendingInvoices,
      openServiceRequests,
      recentActivity,
      recentMetrics: recentMetrics.reverse(),
      unreadNotifications,
      upcomingAppointments
    });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Customer dashboard unavailable." });
  }
});

customerPortalRouter.get("/installations", async (req, res) => {
  try {
    const customer = await requireCustomerContext(req.user!.id);
    const installation = await prisma.installation.findUnique({
      where: { customerId: customer.id },
      include: {
        milestones: { orderBy: { occurredAt: "desc" } },
        metrics: { orderBy: { metricDate: "desc" }, take: 60 },
        devices: { orderBy: { createdAt: "asc" } }
      }
    });

    res.json({ installation });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Installation details unavailable." });
  }
});

customerPortalRouter.get("/devices", async (req, res) => {
  try {
    const customer = await requireCustomerContext(req.user!.id);
    const devices = await prisma.device.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: "asc" }
    });
    res.json({
      devices,
      summary: {
        total: devices.length,
        active: devices.filter((device) => device.status === "ACTIVE").length,
        averagePerformance:
          devices.length > 0
            ? devices.reduce((sum, device) => sum + Number(device.performance ?? 0), 0) / devices.length
            : 0
      }
    });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Devices unavailable." });
  }
});

customerPortalRouter.get("/service-requests", async (req, res) => {
  try {
    const customer = await requireCustomerContext(req.user!.id);
    const requests = await prisma.serviceRequest.findMany({
      where: { customerId: customer.id },
      include: {
        appointments: {
          orderBy: { scheduledFor: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      requests,
      summary: {
        total: requests.length,
        open: requests.filter((request) => request.status === ServiceRequestStatus.OPEN).length,
        inProgress: requests.filter((request) => request.status === ServiceRequestStatus.IN_PROGRESS).length,
        resolved: requests.filter((request) => request.status === ServiceRequestStatus.RESOLVED).length
      }
    });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Service requests unavailable." });
  }
});

customerPortalRouter.post("/service-requests", async (req, res) => {
  const parsed = serviceRequestCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  try {
    const customer = await requireCustomerContext(req.user!.id);
    const created = await prisma.serviceRequest.create({
      data: {
        customerId: customer.id,
        requestCode: createServiceRequestCode(),
        customerName: customer.name,
        title: parsed.data.title,
        description: parsed.data.description,
        issueType: parsed.data.category,
        priority: parsed.data.priority,
        status: ServiceRequestStatus.OPEN,
        attachmentName: parsed.data.attachmentName,
        attachmentUrl: parsed.data.attachmentUrl
      }
    });

    await Promise.all([
      createCustomerNotification(prisma, {
        customerId: customer.id,
        userId: customer.userId,
        type: "service",
        category: "maintenance",
        title: "Service request received",
        message: `${created.title} has been logged with code ${created.requestCode}.`,
        link: "/customer/service"
      }),
      createCustomerActivity(prisma, {
        customerId: customer.id,
        type: "service",
        title: "New service request created",
        description: `${created.requestCode} - ${created.title}`,
        link: "/customer/service"
      })
    ]);

    res.status(201).json({ request: created });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Unable to create service request." });
  }
});

customerPortalRouter.get("/service-appointments", async (req, res) => {
  try {
    const customer = await requireCustomerContext(req.user!.id);
    const appointments = await prisma.serviceAppointment.findMany({
      where: { customerId: customer.id },
      include: { serviceRequest: true },
      orderBy: { scheduledFor: "asc" }
    });

    res.json({ appointments });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Appointments unavailable." });
  }
});

customerPortalRouter.post("/service-appointments", async (req, res) => {
  const parsed = serviceAppointmentCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  try {
    const customer = await requireCustomerContext(req.user!.id);
    if (parsed.data.serviceRequestId) {
      const request = await prisma.serviceRequest.findFirst({
        where: { id: parsed.data.serviceRequestId, customerId: customer.id }
      });

      if (!request) {
        res.status(404).json({ message: "Related service request not found." });
        return;
      }
    }

    const appointment = await prisma.serviceAppointment.create({
      data: {
        customerId: customer.id,
        serviceRequestId: parsed.data.serviceRequestId,
        appointmentCode: createAppointmentCode(),
        title: parsed.data.title,
        description: parsed.data.description,
        scheduledFor: new Date(parsed.data.scheduledFor),
        location: parsed.data.location,
        status: AppointmentStatus.SCHEDULED
      },
      include: { serviceRequest: true }
    });

    await Promise.all([
      createCustomerNotification(prisma, {
        customerId: customer.id,
        userId: customer.userId,
        type: "appointment",
        category: "maintenance",
        title: "Service appointment scheduled",
        message: `${appointment.title} has been scheduled successfully.`,
        link: "/customer/service/schedule"
      }),
      createCustomerActivity(prisma, {
        customerId: customer.id,
        type: "appointment",
        title: "Service appointment booked",
        description: `${appointment.title} on ${appointment.scheduledFor.toISOString()}`,
        link: "/customer/service/schedule"
      })
    ]);

    res.status(201).json({ appointment });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Unable to schedule appointment." });
  }
});

customerPortalRouter.post("/feedback", async (req, res) => {
  const parsed = feedbackCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  try {
    const customer = await requireCustomerContext(req.user!.id);
    const feedback = await prisma.customerFeedback.create({
      data: {
        customerId: customer.id,
        category: parsed.data.category,
        subject: parsed.data.subject,
        message: parsed.data.message,
        rating: parsed.data.rating
      }
    });

    await createCustomerActivity(prisma, {
      customerId: customer.id,
      type: "feedback",
      title: "Feedback submitted",
      description: parsed.data.subject,
      link: "/customer/feedback"
    });

    res.status(201).json({ feedback });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Unable to submit feedback." });
  }
});

customerPortalRouter.get("/invoices", async (req, res) => {
  try {
    const customer = await requireCustomerContext(req.user!.id);
    const [invoices, paymentMethods] = await Promise.all([
      prisma.invoice.findMany({
        where: { customerId: customer.id },
        include: {
          lineItems: true,
          paymentTransactions: {
            orderBy: { createdAt: "desc" }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.paymentMethod.findMany({
        where: { customerId: customer.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
      })
    ]);

    const totalAmount = invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    const paidAmount = invoices
      .filter((invoice) => invoice.status === InvoiceStatus.PAID)
      .reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    const outstandingAmount = invoices
      .filter((invoice) => invoice.status !== InvoiceStatus.PAID)
      .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

    res.json({
      invoices,
      paymentMethods,
      summary: {
        totalAmount,
        paidAmount,
        outstandingAmount
      }
    });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Invoices unavailable." });
  }
});

customerPortalRouter.post("/invoices/:invoiceId/checkout-session", async (req, res) => {
  if (!isStripeConfigured()) {
    res.status(503).json({ message: "Stripe is not configured. Add Stripe keys to enable checkout." });
    return;
  }

  try {
    const customer = await requireCustomerContext(req.user!.id);
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.invoiceId, customerId: customer.id },
      include: { lineItems: true }
    });

    if (!invoice) {
      res.status(404).json({ message: "Invoice not found." });
      return;
    }

    if (invoice.status === InvoiceStatus.PAID) {
      res.status(400).json({ message: "Invoice is already paid." });
      return;
    }

    const stripeCustomerId = await ensureStripeCustomer(customer.id);
    const stripe = getStripeClient();
    const appBaseUrl = resolveAppBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      success_url: `${appBaseUrl}/customer/payments?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appBaseUrl}/customer/payments?checkout=cancelled`,
      metadata: {
        invoiceId: invoice.id,
        customerId: customer.id,
        userId: customer.userId ?? ""
      },
      line_items: invoice.lineItems.map((lineItem) => ({
        quantity: 1,
        price_data: {
          currency: "inr",
          product_data: {
            name: lineItem.label,
            description: lineItem.description ?? undefined
          },
          unit_amount: Math.round(Number(lineItem.amount) * 100)
        }
      }))
    });

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        stripeCheckoutSessionId: session.id,
        status: invoice.status === InvoiceStatus.DRAFT ? InvoiceStatus.SENT : invoice.status
      }
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Unable to create checkout session." });
  }
});

customerPortalRouter.get("/payment-methods", async (req, res) => {
  try {
    const customer = await requireCustomerContext(req.user!.id);
    const methods = await prisma.paymentMethod.findMany({
      where: { customerId: customer.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    });

    res.json({ methods });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Payment methods unavailable." });
  }
});

customerPortalRouter.post("/payment-methods/setup-intent", async (req, res) => {
  if (!isStripeConfigured()) {
    res.status(503).json({ message: "Stripe is not configured. Add Stripe keys to enable saved payment methods." });
    return;
  }

  try {
    const customer = await requireCustomerContext(req.user!.id);
    const stripeCustomerId = await ensureStripeCustomer(customer.id);
    const stripe = getStripeClient();

    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      metadata: {
        customerId: customer.id,
        userId: customer.userId ?? ""
      }
    });

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Unable to create setup intent." });
  }
});

customerPortalRouter.post("/payment-methods/sync", async (req, res) => {
  if (!isStripeConfigured()) {
    res.status(503).json({ message: "Stripe is not configured." });
    return;
  }

  const parsed = syncPaymentMethodSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  try {
    const customer = await requireCustomerContext(req.user!.id);
    const method = await upsertStripePaymentMethod(customer.id, parsed.data.paymentMethodId);
    res.status(201).json({ method });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Unable to sync payment method." });
  }
});

customerPortalRouter.get("/notifications", async (req, res) => {
  try {
    const customer = await requireCustomerContext(req.user!.id);
    const notifications = await prisma.notification.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: "desc" },
      take: 50
    });
    const unreadCount = notifications.filter((notification) => !notification.isRead).length;
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Notifications unavailable." });
  }
});

customerPortalRouter.post("/notifications/read-all", async (req, res) => {
  try {
    const customer = await requireCustomerContext(req.user!.id);
    const result = await prisma.notification.updateMany({
      where: { customerId: customer.id, isRead: false },
      data: { isRead: true }
    });
    res.json({ updated: result.count });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Notifications unavailable." });
  }
});

customerPortalRouter.post("/notifications/:id/read", async (req, res) => {
  try {
    const customer = await requireCustomerContext(req.user!.id);
    const result = await prisma.notification.updateMany({
      where: { customerId: customer.id, id: req.params.id },
      data: { isRead: true }
    });

    if (result.count === 0) {
      res.status(404).json({ message: "Notification not found." });
      return;
    }

    res.json({ updated: result.count });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Notifications unavailable." });
  }
});
