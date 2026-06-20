/**
 * Test Graph API Connection
 * Run this to diagnose connection issues
 *
 * Usage: node test-graph-api.js
 */

import dotenv from 'dotenv'
import { initGraphClient } from './tenantguard/graph-api-client.js'

dotenv.config()

async function testGraphAPI() {
  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║  Testing Graph API Connection                          ║')
  console.log('╚════════════════════════════════════════════════════════╝\n')

  // Check environment variables
  console.log('📋 Environment Variables:')
  console.log('─────────────────────────')
  const required = ['AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET']
  let envOk = true
  for (const key of required) {
    const value = process.env[key]
    if (value) {
      const masked = value.substring(0, 10) + '...' + value.substring(value.length - 5)
      console.log(`✅ ${key}: ${masked}`)
    } else {
      console.log(`❌ ${key}: NOT SET`)
      envOk = false
    }
  }

  if (!envOk) {
    console.log('\n❌ Missing environment variables!')
    console.log('   Please set AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET in .env')
    process.exit(1)
  }

  // Initialize Graph API
  console.log('\n🔗 Initializing Graph API Client:')
  console.log('─────────────────────────')
  try {
    const client = await initGraphClient()
    console.log('✅ Graph API client initialized')

    // Test connection
    console.log('\n🧪 Testing Graph API Connection:')
    console.log('─────────────────────────')
    try {
      const me = await client.api('/me').get()
      console.log(`✅ Connected as: ${me.displayName} (${me.userPrincipalName})`)
    } catch (error) {
      console.log('❌ Could not fetch /me')
      console.log(`   Error: ${error.message}`)
    }

    // Test root site access
    console.log('\n🏢 Testing SharePoint Site Access:')
    console.log('─────────────────────────')
    try {
      const rootSite = await client.api('/sites/root').get()
      console.log(`✅ Root site accessible: ${rootSite.displayName}`)
      console.log(`   Site ID: ${rootSite.id}`)
      console.log(`   Web URL: ${rootSite.webUrl}`)
    } catch (error) {
      console.log('❌ Could not access root site')
      console.log(`   Error: ${error.message}`)
    }

    // Test audit logs
    console.log('\n📋 Testing Audit Logs Access:')
    console.log('─────────────────────────')
    try {
      const logs = await client.api('/auditLogs/directoryAudits?$top=1').get()
      console.log(`✅ Audit logs accessible`)
      console.log(`   Found ${logs.value?.length || 0} log entries`)
    } catch (error) {
      console.log('❌ Could not access audit logs')
      console.log(`   Error: ${error.message}`)
      console.log(`   Note: This requires 'AuditLog.Read.All' permission`)
    }

    console.log('\n╔════════════════════════════════════════════════════════╗')
    console.log('║  ✅ All tests completed                                ║')
    console.log('╚════════════════════════════════════════════════════════╝\n')

  } catch (error) {
    console.log(`❌ Failed to initialize Graph API client:`)
    console.log(`   ${error.message}`)
    console.log(`\n   Troubleshooting:`)
    console.log(`   1. Check that AZURE_CLIENT_SECRET is correct`)
    console.log(`   2. Check that app registration exists in Azure AD`)
    console.log(`   3. Check that credentials have not expired`)
    process.exit(1)
  }
}

testGraphAPI().catch(error => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
