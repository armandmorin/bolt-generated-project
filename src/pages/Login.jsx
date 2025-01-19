import React, { useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import styles from '../styles/login.module.css';

    const Login = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const navigate = useNavigate();

      const handleLogin = async (e) => {
        e.preventDefault();
        // Add proper login logic here
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
        navigate('/admin');
      };

      return (
        <div className={styles.loginPage}>
          <div className={styles.loginContainer}>
            <h1>Admin Login</h1>
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
