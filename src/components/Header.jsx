import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useBrand } from '../contexts/BrandContext';
import styles from '../styles/header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const { brandSettings } = useBrand();
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    loadAdminProfile();
  }, []);

  const loadAdminProfile = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        navigate('/');
        return;
      }

      // Get admin profile
      const { data: profileData, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      if (profileData) {
        setAdminProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading admin profile:', error);
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getNavLinks = () => {
    if (adminProfile?.role === 'superadmin') {
      return (
        <>
          <Link to="/super-admin" className={styles.navLink}>Dashboard</Link>
        </>
      );
    }
    return (
      <>
        <Link to="/admin" className={styles.navLink}>Dashboard</Link>
      </>
    );
  };

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          {brandSettings.logo ? (
            <Link to={adminProfile?.role === 'superadmin' ? '/super-admin' : '/admin'}>
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
              {adminProfile?.role === 'superadmin' ? 'Super Admin' : 'Admin Dashboard'}
            </span>
          )}
        </div>

        <nav className={styles.mainNav}>
          <div className={styles.navLinks}>
            {getNavLinks()}
          </div>
          
          <div className={styles.navGroup}>
            {adminProfile && (
              <span className={styles.userRole}>
                {adminProfile.name || adminProfile.email}
              </span>
            )}
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
