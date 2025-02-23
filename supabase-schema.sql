-- Modify the clients table to ensure email is not null
ALTER TABLE public.clients 
ALTER COLUMN email SET NOT NULL;

-- Optional: Add a unique constraint on email if needed
ALTER TABLE public.clients 
ADD CONSTRAINT unique_client_email UNIQUE (email);
