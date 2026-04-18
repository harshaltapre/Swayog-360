import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { ROLE_DASHBOARD_PATHS } from '../../config/navigation';
import { login as loginRequest } from '../../utils/api';
import type { Role } from '../../types';

// Demo credentials for database sync
const DEMO_USERS = {
  super_admin: { email: 'harshaltapre27@gamil.com', password: 'harshal' },
  admin: { email: 'amit.verma@swayog.energy', password: 'admin123' },
  employee: { email: 'ravi.kumar@swayog.energy', password: 'emp123' },
  partner: { email: 'rajesh@energysolutions.com', password: 'partner123' },
  customer: { email: 'vikram@example.com', password: 'customer123' },
};

const ROLE_OPTIONS: { role: Role; label: string }[] = [
  { role: 'super_admin', label: 'Super Admin' },
  { role: 'admin', label: 'Admin' },
  { role: 'partner', label: 'Partner' },
  { role: 'employee', label: 'Employee' },
  { role: 'customer', label: 'Customer' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setSession = useAuthStore(s => s.setSession);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await loginRequest({ email, password });

      if (rememberMe) {
        localStorage.setItem('swayog_remember_email', email);
      } else {
        localStorage.removeItem('swayog_remember_email');
      }

      setSession({ user: response.user, token: response.token });
      navigate(ROLE_DASHBOARD_PATHS[response.user.role]);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Invalid email or password.');
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: Role) => {
    const user = DEMO_USERS[role];
    setEmail(user.email);
    setPassword(user.password);
    setError('');
    setLoading(true);

    try {
      const response = await loginRequest({ email: user.email, password: user.password });
      setSession({ user: response.user, token: response.token });
      navigate(ROLE_DASHBOARD_PATHS[response.user.role]);
    } catch (quickLoginError) {
      setError(quickLoginError instanceof Error ? quickLoginError.message : 'Quick login failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Side: Brand Imagery & Tagline - Hidden on Mobile */}
        <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-[#1A365D] to-[#2D4F7F]">
          {/* Background Solar Image */}
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center opacity-40"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1509391366360-2e938f4af82d?w=1200&h=800&fit=crop")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A365D] via-[#1A365D]/80 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-12 md:p-16 flex flex-col justify-between h-full w-full">
            {/* Logo Section */}
            <div>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                  <span className="material-symbols-outlined text-white text-2xl">solar_power</span>
                </div>
                <div>
                  <h1 className="text-white text-2xl font-extrabold tracking-tight">Swayog Energy</h1>
                  <p className="text-emerald-300 text-xs font-semibold uppercase tracking-widest">SolarManage</p>
                </div>
              </div>
            </div>

            {/* Main Tagline */}
            <div className="max-w-2xl">
              <h2 className="text-white text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                The Digital<br />
                <span className="text-emerald-300">Architect</span><br />
                of Sustainable<br />
                Energy
              </h2>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                Managing gigawatts of clean power with precision-engineered software. Secure, scalable, and intelligent solar infrastructure at your fingertips.
              </p>

              {/* Security Features */}
              <div className="flex gap-8 mt-16 text-white/70">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="material-symbols-outlined text-base">shield_check</span>
                  Enterprise Grade Security
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="material-symbols-outlined text-base">update</span>
                  99.9% Uptime SLA
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="flex-1 flex items-center justify-center p-6 md:p-8 bg-white">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-[#1A365D] rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">solar_power</span>
              </div>
              <div>
                <h1 className="text-[#1A365D] text-xl font-extrabold">Swayog Energy</h1>
                <p className="text-emerald-600 text-xs font-semibold uppercase">SolarManage</p>
              </div>
            </div>

            {/* Welcome Header */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Access your Swayog Energy portal</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6 mb-8">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Corporate Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <span className="material-symbols-outlined text-xl">mail</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="john.doe@swayog.energy"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-900">Security Password</label>
                  <a href="/forgot-password" className="text-sm font-medium text-[#1A365D] hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#1A365D] border-gray-300 rounded focus:ring-[#1A365D]"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                  Keep me logged in for 30 days
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#1A365D] text-white font-bold text-base rounded-lg shadow-lg hover:shadow-xl hover:bg-[#0F2544] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* SSO Options */}
            <div className="mb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-600">Or continue with Enterprise SSO</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-blue-600">grid_view</span>
                  Microsoft
                </button>
              </div>
            </div>

            {/* Role-Based Demo Access */}
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">info</span>
                Role-Based Demo Access
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {ROLE_OPTIONS.map(({ role, label }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleQuickLogin(role)}
                    className="text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-[#1A365D] hover:bg-blue-50 transition-colors text-gray-700 font-medium"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="mt-8 text-center text-xs text-gray-500">
              Don't have an account? <a href="/signup" className="text-[#1A365D] font-semibold hover:underline">Sign up here</a>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 px-6 md:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-[#1A365D]">Swayog Energy</span>
            <span className="text-gray-600">© 2024-2025 Swayog Energy. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-[#1A365D] transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-[#1A365D] transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-[#1A365D] transition-colors">Security</a>
            <a href="#" className="text-gray-600 hover:text-[#1A365D] transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
