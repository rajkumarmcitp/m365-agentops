/**
 * Conditional Access Collector
 * Collects CA policies and related data
 * Feeds 100+ conditional access controls
 *
 * API Calls: 3-5 per full collection
 * Delta Queries: Supported
 */

import { BaseCollector } from '../lib/base-collector.js'

export class ConditionalAccessCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('ConditionalAccessCollector', { supportsDelta: true, deltaHelper })
  }

  async collect(graphClient, tenantId) {
    this.startTimer()
    console.log('📥 Starting Conditional Access collection...')

    try {
      const [
        caPolicies,
        namedLocations,
        authStrengthPolicies,
        riskDetections
      ] = await Promise.allSettled([
        this.getCAPolicies(graphClient),
        this.getNamedLocations(graphClient),
        this.getAuthenticationStrengthPolicies(graphClient),
        this.getRiskDetections(graphClient)
      ])

      const data = {
        policies: this.normalizeResult(caPolicies),
        namedLocations: this.normalizeResult(namedLocations),
        authenticationStrengthPolicies: this.normalizeResult(authStrengthPolicies),
        riskDetections: this.normalizeResult(riskDetections),
        tenantId,
        collectedAt: new Date().toISOString(),
        apiCallCount: this.apiCallCount
      }

      this.recordDataSize(data)
      this.logSummary()

      return data
    } catch (err) {
      console.error('❌ Conditional Access collection failed:', err.message)
      throw err
    }
  }

  async delta(graphClient, tenantId, deltaToken) {
    console.log('⚡ Starting Conditional Access incremental sync...')

    try {
      const changes = {
        policies: await this.deltaHelper.getDeltaPaginated('/identity/conditionalAccess/policies', { trackToken: true }),
        namedLocations: await this.deltaHelper.getDeltaPaginated('/identity/conditionalAccess/namedLocations', { trackToken: true }),
        changes: 0,
        apiCallCount: 2
      }

      changes.changes =
        (changes.policies.itemCount || 0) +
        (changes.namedLocations.itemCount || 0)

      return changes
    } catch (err) {
      console.error('❌ Incremental sync failed:', err.message)
      throw err
    }
  }

  async getCAPolicies(graphClient) {
    return this.getPaginatedData(graphClient, '/identity/conditionalAccess/policies', {
      select: 'id,displayName,state,conditions,grantControls,sessionControls,createdDateTime'
    })
  }

  async getNamedLocations(graphClient) {
    return this.getPaginatedData(graphClient, '/identity/conditionalAccess/namedLocations', {
      select: 'id,displayName,createdDateTime'
    })
  }

  async getAuthenticationStrengthPolicies(graphClient) {
    return this.queryGraph(graphClient, '/policies/authenticationStrengthPolicies')
  }

  async getRiskDetections(graphClient) {
    return this.getPaginatedData(graphClient, '/identityProtection/riskDetections', {
      filter: `detectedDateTime gt ${this.getDateDaysAgo(30)}`,
      select: 'id,riskType,riskLevel,userDisplayName,userPrincipalName,detectedDateTime',
      top: 100
    })
  }

  getDateDaysAgo(days) {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString()
  }

  normalizeResult(result) {
    if (result.status === 'fulfilled') {
      return result.value || []
    }
    return []
  }

  normalize(rawData) {
    return { ...rawData, normalized: true, version: '1.0' }
  }
}

export default ConditionalAccessCollector
