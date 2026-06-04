# Phase 2: Entra ID Authentication Setup

**Goal:** Replace hardcoded demo login with real Microsoft Entra ID (Azure AD) authentication  
**Timeline:** 2-3 days  
**Complexity:** Medium  
**Cost:** $0 (uses existing Azure subscription)

---

## Step 1: Register App in Entra ID (30 mins)

### 1.1 Go to Azure Portal

1. Visit **https://portal.azure.com**
2. Search for **"App registrations"** (top search bar)
3. Click **"New registration"**

### 1.2 Fill Registration Form

| Field | Value |
|-------|-------|
| **Name** | `M365 AgentOps` |
| **Supported account types** | `Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)` |
| **Redirect URI** | Web |
| **Redirect URI URL** | `https://proud-river-0f55f1e10.7.azurestaticapps.net/callback` |

Click **"Register"**

### 1.3 Note These Values (SAVE THEM!)

After registration, you'll see the Overview page. **Copy and save these:**

```
AZURE_TENANT_ID = [Directory (tenant) ID]
AZURE_CLIENT_ID = [Application (client) ID]
```

**Screenshot locations:**
- Find "Directory (tenant) ID" in the Overview section
- Find "Application (client) ID" in the Overview section

---

## Step 2: Create Client Secret (10 mins)

1. Go to **"Certificates & secrets"** (left menu)
2. Click **"New client secret"**
3. Fill in:
   - **Description:** `M365 AgentOps Frontend`
   - **Expires:** `12 months`
4. Click **"Add"**
5. **IMMEDIATELY copy the secret value** (you can only see it once!)

Save this as:
```
AZURE_CLIENT_SECRET = [the long secret value]
```

⚠️ **Important:** Never share this secret! Keep it safe.

---

## Step 3: Add API Permissions (15 mins)

1. Go to **"API permissions"** (left menu)
2. Click **"Add a permission"**
3. Choose **"Microsoft Graph"**
4. Select **"Delegated permissions"**

Add these permissions:
- `User.Read` (read user profile)
- `email` (get user email)
- `profile` (get user profile)
- `openid` (OpenID Connect)

5. Click **"Add permissions"**

### Grant Admin Consent

1. Back in API permissions
2. Click **"Grant admin consent for [your org]"** (if available)
3. Click **"Yes"**

---

## Step 4: Update App Settings in Azure Static Web Apps (10 mins)

Your redirect URIs registered in Entra ID:
- ✅ `https://proud-river-0f55f1e10.7.azurestaticapps.net/callback`
- Add another: `https://proud-river-0f55f1e10.7.azurestaticapps.net` (main page)

**In Azure Portal:**
1. Go to App registration → M365 AgentOps
2. **"Authentication"** (left menu)
3. Add redirect URI:
   - `https://proud-river-0f55f1e10.7.azurestaticapps.net`
4. **"Save"**

---

## Step 5: Implement MSAL in Frontend (1-2 hours)

### 5.1 Install MSAL.js

Add MSAL via CDN in `index.html`:

```html
<head>
  <!-- ... existing code ... -->
  <!-- Microsoft Authentication Library (MSAL) for JavaScript -->
  <script src="https://alcdn.msauth.net/browser/2.38.0/js/msal-browser.min.js"></script>
</head>
```

### 5.2 Create Auth Module

Create `/src/lib/auth.js`:

