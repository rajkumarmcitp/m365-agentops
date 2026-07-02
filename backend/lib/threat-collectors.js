/**
 * Threat and Security Posture Data Collectors
 *
 * Optimized module-based collectors for threat protection and security controls
 * Covers: Defender configurations, threat policies, secure score
 */

import { unifiedGraphClient } from './graph-client-unified.js'

export class ThreatCollectors {
  constructor() {
    this.cache = {}
  }

  /**
   * Defender for Office 365 Collector
   * Covers: email threat protection, safe links, safe attachments
   */
  async collectDefenderForOffice365() {
    if (this.cache.defenderO365) return this.cache.defenderO365

    try {
      const [policyResponse, linkResponse, attachmentResponse, spoofResponse] = await Promise.all([
        unifiedGraphClient.get('/security/threatIntelligence/policies').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/security/safeLinks/policies').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/security/safeAttachments/policies').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/security/anti-spoofing/policies').catch(e => ({ value: [], error: e.message }))
      ])

      const data = {
        policies: policyResponse.value || [],
        safeLinks: {
          policies: linkResponse.value || [],
          total: linkResponse.value?.length || 0,
          enabled: linkResponse.value?.filter(p => p.enabled === true).length || 0
        },
        safeAttachments: {
          policies: attachmentResponse.value || [],
          total: attachmentResponse.value?.length || 0,
          enabled: attachmentResponse.value?.filter(p => p.enabled === true).length || 0
        },
        antiSpoofing: {
          policies: spoofResponse.value || [],
          total: spoofResponse.value?.length || 0,
          enabled: spoofResponse.value?.filter(p => p.enabled === true).length || 0
        },
        timestamp: new Date().toISOString()
      }

      this.cache.defenderO365 = data
      return data
    } catch (e) {
      console.warn('⚠️ Defender for Office 365 collection failed:', e.message)
      return { policies: [], safeLinks: { total: 0 }, safeAttachments: { total: 0 }, antiSpoofing: { total: 0 }, error: e.message }
    }
  }

  /**
   * Defender for Endpoint Collector
   * Covers: MDE configuration, vulnerability management, threat analytics
   */
  async collectDefenderForEndpoint() {
    if (this.cache.defenderEndpoint) return this.cache.defenderEndpoint

    try {
      const [configResponse, vulnResponse, analyticsResponse, exposureResponse] = await Promise.all([
        unifiedGraphClient.get('/deviceManagement/windowsDefenderAdvancedThreatProtectionConfigurations').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/security/vulnerabilities').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/security/threatAnalytics/reports').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/security/exposureManagement/exposureAreas').catch(e => ({ value: [], error: e.message }))
      ])

      const data = {
        configurations: configResponse.value || [],
        vulnerabilities: {
          total: vulnResponse.value?.length || 0,
          vulnerabilities: vulnResponse.value || [],
          critical: vulnResponse.value?.filter(v => v.severity === 'critical').length || 0,
          high: vulnResponse.value?.filter(v => v.severity === 'high').length || 0
        },
        threatAnalytics: {
          total: analyticsResponse.value?.length || 0,
          reports: analyticsResponse.value || []
        },
        exposureAreas: {
          total: exposureResponse.value?.length || 0,
          areas: exposureResponse.value || []
        },
        timestamp: new Date().toISOString()
      }

      this.cache.defenderEndpoint = data
      return data
    } catch (e) {
      console.warn('⚠️ Defender for Endpoint collection failed:', e.message)
      return { configurations: [], vulnerabilities: { total: 0 }, threatAnalytics: { total: 0 }, error: e.message }
    }
  }

  /**
   * Defender for Cloud Apps Collector
   * Covers: MCAS policies, anomaly detection, app governance
   */
  async collectDefenderForCloudApps() {
    if (this.cache.defenderCloudApps) return this.cache.defenderCloudApps

    try {
      const [policyResponse, ruleResponse, appResponse] = await Promise.all([
        unifiedGraphClient.get('/security/cloudAppSecurity/policies').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/security/cloudAppSecurity/anomalyDetectionRules').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/security/cloudAppSecurity/discoveredApps').catch(e => ({ value: [], error: e.message }))
      ])

      const data = {
        policies: policyResponse.value || [],
        anomalyRules: {
          total: ruleResponse.value?.length || 0,
          enabled: ruleResponse.value?.filter(r => r.enabled === true).length || 0,
          rules: ruleResponse.value || []
        },
        discoveredApps: {
          total: appResponse.value?.length || 0,
          apps: appResponse.value || [],
          sanctionedApps: appResponse.value?.filter(a => a.isSanctioned === true).length || 0,
          unsanctionedApps: appResponse.value?.filter(a => a.isSanctioned === false).length || 0
        },
        timestamp: new Date().toISOString()
      }

      this.cache.defenderCloudApps = data
      return data
    } catch (e) {
      console.warn('⚠️ Defender for Cloud Apps collection failed:', e.message)
      return { policies: [], anomalyRules: { total: 0 }, discoveredApps: { total: 0 }, error: e.message }
    }
  }

  /**
   * Identity Protection Collector
   * Covers: risk detection, risky users, risky sign-ins
   */
  async collectIdentityProtection() {
    if (this.cache.identityProtection) return this.cache.identityProtection

    try {
      const [detectResponse, riskResponse, signInResponse] = await Promise.all([
        unifiedGraphClient.get('/identityProtection/riskDetections').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/identityProtection/riskyUsers').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/identityProtection/riskySignIns').catch(e => ({ value: [], error: e.message }))
      ])

      const detections = detectResponse.value || []
      const riskyUsers = riskResponse.value || []
      const riskySignIns = signInResponse.value || []

      const data = {
        riskDetections: {
          total: detections.length,
          detections: detections,
          byRiskLevel: {
            high: detections.filter(d => d.riskLevel === 'high').length,
            medium: detections.filter(d => d.riskLevel === 'medium').length,
            low: detections.filter(d => d.riskLevel === 'low').length
          }
        },
        riskyUsers: {
          total: riskyUsers.length,
          users: riskyUsers,
          activelyAtRisk: riskyUsers.filter(u => u.isAtRisk === true).length
        },
        riskySignIns: {
          total: riskySignIns.length,
          signIns: riskySignIns,
          byRiskLevel: {
            high: riskySignIns.filter(s => s.riskLevel === 'high').length,
            medium: riskySignIns.filter(s => s.riskLevel === 'medium').length,
            low: riskySignIns.filter(s => s.riskLevel === 'low').length
          }
        },
        timestamp: new Date().toISOString()
      }

      this.cache.identityProtection = data
      return data
    } catch (e) {
      console.warn('⚠️ Identity Protection collection failed:', e.message)
      return { riskDetections: { total: 0 }, riskyUsers: { total: 0 }, riskySignIns: { total: 0 }, error: e.message }
    }
  }

  /**
   * Security Posture and Secure Score Collector
   * Covers: overall security posture, improvement actions
   */
  async collectSecurityPosture() {
    if (this.cache.securityPosture) return this.cache.securityPosture

    try {
      const [scoreResponse, actionsResponse] = await Promise.all([
        unifiedGraphClient.get('/security/secureScores').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/security/secureScoreControlProfiles').catch(e => ({ value: [], error: e.message }))
      ])

      const scores = scoreResponse.value || []
      const controls = actionsResponse.value || []
      const latestScore = scores[0]

      const data = {
        currentScore: latestScore?.currentScore,
        maxScore: latestScore?.maxScore,
        percentComplete: latestScore?.currentScore && latestScore?.maxScore ?
          Math.round((latestScore.currentScore / latestScore.maxScore) * 100) : 0,
        scoreHistory: scores.slice(0, 30),
        controlProfiles: controls,
        improvementActions: controls.filter(c => c.actionType === 'improvement').length,
        managedActions: controls.filter(c => c.managed === true).length,
        timestamp: new Date().toISOString()
      }

      this.cache.securityPosture = data
      return data
    } catch (e) {
      console.warn('⚠️ Security Posture collection failed:', e.message)
      return { currentScore: 0, maxScore: 0, scoreHistory: [], controlProfiles: [], error: e.message }
    }
  }

  /**
   * Incident and Alert Management Collector
   * Covers: security incidents, alerts, response status
   */
  async collectIncidentManagement() {
    if (this.cache.incidents) return this.cache.incidents

    try {
      const [incidentResponse, alertResponse] = await Promise.all([
        unifiedGraphClient.get('/security/incidents').catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/security/alerts').catch(e => ({ value: [], error: e.message }))
      ])

      const incidents = incidentResponse.value || []
      const alerts = alertResponse.value || []

      const data = {
        incidents: {
          total: incidents.length,
          incidents: incidents,
          active: incidents.filter(i => i.status === 'active').length,
          byStatus: {
            active: incidents.filter(i => i.status === 'active').length,
            resolved: incidents.filter(i => i.status === 'resolved').length,
            dismissed: incidents.filter(i => i.status === 'dismissed').length
          }
        },
        alerts: {
          total: alerts.length,
          alerts: alerts,
          byStatus: {
            new: alerts.filter(a => a.status === 'new').length,
            inProgress: alerts.filter(a => a.status === 'inProgress').length,
            resolved: alerts.filter(a => a.status === 'resolved').length
          },
          bySeverity: {
            high: alerts.filter(a => a.severity === 'high').length,
            medium: alerts.filter(a => a.severity === 'medium').length,
            low: alerts.filter(a => a.severity === 'low').length
          }
        },
        timestamp: new Date().toISOString()
      }

      this.cache.incidents = data
      return data
    } catch (e) {
      console.warn('⚠️ Incident Management collection failed:', e.message)
      return { incidents: { total: 0 }, alerts: { total: 0 }, error: e.message }
    }
  }

  /**
   * Collect all threat and security data
   */
  async collectAll() {
    console.log('📊 Starting Threat & Security data collection...')
    const startTime = Date.now()

    const [defenderO365, defenderEndpoint, defenderCloudAppsData, identityProtection, securityPosture, incidents] = await Promise.all([
      this.collectDefenderForOffice365(),
      this.collectDefenderForEndpoint(),
      this.collectDefenderForCloudApps(),
      this.collectIdentityProtection(),
      this.collectSecurityPosture(),
      this.collectIncidentManagement()
    ])

    const duration = Date.now() - startTime
    console.log(`✅ Threat & Security data collection complete in ${duration}ms`)

    return {
      defenderForOffice365: defenderO365,
      defenderForEndpoint: defenderEndpoint,
      defenderForCloudApps: defenderCloudAppsData,
      identityProtection,
      securityPosture,
      incidentManagement: incidents,
      duration,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {}
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    return {
      cached: Object.keys(this.cache),
      count: Object.keys(this.cache).length,
      timestamp: new Date().toISOString()
    }
  }
}

export default ThreatCollectors
