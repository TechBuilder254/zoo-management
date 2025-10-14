const fs = require('fs');
const { execSync } = require('child_process');

const username = 'postgres';
const password = 'Aleqo.4080';
const dbName = 'zoo_db';

console.log('================================================');
console.log('   ZOO DATABASE SETUP');
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
console.log('✅ Created .env file with correct credentials\n');

try {
  console.log('📊 Creating database zoo_db...');
  
  // Drop if exists
  try {
    execSync(`psql -U ${username} -c "DROP DATABASE IF EXISTS ${dbName};"`, {
      env: { ...process.env, PGPASSWORD: password },
      stdio: 'pipe'
    });
  } catch (e) {
    // Database might not exist, that's fine
  }
  
  // Create database
  execSync(`psql -U ${username} -c "CREATE DATABASE ${dbName};"`, {
    env: { ...process.env, PGPASSWORD: password },
    stdio: 'pipe'
  });
  console.log('✅ Database created successfully\n');
} catch (error) {
  console.log('ℹ️  Database might already exist, continuing...\n');
}

try {
  console.log('🔄 Running Prisma migrations (creating all tables)...\n');
  execSync('npx prisma migrate dev --name init', {
    stdio: 'inherit'
  });
  
  console.log('\n================================================');
  console.log('   ✅ SUCCESS! DATABASE READY!');
  console.log('================================================');
  console.log('\n✓ Database: zoo_db created');
  console.log('✓ All tables created with indexes:\n');
  console.log('  📋 users (email unique index)');
  console.log('  🦁 animals');
  console.log('  ⭐ reviews (with AI sentiment fields!)');
  console.log('  🎫 bookings');
  console.log('  📅 events');
  console.log('  ❤️  favorites (unique user-animal index)');
  console.log('  🏥 health_records');
  console.log('  📧 newsletters');
  console.log('\n🎯 Next steps:');
  console.log('  1. npm run prisma:seed  → Add sample animals + users');
  console.log('  2. npm run dev          → Start backend server');
  console.log('  3. (In another terminal) cd ../frontend && npm start');
  console.log('\n');
} catch (error) {
  console.error('\n❌ Error:', error.message);
}

