# PowerShell Collection Methods Guide

## Overview
The M365 backup system now includes PowerShell-based collection methods for M365 components that aren't available via Microsoft Graph API. This hybrid approach combines Graph API (preferred) with PowerShell fallback for comprehensive backup coverage.

## Architecture

### Hybrid Collection Strategy
1. **Tier 1: Graph API (Preferred)**
   - Faster, more reliable
   - Modern endpoints with better support
   - Available for most standard components

2. **Tier 2: PowerShell Fallback**
   - For Graph API unavailable components
   - Uses MgGraph PowerShell modules
   - Provides backward compatibility

3. **Tier 3: Fallback to powershell.exe**
   - Windows compatibility
   - When pwsh (PowerShell Core) unavailable

## Implementation

### Base executePowerShell Method
All collectors include a unified `executePowerShell()` method that:
- Executes PowerShell scripts securely
- Handles errors gracefully
- Falls back from pwsh to powershell.exe
- Returns JSON-parsed results
- Implements 60-second timeout

```javascript
async executePowerShell(script) {
  // Uses child_process.exec()
  // Supports both pwsh and powershell.exe
  // Returns parsed JSON or empty array on failure
}
```

## Implemented PowerShell Collections

### Entra ID (Security) Collector
11 PowerShell collection methods for advanced identity features:

1. **collectEntitlementManagementCatalogs()**
   - Endpoint: `Get-MgBetaEntitlementManagementCatalog`
   - Purpose: Entitlement management configuration
   - Status: Fails without MgGraph.Beta module

2. **collectLifecycleWorkflows()**
   - Endpoint: `Get-MgIdentityGovernanceLifecycleWorkflow`
   - Purpose: Identity governance automation
   - Status: Requires lifecycle management license

3. **collectB2XUserFlows()**
   - Endpoint: `Get-MgIdentityB2XUserFlow`
   - Purpose: B2C/B2X user journey flows
   - Status: Requires Azure AD B2C

4. **collectCustomSecurityAttributes()**
   - Endpoint: `Get-MgDirectoryAttributeSet`
   - Purpose: Custom attribute definitions
   - Status: Requires custom attributes feature

5. **collectAppManagementPolicies()**
   - Endpoint: `Get-MgPolicyAppManagementPolicy`
   - Purpose: App management policy settings
   - Status: Requires app management role

6. **collectPIMRoleEligibilitySchedules()**
   - Endpoint: `Get-MgRoleManagementDirectoryRoleEligibilitySchedule`
   - Purpose: PIM eligibility schedules
   - Status: Requires Privileged Identity Management

7. **collectPIMActivationRequests()**
   - Endpoint: `Get-MgRoleManagementDirectoryRoleAssignmentScheduleRequest`
   - Purpose: PIM activation history
   - Status: Requires Privileged Identity Management

8. **collectMultiTenantOrgPolicies()**
   - Endpoint: `Get-MgBetaMultiTenantOrganization`
   - Purpose: Multi-tenant organization settings
   - Status: Requires multi-tenant org feature

9. **collectIdentityProtectionPolicies()**
   - Endpoint: `Get-MgIdentityProtectionRiskyUser`
   - Purpose: Identity protection configuration
   - Status: Requires Azure AD Premium P2

10. **collectAccessReviewSettings()**
    - Endpoint: `Get-MgIdentityGovernanceAccessReviewDefinition`
    - Purpose: Access review definitions
    - Status: Requires governance features

11. **collectEntitlementAccessPackages()**
    - Endpoint: `Get-MgBetaEntitlementManagementAccessPackage`
    - Purpose: Entitlement management packages
    - Status: Requires entitlement management license

### Exchange Online Collector
4 PowerShell collection methods for advanced Exchange features:

1. **collectMailboxPoliciesPowerShell()**
   - Cmdlet: `Get-CasMailbox`
   - Purpose: Client Access Server mailbox policies
   - Collects: ActiveSync, OWA, IMAP, POP settings

2. **collectDLPPoliciesPowerShell()**
   - Cmdlet: `Get-DlpPolicy`
   - Purpose: Data Loss Prevention policies
   - Collects: DLP policy names, states, descriptions

3. **collectRetentionPoliciesPowerShell()**
   - Cmdlet: `Get-RetentionPolicy`
   - Purpose: Retention policy configuration
   - Collects: Retention policy names and descriptions

4. **collectTransportRulesDetailsPowerShell()**
   - Cmdlet: `Get-TransportRule`
   - Purpose: Detailed transport rule configuration
   - Collects: Rule names, enabled state, priority, state

## Requirements

### Prerequisites
- PowerShell Core (pwsh) or PowerShell 5.1+
- MgGraph PowerShell modules installed:
  ```powershell
  Install-Module Microsoft.Graph -Force
  Install-Module Microsoft.Graph.Beta -Force
  ```
