-- Ensure the email column is not nullable
ALTER TABLE clients 
ALTER COLUMN email SET NOT NULL;

-- Optional: Add a unique constraint on email
CREATE UNIQUE INDEX unique_client_email ON clients (email);
