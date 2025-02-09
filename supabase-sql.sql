-- Function to ensure admin user exists
CREATE OR REPLACE FUNCTION ensure_admin_user()
RETURNS void AS $$
DECLARE
    existing_user_id UUID;
    new_user_id UUID;
BEGIN
    -- Check if user already exists in auth.users
    SELECT id INTO existing_user_id
    FROM auth.users
    WHERE email = 'armandmorin@gmail.com';

    IF existing_user_id IS NULL THEN
        -- Insert into auth.users only if user doesn't exist
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_token,
            recovery_token
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'armandmorin@gmail.com',
            crypt('1armand', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            encode(gen_random_bytes(32), 'hex'),
            encode(gen_random_bytes(32), 'hex')
        )
        RETURNING id INTO new_user_id;

        -- Insert into admin_profiles
        INSERT INTO admin_profiles (id, email, role)
        VALUES (new_user_id, 'armandmorin@gmail.com', 'admin')
        ON CONFLICT (id) DO NOTHING;

        -- Insert default brand settings
        INSERT INTO brand_settings (admin_id, primary_color, secondary_color, header_color)
        VALUES (new_user_id, '#2563eb', '#ffffff', '#2563eb')
        ON CONFLICT (admin_id) DO NOTHING;
    ELSE
        -- Update existing user's password if needed
        UPDATE auth.users
        SET encrypted_password = crypt('1armand', gen_salt('bf')),
            updated_at = NOW()
        WHERE id = existing_user_id;

        -- Ensure admin profile exists
        INSERT INTO admin_profiles (id, email, role)
        VALUES (existing_user_id, 'armandmorin@gmail.com', 'admin')
        ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email,
            role = EXCLUDED.role;

        -- Ensure brand settings exist
        INSERT INTO brand_settings (admin_id, primary_color, secondary_color, header_color)
        VALUES (existing_user_id, '#2563eb', '#ffffff', '#2563eb')
        ON CONFLICT (admin_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT ensure_admin_user();
