import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Get the correct redirect URL for email verification
export const getEmailRedirectUrl = () => {
  // Use environment variable if set, otherwise use current origin
  const redirectUrl = process.env.REACT_APP_EMAIL_REDIRECT_URL || window.location.origin;
  return `${redirectUrl}/verify-email`;
};

// Create Supabase client for frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

export default supabase;

