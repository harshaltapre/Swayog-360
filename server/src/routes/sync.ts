import { Router } from "express";
import { prisma } from "../lib/prisma";

export const syncRouter = Router();

syncRouter.get("/status", async (_req, res) => {
  try {
    const [users, customers, employees, partners, projects, complaints, tasks, invoices, inventoryItems, serviceRequests, notifications, auditLogs, attendanceLogs, installations, installationMilestones, installationMetrics, devices, serviceAppointments, invoiceLineItems, paymentMethods, paymentTransactions, customerFeedback, activityEvents] = await Promise.all([
      prisma.user.count(),
      prisma.customer.count(),
      prisma.employee.count(),
      prisma.partner.count(),
      prisma.project.count(),
      prisma.complaint.count(),
      prisma.task.count(),
      prisma.invoice.count(),
      prisma.inventoryItem.count(),
      prisma.serviceRequest.count(),
      prisma.notification.count(),
      prisma.auditLog.count(),
      prisma.attendanceLog.count(),
      prisma.installation.count(),
      prisma.installationMilestone.count(),
      prisma.installationMetric.count(),
      prisma.device.count(),
      prisma.serviceAppointment.count(),
      prisma.invoiceLineItem.count(),
      prisma.paymentMethod.count(),
      prisma.paymentTransaction.count(),
      prisma.customerFeedback.count(),
      prisma.activityEvent.count()
    ]);

    res.json({
      backend: "online",
      database: "connected",
      schema: "dashboard-swayog-sync-v1",
      counts: {
        users,
        customers,
        employees,
        partners,
        projects,
        complaints,
        tasks,
        invoices,
        inventoryItems,
        serviceRequests,
        notifications,
        auditLogs,
        attendanceLogs,
        installations,
        installationMilestones,
        installationMetrics,
        devices,
        serviceAppointments,
        invoiceLineItems,
        paymentMethods,
        paymentTransactions,
        customerFeedback,
        activityEvents
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database unavailable";
    res.status(503).json({
      backend: "online",
      database: "disconnected",
      schema: "dashboard-swayog-sync-v1",
      counts: {
        users: 0,
        customers: 0,
        employees: 0,
        partners: 0,
        projects: 0,
        complaints: 0,
        tasks: 0,
        invoices: 0,
        inventoryItems: 0,
        serviceRequests: 0,
        notifications: 0,
        auditLogs: 0,
        attendanceLogs: 0,
        installations: 0,
        installationMilestones: 0,
        installationMetrics: 0,
        devices: 0,
        serviceAppointments: 0,
        invoiceLineItems: 0,
        paymentMethods: 0,
        paymentTransactions: 0,
        customerFeedback: 0,
        activityEvents: 0
      },
      message
    });
  }
});
