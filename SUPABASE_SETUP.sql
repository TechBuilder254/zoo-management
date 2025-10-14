-- =====================================================
-- SUPABASE DATABASE SETUP FOR ZOO & WILDLIFE SYSTEM
-- =====================================================
-- Run this script in your Supabase SQL Editor
-- Copy and paste the entire content and execute
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('VISITOR', 'ADMIN', 'STAFF');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AnimalStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'UNDER_CARE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role "Role" NOT NULL DEFAULT 'VISITOR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Animals Table
CREATE TABLE IF NOT EXISTS animals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    category TEXT NOT NULL,
    habitat TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    diet TEXT,
    lifespan TEXT,
    status "AnimalStatus" NOT NULL DEFAULT 'ACTIVE',
    location JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    status "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    sentiment TEXT,
    sentiment_score DOUBLE PRECISION,
    toxicity DOUBLE PRECISION,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
    helpful INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Promo Codes Table
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type "DiscountType" NOT NULL,
    discount_value DOUBLE PRECISION NOT NULL,
    max_uses INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
    ticket_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DOUBLE PRECISION NOT NULL,
    status "BookingStatus" NOT NULL DEFAULT 'PENDING',
    payment_id TEXT,
    payment_status TEXT,
    promo_code_id UUID REFERENCES promo_codes(id),
    discount_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT,
    capacity INTEGER,
    price DOUBLE PRECISION,
    status "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, animal_id)
);

-- Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checkup_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    vet_name TEXT NOT NULL,
    notes TEXT,
    animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter Table
CREATE TABLE IF NOT EXISTS newsletters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ticket Prices Table
CREATE TABLE IF NOT EXISTS ticket_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_type TEXT UNIQUE NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_animal_id ON reviews(animal_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_visit_date ON bookings(visit_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_animal_id ON favorites(animal_id);
CREATE INDEX IF NOT EXISTS idx_animals_category ON animals(category);
CREATE INDEX IF NOT EXISTS idx_animals_status ON animals(status);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);

-- =====================================================
-- CREATE FUNCTIONS FOR AUTOMATIC UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_animals_updated_at ON animals;
CREATE TRIGGER update_animals_updated_at BEFORE UPDATE ON animals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_health_records_updated_at ON health_records;
CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ticket_prices_updated_at ON ticket_prices;
CREATE TRIGGER update_ticket_prices_updated_at BEFORE UPDATE ON ticket_prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_promo_codes_updated_at ON promo_codes;
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Users: Users can read their own data, admins can read all
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN')
);

-- Animals: Public read, admin write
CREATE POLICY "Anyone can view active animals" ON animals FOR SELECT USING (status = 'ACTIVE' OR status = 'UNDER_CARE');
CREATE POLICY "Admins can manage animals" ON animals FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND (role = 'ADMIN' OR role = 'STAFF'))
);

-- Reviews: Public read approved, users can create, admins can manage
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (status = 'APPROVED');
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can edit own reviews" ON reviews FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Admins can manage all reviews" ON reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN')
);

-- Bookings: Users can view/create own, admins can view all
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN')
);

-- Events: Public read, admin write
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN')
);

-- Favorites: Users can manage their own
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create favorites" ON favorites FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid()::text = user_id);

-- Health Records: Staff and admins only
CREATE POLICY "Staff can view health records" ON health_records FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND (role = 'ADMIN' OR role = 'STAFF'))
);
CREATE POLICY "Staff can manage health records" ON health_records FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND (role = 'ADMIN' OR role = 'STAFF'))
);

-- Newsletters: Public can subscribe
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletters FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view newsletters" ON newsletters FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN')
);

-- Ticket Prices: Public read, admin write
CREATE POLICY "Anyone can view ticket prices" ON ticket_prices FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage ticket prices" ON ticket_prices FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN')
);

-- Promo Codes: Public read active, admin write
CREATE POLICY "Anyone can view active promo codes" ON promo_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage promo codes" ON promo_codes FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN')
);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert default ticket prices
INSERT INTO ticket_prices (ticket_type, price, description, is_active) VALUES
('adult', 1500.00, 'Adult ticket (18+ years)', true),
('child', 800.00, 'Child ticket (3-17 years)', true),
('senior', 1000.00, 'Senior ticket (60+ years)', true)
ON CONFLICT (ticket_type) DO NOTHING;

-- Insert sample admin user (password: admin123 - hashed)
-- NOTE: This is a placeholder. You'll need to hash the password properly in your app
INSERT INTO users (email, password, name, role) VALUES
('admin@zoo.com', '$2b$10$rZlmNT8.9EfmVL5CjPZ3XeH9wHEKMYx9qZNKWzR9rC7YvvKPVxFei', 'Zoo Admin', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Supabase database setup completed successfully!';
  RAISE NOTICE '📊 All tables, indexes, triggers, and RLS policies have been created.';
  RAISE NOTICE '🔒 Row Level Security is enabled on all tables.';
  RAISE NOTICE '💡 Next steps:';
  RAISE NOTICE '   1. Update your .env files with Supabase credentials';
  RAISE NOTICE '   2. Test the connection';
  RAISE NOTICE '   3. Insert your animal data';
END $$;

