# Configuration System Guide

## Overview

This project uses an environment-specific configuration system to separate **local development** settings (demo data) from **production** settings (real data). This prevents accidental overwrites of production fixes when deploying new features.

## Directory Structure

```
config/
├── index.js              # Main config loader (do not edit)
├── base.js               # Shared base configuration
├── development.js        # Development environment config
├── production.js         # Production environment config
├── hotfixes.js          # Production hotfixes & workarounds
.env.development.example  # Dev environment variables template
.env.production.example   # Prod environment variables template
```

## How It Works

### 1. **Local Development (Demo Mode)**

When you run locally:

```bash
npm run dev
```

The app loads:
- **Config:** `development.js` (demo data, demo API calls)
- **API Base:** `http://localhost:3000` (local backend)
- **Mode:** Demo mode enabled
- **Logging:** Debug level (verbose output)

Your local code **never interferes** with production because:
- Local dev uses demo data
- Production uses real data + environment variables
- Hotfixes are only applied to production

### 2. **Production Deployment**

When deployed to production:

```bash
npm run build  # Builds for production
```

The app loads:
- **Config:** `production.js` (with environment variable overrides)
- **API Base:** Real Azure backend URL
- **Mode:** Production mode (real data)
- **Hotfixes:** Applied from environment variables

## Configuration Usage

### Using CONFIG in Your Code

```javascript
import { CONFIG, isFeatureEnabled, isProdMode } from '../app.js'

// Get API base URL
const apiUrl = CONFIG.apiBase

// Check if feature is enabled
if (isFeatureEnabled('tenantGuard')) {
  // Load TenantGuard
}

// Check environment
if (isProdMode()) {
  // Production-specific code
} else {
  // Development code
}

// Get service-specific config
const dashboardConfig = CONFIG.services.dashboard
const refreshInterval = dashboardConfig.refreshInterval
```

### Conditional Features

```javascript
// pages/dashboard.js
import { isFeatureEnabled } from '../app.js'

export function initDashboard() {
  if (!isFeatureEnabled('dashboard')) {
    console.log('Dashboard is disabled (hotfix)')
    return
  }
  // Load dashboard normally
}
```

### API Configuration

```javascript
// lib/api-client.js
import { CONFIG } from '../app.js'

export const api = CONFIG.apiBase
export const API_TIMEOUT = CONFIG.apiTimeout

// This respects both production config AND hotfixes
const response = await fetch(`${api}/endpoint`, {
  timeout: API_TIMEOUT
})
```

## Environment Variables

### Development

Create `.env.development` from `.env.development.example`:

```bash
cp .env.development.example .env.development
```

This file is **local only** (not committed to git). Use for:
- Local backend URL
- Local API keys (if any)
- Feature toggles for local testing

### Production

Create `.env.production` on your production server using `.env.production.example` as reference:

```bash
# On Azure App Service, set these in Configuration > Application Settings
VITE_API_BASE=https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net
VITE_MSAL_CLIENT_ID=your-real-client-id
VITE_SHAREPOINT_SITE=/sites/M365AgentOps
```

**Never commit `.env.production` to git!** Use:
- GitHub Secrets (for GitHub Actions)
- Azure Key Vault (for Azure App Service)
- Environment variables in your deployment pipeline

## Production Hotfixes

### Problem: Production Issue Found

You discover a bug in production that needs immediate fixing:

```
Local Dev                Production
├─ Old code            ├─ Old code
├─ New feature X       ├─ Manual hotfix (not in local dev)
                       └─ Real data
       ↓ PUBLISH ↓
Hotfix is LOST! ❌
```

### Solution: Use Environment Variables

Instead of editing production files directly, set environment variables:

```bash
# On production server (Azure App Service Configuration)
VITE_HOTFIX_SKIP_ALERTS=true
VITE_HOTFIX_REDUCE_TIMEOUT=true
VITE_HOTFIX_API_TIMEOUT=15000
```

Your code checks these:

```javascript
// pages/tenantguard.js
import { HOTFIXES } from '../config/hotfixes.js'

if (HOTFIXES.skipTenantGuardAlerts) {
  console.log('⚠️ TenantGuard alerts disabled (hotfix)')
  // Skip alert loading
  return
}
```

When you deploy new code, the environment variables stay intact! ✅

### Available Hotfixes

```bash
# Skip TenantGuard alerts
VITE_HOTFIX_SKIP_ALERTS=true

# Reduce API timeout (milliseconds)
VITE_HOTFIX_REDUCE_TIMEOUT=true
VITE_HOTFIX_API_TIMEOUT=15000

# Disable specific features
VITE_HOTFIX_DISABLE_FEATURES=tenantguard,security

# Override dashboard refresh interval
VITE_HOTFIX_DASHBOARD_REFRESH=120000

# Disable entire pages
VITE_HOTFIX_DISABLE_SECURITY=true
VITE_HOTFIX_DISABLE_M365CONFIG=true
VITE_HOTFIX_DISABLE_CHANGEINTEL=true
```

