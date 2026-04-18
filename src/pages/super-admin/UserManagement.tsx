import { PageContainer } from '../../utils/htmlToReact';

/**
 * Super Admin - User Management Page
 * Manage all users across the entire system
 */
export default function UserManagementPage() {
  const mockUsers = [
    {
      id: 'ad-001',
      name: 'Priya Sharma',
      email: 'priya.sharma@swayog.com',
      role: 'admin',
      status: 'active',
      department: 'Operations',
    },
    {
      id: 'em-001',
      name: 'Amit Kumar',
      email: 'amit.kumar@swayog.com',
      role: 'employee',
      status: 'active',
      department: 'Field Operations',
    },
    {
      id: 'pt-001',
      name: 'Rajesh Patel',
      email: 'rajesh@ecotech.in',
      role: 'partner',
      status: 'active',
      department: 'EcoTech Solutions',
    },
    {
      id: 'cu-001',
      name: 'Sunita Deshpande',
      email: 'sunita.d@gmail.com',
      role: 'customer',
      status: 'active',
      department: 'Residential',
    },
  ];

  return (
    <PageContainer title="User Management" subtitle="Manage all system users and their roles">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-blue-900">2,456</p>
              <p className="text-xs text-blue-600 mt-2">All roles</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Admins</p>
              <p className="text-3xl font-bold text-green-900">12</p>
              <p className="text-xs text-green-600 mt-2">Active</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Employees</p>
              <p className="text-3xl font-bold text-yellow-900">234</p>
              <p className="text-xs text-yellow-600 mt-2">Active</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Partners</p>
              <p className="text-3xl font-bold text-purple-900">45</p>
              <p className="text-xs text-purple-600 mt-2">Active</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Customers</p>
              <p className="text-3xl font-bold text-pink-900">2,165</p>
              <p className="text-xs text-pink-600 mt-2">Active</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Users</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Add New User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Name</th>
                    <th className="text-left p-3 font-semibold">Email</th>
                    <th className="text-left p-3 font-semibold">Role</th>
                    <th className="text-left p-3 font-semibold">Department</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3">{user.department}</td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button className="text-blue-600 hover:text-blue-700 font-semibold">Edit</button>
                      </td>
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
