import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTest = () => {
  const [status, setStatus] = useState('Ready to test');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setStatus('Loading clients...');
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          widget_settings (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      setClients(data || []);
      setStatus(`Loaded ${data.length} clients`);
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error loading clients: ${error.message}`);
    }
  };

  const createTestClient = async () => {
    try {
      setStatus('Creating new test client...');
      
      // Generate client key
      const clientKey = 'test_' + Math.random().toString(36).substr(2, 9);
      
      // 1. Create client first
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

      // 2. Create widget settings
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

      // 3. Reload clients
      await loadClients();

      // 4. Show success message with test URL
      const testUrl = `${window.location.origin}/test.html?key=${clientKey}`;
      setStatus('Client created successfully!');
      alert(`Test client created!\n\nClient Key: ${clientKey}\n\nTest URL: ${testUrl}\n\nCopy this URL to test the widget.`);
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error creating client: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Supabase Widget Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f9ff', borderRadius: '4px' }}>
        <strong>Status:</strong> {status}
      </div>

      <button
        onClick={createTestClient}
        style={{
          padding: '10px 20px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Create New Test Client
      </button>

      <h2>Existing Clients</h2>
      <div style={{ 
        background: 'white', 
        padding: '20px',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {clients.length === 0 ? (
          <p>No clients found. Create a test client to get started.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Client Key</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Settings</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Test Link</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{client.client_key}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{client.name}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      background: client.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: client.status === 'active' ? '#166534' : '#991b1b'
                    }}>
                      {client.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    {client.widget_settings ? '✅' : '❌'}
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    <a 
                      href={`/test.html?key=${client.client_key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2563eb', textDecoration: 'none' }}
                    >
                      Test Widget →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SupabaseTest;
