// Test Supabase connection using the same config as the frontend
const { createClient } = require('@supabase/supabase-js');

// Use the same configuration as in the frontend
const supabaseUrl = 'https://yvwvajxkcxhwslegmvqq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZjanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test basic connection
    console.log('📡 Testing basic connection...');
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error);
      console.log('\n🔧 Possible solutions:');
      console.log('1. Check if the Supabase project is active');
      console.log('2. Verify the API key is correct');
      console.log('3. Check if RLS policies are blocking access');
      console.log('4. Ensure the database tables exist');
      return;
    }

    console.log('✅ Connection successful!');
    console.log('📊 Database is accessible');

    // Try to get a simple count
    console.log('\n📊 Testing table access...');
    
    // Test users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .limit(5);

    if (usersError) {
      console.error('❌ Users table error:', usersError);
    } else {
      console.log(`✅ Users table accessible - Found ${usersData?.length || 0} users`);
      if (usersData && usersData.length > 0) {
        console.log('📋 Sample users:');
        usersData.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
        });
      }
    }

    // Test animals table
    const { data: animalsData, error: animalsError } = await supabase
      .from('animals')
      .select('id, name, species, status')
      .limit(5);

    if (animalsError) {
      console.error('❌ Animals table error:', animalsError);
    } else {
      console.log(`✅ Animals table accessible - Found ${animalsData?.length || 0} animals`);
    }

    // Test bookings table
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, status, visit_date')
      .limit(5);

    if (bookingsError) {
      console.error('❌ Bookings table error:', bookingsError);
    } else {
      console.log(`✅ Bookings table accessible - Found ${bookingsData?.length || 0} bookings`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testConnection();


