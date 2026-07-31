/**
 * Defender Collector
 * Collects Defender for Endpoint and Cloud security data
 * Feeds 80+ defender controls
 *
 * API Calls: 4-6 per collection
 */

import { BaseCollector } from '../lib/base-collector.js'

export class DefenderCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('DefenderCollector', { supportsDelta: true, deltaHelper })
  }

  async collect(graphClient, tenantId) {
    this.startTimer()
    console.log('📥 Starting Defender collection...')

    try {
      const [alerts, incidents, vulnerabilities, exposures] = await Promise.allSettled([
        this.getAlerts(graphClient),
        this.getIncidents(graphClient),
        this.getVulnerabilities(graphClient),
        this.getExposures(graphClient)
      ])

      const data = {
        alerts: this.normalizeResult(alerts),
        incidents: this.normalizeResult(incidents),
        vulnerabilities: this.normalizeResult(vulnerabilities),
        exposures: this.normalizeResult(exposures),
        tenantId,
        collectedAt: new Date().toISOString(),
        apiCallCount: this.apiCallCount
      }

      this.recordDataSize(data)
      this.logSummary()

      return data
    } catch (err) {
      console.error('❌ Defender collection failed:', err.message)
      throw err
    }
  }

  async delta(graphClient, tenantId, deltaToken) {
    console.log('⚡ Starting Defender incremental sync...')

    try {
      const changes = {
        alerts: await this.deltaHelper.getDeltaPaginated('/security/alerts_v2', { trackToken: true }),
        incidents: await this.deltaHelper.getDeltaPaginated('/security/incidents', { trackToken: true }),
        changes: 0,
        apiCallCount: 2
      }

      changes.changes = (changes.alerts.itemCount || 0) + (changes.incidents.itemCount || 0)

      return changes
    } catch (err) {
      console.error('❌ Incremental sync failed:', err.message)
      throw err
    }
  }

  async getAlerts(graphClient) {
    return this.getPaginatedData(graphClient, '/security/alerts_v2', {
      filter: `createdDateTime gt ${this.getDateDaysAgo(30)}`,
      select: 'id,displayName,severity,status,createdDateTime,lastUpdateDateTime'
    })
  }

  async getIncidents(graphClient) {
    return this.getPaginatedData(graphClient, '/security/incidents', {
      select: 'id,displayName,severity,status,createdDateTime,lastUpdateDateTime'
    })
  }

  async getVulnerabilities(graphClient) {
    return this.queryGraph(graphClient, '/security/vulnerabilities')
  }

  async getExposures(graphClient) {
    return this.queryGraph(graphClient, '/security/exposures')
  }

  getDateDaysAgo(days) {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString()
  }

  normalizeResult(result) {
    if (result.status === 'fulfilled') return result.value || []
    return []
  }

  normalize(rawData) {
    return { ...rawData, normalized: true, version: '1.0' }
  }
}

export default DefenderCollector
