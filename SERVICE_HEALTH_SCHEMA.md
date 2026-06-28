# Service Health Messages — SharePoint Schema

**Updated:** 2026-06-28  
**Version:** 2.0 (Enhanced with Microsoft Service Health fields)

---

## Complete Field List

All Microsoft Service Health message data is now captured in the following SharePoint list columns:

### Core Information

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **Title** | Text (single line) | ✅ | Issue summary/headline | "Some users may see that when selecting a meeting room when scheduling meetings, it changes from available to unavailable" |
| **MessageID** | Text (single line) | ✅ | Unique message identifier | "SH-20260628-001" |
| **IssueID** | Text (single line) | ✅ | Microsoft issue tracking ID | "EX1233142" |

### Issue Classification

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **Service** | Choice | ✅ | Affected M365 service | "Exchange Online" |
| **IssueType** | Choice | ✅ | Type of issue | "Advisory" / "Incident" / "Service Degradation" / "Maintenance" / "Investigation" |
| **Severity** | Choice | ✅ | Severity level for internal tracking | "High" / "Medium" / "Low" |

### Impact & Scope

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **Description** | Text (multi-line) | ⚠️ | Detailed issue description | Full description of the problem |
| **UserImpact** | Text (multi-line) | ✅ | Description of how users are impacted | "Users experiencing delayed email delivery affecting business operations" |
| **ScopeOfImpact** | Text (multi-line) | ✅ | Description of scope and affected users | "Affects all organizations with Exchange Online" |
| **RootCause** | Text (multi-line) | ⚠️ | Root cause analysis (when known) | "Database optimization script caused temporary overload" |
| **Impact** | Text (multi-line) | ⚠️ | Additional impact notes | "Email delivery delayed by 30-60 minutes" |

### Additional Information

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **MoreInfo** | Text (multi-line) | ⚠️ | Additional information or guidance | "Workarounds available, see link below" |
| **Updates** | Text (multi-line) | ⚠️ | Latest updates on the issue | "Issue resolution in progress" |

### Timeline

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **StartDate** | DateTime | ✅ | When issue started | "2025-12-08T08:34:00Z" |
| **NextUpdateBy** | DateTime | ⚠️ | When next update will be provided | "2026-06-28T13:00:00Z" |
| **LastUpdated** | DateTime | ⚠️ | Last time message was updated | "2026-06-28T12:58:00Z" |
| **ResolvedDate** | DateTime | ⚠️ | When issue was resolved (if resolved) | "2026-06-28T14:30:00Z" |

### Status & Management

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **Status** | Choice | ✅ | Internal tracking status | "Active" / "Assigned" / "In Review" / "Resolved" |
| **ReviewStatus** | Choice | ✅ | Internal review status | "Pending Review" / "Reviewed" |
| **Deadline** | Date (date only) | ⚠️ | Internal deadline for action | "2026-06-30" |

### Assignments & Tracking

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **AssignedTo** | Person | ⚠️ | Staff member assigned to track this issue | "john.smith@company.com" |
| **ReviewedBy** | Person | ⚠️ | Staff member who reviewed this message | "sarah.johnson@company.com" |
| **Notes** | Text (multi-line) | ⚠️ | Internal notes and comments | "Need to contact Microsoft support for updates" |

---

## Field Mapping: Microsoft → SharePoint

Maps the public Microsoft Service Health message to internal SharePoint fields:

```
Microsoft Service Health Format          →    SharePoint Column
─────────────────────────────────────────────────────────────────
[Headline]                               →    Title
[Issue ID - EX1233142]                   →    IssueID
[Generated ID - SH-20260628-001]         →    MessageID
[Affected services - Exchange Online]    →    Service
[Status - Service degradation]           →    IssueType
[Advisory]                               →    IssueType (also used)
[Some users may see...]                  →    Description
[User impact]                            →    UserImpact
[Scope of impact]                        →    ScopeOfImpact
[Root cause]                             →    RootCause
[More info]                              →    MoreInfo
[Updates]                                →    Updates
[Start time - 8 Dec 2025]                →    StartDate
[Next update by - time]                  →    NextUpdateBy
[27 Jun 2026 at 12:58 AM IST]            →    LastUpdated
[Resolved - time (if applicable)]        →    ResolvedDate
```

---

## Required vs Optional Fields

### Required Fields (Must have a value):
- ✅ **Title** - Issue headline
- ✅ **Service** - Which M365 service
- ✅ **MessageID** - Unique identifier
- ✅ **IssueID** - Microsoft issue ID
- ✅ **IssueType** - Advisory / Incident / etc.
- ✅ **Severity** - High / Medium / Low
- ✅ **StartDate** - When issue started
- ✅ **Status** - Active / Assigned / In Review / Resolved
- ✅ **ReviewStatus** - Pending Review / Reviewed
- ✅ **UserImpact** - How users are affected
- ✅ **ScopeOfImpact** - Who is affected

