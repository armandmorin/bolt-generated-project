import React, { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from '../lib/supabase';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing connection...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testSupabaseConnection();
      if (result.success) {
        setConnectionStatus('Successfully connected to Supabase!');
      } else {
        setConnectionStatus(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      setConnectionStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '40px auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginTop: 0, color: '#1e293b' }}>Supabase Connection Test</h1>
        
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          background: '#f8fafc',
          marginBottom: '20px'
        }}>
          <p style={{
            margin: 0,
            color: connectionStatus.includes('Success') ? '#16a34a' : '#dc2626'
          }}>
            <strong>Status:</strong> {connectionStatus}
          </p>
        </div>

        <button
          onClick={checkConnection}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>

        <div style={{ marginTop: '20px' }}>
          <h2>Debug Information</h2>
          <pre style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '15px',
            borderRadius: '6px',
            overflow: 'auto'
          }}>
            {`Supabase URL: ${supabase.supabaseUrl}\n`}
            {`Connection Status: ${connectionStatus}\n`}
            {`Is Loading: ${isLoading}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
