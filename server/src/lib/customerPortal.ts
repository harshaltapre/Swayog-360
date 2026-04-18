import { PaymentTransactionStatus, Prisma, PrismaClient, Role, ServiceRequestStatus } from "@prisma/client";

export const customerProfileInclude = {
  user: true
} satisfies Prisma.CustomerInclude;

export type CustomerProfile = Prisma.CustomerGetPayload<{
  include: typeof customerProfileInclude;
}>;

export const accountProfileInclude = {
  customerProfile: true
} satisfies Prisma.UserInclude;

export type AccountProfileUser = Prisma.UserGetPayload<{
  include: typeof accountProfileInclude;
}>;

export async function getCustomerByUserId(prisma: PrismaClient, userId: string) {
  return prisma.customer.findUnique({
    where: { userId },
    include: customerProfileInclude
  });
}

export function createCustomerCode() {
  return `CUST-${Date.now().toString().slice(-6)}`;
}

export function createServiceRequestCode() {
  return `SR-${Date.now().toString().slice(-6)}`;
}

export function createAppointmentCode() {
  return `APT-${Date.now().toString().slice(-6)}`;
}

export function prismaRoleToAppRole(role: Role) {
  return role.toLowerCase();
}

export async function createCustomerNotification(
  prisma: PrismaClient,
  input: {
    customerId: string;
    userId?: string | null;
    type: string;
    category?: string;
    title: string;
    message: string;
    link?: string;
  }
) {
  return prisma.notification.create({
    data: {
      customerId: input.customerId,
      userId: input.userId ?? undefined,
      type: input.type,
      category: input.category,
      title: input.title,
      message: input.message,
      link: input.link
    }
  });
}

export async function createCustomerActivity(
  prisma: PrismaClient,
  input: {
    customerId: string;
    type: string;
    title: string;
    description: string;
    link?: string;
    occurredAt?: Date;
  }
) {
  return prisma.activityEvent.create({
    data: {
      customerId: input.customerId,
      type: input.type,
      title: input.title,
      description: input.description,
      link: input.link,
      occurredAt: input.occurredAt
    }
  });
}

export function serializeProfile(customer: CustomerProfile) {
  return {
    id: customer.id,
    customerCode: customer.customerCode,
    userId: customer.userId,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    zone: customer.zone,
    avatarUrl: customer.avatarUrl ?? customer.user?.avatarUrl ?? null,
    language: customer.language,
    billingAddress: {
      line1: customer.billingAddressLine1,
      line2: customer.billingAddressLine2,
      city: customer.billingCity,
      state: customer.billingState,
      postalCode: customer.billingPostalCode,
      country: customer.billingCountry
    },
    notificationPreferences: {
      systemAlerts: customer.notificationSystemAlerts,
      financialReports: customer.notificationFinancialReports,
      marketingUpdates: customer.notificationMarketingUpdates,
      maintenanceAlerts: customer.notificationMaintenanceAlerts,
      projectUpdates: customer.notificationProjectUpdates
    },
    twoFactorEnabled: customer.twoFactorEnabled,
    stripeCustomerId: customer.stripeCustomerId,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
    user: customer.user
      ? {
          id: customer.user.id,
          email: customer.user.email,
          name: customer.user.name,
          role: prismaRoleToAppRole(customer.user.role),
          phone: customer.user.phone,
          avatarUrl: customer.user.avatarUrl,
          createdAt: customer.user.createdAt
        }
      : null
  };
}

export function serializeAccountProfile(user: AccountProfileUser) {
  const customer = user.customerProfile;

  return {
    id: user.id,
    role: prismaRoleToAppRole(user.role),
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    avatarUrl: user.avatarUrl ?? null,
    language: user.language,
    notificationPreferences: {
      systemAlerts: user.notificationSystemAlerts,
      financialReports: user.notificationFinancialReports,
      marketingUpdates: user.notificationMarketingUpdates,
      maintenanceAlerts: user.notificationMaintenanceAlerts,
      projectUpdates: user.notificationProjectUpdates
    },
    twoFactorEnabled: user.twoFactorEnabled,
    customerId: customer?.id ?? null,
    customerCode: customer?.customerCode ?? null,
    billingAddress: customer
      ? {
          line1: customer.billingAddressLine1 ?? "",
          line2: customer.billingAddressLine2 ?? "",
          city: customer.billingCity ?? "",
          state: customer.billingState ?? "",
          postalCode: customer.billingPostalCode ?? "",
          country: customer.billingCountry ?? ""
        }
      : null,
    stripeCustomerId: customer?.stripeCustomerId ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export function serializeUser(user: {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: prismaRoleToAppRole(user.role),
    phone: user.phone ?? null,
    avatarUrl: user.avatarUrl ?? null,
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null
  };
}

export function isOpenServiceRequestStatus(status: ServiceRequestStatus) {
  return status === ServiceRequestStatus.OPEN || status === ServiceRequestStatus.IN_PROGRESS;
}

export function isPaidTransactionStatus(status: PaymentTransactionStatus) {
  return status === PaymentTransactionStatus.SUCCEEDED;
}
