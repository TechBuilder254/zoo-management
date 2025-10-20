// Fix user sync between Supabase Auth and custom users table
require('dotenv').config({ path: './frontend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔧 Fixing user sync issue...');

if (!supabaseUrl || !anonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, anonKey);

async function fixUserSync() {
  try {
    // Get all users from custom users table
    console.log('📋 Getting users from custom users table...');
    const { data: customUsers, error: customError } = await supabase
      .from('users')
      .select('id, email, name, role');
    
    if (customError) {
      console.error('❌ Error fetching custom users:', customError);
      return;
    }
    
    console.log(`✅ Found ${customUsers.length} users in custom users table`);
    
    // Get all reviews to find missing user IDs
    console.log('📋 Getting reviews to find missing user IDs...');
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('user_id');
    
    if (reviewsError) {
      console.error('❌ Error fetching reviews:', reviewsError);
      return;
    }
    
    const customUserIds = customUsers.map(u => u.id);
    const reviewUserIds = [...new Set(reviews.map(r => r.user_id))]; // Remove duplicates
    const missingUserIds = reviewUserIds.filter(id => !customUserIds.includes(id));
    
    console.log(`📊 Analysis:`);
    console.log(`  - Custom users: ${customUserIds.length}`);
    console.log(`  - Review user IDs: ${reviewUserIds.length}`);
    console.log(`  - Missing user IDs: ${missingUserIds.length}`);
    
    if (missingUserIds.length > 0) {
      console.log(`⚠️  Missing user IDs: ${missingUserIds.join(', ')}`);
      console.log('\n🔧 Solution: We need to create these users in the custom users table.');
      console.log('Since we can\'t access auth.users with anon key, we need to:');
      console.log('1. Use the service role key to access auth.users');
      console.log('2. Create missing users in the custom users table');
      console.log('3. Or modify the foreign key constraint to reference auth.users directly');
    } else {
      console.log('✅ All review user IDs exist in custom users table');
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixUserSync();
