// Simple Supabase connection test
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yvwvajxkcxhwslegmvqq.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZjanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw';

console.log('🔍 Testing Supabase connection with anon key...');
console.log('URL:', supabaseUrl);
console.log('Key:', anonKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, anonKey);

// Simple test - just try to select from any table
supabase
  .from('users')
  .select('id')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.log('❌ Connection failed:', error.message);
    } else {
      console.log('✅ Connection successful!');
      console.log('Data:', data);
    }
  })
  .catch((err) => {
    console.log('❌ Error:', err.message);
  });
