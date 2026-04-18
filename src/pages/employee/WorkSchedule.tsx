import { useState } from 'react';

/**
 * Employee - Work Schedule Page
 * Calendar view with task timeline and location mapping
 */
export default function WorkSchedulePage() {
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly' | 'day'>('monthly');

  interface ScheduleItem {
    date: number;
    title?: string;
    type?: 'inspection' | 'training' | 'maintenance' | 'emergency' | 'meeting';
    location?: string;
  }

  const scheduleData: Record<number, ScheduleItem> = {
    7: { date: 7, title: 'Site Inspection: Mojave A', type: 'inspection', location: 'Mojave' },
    8: { date: 8, title: 'Safety Training: High Voltage', type: 'training', location: 'Training Center' },
    10: { date: 10, title: 'Maintenance: Inverter Array 4', type: 'maintenance', location: 'Helios West' },
    14: { date: 14, title: 'Emergency Repair: Grid Hub 2', type: 'emergency', location: 'Grid Hub 2' },
    17: { date: 17, title: 'Site Inspection: Desert Sun', type: 'inspection', location: 'Desert' },
  };

  const getTypeColor = (type?: string): { bg: string; text: string; border: string } => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      inspection: { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-l-blue-700' },
      training: { bg: 'bg-green-50', text: 'text-green-900', border: 'border-l-green-700' },
      maintenance: { bg: 'bg-[#1A365D]/5', text: 'text-[#1A365D]', border: 'border-l-[#1A365D]' },
      emergency: { bg: 'bg-red-50', text: 'text-red-900', border: 'border-l-red-600' },
      meeting: { bg: 'bg-slate-50', text: 'text-slate-900', border: 'border-l-slate-400' },
    };
    return colors[type || 'meeting'] || colors.meeting;
  };

  const todayHighlight = 10; // Highlighted day

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header with Title and View Options */}
      <section className="p-4 sm:p-6 md:p-8 bg-white border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A365D] tracking-tight">Work Schedule</h1>
            <p className="text-slate-600 font-medium text-xs sm:text-sm md:text-base">Helios Enterprise • Operations Center</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-slate-200">
            {(['monthly', 'weekly', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-bold rounded transition-all ${
                  viewMode === mode
                    ? 'bg-[#1A365D] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 md:p-8">
        {/* Main Calendar */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-slate-100 gap-3 sm:gap-0">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#1A365D]">October 2024</h3>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-xl text-slate-600">chevron_left</span>
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-xl text-slate-600">chevron_right</span>
                </button>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1A365D] text-white text-xs font-bold rounded-lg shadow-md hover:bg-[#0f1f3a] transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">add_task</span>
              Request Leave
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 text-center border-b border-slate-100 bg-slate-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid - October 2024 */}
          <div className="grid grid-cols-7 auto-rows-[80px] sm:auto-rows-[100px] md:auto-rows-[120px]">
            {/* Empty days (Sept 29-Oct 2) */}
            {[1, 2, 3, 4].map((i) => (
              <div key={`empty-${i}`} className="border-r border-b border-slate-100 p-2 bg-slate-50/50"></div>
            ))}

            {/* October Days 1-31 */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const schedule = scheduleData[day];
              const isToday = day === todayHighlight;
              const typeColors = schedule ? getTypeColor(schedule.type) : { bg: '', text: '', border: '' };

              return (
                <div
                  key={day}
                  className={`border-r border-b border-slate-100 p-2 transition-colors ${
                    isToday ? `${typeColors.bg || 'bg-blue-50'} ring-2 ring-[#1A365D]/50 ring-inset` : 'hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs font-bold ${isToday ? 'text-[#1A365D]' : 'text-slate-400'}`}>{day}</span>

                  {schedule && (
                    <div className={`mt-1 p-1.5 ${typeColors.bg} ${typeColors.border} border-l-2 rounded-sm`}>
                      <p className={`text-[9px] font-bold ${typeColors.text} leading-tight truncate`}>{schedule.title}</p>
                    </div>
                  )}

                  {isToday && !schedule && (
                    <div className="mt-1 p-1.5 bg-[#1A365D] text-white rounded-sm shadow-sm">
                      <p className="text-[9px] font-bold leading-tight">Today</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Statistics and Timeline */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Stats Card */}
          <div className="bg-[#1A365D] text-white p-4 sm:p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-1">Weekly Summary</p>
              <h4 className="text-2xl font-black mb-4">38 Scheduled Hours</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200">Site Visits</span>
                  <span className="text-sm font-bold">12</span>
                </div>
                <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#48BB78] h-full w-[70%]"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200">Maintenance</span>
                  <span className="text-sm font-bold">8</span>
                </div>
                <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#48BB78] h-full w-[45%]"></div>
                </div>
              </div>
            </div>
            {/* Background Icon */}
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                wb_sunny
              </span>
            </div>
          </div>

          {/* Today's Timeline */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-[#1A365D]">Today's Timeline</h4>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">Oct 10</span>
            </div>
            <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {/* Timeline Item 1 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-blue-100">
                  <span className="material-symbols-outlined text-[12px] text-[#1A365D]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    circle
                  </span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">09:00 AM</p>
                <h5 className="text-xs font-bold text-[#1A365D]">Shift Commencement</h5>
                <p className="text-[11px] text-slate-500">Clock-in via Attendance Tab required</p>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#1A365D] flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-blue-100">
                  <span className="material-symbols-outlined text-[12px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                    handyman
                  </span>
                </div>
                <p className="text-[10px] font-black text-[#1A365D] uppercase tracking-tighter">11:30 AM</p>
                <h5 className="text-xs font-bold text-[#1A365D]">Inverter Array 4 Maintenance</h5>
                <p className="text-[11px] text-slate-500">Site: Helios West Cluster B</p>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-200">
                  <span className="material-symbols-outlined text-[12px] text-slate-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                    groups
                  </span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">03:00 PM</p>
                <h5 className="text-xs font-bold text-[#1A365D]">Operations Sync</h5>
                <p className="text-[11px] text-slate-500">Virtual Meeting • Link in Tasks</p>
              </div>
            </div>
          </div>

          {/* Safety Compliance Alert */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex gap-3">
            <span className="material-symbols-outlined text-[#48BB78] shrink-0">info</span>
            <div>
              <p className="text-xs font-bold text-[#1A365D]">Safety Compliance Reminder</p>
              <p className="text-[11px] text-slate-600 mt-1">Your ARC Flash certification expires in 12 days. Scheduled training available on Oct 8th.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Location Mapping */}
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-[#1A365D]">Location Mapping</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 min-h-[300px]">
            {/* Location Details */}
            <div className="col-span-1 border-r border-slate-100 p-6 flex flex-col justify-between bg-white">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Site</p>
                <h4 className="text-xl font-extrabold text-[#1A365D]">Helios West Cluster B</h4>
                <p className="text-sm text-slate-500 mt-2">Zone 4-A Maintenance Route</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#48BB78] text-lg">distance</span>
                  <span className="text-sm font-bold text-slate-700">12.4 Miles from Base</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1A365D] text-lg">navigation</span>
                  <span className="text-sm font-bold text-[#1A365D] cursor-pointer hover:underline">Get Directions</span>
                </div>
              </div>
            </div>

            {/* Map Area */}
            <div className="col-span-1 md:col-span-2 relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
              <img
                alt="Site Map"
                className="w-full h-full object-cover grayscale opacity-30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOMOasL0lHFBbmltr_uN3dURWHc2AFaX1poPbX2JHF9CnamLgHNIUD83GwTcIzx0HPiOFZRt0ZsNKNq5dyRAB7qYXB9zHh-_v4lw3b7-MxYkAETG9gen8lxpxicXqjE0Bj_kbWCPlyc_CrGwPvTWfGYTZQqnEpb9uo9Y03n2HdhdpvZTDTTD2teXGZSjuigvtfF8t1_DJt6smbFM03aqvj4JWSfpQeBcUnrhHIcR3434ZLa7MkhroHW3QpCQqgCxLDFdYjNpCgyGA"
              />
              <div className="absolute inset-0 bg-blue-900/5"></div>

              {/* Current Location Marker */}
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-[#1A365D] rounded-full animate-ping absolute"></div>
                  <div className="w-4 h-4 bg-[#1A365D] rounded-full border-2 border-white relative z-10 shadow-lg"></div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded shadow-md text-[9px] font-bold whitespace-nowrap">
                    Current Location
                  </div>
                </div>
              </div>

              {/* Destination Marker */}
              <div className="absolute top-1/3 left-2/3">
                <div className="relative">
                  <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white relative z-10 shadow-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                      location_on
                    </span>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded shadow-md text-[9px] font-bold whitespace-nowrap">
                    Site Cluster B
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
