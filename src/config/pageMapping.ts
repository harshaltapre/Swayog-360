/**
 * Role-Based Page Mapping Configuration
 * Defines which pages are accessible to which roles
 * This ensures proper synchronization between authentication and page access
 */

import type { Role } from '../types';

export type PageStatus = 'active' | 'inactive' | 'maintenance';

export interface PageConfig {
  id: string;
  path: string;
  title: string;
  icon?: string;
  roles: Role[];
  status: PageStatus;
  category: string;
  description?: string;
  parent?: string; // For nested pages
}

export const PAGE_MAPPING: PageConfig[] = [
  // Super Admin Pages
  {
    id: 'sa-dashboard',
    path: '/super-admin/dashboard',
    title: 'Super Admin Dashboard',
    icon: 'dashboard',
    roles: ['super_admin'],
    status: 'active',
    category: 'Dashboard',
    description: 'Super admin overview and system controls',
  },
  {
    id: 'sa-dashboard-synced',
    path: '/super-admin/dashboard-synced',
    title: 'Super Admin Dashboard (Synced)',
    roles: ['super_admin'],
    status: 'active',
    category: 'Dashboard',
  },
  {
    id: 'sa-user-management',
    path: '/super-admin/users',
    title: 'User Management',
    icon: 'group',
    roles: ['super_admin'],
    status: 'active',
    category: 'User Management',
    description: 'Manage all users across the system',
  },
  {
    id: 'sa-system-settings',
    path: '/super-admin/system-settings',
    title: 'System Settings & Logs',
    icon: 'settings_applications',
    roles: ['super_admin'],
    status: 'active',
    category: 'System',
    description: 'System configuration and audit logs',
  },

  // Admin Pages
  {
    id: 'admin-dashboard',
    path: '/admin/dashboard',
    title: 'Admin Dashboard',
    icon: 'dashboard',
    roles: ['admin'],
    status: 'active',
    category: 'Dashboard',
    description: 'Admin operations dashboard',
  },
  {
    id: 'admin-dashboard-synced',
    path: '/admin/dashboard-synced',
    title: 'Admin Dashboard (Synced)',
    roles: ['admin'],
    status: 'active',
    category: 'Dashboard',
  },
  {
    id: 'admin-operations',
    path: '/admin/operations',
    title: 'Operations Dashboard',
    icon: 'production_quantity_limits',
    roles: ['admin'],
    status: 'active',
    category: 'Operations',
    description: 'Operations overview and management',
  },
  {
    id: 'admin-customer-mgmt',
    path: '/admin/customers',
    title: 'Customer Management',
    icon: 'group',
    roles: ['admin'],
    status: 'active',
    category: 'Customer Management',
    description: 'Manage all customers',
  },
  {
    id: 'admin-customer-detail',
    path: '/admin/customers/:id',
    title: 'Customer Detail',
    roles: ['admin'],
    status: 'active',
    category: 'Customer Management',
    parent: 'admin-customer-mgmt',
  },
  {
    id: 'admin-asset-mgmt',
    path: '/admin/assets',
    title: 'Asset Management',
    icon: 'solar_power',
    roles: ['admin'],
    status: 'active',
    category: 'Asset Management',
    description: 'Manage solar assets and installations',
  },
  {
    id: 'admin-asset-overview',
    path: '/admin/assets/overview',
    title: 'Asset Overview',
    roles: ['admin'],
    status: 'active',
    category: 'Asset Management',
    parent: 'admin-asset-mgmt',
  },
  {
    id: 'admin-asset-new',
    path: '/admin/assets/new',
    title: 'Add New Solar Asset',
    icon: 'add_circle',
    roles: ['admin'],
    status: 'active',
    category: 'Asset Management',
    parent: 'admin-asset-mgmt',
  },
  {
    id: 'admin-employee-mgmt',
    path: '/admin/employees',
    title: 'Employee Management',
    icon: 'badge',
    roles: ['admin'],
    status: 'active',
    category: 'Employee Management',
    description: 'Manage all employees',
  },
  {
    id: 'admin-employee-detail',
    path: '/admin/employees/:id',
    title: 'Employee Detail',
    roles: ['admin'],
    status: 'active',
    category: 'Employee Management',
    parent: 'admin-employee-mgmt',
  },
  {
    id: 'admin-partner-mgmt',
    path: '/admin/partners',
    title: 'Partner Management',
    icon: 'handshake',
    roles: ['admin'],
    status: 'active',
    category: 'Partner Management',
    description: 'Manage all partners',
  },
  {
    id: 'admin-partner-detail',
    path: '/admin/partners/:id',
    title: 'Partner Detail',
    roles: ['admin'],
    status: 'active',
    category: 'Partner Management',
    parent: 'admin-partner-mgmt',
  },
  {
    id: 'admin-complaints',
    path: '/admin/complaints',
    title: 'Complaint Management',
    icon: 'report_problem',
    roles: ['admin'],
    status: 'active',
    category: 'Complaint Management',
    description: 'Manage service complaints',
  },
  {
    id: 'admin-complaint-detail',
    path: '/admin/complaints/:id',
    title: 'Complaint Detail',
    roles: ['admin'],
    status: 'active',
    category: 'Complaint Management',
    parent: 'admin-complaints',
  },
  {
    id: 'admin-service-requests',
    path: '/admin/service-requests',
    title: 'Service Requests',
    icon: 'support_agent',
    roles: ['admin'],
    status: 'active',
    category: 'Service Management',
    description: 'View and manage service requests',
  },
  {
    id: 'admin-inventory',
    path: '/admin/inventory',
    title: 'Inventory Management',
    icon: 'inventory_2',
    roles: ['admin'],
    status: 'active',
    category: 'Inventory',
    description: 'Manage inventory and stock',
  },
  {
    id: 'admin-financials',
    path: '/admin/financials',
    title: 'Financial Management',
    icon: 'payments',
    roles: ['admin'],
    status: 'active',
    category: 'Financial',
    description: 'View financial reports and invoices',
  },
  {
    id: 'admin-settings',
    path: '/admin/settings',
    title: 'Admin Settings',
    icon: 'settings',
    roles: ['admin'],
    status: 'active',
    category: 'Settings',
  },

  // Employee Pages
  {
    id: 'emp-dashboard',
    path: '/employee/dashboard',
    title: 'Employee Dashboard',
    icon: 'dashboard',
    roles: ['employee'],
    status: 'active',
    category: 'Dashboard',
    description: 'Employee dashboard with tasks and assignments',
  },
  {
    id: 'emp-dashboard-synced',
    path: '/employee/dashboard-synced',
    title: 'Employee Dashboard (Synced)',
    roles: ['employee'],
    status: 'active',
    category: 'Dashboard',
  },
  {
    id: 'emp-tasks',
    path: '/employee/tasks',
    title: 'My Tasks',
    icon: 'task_alt',
    roles: ['employee'],
    status: 'active',
    category: 'Task Management',
    description: 'View assigned tasks and work orders',
  },
  {
    id: 'emp-task-detail',
    path: '/employee/tasks/:id',
    title: 'Task Detail',
    roles: ['employee'],
    status: 'active',
    category: 'Task Management',
    parent: 'emp-tasks',
  },
  {
    id: 'emp-attendance',
    path: '/employee/attendance',
    title: 'Attendance Log',
    icon: 'event_available',
    roles: ['employee'],
    status: 'active',
    category: 'Attendance',
    description: 'View attendance records',
  },
  {
    id: 'emp-work-schedule',
    path: '/employee/work-schedule',
    title: 'Work Schedule',
    icon: 'schedule',
    roles: ['employee'],
    status: 'active',
    category: 'Schedule',
    description: 'View your work schedule',
  },
  {
    id: 'emp-profile',
    path: '/employee/profile',
    title: 'My Profile',
    icon: 'person',
    roles: ['employee'],
    status: 'active',
    category: 'Profile',
  },
  {
    id: 'emp-profile-performance',
    path: '/employee/profile/performance',
    title: 'Performance Summary',
    roles: ['employee'],
    status: 'active',
    category: 'Profile',
    parent: 'emp-profile',
  },
  {
    id: 'emp-settings',
    path: '/employee/settings',
    title: 'Employee Settings',
    icon: 'settings',
    roles: ['employee'],
    status: 'active',
    category: 'Settings',
  },
  {
    id: 'emp-account-settings',
    path: '/employee/account-settings',
    title: 'Account Settings',
    roles: ['employee'],
    status: 'active',
    category: 'Settings',
    parent: 'emp-settings',
  },

  // Partner Pages
  {
    id: 'partner-dashboard',
    path: '/partner/dashboard',
    title: 'Partner Dashboard',
    icon: 'dashboard',
    roles: ['partner'],
    status: 'active',
    category: 'Dashboard',
    description: 'Partner portal dashboard',
  },
  {
    id: 'partner-dashboard-synced',
    path: '/partner/dashboard-synced',
    title: 'Partner Dashboard (Synced)',
    roles: ['partner'],
    status: 'active',
    category: 'Dashboard',
  },
  {
    id: 'partner-projects',
    path: '/partner/projects',
    title: 'Project Pipeline',
    icon: 'solar_power',
    roles: ['partner'],
    status: 'active',
    category: 'Projects',
    description: 'View project pipeline and status',
  },
  {
    id: 'partner-earnings',
    path: '/partner/earnings',
    title: 'Earnings & Payouts',
    icon: 'payments',
    roles: ['partner'],
    status: 'active',
    category: 'Financial',
    description: 'View earnings and manage payouts',
  },
  {
    id: 'partner-messages',
    path: '/partner/messages',
    title: 'Messages',
    icon: 'mail',
    roles: ['partner'],
    status: 'active',
    category: 'Communication',
    description: 'Partner messages and notifications',
  },
  {
    id: 'partner-settings',
    path: '/partner/settings',
    title: 'Partner Settings',
    icon: 'settings',
    roles: ['partner'],
    status: 'active',
    category: 'Settings',
  },

  // Customer Pages
  {
    id: 'cust-dashboard',
    path: '/customer/dashboard',
    title: 'Customer Dashboard',
    icon: 'dashboard',
    roles: ['customer'],
    status: 'active',
    category: 'Dashboard',
    description: 'Customer portal dashboard',
  },
  {
    id: 'cust-dashboard-synced',
    path: '/customer/dashboard-synced',
    title: 'Customer Dashboard (Synced)',
    roles: ['customer'],
    status: 'active',
    category: 'Dashboard',
  },
  {
    id: 'cust-installation',
    path: '/customer/installation',
    title: 'My Installation',
    icon: 'solar_power',
    roles: ['customer'],
    status: 'active',
    category: 'Installation',
    description: 'View solar installation details',
  },
  {
    id: 'cust-installation-details',
    path: '/customer/installation/details',
    title: 'Installation Details',
    roles: ['customer'],
    status: 'active',
    category: 'Installation',
    parent: 'cust-installation',
  },
  {
    id: 'cust-installation-history',
    path: '/customer/installation/history',
    title: 'Installation History',
    roles: ['customer'],
    status: 'active',
    category: 'Installation',
    parent: 'cust-installation',
  },
  {
    id: 'cust-installation-heatmap',
    path: '/customer/installation/heatmap',
    title: 'Installation Heatmap',
    roles: ['customer'],
    status: 'active',
    category: 'Installation',
    parent: 'cust-installation',
  },
  {
    id: 'cust-devices',
    path: '/customer/devices',
    title: 'My Devices',
    icon: 'devices',
    roles: ['customer'],
    status: 'active',
    category: 'Devices',
    description: 'Manage your connected devices',
  },
  {
    id: 'cust-service',
    path: '/customer/service',
    title: 'Service Requests',
    icon: 'support_agent',
    roles: ['customer'],
    status: 'active',
    category: 'Service',
    description: 'View and raise service requests',
  },
  {
    id: 'cust-service-schedule',
    path: '/customer/service/schedule',
    title: 'Schedule Service Appointment',
    roles: ['customer'],
    status: 'active',
    category: 'Service',
    parent: 'cust-service',
  },
  {
    id: 'cust-feedback',
    path: '/customer/feedback',
    title: 'Customer Feedback',
    icon: 'feedback',
    roles: ['customer'],
    status: 'active',
    category: 'Support',
    description: 'Submit feedback and suggestions',
  },
  {
    id: 'cust-payments',
    path: '/customer/payments',
    title: 'Payments & Invoices',
    icon: 'receipt_long',
    roles: ['customer'],
    status: 'active',
    category: 'Financial',
    description: 'View invoices and payment history',
  },
  {
    id: 'cust-profile',
    path: '/customer/profile',
    title: 'My Profile',
    icon: 'person',
    roles: ['customer'],
    status: 'active',
    category: 'Profile',
  },
  {
    id: 'cust-settings',
    path: '/customer/settings',
    title: 'Customer Settings',
    icon: 'settings',
    roles: ['customer'],
    status: 'active',
    category: 'Settings',
  },

  // Shared Pages
  {
    id: 'shared-performance-summary',
    path: '/shared/performance-summary',
    title: 'Performance Summary',
    roles: ['admin', 'employee', 'partner'],
    status: 'active',
    category: 'Reports',
    description: 'Performance analytics and reports',
  },
  {
    id: 'shared-notifications',
    path: '/shared/notifications',
    title: 'Notifications Center',
    icon: 'notifications',
    roles: ['admin', 'employee', 'partner', 'customer'],
    status: 'active',
    category: 'Communication',
  },
  {
    id: 'shared-help-center',
    path: '/shared/help-center',
    title: 'Help Center & Resources',
    icon: 'help',
    roles: ['admin', 'employee', 'partner', 'customer'],
    status: 'active',
    category: 'Support',
  },
  {
    id: 'shared-support-chat',
    path: '/shared/support-chat',
    title: 'Support Chat Portal',
    roles: ['admin', 'employee', 'partner', 'customer'],
    status: 'active',
    category: 'Support',
  },
  {
    id: 'brand-helios-enterprise',
    path: '/brand/helios-enterprise',
    title: 'Helios Enterprise',
    roles: ['super_admin', 'admin', 'employee', 'partner', 'customer'],
    status: 'active',
    category: 'Brand',
  },
];

/**
 * Get pages accessible by a specific role
 */
export function getPagesByRole(role: Role): PageConfig[] {
  return PAGE_MAPPING.filter((page) => page.roles.includes(role));
}

/**
 * Get page config by ID
 */
export function getPageById(id: string): PageConfig | undefined {
  return PAGE_MAPPING.find((page) => page.id === id);
}

/**
 * Get page config by path
 */
export function getPageByPath(path: string): PageConfig | undefined {
  return PAGE_MAPPING.find((page) => page.path === path);
}

/**
 * Check if a role can access a page
 */
export function canAccessPage(role: Role, pageId: string): boolean {
  const page = getPageById(pageId);
  return page ? page.roles.includes(role) : false;
}

/**
 * Get grouped navigation items by category for a role
 */
export function getNavigationByCategory(role: Role): Record<string, PageConfig[]> {
  const pages = getPagesByRole(role).filter((p) => !p.parent); // Only top-level pages
  const grouped: Record<string, PageConfig[]> = {};

  pages.forEach((page) => {
    if (!grouped[page.category]) {
      grouped[page.category] = [];
    }
    grouped[page.category].push(page);
  });

  return grouped;
}
