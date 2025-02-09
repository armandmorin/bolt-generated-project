import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import styles from '../styles/modules/login.module.css';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useSupabase();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Hardcoded super admin credentials for demo
      if (email === 'armandmorin@gmail.com' && password === '1armand') {
        const userData = {
          id: '550e8400-e29b-41d4-a716-446655440001', // UUID format
          email: 'armandmorin@gmail.com',
          role: 'superadmin',
          name: 'Super Admin'
        };
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        navigate('/super-admin');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1>Super Admin Login</h1>

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
