import React from 'react';
import { useAuthStore, useUIStore } from '../../store';
import { ROLE_LABELS } from '../../config/navigation';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TopBar() {
  const { user } = useAuthStore();
  const { toggleMobileSidebar, toggleDarkMode, darkMode, openSearch } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Apply dark mode to document root
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('swayog-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('swayog-dark-mode', 'false');
    }
  }, [darkMode]);

  if (!user) return null;

  const roleLabel = ROLE_LABELS[user.role];

  // Generate breadcrumb from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, i) => ({
    label: part.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()),
    path: '/' + pathParts.slice(0, i + 1).join('/'),
  }));

  return (
    <header
      className="sticky top-0 z-30 bg-surface-container-lowest"
      style={{ boxShadow: '0px 12px 32px rgba(11,28,48,0.06)' }}
    >
      <div className="flex justify-between items-center w-full px-4 md:px-8 py-3 max-w-[1920px] mx-auto">
        {/* Left: Mobile menu + Breadcrumbs + Search */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Mobile brand */}
          <span className="md:hidden text-lg font-bold text-primary tracking-tight">Swayog</span>

          {/* Breadcrumbs (desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="material-symbols-outlined text-outline-variant text-sm">chevron_right</span>
                )}
                <span
                  className={
                    i === breadcrumbs.length - 1
                      ? 'text-primary font-medium'
                      : 'text-on-surface-variant'
                  }
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>

          {/* Search trigger (desktop) */}
          <button
            onClick={openSearch}
            className="hidden sm:flex items-center gap-2 ml-4 px-4 py-2 bg-surface-container-low rounded-full text-sm text-outline hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-sm">search</span>
            <span className="text-outline-variant">Search...</span>
            <kbd className="ml-4 px-1.5 py-0.5 bg-surface-container rounded text-[10px] font-mono text-outline-variant">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions + Profile */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-outline-variant hover:bg-surface-container-low rounded-full transition-all duration-200"
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            <span className="material-symbols-outlined text-xl">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Help */}
          <button 
            onClick={() => navigate('/support')}
            className="p-2 text-outline-variant hover:bg-surface-container-low rounded-full transition-all duration-200 hidden sm:flex"
            title="Help & Support"
          >
            <span className="material-symbols-outlined text-xl">help</span>
          </button>

          {/* Notifications */}
          <button 
            onClick={() => navigate('/notifications')}
            className="relative p-2 text-outline-variant hover:bg-surface-container-low rounded-full transition-all duration-200"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-on-tertiary-container rounded-full ring-2 ring-surface-container-lowest" />
          </button>

          {/* Settings */}
          <button 
            onClick={() => navigate(`/${user.role}/settings`)}
            className="p-2 text-outline-variant hover:bg-surface-container-low rounded-full transition-all duration-200 hidden sm:flex"
            title="Settings"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>

          {/* Profile */}
          <div className="ml-2 flex items-center gap-3 pl-3 border-l border-surface-container">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-semibold text-primary leading-tight">{user.name}</p>
              <p className="text-xs text-on-surface-variant">{roleLabel}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm relative">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-on-tertiary-container border-2 border-surface-container-lowest rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
