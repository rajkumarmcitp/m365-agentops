# Comprehensive M365 Backup Enhancement Guide

## Objective
Enhance backup collectors to capture **ALL** available components from each M365 service using both Graph API and PowerShell, enabling complete configuration backup and restore.

## Current Status vs. Target

### Entra ID (Security) Example
- **Current**: 6 components, 126 resources
- **Target**: 104 components, 300+ resources
- **Gap**: 98 components not yet collected

## Strategy: Hybrid Collection Approach

### Tier 1: Graph API (Preferred)
Components available via Microsoft Graph API:
- Applications & Service Principals ✅ (Already working)
- Conditional Access Policies ✅ (Already working)
- Authentication Methods ✅ (Already working)
- Cross-Tenant Access ✅ (Already working)
- Security Defaults ✅ (Already working)

### Tier 2: PowerShell Fallback (For Graph-unavailable components)
Use MgGraph PowerShell modules for:
- Identity Governance & Lifecycle Workflows
- B2B/B2C Management Policies
- Custom Security Attributes
- App Management Policies
- Role Management Policies
- Entitlement Management Access Packages
- And 20+ more components

### Tier 3: Hybrid Enrichment
- Graph for list retrieval
- PowerShell for detailed configuration
- Combine results for comprehensive backup

---

## Implementation Plan

### Phase 1: Enhanced SecurityCollector
**Goal**: Collect all 104 Entra ID components

**Steps**:
1. **Expand Graph API collection** - Add all available Graph endpoints
2. **Add PowerShell collection** - Use MgGraph modules for missing components
3. **Implement retry logic** - Handle API rate limiting
4. **Add caching** - Avoid duplicate API calls
5. **Error handling** - Log failures but continue collecting other components

**Methods to Add** (37 new collection methods):

```
Graph API Methods (Additional):
- collectRoleDefinitions()
- collectAdministrativeUnits()
- collectAuthorizationPolicy()
- collectPolicyBasedAuthRuleConfigurations()
- collectIdentityProviders()
- collectExternalMembersManagementPolicy()
- collectHomeRealmDiscoveryPolicy()
- collectTokenLifetimePolicies()
- collectTokenIssuancePolicies()
- collectClaimsMappingPolicies()
- And 8+ more...

PowerShell Methods (New):
- collectEntitlementManagementCatalogs()
- collectLifecycleWorkflows()
- collectAccessPackages()
- collectB2XUserFlows()
- collectCustomSecurityAttributes()
- collectAppManagementPolicies()
- collectIdentityGovernancePrograms()
- collectMultiTenantOrganizationSettings()
- And 5+ more...
```

### Phase 2: Enhance Other Collectors

**Exchange Online**:
- Add Mailbox Policies (All types)
- Add Transport Rules (Complete configuration)
- Add DLP Policies
- Add Retention Policies
- Target: 100+ resources

**Teams**:
- Add Team Members with roles
- Add Channel Members
- Add Installed Apps with config
- Add Team Policies
- Target: 50+ resources

**SharePoint**:
- Add Site Collections
- Add Site Owners & Members
- Add Libraries
- Add List configurations
- Target: 100+ resources

**Compliance**:
- Add DLP Policy Rules
- Add Retention Policies
- Add Sensitivity Labels
- Add Label Conditions
- Target: 50+ resources

### Phase 3: Validate & Test
- Run full backup on all services
- Verify component counts match targets
- Test File Explorer display
- Test restore capability
- Document coverage

---

## Technical Implementation Details

### PowerShell Integration

The backend already has `powershell-executor.js`. Enhance it to support:

```javascript
// Example: Collect Entitlement Management data via PowerShell
async collectEntitlementManagementViaPS() {
  const script = `
    Get-MgEntitlementManagementCatalog -All | Select-Object -Property *
  `
  
  const result = await this.executePS(script, {
    tenantId: this.tenantId,
    clientId: this.clientId,
    clientSecret: this.clientSecret
  })
  
  return result
}
```

### API Pagination & Rate Limiting

