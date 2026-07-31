/**
 * SharePoint Collector
 * Collects SharePoint Online data
 * Feeds 120+ SharePoint controls
 *
 * API Calls: 8-12 per collection
 */

import { BaseCollector } from '../lib/base-collector.js'

export class SharePointCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('SharePointCollector', { supportsDelta: true, deltaHelper })
  }

  async collect(graphClient, tenantId) {
    this.startTimer()
    console.log('📥 Starting SharePoint collection...')

    try {
      const [
        sites,
        drives,
        sharingSettings,
        searchConfiguration,
        compliance,
        fileAccessRequests
      ] = await Promise.allSettled([
        this.getSites(graphClient),
        this.getDrives(graphClient),
        this.getSharingSettings(graphClient),
        this.getSearchConfiguration(graphClient),
        this.getComplianceSettings(graphClient),
        this.getFileAccessRequests(graphClient)
      ])

      const data = {
        sites: this.normalizeResult(sites),
        drives: this.normalizeResult(drives),
        sharingSettings: this.normalizeResult(sharingSettings),
        searchConfiguration: this.normalizeResult(searchConfiguration),
        compliance: this.normalizeResult(compliance),
        fileAccessRequests: this.normalizeResult(fileAccessRequests),
        tenantId,
        collectedAt: new Date().toISOString(),
        apiCallCount: this.apiCallCount
      }

      this.recordDataSize(data)
      this.logSummary()

      return data
    } catch (err) {
      console.error('❌ SharePoint collection failed:', err.message)
      throw err
    }
  }

  async delta(graphClient, tenantId, deltaToken) {
    console.log('⚡ Starting SharePoint incremental sync...')

    try {
      const changes = {
        sites: await this.deltaHelper.getDeltaPaginated('/sites', { trackToken: true }),
        changes: 0,
        apiCallCount: 1
      }

      changes.changes = changes.sites.itemCount || 0
      return changes
    } catch (err) {
      console.error('❌ Incremental sync failed:', err.message)
      throw err
    }
  }

  async getSites(graphClient) {
    return this.getPaginatedData(graphClient, '/sites', {
      select: 'id,displayName,webUrl,createdDateTime,lastModifiedDateTime'
    })
  }

  async getDrives(graphClient) {
    return this.queryGraph(graphClient, '/drives')
  }

  async getSharingSettings(graphClient) {
    return this.queryGraph(graphClient, '/admin/sharepoint/settings')
  }

  async getSearchConfiguration(graphClient) {
    return this.queryGraph(graphClient, '/search/qna')
  }

  async getComplianceSettings(graphClient) {
    return this.queryGraph(graphClient, '/compliance/ediscovery/cases')
  }

  async getFileAccessRequests(graphClient) {
    return this.queryGraph(graphClient, '/me/pendingAccessReviews')
  }

  normalizeResult(result) {
    if (result.status === 'fulfilled') return result.value || []
    return []
  }

  normalize(rawData) {
    return { ...rawData, normalized: true, version: '1.0' }
  }
}

export default SharePointCollector
