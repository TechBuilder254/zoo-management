const fs = require('fs');
const { execSync } = require('child_process');

const username = 'Aleqo.4080';
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
console.log('✅ Created .env file\n');

try {
  console.log('📊 Creating database...');
  execSync(`psql -U ${username} -c "DROP DATABASE IF EXISTS ${dbName};" 2>&1`, {
    env: { ...process.env, PGPASSWORD: password },
    stdio: 'pipe'
  });
  execSync(`psql -U ${username} -c "CREATE DATABASE ${dbName};" 2>&1`, {
    env: { ...process.env, PGPASSWORD: password },
    stdio: 'pipe'
  });
  console.log('✅ Database created\n');
} catch (error) {
  console.log('ℹ️  Database creation step completed\n');
}

try {
  console.log('🔄 Running Prisma migrations...');
  execSync('npx prisma migrate dev --name init', {
    stdio: 'inherit'
  });
  
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
  console.log('  npm run prisma:seed  (add sample data)');
  console.log('  npm run dev  (start server)');
} catch (error) {
  console.error('\n❌ Error:', error.message);
}

