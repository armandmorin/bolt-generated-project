-- Drop existing tables and start fresh
DROP TABLE IF EXISTS brand_settings CASCADE;
DROP TABLE IF EXISTS admin_profiles CASCADE;

-- Create admin_profiles table
CREATE TABLE admin_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create brand_settings table
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
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access to own profile" ON admin_profiles;
DROP POLICY IF EXISTS "Enable update access to own profile" ON admin_profiles;
DROP POLICY IF EXISTS "Enable insert access to own profile" ON admin_profiles;
DROP POLICY IF EXISTS "Enable read access to own settings" ON brand_settings;
DROP POLICY IF EXISTS "Enable insert access to own settings" ON brand_settings;
DROP POLICY IF EXISTS "Enable update access to own settings" ON brand_settings;

-- Create policies for admin_profiles
CREATE POLICY "Enable read access to own profile"
ON admin_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Enable update access to own profile"
ON admin_profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Enable insert access to own profile"
ON admin_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create policies for brand_settings
CREATE POLICY "Enable read access to own settings"
ON brand_settings FOR SELECT
USING (auth.uid() = admin_id);

CREATE POLICY "Enable insert access to own settings"
ON brand_settings FOR INSERT
WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Enable update access to own settings"
ON brand_settings FOR UPDATE
USING (auth.uid() = admin_id);

-- Grant necessary permissions
GRANT ALL ON admin_profiles TO authenticated;
GRANT ALL ON brand_settings TO authenticated;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS trigger AS $$
BEGIN
  -- Create admin profile
  INSERT INTO public.admin_profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;

  -- Create default brand settings
  INSERT INTO public.brand_settings (admin_id, primary_color, secondary_color, header_color)
  VALUES (new.id, '#2563eb', '#ffffff', '#2563eb')
  ON CONFLICT (admin_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();
