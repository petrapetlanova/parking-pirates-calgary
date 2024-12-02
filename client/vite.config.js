// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend API is running on port 3000
        changeOrigin: true,              // Ensures the origin is changed to the target (3000)
      
      },
    },
  },
});