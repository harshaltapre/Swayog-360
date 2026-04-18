import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setSession: (payload: { user: User; token: string }) => void;
  updateUser: (user: Partial<User>) => void;
  finishInitialization: () => void;
  resetInitialization: () => void;
  clearSession: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
      setSession: ({ user, token }) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isInitialized: true,
        });
      },
      updateUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : null,
        })),
      finishInitialization: () => set({ isInitialized: true }),
      resetInitialization: () => set({ isInitialized: false }),
      clearSession: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true,
        }),
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      },
    }),
    {
      name: 'swayog-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  darkMode: boolean;
  searchOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  toggleDarkMode: () => void;
  toggleSearch: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  closeMobileSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      darkMode: false,
      searchOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleMobileSidebar: () => set((s) => ({ sidebarMobileOpen: !s.sidebarMobileOpen })),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),
      openSearch: () => set({ searchOpen: true }),
      closeSearch: () => set({ searchOpen: false }),
      closeMobileSidebar: () => set({ sidebarMobileOpen: false }),
    }),
    {
      name: 'swayog-ui',
      partialize: (state) => ({ darkMode: state.darkMode, sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);
