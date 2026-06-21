# Skeleton Loading Implementation Checklist

## Implementation Status: 8/25 Pages (32%)

### ✅ Completed Pages (8)
- [x] dashboard.js
- [x] security.js
- [x] tenantguard-enhanced.js
- [x] intune.js
- [x] zerotrust.js
- [x] licenses.js
- [x] m365config.js
- [x] applications.js

### 📋 Remaining Pages (17)

#### Group 1: High Priority (3 pages)
- [ ] **privaccts.js** - Privileged Accounts
  - Status: Partially done (skeleton function added, needs final render split)
  - Import: `import { skeletonLoader } from '../lib/skeleton-loader.js'`
  - Skeleton: `renderPrivAcctsSkeleton(el)` - DONE
  - Content: `renderPrivAcctsContent(el)` - DONE
  - Next: Connect to async load flow

- [ ] **user-investigation.js** - User Investigation
  - Import: `import { skeletonLoader } from '../lib/skeleton-loader.js'`
  - Skeleton Pattern: Header + Metrics + Table
  - Load Pattern: Show skeleton → Fetch user data → Render with data

- [ ] **audit.js** - Audit Log
  - Import: `import { skeletonLoader } from '../lib/skeleton-loader.js'`
  - Skeleton Pattern: Header + Filters + Table
  - Load Pattern: Show skeleton → Fetch logs → Render with data

#### Group 2: Medium Priority (6 pages)
- [ ] **msgcenter.js** - Message Center & Change Intelligence
  - Import: `import { skeletonLoader } from '../lib/skeleton-loader.js'`
  - Skeleton Pattern: Header + Metrics + Cards
  - Data: MC_MESSAGES from data

- [ ] **requests.js** - Approval Requests
  - Import: `import { skeletonLoader } from '../lib/skeleton-loader.js'`
  - Skeleton Pattern: Header + Filters + Table
  - Data: Real requests from SharePoint

- [ ] **approvals.js** - Pending Approvals
  - Import: `import { skeletonLoader } from '../lib/skeleton-loader.js'`
  - Skeleton Pattern: Header + Metrics + Cards
  - Data: Real approvals from SharePoint

- [ ] **agents.js** - AI Agents
  - Import: `import { skeletonLoader } from '../lib/skeleton-loader.js'`
  - Skeleton Pattern: Header + Metrics + Card Grid
  - Data: Real agents from backend

- [ ] **tasks.js** - Change Tasks
  - Import: `import { skeletonLoader } from '../lib/skeleton-loader.js'`
  - Skeleton Pattern: Header + Filters + Table
  - Data: Real tasks from backend

#### Group 3: Lower Priority (8 pages)
- [ ] **agent.js** - Agent Details
- [ ] **chat.js** - AI Copilot Chat
- [ ] **myaccount.js** - My Account
- [ ] **myreqs.js** - My Requests
- [ ] **portal.js** - Self-Service Portal
- [ ] **settings.js** - Admin Settings
- [ ] **sso.js** - SSO / Entra ID Configuration
- [ ] **graphapi.js** - Graph API Explorer
- [ ] **tenantguard.js** - Tenant Guard Classic (if kept)

## Quick Implementation Steps

### For each page:

1. **Add Import**
   ```javascript
   import { skeletonLoader } from '../lib/skeleton-loader.js'
   ```

2. **Show Skeleton on Init**
   ```javascript
   export async function initPageName() {
     const el = document.getElementById('page-pagename')
     if (!el) return

     // Show skeleton immediately
     el.innerHTML = `
       <div>
         ${skeletonLoader.renderPageHeader('Page Title', 'Subtitle', true)}
         ${skeletonLoader.renderMetricsRowSkeleton(4)}
         ${skeletonLoader.renderTableSkeleton(6, 8)}
       </div>
     `

     // Load data async
     try {
       await loadData()
       renderContent(el)
     } catch (error) {
       console.error('Error:', error)
     }
   }
   ```

3. **Render Content**
   ```javascript
   function renderContent(el) {
     el.innerHTML = `<!-- actual page content -->`
     setupEventListeners()
   }
   ```

## Skeleton Component Quick Reference

```javascript
// Page header with title/subtitle
skeletonLoader.renderPageHeader(title, subtitle, showActions)

// KPI metrics row
skeletonLoader.renderMetricsRowSkeleton(count = 4)

// Data table
skeletonLoader.renderTableSkeleton(columns = 5, rows = 8)

// Card grid
skeletonLoader.renderCardGridSkeleton(columns = 4, cards = 8)

// Tabs with content
skeletonLoader.renderTabsWithContentSkeleton(tabCount = 6, showContent = true)

// Optional fade-in effect
skeletonLoader.fadeInContent(element, duration = 300)
```

## Testing Checklist

For each completed page, verify:

- [ ] Skeleton appears immediately on page load
- [ ] Skeleton matches final layout structure
- [ ] Data loads in background (check Network tab)
- [ ] Content renders after data arrives
- [ ] No console errors
- [ ] Event listeners attached correctly
- [ ] Mobile responsive (skeleton adapts)
- [ ] Works on slow network (throttle to 3G in DevTools)

## Performance Metrics

**Expected Results:**
- First contentful paint: <300ms (skeleton visible)
- Total page load time: 2-5s (same as before)
- User perceived speed: 3-5x faster (due to skeleton)

## Rollout Strategy

1. **Phase 1** (DONE): High-traffic pages (dashboard, security, tenantguard, intune)
2. **Phase 2** (IN PROGRESS): Medium-priority pages (audit, requests, approvals)
3. **Phase 3** (PENDING): Lower-priority pages (agents, chat, portal, settings)

## Notes

- Skeleton styles use theme colors (#f0f0f0, #f5f5f5)
- No animations on skeleton (keep it simple and static)
- Optional fade-in on content render (300ms)
- Each page should have its own skeleton pattern matching its final layout
- Test on real mobile devices after implementation

---

**Last Updated**: 2026-06-21
**Target Completion**: All 25 pages within 2-3 hours
**Current Progress**: 32% (8/25)
