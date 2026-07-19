/**
 * Rules Service
 * Manages custom alert rules with persistence and versioning
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = join(__dirname, '..', 'data', 'rules')
const RULES_FILE = join(DATA_DIR, 'rules.json')
const EXECUTIONS_FILE = join(DATA_DIR, 'executions.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load rules from file
function loadRules() {
  ensureDataDir()
  if (fs.existsSync(RULES_FILE)) {
    try {
      const data = fs.readFileSync(RULES_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading rules:', error)
      return {}
    }
  }
  return {}
}

// Save rules to file
function saveRules(rules) {
  ensureDataDir()
  try {
    fs.writeFileSync(RULES_FILE, JSON.stringify(rules, null, 2))
  } catch (error) {
    console.error('Error saving rules:', error)
    throw error
  }
}

// Load executions from file
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

// Save executions to file
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
 * Create a new rule
 */
export function createRule(ruleData) {
  try {
    const rules = loadRules()

    const rule = {
      id: ruleData.id || `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: ruleData.name,
      description: ruleData.description || '',
      enabled: ruleData.enabled !== false,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: ruleData.createdBy || 'system',

      // Conditions
      conditions: ruleData.conditions || [],
      conditionLogic: ruleData.conditionLogic || 'AND',

      // Threshold
      threshold: ruleData.threshold || null,

      // Pattern detection
      pattern: ruleData.pattern || null,

      // Alert properties
      alertType: ruleData.alertType || 'custom_rule_alert',
      alertSeverity: ruleData.alertSeverity || 'MEDIUM',
      alertTitle: ruleData.alertTitle || `Alert from rule: ${ruleData.name}`,
      alertDescription: ruleData.alertDescription || '',
      alertTags: ruleData.alertTags || [],

      // Automation
      autoRemediate: ruleData.autoRemediate || false,
      remedyActions: ruleData.remedyActions || [],

      // Statistics
      statistics: {
        totalMatches: 0,
        lastMatched: null,
        alertsCreated: 0
      }
    }

    rules[rule.id] = rule
    saveRules(rules)

    console.log(`✅ Created rule: ${rule.name} (${rule.id})`)
    return rule
  } catch (error) {
    console.error('Error creating rule:', error)
    throw error
  }
}

/**
 * Get rule by ID
 */
export function getRule(ruleId) {
  try {
    const rules = loadRules()
    const rule = rules[ruleId]
    if (!rule) {
      throw new Error(`Rule not found: ${ruleId}`)
    }
    return rule
  } catch (error) {
    console.error('Error getting rule:', error)
    throw error
  }
}

/**
 * Get all rules
 */
export function getAllRules() {
  try {
    const rules = loadRules()
    return Object.values(rules).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  } catch (error) {
    console.error('Error getting rules:', error)
    return []
  }
}

/**
 * Get enabled rules only
 */
export function getEnabledRules() {
  try {
    const rules = loadRules()
    return Object.values(rules)
      .filter(r => r.enabled)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  } catch (error) {
    console.error('Error getting enabled rules:', error)
    return []
  }
}

/**
 * Update rule
 */
export function updateRule(ruleId, updates) {
  try {
    const rules = loadRules()
    const rule = rules[ruleId]

    if (!rule) {
      throw new Error(`Rule not found: ${ruleId}`)
    }

    // Update allowed fields
    if (updates.name) rule.name = updates.name
    if (updates.description !== undefined) rule.description = updates.description
    if (updates.enabled !== undefined) rule.enabled = updates.enabled
    if (updates.conditions !== undefined) rule.conditions = updates.conditions
    if (updates.conditionLogic) rule.conditionLogic = updates.conditionLogic
    if (updates.threshold !== undefined) rule.threshold = updates.threshold
    if (updates.pattern !== undefined) rule.pattern = updates.pattern
    if (updates.alertType) rule.alertType = updates.alertType
    if (updates.alertSeverity) rule.alertSeverity = updates.alertSeverity
    if (updates.alertTitle) rule.alertTitle = updates.alertTitle
    if (updates.alertDescription !== undefined) rule.alertDescription = updates.alertDescription
    if (updates.alertTags !== undefined) rule.alertTags = updates.alertTags
    if (updates.autoRemediate !== undefined) rule.autoRemediate = updates.autoRemediate
    if (updates.remedyActions !== undefined) rule.remedyActions = updates.remedyActions

    rule.version++
    rule.updatedAt = new Date().toISOString()

    saveRules(rules)

    console.log(`✅ Updated rule: ${ruleId}`)
    return rule
  } catch (error) {
    console.error('Error updating rule:', error)
    throw error
  }
}

/**
 * Toggle rule enabled/disabled
 */
export function toggleRule(ruleId, enabled) {
  try {
    const rules = loadRules()
    const rule = rules[ruleId]

    if (!rule) {
      throw new Error(`Rule not found: ${ruleId}`)
    }

    rule.enabled = enabled
    rule.updatedAt = new Date().toISOString()

    saveRules(rules)

    console.log(`✅ Rule ${ruleId}: ${enabled ? 'ENABLED' : 'DISABLED'}`)
    return rule
  } catch (error) {
    console.error('Error toggling rule:', error)
    throw error
  }
}

/**
 * Delete rule
 */
export function deleteRule(ruleId) {
  try {
    const rules = loadRules()

    if (!rules[ruleId]) {
      throw new Error(`Rule not found: ${ruleId}`)
    }

    delete rules[ruleId]
    saveRules(rules)

    console.log(`✅ Deleted rule: ${ruleId}`)
    return { success: true, ruleId }
  } catch (error) {
    console.error('Error deleting rule:', error)
    throw error
  }
}

/**
 * Log rule execution
 */
export function logExecution(executionData) {
  try {
    const executions = loadExecutions()

    const execution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ruleId: executionData.ruleId,
      ruleName: executionData.ruleName,
      alert: executionData.alert,
      matched: executionData.matched,
      matchDetails: executionData.matchDetails || {},
      generatedAlert: executionData.generatedAlert || null,
      timestamp: new Date().toISOString(),
      executionTimeMs: executionData.executionTimeMs || 0
    }

    executions.push(execution)
    saveExecutions(executions)

    // Update rule statistics
    if (executionData.matched) {
      const rules = loadRules()
      if (rules[executionData.ruleId]) {
        rules[executionData.ruleId].statistics.totalMatches++
        rules[executionData.ruleId].statistics.lastMatched = new Date().toISOString()
        if (executionData.generatedAlert) {
          rules[executionData.ruleId].statistics.alertsCreated++
        }
        saveRules(rules)
      }
    }

    return execution
  } catch (error) {
    console.error('Error logging execution:', error)
    throw error
  }
}

/**
 * Get execution history
 */
export function getExecutionHistory(ruleId, limit = 100) {
  try {
    const executions = loadExecutions()
    return executions
      .filter(e => !ruleId || e.ruleId === ruleId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
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
 * Get rule statistics
 */
export function getRuleStats() {
  try {
    const rules = loadRules()
    const executions = loadExecutions()

    const stats = {
      totalRules: Object.keys(rules).length,
      enabledRules: Object.values(rules).filter(r => r.enabled).length,
      disabledRules: Object.values(rules).filter(r => !r.enabled).length,
      totalExecutions: executions.length,
      matchedExecutions: executions.filter(e => e.matched).length,
      alertsGenerated: executions.filter(e => e.generatedAlert).length,
      averageExecutionTimeMs: 0
    }

    if (executions.length > 0) {
      const totalTime = executions.reduce((sum, e) => sum + (e.executionTimeMs || 0), 0)
      stats.averageExecutionTimeMs = Math.round(totalTime / executions.length)
    }

    return stats
  } catch (error) {
    console.error('Error getting stats:', error)
    return {}
  }
}

/**
 * Search rules
 */
export function searchRules(query) {
  try {
    const rules = loadRules()
    const lowerQuery = query.toLowerCase()

    return Object.values(rules)
      .filter(rule => {
        return (
          rule.name.toLowerCase().includes(lowerQuery) ||
          rule.description.toLowerCase().includes(lowerQuery) ||
          rule.id.includes(query)
        )
      })
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  } catch (error) {
    console.error('Error searching rules:', error)
    return []
  }
}

/**
 * Export rules
 */
export function exportRules() {
  try {
    const rules = loadRules()
    return {
      exportDate: new Date().toISOString(),
      ruleCount: Object.keys(rules).length,
      rules: Object.values(rules)
    }
  } catch (error) {
    console.error('Error exporting rules:', error)
    return { exportDate: new Date().toISOString(), rules: [], error: error.message }
  }
}

/**
 * Import rules
 */
export function importRules(data) {
  try {
    if (!data.rules || !Array.isArray(data.rules)) {
      throw new Error('Invalid import format: rules array is required')
    }

    const rules = loadRules()
    let importedCount = 0

    for (const ruleData of data.rules) {
      const rule = {
        id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...ruleData,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      rules[rule.id] = rule
      importedCount++
    }

    saveRules(rules)

    return {
      success: true,
      importedCount,
      totalInData: data.rules.length
    }
  } catch (error) {
    console.error('Error importing rules:', error)
    throw error
  }
}

/**
 * Duplicate rule
 */
export function duplicateRule(ruleId) {
  try {
    const sourceRule = getRule(ruleId)

    const newRule = {
      ...sourceRule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${sourceRule.name} (Copy)`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statistics: {
        totalMatches: 0,
        lastMatched: null,
        alertsCreated: 0
      }
    }

    const rules = loadRules()
    rules[newRule.id] = newRule
    saveRules(rules)

    console.log(`✅ Duplicated rule: ${ruleId} -> ${newRule.id}`)
    return newRule
  } catch (error) {
    console.error('Error duplicating rule:', error)
    throw error
  }
}
