/**
 * Threat Investigation Agent
 * Autonomous multi-step investigation agent for M365 security threats
 * Orchestrates: Triage → Plan → Gather → Analyze (loop) → Conclude → Act
 */

import { getDatabase } from './database.js'
import { AgentTools } from './agent-tools.js'
import { AgentMemory } from './agent-memory.js'
import { ContextBuilder } from './context-builder.js'
import {
  AGENT_TRIAGE_PROMPT,
  AGENT_PLAN_PROMPT,
  AGENT_ANALYZE_PROMPT,
  AGENT_CONCLUDE_PROMPT
} from './agent-prompts.js'
import { v4 as uuid } from 'uuid'
import Anthropic from '@anthropic-ai/sdk'

export class ThreatInvestigationAgent {
  constructor(anthropicApiKey = null, graphApiClient = null) {
    this.db = getDatabase()
    this.tools = new AgentTools(graphApiClient)
    this.contextBuilder = new ContextBuilder()
    this.MAX_ITERATIONS = 5
    this.COST_GUARD_TOKENS = 50000

    this.anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null
    this.claudeAvailable = !!this.anthropic
  }

  /**
   * Main investigation entry point
   * Orchestrates the full agentic loop
   */
  async investigate(alertId, triggerType = 'manual') {
    const investigationId = `inv-${uuid()}`
    console.log(`🔍 Starting investigation [${investigationId}] for alert [${alertId}]`)

    try {
      // 1. Guard: check if already in-flight
      const queued = this.db.prepare('SELECT * FROM agent_queue WHERE alert_id = ?').get(alertId)
      if (queued && queued.status === 'running') {
        console.warn(`Alert ${alertId} already under investigation`)
        return { skipped: true, reason: 'Investigation already in progress' }
      }

      // 2. Load alert context
      const alert = this.db.prepare('SELECT * FROM alerts WHERE id = ?').get(alertId)
      if (!alert) {
        console.warn(`Alert ${alertId} not found`)
        return { skipped: true, reason: 'Alert not found' }
      }

      // 3. Create investigation record
      this.db
        .prepare('INSERT INTO agent_investigations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(
          investigationId, // id
          alertId, // alert_id
          triggerType, // trigger_type
          'triaging', // status
          alert.priority || 'P3', // priority
          0, // priority_score
          0, // iteration
          this.MAX_ITERATIONS, // max_iterations
          null, // verdict
          null, // risk_score
          null, // report
          new Date().toISOString(), // started_at
          null, // completed_at
          null, // error
          0, // paused
          this.claudeAvailable ? 1 : 0 // claude_used
        )

      // 4. Add to queue
      this.db
        .prepare('INSERT INTO agent_queue VALUES (?, ?, ?, ?)')
        .run(alertId, investigationId, new Date().toISOString(), 'running')

      // 5. Triage
      const triage = await this.triageAlert(alert)
      console.log(`Triage result: shouldInvestigate=${triage.shouldInvestigate}, priority=${triage.priority}`)

      if (!triage.shouldInvestigate) {
        this.db
          .prepare('UPDATE agent_investigations SET status = ?, completed_at = ? WHERE id = ?')
          .run('skipped', new Date().toISOString(), investigationId)
        this.db.prepare('DELETE FROM agent_queue WHERE alert_id = ?').run(alertId)
        return { skipped: true, reason: triage.reason }
      }

      // 6. Update with priority
      this.db
        .prepare('UPDATE agent_investigations SET priority = ?, priority_score = ? WHERE id = ?')
        .run(triage.priority, triage.priorityScore, investigationId)

      // 7. Create memory store
      const memory = new AgentMemory(investigationId, this.db)
      memory.setAlert(alert)
      memory.setClaudeUsed(this.claudeAvailable)

      // 8. Plan investigation
      this.db
        .prepare('UPDATE agent_investigations SET status = ? WHERE id = ?')
        .run('planning', investigationId)

      const plan = await this.planInvestigation(alert, '', memory)
      memory.setPlan(plan.steps)
      console.log(`Plan created with ${plan.steps.length} steps`)

      // 9. Main investigation loop
      this.db
        .prepare('UPDATE agent_investigations SET status = ? WHERE id = ?')
        .run('gathering', investigationId)

      let totalTokensUsed = 0
      let stepIndex = 0

      for (let iteration = 0; iteration < this.MAX_ITERATIONS; iteration++) {
        memory.incrementIteration()

        console.log(`Iteration ${iteration + 1}/${this.MAX_ITERATIONS}`)

        // Get next step from plan
        if (stepIndex >= plan.steps.length) break

        const step = plan.steps[stepIndex++]
        console.log(`  Executing: ${step.tool}`)

        // Execute step
        const stepResult = await this.executeStep(step)
        memory.addEvidenceStep(stepResult)

        // Analyze results
        this.db
          .prepare('UPDATE agent_investigations SET status = ? WHERE id = ?')
          .run('analyzing', investigationId)

        const contextWindow = memory.getContextWindow()
        const analysis = await this.analyzeResults(contextWindow, iteration + 1, this.MAX_ITERATIONS)

        memory.addReasoningEntry(analysis.decision, analysis.rationale, analysis.threatIndicators, analysis.currentRiskScore)

        // Check token budget
        if (this.claudeAvailable && totalTokensUsed > this.COST_GUARD_TOKENS) {
          console.warn(`Token budget exceeded (${totalTokensUsed}), concluding investigation`)
          break
        }

        // Check decision
        if (analysis.decision === 'conclude' || analysis.decision === 'escalate') {
          console.log(`Decision: ${analysis.decision}`)
          break
        }

        // Add next steps to plan
        if (analysis.nextSteps && analysis.nextSteps.length > 0) {
          plan.steps.push(...analysis.nextSteps)
          console.log(`Added ${analysis.nextSteps.length} next steps to plan`)
        }

        memory.persist()
      }

      // 10. Conclude
      this.db
        .prepare('UPDATE agent_investigations SET status = ? WHERE id = ?')
        .run('concluding', investigationId)

      const contextSummary = memory.getContextWindow()
      const conclusion = await this.concludeInvestigation(contextSummary)

      memory.setVerdict(conclusion.verdict, conclusion.riskScore, conclusion.report)
      memory.persist()

      console.log(`Verdict: ${conclusion.verdict} (risk: ${conclusion.riskScore})`)

      // 11. Take action
      await this.takeAction(conclusion, alert, investigationId)

      // 12. Mark complete
      this.db
        .prepare('UPDATE agent_investigations SET status = ?, verdict = ?, risk_score = ?, completed_at = ? WHERE id = ?')
        .run('complete', conclusion.verdict, conclusion.riskScore, new Date().toISOString(), investigationId)

      // 13. Remove from queue
      this.db.prepare('DELETE FROM agent_queue WHERE alert_id = ?').run(alertId)

      return {
        investigationId,
        verdict: conclusion.verdict,
        riskScore: conclusion.riskScore,
        report: conclusion.report
      }
    } catch (err) {
      console.error(`Investigation error [${investigationId}]:`, err.message)

      // Mark as failed
      this.db
        .prepare('UPDATE agent_investigations SET status = ?, error = ?, completed_at = ? WHERE id = ?')
        .run('failed', err.message, new Date().toISOString(), investigationId)

      this.db.prepare('DELETE FROM agent_queue WHERE alert_id = ?').run(alertId)

      throw err
    }
  }

