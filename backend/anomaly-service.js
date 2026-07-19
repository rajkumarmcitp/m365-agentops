/**
 * Anomaly Service
 * Manages baselines, models, and detection results with file-based persistence
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { calculateBaseline, detectAnomalies, ensembleDetection, getAnomalySeverity } from './anomaly-engine.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = join(__dirname, '..', 'data', 'anomalies')
const BASELINES_FILE = join(DATA_DIR, 'baselines.json')
const DETECTIONS_FILE = join(DATA_DIR, 'detections.json')
const MODELS_FILE = join(DATA_DIR, 'models.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load baselines
function loadBaselines() {
  ensureDataDir()
  if (fs.existsSync(BASELINES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(BASELINES_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading baselines:', error)
      return {}
    }
  }
  return {}
}

// Save baselines
function saveBaselines(baselines) {
  ensureDataDir()
  try {
    fs.writeFileSync(BASELINES_FILE, JSON.stringify(baselines, null, 2))
  } catch (error) {
    console.error('Error saving baselines:', error)
    throw error
  }
}

// Load detections
function loadDetections() {
  ensureDataDir()
  if (fs.existsSync(DETECTIONS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DETECTIONS_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading detections:', error)
      return []
    }
  }
  return []
}

// Save detections
function saveDetections(detections) {
  ensureDataDir()
  try {
    fs.writeFileSync(DETECTIONS_FILE, JSON.stringify(detections, null, 2))
  } catch (error) {
    console.error('Error saving detections:', error)
    throw error
  }
}

// Load models
function loadModels() {
  ensureDataDir()
  if (fs.existsSync(MODELS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(MODELS_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading models:', error)
      return {}
    }
  }
  return {}
}

// Save models
function saveModels(models) {
  ensureDataDir()
  try {
    fs.writeFileSync(MODELS_FILE, JSON.stringify(models, null, 2))
  } catch (error) {
    console.error('Error saving models:', error)
    throw error
  }
}

/**
 * Create or update baseline for a user/entity
 */
export function createOrUpdateBaseline(entityId, historicalAlerts) {
  try {
    const baselines = loadBaselines()
    const baseline = calculateBaseline(historicalAlerts)

    if (!baseline) {
      throw new Error('Cannot create baseline: insufficient data')
    }

    baselines[entityId] = {
      ...baseline,
      entityId,
      updatedAt: new Date().toISOString()
    }

    saveBaselines(baselines)

    console.log(`✅ Baseline created/updated: ${entityId} (${baseline.dataPoints} data points)`)
    return baselines[entityId]
  } catch (error) {
    console.error('Error creating baseline:', error)
    throw error
  }
}

/**
 * Get baseline for entity
 */
export function getBaseline(entityId) {
  try {
    const baselines = loadBaselines()
    return baselines[entityId] || null
  } catch (error) {
    console.error('Error getting baseline:', error)
    return null
  }
}

/**
 * Get all baselines
 */
export function getAllBaselines() {
  try {
    const baselines = loadBaselines()
    return Object.values(baselines).sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  } catch (error) {
    console.error('Error getting baselines:', error)
    return []
  }
}

/**
 * Delete baseline
 */
export function deleteBaseline(entityId) {
  try {
    const baselines = loadBaselines()

    if (!baselines[entityId]) {
      throw new Error(`Baseline not found: ${entityId}`)
    }

    delete baselines[entityId]
    saveBaselines(baselines)

    console.log(`✅ Baseline deleted: ${entityId}`)
    return { success: true, entityId }
  } catch (error) {
    console.error('Error deleting baseline:', error)
    throw error
  }
}

/**
 * Analyze alert for anomalies
 */
