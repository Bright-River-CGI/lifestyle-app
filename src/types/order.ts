export type OrderStatus = 'draft' | 'in-progress' | 'review' | 'completed';
export type ProductStatus = 'pending' | 'in-progress' | 'completed';

export interface Prop {
  id: string;
  name: string;
  modelUrl: string;
  thumbnail?: string;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  thumbnail?: string;
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

export interface OrderFile {
  id: string;
  name: string;
  url: string;
  type: 'brief' | 'reference';
}

export interface Order {
  id: string;
  title: string;
  brief: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  selectedProps: Prop[];
  products: Product[];
  files: OrderFile[];
}