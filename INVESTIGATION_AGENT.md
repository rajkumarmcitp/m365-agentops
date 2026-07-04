# Investigation Agent - Architecture & Implementation

## Overview

The Investigation Agent is an AI-powered analysis system that transforms raw Microsoft Graph API telemetry into actionable security insights. Instead of displaying 28 independent datasets, the agent correlates all data and answers the questions a SOC analyst would ask.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│           User Investigation Page (Frontend)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Collects data from 14 Graph API endpoints
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         Data Collection Layer (Backend)                      │
│  ├─ User Profile                                             │
│  ├─ Sign-in Activity                                         │
│  ├─ Risk Detections                                          │
│  ├─ Devices (Registered & Managed)                           │
│  ├─ Group Memberships                                        │
│  ├─ Directory Roles                                          │
│  ├─ Authentication Methods                                   │
│  ├─ OAuth Consents                                           │
│  ├─ Security Alerts                                          │
│  ├─ Account Changes                                          │
│  └─ Enterprise Applications                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Passes structured data
                       ▼
┌─────────────────────────────────────────────────────────────┐
│    Investigation Agent (Claude Opus 4.8)                    │
│                                                               │
│  Analysis Responsibilities:                                  │
│  ├─ Normalize & structure data                               │
│  ├─ Build chronological timeline                             │
│  ├─ Detect suspicious patterns                               │
│  ├─ Calculate risk scores                                    │
│  ├─ Assign confidence levels                                 │
│  ├─ Generate narrative summaries                             │
│  └─ Recommend remediation actions                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Returns structured analysis
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         Investigation Analysis Component                     │
│                                                               │
│  Display Sections:                                           │
│  ├─ Executive Summary (Risk Score + Verdict)                │
│  ├─ User Story (Narrative Description)                      │
│  ├─ Key Findings (Bullet Points)                            │
│  ├─ Event Timeline (Correlated Events)                       │
│  ├─ Suspicious Patterns (Red Flags)                          │
│  └─ Recommended Actions (Next Steps)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. Investigation Agent (`lib/investigation-agent.js`)

The core AI analysis engine that:

```javascript
generateInvestigationAnalysis(userData)
  ├─ Normalizes data from all Graph API sources
  ├─ Calls Claude Opus 4.8 with structured prompts
  ├─ Parses response into structured sections
  └─ Returns analysis with confidence scores
```

**System Prompt Responsibilities:**
- Identify what happened (user story)
- Calculate risk scores (0-100)
- Detect suspicious chains
- Assign confidence levels
- Recommend actions

### 2. Analysis Endpoint (`backend/server.js`)

```
GET /api/user-investigation/analysis?data={...}
└─ Receives all investigation data as JSON
└─ Calls investigation agent
└─ Returns structured analysis
```

### 3. Analysis Component (`components/investigation-analysis.js`)

Renders the agent's findings with:
- **Executive Summary Card** - Risk score and verdict
- **Key Findings** - Bullet points with checkmarks
- **Event Timeline** - Chronological event correlation
- **Suspicious Patterns** - Warning section for red flags
- **Recommended Actions** - Actionable next steps
- **Full Analysis** - Detailed narrative from agent

### 4. Frontend Integration (`pages/user-investigation.js`)

```javascript
async function generateAIAnalysis(el, data) {
  showAnalysisLoading(section)
  const response = await fetch('/api/user-investigation/analysis?data=...')
  renderInvestigationAnalysis(section, response.analysis)
}
```

---

## What the Agent Analyzes

### Data Normalization

The agent receives and correlates:

```javascript
{
  user: {
    displayName, department, lastActive, ...
  },
  authentication: {
    signIns: [{timestamp, location, device, status, riskLevel}],
    riskDetections: [{type, riskLevel, location}],
    authMethods: [method names],
    riskyUser: {riskLevel, riskState}
  },
  deviceAndAccess: {
    registeredDevices: [{name, os, type}],
    managedDevices: [{name, compliance, encrypted}]
  },
  access: {
    groups: [group names],
    roles: [role names],
    oauthConsents: [{app, permissions, consentType}],
    enterpriseApps: [{name, createdDate}]
  },
  accountChanges: {
    passwordReset: boolean,
    mfaChanges: [...],
    roleChanges: [...],
    groupChanges: [...],
    licenseChanges: [...],
    otherChanges: count
  },
  alerts: {
    securityAlerts: [{title, severity, status, source}]
  }
}
```

### Analysis Outputs

