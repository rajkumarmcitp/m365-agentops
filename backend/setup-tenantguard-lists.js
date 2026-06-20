/**
 * TenantGuard SharePoint Lists Setup via Graph API
 *
 * This script automatically creates all required lists and columns
 * for TenantGuard in your SharePoint site.
 *
 * Usage: node setup-tenantguard-lists.js
 */

import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js'
import dotenv from 'dotenv'

dotenv.config()

const TENANT_ID = process.env.AZURE_TENANT_ID
const CLIENT_ID = process.env.AZURE_CLIENT_ID
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET
const SHAREPOINT_SITE_URL = 'https://nasstech.sharepoint.com/sites/M365-AgentOps'

let graphClient = null

/**
 * Initialize Graph Client
 */
async function initGraphClient() {
  const credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET)
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default']
  })
  graphClient = Client.initWithMiddleware({ authProvider })
  return graphClient
}

/**
 * Get SharePoint Site ID from URL
 */
async function getSiteId() {
  try {
    console.log(`🔍 Finding SharePoint site: ${SHAREPOINT_SITE_URL}`)

    // Extract hostname and path from URL
    const url = new URL(SHAREPOINT_SITE_URL)
    const hostname = url.hostname
    const pathSegments = url.pathname.split('/').filter(s => s)

    // Path format: /sites/M365-AgentOps
    const siteName = pathSegments[pathSegments.length - 1]

    // Try method 1: Direct API with hostname:path format
    try {
      console.log(`   Trying method 1: Get site by path...`)
      const siteId = `${hostname}:/sites/${siteName}:`
      const site = await graphClient
        .api(`/sites/${siteId}`)
        .get()

      console.log(`✅ Found site: ${site.displayName}`)
      console.log(`   Site ID: ${site.id}`)
      return site.id
    } catch (error1) {
      console.log(`   Method 1 failed: ${error1.message}`)

      // Try method 2: Search by displayName
      console.log(`   Trying method 2: Search by site name...`)
      const sites = await graphClient
        .api('/sites')
        .search(`"${siteName}"`)
        .get()

      if (sites.value && sites.value.length > 0) {
        const site = sites.value[0]
        console.log(`✅ Found site: ${site.displayName}`)
        console.log(`   Site ID: ${site.id}`)
        return site.id
      }

      throw new Error(`Site not found. Verify the site exists at ${SHAREPOINT_SITE_URL}`)
    }
  } catch (error) {
    console.error('❌ Failed to get site ID:', error.message)
    throw error
  }
}

/**
 * Create a SharePoint list with columns
 */
async function createList(siteId, listName, displayName, description, columns) {
  try {
    console.log(`\n📚 Creating list: ${displayName}...`)

    // Create list
    const listPayload = {
      displayName: displayName,
      description: description,
      template: 'generic'
    }

    const listResponse = await graphClient
      .api(`/sites/${siteId}/lists`)
      .post(listPayload)

    const listId = listResponse.id
    console.log(`   ✅ List created: ${displayName} (ID: ${listId})`)

    // Create columns
    console.log(`   📝 Adding columns...`)
    for (const column of columns) {
      try {
        const columnPayload = {
          name: column.name,
          columnType: column.type,
          ...(column.required && { required: column.required }),
          ...(column.indexed && { indexed: column.indexed }),
          ...(column.type === 'choice' && {
            choice: {
              choices: column.choices,
              allowTextEntry: false
            }
          }),
          ...(column.type === 'number' && {
            number: {
              decimalPlaces: column.decimals || 0
            }
          })
        }

        await graphClient
          .api(`/sites/${siteId}/lists/${listId}/columns`)
          .post(columnPayload)

        console.log(`      ✓ ${column.name} (${column.type})`)
      } catch (colError) {
        console.log(`      ⚠️  ${column.name} - ${colError.message}`)
      }
    }

    console.log(`   ✅ List ready: ${displayName}`)
    return listId
  } catch (error) {
    console.error(`❌ Failed to create list ${displayName}:`, error.message)
    throw error
  }
}

/**
 * Main setup function
 */
