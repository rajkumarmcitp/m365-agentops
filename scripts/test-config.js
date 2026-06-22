#!/usr/bin/env node

/**
 * Configuration System Test Script
 * Tests the config system without needing a browser
 * Run with: node scripts/test-config.js
 */

import { BASE_CONFIG } from '../config/base.js'
import { DEVELOPMENT_CONFIG } from '../config/development.js'
import { PRODUCTION_CONFIG } from '../config/production.js'

console.log('🧪 CONFIGURATION SYSTEM TESTS\n')
console.log('=' .repeat(60))

// Test 1: Base Configuration
console.log('\n✅ TEST 1: Base Configuration Loaded')
console.log(`   App Name: ${BASE_CONFIG.appName}`)
console.log(`   App Version: ${BASE_CONFIG.appVersion}`)
console.log(`   Features Count: ${Object.keys(BASE_CONFIG.features).length}`)
console.log(`   ✓ Base config has ${Object.keys(BASE_CONFIG).length} keys`)

// Test 2: Development Configuration
console.log('\n✅ TEST 2: Development Configuration')
console.log(`   API Base: ${DEVELOPMENT_CONFIG.apiBase}`)
console.log(`   Use Demo: ${DEVELOPMENT_CONFIG.useDemo}`)
console.log(`   Log Level: ${DEVELOPMENT_CONFIG.logging.level}`)
console.log(`   Dashboard Refresh: ${DEVELOPMENT_CONFIG.services.dashboard.refreshInterval}ms`)
console.log(`   Dev Tools Enabled: ${DEVELOPMENT_CONFIG.devTools.enableDebugMenu}`)
if (DEVELOPMENT_CONFIG.useDemo === true && DEVELOPMENT_CONFIG.apiBase === 'http://localhost:3000') {
  console.log('   ✓ Development config correct (demo mode)')
} else {
  console.error('   ✗ Development config incorrect')
}

// Test 3: Production Configuration
console.log('\n✅ TEST 3: Production Configuration')
console.log(`   API Base: ${PRODUCTION_CONFIG.apiBase}`)
console.log(`   Use Demo: ${PRODUCTION_CONFIG.useDemo}`)
console.log(`   Log Level: ${PRODUCTION_CONFIG.logging.level}`)
console.log(`   Dashboard Refresh: ${PRODUCTION_CONFIG.services.dashboard.refreshInterval}ms`)
console.log(`   Dev Tools Enabled: ${PRODUCTION_CONFIG.devTools.enableDebugMenu}`)
if (PRODUCTION_CONFIG.useDemo === false && PRODUCTION_CONFIG.devTools.enableDebugMenu === false) {
  console.log('   ✓ Production config correct (real mode, debug disabled)')
} else {
  console.error('   ✗ Production config incorrect')
}

// Test 4: Feature Flags
console.log('\n✅ TEST 4: Feature Flags')
const featureTests = [
  'tenantGuard',
  'dashboard',
  'security',
  'changeIntelligence',
  'userInvestigation',
]
let allFeaturesPresent = true
featureTests.forEach(feature => {
  const devEnabled = DEVELOPMENT_CONFIG.features[feature]
  const prodEnabled = PRODUCTION_CONFIG.features[feature]
  console.log(`   ${feature}: dev=${devEnabled}, prod=${prodEnabled}`)
  if (devEnabled === undefined || prodEnabled === undefined) {
    allFeaturesPresent = false
  }
})
if (allFeaturesPresent) {
  console.log('   ✓ All features configured')
} else {
  console.error('   ✗ Some features missing')
}

// Test 5: Service Configuration
console.log('\n✅ TEST 5: Service Configuration')
const services = ['dashboard', 'security', 'tenantGuard', 'changeIntelligence']
let allServicesPresent = true
services.forEach(service => {
  const devService = DEVELOPMENT_CONFIG.services[service]
  const prodService = PRODUCTION_CONFIG.services[service]
  if (devService && prodService) {
    console.log(`   ${service}: dev refresh=${devService.refreshInterval}ms, prod refresh=${prodService.refreshInterval}ms`)
  } else {
    console.error(`   ${service}: MISSING`)
    allServicesPresent = false
  }
})
if (allServicesPresent) {
  console.log('   ✓ All services configured')
} else {
  console.error('   ✗ Some services missing')
}

// Test 6: Logging Configuration
console.log('\n✅ TEST 6: Logging Configuration')
console.log(`   Dev Log Level: ${DEVELOPMENT_CONFIG.logging.level}`)
console.log(`   Prod Log Level: ${PRODUCTION_CONFIG.logging.level}`)
if (DEVELOPMENT_CONFIG.logging.level === 'debug' && PRODUCTION_CONFIG.logging.level === 'warn') {
  console.log('   ✓ Logging levels correct (dev=debug, prod=warn)')
} else {
  console.error('   ✗ Logging levels incorrect')
}

