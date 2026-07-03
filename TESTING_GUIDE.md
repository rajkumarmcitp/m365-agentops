# Setup Wizard Testing Guide

## Overview
This guide explains how to safely test the M365 AgentOps Setup Wizard without affecting your production configuration.

## Testing Strategies

### Strategy 1: **TEST MODE (Recommended for Non-Prod Tenants)**

Use test mode to save all data to separate SharePoint lists without affecting production.

#### Setup Test Mode

**1. Create Test SharePoint Lists**
```
In your SharePoint site, create these test lists:
- Setup-Configuration-TEST (copy from Setup-Configuration schema)
- Requests-TEST
- Audit-TEST
- Correlations-TEST
```

**2. Enable Test Mode in Environment**
```bash
# .env.local (development)
VITE_TEST_MODE=true

# Or set at runtime
export VITE_TEST_MODE=true
npm run dev
```

**3. Start Dev Server with Test Mode**
```bash
VITE_TEST_MODE=true npm run dev
```

**4. What Happens in Test Mode**
- Yellow banner appears: "TEST MODE ENABLED"
- All data saves to `*-TEST` lists in SharePoint
- No production data is modified
- You can safely re-run tests multiple times

---

### Strategy 2: **Separate Test Tenant (For Production-Like Testing)**

If you have access to a test Azure AD tenant:

#### Setup
```
1. Create NEW Azure AD app registration in test tenant
   - Name: "M365 AgentOps - TEST"
   - Copy Client ID, Secret, Tenant ID
   
2. Create NEW SharePoint site in test tenant
   - URL: /sites/M365AgentOps-Test
   - Copy Site ID

3. Run on separate port
   - PORT=3001 npm run dev
   - or PORT=3001 npm run build && node backend/server.js
```

#### Environment Variables
```bash
# .env.test
AZURE_CLIENT_ID=<test-app-client-id>
AZURE_CLIENT_SECRET=<test-app-secret>
AZURE_TENANT_ID=<test-tenant-id>
SHAREPOINT_SITE_ID=<test-site-id>
TEST_MODE=true
PORT=3001
```

---

### Strategy 3: **Browser Console Testing (Quick Validation)**

Test individual steps without full setup:

```javascript
// In browser DevTools Console (F12)

// Test Step 1 validation
console.log('Testing Step 1...')
window.setWizardStep(1)

// Test Step 2 - SSO Connection
window.testSsoConnection()

// Test Step 3 - Graph API
window.testGraphConnection()

// Test Step 4 - Admin Settings Save
window.saveAdminSettingsStep()

// Test Step 5 - Verification
window.runVerification()

// Check wizard state
console.log(wizardState)
```

---

## Complete Testing Checklist

### Pre-Test Setup
- [ ] Choose testing strategy (TEST MODE recommended)
- [ ] If using test lists: Create all TEST lists in SharePoint
- [ ] If using test tenant: Setup app registration and SharePoint site
- [ ] Set environment variables appropriately
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to http://localhost:5173/setup-wizard

### Step 1: Azure AD Registration
- [ ] Banner shows correctly (with TEST MODE indicator if enabled)
- [ ] Step 1 of 5 indicator visible
- [ ] Title, subtitle, and color scheme correct
- [ ] Info cards display properly
- [ ] Redirect URI input accepts text
- [ ] Validation prevents empty input (optional field)
- [ ] Can navigate to Step 2
- [ ] Data persists in SharePoint or sessionStorage

**Test Data:**
```
Redirect URI: https://yourdomain.com/auth/callback
```

### Step 2: SSO Configuration
- [ ] Step 2 of 5 indicator correct
- [ ] Purple color scheme applied
- [ ] Info card shows correctly
- [ ] Client ID field accepts UUID format
- [ ] Client Secret field is type="password"
- [ ] Tenant ID field accepts UUID
- [ ] "Test Connection" button works
  - Success: Green checkmark with organization name
  - Failure: Red error message
- [ ] Role mapping shows 4 roles (super, admin, manager, user)
- [ ] Role group inputs work
- [ ] Can navigate to Step 3
- [ ] Data saves to test SharePoint

**Test Data:**
```
Client ID: 12345678-1234-1234-1234-123456789012
Client Secret: your-test-secret-key-here
Tenant ID: 87654321-4321-4321-4321-210987654321
Role Mappings:
  - super: M365AgentOps-Supers
  - admin: M365AgentOps-Admins
  - manager: M365AgentOps-Managers
  - user: M365AgentOps-Users
```

