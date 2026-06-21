/**
 * Check SharePoint List Columns
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

async function checkColumns() {
  console.log('🔍 Checking SharePoint List Columns\n')

  try {
    const token = await getAccessToken()

    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => token
      }
    })

    // Get list columns
    const columns = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${ALERTS_LIST_ID}/columns`)
      .get()

    console.log(`📋 Columns in TenantGuard Enhanced Alerts:\n`)

    for (const col of columns.value) {
      console.log(`• ${col.name}`)
      console.log(`  Type: ${col.columnType || 'N/A'}`)
      if (col.text) console.log(`  (Text field)`)
      if (col.number) console.log(`  (Number field)`)
      if (col.choice) console.log(`  (Choice field)`)
      if (col.dateTime) console.log(`  (DateTime field)`)
      console.log()
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkColumns()
