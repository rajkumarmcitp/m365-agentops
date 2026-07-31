#!/usr/bin/env node
// ============================================================
// Populate Graph API Queries and PowerShell Commands
// Maps validation methods to actual API calls and cmdlets
// ============================================================

import 'dotenv/config'
import pkg from 'pg'

const { Client } = pkg

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'm365_agentops',
  user: process.env.DB_USER || 'vasanthipromoters',
  password: process.env.DB_PASSWORD || ''
})

// Mapping of domain/control to Graph API queries and PowerShell commands
const validationMappings = {
  'TG-ID': {
    queries: ['/users', '/groups', '/organization', '/directoryObjects', '/users/{id}'],
    commands: ['Get-AzureADUser', 'Get-AzureADGroup', 'Get-AzureADOrganization', 'Get-MgUser'],
    hybrid: ['Get-AzureADUser', '/users', 'Get-MgDirectoryObject', '/groups']
  },
  'TG-EXO': {
    queries: ['/organization/settings', '/teams', '/me/mailFolders', '/me/messages'],
    commands: ['Get-TransportRule', 'Get-TransportConfig', 'Get-ExoMailboxPermission', 'Get-ExoRecipientPermission'],
    hybrid: ['Get-ExoMailbox', '/organization', 'Get-TransportRule', '/me/mailFolders']
  },
  'TG-SPO': {
    queries: ['/sites', '/sites/{siteId}/lists', '/sites/{siteId}/drive', '/sites/{siteId}/permissions'],
    commands: ['Get-PnPSite', 'Get-PnPList', 'Get-PnPUser', 'Get-PnPUserAsAdmin'],
    hybrid: ['Get-PnPTenantSite', '/sites', 'Get-PnPListPermission', '/sites/{siteId}/lists']
  },
  'TG-APP': {
    queries: ['/servicePrincipals', '/applications', '/appRoleAssignments', '/oauth2PermissionGrants'],
    commands: ['Get-AzureADServicePrincipal', 'Get-AzureADApplication', 'Get-AzureADApplicationProxyApplication', 'Get-MgServicePrincipal'],
    hybrid: ['Get-AzureADServicePrincipal', '/servicePrincipals', 'Get-AzureADApplication', '/applications']
  },
  'TG-DEF': {
    queries: ['/security/alerts_v2', '/security/alerts', '/security/secureScores', '/deviceManagement/deviceConfigurations'],
    commands: ['Get-MgSecurityAlert', 'Get-MgSecureScore', 'Get-IntuneDeviceCompliancePolicy', 'Get-MgDeviceManagementConfiguration'],
    hybrid: ['Get-MgSecurityAlert', '/security/alerts_v2', 'Get-IntuneDeviceCompliancePolicy', '/security/secureScores']
  },
  'TG-TEAMS': {
    queries: ['/teams', '/teams/{teamId}/channels', '/teams/{teamId}/members', '/communications/callRecords'],
    commands: ['Get-Team', 'Get-TeamChannel', 'Get-TeamUser', 'Get-CsTeamsClientConfiguration'],
    hybrid: ['Get-Team', '/teams', 'Get-CsTeamsClientConfiguration', '/teams/{teamId}/channels']
  },
  'TG-AUTH': {
    queries: ['/policies/authenticationMethodsPolicy', '/policies/conditionalAccessPolicies', '/policies/homeRealmDiscoveryPolicies', '/identity/conditionalAccess/policies'],
    commands: ['Get-AzureADMSAuthenticationMethodPolicy', 'Get-AzureADMSConditionalAccessPolicy', 'Get-MgIdentityConditionalAccessPolicy', 'Get-AzureADPolicy'],
    hybrid: ['Get-AzureADMSConditionalAccessPolicy', '/policies/conditionalAccessPolicies', 'Get-MgIdentityConditionalAccessPolicy', '/identity/conditionalAccess/policies']
  },
  'TG-CA': {
    queries: ['/identity/conditionalAccess/policies', '/policies/conditionalAccessPolicies', '/identity/conditionalAccess/namedLocations', '/policies/namedLocations'],
    commands: ['Get-AzureADMSConditionalAccessPolicy', 'Get-MgIdentityConditionalAccessPolicy', 'Get-AzureADMSNamedLocationPolicy', 'Get-MgIdentityConditionalAccessNamedLocation'],
    hybrid: ['Get-AzureADMSConditionalAccessPolicy', '/identity/conditionalAccess/policies', 'Get-MgIdentityConditionalAccessNamedLocation', '/identity/conditionalAccess/namedLocations']
  },
  'TG-ROLE': {
    queries: ['/directoryRoles', '/directoryRoleTemplates', '/roleManagement/directory/roleAssignments', '/roleManagement/directory/roleDefinitions'],
    commands: ['Get-AzureADDirectoryRole', 'Get-AzureADDirectoryRoleTemplate', 'Get-AzureADUserMembership', 'Get-MgRoleManagementDirectoryRoleAssignment'],
    hybrid: ['Get-AzureADDirectoryRole', '/directoryRoles', 'Get-MgRoleManagementDirectoryRoleAssignment', '/roleManagement/directory/roleAssignments']
  },
  'TG-INT': {
    queries: ['/organization', '/deviceManagement/deviceConfigurations', '/devices', '/deviceAppManagement/managedDevices'],
    commands: ['Get-AzureADOrganization', 'Get-IntuneDeviceCompliancePolicy', 'Get-AzureADDevice', 'Get-MgDeviceManagementManagedDevice'],
    hybrid: ['Get-AzureADOrganization', '/organization', 'Get-IntuneDeviceCompliancePolicy', '/devices']
  },
  'TG-AUD': {
    queries: ['/auditLogs/directoryAudits', '/auditLogs/signIns', '/me/memberOf', '/directoryAudits'],
    commands: ['Get-AzureADAuditDirectoryLog', 'Get-AzureADAuditSignInLog', 'Get-MgAuditLogDirectoryAudit', 'Search-UnifiedAuditLog'],
    hybrid: ['Get-AzureADAuditDirectoryLog', '/auditLogs/directoryAudits', 'Get-MgAuditLogDirectoryAudit', '/auditLogs/signIns']
  },
  'TG-MON': {
    queries: ['/security/alerts_v2', '/security/alerts', '/security/secureScores', '/reports/dailyPrintUsageSummariesByUser'],
    commands: ['Get-MgSecurityAlert', 'Get-MgSecureScore', 'Get-O365ServicesUserDetail', 'Get-MgReportDailyPrintUsageSummaryByUser'],
    hybrid: ['Get-MgSecurityAlert', '/security/alerts_v2', 'Get-MgSecureScore', '/security/secureScores']
  },
  'TG-DLP': {
    queries: ['/security/informationProtection/policy', '/me/drive/items', '/sites/{siteId}/drive/items', '/security/informationProtection/threatAssessmentRequests'],
    commands: ['Get-DlpPolicy', 'Get-DlpRule', 'Get-DataClassification', 'Get-MgSecurityInformationProtectionPolicy'],
    hybrid: ['Get-DlpPolicy', '/security/informationProtection/policy', 'Get-MgSecurityInformationProtectionPolicy', '/sites/{siteId}/drive']
  },
  'TG-GOV': {
    queries: ['/organization', '/policies', '/governance/accessReviews', '/identityGovernance/lifecycleWorkflows'],
    commands: ['Get-AzureADOrganization', 'Get-AzureADPolicy', 'Get-AzureADAccessReviewScheduleDefinition', 'Get-MgIdentityGovernanceLifecycleWorkflow'],
    hybrid: ['Get-AzureADOrganization', '/organization', 'Get-MgIdentityGovernanceLifecycleWorkflow', '/identityGovernance/lifecycleWorkflows']
  },
  'TG-DEV': {
    queries: ['/applications', '/servicePrincipals', '/applications/{appId}/appRoles', '/servicePrincipals/{id}/appRoleAssignments'],
    commands: ['Get-AzureADApplication', 'Get-AzureADServicePrincipal', 'Get-AzureADApplicationProxyConnectorGroup', 'Get-MgApplication'],
    hybrid: ['Get-AzureADApplication', '/applications', 'Get-MgServicePrincipal', '/servicePrincipals']
  },
  'TG-COMP': {
    queries: ['/compliance/ediscovery/cases', '/organization', '/policies', '/teams/{teamId}/channels'],
    commands: ['Get-ComplianceSearch', 'Get-ComplianceSearchAction', 'Get-RetentionCompliancePolicy', 'Get-MgCompliance'],
    hybrid: ['Get-ComplianceSearch', '/compliance/ediscovery/cases', 'Get-RetentionCompliancePolicy', '/organization']
  },
  'TG-NET': {
    queries: ['/organization', '/devices', '/deviceManagement/deviceConfigurations', '/networkaccess/connectivity'],
    commands: ['Get-AzureADOrganization', 'Get-AzureADDevice', 'Get-NetRoute', 'Get-MgNetworkAccessConnectivity'],
    hybrid: ['Get-AzureADOrganization', '/organization', 'Get-AzureADDevice', '/devices']
  },
  'TG-BKP': {
    queries: ['/backupRestore/backupRestoreRoot', '/me/drive', '/sites/{siteId}/lists', '/teams/{teamId}/channels'],
    commands: ['Get-MgBackupRestoreBackupRestoreRoot', 'Get-MgDrive', 'Get-PnPList', 'Get-MgTeamChannel'],
    hybrid: ['Get-MgBackupRestoreBackupRestoreRoot', '/backupRestore/backupRestoreRoot', 'Get-PnPList', '/sites/{siteId}/lists']
  },
  'TG-AI': {
    queries: ['/organization/settings', '/chats', '/teams', '/servicePrincipals'],
    commands: ['Get-AzureADOrganization', 'Get-CsChatConfiguration', 'Get-Team', 'Get-MgServicePrincipal'],
    hybrid: ['Get-AzureADOrganization', '/organization/settings', 'Get-Team', '/teams']
  },
  'TG-PUR': {
    queries: ['/contracts', '/subscriptions', '/me/memberOf', '/organization'],
    commands: ['Get-AzureADContract', 'Get-AzureADSubscribedSku', 'Get-AzureADUserMembership', 'Get-MgOrganization'],
    hybrid: ['Get-AzureADContract', '/contracts', 'Get-AzureADSubscribedSku', '/subscriptions']
  }
}

