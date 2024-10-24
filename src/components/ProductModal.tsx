import React, { useState } from 'react';
import { X, Box, Clock, Upload } from 'lucide-react';
import { Product } from '../types/product';
import { useOrderStore } from '../stores/orderStore';
import FileUploader from './FileUploader';
import FileCard from './FileCard';
import RoleGuard from './RoleGuard';
import { OrderFile } from '../types/file';

interface ProductModalProps {
  product: Product;
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  isEmployee: boolean;
}

type Tab = 'overview' | 'files';

export default function ProductModal({ product, orderId, isOpen, onClose, isEmployee }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const updateOrder = useOrderStore((state) => state.updateOrder);
  const orders = useOrderStore((state) => state.orders);
  const order = orders.find(o => o.id === orderId);

  if (!isOpen || !order) return null;

  const handleFileSelect = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      status: 'pending'
    }));

    const updatedProducts = order.products.map(p =>
      p.id === product.id
        ? { ...p, files: [...p.files, ...newFiles] }
        : p
    );

    updateOrder(orderId, { products: updatedProducts });
  };

  const handleFileDelete = (fileId: string) => {
    const updatedProducts = order.products.map(p =>
      p.id === product.id
        ? { ...p, files: p.files.filter(f => f.id !== fileId) }
        : p
    );

    updateOrder(orderId, { products: updatedProducts });
  };

  const handleFileStatusChange = (fileId: string, status: OrderFile['status']) => {
    const updatedProducts = order.products.map(p =>
      p.id === product.id
        ? {
            ...p,
            files: p.files.map(f =>
              f.id === fileId ? { ...f, status } : f
            )
          }
        : p
    );

    updateOrder(orderId, { products: updatedProducts });
  };

  const handleFileDownload = (file: OrderFile) => {
    window.open(file.url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-1">Product Code: {product.code}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-4 text-sm font-medium border-b-2 -mb-px ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`py-4 px-4 text-sm font-medium border-b-2 -mb-px ${
                activeTab === 'files'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Files
            </button>
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              <div className="flex space-x-6">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-48 h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Box className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="capitalize">{product.status}</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Type</dt>
                      <dd className="mt-1 capitalize">{product.type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="mt-1">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                      <dd className="mt-1">
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                  {product.description && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-500">Description</h4>
                      <p className="mt-1 text-gray-900">{product.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <RoleGuard allowedRoles={['employee']}>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h3>
                  <FileUploader onFileSelect={handleFileSelect} />
                </div>
              </RoleGuard>

              <div className="space-y-4">
                {product.files.length > 0 ? (
                  product.files.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onDelete={handleFileDelete}
                      onDownload={handleFileDownload}
                      onApprove={(id) => handleFileStatusChange(id, 'approved')}
                      onReject={(id) => handleFileStatusChange(id, 'rejected')}
                      isEmployee={isEmployee}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No files uploaded</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {isEmployee
                        ? "Upload files for this product using the form above"
                        : "No files have been uploaded for this product yet"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}