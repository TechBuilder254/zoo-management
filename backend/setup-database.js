const fs = require('fs');
const { execSync } = require('child_process');

console.log('================================================');
console.log('   ZOO DATABASE SETUP');
console.log('================================================\n');

// Get password from user
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Enter your PostgreSQL password for user Aleqo.4080: ', (password) => {
  const username = 'Aleqo.4080';
  const dbName = 'zoo_db';
  
  // Create .env file
  const envContent = `# Database (PostgreSQL Local)
DATABASE_URL="postgresql://${username}:${password}@localhost:5432/${dbName}?schema=public"

# JWT Secret
JWT_SECRET=super_secret_jwt_key_change_this_in_production_please_zoo_wildlife_2025

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS - Frontend URL
FRONTEND_URL=http://localhost:3000
`;

  fs.writeFileSync('.env', envContent);
  console.log('\n✅ Created .env file');

  try {
    console.log('\n📊 Creating database...');
    execSync(`psql -U ${username} -c "CREATE DATABASE ${dbName};" 2>&1`, {
      env: { ...process.env, PGPASSWORD: password },
      stdio: 'inherit'
    });
    console.log('✅ Database created');
  } catch (error) {
    console.log('ℹ️  Database might already exist, continuing...');
  }

  try {
    console.log('\n🔄 Running migrations...');
    execSync('npx prisma migrate dev --name init', {
      stdio: 'inherit'
    });
    console.log('\n✅ All tables created successfully!');
    
    console.log('\n================================================');
    console.log('   ✅ SETUP COMPLETE!');
    console.log('================================================');
    console.log('\nTables created:');
    console.log('  ✓ users');
    console.log('  ✓ animals');
    console.log('  ✓ reviews (with AI sentiment fields)');
    console.log('  ✓ bookings');
    console.log('  ✓ events');
    console.log('  ✓ favorites');
    console.log('  ✓ health_records');
    console.log('  ✓ newsletters');
    console.log('\nNext steps:');
    console.log('  1. npm run prisma:seed  (add sample data)');
    console.log('  2. npm run dev  (start server)');
    console.log('\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\nTry running manually:');
    console.log('  npx prisma migrate dev --name init');
  }

  readline.close();
});

