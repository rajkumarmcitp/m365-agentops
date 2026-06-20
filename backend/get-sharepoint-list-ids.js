/**
 * Get SharePoint List IDs for TenantGuard
 * Run: node backend/get-sharepoint-list-ids.js
 */

import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import dotenv from 'dotenv'

dotenv.config()

const TENANT_ID = process.env.AZURE_TENANT_ID
const CLIENT_ID = process.env.AZURE_CLIENT_ID
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET
const SHAREPOINT_SITE_ID = process.env.SHAREPOINT_SITE_ID

if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET || !SHAREPOINT_SITE_ID) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

async function getAccessToken() {
  const credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET)
  const token = await credential.getToken('https://graph.microsoft.com/.default')
  return token.token
}

async function getListIds() {
  console.log('🔍 Retrieving SharePoint List IDs...\n')

  try {
    const token = await getAccessToken()
    console.log('✅ Authenticated to Microsoft Graph\n')

    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => token
      }
    })

    const lists = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists`)
      .get()

    console.log('📋 Found Lists:\n')

    const listMap = {}
    for (const list of lists.value) {
      console.log(`✓ ${list.displayName}`)
      console.log(`  ID: ${list.id}\n`)
      listMap[list.displayName] = list.id
    }

    // Print configuration
    console.log('='.repeat(70))
    console.log('📝 Add these to your .env file:\n')

    if (listMap['TenantGuard Alerts']) {
      console.log(`SHAREPOINT_ALERTS_LIST_ID=${listMap['TenantGuard Alerts']}`)
    }
    if (listMap['TenantGuard Correlations']) {
      console.log(`SHAREPOINT_CORRELATIONS_LIST_ID=${listMap['TenantGuard Correlations']}`)
    }
    if (listMap['TenantGuard Investigations']) {
      console.log(`SHAREPOINT_INVESTIGATIONS_LIST_ID=${listMap['TenantGuard Investigations']}`)
    }

    console.log('\n' + '='.repeat(70))

  } catch (error) {
    console.error('❌ Failed to get list IDs:', error.message)
    process.exit(1)
  }
}

getListIds()
