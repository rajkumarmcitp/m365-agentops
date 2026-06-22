/**
 * M365 Configuration Validator
 * Validates tenant configuration against CIS benchmarks
 * Provides real-time validation across all 9 configuration areas
 */

import { CFG_TOPICS } from '../data/cis-controls.js'

/**
 * Validation result object
 */
export class ValidationResult {
  constructor(controlId, controlTitle, status, message, remediation = null) {
    this.controlId = controlId
    this.controlTitle = controlTitle
    this.status = status // 'pass', 'fail', 'warn', 'manual'
    this.message = message
    this.remediation = remediation
    this.timestamp = new Date()
  }
}

/**
 * Get validation summary for all topics
 * @returns {Object} Summary with pass/fail/warn counts and status by topic
 */
export function getValidationSummary() {
  const summary = {
    timestamp: new Date(),
    totalControls: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    manual: 0,
    passRate: 0,
    topicSummary: []
  }

  CFG_TOPICS.forEach(topic => {
    const topicStats = {
      id: topic.id,
      name: topic.name,
      icon: topic.icon,
      controls: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      manual: 0,
      passRate: 0
    }

    topic.subsections.forEach(subsection => {
      subsection.controls.forEach(control => {
        topicStats.controls++
        summary.totalControls++

        if (control.status === 'pass') {
          topicStats.passed++
          summary.passed++
        } else if (control.status === 'fail') {
          topicStats.failed++
          summary.failed++
        } else if (control.status === 'warn') {
          topicStats.warnings++
          summary.warnings++
        } else if (control.status === 'manual') {
          topicStats.manual++
          summary.manual++
        }
      })
    })

    topicStats.passRate = topicStats.controls > 0
      ? Math.round((topicStats.passed / topicStats.controls) * 100)
      : 0

    summary.topicSummary.push(topicStats)
  })

  summary.passRate = summary.totalControls > 0
    ? Math.round((summary.passed / summary.totalControls) * 100)
    : 0

  return summary
}

/**
 * Get detailed validation results for a specific topic
 * @param {string} topicId - Topic ID to validate
 * @returns {Object} Validation results with controls grouped by subsection
 */
export function validateTopic(topicId) {
  const topic = CFG_TOPICS.find(t => t.id === topicId)
  if (!topic) return null

  const results = {
    topic: {
      id: topic.id,
      name: topic.name,
      icon: topic.icon
    },
    subsections: [],
    stats: {
      totalControls: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      manual: 0,
      passRate: 0
    }
  }

  topic.subsections.forEach(subsection => {
    const subsectionResults = {
      id: subsection.id,
      name: subsection.name,
      controls: []
    }

    subsection.controls.forEach(control => {
      const result = new ValidationResult(
        control.id,
        control.title,
        control.status,
        control.value || 'Manual verification required',
        {
          description: control.desc,
          powerShell: control.ps,
          profile: control.profile,
          type: control.type
        }
      )

      subsectionResults.controls.push(result)
      results.stats.totalControls++

      if (control.status === 'pass') {
        results.stats.passed++
      } else if (control.status === 'fail') {
        results.stats.failed++
      } else if (control.status === 'warn') {
        results.stats.warnings++
      } else if (control.status === 'manual') {
        results.stats.manual++
      }
    })

    results.subsections.push(subsectionResults)
  })

  results.stats.passRate = results.stats.totalControls > 0
    ? Math.round((results.stats.passed / results.stats.totalControls) * 100)
    : 0

  return results
}

/**
 * Validate all controls across all topics
 * @returns {Object} Complete validation results for all topics
 */
export function validateAllTopics() {
  const validation = {
    timestamp: new Date(),
    topics: [],
    stats: {
      totalTopics: 0,
      totalControls: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      manual: 0,
      overallPassRate: 0
    }
  }

  CFG_TOPICS.forEach(topic => {
    const topicResults = validateTopic(topic.id)
    if (topicResults) {
      validation.topics.push(topicResults)
      validation.stats.totalTopics++
      validation.stats.totalControls += topicResults.stats.totalControls
      validation.stats.passed += topicResults.stats.passed
      validation.stats.failed += topicResults.stats.failed
      validation.stats.warnings += topicResults.stats.warnings
      validation.stats.manual += topicResults.stats.manual
    }
  })

  validation.stats.overallPassRate = validation.stats.totalControls > 0
    ? Math.round((validation.stats.passed / validation.stats.totalControls) * 100)
    : 0

  return validation
}

/**
 * Get failed controls across all topics
 * @returns {Array} Array of failed controls with remediation info
 */
