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

      // Show test instructions
      const testUrl = `${window.location.origin}/test.html?key=${clientKey}`;
      alert(`Test client created!\n\nClient Key: ${clientKey}\n\nTest the widget at:\n${testUrl}`);
    } catch (error) {
      console.error('Error creating test client:', error);
      setStatus(`Error creating test client: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Supabase Connection Test</h2>
      <p><strong>Status:</strong> {status}</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={createTestClient}
          style={{
            padding: '12px 24px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Create Test Client
        </button>
      </div>

      {/* Rest of the component remains the same */}
    </div>
  );
};

export default SupabaseTest;
