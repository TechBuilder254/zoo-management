import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import { supabaseAuthService, SupabaseAuthResponse } from '../services/supabaseAuthService';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  resendVerification: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from Supabase session
    const loadUserFromSupabase = async () => {
      try {
        const user = await supabaseAuthService.getCurrentUser();
        if (user) {
          setUser(user);
          // Get session token from Supabase
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            setToken(session.access_token);
          }
        }
      } catch (error) {
        console.error('Error loading user from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromSupabase();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          role: session.user.user_metadata?.role || 'VISITOR',
          phone: session.user.user_metadata?.phone || '',
          email_verified: !!session.user.email_confirmed_at,
          created_at: session.user.created_at || new Date().toISOString(),
        };
        setUser(user);
        setToken(session.access_token);
      } else {
        setUser(null);
        setToken(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response: SupabaseAuthResponse = await supabaseAuthService.login(credentials);
      if (response.user) {
        setUser(response.user);
        setToken(response.session?.access_token || '');
        toast.success('Login successful!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response: SupabaseAuthResponse = await supabaseAuthService.register(data);
      if (response.user) {
        setUser(response.user);
        setToken(response.session?.access_token || '');
        toast.success('Registration successful!');
      } else {
        // User registered but email not verified yet
        toast.success('Registration successful! Please check your email to verify your account.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabaseAuthService.logout();
      setUser(null);
      setToken(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still clear local state even if logout fails
      setUser(null);
      setToken(null);
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (updatedUser: User): void => {
    setUser(updatedUser);
  };

  const resendVerification = async (email: string): Promise<void> => {
    try {
      await supabaseAuthService.resendVerification(email);
      toast.success('Verification email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification email');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    resendVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};






