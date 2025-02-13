import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/header.module.css';

const Header = ({ logo }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          {logo ? (
            <Link to={userRole === 'superadmin' ? '/super-admin' : '/admin'}>
              <img src={logo} alt="Logo" className={styles.logo} />
            </Link>
          ) : (
            <span className={styles.logoText}>
              {userRole === 'superadmin' ? 'Super Admin' : 'Admin Dashboard'}
            </span>
          )}
        </div>
        <nav className={styles.mainNav}>
          <div className={styles.navLinks}>
            <Link to="/admin" className={styles.navLink}>Dashboard</Link>
            <Link to="/clients" className={styles.navLink}>Clients</Link>
          </div>
          <div className={styles.navGroup}>
            <span className={styles.userRole}>
              {userRole === 'superadmin' ? 'Super Admin' : 'Admin'}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
