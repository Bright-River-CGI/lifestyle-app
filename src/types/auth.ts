export type UserRole = 'client' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}