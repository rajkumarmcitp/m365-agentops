/**
 * Get SharePoint Site Information
 * Shows which SharePoint site is being used for TenantGuard
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

async function getSiteInfo() {
  console.log('🔍 Retrieving SharePoint Site Information...\n')

  try {
    const token = await getAccessToken()

    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => token
      }
    })

    const site = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}`)
      .get()

    console.log('✅ SharePoint Site Found:\n')
    console.log('📍 Site Details:')
    console.log(`   Name: ${site.displayName}`)
    console.log(`   Web URL: ${site.webUrl}`)
    console.log(`   Site ID: ${site.id}`)
    console.log(`   Created: ${new Date(site.createdDateTime).toLocaleDateString()}`)

    console.log('\n📋 TenantGuard Lists:')
    console.log(`   • TenantGuard Alerts`)
    console.log(`   • TenantGuard Correlations`)
    console.log(`   • TenantGuard Investigations`)

    console.log('\n🔗 Access URL:')
    console.log(`   ${site.webUrl}/Lists`)

    console.log('\n' + '='.repeat(70))
    console.log(`✅ This is the SharePoint site acting as the database for TenantGuard\n`)

  } catch (error) {
    console.error('❌ Failed to get site info:', error.message)
    process.exit(1)
  }
}

getSiteInfo()
