import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Dev-only proxy: frontend calls /api/*, Vite forwards to Flask
    // (avoids needing CORS changes in the backend).
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
