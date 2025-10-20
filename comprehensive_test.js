// Comprehensive Supabase test with RLS disabled
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yvwvajxkcxhwslegmvqq.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZjanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw';

console.log('🔍 Comprehensive Supabase test with RLS disabled...');
console.log('URL:', supabaseUrl);
console.log('Key:', anonKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, anonKey);

async function testConnection() {
  try {
    // Test 1: Basic table access
    console.log('\n📋 Test 1: Basic table access');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name')
      .limit(3);
    
    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
    } else {
      console.log('✅ Users table accessible');
      console.log('Users found:', users?.length || 0);
      if (users && users.length > 0) {
        users.forEach((user, i) => {
          console.log(`  ${i+1}. ${user.name} (${user.email})`);
        });
      }
    }

    // Test 2: Reviews table
    console.log('\n📋 Test 2: Reviews table');
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id, user_id, animal_id, rating, status')
      .limit(3);
    
    if (reviewsError) {
      console.log('❌ Reviews table error:', reviewsError.message);
    } else {
      console.log('✅ Reviews table accessible');
      console.log('Reviews found:', reviews?.length || 0);
      if (reviews && reviews.length > 0) {
        reviews.forEach((review, i) => {
          console.log(`  ${i+1}. User: ${review.user_id}, Animal: ${review.animal_id}, Rating: ${review.rating}`);
        });
      }
    }

    // Test 3: Animals table
    console.log('\n📋 Test 3: Animals table');
    const { data: animals, error: animalsError } = await supabase
      .from('animals')
      .select('id, name, species')
      .limit(3);
    
    if (animalsError) {
      console.log('❌ Animals table error:', animalsError.message);
    } else {
      console.log('✅ Animals table accessible');
      console.log('Animals found:', animals?.length || 0);
      if (animals && animals.length > 0) {
        animals.forEach((animal, i) => {
          console.log(`  ${i+1}. ${animal.name} (${animal.species})`);
        });
      }
    }

    // Test 4: Check foreign key constraint issue
    console.log('\n📋 Test 4: Foreign key constraint analysis');
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
