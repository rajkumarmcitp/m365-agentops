// ============================================================
// M365 Control Validation Engine
// Validates controls from the Universal Control Catalog
// ============================================================

export class M365ControlValidationEngine {
  constructor(db, graphClient) {
    this.db = db
    this.graphClient = graphClient
  }

  /**
   * Get control definition from catalog
   */
  async getControlDefinition(controlId) {
    const result = await this.db.query(
      `SELECT * FROM m365_control_catalog WHERE control_id = $1`,
      [controlId]
    )
    return result.rows[0]
  }

  /**
   * Get all active controls
   */
  async getAllControls() {
    const result = await this.db.query(
      `SELECT * FROM m365_control_catalog ORDER BY domain, control_id`
    )
    return result.rows
  }

  /**
   * Get controls by domain
   */
  async getControlsByDomain(domain) {
    const result = await this.db.query(
      `SELECT * FROM m365_control_catalog WHERE domain = $1 ORDER BY control_id`,
      [domain]
    )
    return result.rows
  }

  /**
   * Validate a single control
   */
  async validateControl(controlId, tenantId) {
    const control = await this.getControlDefinition(controlId)

    if (!control) {
      throw new Error(`Control not found: ${controlId}`)
    }

    try {
      console.log(`🔍 Validating ${controlId}: ${control.control_name}`)

      let result
      if (control.validation_engine === 'Graph API') {
        result = await this.validateViaGraphAPI(control)
      } else if (control.validation_engine === 'PowerShell') {
        result = await this.validateViaPowerShell(control)
      } else {
        throw new Error(`Unsupported validation engine: ${control.validation_engine}`)
      }

      // Determine status
      const status = this.evaluateStatus(result.actualValue, control.expected_value)

      // Store result
      const resultId = await this.db.query(
        `INSERT INTO m365_control_results (
          control_id, tenant_id, status, confidence, current_value,
          expected_value, data_source, validated_at, validated_by, api_version
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id`,
        [
          control.id,
          tenantId,
          status,
          result.confidence || 100,
          JSON.stringify(result.actualValue),
          control.expected_value,
          control.validation_engine,
          new Date(),
          'system',
          result.apiVersion || '1.0'
        ]
      )

      const resultId_uuid = resultId.rows[0].id

      // Store evidence
      await this.db.query(
        `INSERT INTO m365_control_evidence (
          result_id, endpoint, method, raw_response, evaluated_property,
          evaluated_value, evaluation_logic, evaluation_result, timestamp, api_version
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          resultId_uuid,
          result.endpoint,
          result.method || 'GET',
          JSON.stringify(result.rawResponse),
          control.graph_property,
          JSON.stringify(result.actualValue),
          control.validation_logic,
          status === 'Pass',
          new Date(),
          result.apiVersion || '1.0'
        ]
      )

      console.log(`✅ ${controlId}: ${status}`)

      return {
        controlId: control.control_id,
        status,
        confidence: result.confidence || 100,
        evidence: {
          actualValue: result.actualValue,
          expectedValue: control.expected_value,
          endpoint: result.endpoint,
          timestamp: new Date()
        }
      }
    } catch (error) {
      console.error(`❌ ${controlId}: ${error.message}`)

      // Store error state
      await this.db.query(
        `INSERT INTO m365_control_results (
          control_id, tenant_id, status, confidence, data_source, validated_at
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          control.id,
          tenantId,
          'Error',
          0,
          control.validation_engine,
          new Date()
        ]
      )

      return {
        controlId: control.control_id,
        status: 'Error',
        error: error.message,
        confidence: 0
      }
    }
  }

  /**
   * Validate via Graph API
   */
  async validateViaGraphAPI(control) {
    if (!this.graphClient) {
      throw new Error('Graph Client not initialized')
    }

    try {
      const response = await this.graphClient.api(control.graph_endpoint).get()

      // Extract the evaluated property
      const actualValue = this.getNestedProperty(response, control.graph_property)

      return {
        endpoint: control.graph_endpoint,
        method: 'GET',
        rawResponse: response,
        actualValue,
        apiVersion: '1.0',
        confidence: 100
      }
    } catch (error) {
      throw new Error(`Graph API call failed: ${error.message}`)
    }
  }

