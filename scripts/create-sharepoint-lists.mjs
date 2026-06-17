#!/usr/bin/env node

/**
 * SharePoint Lists Setup Script
 * Creates SelfServiceRequests, SelfServiceApprovals, and SelfServiceAudit lists
 * Usage: node create-sharepoint-lists.mjs <siteId> <tenantId> <clientId> <clientSecret>
 */

import fetch from 'node-fetch'

const args = process.argv.slice(2)

if (args.length < 4) {
  console.error(`
❌ Missing required arguments!

Usage: node create-sharepoint-lists.mjs <siteId> <tenantId> <clientId> <clientSecret>

Example:
  node create-sharepoint-lists.mjs "site-123abc" "tenant-456def" "app-789ghi" "secret-xyz"

Where to find these values:
  • siteId: SharePoint site ID (or leave as "root" for root site)
  • tenantId: Azure AD tenant ID (from Azure Portal)
  • clientId: Azure AD app ID (from App Registration)
  • clientSecret: Azure AD app secret (from App Registration)

OR set environment variables:
  export SHAREPOINT_SITE_ID="site-123abc"
  export GRAPH_TENANT_ID="tenant-456def"
  export GRAPH_CLIENT_ID="app-789ghi"
  export GRAPH_CLIENT_SECRET="secret-xyz"

Then run: node create-sharepoint-lists.mjs
  `)
  process.exit(1)
}

const siteId = args[0] || process.env.SHAREPOINT_SITE_ID || 'root'
const tenantId = args[1] || process.env.GRAPH_TENANT_ID
const clientId = args[2] || process.env.GRAPH_CLIENT_ID
const clientSecret = args[3] || process.env.GRAPH_CLIENT_SECRET

if (!tenantId || !clientId || !clientSecret) {
  console.error('❌ Missing Graph API credentials!')
  process.exit(1)
}

console.log('\n🔐 SharePoint Lists Setup\n')
console.log(`Tenant: ${tenantId}`)
console.log(`Site ID: ${siteId}`)
console.log(`Client ID: ${clientId}\n`)

// ============================================================
// Get Access Token
// ============================================================

async function getAccessToken() {
  console.log('🔑 Getting access token...')

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials'
  })

  const response = await fetch(tokenUrl, {
    method: 'POST',
    body: body
  })

  const data = await response.json()

  if (!data.access_token) {
    console.error('❌ Failed to get access token:', data.error_description)
    process.exit(1)
  }

  console.log('✅ Access token obtained\n')
  return data.access_token
}

// ============================================================
// Get Site ID
// ============================================================

async function getSiteId(token) {
  if (siteId !== 'root') {
    return siteId
  }

  console.log('📍 Resolving root site...')

  const response = await fetch(
    'https://graph.microsoft.com/v1.0/sites/root',
    { headers: { Authorization: `Bearer ${token}` } }
  )

  const data = await response.json()

  if (!data.id) {
    console.error('❌ Failed to get root site:', data.error?.message)
    process.exit(1)
  }

  console.log(`✅ Root site ID: ${data.id}\n`)
  return data.id
}

// ============================================================
// List Definitions
// ============================================================

const lists = [
  {
    name: 'SelfServiceRequests',
    description: 'User submitted self-service requests',
    columns: [
      { name: 'Service', type: 'choice', choices: ['Exchange', 'Teams', 'SharePoint', 'M365 Groups', 'User Management', 'Other'] },
      { name: 'Operation', type: 'text', required: true },
      { name: 'Status', type: 'choice', choices: ['Submitted', 'Approved', 'Rejected', 'Completed', 'Cancelled'], required: true },
      { name: 'Priority', type: 'choice', choices: ['Low', 'Normal', 'High', 'Critical'] },
      { name: 'RequesterId', type: 'text', required: true },
      { name: 'RequesterName', type: 'text' },
      { name: 'FormData', type: 'note' },
      { name: 'Description', type: 'note' },
      { name: 'CreatedDate', type: 'datetime', required: true },
      { name: 'ApprovedDate', type: 'datetime' },
      { name: 'ApprovedBy', type: 'text' },
      { name: 'RejectedDate', type: 'datetime' },
      { name: 'RejectionReason', type: 'note' },
      { name: 'CompletedDate', type: 'datetime' },
      { name: 'SLAHours', type: 'number' }
    ]
  },
  {
    name: 'SelfServiceApprovals',
    description: 'Approval decisions and workflow tracking',
    columns: [
      { name: 'RequestId', type: 'text', required: true },
      { name: 'ApproverEmail', type: 'text', required: true },
      { name: 'ApprovalLevel', type: 'choice', choices: ['Manager', 'Admin', 'Executive'] },
      { name: 'Status', type: 'choice', choices: ['Pending', 'Approved', 'Rejected'], required: true },
      { name: 'Comment', type: 'note' },
      { name: 'CreatedDate', type: 'datetime', required: true },
      { name: 'DecidedDate', type: 'datetime' },
      { name: 'DecisionDetails', type: 'note' }
    ]
  },
  {
    name: 'SelfServiceAudit',
    description: 'Audit trail of all self-service actions',
    columns: [
      { name: 'RequestId', type: 'text', required: true },
      { name: 'Action', type: 'choice', choices: ['Submitted', 'Approved', 'Rejected', 'Completed', 'Commented', 'Delegated', 'Escalated'], required: true },
      { name: 'Actor', type: 'text', required: true },
      { name: 'ActorEmail', type: 'text', required: true },
      { name: 'Details', type: 'note' },
      { name: 'Timestamp', type: 'datetime', required: true },
      { name: 'IPAddress', type: 'text' },
      { name: 'UserAgent', type: 'text' }
    ]
  }
]

