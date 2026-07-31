// ============================================================
// Compliance API Client
// Frontend library for consuming M365 AgentOps compliance APIs
// ============================================================

class ComplianceApiClient {
  constructor() {
    const apiUrl = window.API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : '')
    this.baseUrl = apiUrl ? `${apiUrl}/api/m365-agentops/v2` : '/api/m365-agentops/v2'
  }

  /**
   * Get overall weighted compliance score
   */
  async getComplianceScore(tenantId) {
    const response = await fetch(
      `${this.baseUrl}/compliance/score?tenantId=${encodeURIComponent(tenantId)}`
    )

    if (!response.ok) {
      throw new Error(`Failed to get compliance score: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get all framework-specific scores
   */
  async getFrameworkScores(tenantId) {
    const response = await fetch(
      `${this.baseUrl}/compliance/frameworks?tenantId=${encodeURIComponent(tenantId)}`
    )

    if (!response.ok) {
      throw new Error(`Failed to get framework scores: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get single framework score
   */
  async getFrameworkScore(framework, tenantId) {
    const response = await fetch(
      `${this.baseUrl}/compliance/framework/${encodeURIComponent(framework)}?tenantId=${encodeURIComponent(tenantId)}`
    )

    if (!response.ok) {
      throw new Error(`Failed to get ${framework} score: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get all domain scores
   */
  async getDomainScores(tenantId) {
    const response = await fetch(
      `${this.baseUrl}/compliance/domains?tenantId=${encodeURIComponent(tenantId)}`
    )

    if (!response.ok) {
      throw new Error(`Failed to get domain scores: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get domain-specific score
   */
  async getDomainScore(domain, tenantId) {
    const response = await fetch(
      `${this.baseUrl}/compliance/domain/${encodeURIComponent(domain)}?tenantId=${encodeURIComponent(tenantId)}`
    )

    if (!response.ok) {
      throw new Error(`Failed to get ${domain} score: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get compliance trend over time
   */
  async getComplianceTrend(tenantId, daysBack = 30) {
    const response = await fetch(
      `${this.baseUrl}/compliance/trend?tenantId=${encodeURIComponent(tenantId)}&daysBack=${daysBack}`
    )

    if (!response.ok) {
      throw new Error(`Failed to get compliance trend: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get compliance drift (regressions & remediations)
   */
  async getComplianceDrift(tenantId, daysBack = 7) {
    const response = await fetch(
      `${this.baseUrl}/compliance/drift?tenantId=${encodeURIComponent(tenantId)}&daysBack=${daysBack}`
    )

    if (!response.ok) {
      throw new Error(`Failed to get compliance drift: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get latest compliance snapshot
   */
  async getComplianceSnapshot(tenantId) {
    const response = await fetch(
      `${this.baseUrl}/compliance/snapshot?tenantId=${encodeURIComponent(tenantId)}`
    )

    if (!response.ok) {
      throw new Error(`Failed to get compliance snapshot: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get executive compliance summary
   */
  async getExecutiveSummary(tenantId) {
    const response = await fetch(
      `${this.baseUrl}/compliance/summary?tenantId=${encodeURIComponent(tenantId)}`
    )

    if (!response.ok) {
      throw new Error(`Failed to get executive summary: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Create compliance snapshot (trigger validation)
   */
  async createSnapshot(tenantId) {
    const response = await fetch(`${this.baseUrl}/compliance/snapshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId })
    })

    if (!response.ok) {
      throw new Error(`Failed to create snapshot: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get failures by severity
   */
  async getFailuresBySeverity(tenantId) {
    const response = await fetch(
      `${this.baseUrl}/compliance/failures-by-severity?tenantId=${encodeURIComponent(tenantId)}`
    )

    if (!response.ok) {
      throw new Error(`Failed to get failures by severity: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Utility: Format score with color
   */
  getScoreColor(score) {
    if (score >= 90) return '#10b981' // green
    if (score >= 80) return '#3b82f6' // blue
    if (score >= 70) return '#f59e0b' // amber
    if (score >= 60) return '#ef4444' // red
    return '#7c3aed' // purple (critical)
  }

  /**
   * Utility: Format score with status
   */
  getScoreStatus(score) {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 70) return 'Fair'
    if (score >= 60) return 'Poor'
    return 'Critical'
  }

  /**
   * Utility: Format score with trend arrow
   */
  formatTrendArrow(delta) {
    if (delta > 2) return '📈'
    if (delta < -2) return '📉'
    return '➡️'
  }
}

// Export singleton instance
export const complianceApi = new ComplianceApiClient()

// Export class for testing
export { ComplianceApiClient }
