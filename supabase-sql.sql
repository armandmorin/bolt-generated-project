-- Create brand_settings table
CREATE TABLE IF NOT EXISTS brand_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    logo TEXT,
    primary_color VARCHAR NOT NULL DEFAULT '#2563eb',
    secondary_color VARCHAR NOT NULL DEFAULT '#ffffff',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for brand_settings table
CREATE POLICY "Enable all operations for all users" ON brand_settings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON brand_settings TO anon;
GRANT ALL ON brand_settings TO authenticated;
GRANT ALL ON brand_settings TO service_role;
