/**
 * Investigation Agent
 * Correlates all user investigation data and provides AI-driven security insights
 *
 * This agent transforms raw Microsoft Graph telemetry into analyst-ready reports
 * by identifying patterns, calculating risk scores, and recommending actions.
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  AUDIT_CATEGORIES,
  SEVERITY_LEVELS,
  categorizeActivity,
  getCriticalFlagInfo,
  isPriorityActivity,
  getAISummarizationPattern,
  AI_SUMMARIZATION_PATTERNS,
  CRITICAL_FLAG_ACTIVITIES
} from './directory-audit-categories.js';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Generate investigation analysis using Claude
 * Takes all collected data and produces structured insights
 */
export async function generateInvestigationAnalysis(userData) {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('⚠️ ANTHROPIC_API_KEY not set. Using fallback analysis.');
      return {
        success: false,
        error: 'API key not configured. Set ANTHROPIC_API_KEY environment variable for full AI analysis.',
        analysis: getDefaultAnalysis(userData)
      };
    }

    const normalizedData = normalizeInvestigationData(userData);

    // Use multi-turn agent approach with specialized analyses
    const analysis = await runInvestigationAgent(normalizedData);

    return {
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Investigation agent error:', error.message);
    return {
      success: false,
      error: error.message.includes('apiKey')
        ? 'API key not configured. Set ANTHROPIC_API_KEY for full AI analysis.'
        : error.message,
      analysis: getDefaultAnalysis(userData)
    };
  }
}

/**
 * Run the main investigation agent with specialized sub-agents
 */
async function runInvestigationAgent(data) {
  const systemPrompt = `You are a security analyst AI investigating user activity in Microsoft 365.
Your goal is to produce a concise, actionable investigation report that answers these questions:

1. What happened? (user story)
2. How risky is this? (risk assessment)
3. What chains of events are suspicious? (correlation)
4. What should we do about it? (recommendations)
5. Is this normal or compromised? (verdict)

## Investigation Categories (Use These to Organize Your Analysis)

Directory Audit activities fall into 8 categories:

1. **Account Lifecycle**: User creation, deletion, enable/disable, restore
2. **Credential Changes**: Password resets, MFA registration/deletion, authentication method changes
3. **Privileged Access**: Role assignments, PIM activations, admin privilege changes
4. **Group Membership**: User added/removed from groups, group ownership changes
5. **Licensing**: License assignments, service plan updates
6. **Application Access**: OAuth consents, app role assignments, enterprise app changes
7. **Security Policy Impact**: Conditional Access, authentication policies, trusted locations
8. **Administrative Changes**: Manager updates, department changes, location updates

## Critical Activities to Flag Immediately

These activities always indicate investigation-worthy events:
- Reset password: Admin forced password change
- Delete authentication method: MFA removal (often precedes compromise)
- Register authentication method: New MFA device registered
- Add member to role: User became administrator
- Add delegated permission grant: OAuth consent granted
- Add app role assignment: App granted high privileges
- Delete user: Account removed
- Restore user: Deleted account restored
- Update Conditional Access policy: Security controls changed

## How to Summarize Activity Patterns

Instead of listing events, summarize them in business language:
- "Password reset + MFA registration" → "The user's credentials were updated and a new MFA method was registered."
- "Role assignment + group membership" → "The user received additional administrative privileges."
- "OAuth consent + app role assignment" → "The user authorized a new application with elevated Microsoft 365 permissions."
- "MFA removal + password reset" → "MFA protection was removed and credentials were reset (potential compromise indicator)."

You have access to all user investigation data including sign-ins, risk detections, devices, groups, roles, OAuth consents, alerts, and account changes.

Analyze the data and provide:
- A brief user story (2-3 sentences describing key events)
- Overall risk score (0-100)
- Executive summary (5-8 bullet points organized by investigation category)
- Correlated events showing relationships and severity
- Any suspicious chains or patterns (use business language summaries)
- Confidence levels for each finding
- Recommended next actions prioritized by severity
- Final verdict (Normal Activity / Suspicious Activity / Potential Compromise)

Focus on what matters: unusual patterns, privilege escalation, data access changes, account risks, and activities in the critical activities list.
Ignore routine operations. Explain WHY each event matters.`;

  // Extract critical activities and patterns for the AI
  const criticalActivities = (data.accountChanges?.activities || [])
    .filter(a => getCriticalFlagInfo(a.action))
    .map(a => {
      const flagInfo = getCriticalFlagInfo(a.action);
      return `${a.action} [${flagInfo.severity}]: ${flagInfo.reason} - ${flagInfo.investigationHint}`;
    });

  // Detect activity patterns
  const accountChangeActions = (data.accountChanges?.activities || []).map(a => a.action);
  const detectedPatterns = AI_SUMMARIZATION_PATTERNS
    .filter(p => p.activities.some(act => accountChangeActions.includes(act)))
    .map(p => `${p.pattern}: "${p.aiSummary}"`);

  const userPrompt = `Analyze this investigation data and provide a comprehensive security analysis:

${JSON.stringify(data, null, 2)}

${criticalActivities.length > 0 ? `\n## CRITICAL ACTIVITIES DETECTED (Investigate Immediately)\n${criticalActivities.map(a => `- ${a}`).join('\n')}\n` : ''}

${detectedPatterns.length > 0 ? `\n## ACTIVITY PATTERNS DETECTED\n${detectedPatterns.map(p => `- ${p}`).join('\n')}\n` : ''}

Format your response as a structured investigation report with clear sections for:
1. User Story (2-3 sentences)
2. Risk Assessment (0-100 score with explanation)
3. Key Findings (5-10 bullet points organized by investigation category)
4. Event Timeline (with severity indicators)
5. Suspicious Patterns (summarized in business language, if any)
6. Confidence Scores (for each major finding)
7. Recommended Actions (prioritized by severity)
8. Final Verdict (Normal Activity / Suspicious Activity / Potential Compromise)

Be concise but thorough. Focus on actionable insights. When summarizing activities, use business language rather than technical jargon.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ]
  });

  return {
    summary: response.content[0].type === 'text' ? response.content[0].text : '',
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens
    }
  };
}

