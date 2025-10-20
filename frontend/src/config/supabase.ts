import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get the correct redirect URL for email verification
export const getEmailRedirectUrl = () => {
  const currentDomain = window.location.origin;
  return `${currentDomain}/verify-email`;
};

// Get Supabase configuration
const getSupabaseConfig = () => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
  }

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

// Create service role client for admin operations
let supabaseServiceClient: SupabaseClient | null = null;

export const getSupabaseServiceClient = (): SupabaseClient => {
  if (!supabaseServiceClient) {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const serviceRoleKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase service role environment variables');
    }
    
    supabaseServiceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });
  }
  return supabaseServiceClient;
};

export default supabase;

