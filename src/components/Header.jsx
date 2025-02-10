import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { getBrandSettingsForHeader } from '../services/brandSettings';
import styles from '../styles/header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSupabase();
  const [brandSettings, setBrandSettings] = useState({
    logo: '',
    header_color: '#2563eb'
  });

  useEffect(() => {
    loadBrandSettings();
  }, [user]);

  const loadBrandSettings = async () => {
    try {
      const settings = await getBrandSettingsForHeader();
      setBrandSettings(settings);
    } catch (error) {
      console.error('Error loading brand settings:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
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
    <header 
      className={styles.mainHeader}
      style={{ backgroundColor: brandSettings.header_color }}
    >
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          {brandSettings.logo ? (
            <Link to={user?.role === 'superadmin' ? '/super-admin' : '/admin'}>
              <img src={brandSettings.logo} alt="Logo" className={styles.logo} />
            </Link>
          ) : (
            <span className={styles.logoText}>
              {user?.role === 'superadmin' ? 'Super Admin' : 'Admin Dashboard'}
            </span>
          )}
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
