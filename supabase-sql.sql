-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables
DROP TABLE IF EXISTS public.brand_settings CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    role VARCHAR NOT NULL,
    company VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create brand_settings table
CREATE TABLE public.brand_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID REFERENCES public.users(id),
    logo TEXT,
    primary_color VARCHAR(7) NOT NULL DEFAULT '#2563eb',
    secondary_color VARCHAR(7) NOT NULL DEFAULT '#ffffff',
    header_color VARCHAR(7) NOT NULL DEFAULT '#2563eb',
    is_super_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(admin_id)
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Enable read access for all users"
    ON public.users FOR SELECT
    USING (true);

CREATE POLICY "Enable update for own user"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Create policies for brand_settings table
CREATE POLICY "Enable read access for all users"
    ON public.brand_settings FOR SELECT
    USING (true);

CREATE POLICY "Enable update for own settings"
    ON public.brand_settings FOR UPDATE
    USING (auth.uid() = admin_id);

CREATE POLICY "Enable insert for authenticated users"
    ON public.brand_settings FOR INSERT
    WITH CHECK (auth.uid() = admin_id);

-- Grant permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.brand_settings TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.brand_settings TO anon;

-- Function to sync auth users to public users
CREATE OR REPLACE FUNCTION sync_auth_users() RETURNS void AS $$
BEGIN
    -- Sync superadmin
    INSERT INTO public.users (id, name, email, role, company)
    SELECT 
        id,
        email as name,
        email,
        'superadmin',
        'Super Admin Company'
    FROM auth.users
    WHERE email = 'armandmorin@gmail.com'
    ON CONFLICT (email) DO UPDATE
    SET role = 'superadmin',
        company = 'Super Admin Company';

    -- Sync admin
    INSERT INTO public.users (id, name, email, role, company)
    SELECT 
        id,
        email as name,
        email,
        'admin',
        'Admin Company'
    FROM auth.users
    WHERE email = 'onebobdavis@gmail.com'
    ON CONFLICT (email) DO UPDATE
    SET role = 'admin',
        company = 'Admin Company';

    -- Create brand settings for users who don't have them
    INSERT INTO public.brand_settings (admin_id, is_super_admin)
    SELECT 
        id,
        CASE WHEN email = 'armandmorin@gmail.com' THEN true ELSE false END
    FROM public.users
    WHERE NOT EXISTS (
        SELECT 1 FROM public.brand_settings WHERE admin_id = public.users.id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the sync function
SELECT sync_auth_users();
