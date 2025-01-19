import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      server: {
        port: 5173
      },
      build: {
        outDir: 'dist'
      },
      base: '/',
      // Add this configuration to handle client-side routing
      preview: {
        port: 5173
      }
    });
