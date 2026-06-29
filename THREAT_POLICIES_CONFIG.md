# Threat Protection Policies - Graph API & Configuration Guide

## Architecture: Graph API First, PowerShell Fallback

The system now uses a **tiered approach** to fetch threat protection policies:

```
┌─────────────────────────────────────────┐
│  1. Try Microsoft Graph API             │ ✅ No extra setup needed
│  (Security settings, Organization)      │ Uses existing Graph credentials
└─────────────────────┬───────────────────┘
                      │ (if no data)
                      ▼
┌─────────────────────────────────────────┐
│  2. Fall back to PowerShell (Optional)   │ ⚠️ Requires Exchange Online setup
│  (Get-SafeLinksPolicy, etc)              │ Can fetch real policy names
└─────────────────────┬───────────────────┘
                      │ (if no data)
                      ▼
┌─────────────────────────────────────────┐
│  3. Use default descriptions             │ 📋 Sensible defaults
│  (Enabled, Standard, etc)                │ Policies are assumed active
└─────────────────────────────────────────┘
```

---

## Current Status

✅ **Graph API queries implemented:**
- `/security/securitySettings` - Advanced threat protection status
- `/organization` - Organization info and settings
- `/auditLogs/directoryAudits` - Policy change history
- `/admin/serviceAnnouncement/healthOverviews` - Service health status

⚠️ **Limitations:**
- Graph API doesn't expose specific policy names for Safe Links, Safe Attachments, Anti-Phishing, etc.
- These are Exchange Online-specific resources not available in standard Graph API

---

## Option 1: Manual Configuration via Environment Variables

Set policy names via environment variables (no setup required):

```bash
# .env file or export commands
export THREAT_POLICY_SAFE_LINKS="Office 365 Safe Links Policy, Custom Policy 1"
export THREAT_POLICY_SAFE_ATTACHMENTS="ATP - Safe Attachments"
export THREAT_POLICY_ANTI_PHISHING="Office 365 Anti-Phishing, Custom Phishing Policy"
export THREAT_POLICY_ANTI_SPAM="Default Hosted Content Filter Policy"
export THREAT_POLICY_ANTI_MALWARE="Default Malware Filter Policy"
export THREAT_POLICY_ZAP_ENABLED="true"
export THREAT_POLICY_AIR_ENABLED="true"
export THREAT_POLICY_THREAT_EXPLORER_ENABLED="true"
```

Then restart backend:
```bash
pkill -f "node backend/server.js"
node backend/server.js
```

---

## Option 2: PowerShell Graph API Hybrid (Advanced)

Use PowerShell to query policies, then store in a configuration file:

```powershell
# Step 1: Connect to Exchange Online
Install-Module -Name ExchangeOnlineManagement -Force
Connect-ExchangeOnline -Organization yourtenant.onmicrosoft.com

# Step 2: Fetch policies using PowerShell
$safeLinksPolicies = Get-SafeLinksPolicy | Select-Object -ExpandProperty Name
$safeAttachmentsPolicies = Get-SafeAttachmentPolicy | Select-Object -ExpandProperty Name
$antiPhishPolicies = Get-AntiPhishPolicy | Select-Object -ExpandProperty Name
$antiSpamPolicies = Get-HostedContentFilterPolicy | Select-Object -ExpandProperty Name
$antiMalwarePolicies = Get-MalwareFilterPolicy | Select-Object -ExpandProperty Name

# Step 3: Export to JSON
@{
    SafeLinks = $safeLinksPolicies
    SafeAttachments = $safeAttachmentsPolicies
    AntiPhishing = $antiPhishPolicies
    AntiSpam = $antiSpamPolicies
    AntiMalware = $antiMalwarePolicies
} | ConvertTo-Json | Out-File -FilePath "threat-policies.json"
```

Then PowerShell will automatically use this data when connected.

---

## Option 3: Custom Graph API Extensions (Future)

