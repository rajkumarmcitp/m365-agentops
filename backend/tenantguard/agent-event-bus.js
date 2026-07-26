/**
 * Agent Event Bus
 * In-memory pub/sub system for inter-agent communication
 * No external dependencies — pure JavaScript event coordination
 */

export class AgentEventBus {
  constructor() {
    this.subscribers = new Map()  // Map<eventType, Map<agentId, handler>>
    this.eventLog = []             // [{ eventType, payload, sourceAgent, timestamp, id }]
    this.maxLogSize = 1000         // keep last 1000 events
  }

  /**
   * Subscribe an agent to an event type
   * @param {string} eventType - e.g. 'THREAT_CONFIRMED', 'COMPLIANCE_VIOLATION'
   * @param {string} agentId - e.g. 'threat-agent', 'security-agent'
   * @param {Function} handler - async callback(payload, sourceAgent)
   */
  subscribe(eventType, agentId, handler) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Map())
    }
    this.subscribers.get(eventType).set(agentId, handler)
    console.log(`📡 Agent ${agentId} subscribed to ${eventType}`)
  }

  /**
   * Unsubscribe an agent from all events it's listening to
   */
  unsubscribe(agentId, eventType = null) {
    if (eventType) {
      const handlers = this.subscribers.get(eventType)
      if (handlers) {
        handlers.delete(agentId)
      }
    } else {
      // Remove from all event types
      for (const [type, handlers] of this.subscribers) {
        handlers.delete(agentId)
      }
    }
  }

  /**
   * Publish an event to all subscribers
   * Persists to log and notifies handlers asynchronously (fire-and-forget)
   */
  async publish(eventType, payload, sourceAgent = 'system') {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const event = {
      id: eventId,
      eventType,
      payload,
      sourceAgent,
      timestamp: new Date().toISOString(),
      subscriberCount: 0
    }

    // Log the event
    this.eventLog.push(event)
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift()  // remove oldest
    }

    console.log(`📢 Event published: ${eventType} from ${sourceAgent}`)

    // Notify all subscribers (async, non-blocking)
    const handlers = this.subscribers.get(eventType)
    if (handlers) {
      event.subscriberCount = handlers.size
      const promises = []
      for (const [agentId, handler] of handlers) {
        promises.push(
          Promise.resolve()
            .then(() => handler(payload, sourceAgent, eventId))
            .catch(err => {
              console.error(`Error in ${agentId} handler for ${eventType}:`, err.message)
            })
        )
      }
      await Promise.all(promises)
    }

    return eventId
  }

  /**
   * Get recent events from the log
   * @param {number} limit - max events to return (default 50)
   * @param {string} eventType - filter by type (optional)
   */
  getRecentEvents(limit = 50, eventType = null) {
    let events = this.eventLog
    if (eventType) {
      events = events.filter(e => e.eventType === eventType)
    }
    // Return newest first
    return events.slice(-limit).reverse()
  }

  /**
   * Get all events of a specific type
   */
  getEventHistory(eventType) {
    return this.eventLog.filter(e => e.eventType === eventType)
  }

  /**
   * Get event statistics
   */
  getStats() {
    const eventCounts = {}
    const sourceAgentCounts = {}

    for (const event of this.eventLog) {
      eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1
      sourceAgentCounts[event.sourceAgent] = (sourceAgentCounts[event.sourceAgent] || 0) + 1
    }

    return {
      totalEvents: this.eventLog.length,
      eventTypes: Object.keys(eventCounts).length,
      eventCounts,
      sourceAgents: Object.keys(sourceAgentCounts),
      sourceAgentCounts
    }
  }

  /**
   * Clear event log (for testing/reset)
   */
  clearLog() {
    this.eventLog = []
  }
}

// Global singleton instance
let eventBusInstance = null

export function getEventBus() {
  if (!eventBusInstance) {
    eventBusInstance = new AgentEventBus()
  }
  return eventBusInstance
}

export function initializeEventBus() {
  eventBusInstance = new AgentEventBus()
  console.log('✅ Event bus initialized')
  return eventBusInstance
}
