import { useState } from 'react';

/**
 * Partner - Project Pipeline Page (Kanban Board)
 * Manage enterprise installations across stages
 */
export default function ProjectPipelinePage() {
  const [searchQuery, setSearchQuery] = useState('');

  interface KanbanCard {
    id: string;
    title: string;
    client: string;
    progress: number;
    progressColor: string;
    icon?: string;
    badge?: string;
  }

  interface KanbanColumn {
    title: string;
    dotColor: string;
    count: number;
    cards: KanbanCard[];
    progressBarColor: string;
  }

  const kanbanData: Record<string, KanbanColumn> = {
    onboarding: {
      title: 'Onboarding',
      dotColor: 'bg-blue-400',
      count: 3,
      progressBarColor: 'bg-blue-400',
      cards: [
        {
          id: 'ID-99231',
          title: 'Starlight Logistics Hub',
          client: 'Robert Henderson',
          progress: 15,
          progressColor: 'bg-blue-400',
        },
        {
          id: 'ID-99450',
          title: 'Oakwood Residential Complex',
          client: 'Sarah Jenkins',
          progress: 25,
          progressColor: 'bg-blue-400',
        },
      ],
    },
    permitting: {
      title: 'Permitting',
      dotColor: 'bg-amber-400',
      count: 2,
      progressBarColor: 'bg-amber-400',
      cards: [
        {
          id: 'ID-98112',
          title: 'Global Tech HQ',
          client: 'Marcus Thorne',
          progress: 45,
          progressColor: 'bg-amber-400',
        },
      ],
    },
    installation: {
      title: 'Installation',
      dotColor: 'bg-[#1A365D]',
      count: 4,
      progressBarColor: 'bg-[#1A365D]',
      cards: [
        {
          id: 'ID-97554',
          title: 'Metro Plaza Solar Farm',
          client: 'City Infra Group',
          progress: 72,
          progressColor: 'bg-[#1A365D]',
          badge: 'Active',
          icon: 'bolt',
        },
      ],
    },
    inspection: {
      title: 'Final Inspection',
      dotColor: 'bg-purple-500',
      count: 1,
      progressBarColor: 'bg-purple-500',
      cards: [
        {
          id: 'ID-96001',
          title: 'Alpine Resort microgrid',
          client: 'Luxury Stays Inc.',
          progress: 90,
          progressColor: 'bg-purple-500',
          icon: 'fact_check',
        },
      ],
    },
    pto: {
      title: 'PTO',
      dotColor: 'bg-green-600',
      count: 5,
      progressBarColor: 'bg-green-600',
      cards: [
        {
          id: 'ID-95432',
          title: 'Riverside Park Solar',
          client: 'Green City Council',
          progress: 100,
          progressColor: 'bg-green-600',
          icon: 'verified',
        },
      ],
    },
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Breadcrumbs & Actions */}
      <section className="px-8 pt-8 pb-4 bg-white border-b border-slate-200">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium uppercase tracking-wider">
          <a className="hover:text-[#1A365D] transition-colors" href="#">Home</a>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <a className="hover:text-[#1A365D] transition-colors" href="#">Partner</a>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-[#1A365D] font-bold">Projects</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1A365D] tracking-tight">Project Pipeline</h1>
            <p className="text-slate-600 text-sm">Manage enterprise installations across stages.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] outline-none w-64 bg-white transition-all"
                placeholder="Search projects..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-slate-600">filter_list</span>
            </button>
          </div>
        </div>
      </section>

      {/* Kanban Board */}
      <section className="flex-1 px-8 pb-8 overflow-x-auto">
        <div className="flex gap-6 h-full min-h-[600px] mt-4">
          {Object.entries(kanbanData).map(([key, column]) => (
            <div key={key} className="flex flex-col gap-4 min-w-[320px] w-[320px]">
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${column.dotColor}`}></span>
                  <h3 className="font-bold text-[#1A365D] text-sm">{column.title}</h3>
                  <span className="bg-slate-100 text-[#1A365D] px-2 py-0.5 rounded text-[10px] font-bold">
                    {column.count}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-[#1A365D] transition-colors">
                  <span className="material-symbols-outlined text-sm">more_horiz</span>
                </button>
              </div>

              {/* Cards */}
              <div className="space-y-4">
                {column.cards.map((card) => (
                  <div
                    key={card.id}
                    className={`bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                      key === 'installation'
                        ? 'border-l-4 border-l-[#1A365D] border-y-slate-200 border-r-slate-200'
                        : 'border-slate-200 hover:border-opacity-60'
                    } ${key === 'pto' ? 'opacity-80 hover:opacity-100' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {card.id}
                      </span>
                      {card.badge ? (
                        <div className="flex gap-1">
                          <span className={`material-symbols-outlined text-${column.dotColor.split('-')[1]}-600 text-sm`}>
                            {card.icon}
                          </span>
                          <span className={`text-[10px] font-bold text-${column.dotColor.split('-')[1]}-600 uppercase`}>
                            {card.badge}
                          </span>
                        </div>
                      ) : card.icon ? (
                        <span className={`material-symbols-outlined text-${column.dotColor.split('-')[1]}-600 text-sm`}>
                          {card.icon}
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-[#1A365D] transition-colors text-sm">
                          open_in_new
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-[#1A365D] mb-1">{card.title}</h4>
                    <p className="text-xs text-slate-500 mb-4">Client: {card.client}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span>{key === 'pto' ? 'Completed' : 'Progress'}</span>
                        <span>{card.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${card.progressColor} rounded-full`}
                          style={{ width: `${card.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 bg-[#1A365D] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
}
