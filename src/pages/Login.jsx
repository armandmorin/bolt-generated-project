import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from '../styles/modules/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const brandSettings = JSON.parse(localStorage.getItem('brandSettings') || '{}');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
      navigate('/admin');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        {brandSettings.logo ? (
          <div className={styles.logoContainer}>
            <img src={brandSettings.logo} alt="Company Logo" className={styles.logo} />
          </div>
        ) : (
          <h1>Admin Login</h1>
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
