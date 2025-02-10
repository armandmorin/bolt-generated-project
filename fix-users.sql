-- First, clean up existing data
DELETE FROM public.users 
WHERE email IN ('armandmorin@gmail.com', 'onebobdavis@gmail.com');

-- Now insert the users with their correct auth.users IDs
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
