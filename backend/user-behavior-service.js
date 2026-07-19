/**
 * User Behavior Analytics Service
 * Manages user profiles, activity tracking, and insider threat detection
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import {
  calculateUserRiskScore, getRiskSeverity, createUserProfile,
  detectInsiderThreats, identifyHighRiskUsers, calculateUserActivitySummary
} from './user-behavior-engine.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = join(__dirname, '..', 'data', 'uba')
const PROFILES_FILE = join(DATA_DIR, 'user-profiles.json')
const ACTIVITY_FILE = join(DATA_DIR, 'user-activity.json')
const THREATS_FILE = join(DATA_DIR, 'threat-indicators.json')
const RISK_HISTORY_FILE = join(DATA_DIR, 'risk-history.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load user profiles
function loadProfiles() {
  ensureDataDir()
  if (fs.existsSync(PROFILES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading profiles:', error)
      return {}
    }
  }
  return {}
}

// Save user profiles
function saveProfiles(profiles) {
  ensureDataDir()
  try {
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2))
  } catch (error) {
    console.error('Error saving profiles:', error)
    throw error
  }
}

// Load user activity
function loadActivity() {
  ensureDataDir()
  if (fs.existsSync(ACTIVITY_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(ACTIVITY_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading activity:', error)
      return []
    }
  }
  return []
}

// Save user activity
function saveActivity(activity) {
  ensureDataDir()
  try {
    fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(activity, null, 2))
  } catch (error) {
    console.error('Error saving activity:', error)
    throw error
  }
}

// Load threat indicators
function loadThreats() {
  ensureDataDir()
  if (fs.existsSync(THREATS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(THREATS_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading threats:', error)
      return []
    }
  }
  return []
}

// Save threat indicators
function saveThreats(threats) {
  ensureDataDir()
  try {
    fs.writeFileSync(THREATS_FILE, JSON.stringify(threats, null, 2))
  } catch (error) {
    console.error('Error saving threats:', error)
    throw error
  }
}

// Load risk history
function loadRiskHistory() {
  ensureDataDir()
  if (fs.existsSync(RISK_HISTORY_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(RISK_HISTORY_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading risk history:', error)
      return []
    }
  }
  return []
}

// Save risk history
function saveRiskHistory(history) {
  ensureDataDir()
  try {
    fs.writeFileSync(RISK_HISTORY_FILE, JSON.stringify(history, null, 2))
  } catch (error) {
    console.error('Error saving risk history:', error)
    throw error
  }
}

/**
 * Create or get user profile
 */
export function createOrGetUserProfile(userId, userInfo) {
  try {
    const profiles = loadProfiles()

    if (profiles[userId]) {
      return profiles[userId]
    }

    const profile = createUserProfile(userId, userInfo)
    profiles[userId] = profile
    saveProfiles(profiles)

    console.log(`✅ User profile created: ${userId}`)
    return profile
  } catch (error) {
    console.error('Error creating profile:', error)
    throw error
  }
}

/**
 * Get user profile
 */
export function getUserProfile(userId) {
  try {
    const profiles = loadProfiles()
    const profile = profiles[userId]
    if (!profile) {
      throw new Error(`Profile not found: ${userId}`)
    }
    return profile
  } catch (error) {
    console.error('Error getting profile:', error)
    throw error
  }
}

/**
 * Get all user profiles
 */
export function getAllUserProfiles() {
  try {
    const profiles = loadProfiles()
    return Object.values(profiles).sort((a, b) => {
      return (b.peakRiskScore || 0) - (a.peakRiskScore || 0)
    })
  } catch (error) {
    console.error('Error getting profiles:', error)
    return []
  }
}

/**
 * Record user activity
 */
export function recordUserActivity(userId, activity) {
  try {
    const activities = loadActivity()
    const profiles = loadProfiles()

    const record = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      ...activity,
      timestamp: activity.timestamp || new Date().toISOString()
    }

    activities.push(record)
    saveActivity(activities)

    // Update user profile last activity
    if (profiles[userId]) {
      profiles[userId].lastActivity = record.timestamp
      profiles[userId].totalActivities++
      saveProfiles(profiles)
    }

    return record
  } catch (error) {
    console.error('Error recording activity:', error)
    throw error
  }
}

