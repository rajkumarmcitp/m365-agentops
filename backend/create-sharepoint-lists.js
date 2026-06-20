/**
 * Create SharePoint Lists for TenantGuard
 * Run: node backend/create-sharepoint-lists.js
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

async function createList(graphClient, displayName, description) {
  console.log(`\n📝 Creating list: ${displayName}...`)

  try {
    const listPayload = {
      displayName: displayName,
      description: description,
      list: {
        template: 'genericList'
      }
    }

    const list = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists`)
      .post(listPayload)

    console.log(`✅ List created: ${displayName}`)
    console.log(`   List ID: ${list.id}`)
    return list
  } catch (error) {
    console.error(`❌ Failed to create list ${displayName}:`, error.message)
    return null
  }
}

async function addColumn(graphClient, listId, columnName, columnType, required = false) {
  try {
    const columnPayload = {
      name: columnName,
      text: columnType === 'text' ? { allowMultipleLines: false } : undefined,
      number: columnType === 'number' ? {} : undefined,
      choice: columnType === 'choice' ? { choices: [] } : undefined,
      dateTime: columnType === 'dateTime' ? { format: 'dateTime' } : undefined,
    }

    // Remove undefined properties
    Object.keys(columnPayload).forEach(key => columnPayload[key] === undefined && delete columnPayload[key])

    const column = await graphClient
      .api(`/sites/${SHAREPOINT_SITE_ID}/lists/${listId}/columns`)
      .post(columnPayload)

    console.log(`   ✓ Added column: ${columnName}`)
    return column
  } catch (error) {
    console.error(`   ✗ Failed to add column ${columnName}:`, error.message)
  }
}

async function createAlertsColumns(graphClient, listId) {
  console.log('\n   Adding columns to Alerts list...')

  const columns = [
    { name: 'AlertID', type: 'text' },
    { name: 'Severity', type: 'choice' },
    { name: 'Priority', type: 'choice' },
    { name: 'RiskScore', type: 'number' },
    { name: 'Category', type: 'text' },
    { name: 'Description', type: 'text' },
    { name: 'Actor', type: 'text' },
    { name: 'Target', type: 'text' },
    { name: 'Source', type: 'text' },
    { name: 'ActionTimestamp', type: 'dateTime' },
    { name: 'AlertType', type: 'text' },
    { name: 'RawEvent', type: 'text' },
    { name: 'Dismissed', type: 'text' },
    { name: 'Reviewed', type: 'text' },
  ]

  for (const col of columns) {
    await addColumn(graphClient, listId, col.name, col.type)
  }
}

async function createCorrelationsColumns(graphClient, listId) {
  console.log('\n   Adding columns to Correlations list...')

  const columns = [
    { name: 'CorrelationType', type: 'text' },
    { name: 'AlertIDs', type: 'text' },
    { name: 'AlertCount', type: 'number' },
    { name: 'CorrelationScore', type: 'number' },
    { name: 'RiskLevel', type: 'choice' },
    { name: 'PatternType', type: 'text' },
    { name: 'Description', type: 'text' },
    { name: 'Actor', type: 'text' },
    { name: 'Target', type: 'text' },
    { name: 'StartTimestamp', type: 'dateTime' },
    { name: 'EndTimestamp', type: 'dateTime' },
  ]

  for (const col of columns) {
    await addColumn(graphClient, listId, col.name, col.type)
  }
}

async function createInvestigationsColumns(graphClient, listId) {
  console.log('\n   Adding columns to Investigations list...')

  const columns = [
    { name: 'UserPrincipalName', type: 'text' },
    { name: 'Status', type: 'choice' },
    { name: 'RiskLevel', type: 'choice' },
    { name: 'Description', type: 'text' },
    { name: 'Findings', type: 'text' },
    { name: 'Recommendations', type: 'text' },
    { name: 'StartedDate', type: 'dateTime' },
    { name: 'CompletedDate', type: 'dateTime' },
    { name: 'Investigator', type: 'text' },
  ]

  for (const col of columns) {
    await addColumn(graphClient, listId, col.name, col.type)
  }
}

async function main() {
  console.log('🚀 Creating SharePoint Lists for TenantGuard...\n')

  try {
    const token = await getAccessToken()
    console.log('✅ Authenticated to Microsoft Graph')

    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => token
      }
    })

    // Create Alerts List
    const alertsList = await createList(
      graphClient,
      'TenantGuard Alerts',
      'Real-time security alerts from TenantGuard monitoring'
    )

    if (alertsList) {
      await createAlertsColumns(graphClient, alertsList.id)
    }

    // Create Correlations List
    const correlationsList = await createList(
      graphClient,
      'TenantGuard Correlations',
      'Correlated alert patterns and related incidents'
    )

    if (correlationsList) {
      await createCorrelationsColumns(graphClient, correlationsList.id)
    }

    // Create Investigations List
    const investigationsList = await createList(
      graphClient,
      'TenantGuard Investigations',
      'Security incident investigations and findings'
    )

    if (investigationsList) {
      await createInvestigationsColumns(graphClient, investigationsList.id)
    }

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ SharePoint Lists Created Successfully!\n')

    if (alertsList && correlationsList && investigationsList) {
      console.log('📋 Add these to your .env file:\n')
      console.log(`SHAREPOINT_ALERTS_LIST_ID=${alertsList.id}`)
      console.log(`SHAREPOINT_CORRELATIONS_LIST_ID=${correlationsList.id}`)
      console.log(`SHAREPOINT_INVESTIGATIONS_LIST_ID=${investigationsList.id}`)
      console.log('\n' + '='.repeat(60))
    }

  } catch (error) {
    console.error('❌ Failed to create lists:', error.message)
    process.exit(1)
  }
}

main()
