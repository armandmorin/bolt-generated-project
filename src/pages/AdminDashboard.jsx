import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ClientManagement from './ClientManagement';
import WidgetCustomization from './WidgetCustomization';
import ProfileSettings from './ProfileSettings';
import TeamMembers from './TeamMembers';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/admin.module.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [brandSettings, setBrandSettings] = useState({
    logo: '',
    headerColor: '#ffffff',  // Header background color
    primaryColor: '#2563eb', // Primary (link and button) color
    secondaryColor: '#ffffff' 
  });
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Update CSS variables for realtime changes.
  const updateCSSVariables = (settings) => {
    document.documentElement.style.setProperty('--header-bg', settings.headerColor);
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
  };

  useEffect(() => {
    loadBrandingSettings();
  }, []);

  const loadBrandingSettings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const { data, error } = await supabase
        .from('admin_branding')
        .select('*')
        .eq('admin_email', user.email)
        .maybeSingle();

      if (error) {
        console.error('Error loading branding settings:', error);
        return;
      }

      if (data) {
        const newSettings = {
          logo: data.logo || '',
          headerColor: data.header_color || '#ffffff',
          primaryColor: data.primary_color || '#2563eb',
          secondaryColor: data.secondary_color || '#ffffff'
        };
        setBrandSettings(newSettings);
        updateCSSVariables(newSettings);
      }
    } catch (error) {
      console.error('Error loading branding settings:', error);
    }
  };

  const handleBrandUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setModalMessage('User not found');
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3000);
        return;
      }
      const { error } = await supabase
        .from('admin_branding')
        .upsert({
          admin_email: user.email,
          logo: brandSettings.logo,
          header_color: brandSettings.headerColor,
          primary_color: brandSettings.primaryColor,
          secondary_color: brandSettings.secondaryColor
        }, { onConflict: 'admin_email' });

      if (error) throw error;
      setModalMessage('Brand settings updated successfully!');
      setShowModal(true);
      updateCSSVariables(brandSettings);
      setTimeout(() => setShowModal(false), 3000);
    } catch (error) {
      console.error('Error updating branding settings:', error);
      setModalMessage('Failed to update brand settings');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  const handleColorChange = (field, value) => {
    const newSettings = { ...brandSettings, [field]: value };
    setBrandSettings(newSettings);
    updateCSSVariables(newSettings);
  };

  return (
    <div className={styles.adminDashboard}>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'branding' ? styles.active : ''}`}
          onClick={() => setActiveTab('branding')}
        >
          Website Branding
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'widget' ? styles.active : ''}`}
          onClick={() => setActiveTab('widget')}
        >
          Widget Preview
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'clients' ? styles.active : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          Client Management
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'team' ? styles.active : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Team Members
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'branding' && (
          <div className={styles.formContainer}>
            <form onSubmit={handleBrandUpdate}>
              <ImageUpload
                currentImage={brandSettings.logo}
                onImageUpload={(imageData) =>
                  setBrandSettings({ ...brandSettings, logo: imageData })
                }
                label="Company Logo"
              />

              <div className={styles.colorGroup}>
                <div className={styles.formGroup}>
                  <label>Header Color</label>
                  <input
                    type="color"
                    value={brandSettings.headerColor}
                    onChange={(e) => handleColorChange('headerColor', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Primary Color (Link, Button Color)</label>
                  <input
                    type="color"
                    value={brandSettings.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Secondary Color</label>
                  <input
                    type="color"
                    value={brandSettings.secondaryColor}
                    onChange={(e) =>
                      setBrandSettings({ ...brandSettings, secondaryColor: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.primaryButton}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'widget' && <WidgetCustomization />}
        {activeTab === 'clients' && <ClientManagement />}
        {activeTab === 'team' && <TeamMembers />}
        {activeTab === 'profile' && <ProfileSettings />}
      </div>
    </div>
  );
};

export default AdminDashboard;
