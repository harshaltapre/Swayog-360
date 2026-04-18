import type { NavItem, Role } from '../types';

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  super_admin: [
    { label: 'Dashboard', icon: 'dashboard', path: '/super-admin/dashboard' },
    { label: 'Sync Center', icon: 'sync', path: '/workspace/sync-center' },
    { label: 'Projects', icon: 'solar_power', path: '/super-admin/dashboard' },
    { label: 'Inventory', icon: 'inventory_2', path: '/super-admin/dashboard' },
    { label: 'Users', icon: 'group', path: '/super-admin/dashboard' },
    { label: 'Financials', icon: 'payments', path: '/super-admin/dashboard' },
    { label: 'System Controls', icon: 'settings_applications', path: '/super-admin/dashboard' },
  ],
  admin: [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { label: 'Sync Center', icon: 'sync', path: '/workspace/sync-center' },
    { label: 'Customers', icon: 'group', path: '/admin/customers' },
    { label: 'Employees', icon: 'badge', path: '/admin/employees' },
    { label: 'Partners', icon: 'handshake', path: '/admin/partners' },
    { label: 'Complaints', icon: 'report_problem', path: '/admin/complaints' },
    { label: 'Inventory', icon: 'inventory_2', path: '/admin/inventory' },
    { label: 'Financials', icon: 'payments', path: '/admin/financials' },
    { label: 'Settings', icon: 'settings', path: '/admin/settings' },
  ],
  partner: [
    { label: 'Dashboard', icon: 'dashboard', path: '/partner/dashboard' },
    { label: 'Projects', icon: 'solar_power', path: '/partner/projects' },
    { label: 'Earnings', icon: 'payments', path: '/partner/earnings' },
    { label: 'Messages', icon: 'mail', path: '/partner/messages' },
    { label: 'Settings', icon: 'settings', path: '/partner/settings' },
  ],
  employee: [
    { label: 'Dashboard', icon: 'dashboard', path: '/employee/dashboard' },
    { label: 'My Tasks', icon: 'task_alt', path: '/employee/tasks' },
    { label: 'Attendance', icon: 'event_available', path: '/employee/attendance' },
    { label: 'Profile', icon: 'person', path: '/employee/profile' },
    { label: 'Settings', icon: 'settings', path: '/employee/settings' },
  ],
  customer: [
    { label: 'Dashboard', icon: 'dashboard', path: '/customer/dashboard' },
    { label: 'Installation', icon: 'solar_power', path: '/customer/installation' },
    { label: 'My Devices', icon: 'devices', path: '/customer/devices' },
    { label: 'Service', icon: 'support_agent', path: '/customer/service' },
    { label: 'Payments', icon: 'receipt_long', path: '/customer/payments' },
    { label: 'Settings', icon: 'settings', path: '/customer/settings' },
  ],
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  partner: 'Partner',
  employee: 'Employee',
  customer: 'Customer',
};

export const ROLE_DASHBOARD_PATHS: Record<Role, string> = {
  super_admin: '/super-admin/dashboard',
  admin: '/admin/dashboard',
  partner: '/partner/dashboard',
  employee: '/employee/dashboard',
  customer: '/customer/dashboard',
};
