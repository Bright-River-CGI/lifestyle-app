import { useParams, Routes, Route, NavLink } from 'react-router-dom';
import { useOrderStore } from '../stores/orderStore';
import OrderOverview from './order-details/OrderOverview';
import OrderProducts from './order-details/OrderProducts';
import OrderFiles from './order-details/OrderFiles';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const orders = useOrderStore((state) => state.orders);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{order.title}</h1>
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `py-4 px-1 border-b-2 text-sm font-medium ${
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="products"
              className={({ isActive }) =>
                `py-4 px-1 border-b-2 text-sm font-medium ${
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Products
            </NavLink>
            <NavLink
              to="files"
              className={({ isActive }) =>
                `py-4 px-1 border-b-2 text-sm font-medium ${
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Files
            </NavLink>
          </nav>
        </div>
      </div>

      <Routes>
        <Route index element={<OrderOverview order={order} />} />
        <Route path="products" element={<OrderProducts order={order} />} />
        <Route path="files" element={<OrderFiles order={order} />} />
      </Routes>
    </div>
  );
}