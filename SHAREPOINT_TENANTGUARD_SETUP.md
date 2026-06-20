# TenantGuard SharePoint Setup Guide

**Status:** SharePoint lists are auto-created, but custom columns need to be added  
**Created:** 2026-06-19  
**Scope:** Three lists with custom fields for alert storage and correlation tracking

---

## 📋 Overview

TenantGuard requires three SharePoint lists to store security alerts, correlations, and investigations. The system automatically creates basic lists, but you need to add custom columns for proper data storage.

**Lists to create:**
1. **TenantGuard-Alerts** — Individual security events
2. **TenantGuard-Correlations** — Grouped alert relationships
3. **TenantGuard-Investigations** — Security incident investigations

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Go to Settings
```
Navigate to: http://localhost:5174/#/settings
Find section: "TenantGuard — Security Alerts Configuration"
```

### Step 2: Specify SharePoint Site
```
Enter SharePoint Site URL:
├─ For tenant root: "root"
└─ For specific site: "/sites/SiteName"

Example: /sites/SecurityAlerts
```

### Step 3: Click Initialize
```
Click: "Initialize TenantGuard Lists" button

System will:
✓ Connect to SharePoint
✓ Create 3 lists (if not existing)
✓ Return list IDs and .env config
```

### Step 4: Add Custom Columns
```
For each list (see detailed instructions below):
✓ Go to SharePoint list settings
✓ Add custom columns as specified
✓ Configure column properties
```

---

## 📊 List 1: TenantGuard-Alerts

**Purpose:** Store individual security events detected across M365

**URL:** `https://contoso.sharepoint.com/sites/YourSite/Lists/TenantGuard-Alerts`

### Required Columns

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| **Title** | Single line text | Yes | Alert headline (auto-populated) |
| **AlertID** | Single line text | Yes | Unique alert identifier (UUID) |
| **Priority** | Choice | Yes | P1/P2/P3 (Critical/High/Info) |
| **Severity** | Choice | Yes | CRITICAL/HIGH/MEDIUM/LOW |
| **RiskScore** | Number | Yes | 0-100 risk assessment |
| **Category** | Choice | Yes | Identity/Apps/Exchange/SharePoint/Teams/Intune/DLP/Defender/Health |
| **Description** | Multiple lines | Yes | Detailed alert description |
| **Actor** | Single line text | Yes | User/service that triggered alert |
| **Target** | Single line text | No | Resource affected (mailbox, policy, user, etc.) |
| **Source** | Choice | Yes | Entra/Exchange/SharePoint/Identity Protection/Intune/Defender/Purview |
| **ActionTimestamp** | Date & Time | Yes | When alert occurred |
| **AlertType** | Single line text | No | ADMIN/EXCHANGE/SECURITY/APPLICATION |
| **RiskAssessment** | Multiple lines | No | JSON: {score, severity, levels, impacts} |
| **Recommendations** | Multiple lines | No | JSON array of remediation steps |
| **Dismissed** | Yes/No | Yes | Default: No |
| **DismissedAt** | Date & Time | No | When alert was dismissed |
| **DismissReason** | Single line text | No | Why alert was dismissed |
| **RawEvent** | Multiple lines | No | Full event JSON from source |

**Total Columns:** 17

### Column Setup Instructions

```
Go to: List Settings → Columns → Create Column

For each column above:

1. Priority
   Type: Choice
   Choices: P1, P2, P3
   Default: P3
   Required: Yes

2. Severity
   Type: Choice
   Choices: CRITICAL, HIGH, MEDIUM, LOW
   Default: MEDIUM
   Required: Yes

3. RiskScore
   Type: Number
   Min: 0
   Max: 100
   Default: 50
   Required: Yes

4. Category
   Type: Choice
   Choices: Identity & Access, Application Security, Exchange Online, SharePoint & OneDrive, Teams, Device & Intune, DLP & Compliance, Defender Security, Service Health, Configuration Drift
   Required: Yes

5. Source
   Type: Choice
   Choices: Entra ID, Exchange Online, SharePoint, Identity Protection, Intune, Defender, Purview
   Required: Yes

6. AlertType
   Type: Choice
   Choices: ADMIN, EXCHANGE, SECURITY, APPLICATION
   Required: No

7. Dismissed
   Type: Yes/No
   Default: No
   Required: Yes

... (complete all others similarly)
```

