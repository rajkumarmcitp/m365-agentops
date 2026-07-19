/**
 * User Behavior Analytics Engine
 * Tracks user activity patterns and detects insider threats
 */

/**
 * Calculate risk score for user activity (0-100)
 */
export function calculateUserRiskScore(userProfile, recentActivity) {
  let riskScore = 0
  const factors = {}

  // 1. Privilege escalation risk (25 points)
  const privEscRisk = detectPrivilegeEscalationRisk(userProfile, recentActivity)
  factors.privilegeEscalation = privEscRisk
  riskScore += privEscRisk * 0.25

  // 2. Data exfiltration risk (25 points)
  const exfilRisk = detectDataExfiltrationRisk(userProfile, recentActivity)
  factors.dataExfiltration = exfilRisk
  riskScore += exfilRisk * 0.25

  // 3. Anomalous access patterns (20 points)
  const accessRisk = detectAnomalousAccessPatterns(userProfile, recentActivity)
  factors.anomalousAccess = accessRisk
  riskScore += accessRisk * 0.20

  // 4. Lateral movement risk (15 points)
  const lateralRisk = detectLateralMovement(userProfile, recentActivity)
  factors.lateralMovement = lateralRisk
  riskScore += lateralRisk * 0.15

  // 5. Behavioral deviation (15 points)
  const behaviorRisk = detectBehavioralDeviation(userProfile, recentActivity)
  factors.behavioralDeviation = behaviorRisk
  riskScore += behaviorRisk * 0.15

  return {
    score: Math.round(riskScore),
    factors,
    severity: getRiskSeverity(riskScore),
    timestamp: new Date().toISOString()
  }
}

/**
 * Detect privilege escalation risk
 */
function detectPrivilegeEscalationRisk(userProfile, activities) {
  if (!activities || activities.length === 0) return 0

  let risk = 0
  const privEscActivities = activities.filter(a =>
    ['permission_change', 'role_change', 'privilege_escalation', 'grant'].includes(a.type)
  )

  // Risk increases with number of privilege changes
  if (privEscActivities.length > 0) {
    risk += Math.min(40, privEscActivities.length * 10)
  }

  // If user is getting admin/elevated privileges
  const adminGrants = privEscActivities.filter(a =>
    a.newRole && ['admin', 'global_admin', 'security_admin'].includes(a.newRole)
  )
  if (adminGrants.length > 0) {
    risk += Math.min(60, adminGrants.length * 30)
  }

  // Check if user's role doesn't match typical privilege level
  if (userProfile.jobTitle && !['admin', 'security', 'it'].some(j => userProfile.jobTitle.toLowerCase().includes(j))) {
    if (privEscActivities.length > 0) {
      risk += 30
    }
  }

  return Math.min(100, risk)
}

/**
 * Detect data exfiltration risk
 */
function detectDataExfiltrationRisk(userProfile, activities) {
  if (!activities || activities.length === 0) return 0

  let risk = 0
  const dataAccessActivities = activities.filter(a =>
    ['file_download', 'bulk_download', 'data_export', 'file_copy', 'email_large'].includes(a.type)
  )

  // Large volume downloads
  const largeDownloads = dataAccessActivities.filter(a => a.size && a.size > 100 * 1024 * 1024) // 100MB+
  if (largeDownloads.length > 0) {
    risk += Math.min(50, largeDownloads.length * 20)
  }

  // Unusual volume compared to baseline
  if (userProfile.avgDailyDownloads) {
    const recentDownloads = dataAccessActivities.length
    const deviation = (recentDownloads - userProfile.avgDailyDownloads) / Math.max(1, userProfile.avgDailyDownloads)
    if (deviation > 5) { // 5x normal volume
      risk += 40
    } else if (deviation > 2) {
      risk += 20
    }
  }

  // Access to sensitive data
  const sensitiveAccess = dataAccessActivities.filter(a =>
    a.resource && ['confidential', 'secret', 'financial', 'hr'].some(s => a.resource.toLowerCase().includes(s))
  )
  if (sensitiveAccess.length > 0) {
    risk += Math.min(40, sensitiveAccess.length * 15)
  }

  // External transfer attempts
  const externalTransfer = dataAccessActivities.filter(a => a.destination && !a.destination.includes('@company.com'))
  if (externalTransfer.length > 0) {
    risk += Math.min(80, externalTransfer.length * 25)
  }

  return Math.min(100, risk)
}

/**
 * Detect anomalous access patterns
 */
