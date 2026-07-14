/**
 * Compliance Framework Calculator
 * Calculates framework coverage and maps controls to compliance standards
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load framework mappings
const frameworksPath = join(__dirname, '../../data/compliance-frameworks.json')
const frameworksData = JSON.parse(readFileSync(frameworksPath, 'utf8'))

const FRAMEWORKS = frameworksData.frameworks
const FRAMEWORK_MAPPINGS = frameworksData.frameworkMappings

/**
 * Get control's framework mappings
 */
export function getControlFrameworkMappings(controlId) {
  return FRAMEWORK_MAPPINGS[controlId] || {}
}

/**
 * Calculate coverage for a specific framework
 */
export function calculateFrameworkCoverage(controlId, framework) {
  const mappings = getControlFrameworkMappings(controlId)
  const frameworkControlIds = mappings[framework] || []
  return {
    isMapped: frameworkControlIds.length > 0,
    controlIds: frameworkControlIds,
    mapped: frameworkControlIds.length
  }
}

/**
 * Get all frameworks a control is mapped to
 */
export function getControlMappedFrameworks(controlId) {
  const mappings = getControlFrameworkMappings(controlId)
  return Object.keys(mappings).filter(key => key !== 'name' && Array.isArray(mappings[key]))
}

/**
 * Calculate coverage metrics for all frameworks
 */
export function calculateFrameworkCoverageMetrics(validations) {
  const metrics = {}

  for (const [frameworkName, framework] of Object.entries(FRAMEWORKS)) {
    const mappedControls = new Set()
    const failingControls = new Set()

    for (const validation of validations) {
      const controlMappings = getControlFrameworkMappings(validation.id)
      if (controlMappings[frameworkName]) {
        mappedControls.add(validation.id)

        if (validation.status === 'fail') {
          failingControls.add(validation.id)
        }
      }
    }

    const coverageCount = mappedControls.size
    const coveragePercentage = Math.round((coverageCount / framework.totalControls) * 100)
    const failureCount = failingControls.size
    const compliancePercentage = coverageCount > 0
      ? Math.round(((coverageCount - failureCount) / coverageCount) * 100)
      : 0

    metrics[frameworkName] = {
      framework: framework.name,
      version: framework.version,
      description: framework.description,
      color: framework.color,
      icon: framework.icon,
      totalControls: framework.totalControls,
      implementedControls: coverageCount,
      coveragePercentage: coveragePercentage,
      failingControls: failureCount,
      compliancePercentage: compliancePercentage,
      status: compliancePercentage >= 80 ? 'Compliant' : compliancePercentage >= 60 ? 'Partial' : 'Non-Compliant',
      mappedControlIds: Array.from(mappedControls)
    }
  }

  return metrics
}

/**
 * Get framework comparison (cross-framework view)
 */
export function getFrameworkComparison(validations) {
  const metrics = calculateFrameworkCoverageMetrics(validations)

  // Sort by coverage percentage descending
  const sorted = Object.entries(metrics)
    .sort((a, b) => b[1].coveragePercentage - a[1].coveragePercentage)
    .map(([name, data]) => ({
      frameworkName: name,
      ...data
    }))

  return sorted
}

/**
 * Get controls not mapped to any framework
 */
export function getUnmappedControls(validations) {
  return validations
    .filter(v => getControlMappedFrameworks(v.id).length === 0)
    .map(v => ({
      id: v.id,
      name: v.name,
      pillar: v.pillar,
      status: v.status
    }))
}

/**
 * Get framework-specific controls
 */
export function getFrameworkControls(framework, validations) {
  const mappings = FRAMEWORK_MAPPINGS

  return validations
    .filter(v => {
      const controlMappings = mappings[v.id]
      return controlMappings && controlMappings[framework]
    })
    .map(v => ({
      id: v.id,
      name: v.name,
      pillar: v.pillar,
      status: v.status,
      riskScore: v.riskScore || 0,
      frameworkControls: mappings[v.id][framework] || []
    }))
}

/**
 * Get highest priority frameworks by compliance gap
 */
export function getCompliancePriorities(validations) {
  const metrics = calculateFrameworkCoverageMetrics(validations)

  return Object.entries(metrics)
    .filter(([, data]) => data.status !== 'Compliant')
    .sort((a, b) => {
      // Prioritize by gap size (total - implemented)
      const gapA = a[1].totalControls - a[1].implementedControls
      const gapB = b[1].totalControls - b[1].implementedControls
      return gapB - gapA
    })
    .map(([name, data]) => ({
      frameworkName: name,
      framework: data.framework,
      gap: data.totalControls - data.implementedControls,
      implemented: data.implementedControls,
      complianceGap: 100 - data.coveragePercentage,
      priority: data.totalControls - data.implementedControls > 30 ? 'High' : 'Medium'
    }))
}

/**
 * Generate compliance summary for dashboard
 */
export function generateComplianceSummary(validations) {
  const metrics = calculateFrameworkCoverageMetrics(validations)
  const priorities = getCompliancePriorities(validations)
  const unmapped = getUnmappedControls(validations)

  const averageCoverage = Object.values(metrics).length > 0
    ? Math.round(
        Object.values(metrics).reduce((sum, m) => sum + m.coveragePercentage, 0) /
        Object.values(metrics).length
      )
    : 0

  const averageCompliance = Object.values(metrics).length > 0
    ? Math.round(
        Object.values(metrics).reduce((sum, m) => sum + m.compliancePercentage, 0) /
        Object.values(metrics).length
      )
    : 0

  return {
    frameworkCoverage: metrics,
    averageCoverage: averageCoverage,
    averageCompliance: averageCompliance,
    compliancePriorities: priorities,
    unmappedControls: unmapped,
    totalFrameworks: Object.keys(metrics).length,
    compliantFrameworks: Object.values(metrics).filter(m => m.status === 'Compliant').length
  }
}
