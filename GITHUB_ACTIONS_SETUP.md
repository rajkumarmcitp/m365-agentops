# GitHub Actions CI/CD Setup for Backend Deployment

## Overview
This GitHub Actions workflow automatically deploys the backend to Azure App Service when changes are pushed to the `main` branch.

## Setup Steps

### 1. Add GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

#### AZURE_PUBLISH_PROFILE
**Value:** (Get from Azure Portal)
```bash
az webapp deployment list-publishing-profiles \
  --name m365ops-api \
  --resource-group m365-agentops-rg \
  --xml
```

Copy the entire XML output and paste it as the secret value.

#### AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID
Get these from Azure Service Principal:
```bash
# If you have a service principal already
az ad sp show --id <your-app-id>
```

Or create a new service principal:
```bash
az ad sp create-for-rbac --name m365ops-deployer --role Contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/m365-agentops-rg
```

This will output:
```json
{
  "appId": "AZURE_CLIENT_ID",
  "password": "AZURE_CLIENT_SECRET", 
  "tenant": "AZURE_TENANT_ID"
}
```

### 2. Verify Secrets
GitHub will show a ✅ next to each secret when added correctly.

### 3. Trigger Deployment
Make any change to `backend/` directory and push to `main`:
```bash
git add backend/
git commit -m "Trigger deployment"
git push origin main
```

Monitor the workflow:
1. Go to GitHub → Actions
2. Click on the workflow run
3. Watch the deployment progress

## What the Workflow Does

1. **Checks out code** from `main` branch
2. **Sets up Node.js 20** with npm caching
3. **Installs backend dependencies** (`npm ci --production`)
4. **Deploys to Azure App Service** using publish profile
5. **Restarts the app service**
6. **Verifies deployment** by checking `/api/health` endpoint

## Monitoring Deployments

### View Logs
- GitHub Actions tab → Click workflow run → Expand steps

### Check Production
```bash
# Test if backend is online
curl https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/health
```

## Troubleshooting

### Deployment fails at "Verify Deployment"
- Check Azure App Service logs: `az webapp log tail -n m365ops-api -g m365-agentops-rg`
- The app might need more startup time (increase attempts in workflow)

### Secrets are incorrect
- Regenerate Azure credentials if needed
- Update the secret values in GitHub

### Workflow doesn't trigger
- Ensure changes are in `backend/` or `.github/workflows/deploy-backend.yml`
- Check branch protection rules

## Manual Redeployment
If you need to redeploy without code changes:
1. Go to GitHub Actions
2. Click "Deploy Backend to Azure"
3. Click "Run workflow" 
4. Select branch `main`
5. Click "Run workflow"

---
**Status:** ✅ Workflow ready for use
**Last Updated:** 2026-07-18