/**
 * Normalize and structure all investigation data for analysis
 */
function normalizeInvestigationData(userData) {
  return {
    user: {
      displayName: userData.user?.displayName || 'Unknown',
      userPrincipalName: userData.user?.mail || 'unknown@example.com',
      department: userData.user?.department || 'N/A',
      lastActive: userData.user?.lastActive || 'Unknown'
    },

    authentication: {
      signInCount: (userData.signInActivity || []).length,
      signIns: (userData.signInActivity || []).map(s => ({
        timestamp: s.timestamp,
        location: s.location,
        device: s.device,
        status: s.status,
        riskLevel: s.riskLevel
      })),

      riskDetections: (userData.riskDetections || []).map(r => ({
        type: r.detectionType,
        riskLevel: r.riskLevel,
        location: r.location,
        time: r.detectionTime
      })),

      authMethods: (userData.authenticationMethods || []).map(m => m.displayName),

      riskyUser: userData.riskyUser?.id ? {
        riskLevel: userData.riskyUser.riskLevel,
        riskState: userData.riskyUser.riskState
      } : null
    },

    deviceAndAccess: {
      registeredDevices: (userData.registeredDevices || []).map(d => ({
        name: d.name,
        os: d.os,
        type: d.type
      })),

      managedDevices: (userData.managedDevices || []).map(d => ({
        name: d.name,
        complianceState: d.complianceState,
        encrypted: d.encrypted,
        lastSync: d.lastSync
      }))
    },

    access: {
      groups: (userData.userGroups || []).map(g => g.displayName),

      roles: (userData.directoryRoles || []).map(r => r.displayName),

      oauthConsents: (userData.oauthConsent || []).map(o => ({
        app: o.appName,
        permissions: o.permissions,
        consentType: o.consentType,
        grantedDate: o.grantedDate
      })),

      enterpriseApps: (userData.enterpriseApps || []).map(a => ({
        name: a.displayName,
        createdDate: a.createdDateTime
      }))
    },

    accountChanges: {
      activities: (userData.accountChanges || []).map(a => ({
        action: a.action,
        category: categorizeActivity(a.action).category,
        severity: categorizeActivity(a.action).severity,
        timestamp: a.eventTime || a.timestamp,
        actor: a.actor || 'System',
        result: a.result || 'Unknown',
        critical: !!getCriticalFlagInfo(a.action),
        priority: isPriorityActivity(a.action),
        beforeValue: a.beforeValue,
        afterValue: a.afterValue
      })),
      categorizedBySeverity: {
        critical: (userData.accountChanges || []).filter(a => categorizeActivity(a.action).severity === SEVERITY_LEVELS.CRITICAL),
        high: (userData.accountChanges || []).filter(a => categorizeActivity(a.action).severity === SEVERITY_LEVELS.HIGH),
        medium: (userData.accountChanges || []).filter(a => categorizeActivity(a.action).severity === SEVERITY_LEVELS.MEDIUM),
        low: (userData.accountChanges || []).filter(a => categorizeActivity(a.action).severity === SEVERITY_LEVELS.LOW)
      },
      totalCount: (userData.accountChanges || []).length
    },

    alerts: {
      securityAlerts: (userData.securityAlerts || []).map(a => ({
        title: a.title,
        severity: a.severity,
        status: a.status,
        source: a.detectionSource
      }))
    },

    mailbox: {
      settings: userData.mailboxSettings || {},
      timeZone: userData.mailboxSettings?.timeZone
    }
  };
}

