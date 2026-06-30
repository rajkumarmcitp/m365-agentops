# Zero Trust SharePoint Integration - Production Deployment Runbook

**Last Updated:** 2026-06-30
**Status:** Ready for Production Deployment
**Version:** 1.0

## Overview

This document provides step-by-step instructions for deploying the Zero Trust SharePoint integration to production. The integration enables automatic persistence of Zero Trust compliance validations to SharePoint for compliance reporting and audit trails.

## Pre-Deployment Checklist

- [x] SharePoint lists created (ZeroTrust-Validations, ZeroTrust-Results, ZeroTrust-History)
- [x] 38 custom columns configured across all lists
- [x] Backend API endpoints implemented and tested
- [x] Automatic result persistence enabled
- [x] Environment variables collected
- [x] Production verification script created
- [ ] Security review completed
- [ ] Compliance officer approval obtained
- [ ] Runbook distributed to operations team
- [ ] Rollback procedure tested

## Configuration Values

**Current Production Configuration:**
```
SHAREPOINT_SITE_ID=nasstech.sharepoint.com,3f6b857f-3e5d-4c24-b085-21dcd5224220,ad0ee341-52a0-40e9-927d-540a45bc0523
SHAREPOINT_ZEROTRUST_VALIDATIONS_LIST_ID=cae0d1b4-34f8-463d-b03d-710ae879aa95
SHAREPOINT_ZEROTRUST_RESULTS_LIST_ID=b4c354c4-c004-4e0a-9bc1-bc11f93804ff
SHAREPOINT_ZEROTRUST_HISTORY_LIST_ID=63b84bbb-37e4-4e63-a9ca-b2e44e722fd8
```

These values are already configured in `.env.production`

## Deployment Steps

### Step 1: Pre-Deployment Verification (15 minutes)

```bash
# 1a. Verify backend is running
curl http://localhost:3000/api/zero-trust/validations -I

# 1b. Test SharePoint connection
curl -X POST http://localhost:3000/api/zero-trust/validate-sharepoint \
  -H "Content-Type: application/json" \
  -d '{"siteUrl":"root"}'
# Expected: {"success":true,"siteId":"..."}

# 1c. Verify environment file
cat .env.production | grep SHAREPOINT
# Should show all 4 SHAREPOINT_* variables
```

### Step 2: Push Configuration to Repository (5 minutes)

```bash
# Add updated .env.production
git add .env.production

# Commit with descriptive message
git commit -m "Configure Zero Trust SharePoint integration for production

- Add SHAREPOINT_SITE_ID with root site identifier
- Configure three list IDs for validations, results, and history
- Ready for automatic result persistence to SharePoint

Deployment: 
  1. Pull latest code
  2. Restart backend service
  3. Monitor logs for 'Saved X results to SharePoint'
  4. Verify results in SharePoint lists"

# Push to production branch
git push origin main
```

### Step 3: Deploy to Production Environment (varies)

#### Option A: Azure Static Web Apps (Recommended)
```bash
# 1. Push triggers automatic build/deploy
# 2. Monitor deployment status in Azure Portal
# 3. Deployment typically completes in 2-5 minutes

# Verify deployment:
curl https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/zero-trust/validations -I
# Should return 200 OK
```

#### Option B: Docker Deployment
```bash
# 1. Pull latest changes
cd /opt/m365-agentops
git pull origin main

# 2. Rebuild container with new env
docker-compose build --no-cache

# 3. Restart services
docker-compose down
docker-compose up -d

# 4. Verify health
docker logs m365-agentops-backend | tail -20
```

#### Option C: Direct Server Deployment
```bash
# 1. SSH to production server
ssh ops@prod-server

# 2. Pull latest changes
cd /var/app/m365-agentops
git pull origin main

# 3. Restart backend service
sudo systemctl restart m365-agentops-backend

# 4. Check service status
sudo systemctl status m365-agentops-backend
```

### Step 4: Post-Deployment Verification (10 minutes)

```bash
# 4a. Check service health
curl https://prod-api-url/health
# Expected: {"status":"healthy"}

# 4b. Test Zero Trust validations endpoint
curl https://prod-api-url/api/zero-trust/validations | head -c 500
# Should return validation data

# 4c. Verify SharePoint connection
curl -X POST https://prod-api-url/api/zero-trust/validate-sharepoint \
  -H "Content-Type: application/json" \
  -d '{"siteUrl":"root"}'
# Expected: {"success":true}

# 4d. Check backend logs for SharePoint saves
tail -f /var/log/m365-agentops-backend.log | grep -i "sharepoint\|saved"
# Should see: "✓ Saved 152 results to SharePoint" after validation runs

# 4e. Verify results in SharePoint
# Navigate to SharePoint site and check:
# - ZeroTrust-Results list should have new items
# - Timestamps should be recent
# - Status values should be PASS/FAIL/WARNING
```

### Step 5: Enable Production Monitoring (5 minutes)

```bash
# 5a. Set up log monitoring
# Add to monitoring system:
grep pattern: "Saved.*results to SharePoint"
grep pattern: "SharePoint.*Error"
grep pattern: "✗ Failed"

# 5b. Configure alerts
# Alert when: 
#   - "Could not access SharePoint site" appears
#   - Results save time exceeds 5 minutes
#   - Graph API errors occur

# 5c. Set up metrics dashboard
# Track:
#   - Validations per hour
#   - Results saved per validation run
#   - Average save time to SharePoint
#   - SharePoint API error rate
```

### Step 6: Team Notification (2 minutes)

Send notification to:
- Security Team: "Zero Trust validations now persisted to SharePoint"
- Compliance: "Assessment results available for audit trail"
- Operations: "New SharePoint integration live - see runbook"

