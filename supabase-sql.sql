-- Create admin_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    name TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create brand_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS brand_settings (
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
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;

-- Policies for admin_profiles
CREATE POLICY "Users can view own profile"
ON admin_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON admin_profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON admin_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policies for brand_settings
CREATE POLICY "Users can view own brand settings"
ON brand_settings FOR SELECT
USING (auth.uid() = admin_id);

CREATE POLICY "Users can insert own brand settings"
ON brand_settings FOR INSERT
WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Users can update own brand settings"
ON brand_settings FOR UPDATE
USING (auth.uid() = admin_id);

-- Grant necessary permissions
GRANT ALL ON admin_profiles TO authenticated;
GRANT ALL ON brand_settings TO authenticated;
