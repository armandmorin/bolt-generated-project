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
    contactEmail: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedClientCode, setSelectedClientCode] = useState('');

  useEffect(() => {
    // Fetch current user's information
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch additional user details from your users table if needed
        const { data: userData, error } = await supabase
          .from('users')
          .select('id, role')
          .eq('email', user.email)
          .single();

        if (userData) {
          setCurrentUser(userData);
        }
      }
    };

    fetchCurrentUser();
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
    
    // Check if user is authenticated and has an ID
    if (!currentUser) {
      alert('You must be logged in to add a client.');
      return;
    }

    const clientKey = generateClientKey();
    const newClientData = {
      name: newClient.name,
      website: newClient.website,
      contact_email: newClient.contactEmail,
      client_key: clientKey,
      status: 'active',
      admin_id: currentUser.id  // Add the admin_id from the current user
    };

    const { data, error } = await supabase
      .from('clients')
      .insert([newClientData])
      .select();

    if (error) {
      console.error('Error adding client:', error);
      alert(`Failed to add client: ${error.message}`);
      return;
    }

    await loadClients();
    
    setNewClient({
      name: '',
      website: '',
      contactEmail: ''
    });
  };

  // ... rest of the component remains the same (previous implementation)

  return (
    <div className={styles.clientManagement}>
      {/* Existing JSX remains the same */}
    </div>
  );
}

export default ClientManagement;
