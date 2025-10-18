import { supabase, getEmailRedirectUrl } from '../config/supabase';
import { User, LoginCredentials, RegisterData } from '../types';
import configService from './configService';

export interface SupabaseAuthResponse {
  user: User | null;
  session: any;
  error?: any;
}

export interface SupabaseRegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  newsletter?: boolean;
}

export const supabaseAuthService = {
  // Register user with email verification
  register: async (data: RegisterData): Promise<SupabaseAuthResponse> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: getEmailRedirectUrl(),
          data: {
            name: `${data.firstName} ${data.lastName}`.trim(),
            phone: data.phone || '',
            newsletter: data.newsletter || false,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Return the user data in our expected format
      const user: User = {
        id: authData.user?.id || '',
        email: authData.user?.email || '',
        name: authData.user?.user_metadata?.name || '',
        role: 'VISITOR',
        phone: authData.user?.user_metadata?.phone || '',
        email_verified: authData.user?.email_confirmed_at ? true : false,
        created_at: authData.user?.created_at || new Date().toISOString(),
      };

      return {
        user: authData.user?.email_confirmed_at ? user : null, // Only return user if email is verified
        session: authData.session,
      };
    } catch (error: any) {
      console.error('Supabase registration error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<SupabaseAuthResponse> => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      // Check if email is verified
      if (!authData.user?.email_confirmed_at) {
        throw new Error('Please verify your email before logging in. Check your inbox for a verification email.');
      }

      // Return the user data in our expected format
      const user: User = {
        id: authData.user.id,
        email: authData.user.email || '',
        name: authData.user.user_metadata?.name || '',
        role: authData.user.user_metadata?.role || 'VISITOR',
        phone: authData.user.user_metadata?.phone || '',
        email_verified: !!authData.user.email_confirmed_at,
        created_at: authData.user.created_at || new Date().toISOString(),
      };

      return {
        user,
        session: authData.session,
      };
    } catch (error: any) {
      console.error('Supabase login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Supabase logout error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || '',
        role: user.user_metadata?.role || 'VISITOR',
        phone: user.user_metadata?.phone || '',
        email_verified: !!user.email_confirmed_at,
        created_at: user.created_at || new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Supabase get current user error:', error);
      return null;
    }
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Supabase resend verification error:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${configService.get('REACT_APP_EMAIL_REDIRECT_URL') || window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Supabase reset password error:', error);
      throw error;
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange((_event: any, session: any) => {
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
        callback(user);
      } else {
        callback(null);
      }
    });
  },
};