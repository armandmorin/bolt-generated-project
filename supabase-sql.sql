-- Drop existing brand_settings table if it exists
DROP TABLE IF EXISTS brand_settings CASCADE;

-- Create brand_settings table with admin_id
CREATE TABLE brand_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID,
    logo TEXT,
    primary_color VARCHAR(7) NOT NULL DEFAULT '#2563eb',
    secondary_color VARCHAR(7) NOT NULL DEFAULT '#ffffff',
    header_color VARCHAR(7) NOT NULL DEFAULT '#2563eb',
    is_super_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_brand_settings_admin_id ON brand_settings(admin_id);
CREATE INDEX IF NOT EXISTS idx_brand_settings_is_super_admin ON brand_settings(is_super_admin);

-- Insert default super admin settings
INSERT INTO brand_settings (
    is_super_admin,
    primary_color,
    secondary_color,
    header_color
) VALUES (
    true,
    '#2563eb',
    '#ffffff',
    '#2563eb'
) ON CONFLICT DO NOTHING;