```javascript
// Handle large result sets
async getWithPagination(endpoint, select, maxPages = 10) {
  let allResults = []
  let pageCount = 0
  let nextLink = null
  
  do {
    const response = await this.graphClient
      .api(nextLink || endpoint)
      .select(select)
      .top(999)
      .get()
    
    allResults.push(...(response.value || []))
    nextLink = response['@odata.nextLink']
    pageCount++
    
    if (pageCount >= maxPages) break
  } while (nextLink)
  
  return allResults
}
```

### Caching Strategy

```javascript
// Prevent duplicate API calls
async collectWithCache(key, fetchFn) {
  if (this.cache[key]) return this.cache[key]
  
  try {
    const data = await fetchFn()
    this.cache[key] = data
    return data
  } catch (error) {
    console.warn(`Cache miss for ${key}: ${error.message}`)
    return []
  }
}
```

---

## Component Collection Priority

### Must-Have (Critical for restore)
- Applications & Service Principals
- Conditional Access Policies
- Authentication Methods & Policies
- Cross-Tenant Access
- Role Assignments & Definitions
- Entitlement Management Packages

### Should-Have (Important for compliance)
- Custom Security Attributes
- Lifecycle Workflows
- B2B Management Policies
- Identity Protection Policies
- Authorization Policies

### Nice-to-Have (Informational)
- Security Defaults
- Organization Settings
- Domains & Domain Federations
- Group Settings

---

## API Endpoints Reference

### Critical Endpoints (Ready)
```
✅ /applications
✅ /servicePrincipals
✅ /identity/conditionalAccess/policies
✅ /identity/directoryManagement/authenticationMethodsPolicies
✅ /identity/multiTenantOrganization/policies
✅ /authorizationPolicy
```

### Additional Endpoints (Need Testing)
```
🔧 /identity/entitlementManagement/catalogs
🔧 /identity/governance/lifecycleWorkflows
🔧 /identity/governance/accessPackages
🔧 /policies/
🔧 /identityProviders
🔧 /administrativeUnits
🔧 /directoryRoles
🔧 /roleManagement/directory/roleDefinitions
```

### PowerShell-Only Resources
```
PS> Get-MgIdentityGovernanceLifecycleWorkflow
PS> Get-MgEntitlementManagementAccessPackage
PS> Get-MgIdentityB2XUserFlow
PS> Get-MgDirectoryObjectWithAppRoleAssignment
```

---

## Testing Checklist

- [ ] Graph API endpoints returning data
- [ ] PowerShell integration working
- [ ] Pagination handling large result sets
- [ ] Error handling for missing permissions
- [ ] Caching prevents duplicate calls
- [ ] All 104 components attempted
- [ ] File Explorer shows all collected components
- [ ] Restore functionality works for all types
- [ ] No duplicate resources in backup
- [ ] Performance acceptable (< 2 minutes for full backup)

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Entra ID Components | 6 | 104 |
| Entra ID Resources | 126 | 300+ |
| Total M365 Components | 40 | 200+ |
| Total M365 Resources | 195 | 500+ |
| Backup Time | 59s | < 120s |
| Restore Capability | Partial | Complete |

---

## Implementation Approach

### Option A: Gradual Enhancement (Recommended)
1. Enhance SecurityCollector first (highest priority)
2. Test thoroughly
3. Apply pattern to other collectors
4. Roll out incrementally

### Option B: Comprehensive Overhaul
1. Redesign all collectors simultaneously
2. Use unified collection framework
3. Deploy all at once
4. Higher risk, faster completion

---

## Next Steps

1. **Analyze** which of the 104 Entra ID components can be fetched via each method
2. **Implement** enhanced SecurityCollector with all methods
3. **Test** full backup collection
4. **Validate** File Explorer displays all components
5. **Document** final component coverage
6. **Apply** pattern to other collectors
7. **Verify** restore functionality for all component types

---

## Resources

- Microsoft Graph Entra ID API: https://learn.microsoft.com/en-us/graph/api/resources
- MgGraph PowerShell: https://github.com/microsoftgraph/msgraph-sdk-powershell
- Identity Governance: https://learn.microsoft.com/en-us/graph/api/resources/identitygovernance-overview
