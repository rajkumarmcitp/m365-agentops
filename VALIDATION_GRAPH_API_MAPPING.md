# Validation Checker — Graph API Mapping

## Current vs. Target State

### Current State (Demo Data)
- **Data Source:** `data/cis-controls.js` (hardcoded sample data)
- **Tenant:** contoso.com (example domain)
- **Status Calculation:** Static/pre-defined
- **Results:** 90% pass rate, 93/100 risk score (sample)

### Target State (Real Tenant Data)
- **Data Source:** Microsoft Graph API (live tenant data)
- **Tenant:** Your actual M365 tenant
- **Status Calculation:** Real-time API queries
- **Results:** Actual compliance posture

---

## Graph API Endpoints to Implement

### Topic 1: Microsoft 365 Admin Center

**[1.1.1] Global Admin Count**
```
Endpoint: /directoryRoles/{id}/members
Filter: displayName eq 'Global Administrator'
Expected: 2-4 global admins
```

**[1.1.2] Third-party App Consent**
```
Endpoint: /policies/authorizationPolicy
Field: DefaultUserRolePermissions.AllowedToCreateApps
Expected: false or 'PermissionGrantPolicy'
```

**[1.1.3] Default User Cannot Create Tenants**
```
Endpoint: /policies/authorizationPolicy
Field: DefaultUserRolePermissions.AllowedToCreateTenants
Expected: false
```

**[1.1.4] Security Defaults vs Conditional Access**
```
Endpoint: /policies/identitySecurityDefaultEnforcementPolicy
Field: IsEnabled
Also check: /identity/conditionalAccess/policies (count)
Expected: If CA policies exist, Security Defaults = false
```

### Topic 2: Microsoft Defender

**[2.1.3] Safe Attachments Policy**
```
Endpoint: /admin/serviceAnnouncement/healthOverviews/{serviceId}
Resource: Exchange Online Protection
Status field indicates SafeAttachments configuration
Expected: Enabled and assigned to all users
```

**[2.1.5-2.1.7] Email Authentication (SPF/DKIM/DMARC)**
```
Endpoint: /domains
Get all domains for tenant
For each domain:
  - Check SPF records via DNS (external)
  - Check DKIM signing status
  - Check DMARC policy
Expected: All configured
```

**[2.2.1] Defender for Cloud Apps**
```
Endpoint: /deviceAppManagement/deviceCompliancePolicies
Look for: Cloud App Compliance policies
Expected: At least 1 policy, fully configured
```

**[2.4.1] Defender for Endpoint**
```
Endpoint: /deviceManagement/managedDevices
Filter: complianceState = 'compliant'
Count against total enrolled devices
Expected: 100% of devices onboarded
```

### Topic 3: Microsoft Purview

**[3.2.3] DLP Policies for Teams**
```
Endpoint: /datalossprevention/policies
Filter: workload = 'Teams'
Expected: At least 1 DLP policy configured for Teams
```

**[3.2.1] Sensitivity Labels**
```
Endpoint: /informationProtection/policy/labels
Count configured labels
Expected: At least 3-5 labels configured
```

### Topic 4: Microsoft Intune

**[4.1.x] Device Compliance Policies**
```
Endpoint: /deviceManagement/deviceCompliancePolicies
Get all compliance policies
For each:
  - Check assignments (users/groups)
  - Check compliance status
Expected: Multiple policies, 80%+ devices compliant
```

### Topic 5: Microsoft Entra Admin Center

**[5.1.1] Conditional Access Policies**
```
Endpoint: /identity/conditionalAccess/policies
Count active policies
Check scopes: users, apps, conditions
Expected: 5+ policies covering: MFA, app access, device compliance, locations
```

**[5.2.1] Self-Service Password Reset**
```
Endpoint: /policies/authenticationMethodsPolicy
Field: passwordlessMicrosoftAuthenticatorAllowed
Expected: Enabled for all users or majority
```

**[5.2.2] MFA Requirements**
```
Endpoint: /policies/authenticationMethodsPolicy
Check all methods enabled:
  - Microsoft Authenticator
  - FIDO2 keys
  - Windows Hello
  - Temporary access pass
Expected: Multiple methods, broad coverage
```

### Topic 6: Exchange Admin Center

**[6.1.x] Mail Flow & Connectors**
```
Endpoint: /admin/serviceAnnouncement/healthOverviews
Resource: Exchange Online
Check: Mail flow connectors, TLS enforcement
Expected: Modern authentication, TLS 1.2+
```

