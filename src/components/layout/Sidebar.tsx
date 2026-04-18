import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../../store';
import { NAV_CONFIG, ROLE_LABELS } from '../../config/navigation';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, closeMobileSidebar } = useUIStore();
  const location = useLocation();

  if (!user) return null;

  const navItems = NAV_CONFIG[user.role] || [];
  const roleLabel = ROLE_LABELS[user.role];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen z-50
          flex flex-col py-6 gap-2
          bg-surface-container-lowest
          transition-all duration-300 ease-out
          ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
          ${sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ boxShadow: '1px 0 0 0 rgba(196,198,207,0.15)' }}
      >
        {/* Header */}
        <div className={`px-4 mb-6 flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <button
            onClick={() => { toggleSidebar(); closeMobileSidebar(); }}
            className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-xl">solar_power</span>
          </button>
          {!sidebarCollapsed && (
            <div className="animate-fade-in">
              <h1 className="text-base font-extrabold text-primary tracking-tight leading-none">
                Swayog Energy
              </h1>
              <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest mt-0.5">
                {roleLabel}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path + item.label}
                to={item.path}
                onClick={closeMobileSidebar}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  active:scale-[0.98]
                  ${sidebarCollapsed ? 'justify-center px-0' : ''}
                  ${isActive
                    ? 'bg-surface text-primary-container shadow-sm'
                    : 'text-on-surface-variant/60 hover:text-primary hover:bg-surface-container-low'
                  }
                `}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span
                  className={`material-symbols-outlined text-lg ${isActive ? 'filled' : ''}`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {!sidebarCollapsed && <span>{item.label}</span>}
                {!sidebarCollapsed && isActive && (
                  <div className="ml-auto w-1 h-5 bg-on-tertiary-container rounded-full" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`px-3 mt-auto flex flex-col gap-2 ${sidebarCollapsed ? 'items-center' : ''}`}>
          {!sidebarCollapsed && (user.role === 'admin' || user.role === 'partner' || user.role === 'super_admin') && (
            <button className="w-full bg-primary text-on-primary py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity">
              Create Project
            </button>
          )}

          <button
            onClick={closeMobileSidebar}
            className={`
              flex items-center gap-3 px-3 py-2 text-on-surface-variant/60
              hover:text-primary transition-colors text-sm rounded-lg
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <span className="material-symbols-outlined text-lg">support_agent</span>
            {!sidebarCollapsed && <span>Support</span>}
          </button>

          <button
            onClick={() => { logout(); closeMobileSidebar(); }}
            className={`
              flex items-center gap-3 px-3 py-2 text-error/70
              hover:text-error transition-colors text-sm rounded-lg
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
