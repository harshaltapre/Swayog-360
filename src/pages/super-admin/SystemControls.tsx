import { useState } from 'react';
import { useAuthStore } from '../../store';

/**
 * Super Admin - System Infrastructure Management
 * Enterprise-grade system controls for monitoring, maintenance, and governance
 */
export default function SystemControlsPage() {
  const { user: _user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('System');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Finance Department (FD-01)');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  // System Health KPIs
  const healthKPIs = [
    {
      label: 'DB Connections',
      value: '42 / 100',
      icon: 'database',
      status: 'Healthy',
      statusColor: 'bg-green-100 text-green-700',
      bgColor: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Cache Efficiency',
      value: '94.2%',
      icon: 'memory',
      status: 'Optimal',
      statusColor: 'bg-green-100 text-green-700',
      bgColor: 'bg-indigo-50 text-indigo-700',
    },
    {
      label: 'Queue Depth',
      value: '1,240 msgs',
      icon: 'queue',
      status: 'Elevated',
      statusColor: 'bg-amber-100 text-amber-700',
      bgColor: 'bg-amber-50 text-amber-700',
    },
  ];

  // Critical System Actions
  const systemActions = [
    {
      title: 'Force Sync All Data',
      description: 'Triggers immediate bidirectional sync for all enterprise nodes.',
      icon: 'sync',
      action: 'Execute Sync',
      variant: 'primary' as const,
    },
    {
      title: 'Clear System Cache',
      description: 'Purge all Redis and application-level caches across clusters.',
      icon: 'delete_sweep',
      action: 'Clear Cache',
      variant: 'secondary' as const,
    },
    {
      title: 'Purge Audit Logs',
      description: 'Warning: This action is permanent and non-reversible.',
      icon: 'delete',
      action: 'Purge Logs',
      variant: 'danger' as const,
    },
  ];

  // Recent Audit Logs
  const auditLogs = [
    { message: 'System Cache Cleared', actor: 'Admin Panel', time: '5 mins ago', color: 'bg-green-500' },
    { message: 'Database Backup Started', actor: 'Auto-System', time: '12 mins ago', color: 'bg-blue-500' },
    { message: 'API Rate Limit Adjusted', actor: 'System Admin', time: '1 hour ago', color: 'bg-yellow-500' },
    { message: 'User Accounts Bulk Disabled', actor: 'Governance', time: '3 hours ago', color: 'bg-red-500' },
    { message: 'Firmware Update Deployed', actor: 'Global', time: '5 hours ago', color: 'bg-green-500' },
  ];

  const tabs = ['Overview', 'Financials', 'Users', 'System', 'Reporting'];
  const userRoles = [
    'Finance Department (FD-01)',
    'Operations Support (OS-05)',
    'External Contractors (EC-03)',
    'Regional Managers (RM-12)',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">
            <span>Platform</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-[#1A365D] font-bold">System Controls</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1A365D] tracking-tight">System Infrastructure Management</h2>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-3 w-fit">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Health Pulse</p>
            <p className="text-xs font-semibold text-[#1A365D]">Last Verified: 2m ago</p>
          </div>
          <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
        </div>
      </div>

      {/* Tabbed Navigation */}
      <div className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto pb-[1px]">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'text-[#1A365D] border-b-2 border-[#1A365D]'
                : 'text-slate-500 hover:text-[#1A365D]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* System Health Overview KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {healthKPIs.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className={`material-symbols-outlined p-2 rounded-lg ${kpi.bgColor}`}>{kpi.icon}</span>
              {kpi.label}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Current</p>
                <p className="text-lg font-bold text-slate-900">{kpi.value}</p>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${kpi.statusColor}`}>
                  {kpi.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Maintenance + Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Maintenance Mode */}
        <div className="col-span-1 lg:col-span-5 bg-[#1A365D] rounded-xl shadow-lg border border-[#1A365D] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold tracking-tight">Maintenance Mode</h3>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                <div className={`w-2 h-2 rounded-full ${maintenanceMode ? 'bg-red-400' : 'bg-slate-400'}`} />
                <span className="text-xs font-bold uppercase tracking-wider">Status: {maintenanceMode ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <p className="text-white/80 max-w-lg mb-8 leading-relaxed">
              Activating maintenance mode will disconnect all non-administrative users and display a scheduled maintenance screen globally. Proceed with extreme caution.
            </p>
          </div>
          <div className="flex items-center gap-4 relative z-10 flex-wrap">
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-colors active:scale-95 ${
                maintenanceMode ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white text-[#1A365D] hover:bg-slate-100'
              }`}
            >
              {maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
            </button>
            <button className="bg-transparent border border-white/30 text-white/70 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-white/10 transition-colors">
              View Settings
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[300px]">construction</span>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="col-span-1 lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1A365D]">list_alt</span>
            Recent Audit Logs
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="flex gap-3 pb-4 border-b border-slate-100 last:border-0">
                <div className={`w-2 h-2 rounded-full ${log.color} mt-1.5 flex-shrink-0`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{log.message}</p>
                  <p className="text-xs text-slate-500">{log.actor} • {log.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 text-sm font-medium text-[#1A365D] border-t border-slate-200 pt-4 hover:text-[#0F1B2E] transition-colors">
            View Full Logs →
          </button>
        </div>
      </div>

      {/* Critical System Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600">report</span>
              Critical System Actions
            </h3>
            <p className="text-slate-500 text-sm mt-1">Force-override core platform operations and data states.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemActions.map(action => (
            <div key={action.title} className="p-5 border border-slate-100 rounded-xl bg-slate-50 flex flex-col justify-between hover:border-slate-200 transition-colors group">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{action.title.split(' ')[0]}</p>
                <h4 className="font-bold text-slate-900 mb-2">{action.title}</h4>
                <p className="text-xs text-slate-500 mb-6">{action.description}</p>
              </div>
              <button
                className={`w-full py-2 rounded-lg text-xs font-bold transition-colors active:scale-95 ${
                  action.variant === 'primary'
                    ? 'bg-slate-900 text-white hover:bg-[#1A365D]'
                    : action.variant === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {action.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Governance */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">Account Governance</h3>
        <p className="text-slate-500 text-sm mb-8">Restrict access across the organization by specific user roles.</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Target User Role</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] outline-none"
            >
              {userRoles.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">info</span>
                <span className="text-xs font-semibold text-slate-600">Impact Assessment</span>
              </div>
              <span className="text-xs font-bold text-[#1A365D] underline cursor-pointer">View Details</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This action will disable <span className="text-slate-900 font-bold">142</span> user accounts and invalidate all active session tokens immediately.
            </p>
          </div>

          <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
            <span className="material-symbols-outlined text-sm">block</span>
            Disable User Accounts
          </button>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-black uppercase tracking-widest">
            Module: Data Export
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Export Platform Data Warehouse</h3>
          <p className="text-slate-500 max-w-xl">Generate a comprehensive point-in-time snapshot of the entire platform's database structure and stored procedures for cold storage or auditing purposes.</p>

          <div className="flex items-center gap-4 pt-4 flex-wrap">
            <button
              onClick={() => setExportFormat('csv')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                exportFormat === 'csv'
                  ? 'bg-[#1A365D] text-white shadow-md'
                  : 'bg-white border-2 border-slate-100 hover:border-[#1A365D]'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${exportFormat === 'csv' ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                <span className="material-symbols-outlined">description</span>
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold ${exportFormat === 'csv' ? 'text-white' : 'text-slate-900'}`}>Export as CSV</p>
                <p className={`text-[10px] ${exportFormat === 'csv' ? 'text-white/70' : 'text-slate-400'}`}>Flat tabular structure</p>
              </div>
            </button>

            <button
              onClick={() => setExportFormat('json')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                exportFormat === 'json'
                  ? 'bg-[#1A365D] text-white shadow-md'
                  : 'bg-white border-2 border-slate-100 hover:border-[#1A365D]'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${exportFormat === 'json' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>
                <span className="material-symbols-outlined">code</span>
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold ${exportFormat === 'json' ? 'text-white' : 'text-slate-900'}`}>Export as JSON</p>
                <p className={`text-[10px] ${exportFormat === 'json' ? 'text-white/70' : 'text-slate-400'}`}>Hierarchical object notation</p>
              </div>
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 h-48 bg-slate-50 rounded-2xl border border-slate-100 relative p-4 flex flex-col justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A365D]/5 to-transparent pointer-events-none rounded-2xl" />
          <span className="material-symbols-outlined text-slate-200 text-6xl mb-2">cloud_download</span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Ready for Processing</p>
          <div className="mt-4 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#1A365D]/20 w-1/3 rounded-full" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-4 pb-8">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Environment</p>
            <p className="text-sm font-bold text-slate-900">PROD-US-EAST-01</p>
          </div>
          <div className="hidden md:block w-px h-8 bg-slate-200" />
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version</p>
            <p className="text-sm font-bold text-slate-900">v4.2.0-stable</p>
          </div>
          <div className="hidden md:block w-px h-8 bg-slate-200" />
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latency</p>
            <p className="text-sm font-bold text-green-600">12ms</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span className="material-symbols-outlined text-sm">security</span>
          Enterprise-grade encrypted management terminal
        </div>
      </footer>
    </div>
  );
}
