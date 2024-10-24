import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Loader2, Plus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useOrderStore } from '../stores/orderStore';
import ModelLibrary from '../components/ModelLibrary';
import type { Model } from '../stores/orderStore';

const orderSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  brief: z.string().min(10, 'Brief must be at least 10 characters'),
});

type OrderForm = z.infer<typeof orderSchema>;

export default function OrderCreate() {
  const navigate = useNavigate();
  const addOrder = useOrderStore((state) => state.addOrder);
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 5,
  });

  const onSubmit = async (data: OrderForm) => {
    try {
      addOrder({
        ...data,
        status: 'draft',
        products: selectedModels.map(model => ({
          id: model.id,
          name: model.name,
          modelUrl: model.modelUrl,
          thumbnail: model.thumbnail,
          status: 'pending'
        })),
        files: [],
      });
      navigate('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleModelsSelected = (models: Model[]) => {
    setSelectedModels(models);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Order</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Title
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter order title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brief Description
              </label>
              <textarea
                {...register('brief')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe your requirements..."
              />
              {errors.brief && (
                <p className="mt-1 text-sm text-red-600">{errors.brief.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Selected Models
                </label>
                <button
                  type="button"
                  onClick={() => setIsLibraryOpen(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Models
                </button>
              </div>
              
              {selectedModels.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {selectedModels.map(model => (
                    <div
                      key={model.id}
                      className="relative rounded-lg overflow-hidden bg-gray-50 border border-gray-200"
                    >
                      <img
                        src={model.thumbnail}
                        alt={model.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        <h3 className="text-sm font-medium text-gray-900">{model.name}</h3>
                        <p className="text-xs text-gray-500">{model.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                  No models selected. Click "Add Models" to browse the library.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Files
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag & drop files here, or click to select files
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Support for PDF, PNG, JPG up to 10MB each
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Creating...
              </>
            ) : (
              'Create Order'
            )}
          </button>
        </div>
      </form>

      <ModelLibrary
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelect={handleModelsSelected}
      />
    </div>
  );
}