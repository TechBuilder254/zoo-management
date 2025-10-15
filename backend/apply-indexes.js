const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function applyIndexes() {
  console.log('🚀 Starting database index creation...\n');

  const indexes = [
    // User indexes
    { name: 'idx_users_role', sql: 'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);' },
    { name: 'idx_users_created_at', sql: 'CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);' },
    
    // Animal indexes
    { name: 'idx_animals_name', sql: 'CREATE INDEX IF NOT EXISTS idx_animals_name ON animals(name);' },
    { name: 'idx_animals_species', sql: 'CREATE INDEX IF NOT EXISTS idx_animals_species ON animals(species);' },
    { name: 'idx_animals_created_at', sql: 'CREATE INDEX IF NOT EXISTS idx_animals_created_at ON animals(created_at DESC);' },
    { name: 'idx_animals_category_status', sql: 'CREATE INDEX IF NOT EXISTS idx_animals_category_status ON animals(category, status);' },
    
    // Review indexes
    { name: 'idx_reviews_rating', sql: 'CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);' },
    { name: 'idx_reviews_created_at', sql: 'CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);' },
    { name: 'idx_reviews_sentiment', sql: 'CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(sentiment);' },
    { name: 'idx_reviews_animal_status', sql: 'CREATE INDEX IF NOT EXISTS idx_reviews_animal_status ON reviews(animal_id, status);' },
    { name: 'idx_reviews_animal_created', sql: 'CREATE INDEX IF NOT EXISTS idx_reviews_animal_created ON reviews(animal_id, created_at DESC);' },
    
    // Booking indexes
    { name: 'idx_bookings_created_at', sql: 'CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);' },
    { name: 'idx_bookings_payment_status', sql: 'CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);' },
    { name: 'idx_bookings_user_status', sql: 'CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings(user_id, status);' },
    { name: 'idx_bookings_user_created', sql: 'CREATE INDEX IF NOT EXISTS idx_bookings_user_created ON bookings(user_id, created_at DESC);' },
    { name: 'idx_bookings_visit_status', sql: 'CREATE INDEX IF NOT EXISTS idx_bookings_visit_status ON bookings(visit_date, status);' },
    
    // Event indexes
    { name: 'idx_events_end_date', sql: 'CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);' },
    { name: 'idx_events_status_start', sql: 'CREATE INDEX IF NOT EXISTS idx_events_status_start ON events(status, start_date);' },
    { name: 'idx_events_date_range', sql: 'CREATE INDEX IF NOT EXISTS idx_events_date_range ON events(start_date, end_date);' },
    
    // Health record indexes
    { name: 'idx_health_records_animal_id', sql: 'CREATE INDEX IF NOT EXISTS idx_health_records_animal_id ON health_records(animal_id);' },
    { name: 'idx_health_records_checkup_date', sql: 'CREATE INDEX IF NOT EXISTS idx_health_records_checkup_date ON health_records(checkup_date DESC);' },
    { name: 'idx_health_records_animal_checkup', sql: 'CREATE INDEX IF NOT EXISTS idx_health_records_animal_checkup ON health_records(animal_id, checkup_date DESC);' },
    
    // Newsletter indexes
    { name: 'idx_newsletters_active', sql: 'CREATE INDEX IF NOT EXISTS idx_newsletters_active ON newsletters(is_active);' },
    { name: 'idx_newsletters_created_at', sql: 'CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON newsletters(created_at DESC);' },
    
    // Ticket price indexes
    { name: 'idx_ticket_prices_active', sql: 'CREATE INDEX IF NOT EXISTS idx_ticket_prices_active ON ticket_prices(is_active);' },
    
    // Promo code indexes
    { name: 'idx_promo_codes_active', sql: 'CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);' },
    { name: 'idx_promo_codes_valid_from', sql: 'CREATE INDEX IF NOT EXISTS idx_promo_codes_valid_from ON promo_codes(valid_from);' },
    { name: 'idx_promo_codes_valid_until', sql: 'CREATE INDEX IF NOT EXISTS idx_promo_codes_valid_until ON promo_codes(valid_until);' },
    { name: 'idx_promo_codes_active_valid', sql: 'CREATE INDEX IF NOT EXISTS idx_promo_codes_active_valid ON promo_codes(is_active, valid_from, valid_until) WHERE is_active = true;' },
  ];

  let created = 0;
  let errors = 0;

  for (const index of indexes) {
    try {
      await prisma.$executeRawUnsafe(index.sql);
      console.log(`✅ ${index.name}`);
      created++;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`⏭️  ${index.name} (already exists)`);
      } else {
        console.log(`❌ ${index.name}: ${error.message}`);
        errors++;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Summary:`);
  console.log(`   Created: ${created}`);
  console.log(`   Errors: ${errors}`);
  console.log('='.repeat(50));
  console.log('\n✨ Database indexes applied successfully!\n');
  console.log('Next steps:');
  console.log('1. Restart your backend server');
  console.log('2. Test your application - it should be MUCH faster!');
  console.log('3. Check query logs to see performance improvements\n');

  await prisma.$disconnect();
}

applyIndexes()
  .catch((error) => {
    console.error('❌ Error applying indexes:', error);
    process.exit(1);
  });

