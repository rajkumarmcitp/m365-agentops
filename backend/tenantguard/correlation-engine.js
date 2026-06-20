/**
 * TenantGuard Correlation Engine
 * Multi-strategy alert correlation and attack pattern detection
 */

import { getDatabase } from './database.js'
import { v4 as uuid } from 'uuid'

export class CorrelationEngine {
  constructor() {
    this.db = getDatabase()
    this.timeWindow = 3600000 // 1 hour in ms
    this.minAlertThreshold = 2 // Minimum alerts to correlate
  }

  /**
   * Run full correlation analysis
   */
  analyzeAlerts() {
    console.log('🔗 Starting correlation analysis...')

    try {
      // Get all non-dismissed alerts from last 24 hours
      const alerts = this.db.prepare(`
        SELECT * FROM alerts
        WHERE dismissed = 0
        AND action_timestamp > datetime('now', '-24 hours')
        ORDER BY action_timestamp DESC
      `).all()

      console.log(`📊 Analyzing ${alerts.length} alerts`)

      if (alerts.length < this.minAlertThreshold) {
        console.log('ℹ️ Not enough alerts for correlation')
        return
      }

      // Clear old correlations (keep last 7 days)
      this.db.prepare(`
        DELETE FROM alert_correlations
        WHERE created_at < datetime('now', '-7 days')
      `).run()

      // Run correlation strategies
      const correlations = []

      // 1. Actor-based correlation
      this.findActorCorrelations(alerts).forEach(c => correlations.push(c))

      // 2. Target-based correlation
      this.findTargetCorrelations(alerts).forEach(c => correlations.push(c))

      // 3. Temporal correlation
      this.findTemporalCorrelations(alerts).forEach(c => correlations.push(c))

      // 4. Attack pattern correlation
      this.findAttackPatterns(alerts).forEach(c => correlations.push(c))

      // Save correlations
      let saved = 0
      correlations.forEach(corr => {
        if (this.saveCorrelation(corr)) saved++
      })

      console.log(`✅ Found and saved ${saved} correlations`)
      return correlations
    } catch (error) {
      console.error('❌ Correlation analysis failed:', error.message)
    }
  }

  /**
   * STRATEGY 1: Find alerts from same actor (user behavior)
   */
  findActorCorrelations(alerts) {
    const correlations = []
    const actorGroups = {}

    // Group by actor
    alerts.forEach(alert => {
      const actor = alert.actor || 'System'
      if (!actorGroups[actor]) actorGroups[actor] = []
      actorGroups[actor].push(alert)
    })

    // Analyze each actor's alerts
    Object.entries(actorGroups).forEach(([actor, actorAlerts]) => {
      if (actorAlerts.length < this.minAlertThreshold) return

      // Sort by timestamp
      actorAlerts.sort((a, b) => new Date(b.action_timestamp) - new Date(a.action_timestamp))

      // Check if alerts are within time window
      const timeSpan = new Date(actorAlerts[0].action_timestamp) -
                       new Date(actorAlerts[actorAlerts.length - 1].action_timestamp)

      if (timeSpan > this.timeWindow) return

      // Calculate severity breakdown
      const criticalCount = actorAlerts.filter(a => a.severity === 'CRITICAL').length
      const highCount = actorAlerts.filter(a => a.severity === 'HIGH').length

      if (criticalCount > 0 || highCount >= 2) {
        const score = this.calculateActorRisk(actorAlerts)

        correlations.push({
          id: uuid(),
          correlation_type: 'ACTOR',
          alert_ids: actorAlerts.map(a => a.id).join(','),
          actor: actor,
          target: null,
          start_timestamp: actorAlerts[actorAlerts.length - 1].action_timestamp,
          end_timestamp: actorAlerts[0].action_timestamp,
          alert_count: actorAlerts.length,
          correlation_score: score,
          pattern_type: this.identifyActorPattern(actorAlerts),
          risk_level: score >= 85 ? 'CRITICAL' : score >= 70 ? 'HIGH' : 'MEDIUM',
          description: `${actor} performed ${actorAlerts.length} risky actions in ${Math.round(timeSpan / 60000)} minutes`,
          metadata: JSON.stringify({
            severity_breakdown: { critical: criticalCount, high: highCount },
            avg_score: Math.round(actorAlerts.reduce((a, b) => a + b.score, 0) / actorAlerts.length),
            time_span_minutes: Math.round(timeSpan / 60000)
          })
        })
      }
    })

    return correlations
  }

