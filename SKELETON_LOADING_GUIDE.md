# Skeleton Loading Implementation Guide

## Overview

Skeleton loading provides immediate visual feedback while data is being fetched from APIs. This improves perceived performance and user experience across all pages.

## Pattern

### 1. Import the skeleton loader
```javascript
import { skeletonLoader } from '../lib/skeleton-loader.js'
```

### 2. Show skeleton immediately
```javascript
export async function initPageName() {
  const el = document.getElementById('page-name')
  if (!el) return

  // Show skeleton immediately
  renderPageSkeleton(el)

  // Fetch data in background
  try {
    await fetchPageData()
    renderPageContent(el)
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Failed to load page', 'error')
  }
}
```

### 3. Create skeleton render function
```javascript
function renderPageSkeleton(el) {
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('Page Title', 'Subtitle')}
      ${skeletonLoader.renderMetricsRowSkeleton(5)}
      ${skeletonLoader.renderTableSkeleton(6, 8)}
    </div>
  `
}
```

### 4. Move actual content to separate render function
```javascript
function renderPageContent(el) {
  el.innerHTML = `
    <div>
      <!-- Actual page content here -->
    </div>
  `
  // Attach event listeners
  setupEventListeners()
}
```

## Skeleton Components Available

### Page Header
```javascript
skeletonLoader.renderPageHeader(title, subtitle, showActions)
```
Shows header placeholder with optional action buttons.

### Metrics Row (KPI Tiles)
```javascript
skeletonLoader.renderMetricsRowSkeleton(count = 4)
```
Shows N metric tiles in a grid layout.

### Table
```javascript
skeletonLoader.renderTableSkeleton(columns = 5, rows = 8)
```
Shows table header and body with placeholder rows.

### Card Grid
```javascript
skeletonLoader.renderCardGridSkeleton(columns = 4, cards = 8)
```
Shows grid of card placeholders.

### Tabs with Content
```javascript
skeletonLoader.renderTabsWithContentSkeleton(tabCount = 6, showContent = true)
```
Shows tab bar and content area placeholders.

## Implementation Status

### ✅ Implemented
- dashboard.js - Enhanced KPI dashboard with skeleton
- security.js - Security Command Center with skeleton
- tenantguard-enhanced.js - Tenant Guard Enhanced with skeleton
- intune.js - Intune Insights with skeleton

### 🔄 To Implement (25 pages)
Apply the same pattern to these pages:

#### High Priority (Frequently Used)
- [ ] zerotrust.js - Zero Trust Assessment
- [ ] licenses.js - License Management
- [ ] m365config.js - M365 Configuration & CIS Controls
- [ ] applications.js - Entra Applications
- [ ] privaccts.js - Privileged Accounts
- [ ] user-investigation.js - User Investigation

#### Medium Priority
- [ ] msgcenter.js - Message Center & Change Intelligence
- [ ] audit.js - Audit Log
- [ ] requests.js - Approval Requests
- [ ] approvals.js - Pending Approvals
- [ ] agents.js - AI Agents
- [ ] tasks.js - Change Tasks

#### Lower Priority
- [ ] agent.js - Agent Details
- [ ] chat.js - AI Copilot Chat
- [ ] myaccount.js - My Account
- [ ] myreqs.js - My Requests
- [ ] portal.js - Self-Service Portal
- [ ] settings.js - Admin Settings
- [ ] sso.js - SSO / Entra ID Configuration
- [ ] graphapi.js - Graph API Explorer
- [ ] tenantguard.js - Tenant Guard Classic (if kept)

## Benefits

✅ **Perceived Performance**: Users see content structure immediately
✅ **Visual Feedback**: Clear indication that data is loading
✅ **Consistent UX**: Same loading pattern across all pages
✅ **Better Engagement**: Reduces bounce rates on slow networks
✅ **Professional Feel**: Modern, polished user experience

## Best Practices

1. **Match Final Layout**: Skeleton should closely match final content structure
2. **Use Appropriate Components**: Choose skeleton components that match your page layout
3. **Keep It Fast**: Data fetching should complete within 2-3 seconds
4. **Error Handling**: If data fetch fails, show error toast but keep skeleton visible
5. **Mobile Responsive**: Ensure skeletons are mobile-friendly

## Example: Converting a Page

### Before (Linear Flow)
```javascript
export async function initPage() {
  const el = document.getElementById('page-name')
  
  // User sees blank page while data loads...
  const data = await fetchData()
  
  el.innerHTML = render(data)
}
```

### After (Skeleton Pattern)
```javascript
export async function initPage() {
  const el = document.getElementById('page-name')
  
  // User sees skeleton immediately
  renderSkeleton(el)
  
  // Data loads in background
  try {
    const data = await fetchData()
    el.innerHTML = render(data)
  } catch (error) {
    showToast('Error loading data', 'error')
  }
}

function renderSkeleton(el) {
  el.innerHTML = skeletonLoader.renderMetricsRowSkeleton(4) + 
                skeletonLoader.renderTableSkeleton(6, 8)
}
```

## Styling

Skeleton components use built-in CSS:
- Opacity: 0.5-0.6 for muted appearance
- Animations: Optional fade-in via `skeletonLoader.fadeInContent()`
- Colors: Match theme (light backgrounds #f0f0f0, #f5f5f5)
- Border radius: Subtle rounded corners (4-6px)

## Transitions

Optional smooth fade-in when data arrives:
```javascript
function renderPageContent(el) {
  el.innerHTML = actualContent
  skeletonLoader.fadeInContent(el, 300) // 300ms fade-in
}
```

## Performance Impact

- Skeleton HTML: ~2KB per page
- JavaScript overhead: Minimal (just string concatenation)
- Network impact: None (data still fetches same way)
- User experience: Significantly improved

---

**Last Updated**: 2026-06-21
**Total Pages**: 25
**Implemented**: 4
**Remaining**: 21
