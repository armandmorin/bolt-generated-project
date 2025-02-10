-- Link existing auth users to public.users table
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
WHERE email IN ('armandmorin@gmail.com', 'onebobdavis@gmail.com')
ON CONFLICT (id) DO UPDATE 
SET 
  role = EXCLUDED.role,
  name = EXCLUDED.name,
  updated_at = NOW();
