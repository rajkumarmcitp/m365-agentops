/**
 * Incident Service
 * Manages incident storage, retrieval, and updates with file-based persistence
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = join(__dirname, '..', 'data', 'incidents')
const INCIDENTS_FILE = join(DATA_DIR, 'incidents.json')
const INCIDENT_ALERTS_FILE = join(DATA_DIR, 'incident-alerts.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load incidents from file
function loadIncidents() {
  ensureDataDir()
  if (fs.existsSync(INCIDENTS_FILE)) {
    try {
      const data = fs.readFileSync(INCIDENTS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading incidents:', error)
      return {}
    }
  }
  return {}
}

// Save incidents to file
function saveIncidents(incidents) {
  ensureDataDir()
  try {
    fs.writeFileSync(INCIDENTS_FILE, JSON.stringify(incidents, null, 2))
  } catch (error) {
    console.error('Error saving incidents:', error)
    throw error
  }
}

// Load incident-alert mappings
function loadIncidentAlerts() {
  ensureDataDir()
  if (fs.existsSync(INCIDENT_ALERTS_FILE)) {
    try {
      const data = fs.readFileSync(INCIDENT_ALERTS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading incident alerts:', error)
      return {}
    }
  }
  return {}
}

// Save incident-alert mappings
function saveIncidentAlerts(mapping) {
  ensureDataDir()
  try {
    fs.writeFileSync(INCIDENT_ALERTS_FILE, JSON.stringify(mapping, null, 2))
  } catch (error) {
    console.error('Error saving incident alerts:', error)
    throw error
  }
}

/**
 * Create a new incident
 */
export function createIncident(incidentData) {
  try {
    const incidents = loadIncidents()
    const incidentAlerts = loadIncidentAlerts()

    const incident = {
      id: incidentData.id || `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: incidentData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: incidentData.status || 'NEW',
      severity: incidentData.severity || 'MEDIUM',
      title: incidentData.title || 'Correlated Alert Incident',
      description: incidentData.description || '',
      primaryActor: incidentData.primaryActor || 'Unknown',
      riskScore: incidentData.riskScore || 0,
      attackPatterns: incidentData.attackPatterns || [],
      correlationReason: incidentData.correlationReason || [],
      alerts: incidentData.alerts || [],
      tags: incidentData.tags || [],
      notes: incidentData.notes || []
    }

    incidents[incident.id] = incident

    // Map alerts to incident
    for (const alert of incident.alerts) {
      incidentAlerts[alert.id || alert] = incident.id
    }

    saveIncidents(incidents)
    saveIncidentAlerts(incidentAlerts)

    console.log(`✅ Created incident: ${incident.id}`)
    return incident
  } catch (error) {
    console.error('Error creating incident:', error)
    throw error
  }
}

/**
 * Get incident by ID
 */
export function getIncident(incidentId) {
  try {
    const incidents = loadIncidents()
    const incident = incidents[incidentId]
    if (!incident) {
      throw new Error(`Incident not found: ${incidentId}`)
    }
    return incident
  } catch (error) {
    console.error('Error getting incident:', error)
    throw error
  }
}

/**
 * Get all incidents
 */
export function getAllIncidents() {
  try {
    const incidents = loadIncidents()
    return Object.values(incidents).sort((a, b) => {
      const scoreA = b.riskScore || 0
      const scoreB = a.riskScore || 0
      return scoreA - scoreB
    })
  } catch (error) {
    console.error('Error getting incidents:', error)
    return []
  }
}

/**
 * Update incident status
 */
export function updateIncidentStatus(incidentId, newStatus) {
  try {
    const incidents = loadIncidents()
    const incident = incidents[incidentId]

    if (!incident) {
      throw new Error(`Incident not found: ${incidentId}`)
    }

    const validStatuses = ['NEW', 'INVESTIGATING', 'ESCALATED', 'RESOLVED', 'FALSE_POSITIVE']
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`)
    }

    incident.status = newStatus
    incident.updatedAt = new Date().toISOString()

    saveIncidents(incidents)

    console.log(`✅ Updated incident ${incidentId}: ${newStatus}`)
    return incident
  } catch (error) {
    console.error('Error updating incident status:', error)
    throw error
  }
}

/**
 * Add note to incident
 */
