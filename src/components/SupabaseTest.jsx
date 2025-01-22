import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTest = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test the connection by fetching clients
      const { data, error } = await supabase
        .from('clients')
        .select('*');

      if (error) throw error;

      setClients(data || []);
      setStatus('Connected successfully to Supabase!');
    } catch (error) {
      console.error('Supabase connection error:', error);
      setStatus(`Connection error: ${error.message}`);
    }
  };

  const createTestClient = async () => {
    try {
      const clientKey = 'test_' + Math.random().toString(36).substr(2, 9);
      
      // Create a new client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([
          {
            client_key: clientKey,
            name: 'Test Client',
            email: 'test@example.com',
            status: 'active'
          }
        ])
        .select()
        .single();

      if (clientError) throw clientError;

      // Create default widget settings for the client
      const { error: settingsError } = await supabase
        .from('widget_settings')
        .insert([
          {
            client_key: clientKey,
            header_color: '#60a5fa',
            header_text_color: '#1e293b',
            button_color: '#2563eb',
            powered_by_text: 'Powered by Test Widget',
            powered_by_color: '#64748b'
          }
        ]);

      if (settingsError) throw settingsError;

      // Refresh the clients list
      testConnection();
      alert(`Test client created with key: ${clientKey}`);
    } catch (error) {
      console.error('Error creating test client:', error);
      setStatus(`Error creating test client: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Supabase Connection Test</h2>
      <p><strong>Status:</strong> {status}</p>
      
      <button 
        onClick={createTestClient}
        style={{
          padding: '8px 16px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Create Test Client
      </button>

      <h3>Existing Clients:</h3>
      <ul>
        {clients.map(client => (
          <li key={client.id}>
            Client Key: {client.client_key} - Name: {client.name} - Status: {client.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupabaseTest;
