-- =====================================================
-- DATABASE PERFORMANCE INDEXES
-- Zoo Management System
-- =====================================================
-- Purpose: Strategic indexes to dramatically improve query performance
-- Impact: Reduces query time from seconds to milliseconds
-- =====================================================

-- Clean up: Drop indexes if they already exist (optional)
-- Uncomment these lines if you need to recreate indexes
/*
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_created_at;
DROP INDEX IF EXISTS idx_animals_name;
DROP INDEX IF EXISTS idx_animals_species;
DROP INDEX IF EXISTS idx_animals_created_at;
DROP INDEX IF EXISTS idx_animals_category_status;
DROP INDEX IF EXISTS idx_reviews_rating;
DROP INDEX IF EXISTS idx_reviews_created_at;
DROP INDEX IF EXISTS idx_reviews_sentiment;
DROP INDEX IF EXISTS idx_reviews_animal_status;
DROP INDEX IF EXISTS idx_reviews_animal_created;
DROP INDEX IF EXISTS idx_bookings_created_at;
DROP INDEX IF EXISTS idx_bookings_payment_status;
DROP INDEX IF EXISTS idx_bookings_user_status;
DROP INDEX IF EXISTS idx_bookings_user_created;
DROP INDEX IF EXISTS idx_bookings_visit_status;
DROP INDEX IF EXISTS idx_events_end_date;
DROP INDEX IF EXISTS idx_events_status_start;
DROP INDEX IF EXISTS idx_events_date_range;
DROP INDEX IF EXISTS idx_health_records_animal_id;
DROP INDEX IF EXISTS idx_health_records_checkup_date;
DROP INDEX IF EXISTS idx_health_records_animal_checkup;
DROP INDEX IF EXISTS idx_newsletters_active;
DROP INDEX IF EXISTS idx_newsletters_created_at;
DROP INDEX IF EXISTS idx_ticket_prices_active;
DROP INDEX IF EXISTS idx_promo_codes_active;
DROP INDEX IF EXISTS idx_promo_codes_valid_from;
DROP INDEX IF EXISTS idx_promo_codes_valid_until;
DROP INDEX IF EXISTS idx_promo_codes_active_valid;
*/

-- =====================================================
-- USER INDEXES
-- =====================================================
-- Purpose: Speed up user role queries and sorting by creation date

CREATE INDEX IF NOT EXISTS idx_users_role 
ON users(role);

CREATE INDEX IF NOT EXISTS idx_users_created_at 
ON users(created_at DESC);

-- =====================================================
-- ANIMAL INDEXES
-- =====================================================
-- Purpose: Optimize animal searches, filters, and sorting

-- Single column indexes
CREATE INDEX IF NOT EXISTS idx_animals_name 
ON animals(name);

CREATE INDEX IF NOT EXISTS idx_animals_species 
ON animals(species);

CREATE INDEX IF NOT EXISTS idx_animals_created_at 
ON animals(created_at DESC);

-- Composite index for filtering by category and status together
-- This is faster than using two separate indexes
CREATE INDEX IF NOT EXISTS idx_animals_category_status 
ON animals(category, status);

-- =====================================================
-- REVIEW INDEXES
-- =====================================================
-- Purpose: Speed up review filtering, sorting, and aggregations

-- Single column indexes
CREATE INDEX IF NOT EXISTS idx_reviews_rating 
ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at 
ON reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_sentiment 
ON reviews(sentiment);

-- Composite indexes for common query patterns
-- Reviews by animal and status (most common query)
CREATE INDEX IF NOT EXISTS idx_reviews_animal_status 
ON reviews(animal_id, status);

-- Reviews by animal sorted by date (for listing reviews)
CREATE INDEX IF NOT EXISTS idx_reviews_animal_created 
ON reviews(animal_id, created_at DESC);

-- =====================================================
-- BOOKING INDEXES
-- =====================================================
-- Purpose: Optimize booking queries, user history, and admin dashboards

-- Single column indexes
CREATE INDEX IF NOT EXISTS idx_bookings_created_at 
ON bookings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_payment_status 
ON bookings(payment_status);

-- Composite indexes for common patterns
-- User's bookings filtered by status
CREATE INDEX IF NOT EXISTS idx_bookings_user_status 
ON bookings(user_id, status);

-- User's booking history sorted by date
CREATE INDEX IF NOT EXISTS idx_bookings_user_created 
ON bookings(user_id, created_at DESC);

-- Bookings for specific dates filtered by status
CREATE INDEX IF NOT EXISTS idx_bookings_visit_status 
ON bookings(visit_date, status);

