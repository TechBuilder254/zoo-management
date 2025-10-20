// Test Supabase connection using .env file
require('dotenv').config({ path: './frontend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase connection using .env file...');
console.log('URL:', supabaseUrl);
console.log('Key:', anonKey ? anonKey.substring(0, 20) + '...' : 'NOT FOUND');

if (!supabaseUrl || !anonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, anonKey);

async function testConnection() {
  try {
    // Test users table
    console.log('\n📋 Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .limit(5);
    
    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
    } else {
      console.log('✅ Users table accessible');
      console.log(`Found ${users?.length || 0} users:`);
      users?.forEach((user, i) => {
        console.log(`  ${i+1}. ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }

    // Test reviews table
    console.log('\n📋 Testing reviews table...');
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id, user_id, animal_id, rating, status')
      .limit(5);
    
    if (reviewsError) {
      console.log('❌ Reviews table error:', reviewsError.message);
    } else {
      console.log('✅ Reviews table accessible');
      console.log(`Found ${reviews?.length || 0} reviews:`);
      reviews?.forEach((review, i) => {
        console.log(`  ${i+1}. User: ${review.user_id}, Animal: ${review.animal_id}, Rating: ${review.rating}, Status: ${review.status}`);
      });
    }

    // Test animals table
    console.log('\n📋 Testing animals table...');
    const { data: animals, error: animalsError } = await supabase
      .from('animals')
      .select('id, name, species')
      .limit(5);
    
    if (animalsError) {
      console.log('❌ Animals table error:', animalsError.message);
    } else {
      console.log('✅ Animals table accessible');
      console.log(`Found ${animals?.length || 0} animals:`);
      animals?.forEach((animal, i) => {
        console.log(`  ${i+1}. ${animal.name} (${animal.species})`);
      });
    }

    // Analyze foreign key constraint issue
    console.log('\n📋 Analyzing foreign key constraint issue...');
    if (users && reviews) {
      const userIds = users.map(u => u.id);
      const reviewUserIds = reviews.map(r => r.user_id);
      const missingUsers = reviewUserIds.filter(id => !userIds.includes(id));
      
      if (missingUsers.length > 0) {
        console.log('⚠️  Foreign key constraint issue detected!');
        console.log('Missing users in custom users table:', missingUsers);
        console.log('This is why review creation fails with foreign key constraint error.');
      } else {
        console.log('✅ All review user_ids exist in custom users table');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection();
