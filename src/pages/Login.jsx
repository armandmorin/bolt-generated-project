import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from '../styles/modules/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign in with Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (user) {
        // Create admin profile if it doesn't exist
        const { error: profileError } = await supabase
          .from('admin_profiles')
          .upsert({ 
            id: user.id,
            email: user.email,
            updated_at: new Date().toISOString()
          });

        if (profileError) throw profileError;

        // Create default brand settings if they don't exist
        const { error: settingsError } = await supabase
          .from('brand_settings')
          .upsert({ 
            admin_id: user.id,
            primary_color: '#2563eb',
            secondary_color: '#ffffff',
            header_color: '#2563eb',
            updated_at: new Date().toISOString()
          });

        if (settingsError) throw settingsError;

        navigate('/admin');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1>Admin Login</h1>

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