## Debugging Configuration

### Check Current Configuration

In browser console:

```javascript
// View full configuration
window.__APP_CONFIG__

// Check if feature is enabled
window.__CONFIG_HELPERS__.isFeatureEnabled('tenantGuard')

// Get hotfix status
window.__CONFIG_HELPERS__.getHotfixStatus()

// Returns:
{
  active: ["skipTenantGuardAlerts", "reduceApiTimeout"],
  count: 2,
  details: { ... }
}
```

### Development Mode

```javascript
// Check if in development
window.__CONFIG_HELPERS__.isDevMode()  // true

// Check if in production
window.__CONFIG_HELPERS__.isProdMode()  // false
```

## Deployment Checklist

### Before Deploying to Production

- [ ] New feature is working in local dev
- [ ] No hardcoded production fixes in code
- [ ] All hotfixes are via environment variables
- [ ] `.env.production` is NOT in git commit
- [ ] Environment variables set on production server
- [ ] Test in staging first (if available)

### When Production Issue is Found

- [ ] **DON'T** edit production files directly
- [ ] **DO** set environment variable: `VITE_HOTFIX_*=true`
- [ ] Document why hotfix is needed
- [ ] Develop permanent fix in local dev
- [ ] Deploy fixed code
- [ ] Remove hotfix environment variable

### After Permanent Fix is Deployed

```bash
# On production server, remove the hotfix env var
# (via Azure Portal or deployment configuration)
VITE_HOTFIX_SKIP_ALERTS=  # Remove or set to false

# Or disable specific hotfix
VITE_HOTFIX_SKIP_ALERTS=false
```

## Best Practices

### ✅ DO

- Use environment variables for production changes
- Keep local dev with demo data
- Commit only code changes, never environment variables
- Document hotfixes with reasons and dates
- Test in local dev before deploying
- Use feature flags for gradual rollouts

### ❌ DON'T

- Edit production files directly
- Commit `.env.production` to git
- Hardcode production-specific code
- Deploy without testing locally first
- Leave hotfixes enabled permanently
- Make manual changes that aren't tracked

## Examples

### Example 1: TenantGuard Performance Issue

**Problem:** TenantGuard alerts are slow, timing out in production.

**Local Dev (no change needed):**
```javascript
// Continues working with demo data
```

**Production Fix:**
```bash
# Set on production server
VITE_HOTFIX_SKIP_ALERTS=true
VITE_HOTFIX_REDUCE_TIMEOUT=true
VITE_HOTFIX_API_TIMEOUT=15000
```

**Code handles it:**
```javascript
// lib/hotfixes.js automatically reads env vars
if (HOTFIXES.skipTenantGuardAlerts) {
  // Skip alert loading
}
```

**Later - Permanent Fix:**
```bash
# In local dev, optimize alert loading
# ... development and testing ...

# Deploy optimized code
npm run build && npm run deploy:prod

# Remove hotfix (alerts are now fast)
VITE_HOTFIX_SKIP_ALERTS=false
```

### Example 2: Dashboard Refresh Too Frequent

**Production Issue:**
Dashboard refresh every 5 seconds is overloading API.

**Quick Fix:**
```bash
# Set on production
VITE_HOTFIX_DASHBOARD_REFRESH=300000  # 5 minutes instead of 5 seconds
```

**Permanent Fix:**
```javascript
// In local dev, make refresh interval configurable
// ... development ...

// Deploy configuration change
npm run build && npm run deploy:prod

// Remove hotfix - now using new default
VITE_HOTFIX_DASHBOARD_REFRESH=  # Remove
```

## Troubleshooting

### Configuration Not Loading

Check browser console:

```javascript
window.__APP_CONFIG__  // Should show config object
```

If undefined, clear cache and reload:
```bash
Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### Hotfixes Not Working

Verify environment variable is set:

```bash
# On production server, check if variable is set
echo $VITE_HOTFIX_SKIP_ALERTS
```

Hotfixes load on page load, so changes require browser refresh.

### Wrong API Base URL

Check which environment is loaded:

```javascript
window.__APP_CONFIG__.apiBase
window.__APP_CONFIG__.useDemo  // true = dev mode, false = prod mode
```

Ensure correct environment variables are set on production server.

## Support

For questions about the config system:

1. Check this guide
2. View browser console: `window.__APP_CONFIG__`
3. Review hotfix status: `window.__CONFIG_HELPERS__.getHotfixStatus()`
4. Check config files in `/config` directory
