ALTER TABLE "User"
ADD COLUMN "language" TEXT NOT NULL DEFAULT 'English (India)',
ADD COLUMN "notificationSystemAlerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notificationFinancialReports" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notificationMarketingUpdates" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "notificationMaintenanceAlerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notificationProjectUpdates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

UPDATE "User"
SET
  "language" = COALESCE("Customer"."language", "User"."language"),
  "notificationSystemAlerts" = COALESCE("Customer"."notificationSystemAlerts", "User"."notificationSystemAlerts"),
  "notificationFinancialReports" = COALESCE("Customer"."notificationFinancialReports", "User"."notificationFinancialReports"),
  "notificationMarketingUpdates" = COALESCE("Customer"."notificationMarketingUpdates", "User"."notificationMarketingUpdates"),
  "notificationMaintenanceAlerts" = COALESCE("Customer"."notificationMaintenanceAlerts", "User"."notificationMaintenanceAlerts"),
  "notificationProjectUpdates" = COALESCE("Customer"."notificationProjectUpdates", "User"."notificationProjectUpdates"),
  "twoFactorEnabled" = COALESCE("Customer"."twoFactorEnabled", "User"."twoFactorEnabled")
FROM "Customer"
WHERE "Customer"."userId" = "User"."id";
