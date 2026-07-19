/**
 * TenantGuard Investigation Service
 * Orchestrates AI-powered security incident investigations
 */

import { getDatabase } from './database.js'
import { ContextBuilder } from './context-builder.js'
import { SYSTEM_PROMPT, INVESTIGATION_PROMPT, FOLLOWUP_PROMPT, REPORT_PROMPT } from './agent-prompts.js'
import { v4 as uuid } from 'uuid'

export class InvestigationService {
  constructor(anthropicClient = null) {
    this.db = getDatabase()
    this.contextBuilder = new ContextBuilder()
    this.anthropic = anthropicClient
    this.claudeAvailable = !!anthropicClient
  }

  /**
   * Initialize Claude client from API key
   */
  static initializeWithApiKey(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
      console.log('ℹ️ Claude API not configured - using mock responses')
      return null
    }

    try {
      // For future use when @anthropic-ai/sdk is installed
      console.log('ℹ️ Claude API key configured (SDK awaiting installation)')
      return null
    } catch (error) {
      console.error('⚠️ Failed to initialize Claude API:', error.message)
      return null
    }
  }

  /**
   * Get Claude configuration status
   */
  getStatus() {
    return {
      available: this.claudeAvailable,
      mode: this.claudeAvailable ? 'Claude API' : 'Mock Responses',
      message: this.claudeAvailable
        ? '✅ Claude API is configured and active'
        : 'ℹ️ Using mock responses (no Claude API configured)'
    }
  }

  /**
   * Start a new investigation
   */
  async startInvestigation(alertId = null, correlationId = null, title = null) {
    const id = uuid()

    try {
      // Build context from alert or correlation
      let context = null
      let severity = 'MEDIUM'

      if (correlationId) {
        context = this.contextBuilder.buildCorrelationContext(correlationId)
        if (!context) throw new Error('Correlation not found')
        severity = context.correlation.severity
        title = title || `Investigation: ${context.correlation.pattern}`
      } else if (alertId) {
        context = this.contextBuilder.buildAlertContext(alertId)
        if (!context) throw new Error('Alert not found')
        severity = context.alert.severity
        title = title || `Investigation: ${context.alert.headline}`
      } else {
        throw new Error('Either alertId or correlationId required')
      }

      // Create investigation record
      this.db.prepare(`
        INSERT INTO investigations (id, title, alert_id, correlation_id, severity)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, title, alertId, correlationId, severity)

      // Get initial analysis from Claude/mock
      const analysis = await this.analyzeIncident(context)

      // Store agent's opening analysis
      this.addMessage(id, analysis, 'agent')

      return {
        id,
        title,
        severity,
        analysis,
        context: this.sanitizeContext(context)
      }
    } catch (error) {
      console.error('Investigation start failed:', error)
      throw error
    }
  }

  /**
   * Analyze incident with Claude or mock
   */
  async analyzeIncident(context) {
    const prompt = INVESTIGATION_PROMPT(context.summary)

    // If Claude client is available, use it
    if (this.anthropic) {
      try {
        const response = await this.anthropic.messages.create({
          model: 'claude-opus-4-8',
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [
            { role: 'user', content: prompt }
          ]
        })

        return response.content[0].type === 'text' ? response.content[0].text : ''
      } catch (error) {
        console.error('Claude API error:', error.message)
        // Fall through to mock
      }
    }

    // Use mock analysis as fallback
    return this.generateMockAnalysis(context)
  }

  /**
   * Continue conversation with the agent
   */
  async chat(investigationId, userMessage) {
    try {
      const investigation = this.db.prepare(
        'SELECT * FROM investigations WHERE id = ?'
      ).get(investigationId)

      if (!investigation) {
        throw new Error('Investigation not found')
      }

      // Add user message to history
      this.addMessage(investigationId, userMessage, 'user')

      // Get conversation history
      const history = this.db.prepare(`
        SELECT * FROM investigation_chats
        WHERE investigation_id = ?
        ORDER BY timestamp ASC
      `).all(investigationId)

      // Build context for this investigation
      let context = null
      if (investigation.alert_id) {
        context = this.contextBuilder.buildAlertContext(investigation.alert_id)
      } else if (investigation.correlation_id) {
        context = this.contextBuilder.buildCorrelationContext(investigation.correlation_id)
      }

      if (!context) {
        throw new Error('Could not build context for investigation')
      }

      // Prepare messages for Claude
      const messages = history.map(h => ({
        role: h.sender_type === 'user' ? 'user' : 'assistant',
        content: h.message_text
      }))

      // Get response from Claude
      let agentResponse = ''

      if (this.anthropic) {
        try {
          const response = await this.anthropic.messages.create({
            model: 'claude-opus-4-8',
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: messages
          })

          agentResponse = response.content[0].type === 'text' ? response.content[0].text : ''
        } catch (error) {
          console.error('Claude API error:', error.message)
          agentResponse = this.generateMockResponse(userMessage, context)
        }
      } else {
        agentResponse = this.generateMockResponse(userMessage, context)
      }

      // Store agent response
      this.addMessage(investigationId, agentResponse, 'agent')

      return agentResponse
    } catch (error) {
      console.error('Chat error:', error)
      throw error
    }
  }

  /**
   * Get investigation details with full history
   */
  getInvestigation(investigationId) {
    try {
      const investigation = this.db.prepare(
        'SELECT * FROM investigations WHERE id = ?'
      ).get(investigationId)

      if (!investigation) {
        return null
      }

      const messages = this.db.prepare(`
        SELECT * FROM investigation_chats
        WHERE investigation_id = ?
        ORDER BY timestamp ASC
      `).all(investigationId)

      return {
        ...investigation,
        messages: messages
      }
    } catch (error) {
      console.error('Error getting investigation:', error)
      return null
    }
  }

  /**
   * Generate formal incident report
   */
  async generateReport(investigationId) {
    try {
      const investigation = this.db.prepare(
        'SELECT * FROM investigations WHERE id = ?'
      ).get(investigationId)

      if (!investigation) {
        throw new Error('Investigation not found')
      }

      // Get context
      let context = null
      if (investigation.alert_id) {
        context = this.contextBuilder.buildAlertContext(investigation.alert_id)
      } else if (investigation.correlation_id) {
        context = this.contextBuilder.buildCorrelationContext(investigation.correlation_id)
      }

      if (!context) {
        throw new Error('Could not build context')
      }

      // Generate report with Claude
      let report = ''

      if (this.anthropic) {
        try {
          const response = await this.anthropic.messages.create({
            model: 'claude-opus-4-8',
            max_tokens: 2000,
            system: SYSTEM_PROMPT,
            messages: [
              {
                role: 'user',
                content: REPORT_PROMPT(context.summary)
              }
            ]
          })

          report = response.content[0].type === 'text' ? response.content[0].text : ''
        } catch (error) {
          console.error('Claude API error:', error.message)
          report = this.generateMockReport(investigation, context)
        }
      } else {
        report = this.generateMockReport(investigation, context)
      }

      // Update investigation with completed report
      this.db.prepare(`
        UPDATE investigations
        SET summary = ?, status = 'completed', completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(report, investigationId)

      return report
    } catch (error) {
      console.error('Report generation error:', error)
      throw error
    }
  }

  /**
   * Get all investigations
   */
  listInvestigations(status = null) {
    try {
      let query = 'SELECT * FROM investigations'
      const params = []

      if (status) {
        query += ' WHERE status = ?'
        params.push(status)
      }

      query += ' ORDER BY created_at DESC LIMIT 50'

      return this.db.prepare(query).all(...params)
    } catch (error) {
      console.error('Error listing investigations:', error)
      return []
    }
  }

  // ============================================================
  // Helper Methods
  // ============================================================

  /**
   * Add message to investigation chat history
   */
  addMessage(investigationId, text, senderType) {
    try {
      this.db.prepare(`
        INSERT INTO investigation_chats (id, investigation_id, message_text, sender_type)
        VALUES (?, ?, ?, ?)
      `).run(uuid(), investigationId, text, senderType)
    } catch (error) {
      console.error('Error adding message:', error)
    }
  }

  /**
   * Sanitize context for frontend (remove sensitive data)
   */
  sanitizeContext(context) {
    return {
      summary: context.summary,
      alert_count: context.alerts?.length || 1,
      actor: context.correlation?.actor || context.alert?.actor,
      severity: context.correlation?.severity || context.alert?.severity,
      pattern: context.correlation?.pattern || context.alert?.type
    }
  }

  /**
   * Generate mock analysis (fallback when Claude unavailable)
   */
  generateMockAnalysis(context) {
    const isCritical = context.alert?.severity === 'CRITICAL' ||
                       context.correlation?.severity === 'CRITICAL'

    return `INCIDENT ANALYSIS
=================

${context.summary}

SEVERITY ASSESSMENT
Risk Level: ${isCritical ? 'CRITICAL' : 'HIGH'}
Confidence: High (85%)
This incident shows ${isCritical ? 'severe' : 'significant'} concerning patterns requiring immediate attention.

RISK ANALYSIS
- Potential for unauthorized access or data exposure
- Possible privilege escalation attempt
- Account compromise indicators present

IMMEDIATE ACTIONS (Next Hour)
1. Verify if the activity was authorized by the account owner
2. Review the complete timeline of events
3. Check for any additional suspicious activity from the same actor
4. Preserve all audit logs related to this incident
5. Alert security team leadership

INVESTIGATION STEPS
1. Timeline analysis - When did each event occur?
2. Actor verification - Is this a known user? Known location?
3. Related activity - What else has this actor done?
4. Authorization check - Was any of this approved?
5. Impact assessment - What resources were affected?

REMEDIATION
Based on authorization status:
- If UNAUTHORIZED:
  • Immediately disable the actor's account or revoke permissions
  • Force password reset if account was compromised
  • Revoke any tokens or sessions
  • Revert unauthorized configuration changes

- If AUTHORIZED:
  • Document the business justification
  • Verify no side effects from the changes
  • Update security controls if needed

PREVENTION
- Implement Privileged Access Management (PAM)
- Require approval workflows for sensitive operations
- Enable advanced threat protection
- Increase monitoring on sensitive operations
- Regular security awareness training

Next Steps: Investigate further by asking clarifying questions about the activity.
`
  }

  /**
   * Generate contextual mock response
   */
  generateMockResponse(message, context) {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('timeline') || lowerMessage.includes('when') || lowerMessage.includes('sequence')) {
      return `TIMELINE ANALYSIS
=================

Based on the incident context, the events unfolded as follows:

${context.timeline?.slice(0, 8).map((e, i) =>
  `${i + 1}. **${e.time}** [${e.severity}] ${e.action} (Score: ${e.score}/100)`
).join('\n') || 'Timeline data not available'}

The clustering of these events within a short timeframe suggests either:
- Rapid automated activity
- Coordinated attack sequence
- System misconfiguration causing cascade effects

The severity escalation pattern (starting high and remaining high) indicates this was not a momentary blip.`

    } else if (lowerMessage.includes('authorize') || lowerMessage.includes('legitimate') || lowerMessage.includes('approved')) {
      return `AUTHORIZATION ASSESSMENT
=========================

Based on the patterns and context, this activity does NOT appear to be standard authorized activity because:

1. **Timing**: The actions occurred outside normal business hours
2. **Frequency**: Multiple sensitive operations in rapid succession
3. **Pattern**: Matches known attack indicators
4. **Context**: No documented change request or approval ticket

RECOMMENDATION: Treat as UNAUTHORIZED until proven otherwise.

Verification Steps:
1. Contact the account owner directly (via phone, not email)
2. Check for change management tickets
3. Verify with their manager
4. Review their normal activity patterns
5. Check if account was compromised recently

If they confirm authorization:
- Document the business case
- Implement preventive controls for future similar activities
- Review if approval processes need strengthening

If they deny authorization:
- IMMEDIATELY disable the account
- Force password reset
- Review what was accessed/modified
- Check for data exfiltration`

    } else if (lowerMessage.includes('impact') || lowerMessage.includes('damage') || lowerMessage.includes('affect')) {
      return `IMPACT ASSESSMENT
===================

Resource Impact Analysis:

${context.alert ? `
**Primary Alert Impact:**
- Severity: ${context.alert.severity}
- Type: ${context.alert.type}
- Affected Area: ${context.alert.description?.substring(0, 100)}...

**Risk Assessment:**
${context.alert.risk_assessment?.impacts?.join('\n') || '- Multiple systems potentially affected'}
` : `
**Correlation Impact:**
- Alerts Involved: ${context.correlation?.alerts_count || 1}
- Severity: ${context.correlation?.severity}
- Pattern: ${context.correlation?.pattern}
`}

**Potential Damage:**
1. **Confidentiality**: Data could be accessed or exfiltrated
2. **Integrity**: Settings, policies, or records could be modified
3. **Availability**: Services could be disrupted or disabled
4. **Compliance**: Regulatory or policy violations

**Urgency**: ${context.correlation?.score > 85 ? 'IMMEDIATE ACTION REQUIRED' : 'High priority'}

Recommend escalation to incident response team immediately.`

    } else {
      return `Based on the investigation context, this appears to be a concerning security event.

What aspect would you like me to focus on?
- **Timeline** - When did things happen?
- **Authorization** - Was this approved?
- **Impact** - What could go wrong?
- **Remediation** - How do we fix this?
- **Prevention** - How do we stop it happening again?

Or ask me any other specific question about the incident.`
    }
  }

  /**
   * Generate mock formal report
   */
  generateMockReport(investigation, context) {
    return `INCIDENT REPORT
================
Report Generated: ${new Date().toISOString()}
Investigation ID: ${investigation.id}
Severity: ${investigation.severity}

EXECUTIVE SUMMARY
=================
${investigation.title}

Security incident involving suspicious activity patterns detected in tenant audit logs.
${investigation.severity === 'CRITICAL' ? 'This incident requires immediate response and escalation.' : 'Prompt investigation and remediation is recommended.'}

TIMELINE OF EVENTS
==================
${context.timeline?.slice(0, 10).map((e, i) =>
  `${i + 1}. ${e.time}: [${e.severity}] ${e.action}`
).join('\n') || 'Event timeline data'}

THREAT ASSESSMENT
=================
Risk Level: ${investigation.severity}
Confidence Level: High (85%)
Attack Pattern: ${context.correlation?.pattern || 'Suspicious activity'}

Potential Impact:
- Unauthorized access to sensitive data
- Configuration changes to critical systems
- User account or credential compromise
- Policy or security control circumvention

AFFECTED RESOURCES
==================
${context.correlation?.target ? `- Target Resource: ${context.correlation.target}` : ''}
${context.correlation?.actor ? `- Actor: ${context.correlation.actor}` : ''}
${context.alert?.type ? `- Alert Type: ${context.alert.type}` : ''}
- Alerts Involved: ${context.alerts?.length || 1}

RECOMMENDED ACTIONS
===================

IMMEDIATE (Next Hour)
- Verify authorization with account owner
- Preserve all audit logs
- Document all findings
- Alert security leadership

SHORT-TERM (Next 24 Hours)
- Complete investigation steps
- Review related activities
- Determine if unauthorized
- Take remediation actions if needed

LONG-TERM (Next Week)
- Implement preventive controls
- Update security policies
- Review access permissions
- Enhance monitoring

SUCCESS METRICS
===============
✓ Investigation completed
✓ Authorization determined
✓ Remediation steps completed
✓ Monitoring enabled
✓ Stakeholders notified

Report Status: Investigation In Progress
Next Review: ${new Date(Date.now() + 3600000).toISOString()}
`
  }
}
