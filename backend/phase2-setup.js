import { initDatabase } from './tenantguard/database.js'

console.log('🔧 Setting up TenantGuard Phase 2...')

try {
  initDatabase()
  console.log('✅ Setup complete!')
  console.log('📍 Database: ./data/tenantguard.db')
  console.log('🚀 Start the server with: npm start')
  process.exit(0)
} catch (error) {
  console.error('❌ Setup failed:', error.message)
  process.exit(1)
}
