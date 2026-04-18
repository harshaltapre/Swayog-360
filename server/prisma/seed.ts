import dotenv from "dotenv";
import { PrismaClient, Role, InvoiceStatus, Priority, ServiceRequestStatus, AppointmentStatus, PaymentTransactionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

dotenv.config({ override: true });

const prisma = new PrismaClient();

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  const superAdminEmail = "harshaltapre27@gamil.com";

  const passwordHashes = await Promise.all([
    bcrypt.hash("harshal", 10),
    bcrypt.hash("admin123", 10),
    bcrypt.hash("partner123", 10),
    bcrypt.hash("emp123", 10),
    bcrypt.hash("customer123", 10)
  ]);

  const [superAdminPassword, adminPassword, partnerPassword, employeePassword, customerPassword] = passwordHashes;

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      name: "Harshal Tapre",
      role: Role.SUPER_ADMIN,
      password: superAdminPassword,
      phone: "9876543210"
    },
    create: {
      email: superAdminEmail,
      name: "Harshal Tapre",
      role: Role.SUPER_ADMIN,
      password: superAdminPassword,
      phone: "9876543210"
    }
  });

  await prisma.user.upsert({
    where: { email: "amit.verma@swayog.energy" },
    update: {
      name: "Amit Verma",
      role: Role.ADMIN,
      password: adminPassword,
      phone: "8765432109"
    },
    create: {
      email: "amit.verma@swayog.energy",
      name: "Amit Verma",
      role: Role.ADMIN,
      password: adminPassword,
      phone: "8765432109"
    }
  });

  await prisma.user.upsert({
    where: { email: "rajesh@energysolutions.com" },
    update: {
      name: "Rajesh Patel",
      role: Role.PARTNER,
      password: partnerPassword,
      phone: "7654321098"
    },
    create: {
      email: "rajesh@energysolutions.com",
      name: "Rajesh Patel",
      role: Role.PARTNER,
      password: partnerPassword,
      phone: "7654321098"
    }
  });

  await prisma.user.upsert({
    where: { email: "ravi.kumar@swayog.energy" },
    update: {
      name: "Ravi Kumar",
      role: Role.EMPLOYEE,
      password: employeePassword,
      phone: "6543210987"
    },
    create: {
      email: "ravi.kumar@swayog.energy",
      name: "Ravi Kumar",
      role: Role.EMPLOYEE,
      password: employeePassword,
      phone: "6543210987"
    }
  });

  const customerUser = await prisma.user.upsert({
    where: { email: "vikram@example.com" },
    update: {
      name: "Vikram Singh",
      role: Role.CUSTOMER,
      password: customerPassword,
      phone: "5432109876",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
      language: "English (India)",
      notificationSystemAlerts: true,
      notificationFinancialReports: true,
      notificationMarketingUpdates: false,
      notificationMaintenanceAlerts: true,
      notificationProjectUpdates: true,
      twoFactorEnabled: false
    },
    create: {
      email: "vikram@example.com",
      name: "Vikram Singh",
      role: Role.CUSTOMER,
      password: customerPassword,
      phone: "5432109876",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
      language: "English (India)",
      notificationSystemAlerts: true,
      notificationFinancialReports: true,
      notificationMarketingUpdates: false,
      notificationMaintenanceAlerts: true,
      notificationProjectUpdates: true,
      twoFactorEnabled: false
    }
  });

  const customer = await prisma.customer.upsert({
    where: { customerCode: "CUST-0001" },
    update: {
      userId: customerUser.id,
      name: "Vikram Singh",
      email: "vikram@example.com",
      phone: "5432109876",
      zone: "Nagpur",
      language: "English (India)",
      avatarUrl: customerUser.avatarUrl,
      billingAddressLine1: "123 Solar Lane",
      billingCity: "Nagpur",
      billingState: "Maharashtra",
      billingPostalCode: "440010",
      billingCountry: "India",
      stripeCustomerId: "cus_demo_customer_portal",
      createdById: superAdmin.id
    },
    create: {
      customerCode: "CUST-0001",
      userId: customerUser.id,
      name: "Vikram Singh",
      email: "vikram@example.com",
      phone: "5432109876",
      zone: "Nagpur",
      language: "English (India)",
      avatarUrl: customerUser.avatarUrl,
      billingAddressLine1: "123 Solar Lane",
      billingCity: "Nagpur",
      billingState: "Maharashtra",
      billingPostalCode: "440010",
      billingCountry: "India",
      stripeCustomerId: "cus_demo_customer_portal",
      createdById: superAdmin.id
    }
  });

  const installation = await prisma.installation.upsert({
    where: { customerId: customer.id },
    update: {
      systemName: "8.5 kW Residential Solar Array",
      systemSizeKw: "8.50",
      location: "Nagpur, Dharampeth",
      installedAt: daysAgo(460),
      avgDailyGenerationKwh: "18.20",
      monthlyProductionKwh: "309.40",
      totalSavingsAmount: "120000.00",
      totalEnergySavedMwh: "12.80",
      panelCount: 22,
      panelModel: "SunPower SPR-A430",
      inverterModel: "SolarEdge SE6000H",
      batteryModel: "Tesla Powerwall 2"
    },
    create: {
      customerId: customer.id,
      systemName: "8.5 kW Residential Solar Array",
      systemSizeKw: "8.50",
      location: "Nagpur, Dharampeth",
      installedAt: daysAgo(460),
      avgDailyGenerationKwh: "18.20",
      monthlyProductionKwh: "309.40",
      totalSavingsAmount: "120000.00",
      totalEnergySavedMwh: "12.80",
      panelCount: 22,
      panelModel: "SunPower SPR-A430",
      inverterModel: "SolarEdge SE6000H",
      batteryModel: "Tesla Powerwall 2"
    }
  });

  await prisma.installationMilestone.deleteMany({ where: { installationId: installation.id } });
  await prisma.installationMetric.deleteMany({ where: { installationId: installation.id } });
  await prisma.device.deleteMany({ where: { customerId: customer.id } });
  await prisma.serviceAppointment.deleteMany({ where: { customerId: customer.id } });
  await prisma.serviceRequest.deleteMany({ where: { customerId: customer.id } });
  await prisma.invoiceLineItem.deleteMany({ where: { invoice: { customerId: customer.id } } });
  await prisma.paymentTransaction.deleteMany({ where: { customerId: customer.id } });
  await prisma.invoice.deleteMany({ where: { customerId: customer.id } });
  await prisma.paymentMethod.deleteMany({ where: { customerId: customer.id } });
  await prisma.notification.deleteMany({ where: { customerId: customer.id } });
  await prisma.customerFeedback.deleteMany({ where: { customerId: customer.id } });
  await prisma.activityEvent.deleteMany({ where: { customerId: customer.id } });

  await prisma.installationMilestone.createMany({
    data: [
      {
        installationId: installation.id,
        title: "Site Survey Completed",
        description: "Structural and irradiation survey cleared for installation.",
        milestoneType: "SURVEY",
        status: "COMPLETED",
        occurredAt: daysAgo(500)
      },
      {
        installationId: installation.id,
        title: "Panels Installed",
        description: "Panel array mounted and connected to inverter line.",
        milestoneType: "INSTALLATION",
        status: "COMPLETED",
        occurredAt: daysAgo(472)
      },
      {
        installationId: installation.id,
        title: "System Activated",
        description: "Monitoring linked and customer training completed.",
        milestoneType: "ACTIVATION",
        status: "COMPLETED",
        occurredAt: daysAgo(460)
      }
    ]
  });

  const metricRows = Array.from({ length: 30 }, (_, index) => ({
    installationId: installation.id,
    metricDate: daysAgo(29 - index),
    generationKwh: (16 + (index % 7) * 0.8).toFixed(2),
    savingsAmount: (120 + (index % 7) * 8).toFixed(2),
    heatmapScore: 55 + ((index * 7) % 40)
  }));

  await prisma.installationMetric.createMany({ data: metricRows });

  await prisma.device.createMany({
    data: [
      {
        customerId: customer.id,
        installationId: installation.id,
        deviceCode: "DEV-001",
        name: "Rooftop Solar Panel Array",
        type: "Solar Panels",
        status: "ACTIVE",
        model: "SunPower SPR-A430",
        capacity: "8.5 kW",
        installDate: daysAgo(460),
        lastMaintenance: daysAgo(70),
        nextMaintenance: daysAgo(-110),
        performance: "98.50"
      },
      {
        customerId: customer.id,
        installationId: installation.id,
        deviceCode: "DEV-002",
        name: "Main Inverter",
        type: "Inverter",
        status: "ACTIVE",
        model: "SolarEdge SE6000H",
        capacity: "6 kW",
        installDate: daysAgo(460),
        lastMaintenance: daysAgo(85),
        nextMaintenance: daysAgo(-95),
        performance: "99.20"
      },
      {
        customerId: customer.id,
        installationId: installation.id,
        deviceCode: "DEV-003",
        name: "Battery Storage Unit",
        type: "Battery",
        status: "ACTIVE",
        model: "Tesla Powerwall 2",
        capacity: "13.5 kWh",
        installDate: daysAgo(420),
        nextMaintenance: daysAgo(-210),
        performance: "97.80"
      }
    ]
  });

  const serviceRequestOpen = await prisma.serviceRequest.create({
    data: {
      customerId: customer.id,
      requestCode: "SR-002",
      customerName: customer.name,
      title: "Inverter making unusual noise",
      description: "Intermittent humming started after the last firmware refresh.",
      issueType: "Technical Support",
      priority: Priority.HIGH,
      status: ServiceRequestStatus.IN_PROGRESS,
      createdAt: daysAgo(3)
    }
  });

  await prisma.serviceRequest.createMany({
    data: [
      {
        customerId: customer.id,
        requestCode: "SR-001",
        customerName: customer.name,
        title: "Panel cleaning service required",
        description: "Dust accumulation has reduced generation output.",
        issueType: "Maintenance",
        priority: Priority.LOW,
        status: ServiceRequestStatus.RESOLVED,
        createdAt: daysAgo(18),
        resolvedAt: daysAgo(13)
      },
      {
        customerId: customer.id,
        requestCode: "SR-003",
        customerName: customer.name,
        title: "Performance monitoring app not updating",
        description: "Yesterday's generation graph is missing in the app.",
        issueType: "System Performance",
        priority: Priority.MEDIUM,
        status: ServiceRequestStatus.OPEN,
        createdAt: daysAgo(1)
      }
    ]
  });

  await prisma.serviceAppointment.createMany({
    data: [
      {
        customerId: customer.id,
        serviceRequestId: serviceRequestOpen.id,
        appointmentCode: "APT-001",
        title: "Inverter inspection visit",
        description: "Technician visit for on-site inverter diagnostics.",
        scheduledFor: daysAgo(-3),
        status: AppointmentStatus.CONFIRMED,
        location: "Nagpur, Dharampeth"
      }
    ]
  });

  const paidInvoice = await prisma.invoice.create({
    data: {
      customerId: customer.id,
      invoiceCode: "INV-2026-001",
      customerName: customer.name,
      amount: "5400.00",
      status: InvoiceStatus.PAID,
      dueDate: daysAgo(25),
      description: "Monthly solar monitoring subscription - March 2026",
      paidAt: daysAgo(22)
    }
  });

  const pendingInvoice = await prisma.invoice.create({
    data: {
      customerId: customer.id,
      invoiceCode: "INV-2026-002",
      customerName: customer.name,
      amount: "5400.00",
      status: InvoiceStatus.PENDING,
      dueDate: daysAgo(-7),
      description: "Monthly solar monitoring subscription - April 2026"
    }
  });

  await prisma.invoiceLineItem.createMany({
    data: [
      { invoiceId: paidInvoice.id, label: "Solar System Monitoring", amount: "2500.00" },
      { invoiceId: paidInvoice.id, label: "Performance Analytics", amount: "1900.00" },
      { invoiceId: paidInvoice.id, label: "Customer Support", amount: "1000.00" },
      { invoiceId: pendingInvoice.id, label: "Solar System Monitoring", amount: "2500.00" },
      { invoiceId: pendingInvoice.id, label: "Performance Analytics", amount: "1900.00" },
      { invoiceId: pendingInvoice.id, label: "Customer Support", amount: "1000.00" }
    ]
  });

  const paymentMethod = await prisma.paymentMethod.create({
    data: {
      customerId: customer.id,
      stripePaymentMethodId: "pm_card_visa",
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2030,
      isDefault: true
    }
  });

  await prisma.paymentTransaction.create({
    data: {
      customerId: customer.id,
      invoiceId: paidInvoice.id,
      paymentMethodId: paymentMethod.id,
      status: PaymentTransactionStatus.SUCCEEDED,
      amount: "5400.00",
      stripePaymentIntentId: "pi_demo_paid_invoice",
      stripeCheckoutSessionId: "cs_demo_paid_invoice",
      paidAt: daysAgo(22)
    }
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: customerUser.id,
        customerId: customer.id,
        type: "payment",
        category: "financial",
        title: "Pending invoice due soon",
        message: "Invoice INV-2026-002 is due in 7 days.",
        link: "/customer/payments",
        isRead: false,
        createdAt: daysAgo(1)
      },
      {
        userId: customerUser.id,
        customerId: customer.id,
        type: "service",
        category: "maintenance",
        title: "Technician visit confirmed",
        message: "Your inverter inspection appointment is confirmed for this week.",
        link: "/customer/service/schedule",
        isRead: false,
        createdAt: daysAgo(2)
      },
      {
        userId: customerUser.id,
        customerId: customer.id,
        type: "update",
        category: "update",
        title: "Firmware update completed",
        message: "Generation performance optimizations were applied successfully.",
        link: "/customer/installation/history",
        isRead: true,
        createdAt: daysAgo(9)
      }
    ]
  });

  await prisma.activityEvent.createMany({
    data: [
      {
        customerId: customer.id,
        type: "invoice",
        title: "Invoice INV-2026-002 generated",
        description: "₹5,400 pending for April monitoring subscription.",
        link: "/customer/payments",
        occurredAt: daysAgo(1)
      },
      {
        customerId: customer.id,
        type: "service",
        title: "Service request SR-002 updated",
        description: "Status changed to In Progress.",
        link: "/customer/service",
        occurredAt: daysAgo(3)
      },
      {
        customerId: customer.id,
        type: "payment",
        title: "Payment received for INV-2026-001",
        description: "₹5,400 received successfully.",
        link: "/customer/payments",
        occurredAt: daysAgo(22)
      }
    ]
  });

  await prisma.customerFeedback.create({
    data: {
      customerId: customer.id,
      category: "Support",
      subject: "Helpful maintenance reminders",
      message: "The reminder notifications have been very useful.",
      rating: 5
    }
  });

  console.log("Seeded demo users and customer portal data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
