const kpis = [
  { label: 'Tasks Today', value: 6, icon: 'task_alt', detail: '2 high priority' },
  { label: 'Completed This Week', value: 23, icon: 'check_circle', trend: '+18%' },
  { label: 'Attendance This Month', value: '92%', icon: 'event_available', detail: '22/24 days' },
  { label: 'Overdue Tasks', value: 2, icon: 'schedule', variant: 'error' as const },
];

type TaskPriority = 'high' | 'medium' | 'low';
type TaskStatus = 'in-progress' | 'pending' | 'completed';

type TodayTask = {
  id: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  location: string;
  time: string;
};

const todayTasks: TodayTask[] = [
  { id: 'T-101', title: 'Solar Panel Installation — Malhotra Residence', priority: 'high', status: 'in-progress', location: 'Nagpur, Dharampeth', time: '9:00 AM - 12:00 PM' },
  { id: 'T-102', title: 'Inverter Maintenance Check — Hub B', priority: 'high', status: 'pending', location: 'Nagpur, Sadar', time: '1:00 PM - 3:00 PM' },
  { id: 'T-103', title: 'Site Survey — New Customer', priority: 'medium', status: 'pending', location: 'Nagpur, Manewada', time: '3:30 PM - 5:00 PM' },
  { id: 'T-104', title: 'Follow-up: Sharma AMC Renewal', priority: 'low', status: 'pending', location: 'Phone Call', time: '5:00 PM - 5:30 PM' },
  { id: 'T-105', title: 'Module Cleaning — Apartment Complex', priority: 'medium', status: 'completed', location: 'Nagpur, Trimurti Nagar', time: '7:00 AM - 8:30 AM' },
  { id: 'T-106', title: 'Repair Ticket #892 — Wiring Issue', priority: 'high', status: 'pending', location: 'Nagpur, Wardha Road', time: 'By EOD' },
];

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-error-container text-on-error-container',
  medium: 'bg-primary/10 text-primary',
  low: 'bg-secondary-container text-on-secondary-container',
};

const statusColors: Record<TaskStatus, string> = {
  'in-progress': 'text-primary',
  pending: 'text-on-surface-variant',
  completed: 'text-on-tertiary-container',
};

const statusIcons: Record<TaskStatus, string> = {
  'in-progress': 'autorenew',
  pending: 'radio_button_unchecked',
  completed: 'check_circle',
};

export default function EmployeeDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-display text-primary">Good Morning, Amit 👋</h2>
          <p className="text-on-surface-variant mt-1 text-sm">Here's your daily execution hub for Thursday, 17 April 2025.</p>
        </div>
        <button className="px-5 py-2.5 bg-primary text-on-primary font-medium rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-sm">event_available</span>
          Mark Attendance
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {kpis.map(kpi => (
          <div key={kpi.label} className={`bg-surface-container-lowest p-5 rounded-2xl relative overflow-hidden ${kpi.variant !== 'error' ? 'accent-bar-left' : ''}`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-label-sm text-on-surface-variant">{kpi.label}</h3>
              <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">{kpi.icon}</span>
            </div>
            <span className={`text-3xl font-bold tracking-tight ${kpi.variant === 'error' ? 'text-error' : 'text-primary'}`}>
              {kpi.value}
            </span>
            {kpi.trend && <p className="text-xs text-on-tertiary-container font-medium mt-1">↑ {kpi.trend}</p>}
            {kpi.detail && <p className={`text-xs mt-1 ${kpi.variant === 'error' ? 'text-error' : 'text-on-surface-variant'}`}>{kpi.detail}</p>}
          </div>
        ))}
      </div>

      {/* Today's Tasks */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
        <div className="p-6 pb-4 flex justify-between items-center">
          <h3 className="text-title text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">today</span>
            Today's Tasks
          </h3>
          <div className="flex gap-2">
            <button className="text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-lg">All</button>
            <button className="text-xs font-medium text-on-surface-variant px-3 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors">Pending</button>
            <button className="text-xs font-medium text-on-surface-variant px-3 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors">Completed</button>
          </div>
        </div>

        <div className="divide-y divide-surface-container-low/50">
          {todayTasks.map(task => (
            <div key={task.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low/50 transition-colors cursor-pointer ${task.status === 'completed' ? 'opacity-60' : ''}`}>
              <span className={`material-symbols-outlined text-lg ${statusColors[task.status]}`}
                style={task.status === 'completed' ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {statusIcons[task.status]}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-on-surface-variant line-through' : 'text-primary'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                    {task.location}
                  </span>
                  <span className="text-xs text-on-surface-variant/60">{task.time}</span>
                </div>
              </div>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <span className="text-xs text-on-surface-variant/50">{task.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Weekly Summary + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <div className="bg-surface-container-lowest rounded-2xl p-6">
          <h3 className="text-title text-primary mb-4">This Week's Performance</h3>
          <div className="h-40 bg-surface-container-low rounded-xl flex items-end justify-between px-4 pb-4 gap-2">
            {[
              { day: 'Mon', tasks: 5 },
              { day: 'Tue', tasks: 7 },
              { day: 'Wed', tasks: 4 },
              { day: 'Thu', tasks: 6 },
              { day: 'Fri', tasks: 0 },
            ].map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all ${d.tasks > 0 ? 'bg-primary/30 hover:bg-primary/50' : 'bg-surface-container'}`}
                  style={{ height: `${d.tasks > 0 ? d.tasks * 15 : 8}px` }}
                />
                <span className="text-[9px] text-on-surface-variant/60 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Calendar Mini */}
        <div className="bg-surface-container-lowest rounded-2xl p-6">
          <h3 className="text-title text-primary mb-4">Attendance — April 2025</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] text-on-surface-variant/60 font-medium pb-1">{d}</div>
            ))}
            {/* Dummy calendar days */}
            {Array.from({ length: 2 }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: 17 }, (_, i) => {
              const day = i + 1;
              const isToday = day === 17;
              const isAbsent = [6, 13].includes(day);
              const isHoliday = [7, 14].includes(day);
              return (
                <div
                  key={day}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium ${
                    isToday ? 'bg-primary text-on-primary ring-2 ring-primary/30' :
                    isAbsent ? 'bg-error/10 text-error' :
                    isHoliday ? 'bg-surface-container text-on-surface-variant/40' :
                    'bg-on-tertiary-container/10 text-on-tertiary-fixed-variant'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-[10px] text-on-surface-variant">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-on-tertiary-container/40" /> Present</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error/40" /> Absent</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-surface-container" /> Holiday</span>
          </div>
        </div>
      </div>
    </div>
  );
}