  /**
   * STRATEGY 2: Find alerts targeting same resource
   */
  findTargetCorrelations(alerts) {
    const correlations = []
    const targetGroups = {}

    alerts.forEach(alert => {
      let target = null
      const desc = (alert.description || '').toLowerCase()
      const headline = (alert.headline || '').toLowerCase()

      // Extract target from description/headline
      if (desc.includes('mailbox') || headline.includes('mailbox')) target = 'MAILBOX'
      else if (desc.includes('policy') || headline.includes('policy')) target = 'POLICY'
      else if (desc.includes('user ') || headline.includes('user ')) target = 'USER'
      else if (desc.includes('group ') || headline.includes('group ')) target = 'GROUP'
      else if (desc.includes('role') || headline.includes('role')) target = 'ROLE'

      if (!target) return

      if (!targetGroups[target]) targetGroups[target] = []
      targetGroups[target].push(alert)
    })

    Object.entries(targetGroups).forEach(([target, targetAlerts]) => {
      if (targetAlerts.length < this.minAlertThreshold) return

      targetAlerts.sort((a, b) => new Date(b.action_timestamp) - new Date(a.action_timestamp))
      const score = this.calculateTargetRisk(targetAlerts)

      correlations.push({
        id: uuid(),
        correlation_type: 'TARGET',
        alert_ids: targetAlerts.map(a => a.id).join(','),
        actor: null,
        target: target,
        start_timestamp: targetAlerts[targetAlerts.length - 1].action_timestamp,
        end_timestamp: targetAlerts[0].action_timestamp,
        alert_count: targetAlerts.length,
        correlation_score: score,
        pattern_type: `${target}_MANIPULATION`,
        risk_level: score >= 85 ? 'CRITICAL' : score >= 70 ? 'HIGH' : 'MEDIUM',
        description: `Multiple actions targeting ${target} detected - possible resource compromise`,
        metadata: JSON.stringify({ target_type: target, alert_count: targetAlerts.length })
      })
    })

    return correlations
  }

  /**
   * STRATEGY 3: Find alerts clustered in time (burst activity)
   */
  findTemporalCorrelations(alerts) {
    const correlations = []

    if (alerts.length < this.minAlertThreshold) return correlations

    alerts.sort((a, b) => new Date(b.action_timestamp) - new Date(a.action_timestamp))

    const clusters = []
    let currentCluster = [alerts[0]]

    for (let i = 1; i < alerts.length; i++) {
      const timeDiff = new Date(currentCluster[0].action_timestamp) -
                       new Date(alerts[i].action_timestamp)

      if (timeDiff < this.timeWindow) {
        currentCluster.push(alerts[i])
      } else {
        if (currentCluster.length >= this.minAlertThreshold) {
          clusters.push(currentCluster)
        }
        currentCluster = [alerts[i]]
      }
    }

    // Add last cluster
    if (currentCluster.length >= this.minAlertThreshold) {
      clusters.push(currentCluster)
    }

    clusters.forEach(cluster => {
      const criticalCount = cluster.filter(a => a.severity === 'CRITICAL').length
      const avgScore = Math.round(cluster.reduce((a, b) => a + b.score, 0) / cluster.length)

      if (criticalCount > 0 || avgScore >= 70) {
        const timeSpan = new Date(cluster[cluster.length - 1].action_timestamp) -
                         new Date(cluster[0].action_timestamp)

        correlations.push({
          id: uuid(),
          correlation_type: 'TEMPORAL',
          alert_ids: cluster.map(a => a.id).join(','),
          actor: null,
          target: null,
          start_timestamp: cluster[cluster.length - 1].action_timestamp,
          end_timestamp: cluster[0].action_timestamp,
          alert_count: cluster.length,
          correlation_score: Math.min(100, avgScore + 10),
          pattern_type: 'BURST_ACTIVITY',
          risk_level: criticalCount > 0 ? 'CRITICAL' : 'HIGH',
          description: `${cluster.length} alerts detected within ${Math.round(timeSpan / 60000)} minutes - possible active incident`,
          metadata: JSON.stringify({
            critical_alerts: criticalCount,
            avg_score: avgScore,
            time_window_minutes: Math.round(timeSpan / 60000)
          })
        })
      }
    })

    return correlations
  }

