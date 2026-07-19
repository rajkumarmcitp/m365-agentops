/**
 * Forensic Investigation Engine
 * Reconstructs timelines, correlates evidence, and tracks chain-of-custody
 */

/**
 * Reconstruct timeline from events
 */
export function reconstructTimeline(events, timezoneName = 'UTC') {
  if (!events || events.length === 0) {
    return {
      timeline: [],
      duration: 0,
      eventCount: 0,
      actors: [],
      resources: []
    }
  }

  // Sort by timestamp
  const sorted = [...events].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  })

  // Build timeline with metadata
  const timeline = sorted.map((event, idx) => ({
    sequence: idx + 1,
    timestamp: event.timestamp,
    type: event.type,
    actor: event.actor || 'unknown',
    action: event.action || event.headline || event.description,
    resource: event.resource || 'N/A',
    source: event.source || 'unknown',
    severity: event.severity || 'MEDIUM',
    details: {
      id: event.id,
      description: event.description || event.headline,
      metadata: event.metadata || {}
    }
  }))

  // Calculate statistics
  const duration = calculateDuration(sorted[0].timestamp, sorted[sorted.length - 1].timestamp)
  const actors = [...new Set(sorted.map(e => e.actor || 'unknown'))]
  const resources = [...new Set(sorted.map(e => e.resource || 'N/A'))]

  return {
    timeline,
    duration,
    eventCount: sorted.length,
    actors,
    resources,
    timeSpan: {
      start: sorted[0].timestamp,
      end: sorted[sorted.length - 1].timestamp
    }
  }
}

/**
 * Correlate evidence to identify relationships
 */
export function correlateEvidence(events, threshold = 0.6) {
  if (!events || events.length < 2) {
    return {
      correlations: [],
      correlationGraph: {},
      confidence: 0
    }
  }

  const correlations = []
  const correlationGraph = {}

  // Find related events
  for (let i = 0; i < events.length - 1; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const score = calculateEventSimilarity(events[i], events[j])

      if (score >= threshold) {
        const correlation = {
          event1: events[i].id,
          event2: events[j].id,
          type1: events[i].type,
          type2: events[j].type,
          actor: events[i].actor === events[j].actor ? events[i].actor : null,
          resource: events[i].resource === events[j].resource ? events[i].resource : null,
          timeDiff: calculateTimeDifference(events[i].timestamp, events[j].timestamp),
          score,
          relationship: identifyRelationship(events[i], events[j])
        }

        correlations.push(correlation)

        // Build graph
        if (!correlationGraph[events[i].id]) {
          correlationGraph[events[i].id] = []
        }
        correlationGraph[events[i].id].push({
          eventId: events[j].id,
          relationship: correlation.relationship,
          score
        })
      }
    }
  }

  return {
    correlations: correlations.sort((a, b) => b.score - a.score),
    correlationGraph,
    totalCorrelations: correlations.length,
    avgConfidence: correlations.length > 0
      ? (correlations.reduce((sum, c) => sum + c.score, 0) / correlations.length).toFixed(2)
      : 0
  }
}

/**
 * Calculate similarity between two events
 */
function calculateEventSimilarity(event1, event2) {
  let score = 0

  // Same type (30 points)
  if (event1.type === event2.type) {
    score += 30
  } else if (isSimilarEventType(event1.type, event2.type)) {
    score += 15
  }

  // Same actor (25 points)
  if (event1.actor === event2.actor) {
    score += 25
  }

  // Same resource (20 points)
  if (event1.resource === event2.resource) {
    score += 20
  }

  // Same source (15 points)
  if (event1.source === event2.source) {
    score += 15
  }

  // Time proximity (10 points - within 5 minutes)
  const timeDiff = Math.abs(
    new Date(event1.timestamp).getTime() - new Date(event2.timestamp).getTime()
  ) / 1000 / 60

  if (timeDiff < 5) {
    score += 10
  } else if (timeDiff < 30) {
    score += 5
  }

  return Math.min(score, 100) / 100
}

/**
 * Identify relationship type between events
 */