```javascript
// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: 'YOUR_AZURE_CLIENT_ID',  // Replace with your value from Step 1.3
    authority: 'https://login.microsoftonline.com/YOUR_AZURE_TENANT_ID', // Replace with your value from Step 1.3
    redirectUri: window.location.origin + '/callback'
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false
  },
  system: {
    allowNativeBroker: false
  }
};

// MSAL Scopes
const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read']
};

let msalInstance = null;

// Initialize MSAL
export async function initMSAL() {
  try {
    msalInstance = new window.msal.PublicClientApplication(msalConfig);
    await msalInstance.initialize();
    
    // Check if returning from redirect
    const response = await msalInstance.handleRedirectPromise();
    if (response) {
      console.log('Authenticated user:', response.account);
      return response.account;
    }
    
    // Check if already logged in
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      return accounts[0];
    }
    
    return null;
  } catch (error) {
    console.error('MSAL initialization error:', error);
    return null;
  }
}

// Login function
export async function loginWithMicrosoft() {
  try {
    if (!msalInstance) await initMSAL();
    
    const response = await msalInstance.loginPopup(loginRequest);
    console.log('Login successful:', response);
    return response.account;
  } catch (error) {
    if (error.errorCode === 'user_cancelled') {
      console.log('User cancelled login');
    } else {
      console.error('Login error:', error);
    }
    return null;
  }
}

// Get access token
export async function getAccessToken() {
  try {
    if (!msalInstance) await initMSAL();
    
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) return null;
    
    const tokenRequest = {
      scopes: ['https://graph.microsoft.com/.default'],
      account: accounts[0]
    };
    
    const response = await msalInstance.acquireTokenSilent(tokenRequest);
    return response.accessToken;
  } catch (error) {
    console.error('Token acquisition error:', error);
    return null;
  }
}

// Logout
export async function logout() {
  try {
    if (!msalInstance) return;
    
    const logoutRequest = {
      account: msalInstance.getAllAccounts()[0]
    };
    
    await msalInstance.logout(logoutRequest);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Get current user
export function getCurrentUser() {
  if (!msalInstance) return null;
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0 ? accounts[0] : null;
}

// Check if authenticated
export function isAuthenticated() {
  return getCurrentUser() !== null;
}
```

### 5.3 Update Login Screen in app.js

Replace the demo login with real Entra ID login.

Open `/app.js` and find the `renderLogin()` function:

```javascript
import { initMSAL, loginWithMicrosoft, isAuthenticated, getCurrentUser } from './lib/auth.js'

// ... in renderLogin() function, replace the entire login screen with:

async function renderLogin() {
  const app = document.getElementById('app')
  
  // Check if already authenticated
  const user = await initMSAL()
  if (user && isAuthenticated()) {
    // Auto-login if already authenticated
    doLoginWithEntraID(user)
    return
  }
  
  app.innerHTML = `
    <div id="login-screen">
      <div class="login-card">
        <div class="login-logo">
          <div class="login-logo-icon"><i class="ti ti-shield-bolt"></i></div>
          <div class="login-logo-text">
            <h1>M365 AgentOps</h1>
            <p>Enterprise Tenant Administration</p>
          </div>
        </div>
        <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:16px;">Sign in with your Microsoft account:</p>
        
        <button class="btn-ms" id="entra-login-btn" style="width:100%;margin-bottom:12px">
          <svg width="16" height="16" viewBox="0 0 21 21" fill="none"><rect width="10" height="10" fill="#F25022"/><rect x="11" width="10" height="10" fill="#7FBA00"/><rect y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
          Sign in with Microsoft Entra ID
        </button>
        
        <div class="login-divider">or demo</div>
        
        <p style="font-size:11px;color:var(--color-text-secondary);margin-bottom:12px;">Try demo mode with simulated data:</p>
        <div class="user-tiles" id="demo-users">
          <!-- Demo users will be added here for testing -->
        </div>
        
        <p style="text-align:center;font-size:10px;color:var(--color-text-tertiary);margin-top:12px;">
          <strong>Real Auth:</strong> Click "Sign in with Microsoft" to use your actual Office 365 account<br>
          <strong>Demo:</strong> Select a test user above to see simulated data
        </p>
      </div>
    </div>
  `
  
  // Real Entra ID login
  document.getElementById('entra-login-btn').addEventListener('click', async () => {
    const btn = document.getElementById('entra-login-btn')
    btn.innerHTML = '<span class="spinner" style="margin-right:8px"></span> Signing in...'
    btn.disabled = true
    
    const account = await loginWithMicrosoft()
    if (account) {
      doLoginWithEntraID(account)
    } else {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 21 21" fill="none"><rect width="10" height="10" fill="#F25022"/><rect x="11" width="10" height="10" fill="#7FBA00"/><rect y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
        Sign in with Microsoft Entra ID
      `
      btn.disabled = false
    }
  })
  
  // Demo login fallback (keep for testing)
  const demoUsersHtml = USERS.map(u => `
    <div class="user-tile" data-user="${u.id}">
      <div class="user-avatar" style="background:${u.color}">${u.initials}</div>
      <div class="user-tile-info">
        <h4>${u.name}</h4>
        <p>${u.email}</p>
        <p style="margin-top:3px"><span class="role-badge ${u.role}">${u.role}</span></p>
      </div>
    </div>
  `).join('')
  
  const demoUsersContainer = document.getElementById('demo-users')
  if (demoUsersContainer) demoUsersContainer.innerHTML = demoUsersHtml
  
  // Demo user tile clicks
  document.querySelectorAll('.user-tile').forEach(tile => {
    tile.addEventListener('click', () => doLogin(tile.dataset.user))
    tile.addEventListener('dblclick', () => doLogin(tile.dataset.user))
  })
}

