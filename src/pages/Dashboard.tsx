import { useOrderStore } from '../stores/orderStore';
import { BarChart3, Package, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const orders = useOrderStore((state) => state.orders);

  const stats = {
    total: orders.length,
    inProgress: orders.filter((o) => o.status === 'in-progress').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    review: orders.filter((o) => o.status === 'review').length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.total}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="In Review"
          value={stats.review}
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="green"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{order.title}</h3>
                <p className="text-sm text-gray-500">
                  Created on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: number; 
  icon: typeof Package; 
  color: string;
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  const colors = {
    draft: 'bg-gray-100 text-gray-600',
    'in-progress': 'bg-yellow-100 text-yellow-600',
    review: 'bg-purple-100 text-purple-600',
    completed: 'bg-green-100 text-green-600',
  };
  return colors[status as keyof typeof colors] || colors.draft;
}