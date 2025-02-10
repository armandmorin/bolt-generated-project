-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can read users" ON public.users;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own data
CREATE POLICY "Users can view own data" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Create policy to allow admin access
CREATE POLICY "Authenticated users can read users" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (true);

-- Grant necessary permissions
GRANT SELECT ON public.users TO authenticated;