#### 1. User Story
```
Example: "Raj Kumar signed in successfully from Chennai using a managed Windows device 
with MFA. Four hours later, a high-risk sign-in from Germany was detected but blocked 
by Conditional Access. A new OAuth application was granted Mail.Read permissions."
```

#### 2. Risk Assessment
```
Overall Risk: Medium (42/100)

Reasoning:
- Successful authenticated session (Low risk)
- Blocked risky sign-in (Protected by CA)
- New OAuth consent (Requires review)
```

#### 3. Key Findings
```
✓ 6 successful sign-ins from Chennai
✓ 1 blocked high-risk sign-in from Germany
✓ 2 managed devices (both compliant)
✓ MFA completed successfully
✓ 1 new OAuth consent granted
✓ No privileged role changes
```

#### 4. Event Timeline
```
09:00 ─ Sign-in successful (Chennai)
09:02 ─ MFA completed
09:05 ─ Device registered
09:10 ─ OAuth consent granted
09:15 ─ Risky sign-in detected (Germany) ─ BLOCKED
```

#### 5. Suspicious Patterns
```
Pattern Detected: Geographically Impossible Travel
- Sign-in from Chennai at 09:00
- Sign-in attempt from Germany at 09:15
- Travel time: ~8 hours minimum required
- Risk: Account compromise

Action: Conditional Access blocked the attempt
Status: Protected
```

#### 6. Confidence Scores
```
Normal Activity          : 85% confidence
Suspicious Activity     : 45% confidence
Account Compromise      : 15% confidence
```

#### 7. Recommendations
```
→ Review the newly granted OAuth application's permissions
→ Confirm the blocked Germany sign-in with the user
→ Monitor for additional sign-in attempts from unfamiliar locations
→ Consider adding geographic restrictions to Conditional Access
```

#### 8. Final Verdict
```
🟡 SUSPICIOUS ACTIVITY (42/100)

The investigation identified one notable event (blocked risky sign-in) and one 
permission-related change (new OAuth consent) that warrant review. 

No indicators of active compromise detected. Conditional Access successfully 
prevented unauthorized access from an impossible travel scenario.

Recommended: Review OAuth application and confirm geography with user.
```

---

## Agent Prompting Strategy

The agent uses a structured approach to analysis:

### System Prompt (High-Level)
```
You are a security analyst AI investigating M365 user activity.
Analyze the provided data and produce:
1. User story (what happened)
2. Risk score (0-100)
3. Key findings (5-10 bullet points)
4. Event timeline (with correlations)
5. Suspicious patterns (if any)
6. Confidence scores
7. Recommended actions
8. Final verdict (Normal/Suspicious/Compromise)
```

### User Prompt (Specific Investigation)
```
Analyze this investigation data:
[All normalized data in JSON format]

Format your response with clear sections for:
- User Story
- Risk Assessment
- Key Findings
- Event Timeline
- Suspicious Patterns
- Confidence Scores
- Recommended Actions
- Final Verdict
```

---

## Risk Scoring Methodology

The agent weights events by severity:

| Event | Weight |
|-------|--------|
| Successful Sign-in | +1 |
| New Device | +5 |
| New Location | +10 |
| New MFA Method | +15 |
| OAuth Consent | +15 |
| MFA Failure | +20 |
| External Sharing | +20 |
| Privilege Escalation | +30 |
| Impossible Travel | +40 |
| Password Reset | +15 |
| Mailbox Forwarding | +35 |

### Risk Levels
- **0-20**: Low Risk (Normal Activity)
- **21-40**: Medium Risk (Review Recommended)
- **41-70**: High Risk (Investigate)
- **71-100**: Critical (Immediate Action)

---

## Pattern Detection

The agent identifies suspicious chains:

### Pattern 1: Account Compromise
```
New Country
    ↓
MFA Failure
    ↓
Successful Login
    ↓
Mailbox Access
    ↓
External Forwarding

Finding: Potential account compromise
Action: Require password reset & MFA re-registration
```

### Pattern 2: Insider Activity
```
Successful Login
    ↓
Large File Downloads
    ↓
External Sharing
    ↓
License Removed

Finding: Possible data exfiltration
Action: Block external sharing & audit file access
```

### Pattern 3: Privilege Escalation
```
User Login
    ↓
Global Admin Assigned
    ↓
Application Permission Granted
    ↓
Directory Changes

Finding: Privilege escalation
Action: Review role assignment & audit directory changes
```

---