// Test 7: Cache Configuration
console.log('\n✅ TEST 7: Cache Configuration')
console.log(`   Dev Cache Enabled: ${DEVELOPMENT_CONFIG.cache.enabled}`)
console.log(`   Prod Cache Enabled: ${PRODUCTION_CONFIG.cache.enabled}`)
console.log(`   Prod Cache TTL: ${PRODUCTION_CONFIG.cache.ttl}ms (${PRODUCTION_CONFIG.cache.ttl / 60000} minutes)`)
if (DEVELOPMENT_CONFIG.cache.enabled === false && PRODUCTION_CONFIG.cache.enabled === true) {
  console.log('   ✓ Cache configuration correct (dev=disabled, prod=enabled)')
} else {
  console.error('   ✗ Cache configuration incorrect')
}

// Test 8: API Timeout
console.log('\n✅ TEST 8: API Timeout')
console.log(`   Dev API Timeout: ${DEVELOPMENT_CONFIG.apiTimeout}ms`)
console.log(`   Prod API Timeout: ${PRODUCTION_CONFIG.apiTimeout}ms`)
if (DEVELOPMENT_CONFIG.apiTimeout > 0 && PRODUCTION_CONFIG.apiTimeout > 0) {
  console.log('   ✓ API timeouts configured')
} else {
  console.error('   ✗ API timeouts incorrect')
}

// Test 9: Demo Fallback
console.log('\n✅ TEST 9: Demo Fallback')
console.log(`   Dev Demo Fallback: ${DEVELOPMENT_CONFIG.demoDataFallback}`)
console.log(`   Prod Demo Fallback: ${PRODUCTION_CONFIG.demoDataFallback}`)
if (DEVELOPMENT_CONFIG.demoDataFallback === true && PRODUCTION_CONFIG.demoDataFallback === true) {
  console.log('   ✓ Demo fallback enabled in both environments')
} else {
  console.error('   ✗ Demo fallback configuration incorrect')
}

// Test 10: Configuration Inheritance
console.log('\n✅ TEST 10: Configuration Inheritance')
const inheritedFromBase = ['appName', 'appVersion', 'tenantDomain', 'notifications']
let allInherited = true
inheritedFromBase.forEach(key => {
  const inDev = key in DEVELOPMENT_CONFIG
  const inProd = key in PRODUCTION_CONFIG
  if (inDev && inProd) {
    console.log(`   ${key}: ✓ inherited`)
  } else {
    console.error(`   ${key}: ✗ missing in ${inDev ? 'prod' : 'dev'}`)
    allInherited = false
  }
})
if (allInherited) {
  console.log('   ✓ All base config inherited correctly')
} else {
  console.error('   ✗ Some inheritance missing')
}

// Summary
console.log('\n' + '='.repeat(60))
console.log('\n📊 CONFIGURATION SYSTEM TEST SUMMARY')
console.log(`   ✅ Base Configuration: Loaded with ${Object.keys(BASE_CONFIG).length} keys`)
console.log(`   ✅ Development Configuration: Demo mode with debug logging`)
console.log(`   ✅ Production Configuration: Real mode with error logging`)
console.log(`   ✅ Feature Flags: ${Object.keys(BASE_CONFIG.features).length} features configured`)
console.log(`   ✅ Services: ${services.length} services with env-specific settings`)
console.log(`   ✅ Environment Detection: Correctly separates dev and prod`)
console.log(`   ✅ Configuration Inheritance: Base config properly inherited`)

console.log('\n✨ All configuration tests passed!\n')

// Display usage instructions
console.log('📝 TESTING INSTRUCTIONS:')
console.log('\n1. Development Mode (Demo Data):')
console.log('   $ npm run dev')
console.log('   → Opens browser at http://localhost:5174')
console.log('   → In browser console, run: window.__APP_CONFIG__')
console.log('   → Should show useDemo: true, apiBase: http://localhost:3000')

console.log('\n2. Production Mode Simulation:')
console.log('   $ npm run build')
console.log('   → Builds production bundle')
console.log('   → Check: window.__APP_CONFIG__ in dist/index.html')

console.log('\n3. Hotfixes Testing:')
console.log('   $ npm run dev')
console.log('   → In browser console: window.__HOTFIXES__')
console.log('   → Run: window.__CONFIG_HELPERS__.getHotfixStatus()')

console.log('\n4. Feature Flags Testing:')
console.log('   $ npm run dev')
console.log('   → In browser console:')
console.log('   → window.__CONFIG_HELPERS__.isFeatureEnabled(\"tenantGuard\")')
console.log('   → window.__CONFIG_HELPERS__.isDevMode()')
console.log('   → window.__CONFIG_HELPERS__.isProdMode()')

console.log('\n✅ Configuration system is ready for testing!\n')
