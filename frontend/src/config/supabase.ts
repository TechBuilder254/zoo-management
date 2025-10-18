import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get the correct redirect URL for email verification
export const getEmailRedirectUrl = () => {
  const redirectUrl = process.env.REACT_APP_EMAIL_REDIRECT_URL || window.location.origin;
  return `${redirectUrl}/verify-email`;
};

// Get Supabase configuration
const getSupabaseConfig = () => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://yvwvajxkcxhwslegmvqq.supabase.co';
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZjanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw';

  console.log('🔧 Supabase config:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey.substring(0, 20) + '...' });

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

// Create a proxy that calls getSupabaseClient when accessed
export const supabase = new Proxy({} as any, {
  get(_target, prop) {
    const client = getSupabaseClient();
    return client[prop as keyof typeof client];
  }
});

export default supabase;