/**
 * Get user's recent activity
 */
export function getUserRecentActivity(userId, hours = 24) {
  try {
    const activities = loadActivity()
    const cutoffTime = new Date()
    cutoffTime.setHours(cutoffTime.getHours() - hours)

    return activities
      .filter(a => a.userId === userId && new Date(a.timestamp) > cutoffTime)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (error) {
    console.error('Error getting recent activity:', error)
    return []
  }
}

/**
 * Analyze user and update risk score
 */
export function analyzeUserRisk(userId) {
  try {
    const profiles = loadProfiles()
    const profile = profiles[userId]

    if (!profile) {
      throw new Error(`Profile not found: ${userId}`)
    }

    // Get recent activity
    const recentActivity = getUserRecentActivity(userId, 24)

    // Calculate risk score
    const riskAnalysis = calculateUserRiskScore(profile, recentActivity)

    // Detect insider threats
    const threats = detectInsiderThreats(profile, recentActivity)

    // Update profile
    profile.avgRiskScore = riskAnalysis.score
    if (!profile.peakRiskScore || riskAnalysis.score > profile.peakRiskScore) {
      profile.peakRiskScore = riskAnalysis.score
    }
    profile.threatIndicators = threats
    profile.suspiciousActivityCount = threats.length

    saveProfiles(profiles)

    // Log risk history
    const history = loadRiskHistory()
    history.push({
      id: `risk-${Date.now()}`,
      userId,
      timestamp: new Date().toISOString(),
      riskScore: riskAnalysis.score,
      severity: riskAnalysis.severity,
      factors: riskAnalysis.factors,
      threatsDetected: threats.length
    })
    saveRiskHistory(history)

    // Save threat indicators
    if (threats.length > 0) {
      const allThreats = loadThreats()
      threats.forEach(threat => {
        allThreats.push({
          id: `threat-${Date.now()}`,
          userId,
          ...threat
        })
      })
      saveThreats(allThreats)
    }

    return {
      success: true,
      userId,
      riskScore: riskAnalysis.score,
      severity: riskAnalysis.severity,
      factors: riskAnalysis.factors,
      threats,
      activityCount: recentActivity.length
    }
  } catch (error) {
    console.error('Error analyzing user risk:', error)
    throw error
  }
}

/**
 * Batch analyze multiple users
 */
export function batchAnalyzeUsers(userIds) {
  try {
    const results = userIds.map(userId => {
      try {
        return analyzeUserRisk(userId)
      } catch (error) {
        return {
          success: false,
          userId,
          error: error.message
        }
      }
    })

    const successful = results.filter(r => r.success).length
    const avgRisk = Math.round(
      results
        .filter(r => r.success)
        .reduce((sum, r) => sum + (r.riskScore || 0), 0) / Math.max(1, successful)
    )

    return {
      success: true,
      results,
      stats: {
        analyzed: successful,
        failed: results.length - successful,
        avgRiskScore: avgRisk,
        criticalCount: results.filter(r => r.severity === 'CRITICAL').length
      }
    }
  } catch (error) {
    console.error('Error in batch analysis:', error)
    throw error
  }
}

/**
 * Get insider threats
 */
export function getInsiderThreats(limit = 100, severity = null) {
  try {
    const threats = loadThreats()
    return threats
      .filter(t => !severity || t.severity === severity)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting threats:', error)
    return []
  }
}

/**
 * Get high-risk users
 */
export function getHighRiskUsers(limit = 20) {
  try {
    const profiles = getAllUserProfiles()
    return identifyHighRiskUsers(profiles, limit)
  } catch (error) {
    console.error('Error getting high-risk users:', error)
    return []
  }
}

/**
 * Get user activity summary
 */
export function getUserActivitySummary(userId) {
  try {
    const profile = getUserProfile(userId)
    const recentActivity = getUserRecentActivity(userId, 24)

    return calculateUserActivitySummary(profile, recentActivity)
  } catch (error) {
    console.error('Error getting activity summary:', error)
    throw error
  }
}

/**
 * Get UBA statistics
 */
export function getUBAStatistics() {
  try {
    const profiles = getAllUserProfiles()
    const threats = loadThreats()
    const history = loadRiskHistory()

    const criticalUsers = profiles.filter(p => (p.peakRiskScore || 0) >= 80)
    const highRiskUsers = profiles.filter(p => (p.peakRiskScore || 0) >= 60 && (p.peakRiskScore || 0) < 80)

    return {
      totalUsers: Object.keys(loadProfiles()).length,
      analyzedUsers: profiles.filter(p => p.avgRiskScore > 0).length,
      avgRiskScore: Math.round(
        profiles.reduce((sum, p) => sum + (p.avgRiskScore || 0), 0) / Math.max(1, profiles.length)
      ),
      criticalRiskUsers: criticalUsers.length,
      highRiskUsers: highRiskUsers.length,
      totalThreatsDetected: threats.length,
      threatsByType: countBy(threats, 'type'),
      threatsBySeverity: countBy(threats, 'severity'),
      riskTrend: calculateRiskTrend(history),
      recentAnalysis: history.slice(-10)
    }
  } catch (error) {
    console.error('Error getting statistics:', error)
    return {}
  }
}

/**
 * Helper: Count items by property
 */
function countBy(items, property) {
  return items.reduce((acc, item) => {
    const key = item[property] || 'unknown'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

/**
 * Helper: Calculate risk trend
 */
function calculateRiskTrend(history) {
  if (history.length < 2) return 'stable'

  const recent = history.slice(-5)
  const avgRecent = recent.reduce((sum, h) => sum + h.riskScore, 0) / recent.length
  const avgPrevious = history.slice(-10, -5).reduce((sum, h) => sum + h.riskScore, 0) / Math.max(1, 5)

  const change = ((avgRecent - avgPrevious) / Math.max(1, avgPrevious)) * 100

  if (change > 20) return 'increasing'
  if (change < -20) return 'decreasing'
  return 'stable'
}

/**
 * Purge old activity records (retention policy)
 */
export function purgeOldActivity(daysToKeep = 90) {
  try {
    const activities = loadActivity()
    const cutoffTime = new Date()
    cutoffTime.setDate(cutoffTime.getDate() - daysToKeep)

    const filtered = activities.filter(a => {
      return new Date(a.timestamp) > cutoffTime
    })

    const removed = activities.length - filtered.length
    saveActivity(filtered)

    console.log(`✅ Purged ${removed} old activity records`)
    return { success: true, removed, kept: filtered.length }
  } catch (error) {
    console.error('Error purging activity:', error)
    throw error
  }
}

/**
 * Export UBA data
 */
export function exportUBAData() {
  try {
    const profiles = loadProfiles()
    const threats = loadThreats()
    const history = loadRiskHistory()

    return {
      exportDate: new Date().toISOString(),
      profiles: {
        count: Object.keys(profiles).length,
        data: Object.values(profiles)
      },
      threats: {
        count: threats.length,
        data: threats
      },
      riskHistory: {
        count: history.length,
        data: history
      }
    }
  } catch (error) {
    console.error('Error exporting data:', error)
    return { exportDate: new Date().toISOString(), error: error.message }
  }
}

/**
 * Update user profile baseline
 */
export function updateUserBaseline(userId, baselineData) {
  try {
    const profiles = loadProfiles()
    const profile = profiles[userId]

    if (!profile) {
      throw new Error(`Profile not found: ${userId}`)
    }

    profile.baseline = { ...profile.baseline, ...baselineData }
    saveProfiles(profiles)

    console.log(`✅ Baseline updated for ${userId}`)
    return profile
  } catch (error) {
    console.error('Error updating baseline:', error)
    throw error
  }
}
