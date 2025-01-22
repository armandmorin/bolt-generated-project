import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTest = () => {
  const [status, setStatus] = useState('Testing connection...');

  // Add immediate visual feedback
  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ 
        color: '#1e293b', 
        marginBottom: '24px' 
      }}>
        Supabase Widget Test Page
      </h1>

      <div style={{
        padding: '20px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <h2 style={{ marginTop: 0, color: '#1e293b' }}>Connection Status</h2>
        <p style={{ 
          color: status.includes('error') ? '#dc2626' : '#16a34a',
          fontWeight: 500 
        }}>
          {status}
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <button 
          onClick={async () => {
            try {
              const { data, error } = await supabase.from('clients').select('*');
              if (error) throw error;
              setStatus(`Successfully connected! Found ${data.length} clients.`);
            } catch (error) {
              setStatus(`Connection error: ${error.message}`);
            }
          }}
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
          Test Connection
        </button>

        <button 
          onClick={async () => {
            try {
              const clientKey = 'test_' + Math.random().toString(36).substr(2, 9);
              
              // Create client
              const { error: clientError } = await supabase
                .from('clients')
                .insert([{
                  client_key: clientKey,
                  name: 'Test Client',
                  email: 'test@example.com',
                  status: 'active'
                }]);

              if (clientError) throw clientError;

              // Create settings
              const { error: settingsError } = await supabase
                .from('widget_settings')
                .insert([{
                  client_key: clientKey,
                  header_color: '#8B5CF6',
                  header_text_color: '#FFFFFF',
                  button_color: '#EC4899',
                  powered_by_text: 'Powered by Custom Widget',
                  powered_by_color: '#374151'
                }]);

              if (settingsError) throw settingsError;

              setStatus(`Successfully created test client with key: ${clientKey}`);
              
              // Show test URL
              const testUrl = `${window.location.origin}/test.html?key=${clientKey}`;
              alert(`Test client created!\n\nClient Key: ${clientKey}\n\nTest URL: ${testUrl}`);
            } catch (error) {
              setStatus(`Error creating test client: ${error.message}`);
            }
          }}
          style={{
            padding: '12px 24px',
            background: '#16a34a',
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

      <div style={{
        padding: '20px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ marginTop: 0, color: '#1e293b' }}>Instructions</h2>
        <ol style={{ color: '#1e293b', lineHeight: 1.6 }}>
          <li>Click "Test Connection" to verify Supabase connection</li>
          <li>Click "Create Test Client" to generate a new client with settings</li>
          <li>Use the provided client key to test the widget</li>
          <li>Access the widget test page at: /test.html?key=YOUR_CLIENT_KEY</li>
        </ol>
      </div>
    </div>
  );
};

export default SupabaseTest;
