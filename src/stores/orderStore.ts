import { create } from 'zustand';

export interface Model {
  id: string;
  name: string;
  modelUrl: string;
  thumbnail: string;
  category: string;
}

export interface OrderProduct {
  id: string;
  name: string;
  modelUrl: string;
  thumbnail: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface OrderFile {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Order {
  id: string;
  title: string;
  brief: string;
  status: 'draft' | 'submitted' | 'in-progress' | 'completed';
  products: OrderProduct[];
  files: OrderFile[];
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, orderData: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  addOrder: (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      orders: [...state.orders, newOrder],
    }));
  },
  updateOrder: (id, orderData) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id
          ? { ...order, ...orderData, updatedAt: new Date().toISOString() }
          : order
      ),
    }));
  },
  deleteOrder: (id) => {
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    }));
  },
}));