export function analyzeAlert(alert) {
  try {
    const entityId = alert.actor || alert.userId || 'unknown'
    const baseline = getBaseline(entityId)

    // If no specific baseline, try global baseline
    const effectiveBaseline = baseline || getBaseline('global')

    if (!effectiveBaseline) {
      return {
        success: true,
        analyzed: true,
        isAnomaly: false,
        anomalyScore: 0,
        severity: 'NONE',
        reasons: ['No baseline available for analysis']
      }
    }

    const analysis = detectAnomalies(alert, effectiveBaseline)
    const severity = getAnomalySeverity(analysis.anomalyScore)

    // Log detection
    const detection = {
      id: `detection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      alertId: alert.id,
      entityId,
      isAnomaly: analysis.isAnomaly,
      anomalyScore: analysis.anomalyScore,
      severity,
      reasons: analysis.reasons,
      analysis,
      timestamp: new Date().toISOString()
    }

    const detections = loadDetections()
    detections.push(detection)
    saveDetections(detections)

    return {
      success: true,
      analyzed: true,
      isAnomaly: analysis.isAnomaly,
      anomalyScore: analysis.anomalyScore,
      severity,
      reasons: analysis.reasons,
      detectionId: detection.id
    }
  } catch (error) {
    console.error('Error analyzing alert:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Batch analyze multiple alerts
 */
export function batchAnalyzeAlerts(alerts) {
  try {
    const results = alerts.map(alert => analyzeAlert(alert))

    const stats = {
      total: results.length,
      analyzed: results.filter(r => r.analyzed).length,
      anomalies: results.filter(r => r.isAnomaly).length,
      avgScore: Math.round(results.reduce((sum, r) => sum + (r.anomalyScore || 0), 0) / results.length)
    }

    return {
      success: true,
      results,
      stats
    }
  } catch (error) {
    console.error('Error in batch analysis:', error)
    throw error
  }
}

/**
 * Get detection history
 */
export function getDetectionHistory(entityId, limit = 100) {
  try {
    const detections = loadDetections()
    return detections
      .filter(d => !entityId || d.entityId === entityId)
      .filter(d => d.isAnomaly)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting detection history:', error)
    return []
  }
}

/**
 * Get anomaly statistics
 */
export function getAnomalyStats() {
  try {
    const baselines = loadBaselines()
    const detections = loadDetections()

    const stats = {
      totalBaselines: Object.keys(baselines).length,
      totalDetections: detections.length,
      anomaliesDetected: detections.filter(d => d.isAnomaly).length,
      criticalAnomalies: detections.filter(d => d.severity === 'CRITICAL').length,
      highAnomalies: detections.filter(d => d.severity === 'HIGH').length,
      avgAnomalyScore: 0,
      topAnomalyReasons: {}
    }

    if (detections.length > 0) {
      stats.avgAnomalyScore = Math.round(
        detections.reduce((sum, d) => sum + (d.anomalyScore || 0), 0) / detections.length
      )
    }

    // Count anomaly reasons
    detections.forEach(detection => {
      if (detection.reasons && Array.isArray(detection.reasons)) {
        detection.reasons.forEach(reason => {
          stats.topAnomalyReasons[reason] = (stats.topAnomalyReasons[reason] || 0) + 1
        })
      }
    })

    // Sort reasons
    const sortedReasons = Object.entries(stats.topAnomalyReasons)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((acc, [key, val]) => {
        acc[key] = val
        return acc
      }, {})

    stats.topAnomalyReasons = sortedReasons

    return stats
  } catch (error) {
    console.error('Error getting anomaly stats:', error)
    return {}
  }
}

/**
 * Create or update detection model
 */
export function createDetectionModel(modelData) {
  try {
    const models = loadModels()

    const model = {
      id: modelData.id || `model-${Date.now()}`,
      name: modelData.name,
      description: modelData.description || '',
      enabled: modelData.enabled !== false,
      type: modelData.type || 'statistical', // statistical, ml, ensemble
      baselines: modelData.baselines || [],
      sensitivity: modelData.sensitivity || 'MEDIUM', // LOW, MEDIUM, HIGH
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        detectionsUsing: 0,
        anomaliesFound: 0,
        falsePositives: 0
      }
    }

    models[model.id] = model
    saveModels(models)

    console.log(`✅ Detection model created: ${model.name} (${model.id})`)
    return model
  } catch (error) {
    console.error('Error creating model:', error)
    throw error
  }
}

/**
 * Get detection model
 */
export function getDetectionModel(modelId) {
  try {
    const models = loadModels()
    const model = models[modelId]
    if (!model) {
      throw new Error(`Model not found: ${modelId}`)
    }
    return model
  } catch (error) {
    console.error('Error getting model:', error)
    throw error
  }
}

/**
 * Get all detection models
 */
export function getAllDetectionModels() {
  try {
    const models = loadModels()
    return Object.values(models).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  } catch (error) {
    console.error('Error getting models:', error)
    return []
  }
}

/**
 * Delete detection model
 */
export function deleteDetectionModel(modelId) {
  try {
    const models = loadModels()

    if (!models[modelId]) {
      throw new Error(`Model not found: ${modelId}`)
    }

    delete models[modelId]
    saveModels(models)

    console.log(`✅ Detection model deleted: ${modelId}`)
    return { success: true, modelId }
  } catch (error) {
    console.error('Error deleting model:', error)
    throw error
  }
}

/**
 * Clear old detections (retention policy)
 */
export function purgeOldDetections(daysToKeep = 30) {
  try {
    const detections = loadDetections()
    const cutoffTime = new Date()
    cutoffTime.setDate(cutoffTime.getDate() - daysToKeep)

    const filtered = detections.filter(d => {
      return new Date(d.timestamp) > cutoffTime
    })

    const removed = detections.length - filtered.length
    saveDetections(filtered)

    console.log(`✅ Purged ${removed} old detections (kept ${filtered.length})`)
    return { success: true, removed, kept: filtered.length }
  } catch (error) {
    console.error('Error purging detections:', error)
    throw error
  }
}

/**
 * Export anomaly data
 */
export function exportAnomalyData() {
  try {
    const baselines = loadBaselines()
    const detections = loadDetections()
    const models = loadModels()

    return {
      exportDate: new Date().toISOString(),
      baselines: {
        count: Object.keys(baselines).length,
        data: Object.values(baselines)
      },
      detections: {
        count: detections.length,
        data: detections
      },
      models: {
        count: Object.keys(models).length,
        data: Object.values(models)
      }
    }
  } catch (error) {
    console.error('Error exporting data:', error)
    return {
      exportDate: new Date().toISOString(),
      error: error.message
    }
  }
}
