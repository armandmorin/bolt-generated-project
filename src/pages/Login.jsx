import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from '../styles/modules/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw new Error('Invalid login credentials. Please check your email and password.');
      }

      if (!data?.user) {
        throw new Error('No user data received');
      }

      // Get admin profile
      const { data: profileData, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error('Error loading user profile');
      }

      if (!profileData) {
        throw new Error('Admin profile not found');
      }

      // Check brand settings and create if they don't exist
      const { data: settingsData, error: settingsError } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('admin_id', data.user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Settings error:', settingsError);
      }

      if (!settingsData) {
        // Create default settings
        const { error: createError } = await supabase
          .from('brand_settings')
          .insert([
            {
              admin_id: data.user.id,
              primary_color: '#2563eb',
              secondary_color: '#ffffff',
              header_color: '#2563eb'
            }
          ]);

        if (createError) {
          console.error('Create settings error:', createError);
        }
      }

      // Navigate based on role
      if (profileData.role === 'superadmin') {
        navigate('/super-admin');
      } else {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1>Admin Login</h1>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles.links}>
          <Link to="/register" className={styles.registerLink}>
            Register as new Admin
          </Link>
          <Link to="/super-admin-login" className={styles.superAdminLink}>
            Super Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
