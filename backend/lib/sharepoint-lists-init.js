/**
 * SharePoint Lists Auto-Initialization
 * Automatically creates and configures required lists on first run
 */

import { Client } from '@microsoft/microsoft-graph-client'

export class SharePointListsInitializer {
  constructor(graphClient) {
    this.graphClient = graphClient
  }

  /**
   * Initialize all required lists
   */
  async initializeAllLists(siteId) {
    console.log('🔧 Initializing SharePoint lists...')

    try {
      const lists = [
        {
          name: 'ZT-Validations',
          description: 'Zero Trust validation results for all controls',
          template: 'genericList'
        },
        {
          name: 'ZT-Exceptions',
          description: 'Exception and waiver records with approval workflow',
          template: 'genericList'
        },
        {
          name: 'ZT-AuditLogs',
          description: 'Comprehensive compliance audit trail',
          template: 'genericList'
        },
        {
          name: 'ZT-RiskScores',
          description: 'Risk assessment and scoring data',
          template: 'genericList'
        },
        {
          name: 'ZT-Compliance',
          description: 'Framework compliance metrics and trends',
          template: 'genericList'
        },
        {
          name: 'Privileged-Accounts',
          description: 'Monitored privileged user accounts and service principals',
          template: 'genericList'
        },
        {
          name: 'Privileged-Groups',
          description: 'Monitored privileged directory roles and groups',
          template: 'genericList'
        },
        {
          name: 'Workload-Identities-Scan',
          description: 'Historical scan results for privileged workload identities',
          template: 'genericList'
        },
        {
          name: 'Change-Log',
          description: 'Audit trail for all changes to privileged accounts, groups, and apps',
          template: 'genericList'
        },
        {
          name: 'Permissions-Audit-History',
          description: 'Historical record of application permission audits with trends',
          template: 'genericList'
        }
      ]

      const results = {}

      for (const list of lists) {
        try {
          const listId = await this.createOrGetList(siteId, list.name, list.description)
          results[list.name] = listId
          console.log(`✅ ${list.name}: ${listId}`)

          // Configure columns for each list
          await this.configureListColumns(siteId, listId, list.name)
        } catch (error) {
          console.error(`❌ Failed to initialize ${list.name}:`, error.message)
          results[list.name] = null
        }
      }

      // Store list IDs in environment for reuse
      this.storeListIds(results)

      return results
    } catch (error) {
      console.error('❌ Failed to initialize SharePoint lists:', error.message)
      throw error
    }
  }

  /**
   * Create or get existing list
   */
  async createOrGetList(siteId, listName, description) {
    try {
      // Check if list already exists
      const existingLists = await this.graphClient
        .api(`/sites/${siteId}/lists`)
        .filter(`displayName eq '${listName}'`)
        .get()

      if (existingLists.value && existingLists.value.length > 0) {
        console.log(`   └─ List already exists: ${listName}`)
        return existingLists.value[0].id
      }

      // Create new list
      const listPayload = {
        displayName: listName,
        description: description,
        template: 'genericList'
      }

      const response = await this.graphClient
        .api(`/sites/${siteId}/lists`)
        .post(listPayload)

      console.log(`   └─ Created new list: ${listName}`)
      return response.id
    } catch (error) {
      throw new Error(`Failed to create/get list ${listName}: ${error.message}`)
    }
  }

