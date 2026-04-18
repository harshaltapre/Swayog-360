import { Role } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";

export const customerRouter = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.enum(["name", "createdAt", "zone"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
  zone: z.string().optional()
});

const createCustomerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  zone: z.string().min(2).max(60).optional()
});

customerRouter.get(
  "/",
  requireAuth,
  requireRole([Role.ADMIN, Role.SUPER_ADMIN]),
  async (req, res) => {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid query", errors: parsed.error.flatten() });
      return;
    }

    const { page, limit, sort, order, search, zone } = parsed.data;
    const where = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
                { customerCode: { contains: search, mode: "insensitive" as const } }
              ]
            }
          : {},
        zone ? { zone: { equals: zone, mode: "insensitive" as const } } : {}
      ]
    };

    const [total, data] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
        select: {
          id: true,
          customerCode: true,
          name: true,
          email: true,
          phone: true,
          zone: true,
          createdAt: true
        }
      })
    ]);

    res.json({
      data,
      pagination: {
        total,
        page,
        pageSize: limit,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    });
  }
);

customerRouter.post(
  "/",
  requireAuth,
  requireRole([Role.ADMIN, Role.SUPER_ADMIN]),
  async (req, res) => {
    const parsed = createCustomerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
      return;
    }

    const now = Date.now().toString().slice(-6);
    const created = await prisma.customer.create({
      data: {
        ...parsed.data,
        customerCode: `CUST-${now}`,
        createdById: req.user?.id
      }
    });

    res.status(201).json(created);
  }
);
