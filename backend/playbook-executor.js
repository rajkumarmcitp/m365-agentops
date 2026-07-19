/**
 * Playbook Executor
 * Executes automated response actions defined in playbooks
 */

import { logExecution, updateExecutionResult, evaluateConditions } from './playbook-service.js'

// Action handlers
const ACTION_HANDLERS = {
  'disable_user': handleDisableUser,
  'enable_user': handleEnableUser,
  'reset_password': handleResetPassword,
  'require_mfa': handleRequireMFA,
  'block_signin': handleBlockSignin,
  'revoke_session': handleRevokeSession,
  'remove_from_group': handleRemoveFromGroup,
  'reset_device': handleResetDevice,
  'disable_app': handleDisableApp,
  'revoke_token': handleRevokeToken,
  'create_alert': handleCreateAlert,
  'send_notification': handleSendNotification,
  'escalate_incident': handleEscalateIncident,
  'add_incident_note': handleAddIncidentNote
}

/**
 * Execute playbook
 */
export async function executePlaybook(playbook, trigger, alert, incident, dryRun = false) {
  try {
    console.log(`\n🎬 Executing playbook: ${playbook.name}`)
    console.log(`   Trigger: ${trigger.type}`)
    console.log(`   Dry Run: ${dryRun}`)

    // Create execution log
    const execution = logExecution({
      playbookId: playbook.id,
      playbookName: playbook.name,
      triggeredBy: trigger.source || 'system',
      incident,
      alert,
      actions: playbook.actions,
      dryRun
    })

    console.log(`   Execution ID: ${execution.id}`)

    // Evaluate conditions
    if (!evaluateConditions(playbook.conditions, alert, incident)) {
      console.log(`   ❌ Conditions not met, skipping execution`)
      updateExecutionResult(execution.id, {
        status: 'SKIPPED',
        message: 'Conditions not met'
      })
      return { success: false, reason: 'Conditions not met', executionId: execution.id }
    }

    const results = []
    let hasErrors = false

    // Execute actions sequentially
    for (const action of playbook.actions) {
      console.log(`\n   ➤ Executing action: ${action.type}`)

      try {
        const handler = ACTION_HANDLERS[action.type]
        if (!handler) {
          throw new Error(`Unknown action type: ${action.type}`)
        }

        // Execute action (or simulate if dry-run)
        const result = dryRun
          ? await simulateAction(action)
          : await handler(action.parameters, alert, incident, playbook)

        results.push({
          action: action.type,
          status: 'SUCCESS',
          timestamp: new Date().toISOString(),
          details: result
        })

        console.log(`      ✅ Success: ${result.message || 'Action executed'}`)
      } catch (error) {
        hasErrors = true

        results.push({
          action: action.type,
          status: 'FAILED',
          timestamp: new Date().toISOString(),
          error: error.message
        })

        console.log(`      ❌ Error: ${error.message}`)

        // Stop on error if required
        if (action.stopOnError !== false) {
          break
        }
      }
    }

    // Update execution result
    const finalStatus = hasErrors ? 'FAILED' : 'SUCCESS'
    updateExecutionResult(execution.id, {
      status: finalStatus,
      results
    })

    console.log(`\n   ✅ Playbook execution completed: ${finalStatus}`)

    return {
      success: !hasErrors,
      executionId: execution.id,
      status: finalStatus,
      actionCount: results.length,
      successCount: results.filter(r => r.status === 'SUCCESS').length,
      results
    }
  } catch (error) {
    console.error('Error executing playbook:', error)
    throw error
  }
}

/**
 * Simulate action (for dry-run)
 */
async function simulateAction(action) {
  return {
    message: `[DRY-RUN] ${action.type} would be executed with parameters: ${JSON.stringify(action.parameters)}`,
    simulated: true
  }
}

/**
 * Action Handlers
 */

async function handleDisableUser(params) {
  if (!params.userId) throw new Error('userId is required')
  return {
    message: `User ${params.userId} disabled`,
    action: 'disable_user',
    userId: params.userId
  }
}

async function handleEnableUser(params) {
  if (!params.userId) throw new Error('userId is required')
  return {
    message: `User ${params.userId} enabled`,
    action: 'enable_user',
    userId: params.userId
  }
}

async function handleResetPassword(params) {
  if (!params.userId) throw new Error('userId is required')
  const tempPassword = generateTemporaryPassword()
  return {
    message: `Password reset for ${params.userId}, temporary password generated`,
    action: 'reset_password',
    userId: params.userId,
    tempPassword: '***REDACTED***' // Don't log actual password
  }
}

async function handleRequireMFA(params) {
  if (!params.userId) throw new Error('userId is required')
  return {
    message: `MFA requirement enforced for ${params.userId}`,
    action: 'require_mfa',
    userId: params.userId
  }
}

async function handleBlockSignin(params) {
  if (!params.userId) throw new Error('userId is required')
  return {
    message: `Sign-in blocked for ${params.userId}`,
    action: 'block_signin',
    userId: params.userId,
    duration: params.duration || 'indefinite'
  }
}

