# M365 Configuration Live Validation Checker

## Overview

The **Live Validation Checker** provides real-time validation of all 9 Microsoft 365 configuration areas against CIS benchmarks. It displays a comprehensive compliance dashboard with risk scoring, pass rates, and detailed remediation guidance.

## Accessing the Validation Checker

1. Navigate to the **Microsoft 365 Configuration** page
2. Click the **"Validation Report"** button in the top-right corner
3. View the comprehensive validation dashboard

## Dashboard Sections

### 1. Risk Score Overview (Left Panel)

Displays your overall security posture in a single glance:

```
┌─────────────────────────┐
│  Risk Score             │
│  ────────────────────   │
│  93                     │
│  Risk Score             │
│  Low-Moderate Risk ⚠️   │
└─────────────────────────┘
```

- **Score:** 0-100 (higher is better)
- **Risk Levels:**
  - 95-100: Low Risk (Green) ✓
  - 85-95: Low-Moderate Risk (Light Green) ⚠️
  - 65-85: Moderate Risk (Amber) ⚠️
  - 35-65: High Risk (Orange) ⚠️
  - 0-35: Critical Risk (Red) ❌

- **Color-coded left border** matches risk level

### 2. Overall Statistics (Right Panel)

Quick metrics on your compliance status:

```
┌──────────────┬──────────────┐
│ Pass Rate    │ 90%          │
├──────────────┼──────────────┤
│ Passed       │ 144 / 160    │
├──────────────┼──────────────┤
│ Failed       │ 6            │
├──────────────┼──────────────┤
│ Warnings     │ 10           │
└──────────────┴──────────────┘
```

- **Pass Rate:** Percentage of all controls passing
- **Passed:** Count of passed controls vs. total
- **Failed:** Number of critical failures requiring immediate remediation
- **Warnings:** Number of warnings requiring review and improvement

### 3. Configuration Areas Grid (9 Cards)

Visual status of each of the 9 M365 configuration areas:

```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ 📊 Microsoft 365     │ 🛡️ Microsoft         │ 📋 Microsoft Purview │
│ Admin Center         │ Defender             │                      │
│ 67%                  │ 81%                  │ 80%                  │
│ 10/15 passed         │ 17/21 passed         │ 4/5 passed           │
│ 5 failed             │ 2 failed             │ 1 failed             │
│ 0 warnings           │ 2 warnings           │ 0 warnings           │
└──────────────────────┴──────────────────────┴──────────────────────┘
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ 🔐 Microsoft Intune  │ 🔑 Microsoft Entra   │ ✉️ Exchange Admin    │
│ 100% ✓               │ Admin Center         │ Center               │
│ 2/2 passed           │ 90%                  │ 100% ✓               │
│ 0 failed             │ 57/63 passed         │ 0 failed             │
│ 0 warnings           │ 0 failed             │ 0 warnings           │
└──────────────────────┴──────────────────────┴──────────────────────┘
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ 📁 SharePoint Admin  │ 💬 Microsoft Teams   │ 🏭 Microsoft Fabric  │
│ Center               │ Admin Center         │                      │
│ 100% ✓               │ 100% ✓               │ 100% ✓               │
│ 12/12 passed         │ 17/17 passed         │ 12/12 passed         │
│ 0 failed             │ 0 failed             │ 0 failed             │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

**Each card shows:**
- Icon and topic name
- Pass rate percentage
- Control count (passed / total)
- Failed count (if any)
- Warning count (if any)

**Hover effects:**
- Border color changes
- Shadow enhances
- Card lifts slightly

### 4. Failed Controls Panel

Lists all 6 controls that are currently failing and require immediate remediation:

```
❌ FAILED CONTROLS (6)

┌────────────────────────────────────────────────────────────────┐
│ [1.1.4]                                                        │
│ Ensure Security Defaults are disabled when Conditional Access │
│ is used                                                        │
│                                                                │
│ Topic: Microsoft 365 Admin Center · Section: 1.1 Users        │
│                                                                │
│ Current State:                                                 │
│ Security Defaults: ENABLED — conflicts with existing          │
│ Conditional Access policies.                                  │
│                                                                │
│ Expected:                                                      │
│ Security Defaults should be disabled when Conditional Access  │
│ policies are in place (they are mutually exclusive)          │
│                                                                │
│ Validation:                                                    │
│ (Get-MgPolicyIdentitySecurityDefaultEnforcementPolicy).IsEnabled
└────────────────────────────────────────────────────────────────┘
```

**Each control shows:**
- Control ID (e.g., 1.1.4)
- Title
- Topic and section context
- Current state
- Expected configuration
- PowerShell validation command

### 5. Warning Controls Panel

Lists all 10 controls with warnings that need review and improvement:

```
⚠️ WARNING CONTROLS (10)

