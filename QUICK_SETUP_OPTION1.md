# Quick Setup: Environment Variables (Option 1)

## Show Real Threat Policy Names in 5 Minutes ⚡

### Step 1: Get Your Policy Names (2 min)

Open **Exchange Admin Center** or **Microsoft 365 Defender**:

1. Go to **Policies & rules** → **Threat policies**
2. Look for:
   - **Safe Links policies** (note the names)
   - **Safe Attachments policies** (note the names)
   - **Anti-phishing policies** (note the names)
   - **Anti-spam policies** (note the names)
   - **Anti-malware policies** (note the names)

Example names:
- Safe Links: "Office 365 Safe Links Policy", "Custom Policy 1"
- Safe Attachments: "ATP - Safe Attachments"
- Anti-Phishing: "Office 365 Anti-Phishing", "Custom Phishing Policy"
- Anti-Spam: "Default Hosted Content Filter Policy"
- Anti-Malware: "Default Malware Filter Policy"

---

### Step 2: Set Environment Variables (2 min)

#### Option A: Using .env file (Easiest)

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and update policy names:
```bash
THREAT_POLICY_SAFE_LINKS=Office 365 Safe Links Policy
THREAT_POLICY_SAFE_ATTACHMENTS=ATP - Safe Attachments
THREAT_POLICY_ANTI_PHISHING=Office 365 Anti-Phishing
THREAT_POLICY_ANTI_SPAM=Default Hosted Content Filter Policy
THREAT_POLICY_ANTI_MALWARE=Default Malware Filter Policy
THREAT_POLICY_ZAP_ENABLED=true
THREAT_POLICY_AIR_ENABLED=true
THREAT_POLICY_THREAT_EXPLORER_ENABLED=true
```

#### Option B: Using shell environment (macOS/Linux)

```bash
export THREAT_POLICY_SAFE_LINKS="Office 365 Safe Links Policy"
export THREAT_POLICY_SAFE_ATTACHMENTS="ATP - Safe Attachments"
export THREAT_POLICY_ANTI_PHISHING="Office 365 Anti-Phishing"
export THREAT_POLICY_ANTI_SPAM="Default Hosted Content Filter Policy"
export THREAT_POLICY_ANTI_MALWARE="Default Malware Filter Policy"
export THREAT_POLICY_ZAP_ENABLED="true"
export THREAT_POLICY_AIR_ENABLED="true"
export THREAT_POLICY_THREAT_EXPLORER_ENABLED="true"
```

#### Option C: Using Windows PowerShell

```powershell
$env:THREAT_POLICY_SAFE_LINKS = "Office 365 Safe Links Policy"
$env:THREAT_POLICY_SAFE_ATTACHMENTS = "ATP - Safe Attachments"
$env:THREAT_POLICY_ANTI_PHISHING = "Office 365 Anti-Phishing"
$env:THREAT_POLICY_ANTI_SPAM = "Default Hosted Content Filter Policy"
$env:THREAT_POLICY_ANTI_MALWARE = "Default Malware Filter Policy"
$env:THREAT_POLICY_ZAP_ENABLED = "true"
$env:THREAT_POLICY_AIR_ENABLED = "true"
$env:THREAT_POLICY_THREAT_EXPLORER_ENABLED = "true"
```

---

### Step 3: Restart Backend (1 min)

```bash
# Stop the backend
pkill -f "node backend/server.js"

# Restart (environment variables will be loaded)
node backend/server.js
```

---

### Step 4: Verify (Done! ✅)

1. Open browser: http://localhost:5173
2. Navigate to **Security > Email** tab
3. Check **Organization Email Security Policies** section
4. You should now see your real policy names instead of defaults!

---

## Example Results

### Before (Default Descriptions):
```
🔗 Safe Links
   Enabled for all users

📎 Safe Attachments
   Enabled for all users

🎣 Anti-Phishing
   Standard protection enabled
```

### After (Real Policy Names):
```
🔗 Safe Links
   Office 365 Safe Links Policy

📎 Safe Attachments
   ATP - Safe Attachments

🎣 Anti-Phishing
   Office 365 Anti-Phishing, Custom Phishing Policy
```

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `THREAT_POLICY_SAFE_LINKS` | Safe Links policy names | "Office 365 Safe Links Policy" |
| `THREAT_POLICY_SAFE_ATTACHMENTS` | Safe Attachments policy names | "ATP - Safe Attachments" |
| `THREAT_POLICY_ANTI_PHISHING` | Anti-Phishing policy names | "Office 365 Anti-Phishing" |
| `THREAT_POLICY_ANTI_SPAM` | Anti-Spam policy names | "Default Hosted Content Filter" |
| `THREAT_POLICY_ANTI_MALWARE` | Anti-Malware policy names | "Default Malware Filter Policy" |
| `THREAT_POLICY_ZAP_ENABLED` | Zero-hour Auto Purge status | "true" or "false" |
| `THREAT_POLICY_AIR_ENABLED` | Automated Investigation status | "true" or "false" |
| `THREAT_POLICY_THREAT_EXPLORER_ENABLED` | Threat Explorer availability | "true" or "false" |

---

## Multiple Policies

If you have multiple policies, separate them with commas:

```bash
THREAT_POLICY_SAFE_LINKS="Office 365 Safe Links Policy, Custom Policy 1, Custom Policy 2"
THREAT_POLICY_ANTI_PHISHING="Built-in Protection, Custom Phishing Policy"
```

---

## Troubleshooting

### Q: Environment variables not being loaded?
**A:** Make sure you:
1. Restart the backend after setting env vars
2. Use the correct variable names (case-sensitive on Linux/macOS)
3. If using .env file, make sure it's in the project root directory

### Q: Changes not showing in browser?
**A:** 
1. Refresh the page (Cmd/Ctrl + R)
2. Hard refresh to clear cache (Cmd/Ctrl + Shift + R)
3. Check backend logs: `tail -f /tmp/backend.log`

### Q: How do I find policy names?
**A:** Log in to Exchange Admin Center or Microsoft 365 Defender → Policies & rules → Threat policies → Copy the policy names

### Q: Can I use just one policy name?
**A:** Yes! Each env var can be a single policy or multiple separated by commas

---

## What Happens Without Env Vars?

The system will:
1. ✅ Try to fetch from Graph API (service health, audit logs)
2. ✅ Fall back to PowerShell if connected
3. ✅ Use sensible defaults ("Enabled", "Standard", etc.)

**The dashboard works out-of-the-box** - env vars just make it show real policy names! 🎉

---

## Done! 🚀

Your dashboard now shows real threat protection policy names from your tenant!

**What's configured:**
- ✅ DNS validation (SPF/DKIM/DMARC) - Real checks
- ✅ Service health - From Graph API
- ✅ Policy names - From environment variables
- ✅ Domain list - All your tenant domains

Navigate to **Security > Email** to see the complete picture!
