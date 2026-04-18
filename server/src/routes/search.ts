import { Role } from "@prisma/client";
import { Router } from "express";
import { getCustomerByUserId } from "../lib/customerPortal";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const searchRouter = Router();

searchRouter.get("/", requireAuth, async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (!query) {
    res.json({
      installations: [],
      devices: [],
      serviceRequests: [],
      invoices: [],
      notifications: [],
      customers: [],
      employees: [],
      complaints: [],
      partners: [],
      inventory: []
    });
    return;
  }

  if (req.user?.role === Role.CUSTOMER) {
    const customer = await getCustomerByUserId(prisma, req.user.id);
    if (!customer) {
      res.status(404).json({ message: "Customer profile not found." });
      return;
    }

    const [installations, devices, serviceRequests, invoices, notifications] = await Promise.all([
      prisma.installation.findMany({
        where: {
          customerId: customer.id,
          OR: [
            { systemName: { contains: query, mode: "insensitive" } },
            { location: { contains: query, mode: "insensitive" } }
          ]
        }
      }),
      prisma.device.findMany({
        where: {
          customerId: customer.id,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { model: { contains: query, mode: "insensitive" } },
            { deviceCode: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 5
      }),
      prisma.serviceRequest.findMany({
        where: {
          customerId: customer.id,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { requestCode: { contains: query, mode: "insensitive" } },
            { issueType: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 5
      }),
      prisma.invoice.findMany({
        where: {
          customerId: customer.id,
          OR: [
            { invoiceCode: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 5
      }),
      prisma.notification.findMany({
        where: {
          customerId: customer.id,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { message: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 5
      })
    ]);

    res.json({
      installations,
      devices,
      serviceRequests,
      invoices,
      notifications,
      customers: [],
      employees: [],
      complaints: [],
      partners: [],
      inventory: []
    });
    return;
  }

  const [customers, employees, complaints, partners, inventory] = await Promise.all([
    prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { customerCode: { contains: query, mode: "insensitive" } }
        ]
      },
      take: 5
    }),
    prisma.employee.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { employeeCode: { contains: query, mode: "insensitive" } }
        ]
      },
      take: 5
    }),
    prisma.complaint.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { complaintCode: { contains: query, mode: "insensitive" } }
        ]
      },
      take: 5
    }),
    prisma.partner.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { partnerCode: { contains: query, mode: "insensitive" } }
        ]
      },
      take: 5
    }),
    prisma.inventoryItem.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { itemCode: { contains: query, mode: "insensitive" } }
        ]
      },
      take: 5
    })
  ]);

  res.json({
    installations: [],
    devices: [],
    serviceRequests: [],
    invoices: [],
    notifications: [],
    customers,
    employees,
    complaints,
    partners,
    inventory
  });
});
