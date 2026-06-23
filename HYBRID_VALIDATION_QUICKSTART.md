# Hybrid Validation System - Quick Start Guide

## 5-Minute Setup

### 1. Backend is Ready
The backend automatically initializes with default configuration on first run:
- Default method: **Hybrid** (Graph API with PowerShell fallback)
- Timeout: 30 seconds per control
- Retries: 3 attempts with exponential backoff
- Config saved to: `backend/validation-config.json`

### 2. Access Settings Page
Navigate to the new validation settings admin page:
```
http://localhost:3000/validation-settings
```

### 3. Choose Your Validation Method

**Option A: Graph API Only (Recommended Default)**
- ✅ Fastest execution
- ✅ No additional setup
- ✅ Most reliable
- ❌ Fails if Graph API is unavailable
```
Radio: Select "Graph API"
Save Settings
```

**Option B: PowerShell Only**
- ✅ Works when Graph API is unavailable
- ❌ Requires PowerShell modules installed
- ❌ Slower execution (500-2000ms per control)
```
Prerequisites:
1. Install PowerShell modules:
   - Microsoft.Graph
   - ExchangeOnlineManagement
   - MicrosoftTeams
   - Az.Accounts

2. In settings page:
   - Radio: Select "PowerShell"
   - Check: "Enable PowerShell validation"
   - Click: "Save Settings"
```

**Option C: Hybrid (Recommended for Resilience)**
- ✅ Fast (uses Graph API)
- ✅ Resilient (fallback to PowerShell)
- ✅ Automatic failover
- ℹ Requires PowerShell installed for fallback
```
1. In settings page:
   - Radio: Select "Hybrid (Recommended)"
   - Optionally check: "Enable PowerShell validation"
   - Click: "Save Settings"

2. System will:
   - Try Graph API first (fast)
   - If it fails, try PowerShell (fallback)
   - Report which method was used
```

## Using the Settings Page

### Basic Settings
```
1. Validation Method
   ○ Graph API         (Microsoft Graph API - fastest)
   ○ PowerShell        (PowerShell cmdlets - slower)
   ○ Hybrid            (API first, PS fallback)

2. PowerShell Configuration
   ☑ Enable PowerShell validation
   (Required modules listed)

3. Performance Settings
   Timeout per Control: 30000 ms
   Retry Attempts: 3
```

### Advanced Features

**View Validation Summary**
After running CIS validation, see:
- Number of controls via Graph API
- Number of controls via PowerShell
- Number of fallback validations
- Average execution time

**Custom Per-Control Methods**
Set specific controls to use different methods:
- Control 1.1.1 → Graph API only
- Control 2.1.1 → Hybrid
- Control 3.1.1 → PowerShell only

## Testing Your Configuration

### Test 1: Verify Graph API Works
```bash
# Run CIS validation
curl http://localhost:3000/api/cis/validation

# Check response includes:
# - validationMethodSummary
# - graphAPIControls count
```

### Test 2: Check Validation Metadata
```bash
# Get details of each control validation
curl http://localhost:3000/api/validation/metadata

# Look for:
# - validationMethod: "graphAPI" | "powershell" | "fallback"
# - executionTime in ms
# - fallbackUsed: true/false
```

### Test 3: Get Validation Summary
```bash
# Get quick overview
curl http://localhost:3000/api/validation/summary

# Response shows:
# {
#   "graphAPIControls": 160,
#   "powerShellControls": 0,
#   "fallbackControls": 0,
#   "totalExecutionTime": 45000,
#   "averageExecutionTime": 281
# }
```

### Test 4: Set Control to PowerShell
```bash
# Make control 1.1.1 use PowerShell
curl -X POST http://localhost:3000/api/config/validation-methods/1.1.1 \
  -H "Content-Type: application/json" \
  -d '{"method":"powershell"}'

# Response: { success: true, message: "Control 1.1.1 validation method set to powershell" }
```

## Integration with CIS Validation Dashboard

The validation method badges now appear:
- In control lists (small badge: G/P/F)
- In control details modal (full badge with icon)
- In validation reports (method breakdown)

### Display in Code
```javascript
import { ValidationMethodBadge } from './components/validation-method-badge.js'

// In control display
<ValidationMethodBadge
  validationMethod={control.validationMethod}
  fallbackUsed={control.fallbackUsed}
  small={true}
/>
```

## API Quick Reference

### Get Current Settings
```bash
GET /api/config/validation-settings
```

### Update Global Method
```bash
POST /api/config/validation-settings
{
  "validationMethod": "hybrid",
  "timeout": 30000,
  "retryAttempts": 3,
  "enablePowerShell": false
}
```

### Set Control Method
```bash
POST /api/config/validation-methods/:controlId
{"method": "powershell"}

DELETE /api/config/validation-methods/:controlId
```

### Get Validation Data
```bash
GET /api/validation/summary
GET /api/validation/metadata
```

### Reset to Defaults
```bash
POST /api/config/validation-reset
```

## Troubleshooting

### Problem: "PowerShell validation disabled"
**Solution**: 
1. Go to settings page
2. Check "Enable PowerShell validation"
3. Click "Save Settings"

### Problem: Too many fallbacks
**Solution**:
1. Check Graph API is working: `GET /api/config/validation-settings`
2. Verify authentication credentials
3. Increase timeout: Set to 45000ms
4. Check network connectivity

### Problem: Validation running slowly
**Solution**:
1. Default is Graph API (fast)
2. If using PowerShell: this is expected (slow startup)
3. Check: Are you in hybrid mode unnecessarily?
4. Try: Switch to Graph API only

### Problem: Settings not saving
**Solution**:
1. Check backend logs for errors
2. Verify backend has write permissions to `backend/` directory
3. Try: Reset to defaults first
4. Check: Is backend reachable? (`GET /api/health`)

## Performance Tips

### Fastest Configuration
```
Method: Graph API
PowerShell: Disabled
Retries: 1
Timeout: 20000ms
```
**Performance**: ~45 seconds for 160 controls

### Most Reliable Configuration
```
Method: Hybrid
PowerShell: Enabled
Retries: 3
Timeout: 30000ms
```
**Performance**: ~60 seconds (with Graph API fast path)

### PowerShell-Only (When Graph API Down)
```
Method: PowerShell
Retries: 2
Timeout: 60000ms
```
**Performance**: ~5+ minutes (slower startup)

## Next Steps

1. ✅ Run CIS validation with new settings
2. ✅ Check validation dashboard for method badges
3. ✅ View validation summary for statistics
4. ✅ Customize per-control methods if needed
5. ✅ Monitor fallback rate and adjust timeout
6. ✅ Export reports with validation method info

## Support

- **Settings Page**: `/validation-settings`
- **API Docs**: See HYBRID_VALIDATION_IMPLEMENTATION.md
- **Backend Logs**: Check for validation method messages
- **Control Details**: Click control to see validation method used

## Summary

✅ **Graph API** - Recommended default, fastest
✅ **Hybrid** - Recommended for resilience, automatic fallback
✅ **PowerShell** - Available for environments where Graph API is unavailable
✅ **Settings UI** - Easy configuration for admins
✅ **Metadata** - Full tracking of validation methods used
✅ **API Endpoints** - Complete programmatic control

Start with **Hybrid mode** for best results: fast execution with fallback safety.
