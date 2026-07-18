# M365 AgentOps - Monitoring Agents Architecture

## Overview

The M365 AgentOps platform uses a **multi-agent orchestration system** that continuously monitors Microsoft 365 audit logs and triggers critical alerts. Multiple specialized AI agents work in parallel on different schedules to detect threats and security issues.

---

## Agent Types & Responsibilities

### 1. 🔐 Security Agent
**Schedule:** Every 1 hour  
**Focus:** Identity and access threats

**Monitors:**
- Risky user detections (from Entra ID Identity Protection)
- Impossible travel sign-ins
- Leaked credentials
- Password spray attacks
- High-risk sign-ins
- Account compromise indicators

**Data Sources:**
- `/identityProtection/riskyUsers`
- `/auditLogs/signIns`
- `/security/incidents`

**Triggers Alerts For:**
- ⚠️ New risky users flagged
- ⚠️ Compromised credentials detected
- ⚠️ Impossible travel patterns
- ⚠️ Multi-factor authentication bypass attempts

---

### 2. ⚙️ Config Agent
**Schedule:** Every 4 hours  
**Focus:** Configuration and policy compliance

**Monitors:**
- Security policy changes
- Conditional Access modifications
- MFA enforcement status
- Security Defaults status
- DLP policy changes
- Data protection settings

**Data Sources:**
- Azure AD configuration APIs
- Security policies
- Compliance settings

**Triggers Alerts For:**
- 🔔 Policy disabled (CA, MFA, DLP)
- 🔔 Security Defaults turned off
- 🔔 Compliance framework violations
- 🔔 Configuration drift detected

---

### 3. ✅ Approval Agent
**Schedule:** Every 2 hours  
**Focus:** Admin consent and permission grants

**Monitors:**
- OAuth admin consent events
- Application permission grants
- Role assignments
- Service principal creation
- Credential additions (secrets, certificates)

**Data Sources:**
- `/auditLogs/directoryAudits`
- Application registration events
- Role assignment logs

**Triggers Alerts For:**
- 🚨 Admin consent granted
- 🚨 Dangerous permissions granted (Directory.ReadWrite.All)
- 🚨 Privileged role assignments
- 🚨 Service principal credentials added

---

### 4. 🔄 Execution Agent
**Schedule:** Every 6 hours  
**Focus:** Backup and policy execution

**Monitors:**
- Backup job status and failures
- Policy application results
- Automation workflow execution
- Configuration deployment status

**Data Sources:**
- Backup history
- Job execution logs
- Policy compliance reports

**Triggers Alerts For:**
- ⏸️ Backup failures
- ⏸️ Policy application failures
- ⏸️ Automation errors
- ⏸️ Configuration deployment issues

---

### 5. 📋 Audit Agent
**Schedule:** Every 5 minutes (Continuous)  
**Focus:** Real-time audit log collection and analysis

**Purpose:**
This is the **primary continuous monitoring agent** that pulls logs and detects threats.

**Workflow:**
```
┌─────────────────────────────────────────┐
│ Audit Collection Job (Every 5 minutes) │
└──────────────┬──────────────────────────┘
               │
               ├─→ 1. Collect audit logs from 9 sources
               │      • Purview Audit Log
               │      • Entra ID Audit Logs
               │      • Sign-in Logs
               │      • Defender XDR Incidents/Alerts
               │      • Risky Users
               │      • Intune Audit
               │      • Exchange Online
               │      • SharePoint/OneDrive
               │
               ├─→ 2. Store unprocessed logs in database
               │
               ├─→ 3. Score each event (Risk Score 0-100)
               │      • Single event severity
               │      • Priority level (P0-P3)
               │      • Attack lifecycle stage
               │
               ├─→ 4. Generate alerts for high-risk events
               │      (Score >= 50)
               │
               └─→ 5. Link alerts to audit logs in database
```

**Key Features:**
- **Continuous Monitoring:** Runs every 5 minutes
- **Real-time Scoring:** Immediate risk assessment
- **Attack Pattern Matching:** Uses 50 critical event patterns
- **Automatic Alert Generation:** Creates alerts for high-risk events
- **Database Persistence:** All events and alerts stored

---

### 6. 📊 Compliance Agent
**Schedule:** Every 24 hours (Daily)  
**Focus:** Compliance framework monitoring

**Monitors:**
- CIS benchmark status
- Industry compliance (SOC 2, ISO 27001)
- Data protection compliance
- Audit trail integrity
- Retention policy compliance

**Data Sources:**
- Compliance configuration
- Audit logs retention
- Policy enforcement

**Triggers Alerts For:**
- 📋 Compliance violations
- 📋 Framework misalignment
- 📋 Audit log gaps
- 📋 Retention policy violations

---

### 7. 🔗 Correlation Engine
**Schedule:** Every 15 minutes  
**Focus:** Multi-event attack chain detection

**Processes:**
- Groups related alerts by actor/target
- Detects multi-stage attacks
- Calculates correlation scores (0-100)
- Identifies attack patterns (privilege escalation, persistence, exfiltration)
- Creates "incident" groupings

