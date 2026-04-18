import { PageContainer } from '../../utils/htmlToReact';

/**
 * Employee - Attendance Log Page
 * Display attendance records and work schedule
 */
export default function AttendancePage() {
  return (
    <PageContainer title="Attendance Log" subtitle="View your attendance records and schedule">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Present This Month</p>
              <p className="text-3xl font-bold text-green-900">18</p>
              <p className="text-xs text-green-600 mt-2">days</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Absent</p>
              <p className="text-3xl font-bold text-yellow-900">2</p>
              <p className="text-xs text-yellow-600 mt-2">days</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Leave</p>
              <p className="text-3xl font-bold text-blue-900">2</p>
              <p className="text-xs text-blue-600 mt-2">days</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Attendance %</p>
              <p className="text-3xl font-bold text-purple-900">90%</p>
              <p className="text-xs text-purple-600 mt-2">Great record!</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Attendance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Date</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Check-In</th>
                    <th className="text-left p-3 font-semibold">Check-Out</th>
                    <th className="text-left p-3 font-semibold">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '2024-04-22', status: 'present', checkIn: '09:00 AM', checkOut: '05:30 PM', hours: '8.5' },
                    { date: '2024-04-21', status: 'present', checkIn: '08:45 AM', checkOut: '05:45 PM', hours: '9.0' },
                    { date: '2024-04-20', status: 'present', checkIn: '09:15 AM', checkOut: '05:30 PM', hours: '8.25' },
                    { date: '2024-04-19', status: 'absent', checkIn: '-', checkOut: '-', hours: '0' },
                    { date: '2024-04-18', status: 'present', checkIn: '09:00 AM', checkOut: '05:30 PM', hours: '8.5' },
                  ].map((record) => (
                    <tr key={record.date} className="border-b hover:bg-gray-50">
                      <td className="p-3">{record.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === 'present'
                              ? 'bg-green-100 text-green-800'
                              : record.status === 'absent'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="p-3">{record.checkIn}</td>
                      <td className="p-3">{record.checkOut}</td>
                      <td className="p-3 font-semibold">{record.hours}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
