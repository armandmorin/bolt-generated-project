import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTest = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [clients, setClients] = useState([]);
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test the connection by fetching clients and their settings
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      if (clientsError) throw clientsError;

      const { data: settingsData, error: settingsError } = await supabase
        .from('widget_settings')
        .select('*');

      if (settingsError) throw settingsError;

      setClients(clientsData || []);
      setSettings(settingsData || []);
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
            header_color: '#8B5CF6',
            header_text_color: '#FFFFFF',
            button_color: '#EC4899',
            powered_by_text: 'Powered by Custom Widget',
            powered_by_color: '#374151'
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Existing Clients:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {clients.map(client => (
              <li key={client.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                <strong>Client Key:</strong> {client.client_key}<br />
                <strong>Name:</strong> {client.name}<br />
                <strong>Status:</strong> {client.status}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Widget Settings:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {settings.map(setting => (
              <li key={setting.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                <strong>Client Key:</strong> {setting.client_key}<br />
                <strong>Header Color:</strong> {setting.header_color}<br />
                <strong>Header Text Color:</strong> {setting.header_text_color}<br />
                <strong>Button Color:</strong> {setting.button_color}<br />
                <strong>Powered By Text:</strong> {setting.powered_by_text}<br />
                <strong>Powered By Color:</strong> {setting.powered_by_color}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