---

## 📊 List 2: TenantGuard-Correlations

**Purpose:** Store grouped alert relationships and attack patterns

**URL:** `https://contoso.sharepoint.com/sites/YourSite/Lists/TenantGuard-Correlations`

### Required Columns

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| **Title** | Single line text | Yes | Correlation title (auto-populated) |
| **CorrelationID** | Single line text | Yes | Unique correlation identifier (UUID) |
| **CorrelationType** | Choice | Yes | ACTOR/TARGET/TEMPORAL/PATTERN |
| **PatternType** | Single line text | Yes | Attack type (PRIVILEGE_ESCALATION, CREDENTIAL_COMPROMISE, etc.) |
| **AlertIDs** | Multiple lines | Yes | JSON array of related alert IDs |
| **AlertCount** | Number | Yes | Number of alerts in correlation |
| **Actor** | Single line text | No | User/service involved (if actor-based) |
| **Target** | Single line text | No | Resource targeted (if target-based) |
| **StartTimestamp** | Date & Time | Yes | When correlation period begins |
| **EndTimestamp** | Date & Time | Yes | When correlation period ends |
| **CorrelationScore** | Number | Yes | 0-100 confidence score |
| **RiskLevel** | Choice | Yes | CRITICAL/HIGH/MEDIUM/LOW |
| **Description** | Multiple lines | Yes | What this correlation represents |
| **Metadata** | Multiple lines | No | JSON with additional context |
| **Dismissed** | Yes/No | Yes | Default: No |
| **DismissedAt** | Date & Time | No | When dismissed |
| **DismissReason** | Single line text | No | Why dismissed |

**Total Columns:** 17

### Column Setup Instructions

```
1. CorrelationType
   Type: Choice
   Choices: ACTOR, TARGET, TEMPORAL, PATTERN
   Required: Yes

2. AlertCount
   Type: Number
   Min: 1
   Max: 100
   Required: Yes

3. CorrelationScore
   Type: Number
   Min: 0
   Max: 100
   Default: 50
   Required: Yes

4. RiskLevel
   Type: Choice
   Choices: CRITICAL, HIGH, MEDIUM, LOW
   Default: MEDIUM
   Required: Yes

5. PatternType
   Type: Single line text
   Examples: PRIVILEGE_ESCALATION, CREDENTIAL_COMPROMISE, DATA_EXFILTRATION, MASS_USER_CREATION, BULK_PERMISSION_GRANT, BURST_ACTIVITY
   Required: Yes

6. Dismissed
   Type: Yes/No
   Default: No
   Required: Yes

... (complete all others similarly)
```

---

## 📊 List 3: TenantGuard-Investigations

**Purpose:** Store security incident investigations and AI analysis

**URL:** `https://contoso.sharepoint.com/sites/YourSite/Lists/TenantGuard-Investigations`

### Required Columns

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| **Title** | Single line text | Yes | Investigation title |
| **InvestigationID** | Single line text | Yes | Unique investigation identifier (UUID) |
| **InvestigationType** | Choice | Yes | ALERT/CORRELATION/PATTERN |
| **Status** | Choice | Yes | OPEN/IN_PROGRESS/RESOLVED/CLOSED |
| **Priority** | Choice | Yes | P1/P2/P3 |
| **Severity** | Choice | Yes | CRITICAL/HIGH/MEDIUM/LOW |
| **RiskScore** | Number | Yes | 0-100 |
| **StartedBy** | Single line text | Yes | User who started investigation |
| **StartedAt** | Date & Time | Yes | When investigation started |
| **CompletedAt** | Date & Time | No | When investigation completed |
| **CorrelationIDs** | Multiple lines | No | JSON array of related correlations |
| **AlertIDs** | Multiple lines | No | JSON array of related alerts |
| **InvestigationNotes** | Multiple lines | No | Investigator notes and findings |
| **AIAnalysis** | Multiple lines | No | Claude AI investigation analysis |
| **Recommendations** | Multiple lines | No | JSON array of recommended actions |
| **ReportGenerated** | Yes/No | No | Whether report was created |
| **ReportURL** | Single line text | No | Link to generated report |