  /**
   * Triage: score alert to determine if investigation is needed
   */
  async triageAlert(alert) {
    let score = 20 // baseline

    // Rule-based scoring
    if (alert.severity === 'CRITICAL') score += 40
    else if (alert.severity === 'HIGH') score += 25
    else if (alert.severity === 'MEDIUM') score += 10

    if (alert.priority === 'P0') score += 30
    else if (alert.priority === 'P1') score += 20
    else if (alert.priority === 'P2') score += 5

    if (alert.score > 90) score += 15
    else if (alert.score > 70) score += 10

    if (alert.actor === 'system') score -= 10

    if (alert.dismissed) {
      return { shouldInvestigate: false, priority: 'P3', priorityScore: 0, reason: 'Alert dismissed' }
    }

    const shouldInvestigate = score >= 60
    const priority = score >= 80 ? 'P0' : score >= 60 ? 'P1' : score >= 40 ? 'P2' : 'P3'

    // Optional Claude triage (if available)
    if (this.claudeAvailable && shouldInvestigate) {
      try {
        const response = await this.claudeCall(
          AGENT_TRIAGE_PROMPT(alert),
          'triage',
          1500
        )

        if (response) {
          const claude = this.extractJSON(response)
          if (claude && claude.shouldInvestigate !== undefined) {
            return {
              shouldInvestigate: claude.shouldInvestigate,
              priority: claude.priority || priority,
              priorityScore: claude.priorityScore || score,
              reason: claude.reason
            }
          }
        }
      } catch (err) {
        console.warn('Claude triage failed, using rule-based:', err.message)
      }
    }

    return {
      shouldInvestigate,
      priority,
      priorityScore: score,
      reason: `Rule-based triage: score=${score}`
    }
  }

