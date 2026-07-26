/**
 * Agent Memory
 * Manages investigation state across the multi-step agentic loop
 * Persists to in-memory DB for cross-restart survival
 */

import { v4 as uuid } from 'uuid'

export class AgentMemory {
  constructor(investigationId, db) {
    this.investigationId = investigationId
    this.db = db
    this.state = {
      alert: null,
      iteration: 0,
      evidenceChain: [],      // Array of { stepId, toolName, params, data, findings }
      reasoningLog: [],       // Array of { iteration, decision, rationale, threatIndicators, riskScore }
      currentPlan: null,      // Current array of step objects
      verdict: null,
      riskScore: null,
      report: null,
      claudeUsed: false
    }
  }

  setAlert(alert) {
    this.state.alert = alert
  }

  addEvidenceStep(step) {
    // step: { stepId, toolName, params, data, recordCount, duration, source }
    const evidence = {
      stepId: step.stepId,
      iteration: this.state.iteration,
      toolName: step.toolName,
      params: step.params,
      recordCount: step.recordCount || 0,
      data: step.data || {},
      source: step.source || 'unknown',
      duration: step.duration || 0,
      timestamp: new Date().toISOString()
    }

    this.state.evidenceChain.push(evidence)

    // Persist to DB
    try {
      const stepId = `step-${uuid()}`
      this.db
        .prepare(
          'INSERT INTO agent_investigation_steps VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )
        .run(
          stepId,
          this.investigationId,
          this.state.iteration,
          'gather',
          step.toolName,
          JSON.stringify(step.params),
          JSON.stringify(step.data),
          null, // findings (set during analysis)
          null, // next_steps
          0, // tokens_used
          step.duration || 0,
          new Date().toISOString()
        )
    } catch (err) {
      console.warn('Failed to persist evidence step:', err.message)
    }
  }

  addReasoningEntry(decision, rationale, threatIndicators = [], riskScore = 0) {
    const entry = {
      iteration: this.state.iteration,
      decision,
      rationale,
      threatIndicators,
      riskScore,
      timestamp: new Date().toISOString()
    }

    this.state.reasoningLog.push(entry)
  }

  setPlan(steps) {
    this.state.currentPlan = steps
  }

  setVerdict(verdict, riskScore, report = null) {
    this.state.verdict = verdict
    this.state.riskScore = riskScore
    this.state.report = report
  }

  setClaudeUsed(used) {
    this.state.claudeUsed = used
  }

  incrementIteration() {
    this.state.iteration++
  }

  getIteration() {
    return this.state.iteration
  }

  /**
   * Compress evidence chain into a token-efficient context window
   * Includes: original alert, last 3 iterations of findings, reasoning log
   * Max ~8k tokens estimated
   */
  getContextWindow() {
    let context = `ORIGINAL ALERT:
ID: ${this.state.alert?.id || 'unknown'}
Type: ${this.state.alert?.type || 'unknown'}
Severity: ${this.state.alert?.severity || 'unknown'}
Priority: ${this.state.alert?.priority || 'unknown'}
Headline: ${this.state.alert?.headline || 'unknown'}
Description: ${this.state.alert?.description || 'unknown'}
Score: ${this.state.alert?.score || 0}
Created: ${this.state.alert?.created_at || 'unknown'}
Actor: ${this.state.alert?.actor || 'unknown'}
Target: ${this.state.alert?.target || 'unknown'}

---

INVESTIGATION PROGRESS:
Iteration: ${this.state.iteration}
Evidence Steps: ${this.state.evidenceChain.length}
Reasoning Entries: ${this.state.reasoningLog.length}

---

EVIDENCE GATHERED (Last 3 iterations):
`

    // Add last 3 iterations worth of evidence
    const recentEvidence = this.state.evidenceChain.slice(-15) // max 5 steps * 3 iterations
    for (const step of recentEvidence) {
      context += `
Step ${step.iteration}.${step.toolName}:
  Records: ${step.recordCount}
  Duration: ${step.duration}ms
  Source: ${step.source}
  Data Summary:
    ${this._summarizeData(step.data)}
`
    }

    // Add reasoning log
    context += `
---

REASONING CHAIN:
`
    for (const entry of this.state.reasoningLog) {
      context += `
Iteration ${entry.iteration}:
  Decision: ${entry.decision}
  Rationale: ${entry.rationale}
  Threat Indicators: ${entry.threatIndicators.join(', ') || 'none'}
  Risk Score: ${entry.riskScore}
`
    }

    return context
  }

  /**
   * Summarize tool output for token efficiency
   * Keep only key fields, truncate arrays
   */
  _summarizeData(data) {
    if (!data) return 'No data'
    if (Array.isArray(data)) {
      if (data.length === 0) return 'Empty result'
      const sample = data[0]
      return `${data.length} records. Sample: ${JSON.stringify(sample).substring(0, 200)}...`
    }
    return JSON.stringify(data).substring(0, 200) + '...'
  }

  /**
   * Persist full investigation state to DB
   */
  persist() {
    try {
      const reportJson = JSON.stringify(this.state)

      // Update agent_investigations record
      this.db
        .prepare(
          'UPDATE agent_investigations SET iteration = ?, report = ?, claude_used = ? WHERE id = ?'
        )
        .run(this.state.iteration, reportJson, this.state.claudeUsed ? 1 : 0, this.investigationId)
    } catch (err) {
      console.warn('Failed to persist investigation state:', err.message)
    }
  }

  /**
   * Restore investigation state from DB after restart
   */
  static load(investigationId, db) {
    const memory = new AgentMemory(investigationId, db)

    try {
      const row = db.prepare('SELECT * FROM agent_investigations WHERE id = ?').get(investigationId)
      if (row && row.report) {
        const state = JSON.parse(row.report)
        memory.state = { ...memory.state, ...state }
      }
    } catch (err) {
      console.warn('Failed to load investigation state:', err.message)
    }

    return memory
  }

  /**
   * Get full state snapshot for API responses
   */
  getState() {
    return { ...this.state }
  }
}

export default AgentMemory
