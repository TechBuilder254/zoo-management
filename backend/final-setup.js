const fs = require('fs');

// Create .env with placeholder - user will edit
const envContent = `# Database (PostgreSQL Local)
# EDIT THIS LINE with your actual PostgreSQL credentials:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/zoo_db?schema=public"

# JWT Secret
JWT_SECRET=super_secret_jwt_key_change_this_in_production_please_zoo_wildlife_2025

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS - Frontend URL
FRONTEND_URL=http://localhost:3000
`;

fs.writeFileSync('.env', envContent);

console.log('================================================');
console.log('   SETUP INSTRUCTIONS');
console.log('================================================\n');
console.log('✅ Created backend/.env file\n');
console.log('📝 NEXT STEPS:\n');
console.log('1. Open: backend/.env');
console.log('2. Replace YOUR_PASSWORD_HERE with your actual PostgreSQL password\n');
console.log('   Common options:');
console.log('   - If username is postgres: DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/zoo_db?schema=public"');
console.log('   - If username is Aleqo.4080: DATABASE_URL="postgresql://Aleqo.4080:Aleqo.4080@localhost:5432/zoo_db?schema=public"\n');
console.log('3. Create the database (in psql or pgAdmin):');
console.log('   CREATE DATABASE zoo_db;\n');
console.log('4. Run migrations:');
console.log('   npm run prisma:migrate\n');
console.log('5. Add sample data:');
console.log('   npm run prisma:seed\n');
console.log('6. Start server:');
console.log('   npm run dev\n');
console.log('================================================\n');