  /**
   * Plan: generate investigation steps
   */
  async planInvestigation(alert, context, memory) {
    if (!this.claudeAvailable) {
      // Fallback: generate default plan based on alert type
      return this.getDefaultPlan(alert)
    }

    try {
      const response = await this.claudeCall(
        AGENT_PLAN_PROMPT(alert, context),
        'plan',
        2000
      )

      if (response) {
        const plan = this.extractJSON(response)
        if (plan && plan.steps && Array.isArray(plan.steps)) {
          return plan
        }
      }
    } catch (err) {
      console.warn('Claude plan failed, using default:', err.message)
    }

    return this.getDefaultPlan(alert)
  }

  getDefaultPlan(alert) {
    const plans = {
      'AUTH_ANOMALY': {
        investigationHypothesis: 'Unauthorized access attempt',
        steps: [
          { id: 's1', tool: 'getSignInLogs', params: { days: 3 }, rationale: 'Check sign-in pattern', priority: 1 },
          { id: 's2', tool: 'getRiskDetections', params: {}, rationale: 'Check risk detections', priority: 2 }
        ]
      },
      'ROLE_CHANGE': {
        investigationHypothesis: 'Privilege escalation or unauthorized role assignment',
        steps: [
          { id: 's1', tool: 'getAuditLogs', params: { days: 1 }, rationale: 'Check role change audit', priority: 1 },
          { id: 's2', tool: 'checkUserRoles', params: {}, rationale: 'Verify current roles', priority: 2 }
        ]
      },
      'APP_CHANGE': {
        investigationHypothesis: 'Unauthorized app modification or registration',
        steps: [
          { id: 's1', tool: 'getAuditLogs', params: { days: 1 }, rationale: 'Check app change history', priority: 1 },
          { id: 's2', tool: 'getOAuthConsents', params: {}, rationale: 'Check OAuth consents', priority: 2 }
        ]
      }
    }

    return plans[alert.type] || {
      investigationHypothesis: 'Security anomaly detected',
      steps: [
        { id: 's1', tool: 'getSignInLogs', params: { days: 3 }, rationale: 'General investigation', priority: 1 }
      ]
    }
  }

  /**
   * Execute a single investigation step
   */
  async executeStep(step) {
    const start = Date.now()

    try {
      const result = await this.tools.execute(step.tool, step.params)
      return {
        stepId: step.id,
        toolName: step.tool,
        params: step.params,
        data: result.data,
        recordCount: result.recordCount || 0,
        source: result.source || 'unknown',
        error: null,
        duration: Date.now() - start
      }
    } catch (err) {
      return {
        stepId: step.id,
        toolName: step.tool,
        params: step.params,
        data: null,
        recordCount: 0,
        error: err.message,
        duration: Date.now() - start
      }
    }
  }

