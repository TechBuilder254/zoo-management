const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yvwvajxkcxhwslegmvqq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZjanhrY3hod3NsZWdtdnFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQxNDY4MSwiZXhwIjoyMDc1OTkwNjgxfQ.JPCeTzhRTEcus1lovaKLqA_Ir4GR5lDXXQd4QOCSAso'
);

async function syncUsers() {
  console.log('🔄 Syncing users from auth.users to custom users table...');
  
  try {
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }
    
    console.log(`📊 Found ${authUsers.users.length} users in auth.users`);
    
    for (const authUser of authUsers.users) {
      try {
        // Check if user exists in custom users table
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('id')
          .eq('id', authUser.id)
          .single();
        
        if (fetchError && fetchError.code === 'PGRST116') {
          // User doesn't exist, create them
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([{
              id: authUser.id,
              email: authUser.email,
              password: 'supabase_auth_user',
              name: authUser.user_metadata?.name || authUser.email,
              role: authUser.user_metadata?.role || 'VISITOR',
              phone: authUser.user_metadata?.phone || '',
              created_at: authUser.created_at,
              updated_at: authUser.updated_at
            }])
            .select()
            .single();
          
          if (createError) {
            console.error(`❌ Error creating user ${authUser.email}:`, createError);
          } else {
            console.log(`✅ Created user: ${authUser.email}`);
          }
        } else if (fetchError) {
          console.error(`❌ Error checking user ${authUser.email}:`, fetchError);
        } else {
          console.log(`ℹ️  User ${authUser.email} already exists`);
        }
      } catch (error) {
        console.error(`❌ Error processing user ${authUser.email}:`, error);
      }
    }
    
    console.log('✅ User sync completed!');
  } catch (error) {
    console.error('❌ Error in sync process:', error);
  }
}

syncUsers();
