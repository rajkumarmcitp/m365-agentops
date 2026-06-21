/**
 * Create Enhanced SharePoint Lists for TenantGuard New Design
 * Focused on P1/P2 alerts with new features (reviewed, dismissed status)
 * Run: node backend/create-tenantguard-enhanced-lists.js
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
    if (error.message.includes('already exists')) {
      console.log(`⚠️ List already exists: ${displayName}`)
      // Try to find existing list
      const lists = await graphClient
        .api(`/sites/${SHAREPOINT_SITE_ID}/lists`)
        .get()

      const existingList = lists.value.find(l => l.displayName === displayName)
      if (existingList) {
        console.log(`   Found existing List ID: ${existingList.id}`)
        return existingList
      }
    }
    console.error(`❌ Failed to create list ${displayName}:`, error.message)
    return null
  }
}

async function addColumn(graphClient, listId, columnName, columnType, required = false) {
  try {
    const columnPayload = {
      name: columnName,
      text: columnType === 'text' ? { allowMultipleLines: columnName.includes('Description') || columnName.includes('Findings') } : undefined,
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
    if (error.message.includes('already exists')) {
      console.log(`   ℹ️ Column already exists: ${columnName}`)
      return null
    }
    console.error(`   ✗ Failed to add column ${columnName}:`, error.message)
  }
}

async function createEnhancedAlertsColumns(graphClient, listId) {
  console.log('\n   Adding columns to Enhanced Alerts list...')

  const columns = [
    { name: 'AlertID', type: 'text' },
    { name: 'AlertType', type: 'choice' },
    { name: 'Severity', type: 'choice' },
    { name: 'Priority', type: 'choice' },
    { name: 'RiskScore', type: 'number' },
    { name: 'Category', type: 'text' },
    { name: 'Description', type: 'text' },
    { name: 'Actor', type: 'text' },
    { name: 'Target', type: 'text' },
    { name: 'ActionTimestamp', type: 'dateTime' },
    { name: 'Dismissed', type: 'choice' },
    { name: 'Reviewed', type: 'choice' },
    { name: 'RawEvent', type: 'text' },
  ]

  for (const col of columns) {
    await addColumn(graphClient, listId, col.name, col.type)
  }
}

async function createEnhancedCorrelationsColumns(graphClient, listId) {
  console.log('\n   Adding columns to Enhanced Correlations list...')

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

async function createEnhancedInvestigationsColumns(graphClient, listId) {
  console.log('\n   Adding columns to Enhanced Investigations list...')

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
  console.log('🚀 Creating Enhanced SharePoint Lists for TenantGuard\n')
  console.log('📌 Configuration:')
  console.log('   • Focused on P1 & P2 alerts only')
  console.log('   • Support for reviewed/dismissed status')
  console.log('   • New alert types (APP_CHANGE, ADMIN_CHANGE, etc.)')
  console.log('   • Enhanced metadata for investigations\n')

  try {
    const token = await getAccessToken()
    console.log('✅ Authenticated to Microsoft Graph')

    const graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => token
      }
    })

    // Create Enhanced Alerts List
    const alertsList = await createList(
      graphClient,
      'TenantGuard Enhanced Alerts',
      'P1/P2 priority alerts from TenantGuard Enhanced with reviewed/dismissed tracking'
    )

    if (alertsList) {
      await createEnhancedAlertsColumns(graphClient, alertsList.id)
    }

    // Create Enhanced Correlations List
    const correlationsList = await createList(
      graphClient,
      'TenantGuard Enhanced Correlations',
      'Correlated high-priority alert patterns and related incidents'
    )

    if (correlationsList) {
      await createEnhancedCorrelationsColumns(graphClient, correlationsList.id)
    }

    // Create Enhanced Investigations List
    const investigationsList = await createList(
      graphClient,
      'TenantGuard Enhanced Investigations',
      'Security incident investigations with detailed findings and recommendations'
    )

    if (investigationsList) {
      await createEnhancedInvestigationsColumns(graphClient, investigationsList.id)
    }

    // Print summary
    console.log('\n' + '='.repeat(70))
    console.log('✅ Enhanced SharePoint Lists Created Successfully!\n')

    if (alertsList && correlationsList && investigationsList) {
      console.log('📋 Add these to your .env file:\n')
      console.log(`# TenantGuard Enhanced Lists`)
      console.log(`SHAREPOINT_ENHANCED_ALERTS_LIST_ID=${alertsList.id}`)
      console.log(`SHAREPOINT_ENHANCED_CORRELATIONS_LIST_ID=${correlationsList.id}`)
      console.log(`SHAREPOINT_ENHANCED_INVESTIGATIONS_LIST_ID=${investigationsList.id}`)
      console.log('\n' + '='.repeat(70))
      console.log('\n💡 These lists store:')
      console.log('   ✓ Only P1 & P2 priority alerts')
      console.log('   ✓ Reviewed/Dismissed status')
      console.log('   ✓ New alert types (APP_CHANGE, ADMIN_CHANGE, POLICY_CHANGE)')
      console.log('   ✓ Enhanced investigation tracking\n')
    }

  } catch (error) {
    console.error('❌ Failed to create lists:', error.message)
    process.exit(1)
  }
}

main()
