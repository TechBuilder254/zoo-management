import { PrismaClient } from '@prisma/client';

// Modify DATABASE_URL to increase connection limit
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || '';
  
  // If using Supabase pooler, increase connection_limit parameter
  if (url.includes('connection_limit=')) {
    return url.replace(/connection_limit=\d+/, 'connection_limit=10');
  } else if (url.includes('pooler.supabase.com')) {
    return url + (url.includes('?') ? '&' : '?') + 'connection_limit=10&pool_timeout=30';
  }
  
  return url;
};

// Initialize Prisma Client with optimized configuration
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});

// Handle connection errors
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
  });

export default prisma;


