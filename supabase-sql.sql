-- Insert a test admin user without a "password" column
INSERT INTO users (id, email, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'admin')
ON CONFLICT (id) DO NOTHING;
