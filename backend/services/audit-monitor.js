/**
 * Privileged Account Audit Monitor
 * Monitors Azure AD audit logs for changes to privileged accounts, groups, and applications
 * Automatically logs relevant activities to the Change Log SharePoint list
 */

import { getListId } from '../sharepoint-config.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export class PrivilegedAuditMonitor {
  constructor(graphClient, config = {}) {
    this.graphClient = graphClient
    this.config = {
      pollIntervalMinutes: config.pollIntervalMinutes || 5,
      maxEventsPerPoll: config.maxEventsPerPoll || 50,
      retentionDays: config.retentionDays || 90,
      ...config
    }
    this.lastCheckTime = null
    this.isRunning = false
    this.processedEventIds = new Set()
  }

  /**
   * Start the audit monitor
   */
  start() {
    if (this.isRunning) return

    this.isRunning = true
    console.log('🔍 Privileged Audit Monitor started')

    // Run immediately
    this.checkAuditLogs()

    // Then run on interval
    this.intervalId = setInterval(() => this.checkAuditLogs(), this.config.pollIntervalMinutes * 60 * 1000)
  }

  /**
   * Stop the audit monitor
   */
  stop() {
    if (this.intervalId) clearInterval(this.intervalId)
    this.isRunning = false
    console.log('⏹️ Privileged Audit Monitor stopped')
  }

  /**
   * Check audit logs for relevant activities
   */
  async checkAuditLogs() {
    try {
      if (!this.graphClient) return

      const siteId = process.env.SHAREPOINT_SITE_ID
      if (!siteId) return

      console.log('🔍 Checking Azure AD audit logs for privileged account changes...')

      // Define search criteria for relevant audit activities
      const activityFilters = [
        'Reset user password',
        'Add member to group',
        'Remove member from group',
        'Delete user',
        'Delete group',
        'Add eligible member to role',
        'Add member to role',
        'Remove eligible member from role',
        'Remove member from role',
        'Update application',
        'Update service principal',
        'Delete application',
        'Delete service principal',
        'Add app role assignment to service principal',
        'Update user',
        'Add device registration policy',
        'Update device registration policy',
        'Delete device',
        'Delete group policy'
      ]

      // Query audit logs
      const filter = `activityDateTime ge ${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()} and (${
        activityFilters.map(a => `activityDisplayName eq '${a}'`).join(' or ')
      })`

      const auditLogs = await this.graphClient
        .api('/auditLogs/directoryAudits')
        .filter(filter)
        .orderby('activityDateTime desc')
        .top(this.config.maxEventsPerPoll)
        .get()

      const events = auditLogs.value || []
      console.log(`📋 Found ${events.length} relevant audit events`)

      // Process each event
      for (const event of events) {
        try {
          // Skip if already processed
          if (this.processedEventIds.has(event.id)) continue

          const changeLogEntry = this.parseAuditEvent(event)
          if (changeLogEntry) {
            await this.logToChangeLog(changeLogEntry, siteId)
            this.processedEventIds.add(event.id)

            // Clean up old event IDs (keep last 1000)
            if (this.processedEventIds.size > 1000) {
              const idsArray = Array.from(this.processedEventIds)
              idsArray.splice(0, 500) // Remove oldest 500
              this.processedEventIds = new Set(idsArray)
            }
          }
        } catch (error) {
          console.warn(`⚠️ Error processing audit event: ${error.message}`)
        }
      }

      this.lastCheckTime = new Date().toISOString()
    } catch (error) {
      console.error('❌ Audit monitor error:', error.message)
    }
  }

  /**
   * Parse audit event and extract change log data
   */
  parseAuditEvent(event) {
    try {
      const activity = event.activityDisplayName
      const actorName = event.initiatedBy?.user?.displayName || event.initiatedBy?.app?.displayName || 'System'
      const timestamp = event.activityDateTime
      const targetName = event.targetResources?.[0]?.displayName || 'Unknown'
      const targetId = event.targetResources?.[0]?.id || ''

      // Map activity to change log action
      let type, action, severity, description

      if (activity.includes('password')) {
        type = 'Account'
        action = 'Password Reset'
        severity = 'danger'
        description = `Password reset for ${targetName} by ${actorName}`
      } else if (activity.includes('Delete user')) {
        type = 'Account'
        action = 'Account Deleted'
        severity = 'danger'
        description = `User account ${targetName} was permanently deleted by ${actorName}`
      } else if (activity.includes('Delete group') && !activity.includes('policy')) {
        type = 'Group'
        action = 'Group Deleted'
        severity = 'danger'
        description = `Group ${targetName} was permanently deleted by ${actorName}`
      } else if (activity.includes('Delete application')) {
        type = 'App'
        action = 'Application Deleted'
        severity = 'danger'
        description = `Application ${targetName} was permanently deleted by ${actorName}`
      } else if (activity.includes('Delete service principal')) {
        type = 'App'
        action = 'Service Principal Deleted'
        severity = 'danger'
        description = `Service Principal ${targetName} was permanently deleted by ${actorName}`
      } else if (activity.includes('Delete device')) {
        type = 'Account'
        action = 'Device Deleted'
        severity = 'warning'
        description = `Device ${targetName} was deleted by ${actorName}`
      } else if (activity.includes('Delete group policy')) {
        type = 'Account'
        action = 'Policy Deleted'
        severity = 'warning'
        description = `Group policy was deleted by ${actorName}`
      } else if (activity.includes('Add member to') || activity.includes('Add eligible member')) {
        type = activity.includes('role') ? 'Account' : 'Group'
        const relatedResources = event.targetResources?.length > 1 ? event.targetResources[1]?.displayName : 'Unknown'
        const isEligible = activity.includes('eligible') ? ' (eligible)' : ''
        action = 'Member Added'
        severity = 'warning'
        description = `${relatedResources} added to ${targetName}${isEligible} by ${actorName}`
      } else if (activity.includes('Remove member from') || activity.includes('Remove eligible member')) {
        type = activity.includes('role') ? 'Account' : 'Group'
        const relatedResources = event.targetResources?.length > 1 ? event.targetResources[1]?.displayName : 'Unknown'
        action = 'Member Removed'
        severity = 'warning'
        description = `${relatedResources} removed from ${targetName} by ${actorName}`
      } else if (activity.includes('Update application') || activity.includes('Update service principal')) {
        type = 'App'
        action = 'Configuration Changed'
        severity = 'info'
        const modifiedProps = event.targetResources?.[0]?.modifiedProperties || []
        const changes = modifiedProps.slice(0, 3).map(p => p.displayName).join(', ')
        description = `Application ${targetName} configuration changed by ${actorName}. Modified: ${changes || 'various properties'}`
      } else if (activity.includes('Add app role assignment')) {
        type = 'App'
        action = 'Permission Added'
        severity = 'danger'
        const appName = event.targetResources?.[0]?.displayName || 'Unknown app'
        description = `New permission assigned to ${appName} by ${actorName}`
      } else if (activity.includes('Update user')) {
        // Check if MFA or other account settings changed
        const modifiedProperties = event.targetResources?.[0]?.modifiedProperties || []
        const mfaChange = modifiedProperties.find(p => p.displayName?.includes('StrongAuthenticationPhoneAppDetail') || p.displayName?.includes('StrongAuthentication'))

        if (mfaChange) {
          type = 'Account'
          action = 'MFA Changed'
          severity = 'warning'
          description = `MFA settings changed for ${targetName} by ${actorName}`
        } else {
          type = 'Account'
          action = 'Account Updated'
          severity = 'info'
          const modifiedProps = modifiedProperties.slice(0, 2).map(p => p.displayName).join(', ')
          description = `Account ${targetName} updated by ${actorName}. Modified: ${modifiedProps || 'account properties'}`
        }
      } else {
        // Skip events we don't care about
        return null
      }

      return {
        timestamp,
        type,
        action,
        itemName: targetName,
        itemId: targetId,
        severity,
        by: `${actorName} (via Azure AD audit logs)`,
        description: description || `${action} on ${targetName}`
      }
    } catch (error) {
      console.warn(`⚠️ Error parsing audit event: ${error.message}`)
      return null
    }
  }

  /**
   * Log change to SharePoint Change Log list
   */
  async logToChangeLog(changeLogEntry, siteId) {
    try {
      const listId = getListId('Change-Log')
      if (!listId) {
        console.warn('⚠️ Change Log list not configured')
        return
      }

      // Add to SharePoint
      const result = await this.graphClient
        .api(`/sites/${siteId}/lists/${listId}/items`)
        .post({
          fields: {
            Title: `${changeLogEntry.type}: ${changeLogEntry.action}`,
            timestamp: changeLogEntry.timestamp,
            type: changeLogEntry.type,
            action: changeLogEntry.action,
            itemName: changeLogEntry.itemName,
            itemId: changeLogEntry.itemId,
            severity: changeLogEntry.severity,
            by: changeLogEntry.by,
            description: changeLogEntry.description
          }
        })

      console.log(`✅ Logged to Change Log: ${changeLogEntry.action} on ${changeLogEntry.itemName}`)
      return result
    } catch (error) {
      console.warn(`⚠️ Could not log to Change Log: ${error.message}`)
    }
  }

  /**
   * Get monitor status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastCheckTime: this.lastCheckTime,
      pollIntervalMinutes: this.config.pollIntervalMinutes,
      processedEvents: this.processedEventIds.size,
      config: this.config
    }
  }
}

/**
 * Initialize and start the audit monitor
 */
export function initializeAuditMonitor(graphClient) {
  try {
    const monitor = new PrivilegedAuditMonitor(graphClient, {
      pollIntervalMinutes: parseInt(process.env.AUDIT_MONITOR_INTERVAL_MINUTES || '5'),
      maxEventsPerPoll: parseInt(process.env.AUDIT_MONITOR_MAX_EVENTS || '50'),
      retentionDays: parseInt(process.env.AUDIT_MONITOR_RETENTION_DAYS || '90')
    })

    monitor.start()
    return monitor
  } catch (error) {
    console.error('❌ Failed to initialize audit monitor:', error.message)
    return null
  }
}

export default PrivilegedAuditMonitor
