import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { ROLE_DASHBOARD_PATHS } from '../../config/navigation';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const dashboardPath = user ? ROLE_DASHBOARD_PATHS[user.role] : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="text-center max-w-md animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-surface-container-low flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-primary/30">explore_off</span>
        </div>
        <h1 className="text-6xl font-bold text-primary mb-3">404</h1>
        <p className="text-xl font-medium text-primary mb-2">Page Not Found</p>
        <p className="text-sm text-on-surface-variant mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-surface-container-low text-primary font-medium rounded-xl hover:bg-surface-container transition-colors text-sm"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate(isAuthenticated ? dashboardPath : '/login')}
            className="px-6 py-3 bg-primary text-on-primary font-medium rounded-xl shadow-sm hover:opacity-90 transition-opacity text-sm"
          >
            Go to {isAuthenticated ? 'Dashboard' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