## Implementation Files

```
lib/investigation-agent.js
├─ generateInvestigationAnalysis(userData)
├─ runInvestigationAgent(data)
├─ normalizeInvestigationData(userData)
├─ parseInvestigationAnalysis(text)
└─ getDefaultAnalysis(userData)

backend/server.js
└─ GET /api/user-investigation/analysis

components/investigation-analysis.js
├─ renderInvestigationAnalysis(el, analysis)
├─ showAnalysisLoading(el)
└─ Helper functions (getVerdictStyle, getVerdictIcon, escapeHtml)

pages/user-investigation.js
└─ generateAIAnalysis(el, data)
```

---

## Usage Flow

1. **User selects target user** and clicks "Investigate"
2. **Data collection** - All 14 Graph API endpoints are called in parallel
3. **Data normalization** - Raw responses are structured for analysis
4. **AI analysis** - Investigation Agent analyzes all data via Claude
5. **Results display** - Analysis rendered in Investigation Analysis component
6. **User sees**:
   - Executive summary with risk score
   - User story narrative
   - Key findings (bullet points)
   - Event timeline with correlations
   - Suspicious patterns (if any)
   - Recommended actions
   - Final verdict

---

## Example Investigation

### Input Data
```
User: Raj Kumar
Sign-ins: 6 (5 Chennai, 1 Berlin-blocked)
Risk Detections: 1 (Impossible Travel)
Devices: 2 (both compliant)
Groups: 5
Roles: 0
OAuth Consents: 1 (new)
Alerts: 1 (high-risk blocked)
Account Changes: 0
```

### Agent Analysis Output

```
╔════════════════════════════════════════════════════════════╗
║           INVESTIGATION SUMMARY - RAJ KUMAR                 ║
╚════════════════════════════════════════════════════════════╝

Overall Risk: MEDIUM (42/100)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USER STORY

Raj Kumar successfully authenticated from Chennai at 09:00 using a 
managed Windows device with MFA. Later that day, a high-risk sign-in 
was detected from Germany but was blocked by Conditional Access. 
A new OAuth application was granted Mail.Read permissions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY FINDINGS

✓ 6 successful sign-ins (all from Chennai)
✓ 1 blocked risky sign-in (impossible travel from Germany)
✓ 2 managed devices (100% compliant)
✓ MFA completed successfully
✓ 1 new OAuth consent (Mail.Read)
✓ No privileged role changes
✓ No password resets detected
✓ No mailbox delegation changes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDED ACTIONS

→ Review the newly granted OAuth application's permissions
→ Confirm the blocked Germany sign-in with the user
→ Monitor for additional sign-in attempts over 24 hours
→ Consider geographic restrictions in Conditional Access

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VERDICT: 🟡 SUSPICIOUS ACTIVITY

No confirmed account compromise. Conditional Access successfully 
prevented unauthorized access. OAuth permission change warrants 
review. Continue monitoring.
```

---

## Performance Considerations

- **Data Collection**: Parallel API calls (~2-3 seconds)
- **AI Analysis**: Claude API response (~5-10 seconds)
- **Frontend Rendering**: Instant display, async analysis

The analysis is generated asynchronously after initial data display, so users see investigation data immediately while the AI analysis loads in the background.

---

## Future Enhancements

1. **Baseline Comparison** - Compare to user's historical behavior
2. **Peer Group Analysis** - Compare to similar users in organization
3. **Threat Intelligence Integration** - Cross-reference with known threats
4. **Custom Scoring Rules** - Organization-specific risk weights
5. **Automated Response** - Suggest automated containment actions
6. **Multi-Turn Investigation** - Follow-up questions and deeper analysis
7. **Investigation History** - Track and learn from past investigations
8. **Verdict Explainability** - Show scoring breakdown for each event

---

## Why AI Adds Value Here

Traditional security tools show you **what happened** (raw logs).

The Investigation Agent shows you **what it means** (context, risk, action):

| Traditional | Investigation Agent |
|------------|-------------------|
| "6 sign-ins detected" | "Normal activity for this user" |
| "New OAuth app" | "Mail.Read permission - requires review" |
| "Risk detection: Impossible Travel" | "Blocked by CA - no compromise" |
| "MFA enabled" | "Security posture improved" |
| 28 data sources | "User story + Risk score + Actions" |

This is where **human expertise meets AI efficiency**: The agent does the analysis that would take a SOC analyst 15 minutes in seconds, allowing analysts to focus on investigation and remediation.