┌────────────────────────────────────────────────────────────────┐
│ [1.1.2]                                                        │
│ Ensure third-party integrated applications are not allowed    │
│                                                                │
│ Topic: Microsoft 365 Admin Center · Section: 1.1 Users        │
│                                                                │
│ Current State:                                                 │
│ User consent for third-party apps is set to:                  │
│ Allow user consent for apps from verified publishers.         │
│                                                                │
│ Recommendation:                                                │
│ Restrict user consent for third-party apps to reduce risk of  │
│ malicious app data access                                     │
│                                                                │
│ Validation:                                                    │
│ (Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions. │
│ AllowedToCreateApps                                           │
└────────────────────────────────────────────────────────────────┘
```

## Export Report

**Button:** Export Report
**Action:** Downloads validation results as JSON file
**Filename Format:** `m365-config-validation-YYYY-MM-DD.json`

**File Contents:**
- Complete validation results for all 9 topics
- Per-subsection breakdown
- All control statuses (pass/fail/warn/manual)
- Timestamps

**Use Case:** Compliance audits, annual reviews, stakeholder reporting

## Navigation

- **Back Button:** Returns to M365 Configuration main page
- **Validation Report Button:** Opens this dashboard

## Interpreting the Results

### High Pass Rate (>85%)

- ✅ Your organization is well-aligned with CIS benchmarks
- Focus on addressing the few remaining failures and warnings
- Example: 90% pass rate with 6 failures and 10 warnings

### Moderate Pass Rate (65-85%)

- ⚠️ Several areas need improvement
- Prioritize failed controls (especially in critical topics)
- Address warnings to strengthen compliance posture

### Low Pass Rate (<65%)

- ❌ Significant compliance gaps
- Immediate action required on failed controls
- Consider engaging security team for remediation planning

## Topics at a Glance

| Topic | Pass Rate | Status | Action |
|-------|-----------|--------|--------|
| Microsoft 365 Admin Center | 67% | ⚠️ Needs Attention | 5 failures |
| Microsoft Defender | 81% | ⚠️ Review | 2 failures, 2 warnings |
| Microsoft Purview | 80% | ⚠️ Review | 1 failure |
| Microsoft Intune | 100% | ✓ Compliant | No issues |
| Microsoft Entra Admin Center | 90% | ✓ Good | Address 0 failures |
| Exchange Admin Center | 100% | ✓ Compliant | No issues |
| SharePoint Admin Center | 100% | ✓ Compliant | No issues |
| Microsoft Teams Admin Center | 100% | ✓ Compliant | No issues |
| Microsoft Fabric | 100% | ✓ Compliant | No issues |

## Remediation Workflow

1. **Review Failed Controls** ❌
   - Read the title and current state
   - Understand the expected configuration
   - Use PowerShell command to verify status

2. **Address High-Impact Failures**
   - Prioritize failures in critical topics (Admin Center, Defender)
   - Each failure has a PowerShell command for validation

3. **Review Warnings** ⚠️
   - Assess if the current state meets your organization's requirements
   - Consider strengthening controls where feasible

4. **Re-run Validation** 🔄
   - Return to M365 Config page
   - Click "Validation Report" again
   - Verify improvements in pass rate

5. **Export & Archive** 📊
   - Export report after addressing failures
   - Store for compliance documentation
   - Track progress over time

## Common Failures & Remediation

### Security Defaults vs. Conditional Access
- **Issue:** Security Defaults conflict with Conditional Access
- **Solution:** Disable Security Defaults if using Conditional Access policies
- **Command:** `Set-MgPolicyIdentitySecurityDefaultEnforcementPolicy -IsEnabled $false`

### DLP Policies for Teams
- **Issue:** No DLP policy targeting Teams workload
- **Solution:** Create DLP policy with Teams as workload
- **Location:** Microsoft Purview Compliance Portal → Data Loss Prevention

### Safe Attachments
- **Issue:** Policy not assigned to all users or only in report mode
- **Solution:** Ensure Safe Attachments policy applies to all recipients
- **Command:** `Get-SafeAttachmentPolicy | Select Name,Action,Enable`

## Support & Next Steps

- 📋 Review failed controls systematically
- ⚙️ Apply PowerShell commands to verify current state
- 🔐 Implement recommended configurations
- 📊 Re-run validation to track progress
- 💾 Export report for stakeholder communication

---

**Last Updated:** 2026-06-22  
**Validation System:** Live CIS Benchmark Checker  
**Total Controls:** 160 across 9 areas  
**Update Frequency:** Run scan as needed, export for audit trails
