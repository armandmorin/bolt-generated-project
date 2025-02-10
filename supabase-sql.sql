-- First, drop existing policies
drop policy if exists "Users can view own brand settings" on public.brand_settings;
drop policy if exists "Users can insert own brand settings" on public.brand_settings;
drop policy if exists "Users can update own brand settings" on public.brand_settings;

-- Recreate the table with proper constraints
create table if not exists public.brand_settings (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references auth.users(id) on delete cascade unique,
  logo text,
  primary_color text default '#2563eb',
  secondary_color text default '#ffffff',
  header_color text default '#2563eb',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_admin_settings unique (admin_id)
);

-- Enable RLS
alter table public.brand_settings enable row level security;

-- Create new policies
create policy "Enable read access for users"
  on public.brand_settings for select
  to authenticated
  using (true);

create policy "Enable insert for users"
  on public.brand_settings for insert
  to authenticated
  with check (auth.uid() = admin_id);

create policy "Enable update for users"
  on public.brand_settings for update
  to authenticated
  using (auth.uid() = admin_id);

-- Grant permissions
grant usage on schema public to authenticated;
grant all on public.brand_settings to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- Create index
create index if not exists idx_brand_settings_admin_id on public.brand_settings(admin_id);
