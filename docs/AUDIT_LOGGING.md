# Zero Trust Audit Logging System

## 📋 Overview

The Zero Trust system includes a **comprehensive audit logging** system that tracks all compliance-related changes for regulatory compliance and compliance reporting.

---

## 🎯 What Gets Logged

### **1. Validation Events**
- ✅ `VALIDATION_STARTED` - Scan begins
- ✅ `VALIDATION_COMPLETED` - Scan completes (includes compliance score, risk score, pass/fail/warn counts)
- ✅ `VALIDATION_FAILED` - Scan encounters error

**Captured Details:**
```json
{
  "totalValidations": 303,
  "passed": 33,
  "failed": 39,
  "warnings": 231,
  "overallScore": 11,
  "riskScore": 36,
  "collectionTime": 8165
}
```

### **2. Control Events**
- ✅ `CONTROL_VALIDATED` - Individual control validation result
- ✅ `CONTROL_REMEDIATED` - Control is fixed
- ✅ `CONTROL_MANUAL_VALIDATION` - Manual review needed

### **3. Exception Workflow**
- ✅ `EXCEPTION_REQUESTED` - Exception requested
- ✅ `EXCEPTION_APPROVED` - Exception approved (with approver name)
- ✅ `EXCEPTION_REJECTED` - Exception rejected (with rejection reason)
- ✅ `EXCEPTION_EXPIRED` - Auto-expiration triggered

### **4. Framework Alignment Changes** (NEW)
- ✅ `FRAMEWORK_ALIGNMENT_CHANGED` - Framework compliance score changed
- ✅ `FRAMEWORK_COMPLIANCE_CHANGED` - Framework status changed (Compliant → Partial → Non-Compliant)
- ✅ `CONTROL_MAPPING_UPDATED` - Control-to-framework mapping added/removed/updated
- ✅ `FRAMEWORK_COVERAGE_CHANGED` - Framework coverage percentage changed

**Example Framework Change Log:**
```json
{
  "action": "framework_alignment_changed",
  "framework": "CIS Microsoft 365",
  "previousCompliance": 11,
  "newCompliance": 13,
  "change": +2,
  "changedControlsCount": 5,
  "timestamp": "2026-07-14T12:00:00Z"
}
```

---

## 📊 Log Entry Structure

Every audit log entry contains:

```json
{
  "id": "unique-log-id",
  "timestamp": "2026-07-14T11:42:50.555Z",
  "action": "validation_completed",
  "actor": "system|user|agent",
  "resourceId": "framework-name|control-id",
  "resourceType": "validation|framework|control|control_mapping",
  "description": "Human-readable description",
  "details": {
    // Action-specific details
  },
  "severity": "info|warning|error",
  "status": "success|failure"
}
```

---

## 🔍 Access Audit Logs

### **1. View All Audit Logs**
```bash
GET /api/audit-logs
# Parameters:
# - limit: Number of logs (default: 100, max: 10000)
# - page: Page number (default: 1)
# - action: Filter by action type
# - actor: Filter by actor (system, user, agent)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "log-id",
      "timestamp": "2026-07-14T11:42:50Z",
      "action": "validation_completed",
      "actor": "system",
      "details": { ... }
    }
  ],
  "total": 250
}
```

### **2. Search Audit Logs**
```bash
GET /api/audit-logs/search?query=CIS
# Searches across: action, actor, description, resourceId, details
```

### **3. Framework-Specific Audit Logs**
```bash
GET /api/zero-trust/audit-logs/framework/CIS
# Shows all audit events related to CIS framework
# Parameters:
# - limit: Number of logs (default: 50)
```

**Response:**
```json
{
  "success": true,
  "framework": "CIS",
  "total": 15,
  "data": [
    {
      "action": "framework_alignment_changed",
      "previousCompliance": 11,
      "newCompliance": 12,
      "change": +1
    }
  ]
}
```

### **4. Framework Changes (Date Range)**
```bash
GET /api/zero-trust/audit-logs/framework-changes?startDate=2026-07-01&endDate=2026-07-14
# Shows all framework alignment/compliance changes in date range
```

