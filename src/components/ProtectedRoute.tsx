import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import type { Role } from '../types';
import { canAccessPage } from '../config/pageMapping';

interface ProtectedRouteProps {
  children: ReactNode;
  pageId: string;
  requiredRoles?: Role[];
}

/**
 * ProtectedRoute Component
 * Ensures that only authorized users can access specific pages
 * Falls back to login if user is not authenticated or doesn't have access
 */
export function ProtectedRoute({ children, pageId, requiredRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return <div className="min-h-[40vh] flex items-center justify-center text-sm text-on-surface-variant">Loading session...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user can access this page
  if (!canAccessPage(user.role, pageId)) {
    // Redirect to login
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check them too
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
