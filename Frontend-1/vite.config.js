import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/signup': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/login': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/refresh': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/logout': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/me': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/chat': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/conversations': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/documents': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/health': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
  };
});
