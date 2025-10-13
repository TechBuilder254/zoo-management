export type UserRole = 'visitor' | 'admin';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  favoriteAnimals: string[];
  newsletterSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
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




