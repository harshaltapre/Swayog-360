import { useEffect, useState, type ChangeEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { AccountProfile, BillingAddress, NotificationPreferences } from '../types';
import { useAuthStore } from '../store';
import { fetchAccountProfile, updateAccountPassword, updateAccountProfile, type ProfilePayload } from '../utils/api';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPassword {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface ProfileFormState {
  name: string;
  email: string;
  phone: string;
  language: string;
  avatarUrl: string;
  twoFactorEnabled: boolean;
  notificationPreferences: NotificationPreferences;
  billingAddress: BillingAddress;
}

const EMPTY_BILLING_ADDRESS: BillingAddress = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const EMPTY_PASSWORD: PasswordData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function buildFormState(profile: AccountProfile): ProfileFormState {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    language: profile.language,
    avatarUrl: profile.avatarUrl ?? '',
    twoFactorEnabled: profile.twoFactorEnabled,
    notificationPreferences: { ...profile.notificationPreferences },
    billingAddress: profile.billingAddress ? { ...profile.billingAddress } : { ...EMPTY_BILLING_ADDRESS },
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function roleLabel(role: string) {
  return role
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function AccountSettingsPage() {
  const { updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<ProfileFormState | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordData>(EMPTY_PASSWORD);
  const [showPassword, setShowPassword] = useState<ShowPassword>({
    current: false,
    new: false,
    confirm: false,
  });
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: ['account-profile'],
    queryFn: fetchAccountProfile,
  });

  useEffect(() => {
    if (profileQuery.data?.profile) {
      setFormState(buildFormState(profileQuery.data.profile));
    }
  }, [profileQuery.data?.profile]);

  const profileMutation = useMutation({
    mutationFn: (payload: ProfilePayload) => updateAccountProfile(payload),
    onSuccess: ({ profile }) => {
      queryClient.setQueryData(['account-profile'], { profile });
      updateUser({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        avatarUrl: profile.avatarUrl,
      });
      setFormState(buildFormState(profile));
      setProfileMessage('Account settings saved successfully.');
    },
    onError: (error) => {
      setProfileMessage(error instanceof Error ? error.message : 'Unable to save account settings.');
    },
  });

  const passwordMutation = useMutation({
    mutationFn: updateAccountPassword,
    onSuccess: () => {
      setPasswordData(EMPTY_PASSWORD);
      setPasswordMessage('Password updated successfully.');
    },
    onError: (error) => {
      setPasswordMessage(error instanceof Error ? error.message : 'Unable to update password.');
    },
  });

  const profile = profileQuery.data?.profile ?? null;
  const isCustomer = profile?.role === 'customer';

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleBillingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) =>
      prev
        ? {
            ...prev,
            billingAddress: {
              ...prev.billingAddress,
              [name]: value,
            },
          }
        : prev
    );
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key: keyof NotificationPreferences) => {
    setFormState((prev) =>
      prev
        ? {
            ...prev,
            notificationPreferences: {
              ...prev.notificationPreferences,
              [key]: !prev.notificationPreferences[key],
            },
          }
        : prev
    );
  };

  const handleTwoFactorToggle = () => {
    setFormState((prev) => (prev ? { ...prev, twoFactorEnabled: !prev.twoFactorEnabled } : prev));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setFormState((prev) => (prev ? { ...prev, avatarUrl: result } : prev));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDiscard = () => {
    if (!profile) {
      return;
    }

    setFormState(buildFormState(profile));
    setProfileMessage(null);
  };

  const handleProfileSave = () => {
    if (!formState) {
      return;
    }

    setProfileMessage(null);
    profileMutation.mutate({
      name: formState.name.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      avatarUrl: formState.avatarUrl,
      language: formState.language,
      twoFactorEnabled: formState.twoFactorEnabled,
      notificationPreferences: formState.notificationPreferences,
      billingAddress: isCustomer ? formState.billingAddress : undefined,
    });
  };

  const handlePasswordSubmit = () => {
    setPasswordMessage(null);
    passwordMutation.mutate(passwordData);
  };

  if (profileQuery.isPending) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-blue-900 dark:text-white tracking-tight mb-2">
            Account Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Loading your account preferences...</p>
        </div>
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-blue-900 dark:text-white tracking-tight mb-2">
            Account Settings
          </h1>
          <p className="text-red-600 dark:text-red-400">
            {profileQuery.error instanceof Error ? profileQuery.error.message : 'Unable to load account settings.'}
          </p>
        </div>
      </div>
    );
  }

  if (!formState || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-blue-900 dark:text-white tracking-tight mb-2">
          Account Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your profile, security preferences, and notification settings for Helios Enterprise.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <h2 className="text-sm font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">person</span>
              Profile Details
            </h2>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="h-32 w-32 rounded bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
                    {formState.avatarUrl ? (
                      <img alt="Profile" className="w-full h-full object-cover" src={formState.avatarUrl} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-900 dark:text-blue-400">
                        {formState.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2 bg-blue-900 dark:bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Avatar
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[120px]">
                    Upload an image to keep your profile identifiable across the dashboard.
                  </p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleProfileChange}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Language Preference
                  </label>
                  <select
                    name="language"
                    value={formState.language}
                    onChange={handleProfileChange}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                  >
                    <option>English (United States)</option>
                    <option>English (India)</option>
                    <option>Hindi (India)</option>
                    <option>Spanish (Mexico)</option>
                    <option>French (France)</option>
                    <option>German (Germany)</option>
                  </select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleProfileChange}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formState.phone}
                    onChange={handleProfileChange}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Role
                  </label>
                  <div className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm px-4 py-2.5 rounded text-slate-600 dark:text-slate-300">
                    {roleLabel(profile.role)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h2 className="text-sm font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">security</span>
                Security
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2 pr-10 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword.current ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2 pr-10 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword.new ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2 pr-10 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword.confirm ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded text-xs space-y-2">
                  <p className="font-bold text-slate-700 dark:text-slate-300">Password Requirements:</p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-green-600">check_circle</span>
                      Minimum 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-green-600">check_circle</span>
                      Keep it unique to this account
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-green-600">check_circle</span>
                      Use a mix of letters, numbers, and symbols
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  disabled={passwordMutation.isPending}
                  className="w-full py-2 text-sm font-semibold bg-slate-50 dark:bg-slate-800 text-blue-900 dark:text-blue-400 border border-blue-900/10 dark:border-blue-400/10 rounded hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  {passwordMutation.isPending ? 'Updating Password...' : 'Update Password'}
                </button>

                {passwordMessage ? (
                  <p
                    className={`text-xs ${
                      passwordMutation.isError ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    }`}
                  >
                    {passwordMessage}
                  </p>
                ) : null}
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">
                      verified_user
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Two-Factor Auth
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.twoFactorEnabled}
                      onChange={handleTwoFactorToggle}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 dark:peer-checked:bg-green-600"></div>
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formState.twoFactorEnabled
                    ? 'Two-factor authentication is enabled for your account.'
                    : 'Enable two-factor authentication for stronger account protection.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h2 className="text-sm font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">notifications_active</span>
                Notifications
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {[
                ['systemAlerts', 'System Alerts', 'Critical infrastructure updates'],
                ['financialReports', 'Financial Reports', 'Weekly ROI and billing summaries'],
                ['marketingUpdates', 'Marketing Updates', 'New features and announcements'],
                ['maintenanceAlerts', 'Maintenance Alerts', 'Preventive maintenance reminders'],
                ['projectUpdates', 'Project Updates', 'Installation and deployment status'],
              ].map(([key, label, description]) => (
                <div key={key} className="flex items-center justify-between group">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.notificationPreferences[key as keyof NotificationPreferences]}
                      onChange={() => handleNotificationToggle(key as keyof NotificationPreferences)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-900 dark:peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {isCustomer ? (
            <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h2 className="text-sm font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">home_pin</span>
                  Billing Address
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="line1"
                    value={formState.billingAddress.line1}
                    onChange={handleBillingChange}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="line2"
                    value={formState.billingAddress.line2 ?? ''}
                    onChange={handleBillingChange}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formState.billingAddress.city}
                      onChange={handleBillingChange}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formState.billingAddress.state}
                      onChange={handleBillingChange}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formState.billingAddress.postalCode}
                      onChange={handleBillingChange}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formState.billingAddress.country}
                      onChange={handleBillingChange}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Saved cards and invoices stay on the payments page.
                  </p>
                  <Link
                    to="/customer/payments"
                    className="text-sm font-semibold text-blue-900 dark:text-blue-400 hover:underline"
                  >
                    Manage Payments
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <h2 className="text-sm font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">info</span>
              Account Information
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm text-slate-600 dark:text-slate-400">Account Type</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{roleLabel(profile.role)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm text-slate-600 dark:text-slate-400">Member Since</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatDate(profile.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm text-slate-600 dark:text-slate-400">Last Updated</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatDateTime(profile.updatedAt)}</span>
            </div>
            {profile.customerCode ? (
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Customer Code</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{profile.customerCode}</span>
              </div>
            ) : null}
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
              <span className="text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-200 dark:border-blue-800">
            <h2 className="text-sm font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">tips_and_updates</span>
              Security Tips
            </h2>
          </div>

          <div className="p-6 space-y-3">
            {[
              ['Use Unique Passwords', 'Use different passwords for each account.'],
              ['Enable 2FA Always', 'Keep two-factor authentication enabled whenever possible.'],
              ['Review Alerts', 'Use notifications to stay ahead of payment and maintenance changes.'],
              ['Never Share Credentials', "Don't share login details with anyone."],
            ].map(([title, description]) => (
              <div key={title} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg flex-shrink-0 mt-0.5">
                  check
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{title}</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            {profileMessage ? (
              <span className={profileMutation.isError ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                {profileMessage}
              </span>
            ) : (
              'Save your profile, notification, and billing preferences together.'
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-6 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-colors rounded"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleProfileSave}
              disabled={profileMutation.isPending}
              className="px-6 py-2 text-sm font-semibold bg-blue-900 dark:bg-blue-600 text-white rounded hover:bg-blue-800 dark:hover:bg-blue-500 shadow-sm transition-all disabled:opacity-50"
            >
              {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-12 bg-white dark:bg-slate-900 rounded border-2 border-red-200 dark:border-red-900/50 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-red-200 dark:border-red-900/50 bg-red-50/20 dark:bg-red-900/10">
            <h2 className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">warning</span>
              Danger Zone
            </h2>
          </div>

          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Delete Account</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Contact support before permanent deletion so data retention and billing can be closed correctly.
              </p>
            </div>
            <Link
              to="/support"
              className="px-6 py-2.5 text-sm font-bold text-red-700 dark:text-red-400 border border-red-700 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
        <p>© 2026 Helios Enterprise. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-900 dark:hover:text-blue-400 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-blue-900 dark:hover:text-blue-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-900 dark:hover:text-blue-400 transition-colors">
            System Status
          </a>
        </div>
      </footer>
    </div>
  );
}
