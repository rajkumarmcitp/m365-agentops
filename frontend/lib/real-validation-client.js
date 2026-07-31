/**
 * Real Validation API Client
 * Frontend client for real control validation endpoints
 */

const API_BASE = '/api/validation'

export const realValidationClient = {
  /**
   * Start validation for all controls
   */
  async validateAll(tenantId = null) {
    try {
      const response = await fetch(`${API_BASE}/validate-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error validating controls:', error)
      throw error
    }
  },

  /**
   * Get validation status
   */
  async getStatus() {
    try {
      const response = await fetch(`${API_BASE}/status`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting validation status:', error)
      throw error
    }
  },

  /**
   * Get validation results with optional filtering
   */
  async getResults(options = {}) {
    try {
      const { filter = 'all', domain, framework, severity } = options
      const params = new URLSearchParams()

      if (filter && filter !== 'all') params.append('filter', filter)
      if (domain) params.append('domain', domain)
      if (framework) params.append('framework', framework)
      if (severity) params.append('severity', severity)

      const url = `${API_BASE}/results${params.size > 0 ? '?' + params.toString() : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting validation results:', error)
      throw error
    }
  },

  /**
   * Get validation summary
   */
  async getSummary() {
    try {
      const response = await fetch(`${API_BASE}/summary`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting validation summary:', error)
      throw error
    }
  },

  /**
   * Get recommendations
   */
  async getRecommendations() {
    try {
      const response = await fetch(`${API_BASE}/recommendations`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting recommendations:', error)
      throw error
    }
  },

  /**
   * Get specific control details
   */
  async getControl(controlId) {
    try {
      const response = await fetch(`${API_BASE}/controls/${controlId}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error getting control ${controlId}:`, error)
      throw error
    }
  },

  /**
   * Export results
   */
  async exportResults(format = 'json') {
    try {
      const url = `${API_BASE}/export?format=${format}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      if (format === 'csv') {
        // Download CSV file
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = downloadUrl
        a.download = `compliance-results-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(downloadUrl)
        document.body.removeChild(a)
        return { success: true, message: 'CSV exported' }
      }

      return await response.json()
    } catch (error) {
      console.error('Error exporting results:', error)
      throw error
    }
  },

  /**
   * Clear cache
   */
  async clearCache() {
    try {
      const response = await fetch(`${API_BASE}/clear-cache`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error clearing cache:', error)
      throw error
    }
  },

  /**
   * Get passed controls
   */
  async getPassedControls() {
    return this.getResults({ filter: 'pass' })
  },

  /**
   * Get failed controls
   */
  async getFailedControls() {
    return this.getResults({ filter: 'fail' })
  },

  /**
   * Get partial controls
   */
  async getPartialControls() {
    return this.getResults({ filter: 'partial' })
  },

  /**
   * Get unknown controls
   */
  async getUnknownControls() {
    return this.getResults({ filter: 'unknown' })
  }
}

export default realValidationClient
