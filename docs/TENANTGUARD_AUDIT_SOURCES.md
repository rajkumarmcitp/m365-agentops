# TenantGuard Unified Audit Collection

## Overview

TenantGuard now collects security-relevant events from **9 different Microsoft 365 audit sources**, providing comprehensive monitoring across your entire M365 environment.

## Architecture

```
                     TenantGuard Dashboard
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
  Entra ID APIs     Purview Audit     Defender XDR
(directoryAudits)   (Unified Audit)   (Incidents/Alerts)
(signIns)           (Exchange)        (Threat detections)
(riskyUsers)        (SharePoint)
(riskDetections)    (Teams)
                    (OneDrive)
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                  Alert Correlation Engine
                          ▼
                 Risk Scoring & Dashboard
```

## Audit Sources Enabled

### 1. **Microsoft Purview Audit Log** ⭐⭐⭐⭐⭐
- **Status:** Enabled (Primary Source)
- **Coverage:** ~80-90% of administrative activities
- **Services Monitored:**
  - Exchange Online
  - SharePoint Online
  - OneDrive
  - Microsoft Teams
  - Entra ID (many operations)
  - Power Platform
  - Purview
  - Microsoft 365 Apps

- **Key Events Monitored:**
  - Mailbox delegation and forwarding rules
  - Inbox rule creation/modification
  - File downloads and modifications
  - Sharing policy changes
  - DLP policy modifications
  - Team and group management
  - Admin role changes
  - Application installations

**API Used:** Unified Audit Log (requires Search-UnifiedAuditLog cmdlet)

---

### 2. **Microsoft Entra ID Audit Logs** ⭐⭐⭐⭐⭐
- **Status:** Enabled
- **Priority:** CRITICAL
- **Graph Endpoint:** `/auditLogs/directoryAudits`
- **Coverage:** Identity and directory administration

- **Key Events:**
  - User created/deleted
  - Group membership changes
  - Role assignments and updates
  - Conditional Access policy changes
  - Authentication method changes
  - Application registrations
  - Enterprise application updates
  - Service principal changes
  - Device registration changes
  - Directory settings modifications

**Response Time:** Real-time
**Data Retention:** 30 days

---

### 3. **Microsoft Defender XDR - Incidents** ⭐⭐⭐⭐⭐
- **Status:** Enabled
- **Priority:** CRITICAL
- **Graph Endpoint:** `/security/incidents`
- **Coverage:** Security incident tracking

- **Key Events:**
  - Security incidents detected
  - Incident severity classification
  - Incident status and resolution
  - Affected resources
  - Detection source

**Response Time:** Near real-time
**Data Retention:** 180 days

---

### 4. **Microsoft Defender XDR - Alerts** ⭐⭐⭐⭐⭐
- **Status:** Enabled
- **Priority:** CRITICAL
- **Graph Endpoint:** `/security/alerts_v2`
- **Coverage:** Security threat alerts

- **Threats Detected:**
  - Malware detection
  - Phishing campaigns
  - Data exfiltration attempts
  - Ransomware activity
  - Suspicious logon patterns
  - Endpoint threats
  - Email threats

**Response Time:** Real-time
**Alert Classification:** Malware, Phishing, Ransomware, Suspicious Activity

---

### 5. **Entra ID Sign-in Logs** ⭐⭐⭐⭐
- **Status:** Enabled
- **Priority:** HIGH
- **Graph Endpoint:** `/auditLogs/signIns`
- **Coverage:** Authentication monitoring

- **Key Events:**
  - Failed sign-in attempts
  - Risk-based sign-in detection
  - Unusual location access
  - Multifactor authentication events
  - Conditional Access policy triggers
  - Legacy authentication attempts
  - Password spray attacks

**Data Retention:** 30 days
**Risk Assessment:** Automatic

---

### 6. **Entra ID - Risky Users (Identity Protection)** ⭐⭐⭐⭐
- **Status:** Enabled
- **Priority:** HIGH
- **Graph Endpoint:** `/identityProtection/riskyUsers`
- **Coverage:** Compromised account detection

- **Risk Signals:**
  - User flagged as risky
  - Confirmed compromise
  - Risk level: High/Medium/Low
  - Remediation actions available
  - Risk detection history

**Assessment:** Machine learning-based
**Actions:** Password reset, Multi-factor enforcement, Block user

---

### 7. **Intune Audit Logs** ⭐⭐⭐⭐
- **Status:** Enabled
- **Priority:** HIGH
- **Graph Endpoint:** `/deviceManagement/auditEvents`
- **Coverage:** Device management and compliance

- **Key Events:**
  - Configuration policy changes
  - Compliance policy modifications
  - Device action logs
  - Security baseline updates
  - Endpoint security changes
  - Enrollment activities
  - Device retirement/reset

**Scope:** All devices managed by Intune

---

### 8. **Exchange Online Audit** ⭐⭐⭐
- **Status:** Enabled
- **Priority:** MEDIUM
- **Coverage:** Mailbox-specific monitoring

- **Key Metrics:**
  - Mailbox permissions
  - Transport rules
  - Mail flow connectors
  - Organization configuration
  - Mailbox statistics

**Access Method:** Graph API (mailbox statistics) + Purview (detailed audit)

---

### 9. **SharePoint & OneDrive Audit** ⭐⭐⭐
- **Status:** Enabled
- **Priority:** MEDIUM
- **Coverage:** File and collaboration monitoring

- **Key Events:**
  - File downloads (sensitivity-based)
  - Sharing link creation/deletion
  - External sharing changes
  - Site permission modifications
  - Site administration changes
  - Site deletion
  - Site restores

