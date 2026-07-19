/**
 * Forensic Investigation Service
 * Manages investigation cases, evidence, and reports with chain-of-custody tracking
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import {
  reconstructTimeline, correlateEvidence, buildNarrative, generateForensicReport, validateChainOfCustody
} from './forensic-engine.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = join(__dirname, '..', 'data', 'forensics')
const CASES_FILE = join(DATA_DIR, 'cases.json')
const EVIDENCE_FILE = join(DATA_DIR, 'evidence.json')
const REPORTS_FILE = join(DATA_DIR, 'reports.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load cases
function loadCases() {
  ensureDataDir()
  if (fs.existsSync(CASES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CASES_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading cases:', error)
      return {}
    }
  }
  return {}
}

// Save cases
function saveCases(cases) {
  ensureDataDir()
  try {
    fs.writeFileSync(CASES_FILE, JSON.stringify(cases, null, 2))
  } catch (error) {
    console.error('Error saving cases:', error)
    throw error
  }
}

// Load evidence
function loadEvidence() {
  ensureDataDir()
  if (fs.existsSync(EVIDENCE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(EVIDENCE_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading evidence:', error)
      return []
    }
  }
  return []
}

// Save evidence
function saveEvidence(evidence) {
  ensureDataDir()
  try {
    fs.writeFileSync(EVIDENCE_FILE, JSON.stringify(evidence, null, 2))
  } catch (error) {
    console.error('Error saving evidence:', error)
    throw error
  }
}

// Load reports
function loadReports() {
  ensureDataDir()
  if (fs.existsSync(REPORTS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8'))
    } catch (error) {
      console.error('Error loading reports:', error)
      return []
    }
  }
  return []
}

// Save reports
function saveReports(reports) {
  ensureDataDir()
  try {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2))
  } catch (error) {
    console.error('Error saving reports:', error)
    throw error
  }
}

/**
 * Create investigation case
 */
export function createCase(caseData) {
  try {
    const cases = loadCases()

    const caseRecord = {
      id: `case-${Date.now()}`,
      name: caseData.name,
      description: caseData.description || '',
      type: caseData.type || 'security_incident', // security_incident, breach, malware, insider_threat
      severity: caseData.severity || 'HIGH',
      status: 'OPEN',
      investigator: caseData.investigator,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      evidence: [],
      tags: caseData.tags || [],
      timeline: null,
      correlations: null,
      narrative: null,
      report: null
    }

    cases[caseRecord.id] = caseRecord
    saveCases(cases)

    console.log(`✅ Investigation case created: ${caseRecord.name} (${caseRecord.id})`)
    return caseRecord
  } catch (error) {
    console.error('Error creating case:', error)
    throw error
  }
}

/**
 * Get case by ID
 */
export function getCase(caseId) {
  try {
    const cases = loadCases()
    const caseRecord = cases[caseId]
    if (!caseRecord) {
      throw new Error(`Case not found: ${caseId}`)
    }
    return caseRecord
  } catch (error) {
    console.error('Error getting case:', error)
    throw error
  }
}

/**
 * Get all cases
 */
export function getAllCases() {
  try {
    const cases = loadCases()
    return Object.values(cases).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  } catch (error) {
    console.error('Error getting cases:', error)
    return []
  }
}

/**
 * Add evidence to case
 */
export function addEvidence(caseId, evidenceData) {
  try {
    const cases = loadCases()
    const caseRecord = cases[caseId]

    if (!caseRecord) {
      throw new Error(`Case not found: ${caseId}`)
    }

    const evidence = {
      id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      caseId,
      description: evidenceData.description,
      type: evidenceData.type || 'log', // log, alert, file, network, artifact
      source: evidenceData.source || 'unknown',
      data: evidenceData.data || {},
      collectedAt: new Date().toISOString(),
      collectedBy: evidenceData.collectedBy,
      status: 'preserved',
      tags: evidenceData.tags || [],
      chain_of_custody: [{
        action: 'collected',
        actor: evidenceData.collectedBy,
        timestamp: new Date().toISOString(),
        location: evidenceData.location || 'evidence_storage'
      }]
    }

    // Save evidence
    const allEvidence = loadEvidence()
    allEvidence.push(evidence)
    saveEvidence(allEvidence)

    // Update case
    caseRecord.evidence.push(evidence.id)
    caseRecord.updatedAt = new Date().toISOString()
    saveCases(cases)

    console.log(`✅ Evidence added: ${evidence.id}`)
    return evidence
  } catch (error) {
    console.error('Error adding evidence:', error)
    throw error
  }
}

/**
 * Get evidence by ID
 */
export function getEvidence(evidenceId) {
  try {
    const evidence = loadEvidence()
    const item = evidence.find(e => e.id === evidenceId)
    if (!item) {
      throw new Error(`Evidence not found: ${evidenceId}`)
    }
    return item
  } catch (error) {
    console.error('Error getting evidence:', error)
    throw error
  }
}

/**
 * Get case evidence
 */
export function getCaseEvidence(caseId) {
  try {
    const caseRecord = getCase(caseId)
    const allEvidence = loadEvidence()

    return allEvidence.filter(e => caseRecord.evidence.includes(e.id))
  } catch (error) {
    console.error('Error getting case evidence:', error)
    return []
  }
}

/**
 * Update evidence chain of custody
 */
export function updateEvidenceCustody(evidenceId, custodyData) {
  try {
    const evidence = loadEvidence()
    const item = evidence.find(e => e.id === evidenceId)

    if (!item) {
      throw new Error(`Evidence not found: ${evidenceId}`)
    }

    item.chain_of_custody.push({
      action: custodyData.action,
      actor: custodyData.actor,
      timestamp: new Date().toISOString(),
      location: custodyData.location || 'unknown',
      notes: custodyData.notes
    })

    saveEvidence(evidence)

    console.log(`✅ Chain of custody updated: ${evidenceId}`)
    return item
  } catch (error) {
    console.error('Error updating custody:', error)
    throw error
  }
}