async function setup() {
  try {
    console.log('🚀 TenantGuard SharePoint Lists Setup\n')
    console.log('=' .repeat(60))

    // Initialize Graph Client
    await initGraphClient()
    console.log('✅ Connected to Azure Graph API\n')

    // Get Site ID
    const siteId = await getSiteId()
    console.log('')

    // Define lists and columns
    const lists = [
      {
        name: 'TenantGuard-Alerts',
        displayName: 'TenantGuard Alerts',
        description: 'Security alerts detected by TenantGuard',
        columns: [
          { name: 'AlertId', type: 'text', required: true, indexed: true },
          { name: 'Headline', type: 'text', required: true },
          { name: 'Description', type: 'text' },
          { name: 'Severity', type: 'choice', choices: ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'] },
          { name: 'Score', type: 'number', decimals: 0 },
          { name: 'Type', type: 'choice', choices: ['ADMIN', 'EXCHANGE', 'SECURITY', 'APPLICATION'] },
          { name: 'Actor', type: 'text' },
          { name: 'RiskAssessment', type: 'text' },
          { name: 'Recommendations', type: 'text' },
          { name: 'Dismissed', type: 'boolean' },
          { name: 'CreatedTime', type: 'dateTime' }
        ]
      },
      {
        name: 'TenantGuard-Correlations',
        displayName: 'TenantGuard Correlations',
        description: 'Alert correlations and attack patterns',
        columns: [
          { name: 'CorrelationId', type: 'text', required: true, indexed: true },
          { name: 'Title', type: 'text', required: true },
          { name: 'Description', type: 'text' },
          { name: 'AlertCount', type: 'number' },
          { name: 'Severity', type: 'choice', choices: ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'] },
          { name: 'ConfidenceScore', type: 'number', decimals: 0 },
          { name: 'PatternType', type: 'text' },
          { name: 'RelatedAlerts', type: 'text' }
        ]
      },
      {
        name: 'TenantGuard-Investigations',
        displayName: 'TenantGuard Investigations',
        description: 'AI-powered security investigations',
        columns: [
          { name: 'InvestigationId', type: 'text', required: true, indexed: true },
          { name: 'Title', type: 'text', required: true },
          { name: 'AlertId', type: 'text' },
          { name: 'Status', type: 'choice', choices: ['Open', 'Investigating', 'Resolved'] },
          { name: 'Messages', type: 'text' },
          { name: 'CreatedTime', type: 'dateTime' }
        ]
      }
    ]

    // Create all lists
    const listIds = {}
    for (const list of lists) {
      const listId = await createList(siteId, list.name, list.displayName, list.description, list.columns)
      listIds[list.name] = listId
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ SETUP COMPLETE!\n')

    console.log('📋 Add these to backend/.env:\n')
    console.log('```bash')
    console.log(`SHAREPOINT_SITE_NAME=M365-AgentOps`)
    console.log(`SHAREPOINT_SITE_ID=${siteId}`)
    console.log(`SHAREPOINT_ALERTS_LIST_ID=${listIds['TenantGuard-Alerts']}`)
    console.log(`SHAREPOINT_CORRELATIONS_LIST_ID=${listIds['TenantGuard-Correlations']}`)
    console.log(`SHAREPOINT_INVESTIGATIONS_LIST_ID=${listIds['TenantGuard-Investigations']}`)
    console.log('```\n')

    console.log('🔗 SharePoint Site: ' + SHAREPOINT_SITE_URL)
    console.log('\n📊 Lists Created:')
    console.log(`   ✅ TenantGuard-Alerts`)
    console.log(`   ✅ TenantGuard-Correlations`)
    console.log(`   ✅ TenantGuard-Investigations`)

    console.log('\n🚀 Next Steps:')
    console.log('   1. Copy the values above to backend/.env')
    console.log('   2. Restart backend server: npm run dev')
    console.log('   3. Backend will automatically connect to SharePoint')
    console.log('   4. TenantGuard page will start using SharePoint lists\n')

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
    process.exit(1)
  }
}

// Run setup
setup()
