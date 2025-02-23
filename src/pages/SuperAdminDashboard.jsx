import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/superAdmin.module.css';

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
  const brandSettings = JSON.parse(localStorage.getItem('brandSettings') || '{}');

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

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const updatedAdmins = [...admins, newAdmin];
      setAdmins(updatedAdmins);
      localStorage.setItem('admins', JSON.stringify(updatedAdmins));
      
      // Reset form
      setNewAdmin({
        name: '',
        email: '',
        password: '',
        company: ''
      });
      
      alert('Admin added successfully!');
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin');
    }
  };

  return (
    <div className={styles.superAdminDashboard}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'branding' ? styles.active : ''}`}
          onClick={() => setActiveTab('branding')}
        >
          Global Branding
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'domain' ? styles.active : ''}`}
          onClick={() => setActiveTab('domain')}
        >
          Domain Settings
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'admins' ? styles.active : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          Manage Admins
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'branding' && (
          <div className={styles.formContainer}>
            <h2>Global Branding</h2>
            <p className={styles.description}>
              Customize the look and feel of your accessibility widget across all clients.
            </p>

            <div className={styles.formGroup}>
              <label>Logo</label>
              <ImageUpload 
                onUploadComplete={(url) => setGlobalBranding(prev => ({ ...prev, logo: url }))}
                currentImage={globalBranding.logo}
              />
            </div>

            <div className={styles.colorGroup}>
              <div className={styles.formGroup}>
                <label>Header Color</label>
                <input 
                  type="color" 
                  value={globalBranding.headerColor}
                  onChange={(e) => setGlobalBranding(prev => ({ ...prev, headerColor: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Button Color</label>
                <input 
                  type="color" 
                  value={globalBranding.buttonColor}
                  onChange={(e) => setGlobalBranding(prev => ({ ...prev, buttonColor: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                className={styles.saveButton}
                onClick={saveBrandingSettings}
              >
                Save Branding Settings
              </button>
            </div>
          </div>
        )}

        {activeTab === 'domain' && (
          <div className={styles.formContainer}>
            <h2>Domain Settings</h2>
            <p className={styles.description}>
              Configure the domain where your accessibility widget will be embedded.
            </p>

            <form onSubmit={handleDomainSave}>
              <div className={styles.formGroup}>
                <label>Widget Domain</label>
                <input 
                  type="text" 
                  placeholder="Enter domain (e.g., example.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                />
                <span className={styles.hint}>
                  The domain where the accessibility widget will be active
                </span>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="submit" 
                  className={styles.saveButton}
                >
                  Save Domain Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className={styles.adminSection}>
            <div className={styles.addAdminSection}>
              <h2>Add New Admin</h2>
              <form onSubmit={handleAddAdmin} className={styles.addAdminForm}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input 
                    type="text" 
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input 
                    type="password" 
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Company</label>
                  <input 
                    type="text" 
                    value={newAdmin.company}
                    onChange={(e) => setNewAdmin(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <button type="submit" className={styles.addButton}>
                  Add Admin
                </button>
              </form>
            </div>

            <div className={styles.adminListSection}>
              <h2>Existing Admins</h2>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <tr key={index}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.company}</td>
                      <td>
                        <button 
                          className={styles.removeButton}
                          onClick={() => {
                            const updatedAdmins = admins.filter((_, i) => i !== index);
                            setAdmins(updatedAdmins);
                            localStorage.setItem('admins', JSON.stringify(updatedAdmins));
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