  /**
   * Configure columns for each list type
   */
  async configureListColumns(siteId, listId, listName) {
    try {
      const columnsMap = {
        'ZT-Validations': [
          { name: 'ControlID', type: 'text', required: true },
          { name: 'ControlName', type: 'text', required: true },
          { name: 'Status', type: 'choice', choices: ['pass', 'fail', 'warn'], required: true },
          { name: 'ValidationScore', type: 'number', required: false },
          { name: 'Pillar', type: 'text', required: false },
          { name: 'LastValidated', type: 'datetime', required: false },
          { name: 'GraphAPIUsed', type: 'boolean', required: false },
          { name: 'RemediationGuidance', type: 'text', required: false },
          { name: 'Severity', type: 'choice', choices: ['Critical', 'High', 'Medium', 'Low'], required: false }
        ],
        'ZT-Exceptions': [
          { name: 'ExceptionID', type: 'text', required: true },
          { name: 'ControlID', type: 'text', required: true },
          { name: 'ControlName', type: 'text', required: true },
          { name: 'Status', type: 'choice', choices: ['pending', 'approved', 'rejected', 'expired'], required: true },
          { name: 'RequestedBy', type: 'text', required: true },
          { name: 'ApprovedBy', type: 'text', required: false },
          { name: 'Priority', type: 'choice', choices: ['low', 'medium', 'high', 'critical'], required: false },
          { name: 'Reason', type: 'text', required: true },
          { name: 'BusinessJustification', type: 'text', required: false },
          { name: 'RequestedDate', type: 'datetime', required: false },
          { name: 'ApprovedDate', type: 'datetime', required: false },
          { name: 'ExpiryDate', type: 'datetime', required: false },
          { name: 'Notes', type: 'text', required: false }
        ],
        'ZT-AuditLogs': [
          { name: 'LogID', type: 'text', required: true },
          { name: 'Timestamp', type: 'datetime', required: true },
          { name: 'Action', type: 'text', required: true },
          { name: 'Actor', type: 'text', required: true },
          { name: 'ResourceID', type: 'text', required: false },
          { name: 'ResourceType', type: 'text', required: false },
          { name: 'Description', type: 'text', required: false },
          { name: 'Details', type: 'text', required: false },
          { name: 'Severity', type: 'choice', choices: ['info', 'warning', 'error'], required: false },
          { name: 'Status', type: 'choice', choices: ['success', 'failure'], required: false }
        ],
        'ZT-RiskScores': [
          { name: 'ControlID', type: 'text', required: true },
          { name: 'ControlName', type: 'text', required: true },
          { name: 'RiskScore', type: 'number', required: true },
          { name: 'RiskLevel', type: 'choice', choices: ['Critical', 'High', 'Medium', 'Low'], required: true },
          { name: 'SeverityWeight', type: 'number', required: false },
          { name: 'ImpactScore', type: 'number', required: false },
          { name: 'StatusMultiplier', type: 'number', required: false },
          { name: 'CalculatedDate', type: 'datetime', required: false },
          { name: 'Pillar', type: 'text', required: false }
        ],
        'ZT-Compliance': [
          { name: 'Framework', type: 'text', required: true },
          { name: 'CoveragePercentage', type: 'number', required: true },
          { name: 'CompliancePercentage', type: 'number', required: true },
          { name: 'ControlsPassed', type: 'number', required: false },
          { name: 'ControlsFailed', type: 'number', required: false },
          { name: 'ControlsWarning', type: 'number', required: false },
          { name: 'Status', type: 'choice', choices: ['compliant', 'non-compliant', 'review'], required: false },
          { name: 'SnapshotDate', type: 'datetime', required: false },
          { name: 'TrendDirection', type: 'choice', choices: ['improving', 'stable', 'declining'], required: false },
          { name: 'MappedControls', type: 'number', required: false }
        ],
        'Privileged-Accounts': [
          { name: 'userPrincipalName', type: 'text', required: true },
          { name: 'accountId', type: 'text', required: true },
          { name: 'risk', type: 'choice', choices: ['None', 'Low', 'Medium', 'High'], required: false },
          { name: 'tagged', type: 'choice', choices: ['Yes', 'No'], required: false },
          { name: 'roles', type: 'text', required: false },
          { name: 'mfaStatus', type: 'text', required: false },
          { name: 'isPIM', type: 'choice', choices: ['Yes', 'No'], required: false },
          { name: 'lastModified', type: 'datetime', required: false }
        ],
        'Privileged-Groups': [
          { name: 'groupId', type: 'text', required: true },
          { name: 'description', type: 'text', required: false },
          { name: 'members', type: 'number', required: false },
          { name: 'mail', type: 'text', required: false },
          { name: 'lastModified', type: 'datetime', required: false }
        ],
        'Workload-Identities-Scan': [
          { name: 'scanTimestamp', type: 'datetime', required: true },
          { name: 'totalApps', type: 'number', required: true },
          { name: 'privilegedCount', type: 'number', required: true },
          { name: 'criticalCount', type: 'number', required: false },
          { name: 'highCount', type: 'number', required: false },
          { name: 'mediumCount', type: 'number', required: false },
          { name: 'scanDurationSeconds', type: 'number', required: false },
          { name: 'status', type: 'choice', choices: ['Success', 'Running', 'Failed'], required: true },
          { name: 'errorMessage', type: 'text', required: false },
          { name: 'runBy', type: 'text', required: false }
        ],
        'Change-Log': [
          { name: 'timestamp', type: 'datetime', required: true },
          { name: 'type', type: 'choice', choices: ['Account', 'Group', 'App'], required: true },
          { name: 'action', type: 'choice', choices: ['Added', 'Removed', 'Tagged', 'Untagged', 'Password Reset', 'Member Added', 'Member Removed', 'Configuration Changed', 'Permission Added', 'Account Deleted', 'Group Deleted', 'Application Deleted', 'MFA Changed', 'Device Deleted', 'Policy Deleted', 'Service Principal Deleted'], required: true },
          { name: 'itemName', type: 'text', required: true },
          { name: 'itemId', type: 'text', required: false },
          { name: 'severity', type: 'choice', choices: ['success', 'danger', 'info', 'warning'], required: false },
          { name: 'by', type: 'text', required: false },
          { name: 'description', type: 'text', required: false }
        ],
        'Permissions-Audit-History': [
          { name: 'auditTimestamp', type: 'datetime', required: true },
          { name: 'totalApps', type: 'number', required: true },
          { name: 'criticalCount', type: 'number', required: false },
          { name: 'highCount', type: 'number', required: false },
          { name: 'mediumCount', type: 'number', required: false },
          { name: 'auditDurationSeconds', type: 'number', required: false },
          { name: 'status', type: 'choice', choices: ['Success', 'Running', 'Failed'], required: true },
          { name: 'errorMessage', type: 'text', required: false },
          { name: 'runBy', type: 'text', required: false }
        ]
      }

      const columns = columnsMap[listName] || []

      for (const column of columns) {
        try {
          await this.createColumn(siteId, listId, column)
        } catch (error) {
          // Column might already exist, continue
          if (!error.message.includes('already exists')) {
            console.warn(`   └─ Could not create column ${column.name}:`, error.message)
          }
        }
      }

      console.log(`   └─ Configured ${columns.length} columns for ${listName}`)
    } catch (error) {
      console.warn(`   └─ Warning: Could not configure columns for ${listName}:`, error.message)
    }
  }