**Attack Chains Detected:**
- Privilege Escalation → Defense Evasion → Exfiltration
- Credential Compromise → Account Takeover → Data Access
- OAuth Consent → Backdoor Installation → Data Theft
- Security Bypass → Audit Tampering → Evidence Destruction

---

## Alert Triggering Pipeline

```
Audit Logs (9 sources)
         ↓
┌──────────────────────┐
│  Audit Collection    │  Every 5 minutes
│  Job                 │  (Continuous monitoring)
└──────────┬───────────┘
           │
           ├─→ Collect new logs
           ├─→ Risk Score each event
           ├─→ Generate alerts (score >= 50)
           └─→ Store in database
                    ↓
         ┌──────────────────────┐
         │ Correlation Engine   │  Every 15 minutes
         │ (Attack Chain        │  (Pattern detection)
         │  Detection)          │
         └──────────┬───────────┘
                    │
                    ├─→ Group by actor/target
                    ├─→ Calculate correlation score
                    ├─→ Detect multi-stage attacks
                    └─→ Create incident correlations
                           ↓
         ┌──────────────────────┐
         │ Specialized Agents   │  Various schedules
         │ (Security, Config,   │
         │  Approval, etc.)     │
         └──────────┬───────────┘
                    │
                    ├─→ Security Agent (hourly)
                    ├─→ Config Agent (4-hourly)
                    ├─→ Approval Agent (2-hourly)
                    ├─→ Execution Agent (6-hourly)
                    └─→ Compliance Agent (daily)
                           ↓
         ┌──────────────────────┐
         │ Alert Aggregation    │
         │ & Notification       │
         └──────────┬───────────┘
                    │
                    ├─→ TenantGuard Dashboard
                    ├─→ Email Notifications
                    ├─→ Webhook/SIEM Integration
                    └─→ Incident Escalation
```

---

## Real-Time Alert Examples

### Example 1: Critical Event Detection (Audit Agent)
```
⏱️ 2:15 PM - Admin assigns Global Administrator role
     ↓
[Risk Score: 100/100] CRITICAL
[Priority: P0] Drop Everything
[Pattern: Privilege Escalation]
     ↓
ALERT GENERATED IMMEDIATELY
     ↓
🚨 "Global Administrator assigned to attacker@contoso.com"
   - Recommended: Revoke immediately
   - Related: Check all activities by this user
   - Stage: Privilege Escalation
```

### Example 2: Attack Chain Detection (Correlation Engine)
```
⏱️ 2:00 PM - Global Admin assigned
     ↓ (5 min collection cycle)
⏱️ 2:05 PM - MFA disabled
     ↓ (5 min collection cycle)
⏱️ 2:10 PM - External forwarding rule created
     ↓
[Correlation Score: 95/100] CRITICAL
[Pattern: Sophisticated Multi-Stage Attack]
[User: attacker@contoso.com | IP: 192.0.2.100]
     ↓
INCIDENT CREATED - ALL THREE EVENTS LINKED
     ↓
🚨 Multi-stage attack: Privilege Escalation → Defense Evasion → Exfiltration
   - Full incident response triggered
   - Timeline: 10 minutes from start to detection
```

### Example 3: OAuth Backdoor Detection (Approval Agent)
```
⏱️ Every 2 hours - Approval Agent runs
     ↓
NEW: Admin consent granted to "Analytics Helper" app
NEW: Directory.ReadWrite.All permission added
     ↓
[Risk Score: 100/100] CRITICAL
[Priority: P0] Drop Everything
     ↓
🚨 "Malicious OAuth app detected with full directory access"
   - Recommended actions:
     1. Delete application immediately
     2. Audit all directory changes
     3. Review consent audit trail
     4. Check for compromised account
```

---

## Alert Severity & Priority Matrix

| Priority | Trigger | Response Time | Example |
|----------|---------|---|---|
| **P0 - Drop Everything** 🚨 | Risk Score >= 90 + CRITICAL severity | < 5 minutes | Global Admin assigned, MFA disabled, Directory.ReadWrite.All |
| **P1 - Critical** 🔴 | Risk Score 70-89 + CRITICAL severity | < 15 minutes | Conditional Access disabled, DLP disabled, OAuth consent |
| **P2 - High** 🟠 | Risk Score 50-69 + HIGH severity | < 1 hour | Role assignments, Policy changes, Audit tampering |
| **P3 - Medium** 🟡 | Risk Score 30-49 + MEDIUM severity | < 4 hours | Config drift, Compliance issues, Failed backups |

---

## Agent Configuration Management

Agents can be:
- **Enabled/Disabled:** Control which agents run
- **Schedule Modified:** Change run frequency
- **Alert Thresholds Adjusted:** Customize risk score triggers
- **Notification Channels:** Email, Webhook, SIEM integration

**Configuration API:**
```
GET  /api/agents/config           - Get all agent config
GET  /api/agents/config/:agentId  - Get specific agent config
POST /api/agents/config/:agentId  - Update agent config
```

---

## Agent Execution History

