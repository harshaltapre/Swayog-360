import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../../store';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useEffect } from 'react';

export default function AppShell() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const { darkMode, openSearch } = useUIStore();

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard shortcut for search (Cmd+K)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openSearch]);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface-variant">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
