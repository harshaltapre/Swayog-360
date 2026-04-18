import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Step = 'email' | 'otp' | 'password' | 'success';

async function forgotPassword(email: string): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: email.length > 0 };
}

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setCurrentStep('otp');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link');
      setLoading(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setCurrentStep('password');
      setLoading(false);
    }, 600);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setCurrentStep('success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 800);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Side: Brand Imagery & Enterprise Messaging */}
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1A365D] to-[#2D4F7F]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1509391366360-2e938f4af82d?w=1200&h=800&fit=crop")',
                opacity: 0.6,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A365D] via-[#1A365D]/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full flex flex-col justify-between p-12 lg:p-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                architecture
              </span>
              <div>
                <h1 className="text-white text-2xl font-bold tracking-tight">Digital Architect</h1>
                <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">Enterprise Security</p>
              </div>
            </div>

            {/* Main Message */}
            <div className="max-w-md">
              <h2 className="text-white text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                Securing the future of enterprise energy.
              </h2>
              <p className="text-white/80 text-lg leading-relaxed font-medium">
                Access your infrastructure controls with the highest standards of institutional security and reliability.
              </p>
            </div>

            {/* Footer */}
            <div className="text-white/60 text-sm font-medium">
              Swayog Enterprise © 2024. Pioneering Sustainable Infrastructure.
            </div>
          </div>
        </section>

        {/* Right Side: Form */}
        <section className="w-full lg:w-1/2 overflow-y-auto flex flex-col">
          {/* Header - Mobile Branding */}
          <div className="flex-shrink-0 p-6 lg:hidden border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1A365D] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                architecture
              </span>
              <div>
                <h1 className="text-[#1A365D] text-lg font-bold tracking-tight">Swayog Enterprise</h1>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 lg:px-24 lg:py-0">
            <div className="w-full max-w-md">
              {/* Title & Subtitle */}
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
                  {currentStep === 'email' && 'Reset Your Password'}
                  {currentStep === 'otp' && 'Enter OTP Code'}
                  {currentStep === 'password' && 'Create New Password'}
                  {currentStep === 'success' && 'Password Reset'}
                </h2>
                <p className="text-gray-600 font-medium">
                  {currentStep === 'email' && 'Please enter your corporate email address to receive a verification link.'}
                  {currentStep === 'otp' && 'Enter the 6-digit security code sent to your email.'}
                  {currentStep === 'password' && 'Establish your new secure credentials.'}
                  {currentStep === 'success' && 'Your password has been reset successfully.'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-red-700 text-sm flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {currentStep === 'success' && (
                <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg animate-in fade-in zoom-in duration-300">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-green-600 text-3xl flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <div>
                      <p className="text-green-900 font-bold text-base mb-1">Password Reset Successful!</p>
                      <p className="text-green-700 text-sm">
                        Your new password is now active. Redirecting to login...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Email */}
              {currentStep === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Corporate Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <span className="material-symbols-outlined text-xl">mail</span>
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@swayog-enterprise.com"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-[#1A365D] text-white font-bold text-base rounded-lg shadow-lg hover:shadow-xl hover:bg-[#0F2544] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <span className="material-symbols-outlined text-xl">mail</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {currentStep === 'otp' && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      6-Digit Security Code
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <span className="material-symbols-outlined text-xl">verified_user</span>
                      </span>
                      <input
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all text-center text-2xl tracking-widest font-mono"
                        required
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      Check your email for the verification code
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3.5 px-4 bg-[#1A365D] text-white font-bold text-base rounded-lg shadow-lg hover:shadow-xl hover:bg-[#0F2544] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Code
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep('email');
                      setError('');
                    }}
                    className="w-full py-2.5 px-4 text-[#1A365D] font-semibold text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Email
                  </button>
                </form>
              )}

              {/* Step 3: New Password */}
              {currentStep === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <span className="material-symbols-outlined text-xl">lock</span>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all"
                        required
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
                    {newPassword && (
                      <p className="mt-2 text-xs text-gray-600">
                        ✓ {newPassword.length >= 8 ? 'Password meets requirements' : `${8 - newPassword.length} more characters needed`}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <span className="material-symbols-outlined text-xl">lock_check</span>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all"
                        required
                      />
                    </div>
                    {confirmPassword && (
                      <p className={`mt-2 text-xs ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                        {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
                    className="w-full py-3.5 px-4 bg-[#1A365D] text-white font-bold text-base rounded-lg shadow-lg hover:shadow-xl hover:bg-[#0F2544] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        Set New Password
                        <span className="material-symbols-outlined text-xl">check</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep('otp');
                      setError('');
                    }}
                    className="w-full py-2.5 px-4 text-[#1A365D] font-semibold text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to OTP
                  </button>
                </form>
              )}

              {/* Recovery Process Flow */}
              {currentStep !== 'success' && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Recovery Process</h3>
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                        currentStep === 'email' || currentStep === 'otp' || currentStep === 'password'
                          ? 'bg-[#1A365D]'
                          : 'bg-gray-300'
                      }`}>
                        {currentStep === 'email' || currentStep === 'otp' || currentStep === 'password' ? '✓' : '1'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Email Verification</p>
                        <p className="text-xs text-gray-600 mt-0.5">Link sent to your authorized corporate inbox.</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                        currentStep === 'otp' || currentStep === 'password'
                          ? 'bg-[#1A365D]'
                          : 'bg-gray-300'
                      }`}>
                        {currentStep === 'otp' || currentStep === 'password' ? '✓' : '2'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">OTP Verification</p>
                        <p className="text-xs text-gray-600 mt-0.5">Enter the 6-digit security code.</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                        currentStep === 'password'
                          ? 'bg-[#1A365D]'
                          : 'bg-gray-300'
                      }`}>
                        3
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Set New Password</p>
                        <p className="text-xs text-gray-600 mt-0.5">Establish your new secure credentials.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Back to Login */}
              {currentStep !== 'success' && (
                <div className="mt-10 text-center">
                  <a
                    href="/login"
                    className="inline-flex items-center text-sm font-bold text-[#1A365D] hover:text-[#0F2544] transition-colors group"
                  >
                    <span className="material-symbols-outlined text-lg mr-2 group-hover:-translate-x-1 transition-transform">
                      arrow_back
                    </span>
                    Back to Login
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 mt-auto px-6 py-6 sm:px-12 lg:px-24 border-t border-gray-200 text-xs text-gray-600 font-medium">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p>© 2024 Swayog Enterprise. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-[#1A365D] transition-colors">
                  Security Policy
                </a>
                <a href="#" className="hover:text-[#1A365D] transition-colors">
                  Support Center
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
