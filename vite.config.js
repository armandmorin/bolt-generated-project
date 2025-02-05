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
          res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.setHeader('Content-Type', 'application/json');

          // Handle OPTIONS request
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          // Get client key from URL
          const clientKey = new URL(req.url, 'http://localhost').searchParams.get('clientKey');
          if (!clientKey) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Client key is required' }));
            return;
          }

          // Sample settings response
          const settings = {
            header_color: '#60a5fa',
            header_text_color: '#ffffff',
            button_color: '#2563eb',
            button_size: '64px',
            powered_by_text: 'Powered by Accessibility Widget',
            powered_by_color: '#64748b'
          };

          res.end(JSON.stringify(settings));
          return;
        }
        next();
      }
    ]
  }
});
