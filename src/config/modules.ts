import type { Role } from '../types';

export type ModuleStatus = 'live' | 'placeholder' | 'planned' | 'reference';

export type ModuleItem = {
  label: string;
  folder: string;
  route: string;
  role: Role | 'public' | 'shared';
  status: ModuleStatus;
  description: string;
};

export type ModuleGroup = {
  role: Role | 'public' | 'shared';
  title: string;
  description: string;
  items: ModuleItem[];
};

export const MODULE_GROUPS: ModuleGroup[] = [
  {
    role: 'public',
    title: 'Public Pages',
    description: 'Discovery and login entry points.',
    items: [
      { label: 'Login', folder: 'app/src/pages/public/LoginPage.tsx', route: '/login', role: 'public', status: 'live', description: 'Authentication gateway' },
      { label: 'Not Found', folder: 'app/src/pages/public/NotFoundPage.tsx', route: '*', role: 'public', status: 'live', description: 'Fallback route' },
    ],
  },
  {
    role: 'super_admin',
    title: 'Super Admin',
    description: 'Governance, system controls, and oversight.',
    items: [
      { label: 'Dashboard', folder: 'super_admin_dashboard', route: '/super-admin/dashboard', role: 'super_admin', status: 'live', description: 'Overview, financials, users, inventory, and system tabs' },
      { label: 'Synced Dashboard', folder: 'super_admin_dashboard_synced', route: '/super-admin/dashboard-synced', role: 'super_admin', status: 'reference', description: 'Alternative synced dashboard layout' },
      { label: 'Users', folder: 'user_management_super_admin', route: '/super-admin/users', role: 'super_admin', status: 'reference', description: 'User governance reference page' },
      { label: 'System Logs', folder: 'system_settings_logs', route: '/super-admin/system/logs', role: 'super_admin', status: 'reference', description: 'Audit and system activity logs' },
    ],
  },
  {
    role: 'admin',
    title: 'Admin',
    description: 'Daily operations across customers, staff, partners, and complaints.',
    items: [
      { label: 'Dashboard', folder: 'admin_dashboard', route: '/admin/dashboard', role: 'admin', status: 'live', description: 'Operational overview' },
      { label: 'Synced Dashboard', folder: 'admin_dashboard_synced', route: '/admin/dashboard-synced', role: 'admin', status: 'reference', description: 'Alternative admin dashboard layout' },
      { label: 'Customers', folder: 'customer_management_admin', route: '/admin/customers', role: 'admin', status: 'live', description: 'Customer list and bulk actions' },
      { label: 'Customer Detail', folder: 'customer_detail_admin', route: '/admin/customers/:id', role: 'admin', status: 'reference', description: 'Customer profile and actions' },
      { label: 'Asset Management', folder: 'asset_management', route: '/admin/assets', role: 'admin', status: 'reference', description: 'Asset operations interface' },
      { label: 'Asset Overview', folder: 'asset_management_overview', route: '/admin/assets/overview', role: 'admin', status: 'reference', description: 'Asset overview and summary' },
      { label: 'Operations Dashboard', folder: 'operations_dashboard', route: '/admin/operations', role: 'admin', status: 'reference', description: 'Broader operations view' },
      { label: 'Employees', folder: 'task_management_employee', route: '/admin/employees', role: 'admin', status: 'reference', description: 'Staff and task operations reference' },
      { label: 'Partners', folder: 'partner_management', route: '/admin/partners', role: 'admin', status: 'reference', description: 'Partner management and detail flow' },
      { label: 'Partner Detail', folder: 'partner_detail_view', route: '/admin/partners/:id', role: 'admin', status: 'reference', description: 'Partner detail view' },
      { label: 'Complaints', folder: 'support_ticket_management', route: '/admin/complaints', role: 'admin', status: 'reference', description: 'Complaint and support ticket management' },
      { label: 'Complaint Detail', folder: 'complaint_detail_view', route: '/admin/complaints/:id', role: 'admin', status: 'reference', description: 'Complaint detail view' },
      { label: 'Service Requests', folder: 'service_requests_list', route: '/admin/service-requests', role: 'admin', status: 'reference', description: 'Admin-side service request list' },
      { label: 'Add Solar Asset', folder: 'add_new_solar_asset', route: '/admin/assets/new', role: 'admin', status: 'reference', description: 'New solar asset creation workflow' },
      { label: 'Inventory', folder: 'inventory_management_admin', route: '/admin/inventory', role: 'admin', status: 'reference', description: 'Inventory control and low-stock handling' },
      { label: 'Financials', folder: 'payments_invoices_1', route: '/admin/financials', role: 'admin', status: 'reference', description: 'Invoices, dues, and payouts' },
    ],
  },
  {
    role: 'partner',
    title: 'Partner',
    description: 'Project pipeline, payout tracking, and communications.',
    items: [
      { label: 'Dashboard', folder: 'partner_dashboard', route: '/partner/dashboard', role: 'partner', status: 'live', description: 'Performance snapshot' },
      { label: 'Synced Dashboard', folder: 'partner_dashboard_synced', route: '/partner/dashboard-synced', role: 'partner', status: 'reference', description: 'Alternative synced dashboard layout' },
      { label: 'Projects', folder: 'project_pipeline_partner_portal', route: '/partner/projects', role: 'partner', status: 'reference', description: 'Pipeline and project tracking' },
      { label: 'Earnings', folder: 'earnings_payouts_partner_portal', route: '/partner/earnings', role: 'partner', status: 'reference', description: 'Payouts and earnings management' },
      { label: 'Messages', folder: 'messages_partner_portal', route: '/partner/messages', role: 'partner', status: 'reference', description: 'Partner communication hub' },
      { label: 'Detail', folder: 'partner_detail_view', route: '/partner/detail/:id', role: 'partner', status: 'reference', description: 'Partner detail view' },
    ],
  },
  {
    role: 'employee',
    title: 'Employee',
    description: 'Task execution, attendance, and performance tracking.',
    items: [
      { label: 'Dashboard', folder: 'employee_dashboard', route: '/employee/dashboard', role: 'employee', status: 'live', description: 'Daily execution hub' },
      { label: 'Synced Dashboard', folder: 'employee_dashboard_synced', route: '/employee/dashboard-synced', role: 'employee', status: 'reference', description: 'Alternative dashboard layout' },
      { label: 'Tasks', folder: 'task_management_employee', route: '/employee/tasks', role: 'employee', status: 'reference', description: 'Assigned tasks and workflows' },
      { label: 'Task Detail', folder: 'employee_task_detail_view', route: '/employee/tasks/:id', role: 'employee', status: 'reference', description: 'Task progress and updates' },
      { label: 'Attendance 1', folder: 'attendance_log_employee_1', route: '/employee/attendance/1', role: 'employee', status: 'reference', description: 'Attendance log layout variant' },
      { label: 'Attendance 2', folder: 'attendance_log_employee_2', route: '/employee/attendance/2', role: 'employee', status: 'reference', description: 'Attendance log layout variant' },
      { label: 'Attendance 3', folder: 'attendance_log_employee_3', route: '/employee/attendance/3', role: 'employee', status: 'reference', description: 'Attendance log layout variant' },
      { label: 'Profile Performance', folder: 'employee_profile_performance', route: '/employee/profile', role: 'employee', status: 'reference', description: 'Performance and profile overview' },
      { label: 'Work Schedule 1', folder: 'work_schedule_employee_1', route: '/employee/schedule/1', role: 'employee', status: 'reference', description: 'Work schedule layout variant' },
      { label: 'Work Schedule 2', folder: 'work_schedule_employee_2', route: '/employee/schedule/2', role: 'employee', status: 'reference', description: 'Work schedule layout variant' },
      { label: 'My Tasks 1', folder: 'my_tasks_employee_list_view_1', route: '/employee/tasks-view/1', role: 'employee', status: 'reference', description: 'Task list view variant' },
      { label: 'My Tasks 2', folder: 'my_tasks_employee_list_view_2', route: '/employee/tasks-view/2', role: 'employee', status: 'reference', description: 'Task list view variant' },
    ],
  },
  {
    role: 'customer',
    title: 'Customer',
    description: 'Self-service, installation tracking, service and billing.',
    items: [
      { label: 'Dashboard', folder: 'customer_dashboard_synced', route: '/customer/dashboard', role: 'customer', status: 'live', description: 'Customer self-service overview' },
      { label: 'Portal 1', folder: 'customer_portal_dashboard_1', route: '/customer/dashboard-1', role: 'customer', status: 'reference', description: 'Portal dashboard variant' },
      { label: 'Portal 2', folder: 'customer_portal_dashboard_2', route: '/customer/dashboard-2', role: 'customer', status: 'reference', description: 'Portal dashboard variant' },
      { label: 'Installation', folder: 'installation_details', route: '/customer/installation', role: 'customer', status: 'reference', description: 'Installation detail and status' },
      { label: 'Installation History', folder: 'installation_history', route: '/customer/installation/history', role: 'customer', status: 'reference', description: 'Installation history and archive' },
      { label: 'Installation Tracking', folder: 'installation_tracking', route: '/customer/installation/tracking', role: 'customer', status: 'reference', description: 'Installation progress timeline' },
      { label: 'Installation Heatmap', folder: 'heatmap_of_installation_tracking', route: '/customer/installation/heatmap', role: 'customer', status: 'reference', description: 'Installation tracking heatmap view' },
      { label: 'Mobile Tracking', folder: 'installation_tracking_mobile', route: '/customer/installation/mobile', role: 'customer', status: 'reference', description: 'Mobile tracking layout' },
      { label: 'Service Requests', folder: 'service_requests_customer', route: '/customer/service', role: 'customer', status: 'reference', description: 'Customer service requests' },
      { label: 'Raise Request', folder: 'raise_service_request', route: '/customer/service/new', role: 'customer', status: 'reference', description: 'Create a new service request' },
      { label: 'Schedule Service', folder: 'schedule_service_appointment', route: '/customer/service/schedule', role: 'customer', status: 'reference', description: 'Service appointment scheduling' },
      { label: 'Feedback', folder: 'customer_feedback', route: '/customer/feedback', role: 'customer', status: 'reference', description: 'Customer feedback submission' },
      { label: 'Payments', folder: 'payments_invoices_2', route: '/customer/payments', role: 'customer', status: 'reference', description: 'Invoices and payment history' },
      { label: 'My Devices', folder: 'my_devices_customer_portal', route: '/customer/devices', role: 'customer', status: 'reference', description: 'Device and asset list' },
      { label: 'Profile', folder: 'customer_profile_detail', route: '/customer/profile', role: 'customer', status: 'reference', description: 'Personal profile detail' },
      { label: 'Settings', folder: 'account_settings_1', route: '/customer/settings', role: 'customer', status: 'reference', description: 'Account settings and preferences' },
    ],
  },
  {
    role: 'shared',
    title: 'Shared and Utility Pages',
    description: 'Common utilities used across roles.',
    items: [
      { label: 'Global Search', folder: 'global_search_cmd_k', route: '/shared/global-search', role: 'shared', status: 'live', description: 'Command palette search' },
      { label: 'Notifications Center', folder: 'notifications_center', route: '/shared/notifications', role: 'shared', status: 'live', description: 'Notification inbox' },
      { label: 'Notification Preferences', folder: 'notification_preferences', route: '/shared/notification-preferences', role: 'shared', status: 'reference', description: 'Notification settings' },
      { label: 'Account Settings', folder: 'account_settings_2', route: '/shared/account-settings', role: 'shared', status: 'reference', description: 'Account preferences' },
      { label: 'User Profile', folder: 'user_profile', route: '/shared/profile', role: 'shared', status: 'reference', description: 'Generic user profile' },
      { label: 'Reports & Exports', folder: 'reports_exports', route: '/shared/reports', role: 'shared', status: 'reference', description: 'Reports and export center' },
      { label: 'Support Channels', folder: 'support_channels', route: '/shared/support', role: 'shared', status: 'reference', description: 'Support entry point' },
      { label: 'Support Chat', folder: 'support_chat_portal', route: '/shared/support/chat', role: 'shared', status: 'reference', description: 'Support chat portal' },
      { label: 'Maintenance History', folder: 'maintenance_history', route: '/shared/maintenance', role: 'shared', status: 'reference', description: 'Maintenance log reference' },
      { label: 'Help Center', folder: 'help_center_resource_portal', route: '/shared/help', role: 'shared', status: 'reference', description: 'Help resources' },
      { label: 'Performance Summary', folder: 'performance_summary', route: '/shared/performance-summary', role: 'shared', status: 'reference', description: 'Performance summary view' },
      { label: 'Helios Enterprise', folder: 'helios_enterprise', route: '/brand/helios-enterprise', role: 'shared', status: 'reference', description: 'Brand and design reference package' },
      { label: '404 Page', folder: '404_error_page', route: '/404', role: 'shared', status: 'reference', description: 'Error state page' },
    ],
  },
];

export const MODULE_INDEX = MODULE_GROUPS.flatMap((group) => group.items);
