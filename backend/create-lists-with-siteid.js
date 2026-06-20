/**
 * Create TenantGuard SharePoint Lists using Site ID
 *
 * Usage:
 *   node create-lists-with-siteid.js b60085d7-b9c8-41a3-8789-bab376d0c84f
 *
 * Or hardcode SITE_ID below
 */

import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js'
import dotenv from 'dotenv'

dotenv.config()

const TENANT_ID = process.env.AZURE_TENANT_ID
const CLIENT_ID = process.env.AZURE_CLIENT_ID
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET

// Site ID from PowerShell command
let SITE_ID = process.argv[2] || 'b60085d7-b9c8-41a3-8789-bab376d0c84f'

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
 * Create a list with columns
 */
async function createList(listName, displayName, description, columns) {
  try {
    console.log(`\n📚 Creating list: ${displayName}...`)

    // Create list
    const listPayload = {
      displayName: displayName,
      description: description,
      template: 'generic'
    }

    const listResponse = await graphClient
      .api(`/sites/${SITE_ID}/lists`)
      .post(listPayload)

    const listId = listResponse.id
    console.log(`   ✅ List created (ID: ${listId})`)

    // Add columns
    console.log(`   📝 Adding columns...`)
    let columnCount = 0

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
              allowTextEntry: false,
              displayAs: 'dropDownMenu'
            }
          }),
          ...(column.type === 'number' && {
            number: {
              decimalPlaces: column.decimals || 0
            }
          })
        }

        await graphClient
          .api(`/sites/${SITE_ID}/lists/${listId}/columns`)
          .post(columnPayload)

        console.log(`      ✓ ${column.name}`)
        columnCount++
      } catch (colError) {
        console.log(`      ⚠️  ${column.name} - ${colError.message.substring(0, 50)}`)
      }
    }

    console.log(`   ✅ Added ${columnCount}/${columns.length} columns`)
    return listId
  } catch (error) {
    console.error(`❌ Failed to create list ${displayName}:`, error.message)
    throw error
  }
}

/**
 * Main setup
 */
async function setup() {
  try {
    console.log('🚀 TenantGuard SharePoint Lists Setup\n')
    console.log('='.repeat(60))
    console.log(`Site ID: ${SITE_ID}\n`)

    // Initialize Graph Client
    await initGraphClient()
    console.log('✅ Connected to Graph API\n')

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
      const listId = await createList(list.name, list.displayName, list.description, list.columns)
      listIds[list.name] = listId
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ SETUP COMPLETE!\n')

    console.log('📋 Add these to backend/.env:\n')
    console.log('```bash')
    console.log(`SHAREPOINT_SITE_NAME=M365-AgentOps`)
    console.log(`SHAREPOINT_SITE_ID=${SITE_ID}`)
    console.log(`SHAREPOINT_ALERTS_LIST_ID=${listIds['TenantGuard-Alerts']}`)
    console.log(`SHAREPOINT_CORRELATIONS_LIST_ID=${listIds['TenantGuard-Correlations']}`)
    console.log(`SHAREPOINT_INVESTIGATIONS_LIST_ID=${listIds['TenantGuard-Investigations']}`)
    console.log('```\n')

    console.log('📊 Lists Created:')
    console.log(`   ✅ TenantGuard-Alerts`)
    console.log(`   ✅ TenantGuard-Correlations`)
    console.log(`   ✅ TenantGuard-Investigations`)

    console.log('\n🚀 Next Steps:')
    console.log('   1. Copy the IDs above to backend/.env')
    console.log('   2. Restart backend server: npm run dev')
    console.log('   3. Backend will connect to SharePoint\n')

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
    process.exit(1)
  }
}

setup()
