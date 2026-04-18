import { PageContainer } from '../../utils/htmlToReact';

/**
 * Partner - Earnings & Payouts Page
 * Display earnings, revenue, and payout information
 */
export default function EarningsPayoutsPage() {
  return (
    <PageContainer title="Earnings & Payouts" subtitle="Track your revenue and manage payouts">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-green-900">₹45.2 L</p>
              <p className="text-xs text-green-600 mt-2">Year to date</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-3xl font-bold text-blue-900">₹5.8 L</p>
              <p className="text-xs text-blue-600 mt-2">April 2024</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Pending Payouts</p>
              <p className="text-3xl font-bold text-yellow-900">₹2.1 L</p>
              <p className="text-xs text-yellow-600 mt-2">Processing</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Paid Out</p>
              <p className="text-3xl font-bold text-purple-900">₹43.1 L</p>
              <p className="text-xs text-purple-600 mt-2">Transferred</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Date</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                    <th className="text-left p-3 font-semibold">Amount</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      date: '2024-04-20',
                      type: 'Earning',
                      description: 'Project completion bonus',
                      amount: '+₹50,000',
                      status: 'credited',
                    },
                    {
                      date: '2024-04-15',
                      type: 'Payout',
                      description: 'Monthly settlement',
                      amount: '-₹4,50,000',
                      status: 'completed',
                    },
                    {
                      date: '2024-04-10',
                      type: 'Earning',
                      description: 'Installation services',
                      amount: '+₹1,20,000',
                      status: 'credited',
                    },
                    {
                      date: '2024-04-05',
                      type: 'Earning',
                      description: 'Maintenance support',
                      amount: '+₹35,000',
                      status: 'credited',
                    },
                    {
                      date: '2024-03-28',
                      type: 'Payout',
                      description: 'Previous month settlement',
                      amount: '-₹5,20,000',
                      status: 'completed',
                    },
                  ].map((txn, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3">{txn.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            txn.type === 'Earning'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td className="p-3">{txn.description}</td>
                      <td className={`p-3 font-semibold ${txn.amount.startsWith('+') ? 'text-green-600' : 'text-blue-600'}`}>
                        {txn.amount}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                          {txn.status}
                        </span>
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
