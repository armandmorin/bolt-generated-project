import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/modules/login.module.css';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const brandSettings = JSON.parse(localStorage.getItem('brandSettings') || '{}');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === 'armandmorin@gmail.com' && password === '1armand') {
      localStorage.setItem('userRole', 'superadmin');
      localStorage.setItem('user', JSON.stringify({ email, role: 'superadmin' }));
      navigate('/super-admin');
    } else {
      alert('Invalid credentials');
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
          <h1>Super Admin Login</h1>
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
          <button type="submit" className={styles.loginButton}>
            Login
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
