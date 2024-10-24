import React, { useState } from 'react';
import { Product } from '../types/product';
import { Clock, CheckCircle, AlertCircle, FileText, Trash2, Box } from 'lucide-react';
import RoleGuard from './RoleGuard';
import ProductModal from './ProductModal';

interface ProductCardProps {
  product: Product;
  orderId: string;
  onStatusChange: (id: string, status: Product['status']) => void;
  onDelete: (id: string) => void;
  isEmployee: boolean;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, className: 'text-yellow-600 bg-yellow-50' },
  'in-progress': { label: 'In Progress', icon: Clock, className: 'text-blue-600 bg-blue-50' },
  completed: { label: 'Completed', icon: CheckCircle, className: 'text-green-600 bg-green-50' },
};

export default function ProductCard({ product, orderId, onStatusChange, onDelete, isEmployee }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const status = statusConfig[product.status];
  const StatusIcon = status.icon;

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="h-40 w-40 object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-40 w-40 flex items-center justify-center bg-gray-100 flex-shrink-0">
              <Box className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <span className="text-sm text-gray-500">({product.code})</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 capitalize">{product.type}</p>
                {product.description && (
                  <p className="text-sm text-gray-500 mt-2">{product.description}</p>
                )}
              </div>
              <RoleGuard allowedRoles={['employee']}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(product.id);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </RoleGuard>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`h-5 w-5 ${status.className}`} />
                  <RoleGuard 
                    allowedRoles={['employee']}
                    fallback={<span className="text-sm text-gray-600">{status.label}</span>}
                  >
                    <select
                      value={product.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        onStatusChange(product.id, e.target.value as Product['status']);
                      }}
                      className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {Object.entries(statusConfig).map(([value, { label }]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </RoleGuard>
                </div>
                
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {product.files?.length || 0} files
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Created {new Date(product.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        orderId={orderId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEmployee={isEmployee}
      />
    </>
  );
}