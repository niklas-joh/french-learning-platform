import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Use the port from the dev server log
    open: true, // Automatically open in browser
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:3001', // The address of your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'build', // Output directory for build files
  },
})
