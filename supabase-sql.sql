-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables and policies
DROP TABLE IF EXISTS public.brand_settings CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    role VARCHAR NOT NULL CHECK (role IN ('superadmin', 'admin')),
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
DROP POLICY IF EXISTS "Enable read for all" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users" ON public.users;
DROP POLICY IF EXISTS "Enable read for all" ON public.brand_settings;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.brand_settings;
DROP POLICY IF EXISTS "Enable update for users" ON public.brand_settings;

-- Create new policies for users table
CREATE POLICY "Enable read for all" ON public.users
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.users
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for users" ON public.users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Create new policies for brand_settings table
CREATE POLICY "Enable read for all" ON public.brand_settings
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.brand_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for users" ON public.brand_settings
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = admin_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.users TO authenticated;
GRANT INSERT, UPDATE ON public.users TO authenticated;

GRANT SELECT ON public.brand_settings TO anon;
GRANT SELECT ON public.brand_settings TO authenticated;
GRANT INSERT, UPDATE ON public.brand_settings TO authenticated;

-- Insert initial users
INSERT INTO public.users (id, name, email, role, company)
VALUES 
    (gen_random_uuid(), 'Armand Morin', 'armandmorin@gmail.com', 'superadmin', 'Super Admin Company'),
    (gen_random_uuid(), 'Bob Davis', 'onebobdavis@gmail.com', 'admin', 'Admin Company')
ON CONFLICT (email) DO UPDATE
SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    company = EXCLUDED.company,
    updated_at = NOW();

-- Insert default brand settings
INSERT INTO public.brand_settings (admin_id, is_super_admin)
SELECT id, role = 'superadmin'
FROM public.users
ON CONFLICT (admin_id) DO NOTHING;

-- Create auth users if they don't exist
DO $$
DECLARE
    v_user record;
BEGIN
    FOR v_user IN SELECT * FROM public.users
    LOOP
        BEGIN
            INSERT INTO auth.users (
                instance_id,
                id,
                aud,
                role,
                email,
                encrypted_password,
                email_confirmed_at,
                raw_app_meta_data,
                raw_user_meta_data,
                created_at,
                updated_at
            )
            VALUES (
                '00000000-0000-0000-0000-000000000000',
                v_user.id,
                'authenticated',
                'authenticated',
                v_user.email,
                crypt('1armand', gen_salt('bf')),
                NOW(),
                '{"provider":"email","providers":["email"]}'::jsonb,
                jsonb_build_object('role', v_user.role),
                NOW(),
                NOW()
            );

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
                v_user.id,
                v_user.id,
                'email',
                jsonb_build_object(
                    'sub', v_user.id::text,
                    'email', v_user.email
                ),
                'email',
                NOW(),
                NOW(),
                NOW()
            );
        EXCEPTION WHEN unique_violation THEN
            -- Skip if user already exists
        END;
    END LOOP;
END
$$;
