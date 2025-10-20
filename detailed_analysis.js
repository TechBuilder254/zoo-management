// Detailed analysis of the foreign key constraint issue
require('dotenv').config({ path: './frontend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

async function detailedAnalysis() {
  try {
    console.log('🔍 Detailed analysis of foreign key constraint issue...\n');
    
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, role');
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }
    
    console.log(`📋 Custom users table (${users.length} users):`);
    users.forEach((user, i) => {
      console.log(`  ${i+1}. ${user.id} - ${user.name} (${user.email}) - ${user.role}`);
    });
    
    // Get all reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id, user_id, animal_id, rating, status');
    
    if (reviewsError) {
      console.error('❌ Error fetching reviews:', reviewsError);
      return;
    }
    
    console.log(`\n📋 Reviews table (${reviews.length} reviews):`);
    reviews.forEach((review, i) => {
      console.log(`  ${i+1}. ${review.id} - User: ${review.user_id}, Animal: ${review.animal_id}, Rating: ${review.rating}, Status: ${review.status}`);
    });
    
    // Check for foreign key constraint issues
    const userIds = users.map(u => u.id);
    const reviewUserIds = reviews.map(r => r.user_id);
    const uniqueReviewUserIds = [...new Set(reviewUserIds)];
    
    console.log(`\n📊 Analysis:`);
    console.log(`  - Total users in custom table: ${userIds.length}`);
    console.log(`  - Total reviews: ${reviews.length}`);
    console.log(`  - Unique user IDs in reviews: ${uniqueReviewUserIds.length}`);
    
    const missingUserIds = uniqueReviewUserIds.filter(id => !userIds.includes(id));
    const existingUserIds = uniqueReviewUserIds.filter(id => userIds.includes(id));
    
    console.log(`  - Existing user IDs in reviews: ${existingUserIds.length}`);
    console.log(`  - Missing user IDs in reviews: ${missingUserIds.length}`);
    
    if (missingUserIds.length > 0) {
      console.log(`\n⚠️  Missing user IDs: ${missingUserIds.join(', ')}`);
      console.log('This is why review creation fails with foreign key constraint error.');
    } else {
      console.log(`\n✅ All review user IDs exist in custom users table`);
    }
    
    // Test creating a review to see the actual error
    console.log(`\n🧪 Testing review creation...`);
    try {
      // Try to create a test review with an existing user ID
      const testUserId = userIds[0]; // Use first user ID
      const testAnimalId = 'e5bde7c2-cd62-4209-a0d2-1b48be3d250b'; // Use existing animal ID
      
      const { data: testReview, error: testError } = await supabase
        .from('reviews')
        .insert([{
          user_id: testUserId,
          animal_id: testAnimalId,
          rating: 5,
          comment: 'Test review to check foreign key constraint',
          status: 'PENDING'
        }])
        .select()
        .single();
      
      if (testError) {
        console.log(`❌ Review creation failed: ${testError.message}`);
        console.log(`   Error details: ${JSON.stringify(testError)}`);
      } else {
        console.log(`✅ Review creation successful: ${testReview.id}`);
        
        // Clean up test review
        await supabase.from('reviews').delete().eq('id', testReview.id);
        console.log(`🧹 Test review cleaned up`);
      }
    } catch (error) {
      console.log(`❌ Review creation test failed: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

detailedAnalysis();
