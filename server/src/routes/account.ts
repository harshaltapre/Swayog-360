import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import {
  accountProfileInclude,
  createCustomerActivity,
  serializeAccountProfile
} from "../lib/customerPortal";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const accountRouter = Router();

const billingAddressSchema = z.object({
  line1: z.string().max(120),
  line2: z.string().max(120).optional().or(z.literal("")),
  city: z.string().max(80),
  state: z.string().max(80),
  postalCode: z.string().max(12),
  country: z.string().max(80)
});

const notificationPreferencesSchema = z.object({
  systemAlerts: z.boolean(),
  financialReports: z.boolean(),
  marketingUpdates: z.boolean(),
  maintenanceAlerts: z.boolean(),
  projectUpdates: z.boolean()
});

const phoneSchema = z
  .string()
  .trim()
  .min(7)
  .max(20)
  .regex(/^[+\d\s()-]+$/, "Phone number can contain only digits, spaces, and +()- symbols.");

const avatarSchema = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) {
      return true;
    }

    if (value.startsWith("data:image/")) {
      return true;
    }

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, "Avatar must be a valid URL or image data URI.");

const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: phoneSchema,
  avatarUrl: avatarSchema.optional().or(z.literal("")),
  language: z.string().trim().min(2).max(60),
  twoFactorEnabled: z.boolean(),
  notificationPreferences: notificationPreferencesSchema,
  billingAddress: billingAddressSchema.nullish()
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

accountRouter.use(requireAuth);

accountRouter.get("/profile", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: accountProfileInclude
  });

  if (!user) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  res.json({ profile: serializeAccountProfile(user) });
});

accountRouter.patch("/profile", async (req, res) => {
  const parsed = profileUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: accountProfileInclude
  });

  if (!existing) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  const payload = parsed.data;
  const normalizedPhone = payload.phone.trim();
  const normalizedAvatar = payload.avatarUrl?.trim() || null;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: existing.id },
        data: {
          name: payload.name,
          email: payload.email,
          phone: normalizedPhone,
          avatarUrl: normalizedAvatar,
          language: payload.language,
          notificationSystemAlerts: payload.notificationPreferences.systemAlerts,
          notificationFinancialReports: payload.notificationPreferences.financialReports,
          notificationMarketingUpdates: payload.notificationPreferences.marketingUpdates,
          notificationMaintenanceAlerts: payload.notificationPreferences.maintenanceAlerts,
          notificationProjectUpdates: payload.notificationPreferences.projectUpdates,
          twoFactorEnabled: payload.twoFactorEnabled
        }
      });

      if (existing.customerProfile) {
        await tx.customer.update({
          where: { id: existing.customerProfile.id },
          data: {
            name: payload.name,
            email: payload.email,
            phone: normalizedPhone,
            avatarUrl: normalizedAvatar,
            language: payload.language,
            notificationSystemAlerts: payload.notificationPreferences.systemAlerts,
            notificationFinancialReports: payload.notificationPreferences.financialReports,
            notificationMarketingUpdates: payload.notificationPreferences.marketingUpdates,
            notificationMaintenanceAlerts: payload.notificationPreferences.maintenanceAlerts,
            notificationProjectUpdates: payload.notificationPreferences.projectUpdates,
            twoFactorEnabled: payload.twoFactorEnabled,
            ...(payload.billingAddress
              ? {
                  billingAddressLine1: payload.billingAddress.line1 || null,
                  billingAddressLine2: payload.billingAddress.line2 || null,
                  billingCity: payload.billingAddress.city || null,
                  billingState: payload.billingAddress.state || null,
                  billingPostalCode: payload.billingAddress.postalCode || null,
                  billingCountry: payload.billingAddress.country || null
                }
              : {})
          }
        });
      }

      return tx.user.findUniqueOrThrow({
        where: { id: existing.id },
        include: accountProfileInclude
      });
    });

    if (updated.customerProfile) {
      await createCustomerActivity(prisma, {
        customerId: updated.customerProfile.id,
        type: "profile",
        title: "Account settings updated",
        description: "Your account preferences were saved successfully.",
        link: "/customer/settings"
      });
    }

    res.json({ profile: serializeAccountProfile(updated) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(409).json({ message: "Email already in use." });
      return;
    }

    res.status(400).json({ message: error instanceof Error ? error.message : "Unable to update profile." });
  }
});

accountRouter.post("/password", async (req, res) => {
  const parsed = passwordUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: accountProfileInclude
  });

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

  if (user.customerProfile) {
    await createCustomerActivity(prisma, {
      customerId: user.customerProfile.id,
      type: "security",
      title: "Password updated",
      description: "Your account password was updated successfully.",
      link: "/customer/settings"
    });
  }

  res.json({ success: true });
});
