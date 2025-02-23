import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from '../styles/modules/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're trying to access the test page
  if (location.pathname === '/test') {
    return null; // Don't render login for test route
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Attempt Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      // If login successful, fetch user details
      if (data.user) {
        // Fetch user role from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('email', email)
          .single();

        if (userError) {
          // If no user found, default to client role
          localStorage.setItem('userRole', 'client');
          localStorage.setItem('user', JSON.stringify({ 
            email: data.user.email, 
            role: 'client' 
          }));
          navigate('/client');
          return;
        }

        // Determine route based on user role
        const route = userData.role === 'super_admin' ? '/super-admin' : 
                      userData.role === 'admin' ? '/admin' : 
                      '/client';

        // Store user information in localStorage
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('user', JSON.stringify({ 
          email: data.user.email, 
          role: userData.role 
        }));

        navigate(route);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.logoContainer}>
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className={styles.logo} 
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>

        <h1>Login to Your Account</h1>

        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required 
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

        <div className={styles.links}>
          <Link to="/register" className={styles.registerLink}>
            Create New Account
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
