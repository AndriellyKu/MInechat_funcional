import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/entrar': {
        target: 'https://chat-320f.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
