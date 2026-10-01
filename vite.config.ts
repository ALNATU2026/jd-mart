import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
if (
  process.env.VITE_FIREBASE_API_KEY?.includes('.firebaseapp.com') &&
  process.env.VITE_FIREBASE_AUTH_DOMAIN?.startsWith('AIza')
) {
  const temp = process.env.VITE_FIREBASE_API_KEY;
  process.env.VITE_FIREBASE_API_KEY = process.env.VITE_FIREBASE_AUTH_DOMAIN;
  process.env.VITE_FIREBASE_AUTH_DOMAIN = temp;
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
