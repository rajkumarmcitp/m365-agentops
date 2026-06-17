#!/usr/bin/env node

/**
 * Add Columns to SharePoint Lists - FIXED VERSION
 * Creates all required columns with proper Graph API format
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

console.log('\n📋 Adding Columns to SharePoint Lists (FIXED)\n')

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
  if (!data.access_token) {
    throw new Error(data.error_description || 'Failed to get token')
  }
  return data.access_token
}

// Build payload for different column types
function buildColumnPayload(columnName, columnType) {
  const basePayload = {
    name: columnName,
    columnType: columnType
  }

  // Add type-specific configuration
  if (columnType === 'choice') {
    basePayload.choice = {
      choices: getChoicesForColumn(columnName),
      allowMultipleSelection: false,
      displayAs: 'dropDownMenu'
    }
  } else if (columnType === 'text') {
    basePayload.text = {
      allowMultipleLines: false
    }
  } else if (columnType === 'multilineText') {
    basePayload.text = {
      allowMultipleLines: true
    }
  } else if (columnType === 'dateTime') {
    basePayload.dateTime = {
      format: 'dateTime'
    }
  } else if (columnType === 'number') {
    basePayload.number = {
      decimals: 0
    }
  }

  return basePayload
}

// Add single column with better error handling
async function addColumn(token, siteId, listId, columnName, columnType) {
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/columns`

  const payload = buildColumnPayload(columnName, columnType)

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

    if (result.id) {
      return { success: true, id: result.id }
    } else if (result.error) {
      return { success: false, error: result.error.message }
    } else {
      return { success: false, error: 'Unknown error' }
    }
  } catch (err) {
    return { success: false, error: err.message }
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

// List columns to create
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

    const results = {}

    for (const [listName, listData] of Object.entries(listColumns)) {
      console.log(`📋 ${listName}`)
      results[listName] = { success: 0, failed: 0, details: [] }

      for (const [colName, colType] of listData.columns) {
        const result = await addColumn(token, siteId, listData.id, colName, colType)

        if (result.success) {
          results[listName].success++
          process.stdout.write('✅ ')
        } else {
          results[listName].failed++
          results[listName].details.push(`   ❌ ${colName}: ${result.error}`)
          process.stdout.write('❌ ')
        }
      }

      const total = listData.columns.length
      const percent = ((results[listName].success / total) * 100).toFixed(0)
      console.log(`\n   ${results[listName].success}/${total} columns (${percent}%)\n`)

      if (results[listName].details.length > 0) {
        results[listName].details.forEach(detail => console.log(detail))
        console.log()
      }
    }

    console.log('=' .repeat(70))
    console.log('✅ Column Setup Complete!')
    console.log('=' .repeat(70))

    // Print summary
    console.log('\n📊 Summary:')
    let totalSuccess = 0
    let totalFailed = 0

    for (const [listName, result] of Object.entries(results)) {
      totalSuccess += result.success
      totalFailed += result.failed
      const percent = ((result.success / (result.success + result.failed)) * 100).toFixed(0)
      console.log(`  ${listName}: ${result.success}/${result.success + result.failed} (${percent}%)`)
    }

    console.log(`\n  Total: ${totalSuccess} created, ${totalFailed} failed`)

    if (totalFailed > 0) {
      console.log('\n⚠️  Some columns failed to create. Check the errors above.')
      console.log('   This is often due to existing columns with the same name.')
      console.log('   You can safely ignore errors for columns that already exist.')
    } else {
      console.log('\n🎉 All columns created successfully!')
    }

    console.log('\n📋 Next step: Test the Self Service Portal')
    console.log('   Start servers: npm run dev')
    console.log('   Submit a request and verify it appears in SharePoint\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