-- =====================================================
-- EVENT INDEXES
-- =====================================================
-- Purpose: Speed up event calendar and listing queries

-- Single column index
CREATE INDEX IF NOT EXISTS idx_events_end_date 
ON events(end_date);

-- Composite indexes
-- Active/upcoming events sorted by date
CREATE INDEX IF NOT EXISTS idx_events_status_start 
ON events(status, start_date);

-- Events within date range queries
CREATE INDEX IF NOT EXISTS idx_events_date_range 
ON events(start_date, end_date);

-- =====================================================
-- HEALTH RECORD INDEXES
-- =====================================================
-- Purpose: Speed up animal health history queries

CREATE INDEX IF NOT EXISTS idx_health_records_animal_id 
ON health_records(animal_id);

CREATE INDEX IF NOT EXISTS idx_health_records_checkup_date 
ON health_records(checkup_date DESC);

-- Animal's health records sorted by date
CREATE INDEX IF NOT EXISTS idx_health_records_animal_checkup 
ON health_records(animal_id, checkup_date DESC);

-- =====================================================
-- NEWSLETTER INDEXES
-- =====================================================
-- Purpose: Speed up active subscriber queries

CREATE INDEX IF NOT EXISTS idx_newsletters_active 
ON newsletters(is_active);

CREATE INDEX IF NOT EXISTS idx_newsletters_created_at 
ON newsletters(created_at DESC);

-- =====================================================
-- TICKET PRICE INDEXES
-- =====================================================
-- Purpose: Speed up active ticket price lookups

CREATE INDEX IF NOT EXISTS idx_ticket_prices_active 
ON ticket_prices(is_active);

-- =====================================================
-- PROMO CODE INDEXES
-- =====================================================
-- Purpose: Optimize promo code validation and active code queries

CREATE INDEX IF NOT EXISTS idx_promo_codes_active 
ON promo_codes(is_active);

CREATE INDEX IF NOT EXISTS idx_promo_codes_valid_from 
ON promo_codes(valid_from);

CREATE INDEX IF NOT EXISTS idx_promo_codes_valid_until 
ON promo_codes(valid_until);

-- Composite index for finding valid, active promo codes
-- This is the most common query when applying promo codes
CREATE INDEX IF NOT EXISTS idx_promo_codes_active_valid 
ON promo_codes(is_active, valid_from, valid_until)
WHERE is_active = true;

-- =====================================================
-- VERIFY INDEXES CREATED
-- =====================================================
-- Run this query to see all indexes on your tables:
/*
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM 
    pg_indexes
WHERE 
    schemaname = 'public'
    AND tablename IN ('users', 'animals', 'reviews', 'bookings', 'events', 
                      'favorites', 'health_records', 'newsletters', 
                      'ticket_prices', 'promo_codes')
ORDER BY 
    tablename, indexname;
*/

-- =====================================================
-- PERFORMANCE TESTING
-- =====================================================
-- Test query performance before and after indexes:
/*
-- Test 1: Animal search by category
EXPLAIN ANALYZE
SELECT * FROM animals WHERE category = 'MAMMAL' ORDER BY name;

-- Test 2: Reviews for an animal
EXPLAIN ANALYZE
SELECT * FROM reviews 
WHERE animal_id = 'your-animal-id' AND status = 'APPROVED' 
ORDER BY created_at DESC;

-- Test 3: User bookings
EXPLAIN ANALYZE
SELECT * FROM bookings 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC;

-- Test 4: Active promo codes
EXPLAIN ANALYZE
SELECT * FROM promo_codes 
WHERE is_active = true 
  AND valid_from <= NOW() 
  AND valid_until >= NOW();
*/

-- =====================================================
-- INDEX MAINTENANCE
-- =====================================================
-- Reindex all tables (run periodically in production)
/*
REINDEX TABLE users;
REINDEX TABLE animals;
REINDEX TABLE reviews;
REINDEX TABLE bookings;
REINDEX TABLE events;
REINDEX TABLE favorites;
REINDEX TABLE health_records;
REINDEX TABLE newsletters;
REINDEX TABLE ticket_prices;
REINDEX TABLE promo_codes;
*/

-- Update table statistics (helps query planner)
/*
ANALYZE users;
ANALYZE animals;
ANALYZE reviews;
ANALYZE bookings;
ANALYZE events;
ANALYZE favorites;
ANALYZE health_records;
ANALYZE newsletters;
ANALYZE ticket_prices;
ANALYZE promo_codes;
*/

