-- Create system_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS system_settings (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'default',
    site_name VARCHAR(255) NOT NULL,
    site_description TEXT NOT NULL,
    max_booking_days INTEGER DEFAULT 30,
    max_booking_quantity INTEGER DEFAULT 10,
    maintenance_mode BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    auto_approve_bookings BOOLEAN DEFAULT true,
    currency VARCHAR(10) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings if none exist
INSERT INTO system_settings (id, site_name, site_description) 
VALUES ('default', 'Wildlife Zoo', 'Experience the wonders of wildlife in our state-of-the-art zoo')
ON CONFLICT (id) DO NOTHING;