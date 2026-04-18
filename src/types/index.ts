export type Role = 'super_admin' | 'admin' | 'partner' | 'employee' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  department?: string;
  customerId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface NavItem {
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface KPIData {
  label: string;
  value: string | number;
  icon: string;
  trend?: { direction: 'up' | 'down' | 'neutral'; value: string };
  accent?: boolean;
  variant?: 'success' | 'warning' | 'error' | 'default';
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  time: string;
  read: boolean;
  link?: string;
}

export interface BillingAddress {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface NotificationPreferences {
  systemAlerts: boolean;
  financialReports: boolean;
  marketingUpdates: boolean;
  maintenanceAlerts: boolean;
  projectUpdates: boolean;
}

export interface CustomerProfile {
  id: string;
  customerCode: string;
  userId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  zone: string | null;
  avatarUrl: string | null;
  language: string;
  billingAddress: BillingAddress;
  notificationPreferences: NotificationPreferences;
  twoFactorEnabled: boolean;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
  user: User | null;
}

export interface AccountProfile {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  language: string;
  notificationPreferences: NotificationPreferences;
  twoFactorEnabled: boolean;
  customerId: string | null;
  customerCode: string | null;
  billingAddress: BillingAddress | null;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardKpis {
  systemStatus: string;
  openServiceRequestCount: number;
  nextPaymentDue: CustomerInvoice | null;
  totalEnergySavedMwh: string;
  totalPaid: number;
  totalOutstanding: number;
}

export interface CustomerDashboardResponse {
  customer: {
    name: string;
    email: string | null;
    zone: string | null;
  };
  installation: CustomerInstallation | null;
  kpis: DashboardKpis;
  pendingInvoices: CustomerInvoice[];
  openServiceRequests: CustomerServiceRequest[];
  recentActivity: ActivityEvent[];
  recentMetrics: InstallationMetric[];
  unreadNotifications: number;
  upcomingAppointments: ServiceAppointment[];
}

export interface CustomerInstallation {
  id: string;
  customerId: string;
  systemName: string;
  systemSizeKw: string;
  location: string;
  status: string;
  installedAt: string | null;
  avgDailyGenerationKwh: string;
  monthlyProductionKwh: string;
  totalSavingsAmount: string;
  totalEnergySavedMwh: string;
  warrantyYears: number;
  panelCount: number;
  panelModel: string | null;
  inverterModel: string | null;
  batteryModel: string | null;
  milestones?: InstallationMilestone[];
  metrics?: InstallationMetric[];
  devices?: CustomerDevice[];
}

export interface InstallationMilestone {
  id: string;
  title: string;
  description: string | null;
  milestoneType: string;
  status: string;
  occurredAt: string;
}

export interface InstallationMetric {
  id: string;
  metricDate: string;
  generationKwh: string;
  savingsAmount: string;
  heatmapScore: number;
}

export interface CustomerDevice {
  id: string;
  deviceCode: string;
  name: string;
  type: string;
  status: string;
  model: string | null;
  capacity: string | null;
  installDate: string | null;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
  performance: string | null;
}

export interface CustomerServiceRequest {
  id: string;
  requestCode: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string | null;
  issueType: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
  attachmentName: string | null;
  attachmentUrl: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  appointments?: ServiceAppointment[];
}

export interface ServiceAppointment {
  id: string;
  appointmentCode: string;
  customerId: string;
  serviceRequestId: string | null;
  title: string;
  description: string | null;
  scheduledFor: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  location: string | null;
  notes: string | null;
  serviceRequest?: CustomerServiceRequest | null;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  label: string;
  description: string | null;
  amount: string;
}

export interface PaymentTransaction {
  id: string;
  customerId: string;
  invoiceId: string;
  paymentMethodId: string | null;
  provider: 'STRIPE';
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
  amount: string;
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface PaymentMethodSummary {
  id: string;
  customerId: string;
  provider: 'STRIPE';
  stripePaymentMethodId: string;
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
  isDefault: boolean;
  createdAt: string;
}

export interface CustomerInvoice {
  id: string;
  invoiceCode: string;
  customerId: string;
  customerName: string;
  amount: string;
  status: 'DRAFT' | 'SENT' | 'PENDING' | 'PAID' | 'OVERDUE';
  dueDate: string | null;
  description: string | null;
  paidAt: string | null;
  stripeCheckoutSessionId: string | null;
  createdAt: string;
  updatedAt: string;
  lineItems?: InvoiceLineItem[];
  paymentTransactions?: PaymentTransaction[];
}

export interface CustomerFeedbackEntry {
  id: string;
  customerId: string;
  category: string;
  subject: string;
  message: string;
  rating: number | null;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  customerId: string;
  type: string;
  title: string;
  description: string;
  link: string | null;
  occurredAt: string;
}

export interface CustomerNotification {
  id: string;
  userId: string | null;
  customerId: string | null;
  type: string;
  category: string | null;
  title: string | null;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  path: string;
  icon: string;
  status?: string | null;
}

export interface SearchResponse {
  installations: CustomerInstallation[];
  devices: CustomerDevice[];
  serviceRequests: CustomerServiceRequest[];
  invoices: CustomerInvoice[];
  notifications: CustomerNotification[];
  customers: Customer[];
  employees: Employee[];
  complaints: Complaint[];
  partners: Partner[];
  inventory: InventoryItem[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  zone: string;
  status: 'active' | 'inactive' | 'pending';
  installationDate?: string;
  systemSize?: string;
  amcStatus?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  zone: string;
  status: 'active' | 'on-leave' | 'inactive';
  tasksCompleted: number;
  attendance: number;
}

export interface Partner {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  zone: string;
  commission: number;
  activeProjects: number;
  totalEarnings: number;
  status: 'active' | 'inactive';
}

export interface Complaint {
  id: string;
  title: string;
  customer: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'escalated' | 'resolved' | 'closed';
  createdAt: string;
  assignedTo?: string;
  slaDeadline?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo: string;
  location?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minThreshold: number;
  unit: string;
  lastUpdated: string;
  status: 'adequate' | 'low' | 'critical';
}
