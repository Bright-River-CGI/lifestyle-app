import { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types/auth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export default function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const user = useAuthStore((state) => state.user);
  
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }

  return <>{children}</>;
}