function identifyRelationship(event1, event2) {
  const types = {
    causality: ['login', 'access', 'privilege_change', 'delete'],
    sequence: ['download', 'export', 'email', 'share'],
    lateral: ['access', 'resource_access', 'permission_grant'],
    escalation: ['permission_change', 'role_change', 'privilege_escalation']
  }

  if (types.causality.includes(event1.type) && types.causality.includes(event2.type)) {
    return 'CAUSAL'
  }
  if (types.sequence.includes(event1.type) && types.sequence.includes(event2.type)) {
    return 'SEQUENTIAL'
  }
  if (types.lateral.includes(event1.type) && types.lateral.includes(event2.type)) {
    return 'LATERAL_MOVEMENT'
  }
  if (types.escalation.includes(event1.type) && types.escalation.includes(event2.type)) {
    return 'ESCALATION_CHAIN'
  }

  return 'RELATED'
}

/**
 * Check if event types are similar
 */
function isSimilarEventType(type1, type2) {
  const typeGroups = {
    access: ['login', 'signin', 'authentication', 'access', 'resource_access'],
    modification: ['create', 'modify', 'update', 'delete', 'remove'],
    sharing: ['share', 'grant', 'delegate', 'permission_grant'],
    data_transfer: ['download', 'export', 'copy', 'email', 'upload']
  }

  for (const [group, types] of Object.entries(typeGroups)) {
    if (types.includes(type1) && types.includes(type2)) {
      return true
    }
  }

  return false
}

/**
 * Calculate duration between two timestamps
 */
function calculateDuration(startTime, endTime) {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  return Math.round((end - start) / 1000) // seconds
}

/**
 * Calculate time difference in minutes
 */
function calculateTimeDifference(time1, time2) {
  const t1 = new Date(time1).getTime()
  const t2 = new Date(time2).getTime()
  return Math.abs(t2 - t1) / 1000 / 60 // minutes
}

/**
 * Build attack/incident narrative
 */
export function buildNarrative(timeline, correlations) {
  if (!timeline || timeline.length === 0) {
    return {
      narrative: 'No events to analyze',
      phases: [],
      keyEvents: []
    }
  }

  const narrative = []
  const phases = []
  const keyEvents = []

  // Identify phases based on time gaps and type changes
  let currentPhase = {
    name: getPhaseNameFromType(timeline[0].type),
    startIdx: 0,
    events: [timeline[0]],
    duration: 0
  }

  for (let i = 1; i < timeline.length; i++) {
    const event = timeline[i]
    const prevEvent = timeline[i - 1]
    const timeDiff = calculateTimeDifference(prevEvent.timestamp, event.timestamp)

    // Start new phase if significant time gap or different type
    if (timeDiff > 60 || getPhaseNameFromType(event.type) !== currentPhase.name) {
      currentPhase.duration = calculateDuration(currentPhase.events[0].timestamp, currentPhase.events[currentPhase.events.length - 1].timestamp)
      phases.push(currentPhase)

      currentPhase = {
        name: getPhaseNameFromType(event.type),
        startIdx: i,
        events: [event],
        duration: 0
      }
    } else {
      currentPhase.events.push(event)
    }

    // Mark critical events
    if (['privilege_escalation', 'delete', 'export', 'permission_change', 'disable'].includes(event.type)) {
      keyEvents.push({
        sequence: event.sequence,
        type: event.type,
        actor: event.actor,
        action: event.action,
        severity: event.severity
      })
    }
  }

  // Close last phase
  currentPhase.duration = calculateDuration(currentPhase.events[0].timestamp, currentPhase.events[currentPhase.events.length - 1].timestamp)
  phases.push(currentPhase)

  // Generate narrative
  if (keyEvents.length > 0) {
    narrative.push(`Critical incident detected with ${keyEvents.length} key events across ${phases.length} phases.`)
  }

  phases.forEach((phase, idx) => {
    narrative.push(`Phase ${idx + 1}: ${phase.name} (${phase.events.length} events, ${durationToString(phase.duration)})`)
  })

  if (correlations && correlations.correlations.length > 0) {
    narrative.push(`Found ${correlations.correlations.length} correlated events suggesting coordinated activity.`)
  }

  return {
    narrative: narrative.join(' '),
    phases: phases.map(p => ({
      name: p.name,
      eventCount: p.events.length,
      duration: p.duration,
      startTime: p.events[0].timestamp,
      endTime: p.events[p.events.length - 1].timestamp
    })),
    keyEvents,
    summary: {
      totalEvents: timeline.length,
      totalPhases: phases.length,
      criticalEventCount: keyEvents.length,
      timeSpan: durationToString(calculateDuration(timeline[0].timestamp, timeline[timeline.length - 1].timestamp))
    }
  }
}