### Step 3: Graph API Setup
- [ ] Step 3 of 5 indicator correct
- [ ] Teal color scheme applied (#00796B)
- [ ] Top card shows "40 Required Permissions" with emoji
- [ ] Permissions display in 2-column grid
- [ ] Each permission shows name and type (Application/Delegated)
- [ ] Admin Consent button visible with purple styling
- [ ] Numbered instructions 1-7 display correctly
- [ ] Each instruction has numbered circle badge
- [ ] Test Graph API button works
- [ ] Can navigate to Step 4
- [ ] Data saves properly

**Test Behavior:**
```
1. Click "Login & Grant Admin Consent"
   - Popup opens (close it or let it auto-close)
2. Check result message (success or error)
3. Click "Test Graph API Connection"
   - Should show success if permissions verified
4. Click "Complete Step 3 → Step 4"
```

### Step 4: Admin Settings
- [ ] Step 4 of 5 indicator correct
- [ ] Orange color scheme applied (#E65100)
- [ ] Info card shows correctly
- [ ] Role hierarchy section shows 4 roles with colors
- [ ] Admin email input accepts email format
- [ ] 2FA, Audit Logs, Notifications checkboxes work
- [ ] Can toggle each setting
- [ ] Continue button works
- [ ] Data saves to test SharePoint
- [ ] Can navigate to Step 5

**Test Data:**
```
Admin Email: admin@yourdomain.com
2FA: checked
Audit Logging: checked
Email Notifications: checked
```

### Step 5: Verification
- [ ] Step 5 of 5 indicator correct
- [ ] Green color scheme applied (#2E7D32)
- [ ] 5 verification items display
- [ ] "Run Verification Tests" button visible
- [ ] Tests run sequentially with loading animation
- [ ] Each test shows result (pending → success/failure)
- [ ] Completion summary shows "Setup Complete! 🎉"
- [ ] Next steps are listed

**Verification Tests Should Pass:**
- [ ] Azure AD Connection ✓
- [ ] SSO Configuration ✓
- [ ] Graph API Permissions ✓
- [ ] Role Configuration ✓
- [ ] Email Configuration ✓

---

## Manual Testing Commands

### Test with TEST MODE enabled
```bash
# Terminal 1: Start dev server in test mode
VITE_TEST_MODE=true npm run dev

# Terminal 2: Start backend (if needed)
cd backend
npm run dev
```

### Test with Production Environment
```bash
# Use your actual production environment variables
npm run dev

# Navigate carefully through each step
# Do NOT complete unless you're ready to deploy
```

### Reset Test Data
```bash
# Delete test lists in SharePoint and recreate them
# Or just clear the list items via SharePoint UI

# In browser console, clear local state
sessionStorage.clear()
localStorage.clear()
```

---

## Expected Results

### ✅ Success Indicators
- [x] Test MODE banner shows (if enabled)
- [x] All 5 steps display with correct colors
- [x] Form data persists between steps
- [x] Buttons are clickable and functional
- [x] Error messages appear for invalid inputs
- [x] Test Graph API and SSO connections work
- [x] Data saves to test SharePoint lists (not production)
- [x] Verification tests all pass
- [x] Completion shows congratulations message

### ❌ Failure Indicators
- [ ] Missing step indicators
- [ ] Wrong colors for each step
- [ ] Data doesn't persist between steps
- [ ] Connection tests fail (check API URL and credentials)
- [ ] Data saves to production lists (check TEST_MODE is enabled)
- [ ] Buttons don't respond
- [ ] Cannot navigate between steps

---

## Troubleshooting

### Test Mode Banner Not Showing
```bash
# Check environment variable
echo $VITE_TEST_MODE

# Should output: true
# If not set, run:
export VITE_TEST_MODE=true
npm run dev
```

### Connection Tests Failing
```bash
# Check backend is running
curl http://localhost:3000/api/health

# Check environment variables
env | grep AZURE
env | grep SHAREPOINT

# Check API URL in setup-wizard.js
console.log(API_URL)  // Should be http://localhost:3000
```

### Data Not Persisting
```javascript
// In console, check wizard state
console.log(wizardState.formData)

// Check browser storage
console.log(sessionStorage)
console.log(localStorage)

// Check network tab - look for POST requests to /api/setup/save-step
```

### SharePoint List Not Found
```bash
# Verify test list exists in SharePoint
# Check list names match exactly:
# - Setup-Configuration-TEST (for TEST_MODE)
# - Setup-Configuration (for production)

# Check Site ID is correct
env | grep SHAREPOINT_SITE_ID
```

---

## Production Deployment Testing

When ready to test in production:

1. **Do NOT use TEST_MODE** in production
2. **Use separate Azure AD app** if possible
3. **Create backup** of current Setup-Configuration list
4. **Test on copy of app** first
5. **Have rollback plan** (restore from backup)

```bash
# Production deployment
npm run build

# Start with environment variables pointing to production
# but different app registration
AZURE_CLIENT_ID=<prod-app-client-id> \
AZURE_CLIENT_SECRET=<prod-app-secret> \
npm run dev

# DO NOT commit TEST_MODE=true to production
```

---

## Summary

| Strategy | Best For | Risk | Effort |
|----------|----------|------|--------|
| TEST MODE | Non-prod testing | 🟢 None | 🟢 Low |
| Test Tenant | Prod-like testing | 🟡 Low | 🟡 Medium |
| Console Testing | Quick validation | 🟢 None | 🟢 Low |
| Production | Live deployment | 🔴 High | 🔴 High |

**Recommendation:** Start with **TEST MODE** in non-production tenant, then move to **Test Tenant** for production-like testing.
