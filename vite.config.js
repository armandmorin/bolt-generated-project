import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Function to handle widget settings request
function handleWidgetSettings(clientKey) {
  try {
    // Read settings from localStorage-like storage
    const settings = {
      header_color: '#60a5fa',
      header_text_color: '#ffffff',
      button_color: '#2563eb',
      button_size: '64px',
      powered_by_text: 'Powered by Accessibility Widget',
      powered_by_color: '#64748b'
    };

    // Read clients data
    const clients = [
      {
        client_key: clientKey,
        status: 'active'
      }
    ];

    // Verify client exists and is active
    const client = clients.find(c => c.client_key === clientKey && c.status === 'active');
    
    if (!client) {
      return {
        status: 404,
        body: { error: 'Invalid or inactive client' }
      };
    }

    return {
      status: 200,
      body: settings
    };
  } catch (error) {
    console.error('Widget settings error:', error);
    return {
      status: 500,
      body: { error: 'Internal server error' }
    };
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/widget-settings': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          });
        },
        handle: (req, res) => {
          // Handle OPTIONS request for CORS
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return true;
          }

          // Only handle GET requests
          if (req.method !== 'GET') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return true;
          }

          // Get client key from query parameters
          const url = new URL(req.url, 'http://localhost:5173');
          const clientKey = url.searchParams.get('clientKey');

          if (!clientKey) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Client key is required' }));
            return true;
          }

          // Handle widget settings request
          const response = handleWidgetSettings(clientKey);
          res.statusCode = response.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response.body));
          return true;
        }
      }
    }
  }
});
