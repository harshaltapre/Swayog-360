import { useState } from 'react';
import { PageContainer } from '../../utils/htmlToReact';
import RaiseServiceRequestModal from '../../components/modals/RaiseServiceRequestModal';

/**
 * Customer - Service Requests Page
 * Display customer's service requests and support tickets
 */
export default function ServiceRequestsPage() {
  const [serviceRequestModalOpen, setServiceRequestModalOpen] = useState(false);
  const [serviceRequests, setServiceRequests] = useState([
    {
      id: 'SR-001',
      title: 'Panel cleaning service required',
      status: 'resolved',
      priority: 'low',
      created: '2024-04-10',
      resolved: '2024-04-15',
    },
    {
      id: 'SR-002',
      title: 'Inverter making unusual noise',
      status: 'in-progress',
      priority: 'high',
      created: '2024-04-18',
      resolved: null,
    },
    {
      id: 'SR-003',
      title: 'Performance monitoring app not updating',
      status: 'open',
      priority: 'medium',
      created: '2024-04-20',
      resolved: null,
    },
    {
      id: 'SR-004',
      title: 'Warranty claim documentation',
      status: 'open',
      priority: 'medium',
      created: '2024-04-22',
      resolved: null,
    },
  ]);

  const handleServiceRequestSubmit = (data: { title: string; description: string; priority: 'low' | 'medium' | 'high' | 'critical'; category: string; attachment?: File }) => {
    const newRequest = {
      id: `SR-${String(serviceRequests.length + 1).padStart(3, '0')}`,
      title: data.title,
      status: 'open' as const,
      priority: data.priority,
      created: new Date().toISOString().split('T')[0],
      resolved: null,
    };
    setServiceRequests([newRequest, ...serviceRequests]);
    setServiceRequestModalOpen(false);
    console.log('New service request created:', newRequest);
  };

  return (
    <PageContainer title="Service Requests" subtitle="Track and manage your service requests">
      <div className="space-y-6">
        {/* Summary Stats - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Requests</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-900">24</p>
            <p className="text-xs text-blue-600 mt-2">All time</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Open</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-900">3</p>
            <p className="text-xs text-yellow-600 mt-2">Awaiting action</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">In Progress</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-900">1</p>
            <p className="text-xs text-blue-600 mt-2">Being worked on</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Resolved</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-900">20</p>
            <p className="text-xs text-green-600 mt-2">Completed</p>
          </div>
        </div>

        {/* Service Requests List */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h2 className="text-lg font-semibold">Your Service Requests</h2>
              <button
                type="button"
                onClick={() => setServiceRequestModalOpen(true)}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                + Raise New Request
              </button>
            </div>
          </div>

          <div className="divide-y">
            {serviceRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 sm:p-6 hover:bg-gray-50 cursor-pointer transition border-b last:border-b-0"
              >
                {/* Request Header - Mobile: Stacked, Desktop: Horizontal */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{request.title}</h3>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded w-fit">{request.id}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Created: {request.created}</p>
                  </div>
                </div>

                {/* Status Badges - Responsive */}
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                      request.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : request.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    Priority: {request.priority}
                  </span>
                  <span
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                      request.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {request.status.replace('-', ' ')}
                  </span>
                  {request.resolved && (
                    <span className="text-xs text-gray-600">Resolved: {request.resolved}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RaiseServiceRequestModal
        isOpen={serviceRequestModalOpen}
        onClose={() => setServiceRequestModalOpen(false)}
        onSubmit={handleServiceRequestSubmit}
      />
    </PageContainer>
  );
}