  /**
   * Validate via PowerShell (placeholder)
   */
  async validateViaPowerShell(control) {
    throw new Error('PowerShell validation not yet implemented')
  }

  /**
   * Get nested property from object
   */
  getNestedProperty(obj, path) {
    if (!path) return obj

    const parts = path.split('.')
    let current = obj

    for (const part of parts) {
      if (current === null || current === undefined) return null

      // Handle array indexing (e.g., "members[0].name")
      if (part.includes('[')) {
        const [key, index] = part.split(/[\[\]]/).filter(p => p)
        current = current[key]
        if (Array.isArray(current)) {
          current = current[parseInt(index) || 0]
        }
      } else {
        current = current[part]
      }
    }

    return current
  }

  /**
   * Evaluate if actual value meets expected value
   */
  evaluateStatus(actualValue, expectedValue) {
    if (actualValue === null || actualValue === undefined) {
      return 'Fail'
    }

    // Handle different comparison types
    if (expectedValue === 'true' || expectedValue === true) {
      return actualValue === true || actualValue === 'true' ? 'Pass' : 'Fail'
    }

    if (expectedValue === 'false' || expectedValue === false) {
      return actualValue === false || actualValue === 'false' ? 'Pass' : 'Fail'
    }

    if (expectedValue.includes('>=')) {
      const target = parseInt(expectedValue.split('>=')[1])
      return parseInt(actualValue) >= target ? 'Pass' : 'Fail'
    }

    if (expectedValue.includes('>')) {
      const target = parseInt(expectedValue.split('>')[1])
      return parseInt(actualValue) > target ? 'Pass' : 'Fail'
    }

    if (expectedValue.includes('<=')) {
      const target = parseInt(expectedValue.split('<=')[1])
      return parseInt(actualValue) <= target ? 'Pass' : 'Fail'
    }

    if (expectedValue.includes('<')) {
      const target = parseInt(expectedValue.split('<')[1])
      return parseInt(actualValue) < target ? 'Pass' : 'Fail'
    }

    if (expectedValue.includes('contains')) {
      const target = expectedValue.split('contains')[1].trim()
      return Array.isArray(actualValue)
        ? actualValue.some(v => v.includes(target))
        : actualValue.includes(target)
    }

    if (expectedValue === 'not null') {
      return actualValue !== null && actualValue !== undefined ? 'Pass' : 'Fail'
    }

    // Direct equality
    return actualValue.toString() === expectedValue ? 'Pass' : 'Fail'
  }

  /**
   * Validate all controls in a domain
   */
  async validateDomain(domain, tenantId) {
    const controls = await this.getControlsByDomain(domain)
    const results = []

    console.log(`\n🔄 Validating domain ${domain} (${controls.length} controls)...`)

    for (const control of controls) {
      try {
        const result = await this.validateControl(control.control_id, tenantId)
        results.push(result)
      } catch (e) {
        console.error(`Failed to validate ${control.control_id}: ${e.message}`)
        results.push({
          controlId: control.control_id,
          status: 'Error',
          error: e.message,
          confidence: 0
        })
      }
    }

    return results
  }

  /**
   * Validate all controls
   */
  async validateAllControls(tenantId) {
    const allControls = await this.getAllControls()
    const results = []
    const domains = [...new Set(allControls.map(c => c.domain))]

    console.log(`\n🚀 Validating all controls (${allControls.length} total)...`)

    for (const domain of domains) {
      const domainResults = await this.validateDomain(domain, tenantId)
      results.push(...domainResults)
    }

    // Create compliance snapshot
    await this.createComplianceSnapshot(tenantId, results)

    // Detect drift
    await this.detectDrift(tenantId)

    console.log(`\n✅ Validation complete: ${results.length} controls`)

    return results
  }

