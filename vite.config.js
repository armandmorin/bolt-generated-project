import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    historyApiFallback: true,
    proxy: {
      '/api/widget-settings': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => {
          const clientKey = path.split('/').pop();
          // Get settings from localStorage based on client key
          const settings = JSON.parse(localStorage.getItem('widgetSettings') || '{}');
          const clients = JSON.parse(localStorage.getItem('clients') || '[]');
          const client = clients.find(c => c.scriptKey === clientKey);
          
          if (!client || client.status !== 'active') {
            return JSON.stringify({
              error: 'Invalid or inactive client key'
            });
          }
          
          return JSON.stringify({
            headerColor: settings.headerColor || '#60a5fa',
            headerTextColor: settings.headerTextColor || '#1e293b',
            buttonColor: settings.buttonColor || '#2563eb',
            poweredByText: settings.poweredByText || 'Powered by Accessibility Widget',
            poweredByColor: settings.poweredByColor || '#64748b'
          });
        }
      }
    }
  },
  preview: {
    port: 5173
  }
});