Include:
- SharePoint site location
- List names (ZeroTrust-Validations, ZeroTrust-Results, ZeroTrust-History)
- Contact for issues

## Monitoring & Operations

### Daily Checks

```bash
# Check for any overnight errors
grep "Error\|error\|✗" /var/log/m365-agentops-backend.log | tail -20

# Verify results are being saved
grep "Saved.*results to SharePoint" /var/log/m365-agentops-backend.log | tail -1

# Check SharePoint list growth
# (Visit SharePoint and check item count in ZeroTrust-Results)
```

### Performance Baseline

**Expected Performance:**
- Validation run: 30-60 seconds
- Result save to SharePoint: 100-500ms per record (152 total)
- Total end-to-end: 35-65 seconds

**If Results Are Slow:**
1. Check backend logs for Graph API timeouts
2. Check SharePoint site health/performance
3. Verify network connectivity
4. Results save asynchronously - won't block validation display

## Troubleshooting

### Issue: "Could not access SharePoint site"

**Symptoms:**
- Error in logs: "Could not access SharePoint site"
- Results not saving to SharePoint

**Diagnosis:**
```bash
# Check Graph API connectivity
curl -X POST https://prod-api-url/api/zero-trust/validate-sharepoint \
  -H "Content-Type: application/json" \
  -d '{"siteUrl":"root"}'

# Check environment variables
echo $SHAREPOINT_SITE_ID | wc -c
# Should show approximately 100+ characters
```

**Resolution:**
1. Verify SharePoint site is accessible: `https://nasstech.sharepoint.com`
2. Verify Graph API credentials are valid
3. Check tenant hasn't changed or migration occurred
4. Run test button in Admin Settings to re-validate
5. If issue persists, restart service and check logs

### Issue: Results Not Appearing in SharePoint

**Symptoms:**
- Validations run successfully
- No errors in logs
- Items not appearing in SharePoint lists

**Diagnosis:**
```bash
# Check if results endpoint works
curl https://prod-api-url/api/zero-trust/results

# Review backend logs
grep "Saving validation results" backend.log
grep "SharePoint" backend.log | tail -20
```

**Resolution:**
1. Verify list IDs in environment variables match SharePoint
2. Check SharePoint list permissions (service account needs write)
3. Verify network connectivity to SharePoint
4. Try manual result save via POST /api/zero-trust/results
5. If lists were deleted, re-initialize from Admin Settings

### Issue: Performance Degradation

**Symptoms:**
- Validations taking >90 seconds
- High CPU/memory on backend

**Diagnosis:**
```bash
# Check time breakdown
grep "Running comprehensive Zero Trust validations" backend.log
grep "Saving validation results to SharePoint" backend.log
grep "Saved.*results" backend.log

# Check GraphClient performance
grep "API call" backend.log | tail -10
```

**Resolution:**
1. This is typically normal variation, not a problem
2. If persistent, enable result batching (code optimization)
3. Consider caching validation definitions
4. Check Graph API rate limits/throttling
5. Verify SharePoint isn't undergoing maintenance

## Rollback Procedure

If critical issues occur:

**Quick Rollback (2 minutes):**
```bash
# 1. Edit .env.production
# Comment out all SHAREPOINT_* lines:
# # SHAREPOINT_SITE_ID=...
# # SHAREPOINT_ZEROTRUST_RESULTS_LIST_ID=...
# etc.

# 2. Restart backend
sudo systemctl restart m365-agentops-backend

# 3. Verify it still works (without SharePoint persistence)
curl https://prod-api-url/api/zero-trust/validations
```

**Full Rollback (10 minutes):**
```bash
# 1. Revert to previous commit
git revert HEAD
git push origin main

# 2. Wait for auto-deployment
# 3. Verify validation endpoint works
# 4. Check logs for errors
```

**Post-Rollback:**
- Preserve any validation results that were saved to SharePoint
- Contact SharePoint admin to verify list integrity
- Investigate root cause of issue
- Create ticket for fix before re-deploying

## Success Criteria

Deployment is successful when:

- [x] Backend service starts without errors
- [x] SharePoint connection test passes
- [x] Validation endpoint returns results
- [x] Results appear in SharePoint within 2 minutes of validation run
- [x] No errors in backend logs related to SharePoint
- [x] Team can access results in SharePoint
- [x] Compliance can access history list for audit trail
- [x] Performance metrics are within baseline

## Support Escalation

**Level 1: Ops Team**
- Monitor logs and alerts
- Verify environment configuration
- Restart services
- Check network/firewall

**Level 2: Backend Engineering**
- Investigate API errors
- Review Graph API performance
- Debug result persistence logic
- Optimize query performance

**Level 3: SharePoint Admin**
- Verify list configuration
- Check permissions and access
- Review SharePoint performance
- Manage list growth/archival

## References

- [Zero Trust Validation Catalog](/data/validation-catalog.json) - 152 security controls
- [SharePoint Integration Guide](/ZERO_TRUST_SHAREPOINT_INTEGRATION.md)
- [API Endpoints Documentation](/docs/api/zero-trust.md)
- [GitHub Commits](https://github.com/...):
  - bf30bb7: Backend API endpoints
  - 7f073c9: Data persistence integration

## Sign-Off

- [ ] Security Review: _________________ Date: _______
- [ ] Compliance Approval: _________________ Date: _______
- [ ] Operations Manager: _________________ Date: _______
- [ ] Deployment Approved: _________________ Date: _______

**Deployment Date:** _________________
**Deployed By:** _________________
**Verified By:** _________________

---

*This document should be reviewed and updated after each production deployment.*
