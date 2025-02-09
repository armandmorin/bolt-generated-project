import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from '../styles/modules/login.module.css';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check super admin credentials
      const { data, error } = await supabase
        .from('super_admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;

      if (data && data.password === password) { // In production, use proper password hashing
        // Create a session in Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.signIn({
          email,
          password,
        });

        if (sessionError) throw sessionError;

        // Store minimal user info in localStorage for navigation purposes
        localStorage.setItem('userRole', 'superadmin');
        
        navigate('/super-admin');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1>Super Admin Login</h1>

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles.links}>
          <Link to="/" className={styles.backLink}>
            Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
