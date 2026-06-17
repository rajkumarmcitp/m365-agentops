#!/usr/bin/env node

/**
 * Add Columns to SharePoint Lists
 * Usage: node add-list-columns.mjs <siteId> <tenantId> <clientId> <clientSecret>
 */

import fetch from 'node-fetch'

const args = process.argv.slice(2)
const siteId = args[0] || process.env.SHAREPOINT_SITE_ID
const tenantId = args[1] || process.env.GRAPH_TENANT_ID
const clientId = args[2] || process.env.GRAPH_CLIENT_ID
const clientSecret = args[3] || process.env.GRAPH_CLIENT_SECRET

if (!siteId || !tenantId || !clientId || !clientSecret) {
  console.error('❌ Missing required credentials')
  process.exit(1)
}

console.log('\n📋 Adding Columns to SharePoint Lists\n')

// Get token
async function getToken() {
  const response = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials'
      })
    }
  )
  const data = await response.json()
  return data.access_token
}

// Add single column
async function addColumn(token, siteId, listId, columnName, columnType) {
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/columns`

  const payload = {
    name: columnName,
    columnType: columnType
  }

  // Type-specific config
  if (columnType === 'choice') {
    payload.choice = {
      choices: getChoicesForColumn(columnName),
      allowMultipleSelection: false,
      displayAs: 'dropDownMenu'
    }
  } else if (columnType === 'multilineText') {
    payload.text = { allowMultipleLines: true }
  } else if (columnType === 'dateTime') {
    payload.dateTime = { format: 'dateTime' }
  } else if (columnType === 'number') {
    payload.number = { decimals: 0 }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()
    return result.id ? '✅' : '⚠️'
  } catch (err) {
    return '❌'
  }
}

function getChoicesForColumn(columnName) {
  const choices = {
    'Service': ['Exchange', 'Teams', 'SharePoint', 'M365 Groups', 'User Management', 'Other'],
    'Status': ['Submitted', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
    'Priority': ['Low', 'Normal', 'High', 'Critical'],
    'ApprovalLevel': ['Manager', 'Admin', 'Executive'],
    'Action': ['Submitted', 'Approved', 'Rejected', 'Completed', 'Commented', 'Delegated', 'Escalated']
  }
  return choices[columnName] || []
}

// List columns
const listColumns = {
  'SelfServiceRequests': {
    'id': 'd0888a4f-07e4-4ac4-bf1f-fbbc699cc15d',
    'columns': [
      ['Service', 'choice'],
      ['Operation', 'text'],
      ['Status', 'choice'],
      ['Priority', 'choice'],
      ['RequesterId', 'text'],
      ['RequesterName', 'text'],
      ['FormData', 'multilineText'],
      ['Description', 'multilineText'],
      ['CreatedDate', 'dateTime'],
      ['ApprovedDate', 'dateTime'],
      ['ApprovedBy', 'text'],
      ['RejectedDate', 'dateTime'],
      ['RejectionReason', 'multilineText'],
      ['CompletedDate', 'dateTime'],
      ['SLAHours', 'number']
    ]
  },
  'SelfServiceApprovals': {
    'id': '33b58722-8a4a-4e2f-ac1a-eacd870e9bfa',
    'columns': [
      ['RequestId', 'text'],
      ['ApproverEmail', 'text'],
      ['ApprovalLevel', 'choice'],
      ['Status', 'choice'],
      ['Comment', 'multilineText'],
      ['CreatedDate', 'dateTime'],
      ['DecidedDate', 'dateTime'],
      ['DecisionDetails', 'multilineText']
    ]
  },
  'SelfServiceAudit': {
    'id': '0b2b2304-fbbc-412a-a1d0-587e29092a21',
    'columns': [
      ['RequestId', 'text'],
      ['Action', 'choice'],
      ['Actor', 'text'],
      ['ActorEmail', 'text'],
      ['Details', 'multilineText'],
      ['Timestamp', 'dateTime'],
      ['IPAddress', 'text'],
      ['UserAgent', 'text']
    ]
  }
}

// Main
async function main() {
  try {
    const token = await getToken()
    console.log('✅ Token obtained\n')

    for (const [listName, listData] of Object.entries(listColumns)) {
      console.log(`📋 ${listName}`)
      let success = 0
      for (const [colName, colType] of listData.columns) {
        const result = await addColumn(token, siteId, listData.id, colName, colType)
        if (result === '✅') success++
        process.stdout.write(result + ' ')
      }
      console.log(`\n   ${success}/${listData.columns.length} columns\n`)
    }

    console.log('=' .repeat(60))
    console.log('✅ Column Setup Complete!')
    console.log('=' .repeat(60))
    console.log('\n📋 Lists are ready in SharePoint:\n')
    console.log('Visit: https://nasstech.sharepoint.com')
    console.log('Look for: SelfServiceRequests, SelfServiceApprovals, SelfServiceAudit\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
