-- Alter brand_settings table to add header_color
ALTER TABLE brand_settings
ADD COLUMN header_color VARCHAR NOT NULL DEFAULT '#2563eb';
