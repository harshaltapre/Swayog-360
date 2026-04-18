import type { KPIData, ActivityItem } from '../../types';

const kpis: KPIData[] = [
  { label: 'New Customers (MTD)', value: 142, icon: 'group_add', trend: { direction: 'up', value: '12%' }, accent: true },
  { label: 'Total Revenue', value: '₹28.5L', icon: 'payments', trend: { direction: 'up', value: '8.4%' }, accent: true },
  { label: 'Active Employees', value: 45, icon: 'badge', trend: { direction: 'up', value: '3%' }, accent: true },
  { label: 'Pending Complaints', value: 18, icon: 'report_problem', variant: 'warning' },
  { label: 'Low Stock Items', value: 7, icon: 'inventory_2', variant: 'error' },
  { label: 'Partner Payouts Due', value: 5, icon: 'account_balance', variant: 'warning' },
];

const activities: ActivityItem[] = [
  { id: '1', title: 'Project Alpha deployed', description: 'System automated final check. All solar arrays online.', time: '10 mins ago', icon: 'check_circle', type: 'success' },
  { id: '2', title: 'Inverter Alert: Hub B', description: 'Efficiency drop detected. Technician ticket automatically created.', time: '45 mins ago', icon: 'warning', type: 'warning' },
  { id: '3', title: 'New Partner Onboarded', description: 'EcoTech Solutions access granted to portal.', time: '2 hours ago', icon: 'person_add', type: 'info' },
  { id: '4', title: 'Shipment Received', description: '50x Mono Panels added to central warehouse inventory.', time: '5 hours ago', icon: 'inventory', type: 'info' },
  { id: '5', title: 'Q3 Report Generated', description: 'Financial summary ready for review by admin team.', time: '1 day ago', icon: 'description', type: 'info' },
  { id: '6', title: 'Customer Onboarded', description: 'Sunita Deshpande — 5kW residential installation in Nagpur.', time: '1 day ago', icon: 'person_add', type: 'success' },
];

const typeStyles = {
  success: 'bg-on-tertiary-container/10 text-on-tertiary-fixed-variant',
  warning: 'bg-error-container/50 text-error',
  error: 'bg-error-container text-on-error-container',
  info: 'bg-primary/10 text-primary',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-display text-primary">Operational Overview</h2>
          <p className="text-on-surface-variant mt-1 text-sm">System intelligence and daily metrics for Swayog Energy.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-surface-container-low text-primary font-medium rounded-xl hover:bg-surface-container transition-colors text-sm">
            Add Customer
          </button>
          <button className="px-5 py-2.5 bg-primary text-on-primary font-medium rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-sm">add</span>
            Create Project
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`bg-surface-container-lowest p-6 rounded-2xl relative overflow-hidden group hover:shadow-sm transition-shadow ${kpi.accent ? 'accent-bar-left' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-label-sm text-on-surface-variant">{kpi.label}</h3>
              <span className="material-symbols-outlined text-on-surface-variant/50">{kpi.icon}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className={`text-4xl font-bold tracking-tight ${kpi.variant === 'error' ? 'text-error' : 'text-primary'}`}>
                {kpi.value}
              </span>
              {kpi.trend && (
                <span className={`text-xs font-medium flex items-center ${kpi.trend.direction === 'up' ? 'text-on-tertiary-container' : 'text-error'}`}>
                  <span className="material-symbols-outlined text-[10px] font-bold">
                    {kpi.trend.direction === 'up' ? 'arrow_upward' : 'arrow_downward'}
                  </span>
                  {kpi.trend.value}
                </span>
              )}
              {kpi.variant === 'warning' && (
                <span className="text-xs font-medium text-on-surface-variant">Action required</span>
              )}
              {kpi.variant === 'error' && (
                <span className="text-xs font-medium text-error">Critical items</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-title text-primary">Revenue Trends</h3>
              <button className="text-xs font-medium text-primary bg-surface-container-low px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors">
                This Quarter
              </button>
            </div>
            <div className="h-56 bg-surface-container-low rounded-xl flex items-end justify-between px-4 pb-4 pt-8 relative overflow-hidden">
              {/* Grid lines */}
              <div className="absolute top-1/4 left-0 right-0 border-t border-outline-variant/10" />
              <div className="absolute top-2/4 left-0 right-0 border-t border-outline-variant/10" />
              <div className="absolute top-3/4 left-0 right-0 border-t border-outline-variant/10" />
              {/* Bars */}
              {[40, 55, 45, 70, 65, 85, 95].map((h, i) => (
                <div
                  key={i}
                  className={`w-[10%] rounded-t transition-all duration-300 hover:opacity-80 ${
                    i >= 5 ? (i === 6 ? 'bg-on-tertiary-container' : 'bg-primary') : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3 px-2 text-[10px] text-on-surface-variant/60">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>

          {/* Complaint Volume */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-title text-primary">Weekly Complaint Volume</h3>
              <button className="text-xs font-medium text-primary bg-surface-container-low px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors">
                Last 7 days
              </button>
            </div>
            <div className="h-32 bg-gradient-to-r from-surface-container-high to-surface-container-low rounded-xl flex items-end justify-between px-6 pb-4 pt-4 gap-3">
              {[30, 50, 25, 65, 45, 35, 55].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors" style={{ height: `${h * 1.2}px` }} />
                  <span className="text-[9px] text-on-surface-variant/50">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-surface-container-lowest rounded-2xl flex flex-col overflow-hidden ghost-border">
          <div className="p-5 pb-3 border-b border-surface-container-low">
            <h3 className="text-title text-primary">Recent Activity</h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[520px]">
            {activities.map((item, i) => (
              <div
                key={item.id}
                className={`p-4 px-5 flex items-start gap-3 hover:bg-surface-container-low transition-colors cursor-pointer ${
                  i % 2 === 1 ? 'bg-surface-container-low/50' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${typeStyles[item.type]} flex items-center justify-center shrink-0 mt-0.5`}>
                  <span className="material-symbols-outlined text-sm">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-primary font-medium truncate">{item.title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{item.description}</p>
                  <span className="text-[10px] text-on-surface-variant/50 mt-1 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-surface-container-lowest border-t border-surface-container-low text-center">
            <button className="text-xs font-medium text-primary hover:underline">View All Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
}