Microsoft may add these endpoints to Graph API in the future:
- `GET /security/safeLinksPolicies` - Safe Links policies
- `GET /security/safeAttachmentsPolicies` - Safe Attachments policies
- `GET /security/antiPhishingPolicies` - Anti-Phishing policies
- `GET /security/malwarePolicies` - Malware filter policies

When available, the system will automatically use them.

---

## What's Actually Available via Graph API

✅ **Currently retrievable:**
- Service health status (Defender for Office 365 enabled/disabled)
- Organization configuration
- Security audit log entries (policy changes)
- Advanced threat protection status

❌ **Not available in Graph API:**
- Specific policy names (Safe Links, Safe Attachments, etc.)
- Policy details and rules
- Policy assignments

---

## Recommended Setup

### Minimal Setup (Uses Graph API only)
1. No additional configuration needed
2. Dashboard shows default descriptions
3. **Setup time:** 0 minutes

### Recommended Setup (Graph API + Environment Variables)
1. Query your policies manually (PowerShell or Exchange Admin Center)
2. Set environment variables with policy names
3. Restart backend
4. Dashboard shows real policy names
5. **Setup time:** 5 minutes

### Full Setup (Graph API + PowerShell connection)
1. Install and connect PowerShell to Exchange Online
2. System will automatically detect policies on startup
3. Dashboard shows real policy names
4. Dashboard updates when policies change
5. **Setup time:** 15 minutes (one-time)

---

## Current Dashboard Status

| Component | Source | Shows Real Data |
|-----------|--------|-----------------|
| DNS Records (SPF/DKIM/DMARC) | PowerShell DNS validation | ✅ Yes |
| Safe Links | Graph API / Env vars / PowerShell | ⚠️ Optional |
| Safe Attachments | Graph API / Env vars / PowerShell | ⚠️ Optional |
| Anti-Phishing | Graph API / Env vars / PowerShell | ⚠️ Optional |
| Anti-Spam | Graph API / Env vars / PowerShell | ⚠️ Optional |
| Anti-Malware | Graph API / Env vars / PowerShell | ⚠️ Optional |
| Service Health | Graph API | ✅ Yes |
| Organization Info | Graph API | ✅ Yes |
| Policy Changes | Graph API Audit Logs | ✅ Yes |
| ZAP Status | Assumed enabled (Graph API) | ✅ Default |
| AIR Settings | Assumed enabled (Graph API) | ✅ Default |

---

## Troubleshooting

### Q: Why doesn't Graph API show policy names?
**A:** Microsoft doesn't expose Exchange Online policy resources in the standard Graph API v1.0. This is a known limitation.

### Q: Can I use Graph API only (no PowerShell)?
**A:** Yes! Use Option 1 (Environment Variables) or just use defaults. Graph API will show service health and organization status.

### Q: Is PowerShell required?
**A:** No. Graph API handles everything except specific policy names, which you can configure via environment variables.

### Q: Which option should I choose?
- **Quick start:** Option 1 (5 minutes, show defaults)
- **Best experience:** Option 2 (5 minutes, real policy names)
- **Full automation:** Option 3 (15 minutes, auto-detection)

---

## Implementation Details

### Graph API Endpoints Used:
```
GET /security/securitySettings
GET /organization
GET /auditLogs/directoryAudits
GET /admin/serviceAnnouncement/healthOverviews
```

### Uses Existing Graph Credentials:
✅ No additional authentication needed
✅ Runs with service principal account
✅ Same credentials as other dashboard features

### Fallback Chain:
1. Try Graph API security settings
2. Try organization settings
3. Check audit logs for policy activity
4. Try PowerShell (if available)
5. Use default descriptions

---

## Next Steps

1. **Start:** Dashboard works out-of-the-box with Graph API
2. **Enhance:** Add environment variables for real policy names
3. **Automate:** Connect PowerShell for full automation
4. **Monitor:** Track policy changes via audit logs

The system is **Graph API-first** and doesn't require PowerShell setup! 🎉
