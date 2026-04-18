import { PageContainer } from '../../utils/htmlToReact';

/**
 * Admin - Asset Management Page
 * Allow admins to view and manage solar assets
 */
export default function AssetManagementPage() {
  return (
    <PageContainer title="Asset Management" subtitle="Manage solar installations and assets">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Assets</p>
              <p className="text-3xl font-bold text-blue-900">2,456</p>
              <p className="text-xs text-blue-600 mt-2">Solar installations</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-3xl font-bold text-green-900">2,341</p>
              <p className="text-xs text-green-600 mt-2">95% operational</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Maintenance</p>
              <p className="text-3xl font-bold text-yellow-900">82</p>
              <p className="text-xs text-yellow-600 mt-2">3% requiring service</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Capacity</p>
              <p className="text-3xl font-bold text-purple-900">15.3 MW</p>
              <p className="text-xs text-purple-600 mt-2">Peak capacity</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Asset Operations</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Add New Asset
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">View Asset Overview</h3>
                <p className="text-sm text-gray-600 mb-3">Detailed overview of all solar installations</p>
                <button className="text-blue-600 hover:text-blue-700 font-semibold">Go to Overview →</button>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Track Installations</h3>
                <p className="text-sm text-gray-600 mb-3">Monitor active installations in progress</p>
                <button className="text-blue-600 hover:text-blue-700 font-semibold">View Tracking →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
