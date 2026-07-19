/**
 * Alert Throttling & Deduplication Service
 * Manages deduplication policies and throttling with file-based persistence
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import {
  generateAlertFingerprint, calculateSimilarity, findDuplicateGroup,
  createDeduplicationSummary, evaluateThrottlePolicy, calculateThrottleStats,
  groupAlertsByFingerprint, generateDeduplicationRecommendation
} from './alert-deduplication-engine.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = join(__dirname, '..', 'data', 'throttling')
const POLICIES_FILE = join(DATA_DIR, 'policies.json')
const DEDUPS_FILE = join(DATA_DIR, 'deduplication-history.json')
const THROTTLES_FILE = join(DATA_DIR, 'throttle-history.json')
const RECENT_ALERTS_FILE = join(DATA_DIR, 'recent-alerts.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load policies
function loadPolicies() {
  ensureDataDir()
  if (fs.existsSync(POLICIES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(POLICIES_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading policies:', error)
      return []
    }
  }
  return []
}

// Save policies
function savePolicies(policies) {
  ensureDataDir()
  try {
    fs.writeFileSync(POLICIES_FILE, JSON.stringify(policies, null, 2))
  } catch (error) {
    console.error('Error saving policies:', error)
    throw error
  }
}

// Load deduplication history
function loadDeduplicationHistory() {
  ensureDataDir()
  if (fs.existsSync(DEDUPS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DEDUPS_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading deduplication history:', error)
      return []
    }
  }
  return []
}

// Save deduplication history
function saveDeduplicationHistory(history) {
  ensureDataDir()
  try {
    fs.writeFileSync(DEDUPS_FILE, JSON.stringify(history, null, 2))
  } catch (error) {
    console.error('Error saving deduplication history:', error)
    throw error
  }
}

// Load throttle history
function loadThrottleHistory() {
  ensureDataDir()
  if (fs.existsSync(THROTTLES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(THROTTLES_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading throttle history:', error)
      return []
    }
  }
  return []
}

// Save throttle history
function saveThrottleHistory(history) {
  ensureDataDir()
  try {
    fs.writeFileSync(THROTTLES_FILE, JSON.stringify(history, null, 2))
  } catch (error) {
    console.error('Error saving throttle history:', error)
    throw error
  }
}

// Load recent alerts
function loadRecentAlerts() {
  ensureDataDir()
  if (fs.existsSync(RECENT_ALERTS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(RECENT_ALERTS_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading recent alerts:', error)
      return []
    }
  }
  return []
}

// Save recent alerts
function saveRecentAlerts(alerts) {
  ensureDataDir()
  try {
    // Keep only last 1000 alerts for deduplication
    const kept = alerts.slice(-1000)
    fs.writeFileSync(RECENT_ALERTS_FILE, JSON.stringify(kept, null, 2))
  } catch (error) {
    console.error('Error saving recent alerts:', error)
    throw error
  }
}

/**
 * Check if alert is a duplicate
 */
export function checkAlertDuplicate(alert, threshold = 70) {
  try {
    const recentAlerts = loadRecentAlerts()
    const result = findDuplicateGroup(alert, recentAlerts, threshold)

    // Add to recent alerts
    const alertWithMeta = {
      ...alert,
      isDuplicate: result.isDuplicate,
      groupId: result.groupId,
      maxSimilarity: result.maxSimilarity
    }

    const recentList = loadRecentAlerts()
    recentList.push(alertWithMeta)
    saveRecentAlerts(recentList)

    // Log deduplication
    if (result.isDuplicate) {
      const history = loadDeduplicationHistory()
      history.push({
        id: `dedup-${Date.now()}`,
        alertId: alert.id,
        timestamp: new Date().toISOString(),
        isDuplicate: true,
        groupId: result.groupId,
        similarityScore: result.maxSimilarity,
        similarAlertCount: result.similarAlerts.length
      })
      saveDeduplicationHistory(history)
    }

    return {
      success: true,
      isDuplicate: result.isDuplicate,
      groupId: result.groupId,
      maxSimilarity: result.maxSimilarity,
      similarAlerts: result.similarAlerts
    }
  } catch (error) {
    console.error('Error checking duplicate:', error)
    throw error
  }
}

