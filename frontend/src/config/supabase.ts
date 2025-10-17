import { createClient, SupabaseClient } from '@supabase/supabase-js';
import configService from '../services/configService';

// Initialize config service
configService.loadConfig();

// Get the correct redirect URL for email verification
export const getEmailRedirectUrl = () => {
  const redirectUrl = configService.get('REACT_APP_EMAIL_REDIRECT_URL') || window.location.origin;
  return `${redirectUrl}/verify-email`;
};

// Get Supabase configuration with fallbacks
const getSupabaseConfig = () => {
  const supabaseUrl = configService.get('REACT_APP_SUPABASE_URL') || 
    process.env.REACT_APP_SUPABASE_URL || 
    'https://yvwvajxkcxhwslegmvqq.supabase.co';
    
  const supabaseAnonKey = configService.get('REACT_APP_SUPABASE_ANON_KEY') || 
    process.env.REACT_APP_SUPABASE_ANON_KEY || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZhanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw';

  return { supabaseUrl, supabaseAnonKey };
};

// Create Supabase client lazily
let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    });
  }
  return supabaseClient;
};

export const supabase = getSupabaseClient();
export default supabase;

