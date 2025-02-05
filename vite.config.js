import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    middleware: [
      async function widgetSettingsMiddleware(req, res, next) {
        if (req.url.startsWith('/api/widget-settings')) {
          // Set CORS headers
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.setHeader('Content-Type', 'application/json');

          // Handle preflight request
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          // Parse client key from URL
          const clientKey = new URL(req.url, 'http://localhost').searchParams.get('clientKey');
          
          if (!clientKey) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Client key is required' }));
            return;
          }

          try {
            // Get settings from localStorage
            const settings = JSON.parse(localStorage.getItem('widgetSettings') || '{}');
            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            
            // Verify client exists and is active
            const client = clients.find(c => c.client_key === clientKey && c.status === 'active');
            
            if (!client) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Invalid or inactive client' }));
              return;
            }

            // Return settings
            res.end(JSON.stringify({
              header_color: settings.headerColor || '#60a5fa',
              header_text_color: settings.headerTextColor || '#ffffff',
              button_color: settings.buttonColor || '#2563eb',
              button_size: settings.buttonSize || '64px',
              powered_by_text: settings.poweredByText || 'Powered by Accessibility Widget',
              powered_by_color: settings.poweredByColor || '#64748b'
            }));
          } catch (error) {
            console.error('Widget settings error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
          return;
        }
        next();
      }
    ]
  }
});