**Total Columns:** 17

### Column Setup Instructions

```
1. InvestigationType
   Type: Choice
   Choices: ALERT, CORRELATION, PATTERN
   Required: Yes

2. Status
   Type: Choice
   Choices: OPEN, IN_PROGRESS, RESOLVED, CLOSED
   Default: OPEN
   Required: Yes

3. Priority
   Type: Choice
   Choices: P1, P2, P3
   Required: Yes

4. Severity
   Type: Choice
   Choices: CRITICAL, HIGH, MEDIUM, LOW
   Required: Yes

5. RiskScore
   Type: Number
   Min: 0
   Max: 100
   Required: Yes

6. ReportGenerated
   Type: Yes/No
   Default: No
   Required: No

... (complete all others similarly)
```

---

## 📋 Column Types Reference

### Single Line Text
- **Use for:** Names, IDs, single values
- **Max length:** 255 characters
- **Example:** AlertID, Actor, Target

### Multiple Lines
- **Use for:** JSON data, descriptions, notes
- **Supports:** Up to 63,999 characters
- **Format:** Rich text or plain text
- **Example:** RiskAssessment, Recommendations, AIAnalysis

### Choice (Dropdown)
- **Use for:** Fixed set of values
- **Defined values:** Create dropdown options
- **Example:** Priority (P1, P2, P3)

### Number
- **Use for:** Risk scores, counts
- **Range:** Can set min/max
- **Decimal:** Yes (allows 0-100 scale)
- **Example:** RiskScore (0-100), AlertCount

### Date & Time
- **Use for:** Timestamps
- **Format:** Includes time with timezone
- **Example:** ActionTimestamp, StartedAt

### Yes/No
- **Use for:** Boolean flags
- **Default:** Can set to Yes or No
- **Example:** Dismissed, ReportGenerated

---

## ⚙️ Manual Setup Steps (If Needed)

### Via SharePoint Web UI

1. **Create Lists:**
   - Go to SharePoint site
   - Click "+ New" → "List"
   - Name: "TenantGuard-Alerts"
   - Choose "Blank list"
   - Repeat for Correlations and Investigations

2. **Add Columns:**
   - Click list name
   - Click "Settings" (gear icon)
   - Click "Create Column"
   - For each column in the table above:
     - Enter Name
     - Select Type
     - Configure options
     - Click OK

3. **Set as Required:**
   - For each required column:
     - Click column name
     - Check "Require that this column contains information"
     - Click OK

4. **Add Default Values:**
   - Priority: Default to P3
   - Dismissed: Default to No
   - RiskScore: Default to 50

---

## 🔌 Via Graph API (Automated Setup - Optional)

If you want to automate column creation, use this approach:

```powershell
# PowerShell example to create columns

$listId = "your-list-id"
$siteId = "your-site-id"

# Add Priority column
$body = @{
    name = "Priority"
    columnDefinition = @{
        choice = @{
            choices = @("P1", "P2", "P3")
            allowTextEntry = $false
            displayAs = "dropDownMenu"
        }
    }
} | ConvertTo-Json

$response = Invoke-MgGraphRequest `
    -Method POST `
    -Uri "https://graph.microsoft.com/v1.0/sites/$siteId/lists/$listId/columns" `
    -Body $body

# Repeat for each column type...
```

---

## ✅ Verification Checklist

After setup, verify:

```
☐ TenantGuard-Alerts list created
  ☐ 17 columns added
  ☐ All required columns marked as required
  ☐ Default values set

☐ TenantGuard-Correlations list created
  ☐ 17 columns added
  ☐ All required columns marked as required
  ☐ Default values set

☐ TenantGuard-Investigations list created
  ☐ 17 columns added
  ☐ All required columns marked as required
  ☐ Default values set

☐ Test API:
  curl http://localhost:3000/api/tenantguard/alerts
  → Should return alerts with priority field