**Data Collection:** Via Purview Audit Log

---

## Data Flow & Processing

### 1. Collection Phase
```
Unified Audit Collection Service
    ↓
[Collect from 9 sources in parallel]
    ↓
[Deduplicate & normalize]
    ↓
[Calculate severity]
```

### 2. Correlation Phase
```
Correlate by:
  • Same user across sources
  • Same IP address
  • Time proximity (within 1 hour)
  • Event type patterns
    ↓
[Identify attack chains]
    ↓
[Generate risk score]
```

### 3. Alert Generation
```
[Filter by severity threshold]
    ↓
[Create alerts with context]
    ↓
[Store in database]
    ↓
[Display in dashboard]
```

## API Endpoints

### Collect All Audit Data
```bash
POST /api/tenantguard/audit/collect-all
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "event-id",
      "source": "Purview Audit",
      "category": "Mailbox Forwarding Rule",
      "activity": "New-InboxRule",
      "severity": "HIGH",
      "timestamp": "2026-07-18T12:00:00Z",
      "details": "Suspicious inbox rule created",
      "user": "admin@contoso.com",
      "ipAddress": "192.168.1.100",
      "result": "Success"
    }
  ],
  "summary": {
    "total": 245,
    "critical": 12,
    "high": 34,
    "medium": 199,
    "sources": 9,
    "correlatedEvents": 5
  },
  "sourceBreakdown": {
    "purviewAudit": 45,
    "entraIdAudit": 52,
    "defenderIncidents": 8,
    "defenderAlerts": 23,
    "riskyUsers": 3,
    "signIns": 89,
    "intuneAudit": 15,
    "exchangeAudit": 8,
    "sharePointAudit": 2
  }
}
```

### Get Audit Source Configuration
```bash
GET /api/tenantguard/audit/sources
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Microsoft Purview Audit Log",
      "status": "enabled",
      "priority": "CRITICAL",
      "description": "Primary audit source - covers Exchange, SharePoint, Teams, OneDrive",
      "services": ["Exchange Online", "SharePoint Online", "OneDrive", "Microsoft Teams"],
      "capabilities": [
        "Mailbox delegation",
        "Inbox rules",
        "File access & modification",
        "Sharing changes"
      ]
    }
  ],
  "summary": {
    "enabled": 9,
    "total": 9,
    "coverage": "99%"
  }
}
```

## Integration with TenantGuard Dashboard

### New Tab: "Audit Sources"
Displays:
- All enabled audit sources
- Connection status
- Last collection timestamp
- Event count per source
- Data coverage percentage
- Manual sync button

### Enhanced Alerts Tab
Now shows:
- Source of each alert
- Cross-source correlations
- Alert chain visualization
- Risk scoring explanation

### New API Analysis
Correlates events from:
- Same user across multiple sources
- Same IP address with different activities
- Temporal proximity (within 1 hour)
- Related event types

## Recommended Monitoring Thresholds

| Event Type | Severity | Threshold |
|------------|----------|-----------|
| Mailbox forwarding rule | HIGH | 1 event = alert |
| User deleted | CRITICAL | 1 event = alert |
| Multiple failed sign-ins | HIGH | 5+ failures in 10 min |
| Inbox rule + forwarding + forwarding permission | CRITICAL | All 3 together |
| External sharing + sync + download | HIGH | 3+ activities in 5 min |
| Role assignment + group add + policy change | HIGH | 3+ in 10 min |
| Password reset + sign-in failure + risky user | CRITICAL | All 3 together |

## Data Retention Policies

| Source | Retention | Query Method |
|--------|-----------|--------------|
| Purview Audit | 90 days (default) | Search-UnifiedAuditLog |
| Entra ID Audit | 30 days | Graph API |
| Defender Incidents | 180 days | Graph API |
| Defender Alerts | 180 days | Graph API |
| Sign-in Logs | 30 days | Graph API |
| Risky Users | 90 days | Graph API |
| Intune Audit | 90 days | Graph API |

## Performance Considerations

- **Collection Time:** ~15-30 seconds for full audit collection
- **Event Volume:** Varies by tenant size (100-10,000 events per collection)
- **Update Frequency:** Configurable (default: every 5 minutes)
- **Storage:** Events stored in local database + correlated alerts in SharePoint

## Next Steps for Enhancement

1. **Real-time Streaming:**
   - Implement Event Hub for real-time alerts
   - Reduce latency from 5 minutes to <1 minute

2. **Machine Learning Analytics:**
   - Threat pattern detection
   - Anomaly scoring
   - Predictive alerts

3. **Custom Rules Engine:**
   - User-defined correlation rules
   - Custom severity scoring
   - Business logic alerts

4. **Compliance Reporting:**
   - Audit trail exports
   - SOC 2 / ISO 27001 compliance reports
   - Incident response documentation

5. **Integration Expansion:**
   - SIEM integration (Splunk, ELK)
   - SOAR automation (Power Automate)
   - Third-party tool APIs

## FAQ

**Q: How often is audit data collected?**
A: Every 5 minutes by default, configurable via settings.

**Q: Which source has the most events?**
A: Sign-in Logs typically have the highest volume (100-1000+ events per collection).

**Q: Can I export audit logs?**
A: Yes, via the TenantGuard download reports feature.

**Q: What if a source is unavailable?**
A: Collection continues from other sources; failed sources are logged and retried.

**Q: Is there any data loss if an API fails?**
A: No - events already collected are stored; failed sources are re-attempted on next cycle.

**Q: Can I create custom audit rules?**
A: Custom rules engine is on the roadmap; currently using pre-configured patterns.