/**
 * Batch check for duplicates
 */
export function batchCheckDuplicates(alerts, threshold = 70) {
  try {
    const results = alerts.map(alert => checkAlertDuplicate(alert, threshold))

    const stats = {
      total: results.length,
      duplicates: results.filter(r => r.isDuplicate).length,
      unique: results.filter(r => !r.isDuplicate).length,
      avgSimilarity: Math.round(
        results.reduce((sum, r) => sum + (r.maxSimilarity || 0), 0) / results.length
      )
    }

    return {
      success: true,
      results,
      stats
    }
  } catch (error) {
    console.error('Error in batch deduplication:', error)
    throw error
  }
}

/**
 * Create throttle policy
 */
export function createThrottlePolicy(policyData) {
  try {
    const policies = loadPolicies()

    const policy = {
      id: `policy-${Date.now()}`,
      name: policyData.name,
      description: policyData.description || '',
      enabled: policyData.enabled !== false,
      throttleType: policyData.throttleType || 'rate_limit', // rate_limit, dedup, both
      alertTypes: policyData.alertTypes || [],
      actors: policyData.actors || [],
      minSeverity: policyData.minSeverity || 'LOW',
      timeWindowMinutes: policyData.timeWindowMinutes || 5,
      maxAlertsPerWindow: policyData.maxAlertsPerWindow || 5,
      dedupSimilarityThreshold: policyData.dedupSimilarityThreshold || 70,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        alertsThrottled: 0,
        alertsDeduplicated: 0
      }
    }

    policies.push(policy)
    savePolicies(policies)

    console.log(`✅ Throttle policy created: ${policy.name} (${policy.id})`)
    return policy
  } catch (error) {
    console.error('Error creating policy:', error)
    throw error
  }
}

/**
 * Get throttle policy
 */
export function getThrottlePolicy(policyId) {
  try {
    const policies = loadPolicies()
    const policy = policies.find(p => p.id === policyId)
    if (!policy) {
      throw new Error(`Policy not found: ${policyId}`)
    }
    return policy
  } catch (error) {
    console.error('Error getting policy:', error)
    throw error
  }
}

/**
 * Get all policies
 */
export function getAllThrottlePolicies() {
  try {
    const policies = loadPolicies()
    return policies.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  } catch (error) {
    console.error('Error getting policies:', error)
    return []
  }
}

/**
 * Update throttle policy
 */
export function updateThrottlePolicy(policyId, updates) {
  try {
    const policies = loadPolicies()
    const policy = policies.find(p => p.id === policyId)

    if (!policy) {
      throw new Error(`Policy not found: ${policyId}`)
    }

    Object.assign(policy, updates, { updatedAt: new Date().toISOString() })
    savePolicies(policies)

    console.log(`✅ Policy updated: ${policyId}`)
    return policy
  } catch (error) {
    console.error('Error updating policy:', error)
    throw error
  }
}

/**
 * Delete throttle policy
 */
export function deleteThrottlePolicy(policyId) {
  try {
    const policies = loadPolicies()
    const index = policies.findIndex(p => p.id === policyId)

    if (index === -1) {
      throw new Error(`Policy not found: ${policyId}`)
    }

    policies.splice(index, 1)
    savePolicies(policies)

    console.log(`✅ Policy deleted: ${policyId}`)
    return { success: true, policyId }
  } catch (error) {
    console.error('Error deleting policy:', error)
    throw error
  }
}

/**
 * Evaluate alert against all enabled policies
 */
export function evaluateAlertAgainstPolicies(alert) {
  try {
    const policies = loadPolicies().filter(p => p.enabled)
    const results = policies.map(policy => ({
      policyId: policy.id,
      policyName: policy.name,
      ...evaluateThrottlePolicy(alert, policy)
    }))

    const applied = results.filter(r => r.shouldThrottle)

    if (applied.length > 0) {
      const history = loadThrottleHistory()
      history.push({
        id: `throttle-${Date.now()}`,
        alertId: alert.id,
        timestamp: new Date().toISOString(),
        policyId: applied[0].policyId,
        policyName: applied[0].policyName,
        reason: applied[0].reason,
        nextAllowed: applied[0].nextAllowed
      })
      saveThrottleHistory(history)
    }

    return {
      success: true,
      shouldThrottle: applied.length > 0,
      appliedPolicies: applied,
      evaluationResults: results
    }
  } catch (error) {
    console.error('Error evaluating policies:', error)
    throw error
  }
}

