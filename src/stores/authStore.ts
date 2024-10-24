import { create } from 'zustand';
import { User, UserRole } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Simulate API call
    // In real app, role would come from backend
    const role: UserRole = email.includes('employee') ? 'employee' : 'client';
    const mockUser = {
      id: '1',
      email,
      name: role === 'employee' ? 'Employee User' : 'Client User',
      role,
    };
    set({ user: mockUser, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));