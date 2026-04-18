import { useAuthStore } from '../store';

interface SupportCategory {
  icon: string;
  title: string;
  description: string;
  links: Array<{ label: string; href: string }>;
}

interface RoleSupportConfig {
  title: string;
  subtitle: string;
  categories: SupportCategory[];
  contactOptions: Array<{ icon: string; title: string; description: string }>;
  features: string[];
}

const ROLE_SUPPORT_CONFIG: Record<string, RoleSupportConfig> = {
  super_admin: {
    title: 'Platform Administration Support',
    subtitle: 'Comprehensive support for system-wide configuration, user management, and platform governance',
    categories: [
      {
        icon: 'admin_panel_settings',
        title: 'System Administration',
        description: 'Configure platform settings, manage user accounts, and maintain system health across all organizations.',
        links: [
          { label: 'User Management Guide', href: '#' },
          { label: 'Role & Permissions Setup', href: '#' },
          { label: 'Audit Logs & Compliance', href: '#' },
        ],
      },
      {
        icon: 'security',
        title: 'Security & Compliance',
        description: 'Implement security policies, manage encryption, and ensure regulatory compliance across the platform.',
        links: [
          { label: 'Security Best Practices', href: '#' },
          { label: 'Compliance Documentation', href: '#' },
          { label: 'Data Protection Policies', href: '#' },
        ],
      },
      {
        icon: 'analytics',
        title: 'System Analytics',
        description: 'Monitor platform performance, usage metrics, and system health indicators in real-time.',
        links: [
          { label: 'Performance Monitoring', href: '#' },
          { label: 'Usage Reports', href: '#' },
          { label: 'System Alerts Configuration', href: '#' },
        ],
      },
    ],
    contactOptions: [
      { icon: 'forum', title: 'Admin Portal Chat', description: 'Avg. wait time: 1 min' },
      { icon: 'mail', title: 'Priority Email', description: 'Response within 30 mins' },
      { icon: 'call', title: 'Executive Support', description: '+1 (800) SOLAR-ADMIN' },
    ],
    features: [
      '24/7 Premium Support',
      'Dedicated Account Manager',
      'Custom Integration Support',
      'SLA Guarantee: 99.9% Uptime',
    ],
  },
  admin: {
    title: 'Organization Administration Support',
    subtitle: 'Support for managing your organization, teams, and operational resources',
    categories: [
      {
        icon: 'people',
        title: 'Team Management',
        description: 'Manage team members, assign roles, and configure departmental settings for your organization.',
        links: [
          { label: 'Add Team Members', href: '#' },
          { label: 'Department Setup', href: '#' },
          { label: 'Permission Levels', href: '#' },
        ],
      },
      {
        icon: 'wb_sunny',
        title: 'Asset Management',
        description: 'Configure and monitor solar assets, track installations, and manage asset lifecycle.',
        links: [
          { label: 'Asset Onboarding', href: '#' },
          { label: 'Installation Tracking', href: '#' },
          { label: 'Maintenance Schedules', href: '#' },
        ],
      },
      {
        icon: 'trending_up',
        title: 'Performance Reports',
        description: 'Generate reports on energy output, ROI, and operational efficiency for your organization.',
        links: [
          { label: 'Report Templates', href: '#' },
          { label: 'Custom Analytics', href: '#' },
          { label: 'Data Export Options', href: '#' },
        ],
      },
    ],
    contactOptions: [
      { icon: 'forum', title: 'Live Chat', description: 'Avg. wait time: 3 mins' },
      { icon: 'mail', title: 'Email Support', description: 'Response within 2 hours' },
      { icon: 'phone', title: 'Phone Support', description: '+1 (800) SOLAR-HELP' },
    ],
    features: [
      'Business Hours Support',
      'Dedicated Support Team',
      'Monthly Business Reviews',
      'Priority Ticket Handling',
    ],
  },
  partner: {
    title: 'Partner Portal Support',
    subtitle: 'Specialized support for solar installers and service partners',
    categories: [
      {
        icon: 'engineering',
        title: 'Installation & Projects',
        description: 'Technical guidance for solar installations, project management, and deployment procedures.',
        links: [
          { label: 'Installation Manual', href: '#' },
          { label: 'Equipment Compatibility', href: '#' },
          { label: 'Safety Certifications', href: '#' },
        ],
      },
      {
        icon: 'payments',
        title: 'Invoicing & Earnings',
        description: 'Manage project invoices, track payments, and understand your earnings and commission structure.',
        links: [
          { label: 'Invoice Management', href: '#' },
          { label: 'Payment Schedule', href: '#' },
          { label: 'Commission Calculator', href: '#' },
        ],
      },
      {
        icon: 'task_alt',
        title: 'Project Pipeline',
        description: 'Track project status, manage timelines, and coordinate with customers and our team.',
        links: [
          { label: 'Project Best Practices', href: '#' },
          { label: 'Timeline Management', href: '#' },
          { label: 'Quality Checklists', href: '#' },
        ],
      },
    ],
    contactOptions: [
      { icon: 'forum', title: 'Partner Chat', description: 'Avg. wait time: 5 mins' },
      { icon: 'mail', title: 'Partner Email', description: 'Response within 4 hours' },
      { icon: 'phone', title: 'Partner Hotline', description: '+1 (800) SOLAR-PARTNER' },
    ],
    features: [
      'Partner-Only Resources',
      'Training & Certification',
      'Revenue Optimization Tips',
      'Marketing Materials Access',
    ],
  },
  employee: {
    title: 'Employee Support Center',
    subtitle: 'Support for field operations, maintenance, and daily work tasks',
    categories: [
      {
        icon: 'assignment',
        title: 'Task Management',
        description: 'Get help with task assignments, scheduling, and work coordination with your team.',
        links: [
          { label: 'Task Assignment Guide', href: '#' },
          { label: 'Schedule Coordination', href: '#' },
          { label: 'Time Tracking', href: '#' },
        ],
      },
      {
        icon: 'build',
        title: 'Field Operations',
        description: 'Technical support for field maintenance, equipment troubleshooting, and safety procedures.',
        links: [
          { label: 'Maintenance Procedures', href: '#' },
          { label: 'Safety Guidelines', href: '#' },
          { label: 'Equipment Documentation', href: '#' },
        ],
      },
      {
        icon: 'event_note',
        title: 'Attendance & Scheduling',
        description: 'Manage your work schedule, attendance records, and time-off requests.',
        links: [
          { label: 'Shift Scheduling', href: '#' },
          { label: 'Time-Off Requests', href: '#' },
          { label: 'Attendance Policies', href: '#' },
        ],
      },
    ],
    contactOptions: [
      { icon: 'forum', title: 'Team Chat', description: 'Avg. wait time: 10 mins' },
      { icon: 'mail', title: 'Support Email', description: 'Response within 8 hours' },
      { icon: 'phone', title: 'Supervisor Line', description: '+1 (800) SOLAR-TEAM' },
    ],
    features: [
      'Daily Support',
      'Field Team Resources',
      'Safety Training Materials',
      'Performance Tracking',
    ],
  },
  customer: {
    title: 'Customer Support Center',
    subtitle: 'Support for solar system monitoring, maintenance, and customer services',
    categories: [
      {
        icon: 'home',
        title: 'System Monitoring',
        description: 'Monitor your solar system performance, track energy production, and view real-time metrics.',
        links: [
          { label: 'Performance Dashboard Guide', href: '#' },
          { label: 'Energy Insights', href: '#' },
          { label: 'System Alerts', href: '#' },
        ],
      },
      {
        icon: 'build_circle',
        title: 'Maintenance & Service',
        description: 'Schedule maintenance, report issues, and track service requests for your solar installation.',
        links: [
          { label: 'Maintenance Schedule', href: '#' },
          { label: 'Service Request Form', href: '#' },
          { label: 'Troubleshooting Guide', href: '#' },
        ],
      },
      {
        icon: 'receipt_long',
        title: 'Billing & Subscriptions',
        description: 'Manage your subscription, view invoices, and track energy savings and ROI.',
        links: [
          { label: 'Billing Overview', href: '#' },
          { label: 'Invoice History', href: '#' },
          { label: 'ROI Calculator', href: '#' },
        ],
      },
    ],
    contactOptions: [
      { icon: 'forum', title: 'Live Chat', description: 'Avg. wait time: 5 mins' },
      { icon: 'mail', title: 'Email Support', description: 'Response within 6 hours' },
      { icon: 'phone', title: 'Customer Service', description: '+1 (800) SOLAR-HELP' },
    ],
    features: [
      ' 24/5 Customer Support',
      'System Performance Alerts',
      'ROI Tracking Tools',
      'Maintenance Reminders',
    ],
  },
};

