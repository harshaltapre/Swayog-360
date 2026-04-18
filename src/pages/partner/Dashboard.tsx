const kpis = [
  { label: 'Active Projects', value: 12, icon: 'solar_power', trend: '+3', trendLabel: 'this month' },
  { label: 'Total Earnings', value: '₹8.4L', icon: 'payments', trend: '+15%', trendLabel: 'vs last quarter' },
  { label: 'Pending Payouts', value: '₹1.2L', icon: 'account_balance_wallet', detail: '3 invoices pending' },
  { label: 'Unread Messages', value: 5, icon: 'mail', detail: 'Latest from Swayog Admin' },
];

const projects = [
  { id: 'PRJ-001', name: 'Nagpur Residential Cluster', status: 'In Progress', completion: 72, capacity: '50kW', customer: 'Mahesh Raut', deadline: '15 May 2025' },
  { id: 'PRJ-002', name: 'Pune Commercial Tower', status: 'Planning', completion: 15, capacity: '200kW', customer: 'TechPark Solutions', deadline: '30 Jun 2025' },
  { id: 'PRJ-003', name: 'Mumbai Housing Society', status: 'Installation', completion: 45, capacity: '100kW', customer: 'Green Valley Society', deadline: '20 May 2025' },
  { id: 'PRJ-004', name: 'Nashik Farm Array', status: 'Completed', completion: 100, capacity: '75kW', customer: 'Vinay Agri Farms', deadline: '01 Apr 2025' },
];

const statusColors: Record<string, string> = {
  'In Progress': 'bg-primary/10 text-primary',
  'Planning': 'bg-secondary-container text-on-secondary-container',
  'Installation': 'bg-on-tertiary-container/10 text-on-tertiary-fixed-variant',
  'Completed': 'bg-on-tertiary-container/15 text-on-tertiary-container',
};

export default function PartnerDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-display text-primary">Partner Dashboard</h2>
          <p className="text-on-surface-variant mt-1 text-sm">Performance snapshot and project pipeline — EcoTech Solutions</p>
        </div>
        <button className="px-5 py-2.5 bg-primary text-on-primary font-medium rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-sm">download</span>
          Export Report
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-surface-container-lowest p-6 rounded-2xl relative overflow-hidden accent-bar-left">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-label-sm text-on-surface-variant">{kpi.label}</h3>
              <span className="material-symbols-outlined text-on-surface-variant/50">{kpi.icon}</span>
            </div>
            <span className="text-3xl font-bold text-primary tracking-tight">{kpi.value}</span>
            {kpi.trend && (
              <p className="text-xs text-on-tertiary-container font-medium mt-1">
                <span className="material-symbols-outlined text-[10px]">trending_up</span> {kpi.trend} {kpi.trendLabel}
              </p>
            )}
            {kpi.detail && <p className="text-xs text-on-surface-variant mt-1">{kpi.detail}</p>}
          </div>
        ))}
      </div>

      {/* Projects Pipeline */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
        <div className="p-6 pb-4 flex justify-between items-center">
          <h3 className="text-title text-primary">Project Pipeline</h3>
          <div className="flex gap-2">
            <button className="text-xs font-medium text-primary bg-surface-container-low px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors">All Projects</button>
            <button className="text-xs font-medium text-on-surface-variant px-3 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors">Active Only</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-container-low">
                <th className="text-left text-label-sm text-on-surface-variant px-6 py-3">Project</th>
                <th className="text-left text-label-sm text-on-surface-variant px-6 py-3">Customer</th>
                <th className="text-left text-label-sm text-on-surface-variant px-6 py-3">Capacity</th>
                <th className="text-left text-label-sm text-on-surface-variant px-6 py-3">Status</th>
                <th className="text-left text-label-sm text-on-surface-variant px-6 py-3">Progress</th>
                <th className="text-left text-label-sm text-on-surface-variant px-6 py-3">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.id} className={`hover:bg-surface-container-low/50 transition-colors cursor-pointer ${i % 2 === 1 ? 'bg-surface-container-low/30' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-primary">{p.name}</p>
                    <p className="text-xs text-on-surface-variant/60">{p.id}</p>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{p.customer}</td>
                  <td className="px-6 py-4 text-on-surface-variant font-medium">{p.capacity}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[p.status] || ''}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${p.completion === 100 ? 'bg-on-tertiary-container' : 'bg-primary'}`}
                          style={{ width: `${p.completion}%` }}
                        />
                      </div>
                      <span className="text-xs text-on-surface-variant">{p.completion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-xs">{p.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Earnings + Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Summary */}
        <div className="bg-surface-container-lowest rounded-2xl p-6">
          <h3 className="text-title text-primary mb-4">Earnings Summary</h3>
          <div className="space-y-3">
            {[
              { month: 'April 2025', amount: '₹2.1L', status: 'Paid', statusColor: 'text-on-tertiary-container' },
              { month: 'March 2025', amount: '₹1.8L', status: 'Paid', statusColor: 'text-on-tertiary-container' },
              { month: 'February 2025', amount: '₹2.4L', status: 'Paid', statusColor: 'text-on-tertiary-container' },
              { month: 'January 2025', amount: '₹1.2L', status: 'Pending', statusColor: 'text-error' },
            ].map(item => (
              <div key={item.month} className="flex items-center justify-between p-3 bg-surface rounded-xl ghost-border">
                <span className="text-sm font-medium text-primary">{item.month}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-primary">{item.amount}</span>
                  <span className={`text-xs font-medium ${item.statusColor}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-surface-container-lowest rounded-2xl p-6">
          <h3 className="text-title text-primary mb-4">Recent Messages</h3>
          <div className="space-y-3">
            {[
              { from: 'Swayog Admin', message: 'New project assigned: Pune Commercial Tower. Please review the site requirements.', time: '2 hrs ago', unread: true },
              { from: 'Finance Team', message: 'Payout for March has been processed. Check your bank account.', time: '1 day ago', unread: false },
              { from: 'Support', message: 'Customer escalation for Project PRJ-001. Please respond ASAP.', time: '2 days ago', unread: false },
            ].map((msg, i) => (
              <div key={i} className={`p-4 rounded-xl transition-colors cursor-pointer ${msg.unread ? 'bg-primary/5 ghost-border' : 'bg-surface hover:bg-surface-container-low ghost-border'}`}>
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-semibold text-primary flex items-center gap-2">
                    {msg.from}
                    {msg.unread && <span className="w-2 h-2 rounded-full bg-on-tertiary-container" />}
                  </p>
                  <span className="text-[10px] text-on-surface-variant/60">{msg.time}</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