### Topic 7: SharePoint Admin Center

**[7.2.1] External Sharing Settings**
```
Endpoint: /admin/sharepoint/sites/{id}/externalSharingPolicy
Field: SharingCapability
Expected: 'ExistingExternalUserSharingOnly' or more restrictive
```

**[7.2.x] SharePoint Compliance Settings**
```
Endpoint: /admin/sharepoint/sites
Check for each site:
  - External sharing settings
  - Data classification
  - DLP policies applied
Expected: Consistent across all sites
```

### Topic 8: Microsoft Teams Admin Center

**[8.1.1] External Teams Access**
```
Endpoint: /teamwork/teamsAppSettings
Field: ExternalTeamsAccess
Check: AllowedDomains list
Expected: Whitelist of approved external domains
```

**[8.2.4] Teams External Chat**
```
Endpoint: /teamwork/federationConfiguration
Field: ExternalChatAccess
Expected: Restricted to approved domains
```

### Topic 9: Microsoft Fabric

**[9.1.1] Fabric Tenant Settings**
```
Endpoint: /admin/powerBi/capacities
Check:
  - Publish to web disabled
  - Guest access restricted
  - Certification requirements
Expected: Security-first configuration
```

---

## Implementation Roadmap

### Phase 1: Graph API Setup (2-3 hours)
- [ ] Register Azure AD app with required permissions
- [ ] Request scopes:
  - `Directory.Read.All`
  - `Policy.Read.All`
  - `DeviceManagementConfiguration.Read.All`
  - `DLPEvaluate.Read`
  - `Teams.Manage`
  - `SharePointTenantManagement.Read.All`

### Phase 2: Backend Integration (4-6 hours)
- [ ] Create `/config/cis-controls` endpoint in Node.js backend
- [ ] Implement Graph API client in backend
- [ ] Add data transformation layer (API response → CIS format)
- [ ] Implement caching (results valid for 1 hour)
- [ ] Add error handling and logging

### Phase 3: Frontend Integration (1-2 hours)
- [ ] Update frontend to call real endpoint
- [ ] Fallback to demo data if API unavailable
- [ ] Add refresh capability ("Run scan now")
- [ ] Display actual tenant name
- [ ] Show data collection timestamp

### Phase 4: Testing & Refinement (2-3 hours)
- [ ] Test against real M365 tenant
- [ ] Verify all 160 controls
- [ ] Validate risk scoring
- [ ] Performance testing (API response time)
- [ ] Error scenario testing

---

## File Structure for Real Data

When wired up, the validation flow will be:

```
Browser → api-client.js
         ↓ (callAPI)
Backend API at :3000/api/config/cis-controls
         ↓
Graph API Client (backend)
         ↓
Microsoft Graph API
         ↓
Real Tenant Configuration
         ↓
Transform to CIS Format
         ↓
Return JSON with actual statuses
         ↓
renderValidationView() displays real results
```

---

## Example: Real Data Output

When connected to actual tenant:

```json
{
  "timestamp": "2026-06-22T14:30:00Z",
  "tenantId": "your-tenant-id",
  "tenantDomain": "yourcompany.onmicrosoft.com",
  "topics": [
    {
      "id": "t1",
      "name": "Microsoft 365 Admin Center",
      "subsections": [
        {
          "id": "t1s1",
          "name": "1.1 Users",
          "controls": [
            {
              "id": "1.1.1",
              "title": "Ensure that between two and four global admins are designated",
              "status": "pass",
              "value": "3 Global Admins: admin1@, admin2@, admin3@",
              "actualCount": 3,
              "expectedRange": [2, 4],
              "lastVerified": "2026-06-22T14:30:00Z"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Next Steps

1. **Verify you have Graph API access** → Check app registration in Azure Portal
2. **Check backend implementation** → Is Node.js backend running?
3. **Enable real data** → Implement endpoints above
4. **Test with actual tenant** → Run validation against real M365
5. **Deploy to production** → Use exported JSON for compliance

---

**Current Validation Checker Status:**
- ✅ UI/Frontend: Complete & working (demo data)
- ✅ Validation Logic: Complete & tested
- ⏳ Backend Integration: Awaiting Graph API implementation
- ⏳ Real Data: Ready to connect

**To go live:** Implement Graph API endpoints above (~8-12 hours of backend work)
