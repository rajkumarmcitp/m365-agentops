/**
 * Data Service - Handles all persistent data operations
 * Manages: Settings, Attestations, Agent Logs, Dashboard Cache, User Session
 */

import { getDatabase } from './database.js'

export class DataService {
  constructor() {
    this.db = getDatabase()
  }

  // ============================================================
  // User Settings
  // ============================================================

  async saveSetting(key, value) {
    const id = `setting-${key}`
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value)

    await this.db.prepare(`
      INSERT OR REPLACE INTO user_settings (id, setting_key, setting_value, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).run(id, key, valueStr)
  }

  async getSetting(key, defaultValue = null) {
    const result = await this.db.prepare(`
      SELECT setting_value FROM user_settings WHERE setting_key = ?
    `).get(key)

    if (!result) return defaultValue

    try {
      return JSON.parse(result.setting_value)
    } catch {
      return result.setting_value
    }
  }

  async getAllSettings() {
    const results = await this.db.prepare(`
      SELECT setting_key, setting_value FROM user_settings
    `).all()

    const settings = {}
    results.forEach(row => {
      try {
        settings[row.setting_key] = JSON.parse(row.setting_value)
      } catch {
        settings[row.setting_key] = row.setting_value
      }
    })
    return settings
  }

  async saveAllSettings(settingsObj) {
    for (const [key, value] of Object.entries(settingsObj)) {
      await this.saveSetting(key, value)
    }
  }

  // ============================================================
  // M365 Config Attestations
  // ============================================================

  async saveAttestation(controlId, status, result, notes = '', attestedBy = '') {
    const id = `attestation-${controlId}`

    await this.db.prepare(`
      INSERT OR REPLACE INTO m365_attestations
      (id, control_id, status, result, notes, attested_by, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(id, controlId, status, result, notes, attestedBy)
  }

  async getAttestation(controlId) {
    return await this.db.prepare(`
      SELECT * FROM m365_attestations WHERE control_id = ?
    `).get(controlId)
  }

  async getAllAttestations() {
    return await this.db.prepare(`
      SELECT * FROM m365_attestations ORDER BY updated_at DESC
    `).all()
  }

  async saveAllAttestations(attestationsObj) {
    for (const [controlId, attestation] of Object.entries(attestationsObj)) {
      await this.saveAttestation(
        controlId,
        attestation.status,
        attestation.result,
        attestation.notes,
        attestation.attestedBy
      )
    }
  }

  // ============================================================
  // Agent Logs
  // ============================================================

  async saveAgentLog(jobName, schedule, status, details = {}) {
    const id = `agent-${Date.now()}`

    await this.db.prepare(`
      INSERT INTO agent_logs
      (id, job_name, schedule, start_time, end_time, status, controls_checked, failures_found, new_failures, logs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      jobName,
      schedule,
      new Date().toISOString(),
      details.endTime || null,
      status,
      details.controlsChecked || 0,
      details.failuresFound || 0,
      details.newFailures || 0,
      JSON.stringify(details)
    )

    return id
  }

  async getAgentLogs(limit = 100) {
    return await this.db.prepare(`
      SELECT * FROM agent_logs ORDER BY start_time DESC LIMIT ?
    `).all(limit)
  }

  async getAgentLogById(id) {
    return await this.db.prepare(`
      SELECT * FROM agent_logs WHERE id = ?
    `).get(id)
  }

  // ============================================================
  // Dashboard Cache
  // ============================================================

  async saveDashboardData(dataType, dataKey, data) {
    const id = `dashboard-${dataType}-${dataKey}`
    const dataStr = typeof data === 'string' ? data : JSON.stringify(data)

    await this.db.prepare(`
      INSERT OR REPLACE INTO dashboard_cache
      (id, data_type, data_key, data_value, last_synced, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(id, dataType, dataKey, dataStr)
  }

  async getDashboardData(dataType, dataKey) {
    const result = await this.db.prepare(`
      SELECT data_value FROM dashboard_cache
      WHERE data_type = ? AND data_key = ?
    `).get(dataType, dataKey)

    if (!result) return null

    try {
      return JSON.parse(result.data_value)
    } catch {
      return result.data_value
    }
  }

  async getDashboardDataByType(dataType) {
    const results = await this.db.prepare(`
      SELECT data_key, data_value FROM dashboard_cache WHERE data_type = ?
    `).all(dataType)

    const data = {}
    results.forEach(row => {
      try {
        data[row.data_key] = JSON.parse(row.data_value)
      } catch {
        data[row.data_key] = row.data_value
      }
    })
    return data
  }

  async clearDashboardCache(dataType) {
    await this.db.prepare(`
      DELETE FROM dashboard_cache WHERE data_type = ?
    `).run(dataType)
  }

  // ============================================================
  // User Session
  // ============================================================

  async saveUserSession(userId, userName, userEmail, userRole) {
    const id = `session-current`

    await this.db.prepare(`
      INSERT OR REPLACE INTO user_session
      (id, user_id, user_name, user_email, user_role, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(id, userId, userName, userEmail, userRole)
  }

  async getUserSession() {
    return await this.db.prepare(`
      SELECT * FROM user_session WHERE id = 'session-current'
    `).get()
  }

  async clearUserSession() {
    await this.db.prepare(`
      DELETE FROM user_session WHERE id = 'session-current'
    `).run()
  }

  // ============================================================
  // Bulk Operations
  // ============================================================

  async exportAllData() {
    return {
      settings: await this.getAllSettings(),
      attestations: await this.getAllAttestations(),
      agentLogs: await this.getAgentLogs(1000),
      dashboard: await this.getDashboardDataByType('all'),
      session: await this.getUserSession()
    }
  }

  async importData(data) {
    if (data.settings) await this.saveAllSettings(data.settings)
    if (data.attestations) {
      const attestObj = {}
      data.attestations.forEach(att => {
        attestObj[att.control_id] = {
          status: att.status,
          result: att.result,
          notes: att.notes,
          attestedBy: att.attested_by
        }
      })
      await this.saveAllAttestations(attestObj)
    }
    if (data.session) {
      await this.saveUserSession(
        data.session.user_id,
        data.session.user_name,
        data.session.user_email,
        data.session.user_role
      )
    }
  }
}

export function getDataService() {
  return new DataService()
}
