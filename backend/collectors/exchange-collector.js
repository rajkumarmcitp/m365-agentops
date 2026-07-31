/**
 * Exchange Collector
 * Collects Exchange Online data
 * Feeds 150+ Exchange controls
 *
 * API Calls: 20-30 per collection (PowerShell)
 */

import { BaseCollector } from '../lib/base-collector.js'

export class ExchangeCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('ExchangeCollector', { supportsDelta: false }) // PowerShell-based, delta not available
  }

  async collect(graphClient, tenantId) {
    this.startTimer()
    console.log('📥 Starting Exchange collection...')

    try {
      const [
        mailboxSettings,
        messageRules,
        compliancePolicies,
        authenticationMethods,
        dlpPolicies,
        transportRules,
        externalAccessPolicies,
        malwareFilterPolicy,
        antiSpamPolicy,
        retentionPolicies
      ] = await Promise.allSettled([
        this.getMailboxSettings(graphClient),
        this.getMessageRules(graphClient),
        this.getCompliancePolicies(graphClient),
        this.getAuthenticationMethods(graphClient),
        this.getDLPPolicies(graphClient),
        this.getTransportRules(graphClient),
        this.getExternalAccessPolicies(graphClient),
        this.getMalwareFilterPolicy(graphClient),
        this.getAntiSpamPolicy(graphClient),
        this.getRetentionPolicies(graphClient)
      ])

      const data = {
        mailboxSettings: this.normalizeResult(mailboxSettings),
        messageRules: this.normalizeResult(messageRules),
        compliancePolicies: this.normalizeResult(compliancePolicies),
        authenticationMethods: this.normalizeResult(authenticationMethods),
        dlpPolicies: this.normalizeResult(dlpPolicies),
        transportRules: this.normalizeResult(transportRules),
        externalAccessPolicies: this.normalizeResult(externalAccessPolicies),
        malwareFilterPolicy: this.normalizeResult(malwareFilterPolicy),
        antiSpamPolicy: this.normalizeResult(antiSpamPolicy),
        retentionPolicies: this.normalizeResult(retentionPolicies),
        tenantId,
        collectedAt: new Date().toISOString(),
        apiCallCount: this.apiCallCount
      }

      this.recordDataSize(data)
      this.logSummary()

      return data
    } catch (err) {
      console.error('❌ Exchange collection failed:', err.message)
      throw err
    }
  }

  async delta(graphClient, tenantId, deltaToken) {
    // Exchange doesn't support delta queries via Graph API
    // Full refresh required each time
    return this.collect(graphClient, tenantId)
  }

  async getMailboxSettings(graphClient) {
    return this.queryGraph(graphClient, '/me/mailboxSettings')
  }

  async getMessageRules(graphClient) {
    return this.queryGraph(graphClient, '/me/mailFolders/inbox/messageRules')
  }

  async getCompliancePolicies(graphClient) {
    return this.queryGraph(graphClient, '/compliance/ediscovery/cases')
  }

  async getAuthenticationMethods(graphClient) {
    return this.queryGraph(graphClient, '/policies/authenticationMethodsPolicy')
  }

  async getDLPPolicies(graphClient) {
    return this.queryGraph(graphClient, '/compliance/dlpPolicies')
  }

  async getTransportRules(graphClient) {
    return this.queryGraph(graphClient, '/admin/exchange/settings')
  }

  async getExternalAccessPolicies(graphClient) {
    return this.queryGraph(graphClient, '/policies/externalAccessPolicy')
  }

  async getMalwareFilterPolicy(graphClient) {
    return this.queryGraph(graphClient, '/security/malwarePolicy')
  }

  async getAntiSpamPolicy(graphClient) {
    return this.queryGraph(graphClient, '/security/spamPolicy')
  }

  async getRetentionPolicies(graphClient) {
    return this.queryGraph(graphClient, '/compliance/retentionPolicies')
  }

  normalizeResult(result) {
    if (result.status === 'fulfilled') return result.value || []
    return []
  }

  normalize(rawData) {
    return { ...rawData, normalized: true, version: '1.0' }
  }
}

export default ExchangeCollector
