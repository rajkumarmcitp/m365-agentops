# Phase 2 Testing Guide: How to Check the Dashboard

**Purpose:** Verify all dashboard components work correctly
**Time Required:** 15-20 minutes
**Environment:** Local development

---

## Prerequisites

### 1. Backend Running

Ensure the backend server is running:

```bash
cd /Users/vasanthipromoters/Documents/M365_OpsAgent/m365-agentops/backend
npm start
```

**Expected Output:**
```
🚀 Server starting...
✅ Database connected
✅ Compliance Engine initialized (Phase 1.3)
✅ Server running on http://localhost:3000
```

### 2. Database Initialized

Ensure the database has been initialized with Phase 1.1 and 1.2 data:

```bash
cd /Users/vasanthipromoters/Documents/M365_OpsAgent/m365-agentops/backend
node db/init-ucc-phase-1-2.js
```

**Expected Output:**
```
🚀 Starting M365 AgentOps UCC Phase 1.2 Initialization...
✅ Schema created
✅ 1,010 controls seeded
✅ 2,612 framework mappings configured
✅ Phase 1.2 Initialization Complete!
```

### 3. Run at Least One Validation

The dashboard needs validation data. Trigger validation:

```bash
curl -X POST "http://localhost:3000/api/m365-agentops/v2/validate/all?tenantId=test-tenant"
```

**Expected Response:**
```json
{
  "success": true,
  "validationCount": 1010
}
```

---

## Step 1: Access the Dashboard

### Option A: Via Frontend Dev Server

```bash
cd /Users/vasanthipromoters/Documents/M365_OpsAgent/m365-agentops
npm run dev
```

**Expected Output:**
```
  VITE v4.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5174/
  ➜  press h to show help
```

Navigate to: `http://localhost:5174/pages/compliance-dashboard.html`

### Option B: Direct HTML File

Create a test HTML file that loads the dashboard:

```bash
cat > /tmp/dashboard-test.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>M365 AgentOps Compliance Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
    }
  </style>
</head>
<body>
  <div id="app"></div>

  <script type="module">
    // Set API endpoint
    window.API_URL = 'http://localhost:3000'
    
    // Set tenant (use test-tenant from validation)
    window.TENANT_ID = 'test-tenant'
    
    // Import and initialize dashboard
    import { initComplianceDashboard } from 'http://localhost:5174/pages/compliance-dashboard.js'
    
    initComplianceDashboard()
  </script>
</body>
</html>
EOF

# Open in browser
open /tmp/dashboard-test.html
```

---

## Step 2: Verify API Endpoints

Test each endpoint individually with curl to ensure data is available:

### 2.1 Overall Score

```bash
curl "http://localhost:3000/api/m365-agentops/v2/compliance/score?tenantId=test-tenant"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "score": 75.5,
    "earnedPoints": 7750,
    "totalPoints": 10250,
    "breakdown": {
      "passed": 847,
      "failed": 156,
      "partial": 18,
      "unknown": 4,
      "error": 0,
      "total": 1025
    },
    "status": "Fair"
  }
}
```

### 2.2 Framework Scores

```bash
curl "http://localhost:3000/api/m365-agentops/v2/compliance/frameworks?tenantId=test-tenant"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "CIS": { "score": 82.5, "totalControls": 450, "passed": 371, ... },
    "NIST": { "score": 81.2, "totalControls": 380, "passed": 308, ... },
    ...
  }
}
```

### 2.3 Domain Scores

```bash
curl "http://localhost:3000/api/m365-agentops/v2/compliance/domains?tenantId=test-tenant"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "TG-ID": { "score": 88.6, "totalControls": 70, "passed": 62, ... },
    "TG-AUTH": { "score": 80.0, "totalControls": 35, "passed": 28, ... },
    ...
  }
}
```

### 2.4 Trend Data

```bash
curl "http://localhost:3000/api/m365-agentops/v2/compliance/trend?tenantId=test-tenant&daysBack=30"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "direction": "➡️ Stable",
    "velocity": 0.0,
    "projection": 75.5,
    "history": [
      { "date": "2026-06-28", "score": 75.5 },
      ...
    ]
  }
}
```

### 2.5 Drift Detection

```bash
curl "http://localhost:3000/api/m365-agentops/v2/compliance/drift?tenantId=test-tenant&daysBack=7"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "regressions": [],
    "remediations": [],
    "scoreDelta": 0.0,
    "severity": "Low",
    "trend": "Stable",
    "regressionCount": 0,
    "remediationCount": 0
  }
}
```

### 2.6 Executive Summary

```bash
curl "http://localhost:3000/api/m365-agentops/v2/compliance/summary?tenantId=test-tenant"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "overallCompliance": { "score": 75.5, "status": "Fair", "riskLevel": "Medium" },
    "trend": { "direction": "➡️ Stable", "velocity": 0.0, "projection30Days": 75.5 },
    "topRisks": [ { "domain": "TG-EXO", "score": 68.4, "failingControls": 25 }, ... ],
    "recommendations": [ "Address 156 failing controls...", ... ],
    "nextSteps": [ "Review top 5 failing controls", ... ]
  }
}
```

