/**
 * Playbook Service
 * Manages automated response playbooks with execution tracking
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = join(__dirname, '..', 'data', 'playbooks')
const PLAYBOOKS_FILE = join(DATA_DIR, 'playbooks.json')
const EXECUTIONS_FILE = join(DATA_DIR, 'executions.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load playbooks from file
function loadPlaybooks() {
  ensureDataDir()
  if (fs.existsSync(PLAYBOOKS_FILE)) {
    try {
      const data = fs.readFileSync(PLAYBOOKS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading playbooks:', error)
      return {}
    }
  }
  return {}
}

// Save playbooks to file
function savePlaybooks(playbooks) {
  ensureDataDir()
  try {
    fs.writeFileSync(PLAYBOOKS_FILE, JSON.stringify(playbooks, null, 2))
  } catch (error) {
    console.error('Error saving playbooks:', error)
    throw error
  }
}

// Load execution logs
function loadExecutions() {
  ensureDataDir()
  if (fs.existsSync(EXECUTIONS_FILE)) {
    try {
      const data = fs.readFileSync(EXECUTIONS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading executions:', error)
      return []
    }
  }
  return []
}

// Save execution logs
function saveExecutions(executions) {
  ensureDataDir()
  try {
    fs.writeFileSync(EXECUTIONS_FILE, JSON.stringify(executions, null, 2))
  } catch (error) {
    console.error('Error saving executions:', error)
    throw error
  }
}

/**
 * Create a new playbook
 */
