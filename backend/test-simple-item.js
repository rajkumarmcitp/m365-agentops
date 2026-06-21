/**
 * Test adding item with simple payload
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

async function testAddItem() {
  console.log('🧪 Testing item creation with simple payload\n')

  try {
    const token = await getAccessToken()

    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => token
      }
    })

    // Try 1: Just Title
    console.log('Try 1: Adding item with just Title...')
    try {
      const item1 = await graphClient
        .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${ALERTS_LIST_ID}/items`)
        .post({
          fields: {
            Title: 'Test Alert 1'
          }
        })
      console.log(`✅ Success! Item ID: ${item1.id}\n`)
    } catch (err) {
      console.log(`❌ Failed: ${err.message}\n`)
    }

    // Try 2: With text fields
    console.log('Try 2: Adding item with text fields...')
    try {
      const item2 = await graphClient
        .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${ALERTS_LIST_ID}/items`)
        .post({
          fields: {
            Title: 'Test Alert 2',
            AlertID: 'test-002',
            Category: 'Test',
            Description: 'Test description',
            Actor: 'System',
            Target: 'Target'
          }
        })
      console.log(`✅ Success! Item ID: ${item2.id}\n`)
    } catch (err) {
      console.log(`❌ Failed: ${err.message}\n`)
    }

    // Try 3: With number field
    console.log('Try 3: Adding item with number field...')
    try {
      const item3 = await graphClient
        .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${ALERTS_LIST_ID}/items`)
        .post({
          fields: {
            Title: 'Test Alert 3',
            RiskScore: 100
          }
        })
      console.log(`✅ Success! Item ID: ${item3.id}\n`)
    } catch (err) {
      console.log(`❌ Failed: ${err.message}\n`)
    }

    // Try 4: With boolean-like values
    console.log('Try 4: Adding item with Dismissed field...')
    try {
      const item4 = await graphClient
        .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${ALERTS_LIST_ID}/items`)
        .post({
          fields: {
            Title: 'Test Alert 4',
            Dismissed: 'No'  // Try string instead of boolean
          }
        })
      console.log(`✅ Success! Item ID: ${item4.id}\n`)
    } catch (err) {
      console.log(`❌ Failed: ${err.message}\n`)
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testAddItem()
