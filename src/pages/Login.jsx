import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from '../styles/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Debug logging for component lifecycle and routing
  useEffect(() => {
    console.group('Login Component Debug');
    console.log('Current Location:', location.pathname);
    console.log('Styles Loaded:', !!styles);
    console.log('Supabase Client:', !!supabase);
    setIsLoading(false);
    
    // Additional environment checks
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Environment Mode:', import.meta.env.MODE);
    
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
        
        // Fetch user role with more detailed logging
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('email', email)
          .single();

        if (userError) {
          console.warn('User role fetch error:', userError);
          localStorage.setItem('userRole', 'client');
          navigate('/client');
          return;
        }

        const route = userData.role === 'super_admin' ? '/super-admin' : 
                      userData.role === 'admin' ? '/admin' : 
                      '/client';

        localStorage.setItem('userRole', userData.role);
        navigate(route);
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // Render loading state if still loading
  if (isLoading) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.logoContainer}>
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className={styles.logo} 
            onError={(e) => {
              console.warn('Logo failed to load');
              e.target.style.display = 'none';
            }}
          />
        </div>

        <h1>Login to Your Account</h1>

        {error && (
          <div 
            className={styles.errorMessage} 
            style={{
              backgroundColor: 'rgba(255, 0, 0, 0.1)', 
              color: 'red', 
              padding: '10px', 
              marginBottom: '15px',
              borderRadius: '5px'
            }}
          >
            {error}
          </div>
        )}
        
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