  /**
   * STRATEGY 4: Detect attack patterns
   */
  findAttackPatterns(alerts) {
    const correlations = []

    // Pattern: Privilege Escalation
    const privEscPattern = this.detectPrivilegeEscalation(alerts)
    if (privEscPattern) correlations.push(privEscPattern)

    // Pattern: Credential Compromise
    const credCompPattern = this.detectCredentialCompromise(alerts)
    if (credCompPattern) correlations.push(credCompPattern)

    // Pattern: Data Exfiltration
    const exfilPattern = this.detectDataExfiltration(alerts)
    if (exfilPattern) correlations.push(exfilPattern)

    // Pattern: Mass User Creation
    const massUserPattern = this.detectMassUserCreation(alerts)
    if (massUserPattern) correlations.push(massUserPattern)

    // Pattern: Bulk Permission Grant
    const bulkPermPattern = this.detectBulkPermissionGrant(alerts)
    if (bulkPermPattern) correlations.push(bulkPermPattern)

    return correlations
  }

  /**
   * Attack Pattern: Privilege Escalation
   * Look for: role assignment + policy change + unusual activity
   */
  detectPrivilegeEscalation(alerts) {
    const roleAlerts = alerts.filter(a => {
      const headline = (a.headline || '').toLowerCase()
      return headline.includes('role') || headline.includes('admin') || headline.includes('privilege')
    })

    const policyAlerts = alerts.filter(a => {
      const headline = (a.headline || '').toLowerCase()
      return headline.includes('policy')
    })

    if (roleAlerts.length > 0 && policyAlerts.length > 0) {
      const combined = [...roleAlerts, ...policyAlerts].sort(
        (a, b) => new Date(b.action_timestamp) - new Date(a.action_timestamp)
      )

      const timeSpan = new Date(combined[combined.length - 1].action_timestamp) -
                       new Date(combined[0].action_timestamp)

      if (timeSpan < 3600000) { // Within 1 hour
        return {
          id: uuid(),
          correlation_type: 'PATTERN',
          alert_ids: combined.map(a => a.id).join(','),
          actor: roleAlerts[0]?.actor,
          target: null,
          start_timestamp: combined[combined.length - 1].action_timestamp,
          end_timestamp: combined[0].action_timestamp,
          alert_count: combined.length,
          correlation_score: 90,
          pattern_type: 'PRIVILEGE_ESCALATION',
          risk_level: 'CRITICAL',
          description: `Privilege escalation attack detected: role assignment + policy changes within ${Math.round(timeSpan / 60000)} minutes`,
          metadata: JSON.stringify({
            attack_pattern: 'privilege_escalation',
            role_alerts: roleAlerts.length,
            policy_alerts: policyAlerts.length
          })
        }
      }
    }

    return null
  }

  /**
   * Attack Pattern: Credential Compromise
   * Look for: impossible travel + failed logins + suspicious activity
   */
  detectCredentialCompromise(alerts) {
    const suspiciousLogins = alerts.filter(a => {
      const headline = (a.headline || '').toLowerCase()
      return headline.includes('sign-in') || headline.includes('login') || headline.includes('impossible travel')
    })

    const unusualActivity = alerts.filter(a => a.score >= 75)

    if (suspiciousLogins.length >= 2 && unusualActivity.length >= 2) {
      const combined = [...suspiciousLogins, ...unusualActivity].sort(
        (a, b) => new Date(b.action_timestamp) - new Date(a.action_timestamp)
      )

      const actor = combined[0]?.actor

      return {
        id: uuid(),
        correlation_type: 'PATTERN',
        alert_ids: combined.map(a => a.id).join(','),
        actor: actor,
        target: null,
        start_timestamp: combined[combined.length - 1].action_timestamp,
        end_timestamp: combined[0].action_timestamp,
        alert_count: combined.length,
        correlation_score: 88,
        pattern_type: 'CREDENTIAL_COMPROMISE',
        risk_level: 'CRITICAL',
        description: `Possible account compromise for ${actor}: suspicious login patterns + unusual activity detected`,
        metadata: JSON.stringify({
          attack_pattern: 'credential_compromise',
          suspicious_logins: suspiciousLogins.length,
          unusual_activity: unusualActivity.length
        })
      }
    }

    return null
  }

