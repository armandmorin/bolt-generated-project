-- Create this function in Supabase SQL editor
create or replace function drop_table_if_exists(table_name text)
returns void as $$
begin
  execute format('drop table if exists %I cascade', table_name);
end;
$$ language plpgsql;

-- Function to update clients schema
create or replace function update_clients_schema()
returns void as $$
begin
  -- Add user_id column if it doesn't exist
  alter table clients 
  add column if not exists user_id uuid references auth.users(id);
  
  -- Copy admin_id values to user_id
  update clients 
  set user_id = admin_id::uuid 
  where user_id is null and admin_id is not null;
  
  -- Drop admin_id column
  alter table clients 
  drop column if exists admin_id;
  
  -- Add not null constraint to user_id
  alter table clients 
  alter column user_id set not null;
end;
$$ language plpgsql;
