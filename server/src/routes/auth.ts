import { Role } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { createCustomerCode, serializeUser } from "../lib/customerPortal";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

const secret: jwt.Secret = process.env.JWT_SECRET ?? "dev_jwt_secret";
const jwtExpires = (process.env.JWT_EXPIRES_IN ?? "1d") as jwt.SignOptions["expiresIn"];

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

function signToken(input: { id: string; role: Role; email: string }) {
  const options: jwt.SignOptions = {
    subject: input.id,
    expiresIn: jwtExpires
  };

  return jwt.sign({ role: input.role, email: input.email }, secret, options);
}

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) {
    res.status(409).json({ message: "Email already in use" });
    return;
  }

  const hash = await bcrypt.hash(parsed.data.password, 10);
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hash,
        phone: parsed.data.phone,
        role: Role.CUSTOMER
      }
    });

    await tx.customer.create({
      data: {
        userId: user.id,
        customerCode: createCustomerCode(),
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        language: "English (India)"
      }
    });

    return user;
  });

  const token = signToken({ id: result.id, role: result.role, email: result.email });
  res.status(201).json({
    token,
    user: serializeUser(result)
  });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.isActive) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.password, user.password);
  if (!valid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  res.json({
    token,
    user: serializeUser(user)
  });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, phone: true, avatarUrl: true, createdAt: true, updatedAt: true }
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ user: serializeUser(user) });
});

authRouter.post("/logout", requireAuth, async (_req, res) => {
  res.json({ success: true });
});
