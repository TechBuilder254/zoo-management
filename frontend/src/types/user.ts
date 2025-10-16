export type UserRole = 'visitor' | 'admin' | 'VISITOR' | 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  _id?: string; // For backwards compatibility
  email: string;
  name: string;
  // Legacy fields
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  favoriteAnimals?: string[];
  newsletterSubscribed?: boolean;
  email_verified?: boolean; // Email verification status
  created_at?: string; // Supabase format
  updated_at?: string; // Supabase format
  createdAt?: string; // Legacy format
  updatedAt?: string; // Legacy format
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  // Legacy fields
  firstName?: string;
  lastName?: string;
  phone?: string;
  newsletter?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  newsletterSubscribed?: boolean;
}