  /**
   * Create compliance snapshot
   */
  async createComplianceSnapshot(tenantId, results) {
    const passed = results.filter(r => r.status === 'Pass').length
    const failed = results.filter(r => r.status === 'Fail').length
    const partial = results.filter(r => r.status === 'Partial').length
    const unknown = results.filter(r => r.status === 'Unknown').length
    const total = results.length

    // Calculate weighted score
    const scores = await this.db.query(
      `SELECT
        SUM(CASE WHEN mcr.status = 'Pass' THEN mcc.risk_weight ELSE 0 END) as earned,
        SUM(mcc.risk_weight) as total
       FROM m365_control_results mcr
       JOIN m365_control_catalog mcc ON mcr.control_id = mcc.id
       WHERE mcr.tenant_id = $1
       AND mcr.created_at >= NOW() - INTERVAL '1 hour'`,
      [tenantId]
    )

    const earned = scores.rows[0]?.earned || 0
    const totalPoints = scores.rows[0]?.total || 1
    const complianceScore = (earned / totalPoints) * 100

    await this.db.query(
      `INSERT INTO m365_compliance_snapshots (
        tenant_id, snapshot_date, total_controls, passed_controls, failed_controls,
        partial_controls, unknown_controls, total_risk_points, earned_risk_points, compliance_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        tenantId,
        new Date(),
        total,
        passed,
        failed,
        partial,
        unknown,
        totalPoints,
        earned,
        Math.round(complianceScore * 100) / 100
      ]
    )

    console.log(`📊 Compliance snapshot: ${complianceScore.toFixed(2)}% (${passed}/${total} controls)`)
  }

  /**
   * Detect compliance drift
   */
  async detectDrift(tenantId) {
    const latestResults = await this.db.query(
      `SELECT DISTINCT ON (control_id)
        control_id, status, validated_at
       FROM m365_control_results
       WHERE tenant_id = $1
       ORDER BY control_id, validated_at DESC`,
      [tenantId]
    )

    const previousResults = await this.db.query(
      `SELECT DISTINCT ON (control_id)
        control_id, status, validated_at
       FROM m365_control_results
       WHERE tenant_id = $1
       AND validated_at < (
         SELECT MAX(validated_at) FROM m365_control_results WHERE tenant_id = $1
       )
       ORDER BY control_id, validated_at DESC`,
      [tenantId]
    )

    const driftEvents = []

    for (const latest of latestResults.rows) {
      const previous = previousResults.rows.find(p => p.control_id === latest.control_id)

      if (previous && previous.status !== latest.status) {
        let driftReason = 'Status Changed'
        if (previous.status === 'Pass' && latest.status === 'Fail') {
          driftReason = 'Regression'
        } else if (previous.status === 'Fail' && latest.status === 'Pass') {
          driftReason = 'Remediated'
        }

        const controlDef = await this.getControlDefinition(
          (await this.db.query('SELECT control_id FROM m365_control_catalog WHERE id = $1', [latest.control_id])).rows[0]?.control_id
        )

        driftEvents.push({
          tenant_id: tenantId,
          control_id: latest.control_id,
          previous_status: previous.status,
          new_status: latest.status,
          changed_at: latest.validated_at,
          drift_reason: driftReason,
          severity: controlDef?.severity
        })
      }
    }

    // Insert drift events
    for (const event of driftEvents) {
      await this.db.query(
        `INSERT INTO m365_compliance_drift (
          tenant_id, control_id, previous_status, new_status, changed_at,
          drift_reason, severity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          event.tenant_id,
          event.control_id,
          event.previous_status,
          event.new_status,
          event.changed_at,
          event.drift_reason,
          event.severity
        ]
      )
    }

    if (driftEvents.length > 0) {
      console.log(`⚠️ Detected ${driftEvents.length} drift events`)
    }

    return driftEvents
  }
}
