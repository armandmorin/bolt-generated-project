-- Create brand_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS brand_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  logo TEXT,
  primary_color VARCHAR(7) NOT NULL DEFAULT '#2563eb',
  secondary_color VARCHAR(7) NOT NULL DEFAULT '#ffffff',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS if not already enabled
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Enable all operations for all users" ON brand_settings;

-- Create new policy
CREATE POLICY "Enable all operations for all users" ON brand_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON brand_settings TO anon;
GRANT ALL ON brand_settings TO authenticated;
GRANT ALL ON brand_settings TO service_role;
