// Root-level server wrapper for Azure App Service
// This ensures Node.js doesn't get confused by the hybrid setup

import('./backend/server.js').catch(err => {
  console.error('❌ Failed to start backend:', err.message)
  process.exit(1)
})
