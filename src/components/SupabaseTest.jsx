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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Existing Clients:</h3>
          {clients.length === 0 ? (
            <p>No clients found. Create a test client to get started.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {clients.map(client => (
                <li key={client.id} style={{ 
                  marginBottom: '10px', 
                  padding: '15px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  background: '#f8fafc'
                }}>
                  <div><strong>Client Key:</strong> {client.client_key}</div>
                  <div><strong>Name:</strong> {client.name}</div>
                  <div><strong>Email:</strong> {client.email}</div>
                  <div>
                    <strong>Status:</strong> 
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: client.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: client.status === 'active' ? '#166534' : '#991b1b',
                      marginLeft: '5px'
                    }}>
                      {client.status}
                    </span>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <a 
                      href={`/test.html?key=${client.client_key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#2563eb',
                        textDecoration: 'none'
                      }}
                    >
                      Test Widget →
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3>Widget Settings:</h3>
          {settings.length === 0 ? (
            <p>No settings found. Create a test client to generate settings.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {settings.map(setting => (
                <li key={setting.id} style={{ 
                  marginBottom: '10px', 
                  padding: '15px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  background: '#f8fafc'
                }}>
                  <div><strong>Client Key:</strong> {setting.client_key}</div>
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <strong>Header Color:</strong>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        background: setting.header_color,
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px'
                      }}></div>
                      {setting.header_color}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <strong>Header Text:</strong>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        background: setting.header_text_color,
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px'
                      }}></div>
                      {setting.header_text_color}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <strong>Button Color:</strong>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        background: setting.button_color,
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px'
                      }}></div>
                      {setting.button_color}
                    </div>
                  </div>
                  <div><strong>Powered By Text:</strong> {setting.powered_by_text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong>Powered By Color:</strong>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      background: setting.powered_by_color,
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px'
                    }}></div>
                    {setting.powered_by_color}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
