# Real Threat Protection Policy Fetching

## Current Status
The Email Security tab now attempts to fetch **real threat protection policy names** from your tenant using PowerShell.

## What's Being Fetched
The system tries to retrieve actual configured policies from Exchange Online:
- ✅ Safe Links Policies (real policy names)
- ✅ Safe Attachments Policies (real policy names)
- ✅ Anti-Phishing Policies (real policy names)
- ✅ Anti-Malware Policies (real policy names)
- ✅ Anti-Spam Policies (real policy names)

## Setup Required

### Step 1: Connect PowerShell to Exchange Online
```powershell
# Install Exchange Online Management module (if not already installed)
Install-Module -Name ExchangeOnlineManagement -Force -AllowClobber

# Connect to your tenant
Connect-ExchangeOnline -Organization yourtenant.onmicrosoft.com
```

### Step 2: Verify Policies Are Visible
Once connected, you should see output like:
```powershell
# Check Safe Links Policies
Get-SafeLinksPolicy | Select-Object Name

# Check Safe Attachments Policies
Get-SafeAttachmentPolicy | Select-Object Name

# Check Anti-Phishing Policies
Get-AntiPhishPolicy | Select-Object Name

# Check Anti-Spam Policies
Get-HostedContentFilterPolicy | Select-Object Name
```

### Step 3: Restart Backend
After connecting to Exchange Online, restart the backend server:
```bash
pkill -f "node backend/server.js"
node backend/server.js
```

### Step 4: Refresh Browser
Navigate to Security > Email tab and refresh the page. You should now see:
- **Real policy names** instead of generic descriptions
- **Policy counts** for each threat protection type
- **Actual configuration status**

---

## Example Output (After Setup)

### Organization Email Security Policies

**Email Authentication**
- SPF Record: Pass
- DKIM Signing: Pass
- DMARC Policy: Pass

**Threat Protection**
- 🔗 Safe Links: **Office 365 Safe Links Policy, Custom Policy 1** (2 policies)
- 📎 Safe Attachments: **ATP - Safe Attachments** (1 policy)
- 🎣 Anti-Phishing: **Office 365 Anti-Phishing, Custom Phishing Policy** (2 policies)
- 📤 Anti-Spam: **Default Hosted Outbound Spam Filter Policy** (1 policy)
- 🦠 Anti-Malware: **Default Malware Filter Policy** (1 policy)
- ⚡ Zero-hour Auto Purge: Enabled
- ⚠️ Threat Policies: Strict Preset Security Policy
- 🔍 Threat Explorer: Available in Microsoft 365 E5
- 🤖 Automated Investigation: AIR enabled for threats
- ⚙️ AIR Settings: Auto-remediation: Full
- 📋 Email Policies: External sharing policies configured

---

## Troubleshooting

### PowerShell Commands Not Found
**Error:** "The term 'Get-SafeLinksPolicy' is not recognized"

**Fix:** Make sure you've connected to Exchange Online:
```powershell
Connect-ExchangeOnline -Organization yourtenant.onmicrosoft.com
```

### Permission Denied
**Error:** "You don't have permission to run this cmdlet"

**Fix:** Ensure your account has one of these roles:
- Global Admin
- Exchange Admin
- Security Admin
- Compliance Admin

### No Policies Returned
This is normal if you haven't created custom policies. The default built-in policies will still be shown:
- Default Malware Filter Policy
- Default Hosted Content Filter Policy (Anti-Spam)
- Default Anti-Phishing Policy
- Default Safe Attachments Policy
- Default Safe Links Policy

---

## Data Source

| Component | Source | Real Data |
|-----------|--------|-----------|
| DNS Records (SPF/DKIM/DMARC) | PowerShell DNS validation | ✅ Yes |
| Safe Links Policy Names | Exchange Online PowerShell | ✅ Yes (after setup) |
| Safe Attachments Policy Names | Exchange Online PowerShell | ✅ Yes (after setup) |
| Anti-Phishing Policy Names | Exchange Online PowerShell | ✅ Yes (after setup) |
| Anti-Spam Policy Names | Exchange Online PowerShell | ✅ Yes (after setup) |
| Anti-Malware Policy Names | Exchange Online PowerShell | ✅ Yes (after setup) |
| ZAP Status | Default (Enabled) | ⚠️ Default |
| Threat Explorer | Organization status | ✅ Graph API |
| AIR Settings | Default (Full remediation) | ⚠️ Default |

---

## Next Steps

1. **Connect PowerShell** - Follow setup steps above
2. **Restart Backend** - Server will automatically detect and fetch policies
3. **Verify in UI** - Check Security > Email tab for real policy names
4. **Monitor** - Policies are fetched on each page load (not cached)

Once set up, the dashboard will show your actual tenant configuration instead of defaults!
