import { PageContainer } from '../../utils/htmlToReact';

/**
 * Customer - My Devices Page
 * Display and manage customer's connected solar devices
 */
export default function MyDevicesPage() {
  const mockDevices = [
    {
      id: 'DEV-001',
      name: 'Rooftop Solar Panel Array',
      type: 'Solar Panels',
      status: 'active',
      model: 'SunPower SPR-A430',
      capacity: '6.45 kW',
      installDate: '2023-05-15',
      lastMaintenance: '2024-02-10',
      nextMaintenance: '2024-08-10',
      performance: 98.5,
    },
    {
      id: 'DEV-002',
      name: 'Main Inverter',
      type: 'Inverter',
      status: 'active',
      model: 'SolarEdge SE6000H',
      capacity: '6 kW',
      installDate: '2023-05-15',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-07-20',
      performance: 99.2,
    },
    {
      id: 'DEV-003',
      name: 'Battery Storage Unit',
      type: 'Battery',
      status: 'active',
      model: 'Tesla Powerwall 2',
      capacity: '13.5 kWh',
      installDate: '2023-08-22',
      lastMaintenance: 'N/A',
      nextMaintenance: '2025-08-22',
      performance: 97.8,
    },
    {
      id: 'DEV-004',
      name: 'Smart Meter',
      type: 'Meter',
      status: 'inactive',
      model: 'Landis+Gyr E450',
      capacity: 'N/A',
      installDate: '2023-05-15',
      lastMaintenance: '2024-03-01',
      nextMaintenance: '2024-09-01',
      performance: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Solar Panels':
        return 'sunny';
      case 'Inverter':
        return 'electrical_services';
      case 'Battery':
        return 'battery_charging_full';
      case 'Meter':
        return 'speed';
      default:
        return 'settings';
    }
  };

  return (
    <PageContainer title="My Devices" subtitle="Manage and monitor your solar equipment">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-2">Total Devices</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-900">4</p>
            <p className="text-xs text-blue-600 mt-2">All equipment</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-2">Active</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-900">3</p>
            <p className="text-xs text-green-600 mt-2">Operating normally</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-2">Avg Performance</p>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-900">98.5%</p>
            <p className="text-xs text-indigo-600 mt-2">System efficiency</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-2">Total Capacity</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-900">19.95 kW</p>
            <p className="text-xs text-purple-600 mt-2">Combined output</p>
          </div>
        </div>

        {/* Devices List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h2 className="text-lg font-semibold">Connected Devices</h2>
              <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                + Add Device
              </button>
            </div>
          </div>

          <div className="divide-y">
            {mockDevices.map((device) => (
              <div
                key={device.id}
                className="p-4 sm:p-6 hover:bg-gray-50 transition cursor-pointer border-b last:border-b-0"
              >
                {/* Device Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="bg-blue-50 rounded-lg p-2 mt-1 hidden sm:flex">
                      <span className="material-symbols-outlined text-blue-900">
                        {getTypeIcon(device.type)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{device.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{device.type}</p>
                      <p className="text-xs text-gray-500 mt-1">{device.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(device.status)}`}>
                    {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                  </span>
                </div>

                {/* Device Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-600">Model</p>
                    <p className="font-semibold text-gray-900 truncate">{device.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Capacity</p>
                    <p className="font-semibold text-gray-900">{device.capacity}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Installed</p>
                    <p className="font-semibold text-gray-900">{device.installDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Performance</p>
                    <p className={`font-semibold ${device.performance === 0 ? 'text-gray-900' : 'text-green-900'}`}>
                      {device.performance === 0 ? 'N/A' : `${device.performance}%`}
                    </p>
                  </div>
                </div>

                {/* Maintenance Info */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-600">Last Maintenance</p>
                    <p className="font-semibold text-gray-900">{device.lastMaintenance}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Next Scheduled</p>
                    <p className="font-semibold text-gray-900">{device.nextMaintenance}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <button className="w-full sm:w-auto text-blue-600 hover:text-blue-900 font-semibold transition">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Management Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">build</span>
              Maintenance
            </h3>
            <p className="text-sm text-blue-800 mb-4">Schedule or track maintenance for your devices</p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
              Schedule Maintenance
            </button>
          </div>

          <div className="bg-green-50 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">assessment</span>
              Performance Report
            </h3>
            <p className="text-sm text-green-800 mb-4">View detailed performance metrics and insights</p>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
