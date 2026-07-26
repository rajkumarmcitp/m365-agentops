/**
 * Compliance Drift Detection Agent
 * Continuous monitoring of CIS controls for drift (compliance violations)
 * Read-only: detects drift, recommends fixes, waits for manual approval + remediation
 */

import { normalizedControls } from '../normalized-controls.js'
import { getDatabase } from './database.js'
import { getEventBus } from './agent-event-bus.js'

export class ComplianceDriftAgent {
  constructor(db, eventBus, graphClient = null) {
    this.db = db
    this.eventBus = eventBus
    this.graphClient = graphClient
    this.checkInterval = 15 * 60 * 1000  // 15 minutes
    this.monitoringInterval = null
    this.isRunning = false
  }

  /**
   * Start continuous compliance monitoring
   */
  startMonitoring() {
    if (this.isRunning) {
      console.log('⚠️ Compliance monitoring already running')
      return
    }

    this.isRunning = true
    console.log('🔍 Compliance Drift Monitoring started (every 15 min)')

    // Run immediately
    this.runComplianceCheck().catch(err => {
      console.error('Initial compliance check failed:', err.message)
    })

    // Then schedule
    this.monitoringInterval = setInterval(() => {
      this.runComplianceCheck().catch(err => {
        console.error('Scheduled compliance check failed:', err.message)
      })
    }, this.checkInterval)
  }

  /**
   * Run complete compliance check on all controls
   */
  async runComplianceCheck() {
    console.log(`📋 Running compliance check on ${Object.keys(normalizedControls).length} controls`)

    const controls = Object.values(normalizedControls)
    let passCount = 0
    let failCount = 0
    let driftCount = 0

    for (const control of controls) {
      try {
        const checkResult = await this.checkControl(control)
        this.logCheck(control.id, checkResult)

        if (checkResult.status === 'FAIL') {
          failCount++
          await this.handleDrift(control, checkResult)
          driftCount++
        } else if (checkResult.status === 'PASS') {
          passCount++
          await this.handleResolution(control)
        }
      } catch (err) {
        console.error(`Control check failed: ${control.id}`, err.message)
      }
    }

    console.log(`✓ Compliance check complete: ${passCount} pass, ${failCount} fail, ${driftCount} new drifts`)
  }

  /**
   * Check single control against desired state
   * Returns: { status: PASS|FAIL, expected, actual, drift_type }
   */
  async checkControl(control) {
    // For now, return mock response (will be extended with real Graph API calls)
    // In production, this would validate against actual tenant settings

    if (!control.id) {
      return { status: 'UNKNOWN', expected: null, actual: null }
    }

    // Mock: Assume all controls pass (returns PASS)
    // Real implementation would query Graph API based on control.source
    return {
      status: 'PASS',
      expected: control.desiredValue || true,
      actual: control.desiredValue || true,
      details: `Mock check for ${control.id}`,
      duration_ms: Math.random() * 500  // Simulate check duration
    }
  }

  /**
   * Handle detected drift - create drift record + recommendation
   */
  async handleDrift(control, checkResult) {
    // Check if we already have open drift for this control
    const store = this.db.getStore()
    const existingDrift = Object.values(store.complianceDrifts || {}).find(
      d => d.control_id === control.id && !d.drift_resolved_at
    )

    if (existingDrift) {
      console.log(`ℹ️ Drift still open for ${control.id}, not creating duplicate`)
      return
    }

    // Create new drift record
    const driftId = this.createDrift(control, checkResult)

    // Generate remediation recommendation
    this.createRecommendation(driftId, control, checkResult)

    // Publish event to orchestrator
    this.eventBus.publish('COMPLIANCE_VIOLATION', {
      controlId: control.id,
      driftId,
      severity: control.severity || 'MEDIUM',
      expected: checkResult.expected,
      actual: checkResult.actual
    }, 'compliance-agent')

    console.log(`🚨 Drift detected: ${control.id} (${driftId})`)
  }

  /**
   * Create drift record in database
   */
  createDrift(control, checkResult) {
    const driftId = `drift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    this.db.prepare(`
      INSERT INTO compliance_drifts
      (id, control_id, control_name, drift_type, severity, expected_value,
       actual_value, drift_detected_at, detected_by, before_value, after_value)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      driftId,
      control.id,
      control.name || control.title || 'Unknown',
      this.detectDriftType(checkResult),
      control.severity || 'MEDIUM',
      JSON.stringify(checkResult.expected),
      JSON.stringify(checkResult.actual),
      new Date().toISOString(),
      'compliance-agent',
      JSON.stringify(checkResult.expected),
      JSON.stringify(checkResult.actual)
    )

