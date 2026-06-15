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