async function handleRevokeSession(params) {
  if (!params.userId) throw new Error('userId is required')
  return {
    message: `All sessions revoked for ${params.userId}`,
    action: 'revoke_session',
    userId: params.userId
  }
}

async function handleRemoveFromGroup(params) {
  if (!params.userId || !params.groupId) throw new Error('userId and groupId are required')
  return {
    message: `User ${params.userId} removed from group ${params.groupId}`,
    action: 'remove_from_group',
    userId: params.userId,
    groupId: params.groupId
  }
}

async function handleResetDevice(params) {
  if (!params.deviceId) throw new Error('deviceId is required')
  return {
    message: `Device ${params.deviceId} reset initiated`,
    action: 'reset_device',
    deviceId: params.deviceId,
    wipe: params.wipe || false
  }
}

async function handleDisableApp(params) {
  if (!params.appId) throw new Error('appId is required')
  return {
    message: `App ${params.appId} disabled`,
    action: 'disable_app',
    appId: params.appId
  }
}

async function handleRevokeToken(params) {
  if (!params.userId) throw new Error('userId is required')
  return {
    message: `All tokens revoked for ${params.userId}`,
    action: 'revoke_token',
    userId: params.userId
  }
}

async function handleCreateAlert(params) {
  if (!params.title) throw new Error('title is required')
  return {
    message: `Alert created: ${params.title}`,
    action: 'create_alert',
    title: params.title,
    severity: params.severity || 'HIGH'
  }
}

async function handleSendNotification(params) {
  if (!params.recipient || !params.message) throw new Error('recipient and message are required')
  return {
    message: `Notification sent to ${params.recipient}`,
    action: 'send_notification',
    recipient: params.recipient,
    channel: params.channel || 'email'
  }
}

async function handleEscalateIncident(params) {
  if (!params.incidentId) throw new Error('incidentId is required')
  return {
    message: `Incident ${params.incidentId} escalated`,
    action: 'escalate_incident',
    incidentId: params.incidentId,
    level: params.level || 'HIGH'
  }
}

async function handleAddIncidentNote(params) {
  if (!params.incidentId || !params.note) throw new Error('incidentId and note are required')
  return {
    message: `Note added to incident ${params.incidentId}`,
    action: 'add_incident_note',
    incidentId: params.incidentId,
    notePreview: params.note.substring(0, 50) + '...'
  }
}

/**
 * Generate temporary password
 */
function generateTemporaryPassword() {
  const length = 16
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

/**
 * Get available actions
 */
export function getAvailableActions() {
  return Object.keys(ACTION_HANDLERS).map(type => ({
    type,
    description: getActionDescription(type),
    parameters: getActionParameters(type)
  }))
}

/**
 * Get action description
 */
function getActionDescription(actionType) {
  const descriptions = {
    'disable_user': 'Disable user account to prevent further access',
    'enable_user': 'Enable disabled user account',
    'reset_password': 'Force reset user password and generate temporary password',
    'require_mfa': 'Require multi-factor authentication for user',
    'block_signin': 'Block user sign-in temporarily or indefinitely',
    'revoke_session': 'Revoke all active sessions for user',
    'remove_from_group': 'Remove user from security group',
    'reset_device': 'Reset or wipe device remotely',
    'disable_app': 'Disable application access',
    'revoke_token': 'Revoke all authentication tokens',
    'create_alert': 'Create new alert for further investigation',
    'send_notification': 'Send notification to team members',
    'escalate_incident': 'Escalate incident priority level',
    'add_incident_note': 'Add investigation note to incident'
  }
  return descriptions[actionType] || 'Unknown action'
}

/**
 * Get action parameters
 */
function getActionParameters(actionType) {
  const paramMap = {
    'disable_user': ['userId'],
    'enable_user': ['userId'],
    'reset_password': ['userId'],
    'require_mfa': ['userId'],
    'block_signin': ['userId', 'duration'],
    'revoke_session': ['userId'],
    'remove_from_group': ['userId', 'groupId'],
    'reset_device': ['deviceId', 'wipe'],
    'disable_app': ['appId'],
    'revoke_token': ['userId'],
    'create_alert': ['title', 'severity', 'description'],
    'send_notification': ['recipient', 'message', 'channel'],
    'escalate_incident': ['incidentId', 'level'],
    'add_incident_note': ['incidentId', 'note']
  }
  return paramMap[actionType] || []
}

/**
 * Get trigger types
 */
export function getTriggerTypes() {
  return [
    {
      type: 'alert_type',
      description: 'Trigger on specific alert type',
      examples: ['impossible_travel', 'compromised_credentials', 'permission_escalation']
    },
    {
      type: 'severity_level',
      description: 'Trigger on alert severity',
      examples: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
    },
    {
      type: 'attack_pattern',
      description: 'Trigger on detected attack pattern',
      examples: ['CREDENTIAL_COMPROMISE', 'PRIVILEGE_ESCALATION', 'DATA_EXFILTRATION']
    },
    {
      type: 'incident_status',
      description: 'Trigger on incident status change',
      examples: ['NEW', 'ESCALATED']
    },
    {
      type: 'manual',
      description: 'Manual trigger via API or UI'
    }
  ]
}