    return driftId
  }

  /**
   * Generate remediation recommendation for drift
   */
  createRecommendation(driftId, control, checkResult) {
    const steps = this.getRemediationSteps(control)

    const recId = `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    this.db.prepare(`
      INSERT INTO compliance_recommendations
      (id, drift_id, control_id, title, description, steps,
       why_important, severity, estimated_effort, approval_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      recId,
      driftId,
      control.id,
      control.remediationTitle || `Fix ${control.id}`,
      control.remediationDescription || 'Re-enable compliance setting',
      JSON.stringify(steps),
      control.whyImportant || 'Required for compliance',
      control.severity || 'MEDIUM',
      control.estimatedEffort || '15 min',
      'pending'
    )

    return recId
  }

  /**
   * Generate remediation steps for a control
   */
  getRemediationSteps(control) {
    return [
      {
        step: 1,
        action: `Navigate to ${control.remediationService || 'Azure AD'} admin center`,
        url: control.remediationUrl || 'https://aad.portal.azure.com',
        details: control.remediationStep1 || 'Open admin center'
      },
      {
        step: 2,
        action: control.remediationStep2 || 'Locate the setting',
        details: control.remediationStep2Description || 'Find the control in the UI'
      },
      {
        step: 3,
        action: 'Enable or re-enable the setting',
        details: 'Apply the recommended configuration'
      },
      {
        step: 4,
        action: 'Save changes',
        details: 'Confirm the changes are applied'
      }
    ]
  }

  /**
   * Detect type of drift (disabled, deleted, modified, degraded)
   */
  detectDriftType(checkResult) {
    if (checkResult.expected === true && checkResult.actual === false) {
      return 'disabled'
    }
    if (checkResult.expected && !checkResult.actual) {
      return 'deleted'
    }
    if (checkResult.expected !== checkResult.actual) {
      return 'modified'
    }
    return 'degraded'
  }

  /**
   * Handle automatic resolution when drift is fixed
   */
  async handleResolution(control) {
    const store = this.db.getStore()
    const openDrift = Object.values(store.complianceDrifts || {}).find(
      d => d.control_id === control.id && !d.drift_resolved_at
    )

    if (openDrift) {
      // Drift was open, now control passes = auto-detected fix
      this.db.prepare(`
        UPDATE compliance_drifts
        SET drift_resolved_at = ?, resolution_method = ?
        WHERE id = ?
      `).run(new Date().toISOString(), 'auto_detected', openDrift.id)

      console.log(`✅ Auto-detected resolution for ${control.id}`)

      this.eventBus.publish('COMPLIANCE_RESTORED', {
        controlId: control.id,
        driftId: openDrift.id,
        resolution_method: 'auto_detected'
      }, 'compliance-agent')
    }
  }

  /**
   * Log every compliance check (audit trail)
   */
  logCheck(controlId, checkResult) {
    const store = this.db.getStore()
    const prevCheck = Object.values(store.complianceChecks || {})
      .filter(c => c.control_id === controlId)
      .sort((a, b) => new Date(b.check_timestamp) - new Date(a.check_timestamp))[0]

    this.db.prepare(`
      INSERT INTO compliance_checks
      (id, control_id, check_timestamp, status, previous_status,
       drift_detected, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      controlId,
      new Date().toISOString(),
      checkResult.status,
      prevCheck?.status || 'unknown',
      checkResult.status === 'FAIL' ? 1 : 0,
      JSON.stringify(checkResult.details || {})
    )
  }

  /**
   * Get all open drifts
   */
  getOpenDrifts() {
    const store = this.db.getStore()
    return Object.values(store.complianceDrifts || {})
      .filter(d => !d.drift_resolved_at)
      .sort((a, b) => new Date(b.drift_detected_at) - new Date(a.drift_detected_at))
  }

  /**
   * Get drift history for a specific control
   */
  getDriftHistory(controlId) {
    const store = this.db.getStore()
    return Object.values(store.complianceDrifts || {})
      .filter(d => d.control_id === controlId)
      .sort((a, b) => new Date(b.drift_detected_at) - new Date(a.drift_detected_at))
  }

  /**
   * Get recommendation for a drift
   */
  getRecommendation(driftId) {
    const store = this.db.getStore()
    return Object.values(store.complianceRecommendations || {})
      .find(r => r.drift_id === driftId)
  }

  /**
   * Admin approves recommendation
   */
  approveRecommendation(recId, adminEmail, notes = '') {
    this.db.prepare(`
      UPDATE compliance_recommendations
      SET approval_status = ?, approved_by = ?, approved_at = ?, notes = ?
      WHERE id = ?
    `).run('approved', adminEmail, new Date().toISOString(), notes, recId)

    const rec = this.db.prepare('SELECT * FROM compliance_recommendations WHERE id = ?').get(recId)

    console.log(`✓ Recommendation approved by ${adminEmail}: ${recId}`)

    this.eventBus.publish('REMEDIATION_APPROVED', {
      recId,
      controlId: rec?.control_id,
      approvedBy: adminEmail
    }, 'compliance-agent')
  }

  /**
   * Admin rejects recommendation
   */
  rejectRecommendation(recId, adminEmail, reason = '') {
    this.db.prepare(`
      UPDATE compliance_recommendations
      SET approval_status = ?, approved_by = ?, approved_at = ?, notes = ?
      WHERE id = ?
    `).run('rejected', adminEmail, new Date().toISOString(), reason, recId)

    console.log(`✗ Recommendation rejected by ${adminEmail}: ${recId}`)

    this.eventBus.publish('REMEDIATION_REJECTED', {
      recId,
      reason
    }, 'compliance-agent')
  }

  /**
   * Admin marks drift as manually resolved
   */
  markDriftResolved(driftId, adminEmail, notes = '') {
    this.db.prepare(`
      UPDATE compliance_drifts
      SET drift_resolved_at = ?, resolution_method = ?, resolved_by = ?, resolved_note = ?
      WHERE id = ?
    `).run(
      new Date().toISOString(),
      'manual_approval',
      adminEmail,
      notes,
      driftId
    )

    console.log(`✓ Drift marked resolved by ${adminEmail}: ${driftId}`)

    this.eventBus.publish('DRIFT_MANUALLY_RESOLVED', {
      driftId,
      resolvedBy: adminEmail,
      note: notes
    }, 'compliance-agent')
  }

  /**
   * Get compliance statistics
   */
  getStats() {
    const store = this.db.getStore()
    const drifts = Object.values(store.complianceDrifts || {})
    const openDrifts = drifts.filter(d => !d.drift_resolved_at)
    const resolvedDrifts = drifts.filter(d => d.drift_resolved_at)

    return {
      totalControlsMonitored: Object.keys(normalizedControls).length,
      totalDrifts: drifts.length,
      openDrifts: openDrifts.length,
      resolvedDrifts: resolvedDrifts.length,
      driftsByType: this.groupBy(openDrifts, 'drift_type'),
      driftsBySeverity: this.groupBy(openDrifts, 'severity'),
      averageResolutionTime: this.calculateAvgResolutionTime(resolvedDrifts)
    }
  }

  /**
   * Helper: Group array by property
   */
  groupBy(arr, key) {
    return arr.reduce((acc, obj) => {
      const group = obj[key] || 'unknown'
      acc[group] = (acc[group] || 0) + 1
      return acc
    }, {})
  }

  /**
   * Helper: Calculate average resolution time
   */
  calculateAvgResolutionTime(resolvedDrifts) {
    if (resolvedDrifts.length === 0) return 0

    const times = resolvedDrifts.map(d => {
      const detected = new Date(d.drift_detected_at)
      const resolved = new Date(d.drift_resolved_at)
      return (resolved - detected) / 1000 / 60  // minutes
    })

    return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  }

  /**
   * Shutdown agent
   */
  shutdown() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }
    this.isRunning = false
    console.log('✓ Compliance Drift Agent shutdown')
  }
}

// Global singleton
let driftAgentInstance = null

export function getComplianceDriftAgent() {
  return driftAgentInstance
}

export function initializeComplianceDriftAgent(db, eventBus, graphClient = null) {
  driftAgentInstance = new ComplianceDriftAgent(db, eventBus, graphClient)
  driftAgentInstance.startMonitoring()
  console.log('✅ Compliance Drift Agent initialized')
  return driftAgentInstance
}

export default ComplianceDriftAgent
