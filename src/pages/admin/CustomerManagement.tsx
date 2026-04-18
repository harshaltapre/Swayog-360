import { PageContainer } from '../../utils/htmlToReact';

/**
 * Admin - Customer Management Page
 * Allow admins to view and manage all customers
 */
export default function CustomerManagementPage() {
  return (
    <PageContainer title="Customer Management" subtitle="View and manage all customers in the system">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-blue-900">1,234</p>
              <p className="text-xs text-blue-600 mt-2">↑ 12% from last month</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-3xl font-bold text-green-900">1,089</p>
              <p className="text-xs text-green-600 mt-2">88% of total</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Pending Verification</p>
              <p className="text-3xl font-bold text-yellow-900">98</p>
              <p className="text-xs text-yellow-600 mt-2">8% of total</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Inactive</p>
              <p className="text-3xl font-bold text-red-900">47</p>
              <p className="text-xs text-red-600 mt-2">4% of total</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Customers</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Add New Customer
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
              <p>Customer list will be integrated with live data</p>
              <p className="text-sm mt-2">Displaying placeholder content</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
