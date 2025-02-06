import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/client.module.css';

function ClientManagement() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    website: '',
    contact_email: '' // Changed from contactEmail to contact_email
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedClientCode, setSelectedClientCode] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading clients:', error);
      return;
    }

    if (data) {
      setClients(data);
    }
  }

  const generateClientKey = () => {
    return 'client_' + Math.random().toString(36).substring(2, 10);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addClient = async (e) => {
    e.preventDefault();
    
    const clientKey = generateClientKey();
    const newClientData = {
      name: newClient.name,
      website: newClient.website,
      contact_email: newClient.contact_email, // Changed from contactEmail to contact_email
      client_key: clientKey,
      status: 'active'
    };

    const { error } = await supabase
      .from('clients')
      .insert([newClientData]);

    if (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client. Please try again.');
      return;
    }

    await loadClients();
    
    setNewClient({
      name: '',
      website: '',
      contact_email: '' // Changed from contactEmail to contact_email
    });
  };

  // ... rest of the component remains the same ...

  return (
    <div className={styles.clientManagement}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.addClientForm}>
        <h3>Add New Client</h3>
        <form onSubmit={addClient}>
          <div className={styles.formGroup}>
            <label>Client Name</label>
            <input
              type="text"
              name="name"
              value={newClient.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Website URL</label>
            <input
              type="url"
              name="website"
              value={newClient.website}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Contact Email</label>
            <input
              type="email"
              name="contact_email" // Changed from contactEmail to contact_email
              value={newClient.contact_email} // Changed from contactEmail to contact_email
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className={styles.addButton}>
            Add Client
          </button>
        </form>
      </div>

      {/* ... rest of the JSX remains the same ... */}
    </div>
  );
}

export default ClientManagement;