// Handle Entra ID login
function doLoginWithEntraID(account) {
  // Create user object from Entra ID
  const entraUser = {
    id: account.localAccountId,
    name: account.name || account.username,
    email: account.username,
    role: 'admin', // Assign role based on your logic
    initials: (account.name || account.username).split(' ').map(n => n[0]).join('').toUpperCase(),
    color: '#0C447C',
    navAccess: [
      'dashboard', 'requests', 'security', 'zerotrust', 'privaccts',
      'm365config', 'licenses', 'agents', 'msgcenter', 'applications', 'intune',
      'portal', 'myreqs', 'chat',
      'audit', 'settings'
    ]
  }
  
  state.currentUser = entraUser
  renderShell()
  const defaultPage = entraUser.navAccess[0]
  go(defaultPage)
  showToast(`Welcome, ${entraUser.name}!`, 'success')
}
```

---

## Step 6: Update Configuration Variables (15 mins)

In `/lib/auth.js`, replace:
- `YOUR_AZURE_CLIENT_ID` → Your Client ID from Step 1.3
- `YOUR_AZURE_TENANT_ID` → Your Tenant ID from Step 1.3

**DO NOT hardcode the client secret in the frontend!** (We'll use it in Phase 3 backend)

---

## Step 7: Build and Deploy (10 mins)

```bash
npm run build --cache /tmp/npm-cache
git add -A
git commit -m "feat: add Entra ID authentication with MSAL"
git push origin main
```

Azure Static Web Apps auto-deploys (2-3 mins).

---

## Step 8: Test Real Authentication (15 mins)

1. Visit: **https://proud-river-0f55f1e10.7.azurestaticapps.net**
2. Click **"Sign in with Microsoft Entra ID"**
3. You'll be redirected to Microsoft login
4. Sign in with your **Office 365 account** (the one in your Azure tenant)
5. Grant permissions
6. You're logged in with **real data**! 🎉

---

## Troubleshooting

### "Redirect URI mismatch" error
- **Problem:** URL in browser doesn't match Entra ID registration
- **Fix:** In Azure Portal → App registration → Authentication
  - Add redirect URI: your actual Static Web Apps URL
  - Example: `https://proud-river-0f55f1e10.7.azurestaticapps.net/callback`

### "CORS error" or "blocked by browser"
- **Problem:** Cross-origin request blocked
- **Fix:** This is normal for MSAL → it uses auth tokens, not CORS
- **Check:** Browser DevTools (F12) → Console for actual error

### "AADSTS700016: Application not found in directory"
- **Problem:** Wrong Client ID or Tenant ID
- **Fix:** Double-check values from Step 1.3 in Azure Portal

### "Consent denied"
- **Problem:** User or admin blocked the app
- **Fix:** In Azure Portal → App registration → API permissions → Grant admin consent

---

## What's Next (Phase 3)

Once Phase 2 is working:
- ✅ Real Entra ID login works
- ❌ Backend API not created yet
- ❌ Still using simulated M365 data

**Phase 3:** Build Node.js backend to:
- Securely handle Graph API calls
- Fetch real device/security/app data
- Store tokens safely

---

## Summary Checklist

- [ ] Registered app in Entra ID
- [ ] Saved Tenant ID, Client ID, Client Secret
- [ ] Added API permissions (User.Read, etc.)
- [ ] Created `/lib/auth.js` with MSAL
- [ ] Updated `app.js` login screen
- [ ] Replaced Client ID and Tenant ID in auth.js
- [ ] Built and deployed
- [ ] Tested real Entra ID login
- [ ] ✅ Phase 2 Complete!

---

## Files Modified

| File | Changes |
|------|---------|
| `index.html` | Added MSAL.js CDN |
| `lib/auth.js` | New file - MSAL configuration |
| `app.js` | Updated renderLogin() and added doLoginWithEntraID() |
| `vite.config.js` | No changes |

**Total time:** 2-3 hours hands-on