**Response:**
```json
{
  "success": true,
  "period": {
    "startDate": "2026-07-01T00:00:00Z",
    "endDate": "2026-07-14T23:59:59Z"
  },
  "total": 42,
  "data": [
    {
      "action": "framework_compliance_changed",
      "framework": "NIST",
      "previousStatus": "Partial",
      "newStatus": "Compliant",
      "timestamp": "2026-07-14T12:00:00Z"
    }
  ]
}
```

### **5. Compliance Report**
```bash
GET /api/audit-logs/report/compliance?startDate=2026-07-01&endDate=2026-07-14
# Generates compliance summary report for date range
```

**Response:**
```json
{
  "reportDate": "2026-07-14T12:00:00Z",
  "period": "Last 30 days",
  "totalEvents": 1250,
  "summary": {
    "exceptions": 45,
    "validations": 8,
    "controls": 320,
    "successRate": 98
  },
  "topActors": [
    { "actor": "system", "count": 1100 },
    { "actor": "rajkumar", "count": 150 }
  ],
  "topActions": [
    { "action": "validation_completed", "count": 8 },
    { "action": "exception_approved", "count": 45 }
  ],
  "failures": [...],
  "warnings": [...],
  "errors": [...]
}
```

### **6. Export Audit Logs**
```bash
# JSON format
GET /api/audit-logs/export?format=json

# CSV format
GET /api/audit-logs/export?format=csv
```

---

## 📈 Audit Statistics

```bash
GET /api/audit-logs/stats
```

**Response:**
```json
{
  "total": 2500,
  "last24Hours": 156,
  "last7Days": 890,
  "byAction": {
    "validation_completed": 8,
    "exception_approved": 45,
    "control_remediated": 12,
    "framework_compliance_changed": 6
  },
  "byActor": {
    "system": 2300,
    "rajkumar": 150,
    "admin@company.com": 50
  },
  "byStatus": {
    "success": 2450,
    "failure": 50
  },
  "bySeverity": {
    "info": 2400,
    "warning": 80,
    "error": 20
  },
  "lastFailure": {
    "id": "log-id",
    "timestamp": "2026-07-14T10:30:00Z",
    "action": "validation_failed",
    "description": "Graph API rate limit exceeded"
  }
}
```

---

## 🔐 Compliance Features

### **Retention Policy**
- Default: 365-day retention
- Auto-purge: Logs older than 365 days are automatically removed
- Customizable: Set retention via `purgeOldAuditLogs(daysToKeep)`

### **Immutability**
- Logs are append-only (never modified after creation)
- Each log has unique ID and timestamp
- Tamper-resistant format

### **Severity Levels**
- `info` - Normal operations (90% of logs)
- `warning` - Degraded compliance, coverage drop, config changes (8%)
- `error` - Failed operations, severe issues (2%)

---

## 📊 Dashboard Integration

### **Audit Logs Viewer Tab** (Coming Soon)
A dedicated "Audit Logs" tab will display:
- Recent audit events with filtering
- Framework changes timeline
- Exception approval history
- Validation run summary
- Compliance trends over time

---

## 🛠️ Using Audit Logging in Code

### **Log a Validation Completion**
```javascript
import { logAction, AUDIT_ACTIONS } from './lib/audit-logger.js'

logAction({
  action: AUDIT_ACTIONS.VALIDATION_COMPLETED,
  actor: 'system',
  resourceType: 'validation',
  description: 'Zero Trust validation completed',
  details: {
    totalValidations: 303,
    passed: 35,
    failed: 39,
    warnings: 229,
    overallScore: 12,
    riskScore: 35
  },
  status: 'success'
})
```

### **Log a Framework Compliance Change**
```javascript
import { logFrameworkComplianceChange } from './lib/audit-logger.js'

logFrameworkComplianceChange(
  'CIS Microsoft 365',
  'Partial',     // previous status
  'Compliant',   // new status
  {
    previousScore: 75,
    newScore: 82,
    changedControls: 7
  }
)
```

### **Log a Control Mapping Update**
```javascript
import { logControlMappingUpdate } from './lib/audit-logger.js'

logControlMappingUpdate(
  'ID-001',
  'NIST',
  'added',  // 'added' | 'removed' | 'updated'
  'Expanded framework coverage'
)
```

### **Get Framework Audit Trail**
```javascript
import { getFrameworkAuditLogs } from './lib/audit-logger.js'

const logs = getFrameworkAuditLogs('CIS', limit = 100)
// Returns: Last 100 audit events for CIS framework
```

