// ============================================================
// Real Controls Service
// Manages actual compliance controls from frameworks
// ============================================================

export class RealControlsService {
  constructor(database) {
    this.db = database
  }

  /**
   * Get controls for a specific domain
   */
  async getControlsByDomain(domain) {
    if (!this.db) {
      console.warn('Database not available, returning empty array')
      return []
    }

    try {
      const query = `
        SELECT
          control_id,
          title,
          description,
          framework,
          severity,
          domain,
          validation_method,
          graph_api_queries,
          powershell_commands,
          expected_values,
          remediation_steps
        FROM compliance_controls
        WHERE domain = $1
        ORDER BY control_id
      `

      const result = await this.db.query(query, [domain])
      return result.rows || []
    } catch (error) {
      console.error(`Error fetching controls for domain ${domain}:`, error.message)
      return []
    }
  }

  /**
   * Get all controls for a framework
   */
  async getControlsByFramework(framework) {
    if (!this.db) return []

    try {
      const query = `
        SELECT
          control_id,
          title,
          description,
          framework,
          severity,
          domain,
          validation_method
        FROM compliance_controls
        WHERE framework = $1
        ORDER BY control_id
      `

      const result = await this.db.query(query, [framework])
      return result.rows || []
    } catch (error) {
      console.error(`Error fetching controls for framework ${framework}:`, error.message)
      return []
    }
  }

  /**
   * Get a specific control by ID
   */
  async getControl(controlId) {
    if (!this.db) return null

    try {
      const query = `
        SELECT *
        FROM compliance_controls
        WHERE control_id = $1
      `

      const result = await this.db.query(query, [controlId])
      return result.rows?.[0] || null
    } catch (error) {
      console.error(`Error fetching control ${controlId}:`, error.message)
      return null
    }
  }

  /**
   * Get validation results for a control
   */
  async getValidationResults(tenantId, controlId, limit = 10) {
    if (!this.db) return []

    try {
      const query = `
        SELECT
          id,
          control_id,
          status,
          score,
          details,
          validated_at
        FROM control_validations
        WHERE tenant_id = $1 AND control_id = $2
        ORDER BY validated_at DESC
        LIMIT $3
      `

      const result = await this.db.query(query, [tenantId, controlId, limit])
      return result.rows || []
    } catch (error) {
      console.error(`Error fetching validation results:`, error.message)
      return []
    }
  }

  /**
   * Record validation result
   */
  async recordValidation(tenantId, controlId, status, score, details) {
    if (!this.db) return null

    try {
      const query = `
        INSERT INTO control_validations
        (tenant_id, control_id, status, score, details, validated_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        RETURNING *
      `

      const result = await this.db.query(query, [
        tenantId,
        controlId,
        status,
        score,
        JSON.stringify(details)
      ])

      return result.rows?.[0] || null
    } catch (error) {
      console.error('Error recording validation:', error.message)
      return null
    }
  }

  /**
   * Get domain statistics
   */
  async getDomainStats(domain) {
    if (!this.db) return null

    try {
      const query = `
        SELECT
          domain,
          COUNT(*) as total_controls,
          SUM(CASE WHEN severity = 'Critical' THEN 1 ELSE 0 END) as critical_count,
          SUM(CASE WHEN severity = 'High' THEN 1 ELSE 0 END) as high_count,
          SUM(CASE WHEN severity = 'Medium' THEN 1 ELSE 0 END) as medium_count,
          SUM(CASE WHEN severity = 'Low' THEN 1 ELSE 0 END) as low_count
        FROM compliance_controls
        WHERE domain = $1
        GROUP BY domain
      `

      const result = await this.db.query(query, [domain])
      return result.rows?.[0] || null
    } catch (error) {
      console.error(`Error fetching domain stats:`, error.message)
      return null
    }
  }

  /**
   * Get all domains
   */
  async getAllDomains() {
    if (!this.db) return []

    try {
      const query = `
        SELECT DISTINCT
          domain,
          COUNT(*) as control_count
        FROM compliance_controls
        GROUP BY domain
        ORDER BY domain
      `

      const result = await this.db.query(query)
      return result.rows || []
    } catch (error) {
      console.error('Error fetching domains:', error.message)
      return []
    }
  }

  /**
   * Search controls by title or description
   */
  async searchControls(keyword, framework = null) {
    if (!this.db) return []

    try {
      let query = `
        SELECT
          control_id,
          title,
          description,
          framework,
          domain,
          severity
        FROM compliance_controls
        WHERE (title ILIKE $1 OR description ILIKE $1)
      `

      const params = [`%${keyword}%`]

      if (framework) {
        query += ` AND framework = $${params.length + 1}`
        params.push(framework)
      }

      query += ` ORDER BY control_id`

      const result = await this.db.query(query, params)
      return result.rows || []
    } catch (error) {
      console.error('Error searching controls:', error.message)
      return []
    }
  }

  /**
   * Get controls needing validation
   */
  async getControlsNeedingValidation(tenantId, framework = null) {
    if (!this.db) return []

    try {
      let query = `
        SELECT DISTINCT c.*
        FROM compliance_controls c
        LEFT JOIN control_validations v ON c.control_id = v.control_id
          AND v.tenant_id = $1
        WHERE v.id IS NULL OR v.validated_at < NOW() - INTERVAL '1 day'
      `

      const params = [tenantId]

      if (framework) {
        query += ` AND c.framework = $${params.length + 1}`
        params.push(framework)
      }

      query += ` ORDER BY c.severity DESC, c.control_id`

      const result = await this.db.query(query, params)
      return result.rows || []
    } catch (error) {
      console.error('Error fetching controls needing validation:', error.message)
      return []
    }
  }
}

export function createRealControlsService(database) {
  return new RealControlsService(database)
}
