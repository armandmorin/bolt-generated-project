-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables and policies
DROP TABLE IF EXISTS public.brand_settings CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create enum for user roles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('superadmin', 'admin');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    user_role user_role NOT NULL,
    company VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create brand_settings table
CREATE TABLE public.brand_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON public.users;
DROP POLICY IF EXISTS "Allow individual read access" ON public.users;
DROP POLICY IF EXISTS "Allow individual update access" ON public.users;
DROP POLICY IF EXISTS "Allow public read access" ON public.brand_settings;
DROP POLICY IF EXISTS "Allow individual update access" ON public.brand_settings;

-- Create policies for users table
CREATE POLICY "Allow public read access" ON public.users
    FOR SELECT TO PUBLIC
    USING (true);

CREATE POLICY "Allow individual update access" ON public.users
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);

-- Create policies for brand_settings table
CREATE POLICY "Allow public read access" ON public.brand_settings
    FOR SELECT TO PUBLIC
    USING (true);

CREATE POLICY "Allow individual update access" ON public.brand_settings
    FOR UPDATE TO authenticated
    USING (auth.uid() = admin_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.brand_settings TO anon, authenticated;

-- Function to create auth users
CREATE OR REPLACE FUNCTION create_auth_user(
    p_email TEXT,
    p_password TEXT,
    p_role user_role,
    p_name TEXT,
    p_company TEXT
) RETURNS UUID AS $$
DECLARE
    v_user_id UUID := uuid_generate_v4();
BEGIN
    -- Insert into auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        aud,
        role,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        p_email,
        crypt(p_password, gen_salt('bf')),
        NOW(),
        jsonb_build_object(
            'provider', 'email',
            'providers', ARRAY['email']
        ),
        jsonb_build_object(
            'role', p_role,
            'name', p_name,
            'company', p_company
        ),
        'authenticated',
        'authenticated',
        NOW(),
        NOW()
    );

    -- Insert into auth.identities
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        v_user_id,
        jsonb_build_object(
            'sub', v_user_id::text,
            'email', p_email
        ),
        'email',
        'email',
        NOW(),
        NOW()
    );

    -- Insert into public.users
    INSERT INTO public.users (
        id,
        name,
        email,
        user_role,
        company
    ) VALUES (
        v_user_id,
        p_name,
        p_email,
        p_role,
        p_company
    );

    -- Create default brand settings
    INSERT INTO public.brand_settings (
        admin_id,
        is_super_admin
    ) VALUES (
        v_user_id,
        p_role = 'superadmin'
    );

    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create initial users
DO $$
BEGIN
    -- Create superadmin
    PERFORM create_auth_user(
        'armandmorin@gmail.com',
        '1armand',
        'superadmin'::user_role,
        'Armand Morin',
        'Super Admin Company'
    );

    -- Create admin
    PERFORM create_auth_user(
        'onebobdavis@gmail.com',
        '1armand',
        'admin'::user_role,
        'Bob Davis',
        'Admin Company'
    );
EXCEPTION WHEN unique_violation THEN
    -- Ignore if users already exist
    NULL;
END $$;
