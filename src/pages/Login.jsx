import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase, getCurrentUserRole } from '../lib/supabase';
import styles from '../styles/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.group('Login Component Debug');
    console.log('Current Location:', location.pathname);
    console.log('Styles Loaded:', !!styles);
    console.log('Supabase Client:', !!supabase);
    setIsLoading(false);
    
    return () => {
      console.groupEnd();
    };
  }, [location]);

  // Prevent rendering on test route
  if (location.pathname === '/test') {
    console.warn('Login component suppressed for test route');
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login Error:', error);
        setError(error.message || 'Login failed. Please try again.');
        return;
      }

      if (data.user) {
        console.log('User logged in:', data.user.email);
        
        // Get user role using the new robust method
        const userRole = await getCurrentUserRole();

        console.log('Retrieved User Role:', userRole);

        if (!userRole) {
          console.warn('Unable to determine user role, defaulting to client');
          localStorage.setItem('userRole', 'client');
          navigate('/client');
          return;
        }

        const route = userRole === 'super_admin' ? '/super-admin' : 
                      userRole === 'admin' ? '/admin' : 
                      '/client';

        console.log('Navigating to route:', route);

        localStorage.setItem('userRole', userRole);
        navigate(route);
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const renderLoginForm = () => {
    return (
      <div className={styles.loginContainer}>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <h2>Login</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
      </div>
    );
  };

  return isLoading ? null : renderLoginForm();
};

export default Login;
