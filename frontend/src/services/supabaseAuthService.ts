import { supabase } from '../config/supabase';
import type { User } from '../types/user';

export interface SupabaseAuthResponse {
  user: User | null;
  token: string | null;
  error?: string;
}

/**
 * Supabase Authentication Service
 * Handles user authentication with Supabase Auth
 */

// Register new user
export const registerWithSupabase = async (
  email: string,
  password: string,
  name: string
): Promise<SupabaseAuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'VISITOR'
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata.name || name,
          role: 'visitor'
        },
        token: data.session?.access_token || null
      };
    }

    return { user: null, token: null, error: 'Registration failed' };
  } catch (error: any) {
    return { user: null, token: null, error: error.message };
  }
};

// Login user
export const loginWithSupabase = async (
  email: string,
  password: string
): Promise<SupabaseAuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata.name || '',
          role: data.user.user_metadata.role || 'visitor'
        },
        token: data.session?.access_token || null
      };
    }

    return { user: null, token: null, error: 'Login failed' };
  } catch (error: any) {
    return { user: null, token: null, error: error.message };
  }
};

// Logout user
export const logoutFromSupabase = async (): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return {};
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get current user
export const getCurrentSupabaseUser = async (): Promise<SupabaseAuthResponse> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;

    if (user) {
      return {
        user: {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata.name || '',
          role: user.user_metadata.role || 'visitor'
        },
        token: (await supabase.auth.getSession()).data.session?.access_token || null
      };
    }

    return { user: null, token: null };
  } catch (error: any) {
    return { user: null, token: null, error: error.message };
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata.name || '',
        role: session.user.user_metadata.role || 'visitor'
      });
    } else {
      callback(null);
    }
  });

  return subscription;
};

// Update user profile
export const updateUserProfile = async (updates: {
  name?: string;
  email?: string;
}): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      email: updates.email,
      data: {
        name: updates.name
      }
    });

    if (error) throw error;
    return {};
  } catch (error: any) {
    return { error: error.message };
  }
};

// Reset password (send reset email)
export const resetPassword = async (email: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;
    return {};
  } catch (error: any) {
    return { error: error.message };
  }
};

// Update password
export const updatePassword = async (newPassword: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    return {};
  } catch (error: any) {
    return { error: error.message };
  }
};

export default {
  register: registerWithSupabase,
  login: loginWithSupabase,
  logout: logoutFromSupabase,
  getCurrentUser: getCurrentSupabaseUser,
  onAuthStateChange,
  updateProfile: updateUserProfile,
  resetPassword,
  updatePassword
};

