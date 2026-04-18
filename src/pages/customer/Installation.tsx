import { PageContainer } from '../../utils/htmlToReact';

/**
 * Customer - Installation Page
 * Display solar installation details and status
 */
export default function InstallationPage() {
  return (
    <PageContainer title="My Installation" subtitle="View your solar installation details and performance">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">System Size</p>
              <p className="text-3xl font-bold text-blue-900">10 kW</p>
              <p className="text-xs text-blue-600 mt-2">Installed capacity</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">This Month Production</p>
              <p className="text-3xl font-bold text-green-900">850 kWh</p>
              <p className="text-xs text-green-600 mt-2">Energy generated</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Savings</p>
              <p className="text-3xl font-bold text-yellow-900">₹1.2 L</p>
              <p className="text-xs text-yellow-600 mt-2">Lifetime savings</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">System Status</p>
              <p className="text-3xl font-bold text-purple-900">Active</p>
              <p className="text-xs text-purple-600 mt-2">Running normally</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Installation Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Installation Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Installation Date:</span>
                    <span className="font-semibold">15 Jan 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Panels:</span>
                    <span className="font-semibold">25 x 400W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inverter:</span>
                    <span className="font-semibold">10 kW Hybrid Inverter</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Battery:</span>
                    <span className="font-semibold">15 kWh Lithium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Warranty:</span>
                    <span className="font-semibold">25 Years</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-white border hover:bg-blue-50 transition font-semibold text-blue-600">
                    → View Performance Graph
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-white border hover:bg-blue-50 transition font-semibold text-blue-600">
                    → Download System Report
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-white border hover:bg-blue-50 transition font-semibold text-blue-600">
                    → Schedule Maintenance
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-white border hover:bg-blue-50 transition font-semibold text-blue-600">
                    → Raise Service Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
