import { useAuthStore } from '../store';
import type {
  AccountProfile,
  CustomerDashboardResponse,
  CustomerDevice,
  CustomerFeedbackEntry,
  CustomerInstallation,
  CustomerInvoice,
  CustomerNotification,
  CustomerProfile,
  CustomerServiceRequest,
  PaymentMethodSummary,
  Role,
  SearchResponse,
  ServiceAppointment,
  User,
} from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupData extends LoginCredentials {
  fullName: string;
  confirmPassword: string;
  role?: Role;
}

export interface SignupResponse extends LoginResponse {}

export interface ServiceRequestPayload {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  attachmentName?: string;
}

export interface ServiceAppointmentPayload {
  title: string;
  description?: string;
  serviceRequestId?: string;
  scheduledFor: string;
  location: string;
}

export interface FeedbackPayload {
  category: string;
  subject: string;
  message: string;
  rating?: number;
}

export interface ProfilePayload {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  language: string;
  twoFactorEnabled: boolean;
  billingAddress?: CustomerProfile['billingAddress'] | null;
  notificationPreferences: CustomerProfile['notificationPreferences'];
}

export interface PasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function normalizeRole(role: string): Role {
  const normalized = role.toLowerCase();
  if (
    normalized === 'super_admin' ||
    normalized === 'admin' ||
    normalized === 'partner' ||
    normalized === 'employee' ||
    normalized === 'customer'
  ) {
    return normalized;
  }
  return 'customer';
}

function normalizeUser(user: Record<string, unknown>): User {
  return {
    id: String(user.id),
    name: String(user.name),
    email: String(user.email),
    role: normalizeRole(String(user.role)),
    phone: (user.phone as string | null | undefined) ?? null,
    avatarUrl: (user.avatarUrl as string | null | undefined) ?? null,
    avatar: (user.avatarUrl as string | null | undefined) ?? null,
    customerId: (user.customerId as string | null | undefined) ?? null,
    createdAt: (user.createdAt as string | null | undefined) ?? null,
    updatedAt: (user.updatedAt as string | null | undefined) ?? null,
  };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(init.headers ?? {});
  if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload as T;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await request<{ token: string; user: Record<string, unknown> }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return {
    token: response.token,
    user: normalizeUser(response.user),
  };
}

export async function signup(data: SignupData): Promise<SignupResponse> {
  const response = await request<{ token: string; user: Record<string, unknown> }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: data.fullName,
      email: data.email,
      password: data.password,
      phone: '',
    }),
  });

  return {
    token: response.token,
    user: normalizeUser(response.user),
  };
}

export async function logout(): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/api/auth/logout', {
    method: 'POST',
  });
}

export async function fetchCurrentUser(): Promise<{ user: User }> {
  const response = await request<{ user: Record<string, unknown> }>('/api/auth/me');
  return { user: normalizeUser(response.user) };
}

export async function fetchCustomerProfile(): Promise<{ profile: CustomerProfile }> {
  return request<{ profile: CustomerProfile }>('/api/customer/profile');
}

export async function updateCustomerProfile(payload: ProfilePayload): Promise<{ profile: CustomerProfile }> {
  return request<{ profile: CustomerProfile }>('/api/customer/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function updatePassword(payload: PasswordPayload): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/api/account/password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export const updateAccountPassword = updatePassword;

export async function fetchAccountProfile(): Promise<{ profile: AccountProfile }> {
  return request<{ profile: AccountProfile }>('/api/account/profile');
}

export async function updateAccountProfile(payload: ProfilePayload): Promise<{ profile: AccountProfile }> {
  return request<{ profile: AccountProfile }>('/api/account/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function fetchCustomerDashboard(): Promise<CustomerDashboardResponse> {
  return request<CustomerDashboardResponse>('/api/customer/dashboard');
}

export async function fetchCustomerInstallation(): Promise<{ installation: CustomerInstallation | null }> {
  return request<{ installation: CustomerInstallation | null }>('/api/customer/installations');
}

export async function fetchCustomerDevices(): Promise<{
  devices: CustomerDevice[];
  summary: { total: number; active: number; averagePerformance: number };
}> {
  return request('/api/customer/devices');
}

export async function fetchCustomerServiceRequests(): Promise<{
  requests: CustomerServiceRequest[];
  summary: { total: number; open: number; inProgress: number; resolved: number };
}> {
  return request('/api/customer/service-requests');
}

export async function createCustomerServiceRequest(payload: ServiceRequestPayload): Promise<{
  request: CustomerServiceRequest;
}> {
  return request('/api/customer/service-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchCustomerAppointments(): Promise<{ appointments: ServiceAppointment[] }> {
  return request('/api/customer/service-appointments');
}

export async function createCustomerAppointment(payload: ServiceAppointmentPayload): Promise<{
  appointment: ServiceAppointment;
}> {
  return request('/api/customer/service-appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitCustomerFeedback(payload: FeedbackPayload): Promise<{
  feedback: CustomerFeedbackEntry;
}> {
  return request('/api/customer/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchCustomerInvoices(): Promise<{
  invoices: CustomerInvoice[];
  paymentMethods: PaymentMethodSummary[];
  summary: {
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
  };
}> {
  return request('/api/customer/invoices');
}

export async function createInvoiceCheckoutSession(invoiceId: string): Promise<{
  sessionId: string;
  url: string | null;
}> {
  return request(`/api/customer/invoices/${invoiceId}/checkout-session`, {
    method: 'POST',
  });
}

export async function fetchPaymentMethods(): Promise<{ methods: PaymentMethodSummary[] }> {
  return request('/api/customer/payment-methods');
}

export async function createSetupIntent(): Promise<{ clientSecret: string | null }> {
  return request('/api/customer/payment-methods/setup-intent', {
    method: 'POST',
  });
}

export async function syncPaymentMethod(paymentMethodId: string): Promise<{ method: PaymentMethodSummary }> {
  return request('/api/customer/payment-methods/sync', {
    method: 'POST',
    body: JSON.stringify({ paymentMethodId }),
  });
}

export async function fetchNotifications(): Promise<{
  notifications: CustomerNotification[];
  unreadCount: number;
}> {
  return request('/api/customer/notifications');
}

export async function markNotificationRead(notificationId: string): Promise<{ updated: number }> {
  return request(`/api/customer/notifications/${notificationId}/read`, {
    method: 'POST',
  });
}

export async function markAllNotificationsRead(): Promise<{ updated: number }> {
  return request('/api/customer/notifications/read-all', {
    method: 'POST',
  });
}

export async function searchGlobal(query: string): Promise<SearchResponse> {
  const encoded = encodeURIComponent(query);
  return request<SearchResponse>(`/api/search?q=${encoded}`);
}
