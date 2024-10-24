import { useState } from 'react';
import { X, Search } from 'lucide-react';
import type { Model } from '../stores/orderStore';

interface ModelLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (models: Model[]) => void;
}

// Mock data for the 3D model library
const mockModels: Model[] = [
  {
    id: '1',
    name: 'Modern Sofa',
    category: 'Furniture',
    modelUrl: 'https://example.com/models/sofa.glb',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
  },
  {
    id: '2',
    name: 'Dining Table',
    category: 'Furniture',
    modelUrl: 'https://example.com/models/table.glb',
    thumbnail: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500',
  },
  {
    id: '3',
    name: 'Floor Lamp',
    category: 'Lighting',
    modelUrl: 'https://example.com/models/lamp.glb',
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
  },
  {
    id: '4',
    name: 'Bookshelf',
    category: 'Storage',
    modelUrl: 'https://example.com/models/bookshelf.glb',
    thumbnail: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500',
  },
];

export default function ModelLibrary({ isOpen, onClose, onSelect }: ModelLibraryProps) {
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModels = mockModels.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleModelSelection = (model: Model) => {
    setSelectedModels(prev =>
      prev.some(m => m.id === model.id)
        ? prev.filter(m => m.id !== model.id)
        : [...prev, model]
    );
  };

  const handleConfirm = () => {
    onSelect(selectedModels);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">3D Model Library</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="p-4 grid grid-cols-3 gap-4 overflow-y-auto max-h-[50vh]">
          {filteredModels.map(model => (
            <div
              key={model.id}
              onClick={() => toggleModelSelection(model)}
              className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                selectedModels.some(m => m.id === model.id)
                  ? 'border-indigo-500'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={model.thumbnail}
                alt={model.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 bg-white">
                <h3 className="font-medium text-gray-900">{model.name}</h3>
                <p className="text-sm text-gray-500">{model.category}</p>
              </div>
              {selectedModels.some(m => m.id === model.id) && (
                <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Selected ({selectedModels.length})
          </button>
        </div>
      </div>
    </div>
  );
}