☐ Test UI:
  Navigate to TenantGuard dashboard
  → Should display P1/P2/P3 badges
```

---

## 🔗 Integration Points

### Alerts Flow
```
Azure AD Events
    ↓
TenantGuard-Alerts (SharePoint)
    ↓
Correlation Engine (Backend)
    ↓
TenantGuard-Correlations (SharePoint)
    ↓
Attack Pattern Detection
    ↓
UI Display (P1/P2/P3 badges)
```

### Investigations Flow
```
Alert Click
    ↓
Create Investigation
    ↓
TenantGuard-Investigations (SharePoint)
    ↓
AI Analysis (Claude)
    ↓
Save Results
    ↓
Generate Report
```

---

## 📊 Data Example

### Alert Record
```json
{
  "AlertID": "550e8400-e29b-41d4-a716-446655440000",
  "Title": "Global Admin Added to External User",
  "Priority": "P1",
  "Severity": "CRITICAL",
  "RiskScore": 95,
  "Category": "Identity & Access",
  "Description": "User with external identity was granted Global Administrator privileges",
  "Actor": "admin@contoso.com",
  "Target": "external@example.com",
  "Source": "Entra ID",
  "ActionTimestamp": "2026-06-19T14:32:00Z",
  "AlertType": "ADMIN",
  "Dismissed": false
}
```

### Correlation Record
```json
{
  "CorrelationID": "660e8400-e29b-41d4-a716-446655440000",
  "Title": "Coordinated Privilege Escalation",
  "CorrelationType": "PATTERN",
  "PatternType": "PRIVILEGE_ESCALATION",
  "AlertCount": 3,
  "AlertIDs": ["550e8400-...", "551e8400-...", "552e8400-..."],
  "CorrelationScore": 95,
  "RiskLevel": "CRITICAL",
  "StartTimestamp": "2026-06-19T14:30:00Z",
  "EndTimestamp": "2026-06-19T14:35:00Z",
  "Description": "Multiple alerts indicating privilege escalation attack",
  "Dismissed": false
}
```

---

## 🆘 Troubleshooting

### Lists Not Created
**Problem:** "Could not access SharePoint site"
**Solution:**
1. Verify SharePoint site URL is correct
2. Check if Azure AD app has SharePoint permissions
3. Ensure user has site owner access

### Columns Not Showing
**Problem:** Columns created but data not saving
**Solution:**
1. Verify column names match exactly (case-sensitive)
2. Check column types are correct
3. Ensure required columns have values

### Data Not Syncing
**Problem:** SharePoint lists exist but no data
**Solution:**
1. Check backend logs for errors
2. Verify API credentials
3. Check if list IDs match .env configuration
4. Restart backend service

### API Returns 404
**Problem:** Lists not found
**Solution:**
1. Verify lists were created in SharePoint
2. Check list IDs in response from initialization
3. Compare with .env SHAREPOINT_TENANTGUARD_*_LIST_ID values

---

## 📞 Environment Variables

After initialization, add these to `.env`:

```bash
SHAREPOINT_SITE_ID=your-site-id
SHAREPOINT_SITE_URL=/sites/YourSite

# TenantGuard Lists
SHAREPOINT_TENANTGUARD_ALERTS_LIST_ID=list-id-1
SHAREPOINT_TENANTGUARD_CORRELATIONS_LIST_ID=list-id-2
SHAREPOINT_TENANTGUARD_INVESTIGATIONS_LIST_ID=list-id-3

# Optional: Graph API credentials
GRAPH_CLIENT_ID=your-app-id
GRAPH_CLIENT_SECRET=your-secret
GRAPH_TENANT_ID=your-tenant-id
```

---

## 🎯 Next Steps

1. ✅ Initialize lists via Settings page
2. ✅ Add custom columns to each list
3. ✅ Test API endpoints
4. ✅ Verify data flow from backend to SharePoint
5. ✅ Monitor alert storage and retrieval

---

**Last Updated:** 2026-06-19  
**Status:** Ready for Configuration  
**Support:** See settings page "TenantGuard — Security Alerts Configuration"