/**
 * Get throttling statistics
 */
export function getThrottlingStats() {
  try {
    const recentAlerts = loadRecentAlerts()
    const dedupHistory = loadDeduplicationHistory()
    const throttleHistory = loadThrottleHistory()
    const policies = loadPolicies()

    const stats = {
      totalRecentAlerts: recentAlerts.length,
      totalDeduplicationEvents: dedupHistory.length,
      totalThrottleEvents: throttleHistory.length,
      activeAlertsSaved: dedupHistory.length + throttleHistory.length,
      policiesEnabled: policies.filter(p => p.enabled).length,
      totalPolicies: policies.length,
      dedupRate: 0,
      throttleRate: 0,
      potentialAlertReduction: 0
    }

    if (recentAlerts.length > 0) {
      stats.dedupRate = Math.round(
        (dedupHistory.length / recentAlerts.length) * 100
      )
      stats.throttleRate = Math.round(
        (throttleHistory.length / recentAlerts.length) * 100
      )
    }

    stats.potentialAlertReduction = dedupHistory.length + throttleHistory.length

    // Top duplicate types
    const typeGroups = groupAlertsByFingerprint(recentAlerts)
    const topDuplicates = Object.entries(typeGroups)
      .filter(([_, group]) => group.count > 1)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .reduce((acc, [fp, group]) => {
        acc[group.type] = group.count
        return acc
      }, {})

    stats.topDuplicateTypes = topDuplicates

    return stats
  } catch (error) {
    console.error('Error getting throttling stats:', error)
    return {}
  }
}

/**
 * Get deduplication recommendations
 */
export function getDeduplicationRecommendations() {
  try {
    const recentAlerts = loadRecentAlerts()
    const typeGroups = groupAlertsByFingerprint(recentAlerts)
    const recommendations = generateDeduplicationRecommendation(typeGroups)

    return {
      success: true,
      recommendationCount: recommendations.length,
      recommendations: recommendations.sort((a, b) => {
        const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    }
  } catch (error) {
    console.error('Error getting recommendations:', error)
    throw error
  }
}

/**
 * Clear throttle history (retention policy)
 */
export function purgeOldThrottleHistory(hoursToKeep = 24) {
  try {
    const throttleHistory = loadThrottleHistory()
    const dedupHistory = loadDeduplicationHistory()

    const cutoffTime = new Date()
    cutoffTime.setHours(cutoffTime.getHours() - hoursToKeep)

    const filteredThrottle = throttleHistory.filter(t => {
      return new Date(t.timestamp) > cutoffTime
    })

    const filteredDedup = dedupHistory.filter(d => {
      return new Date(d.timestamp) > cutoffTime
    })

    saveThrottleHistory(filteredThrottle)
    saveDeduplicationHistory(filteredDedup)

    const removed = (throttleHistory.length - filteredThrottle.length) +
                    (dedupHistory.length - filteredDedup.length)

    console.log(`✅ Purged ${removed} old throttle/dedup records`)
    return { success: true, removed }
  } catch (error) {
    console.error('Error purging history:', error)
    throw error
  }
}

/**
 * Export throttling data
 */
export function exportThrottlingData() {
  try {
    const policies = loadPolicies()
    const dedupHistory = loadDeduplicationHistory()
    const throttleHistory = loadThrottleHistory()

    return {
      exportDate: new Date().toISOString(),
      policies: {
        count: policies.length,
        data: policies
      },
      deduplicationHistory: {
        count: dedupHistory.length,
        data: dedupHistory
      },
      throttleHistory: {
        count: throttleHistory.length,
        data: throttleHistory
      }
    }
  } catch (error) {
    console.error('Error exporting data:', error)
    return { exportDate: new Date().toISOString(), error: error.message }
  }
}
