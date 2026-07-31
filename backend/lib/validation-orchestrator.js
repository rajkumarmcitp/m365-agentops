/**
 * Validation Orchestrator
 * Coordinates validation of all controls
 * Aggregates results by domain and framework
 * Calculates compliance scores
 */

import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import ControlValidator from './control-validator.js'

const __dirname = new URL('.', import.meta.url).pathname

export class ValidationOrchestrator {
  constructor(graphClient, database = null, cache = null) {
    this.graphClient = graphClient
    this.database = database
    this.cache = cache || new Map()
    this.validator = new ControlValidator(graphClient, this.cache)
    this.controls = []
    this.lastValidation = null
    this.validationResults = null
  }

  /**
   * Load controls from JSON file
   */
  loadControls(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        console.warn(`Controls file not found: ${filePath}`)
        return []
      }

      const rawData = fs.readFileSync(filePath, 'utf-8')
      this.controls = JSON.parse(rawData)
      console.log(`✅ Loaded ${this.controls.length} controls`)
      return this.controls
    } catch (error) {
      console.error(`Error loading controls: ${error.message}`)
      return []
    }
  }

  /**
   * Validate all controls
   */
  async validateAll(tenantId, batchSize = 10) {
    if (this.controls.length === 0) {
      console.warn('No controls loaded. Call loadControls() first.')
      return null
    }

    console.log(`🔍 Starting validation of ${this.controls.length} controls for tenant ${tenantId}...`)
    const startTime = Date.now()

    try {
      const validationResult = await this.validator.validateControls(
        this.controls,
        tenantId,
        batchSize
      )

      this.lastValidation = {
        tenantId,
        timestamp: new Date().toISOString(),
        duration: validationResult.duration
      }

      this.validationResults = validationResult.results

      // Persist to database if available
      if (this.database) {
        await this._persistResults(tenantId, validationResult.results)
      }

      return this._aggregateResults(validationResult.results)
    } catch (error) {
      console.error('Validation error:', error.message)
      throw error
    }
  }

  /**
   * Get results aggregated by domain
   */
  getResultsByDomain() {
    if (!this.validationResults) return {}

    const byDomain = {}
    this.validationResults.forEach(result => {
      const domain = result.domain || 'Unknown'
      if (!byDomain[domain]) {
        byDomain[domain] = {
          domain,
          total: 0,
          passed: 0,
          failed: 0,
          partial: 0,
          unknown: 0,
          score: 0,
          controls: []
        }
      }
      byDomain[domain].total++
      byDomain[domain][result.status]++
      byDomain[domain].controls.push(result)
    })

    // Calculate score for each domain
    Object.values(byDomain).forEach(domain => {
      domain.score = domain.total > 0 ? Math.round((domain.passed / domain.total) * 100) : 0
    })

    return byDomain
  }

  /**
   * Get results aggregated by framework
   */
  getResultsByFramework() {
    if (!this.validationResults) return {}

    const byFramework = {}
    const frameworkMap = {
      'CIS M365': [],
      'NIST CSF 2.0': [],
      'NIST 800-53': [],
      'ISO 27001:2022': [],
      'Zero Trust': []
    }

    // Map controls to frameworks
    this.controls.forEach(control => {
      const controlId = control['Control ID']
      const result = this.validationResults.find(r => r.controlId === controlId)

      if (result) {
        Object.keys(frameworkMap).forEach(framework => {
          if (control[framework]) {
            if (!byFramework[framework]) {
              byFramework[framework] = {
                framework,
                total: 0,
                passed: 0,
                failed: 0,
                partial: 0,
                unknown: 0,
                score: 0,
                controls: []
              }
            }
            byFramework[framework].total++
            byFramework[framework][result.status]++
            byFramework[framework].controls.push(result)
          }
        })
      }
    })

    // Calculate score for each framework
    Object.values(byFramework).forEach(fw => {
      fw.score = fw.total > 0 ? Math.round((fw.passed / fw.total) * 100) : 0
    })

    return byFramework
  }

  /**
   * Get results aggregated by severity
   */
  getResultsBySeverity() {
    if (!this.validationResults) return {}

    const bySeverity = {}
    const severities = ['Critical', 'High', 'Medium', 'Low', 'Informational']

    severities.forEach(severity => {
      bySeverity[severity] = {
        severity,
        total: 0,
        passed: 0,
        failed: 0,
        partial: 0,
        unknown: 0,
        score: 0,
        controls: []
      }
    })

    this.validationResults.forEach(result => {
      const controlId = result.controlId
      const control = this.controls.find(c => c['Control ID'] === controlId)
      const severity = control?.Severity || 'Low'

      if (bySeverity[severity]) {
        bySeverity[severity].total++
        bySeverity[severity][result.status]++
        bySeverity[severity].controls.push(result)
      }
    })

    // Calculate score for each severity
    Object.values(bySeverity).forEach(s => {
      s.score = s.total > 0 ? Math.round((s.passed / s.total) * 100) : 0
    })

    return bySeverity
  }

  /**
   * Aggregate all results
   */
  _aggregateResults(results) {
    const total = results.length
    const passed = results.filter(r => r.status === 'pass').length
    const failed = results.filter(r => r.status === 'fail').length
    const partial = results.filter(r => r.status === 'partial').length
    const unknown = results.filter(r => r.status === 'unknown').length

    const complianceScore = total > 0 ? Math.round((passed / total) * 100) : 0

    return {
      summary: {
        totalControls: total,
        passed,
        failed,
        partial,
        unknown,
        complianceScore,
        timestamp: new Date().toISOString()
      },
      byDomain: this.getResultsByDomain(),
      byFramework: this.getResultsByFramework(),
      bySeverity: this.getResultsBySeverity(),
      detailedResults: results
    }
  }

  /**
   * Get current compliance score
   */
  getComplianceScore() {
    if (!this.validationResults) return 0
    const passed = this.validationResults.filter(r => r.status === 'pass').length
    const total = this.validationResults.length
    return total > 0 ? Math.round((passed / total) * 100) : 0
  }

  /**
   * Get validation statistics
   */
  getStats() {
    return this.validator.getStats()
  }

  /**
   * Get passed controls
   */
  getPassedControls() {
    if (!this.validationResults) return []
    return this.validationResults.filter(r => r.status === 'pass')
  }

  /**
   * Get failed controls
   */
  getFailedControls() {
    if (!this.validationResults) return []
    return this.validationResults.filter(r => r.status === 'fail')
  }

  /**
   * Get controls needing attention (failed or partial)
   */
  getControlsNeedingAttention() {
    if (!this.validationResults) return []
    return this.validationResults.filter(r => r.status === 'fail' || r.status === 'partial')
  }

  /**
   * Get domain summary
   */
  getDomainSummary() {
    const byDomain = this.getResultsByDomain()
    return Object.values(byDomain).map(d => ({
      domain: d.domain,
      total: d.total,
      passed: d.passed,
      score: d.score,
      riskLevel: d.score >= 80 ? 'Low' : d.score >= 60 ? 'Medium' : 'High'
    })).sort((a, b) => b.score - a.score)
  }

  /**
   * Get framework summary
   */
  getFrameworkSummary() {
    const byFramework = this.getResultsByFramework()
    return Object.values(byFramework).map(f => ({
      framework: f.framework,
      total: f.total,
      passed: f.passed,
      score: f.score,
      riskLevel: f.score >= 80 ? 'Low' : f.score >= 60 ? 'Medium' : 'High'
    })).sort((a, b) => b.score - a.score)
  }

  /**
   * Generate recommendations based on failed controls
   */
  generateRecommendations() {
    const failed = this.getFailedControls()
    const recommendations = []

    // Group by severity
    const bySeverity = {}
    failed.forEach(control => {
      const controlRecord = this.controls.find(c => c['Control ID'] === control.controlId)
      const severity = controlRecord?.Severity || 'Low'
      if (!bySeverity[severity]) bySeverity[severity] = []
      bySeverity[severity].push(control)
    })

    // Generate recommendations
    if (bySeverity['Critical'] && bySeverity['Critical'].length > 0) {
      recommendations.push({
        priority: 'Critical',
        count: bySeverity['Critical'].length,
        action: `Fix ${bySeverity['Critical'].length} critical compliance failures`,
        impact: 'High security risk if not addressed'
      })
    }

    if (bySeverity['High'] && bySeverity['High'].length > 0) {
      recommendations.push({
        priority: 'High',
        count: bySeverity['High'].length,
        action: `Address ${bySeverity['High'].length} high-priority issues`,
        impact: 'Significant compliance gap'
      })
    }

    return recommendations
  }

  /**
   * Persist validation results to database
   */
  async _persistResults(tenantId, results) {
    if (!this.database) return

    try {
      for (const result of results) {
        await this.database.query(
          `INSERT INTO m365_control_results
           (control_id, tenant_id, status, confidence, current_value, expected_value, data_source, validated_at, validated_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT DO UPDATE SET status=$3, confidence=$4, validated_at=$8`,
          [
            result.controlId,
            tenantId,
            result.status,
            result.confidence,
            JSON.stringify(result.details),
            result.details?.expectedValue,
            result.validationMethod,
            result.validatedAt,
            'orchestrator'
          ]
        )
      }
      console.log(`✅ Persisted ${results.length} validation results to database`)
    } catch (error) {
      console.error('Error persisting results:', error.message)
    }
  }

  /**
   * Export results to file
   */
  exportResults(format = 'json') {
    if (!this.validationResults) {
      console.warn('No validation results to export')
      return null
    }

    const aggregated = this._aggregateResults(this.validationResults)

    if (format === 'json') {
      return aggregated
    }

    if (format === 'csv') {
      // Convert to CSV format
      const headers = ['Control ID', 'Domain', 'Status', 'Confidence', 'Score', 'Validated At']
      const rows = this.validationResults.map(r => [
        r.controlId,
        r.domain,
        r.status,
        r.confidence,
        r.score,
        r.validatedAt
      ])
      return { headers, rows }
    }

    return aggregated
  }

  /**
   * Clear all cached results
   */
  clearCache() {
    this.validator.clearCache()
    this.cache.clear()
    this.validationResults = null
  }
}

export default ValidationOrchestrator
