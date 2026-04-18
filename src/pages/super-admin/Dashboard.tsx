import { useState } from 'react';

const TABS = ['Overview', 'Financials', 'Users', 'Employees', 'Partners', 'Inventory', 'Complaints', 'Zones', 'System'];

const kpis = [
  { label: 'Total Active Users', value: '24,892', trend: '+12%', icon: 'group' },
  { label: 'Global Revenue (YTD)', value: '₹4.2Cr', trend: '+8.4%', icon: 'payments' },
  { label: 'System Status', value: 'Healthy', detail: 'All core services operational.', icon: 'check_circle', isStatus: true },
];

const auditLogs = [
  { message: 'Cache Cleared (EU-West)', actor: 'System Admin', time: '2 mins ago', color: 'bg-on-tertiary-container' },
  { message: 'New Partner Onboarded', actor: 'Auto-System', time: '1 hr ago', color: 'bg-secondary-fixed-dim' },
  { message: 'Failed Sync Attempt', actor: 'Node 4A', time: '3 hrs ago', color: 'bg-error' },
  { message: 'Firmware Update Pushed', actor: 'Global', time: '5 hrs ago', color: 'bg-on-tertiary-container' },
  { message: 'User Accounts Audited', actor: 'System Admin', time: '8 hrs ago', color: 'bg-primary-fixed-dim' },
];

const systemActions = [
  {
    title: 'Force Sync All Data',
    desc: 'Manually triggers a synchronization cycle across all global edge nodes.',
    action: 'Initiate Sync',
    variant: 'primary' as const,
  },
  {
    title: 'Clear System Cache',
    desc: 'Flushes Redis caches globally. May cause temporary latency spikes.',
    action: 'Clear Cache',
    variant: 'outlined' as const,
  },
  {
    title: 'Export Platform Data',
    desc: 'Export complete platform data as CSV or JSON format.',
    action: 'Export Data',
    variant: 'outlined' as const,
  },
  {
    title: 'Purge Audit Logs',
    desc: 'Remove audit logs older than specified days. Maximum: 365 days.',
    action: 'Purge Logs',
    variant: 'outlined' as const,
  },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('System');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-display text-primary">Global Governance</h2>
        <p className="text-on-surface-variant font-medium text-lg mt-1">System Health & Operations Control Center</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-surface-container-low overflow-x-auto pb-[1px]">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-surface-container-lowest rounded-2xl p-6 relative overflow-hidden accent-bar-left">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{kpi.label}</h3>
              <span className={`material-symbols-outlined p-2 rounded-xl ${kpi.isStatus ? 'text-on-tertiary-container bg-on-tertiary-container/10' : 'text-primary-container bg-surface-container-low'}`}>
                {kpi.icon}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">{kpi.value}</span>
              {kpi.trend && (
                <span className="text-sm font-medium text-on-tertiary-container flex items-center">
                  <span className="material-symbols-outlined text-sm">trending_up</span> {kpi.trend}
                </span>
              )}
            </div>
            {kpi.detail && (
              <span className="text-sm font-medium text-on-surface-variant mt-1 block">{kpi.detail}</span>
            )}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* System Controls */}
        <div className="col-span-1 lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-primary mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-error">warning</span>
                Critical System Operations
              </h3>
              <p className="text-on-surface-variant text-sm">High-level administrative actions. These actions affect all instances globally.</p>
            </div>

            <div className="flex flex-col gap-3">
              {systemActions.map(action => (
                <div key={action.title} className="flex items-center justify-between p-5 bg-surface rounded-xl ghost-border hover:bg-surface-container-low transition-colors">
                  <div>
                    <h4 className="text-base font-semibold text-primary mb-0.5">{action.title}</h4>
                    <p className="text-xs text-on-surface-variant">{action.desc}</p>
                  </div>
                  <button className={`px-5 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                    action.variant === 'primary'
                      ? 'bg-primary text-on-primary hover:opacity-90 shadow-sm'
                      : 'bg-surface-container-lowest text-primary border-2 border-primary/20 hover:border-primary/40'
                  }`}>
                    {action.action}
                  </button>
                </div>
              ))}

              {/* Maintenance Mode */}
              <div className={`flex items-center justify-between p-5 rounded-xl ${maintenanceMode ? 'bg-error/10 ring-1 ring-error/30' : 'bg-error-container/20 ghost-border'}`}>
                <div>
                  <h4 className={`text-base font-semibold mb-0.5 ${maintenanceMode ? 'text-error' : 'text-error'}`}>
                    {maintenanceMode ? '🔴 Maintenance Mode Active' : 'Enable Maintenance Mode'}
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    {maintenanceMode ? 'Non-admin users are locked out.' : 'Locks out non-admin users and displays maintenance splash screen.'}
                  </p>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${maintenanceMode ? 'bg-error' : 'bg-secondary-fixed-dim'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs Sidebar */}
        <div className="col-span-1 lg:col-span-4">
          <div className="bg-surface-container-low rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">list_alt</span>
              Recent Audit Logs
            </h3>
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
              {auditLogs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full ${log.color} mt-1.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm font-medium text-primary">{log.message}</p>
                    <p className="text-xs text-on-surface-variant">{log.actor} • {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 text-sm font-medium text-primary border-t border-outline-variant/20 pt-4 hover:text-primary-container transition-colors">
              View Full Logs →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
