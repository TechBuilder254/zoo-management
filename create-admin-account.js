// Script to create admin account in Supabase
// Run this in your browser console on your Supabase project

const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://yvwvajxkcxhwslegmvqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZhanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminAccount() {
  try {
    // Create admin user
    // TODO: Replace with your admin credentials
    const adminEmail = 'YOUR_ADMIN_EMAIL@example.com';
    const adminPassword = 'YOUR_SECURE_PASSWORD';
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Skip email verification
      user_metadata: {
        name: 'Admin User',
        role: 'ADMIN'
      }
    });

    if (error) {
      console.error('Error creating admin account:', error);
    } else {
      console.log('Admin account created successfully:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
createAdminAccount();


