/**
 * Validation Snapshots Manager
 * Stores and retrieves historical validation snapshots for trend analysis
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SNAPSHOTS_DIR = path.join(__dirname, '../../data/snapshots')
const SNAPSHOTS_INDEX = path.join(SNAPSHOTS_DIR, 'index.json')

// Ensure snapshots directory exists
if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true })
}

/**
 * Create a validation snapshot from current results
 */
export function createSnapshot(validationResults) {
  try {
    const timestamp = new Date().toISOString()
    const date = new Date(timestamp)
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const snapshot = {
      timestamp,
      dateKey,
      overallScore: validationResults.overallScore || 0,
      totalValidations: validationResults.totalValidations || 0,
      summary: validationResults.summary || {},
      riskSummary: validationResults.riskSummary || {},
      complianceSummary: validationResults.complianceSummary || {},
      frameworkComparison: validationResults.frameworkComparison || [],
      validationCounts: {
        pass: validationResults.summary?.pass || 0,
        fail: validationResults.summary?.fail || 0,
        warn: validationResults.summary?.warn || 0
      }
    }

    // Save snapshot to file
    const snapshotFilename = `snapshot-${dateKey}.json`
    const snapshotPath = path.join(SNAPSHOTS_DIR, snapshotFilename)
    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2))

    // Update index
    updateSnapshotIndex(snapshot)

    console.log(`✓ Snapshot created: ${dateKey}`)
    return snapshot
  } catch (error) {
    console.warn(`⚠️ Failed to create snapshot:`, error.message)
    return null
  }
}

/**
 * Update the snapshot index
 */
function updateSnapshotIndex(snapshot) {
  try {
    let index = []

    if (fs.existsSync(SNAPSHOTS_INDEX)) {
      const data = fs.readFileSync(SNAPSHOTS_INDEX, 'utf-8')
      index = JSON.parse(data)
    }

    // Check if entry already exists for this date
    const existingIndex = index.findIndex(s => s.dateKey === snapshot.dateKey)
    const entry = {
      dateKey: snapshot.dateKey,
      timestamp: snapshot.timestamp,
      overallScore: snapshot.overallScore,
      pass: snapshot.validationCounts.pass,
      fail: snapshot.validationCounts.fail,
      warn: snapshot.validationCounts.warn,
      riskScore: snapshot.riskSummary?.overallRiskScore || 0
    }

    if (existingIndex >= 0) {
      index[existingIndex] = entry
    } else {
      index.push(entry)
    }

    // Sort by date descending
    index.sort((a, b) => new Date(b.dateKey) - new Date(a.dateKey))

    // Keep last 90 days only
    if (index.length > 90) {
      index = index.slice(0, 90)
    }

    fs.writeFileSync(SNAPSHOTS_INDEX, JSON.stringify(index, null, 2))
  } catch (error) {
    console.warn(`⚠️ Failed to update snapshot index:`, error.message)
  }
}

/**
 * Get snapshots for date range
 */
export function getSnapshotsByDateRange(days = 90) {
  try {
    if (!fs.existsSync(SNAPSHOTS_INDEX)) {
      return []
    }

    const data = fs.readFileSync(SNAPSHOTS_INDEX, 'utf-8')
    const index = JSON.parse(data)

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return index.filter(snapshot => new Date(snapshot.dateKey) >= cutoffDate)
  } catch (error) {
    console.warn(`⚠️ Failed to read snapshots:`, error.message)
    return []
  }
}

/**
 * Get latest snapshot
 */
export function getLatestSnapshot() {
  try {
    if (!fs.existsSync(SNAPSHOTS_INDEX)) {
      return null
    }

    const data = fs.readFileSync(SNAPSHOTS_INDEX, 'utf-8')
    const index = JSON.parse(data)

    return index.length > 0 ? index[0] : null
  } catch (error) {
    console.warn(`⚠️ Failed to read latest snapshot:`, error.message)
    return null
  }
}

/**
 * Get full snapshot details
 */
