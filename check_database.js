// Check what exists in the database
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://yvwvajxkcxhwslegmvqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZjanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking database contents...\n');

  try {
    // Check users table
    console.log('📊 USERS TABLE:');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
    } else {
      console.log(`✅ Found ${users?.length || 0} users:`);
      users?.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - ID: ${user.id}`);
      });
    }

    console.log('\n📊 ANIMALS TABLE:');
    const { data: animals, error: animalsError } = await supabase
      .from('animals')
      .select('*')
      .order('created_at', { ascending: false });

    if (animalsError) {
      console.error('❌ Error fetching animals:', animalsError);
    } else {
      console.log(`✅ Found ${animals?.length || 0} animals:`);
      animals?.forEach((animal, index) => {
        console.log(`  ${index + 1}. ${animal.name} (${animal.species}) - Status: ${animal.status}`);
      });
    }

    console.log('\n📊 BOOKINGS TABLE:');
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('❌ Error fetching bookings:', bookingsError);
    } else {
      console.log(`✅ Found ${bookings?.length || 0} bookings:`);
      bookings?.forEach((booking, index) => {
        console.log(`  ${index + 1}. Booking ID: ${booking.id} - Status: ${booking.status} - Date: ${booking.visit_date}`);
      });
    }

    console.log('\n📊 REVIEWS TABLE:');
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('❌ Error fetching reviews:', reviewsError);
    } else {
      console.log(`✅ Found ${reviews?.length || 0} reviews:`);
      reviews?.forEach((review, index) => {
        console.log(`  ${index + 1}. Rating: ${review.rating} - Status: ${review.status} - Comment: ${review.comment?.substring(0, 50)}...`);
      });
    }

    console.log('\n📊 EVENTS TABLE:');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError);
    } else {
      console.log(`✅ Found ${events?.length || 0} events:`);
      events?.forEach((event, index) => {
        console.log(`  ${index + 1}. ${event.title} - Status: ${event.status} - Date: ${event.start_date}`);
      });
    }

    console.log('\n📊 TICKET PRICES TABLE:');
    const { data: ticketPrices, error: ticketPricesError } = await supabase
      .from('ticket_prices')
      .select('*')
      .order('created_at', { ascending: false });

    if (ticketPricesError) {
      console.error('❌ Error fetching ticket prices:', ticketPricesError);
    } else {
      console.log(`✅ Found ${ticketPrices?.length || 0} ticket prices:`);
      ticketPrices?.forEach((price, index) => {
        console.log(`  ${index + 1}. ${price.ticket_type}: KSh ${price.price} - Active: ${price.is_active}`);
      });
    }

    console.log('\n📊 PROMO CODES TABLE:');
    const { data: promoCodes, error: promoCodesError } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (promoCodesError) {
      console.error('❌ Error fetching promo codes:', promoCodesError);
    } else {
      console.log(`✅ Found ${promoCodes?.length || 0} promo codes:`);
      promoCodes?.forEach((promo, index) => {
        console.log(`  ${index + 1}. ${promo.code} - Active: ${promo.is_active} - Uses: ${promo.used_count}/${promo.max_uses || 'unlimited'}`);
      });
    }

    console.log('\n📊 HEALTH RECORDS TABLE:');
    const { data: healthRecords, error: healthRecordsError } = await supabase
      .from('health_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (healthRecordsError) {
      console.error('❌ Error fetching health records:', healthRecordsError);
    } else {
      console.log(`✅ Found ${healthRecords?.length || 0} health records:`);
      healthRecords?.forEach((record, index) => {
        console.log(`  ${index + 1}. ${record.diagnosis} - Vet: ${record.vet_name} - Date: ${record.checkup_date}`);
      });
    }

    console.log('\n📊 NEWSLETTERS TABLE:');
    const { data: newsletters, error: newslettersError } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false });

    if (newslettersError) {
      console.error('❌ Error fetching newsletters:', newslettersError);
    } else {
      console.log(`✅ Found ${newsletters?.length || 0} newsletter subscriptions:`);
      newsletters?.forEach((newsletter, index) => {
        console.log(`  ${index + 1}. ${newsletter.email} - Active: ${newsletter.is_active}`);
      });
    }

  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

checkDatabase();


