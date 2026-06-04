import { defineConfig } from 'vite'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 600
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'https://m365ops-api.azurewebsites.net/api'
    )
  },
  plugins: [
    {
      name: 'copy-staticwebapp-config',
      writeBundle() {
        copyFileSync(
          resolve(__dirname, 'staticwebapp.config.json'),
          resolve(__dirname, 'dist', 'staticwebapp.config.json')
        )
      }
    }
  ]
})
