import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from '../styles/header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState(null);
  const [brandSettings, setBrandSettings] = useState({
    logo: '',
    header_color: '#2563eb',
    primary_color: '#2563eb',
    secondary_color: '#ffffff'
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
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

      // Load brand settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('admin_id', session.user.id)
        .maybeSingle();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      if (settingsData) {
        setBrandSettings({
          logo: settingsData.logo || '',
          header_color: settingsData.header_color || '#2563eb',
          primary_color: settingsData.primary_color || '#2563eb',
          secondary_color: settingsData.secondary_color || '#ffffff'
        });

        // Set CSS variables
        document.documentElement.style.setProperty('--header-color', settingsData.header_color || '#2563eb');
        document.documentElement.style.setProperty('--primary-color', settingsData.primary_color || '#2563eb');
        document.documentElement.style.setProperty('--secondary-color', settingsData.secondary_color || '#ffffff');
      } else {
        // Create default settings if none exist
        const { error: createError } = await supabase
          .from('brand_settings')
          .insert([{
            admin_id: session.user.id,
            primary_color: '#2563eb',
            secondary_color: '#ffffff',
            header_color: '#2563eb'
          }]);

        if (createError) throw createError;
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Use defaults if there's an error
      setBrandSettings({
        logo: '',
        header_color: '#2563eb',
        primary_color: '#2563eb',
        secondary_color: '#ffffff'
      });

      // Set default CSS variables
      document.documentElement.style.setProperty('--header-color', '#2563eb');
      document.documentElement.style.setProperty('--primary-color', '#2563eb');
      document.documentElement.style.setProperty('--secondary-color', '#ffffff');
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

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          {brandSettings.logo ? (
            <Link to="/admin">
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
              Admin Dashboard
            </span>
          )}
        </div>

        <nav className={styles.mainNav}>
          <div className={styles.navLinks}>
            <Link to="/admin" className={styles.navLink}>Dashboard</Link>
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
