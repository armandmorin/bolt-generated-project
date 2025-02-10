-- Drop existing table if it exists
drop table if exists public.brand_settings;

-- Create the brand_settings table
create table public.brand_settings (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references auth.users(id) on delete cascade,
  logo text,
  primary_color text default '#2563eb',
  secondary_color text default '#ffffff',
  header_color text default '#2563eb',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists brand_settings_admin_id_idx on public.brand_settings(admin_id);

-- Set up RLS policies
alter table public.brand_settings enable row level security;

-- Allow users to read their own settings
create policy "Users can view own brand settings"
  on public.brand_settings for select
  using (auth.uid() = admin_id);

-- Allow users to insert their own settings
create policy "Users can insert own brand settings"
  on public.brand_settings for insert
  with check (auth.uid() = admin_id);

-- Allow users to update their own settings
create policy "Users can update own brand settings"
  on public.brand_settings for update
  using (auth.uid() = admin_id);

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all on public.brand_settings to authenticated;
grant usage, select on all sequences in schema public to authenticated;
