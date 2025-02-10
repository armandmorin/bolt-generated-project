-- Create users in auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role
) VALUES (
  gen_random_uuid(), -- Super Admin ID
  '00000000-0000-0000-0000-000000000000',
  'armandmorin@gmail.com',
  crypt('1armand', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated'
), (
  gen_random_uuid(), -- Admin ID
  '00000000-0000-0000-0000-000000000000',
  'onebobdavis@gmail.com',
  crypt('1armand', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated'
);

-- Now insert into public.users table using the created auth.users
INSERT INTO public.users (id, email, role, name)
SELECT 
  id,
  email,
  CASE 
    WHEN email = 'armandmorin@gmail.com' THEN 'superadmin'
    ELSE 'admin'
  END as role,
  CASE 
    WHEN email = 'armandmorin@gmail.com' THEN 'Super Admin'
    ELSE 'Admin User'
  END as name
FROM auth.users
WHERE email IN ('armandmorin@gmail.com', 'onebobdavis@gmail.com');
