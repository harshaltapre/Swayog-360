import { PageContainer } from '../../utils/htmlToReact';

/**
 * Employee - My Tasks Page
 * Display assigned tasks and work orders for employees
 */
export default function MyTasksPage() {
  const mockTasks = [
    {
      id: 1,
      title: 'Installation at Sector 5',
      status: 'in-progress',
      priority: 'high',
      customer: 'Rajesh Gupta',
      date: '2024-04-22',
    },
    {
      id: 2,
      title: 'Maintenance check - Solar Array B',
      status: 'pending',
      priority: 'medium',
      customer: 'ABC Industries',
      date: '2024-04-25',
    },
    {
      id: 3,
      title: 'Service appointment - Customer follow-up',
      status: 'pending',
      priority: 'low',
      customer: 'Priya Sharma',
      date: '2024-04-28',
    },
  ];

  return (
    <PageContainer title="My Tasks" subtitle="View and manage your assigned work orders">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-blue-900">12</p>
              <p className="text-xs text-blue-600 mt-2">This month</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-yellow-900">3</p>
              <p className="text-xs text-yellow-600 mt-2">Active assignments</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-900">8</p>
              <p className="text-xs text-green-600 mt-2">This month</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-purple-900">1</p>
              <p className="text-xs text-purple-600 mt-2">Awaiting approval</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Your Assigned Tasks</h2>
            <div className="space-y-3">
              {mockTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">Customer: {task.customer}</p>
                    <p className="text-xs text-gray-500">Due: {task.date}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        task.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : task.status === 'pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
