import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/header.module.css';

const Header = ({ logo, primaryColor }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getNavLinks = () => {
    if (userRole === 'superadmin') {
      return (
        <>
          <Link to="/super-admin" className={styles.navLink}>Dashboard</Link>
        </>
      );
    }
    if (userRole === 'admin') {
      return (
        <>
          <Link to="/admin" className={styles.navLink}>Dashboard</Link>
        </>
      );
    }
    return null;
  };

  return (
    <header 
      className={styles.mainHeader}
      style={{ backgroundColor: primaryColor }}
    >
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
            {getNavLinks()}
          </div>
          
          <div className={styles.navGroup}>
            <span className={styles.userRole}>
              {userRole === 'superadmin' ? 'Super Admin' : 'Admin'}
            </span>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
