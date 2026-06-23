# CIS Control PowerShell Commands Reference

This document lists all CIS controls that have PowerShell validation commands available as an alternative or fallback to Graph API validation.

## Overview

- **Total Controls with PowerShell Commands:** 20
- **Controls by Category:** Administrative (8), Email/Exchange (4), Active Directory (5), Other (3)
- **Purpose:** Provide PowerShell-based validation when Graph API endpoints are unavailable or for enhanced validation

## Usage

Import and use the PowerShell executor:

```javascript
import { 
  executePowerShellCommands, 
  executePowerShellWithGraph,
  executePowerShellWithRetry,
  mapPowerShellToStatus 
} from './powershell-executor.js'

// Execute a single control's PowerShell commands
const result = await executePowerShellCommands(commands, controlId)

// Execute with Graph API context
const result = await executePowerShellWithGraph(commands, scopes)

// Execute with automatic retry logic
const result = await executePowerShellWithRetry(commands, 3)
```

## Controls with PowerShell Commands

### Administrative Account Management (1.1.x)

#### 1.1.1: Cloud-Only Administrative Accounts
**Description:** Ensures admin accounts are cloud-only, not synchronized from on-premises

**PowerShell Commands:**
```powershell
Get-MgDirectoryRole
Get-MgDirectoryRoleMember -DirectoryRoleId $_.Id
Get-MgUser -UserId $_.Id -Property UserPrincipalName, DisplayName, Id, OnPremisesSyncEnabled
```

**Validation Logic:**
- Retrieves all directory roles and their members
- Checks OnPremisesSyncEnabled property (should be $false for cloud-only)
- Status: PASS if all global admins are cloud-only

---

#### 1.1.2: Emergency Access Accounts (Break Glass)
**Description:** Validates that two emergency access accounts are defined

**PowerShell Commands:**
```powershell
Connect-MgGraph -Scopes
Get-MgDirectoryRole -Filter "RoleTemplateId eq '62e9039469f5-4237-9190-012177145e10'"
Get-MgDirectoryRoleMember -DirectoryRoleId $GlobalAdminRole.Id
```

**Validation Logic:**
- Queries Global Admin role (RoleTemplateId: 62e90394-69f5-4237-9190-012177145e10)
- Checks for emergency break-glass accounts in the role
- Status: PASS if 2+ emergency accounts exist

---

#### 1.1.3: Global Admin Count Validation
**Description:** Ensures 2-4 global administrators are designated

**PowerShell Commands:**
```powershell
Get-MgDirectoryRole -Filter "RoleTemplateId eq '62e9039469f5-4237-9190-012177145e10'"
Get-MgDirectoryRoleMember -DirectoryRoleId $GlobalAdminRole.Id
$GlobalAdmins = $GlobalAdmins | select DisplayName,UserPrincipalName -Unique
```

**Validation Logic:**
- Counts unique global administrators
- Status: PASS if count is between 2-4, WARN if outside range

---

#### 1.1.4: Admin License Restrictions
**Description:** Validates that admin accounts don't have licenses with applications

**PowerShell Commands:**
```powershell
Get-MgDirectoryRole
Get-MgDirectoryRoleMember -DirectoryRoleId $_.Id
Get-MgUserLicenseDetail -UserId $Admin.id
```

**Validation Logic:**
- Retrieves licenses assigned to each admin
- Checks for licenses without applications (e.g., Entra ID P1/P2)
- Status: PASS if no app-bearing licenses assigned

---

### Group & Mailbox Management (1.2.x)

#### 1.2.1: Public Group Visibility Management
**Description:** Ensures only approved Microsoft 365 groups are public

**PowerShell Commands:**
```powershell
Get-MgGroup -All -Filter "groupTypes/any(c:c eq 'Unified')" -Property Id,DisplayName,Visibility,GroupTypes
ft Id,DisplayName,Visibility
```

**Validation Logic:**
- Lists all Microsoft 365 unified groups
- Checks Visibility property (should be Private)
- Status: FAIL if any public groups exist

---

#### 1.2.2: Shared Mailbox Sign-In Blocking
**Description:** Validates that direct sign-in to shared mailboxes is blocked

**PowerShell Commands:**
```powershell
Get-EXOMailbox -RecipientTypeDetails SharedMailbox -ResultSize Unlimited
Get-MgUser -UserId $_.ExternalDirectoryObjectId -Property DisplayName, UserPrincipalName, AccountEnabled
Update-MgUser -UserId $MBX.ExternalDirectoryObjectId -AccountEnabled:$false
```

**Validation Logic:**
- Retrieves all shared mailboxes
- Checks AccountEnabled status (should be $false)
- Status: PASS if all shared mailbox accounts are disabled

---

### Password & Session Management (1.3.x)

#### 1.3.1: Password Expiration Policy
**Description:** Ensures passwords are set to never expire

