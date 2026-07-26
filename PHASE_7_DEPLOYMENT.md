# Phase 7: Autonomous Risk Assessment & Auto-Remediation
## Deployment & Operations Guide

**Version:** 1.0  
**Date:** 2026-07-26  
**Status:** Production Ready  

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Azure AD Configuration](#azure-ad-configuration)
4. [Deployment Checklist](#deployment-checklist)
5. [Configuration Guide](#configuration-guide)
6. [Auto-Fix Controls Reference](#auto-fix-controls-reference)
7. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
8. [Safety & Rollback](#safety--rollback)
9. [FAQ](#faq)

---

## Overview

Phase 7 implements autonomous risk assessment with optional auto-remediation:

- **Phase 7a:** Backend auto-fix agent with Graph API integration
- **Phase 7b:** Frontend UI for auto-remediation configuration (3 surfaces)
- **Phase 7c:** Production activation - approval-to-auto-fix wiring
- **Phase 7d:** Monitoring dashboard for real-time activity tracking

**Key Features:**
- Auto-detection of compliance drifts
- Automated remediation for 4 critical controls
- Admin approval workflow (optional)
- Complete audit trail via event bus
- Real-time monitoring dashboard
- Graceful error handling & rollback

---

## Prerequisites

### Required Permissions

Your Azure AD app registration needs these Graph API permissions:

**For Auto-Remediation:**
```
Policy.ReadWrite.ConditionalAccess
  └─ Required for legacy auth block & CA policy changes
  
Policy.ReadWrite.AuthenticationMethod
  └─ Required for MFA policy configuration
```

**For Drift Detection (already required):**
```
Policy.Read.ConditionalAccess
Policy.Read.AuthenticationMethod
SecurityEvent.Read.All
AuditLog.Read.All
Directory.Read.All
```

### Infrastructure Requirements

- Node.js 18+ (tested with v26.3.0)
- SQLite 3 for settings & audit persistence
- Backend server (localhost:3000 in dev, configure in production)
- Frontend dev server or static deployment (localhost:5173 in dev)
- Graph SDK: @microsoft/microsoft-graph-client 3.0+
- Better-sqlite3 for database operations

### Network & Access

- Access to Microsoft Graph endpoints (api.microsoft.com)
- Outbound HTTPS on port 443
- Backend-to-frontend communication (configure CORS)
- Event bus for agent coordination (in-process)

---

## Azure AD Configuration

### Step 1: Add Graph API Permissions to App Registration

1. **Navigate to Azure Portal**
   ```
   https://portal.azure.com
   → Azure Active Directory
   → App registrations
   → [Your M365 OpsAgent app]
   ```

2. **Add Permissions**
   ```
   API Permissions → Add a permission
   → Microsoft Graph
   → Application permissions
   ```

3. **Grant Permissions for Auto-Remediation**
   ```
   ✓ Policy.ReadWrite.ConditionalAccess
   ✓ Policy.ReadWrite.AuthenticationMethod
   ```

4. **Grant Admin Consent**
   ```
   Grant admin consent for [Tenant Name]
   ```

   ⚠️ **Important:** Admin consent is required for write permissions
   - Click "Grant admin consent"
   - Confirm in the consent prompt
   - Verify both permissions show "✓ Granted"

### Step 2: Verify Permissions

Run the validation check:
```bash
curl -X POST http://localhost:3000/api/setup/check-app-permissions \
  -H 'Content-Type: application/json' \
  -d '{"checkAutoFix": true}'
```

Expected response:
```json
{
  "success": true,
  "permissions": {
    "Policy.ReadWrite.ConditionalAccess": "✓ Present",
    "Policy.ReadWrite.AuthenticationMethod": "✓ Present"
  },
  "readyForAutoFix": true
}
```

### Step 3: Test Graph API Connectivity

```bash
# Test legacy auth policy creation (dry-run)
curl -X POST http://localhost:3000/api/tenantguard/auto-fix/test-connection \
  -H 'Content-Type: application/json' \
  -d '{"control": "Con-025"}'
```

---

## Deployment Checklist

### Pre-Deployment (Dev/Staging)

- [ ] Database initialized (SQLite tenantguard.db created)
- [ ] Backend starts without errors
  ```bash
  cd backend && node server.js
  ```
- [ ] Frontend loads and compiles
  ```bash
  npm run dev
  ```
- [ ] Health check passes
  ```bash
  curl http://localhost:3000/health
  ```
- [ ] Graph API connectivity verified
- [ ] Event bus initialized
  ```bash
  # Check backend logs for: "✅ Event bus initialized"
  ```
- [ ] AutoFixAgent initialized
  ```bash
  # Check backend logs for: "✅ Auto-Fix Agent initialized"
  ```

### Configuration

- [ ] Set environment variables
  ```bash
  # In backend/.env
  AZURE_TENANT_ID=<tenant-id>
  AZURE_CLIENT_ID=<client-id>
  AZURE_CLIENT_SECRET=<client-secret>
  ```

- [ ] Configure admin email
  ```bash
  # In settings or via API
  POST /api/tenantguard/settings/admin-email
  ```

- [ ] Enable auto-remediation (optional)
  ```bash
  # Via UI: TenantGuard → Settings → Auto-Remediation
  # Or API:
  curl -X POST http://localhost:3000/api/tenantguard/settings/remediation \
    -H 'Content-Type: application/json' \
    -d '{"enabled": true, "requiresApproval": true}'
  ```

### Testing

- [ ] Create test drift scenario
  - Manually disable a compliance policy in Azure AD
  - Run compliance validation
  - Verify drift detected
  - Check recommendation generated

- [ ] Test approval flow
  - Navigate to Zero Trust → Drifts
  - Open drift modal
  - Click "Approve" button
  - Verify toast message
  - Check auto-fix history

- [ ] Verify auto-fix execution
  - With auto-remediation disabled: approval only
  - With auto-remediation enabled: auto-fix triggered
  - Check /api/tenantguard/auto-fix/history for execution record

- [ ] Monitor for errors
  - Check backend logs for exceptions
  - Review event bus log via /api/tenantguard/agents/events
  - Verify no hung processes

### Production Deployment

- [ ] Deploy backend with production config
  - Use environment-specific secrets (Azure KeyVault, etc.)
  - Enable SSL/TLS for Graph API calls
  - Configure logging to persistent storage

- [ ] Deploy frontend
  - Build optimized bundle: `npm run build`
  - Serve via CDN or static server
  - Configure CORS for backend domain

- [ ] Initialize database
  - Run migration scripts if needed
  - Verify tenantguard.db created and accessible
  - Backup existing database

- [ ] Monitor initial operations
  - First 24 hours: check logs every hour
  - Watch auto-fix history dashboard
  - Alert on failure rate > 5%

- [ ] Enable gradual rollout
  - Day 1: Monitoring only (auto-fix disabled)
  - Day 2: Approval required (requiresApproval = true)
  - Day 3+: Full auto-remediation (requiresApproval = false)

---

## Configuration Guide

### Enable/Disable Auto-Remediation

**Via UI (Recommended):**
1. Open TenantGuard Settings page
2. Scroll to "Auto-Remediation" section
3. Toggle "Enable Auto-Remediation"
4. Toggle "Require Admin Approval Before Fixing"
5. Click "Save Remediation Settings"

**Via API:**
```bash
curl -X POST http://localhost:3000/api/tenantguard/settings/remediation \
  -H 'Content-Type: application/json' \
  -d '{
    "enabled": true,
    "requiresApproval": true
  }'
```

**Settings:**
- `enabled: true` — Auto-fix executes after approval
- `enabled: false` — Manual approval only, no auto-fix
- `requiresApproval: true` — Admin must approve before executing
- `requiresApproval: false` — Auto-fix runs immediately on drift

### Configure Auto-Fix Behavior

**Option 1: Approval Required (Recommended for Production)**
```json
{
  "enabled": true,
  "requiresApproval": true
}
```
- Drift detected → Recommendation created → Admin approves → Auto-fix executes
- Admin can review before fix is applied
- Audit trail shows approval step
- Can add notes/context during approval

**Option 2: Immediate Auto-Fix (Use with Caution)**
```json
{
  "enabled": true,
  "requiresApproval": false
}
```
- Drift detected → Auto-fix executes immediately
- No manual intervention needed
- Faster remediation but less control
- All executions logged for audit

**Option 3: Manual Only (Safe Default)**
```json
{
  "enabled": false,
  "requiresApproval": true
}
```
- Drift detected → Recommendation created
- Admin manually fixes in Azure AD
- No automatic changes
- Ideal for learning/testing phase

---

## Auto-Fix Controls Reference

### Supported Auto-Fix Controls

| Control ID | Control Name | Fix Action | Risk Level |
|-----------|--------------|-----------|-----------|
| **Con-025** | Legacy Auth Block | Create CA policy blocking legacy protocols | LOW |
| **Con-001** | Conditional Access | Enable disabled CA policies | LOW |
| **Con-003** | MFA Policy | Enable Microsoft Authenticator MFA | MEDIUM |
| **Security Defaults** | Security Defaults | Enable Azure AD security defaults | LOW |

### Legacy Auth Block (Con-025)

**Graph API Call:**
```
POST /beta/identity/conditionalAccess/policies

Body:
{
  "displayName": "[M365 OpsAgent] Block Legacy Authentication",
  "state": "enabled",
  "conditions": {
    "clientAppTypes": ["exchangeActiveSync", "other"],
    "applications": { "includeApplications": ["all"] },
    "users": { "includeUsers": ["all"] }
  },
  "grantControls": {
    "operator": "OR",
    "builtInControls": ["block"]
  }
}
```

**Effect:** Blocks SMTP, POP3, IMAP, and Exchange Web Services auth

**Rollback:** Delete policy via Azure AD portal

---

### Conditional Access Enable (Con-001)

**Graph API Call:**
```
PATCH /beta/identity/conditionalAccess/policies/{policyId}

Body:
{
  "state": "enabled"
}
```

**Effect:** Enables a previously disabled CA policy

**Rollback:** Disable policy via Azure AD portal

---

### MFA Policy (Con-003)

**Graph API Call:**
```
PATCH /policies/authenticationMethodsPolicy

Body:
{
  "microsoftAuthenticatorAuthenticationMethodConfiguration": {
    "state": "enabled"
  }
}
```

**Effect:** Enables Microsoft Authenticator for MFA sign-ins

**Rollback:** Disable via Azure AD → Authentication Methods

---

### Security Defaults (Security Defaults)

**Graph API Call:**
```
PATCH /policies/identitySecurityDefaultsEnforcementPolicy

Body:
{
  "isEnabled": true
}
```

**Effect:** Enables baseline security for all users

**Rollback:** Disable via Azure AD → Security Defaults

---

## Monitoring & Troubleshooting

### Real-Time Monitoring

**Dashboard:** Open TenantGuard → Settings → Auto-Fix Activity Monitoring

Displays:
- Total executed count
- Success rate percentage
- Failure count
- Last execution time
- Recent executions table (last 50)

**Auto-Refresh:** Updates every 10 seconds automatically

### API Endpoints for Monitoring

**Get Auto-Fix History:**
```bash
curl http://localhost:3000/api/tenantguard/auto-fix/history
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "evt_...",
      "controlId": "Con-025",
      "driftId": "drift_...",
      "executed": true,
      "policyId": "ca_policy_id",
      "triggeredBy": "admin@contoso.com",
      "timestamp": "2026-07-26T10:30:45.123Z"
    }
  ]
}
```

**Get Remediation Settings:**
```bash
curl http://localhost:3000/api/tenantguard/settings/remediation
```

**Get Compliance Drifts:**
```bash
curl http://localhost:3000/api/tenantguard/compliance/drifts
```

### Common Issues & Solutions

#### Issue: "Auto-fix triggered but policy not created in Azure AD"

**Causes:**
1. Missing Graph API permissions
2. Policy already exists with same name
3. Network/connectivity issue

**Solution:**
1. Verify permissions granted in Azure AD
2. Check backend logs: `tail -f backend.log | grep -i "error"`
3. Verify connectivity: `curl https://graph.microsoft.com/v1.0/me`
4. Check tenant isn't in restricted mode

#### Issue: "Settings not persisting (always reset to default)"

**Cause:** SQLite database not initialized or permissions issue

**Solution:**
1. Check database file exists:
   ```bash
   ls -la backend/tenantguard.db
   ```
2. Verify file permissions (writable):
   ```bash
   chmod 666 backend/tenantguard.db
   ```
3. Check backend logs for database errors
4. Reinitialize database (backup first):
   ```bash
   rm backend/tenantguard.db
   # Restart server to recreate
   ```

#### Issue: "Auto-refresh on dashboard not updating"

**Cause:** Polling stopped or API connection lost

**Solution:**
1. Check browser console for errors (F12)
2. Verify backend is running: `curl http://localhost:3000/health`
3. Check network tab for failed requests
4. Manually refresh dashboard with button (🔄 Refresh)

#### Issue: "Auto-fix execution shows "Failed" status"

**Cause:** 
1. Policy creation failed (already exists)
2. User doesn't have permissions to create policy
3. Tenant policy limits reached

**Solution:**
1. Check backend logs for specific error:
   ```bash
   grep "Failed to create" backend.log
   ```
2. Verify Azure AD permissions:
   ```bash
   # Try manual policy creation in Azure portal
   ```
3. Check policy limits:
   ```bash
   curl https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies | jq '.value | length'
   ```

---

## Safety & Rollback

### Built-In Safety Features

1. **Approval Workflow (Recommended)**
   - Set `requiresApproval: true`
   - Admin reviews drift & recommendation before fix
   - Can add context/notes during approval

2. **Event Bus Logging**
   - All auto-fix executions logged
   - Complete audit trail for compliance
   - Events queryable via `/api/tenantguard/auto-fix/history`

3. **Dry-Run Mode (Optional)**
   - Disable auto-fix (`enabled: false`)
   - Test drift detection & recommendations
   - No changes made to Azure AD

4. **Gradual Rollout**
   - Day 1: Approval required + monitoring only
   - Day 2: Approval required + auto-fix enabled
   - Day 3+: Full automation (if comfortable)

### Manual Rollback Procedure

**If Auto-Fix Causes Issues:**

1. **Immediately Disable Auto-Fix**
   ```bash
   curl -X POST http://localhost:3000/api/tenantguard/settings/remediation \
     -H 'Content-Type: application/json' \
     -d '{"enabled": false}'
   ```

2. **Identify Affected Policies**
   ```bash
   curl http://localhost:3000/api/tenantguard/auto-fix/history | \
     jq '.data[] | select(.timestamp > "2026-07-26T10:00:00") | .policyId'
   ```

3. **Delete Problematic Policies in Azure AD**
   - Go to Azure AD → Conditional Access
   - Find policies created by "[M365 OpsAgent]"
   - Delete problematic ones
   - Or disable if needed later

4. **Review Event Log**
   ```bash
   curl http://localhost:3000/api/tenantguard/auto-fix/history | jq '.data | .[0:10]'
   ```

5. **Re-Enable with Approval Required**
   ```bash
   curl -X POST http://localhost:3000/api/tenantguard/settings/remediation \
     -H 'Content-Type: application/json' \
     -d '{"enabled": true, "requiresApproval": true}'
   ```

---

## FAQ

**Q: Can I test auto-fix without making changes to Azure AD?**  
A: Yes! Disable auto-fix (`enabled: false`) to test drift detection & recommendations only.

**Q: What if the policy already exists (duplicate)?**  
A: Graph API returns error, auto-fix marked as failed, logged to event bus. No changes made.

**Q: How do I know if auto-fix succeeded?**  
A: Check dashboard (Auto-Fix Activity Monitoring) or query `/api/tenantguard/auto-fix/history`. Successful executions show green ✅ badge.

**Q: Can I rollback an auto-fix if it causes issues?**  
A: Yes. Manually delete the policy in Azure AD or use the rollback procedure above.

**Q: What permissions does the app need?**  
A: Minimum: `Policy.ReadWrite.ConditionalAccess` + `Policy.ReadWrite.AuthenticationMethod` for auto-fix. Plus drift detection permissions.

**Q: Is there a limit on how many policies can be auto-created?**  
A: Azure AD typically allows 10,000+ CA policies. Practical limit is ~100 before performance impact.

**Q: Can I auto-fix multiple controls at once?**  
A: Yes. Each drift/recommendation is independent. Dashboard shows aggregate stats.

**Q: How long does auto-fix take?**  
A: Typically 1-3 seconds per policy creation via Graph API. Network latency is the main factor.

**Q: What happens if the backend crashes during auto-fix?**  
A: Azure AD changes are atomic (all-or-nothing per policy). Dashboard won't update until backend recovers.

**Q: Can I integrate with incident management (PagerDuty, etc.)?**  
A: Yes. Use the event bus (`/api/tenantguard/agents/events`) to trigger webhooks on auto-fix failures.

**Q: How do I audit who approved which auto-fixes?**  
A: Check auto-fix history (`/api/tenantguard/auto-fix/history`). Each execution logs `triggeredBy` email.

---

## Support & Further Reading

- **Issue Tracker:** Report issues in GitHub
- **Logs Location:** `backend.log`, browser console (F12)
- **Graph API Docs:** https://learn.microsoft.com/en-us/graph/
- **Azure AD Best Practices:** https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/
- **Conditional Access Guide:** https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/

---

**Last Updated:** 2026-07-26  
**Maintained By:** M365 OpsAgent Team