export function getSnapshotDetails(dateKey) {
  try {
    const snapshotPath = path.join(SNAPSHOTS_DIR, `snapshot-${dateKey}.json`)

    if (!fs.existsSync(snapshotPath)) {
      return null
    }

    const data = fs.readFileSync(snapshotPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.warn(`⚠️ Failed to read snapshot details:`, error.message)
    return null
  }
}

/**
 * Get snapshot statistics
 */
export function getSnapshotStats(days = 90) {
  const snapshots = getSnapshotsByDateRange(days)

  if (snapshots.length === 0) {
    return null
  }

  const scores = snapshots.map(s => s.overallScore)
  const risks = snapshots.map(s => s.riskScore)

  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const avgRisk = Math.round(risks.reduce((a, b) => a + b, 0) / risks.length)
  const latestScore = snapshots[0].overallScore
  const earliestScore = snapshots[snapshots.length - 1].overallScore
  const trend = latestScore - earliestScore

  return {
    daysTracked: snapshots.length,
    averageScore: avgScore,
    averageRisk: avgRisk,
    currentScore: latestScore,
    previousScore: snapshots.length > 1 ? snapshots[1].overallScore : latestScore,
    trendDirection: trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable',
    trendValue: trend,
    trendPercentage: earliestScore > 0 ? Math.round((trend / earliestScore) * 100) : 0,
    maxScore: Math.max(...scores),
    minScore: Math.min(...scores),
    snapshots: snapshots
  }
}

/**
 * Calculate compliance trends
 */
export function calculateComplianceTrends(days = 90) {
  const snapshots = getSnapshotsByDateRange(days)

  if (snapshots.length === 0) {
    return null
  }

  // Calculate moving average
  const windowSize = Math.min(7, Math.floor(snapshots.length / 3))

  const movingAverage = []
  for (let i = 0; i < snapshots.length; i++) {
    const start = Math.max(0, i - windowSize + 1)
    const window = snapshots.slice(start, i + 1)
    const avg = Math.round(
      window.reduce((sum, s) => sum + s.overallScore, 0) / window.length
    )
    movingAverage.push(avg)
  }

  // Velocity (change per week)
  let weeklyVelocity = 0
  if (snapshots.length >= 7) {
    const recentWeek = snapshots.slice(0, 7)
    const pastWeek = snapshots.length >= 14 ? snapshots.slice(7, 14) : []
    const recentAvg = Math.round(
      recentWeek.reduce((sum, s) => sum + s.overallScore, 0) / recentWeek.length
    )
    const pastAvg =
      pastWeek.length > 0
        ? Math.round(pastWeek.reduce((sum, s) => sum + s.overallScore, 0) / pastWeek.length)
        : snapshots[snapshots.length - 1].overallScore

    weeklyVelocity = recentAvg - pastAvg
  }

  return {
    daysTracked: snapshots.length,
    movingAverage: movingAverage.reverse(),
    weeklyVelocity: weeklyVelocity,
    velocityDirection: weeklyVelocity > 0 ? 'improving' : weeklyVelocity < 0 ? 'declining' : 'stable',
    snapshots: snapshots.reverse()
  }
}

/**
 * Clear old snapshots (older than specified days)
 */
export function clearOldSnapshots(olderThanDays = 365) {
  try {
    if (!fs.existsSync(SNAPSHOTS_DIR)) {
      return
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    const files = fs.readdirSync(SNAPSHOTS_DIR)
    let deletedCount = 0

    files.forEach(file => {
      if (file.startsWith('snapshot-') && file.endsWith('.json')) {
        const dateKey = file.replace('snapshot-', '').replace('.json', '')
        if (new Date(dateKey) < cutoffDate) {
          const filePath = path.join(SNAPSHOTS_DIR, file)
          fs.unlinkSync(filePath)
          deletedCount++
        }
      }
    })

    if (deletedCount > 0) {
      console.log(`✓ Cleaned up ${deletedCount} old snapshots`)
    }

    // Rebuild index
    rebuildSnapshotIndex()
  } catch (error) {
    console.warn(`⚠️ Failed to clear old snapshots:`, error.message)
  }
}

/**
 * Rebuild snapshot index from files
 */
export function rebuildSnapshotIndex() {
  try {
    if (!fs.existsSync(SNAPSHOTS_DIR)) {
      return
    }

    const files = fs.readdirSync(SNAPSHOTS_DIR)
    const index = []

    files.forEach(file => {
      if (file.startsWith('snapshot-') && file.endsWith('.json')) {
        try {
          const filePath = path.join(SNAPSHOTS_DIR, file)
          const data = fs.readFileSync(filePath, 'utf-8')
          const snapshot = JSON.parse(data)

          index.push({
            dateKey: snapshot.dateKey,
            timestamp: snapshot.timestamp,
            overallScore: snapshot.overallScore,
            pass: snapshot.validationCounts?.pass || 0,
            fail: snapshot.validationCounts?.fail || 0,
            warn: snapshot.validationCounts?.warn || 0,
            riskScore: snapshot.riskSummary?.overallRiskScore || 0
          })
        } catch (e) {
          console.warn(`⚠️ Failed to parse snapshot ${file}:`, e.message)
        }
      }
    })

    // Sort by date descending
    index.sort((a, b) => new Date(b.dateKey) - new Date(a.dateKey))

    // Keep last 90 days
    const filtered = index.slice(0, 90)

    fs.writeFileSync(SNAPSHOTS_INDEX, JSON.stringify(filtered, null, 2))
    console.log(`✓ Rebuilt snapshot index: ${filtered.length} snapshots`)
  } catch (error) {
    console.warn(`⚠️ Failed to rebuild snapshot index:`, error.message)
  }
}
