-- Create super_admin_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS super_admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE super_admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Enable all operations for all users" ON super_admin_settings;

-- Create new policy
CREATE POLICY "Enable all operations for all users" ON super_admin_settings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON super_admin_settings TO anon;
GRANT ALL ON super_admin_settings TO authenticated;
GRANT ALL ON super_admin_settings TO service_role;

-- Insert default settings if none exist
INSERT INTO super_admin_settings (settings)
SELECT jsonb_build_object(
    'branding', jsonb_build_object(
        'logo', '',
        'headerColor', '#2563eb',
        'buttonColor', '#2563eb'
    ),
    'domain', '',
    'admins', '[]'::jsonb
)
WHERE NOT EXISTS (SELECT 1 FROM super_admin_settings);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_super_admin_settings_updated_at ON super_admin_settings(updated_at);
