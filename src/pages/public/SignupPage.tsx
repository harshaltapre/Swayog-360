import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Sign-up Page - Swayog Enterprise
 * Responsive registration interface with role selection
 */
export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'employee',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
      if (/\d/.test(value)) strength++;
      if (/[!@#$%^&*]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!formData.terms) {
      alert('Please agree to Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      alert(`Account created successfully! Please login with ${formData.email}`);
      navigate('/login');
      setLoading(false);
    }, 1000);
  };

  const getPasswordStrengthLabel = () => {
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return labels[passwordStrength] || 'Weak';
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ba1a1a', '#ff9800', '#ffc107', '#4caf50', '#2e7d32'];
    return colors[passwordStrength] || '#ba1a1a';
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side: Visual & Value Prop - Hidden on mobile */}
      <section className="hidden md:flex md:w-1/2 relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1A365D]">
        <img
          alt="Solar Array"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCK1af2irYy11cTC3XhH5VXcvvdwU-pHua4oH57vbrao0f69Q2MrTVK7ytpF_7UGItF_h0UnpxzQdg_eD9aiUZ4wxUU_RtwDfx2jVJ0HDc6ff8QWIMeR1_TNDrMiBTHzzQ21icCqQiSZkE6jRYMjYl9Qgu_2ZQf9RDPrzFdUdNdwO1iGtkzJACy1CCiJ_k_h5UQ69e7-PHxqFOI_EmjNFE0PDcaa3jIel4GWmV5sha_G1pnhQAf-KnBpMS850I_mmsdXzFPsJOJkw"
        />
        <div className="absolute inset-0 bg-[#1A365D]/80 backdrop-blur-sm"></div>

        <div className="relative z-10 px-8 md:px-16 py-20 text-white max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Join the Digital Architect of Sustainable Energy
          </h1>
          <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed mb-8">
            Empowering enterprise leaders with precision solar management and real-time data orchestration for a
            cleaner industrial future.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/20">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#48BB78] text-2xl">analytics</span>
              <div>
                <p className="font-bold text-sm">Real-time Analytics</p>
                <p className="text-xs opacity-70">Deep insights into asset performance.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#48BB78] text-2xl">security</span>
              <div>
                <p className="font-bold text-sm">Enterprise Security</p>
                <p className="text-xs opacity-70">RBAC-driven management protocol.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Signup Form */}
      <section className="flex-1 bg-white px-6 md:px-16 py-8 md:py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Top Navigation - Mobile */}
          <div className="md:hidden flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1A365D]">Create account</h2>
              <p className="text-sm text-slate-600 mt-0.5">Join Swayog Energy today</p>
            </div>
          </div>

          {/* Desktop Title */}
          <div className="hidden md:block mb-10">
            <h2 className="text-3xl font-bold text-[#1A365D] mb-2">Create your account</h2>
            <p className="text-slate-600 text-sm">Start managing your solar infrastructure with Swayog.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="fullName">
                Full Name
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all outline-none text-slate-900"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Corporate Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="email">
                Corporate Email
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all outline-none text-slate-900"
                id="email"
                name="email"
                placeholder="john@enterprise.com"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="role">
                Organizational Role
              </label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all outline-none text-slate-900 appearance-none cursor-pointer"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="super_admin">Super Admin - Full Platform Access</option>
                <option value="admin">Admin - Operations Management</option>
                <option value="partner">Partner - Partner Program</option>
                <option value="employee">Employee - Field Operations</option>
                <option value="customer">Customer - Customer Portal</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all outline-none text-slate-900"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {/* Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor: i < passwordStrength ? getPasswordStrengthColor() : '#e5e7eb',
                        }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: getPasswordStrengthColor() }}>
                    {getPasswordStrengthLabel()} Password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all outline-none text-slate-900"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Terms of Service */}
            <div className="flex items-start gap-3">
              <input
                className="mt-1 w-4 h-4 text-[#1A365D] bg-slate-50 border-slate-300 rounded focus:ring-[#1A365D]"
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleInputChange}
                required
              />
              <label className="text-sm text-slate-600 leading-tight" htmlFor="terms">
                I agree to the{' '}
                <a className="text-[#1A365D] font-semibold hover:underline" href="#">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a className="text-[#1A365D] font-semibold hover:underline" href="#">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="w-full py-3 bg-[#1A365D] text-white font-bold rounded-lg shadow-md hover:bg-[#0f1f3a] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link className="text-[#1A365D] font-bold hover:underline" to="/login">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
