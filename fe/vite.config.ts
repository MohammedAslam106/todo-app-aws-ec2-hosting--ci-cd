import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],

  server: {
  proxy: {
      '/api': {
        target: 'http://localhost:5000', // Just the base URL
        // changeOrigin: true,             // Fixes the Host header
        // rewrite: (path) => path.replace(/^\/api/, '/api/v1'), // Maps /api to /api/v1
        // secure: false,                  // Set to false if using self-signed SSL/http
      }
    }
  }
})