  /**
   * Create a single column
   */
  async createColumn(siteId, listId, columnDef) {
    const columnPayload = this.buildColumnPayload(columnDef)

    return this.graphClient
      .api(`/sites/${siteId}/lists/${listId}/columns`)
      .post(columnPayload)
  }

  /**
   * Build column payload based on type
   */
  buildColumnPayload(columnDef) {
    const base = {
      name: columnDef.name,
      displayName: columnDef.name,
      required: columnDef.required || false
    }

    switch (columnDef.type) {
      case 'text':
        return {
          ...base,
          text: {}
        }
      case 'number':
        return {
          ...base,
          number: {}
        }
      case 'datetime':
        return {
          ...base,
          dateTime: { format: 'dateTime' }
        }
      case 'boolean':
        return {
          ...base,
          boolean: {}
        }
      case 'choice':
        return {
          ...base,
          choice: {
            choices: columnDef.choices || [],
            allowTextEntry: false,
            displayAs: 'dropDownMenu'
          }
        }
      default:
        return base
    }
  }

  /**
   * Store list IDs for later use
   */
  storeListIds(results) {
    // Import here to avoid circular dependency
    const fs = require('fs')
    const path = require('path')

    const envVars = {
      SHAREPOINT_ZT_VALIDATIONS_LIST_ID: results['ZT-Validations'],
      SHAREPOINT_ZT_EXCEPTIONS_LIST_ID: results['ZT-Exceptions'],
      SHAREPOINT_ZT_AUDIT_LOGS_LIST_ID: results['ZT-AuditLogs'],
      SHAREPOINT_ZT_RISK_SCORES_LIST_ID: results['ZT-RiskScores'],
      SHAREPOINT_ZT_COMPLIANCE_LIST_ID: results['ZT-Compliance'],
      SHAREPOINT_PRIVILEGED_ACCOUNTS_LIST_ID: results['Privileged-Accounts'],
      SHAREPOINT_PRIVILEGED_GROUPS_LIST_ID: results['Privileged-Groups'],
      SHAREPOINT_CHANGE_LOG_LIST_ID: results['Change-Log'],
      SHAREPOINT_PERMISSIONS_AUDIT_HISTORY_LIST_ID: results['Permissions-Audit-History']
    }

    // Update process.env for current session
    Object.assign(process.env, envVars)

    // Also update config file if it exists
    try {
      const configPath = path.join(process.cwd(), 'backend', 'sharepoint-lists-config.json')
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        // Update with new list IDs
        config.lists['Privileged-Accounts'] = results['Privileged-Accounts']
        config.lists['Privileged-Groups'] = results['Privileged-Groups']
        config.lists['Change-Log'] = results['Change-Log']
        config.lastUpdated = new Date().toISOString()
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
        console.log('✅ Updated config file with privileged accounts list IDs')
      }
    } catch (error) {
      console.warn('⚠️ Could not update config file:', error.message)
    }

    // Log for user to copy to Azure App Service Configuration
    console.log('\n📋 Add these to Azure App Service Configuration:')
    console.log('================================================')
    Object.entries(envVars).forEach(([key, value]) => {
      if (value) {
        console.log(`${key}=${value}`)
      }
    })
    console.log('================================================\n')

    return envVars
  }

  /**
   * Verify all lists are accessible
   */
  async verifyLists(siteId, listIds) {
    console.log('✓ Verifying SharePoint lists...')

    const results = {}

    for (const [name, listId] of Object.entries(listIds)) {
      if (!listId) {
        results[name] = { status: 'missing', count: 0 }
        continue
      }

      try {
        const response = await this.graphClient
          .api(`/sites/${siteId}/lists/${listId}/items?$top=1`)
          .get()

        results[name] = {
          status: 'accessible',
          count: response.value ? response.value.length : 0
        }
        console.log(`   ✓ ${name}: Accessible`)
      } catch (error) {
        results[name] = { status: 'error', error: error.message }
        console.log(`   ✗ ${name}: Error - ${error.message}`)
      }
    }

    return results
  }
}

/**
 * Initialize SharePoint lists on first run
 */
export async function initializeSharePointLists(graphClient, siteId) {
  if (!graphClient || !siteId) {
    console.log('⚠️ SharePoint not configured - skipping list initialization')
    return null
  }

  try {
    const initializer = new SharePointListsInitializer(graphClient)
    const listIds = await initializer.initializeAllLists(siteId)
    await initializer.verifyLists(siteId, listIds)
    return listIds
  } catch (error) {
    console.error('❌ Failed to initialize SharePoint lists:', error.message)
    return null
  }
}
