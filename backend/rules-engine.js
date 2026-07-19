/**
 * Custom Alert Rules Engine
 * Evaluates custom rules against alerts and creates new alerts when conditions match
 */

/**
 * Evaluate a single condition
 */
function evaluateCondition(condition, data) {
  const { field, operator, value } = condition

  // Get field value from data
  const fieldValue = getFieldValue(data, field)

  if (fieldValue === undefined && operator !== 'exists' && operator !== 'not_exists') {
    return false
  }

  switch (operator) {
    case 'equals':
      return fieldValue === value

    case 'not_equals':
      return fieldValue !== value

    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase())

    case 'not_contains':
      return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase())

    case 'starts_with':
      return String(fieldValue).startsWith(String(value))

    case 'ends_with':
      return String(fieldValue).endsWith(String(value))

    case 'regex':
      try {
        const regex = new RegExp(value)
        return regex.test(String(fieldValue))
      } catch (error) {
        console.error('Invalid regex:', value)
        return false
      }

    case 'greater_than':
      return Number(fieldValue) > Number(value)

    case 'greater_than_or_equal':
      return Number(fieldValue) >= Number(value)

    case 'less_than':
      return Number(fieldValue) < Number(value)

    case 'less_than_or_equal':
      return Number(fieldValue) <= Number(value)

    case 'in':
      return Array.isArray(value) && value.includes(fieldValue)

    case 'not_in':
      return Array.isArray(value) && !value.includes(fieldValue)

    case 'exists':
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== ''

    case 'not_exists':
      return fieldValue === undefined || fieldValue === null || fieldValue === ''

    case 'is_array':
      return Array.isArray(fieldValue)

    case 'array_contains':
      return Array.isArray(fieldValue) && fieldValue.includes(value)

    case 'array_length_greater':
      return Array.isArray(fieldValue) && fieldValue.length > Number(value)

    case 'array_length_less':
      return Array.isArray(fieldValue) && fieldValue.length < Number(value)

    default:
      return false
  }
}

/**
 * Get nested field value from object
 */
function getFieldValue(obj, fieldPath) {
  const parts = fieldPath.split('.')
  let value = obj

  for (const part of parts) {
    if (value === null || value === undefined) {
      return undefined
    }
    value = value[part]
  }

  return value
}

/**
 * Evaluate a condition group (AND/OR logic)
 */
function evaluateConditionGroup(group, data) {
  const { logic, conditions } = group

  if (!conditions || conditions.length === 0) {
    return true
  }

  if (logic === 'AND') {
    return conditions.every(condition => {
      if (condition.conditions) {
        // Nested group
        return evaluateConditionGroup(condition, data)
      }
      return evaluateCondition(condition, data)
    })
  }

  if (logic === 'OR') {
    return conditions.some(condition => {
      if (condition.conditions) {
        // Nested group
        return evaluateConditionGroup(condition, data)
      }
      return evaluateCondition(condition, data)
    })
  }

  return false
}

/**
 * Evaluate threshold condition (count of events in time window)
 */
function evaluateThreshold(threshold, alerts) {
  const { field, operator, count, timeWindowMinutes } = threshold

  if (!timeWindowMinutes || !alerts || alerts.length === 0) {
    return false
  }

  // Get time window
  const now = Date.now()
  const windowMs = timeWindowMinutes * 60 * 1000
  const cutoffTime = now - windowMs

  // Filter alerts within time window
  const recentAlerts = alerts.filter(alert => {
    const alertTime = new Date(alert.timestamp).getTime()
    return alertTime > cutoffTime
  })

  // If field is specified, count distinct values; otherwise count all
  let alertCount = recentAlerts.length

  if (field) {
    const distinctValues = new Set()
    recentAlerts.forEach(alert => {
      const value = getFieldValue(alert, field)
      if (value) distinctValues.add(value)
    })
    alertCount = distinctValues.size
  }

  // Evaluate count against operator
  switch (operator) {
    case 'greater_than':
      return alertCount > count
    case 'greater_than_or_equal':
      return alertCount >= count
    case 'less_than':
      return alertCount < count
    case 'less_than_or_equal':
      return alertCount <= count
    case 'equals':
      return alertCount === count
    case 'not_equals':
      return alertCount !== count
    default:
      return false
  }
}