/**
 * Generate default analysis when agent fails
 */
function getDefaultAnalysis(userData) {
  const signInCount = (userData.signInActivity || []).length;
  const riskDetections = (userData.riskDetections || []).length;
  const roleCount = (userData.directoryRoles || []).length;
  const oauthCount = (userData.oauthConsent || []).length;
  const accountChanges = (userData.accountChanges || []).length;

  // Simple risk scoring
  let riskScore = 20; // baseline
  riskScore += Math.min(riskDetections * 10, 30);
  riskScore += roleCount > 0 ? 15 : 0;
  riskScore += oauthCount > 0 ? 10 : 0;
  riskScore += accountChanges > 0 ? 5 : 0;
  riskScore = Math.min(riskScore, 100);

  const verdict = riskScore > 60 ? 'Suspicious Activity' : riskScore > 40 ? 'Medium Activity' : 'Normal Activity';

  return {
    userStory: `${userData.user?.displayName || 'User'} had ${signInCount} sign-ins. ${riskDetections} risk detections were triggered. ${oauthCount} OAuth applications granted permissions.`,
    riskScore: riskScore,
    verdict: verdict,
    findings: [
      `${signInCount} successful sign-ins`,
      `${riskDetections} risk detections observed`,
      `${roleCount} directory roles assigned`,
      `${oauthCount} OAuth consents granted`,
      `${accountChanges} account changes detected`
    ].filter(f => !f.includes('0')),
    recommendations: [
      'Review the investigation timeline and correlated events',
      'Validate any new OAuth application permissions',
      'Confirm unusual sign-in locations with the user',
      'Monitor for additional suspicious activities'
    ]
  };
}

/**
 * Extract specific insights from analysis
 */
export function parseInvestigationAnalysis(analysisText) {
  const analysis = {
    userStory: extractSection(analysisText, 'User Story', 2),
    riskAssessment: extractSection(analysisText, 'Risk Assessment', 2),
    findings: extractBulletPoints(analysisText, 'Key Findings'),
    timeline: extractSection(analysisText, 'Event Timeline', 5),
    patterns: extractSection(analysisText, 'Suspicious Patterns', 3),
    recommendations: extractBulletPoints(analysisText, 'Recommended Actions'),
    verdict: extractSection(analysisText, 'Final Verdict', 2)
  };

  return analysis;
}

/**
 * Extract a section from the analysis text
 */
function extractSection(text, sectionName, lines = 3) {
  const regex = new RegExp(`${sectionName}[\\s\\S]*?(?=(?:\\n\\n|[A-Z][a-zA-Z ]+ |$))`, 'i');
  const match = text.match(regex);
  if (match) {
    return match[0]
      .replace(new RegExp(`^${sectionName}\\s*`, 'i'), '')
      .split('\n')
      .slice(0, lines)
      .filter(line => line.trim())
      .join('\n')
      .trim();
  }
  return null;
}

/**
 * Extract bullet points from a section
 */
function extractBulletPoints(text, sectionName) {
  const regex = new RegExp(`${sectionName}[\\s\\S]*?(?=(?:\\n\\n|[A-Z][a-zA-Z ]+ |$))`, 'i');
  const match = text.match(regex);
  if (match) {
    const bullets = match[0]
      .split('\n')
      .filter(line => line.match(/^[\s]*[•\-\*✓✓]/))
      .map(line => line.replace(/^[\s]*[•\-\*✓]+\s*/, '').trim())
      .filter(line => line.length > 0);
    return bullets.length > 0 ? bullets : null;
  }
  return null;
}
