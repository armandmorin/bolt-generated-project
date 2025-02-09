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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load admins
      const { data: adminsData } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminsData) {
        setAdmins(adminsData);
      }

      // Load global branding settings
      const { data: brandingData } = await supabase
        .from('global_widget_settings')
        .select('*')
        .single();

      if (brandingData) {
        setGlobalBranding({
          logo: brandingData.logo || '',
          headerColor: brandingData.header_color || '#2563eb',
          buttonColor: brandingData.button_color || '#2563eb'
        });
      }

      // Load domain settings
      const { data: domainData } = await supabase
        .from('domain_settings')
        .select('*')
        .single();

      if (domainData) {
        setDomain(domainData.domain || '');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDomainSave = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('domain_settings')
        .upsert({ domain, id: 1 });

      if (error) throw error;
      alert('Domain settings updated successfully!');
    } catch (error) {
      console.error('Error saving domain:', error);
      alert('Error saving domain settings');
    }
  };

  const saveBrandingSettings = async () => {
    try {
      const { error } = await supabase
        .from('global_widget_settings')
        .upsert({
          logo: globalBranding.logo,
          header_color: globalBranding.headerColor,
          button_color: globalBranding.buttonColor,
          id: 1
        });

      if (error) throw error;
      alert('Global branding settings updated successfully!');
    } catch (error) {
      console.error('Error saving branding settings:', error);
      alert('Error saving branding settings');
    }
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('admins')
        .insert([{
          ...newAdmin,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Reload admins
      await loadInitialData();
      setNewAdmin({ name: '', email: '', password: '', company: '' });
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Error adding admin');
    }
  };

  const removeAdmin = async (adminId) => {
    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      // Reload admins
      await loadInitialData();
    } catch (error) {
      console.error('Error removing admin:', error);
      alert('Error removing admin');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
          Admin Management
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'branding' && (
          <div className={styles.formContainer}>
            <h2>Global Branding Settings</h2>
            <div className={styles.brandingForm}>
              <ImageUpload
                currentImage={globalBranding.logo}
                onImageUpload={(imageData) => {
                  setGlobalBranding(prev => ({
                    ...prev,
                    logo: imageData
                  }));
                }}
                label="Default Logo"
              />

              <div className={styles.colorGroup}>
                <div className={styles.formGroup}>
                  <label>Header Color</label>
                  <input
                    type="color"
                    name="headerColor"
                    value={globalBranding.headerColor}
                    onChange={(e) => setGlobalBranding(prev => ({
                      ...prev,
                      headerColor: e.target.value
                    }))}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Button Color</label>
                  <input
                    type="color"
                    name="buttonColor"
                    value={globalBranding.buttonColor}
                    onChange={(e) => setGlobalBranding(prev => ({
                      ...prev,
                      buttonColor: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.saveButton}
                  onClick={saveBrandingSettings}
                >
                  Save Branding Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'domain' && (
          <div className={styles.formContainer}>
            <h2>Widget Domain Configuration</h2>
            <p className={styles.description}>
              Set the domain where the accessibility widget will be hosted. 
              This domain will be used in the installation code provided to clients.
            </p>
            <form onSubmit={handleDomainSave}>
              <div className={styles.formGroup}>
                <label>Widget Domain</label>
                <input
                  type="url"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="https://widget.yourdomain.com"
                  required
                />
                <span className={styles.hint}>
                  Example: https://widget.yourdomain.com or https://yourdomain.com/widget
                </span>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className={styles.adminSection}>
            <div className={styles.addAdminSection}>
              <h2>Add New Admin</h2>
              <form onSubmit={addAdmin} className={styles.addAdminForm}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={newAdmin.company}
                    onChange={(e) => setNewAdmin({ ...newAdmin, company: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className={styles.addButton}>
                  Add Admin
                </button>
              </form>
            </div>

            <div className={styles.adminListSection}>
              <h2>Admin List</h2>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Date Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.id}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.company}</td>
                      <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          className={styles.removeButton}
                          onClick={() => removeAdmin(admin.id)}
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
