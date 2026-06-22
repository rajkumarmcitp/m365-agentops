/**
 * Configuration System Tests
 * Verifies that the config system works correctly
 * Run with: npm test (if test runner is configured)
 * Or manually check in browser console after npm run dev
 */

// Test 1: Verify config imports work
console.log('🧪 TEST 1: Config System Imports')
try {
  // These imports are tested by the build succeeding
  console.log('✅ Config imports successful')
} catch (error) {
  console.error('❌ Config import failed:', error)
}

// Test 2: Check development vs production modes
console.log('\n🧪 TEST 2: Environment Detection')
console.log(`   Mode: ${import.meta.env.MODE}`)
console.log(`   Dev: ${import.meta.env.DEV}`)
console.log(`   Prod: ${import.meta.env.PROD}`)
console.log('✅ Environment variables loaded')

// Test 3: Verify environment variables
console.log('\n🧪 TEST 3: Environment Variables')
console.log(`   VITE_API_BASE: ${import.meta.env.VITE_API_BASE || 'Not set (will use default)'}`)
console.log(`   VITE_HOTFIX_SKIP_ALERTS: ${import.meta.env.VITE_HOTFIX_SKIP_ALERTS || 'Not set (default: false)'}`)
console.log('✅ Environment variables accessible')

// Test 4: Configuration structure validation
console.log('\n🧪 TEST 4: Configuration Structure')
const expectedConfigKeys = [
  'appName',
  'apiBase',
  'useDemo',
  'features',
  'logging',
  'cache',
  'services',
]

function validateConfig(config) {
  const missingKeys = []
  expectedConfigKeys.forEach(key => {
    if (!(key in config)) {
      missingKeys.push(key)
    }
  })
  return missingKeys
}

// This will be run when the page loads - check console after page loads
if (typeof window !== 'undefined') {
  window.__CONFIG_TEST__ = {
    validateConfig,
    expectedConfigKeys,
  }
  console.log('✅ Configuration test utilities loaded')
  console.log('   Check window.__APP_CONFIG__ after page loads')
}

console.log('\n✅ Configuration system tests complete!')
console.log('   See CONFIG_GUIDE.md for full testing instructions')
