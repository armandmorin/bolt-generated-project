-- Update the admin profile with the specific user ID
UPDATE admin_profiles 
SET role = 'admin'
WHERE id = '4c562315-ae53-4581-8aa1-1bb574c302e6';

-- Ensure brand settings exist for this user
INSERT INTO brand_settings (
    admin_id,
    primary_color,
    secondary_color,
    header_color
)
VALUES (
    '4c562315-ae53-4581-8aa1-1bb574c302e6',
    '#2563eb',
    '#ffffff',
    '#2563eb'
)
ON CONFLICT (admin_id) 
DO UPDATE SET
    primary_color = EXCLUDED.primary_color,
    secondary_color = EXCLUDED.secondary_color,
    header_color = EXCLUDED.header_color;

-- Verify the user's email is confirmed
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE id = '4c562315-ae53-4581-8aa1-1bb574c302e6';
