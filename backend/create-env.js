const fs = require('fs');

const envContent = `# Database (PostgreSQL Local)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zoo_db?schema=public"

# JWT Secret
JWT_SECRET=super_secret_jwt_key_change_this_in_production_please_zoo_wildlife_2025

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS - Frontend URL
FRONTEND_URL=http://localhost:3000
`;

fs.writeFileSync('.env', envContent);
console.log('✅ Created .env file successfully!');

