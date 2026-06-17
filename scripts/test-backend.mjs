#!/usr/bin/env node

/**
 * Test Backend Configuration
 * Verifies SharePoint Lists access and API endpoints
 */

import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

console.log('\n🧪 Testing Backend Configuration\n')

// Check environment variables
console.log('📋 Configuration Check:')
const requiredVars = [
  'GRAPH_TENANT_ID',
  'GRAPH_CLIENT_ID',
  'GRAPH_CLIENT_SECRET',
  'SHAREPOINT_SITE_ID'
]

let hasAllVars = true
requiredVars.forEach(v => {
  const value = process.env[v]
  if (!value || value.includes('YOUR_') || value === 'your') {
    console.log(`   ❌ ${v}: NOT SET`)
    hasAllVars = false
  } else {
    const display = value.length > 20 ? value.substring(0, 20) + '...' : value
    console.log(`   ✅ ${v}: ${display}`)
  }
})

if (!hasAllVars) {
  console.error('\n❌ Missing required environment variables!')
  console.error('Please update .env with your Azure credentials')
  process.exit(1)
}

// Test Graph API access
async function testGraphAccess() {
  console.log('\n🔑 Testing Graph API Access...')

  try {
    const response = await fetch(
      `https://login.microsoftonline.com/${process.env.GRAPH_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: 'POST',
        body: new URLSearchParams({
          client_id: process.env.GRAPH_CLIENT_ID,
          client_secret: process.env.GRAPH_CLIENT_SECRET,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials'
        })
      }
    )

    const data = await response.json()

    if (data.access_token) {
      console.log('   ✅ Successfully authenticated with Azure AD')
      return data.access_token
    } else {
      console.error('   ❌ Authentication failed:', data.error_description)
      return null
    }
  } catch (err) {
    console.error('   ❌ Graph API error:', err.message)
    return null
  }
}

// Test SharePoint access
async function testSharePointAccess(token) {
  console.log('\n📍 Testing SharePoint Access...')

  try {
    const siteId = process.env.SHAREPOINT_SITE_ID
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    const data = await response.json()

    if (data.id) {
      console.log('   ✅ Successfully accessed SharePoint site')
      console.log(`   ℹ️  Site: ${data.displayName || 'Root Site'}`)
      return true
    } else {
      console.error('   ❌ SharePoint access failed:', data.error?.message)
      return false
    }
  } catch (err) {
    console.error('   ❌ SharePoint error:', err.message)
    return false
  }
}

// Test SharePoint Lists
async function testSharePointLists(token) {
  console.log('\n📊 Testing SharePoint Lists...')

  const lists = [
    'SelfServiceRequests',
    'SelfServiceApprovals',
    'SelfServiceAudit'
  ]

  const siteId = process.env.SHAREPOINT_SITE_ID

  for (const listName of lists) {
    try {
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listName}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      // Try alternative: list by name
      if (response.status === 404) {
        const listResponse = await fetch(
          `https://graph.microsoft.com/v1.0/sites/${siteId}/lists?$filter=displayName eq '${listName}'`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const listData = await listResponse.json()
        if (listData.value?.length > 0) {
          console.log(`   ✅ ${listName}: Found (ID: ${listData.value[0].id})`)
        } else {
          console.log(`   ⚠️  ${listName}: Not found`)
        }
      } else {
        const data = await response.json()
        if (data.id) {
          console.log(`   ✅ ${listName}: Found (ID: ${data.id})`)
        } else {
          console.log(`   ⚠️  ${listName}: Not found`)
        }
      }
    } catch (err) {
      console.log(`   ❌ ${listName}: Error - ${err.message}`)
    }
  }
}

// Test backend endpoints (requires running server)
async function testBackendEndpoints() {
  console.log('\n🔗 Testing Backend Endpoints...')

  const baseUrl = 'http://localhost:3000'

  try {
    // Test health check
    const response = await fetch(`${baseUrl}/health`, { timeout: 5000 })
    if (response.ok) {
      console.log('   ✅ Backend server is running')
      return true
    }
  } catch (err) {
    console.log('   ⚠️  Backend server not running on port 3000')
    console.log('   ℹ️  Start the backend with: npm run dev')
    return false
  }
}

// Main
async function main() {
  const token = await testGraphAccess()

  if (!token) {
    console.error('\n❌ Cannot proceed without valid Graph API access')
    process.exit(1)
  }

  const spAccess = await testSharePointAccess(token)

  if (spAccess) {
    await testSharePointLists(token)
  }

  await testBackendEndpoints()

  console.log('\n' + '='.repeat(60))
  console.log('✅ Configuration Test Complete!')
  console.log('='.repeat(60))
  console.log('\nNext Steps:')
  console.log('1. Start the dev server: npm run dev')
  console.log('2. Test endpoints: http://localhost:3000/api/self-service/requests')
  console.log('3. Access portal: http://localhost:5173')
  console.log('\n')
}

main().catch(err => {
  console.error('❌ Test failed:', err.message)
  process.exit(1)
})
