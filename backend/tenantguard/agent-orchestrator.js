/**
 * Agent Orchestrator
 * Central hub for multi-agent coordination, conflict resolution, and task routing
 */

export class AgentOrchestrator {
  constructor(eventBus, contextStore, db) {
    this.eventBus = eventBus
    this.contextStore = contextStore
    this.db = db
    this.agents = new Map()  // Map<agentId, { type, instance, status, lastActivity }>
    this.taskQueue = []      // Priority-sorted queue of pending tasks
    this.conflicts = new Map() // Map<conflictId, conflict>
    this.allPaused = false
    this.healthCheckInterval = null

    // Task type → agent routing rules
    this.routingRules = {
      'THREAT_CONFIRMED': ['security-agent', 'compliance-agent'],
      'THREAT_DISMISSED': ['security-agent'],
      'COMPLIANCE_VIOLATION': ['audit-agent', 'threat-agent'],
      'INVESTIGATION_COMPLETE': ['compliance-agent'],
      'REMEDIATION_NEEDED': ['execution-agent'],
      'POLICY_VIOLATION': ['audit-agent'],
      'DEVICE_ISSUE': ['security-agent'],
      'USER_RISK_HIGH': ['threat-agent', 'security-agent'],
      'ALERT_DETECTED': ['threat-agent']
    }

    // Priority order
    this.priorityOrder = { 'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3 }
  }

  /**
   * Register an agent with the orchestrator
   */
  registerAgent(agentId, agentType, instance) {
    this.agents.set(agentId, {
      id: agentId,
      type: agentType,  // 'investigation' or 'named'
      instance,
      status: 'idle',
      lastActivity: new Date().toISOString(),
      taskCount: 0,
      currentTask: null
    })

    // Subscribe to relevant events
    this.subscribeAgent(agentId, agentType)

    console.log(`✅ Agent registered: ${agentId} (${agentType})`)
  }

  /**
   * Subscribe an agent to events based on its type
   */
  subscribeAgent(agentId, agentType) {
    if (agentType === 'investigation') {
      // ThreatInvestigationAgent publishes events for other agents to consume
      this.eventBus.subscribe('TASK_ASSIGNED', agentId, (payload) => {
        console.log(`📨 ${agentId} received task assignment:`, payload.taskId)
        this.updateAgentStatus(agentId, 'busy', payload.taskId)
      })
    } else {
      // Named agents subscribe to all events
      this.eventBus.subscribe('THREAT_CONFIRMED', agentId, this.handleThreatConfirmed.bind(this, agentId))
      this.eventBus.subscribe('COMPLIANCE_VIOLATION', agentId, this.handleComplianceViolation.bind(this, agentId))
      this.eventBus.subscribe('INVESTIGATION_COMPLETE', agentId, this.handleInvestigationComplete.bind(this, agentId))
    }
  }

  /**
   * Submit a new task to the queue
   */
  submitTask(taskType, payload, priority = 'P2', sourceAgent = 'manual') {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const task = {
      id: taskId,
      type: taskType,
      payload,
      priority,
      status: 'queued',
      sourceAgent,
      assignedAgent: null,
      queuedAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      result: null,
      error: null
    }

    // Persist to DB
    this.db.prepare(`
      INSERT INTO orchestratorTasks
      (id, type, payload, priority, status, source_agent, queued_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      taskId, taskType, JSON.stringify(payload), priority, 'queued', sourceAgent, task.queuedAt
    )

    // Add to in-memory queue (sorted by priority)
    this.taskQueue.push(task)
    this.sortQueue()

    console.log(`📋 Task submitted: ${taskId} [${priority}] ${taskType}`)

    // Publish event
    this.eventBus.publish('TASK_QUEUED', { taskId, type: taskType, priority }, 'orchestrator')

    return taskId
  }

  /**
   * Sort task queue by priority (P0 first)
   */
  sortQueue() {
    this.taskQueue.sort((a, b) => {
      const aPriority = this.priorityOrder[a.priority] || 999
      const bPriority = this.priorityOrder[b.priority] || 999
      return aPriority - bPriority
    })
  }

  /**
   * Route a task to the best available agent
   */
  routeTask(task) {
    // Determine target agents based on task type
    let targetAgents = this.routingRules[task.type] || []

    if (targetAgents.length === 0) {
      console.warn(`⚠️ No routing rule for task type: ${task.type}`)
      return false
    }

    // Find first available agent (not paused, not busy)
    for (const agentId of targetAgents) {
      const agent = this.agents.get(agentId)
      if (!agent) continue

      if (agent.status === 'idle' && !this.allPaused) {
        this.assignTask(task, agentId)
        return true
      }
    }

    console.log(`⏳ Task ${task.id} queued, waiting for available agent`)
    return false
  }

  /**
   * Assign a task to a specific agent
   */
  assignTask(task, agentId) {
    const agent = this.agents.get(agentId)
    if (!agent) return

    task.status = 'assigned'
    task.assignedAgent = agentId
    task.startedAt = new Date().toISOString()

    // Update DB
    this.db.prepare(`
      UPDATE orchestratorTasks SET status = ?, assigned_agent = ?, started_at = ? WHERE id = ?
    `).run('assigned', agentId, task.startedAt, task.id)

    // Update agent
    this.updateAgentStatus(agentId, 'busy', task.id)

    console.log(`🎯 Task ${task.id} assigned to ${agentId}`)

    // Publish event
    this.eventBus.publish('TASK_ASSIGNED', { taskId: task.id, agentId, taskType: task.type }, 'orchestrator')
  }

  /**
   * Mark task as completed
   */
  completeTask(taskId, result) {
    const task = this.taskQueue.find(t => t.id === taskId)
    if (!task) {
      console.warn(`Task not found: ${taskId}`)
      return
    }

    task.status = 'completed'
    task.completedAt = new Date().toISOString()
    task.result = result

    // Update agent status
    if (task.assignedAgent) {
      this.updateAgentStatus(task.assignedAgent, 'idle', null)
    }

    // Update DB
    this.db.prepare(`
      UPDATE orchestratorTasks SET status = ?, completed_at = ? WHERE id = ?
    `).run('completed', task.completedAt, taskId)

    console.log(`✅ Task completed: ${taskId}`)

    // Publish event
    this.eventBus.publish('TASK_COMPLETED', { taskId, result }, 'orchestrator')

    // Try to route next queued task
    this.processQueue()
  }

  /**
   * Process the task queue — route next pending task if agents available
   */
  processQueue() {
    for (let i = 0; i < this.taskQueue.length; i++) {
      const task = this.taskQueue[i]
      if (task.status === 'queued') {
        if (this.routeTask(task)) {
          break  // Only route one at a time
        }
      }
    }
  }

  /**
   * Detect and resolve conflicts
   * Called when multiple agents try to work on the same resource
   */
  detectConflict(resourceKey, agentId) {
    const conflictingAgent = this.contextStore.detectConflict(resourceKey, agentId)
    if (!conflictingAgent) return null

    const conflictId = `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const conflict = {
      id: conflictId,
      type: 'RESOURCE_CONFLICT',
      resourceKey,
      agent1: conflictingAgent,
      agent2: agentId,
      resolution: null,
      resolved: false,
      detectedAt: new Date().toISOString()
    }

    this.conflicts.set(conflictId, conflict)

    // Persist to DB
    this.db.prepare(`
      INSERT INTO orchestratorConflicts
      (id, conflict_type, key, agent1, agent2, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(conflictId, 'RESOURCE_CONFLICT', resourceKey, conflictingAgent, agentId, conflict.detectedAt)

    console.log(`⚠️ Conflict detected: ${conflictingAgent} vs ${agentId} on ${resourceKey}`)

    // Publish event
    this.eventBus.publish('AGENT_CONFLICT', conflict, 'orchestrator')

    return conflictId
  }

  /**
   * Resolve a conflict using a strategy
   */
  resolveConflict(conflictId, strategy = 'QUEUE') {
    const conflict = this.conflicts.get(conflictId)
    if (!conflict) return

    conflict.resolution = strategy
    conflict.resolved = true

    // Update DB
    this.db.prepare(`
      UPDATE orchestratorConflicts SET resolution = ?, resolved = 1 WHERE id = ?
    `).run(strategy, conflictId)

    console.log(`🔧 Conflict resolved: ${conflictId} → ${strategy}`)

    // Publish event
    this.eventBus.publish('CONFLICT_RESOLVED', { conflictId, strategy }, 'orchestrator')
  }

  /**
   * Update an agent's status
   */
  updateAgentStatus(agentId, status, currentTask = null) {
    const agent = this.agents.get(agentId)
    if (agent) {
      agent.status = status
      agent.lastActivity = new Date().toISOString()
      agent.currentTask = currentTask
    }
  }

  /**
   * Pause all agents
   */
  pauseAll() {
    this.allPaused = true
    for (const agent of this.agents.values()) {
      agent.status = 'paused'
    }
    console.log('⏸️  All agents paused')
    this.eventBus.publish('ALL_AGENTS_PAUSED', {}, 'orchestrator')
  }

  /**
   * Resume all agents
   */
  resumeAll() {
    this.allPaused = false
    for (const agent of this.agents.values()) {
      agent.status = 'idle'
    }
    console.log('▶️  All agents resumed')
    this.eventBus.publish('ALL_AGENTS_RESUMED', {}, 'orchestrator')
    this.processQueue()
  }

  /**
   * Pause a specific agent
   */
  pauseAgent(agentId) {
    const agent = this.agents.get(agentId)
    if (agent) {
      agent.status = 'paused'
      console.log(`⏸️  Agent paused: ${agentId}`)
      this.eventBus.publish('AGENT_PAUSED', { agentId }, 'orchestrator')
    }
  }

  /**
   * Resume a specific agent
   */
  resumeAgent(agentId) {
    const agent = this.agents.get(agentId)
    if (agent) {
      agent.status = 'idle'
      console.log(`▶️  Agent resumed: ${agentId}`)
      this.eventBus.publish('AGENT_RESUMED', { agentId }, 'orchestrator')
      this.processQueue()
    }
  }

  /**
   * Get orchestrator status (for API)
   */
  getStatus() {
    const agents = Array.from(this.agents.values()).map(a => ({
      id: a.id,
      type: a.type,
      status: a.status,
      lastActivity: a.lastActivity,
      currentTask: a.currentTask,
      taskCount: a.taskCount
    }))

    const queue = this.taskQueue.map(t => ({
      id: t.id,
      type: t.type,
      priority: t.priority,
      status: t.status,
      sourceAgent: t.sourceAgent,
      assignedAgent: t.assignedAgent,
      queuedAt: t.queuedAt
    }))

    const recentEvents = this.eventBus.getRecentEvents(20)
    const unresolved = Array.from(this.conflicts.values()).filter(c => !c.resolved)

    return {
      agents,
      queue,
      recentEvents,
      conflicts: unresolved,
      allPaused: this.allPaused,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Monitor agent health — check for stalled tasks
   */
  monitorAgentHealth() {
    const now = Date.now()
    const stallThreshold = 5 * 60 * 1000  // 5 minutes

    for (const task of this.taskQueue) {
      if (task.status === 'assigned' && task.startedAt) {
        const startTime = new Date(task.startedAt).getTime()
        if (now - startTime > stallThreshold) {
          console.warn(`⚠️ Task stalled: ${task.id} on ${task.assignedAgent}`)
          this.eventBus.publish('TASK_STALLED', { taskId: task.id, agentId: task.assignedAgent }, 'orchestrator')
        }
      }
    }
  }

  /**
   * Start health monitoring
   */
  startHealthMonitoring() {
    if (!this.healthCheckInterval) {
      this.healthCheckInterval = setInterval(() => this.monitorAgentHealth(), 30 * 1000)
      console.log('🏥 Agent health monitoring started')
    }
  }

  /**
   * Stop health monitoring
   */
  stopHealthMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
      console.log('🛑 Agent health monitoring stopped')
    }
  }

  /**
   * Event handlers
   */
  async handleThreatConfirmed(agentId, payload, sourceAgent) {
    console.log(`📌 ${agentId} received THREAT_CONFIRMED from ${sourceAgent}`)
    // Named agents could react to confirmed threats
  }

  async handleComplianceViolation(agentId, payload, sourceAgent) {
    console.log(`📌 ${agentId} received COMPLIANCE_VIOLATION from ${sourceAgent}`)
  }

  async handleInvestigationComplete(agentId, payload, sourceAgent) {
    console.log(`📌 ${agentId} received INVESTIGATION_COMPLETE from ${sourceAgent}`)
  }

  /**
   * Shutdown orchestrator
   */
  shutdown() {
    this.stopHealthMonitoring()
    this.contextStore.shutdown()
    console.log('✓ Orchestrator shutdown')
  }
}

// Global singleton
let orchestratorInstance = null

export function getOrchestrator() {
  return orchestratorInstance
}

export function setOrchestrator(orchestrator) {
  orchestratorInstance = orchestrator
}

export default AgentOrchestrator
