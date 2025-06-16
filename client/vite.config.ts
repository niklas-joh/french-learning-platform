import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default client port
    open: true, // Automatically open in browser
  },
  build: {
    outDir: 'build', // Output directory for build files
  },
})
