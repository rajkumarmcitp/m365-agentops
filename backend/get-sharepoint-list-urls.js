/**
 * Get SharePoint List URLs
 * Shows direct access URLs for TenantGuard lists
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

async function getListUrls() {
  console.log('🔍 Getting SharePoint List URLs...\n')

  try {
    const token = await getAccessToken()

    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => token
      }
    })

    // Get site info
    const site = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}`)
      .get()

    // Get all lists
    const lists = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists`)
      .get()

    console.log('✅ SharePoint Site & Lists Found:\n')
    console.log(`📍 Site: ${site.displayName}`)
    console.log(`🌐 Base URL: ${site.webUrl}\n`)

    console.log('📋 TenantGuard Lists:\n')

    const tenantGuardLists = lists.value.filter(l =>
      l.displayName.includes('TenantGuard')
    )

    for (const list of tenantGuardLists) {
      const listUrl = `${site.webUrl}/Lists/${list.displayName.replace(/\s+/g, '%20')}`
      console.log(`✓ ${list.displayName}`)
      console.log(`  ID: ${list.id}`)
      console.log(`  URL: ${listUrl}`)
      console.log(`  Items: ${list.itemCount}\n`)
    }

    console.log('='.repeat(70))
    console.log('\n💡 To view the lists in SharePoint:')
    console.log('\n1. Go to: ' + site.webUrl)
    console.log('2. Click "All" in the left navigation')
    console.log('3. You will see all the TenantGuard lists\n')

  } catch (error) {
    console.error('❌ Failed to get list URLs:', error.message)
    process.exit(1)
  }
}

getListUrls()
