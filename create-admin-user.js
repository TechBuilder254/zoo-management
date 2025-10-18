// Script to create admin user in Supabase
// This will be run in the browser console on your Supabase project

const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials
const supabaseUrl = 'https://yvwvajxkcxhwslegmvqq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZhanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    
    // First, try to sign up the admin user
    // TODO: Replace with your admin credentials
    const adminEmail = 'YOUR_ADMIN_EMAIL@example.com';
    const adminPassword = 'YOUR_SECURE_PASSWORD';
    
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          name: 'Admin User',
          role: 'ADMIN'
        }
      }
    });

    if (error) {
      console.error('❌ Error creating admin user:', error.message);
      
      // If user already exists, try to sign in to verify
      if (error.message.includes('already registered')) {
        console.log('ℹ️  Admin user already exists. Testing login...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword
        });
        
        if (signInData.user && !signInError) {
          console.log('✅ Admin user exists and can sign in!');
          console.log('📧 Email:', signInData.user.email);
          console.log('🆔 ID:', signInData.user.id);
          console.log('👤 Name:', signInData.user.user_metadata?.name);
          console.log('🔑 Role:', signInData.user.user_metadata?.role);
          
          // Sign out
          await supabase.auth.signOut();
        } else {
          console.log('❌ Admin user exists but password is wrong or account is not confirmed');
        }
      }
    } else {
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', data.user?.email);
      console.log('🆔 ID:', data.user?.id);
      console.log('👤 Name:', data.user?.user_metadata?.name);
      console.log('🔑 Role:', data.user?.user_metadata?.role);
      
      if (!data.user?.email_confirmed_at) {
        console.log('⚠️  Email verification required. Check your email or confirm in Supabase dashboard.');
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the function
createAdminUser();


