export type ProductType = 'chair' | 'table' | 'lamp' | 'sofa' | 'storage' | 'decor' | 'other';

export interface Product {
  id: string;
  name: string;
  code: string;
  type: ProductType;
  description: string;
  thumbnail?: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  createdAt: string;
  updatedAt: string;
  files: ProductFile[];
}

export interface ProductFile {
  id: string;
  name: string;
  url: string;
  type: 'draft' | 'revision' | 'final';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}