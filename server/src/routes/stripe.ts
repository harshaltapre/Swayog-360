import { InvoiceStatus, PaymentTransactionStatus } from "@prisma/client";
import { Router } from "express";
import { createCustomerActivity, createCustomerNotification } from "../lib/customerPortal";
import { prisma } from "../lib/prisma";
import { getStripeClient, isStripeConfigured } from "../lib/stripe";

export const stripeWebhookRouter = Router();

type StripeSetupIntentPayload = {
  metadata?: Record<string, string>;
  payment_method?: string | { id: string } | null;
};

type StripeCheckoutSessionPayload = {
  id: string;
  metadata?: Record<string, string>;
  amount_total?: number | null;
  payment_intent?: string | { id: string } | null;
};

async function syncSetupIntentPaymentMethod(setupIntent: StripeSetupIntentPayload) {
  const customerId = setupIntent.metadata?.customerId;
  const paymentMethodId =
    typeof setupIntent.payment_method === "string" ? setupIntent.payment_method : setupIntent.payment_method?.id;

  if (!customerId || !paymentMethodId) {
    return;
  }

  const stripe = getStripeClient();
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (paymentMethod.type !== "card") {
    return;
  }

  const existingCount = await prisma.paymentMethod.count({ where: { customerId } });

  await prisma.paymentMethod.upsert({
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
}

async function handleCheckoutSessionCompleted(session: StripeCheckoutSessionPayload) {
  const invoiceId = session.metadata?.invoiceId;
  const customerId = session.metadata?.customerId;
  const userId = session.metadata?.userId;

  if (!invoiceId || !customerId) {
    return;
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { customer: true }
  });

  if (!invoice) {
    return;
  }

  const existingTransaction = await prisma.paymentTransaction.findFirst({
    where: { stripeCheckoutSessionId: session.id }
  });

  if (!existingTransaction) {
    await prisma.paymentTransaction.create({
      data: {
        customerId,
        invoiceId,
        status: PaymentTransactionStatus.SUCCEEDED,
        amount: ((session.amount_total ?? 0) / 100).toFixed(2),
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
        paidAt: new Date()
      }
    });
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: InvoiceStatus.PAID,
      paidAt: new Date(),
      stripeCheckoutSessionId: session.id
    }
  });

  await Promise.all([
    createCustomerNotification(prisma, {
      customerId,
      userId,
      type: "payment",
      category: "financial",
      title: "Payment received",
      message: `Payment for ${invoice.invoiceCode} was received successfully.`,
      link: "/customer/payments"
    }),
    createCustomerActivity(prisma, {
      customerId,
      type: "payment",
      title: `Payment received for ${invoice.invoiceCode}`,
      description: `₹${invoice.amount.toString()} received via Stripe Checkout.`,
      link: "/customer/payments"
    })
  ]);
}

stripeWebhookRouter.post("/webhook", async (req, res) => {
  if (!isStripeConfigured()) {
    res.status(503).json({ message: "Stripe is not configured." });
    return;
  }

  const signature = req.headers["stripe-signature"];
  if (!signature || Array.isArray(signature)) {
    res.status(400).json({ message: "Missing Stripe signature." });
    return;
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    res.status(503).json({ message: "Stripe webhook secret is not configured." });
    return;
  }

  try {
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as StripeCheckoutSessionPayload);
        break;
      case "setup_intent.succeeded":
        await syncSetupIntentPaymentMethod(event.data.object as StripeSetupIntentPayload);
        break;
      default:
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Webhook handling failed." });
  }
});
