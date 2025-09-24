import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Determine backend port: use env override, else OS-based default
const backendPort: number = process.env.BACKEND_PORT
  ? Number(process.env.BACKEND_PORT)
  : (process.platform === 'win32' ? 3001 : 5001);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Use the port from the dev server log
    open: true, // Automatically open in browser
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'build', // Output directory for build files
  },
});
