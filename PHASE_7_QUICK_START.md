# Phase 7: Quick Start Guide
## 5-Minute Setup for Auto-Remediation

**For:** Operators & Admins  
**Time:** ~5 minutes  
**Difficulty:** Beginner  

---

## Prerequisites

✓ M365 OpsAgent deployed  
✓ Backend running (localhost:3000)  
✓ Frontend accessible (localhost:5173)  
✓ Azure AD app with Graph API permissions  

---

## 1-Minute Test (No Changes to Azure AD)

```bash
# 1. Check auto-fix agent is ready
curl http://localhost:3000/health

# 2. View current settings
curl http://localhost:3000/api/tenantguard/settings/remediation

# 3. Check if any auto-fixes have run
curl http://localhost:3000/api/tenantguard/auto-fix/history | jq '.data | length'
```

Expected: All return success ✅

---

## Enable Auto-Remediation (Approval Required)

**Recommended:** Start here for safety

```bash
# Enable auto-fix with approval requirement
curl -X POST http://localhost:3000/api/tenantguard/settings/remediation \
  -H 'Content-Type: application/json' \
  -d '{"enabled": true, "requiresApproval": true}'

# Verify enabled
curl http://localhost:3000/api/tenantguard/settings/remediation | jq .
```

**Or via UI:**
1. Open TenantGuard Settings page
2. Find "Auto-Remediation" section
3. ✓ Enable Auto-Remediation
4. ✓ Keep "Require Admin Approval" checked
5. Click "Save Remediation Settings"

---

## View Auto-Fix Activity

**Dashboard (Real-Time):**
1. TenantGuard → Settings
2. Scroll to "⚡ Auto-Fix Activity Monitoring"
3. View stats & recent executions
4. Auto-refreshes every 10 seconds

**Via API:**
```bash
curl http://localhost:3000/api/tenantguard/auto-fix/history | jq '.data | .[] | {controlId, executed, timestamp}'
```

---

## Test Approval Workflow

**Step-by-Step:**

1. **In Zero Trust page:**
   - Click "Drifts" tab
   - Click a drift row to open modal

2. **In Drift Modal:**
   - Review recommendation
   - Verify button shows: "⚡ Approve + Auto-Fix"
   - Click button

3. **Confirm:**
   - Toast shows: "⚡ Auto-fix will be applied shortly"
   - Check Auto-Fix Activity dashboard
   - Should see new execution with ✅ Success

---

## Disable Auto-Remediation (Safe Mode)

```bash
# Disable auto-fix (approval only)
curl -X POST http://localhost:3000/api/tenantguard/settings/remediation \
  -H 'Content-Type: application/json' \
  -d '{"enabled": false}'
```

Now approvals won't trigger auto-fixes.

---

## Emergency: Disable Everything

```bash
# If auto-fix is causing issues:
curl -X POST http://localhost:3000/api/tenantguard/settings/remediation \
  -H 'Content-Type: application/json' \
  -d '{"enabled": false, "requiresApproval": true}'
```

Then manually delete problematic policies in Azure AD if needed.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Settings not saving | Check database: `ls backend/tenantguard.db` |
| Auto-fix not executing | Verify Graph API permissions in Azure AD |
| Dashboard not updating | Refresh page or wait 10 seconds |
| Policy not created | Check Azure AD has space for new CA policies |

---

## What Auto-Fix Controls

| Control | Action |
|---------|--------|
| Con-025 | Block legacy auth |
| Con-001 | Enable disabled CA policies |
| Con-003 | Enable MFA authenticator |
| Security Defaults | Enable Azure AD security defaults |

---

## Safety Features Built-In

✅ **Approval Workflow:** Admin must click "Approve"  
✅ **Audit Trail:** All changes logged  
✅ **Dry-Run Mode:** Test without changes  
✅ **Graceful Errors:** Failures don't break approval  
✅ **Easy Rollback:** Delete policies in Azure AD  

---

## Key Difference: With vs Without Auto-Remediation

### Without (`enabled: false`)
```
Drift → Recommendation → Admin Approves → END (Manual fix in Azure AD)
```

### With (`enabled: true`, `requiresApproval: true`)
```
Drift → Recommendation → Admin Approves → Auto-Fix Applied → Event Logged
```

### With (`enabled: true`, `requiresApproval: false`)
```
Drift → Recommendation → Admin Approves → IMMEDIATE Auto-Fix
```

---

## Recommended Rollout

**Day 1:** `enabled: false`  
- Monitor drift detection & recommendations
- Test UI & approval workflow
- No Azure AD changes

**Day 2:** `enabled: true, requiresApproval: true`  
- Admin approves recommended fixes
- Each approval triggers auto-fix
- Watch for success/failures

**Day 3+:** `enabled: true, requiresApproval: false` (Optional)  
- Immediate auto-fix on approval
- Only if Day 2 was smooth
- Faster remediation

---

## Support Resources

📖 **Full Deployment Guide:** `PHASE_7_DEPLOYMENT.md`  
🧪 **Testing Guide:** `PHASE_7_TESTING.md`  
📞 **Issues:** Check backend logs: `tail backend.log`  
🔗 **Graph API Docs:** https://learn.microsoft.com/en-us/graph  

---

## 30-Second Summary

1. ✅ Enable auto-remediation: `curl ... -d '{"enabled": true, "requiresApproval": true}'`
2. ✅ Create a drift: Modify Azure AD policy
3. ✅ Approve: Click "⚡ Approve + Auto-Fix" in UI
4. ✅ Verify: Check dashboard or `/api/tenantguard/auto-fix/history`

That's it! 🎉

---

**Need help?** See PHASE_7_DEPLOYMENT.md → FAQ section