/**
 * Reconstruct timeline for case
 */
export function reconstructCaseTimeline(caseId, events) {
  try {
    const cases = loadCases()
    const caseRecord = cases[caseId]

    if (!caseRecord) {
      throw new Error(`Case not found: ${caseId}`)
    }

    const timeline = reconstructTimeline(events)
    caseRecord.timeline = timeline
    caseRecord.updatedAt = new Date().toISOString()
    saveCases(cases)

    console.log(`✅ Timeline reconstructed: ${timeline.eventCount} events`)
    return timeline
  } catch (error) {
    console.error('Error reconstructing timeline:', error)
    throw error
  }
}

/**
 * Correlate evidence
 */
export function correlateCaseEvidence(caseId, events, threshold = 0.6) {
  try {
    const cases = loadCases()
    const caseRecord = cases[caseId]

    if (!caseRecord) {
      throw new Error(`Case not found: ${caseId}`)
    }

    const correlations = correlateEvidence(events, threshold)
    caseRecord.correlations = correlations
    caseRecord.updatedAt = new Date().toISOString()
    saveCases(cases)

    console.log(`✅ Evidence correlated: ${correlations.totalCorrelations} correlations`)
    return correlations
  } catch (error) {
    console.error('Error correlating evidence:', error)
    throw error
  }
}

/**
 * Generate investigation report
 */
export function generateCaseReport(caseId, events) {
  try {
    const caseRecord = getCase(caseId)
    const caseEvidence = getCaseEvidence(caseId)

    // Reconstruct timeline if not already done
    let timeline = caseRecord.timeline || reconstructTimeline(events)
    let correlations = caseRecord.correlations || correlateEvidence(events)
    let narrative = buildNarrative(timeline, correlations)

    // Generate report
    const report = generateForensicReport(caseRecord, timeline, correlations, narrative)

    // Save report
    const reports = loadReports()
    reports.push(report)
    saveReports(reports)

    // Update case
    const cases = loadCases()
    cases[caseId].report = report.id
    cases[caseId].updatedAt = new Date().toISOString()
    saveCases(cases)

    console.log(`✅ Report generated: ${report.id}`)
    return report
  } catch (error) {
    console.error('Error generating report:', error)
    throw error
  }
}

/**
 * Get investigation report
 */
export function getReport(reportId) {
  try {
    const reports = loadReports()
    const report = reports.find(r => r.id === reportId)
    if (!report) {
      throw new Error(`Report not found: ${reportId}`)
    }
    return report
  } catch (error) {
    console.error('Error getting report:', error)
    throw error
  }
}

/**
 * Get case report
 */
export function getCaseReport(caseId) {
  try {
    const caseRecord = getCase(caseId)
    if (!caseRecord.report) {
      throw new Error(`No report generated for case: ${caseId}`)
    }
    return getReport(caseRecord.report)
  } catch (error) {
    console.error('Error getting case report:', error)
    throw error
  }
}

/**
 * Validate chain of custody for case
 */
export function validateCaseChainOfCustody(caseId) {
  try {
    const caseEvidence = getCaseEvidence(caseId)
    const validation = validateChainOfCustody(caseEvidence)

    return {
      caseId,
      valid: validation.valid,
      violations: validation.violations,
      evidenceCount: caseEvidence.length,
      validationTime: validation.timestamp
    }
  } catch (error) {
    console.error('Error validating chain of custody:', error)
    throw error
  }
}

/**
 * Close investigation case
 */
export function closeCase(caseId, findings) {
  try {
    const cases = loadCases()
    const caseRecord = cases[caseId]

    if (!caseRecord) {
      throw new Error(`Case not found: ${caseId}`)
    }

    caseRecord.status = 'CLOSED'
    caseRecord.findings = findings || ''
    caseRecord.closedAt = new Date().toISOString()
    caseRecord.updatedAt = new Date().toISOString()
    saveCases(cases)

    console.log(`✅ Case closed: ${caseId}`)
    return caseRecord
  } catch (error) {
    console.error('Error closing case:', error)
    throw error
  }
}

/**
 * Get forensic statistics
 */
export function getForensicStats() {
  try {
    const cases = loadCases()
    const evidence = loadEvidence()
    const reports = loadReports()

    const casesList = Object.values(cases)
    const openCases = casesList.filter(c => c.status === 'OPEN').length
    const closedCases = casesList.filter(c => c.status === 'CLOSED').length

    return {
      totalCases: casesList.length,
      openCases,
      closedCases,
      totalEvidence: evidence.length,
      totalReports: reports.length,
      casesByType: countBy(casesList, 'type'),
      casesBySeverity: countBy(casesList, 'severity'),
      avgEvidencePerCase: (evidence.length / Math.max(1, casesList.length)).toFixed(2)
    }
  } catch (error) {
    console.error('Error getting stats:', error)
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
 * Export forensic data
 */
export function exportForensicData() {
  try {
    const cases = loadCases()
    const evidence = loadEvidence()
    const reports = loadReports()

    return {
      exportDate: new Date().toISOString(),
      cases: {
        count: Object.keys(cases).length,
        data: Object.values(cases)
      },
      evidence: {
        count: evidence.length,
        data: evidence
      },
      reports: {
        count: reports.length,
        data: reports
      }
    }
  } catch (error) {
    console.error('Error exporting data:', error)
    return { exportDate: new Date().toISOString(), error: error.message }
  }
}