// ============================================================
// Create List
// ============================================================

async function createList(token, resolvedSiteId, listDef) {
  console.log(`📋 Creating list: ${listDef.name}`)

  const listUrl = `https://graph.microsoft.com/v1.0/sites/${resolvedSiteId}/lists`

  const listPayload = {
    displayName: listDef.name,
    description: listDef.description,
    template: 'genericList'
  }

  const response = await fetch(listUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(listPayload)
  })

  const data = await response.json()

  if (!data.id) {
    console.error(`   ❌ Failed to create list:`, data.error?.message)
    return null
  }

  console.log(`   ✅ List created with ID: ${data.id}`)
  return data.id
}

// ============================================================
// Create Column
// ============================================================

async function createColumn(token, resolvedSiteId, listId, column) {
  const columnUrl = `https://graph.microsoft.com/v1.0/sites/${resolvedSiteId}/lists/${listId}/columns`

  let columnPayload = {
    displayName: column.name,
    description: `${column.type} column`,
    [column.type]: {}
  }

  // Configure based on type
  if (column.type === 'choice') {
    columnPayload.choice = {
      choices: column.choices,
      allowMultipleSelection: false,
      displayAs: 'dropDownMenu'
    }
  } else if (column.type === 'datetime') {
    columnPayload.dateTime = {
      format: 'dateTime'
    }
  } else if (column.type === 'number') {
    columnPayload.number = {
      decimals: 0
    }
  } else if (column.type === 'note') {
    columnPayload.text = {
      allowMultipleLines: true
    }
  } else if (column.type === 'text') {
    columnPayload.text = {
      allowMultipleLines: false
    }
  }

  if (column.required) {
    columnPayload.required = true
  }

  try {
    const response = await fetch(columnUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(columnPayload)
    })

    const data = await response.json()

    if (data.id) {
      console.log(`     • ${column.name}: ✅`)
      return true
    } else {
      console.log(`     • ${column.name}: ⚠️  (${data.error?.message || 'Unknown error'})`)
      return false
    }
  } catch (err) {
    console.log(`     • ${column.name}: ⚠️  (${err.message})`)
    return false
  }
}

// ============================================================
// Main Execution
// ============================================================

async function main() {
  try {
    const token = await getAccessToken()
    const resolvedSiteId = await getSiteId(token)

    console.log('📊 Creating SharePoint Lists...\n')

    for (const listDef of lists) {
      const listId = await createList(token, resolvedSiteId, listDef)

      if (!listId) {
        console.error(`\n❌ Failed to create ${listDef.name}`)
        continue
      }

      console.log(`   Adding columns...`)
      let successCount = 0

      for (const column of listDef.columns) {
        const success = await createColumn(token, resolvedSiteId, listId, column)
        if (success) successCount++
      }

      console.log(`   ✅ ${successCount}/${listDef.columns.length} columns created\n`)
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ SharePoint Lists Setup Complete!')
    console.log('='.repeat(60))
    console.log('\nNext Steps:')
    console.log('1. Verify lists in SharePoint: https://contoso.sharepoint.com/sites/[siteName]')
    console.log('2. Set environment variables:')
    console.log(`   export SHAREPOINT_SITE_ID="${resolvedSiteId}"`)
    console.log(`   export GRAPH_TENANT_ID="${tenantId}"`)
    console.log(`   export GRAPH_CLIENT_ID="${clientId}"`)
    console.log('3. Run the backend to test connections')
    console.log('\n')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

main()
