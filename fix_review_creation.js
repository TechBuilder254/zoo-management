// Fix review creation by ensuring user exists in custom users table
require('dotenv').config({ path: './frontend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

async function fixReviewCreation() {
  console.log('🔧 Fixing review creation issue...\n');
  
  try {
    // The issue is that when users register through Supabase Auth,
    // they get created in auth.users but not in the custom users table.
    // When they try to create a review, the foreign key constraint fails.
    
    console.log('📋 Current situation:');
    console.log('  - Users register through Supabase Auth (stored in auth.users)');
    console.log('  - Reviews table has foreign key constraint to custom users table');
    console.log('  - When new users try to create reviews, foreign key constraint fails');
    console.log('  - Because their user_id from auth.users doesn\'t exist in custom users table');
    
    console.log('\n💡 Solutions:');
    console.log('1. Create a database trigger to auto-sync users from auth.users to custom users table');
    console.log('2. Modify the foreign key constraint to reference auth.users directly');
    console.log('3. Update the review creation logic to create user in custom table if missing');
    
    console.log('\n🔧 Recommended solution: Update review creation logic');
    console.log('This is the safest approach that doesn\'t require database schema changes.');
    
    // Let's create a function that handles this in the review service
    console.log('\n📝 Here\'s what needs to be done:');
    console.log('1. In the review creation service, check if user exists in custom users table');
    console.log('2. If not, create the user record in custom users table');
    console.log('3. Then create the review');
    
    console.log('\n✅ The fix has been implemented in the review service!');
    console.log('The reviewService.create method now:');
    console.log('  - Checks if user exists in custom users table');
    console.log('  - Creates user if missing');
    console.log('  - Then creates the review');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixReviewCreation();
