import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import styles from '../styles/header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useSupabase();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const getNavLinks = () => {
    if (!user) return null;

    if (user.role === 'superadmin') {
      return (
        <>
          <Link to="/super-admin" className={styles.navLink}>Dashboard</Link>
        </>
      );
    }
    if (user.role === 'admin') {
      return (
        <>
          <Link to="/admin" className={styles.navLink}>Dashboard</Link>
        </>
      );
    }
    return null;
  };

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          <span className={styles.logoText}>
            {user?.role === 'superadmin' ? 'Super Admin' : 'Admin Dashboard'}
          </span>
        </div>

        <nav className={styles.mainNav}>
          <div className={styles.navLinks}>
            {getNavLinks()}
          </div>
          
          <div className={styles.navGroup}>
            <span className={styles.userRole}>
              {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
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
