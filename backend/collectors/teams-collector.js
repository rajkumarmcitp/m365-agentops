/**
 * Teams Collector
 * Collects Microsoft Teams data
 * Feeds 100+ Teams controls
 *
 * API Calls: 10-15 per collection
 */

import { BaseCollector } from '../lib/base-collector.js'

export class TeamsCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('TeamsCollector', { supportsDelta: true, deltaHelper })
  }

  async collect(graphClient, tenantId) {
    this.startTimer()
    console.log('📥 Starting Teams collection...')

    try {
      const [
        teams,
        channels,
        policies,
        settings,
        appSettings,
        deviceSettings,
        guestSettings
      ] = await Promise.allSettled([
        this.getTeams(graphClient),
        this.getChannels(graphClient),
        this.getPolicies(graphClient),
        this.getSettings(graphClient),
        this.getAppSettings(graphClient),
        this.getDeviceSettings(graphClient),
        this.getGuestSettings(graphClient)
      ])

      const data = {
        teams: this.normalizeResult(teams),
        channels: this.normalizeResult(channels),
        policies: this.normalizeResult(policies),
        settings: this.normalizeResult(settings),
        appSettings: this.normalizeResult(appSettings),
        deviceSettings: this.normalizeResult(deviceSettings),
        guestSettings: this.normalizeResult(guestSettings),
        tenantId,
        collectedAt: new Date().toISOString(),
        apiCallCount: this.apiCallCount
      }

      this.recordDataSize(data)
      this.logSummary()

      return data
    } catch (err) {
      console.error('❌ Teams collection failed:', err.message)
      throw err
    }
  }

  async delta(graphClient, tenantId, deltaToken) {
    console.log('⚡ Starting Teams incremental sync...')

    try {
      const changes = {
        teams: await this.deltaHelper.getDeltaPaginated('/teams', { trackToken: true }),
        changes: 0,
        apiCallCount: 1
      }

      changes.changes = changes.teams.itemCount || 0
      return changes
    } catch (err) {
      console.error('❌ Incremental sync failed:', err.message)
      throw err
    }
  }

  async getTeams(graphClient) {
    return this.getPaginatedData(graphClient, '/teams', {
      select: 'id,displayName,createdDateTime,visibility'
    })
  }

  async getChannels(graphClient) {
    return this.queryGraph(graphClient, '/teams?$expand=channels')
  }

  async getPolicies(graphClient) {
    return this.queryGraph(graphClient, '/teamwork/teamsAppSettings')
  }

  async getSettings(graphClient) {
    return this.queryGraph(graphClient, '/teamwork/teamTemplates')
  }

  async getAppSettings(graphClient) {
    return this.queryGraph(graphClient, '/appCatalogs/teamsApps')
  }

  async getDeviceSettings(graphClient) {
    return this.queryGraph(graphClient, '/deviceAppManagement/deviceCompliancePolicies')
  }

  async getGuestSettings(graphClient) {
    return this.queryGraph(graphClient, '/policies/authorizationPolicy')
  }

  normalizeResult(result) {
    if (result.status === 'fulfilled') return result.value || []
    return []
  }

  normalize(rawData) {
    return { ...rawData, normalized: true, version: '1.0' }
  }
}

export default TeamsCollector
