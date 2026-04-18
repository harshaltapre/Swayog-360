import { PageContainer } from '../../utils/htmlToReact';

/**
 * Super Admin - System Settings & Logs Page
 * View system configuration and audit logs
 */
export default function SystemSettingsPage() {
  return (
    <PageContainer title="System Settings & Logs" subtitle="System configuration and audit trail">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">System Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">System Version:</span>
                <span className="font-semibold">2.0.1</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">Database Version:</span>
                <span className="font-semibold">PostgreSQL 14.2</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">Last Backup:</span>
                <span className="font-semibold">2024-04-22 02:30 AM</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600">API Status:</span>
                <span className="font-semibold text-green-600">Operational</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Server Uptime:</span>
                <span className="font-semibold">45 days 12 hours</span>
              </div>
            </div>
          </div>

          {/* System Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">System Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">API Calls/Day</p>
                <p className="text-2xl font-bold text-blue-900">1.2M</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-green-900">145ms</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-yellow-900">345 GB</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold text-purple-900">0.02%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">System Audit Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold">Timestamp</th>
                  <th className="text-left p-3 font-semibold">User</th>
                  <th className="text-left p-3 font-semibold">Action</th>
                  <th className="text-left p-3 font-semibold">Resource</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    timestamp: '2024-04-22 10:45',
                    user: 'priya.sharma@swayog.com',
                    action: 'User Role Updated',
                    resource: 'User: amit.kumar@swayog.com',
                    status: 'success',
                  },
                  {
                    timestamp: '2024-04-22 09:30',
                    user: 'vikram.mehta@swayog.com',
                    action: 'System Configuration Changed',
                    resource: 'API Rate Limit',
                    status: 'success',
                  },
                  {
                    timestamp: '2024-04-22 08:15',
                    user: 'admin@swayog.com',
                    action: 'Backup Started',
                    resource: 'Database Backup',
                    status: 'success',
                  },
                  {
                    timestamp: '2024-04-22 07:00',
                    user: 'unknown',
                    action: 'Unauthorized Access Attempt',
                    resource: 'Admin Panel',
                    status: 'failed',
                  },
                  {
                    timestamp: '2024-04-22 06:30',
                    user: 'priya.sharma@swayog.com',
                    action: 'New Admin Created',
                    resource: 'User: new.admin@swayog.com',
                    status: 'success',
                  },
                ].map((log, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3">{log.timestamp}</td>
                    <td className="p-3">{log.user}</td>
                    <td className="p-3 font-semibold">{log.action}</td>
                    <td className="p-3">{log.resource}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          log.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