  /**
   * Attack Pattern: Data Exfiltration
   * Look for: forwarding rule + mail access + policy change + external OAuth
   */
  detectDataExfiltration(alerts) {
    const exfilIndicators = alerts.filter(a => {
      const headline = (a.headline || '').toLowerCase()
      return headline.includes('forward') ||
             headline.includes('delegation') ||
             headline.includes('oauth') ||
             headline.includes('consent') ||
             headline.includes('external domain')
    })

    if (exfilIndicators.length >= 2) {
      return {
        id: uuid(),
        correlation_type: 'PATTERN',
        alert_ids: exfilIndicators.map(a => a.id).join(','),
        actor: exfilIndicators[0]?.actor,
        target: null,
        start_timestamp: exfilIndicators[exfilIndicators.length - 1].action_timestamp,
        end_timestamp: exfilIndicators[0].action_timestamp,
        alert_count: exfilIndicators.length,
        correlation_score: 92,
        pattern_type: 'DATA_EXFILTRATION',
        risk_level: 'CRITICAL',
        description: 'Data exfiltration attempt detected: forwarding/delegation + external access indicators',
        metadata: JSON.stringify({
          attack_pattern: 'data_exfiltration',
          exfil_indicators: exfilIndicators.length
        })
      }
    }

    return null
  }

  /**
   * Attack Pattern: Mass User Creation
   * Look for: Multiple user accounts created by same actor in short time
   * Indicators of: account takeover, lateral movement preparation
   */
  detectMassUserCreation(alerts) {
    const userCreationAlerts = alerts.filter(a => {
      const headline = (a.headline || '').toLowerCase()
      const desc = (a.description || '').toLowerCase()
      return (headline.includes('user') && (headline.includes('created') || headline.includes('added'))) ||
             (desc.includes('created') && desc.includes('user'))
    })

    if (userCreationAlerts.length < 5) return null

    // Group by actor
    const byActor = {}
    userCreationAlerts.forEach(alert => {
      const actor = alert.actor || 'System'
      if (!byActor[actor]) byActor[actor] = []
      byActor[actor].push(alert)
    })

    // Check each actor
    for (const [actor, actorAlerts] of Object.entries(byActor)) {
      if (actorAlerts.length >= 5) {
        const sorted = actorAlerts.sort((a, b) =>
          new Date(b.action_timestamp) - new Date(a.action_timestamp)
        )

        const timeSpan = new Date(sorted[sorted.length - 1].action_timestamp) -
                         new Date(sorted[0].action_timestamp)

        // Within 1 hour
        if (timeSpan < 3600000) {
          return {
            id: uuid(),
            correlation_type: 'PATTERN',
            alert_ids: sorted.map(a => a.id).join(','),
            actor: actor,
            target: null,
            start_timestamp: sorted[sorted.length - 1].action_timestamp,
            end_timestamp: sorted[0].action_timestamp,
            alert_count: sorted.length,
            correlation_score: 94,
            pattern_type: 'MASS_USER_CREATION',
            risk_level: 'CRITICAL',
            description: `Suspicious mass user creation: ${actor} created ${sorted.length} accounts in ${Math.round(timeSpan / 60000)} minutes`,
            metadata: JSON.stringify({
              attack_pattern: 'mass_user_creation',
              accounts_created: sorted.length,
              actor: actor,
              time_window_minutes: Math.round(timeSpan / 60000)
            })
          }
        }
      }
    }

    return null
  }