---

## Step 3: Check Dashboard Components

### 3.1 Load Dashboard in Browser

Navigate to: `http://localhost:5174/pages/compliance-dashboard.html?tenantId=test-tenant`

**Expected Behavior:**
1. Loading skeletons appear briefly
2. Header shows "M365 AgentOps Compliance Dashboard"
3. Status bar shows "Last updated: [time]"
4. All components load without errors

### 3.2 Verify Compliance Score Card

**Should See:**
- ✅ Large score display (e.g., "75.5%")
- ✅ Status badge (e.g., "Fair ⚠️")
- ✅ Breakdown stats (847 passed, 156 failed, etc.)
- ✅ Trend direction (📈/📉/➡️)
- ✅ Velocity (+X.XX/day)
- ✅ 30-day projection

**Test:**
```javascript
// Open browser console and check
window.complianceApi.getComplianceScore('test-tenant').then(d => console.log(d))
```

### 3.3 Verify Framework Comparison

**Should See:**
- ✅ 7 frameworks listed
- ✅ Progress bars with colors (Green/Blue/Amber/Red)
- ✅ Scores like "82.5%", "81.2%", etc.
- ✅ Control counts
- ✅ Legend showing score bands

### 3.4 Verify Domain Breakdown

**Should See:**
- ✅ All 20 domains with cards
- ✅ Risk levels (Critical/High/Medium/Low/Good)
- ✅ Color-coded progress bars
- ✅ Passing/failing/total stats
- ✅ Tab switching (All/Critical/Good)

**Test Tabs:**
- Click "All Domains (20)" - shows all 20
- Click "Critical (Score <70%)" - shows only low-score domains
- Click "Good (Score ≥80%)" - shows only high-score domains

### 3.5 Verify Drift Alerts

**Should See:**
- ✅ Regression count (e.g., "2")
- ✅ Remediation count (e.g., "1")
- ✅ Score delta (e.g., "-2.3%")
- ✅ Severity badge
- ✅ Control lists (if data available)

### 3.6 Verify Trend Chart

**Should See:**
- ✅ Chart.js loads (CDN from jsdelivr)
- ✅ Line chart showing 30 days
- ✅ Blue line for actual score
- ✅ Dashed green line for projection
- ✅ Interactive tooltips on hover
- ✅ Trend metrics (Direction, Velocity, Projection)

**Test Chart Interaction:**
- Hover over data points - should show tooltip
- Chart should respond to window resize

### 3.7 Verify Recommendations Panel

**Should See:**
- ✅ Top priority areas (ranked 1-3+)
- ✅ Recommended actions (numbered list)
- ✅ Next steps with checkboxes
- ✅ Impact assessment cards
- ✅ Action buttons (Generate Report, Schedule Review, Export Data)

---

## Step 4: Browser Console Checks

Open Developer Tools (F12) and check console:

### 4.1 No Errors

**Expected:** No red error messages

```javascript
// Check for errors
console.error // should show no errors
```

### 4.2 API Calls Working

**Expected:** Network tab shows successful API calls

Check Network tab (F12 → Network):
- `GET .../api/m365-agentops/v2/compliance/score` → **200 OK**
- `GET .../api/m365-agentops/v2/compliance/frameworks` → **200 OK**
- `GET .../api/m365-agentops/v2/compliance/domains` → **200 OK**
- `GET .../api/m365-agentops/v2/compliance/trend` → **200 OK**
- `GET .../api/m365-agentops/v2/compliance/drift` → **200 OK**
- `GET .../api/m365-agentops/v2/compliance/summary` → **200 OK**

### 4.3 Component Rendering

**Expected:** All DOM elements present

```javascript
// Check components exist
document.getElementById('score-card') // should exist
document.getElementById('framework-comparison') // should exist
document.getElementById('domain-breakdown') // should exist
document.getElementById('drift-alerts') // should exist
document.getElementById('trend-chart') // should exist
document.getElementById('recommendations') // should exist
```

### 4.4 Auto-Refresh Working

**Expected:** Dashboard auto-refreshes every 5 minutes

```javascript
// Check last updated time
// Wait 5 minutes and verify status bar updates
```

---

## Step 5: Test Features

### 5.1 Manual Refresh Button

**Test:**
- Click "🔄 Refresh" button
- Status bar updates with new timestamp
- Components re-render with fresh data

### 5.2 Export Button

**Test:**
- Click "📊 Export" button
- JSON file downloads
- Check file contains compliance data

### 5.3 Responsive Design

**Test on Mobile:**
```bash
# Open DevTools (F12)
# Click device toolbar (Ctrl+Shift+M)
# Select iPhone 12 Pro / iPad
# Verify layout adapts correctly
```

**Expected:**
- ✅ Single column layout
- ✅ Buttons stack vertically
- ✅ Charts responsive
- ✅ Text readable without zoom

### 5.4 Error Handling

**Test Error State:**
```bash
# Stop backend
# Try to refresh dashboard
# Should show error message with retry button
```

**Expected:**
- ✅ Error card displays
- ✅ "Retry" button works
- ✅ No console errors
- ✅ Graceful degradation

