import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from '../styles/modules/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user details directly from Supabase
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user details:', userError);
            return;
          }

          const userRole = userData?.role || 'client';
          
          // Redirect based on user role
          switch (userRole) {
            case 'super_admin':
              navigate('/super-admin');
              break;
            case 'admin':
              navigate('/admin');
              break;
            default:
              navigate('/client');
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Comprehensive validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Attempt sign-in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw signInError;
      }

      // Fetch user details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        console.error('Error fetching user details:', userError);
        throw new Error('Unable to retrieve user details');
      }

      // Determine user role with fallback
      const userRole = userData?.role || 'client';
      
      // Store role in local storage for persistence
      localStorage.setItem('userRole', userRole);

      // Redirect based on role
      switch (userRole) {
        case 'super_admin':
          navigate('/super-admin');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/client');
      }

    } catch (err) {
      console.error('Login error:', err);
      
      // Detailed error handling
      switch (err.message) {
        case 'Invalid login credentials':
          setError('Incorrect email or password. Please try again.');
          break;
        case 'Email not confirmed':
          setError('Please confirm your email before logging in.');
          break;
        case 'Unable to retrieve user details':
          setError('Unable to fetch user information. Please contact support.');
          break;
        default:
          setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to access your dashboard</p>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordContainer}>
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button 
                type="button" 
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className={styles.forgotPasswordContainer}>
            <button 
              type="button" 
              className={styles.forgotPasswordLink}
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className={styles.registerSection}>
            <p>Don't have an account?</p>
            <Link to="/register" className={styles.registerLink}>
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