- Appropriate Azure AD permissions for collections

### Permissions Required
- For Graph API collections: As defined in existing permissions
- For PowerShell collections: Requires Exchange Online Management or Azure AD admin access
- For advanced features (PIM, Identity Protection): Requires appropriate license (P2/Premium)

### Environment Setup
```powershell
# Install required modules
Install-Module Microsoft.Graph -Force
Install-Module Microsoft.Graph.Beta -Force
Install-Module ExchangeOnlineManagement -Force

# Verify installation
Get-InstalledModule | grep Microsoft.Graph
Get-InstalledModule | grep ExchangeOnlineManagement
```

## Error Handling

### Graceful Degradation
All PowerShell collection methods:
- Catch exceptions silently
- Return empty arrays on failure
- Log warnings to console
- Continue with other collections
- Don't block overall backup

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Command not found | Module not installed | Install module via `Install-Module` |
| Permission denied | Insufficient permissions | Grant admin consent via Azure Portal |
| Timeout (60s) | Large dataset or slow connection | Increase timeout in executePowerShell() |
| Empty results | Feature not enabled | Enable feature in Exchange/Azure AD |
| JSON parse error | Non-JSON output | Check script output format |

## Usage Example

```javascript
// In collector
async collect() {
  // Graph API collections
  await this.collectApplications()
  
  // PowerShell collections (for unavailable components)
  console.log('Starting PowerShell-based collection...')
  await this.collectEntitlementManagementCatalogs()
  await this.collectLifecycleWorkflows()
  
  return { success: true, resources: this.resources }
}
```

## Performance Impact

### Estimated Execution Times
- Graph API collections: 30-50 seconds
- PowerShell collections: 20-40 seconds (if modules installed)
- Total backup time: 60-90 seconds (hybrid approach)

### Optimization Tips
1. Install MgGraph modules locally before backup
2. Cache PowerShell module imports
3. Use pagination for large result sets
4. Implement connection pooling for multiple backups

## Future Enhancements

### Planned Additions
1. **Teams Collector** (4 methods)
   - Team policies and settings
   - Channel management policies
   - Meeting configuration

2. **SharePoint Collector** (6 methods)
   - Site security policies
   - Library settings
   - Access controls

3. **Compliance Collector** (8 methods)
   - Retention policy rules
   - Sensitivity label configurations
   - eDiscovery settings

4. **Intune Collector** (10 methods)
   - Device compliance policies
   - App management rules
   - Enrollment configurations

### Module Caching
Plan to implement persistent module caching:
```javascript
// Cache module state between backup runs
if (this.moduleCache['MgGraph']) {
  // Reuse existing connection
} else {
  // Initialize new connection
  this.moduleCache['MgGraph'] = { connected: true }
}
```

## Testing

### Local Testing Script
```javascript
// test-powershell-collection.js
import SecurityCollector from './backend/collectors/security-collector.js'

const collector = new SecurityCollector(graphClient)
const result = await collector.executePowerShell(`
  Get-MgUser -Top 5 | ConvertTo-Json
`)
console.log(result)
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Test PowerShell Collections
  run: |
    node test-powershell-collection.js
    if [ $? -eq 0 ]; then echo "PowerShell tests passed"; fi
```

## Monitoring & Logging

### Log Levels
- ✅ Success: Green checkmarks with count
- ⚠️ Warning: Yellow warnings for missing permissions
- ❌ Error: Red errors for failures
- 📋 Info: Gray info for starting collection

### Sample Output
```
📊 Starting PowerShell-based collection for advanced components...
📋 Collecting Entitlement Management Catalogs (PowerShell)...
⚠️ PowerShell execution failed: Command failed: pwsh...
📋 Collecting Lifecycle Workflows (PowerShell)...
✅ Found 0 lifecycle workflows
```

## Troubleshooting

### PowerShell Modules Not Found
```powershell
# Check if modules installed
Get-InstalledModule | grep Microsoft.Graph

# Install if missing
Install-Module Microsoft.Graph -Force
```

### Permission Denied Errors
```powershell
# Connect with elevated permissions
Connect-MgGraph -Scopes "Application.Read.All"
Update-MgApplication -InputObject $app
```

### Timeout Errors
```javascript
// Increase timeout in executePowerShell()
const { stdout } = await execAsync(command, { timeout: 120000 }) // 120 seconds
```

## References
- Microsoft Graph PowerShell: https://learn.microsoft.com/powershell/microsoftgraph/
- Exchange Online PowerShell: https://learn.microsoft.com/powershell/exchange/
- Identity Governance: https://learn.microsoft.com/en-us/graph/api/resources/identitygovernance-overview
- PIM: https://learn.microsoft.com/en-us/azure/active-directory/privileged-identity-management/

---

**Last Updated**: 2026-07-16
**Status**: Implementation in Progress
**Coverage**: 15+ PowerShell collection methods across 2 collectors
