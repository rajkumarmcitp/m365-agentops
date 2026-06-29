# PowerShell Setup for Real Defender for Office 365 Threat Data

The Email Security tab now fetches real threat data from Defender for Office 365 using PowerShell. Follow these steps to configure it.

## Prerequisites

1. **PowerShell Core (7.x+)** - Required for cross-platform support
2. **Exchange Online Management Module** - For Exchange/Defender cmdlets
3. **Defender for Office 365 License** - P1 or P2 for threat data
4. **Admin Permissions** - Global Admin or Security Admin role

## Setup Steps

### Step 1: Install PowerShell Core

**macOS (Homebrew):**
```bash
brew install powershell
```

**Windows:**
```powershell
winget install Microsoft.PowerShell
```

**Linux:**
```bash
sudo apt-get install powershell
```

Verify installation:
```bash
pwsh --version
```

### Step 2: Install Exchange Online Management Module

Open PowerShell Core and run:
```powershell
pwsh
Install-Module -Name ExchangeOnlineManagement -Force -AllowClobber
```

Verify installation:
```powershell
Get-Module ExchangeOnlineManagement -ListAvailable
```

### Step 3: Connect to Exchange Online

Open PowerShell and run:
```powershell
pwsh
Connect-ExchangeOnline -Organization yourtenant.onmicrosoft.com
```

You'll be prompted to:
1. Select authentication method (Modern Auth is recommended)
2. Sign in with Global Admin or Security Admin account
3. Accept the connection warning

### Step 4: Verify Defender Access

Test that you can fetch threat data:
```powershell
# Get mail traffic report
Get-MailTrafficTopReport -EventType MalwareDetected -EndDate (Get-Date).AddDays(-30)

# Get threat protection status
Get-HostedContentFilterPolicy -Identity Default

# Get malware filter status
Get-MalwareFilterPolicy -Identity Default
```

If these commands return data, PowerShell is properly configured!

### Step 5: Restart the Backend

After PowerShell is configured, restart the backend server:
```bash
# Stop current server
pkill -f "node.*server.js"

# Restart
node backend/server.js
```

## Verify Configuration

1. **Check backend logs** - Look for "✓ Fetched threat data from Defender"
2. **Test the endpoint**:
   ```bash
   curl http://localhost:3001/api/security/email | jq .data
   ```
3. **View in browser** - Navigate to Security > Email tab
4. **Check for real data** - Threat metrics should show actual values (not 0)

## Troubleshooting

### PowerShell Connection Error
```
Error: "The term 'Get-MailTrafficTopReport' is not recognized"
```
**Fix:** Make sure you've connected to Exchange Online and the module is loaded:
```powershell
Connect-ExchangeOnline -Organization yourtenant.onmicrosoft.com
Import-Module ExchangeOnlineManagement
```

### Permission Denied
```
Error: "Insufficient permissions to perform this operation"
```
**Fix:** Make sure your account has:
- Global Admin, or
- Security Admin, or
- Exchange Admin role

### No Defender Data Available
```
Result: "malwareDetected: 0, phishingDetected: 0"
```
**Possible Causes:**
- No threats detected in the last 30 days (normal)
- Defender license not active on tenant
- Insufficient query permissions

**Solution:** Contact your Exchange/Defender admin to verify:
- License is active
- Your account has appropriate permissions
- Threat protection is enabled

## Commands Used

The backend executes these PowerShell commands to fetch data:

| Command | Purpose |
|---------|---------|
| `Get-MailTrafficTopReport` | Threat statistics |
| `Get-HostedContentFilterPolicy` | Anti-spam settings |
| `Get-MalwareFilterPolicy` | Anti-malware settings |
| `Get-TransportRule` | Mail flow rules |
| `Get-Mailbox` | Forwarding rules |
| `Get-AdvancedPhishingReport` | Defender threat data |

## Security Notes

- PowerShell commands run with the backend's process permissions
- No credentials are stored - connection must be active
- Commands are read-only (no modifications to settings)
- All output is converted to JSON for security

## Data Refresh

Threat data is fetched on-demand when you visit the Email Security tab. Data is typically updated hourly in the Defender backend.

## Support

If PowerShell is not available or you prefer not to configure it:
- Set environment variable: `SKIP_POWERSHELL=true`
- Email tab will show demo data instead
- All other tabs will continue using Graph API

## Next Steps

Once configured:
1. Real threat metrics will display automatically
2. Refresh the browser to see live data
3. Check logs for "✓ Fetched threat data from Defender"
4. Verify external forwarding rules and policy status

