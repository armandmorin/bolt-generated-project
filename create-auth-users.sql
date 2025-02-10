-- This needs to be run in the Supabase dashboard SQL editor
-- or through the Supabase Management API

-- Create super admin user
SELECT supabase_admin.create_user(
  'armandmorin@gmail.com',
  '1armand',
  'superadmin'
);

-- Create admin user
SELECT supabase_admin.create_user(
  'onebobdavis@gmail.com',
  '1armand',
  'admin'
);