export default function SupportPage() {
  const { user } = useAuthStore();
  const role = user?.role || 'customer';
  const config = ROLE_SUPPORT_CONFIG[role] || ROLE_SUPPORT_CONFIG.customer;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section - Responsive */}
      <div className="relative w-full py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight">
            {config.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl">
            {config.subtitle}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Search Bar - Responsive */}
        <div className="mb-12 sm:mb-16">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg sm:text-xl">
              search
            </span>
            <input
              className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-4 sm:pr-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-600 outline-none transition-all"
              placeholder="Search for help, guides, or documentation..."
              type="text"
            />
          </div>
        </div>

        {/* Support Categories Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {config.categories.map((category, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-900 dark:text-blue-400 mb-4 sm:mb-6 group-hover:bg-blue-900 group-hover:text-white dark:group-hover:bg-blue-600 transition-colors">
                <span className="material-symbols-outlined text-2xl sm:text-3xl">{category.icon}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">
                {category.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 leading-relaxed">
                {category.description}
              </p>
              <ul className="space-y-2 sm:space-y-3">
                {category.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm text-blue-900 dark:text-blue-400 font-medium hover:underline flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Ticket Section - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {/* Contact Options */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 rounded-xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Get in Touch</h3>
                <p className="text-blue-100 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">
                  Our dedicated support team is ready to help you with your questions and concerns.
                </p>

                <div className="space-y-3 sm:space-y-4">
                  {config.contactOptions.map((option, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 sm:gap-4 bg-white/10 p-3 sm:p-4 rounded-lg backdrop-blur hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-blue-500/30 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-sm">{option.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm">{option.title}</p>
                        <p className="text-xs text-blue-100">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Ticket Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Submit a Support Ticket
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 sm:mb-8">
                Can't find the answer? Submit a detailed ticket and our support team will assist you shortly.
              </p>

              <form className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Category
                    </label>
                    <select className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 sm:px-4 py-2.5 focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-600 outline-none">
                      {config.categories.map((cat, idx) => (
                        <option key={idx}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Priority
                    </label>
                    <select className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 sm:px-4 py-2.5 focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-600 outline-none">
                      <option>Low - General Question</option>
                      <option>Medium - Issue Impacting Work</option>
                      <option>High - Service Degradation</option>
                      <option>Critical - Service Down</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 sm:px-4 py-2.5 focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-600 outline-none"
                    placeholder="Brief description of your issue"
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 sm:px-4 py-2.5 focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-600 outline-none"
                    placeholder="Provide detailed information about your issue..."
                    rows={4}
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-6">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className="material-symbols-outlined text-lg">attach_file</span>
                    <span>Attach files (Max 20MB)</span>
                  </div>
                  <button
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-900 dark:bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-500 shadow-sm transition-all active:scale-95 text-sm"
                    type="submit"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Key Features - Responsive */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 sm:p-8 border border-blue-200 dark:border-blue-900/50">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-900 dark:text-blue-400">verified_user</span>
            Why Choose Our Support
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {config.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-900 dark:bg-blue-400 rounded-full flex-shrink-0"></div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer - Responsive */}
      <footer className="bg-slate-900 dark:bg-black text-white mt-16 sm:mt-20 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Swayog Energy</h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Providing world-class solar operations support with role-specific resources for every user.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase mb-3 sm:mb-4 tracking-wide">Resources</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition">Status Page</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase mb-4 tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-400">
          <p>© 2024 Swayog Energy. All rights reserved. | Role-Based Support for {user?.role || 'Guest'}</p>
        </div>
      </footer>
    </div>
  );
}
