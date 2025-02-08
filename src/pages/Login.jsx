import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { sessionManager } from '../utils/sessionManager';
import styles from '../styles/modules/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const brandSettings = JSON.parse(localStorage.getItem('brandSettings') || '{}');

  useEffect(() => {
    // Check if user is already logged in
    if (sessionManager.isLoggedIn()) {
      const user = sessionManager.getSession();
      navigateBasedOnRole(user.role);
    }
  }, []);

  // Check if we're trying to access the test page
  if (location.pathname === '/test') {
    return null; // Don't render login for test route
  }

  const navigateBasedOnRole = (role) => {
    switch (role) {
      case 'superadmin':
        navigate('/super-admin');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'client':
        navigate('/client');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // In a real application, you would validate credentials with your backend
    const userData = {
      email,
      role: 'admin',
      loginTime: new Date().toISOString()
    };

    // Create session
    sessionManager.createSession(userData);
    localStorage.setItem('userRole', 'admin');

    // Navigate based on role
    navigateBasedOnRole('admin');
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

          <button type="submit" className={styles.loginButton}>
            Login
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
