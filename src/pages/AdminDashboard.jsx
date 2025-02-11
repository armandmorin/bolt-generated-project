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

      const { data, error } = await supabase
        .from('admin_branding')
        .select('*')
        .eq('admin_email', user.email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
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

      // Upsert method to handle both insert and update
      const { data, error } = await supabase
        .from('admin_branding')
        .upsert({
          admin_email: user.email,
          logo: brandSettings.logo,
          primary_color: brandSettings.primaryColor,
          secondary_color: brandSettings.secondaryColor
        }, {
          onConflict: 'admin_email'
        });

      if (error) throw error;

      alert('Brand settings updated successfully!');
    } catch (error) {
      console.error('Error updating branding settings:', error);
      alert('Failed to update brand settings');
    }
  };

  // Rest of the component remains the same...

  return (
    <div className={styles.adminDashboard}>
      {/* Existing JSX remains the same */}
    </div>
  );
};

export default AdminDashboard;
