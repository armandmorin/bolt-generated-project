import React, { useState, useEffect } from 'react';
import { getAdminBrandSettings, updateBrandSettings, applyBrandSettings, uploadLogo } from '../services/brandSettings';
import { useSupabase } from '../contexts/SupabaseContext';
import ClientManagement from './ClientManagement';
import WidgetCustomization from './WidgetCustomization';
import ProfileSettings from './ProfileSettings';
import TeamMembers from './TeamMembers';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/admin.module.css';

const AdminDashboard = () => {
  const { user } = useSupabase();
  const [activeTab, setActiveTab] = useState('branding');
  const [brandSettings, setBrandSettings] = useState({
    logo: '',
    primary_color: '#2563eb',
    secondary_color: '#ffffff',
    header_color: '#2563eb'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadBrandSettings();
    }
  }, [user]);

  useEffect(() => {
    applyBrandSettings(brandSettings);
  }, [brandSettings]);

  const loadBrandSettings = async () => {
    try {
      const settings = await getAdminBrandSettings(user.id);
      setBrandSettings(settings);
    } catch (error) {
      console.error('Error loading brand settings:', error);
    }
  };

  const handleBrandUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!user?.id) {
        throw new Error('User ID not found');
      }

      let logoUrl = brandSettings.logo;

      // If there's a new logo (base64), upload it
      if (brandSettings.logo && brandSettings.logo.startsWith('data:image')) {
        logoUrl = await uploadLogo(brandSettings.logo);
      }

      const settingsToUpdate = {
        ...brandSettings,
        logo: logoUrl,
        admin_id: user.id
      };

      const success = await updateBrandSettings(settingsToUpdate, user.id);

      if (success) {
        alert('Brand settings updated successfully!');
        setBrandSettings(settingsToUpdate);
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving brand settings:', error);
      alert('Error saving brand settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Rest of your component remains the same...
  return (
    <div className={styles.adminDashboard}>
      {/* ... existing JSX ... */}
    </div>
  );
};

export default AdminDashboard;
