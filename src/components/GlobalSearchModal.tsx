import { useState, useEffect, useRef } from 'react';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'customer' | 'employee' | 'complaint' | 'inventory' | 'partner' | 'recent';
  icon?: string;
  badge?: { text: string; color: string };
  avatar?: string;
  timestamp?: string;
}

const MOCK_RESULTS: SearchResult[] = [
  // Recent Searches
  {
    id: 'recent-1',
    title: 'Phoenix Solar Farm Maintenance',
    subtitle: 'Last searched 2 hours ago',
    category: 'recent',
    icon: 'history',
  },
  {
    id: 'recent-2',
    title: 'Q3 Revenue Reports',
    subtitle: 'Last searched yesterday',
    category: 'recent',
    icon: 'history',
  },
  // Customers
  {
    id: 'cust-1',
    title: 'Aditi Sharma',
    subtitle: 'ID: #CUST-9920 • Platinum Partner',
    category: 'customer',
    badge: { text: 'ACTIVE', color: 'bg-green-100 text-green-800' },
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAO8NnknBr71t2G-QmsOaZgM_rlxcprVbh-suWV16wFp71BTSg69J52Y3oE4xxTlU-uiWpNyLE2xYLgaL6PNXvsCJgS2OA5pmSZtRGd0_XVCtffI23iFS1C6a3oiMjQRmeKKy1F3sk2nLueYnAYyWtDKrxO3ApQCg57Wec7_CGf_VM2fM24xirEdQIjs8OwM6n6k4UX__C0F9Xg8cBgrkIOWP19friII4EfdK8eLLDslpG5es0hzOeoGdoWoPDZKL1DP9wEQGz2EDg',
  },
  {
    id: 'cust-2',
    title: 'Akash Singh',
    subtitle: 'ID: #CUST-4412 • Residential Tier 1',
    category: 'customer',
    badge: { text: 'ACTIVE', color: 'bg-green-100 text-green-800' },
  },
  // Employees
  {
    id: 'emp-1',
    title: 'Vikram Mehta',
    subtitle: 'Lead Field Engineer • West Division',
    category: 'employee',
    icon: 'engineering',
    badge: { text: 'STAFF', color: 'bg-blue-100 text-blue-800' },
  },
  // Complaints
  {
    id: 'comp-1',
    title: 'Grid Failure - Sector 7',
    subtitle: 'Ticket: #TKT-882 • High Priority',
    category: 'complaint',
    icon: 'warning',
    badge: { text: 'HIGH', color: 'bg-red-100 text-red-800' },
    timestamp: '2h ago',
  },
  // Inventory
  {
    id: 'inv-1',
    title: 'Inverter-X 500kW',
    subtitle: 'SKU: INV-MOD-09 • 12 In Stock',
    category: 'inventory',
    icon: 'solar_power',
  },
  // Partners
  {
    id: 'part-1',
    title: 'SolCore Logistics',
    subtitle: 'Primary Logistics Partner',
    category: 'partner',
    icon: 'handshake',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  recent: 'Recent Searches',
  customer: 'Customers',
  employee: 'Employees',
  complaint: 'Complaints',
  inventory: 'Inventory & Partners',
  partner: 'Inventory & Partners',
};

export default function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredResults = searchQuery
    ? MOCK_RESULTS.filter(
        result =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : MOCK_RESULTS;

  const groupedResults = Object.entries(
    filteredResults.reduce(
      (acc, result) => {
        const category = result.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(result);
        return acc;
      },
      {} as Record<string, SearchResult[]>
    )
  ).map(([category, results]) => ({
    category,
    results,
    label: CATEGORY_LABELS[category],
  }));

  const handleSelectResult = (result: SearchResult) => {
    console.log('Selected:', result);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
        setSearchQuery('');
        setSelectedIndex(0);
      }

      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchQuery('');
      }

      if (!isOpen) return;

      // Arrow keys for navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
      }

      // Enter to select
      if (e.key === 'Enter' && filteredResults[selectedIndex]) {
        handleSelectResult(filteredResults[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredResults]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'customer':
        return 'text-blue-600';
      case 'employee':
        return 'text-purple-600';
      case 'complaint':
        return 'text-red-600';
      case 'inventory':
      case 'partner':
        return 'text-emerald-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99] bg-black/20 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 pointer-events-none">
        <div className="w-full max-w-3xl bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[70vh] pointer-events-auto">
          {/* Search Input Area */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 gap-4 bg-white">
            <span className="material-symbols-outlined text-[#1A365D] text-2xl flex-shrink-0">
              search
            </span>
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search customers, employees, assets, complaints..."
              className="bg-transparent border-none focus:ring-0 w-full text-lg text-gray-900 font-medium placeholder:text-gray-500 outline-none"
            />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-100 border border-gray-300">
                <span className="text-[11px] font-bold text-gray-600 tracking-wider">ESC</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-gray-100 border border-gray-300">
                <span className="text-[11px] font-bold text-[#1A365D] tracking-wider">⌘K</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {filteredResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <span className="material-symbols-outlined text-gray-300 text-5xl mb-4">
                  search_off
                </span>
                <p className="text-gray-600 font-medium text-center">No results found</p>
                <p className="text-gray-500 text-sm text-center mt-1">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {groupedResults.map(group => (
                  <div key={group.category} className="py-3">
                    <div className="px-6 mb-2">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        {group.label}
                      </h4>
                    </div>

                    <div className="space-y-0.5 px-2">
                      {group.results.map(result => {
                        const globalIdx = filteredResults.indexOf(result);
                        const isSelected = globalIdx === selectedIndex;

                        return (
                          <div
                            key={result.id}
                            onClick={() => {
                              setSelectedIndex(globalIdx);
                              handleSelectResult(result);
                            }}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={`flex items-center justify-between px-4 py-3 rounded-md transition-all cursor-pointer border border-transparent ${
                              isSelected
                                ? 'bg-[#1A365D]/10 border-[#1A365D]/20'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              {/* Avatar or Icon */}
                              {result.avatar ? (
                                <img
                                  src={result.avatar}
                                  alt={result.title}
                                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                                />
                              ) : result.icon ? (
                                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <span
                                    className={`material-symbols-outlined text-xl ${getCategoryColor(
                                      result.category
                                    )}`}
                                  >
                                    {result.icon}
                                  </span>
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded bg-[#1A365D]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#1A365D]">
                                  {result.title
                                    .split(' ')
                                    .map(w => w[0])
                                    .join('')}
                                </div>
                              )}

                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  {result.title}
                                </div>
                                <div className="text-xs text-gray-600 truncate">
                                  {result.subtitle}
                                </div>
                              </div>
                            </div>

                            {/* Badge or Timestamp */}
                            <div className="flex-shrink-0 ml-4">
                              {result.badge ? (
                                <span
                                  className={`text-[10px] font-bold py-1 px-2 rounded border ${result.badge.color}`}
                                >
                                  {result.badge.text}
                                </span>
                              ) : result.timestamp ? (
                                <span className="text-[10px] font-medium text-gray-500">
                                  {result.timestamp}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Keyboard Hints */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex flex-col text-gray-600">
                  <span className="material-symbols-outlined text-sm leading-none">
                    keyboard_arrow_up
                  </span>
                  <span className="material-symbols-outlined text-sm leading-none">
                    keyboard_arrow_down
                  </span>
                </div>
                <span className="text-gray-600 font-semibold uppercase tracking-wider">
                  Navigate
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-gray-600">
                  keyboard_return
                </span>
                <span className="text-gray-600 font-semibold uppercase tracking-wider">
                  Select
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border border-gray-300">
              <span className="text-gray-600">
                Scope: <span className="text-[#1A365D] font-bold">All Departments</span>
              </span>
              <span className="material-symbols-outlined text-sm text-[#1A365D]">tune</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