  /**
   * Attack Pattern: Bulk Permission Grant
   * Look for: Multiple permission/group/role grants in short time
   * Indicators of: access expansion, resource compromise, insider threat
   */
  detectBulkPermissionGrant(alerts) {
    const permissionAlerts = alerts.filter(a => {
      const headline = (a.headline || '').toLowerCase()
      return headline.includes('group') || headline.includes('permission') ||
             headline.includes('role') || headline.includes('access')
    })

    if (permissionAlerts.length < 4) return null

    // Check if multiple resources affected
    const targets = new Set()
    permissionAlerts.forEach(alert => {
      const headline = (alert.headline || '').toLowerCase()
      if (headline.includes('global')) targets.add('GLOBAL_ACCESS')
      if (headline.includes('admin')) targets.add('ADMIN_ACCESS')
      if (headline.includes('group')) targets.add('GROUP_ACCESS')
      if (headline.includes('mailbox')) targets.add('MAILBOX_ACCESS')
    })

    if (targets.size >= 2) {
      const sorted = permissionAlerts.sort((a, b) =>
        new Date(b.action_timestamp) - new Date(a.action_timestamp)
      )

      const timeSpan = new Date(sorted[sorted.length - 1].action_timestamp) -
                       new Date(sorted[0].action_timestamp)

      if (timeSpan < 3600000) {
        return {
          id: uuid(),
          correlation_type: 'PATTERN',
          alert_ids: sorted.map(a => a.id).join(','),
          actor: sorted[0]?.actor,
          target: Array.from(targets).join(', '),
          start_timestamp: sorted[sorted.length - 1].action_timestamp,
          end_timestamp: sorted[0].action_timestamp,
          alert_count: sorted.length,
          correlation_score: 91,
          pattern_type: 'BULK_PERMISSION_GRANT',
          risk_level: 'CRITICAL',
          description: `Bulk permission grant detected: ${sorted.length} permissions granted to multiple resources in ${Math.round(timeSpan / 60000)} minutes`,
          metadata: JSON.stringify({
            attack_pattern: 'bulk_permission_grant',
            permissions_granted: sorted.length,
            resource_types: Array.from(targets),
            time_window_minutes: Math.round(timeSpan / 60000)
          })
        }
      }
    }

    return null
  }

  // ============================================================
  // Helper Methods
  // ============================================================

  calculateActorRisk(alerts) {
    const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length
    const highCount = alerts.filter(a => a.severity === 'HIGH').length
    const baseScore = alerts.reduce((sum, a) => sum + a.score, 0) / alerts.length

    let score = baseScore
    score += criticalCount * 15
    score += highCount * 8

    return Math.min(100, Math.round(score))
  }

  calculateTargetRisk(alerts) {
    const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length
    const baseScore = alerts.reduce((sum, a) => sum + a.score, 0) / alerts.length

    let score = baseScore
    score += criticalCount * 10

    return Math.min(100, Math.round(score))
  }

  identifyActorPattern(alerts) {
    const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length

    if (criticalCount > 1) return 'AGGRESSIVE_ACTIVITY'

    const headline = alerts[0]?.headline?.toLowerCase() || ''
    if (headline.includes('role')) return 'PRIVILEGE_ESCALATION'
    if (headline.includes('sign-in') || headline.includes('login')) return 'SUSPICIOUS_LOGIN'

    return 'MULTI_ACTION'
  }

  /**
   * Save correlation to database
   */
  saveCorrelation(corr) {
    try {
      const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO alert_correlations
        (id, correlation_type, alert_ids, actor, target, start_timestamp, end_timestamp,
         alert_count, correlation_score, pattern_type, risk_level, description, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      stmt.run(
        corr.id,
        corr.correlation_type,
        corr.alert_ids,
        corr.actor,
        corr.target,
        corr.start_timestamp,
        corr.end_timestamp,
        corr.alert_count,
        corr.correlation_score,
        corr.pattern_type,
        corr.risk_level,
        corr.description,
        corr.metadata
      )

      return true
    } catch (error) {
      console.error('Error saving correlation:', error.message)
      return false
    }
  }
}
