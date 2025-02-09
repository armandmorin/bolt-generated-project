import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from '../styles/header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [brandSettings, setBrandSettings] = useState({
    logo: '',
    header_color: '#2563eb'
  });

  useEffect(() => {
    loadBrandSettings();
  }, []);

  const loadBrandSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_settings')
        .select('logo, header_color')
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setBrandSettings({
          logo: data.logo || '',
          header_color: data.header_color || '#2563eb'
        });
      }
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
    <header className={styles.mainHeader}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          {brandSettings.logo ? (
            <Link to={userRole === 'superadmin' ? '/super-admin' : '/admin'}>
              <img 
                src={brandSettings.logo} 
                alt="Logo" 
                className={styles.logo}
                onError={(e) => {
                  console.error('Error loading logo:', e);
                  e.target.style.display = 'none';
                }}
              />
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
