-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS public.brand_settings CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin')),
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create brand_settings table
CREATE TABLE public.brand_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.users(id),
    logo TEXT,
    primary_color TEXT DEFAULT '#2563eb',
    secondary_color TEXT DEFAULT '#ffffff',
    header_color TEXT DEFAULT '#2563eb',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON public.users;
DROP POLICY IF EXISTS "Allow individual update" ON public.users;
DROP POLICY IF EXISTS "Allow read access" ON public.brand_settings;
DROP POLICY IF EXISTS "Allow individual update" ON public.brand_settings;

-- Create policies
CREATE POLICY "Allow public read access" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Allow individual update" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Allow read access" ON public.brand_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow individual update" ON public.brand_settings
    FOR UPDATE USING (auth.uid()::text = admin_id::text);

-- Insert initial users (will error if they already exist, which is fine)
INSERT INTO public.users (email, role, name)
VALUES 
    ('armandmorin@gmail.com', 'superadmin', 'Super Admin'),
    ('onebobdavis@gmail.com', 'admin', 'Admin User')
ON CONFLICT (email) 
DO UPDATE SET 
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    updated_at = TIMEZONE('utc', NOW());

-- Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.brand_settings TO authenticated;