/**
 * Detect pattern in alert sequence
 */
function detectPattern(pattern, alerts) {
  const { sequence, timeWindowMinutes, allowInterleavedEvents } = pattern

  if (!sequence || sequence.length < 2 || !alerts || alerts.length < 2) {
    return null
  }

  // Get time window
  const now = Date.now()
  const windowMs = timeWindowMinutes * 60 * 1000
  const cutoffTime = now - windowMs

  // Filter alerts within time window
  const recentAlerts = alerts.filter(alert => {
    const alertTime = new Date(alert.timestamp).getTime()
    return alertTime > cutoffTime
  })

  // Sort by timestamp
  const sortedAlerts = [...recentAlerts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  // Try to match pattern
  let sequenceIndex = 0
  const matchedAlerts = []

  for (const alert of sortedAlerts) {
    if (sequenceIndex >= sequence.length) {
      break
    }

    const expectedType = sequence[sequenceIndex]
    const alertType = alert.type

    if (alertType === expectedType) {
      matchedAlerts.push(alert)
      sequenceIndex++
    } else if (!allowInterleavedEvents) {
      // Reset if interleaved events not allowed
      sequenceIndex = alertType === expectedType ? 1 : 0
      matchedAlerts.length = 0
    }
  }

  // Check if full sequence matched
  if (sequenceIndex === sequence.length) {
    return {
      matched: true,
      matchedAlerts,
      timeline: matchedAlerts.map((a, idx) => ({
        sequence: idx + 1,
        type: a.type,
        timestamp: a.timestamp,
        actor: a.actor
      }))
    }
  }

  return null
}

/**
 * Evaluate a complete rule against data
 */
export function evaluateRule(rule, alert, allAlerts = []) {
  try {
    // Check if rule is enabled
    if (!rule.enabled) {
      return { matched: false, reason: 'Rule is disabled' }
    }

    let matched = false
    const matchDetails = {}

    // Evaluate condition groups
    if (rule.conditions && rule.conditions.length > 0) {
      const conditionGroupResult = evaluateConditionGroup(
        { logic: rule.conditionLogic || 'AND', conditions: rule.conditions },
        alert
      )

      if (!conditionGroupResult) {
        return { matched: false, reason: 'Conditions not met' }
      }

      matched = true
      matchDetails.conditionsMatched = true
    }

    // Evaluate threshold
    if (rule.threshold) {
      const thresholdResult = evaluateThreshold(rule.threshold, allAlerts)

      if (!thresholdResult) {
        return { matched: false, reason: 'Threshold not met' }
      }

      matched = true
      matchDetails.thresholdMet = true
    }

    // Detect pattern
    if (rule.pattern) {
      const patternResult = detectPattern(rule.pattern, allAlerts)

      if (!patternResult || !patternResult.matched) {
        return { matched: false, reason: 'Pattern not detected' }
      }

      matched = true
      matchDetails.patternDetected = true
      matchDetails.patternDetails = patternResult
    }

    return {
      matched,
      reason: matched ? 'Rule conditions satisfied' : 'No conditions matched',
      details: matchDetails
    }
  } catch (error) {
    console.error('Error evaluating rule:', error)
    return { matched: false, reason: `Evaluation error: ${error.message}` }
  }
}

/**
 * Create alert from rule match
 */
export function createAlertFromRule(rule, triggerAlert) {
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: rule.alertType || 'custom_rule_trigger',
    severity: rule.alertSeverity || 'MEDIUM',
    headline: rule.alertTitle || `Custom rule triggered: ${rule.name}`,
    description: rule.alertDescription || `Rule "${rule.name}" matched`,
    actor: triggerAlert?.actor || 'unknown',
    source: 'custom-rule-engine',
    timestamp: new Date().toISOString(),
    ruleId: rule.id,
    ruleName: rule.name,
    triggerAlert: triggerAlert?.id,
    tags: rule.alertTags || [],
    metadata: {
      rule: rule.id,
      ruleName: rule.name,
      version: rule.version
    }
  }
}

