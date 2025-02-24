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
    contactEmail: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedClientCode, setSelectedClientCode] = useState('');
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    loadClients();
    // Get the current user's ID
    const fetchAdminId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAdminId(user.id);
    };
    fetchAdminId();
  }, []);

  async function loadClients() {
    try {
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
    } catch (error) {
      console.error('Error:', error);
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
    
    if (!adminId) {
      console.error('Admin ID is not available');
      return;
    }

    const clientKey = generateClientKey();
    const newClientData = {
      name: newClient.name,
      website: newClient.website,
      contact_email: newClient.contactEmail,
      client_key: clientKey,
      status: 'active',
      admin_id: adminId // Add the admin_id
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
      contactEmail: ''
    });
  };

  // ... rest of the component remains the same
}

export default ClientManagement;
