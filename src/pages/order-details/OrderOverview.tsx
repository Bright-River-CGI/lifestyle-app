import { Order } from '../../types/order';
import { useOrderStore } from '../../stores/orderStore';
import { Clock, CheckCircle, AlertCircle, Box } from 'lucide-react';

interface OrderOverviewProps {
  order: Order;
}

export default function OrderOverview({ order }: OrderOverviewProps) {
  const updateOrder = useOrderStore((state) => state.updateOrder);

  const statusOptions: { value: Order['status']; label: string; icon: typeof Clock }[] = [
    { value: 'draft', label: 'Draft', icon: Clock },
    { value: 'in-progress', label: 'In Progress', icon: Clock },
    { value: 'review', label: 'In Review', icon: AlertCircle },
    { value: 'completed', label: 'Completed', icon: CheckCircle },
  ];

  // Ensure we have default values for arrays
  const selectedProps = order?.selectedProps || [];
  const products = order?.products || [];
  const files = order?.files || [];

  if (!order) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Order not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Status</label>
            <select
              value={order.status}
              onChange={(e) => updateOrder(order.id, { status: e.target.value as Order['status'] })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Created At</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Brief</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{order.brief}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Props</h2>
        {selectedProps.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedProps.map((prop) => (
              <div
                key={prop.id}
                className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
              >
                {prop.thumbnail ? (
                  <img
                    src={prop.thumbnail}
                    alt={prop.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                    <Box className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {prop.name}
                  </h3>
                  <p className="text-xs text-gray-500">{prop.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Box className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No props selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add props from the library when creating or editing the order
            </p>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Products to Create</label>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {products.length}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Selected Props</label>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {selectedProps.length}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Files</label>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {files.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}