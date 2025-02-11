-- Create global_branding table
CREATE TABLE IF NOT EXISTS global_branding (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    logo TEXT,
    header_color TEXT,
    button_color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_branding table
CREATE TABLE IF NOT EXISTS admin_branding (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_email TEXT UNIQUE NOT NULL,
    logo TEXT,
    primary_color TEXT,
    secondary_color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create global_settings table
CREATE TABLE IF NOT EXISTS global_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    widget_domain TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE global_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable all operations for authenticated users" ON global_branding
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" ON admin_branding
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" ON global_settings
    FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON global_branding TO anon, authenticated, service_role;
GRANT ALL ON admin_branding TO anon, authenticated, service_role;
GRANT ALL ON global_settings TO anon, authenticated, service_role;
