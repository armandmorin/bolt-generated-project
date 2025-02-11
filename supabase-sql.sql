-- Insert a test admin user (if not already present)
INSERT INTO users (id, email, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'testadmin@example.com', 'admin')
ON CONFLICT (id) DO NOTHING;