function detectAnomalousAccessPatterns(userProfile, activities) {
  if (!activities || activities.length === 0) return 0

  let risk = 0

  // Off-hours access
  const offHoursActivities = activities.filter(a => {
    const hour = new Date(a.timestamp).getHours()
    return hour < 6 || hour > 22
  })
  if (offHoursActivities.length > 0) {
    risk += Math.min(30, offHoursActivities.length * 5)
  }

  // Weekend access
  const weekendActivities = activities.filter(a => {
    const day = new Date(a.timestamp).getDay()
    return day === 0 || day === 6
  })
  if (weekendActivities.length > 0 && !userProfile.workWeekends) {
    risk += Math.min(25, weekendActivities.length * 5)
  }

  // Multiple locations in short time (impossible travel)
  if (activities.length > 1) {
    for (let i = 1; i < activities.length; i++) {
      const prev = activities[i - 1]
      const curr = activities[i]
      if (prev.location && curr.location && prev.location !== curr.location) {
        const timeDiff = (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000 / 60 // minutes
        if (timeDiff < 60) { // Same location within an hour
          risk += 35
        }
      }
    }
  }

  // Access to unusual resources
  const unusualResources = activities.filter(a =>
    !userProfile.typicalResources || !userProfile.typicalResources.includes(a.resource)
  )
  if (unusualResources.length > 0) {
    risk += Math.min(20, unusualResources.length * 3)
  }

  return Math.min(100, risk)
}

/**
 * Detect lateral movement
 */
function detectLateralMovement(userProfile, activities) {
  if (!activities || activities.length === 0) return 0

  let risk = 0
  const lateralActivities = activities.filter(a =>
    ['share_access', 'delegate_permission', 'impersonate', 'assume_role'].includes(a.type)
  )

  // Multiple access grants to different resources
  if (lateralActivities.length > 3) {
    risk += Math.min(50, lateralActivities.length * 10)
  }

  // Accessing resources outside scope
  const scopeViolations = lateralActivities.filter(a => {
    const userDept = userProfile.department || ''
    const resourceDept = a.resourceDepartment || ''
    return resourceDept && !userDept.includes(resourceDept)
  })
  if (scopeViolations.length > 0) {
    risk += Math.min(40, scopeViolations.length * 15)
  }

  // High-value target access
  const highValueTargets = lateralActivities.filter(a =>
    a.highValue === true || (a.resource && ['executive', 'board', 'finance', 'legal'].some(t => a.resource.toLowerCase().includes(t)))
  )
  if (highValueTargets.length > 0) {
    risk += Math.min(60, highValueTargets.length * 20)
  }

  return Math.min(100, risk)
}

/**
 * Detect behavioral deviation
 */
function detectBehavioralDeviation(userProfile, activities) {
  if (!activities || activities.length === 0 || !userProfile.baseline) return 0

  let risk = 0
  const baseline = userProfile.baseline

  // Deviation in activity count
  if (baseline.avgDailyActivities) {
    const recentCount = activities.length
    const deviation = Math.abs(recentCount - baseline.avgDailyActivities) / baseline.avgDailyActivities
    if (deviation > 2) { // 2x or 50% reduction
      risk += 25
    }
  }

  // Sudden increase in sensitive operations
  const sensitiveOps = activities.filter(a =>
    ['permission_change', 'delete', 'export', 'share'].includes(a.type)
  )
  if (baseline.avgSensitiveOps && sensitiveOps.length > baseline.avgSensitiveOps * 3) {
    risk += 30
  }

  // Access pattern deviation
  if (baseline.typicalResourceTypes) {
    const unusualTypes = activities.filter(a =>
      !baseline.typicalResourceTypes.includes(a.type)
    ).length
    if (unusualTypes > activities.length * 0.4) {
      risk += 25
    }
  }

  // Role-inappropriate activity
  if (userProfile.jobTitle) {
    const inappropriateActivities = activities.filter(a => {
      const jobTitle = userProfile.jobTitle.toLowerCase()
      // Engineers shouldn't be accessing finance data
      if (jobTitle.includes('engineer') && a.resource && a.resource.toLowerCase().includes('finance')) {
        return true
      }
      // Marketing shouldn't have IT admin access
      if (jobTitle.includes('marketing') && ['admin', 'system_config'].includes(a.type)) {
        return true
      }
      return false
    })
    if (inappropriateActivities.length > 0) {
      risk += 30
    }
  }

  return Math.min(100, risk)
}

/**
 * Get risk severity level
 */
export function getRiskSeverity(riskScore) {
  if (riskScore >= 80) return 'CRITICAL'
  if (riskScore >= 60) return 'HIGH'
  if (riskScore >= 40) return 'MEDIUM'
  if (riskScore >= 20) return 'LOW'
  return 'MINIMAL'
}

/**
 * Create user activity profile
 */
export function createUserProfile(userId, userInfo = {}) {
  return {
    userId,
    email: userInfo.email || `${userId}@company.com`,
    displayName: userInfo.displayName || userId,
    department: userInfo.department || 'Unknown',
    jobTitle: userInfo.jobTitle || 'Unknown',
    manager: userInfo.manager || null,
    createdAt: new Date().toISOString(),
    lastActivity: null,

    // Behavioral baseline
    baseline: {
      avgDailyActivities: 15,
      avgSensitiveOps: 2,
      avgDailyDownloads: 5,
      typicalResourceTypes: ['file_access', 'email', 'login'],
      typicalLocations: [],
      peakActivityHours: [9, 10, 11, 14, 15, 16]
    },

    // Activity tracking
    totalActivities: 0,
    totalRiskScore: 0,
    avgRiskScore: 0,
    peakRiskScore: 0,

    // Threat indicators
    threatIndicators: [],
    suspiciousActivityCount: 0,

    // Work patterns
    workWeekends: false,
    remoteWorker: false,
    typicalResources: []
  }
}

/**
 * Detect insider threat indicators
 */
export function detectInsiderThreats(userProfile, recentActivity, threshold = 70) {
  const threats = []

  // 1. Privilege escalation
  const privEscActivity = recentActivity.filter(a => ['permission_change', 'role_change'].includes(a.type))
  if (privEscActivity.length > 0 && !userProfile.jobTitle?.toLowerCase().includes('admin')) {
    threats.push({
      type: 'PRIVILEGE_ESCALATION',
      severity: 'HIGH',
      description: `User without admin role requesting elevated privileges`,
      evidence: privEscActivity.length,
      timestamp: new Date().toISOString()
    })
  }

  // 2. Data hoarding
  const dataAccess = recentActivity.filter(a => ['download', 'export', 'copy'].includes(a.type))
  if (dataAccess.length > 10) {
    threats.push({
      type: 'DATA_HOARDING',
      severity: 'HIGH',
      description: `Excessive data access/download activity`,
      evidence: dataAccess.length,
      timestamp: new Date().toISOString()
    })
  }

  // 3. Termination red flags
  const terminationFlags = recentActivity.filter(a =>
    a.type === 'user_disable' || a.type === 'access_revoke' || a.type === 'password_reset'
  )
  if (terminationFlags.length > 0 && userProfile.suspiciousActivityCount > 5) {
    threats.push({
      type: 'TERMINATION_ACTIVITY',
      severity: 'CRITICAL',
      description: `Suspicious activity before account termination`,
      evidence: terminationFlags.length,
      timestamp: new Date().toISOString()
    })
  }

  // 4. Unusual access to sensitive data
  const sensitiveAccess = recentActivity.filter(a =>
    a.resource && ['confidential', 'executive', 'financial', 'hr_records'].some(s => a.resource.toLowerCase().includes(s))
  )
  if (sensitiveAccess.length > 0 && !['executive', 'manager', 'analyst'].some(t => userProfile.jobTitle?.toLowerCase().includes(t))) {
    threats.push({
      type: 'UNAUTHORIZED_ACCESS',
      severity: 'HIGH',
      description: `Unauthorized access to sensitive resources`,
      evidence: sensitiveAccess.length,
      timestamp: new Date().toISOString()
    })
  }

  // 5. Mass file operations
  const massOps = recentActivity.filter(a => a.type === 'bulk_operation')
  if (massOps.length > 0) {
    threats.push({
      type: 'MASS_OPERATIONS',
      severity: 'MEDIUM',
      description: `Bulk file delete, move, or share operations`,
      evidence: massOps.length,
      timestamp: new Date().toISOString()
    })
  }

  return threats
}

/**
 * Identify users at highest risk
 */
export function identifyHighRiskUsers(allUserProfiles, limit = 20) {
  return allUserProfiles
    .sort((a, b) => (b.peakRiskScore || 0) - (a.peakRiskScore || 0))
    .slice(0, limit)
    .map(profile => ({
      userId: profile.userId,
      displayName: profile.displayName,
      department: profile.department,
      jobTitle: profile.jobTitle,
      currentRiskScore: profile.avgRiskScore || 0,
      peakRiskScore: profile.peakRiskScore || 0,
      threatCount: profile.threatIndicators?.length || 0,
      lastActivity: profile.lastActivity
    }))
}

/**
 * Calculate user activity summary
 */
export function calculateUserActivitySummary(userProfile, recentActivity) {
  if (!recentActivity || recentActivity.length === 0) {
    return {
      totalActivities: 0,
      activityByType: {},
      activityByHour: {},
      locations: [],
      resources: [],
      sensitiveOpCount: 0
    }
  }

  const summary = {
    totalActivities: recentActivity.length,
    activityByType: {},
    activityByHour: {},
    locations: new Set(),
    resources: new Set(),
    sensitiveOpCount: 0,
    timeRange: {
      earliest: null,
      latest: null
    }
  }

  recentActivity.forEach(activity => {
    // Count by type
    summary.activityByType[activity.type] = (summary.activityByType[activity.type] || 0) + 1

    // Count by hour
    const hour = new Date(activity.timestamp).getHours()
    summary.activityByHour[hour] = (summary.activityByHour[hour] || 0) + 1

    // Track locations
    if (activity.location) summary.locations.add(activity.location)

    // Track resources
    if (activity.resource) summary.resources.add(activity.resource)

    // Count sensitive operations
    if (['permission_change', 'delete', 'export', 'share'].includes(activity.type)) {
      summary.sensitiveOpCount++
    }

    // Track time range
    const timestamp = new Date(activity.timestamp)
    if (!summary.timeRange.earliest || timestamp < summary.timeRange.earliest) {
      summary.timeRange.earliest = timestamp
    }
    if (!summary.timeRange.latest || timestamp > summary.timeRange.latest) {
      summary.timeRange.latest = timestamp
    }
  })

  // Convert sets to arrays
  summary.locations = Array.from(summary.locations)
  summary.resources = Array.from(summary.resources)

  return summary
}
