# Control Details Modal - Enhanced Display
## Comprehensive Validation Control Information

### Overview
The Control Details Modal has been significantly enhanced to provide comprehensive information about each security validation control. When clicking on any control in the Zero Trust Compliance dashboard, users now see detailed information about what was checked, validation methods, and remediation steps.

---

## Modal Sections (Top to Bottom)

### 1. **Header Section**
- **Control ID & Name:** e.g., "DATA-006: Data Classification Framework Implemented"
- **Description:** Brief explanation of what the control validates
- **Close Button:** Click the × button to close the modal

### 2. **Metadata & Status Bar** (Color-coded background)
Displays key information at a glance:
- **Status Badge:** 
  - ✓ PASS (Green)
  - ✗ FAIL (Red)
  - ⚠ WARNING (Yellow)
- **Severity Badge:**
  - Critical (Red)
  - High (Orange)
  - Medium (Blue)
  - Low (Gray)
- **Priority:** 1-5 scale (5 = Highest priority)
- **Impact Score:** 0-100 scale (quantifies security impact)
- **Auto-Remediation:** ✓ indicator if available
- **Pillar:** Security pillar (Identity, Device, AI, Data, etc.)
- **Category:** Specific control category within pillar

### 3. **"What Was Checked" Section** (Information Box)
Detailed explanation of:
- What validation was performed
- What configuration is being verified
- Why this control matters for security
- Example: "Sensitivity labels automatically/manually applied to documents containing sensitive data"

### 4. **"Expected Value / Target" Section** (Green border box)
Shows the target configuration:
- What the ideal state should be
- Compliance thresholds
- Best practice settings
- Example: ">80% of sensitive documents labeled within 30 days"

### 5. **"Current Value" Section** (Color-coded border based on status)
Displays the actual state:
- Green border if PASS
- Red border if FAIL
- Orange border if WARNING
- Shows current configuration or assessment result
- Example: "52% of sensitive documents currently labeled"

### 6. **"Evidence Collected" Section** (Optional)
When available, shows:
- What data was collected during validation
- Count/percentage of items checked
- Audit trail information
- Example: "Count of labeled items by classification level"

### 7. **"Validation Methods" Section** (Two tabs)

#### Graph API Query
- Shows the Microsoft Graph API query used for validation
- Formatted in monospace for easy copying
- Prefix: 📊 Graph API Query
- Color: Blue left border
- Users can run queries in Graph Explorer

#### PowerShell Command
- Shows the PowerShell/PowerShell Core command used
- Formatted in monospace for easy copying
- Prefix: 🔧 PowerShell Command
- Color: Orange left border
- Users can run directly in PowerShell terminal
- Cross-platform compatible (Windows/Mac/Linux)

**Common Modules Referenced:**
- `Microsoft.Graph` - Azure AD / M365 API access
- `ExchangeOnlineManagement` - Exchange Online cmdlets
- `PnP.PowerShell` - SharePoint/Teams API
- `AzureAD` - Legacy Azure AD operations

### 8. **"Remediation Steps" Section** (Color-coded by severity)
Comprehensive remediation guidance:
- Step-by-step instructions
- Configuration locations (e.g., Microsoft 365 admin center)
- Policy settings to change
- Testing recommendations
- Documentation links
- Example:
  ```
  Create DLP policies for:
  - Credit cards (Luhn algorithm)
  - SSNs and national IDs
  - API keys and secrets
  - Confidential data patterns
  
  Set rule actions:
  - Low-confidence: Alert user
  - Medium-confidence: Alert & log
  - High-confidence: Block sharing + alert
  ```

### 9. **Footer Action Buttons**

#### Auto-Remediate Button (When Available)
- Only shows if `autoRemediationAvailable: true`
- Click to automatically apply remediation
- Button changes to "Remediating..." with spinner
- After completion: "✓ Remediated" and auto-closes modal
- Use cases:
  - Enabling policy settings
  - Creating default DLP rules
  - Applying sensitivity labels
  - Enforcing Conditional Access policies

#### Close Button
- Always available
- Closes modal without making changes
- Can also click outside modal area

---

## Control Data Structure

Each control contains the following fields visible in the modal:

```json
{
  "id": "DATA-006",
  "name": "Data Classification Framework Implemented",
  "pillar": "Data Protection & Compliance",
  "category": "Data Governance",
  "severity": "Critical",
  "priority": 5,
  "impactScore": 85,
  
  "description": "Organization-wide data classification framework defined and enforced (Public, Internal, Confidential, Restricted)",
  
  "expectedValue": "4+ classification levels defined and active",
  "currentValue": "2 classification levels configured",
  "evidence": "List of classification types and usage count",
  
  "status": "fail",
  
  "graphApi": "GET /v1.0/compliance/sensitiveTypes | where {$_.DisplayName -match 'Confidential|Internal|Secret'}",
  "powershell": "Get-AIPSensitiveType | Where-Object {$_.DisplayName -match 'Confidential|Internal|Restricted|Secret'} | Measure-Object",
  
  "remediation": "Define data classification policy (Public/Internal/Confidential/Restricted)...",
  "autoRemediationAvailable": false
}
```

---

## Control Types by Pillar

### Identity Security (40 controls)
- MFA enforcement
- Legacy authentication blocking
- Workload identity management
- Access control policies
- Risk-based conditional access

### Device Security (40 controls)
- Device compliance policies
- Encryption (BitLocker, FileVault)
- Windows Hello for Business
- Mobile device management
- Security baselines

