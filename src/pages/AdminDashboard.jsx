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
    primaryColor: '#2563eb',
    secondaryColor: '#ffffff'
  });

  useEffect(() => {
    loadBrandingSettings();
  }, []);

  const loadBrandingSettings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      // Use maybeSingle() to avoid errors when no row is returned
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
        setBrandSettings({
          logo: data.logo || '',
          primaryColor: data.primary_color || '#2563eb',
          secondaryColor: data.secondary_color || '#ffffff'
        });
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
        alert('User not found');
        return;
      }

      // Use upsert to handle both update and insert at once
      const { error } = await supabase
        .from('admin_branding')
        .upsert({
          admin_email: user.email,
          logo: brandSettings.logo,
          primary_color: brandSettings.primaryColor,
          secondary_color: brandSettings.secondaryColor
        }, { onConflict: 'admin_email' });

      if (error) throw error;

      alert('Brand settings updated successfully!');
    } catch (error) {
      console.error('Error updating branding settings:', error);
      alert('Failed to update brand settings');
    }
  };

  return (
    <div className={styles.adminDashboard}>
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
                onImageUpload={(imageData) => {
                  setBrandSettings(prev => ({
                    ...prev,
                    logo: imageData
                  }));
                }}
                label="Company Logo"
              />

              <div className={styles.colorGroup}>
                <div className={styles.formGroup}>
                  <label>Primary Color</label>
                  <input
                    type="color"
                    value={brandSettings.primaryColor}
                    onChange={(e) => setBrandSettings({ ...brandSettings, primaryColor: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Secondary Color</label>
                  <input
                    type="color"
                    value={brandSettings.secondaryColor}
                    onChange={(e) => setBrandSettings({ ...brandSettings, secondaryColor: e.target.value })}
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
