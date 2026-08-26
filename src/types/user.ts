export type UserRole = 'public' | 'volunteer' | 'official' | 'admin';

export interface User {
  id: string;
  email?: string;
  phoneNumber?: string;
  fullName: string;
  role: UserRole;
  organization?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
