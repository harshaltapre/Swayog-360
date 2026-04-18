import { useState } from 'react';
import RaiseServiceRequestModal from '../../components/modals/RaiseServiceRequestModal';

const kpis = [
  { label: 'System Status', value: 'Active', icon: 'solar_power', detail: '5.2kW generating power', isGreen: true },
  { label: 'Open Service Requests', value: 1, icon: 'support_agent', detail: 'Ticket #892 — In Progress' },
  { label: 'Next Payment Due', value: '₹4,500', icon: 'receipt_long', detail: 'Due: 25 Apr 2025' },
  { label: 'Total Energy Saved', value: '12.8 MWh', icon: 'bolt', trend: '+8%', isGreen: true },
];

const installations = [
  { name: '5kW Residential System', location: 'Nagpur, Dharampeth', installed: '15 Jan 2024', status: 'Active', generation: '18.2 kWh/day' },
];

export default function CustomerDashboard() {
  const [serviceRequestModalOpen, setServiceRequestModalOpen] = useState(false);

  const handleServiceRequestSubmit = (data: { title: string; description: string; priority: 'low' | 'medium' | 'high' | 'critical'; category: string; attachment?: File }) => {
    console.log('New service request:', data);
    setServiceRequestModalOpen(false);
    // TODO: Save to database
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-display text-primary">Welcome, Sunita 🌞</h2>
            <p className="text-on-surface-variant mt-1 text-sm">Your solar energy dashboard and self-service portal.</p>
          </div>
          <button
            onClick={() => setServiceRequestModalOpen(true)}
            className="px-5 py-2.5 bg-primary text-on-primary font-medium rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-sm">support_agent</span>
            Raise Service Request
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
          {kpis.map(kpi => (
            <div key={kpi.label} className={`bg-surface-container-lowest p-6 rounded-2xl relative overflow-hidden ${kpi.isGreen ? 'accent-bar-left' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-label-sm text-on-surface-variant">{kpi.label}</h3>
                <span className={`material-symbols-outlined ${kpi.isGreen ? 'text-on-tertiary-container' : 'text-on-surface-variant/50'}`}>
                  {kpi.icon}
                </span>
              </div>
              <span className={`text-3xl font-bold tracking-tight ${kpi.isGreen ? 'text-on-tertiary-container' : 'text-primary'}`}>
                {kpi.value}
              </span>
              {kpi.trend && <p className="text-xs text-on-tertiary-container font-medium mt-1">↑ {kpi.trend} this month</p>}
              {kpi.detail && <p className="text-xs text-on-surface-variant mt-1">{kpi.detail}</p>}
            </div>
          ))}
        </div>

        {/* System Overview + Energy Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Installation Card */}
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
            <div className="gradient-hero p-6 text-on-primary">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-2xl">solar_power</span>
                <h3 className="text-lg font-bold">My Solar System</h3>
              </div>
              {installations.map(inst => (
                <div key={inst.name} className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm opacity-80">System</span>
                    <span className="text-sm font-semibold">{inst.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm opacity-80">Location</span>
                    <span className="text-sm font-semibold">{inst.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm opacity-80">Installed</span>
                    <span className="text-sm font-semibold">{inst.installed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm opacity-80">Avg. Generation</span>
                    <span className="text-sm font-semibold text-on-tertiary-container">{inst.generation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">Status</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
                      {inst.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 flex gap-2">
              <button className="flex-1 py-2.5 text-sm font-medium text-primary bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors">
                View Details
              </button>
              <button className="flex-1 py-2.5 text-sm font-medium text-primary bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors">
                Download Report
              </button>
            </div>
          </div>

          {/* Energy Generation Chart */}
          <div className="bg-surface-container-lowest rounded-2xl p-6">
            <h3 className="text-title text-primary mb-4">Daily Energy Generation (Last 7 Days)</h3>
            <div className="h-48 bg-surface-container-low rounded-xl flex items-end justify-between px-4 pb-4 gap-2 relative">
              <div className="absolute top-1/4 left-0 right-0 border-t border-outline-variant/10" />
              <div className="absolute top-2/4 left-0 right-0 border-t border-outline-variant/10" />
              <div className="absolute top-3/4 left-0 right-0 border-t border-outline-variant/10" />
              {[
                { day: '11 Apr', value: 70 },
                { day: '12 Apr', value: 85 },
                { day: '13 Apr', value: 60 },
                { day: '14 Apr', value: 90 },
                { day: '15 Apr', value: 75 },
                { day: '16 Apr', value: 95 },
                { day: '17 Apr', value: 80 },
              ].map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 z-10">
                  <div className="w-full bg-on-tertiary-container/30 hover:bg-on-tertiary-container/50 rounded-t transition-colors" style={{ height: `${d.value * 1.5}px` }} />
                  <span className="text-[8px] text-on-surface-variant/50">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm">
              <div>
                <span className="text-on-surface-variant">Average Daily</span>
                <p className="text-lg font-bold text-primary">18.2 kWh</p>
              </div>
              <div className="text-right">
                <span className="text-on-surface-variant">This Month Total</span>
                <p className="text-lg font-bold text-on-tertiary-container">309.4 kWh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-surface-container-lowest rounded-2xl p-6">
            <h3 className="text-title text-primary mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { icon: 'receipt_long', title: 'Invoice #INV-2025-048 generated', detail: '₹4,500 — Due 25 Apr 2025', time: '2 days ago', type: 'info' as const },
                { icon: 'build', title: 'Service request #892 updated', detail: 'Status changed to In Progress', time: '3 days ago', type: 'warning' as const },
                { icon: 'payments', title: 'Payment received — ₹4,500', detail: 'Invoice #INV-2025-046 cleared', time: '1 week ago', type: 'success' as const },
                { icon: 'update', title: 'Firmware update completed', detail: 'Inverter firmware v2.4.1 applied', time: '2 weeks ago', type: 'info' as const },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.type === 'success' ? 'bg-on-tertiary-container/10 text-on-tertiary-fixed-variant' :
                    item.type === 'warning' ? 'bg-error-container/50 text-error' :
                    'bg-primary/10 text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-primary">{item.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{item.detail}</p>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-container-lowest rounded-2xl p-6">
            <h3 className="text-title text-primary mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: 'support_agent', label: 'Raise Request', desc: 'Report an issue' },
                { icon: 'calendar_month', label: 'Schedule Service', desc: 'Book appointment' },
                { icon: 'receipt_long', label: 'View Invoices', desc: 'Payment history' },
                { icon: 'download', label: 'Download Report', desc: 'Energy reports' },
                { icon: 'contact_support', label: 'Contact Support', desc: 'Chat with us' },
                { icon: 'settings', label: 'Account Settings', desc: 'Manage profile' },
              ].map(action => (
                <button key={action.label} className="flex items-center gap-3 p-4 bg-surface rounded-xl ghost-border hover:bg-surface-container-low transition-colors text-left group">
                  <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-primary">{action.label}</p>
                    <p className="text-[10px] text-on-surface-variant">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RaiseServiceRequestModal
        isOpen={serviceRequestModalOpen}
        onClose={() => setServiceRequestModalOpen(false)}
        onSubmit={handleServiceRequestSubmit}
      />
    </>
  );
}
