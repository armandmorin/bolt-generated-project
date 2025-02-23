import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/superAdmin.module.css';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [admins, setAdmins] = useState([]);
  const [clients, setClients] = useState([]);
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
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setClients(data);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

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

  // ... rest of the existing code remains the same

  return (
    <div className={styles.superAdminDashboard}>
      {/* ... existing tabs code ... */}

      {activeTab === 'admins' && (
        <div className={styles.adminSection}>
          {/* ... existing admin section ... */}

          <div className={styles.clientListSection}>
            <h2>Existing Clients</h2>
            <table className={styles.clientTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Domain</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={index}>
                    <td>{client.name}</td>
                    <td>{client.domain}</td>
                    <td>{client.status}</td>
                    <td>{new Date(client.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
