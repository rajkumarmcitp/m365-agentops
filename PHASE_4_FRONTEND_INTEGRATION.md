# Phase 4: Frontend Integration with Backend API

**Goal:** Replace simulated data with real Microsoft 365 data from backend  
**Timeline:** 1-2 days  
**Complexity:** Medium  
**Cost:** No additional cost (uses existing backend)

---

## Overview

The frontend currently displays **simulated data**. Phase 4 replaces this with **real M365 data** fetched from the backend API.

```
Frontend (SPA) → Backend API → Microsoft Graph API → Real M365 Data
```

---

## Architecture

Frontend already has API client ready at `/lib/api-client.js`:
- `getDevices()` → `/api/devices`
- `getUsers()` → `/api/users`
- `getApplications()` → `/api/applications`
- `getSecurityScore()` → `/api/security/score`
- And more...

---

## Step 1: Update Intune Page (Start Here)

The Intune page is the best starting point because:
1. Data structure is straightforward
2. Already has simulated data to replace
3. Good test case before updating other pages

### 1.1 Update `/pages/intune.js`

Replace simulated data fetch with real API calls.

**Key changes:**
1. Import API client
2. Fetch real data in `initIntune()`
3. Pass real data to render function
4. Handle loading/error states

### 1.2 Example: Update Device Inventory Section

**Before (simulated):**
```javascript
const DEVICE_INVENTORY = [
  { name: "DEVICE-001", type: "Windows", ... },
  { name: "DEVICE-002", type: "macOS", ... },
  ...
]
```

**After (real API):**
```javascript
import { getDevices } from '../lib/api-client.js'

export async function initIntune() {
  const el = document.getElementById('page-intune')
  if (!el) return

  el.innerHTML = '<div style="padding:20px"><div class="spinner"></div> Loading real device data...</div>'

  // Fetch real data
  const devicesResult = await getDevices()
  
  if (!devicesResult.success) {
    el.innerHTML = `<div class="alert danger">Error loading devices: ${devicesResult.error}</div>`
    return
  }

  const devices = devicesResult.data || []
  render(el, { devices })
}
```

---

## Step 2: Update Other Pages

After Intune works, update in this order:

### Security Page
- `/api/security/score` → Secure Score
- `/api/identity/risky-users` → Risky users
- `/api/threat-assessment` → Email threats

### Applications Page
- `/api/applications` → App registrations
- `/api/service-principals` → Enterprise apps

### Dashboard
- `/api/devices` → Device count
- `/api/users` → User count
- `/api/security/score` → Secure Score card

---

## Step 3: Handle Errors & Loading States

### Loading State
```javascript
el.innerHTML = `
  <div style="padding:20px;text-align:center">
    <div class="spinner"></div>
    <p>Loading real M365 data...</p>
  </div>
`
```

### Error State
```javascript
if (!result.success) {
  el.innerHTML = `
    <div class="alert danger">
      <strong>Error loading data:</strong> ${result.error}
      <div style="font-size:10px;margin-top:8px;color:var(--color-text-tertiary)">
        Tip: Check browser console (F12) for details. Backend may need Graph API permissions.
      </div>
    </div>
  `
  return
}
```

### Fallback to Simulated Data (Optional)
```javascript
const data = result.success ? result.data : SIMULATED_DATA
```

---

## Step 4: Test Each Change

After updating each page:

1. **Visit frontend:** https://proud-river-0f55f1e10.7.azurestaticapps.net
2. **Login** with Entra ID (or demo user)
3. **Check browser console (F12)** for API calls
4. **Verify data loads** (or error message appears)

---

## Step 5: Build & Deploy

```bash
npm run build --cache /tmp/npm-cache
git add -A
git commit -m "feat: integrate frontend with backend API

- Update Intune page to fetch real device data
- Update Security page to fetch real security data
- Update Applications page to fetch real app data
- Add loading and error states
- Keep fallback to simulated data if API fails"
git push origin main
```

Azure Static Web Apps auto-deploys. Wait 3-5 minutes.

---

## Step 6: Verify Live Integration

Test in production:

```bash
# Check health
curl "https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/health"

# Check if you can get devices (may fail if permissions not granted)
curl "https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/devices"
```

---

## Handling Permission Errors

If you see `"Insufficient privileges"` errors:

1. **Grant Admin Consent in Entra ID:**
   - Azure Portal → App registrations → M365 AgentOps
   - API permissions → Grant admin consent

2. **Or Request Tenant Admin Approval:**
   - The app asks for permissions on first use
   - Tenant admin must approve

3. **Check Logs:**
   - Browser console (F12) → Network tab
   - Azure backend logs

---

## Frontend-Backend Data Flow

```
User clicks "Intune" page
    ↓
initIntune() runs
    ↓
getDevices() called → POST to /api/devices
    ↓
Backend receives request
    ↓
Backend calls Microsoft Graph API
    ↓
Graph API returns real device list
    ↓
Backend returns to frontend
    ↓
Frontend renders real data
    ↓
User sees real M365 devices ✅
```

---

## API Endpoints Ready

All these endpoints are available on the backend:

| Endpoint | Returns | Purpose |
|----------|---------|---------|
| `/api/health` | Status | Health check |
| `/api/devices` | Intune devices | Device inventory |
| `/api/users` | Directory users | User list |
| `/api/applications` | App registrations | Entra apps |
| `/api/service-principals` | Enterprise apps | App instances |
| `/api/security/score` | Secure Score | Security KPI |
| `/api/identity/risky-users` | Risky users | Identity risk |
| `/api/threat-assessment` | Threats | Email threats |
| `/api/device-compliance-policies` | Policies | Compliance rules |

---

## Common Issues

| Issue | Solution |
|-------|----------|
| **"Insufficient privileges"** | Admin needs to grant API permissions in Entra ID |
| **CORS error** | Backend CORS is configured correctly; check backend logs |
| **No data returned** | Tenant may not have data for that resource (normal) |
| **Frontend shows loading forever** | Check backend URL is correct in vite.config.js |
| **API works locally but not in Azure** | Check frontend API_BASE URL points to Azure backend |

---

## Success Criteria

Phase 4 is complete when:

- ✅ At least one page (Intune) shows real M365 data
- ✅ Loading states display while fetching
- ✅ Errors are handled gracefully
- ✅ Frontend → Backend → Graph API → Real data flow works
- ✅ No console errors (besides permission errors from Graph API)

---

## Next After Phase 4

Once real data flows through:

1. **Phase 5 (Optional):** Add database caching layer
2. **Phase 6 (Optional):** Implement advanced filtering/search
3. **Phase 7 (Optional):** Add automated remediation workflows

For now, Phase 4 is the final required phase.

---

## Files to Modify

- `/pages/intune.js` - START HERE
- `/pages/security.js`
- `/pages/applications.js`
- `/pages/dashboard.js`
- `/vite.config.js` - ensure API_BASE is correct
- `.env.example` - document backend URL

---

## Checklist

- [ ] Start with Intune page
- [ ] Import API client
- [ ] Fetch real data in initIntune()
- [ ] Add loading state
- [ ] Add error handling
- [ ] Test locally (npm run dev)
- [ ] Build (npm run build)
- [ ] Commit and push
- [ ] Wait for Azure deployment (3-5 mins)
- [ ] Test in production
- [ ] Move to Security page
- [ ] Move to Applications page
- [ ] Verify all pages working

---

## Timeline

**Day 1:**
- Intune page working with real data
- Security page updated
- Applications page updated

**Day 2:**
- Dashboard updated
- All other pages integrated
- Comprehensive testing
- Final verification

