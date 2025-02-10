-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
        CREATE ROLE admin;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'superadmin') THEN
        CREATE ROLE superadmin;
    END IF;
END
$$;

-- Drop existing tables if they exist
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

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.users
    FOR SELECT
    USING (true);

CREATE POLICY "Enable write access for authenticated users" ON public.users
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.brand_settings
    FOR SELECT
    USING (true);

CREATE POLICY "Enable write access for authenticated users" ON public.brand_settings
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.brand_settings TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.brand_settings TO anon;

-- Function to create or update users
CREATE OR REPLACE FUNCTION create_or_update_user(
    p_email TEXT,
    p_password TEXT,
    p_role TEXT,
    p_name TEXT,
    p_company TEXT
) RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_encrypted_pass TEXT;
BEGIN
    -- Generate encrypted password
    v_encrypted_pass := crypt(p_password, gen_salt('bf'));

    -- Check if user exists in auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = p_email;

    IF v_user_id IS NULL THEN
        -- Create new auth user
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4(),
            'authenticated',
            'authenticated',  -- Changed from p_role to 'authenticated'
            p_email,
            v_encrypted_pass,
            NOW(),
            NOW(),
            NOW(),
            jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
            jsonb_build_object('role', p_role),  -- Store custom role in metadata
            NOW(),
            NOW(),
            encode(gen_random_bytes(32), 'base64'),
            p_email,
            encode(gen_random_bytes(32), 'base64'),
            encode(gen_random_bytes(32), 'base64')
        )
        RETURNING id INTO v_user_id;

        -- Create auth identity
        INSERT INTO auth.identities (
            id,
            user_id,
            provider_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        )
        VALUES (
            v_user_id,
            v_user_id,
            'email',
            jsonb_build_object(
                'sub', v_user_id::text,
                'email', p_email
            ),
            'email',
            NOW(),
            NOW(),
            NOW()
        );
    ELSE
        -- Update existing auth user
        UPDATE auth.users
        SET 
            encrypted_password = v_encrypted_pass,
            raw_user_meta_data = jsonb_build_object('role', p_role),
            updated_at = NOW()
        WHERE id = v_user_id;
    END IF;

    -- Create or update public user
    INSERT INTO public.users (id, name, email, role, company)
    VALUES (v_user_id, p_name, p_email, p_role, p_company)
    ON CONFLICT (email) DO UPDATE
    SET 
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        company = EXCLUDED.company,
        updated_at = NOW();

    -- Create default brand settings for the user
    INSERT INTO public.brand_settings (
        admin_id,
        primary_color,
        secondary_color,
        header_color,
        is_super_admin
    )
    VALUES (
        v_user_id,
        '#2563eb',
        '#ffffff',
        '#2563eb',
        p_role = 'superadmin'
    )
    ON CONFLICT (admin_id) DO NOTHING;

    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create users
DO $$
BEGIN
    -- Create super admin
    PERFORM create_or_update_user(
        'armandmorin@gmail.com',
        '1armand',
        'superadmin',
        'Armand Morin',
        'Super Admin Company'
    );

    -- Create admin
    PERFORM create_or_update_user(
        'onebobdavis@gmail.com',
        '1armand',
        'admin',
        'Bob Davis',
        'Admin Company'
    );
END $$;

-- Clean up
DROP FUNCTION IF EXISTS create_or_update_user(TEXT, TEXT, TEXT, TEXT, TEXT);
