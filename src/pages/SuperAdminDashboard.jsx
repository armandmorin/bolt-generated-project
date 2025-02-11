import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/admin.module.css';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    company: ''
  });
  const [globalBranding, setGlobalBranding] = useState({
    logo: '',
    headerColor: '#2563eb',
    buttonColor: '#2563eb'
  });
  const [domain, setDomain] = useState('');

  useEffect(() => {
    loadAdmins();
    loadGlobalBranding();
    loadDomain();
  }, []);

  const loadAdmins = async () => {
    const savedAdmins = localStorage.getItem('admins');
    if (savedAdmins) {
      setAdmins(JSON.parse(savedAdmins));
    }
  };

  const loadGlobalBranding = async () => {
    try {
      const { data, error } = await supabase
        .from('global_branding')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setGlobalBranding({
          logo: data.logo || '',
          headerColor: data.header_color || '#2563eb',
          buttonColor: data.button_color || '#2563eb'
        });
      }
    } catch (error) {
      console.error('Error loading global branding:', error);
    }
  };

  const loadDomain = async () => {
    try {
      const { data, error } = await supabase
        .from('global_settings')
        .select('widget_domain')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setDomain(data.widget_domain || '');
      }
    } catch (error) {
      console.error('Error loading domain:', error);
    }
  };

  const handleDomainSave = async (e) => {
    e.preventDefault();
    try {
      const { data: existingDomain, error: checkError } = await supabase
        .from('global_settings')
        .select('*')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingDomain) {
        const { error } = await supabase
          .from('global_settings')
          .update({ widget_domain: domain })
          .eq('id', existingDomain.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('global_settings')
          .insert([{ widget_domain: domain }]);

        if (error) throw error;
      }

      alert('Domain settings updated successfully!');
    } catch (error) {
      console.error('Error saving domain:', error);
      alert('Failed to save domain settings');
    }
  };

  const saveBrandingSettings = async () => {
    try {
      const { data: existingBranding, error: checkError } = await supabase
        .from('global_branding')
        .select('*')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingBranding) {
        const { error } = await supabase
          .from('global_branding')
          .update({
            logo: globalBranding.logo,
            header_color: globalBranding.headerColor,
            button_color: globalBranding.buttonColor
          })
          .eq('id', existingBranding.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('global_branding')
          .insert([{
            logo: globalBranding.logo,
            header_color: globalBranding.headerColor,
            button_color: globalBranding.buttonColor
          }]);

        if (error) throw error;
      }

      alert('Global branding settings updated successfully!');
    } catch (error) {
      console.error('Error updating global branding:', error);
      alert('Failed to update global branding settings');
    }
  };

  // Rest of the component remains the same...
  return (
    <div className={styles.superAdminDashboard}>
      {/* Existing JSX remains the same */}
    </div>
  );
};

export default SuperAdminDashboard;