export function addIncidentNote(incidentId, note, author = 'system') {
  try {
    const incidents = loadIncidents()
    const incident = incidents[incidentId]

    if (!incident) {
      throw new Error(`Incident not found: ${incidentId}`)
    }

    incident.notes.push({
      timestamp: new Date().toISOString(),
      author,
      text: note
    })

    incident.updatedAt = new Date().toISOString()
    saveIncidents(incidents)

    return incident
  } catch (error) {
    console.error('Error adding note:', error)
    throw error
  }
}

/**
 * Add tags to incident
 */
export function tagIncident(incidentId, tags) {
  try {
    const incidents = loadIncidents()
    const incident = incidents[incidentId]

    if (!incident) {
      throw new Error(`Incident not found: ${incidentId}`)
    }

    incident.tags = [...new Set([...incident.tags, ...tags])]
    incident.updatedAt = new Date().toISOString()

    saveIncidents(incidents)

    return incident
  } catch (error) {
    console.error('Error tagging incident:', error)
    throw error
  }
}

/**
 * Get incident by alert ID
 */
export function getIncidentByAlertId(alertId) {
  try {
    const incidentAlerts = loadIncidentAlerts()
    const incidentId = incidentAlerts[alertId]

    if (!incidentId) {
      return null
    }

    return getIncident(incidentId)
  } catch (error) {
    console.error('Error getting incident by alert:', error)
    return null
  }
}

/**
 * Get incidents by status
 */
export function getIncidentsByStatus(status) {
  try {
    const incidents = loadIncidents()
    return Object.values(incidents)
      .filter(i => i.status === status)
      .sort((a, b) => b.riskScore - a.riskScore)
  } catch (error) {
    console.error('Error getting incidents by status:', error)
    return []
  }
}

/**
 * Get incidents by severity
 */
export function getIncidentsBySeverity(severity) {
  try {
    const incidents = loadIncidents()
    return Object.values(incidents)
      .filter(i => i.severity === severity)
      .sort((a, b) => b.riskScore - a.riskScore)
  } catch (error) {
    console.error('Error getting incidents by severity:', error)
    return []
  }
}

/**
 * Get incident statistics
 */
export function getIncidentStats() {
  try {
    const incidents = loadIncidents()
    const allIncidents = Object.values(incidents)

    const stats = {
      total: allIncidents.length,
      byStatus: {
        NEW: 0,
        INVESTIGATING: 0,
        ESCALATED: 0,
        RESOLVED: 0,
        FALSE_POSITIVE: 0
      },
      bySeverity: {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0
      },
      averageRiskScore: 0,
      averageAlertCount: 0,
      totalAlerts: 0,
      patternsDetected: 0
    }

    let totalRiskScore = 0

    for (const incident of allIncidents) {
      stats.byStatus[incident.status]++
      stats.bySeverity[incident.severity]++
      totalRiskScore += incident.riskScore || 0
      stats.totalAlerts += incident.alerts?.length || 0
      if (incident.attackPatterns && incident.attackPatterns.length > 0) {
        stats.patternsDetected++
      }
    }

    stats.averageRiskScore = allIncidents.length > 0 ? Math.round(totalRiskScore / allIncidents.length) : 0
    stats.averageAlertCount = allIncidents.length > 0 ? Math.round(stats.totalAlerts / allIncidents.length) : 0

    return stats
  } catch (error) {
    console.error('Error getting incident stats:', error)
    return {}
  }
}

/**
 * Delete incident
 */
export function deleteIncident(incidentId) {
  try {
    const incidents = loadIncidents()
    const incidentAlerts = loadIncidentAlerts()

    const incident = incidents[incidentId]
    if (!incident) {
      throw new Error(`Incident not found: ${incidentId}`)
    }

    // Remove alert mappings
    for (const alert of incident.alerts) {
      delete incidentAlerts[alert.id || alert]
    }

    delete incidents[incidentId]

    saveIncidents(incidents)
    saveIncidentAlerts(incidentAlerts)

    console.log(`✅ Deleted incident: ${incidentId}`)
    return { success: true, incidentId }
  } catch (error) {
    console.error('Error deleting incident:', error)
    throw error
  }
}

/**
 * Export incidents for compliance
 */
export function exportIncidents() {
  try {
    const incidents = loadIncidents()
    return {
      exportDate: new Date().toISOString(),
      incidentCount: Object.keys(incidents).length,
      incidents: Object.values(incidents)
    }
  } catch (error) {
    console.error('Error exporting incidents:', error)
    return { exportDate: new Date().toISOString(), incidents: [], error: error.message }
  }
}