### Optional Fields (Can be empty):
- ⚠️ **Description** - Detailed description
- ⚠️ **RootCause** - Root cause (not always known immediately)
- ⚠️ **MoreInfo** - Additional guidance
- ⚠️ **Updates** - Latest updates
- ⚠️ **Impact** - Additional impact notes
- ⚠️ **Deadline** - Internal deadline
- ⚠️ **NextUpdateBy** - When next update expected
- ⚠️ **LastUpdated** - Last update timestamp
- ⚠️ **ResolvedDate** - Resolution timestamp
- ⚠️ **AssignedTo** - Staff assignment
- ⚠️ **ReviewedBy** - Who reviewed it
- ⚠️ **Notes** - Internal notes

---

## Data Validation

All fields are validated before saving to SharePoint:

### Text Fields
- Strings only
- No length restrictions in validation
- Allow multi-line text

### Choice Fields
**Service:** Exchange Online, Microsoft Teams, SharePoint Online, Microsoft Entra ID, Microsoft 365, OneDrive, Outlook, Power Platform, Defender

**Severity:** High, Medium, Low

**Status:** Active, Assigned, In Review, Resolved

**ReviewStatus:** Pending Review, Reviewed

**IssueType:** Advisory, Incident, Service Degradation, Maintenance, Investigation

### Date/DateTime Fields
- ISO 8601 format validation
- Must be valid dates
- Examples: "2026-06-28T12:58:00Z", "2026-06-30"

### Person Fields
- Must be valid person/group from organization
- Supports single person selection
- Optional (can be empty)

---

## Usage Examples

### Example 1: New Service Degradation Alert
```javascript
{
  title: "Some users may see that when selecting a meeting room...",
  messageId: "SH-20260628-001",
  issueId: "EX1233142",
  service: "Exchange Online",
  issueType: "Advisory",
  severity: "High",
  userImpact: "Users experiencing delayed email delivery affecting business operations",
  scopeOfImpact: "Affects all organizations with Exchange Online",
  status: "Active",
  reviewStatus: "Pending Review",
  startDate: "2025-12-08T08:34:00Z",
  lastUpdated: "2026-06-28T12:58:00Z",
  nextUpdateBy: "2026-06-28T13:00:00Z"
}
```

### Example 2: Resolved Issue
```javascript
{
  title: "Exchange Online: Email delivery delays",
  messageId: "SH-20260627-005",
  issueId: "EX1232999",
  service: "Exchange Online",
  issueType: "Incident",
  severity: "Medium",
  userImpact: "Some users unable to send emails",
  scopeOfImpact: "EMEA region only",
  rootCause: "Database overload due to maintenance script",
  moreInfo: "Issue has been fully resolved",
  status: "Resolved",
  reviewStatus: "Reviewed",
  reviewedBy: "sarah.johnson@company.com",
  assignedTo: "john.smith@company.com",
  startDate: "2025-12-08T08:34:00Z",
  resolvedDate: "2026-06-28T14:30:00Z",
  notes: "Resolved after database optimization"
}
```

---

## API Field Names

When using the REST API to create/update messages, use these field names in the request body:

```json
{
  "title": "string",
  "messageId": "string",
  "issueId": "string",
  "service": "Exchange Online | Microsoft Teams | ...",
  "issueType": "Advisory | Incident | Service Degradation | Maintenance | Investigation",
  "severity": "High | Medium | Low",
  "description": "string",
  "userImpact": "string",
  "scopeOfImpact": "string",
  "rootCause": "string",
  "moreInfo": "string",
  "impact": "string",
  "updates": "string",
  "status": "Active | Assigned | In Review | Resolved",
  "reviewStatus": "Pending Review | Reviewed",
  "startDate": "ISO 8601 datetime",
  "nextUpdateBy": "ISO 8601 datetime",
  "lastUpdated": "ISO 8601 datetime",
  "resolvedDate": "ISO 8601 datetime",
  "deadline": "date string (YYYY-MM-DD)",
  "assigned": "person display name or email",
  "reviewedBy": "person display name or email",
  "notes": "string"
}
```

---

## Summary

✅ **Total Fields:** 26  
✅ **Required Fields:** 11  
✅ **Optional Fields:** 15  

All Microsoft Service Health message information is now comprehensively captured in the SharePoint schema, including:
- Core issue information (title, ID, type)
- Service classification (service, severity, issue type)
- User impact details (description, user impact, scope)
- Resolution information (root cause, updates, more info)
- Timeline tracking (start date, next update, resolved date)
- Internal management (assignment, review status, notes)

This ensures complete traceability and tracking of all M365 service health events.
