-- Update admin_branding table to include required columns

ALTER TABLE admin_branding
  ADD COLUMN IF NOT EXISTS header_color TEXT DEFAULT '#ffffff';

ALTER TABLE admin_branding
  ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#2563eb';

ALTER TABLE admin_branding
  ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#ffffff';