---

## Step 6: Performance Check

### 6.1 Load Time

**Expected:** Dashboard loads in <2 seconds

```javascript
// Check in browser console
performance.getEntriesByType('navigation')[0].loadEventEnd - 
performance.getEntriesByType('navigation')[0].fetchStart
// Should be < 2000ms
```

### 6.2 Memory Usage

**Expected:** <100MB after load

```javascript
// Check in DevTools (F12 → Memory)
// Take heap snapshot
// Should show reasonable memory usage
```

### 6.3 CPU Usage

**Expected:** <10% during idle, <30% while rendering

```bash
# Open Activity Monitor (Mac) or Task Manager (Windows)
# Check Chrome/Edge process CPU usage
```

---

## Step 7: Cross-Browser Testing

Test on multiple browsers:

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Test |
| Firefox | 88+ | ✅ Test |
| Safari | 14+ | ✅ Test |
| Edge | 90+ | ✅ Test |

**Quick Test:**
```bash
# For each browser:
1. Open dashboard URL
2. Verify all components render
3. Check console for errors
4. Test refresh and export
```

---

## Troubleshooting

### Issue: "Cannot connect to API"

**Solution:**
```bash
# Verify backend is running
curl http://localhost:3000/api/health

# Check port is correct
# Default: 3000
# Change in dashboard if needed
```

### Issue: "No data displayed"

**Solution:**
```bash
# Run validation to generate data
curl -X POST "http://localhost:3000/api/m365-agentops/v2/validate/all?tenantId=test-tenant"

# Wait for completion (may take 30-60 seconds)

# Refresh dashboard
```

### Issue: "Chart not rendering"

**Solution:**
```bash
# Check Chart.js CDN is accessible
# In browser console:
console.log(window.Chart) // should be defined

# If not, check internet connection
# Chart.js is loaded from CDN (chart.js@4.4.0)
```

### Issue: "Mobile layout broken"

**Solution:**
```bash
# Clear browser cache (Ctrl+Shift+Delete)
# Hard refresh (Ctrl+Shift+R)
# Check viewport meta tag exists
# Verify CSS media queries work
```

### Issue: "Components show but no data"

**Solution:**
```bash
# Check API endpoints individually
curl "http://localhost:3000/api/m365-agentops/v2/compliance/score?tenantId=test-tenant"

# If API returns error, check backend logs
# Verify database has data:
psql -d m365_agentops -c "SELECT COUNT(*) FROM m365_control_results;"
```

---

## Automated Testing Script

Create a test script to verify everything:

```bash
#!/bin/bash
# save as test-dashboard.sh

echo "🧪 Dashboard Testing Suite"
echo "=========================="

BACKEND_URL="http://localhost:3000"
TENANT="test-tenant"

echo ""
echo "1. Checking backend..."
if curl -s "$BACKEND_URL/api/health" > /dev/null; then
  echo "✅ Backend running"
else
  echo "❌ Backend not responding"
  exit 1
fi

echo ""
echo "2. Checking API endpoints..."

endpoints=(
  "compliance/score"
  "compliance/frameworks"
  "compliance/domains"
  "compliance/trend"
  "compliance/drift"
  "compliance/summary"
)

for endpoint in "${endpoints[@]}"; do
  response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/m365-agentops/v2/$endpoint?tenantId=$TENANT")
  if [ "$response" = "200" ]; then
    echo "✅ $endpoint: 200 OK"
  else
    echo "❌ $endpoint: $response"
  fi
done

echo ""
echo "3. Testing data availability..."
data_count=$(curl -s "$BACKEND_URL/api/m365-agentops/v2/compliance/summary?tenantId=$TENANT" | grep -o '"score"' | wc -l)
if [ "$data_count" -gt 0 ]; then
  echo "✅ Data available for dashboard"
else
  echo "❌ No data found"
fi

echo ""
echo "✨ Testing complete!"
```

Run it:
```bash
chmod +x test-dashboard.sh
./test-dashboard.sh
```

---

## Final Verification Checklist

- [ ] Backend running (http://localhost:3000)
- [ ] Database initialized with Phase 1.2 data
- [ ] Validation run completed
- [ ] Dashboard loads without errors
- [ ] Score card displays correctly
- [ ] Framework comparison shows all 7 frameworks
- [ ] Domain breakdown shows all 20 domains
- [ ] Drift alerts visible (if data available)
- [ ] Trend chart renders with Chart.js
- [ ] Recommendations panel shows priorities
- [ ] All API endpoints return 200 OK
- [ ] No console errors
- [ ] Refresh button works
- [ ] Export button downloads JSON
- [ ] Mobile layout responsive
- [ ] Auto-refresh updates after 5 minutes

---

## Success Criteria

✅ **Dashboard is working correctly when:**

1. All components load without errors
2. Data displays correctly from all API endpoints
3. No JavaScript errors in console
4. Responsive design works on mobile
5. Auto-refresh updates data
6. Export generates valid JSON
7. Performance: load time < 2 seconds
8. All browsers tested show correct layout

---

**Status: ✅ Ready for Testing**

Use this guide to verify the Phase 2 dashboard implementation.
