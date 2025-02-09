-- Add header_color column to brand_settings table if it doesn't exist
ALTER TABLE brand_settings
ADD COLUMN IF NOT EXISTS header_color VARCHAR(7) NOT NULL DEFAULT '#2563eb';
