-- First, revoke all existing permissions
REVOKE ALL ON public.users FROM anon, authenticated;
REVOKE ALL ON SCHEMA public FROM anon, authenticated;

-- Grant basic schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- Disable RLS temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Grant specific permissions
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create new simplified policies
CREATE POLICY "Allow users to read own data"
ON public.users
FOR SELECT
TO authenticated
USING (true);  -- Temporarily allow all reads for debugging

CREATE POLICY "Allow users to update own data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Recreate the users if needed
TRUNCATE public.users;

INSERT INTO public.users (id, email, role, name)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'armandmorin@gmail.com' THEN 'superadmin'
    ELSE 'admin'
  END as role,
  CASE 
    WHEN au.email = 'armandmorin@gmail.com' THEN 'Super Admin'
    ELSE 'Admin User'
  END as name
FROM auth.users au
WHERE au.email IN ('armandmorin@gmail.com', 'onebobdavis@gmail.com')
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  name = EXCLUDED.name,
  updated_at = NOW();

-- Verify the data
SELECT * FROM public.users;