export function getFailedControls() {
  const failed = []

  CFG_TOPICS.forEach(topic => {
    topic.subsections.forEach(subsection => {
      subsection.controls.forEach(control => {
        if (control.status === 'fail') {
          failed.push({
            controlId: control.id,
            title: control.title,
            topic: topic.name,
            topicId: topic.id,
            subsection: subsection.name,
            current: control.value,
            expected: control.desc,
            powerShell: control.ps,
            profile: control.profile,
            type: control.type
          })
        }
      })
    })
  })

  return failed
}

/**
 * Get warning controls across all topics
 * @returns {Array} Array of warning controls
 */
export function getWarningControls() {
  const warnings = []

  CFG_TOPICS.forEach(topic => {
    topic.subsections.forEach(subsection => {
      subsection.controls.forEach(control => {
        if (control.status === 'warn') {
          warnings.push({
            controlId: control.id,
            title: control.title,
            topic: topic.name,
            topicId: topic.id,
            subsection: subsection.name,
            current: control.value,
            expected: control.desc,
            powerShell: control.ps,
            profile: control.profile,
            type: control.type
          })
        }
      })
    })
  })

  return warnings
}

/**
 * Get risk score for validation results
 * @param {Object} stats - Validation stats object
 * @returns {Object} Risk score with level and color
 */
export function getRiskScore(stats) {
  if (!stats.totalControls) return { score: 0, level: 'unknown', color: '#999' }

  const failRate = (stats.failed / stats.totalControls) * 100
  const warnRate = (stats.warnings / stats.totalControls) * 100
  const effectiveFailRate = failRate + (warnRate * 0.5)

  let level, color
  if (effectiveFailRate === 0) {
    level = 'Low Risk'
    color = '#4caf50' // Green
  } else if (effectiveFailRate < 10) {
    level = 'Low-Moderate Risk'
    color = '#8bc34a' // Light Green
  } else if (effectiveFailRate < 25) {
    level = 'Moderate Risk'
    color = '#ffc107' // Amber
  } else if (effectiveFailRate < 50) {
    level = 'High Risk'
    color = '#ff9800' // Orange
  } else {
    level = 'Critical Risk'
    color = '#f44336' // Red
  }

  return {
    score: Math.round(100 - effectiveFailRate),
    effectiveFailRate: Math.round(effectiveFailRate * 10) / 10,
    level,
    color
  }
}

/**
 * Export validation report as JSON
 * @param {Object} validation - Full validation results
 * @returns {string} JSON string of validation results
 */
export function exportValidationReport(validation) {
  return JSON.stringify(validation, null, 2)
}

/**
 * Generate HTML summary of validation status
 * @returns {string} HTML summary of all topics with pass rates
 */
export function generateValidationSummaryHTML() {
  const summary = getValidationSummary()
  const risk = getRiskScore(summary)

  let html = `
    <div class="validation-summary">
      <div class="validation-header">
        <h2>Configuration Validation Report</h2>
        <div class="validation-timestamp">${new Date().toLocaleString()}</div>
      </div>

      <div class="validation-overview">
        <div class="risk-score" style="border-left: 4px solid ${risk.color}">
          <div class="score-value">${risk.score}</div>
          <div class="score-label">Risk Score</div>
          <div class="score-level" style="color: ${risk.color}">${risk.level}</div>
        </div>

        <div class="overall-stats">
          <div class="stat-item">
            <span class="stat-label">Pass Rate</span>
            <span class="stat-value success">${summary.passRate}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Passed</span>
            <span class="stat-value">${summary.passed}/${summary.totalControls}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Failed</span>
            <span class="stat-value danger">${summary.failed}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Warnings</span>
            <span class="stat-value warning">${summary.warnings}</span>
          </div>
        </div>
      </div>

      <div class="topics-breakdown">
        <h3>Configuration Areas Status</h3>
        <div class="topics-grid">
          ${summary.topicSummary.map(topic => `
            <div class="topic-card">
              <div class="topic-icon"><i class="ti ${topic.icon}"></i></div>
              <div class="topic-name">${topic.name}</div>
              <div class="topic-stats">
                <div class="pass-rate">${topic.passRate}%</div>
                <div class="control-count">${topic.passed}/${topic.controls} passed</div>
              </div>
              ${topic.failed > 0 ? `<div class="failed-count" style="color:#f44336">${topic.failed} failed</div>` : ''}
              ${topic.warnings > 0 ? `<div class="warning-count" style="color:#ff9800">${topic.warnings} warnings</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `

  return html
}