/**
 * Get phase name from event type
 */
function getPhaseNameFromType(type) {
  const phases = {
    reconnaissance: ['login', 'access', 'scan', 'discovery'],
    exploitation: ['privilege_escalation', 'exploit', 'inject'],
    lateral_movement: ['resource_access', 'permission_grant', 'share'],
    data_exfiltration: ['download', 'export', 'copy', 'email', 'upload'],
    cleanup: ['delete', 'disable', 'modify', 'remove']
  }

  for (const [phase, types] of Object.entries(phases)) {
    if (types.includes(type)) {
      return phase
    }
  }

  return 'other'
}

/**
 * Convert duration in seconds to readable string
 */
function durationToString(seconds) {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`
  return `${Math.round(seconds / 86400)}d`
}

/**
 * Create investigation report
 */
export function generateForensicReport(caseData, timeline, correlations, narrative) {
  return {
    id: `report-${Date.now()}`,
    caseId: caseData.id,
    caseName: caseData.name,
    generatedAt: new Date().toISOString(),
    generatedBy: caseData.investigator,

    executive_summary: {
      incidentType: caseData.type,
      severity: caseData.severity,
      status: caseData.status,
      timelineSpan: timeline.duration,
      totalEvents: timeline.eventCount,
      involvedActors: timeline.actors.length,
      affectedResources: timeline.resources.length
    },

    timeline_analysis: {
      startTime: timeline.timeSpan?.start,
      endTime: timeline.timeSpan?.end,
      duration: durationToString(timeline.duration),
      events: timeline.eventCount,
      actors: timeline.actors,
      resources: timeline.resources
    },

    evidence_correlation: {
      correlatedEvents: correlations.totalCorrelations,
      averageConfidence: correlations.avgConfidence,
      topCorrelations: correlations.correlations.slice(0, 5)
    },

    narrative: narrative,

    conclusion: buildConclusion(timeline, correlations, narrative),

    chain_of_custody: caseData.evidence.map(e => ({
      id: e.id,
      description: e.description,
      collectedAt: e.collectedAt,
      collectedBy: e.collectedBy,
      status: 'preserved',
      hash: generateEvidenceHash(e)
    }))
  }
}

/**
 * Build conclusion
 */
function buildConclusion(timeline, correlations, narrative) {
  let conclusion = 'Based on forensic analysis: '

  if (narrative.keyEvents.length > 5) {
    conclusion += 'Multiple critical events detected suggesting coordinated attack. '
  } else if (narrative.keyEvents.length > 0) {
    conclusion += 'Critical security events identified. '
  }

  if (correlations.totalCorrelations > 10) {
    conclusion += 'Strong evidence of causal relationships between events. '
  }

  if (timeline.actors.length > 1) {
    conclusion += `Activity involved ${timeline.actors.length} different actors. `
  }

  if (narrative.phases.length > 3) {
    conclusion += `Incident evolved through ${narrative.phases.length} distinct phases. `
  }

  conclusion += 'Detailed evidence analysis and timeline reconstruction available above.'

  return conclusion
}

/**
 * Generate evidence hash for integrity verification
 */
function generateEvidenceHash(evidence) {
  const data = `${evidence.id}:${evidence.timestamp}:${evidence.description}`
  // Simplified hash - in production use crypto
  return require('crypto').createHash('sha256').update(data).digest('hex')
}

/**
 * Validate chain of custody
 */
export function validateChainOfCustody(evidence) {
  const violations = []

  // Check for proper collection
  if (!evidence.collectedAt || !evidence.collectedBy) {
    violations.push('Missing collection metadata')
  }

  // Check for gaps in custody
  const sorted = [...evidence].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  for (let i = 1; i < sorted.length; i++) {
    const gap = calculateTimeDifference(sorted[i - 1].timestamp, sorted[i].timestamp)
    if (gap > 3600) { // 1 hour gap
      violations.push(`Custody gap of ${gap} minutes between ${sorted[i - 1].id} and ${sorted[i].id}`)
    }
  }

  return {
    valid: violations.length === 0,
    violations,
    timestamp: new Date().toISOString()
  }
}
