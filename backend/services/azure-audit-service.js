/**
 * Azure AD Audit Log Service
 * Fetches real audit events from Microsoft Graph auditLogs API
 */

import { unifiedGraphClient } from '../lib/graph-client-unified.js'

const SEVERITY_MAP = {
  // Sign-in events
  'Sign-in activity': { category: 'Security', severity: 'info' },
  'Conditional Access policy': { category: 'Security', severity: 'warning' },
  'MFA requirement': { category: 'Security', severity: 'warning' },
  'Risk detection': { category: 'Security', severity: 'danger' },

  // User management
  'Add user': { category: 'Identity', severity: 'low' },
  'Delete user': { category: 'Identity', severity: 'warning' },
  'Update user': { category: 'Identity', severity: 'low' },
  'Reset password': { category: 'Identity', severity: 'warning' },
  'Change password': { category: 'Identity', severity: 'low' },
  'Enable account': { category: 'Identity', severity: 'low' },
  'Disable account': { category: 'Identity', severity: 'warning' },
  'Add member to group': { category: 'Identity', severity: 'low' },
  'Remove member from group': { category: 'Identity', severity: 'low' },

  // Admin actions
  'Add app': { category: 'Compliance', severity: 'warning' },
  'Update app': { category: 'Compliance', severity: 'low' },
  'Delete app': { category: 'Compliance', severity: 'warning' },
  'Add role': { category: 'Compliance', severity: 'warning' },
  'Update role': { category: 'Compliance', severity: 'warning' },
  'Delete role': { category: 'Compliance', severity: 'danger' },
  'Assign role': { category: 'Access', severity: 'warning' },
  'Remove role': { category: 'Access', severity: 'low' },

  // Policy changes
  'Password policy': { category: 'Compliance', severity: 'warning' },
  'Security policy': { category: 'Compliance', severity: 'warning' },
  'MFA policy': { category: 'Compliance', severity: 'warning' },
  'Access policy': { category: 'Compliance', severity: 'warning' },

  // Default
  'default': { category: 'Compliance', severity: 'info' }
}

export class AzureAuditService {
  /**
   * Fetch directory audit logs from Azure AD
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of logs to fetch (default: 50)
   * @param {string} options.filter - OData filter query
   * @returns {Promise<Array>} Array of formatted audit events
   */
  static async getDirectoryAudits(options = {}) {
    const { limit = 50, filter = null } = options

    try {
      let query = this.unifiedGraphClient
        .api('/auditLogs/directoryAudits')
        .top(limit)
        .orderby('createdDateTime desc')

      if (filter) {
        query = query.filter(filter)
      }

      const result = await query.get()

      return (result.value || []).map(log => this.formatAuditEvent(log, 'directory'))
    } catch (error) {
      console.error('❌ Failed to fetch directory audits:', error.message)
      if (error.statusCode === 401) {
        return {
          error: 'Unauthorized',
          message: 'Azure AD connection failed. Complete setup wizard Step 2-3 to configure Graph API.'
        }
      }
      throw error
    }
  }

  /**
   * Fetch sign-in logs from Azure AD
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of logs to fetch (default: 50)
   * @returns {Promise<Array>} Array of formatted sign-in events
   */
  static async getSignInLogs(options = {}) {
    const { limit = 50 } = options

    try {
      const result = await this.unifiedGraphClient
        .api('/auditLogs/signIns')
        .top(limit)
        .orderby('createdDateTime desc')
        .get()

      return (result.value || []).map(log => this.formatSignInEvent(log))
    } catch (error) {
      console.error('❌ Failed to fetch sign-in logs:', error.message)
      return []
    }
  }

  /**
   * Fetch provisioning logs (user/group provisioning events)
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of logs to fetch (default: 50)
   * @returns {Promise<Array>} Array of formatted provisioning events
   */
  static async getProvisioningLogs(options = {}) {
    const { limit = 50 } = options

    try {
      const result = await this.unifiedGraphClient
        .api('/auditLogs/provisioning')
        .top(limit)
        .orderby('activityDateTime desc')
        .get()

      return (result.value || []).map(log => this.formatProvisioningEvent(log))
    } catch (error) {
      console.error('❌ Failed to fetch provisioning logs:', error.message)
      return []
    }
  }