### AI Security & Governance (27 controls)
- Copilot data privacy
- AI agent security
- Model governance
- Data protection for AI
- Monitoring & compliance

### Data Protection & Compliance (25 controls)
- Data classification
- DLP policies
- Sensitivity labels
- Sharing restrictions
- Compliance management

### Other Pillars (20 controls)
- Infrastructure security
- Application security
- Network threat protection

---

## Using Validation Methods

### Graph API Query
**When to use:** Cloud-only environments, automated testing
1. Copy the query from modal
2. Go to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)
3. Paste query into request box
4. Click "Run Query"
5. View results in JSON format

**Requirements:**
- Azure AD user with appropriate permissions
- Admin consent for sensitive scopes

### PowerShell Command
**When to use:** On-premises + cloud, batch operations, automation
1. Copy the command from modal
2. Open PowerShell or PowerShell Core terminal
3. Install required modules (if not already installed)
4. Connect to required services:
   ```powershell
   Connect-MgGraph -Scopes "Directory.Read.All"
   ```
5. Paste and run command
6. Review output results

**Requirements:**
- PowerShell 7.0+ recommended (cross-platform)
- Required Microsoft Graph, Exchange, SharePoint modules installed
- Appropriate permissions in Microsoft 365

---

## Status Indicators Explained

### Pass (✓ Green)
- Control is fully compliant
- Expected value matches current value
- No action needed
- Example: "MFA enabled for 100% of Global Admins"

### Fail (✗ Red)
- Control is not compliant
- Current value does not match expected
- Immediate remediation recommended
- Example: "Legacy authentication allowed (should be blocked)"

### Warning (⚠ Orange)
- Control is partially compliant
- Some non-compliance detected
- Remediation recommended within 30 days
- Example: "DLP policies configured but only 3 of 6 expected policies active"

---

## Severity Levels

### Critical
- **Risk:** Immediate security exposure
- **Action:** Fix within 1 week
- **Examples:** MFA not enabled, DLP policies missing, encryption disabled

### High
- **Risk:** Significant security gap
- **Action:** Fix within 30 days
- **Examples:** Oversharing detected, weak password policies, audit logging disabled

### Medium
- **Risk:** Moderate security concern
- **Action:** Fix within 60-90 days
- **Examples:** Outdated auto-labeling rules, missing compliance assessments

### Low
- **Risk:** Minor security consideration
- **Action:** Fix within 180 days
- **Examples:** Company portal branding missing, optional advanced settings

---

## Priority Scale (1-5)

- **5 (Critical):** Highest priority, fix immediately
- **4 (High):** Important, fix within 30 days
- **3 (Medium):** Standard priority, fix within 60 days
- **2 (Low):** Lower priority, fix within 90 days
- **1 (Minimal):** Lowest priority, fix as time allows

---

## Impact Score (0-100)

Quantifies security impact if control is failed:

- **90-100 (Critical):** Major security risk reduction if fixed
  - Examples: MFA, encryption, threat detection
- **70-89 (High):** Significant security improvement
  - Examples: DLP, access controls, compliance
- **50-69 (Medium):** Moderate security benefit
  - Examples: Audit logging, monitoring, additional enforcement
- **30-49 (Low):** Minor security improvement
  - Examples: Configuration hardening, reporting
- **0-29 (Minimal):** Minimal direct security impact
  - Examples: User experience improvements, documentation

---

## Navigation Tips

**Quick Actions:**
- Click on any control row to open details
- Press Esc or click outside modal to close
- Use browser Back button if needed

**Finding Specific Controls:**
1. Use Tab filter (Overview, Identity, Device, AI, Data, etc.)
2. Look for FAIL status (red ✗) first
3. Sort by Severity badge (Critical, High, etc.)
4. Search control name in browser (Ctrl+F)

**Copy Validation Commands:**
1. Triple-click monospace code box to select all
2. Ctrl+C (or Cmd+C) to copy
3. Paste into Graph Explorer or PowerShell
4. Run validation

---

## Troubleshooting

**Modal won't open:**
- Ensure backend API is running (should show 152 validations)
- Check browser console for errors (F12)
- Try refreshing page

**Remediation button disabled:**
- Only available for supported controls
- Some controls require manual configuration
- Check "Remediation Steps" section for manual guidance

**Graph API query fails:**
- Ensure you have required permissions
- Check Azure AD admin center for app registration
- May need to grant additional scopes

**PowerShell command fails:**
- Install required modules: `Install-Module Microsoft.Graph`
- Connect first: `Connect-MgGraph`
- Check execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned`

---

## Best Practices

1. **Review Controls Weekly:** Check for new FAIL/WARNING status
2. **Prioritize by Severity:** Fix Critical/High controls first
3. **Use Validation Methods:** Run queries to understand current state
4. **Document Remediation:** Keep records of changes made
5. **Test Before Deploying:** Validate in non-prod environment first
6. **Automate Where Possible:** Use Auto-Remediate for supported controls
7. **Monitor Trends:** Track compliance over time via trends tab

---

## Related Documentation

- [Zero Trust Assessment Summary](./ZERO_TRUST_ASSESSMENT_SUMMARY.md)
- [Identity Controls](./IDENTITY_ZERO_TRUST_VALIDATIONS.md)
- [Device Controls](./DEVICE_ZERO_TRUST_VALIDATIONS.md)
- [AI Controls](./AI_ZERO_TRUST_VALIDATIONS.md)
- [Data Controls](./DATA_ZERO_TRUST_VALIDATIONS.md)
- [Microsoft Zero Trust Framework](https://aka.ms/zerotrust)
- [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)

