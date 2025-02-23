import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/superAdmin.module.css';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [admins, setAdmins] = useState([]);
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    domain: '',
    description: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id,
          name, 
          email, 
          domain, 
          status, 
          created_at,
          logo_url,
          primary_color,
          secondary_color
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const createNewClient = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          name: newClient.name,
          email: newClient.email,
          domain: newClient.domain,
          description: newClient.description,
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      // Reset form and reload clients
      setNewClient({ name: '', email: '', domain: '', description: '' });
      loadClients();
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <div className={styles.superAdminDashboard}>
      {activeTab === 'admins' && (
        <div className={styles.adminSection}>
          <div className={styles.clientListSection}>
            <h2>Existing Clients</h2>
            <form onSubmit={createNewClient} className={styles.newClientForm}>
              <input
                type="text"
                placeholder="Client Name"
                value={newClient.name}
                onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Client Email"
                value={newClient.email}
                onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Domain"
                value={newClient.domain}
                onChange={(e) => setNewClient({...newClient, domain: e.target.value})}
                required
              />
              <textarea
                placeholder="Description (Optional)"
                value={newClient.description}
                onChange={(e) => setNewClient({...newClient, description: e.target.value})}
              />
              <button type="submit">Create New Client</button>
            </form>

            <table className={styles.clientTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Domain</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.domain}</td>
                    <td>{client.status}</td>
                    <td>{new Date(client.created_at).toLocaleDateString()}</td>
                    <td>
                      <button>Edit</button>
                      <button>Delete</button>
                    </td>
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
