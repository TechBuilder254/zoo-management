const fs = require('fs');
const { execSync } = require('child_process');

const username = 'postgres';
const password = 'postgres'; // Default postgres password
const dbName = 'zoo_db';

console.log('================================================');
console.log('   ZOO DATABASE SETUP WITH POSTGRESQL');
console.log('================================================\n');

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
console.log('✅ Created .env file\n');

try {
  console.log('📊 Creating database zoo_db...');
  
  // Drop if exists
  try {
    execSync(`psql -U ${username} -c "DROP DATABASE IF EXISTS ${dbName};"`, {
      env: { ...process.env, PGPASSWORD: password },
      stdio: 'pipe'
    });
  } catch (e) {}
  
  // Create database
  execSync(`psql -U ${username} -c "CREATE DATABASE ${dbName};"`, {
    env: { ...process.env, PGPASSWORD: password },
    stdio: 'pipe'
  });
  console.log('✅ Database zoo_db created\n');
} catch (error) {
  console.log('⚠️  Database creation: ' + error.message);
  console.log('Continuing with migration...\n');
}

try {
  console.log('🔄 Running Prisma migrations to create all tables...\n');
  execSync('npx prisma migrate dev --name init', {
    stdio: 'inherit'
  });
  
  console.log('\n================================================');
  console.log('   ✅ DATABASE SETUP COMPLETE!');
  console.log('================================================');
  console.log('\n✓ Database: zoo_db');
  console.log('✓ All tables created with indexes:');
  console.log('  • users (with email index)');
  console.log('  • animals');
  console.log('  • reviews (with AI sentiment fields)');
  console.log('  • bookings');
  console.log('  • events');
  console.log('  • favorites (with unique user-animal index)');
  console.log('  • health_records');
  console.log('  • newsletters (with email index)');
  console.log('\n📊 Next steps:');
  console.log('  1. npm run prisma:seed    → Add 8 sample animals + users');
  console.log('  2. npm run dev            → Start backend server');
  console.log('\n');
} catch (error) {
  console.error('\n❌ Migration error:', error.message);
  console.log('\nManual steps:');
  console.log('1. Make sure PostgreSQL is running');
  console.log('2. Update password in .env if needed');
  console.log('3. Run: npx prisma migrate dev --name init');
}