/**
 * Get available operators
 */
export function getAvailableOperators() {
  return {
    string: [
      { value: 'equals', label: 'equals' },
      { value: 'not_equals', label: 'not equals' },
      { value: 'contains', label: 'contains' },
      { value: 'not_contains', label: 'does not contain' },
      { value: 'starts_with', label: 'starts with' },
      { value: 'ends_with', label: 'ends with' },
      { value: 'regex', label: 'matches regex' },
      { value: 'exists', label: 'exists' },
      { value: 'not_exists', label: 'does not exist' }
    ],
    number: [
      { value: 'equals', label: 'equals' },
      { value: 'not_equals', label: 'not equals' },
      { value: 'greater_than', label: 'greater than' },
      { value: 'greater_than_or_equal', label: 'greater than or equal' },
      { value: 'less_than', label: 'less than' },
      { value: 'less_than_or_equal', label: 'less than or equal' },
      { value: 'in', label: 'in list' },
      { value: 'not_in', label: 'not in list' }
    ],
    array: [
      { value: 'is_array', label: 'is array' },
      { value: 'array_contains', label: 'contains value' },
      { value: 'array_length_greater', label: 'length greater than' },
      { value: 'array_length_less', label: 'length less than' }
    ]
  }
}

/**
 * Get available fields
 */
export function getAvailableFields() {
  return [
    { value: 'type', label: 'Alert Type', type: 'string' },
    { value: 'severity', label: 'Severity', type: 'string' },
    { value: 'actor', label: 'Actor/User', type: 'string' },
    { value: 'headline', label: 'Headline', type: 'string' },
    { value: 'description', label: 'Description', type: 'string' },
    { value: 'source', label: 'Source', type: 'string' },
    { value: 'timestamp', label: 'Timestamp', type: 'string' },
    { value: 'score', label: 'Score', type: 'number' },
    { value: 'tags', label: 'Tags', type: 'array' },
    { value: 'metadata.rule', label: 'Rule ID', type: 'string' }
  ]
}

/**
 * Validate rule structure
 */
export function validateRule(ruleData) {
  const errors = []

  if (!ruleData.name || ruleData.name.trim().length === 0) {
    errors.push('Rule name is required')
  }

  if (ruleData.name && ruleData.name.length > 255) {
    errors.push('Rule name must be 255 characters or less')
  }

  // Check that at least one condition type is defined
  const hasConditions = ruleData.conditions && ruleData.conditions.length > 0
  const hasThreshold = ruleData.threshold
  const hasPattern = ruleData.pattern

  if (!hasConditions && !hasThreshold && !hasPattern) {
    errors.push('At least one condition, threshold, or pattern is required')
  }

  // Validate conditions
  if (hasConditions) {
    for (const condition of ruleData.conditions) {
      if (!condition.field) {
        errors.push('Condition field is required')
      }
      if (!condition.operator) {
        errors.push('Condition operator is required')
      }
    }
  }

  // Validate threshold
  if (hasThreshold) {
    if (!ruleData.threshold.count || ruleData.threshold.count < 1) {
      errors.push('Threshold count must be at least 1')
    }
    if (!ruleData.threshold.timeWindowMinutes || ruleData.threshold.timeWindowMinutes < 1) {
      errors.push('Threshold time window must be at least 1 minute')
    }
    if (!ruleData.threshold.operator) {
      errors.push('Threshold operator is required')
    }
  }

  // Validate pattern
  if (hasPattern) {
    if (!ruleData.pattern.sequence || ruleData.pattern.sequence.length < 2) {
      errors.push('Pattern sequence must have at least 2 alert types')
    }
    if (!ruleData.pattern.timeWindowMinutes || ruleData.pattern.timeWindowMinutes < 1) {
      errors.push('Pattern time window must be at least 1 minute')
    }
  }

  // Validate alert properties
  if (ruleData.alertType && ruleData.alertType.length > 100) {
    errors.push('Alert type must be 100 characters or less')
  }

  if (ruleData.alertSeverity && !['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(ruleData.alertSeverity)) {
    errors.push('Alert severity must be CRITICAL, HIGH, MEDIUM, or LOW')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