Each agent maintains execution history with:
- ✅ Successful executions
- ❌ Failed executions
- ⏱️ Execution time (ms)
- 📊 Data snapshots
- 🚨 Alerts generated

**Dashboard shows:**
- Last execution time for each agent
- Alert count per execution
- Agent health status
- Execution trends

---

## Data Flow Architecture

```
┌─────────────────────────────────────────┐
│     Microsoft 365 Audit Sources        │
│  (9 services, thousands of events)     │
└──────────────┬──────────────────────────┘
               │
               ↓
    ┌──────────────────────────┐
    │  Audit Collection Job    │
    │  (Every 5 minutes)       │
    └──────────┬───────────────┘
               │
               ├─ Fetch new logs
               ├─ Normalize format
               ├─ Store in DB
               │
               ↓
    ┌──────────────────────────┐
    │  Risk Scoring Engine     │
    │  (Per-event analysis)    │
    └──────────┬───────────────┘
               │
               ├─ Score: 0-100
               ├─ Priority: P0-P3
               ├─ Stage: 8 attack stages
               │
               ↓
    ┌──────────────────────────┐
    │  Alert Generator         │
    │  (If score >= 50)        │
    └──────────┬───────────────┘
               │
               ├─ Create alert
               ├─ Set severity
               ├─ Assign actions
               │
               ↓
    ┌──────────────────────────┐
    │  Correlation Engine      │
    │  (Every 15 minutes)      │
    └──────────┬───────────────┘
               │
               ├─ Group alerts
               ├─ Detect chains
               ├─ Score correlations
               │
               ↓
    ┌──────────────────────────┐
    │  Notification System     │
    └──────────┬───────────────┘
               │
               ├─ Dashboard
               ├─ Email
               ├─ Webhook
               ├─ SIEM
               └─ Escalation
```

---

## Monitoring Dashboard Integration

The TenantGuard page displays:

### Real-Time Metrics
- **Audit Events:** Last 5 minutes
- **Alerts Generated:** Count by severity
- **Risk Score:** Current tenant risk (0-100)
- **Attack Chains:** Active multi-stage attacks

### Agent Status
- **Security Agent:** ✅ Ran 2 hrs ago | 3 alerts
- **Config Agent:** ✅ Ran 4 hrs ago | 1 alert
- **Approval Agent:** ✅ Ran 1 hr ago | 2 alerts
- **Audit Agent:** ✅ Ran 5 min ago | 5 alerts
- **Compliance Agent:** ✅ Ran 12 hrs ago | 0 alerts

### Alert Timeline
- Sorted by severity (P0 → P3)
- Linked to source events
- Grouped by correlation (if part of attack chain)
- Actionable recommendations per alert

---

## Performance & Scalability

### Audit Collection Job (Every 5 minutes)
- Collects: ~100-1000 events per cycle
- Processes: ~5 seconds per cycle
- Alerts: 0-50 alerts per cycle (depends on activity)
- Database: All events persisted, searchable

### Correlation Engine (Every 15 minutes)
- Analyzes: All unprocessed alerts
- Detects: Attack chains across time
- Groups: Related alerts into incidents
- Correlations: 0-10 per cycle (depending on activity)

### Specialized Agents
- Security (hourly): <1 second execution
- Config (4-hourly): <2 seconds execution
- Approval (2-hourly): <1 second execution
- Execution (6-hourly): <3 seconds execution
- Compliance (daily): <5 seconds execution

---

## Deployment Checklist

- ✅ Audit Collection Job enabled
- ✅ Correlation Engine enabled
- ✅ Security Agent enabled (hourly schedule)
- ✅ Config Agent enabled (4-hourly schedule)
- ✅ Approval Agent enabled (2-hourly schedule)
- ✅ Execution Agent enabled (6-hourly schedule)
- ✅ Compliance Agent enabled (daily schedule)
- ✅ Alert notification channels configured
- ✅ Database initialized with schema
- ✅ Demo data loaded (for testing)

---

## Future Enhancements

1. **Real-time Event Hub Integration**
   - Replace 5-minute polling with streaming
   - Sub-second alert generation

2. **Machine Learning Scoring**
   - Behavioral anomaly detection
   - User Entity Behavior Analytics (UEBA)
   - Predictive risk scoring

3. **Custom Rule Engine**
   - User-defined alert rules
   - Custom correlation patterns
   - Business logic integration

4. **SOAR Integration**
   - Automated response playbooks
   - Workflow automation
   - Self-remediation

5. **Advanced Analytics**
   - Threat intelligence feeds
   - Attack pattern heatmaps
   - Trend analysis

---

## Troubleshooting

### Agents not running?
Check: `/api/agents/status` endpoint

### Alerts not generating?
- Verify audit logs are collecting: Check audit_logs_cache table
- Check risk scoring thresholds
- Verify alert generation rules

### High alert volume?
- Adjust risk score thresholds
- Enable alert deduplication
- Configure alert grouping

### Performance issues?
- Check database query performance
- Monitor agent execution times
- Optimize correlation window (currently 15 min)

