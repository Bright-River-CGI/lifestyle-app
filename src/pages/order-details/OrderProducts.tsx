import React, { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { useOrderStore } from '../../stores/orderStore';
import { Product, ProductType } from '../../types/product';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/EmptyState';
import RoleGuard from '../../components/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { Order } from '../../types/order';

interface OrderProductsProps {
  order: Order;
}

const productTypes: { value: ProductType; label: string }[] = [
  { value: 'chair', label: 'Chair' },
  { value: 'table', label: 'Table' },
  { value: 'lamp', label: 'Lamp' },
  { value: 'sofa', label: 'Sofa' },
  { value: 'storage', label: 'Storage' },
  { value: 'decor', label: 'Decor' },
  { value: 'other', label: 'Other' },
];

export default function OrderProducts({ order }: OrderProductsProps) {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    type: 'other' as ProductType,
    description: '',
    thumbnail: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const updateOrder = useOrderStore((state) => state.updateOrder);
  const user = useAuthStore((state) => state.user);
  const isEmployee = user?.role === 'employee';
  const products = order.products || [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewImage(imageUrl);
        setNewProduct(prev => ({ ...prev, thumbnail: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.code.trim() || !isEmployee) return;

    const timestamp = new Date().toISOString();
    const product: Product = {
      id: crypto.randomUUID(),
      ...newProduct,
      status: 'pending',
      files: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    updateOrder(order.id, {
      products: [...products, product],
    });

    setNewProduct({
      name: '',
      code: '',
      type: 'other',
      description: '',
      thumbnail: '',
    });
    setPreviewImage(null);
    setIsAddingProduct(false);
  };

  const handleStatusChange = (productId: string, status: Product['status']) => {
    if (!isEmployee) return;
    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, status, updatedAt: new Date().toISOString() } : p
    );
    updateOrder(order.id, { products: updatedProducts });
  };

  const handleDeleteProduct = (productId: string) => {
    if (!isEmployee) return;
    const updatedProducts = products.filter(p => p.id !== productId);
    updateOrder(order.id, { products: updatedProducts });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Products to Create</h2>
        <RoleGuard allowedRoles={['employee']}>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </RoleGuard>
      </div>

      {isAddingProduct && isEmployee && (
        <form onSubmit={handleAddProduct} className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Product Code *
                </label>
                <input
                  type="text"
                  id="code"
                  value={newProduct.code}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, code: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Product Type
              </label>
              <select
                id="type"
                value={newProduct.type}
                onChange={(e) => setNewProduct(prev => ({ ...prev, type: e.target.value as ProductType }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {productTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setNewProduct(prev => ({ ...prev, thumbnail: '' }));
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddingProduct(false);
                  setPreviewImage(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Product
              </button>
            </div>
          </div>
        </form>
      )}

      {products.length > 0 ? (
        <div className="grid gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              orderId={order.id}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteProduct}
              isEmployee={isEmployee}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products added"
          description={isEmployee ? 
            "Add products that need to be created for this order" : 
            "Products will be added by our team once the order is reviewed"}
        />
      )}
    </div>
  );
}