  /**
   * Analyze gathered evidence
   */
  async analyzeResults(contextWindow, iteration, maxIterations) {
    if (!this.claudeAvailable) {
      // Fallback: rule-based analysis
      return {
        findings: 'Evidence gathered. Insufficient data for AI analysis.',
        decision: iteration >= maxIterations - 1 ? 'conclude' : 'continue',
        confidence: 40,
        rationale: 'Rule-based analysis',
        threatIndicators: [],
        currentRiskScore: 50,
        nextSteps: []
      }
    }

    try {
      const response = await this.claudeCall(
        AGENT_ANALYZE_PROMPT(contextWindow, iteration, maxIterations),
        'analyze',
        1500
      )

      if (response) {
        const analysis = this.extractJSON(response)
        if (analysis && analysis.decision) {
          return analysis
        }
      }
    } catch (err) {
      console.warn('Claude analysis failed, using default:', err.message)
    }

    return {
      findings: 'Analysis inconclusive',
      decision: 'conclude',
      confidence: 50,
      rationale: 'Insufficient data',
      threatIndicators: [],
      currentRiskScore: 50,
      nextSteps: []
    }
  }

  /**
   * Conclude investigation with final verdict
   */
  async concludeInvestigation(evidenceSummary) {
    if (!this.claudeAvailable) {
      // Fallback: rule-based conclusion
      return {
        verdict: 'uncertain',
        riskScore: 60,
        confidence: 40,
        summary: 'Investigation concluded without AI analysis',
        evidence: [],
        recommendations: ['Review alert manually'],
        report: '# Investigation Report\n\nNo Claude AI available for analysis.\nPlease review alert and evidence manually.'
      }
    }

    try {
      const response = await this.claudeCall(
        AGENT_CONCLUDE_PROMPT(evidenceSummary),
        'conclude',
        2000
      )

      if (response) {
        const conclusion = this.extractJSON(response)
        if (conclusion && conclusion.verdict) {
          return conclusion
        }
      }
    } catch (err) {
      console.warn('Claude conclusion failed, using default:', err.message)
    }

    return {
      verdict: 'uncertain',
      riskScore: 60,
      confidence: 50,
      summary: 'Investigation inconclusive',
      evidence: [],
      recommendations: ['Review evidence manually'],
      report: '# Investigation Report\n\nInconclusive results. Manual review recommended.'
    }
  }

  /**
   * Take action on investigation result
   */
  async takeAction(conclusion, alert, investigationId) {
    // Always: update alert status
    this.db
      .prepare('UPDATE alerts SET dismissed = ? WHERE id = ?')
      .run(0, alert.id)

    // In-app notification for true positives
    if (conclusion.verdict === 'true_positive') {
      try {
        const store = this.db.getStore()
        const notification = {
          id: `notif-${uuid()}`,
          type: 'investigation_complete',
          severity: 'CRITICAL',
          title: `Threat Confirmed: ${alert.headline}`,
          message: `Autonomous investigation confirmed threat. Risk Score: ${conclusion.riskScore}/100`,
          investigationId,
          alertId: alert.id,
          created_at: new Date().toISOString(),
          read: false
        }

        if (!store.agentLogs) store.agentLogs = {}
        store.agentLogs[notification.id] = notification
        console.log(`✓ Created in-app notification for confirmed threat`)
      } catch (err) {
        console.warn('Failed to create notification:', err.message)
      }
    }

    console.log(`✓ Investigation action completed (verdict: ${conclusion.verdict})`)
  }

  /**
   * Claude API call wrapper with timeout and fallback
   */
  async claudeCall(prompt, type, maxTokens) {
    if (!this.anthropic) return null

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000)

      const response = await this.anthropic.messages.create(
        {
          model: 'claude-opus-4-8',
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }]
        },
        { signal: controller.signal }
      )

      clearTimeout(timeout)

      const content = response.content[0]?.text || ''
      console.log(`Claude ${type} call completed (tokens: ${response.usage.output_tokens})`)

      return content
    } catch (err) {
      console.error(`Claude ${type} call failed:`, err.message)
      return null
    }
  }

  /**
   * Robust JSON extraction from Claude responses
   */
  extractJSON(text) {
    if (!text) return null

    try {
      return JSON.parse(text)
    } catch {
      // Try extracting from code block
      const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          return JSON.parse(match[1] || match[0])
        } catch {
          return null
        }
      }
    }

    return null
  }
}

export default ThreatInvestigationAgent