  /**
   * Fetch combined audit logs (directory + sign-in + provisioning)
   * @param {number} limit - Total number of logs to fetch across all sources
   * @returns {Promise<Array>} Combined and sorted array of audit events
   */
  static async getCombinedAuditLogs(limit = 100) {
    try {
      const [directoryLogs, signInLogs, provisioningLogs] = await Promise.all([
        this.getDirectoryAudits({ limit: Math.floor(limit * 0.5) }).catch(() => []),
        this.getSignInLogs({ limit: Math.floor(limit * 0.3) }).catch(() => []),
        this.getProvisioningLogs({ limit: Math.floor(limit * 0.2) }).catch(() => [])
      ])

      // Combine and sort by timestamp (newest first)
      const combined = [
        ...(Array.isArray(directoryLogs) ? directoryLogs : []),
        ...(Array.isArray(signInLogs) ? signInLogs : []),
        ...(Array.isArray(provisioningLogs) ? provisioningLogs : [])
      ]

      return combined
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit)
    } catch (error) {
      console.error('❌ Failed to fetch combined audit logs:', error.message)
      throw error
    }
  }

  /**
   * Format directory audit event for display
   */
  static formatAuditEvent(log, source = 'directory') {
    const timestamp = new Date(log.createdDateTime)
    const activityDisplayName = log.activityDisplayName || log.category || 'Unknown activity'

    // Determine severity and category
    const mapping = this.getSeverityMapping(activityDisplayName)

    return {
      id: log.id,
      timestamp: log.createdDateTime,
      time: this.formatTime(timestamp),
      event: activityDisplayName,
      user: log.userDisplayName || log.initiatedBy?.user?.userPrincipalName || 'System',
      category: mapping.category,
      severity: mapping.severity,
      sevCls: this.getSeverityClass(mapping.severity),
      details: {
        activityDateTime: log.createdDateTime,
        result: log.result,
        resultReason: log.resultReason,
        category: log.category,
        subcategory: log.subcategory,
        resourceDisplayName: log.resourceDisplayName,
        targetResources: log.targetResources
      },
      source
    }
  }

  /**
   * Format sign-in event for display
   */
  static formatSignInEvent(log) {
    const timestamp = new Date(log.createdDateTime)
    const status = log.status?.errorCode === 0 ? 'Sign-in successful' : 'Sign-in failed'
    const severity = log.status?.errorCode === 0 ? 'low' : 'warning'

    return {
      id: log.id,
      timestamp: log.createdDateTime,
      time: this.formatTime(timestamp),
      event: status,
      user: log.userPrincipalName || log.userDisplayName || 'Unknown user',
      category: 'Security',
      severity,
      sevCls: this.getSeverityClass(severity),
      details: {
        appId: log.appId,
        appDisplayName: log.appDisplayName,
        status: log.status,
        clientAppUsed: log.clientAppUsed,
        resourceDisplayName: log.resourceDisplayName,
        location: log.location?.city || 'Unknown'
      },
      source: 'signin'
    }
  }

  /**
   * Format provisioning event for display
   */
  static formatProvisioningEvent(log) {
    const timestamp = new Date(log.activityDateTime)
    const action = log.action || 'Provisioning action'
    const status = log.statusInfo?.status || 'Unknown'
    const severity = status.includes('Failure') || status.includes('Error') ? 'danger' : 'info'

    return {
      id: log.id,
      timestamp: log.activityDateTime,
      time: this.formatTime(timestamp),
      event: action,
      user: log.initiatedByDisplayName || 'System',
      category: 'Identity',
      severity,
      sevCls: this.getSeverityClass(severity),
      details: {
        action: log.action,
        status: status,
        statusInfo: log.statusInfo,
        servicePrincipalDisplayName: log.servicePrincipalDisplayName,
        targetIdentity: log.targetIdentity
      },
      source: 'provisioning'
    }
  }

  /**
   * Get severity mapping for activity name
   */
  static getSeverityMapping(activityName) {
    const lower = (activityName || '').toLowerCase()

    for (const [key, value] of Object.entries(SEVERITY_MAP)) {
      if (key !== 'default' && lower.includes(key.toLowerCase())) {
        return value
      }
    }

    return SEVERITY_MAP.default
  }

  /**
   * Get CSS class for severity level
   */
  static getSeverityClass(severity) {
    const classMap = {
      'info': 'info',
      'low': 'success',
      'medium': 'warning',
      'warning': 'warning',
      'danger': 'danger',
      'high': 'danger'
    }
    return classMap[severity] || 'neutral'
  }

  /**
   * Format timestamp for display
   */
  static formatTime(date) {
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(':', ':') + ' Today'
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }

  // Allow instance to use unified graph client
  static get unifiedGraphClient() {
    return unifiedGraphClient
  }
}

export default AzureAuditService
