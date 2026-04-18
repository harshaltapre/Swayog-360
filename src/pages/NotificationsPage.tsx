import { useState, useMemo } from 'react';
import { useAuthStore } from '../store';

type NotificationCategory = 'alert' | 'financial' | 'maintenance' | 'update' | 'system';

interface NotificationAction {
  label: string;
  variant: 'primary' | 'secondary';
}

interface Notification {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: NotificationCategory;
  icon: string;
  iconBg: string;
  read: boolean;
  timestamp: string;
  roles: string[];
  actions?: NotificationAction[];
}

const MOCK_NOTIFICATIONS: Notification[] = [
  // ALERTS - ALL ROLES
  {
    id: 'alert-1',
    title: 'Inverter Failure at Site A-12',
    subtitle: 'Phoenix East Cluster',
    description: 'Communication lost with primary inverter cluster. Tech dispatch recommended.',
    category: 'alert',
    icon: 'error',
    iconBg: 'bg-red-100',
    read: false,
    timestamp: '2m ago',
    roles: ['super_admin', 'admin', 'partner', 'employee'],
    actions: [
      { label: 'Assign Tech', variant: 'primary' },
      { label: 'View Details', variant: 'secondary' },
    ],
  },
  {
    id: 'alert-2',
    title: 'Grid Failure - Sector 7',
    subtitle: 'Nevada North Operations',
    description: 'Complete power loss detected in distribution network sector 7.',
    category: 'alert',
    icon: 'warning',
    iconBg: 'bg-orange-100',
    read: false,
    timestamp: '45m ago',
    roles: ['super_admin', 'admin', 'partner', 'employee'],
    actions: [
      { label: 'Escalate', variant: 'primary' },
      { label: 'View Logs', variant: 'secondary' },
    ],
  },

  // FINANCIAL - Admin, Super Admin, Partner
  {
    id: 'fin-1',
    title: 'Payment Overdue: Apex Corp',
    subtitle: 'Invoice #SP-2024-889',
    description: 'Invoice is 5 days past due date. Recommended action: Send reminder.',
    category: 'financial',
    icon: 'payments',
    iconBg: 'bg-blue-100',
    read: false,
    timestamp: '45m ago',
    roles: ['super_admin', 'admin'],
    actions: [
      { label: 'Send Reminder', variant: 'primary' },
      { label: 'Review Invoice', variant: 'secondary' },
    ],
  },
  {
    id: 'fin-2',
    title: 'Revenue Report: Q1 2024',
    subtitle: 'Total: $2.4M',
    description: 'Q1 revenue report is now available for download and analysis.',
    category: 'financial',
    icon: 'trending_up',
    iconBg: 'bg-green-100',
    read: true,
    timestamp: '2h ago',
    roles: ['super_admin', 'admin'],
    actions: [
      { label: 'View Report', variant: 'primary' },
      { label: 'Export', variant: 'secondary' },
    ],
  },
  {
    id: 'fin-3',
    title: 'Earnings Payout Ready',
    subtitle: 'April Payout: ₹2,85,000',
    description: 'Your April earnings payout is ready for transfer. Processing date: Tomorrow',
    category: 'financial',
    icon: 'savings',
    iconBg: 'bg-green-100',
    read: false,
    timestamp: '6h ago',
    roles: ['partner'],
    actions: [
      { label: 'View Details', variant: 'primary' },
      { label: 'Withdraw', variant: 'secondary' },
    ],
  },

  // MAINTENANCE - Admin, Partner, Employee
  {
    id: 'maint-1',
    title: 'Scheduled Maintenance: Array Beta',
    subtitle: 'Scheduled for tomorrow 10:00 AM',
    description: 'Annual maintenance window scheduled. All systems will be offline.',
    category: 'maintenance',
    icon: 'construction',
    iconBg: 'bg-yellow-100',
    read: false,
    timestamp: '1h ago',
    roles: ['admin', 'partner', 'employee'],
    actions: [
      { label: 'Acknowledge', variant: 'primary' },
      { label: 'Reschedule', variant: 'secondary' },
    ],
  },
  {
    id: 'maint-2',
    title: 'Field Service Dispatch',
    subtitle: 'Team assigned to Site C-9',
    description: 'Maintenance team has been dispatched to Site C-9 for inspection.',
    category: 'maintenance',
    icon: 'assignment',
    iconBg: 'bg-purple-100',
    read: false,
    timestamp: '3h ago',
    roles: ['admin', 'employee'],
    actions: [
      { label: 'Track Team', variant: 'primary' },
      { label: 'Contact', variant: 'secondary' },
    ],
  },

  // UPDATES - ALL ROLES
  {
    id: 'update-1',
    title: 'v2.4 Firmware Deployed',
    subtitle: 'Generation-3 assets updated',
    description: 'Remote update completed for all Generation-3 assets. Performance optimizations applied.',
    category: 'update',
    icon: 'update',
    iconBg: 'bg-teal-100',
    read: true,
    timestamp: '1d ago',
    roles: ['super_admin', 'admin', 'partner', 'employee', 'customer'],
  },
  {
    id: 'update-2',
    title: 'Inventory Alert: PV Connectors',
    subtitle: '12 units remaining',
    description: 'Stock below threshold. Recommended action: Place new order.',
    category: 'update',
    icon: 'inventory_2',
    iconBg: 'bg-indigo-100',
    read: true,
    timestamp: '3h ago',
    roles: ['super_admin', 'admin'],
    actions: [
      { label: 'Order Now', variant: 'primary' },
      { label: 'View Stock', variant: 'secondary' },
    ],
  },
  {
    id: 'emp-1',
    title: 'Your Shift Assignment Updated',
    subtitle: 'Week of April 22-28',
    description: 'Your work schedule for next week has been updated. New shifts added.',
    category: 'update',
    icon: 'schedule',
    iconBg: 'bg-blue-100',
    read: false,
    timestamp: '30m ago',
    roles: ['employee'],
    actions: [
      { label: 'View Schedule', variant: 'primary' },
      { label: 'Request Change', variant: 'secondary' },
    ],
  },
  {
    id: 'cust-1',
    title: 'Your Installation is Complete',
    subtitle: 'System: 8.5 kW Residential',
    description: 'Your solar installation has been completed and is now operational.',
    category: 'update',
    icon: 'check_circle',
    iconBg: 'bg-green-100',
    read: false,
    timestamp: '2h ago',
    roles: ['customer'],
    actions: [
      { label: 'View System', variant: 'primary' },
      { label: 'Get Support', variant: 'secondary' },
    ],
  },

  // SYSTEM - Super Admin
  {
    id: 'sys-1',
    title: 'Database Backup Completed',
    subtitle: 'Full backup: 2.3 GB',
    description: 'Automatic database backup completed successfully. All data verified.',
    category: 'system',
    icon: 'backup',
    iconBg: 'bg-cyan-100',
    read: true,
    timestamp: '6h ago',
    roles: ['super_admin'],
    actions: [{ label: 'View Logs', variant: 'secondary' }],
  },
  {
    id: 'sys-2',
    title: 'API Rate Limit Warning',
    subtitle: '85% capacity used',
    description: 'API usage approaching rate limit. Consider implementing caching.',
    category: 'system',
    icon: 'api',
    iconBg: 'bg-rose-100',
    read: true,
    timestamp: 'Yesterday',
    roles: ['super_admin'],
    actions: [
      { label: 'Review Logs', variant: 'primary' },
      { label: 'Increase Limit', variant: 'secondary' },
    ],
  },
];

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notificationStates, setNotificationStates] = useState(
    MOCK_NOTIFICATIONS.reduce(
      (acc, notif) => {
        acc[notif.id] = notif.read;
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  // Filter notifications by role
  const roleNotifications = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter(notif =>
      notif.roles.includes(user?.role || '')
    );
  }, [user?.role]);

  // Filter by category
  const filteredNotifications = useMemo(() => {
    if (selectedCategory === 'all') {
      return roleNotifications;
    }
    return roleNotifications.filter(n => n.category === selectedCategory);
  }, [roleNotifications, selectedCategory]);

  // Get unread count
  const unreadCount = filteredNotifications.filter(n => !notificationStates[n.id]).length;

  // Category counts
  const categoryCounts = {
    all: roleNotifications.length,
    alert: roleNotifications.filter(n => n.category === 'alert').length,
    financial: roleNotifications.filter(n => n.category === 'financial').length,
    maintenance: roleNotifications.filter(n => n.category === 'maintenance').length,
    update: roleNotifications.filter(n => n.category === 'update').length,
    system: roleNotifications.filter(n => n.category === 'system').length,
  };

  const handleMarkAsRead = (id: string) => {
    setNotificationStates(prev => ({ ...prev, [id]: true }));
  };

  const handleMarkAllAsRead = () => {
    const newStates = { ...notificationStates };
    filteredNotifications.forEach(n => {
      newStates[n.id] = true;
    });
    setNotificationStates(newStates);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      alert: 'notifications_active',
      financial: 'payments',
      maintenance: 'construction',
      update: 'update',
      system: 'settings',
    };
    return icons[category] || 'notifications';
  };

  const categories = [
    { id: 'all', label: 'All Notifications' },
    { id: 'alert', label: 'Alerts' },
    { id: 'financial', label: 'Financial' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'update', label: 'Updates' },
    { id: 'system', label: 'System' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1A365D] flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl">notifications</span>
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-[#1A365D] text-white font-semibold rounded-lg hover:bg-[#0F2544] transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">done_all</span>
                Mark All as Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar - Category Filter */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
            <nav className="space-y-1 p-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between font-medium ${
                    selectedCategory === category.id
                      ? 'bg-[#1A365D] text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">
                      {getCategoryIcon(category.id)}
                    </span>
                    {category.label}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      selectedCategory === category.id
                        ? 'bg-white/30'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {categoryCounts[category.id as keyof typeof categoryCounts]}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 inline-block">
                notifications_none
              </span>
              <h3 className="text-xl font-semibold text-gray-900 mt-4">No notifications</h3>
              <p className="text-gray-600 mt-2">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`bg-white rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                    notificationStates[notification.id]
                      ? 'border-gray-200 opacity-70'
                      : 'border-[#1A365D]/20 ring-1 ring-[#1A365D]/10'
                  }`}
                >
                  <div className="flex items-start gap-4 p-5">
                    {/* Unread Indicator */}
                    {!notificationStates[notification.id] && (
                      <div className="w-1 h-1 rounded-full bg-[#1A365D] flex-shrink-0 mt-2" />
                    )}

                    {/* Icon */}
                    <div className={`${notification.iconBg} rounded-lg p-3 flex-shrink-0`}>
                      <span className="material-symbols-outlined text-xl">
                        {notification.icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3
                            className={`font-semibold text-gray-900 ${
                              notificationStates[notification.id]
                                ? 'text-base'
                                : 'text-lg font-bold'
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600">{notification.subtitle}</p>
                        </div>
                        <span className="text-xs font-medium text-gray-500 flex-shrink-0 whitespace-nowrap">
                          {notification.timestamp}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {notification.description}
                      </p>

                      {/* Actions */}
                      {notification.actions && notification.actions.length > 0 && (
                        <div className="flex items-center gap-3 flex-wrap">
                          {notification.actions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={e => {
                                e.stopPropagation();
                              }}
                              className={`text-xs font-bold py-1.5 px-3 rounded transition-colors ${
                                action.variant === 'primary'
                                  ? 'text-white bg-[#1A365D] hover:bg-[#0F2544]'
                                  : 'text-[#1A365D] bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Read Status Indicator */}
                    {!notificationStates[notification.id] && (
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-[#1A365D]" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