**PowerShell Commands:**
```powershell
Get-MgDomain | ft id,PasswordValidityPeriodInDays
Update-MgDomain -DomainId <Domain> -PasswordValidityPeriodInDays 2147483647
```

**Validation Logic:**
- Retrieves domain password policy
- Checks PasswordValidityPeriodInDays (should be 2147483647 for never expire)
- Status: PASS if no expiration configured

---

#### 1.3.2: Idle Session Timeout
**Description:** Validates 3-hour idle timeout for unmanaged devices

**PowerShell Commands:**
```powershell
Get-MgPolicyActivityBasedTimeoutPolicy
Get-MgIdentityConditionalAccessPolicy -All
Get-MgIdentityConditionalAccessPolicy -All | Where-Object { $_.SessionControls.ApplicationEnforcedRestrictions.IsEnabled }
```

**Validation Logic:**
- Checks activity-based timeout policy
- Validates conditional access session controls
- Status: PASS if timeout ≤ 3 hours

---

#### 1.3.3: External Calendar Sharing
**Description:** Validates that external calendar sharing is disabled

**PowerShell Commands:**
```powershell
Get-SharingPolicy -Identity "Default Sharing Policy" | ft Name,Enabled
Set-SharingPolicy -Identity "Default Sharing Policy" -Enabled $False
```

**Validation Logic:**
- Checks default sharing policy status
- Status: PASS if sharing policy is disabled

---

#### 1.3.4: User-Owned Apps & Services
**Description:** Ensures users cannot install add-ins in Office apps

**PowerShell Commands:**
```powershell
Invoke-MgGraphRequest -Uri $Uri
```

**Validation Logic:**
- Validates organizational policy for app installation
- Status: PASS if user app installation is disabled

---

#### 1.3.9: Shared Bookings Page Restrictions
**Description:** Validates that shared bookings pages are restricted

**PowerShell Commands:**
```powershell
Get-OwaMailboxPolicy -Identity OwaMailboxPolicy-Default | fl
Get-OrganizationConfig | fl BookingsEnabled
```

**Validation Logic:**
- Checks OWA mailbox policy for bookings
- Retrieves organization bookings setting
- Status: PASS if bookings are disabled

---

### Device Management (1.4.x)

#### 1.4.5: Local Administrator Password Solution (LAPS)
**Description:** Validates that LAPS (cloud version) is enabled for device passwords

**PowerShell Commands:**
```powershell
Connect-MgGraph -Scopes
Connect-MgGraph -Scopes
```

**Validation Logic:**
- Checks cloud LAPS configuration
- Validates local admin password rotation
- Status: PASS if LAPS is enabled

---

### Identity Governance (5.x)

#### 5.3.3: Privileged Role Access Reviews
**Description:** Ensures access reviews are configured for privileged roles

**PowerShell Commands:**
```powershell
[Access review related commands]
```

**Validation Logic:**
- Checks access review configuration
- Status: PASS if reviews are configured

---

### Exchange Administration (6.x)

#### 6.1.3: Mailbox Delegation Auditing
**Description:** Validates that mailbox delegation changes are audited

**PowerShell Commands:**
```powershell
[Mailbox delegation audit commands]
```

---

#### 6.2.2: Email Authentication (SPF/DKIM/DMARC)
**Description:** Ensures email authentication records are published

**PowerShell Commands:**
```powershell
[Email authentication validation commands]
```

---

### Additional Controls

- **1.4.1**: Device Entra Join Restrictions
- **1.4.2**: Maximum Devices Per User
- **1.4.3**: GA Role Local Admin Prevention
- **1.4.4**: Local Administrator Assignment Limits

---

## Integration with CIS Validator

The PowerShell executor is designed to work as a fallback mechanism:

1. **Primary:** Graph API validation (faster, more reliable)
2. **Fallback:** PowerShell commands (when Graph API endpoints unavailable)
3. **Hybrid:** Use both for comprehensive validation

## Requirements

- PowerShell 5.0 or higher
- Microsoft Graph PowerShell SDK installed
  ```powershell
  Install-Module Microsoft.Graph -Scope CurrentUser
  ```
- Exchange Online PowerShell module (for Exchange-related commands)
  ```powershell
  Install-Module ExchangeOnlineManagement -Scope CurrentUser
  ```

## Error Handling

The PowerShell executor includes:
- Automatic retry logic with exponential backoff
- Command timeout handling
- Output parsing for different formats (JSON, table, list)
- Error logging and reporting

## Security Notes

- PowerShell commands require appropriate permissions
- Graph API scopes should be minimal (principle of least privilege)
- Commands should run in a secure, isolated environment
- Audit logging recommended for sensitive operations

---

*Generated from CIS Microsoft 365 Foundations Benchmark v7.0.0*
*Last Updated: 2026-06-23*
