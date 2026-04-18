import { useState } from 'react';
import { PageContainer } from '../../utils/htmlToReact';

export default function PartnerSettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    firstName: 'Rajesh',
    lastName: 'Patel',
    email: 'rajesh@energysolutions.com',
    phone: '+91 99999 00000',
    company: 'Energy Solutions Pvt Ltd',
    role: 'Partner Manager',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    systemAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    dailyDigest: true,
    weeklyReport: true,
    maintenanceAlerts: true,
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🛡️' },
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNotificationToggle = (key: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key as keyof typeof notificationSettings],
    });
  };

  return (
    <PageContainer title="Settings" subtitle="Manage your account and preferences">
      <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-4 sm:px-6 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-md border-2 transition-all text-center ${
                activeTab === tab.id
                  ? 'border-[#1A365D] bg-blue-50 text-[#1A365D] font-semibold'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-xl block mb-1">{tab.icon}</span>
              <span className="text-xs md:text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'account' && (
          <div className="bg-white rounded-md shadow-md p-4 sm:p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]" />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 flex gap-3">
              <button className="px-6 py-2 bg-[#1A365D] text-white rounded-sm hover:bg-[#1A365D]/90 font-medium">Save</button>
              <button className="px-6 py-2 bg-gray-200 text-gray-900 rounded-sm hover:bg-gray-300 font-medium">Cancel</button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white rounded-md shadow-md p-4 sm:p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]" placeholder="••••••••" />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 flex gap-3">
              <button className="px-6 py-2 bg-[#1A365D] text-white rounded-sm hover:bg-[#1A365D]/90 font-medium">Update</button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-md shadow-md p-4 sm:p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              {[
                { key: 'systemAlerts', label: '🚨 System Alerts' },
                { key: 'emailNotifications', label: '📧 Email Notifications' },
                { key: 'smsNotifications', label: '📱 SMS Notifications' },
                { key: 'dailyDigest', label: '📰 Daily Digest' },
                { key: 'weeklyReport', label: '📊 Weekly Report' },
                { key: 'maintenanceAlerts', label: '🔧 Maintenance Alerts' },
              ].map((setting) => (
                <label key={setting.key} className="flex items-center p-3 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                    onChange={() => handleNotificationToggle(setting.key)}
                    className="w-4 h-4 text-[#1A365D] rounded"
                  />
                  <span className="ml-3 font-medium text-gray-900">{setting.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="bg-white rounded-md shadow-md p-4 sm:p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-sm flex items-center justify-between">
                <p className="font-medium text-gray-900">Profile Visibility</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#1A365D] rounded-full peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