async function populateValidationQueries() {
  try {
    console.log('🚀 Starting validation queries population...\n')

    await client.connect()
    console.log('✅ Connected to database\n')

    // Get all controls
    const result = await client.query(`
      SELECT id, control_id, domain, validation_method
      FROM compliance_controls
      WHERE framework = 'UCC'
      ORDER BY control_id
    `)

    console.log(`📋 Found ${result.rows.length} controls to update\n`)

    let updated = 0
    let batchSize = 50

    for (let i = 0; i < result.rows.length; i += batchSize) {
      const batch = result.rows.slice(i, i + batchSize)
      const updates = []

      for (const control of batch) {
        const domainMapping = validationMappings[control.domain] || validationMappings['TG-ID']

        let graphQueries = []
        let psCommands = []

        // Assign based on validation method
        if (control.validation_method === 'Graph API') {
          graphQueries = domainMapping.queries || []
          psCommands = []
        } else if (control.validation_method === 'PowerShell') {
          graphQueries = []
          psCommands = domainMapping.commands || []
        } else if (control.validation_method === 'Hybrid') {
          // Mix of both
          graphQueries = domainMapping.queries ? domainMapping.queries.slice(0, 2) : []
          psCommands = domainMapping.commands ? domainMapping.commands.slice(0, 2) : []
        }

        updates.push({
          id: control.id,
          graphQueries: graphQueries.length > 0 ? graphQueries : null,
          psCommands: psCommands.length > 0 ? psCommands : null
        })
      }

      // Batch update
      for (const update of updates) {
        await client.query(
          `UPDATE compliance_controls
           SET graph_api_queries = $1, powershell_commands = $2
           WHERE id = $3`,
          [
            update.graphQueries || null,
            update.psCommands || null,
            update.id
          ]
        )
        updated++
        process.stdout.write(`\r  Updated ${updated}/${result.rows.length} controls...`)
      }
    }

    console.log('\n✅ All controls updated\n')

    // Verify results
    console.log('📊 Verification:')
    const withGraphAPI = await client.query(
      `SELECT COUNT(*) as count FROM compliance_controls WHERE graph_api_queries IS NOT NULL AND framework = 'UCC'`
    )
    const withPowerShell = await client.query(
      `SELECT COUNT(*) as count FROM compliance_controls WHERE powershell_commands IS NOT NULL AND framework = 'UCC'`
    )
    const withBoth = await client.query(
      `SELECT COUNT(*) as count FROM compliance_controls WHERE graph_api_queries IS NOT NULL AND powershell_commands IS NOT NULL AND framework = 'UCC'`
    )

    console.log(`  • Controls with Graph API queries: ${withGraphAPI.rows[0].count}`)
    console.log(`  • Controls with PowerShell commands: ${withPowerShell.rows[0].count}`)
    console.log(`  • Controls with both: ${withBoth.rows[0].count}`)

    // Show sample
    const sample = await client.query(`
      SELECT control_id, domain, validation_method, graph_api_queries, powershell_commands
      FROM compliance_controls
      WHERE framework = 'UCC' AND (graph_api_queries IS NOT NULL OR powershell_commands IS NOT NULL)
      LIMIT 3
    `)

    console.log('\n📋 Sample populated controls:')
    sample.rows.forEach(row => {
      console.log(`  ${row.control_id} (${row.domain}):`)
      if (row.graph_api_queries) {
        console.log(`    • Graph API: ${row.graph_api_queries}`)
      }
      if (row.powershell_commands) {
        console.log(`    • PowerShell: ${row.powershell_commands}`)
      }
    })

    console.log('\n✨ Validation queries population complete!')

  } catch (error) {
    console.error('❌ Error during population:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

populateValidationQueries()
