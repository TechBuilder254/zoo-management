// Check database tables using service role key
const { createClient } = require('@supabase/supabase-js');

// Use the anon key you provided
const supabaseUrl = 'https://yvwvajxkcxhwslegmvqq.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZjanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw';

const supabase = createClient(supabaseUrl, anonKey);

async function checkDatabase() {
  console.log('🔍 Checking database with anon key...\n');

  try {
    // Note: We can't access auth.users with anon key, so we'll skip that
    console.log('📋 Note: Cannot access auth.users with anon key (requires service role)');
    console.log('');

    // Check custom users table
    console.log('📋 CUSTOM USERS TABLE:');
    const { data: customUsers, error: customError } = await supabase
      .from('users')
      .select('*');
    
    if (customError) {
      console.error('❌ Error fetching custom users:', customError);
    } else {
      console.log(`✅ Found ${customUsers.length} users in custom users table:`);
      customUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ID: ${user.id}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     Name: ${user.name}`);
        console.log(`     Role: ${user.role}`);
        console.log(`     Created: ${user.created_at}`);
        console.log('');
      });
    }

    // Check reviews table
    console.log('📋 REVIEWS TABLE:');
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*');
    
    if (reviewsError) {
      console.error('❌ Error fetching reviews:', reviewsError);
    } else {
      console.log(`✅ Found ${reviews.length} reviews:`);
      reviews.forEach((review, index) => {
        console.log(`  ${index + 1}. ID: ${review.id}`);
        console.log(`     User ID: ${review.user_id}`);
        console.log(`     Animal ID: ${review.animal_id}`);
        console.log(`     Rating: ${review.rating}`);
        console.log(`     Status: ${review.status}`);
        console.log(`     Comment: ${review.comment?.substring(0, 50)}...`);
        console.log(`     Created: ${review.created_at}`);
        console.log('');
      });
    }

    // Check animals table
    console.log('📋 ANIMALS TABLE:');
    const { data: animals, error: animalsError } = await supabase
      .from('animals')
      .select('id, name, species, status');
    
    if (animalsError) {
      console.error('❌ Error fetching animals:', animalsError);
    } else {
      console.log(`✅ Found ${animals.length} animals:`);
      animals.forEach((animal, index) => {
        console.log(`  ${index + 1}. ID: ${animal.id}`);
        console.log(`     Name: ${animal.name}`);
        console.log(`     Species: ${animal.species}`);
        console.log(`     Status: ${animal.status}`);
        console.log('');
      });
    }

    // Check bookings table
    console.log('📋 BOOKINGS TABLE:');
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, user_id, status, visit_date');
    
    if (bookingsError) {
      console.error('❌ Error fetching bookings:', bookingsError);
    } else {
      console.log(`✅ Found ${bookings.length} bookings:`);
      bookings.forEach((booking, index) => {
        console.log(`  ${index + 1}. ID: ${booking.id}`);
        console.log(`     User ID: ${booking.user_id}`);
        console.log(`     Status: ${booking.status}`);
        console.log(`     Visit Date: ${booking.visit_date}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

checkDatabase();