export function createPlaybook(playbookData) {
  try {
    const playbooks = loadPlaybooks()

    const playbook = {
      id: playbookData.id || `playbook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: playbookData.name || 'Untitled Playbook',
      description: playbookData.description || '',
      enabled: playbookData.enabled !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggers: playbookData.triggers || [],
      actions: playbookData.actions || [],
      conditions: playbookData.conditions || [],
      approvalRequired: playbookData.approvalRequired || false,
      dryRunOnly: playbookData.dryRunOnly || false,
      tags: playbookData.tags || [],
      executionStats: {
        total: 0,
        successful: 0,
        failed: 0,
        lastExecuted: null
      }
    }

    playbooks[playbook.id] = playbook
    savePlaybooks(playbooks)

    console.log(`✅ Created playbook: ${playbook.name} (${playbook.id})`)
    return playbook
  } catch (error) {
    console.error('Error creating playbook:', error)
    throw error
  }
}

/**
 * Get playbook by ID
 */
export function getPlaybook(playbookId) {
  try {
    const playbooks = loadPlaybooks()
    const playbook = playbooks[playbookId]
    if (!playbook) {
      throw new Error(`Playbook not found: ${playbookId}`)
    }
    return playbook
  } catch (error) {
    console.error('Error getting playbook:', error)
    throw error
  }
}

/**
 * Get all playbooks
 */
export function getAllPlaybooks() {
  try {
    const playbooks = loadPlaybooks()
    return Object.values(playbooks).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  } catch (error) {
    console.error('Error getting playbooks:', error)
    return []
  }
}

/**
 * Get playbooks by trigger type
 */
export function getPlaybooksByTrigger(triggerType) {
  try {
    const playbooks = loadPlaybooks()
    return Object.values(playbooks)
      .filter(p => p.enabled && p.triggers.some(t => t.type === triggerType))
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  } catch (error) {
    console.error('Error getting playbooks by trigger:', error)
    return []
  }
}

/**
 * Update playbook
 */
export function updatePlaybook(playbookId, updates) {
  try {
    const playbooks = loadPlaybooks()
    const playbook = playbooks[playbookId]

    if (!playbook) {
      throw new Error(`Playbook not found: ${playbookId}`)
    }

    // Update allowed fields
    if (updates.name) playbook.name = updates.name
    if (updates.description) playbook.description = updates.description
    if (updates.enabled !== undefined) playbook.enabled = updates.enabled
    if (updates.triggers) playbook.triggers = updates.triggers
    if (updates.actions) playbook.actions = updates.actions
    if (updates.conditions) playbook.conditions = updates.conditions
    if (updates.approvalRequired !== undefined) playbook.approvalRequired = updates.approvalRequired
    if (updates.dryRunOnly !== undefined) playbook.dryRunOnly = updates.dryRunOnly
    if (updates.tags) playbook.tags = updates.tags

    playbook.updatedAt = new Date().toISOString()

    savePlaybooks(playbooks)

    console.log(`✅ Updated playbook: ${playbookId}`)
    return playbook
  } catch (error) {
    console.error('Error updating playbook:', error)
    throw error
  }
}

/**
 * Enable/disable playbook
 */
export function togglePlaybook(playbookId, enabled) {
  try {
    const playbooks = loadPlaybooks()
    const playbook = playbooks[playbookId]

    if (!playbook) {
      throw new Error(`Playbook not found: ${playbookId}`)
    }

    playbook.enabled = enabled
    playbook.updatedAt = new Date().toISOString()

    savePlaybooks(playbooks)

    console.log(`✅ Playbook ${playbookId}: ${enabled ? 'ENABLED' : 'DISABLED'}`)
    return playbook
  } catch (error) {
    console.error('Error toggling playbook:', error)
    throw error
  }
}

/**
 * Delete playbook
 */
export function deletePlaybook(playbookId) {
  try {
    const playbooks = loadPlaybooks()

    if (!playbooks[playbookId]) {
      throw new Error(`Playbook not found: ${playbookId}`)
    }

    delete playbooks[playbookId]
    savePlaybooks(playbooks)

    console.log(`✅ Deleted playbook: ${playbookId}`)
    return { success: true, playbookId }
  } catch (error) {
    console.error('Error deleting playbook:', error)
    throw error
  }
}

/**
 * Log playbook execution
 */
export function logExecution(executionData) {
  try {
    const executions = loadExecutions()

    const execution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      playbookId: executionData.playbookId,
      playbookName: executionData.playbookName,
      triggeredBy: executionData.triggeredBy || 'system',
      incident: executionData.incident,
      alert: executionData.alert,
      actions: executionData.actions || [],
      results: executionData.results || [],
      status: executionData.status || 'PENDING',
      dryRun: executionData.dryRun || false,
      startedAt: new Date().toISOString(),
      completedAt: null,
      duration: 0,
      errors: executionData.errors || []
    }

    executions.push(execution)
    saveExecutions(executions)

    // Update playbook stats
    const playbooks = loadPlaybooks()
    if (playbooks[executionData.playbookId]) {
      playbooks[executionData.playbookId].executionStats.total++
      if (execution.status === 'SUCCESS') {
        playbooks[executionData.playbookId].executionStats.successful++
      } else if (execution.status === 'FAILED') {
        playbooks[executionData.playbookId].executionStats.failed++
      }
      playbooks[executionData.playbookId].executionStats.lastExecuted = execution.startedAt
      savePlaybooks(playbooks)
    }

    return execution
  } catch (error) {
    console.error('Error logging execution:', error)
    throw error
  }
}

/**
 * Update execution result
 */
export function updateExecutionResult(executionId, result) {
  try {
    const executions = loadExecutions()
    const execution = executions.find(e => e.id === executionId)

    if (!execution) {
      throw new Error(`Execution not found: ${executionId}`)
    }

    execution.status = result.status || 'COMPLETED'
    execution.results.push(result)
    execution.completedAt = new Date().toISOString()
    execution.duration = new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()

    saveExecutions(executions)

    return execution
  } catch (error) {
    console.error('Error updating execution:', error)
    throw error
  }
}

/**
 * Get execution history
 */
export function getExecutionHistory(playbookId, limit = 50) {
  try {
    const executions = loadExecutions()
    return executions
      .filter(e => !playbookId || e.playbookId === playbookId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting execution history:', error)
    return []
  }
}

/**
 * Get execution by ID
 */
export function getExecution(executionId) {
  try {
    const executions = loadExecutions()
    const execution = executions.find(e => e.id === executionId)
    if (!execution) {
      throw new Error(`Execution not found: ${executionId}`)
    }
    return execution
  } catch (error) {
    console.error('Error getting execution:', error)
    throw error
  }
}

/**
 * Get playbook execution statistics
 */
export function getPlaybookStats() {
  try {
    const playbooks = loadPlaybooks()
    const executions = loadExecutions()

    const stats = {
      totalPlaybooks: Object.keys(playbooks).length,
      enabledPlaybooks: Object.values(playbooks).filter(p => p.enabled).length,
      totalExecutions: executions.length,
      successfulExecutions: executions.filter(e => e.status === 'SUCCESS').length,
      failedExecutions: executions.filter(e => e.status === 'FAILED').length,
      dryRunExecutions: executions.filter(e => e.dryRun).length,
      averageExecutionTime: 0
    }

    if (executions.length > 0) {
      const totalTime = executions.reduce((sum, e) => sum + (e.duration || 0), 0)
      stats.averageExecutionTime = Math.round(totalTime / executions.length)
    }

    return stats
  } catch (error) {
    console.error('Error getting stats:', error)
    return {}
  }
}

/**
 * Evaluate conditions against alert/incident
 */
export function evaluateConditions(conditions, alert, incident) {
  try {
    if (!conditions || conditions.length === 0) {
      return true // No conditions means always execute
    }

    for (const condition of conditions) {
      if (!evaluateSingleCondition(condition, alert, incident)) {
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Error evaluating conditions:', error)
    return false
  }
}

/**
 * Evaluate single condition
 */
function evaluateSingleCondition(condition, alert, incident) {
  const { field, operator, value } = condition

  let fieldValue
  if (field.startsWith('alert.')) {
    fieldValue = alert?.[field.replace('alert.', '')]
  } else if (field.startsWith('incident.')) {
    fieldValue = incident?.[field.replace('incident.', '')]
  }

  switch (operator) {
    case 'equals':
      return fieldValue === value
    case 'not_equals':
      return fieldValue !== value
    case 'contains':
      return String(fieldValue).includes(value)
    case 'not_contains':
      return !String(fieldValue).includes(value)
    case 'greater_than':
      return Number(fieldValue) > Number(value)
    case 'less_than':
      return Number(fieldValue) < Number(value)
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue)
    case 'not_in':
      return Array.isArray(value) && !value.includes(fieldValue)
    default:
      return true
  }
}

/**
 * Validate playbook structure
 */
export function validatePlaybook(playbookData) {
  const errors = []

  if (!playbookData.name || playbookData.name.trim().length === 0) {
    errors.push('Playbook name is required')
  }

  if (!playbookData.triggers || playbookData.triggers.length === 0) {
    errors.push('At least one trigger is required')
  }

  if (!playbookData.actions || playbookData.actions.length === 0) {
    errors.push('At least one action is required')
  }

  for (const action of playbookData.actions || []) {
    if (!action.type) {
      errors.push('Action type is required for all actions')
    }
    if (!action.parameters) {
      errors.push('Action parameters are required for all actions')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Export playbooks
 */
export function exportPlaybooks() {
  try {
    const playbooks = loadPlaybooks()
    return {
      exportDate: new Date().toISOString(),
      playbookCount: Object.keys(playbooks).length,
      playbooks: Object.values(playbooks)
    }
  } catch (error) {
    console.error('Error exporting playbooks:', error)
    return { exportDate: new Date().toISOString(), playbooks: [], error: error.message }
  }
}

/**
 * Import playbooks
 */
export function importPlaybooks(data) {
  try {
    if (!data.playbooks || !Array.isArray(data.playbooks)) {
      throw new Error('Invalid import format')
    }

    const playbooks = loadPlaybooks()
    let importedCount = 0

    for (const playbookData of data.playbooks) {
      const playbook = {
        id: `playbook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...playbookData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const validation = validatePlaybook(playbook)
      if (validation.valid) {
        playbooks[playbook.id] = playbook
        importedCount++
      }
    }

    savePlaybooks(playbooks)

    return {
      success: true,
      importedCount,
      totalInData: data.playbooks.length
    }
  } catch (error) {
    console.error('Error importing playbooks:', error)
    throw error
  }
}
