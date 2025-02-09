import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getSuperAdminSettings, updateSuperAdminSettings } from '../lib/superAdminSettings';
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
    loadAdmins();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getSuperAdminSettings();
      if (settings) {
        setGlobalBranding({
          logo: settings.logo || '',
          headerColor: settings.headerColor || '#2563eb',
          buttonColor: settings.buttonColor || '#2563eb'
        });
        setDomain(settings.widgetDomain || '');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setAdmins(data);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const handleBrandingChange = (e) => {
    const { name, value } = e.target;
    setGlobalBranding(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveBrandingSettings = async () => {
    setSaving(true);
    try {
      const success = await updateSuperAdminSettings({
        ...await getSuperAdminSettings(),
        logo: globalBranding.logo,
        headerColor: globalBranding.headerColor,
        buttonColor: globalBranding.buttonColor
      });

      if (success) {
        alert('Global branding settings updated successfully!');
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving branding settings:', error);
      alert('Error saving branding settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDomainSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const success = await updateSuperAdminSettings({
        ...await getSuperAdminSettings(),
        widgetDomain: domain
      });

      if (success) {
        alert('Domain settings updated successfully!');
      } else {
        throw new Error('Failed to update domain settings');
      }
    } catch (error) {
      console.error('Error saving domain settings:', error);
      alert('Error saving domain settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('admins')
        .insert([{
          name: newAdmin.name,
          email: newAdmin.email,
          password: newAdmin.password, // In production, use proper password hashing
          company: newAdmin.company,
          role: 'admin'
        }]);

      if (error) throw error;

      alert('Admin added successfully!');
      setNewAdmin({ name: '', email: '', password: '', company: '' });
      await loadAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Error adding admin');
    } finally {
      setSaving(false);
    }
  };

  const removeAdmin = async (adminId) => {
    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      await loadAdmins();
    } catch (error) {
      console.error('Error removing admin:', error);
      alert('Error removing admin');
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
                    onChange={handleBrandingChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Button Color</label>
                  <input
                    type="color"
                    name="buttonColor"
                    value={globalBranding.buttonColor}
                    onChange={handleBrandingChange}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.saveButton}
                  onClick={saveBrandingSettings}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Branding Settings'}
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
                <button 
                  type="submit" 
                  className={styles.saveButton}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Domain'}
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
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newAdmin.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newAdmin.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={newAdmin.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={styles.addButton}
                  disabled={saving}
                >
                  {saving ? 'Adding...' : 'Add Admin'}
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
                    <th>Clients</th>
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
                      <td>{admin.clients?.length || 0}</td>
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
