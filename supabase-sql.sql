-- Drop existing table if needed
DROP TABLE IF EXISTS brand_settings CASCADE;

-- Create brand_settings table with proper UUID handling
CREATE TABLE brand_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    logo TEXT,
    primary_color VARCHAR(7) DEFAULT '#2563eb',
    secondary_color VARCHAR(7) DEFAULT '#ffffff',
    header_color VARCHAR(7) DEFAULT '#2563eb',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(admin_id)
);

-- Enable RLS
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access to own settings" ON brand_settings;
DROP POLICY IF EXISTS "Enable insert access to own settings" ON brand_settings;
DROP POLICY IF EXISTS "Enable update access to own settings" ON brand_settings;
DROP POLICY IF EXISTS "Enable delete access to own settings" ON brand_settings;

-- Create new policies
CREATE POLICY "Enable read access to own settings"
ON brand_settings FOR SELECT
USING (auth.uid() = admin_id);

CREATE POLICY "Enable insert access to own settings"
ON brand_settings FOR INSERT
WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Enable update access to own settings"
ON brand_settings FOR UPDATE
USING (auth.uid() = admin_id);

CREATE POLICY "Enable delete access to own settings"
ON brand_settings FOR DELETE
USING (auth.uid() = admin_id);

-- Grant necessary permissions
GRANT ALL ON brand_settings TO authenticated;
