import React, { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import ClientManagement from './ClientManagement';
import WidgetCustomization from './WidgetCustomization';
import ProfileSettings from './ProfileSettings';
import TeamMembers from './TeamMembers';
import ImageUpload from '../components/ImageUpload';
import { supabase, getBrandSettings, updateBrandSettings, createDefaultBrandSettings } from '../lib/supabase';
import styles from '../styles/admin.module.css';

const DEFAULT_BRAND_SETTINGS = {
  logo: '',
  primary_color: '#2563eb',
  secondary_color: '#ffffff',
  header_color: '#2563eb'
};

const AdminDashboard = () => {
  const { user } = useSupabase();
  const [activeTab, setActiveTab] = useState('clients');
  const [brandSettings, setBrandSettings] = useState(DEFAULT_BRAND_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadBrandSettings();
    }
  }, [user]);

  const loadBrandSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get existing settings, or create default if none exist
      const settings = await getBrandSettings(user.id);

      if (settings) {
        setBrandSettings(settings);
        applyBrandSettings(settings);
      } else {
        // If no settings found, create default
        const newSettings = await createDefaultBrandSettings(user.id);
        setBrandSettings(newSettings);
        applyBrandSettings(newSettings);
      }
    } catch (err) {
      console.error('Error loading brand settings:', err);
      setError('Failed to load brand settings. Using defaults.');
      setBrandSettings(DEFAULT_BRAND_SETTINGS);
      applyBrandSettings(DEFAULT_BRAND_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const applyBrandSettings = (settings) => {
    document.documentElement.style.setProperty('--primary-color', settings.primary_color || '#2563eb');
    document.documentElement.style.setProperty('--secondary-color', settings.secondary_color || '#ffffff');
    document.documentElement.style.setProperty('--header-color', settings.header_color || '#2563eb');
  };

  const handleBrandUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const settingsData = {
        ...brandSettings,
        admin_id: user.id,
        updated_at: new Date().toISOString()
      };

      const updatedSettings = await updateBrandSettings(settingsData);
      
      setBrandSettings(updatedSettings);
      applyBrandSettings(updatedSettings);
      alert('Brand settings updated successfully!');
    } catch (error) {
      console.error('Error updating brand settings:', error);
      setError('Failed to save brand settings');
    } finally {
      setSaving(false);
    }
  };

  // Rest of the component remains the same...
  // (render method and other methods stay unchanged)
};

export default AdminDashboard;
