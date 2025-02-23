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

      // If login successful, navigate to appropriate dashboard
      if (data.user) {
        // Fetch user role from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('email', email)
          .single();

        if (userError) {
          throw userError;
        }

        // Determine route based on user role
        const route = userData.role === 'super_admin' ? '/super-admin' : 
                      userData.role === 'admin' ? '/admin' : 
                      '/client';

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
        {/* Existing login form code */}
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          {/* Existing form fields */}
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
