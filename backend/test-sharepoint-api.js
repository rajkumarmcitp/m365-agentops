/**
 * Test SharePoint API endpoints
 * Verify list IDs and API calls
 */

import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import dotenv from 'dotenv'

dotenv.config()

const TENANT_ID = process.env.AZURE_TENANT_ID
const CLIENT_ID = process.env.AZURE_CLIENT_ID
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET
const SHAREPOINT_SITE_ID = process.env.SHAREPOINT_SITE_ID
const ALERTS_LIST_ID = process.env.SHAREPOINT_ENHANCED_ALERTS_LIST_ID

async function getAccessToken() {
  const credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET)
  const token = await credential.getToken('https://graph.microsoft.com/.default')
  return token.token
}

async function testAPI() {
  console.log('🧪 Testing SharePoint API\n')
  console.log('Configuration:')
  console.log(`  Site ID: ${SHAREPOINT_SITE_ID}`)
  console.log(`  Alerts List ID: ${ALERTS_LIST_ID}\n`)

  try {
    const token = await getAccessToken()
    console.log('✅ Token acquired\n')

    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => token
      }
    })

    // Test 1: Get list
    console.log('🔍 Test 1: Accessing list...')
    try {
      const list = await graphClient
        .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${ALERTS_LIST_ID}`)
        .get()

      console.log(`✅ List found: ${list.displayName}`)
      console.log(`   ID: ${list.id}\n`)
    } catch (listError) {
      console.error(`❌ Failed to access list:`, listError.message, '\n')
    }

    // Test 2: Try to add an item
    console.log('🔍 Test 2: Adding test item to list...')
    try {
      const testItem = {
        fields: {
          Title: 'Test Alert',
          AlertID: 'test-001',
          Severity: 'CRITICAL',
          Priority: 'P1',
          RiskScore: 100,
          Category: 'Test',
          Description: 'Test item',
          Actor: 'System',
          Target: 'Test Target',
          ActionTimestamp: new Date().toISOString(),
          AlertType: 'TEST',
          Dismissed: false,
          Reviewed: false
        }
      }

      const item = await graphClient
        .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${ALERTS_LIST_ID}/items`)
        .post(testItem)

      console.log(`✅ Item created successfully`)
      console.log(`   Item ID: ${item.id}\n`)
    } catch (itemError) {
      console.error(`❌ Failed to create item:`, itemError.message, '\n')
      console.error('Full error:', itemError)
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testAPI()
