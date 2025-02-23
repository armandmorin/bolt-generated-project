import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import WidgetCodeSnippet from '../components/WidgetCodeSnippet';
import styles from '../styles/client.module.css';

function ClientManagement() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newClient, setNewClient] = useState({
    name: '',
    website: '',
    contactEmail: '',
    email: '' // Add email field
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedClientCode, setSelectedClientCode] = useState('');
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ... (previous useEffect remains the same)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value,
      // If contactEmail is changed, also update email
      ...(name === 'contactEmail' && { email: value })
    }));
  };

  const addClient = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Authentication required');
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!newClient.name || !newClient.website || !newClient.email) {
      alert('Please fill in all required fields');
      return;
    }

    const clientKey = 'client_' + Math.random().toString(36).substring(2, 10);
    const newClientData = {
      name: newClient.name,
      website: newClient.website,
      contact_email: newClient.contactEmail,
      email: newClient.email, // Add email to the client data
      client_key: clientKey,
      status: 'active',
      admin_id: currentUser.id
    };

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([newClientData])
        .select();

      if (error) {
        console.error('Error adding client:', error);
        alert(`Failed to add client: ${error.message}`);
        return;
      }

      await loadClients(currentUser);
      
      // Reset form
      setNewClient({
        name: '',
        website: '',
        contactEmail: '',
        email: ''
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred while adding the client');
    }
  };

  // ... (rest of the component remains the same)

  return (
    <div className={styles.clientManagement}>
      <h1>Client Management</h1>

      {/* Search Input */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Add Client Form */}
      <form onSubmit={addClient} className={styles.addClientForm}>
        <input
          type="text"
          name="name"
          placeholder="Client Name"
          value={newClient.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={newClient.website}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Client Email"
          value={newClient.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="contactEmail"
          placeholder="Contact Email (Optional)"
          value={newClient.contactEmail}
          onChange={handleInputChange}
        />
        <button type="submit">Add Client</button>
      </form>

      {/* Rest of the component remains the same */}
    </div>
  );
}

export default ClientManagement;