---

## 📋 Audit Log Examples

### **Example 1: Validation Completed**
```json
{
  "id": "1721043770555-abc123def",
  "timestamp": "2026-07-14T11:42:50.555Z",
  "action": "validation_completed",
  "actor": "system",
  "resourceType": "validation",
  "description": "Zero Trust validation completed successfully",
  "details": {
    "totalValidations": 303,
    "passed": 33,
    "failed": 39,
    "warnings": 231,
    "overallScore": 11,
    "riskScore": 36,
    "exceptionCount": 0,
    "collectionTime": 8165
  },
  "severity": "info",
  "status": "success"
}
```

### **Example 2: Framework Alignment Changed**
```json
{
  "id": "1721043900000-xyz789uvw",
  "timestamp": "2026-07-14T12:00:00.000Z",
  "action": "framework_alignment_changed",
  "actor": "system",
  "resourceId": "CIS Microsoft 365",
  "resourceType": "framework",
  "description": "Framework alignment changed: CIS Microsoft 365",
  "details": {
    "framework": "CIS Microsoft 365",
    "previousCompliance": 11,
    "newCompliance": 13,
    "change": 2,
    "changedControlsCount": 2,
    "changedControls": ["ID-001", "ID-004"]
  },
  "severity": "info",
  "status": "success"
}
```

### **Example 3: Framework Compliance Status Changed**
```json
{
  "id": "1721044200000-pqr456stu",
  "timestamp": "2026-07-14T12:30:00.000Z",
  "action": "framework_compliance_changed",
  "actor": "system",
  "resourceId": "NIST Cybersecurity Framework",
  "resourceType": "framework",
  "description": "NIST Cybersecurity Framework compliance status: Partial → Compliant",
  "details": {
    "framework": "NIST Cybersecurity Framework",
    "previousStatus": "Partial",
    "newStatus": "Compliant",
    "previousScore": 68,
    "newScore": 81
  },
  "severity": "info",
  "status": "success"
}
```

### **Example 4: Exception Approved**
```json
{
  "id": "1721044500000-abc111def",
  "timestamp": "2026-07-14T13:00:00.000Z",
  "action": "exception_approved",
  "actor": "rajkumar@company.com",
  "resourceId": "EXC-2026-0042",
  "resourceType": "exception",
  "description": "Exception approved for ID-042: MFA Required for Admins",
  "details": {
    "exceptionId": "EXC-2026-0042",
    "controlId": "ID-042",
    "reason": "Legacy system compatibility",
    "approvedBy": "rajkumar@company.com",
    "expiryDate": "2026-10-14"
  },
  "severity": "info",
  "status": "success"
}
```

---

## 🎯 Audit Log Use Cases

### **1. Compliance Reporting**
- Generate compliance report for auditors
- Export audit logs for Q4 review
- Show control remediation timeline

### **2. Change Tracking**
- Track when framework compliance changed from 11% → 13%
- Identify which controls were remediated
- Compare compliance before/after specific date

### **3. Incident Investigation**
- Find all actions by specific user
- Trace exception approvals and rejections
- Review validation failures and errors

### **4. Trend Analysis**
- Framework compliance trends over 30/60/90 days
- Most frequently failing controls
- Exception request patterns

### **5. Regulatory Requirements**
- Audit trail for SOC2/ISO27001
- Change management documentation
- Approval workflow history

---

## 🔄 Automatic Audit Logging

The following events are **automatically logged** without requiring code changes:

✅ Every validation run  
✅ Framework compliance changes  
✅ Exception workflow approvals  
✅ Control remediation  
✅ Manual validation overrides  
✅ Configuration changes  
✅ User access to reports  
✅ Data exports  

---

## ⚙️ Configuration

### **Retention Period**
```javascript
// Keep last 365 days of audit logs
purgeOldAuditLogs(365)
```

### **Log Limits**
- In-memory storage: Last 10,000 entries in index
- Paginated access: Max 200 logs per request
- Export: Max 10,000 logs per export

---

## 📞 Support

For audit log queries or compliance reporting:
1. Use `/api/audit-logs` endpoints
2. Export to CSV for audit reports
3. Query specific date ranges for trends
4. Check framework audit trail for changes

