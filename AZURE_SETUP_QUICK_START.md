# Azure Static Web Apps - Quick Setup (5 minutes)

## Prerequisites
- Azure subscription (free trial works: https://azure.microsoft.com/en-us/free)
- GitHub account with this repo
- Already committed all changes to GitHub

## Step 1: Commit & Push to GitHub

```bash
cd /Users/vasanthipromoters/Documents/M365_OpsAgent/m365-agentops
git add -A
git commit -m "feat: add Azure deployment config and vite optimization"
git push origin main
```

## Step 2: Create Azure Static Web Apps (via Portal)

1. Go to **https://portal.azure.com**
2. Search for **"Static Web Apps"** (top search bar)
3. Click **"Create"**

### Fill in the form:

| Field | Value |
|-------|-------|
| **Subscription** | Your Azure subscription |
| **Resource Group** | Create new: `m365-agentops-rg` |
| **Name** | `m365ops` |
| **Plan type** | Free |
| **Region** | East US (or closest to you) |
| **Deployment details → Source** | GitHub |
| **GitHub org** | Your GitHub username |
| **Repository** | Select your m365-agentops repo |
| **Branch** | main |
| **Build Presets** | Custom |
| **App location** | . (dot) |
| **API location** | (leave blank) |
| **Output location** | dist |

4. Click **"Review + Create"** → **"Create"**
5. Wait 2-3 minutes for deployment

## Step 3: Get Your API Token

Once created:
1. Go to **"Settings"** in the Static Web Apps resource
2. Click **"Manage deployment token"**
3. Copy the token

## Step 4: Add GitHub Secret

1. Go to your GitHub repo
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: [paste the token from Step 3]
4. Click **"Add secret"**

## Step 5: Trigger Deployment

Push a change to trigger auto-deploy:

```bash
git add AZURE_SETUP_QUICK_START.md
git commit -m "docs: add Azure setup guide"
git push origin main
```

Watch deployment:
1. Go to GitHub repo → **Actions** tab
2. Watch the workflow run
3. Once complete, click the deployment link

## Step 6: Access Your Live App

After deployment succeeds, your app is live at:

```
https://m365ops.azurestaticapps.net
```

Or check the URL in:
- Azure Portal → Static Web Apps → m365ops → Overview → URL

## Verify It Works

1. Visit `https://m365ops.azurestaticapps.net`
2. You should see the login screen with 4 users
3. Click a user → login
4. See the dashboard with simulated data

✅ **Congratulations! Your app is live!**

---

## What's Next?

The app is now live with **simulated data**. To add real Microsoft 365 data:

1. **Phase 2:** Set up Entra ID authentication (2 days)
2. **Phase 3:** Create Node.js backend API (3 days)
3. **Phase 4:** Connect to real Graph API (3 days)

See `AZURE_DEPLOYMENT.md` for full details.

---

## Troubleshooting

### Build failed in GitHub Actions
- Check the Actions tab for error messages
- Ensure `npm run build` works locally: `npm run build --cache /tmp/npm-cache`
- Verify `dist/index.html` exists

### App shows blank page
- Open browser DevTools (F12)
- Check Console for errors
- Verify files loaded in Network tab

### App redirects to root
- This is normal for SPA - staticwebapp.config.json handles it
- All navigation works through the frontend router

### Need to deploy again?
- Just push to main branch
- Auto-deployment triggers automatically
- Check Actions tab to monitor

---

## Costs (First Month Free)

Azure Static Web Apps Free tier includes:
- ✅ 100 GB monthly bandwidth
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ Auto-provisioned SSL/TLS

**Cost:** $0 while on Free tier

(Upgrade to Standard after testing: $9/month)
