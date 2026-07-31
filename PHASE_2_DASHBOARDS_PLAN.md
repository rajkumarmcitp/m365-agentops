# Phase 2: Executive Dashboards - Implementation Plan

**Status:** Planning
**Timeline:** 1-2 weeks
**Impact:** Enterprise-grade compliance visualization for leadership

---

## Overview

Phase 2 builds the visual layer for M365 AgentOps compliance engine. Executive dashboards display:
- Real-time compliance scores
- Framework comparisons
- Domain drill-down
- Drift alerts
- Historical trends
- Risk assessments
- Actionable recommendations

---

## Architecture

```
Phase 1 (Complete) ✅
  ├─ 1,010 controls
  ├─ Validation engine
  ├─ Compliance scoring
  └─ 10 REST APIs

Phase 2 (This Phase) 📋
  ├─ Dashboard main page
  ├─ Compliance card component
  ├─ Framework comparison
  ├─ Domain breakdown
  ├─ Drift visualization
  ├─ Trend charts
  ├─ Risk assessment
  └─ Recommendations panel

  Uses:
  └─ complianceApi client → 10 REST endpoints
```

---

## Dashboard Components

### 1. Main Dashboard Page (`pages/compliance-dashboard.js`)

**Purpose:** Orchestrate all dashboard components

**Layout:**
```
┌─────────────────────────────────────────┐
│  Header: M365 AgentOps Compliance       │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ Compliance   │  │ Trend Arrow  │   │
│  │ Score Card   │  │ (📈/📉/➡️)   │   │
│  │              │  │              │   │
│  │ 79.2%        │  │ Improving    │   │
│  │ Fair         │  │ +0.5/month   │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│ Framework Comparison (7 frameworks)     │
│ ┌──────────────────────────────────┐  │
│ │ CIS    82.5%  [████████░] Good    │  │
│ │ NIST   81.2%  [████████░] Good    │  │
│ │ ISO    79.8%  [███████░░] Fair    │  │
│ │ CMMC   80.5%  [████████░] Good    │  │
│ │ SOC2   83.1%  [████████░] Good    │  │
│ │ Secure 86.4%  [█████████] Good    │  │
│ │ ZT     85.9%  [█████████] Good    │  │
│ └──────────────────────────────────┘  │
│                                         │
├─────────────────────────────────────────┤
│ Domain Breakdown (Top 5 Risks)          │
│ ┌──────────────────────────────────┐  │
│ │ TG-EXO   68.4%  ⚠️ Highest Risk   │  │
│ │ TG-SPO   72.1%  ⚠️ High Risk      │  │
│ │ TG-INT   75.3%  ⚠️ Medium Risk    │  │
│ │ TG-DLP   76.2%  ⚠️ Medium Risk    │  │
│ │ TG-CA    80.0%  ✓ Acceptable     │  │
│ └──────────────────────────────────┘  │
│                                         │
├─────────────────────────────────────────┤
│ Trend Analysis (30 days)                │
│ ┌──────────────────────────────────┐  │
│ │       ╱  Score: 79.2%              │  │
│ │      ╱   Trend: Improving          │  │
│ │     ╱    Velocity: +0.45/day       │  │
│ │    ╱     Projection: 82.1% (30d)   │  │
│ │  ╱───────────────────────────     │  │
│ │                                      │  │
│ └──────────────────────────────────┘  │
│                                         │
├─────────────────────────────────────────┤
│ Drift Alerts (7-day summary)            │
│ ┌──────────────────────────────────┐  │
│ │ 🔴 Regressions: 2                  │  │
│ │    • TG-ID-001 (Critical)          │  │
│ │    • TG-EXO-045 (High)             │  │
│ │ 🟢 Remediations: 1                 │  │
│ │    • TG-AUTH-005 (Medium)          │  │
│ └──────────────────────────────────┘  │
│                                         │
├─────────────────────────────────────────┤
│ Top Recommendations                     │
│ ┌──────────────────────────────────┐  │
│ │ 1. Address 156 failing controls   │  │
│ │    by severity                    │  │
│ │ 2. TG-EXO domain requires         │  │
│ │    immediate attention (68.4%)    │  │
│ │ 3. Prioritize critical control    │  │
│ │    remediations                   │  │
│ └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Compliance Score Card (`components/compliance-score-card.js`)

**Props:**
- `score` (number) — 0-100
- `status` (string) — "Excellent" | "Good" | "Fair" | "Poor" | "Critical"
- `breakdown` (object) — { passed, failed, partial, unknown, error, total }
- `trend` (object) — { direction, velocity, projection }

**Displays:**
- Large score (79.2%)
- Status badge with color coding
- Status breakdown (847 passed, 156 failed, 18 partial, etc.)
- Trend indicator (📈 Improving, 📉 Declining, ➡️ Stable)
- Mini spark line showing trend direction

### 3. Framework Comparison (`components/framework-comparison.js`)

**Props:**
- `frameworks` (object) — { CIS, NIST, ISO, CMMC, SOC2, "Secure Score", "Zero Trust" }

**Displays:**
- 7 framework rows
- Progress bar for each (0-100%)
- Color-coded status (Green/Blue/Amber/Red)
- Score percentage text
- Control count (e.g., "450 controls")
- Sort by score option

### 4. Domain Breakdown (`components/domain-breakdown.js`)

**Props:**
- `domains` (object) — { TG-ID, TG-AUTH, TG-CA, ... (20 total) }
- `onDomainClick` (function) — Click handler for drill-down

**Displays:**
- Top 10 domains by risk (lowest to highest score)
- Domain code + name
- Score with visual bar
- Risk level badge (Critical/High/Medium/Low)
- Failed control count
- Clickable for drill-down

### 5. Drift Visualization (`components/drift-alerts.js`)

**Props:**
- `drift` (object) — { regressions, remediations, scoreDelta, severity, trend }
- `daysBack` (number) — 7 (default)

**Displays:**
- Regression count with 🔴 red badge
- List of failed controls (with severity icons)
- Remediation count with 🟢 green badge
- List of fixed controls
- Score delta indicator
- Severity assessment (Critical/High/Medium)
- Timestamp

### 6. Trend Chart (`components/trend-chart.js`)

**Props:**
- `trend` (object) — { history, direction, velocity, projection }
- `daysBack` (number) — 30 (default)

**Displays:**
- Line chart (30-day history)
- Current score at the end
- Trend direction (arrow)
- Velocity (points per day)
- 30-day projection
- Legend

**Libraries:**
- Chart.js or similar lightweight charting

### 7. Risk Matrix (`components/risk-matrix.js`)

**Props:**
- `domains` (object) — All 20 domain scores
- `controlFailures` (array) — Failures by severity

**Displays:**
- 2D matrix (Impact vs. Likelihood)
- Domain bubbles sized by control count
- Color-coded by score
- Quadrants:
  - Top-right: Critical (High impact, High likelihood)
  - Top-left: Medium (High impact, Low likelihood)
  - Bottom-right: Low (Low impact, High likelihood)
  - Bottom-left: Green (Low impact, Low likelihood)

### 8. Recommendations Panel (`components/recommendations-panel.js`)

**Props:**
- `summary` (object) — Executive summary from API
- `onRecommendationClick` (function) — Navigate to control

**Displays:**
- Ordered list of recommendations
- Action-oriented language
- Priority indicators
- Related control links
- Estimated effort/impact (if available)

---

## Data Flow

```
Dashboard Page
    ↓
complianceApi.getComplianceScore()
  ├─ → compliance-score-card
  └─ Breakdown data

complianceApi.getFrameworkScores()
  ├─ → framework-comparison
  └─ All 7 frameworks

complianceApi.getDomainScores()
  ├─ → domain-breakdown
  ├─ → risk-matrix
  └─ All 20 domains

complianceApi.getComplianceTrend(30)
  ├─ → trend-chart
  └─ 30-day history

complianceApi.getComplianceDrift(7)
  ├─ → drift-alerts
  └─ Regressions & fixes

complianceApi.getExecutiveSummary()
  ├─ → recommendations-panel
  └─ Top actions
```

---

## Implementation Sequence

### Week 1

**Day 1-2: Core Components**
1. ✅ compliance-score-card.js
   - Display score with status
   - Show breakdown (passed/failed/etc)
   - Add trend indicator

2. ✅ framework-comparison.js
   - List all 7 frameworks
   - Progress bars with colors
   - Sort/filter options

3. ✅ domain-breakdown.js
   - Top 10 at-risk domains
   - Severity indicators
   - Click handlers

**Day 3-4: Visualization Components**
1. ✅ trend-chart.js
   - Line chart (30 days)
   - Projection line
   - Legend

2. ✅ drift-alerts.js
   - Regression/remediation counts
   - Control lists
   - Timeline

3. ✅ risk-matrix.js
   - 2D bubble chart
   - Quadrant highlighting
   - Domain bubbles

**Day 5: Main Dashboard**
1. ✅ compliance-dashboard.js
   - Assemble all components
   - Layout & styling
   - Data loading
   - Error handling

### Week 2

**Day 1-2: Polish & Testing**
1. Responsive design
2. Mobile optimization
3. Accessibility (WCAG)
4. Component testing

**Day 3-4: Advanced Features**
1. Real-time updates (WebSocket optional)
2. Export to PDF/CSV
3. Drill-down modals
4. Custom date ranges

**Day 5: Deployment**
1. Integration testing
2. Performance verification
3. Documentation
4. Go live

---

## Styling & Design

### Color Scheme

```css
/* Scores */
--score-excellent: #10b981  /* Green */
--score-good: #3b82f6      /* Blue */
--score-fair: #f59e0b      /* Amber */
--score-poor: #ef4444      /* Red */
--score-critical: #7c3aed  /* Purple */

/* Status */
--status-pass: #10b981     /* Green */
--status-fail: #ef4444     /* Red */
--status-warning: #f59e0b  /* Amber */
--status-info: #3b82f6     /* Blue */

/* Severity */
--severity-critical: #7c3aed  /* Purple */
--severity-high: #ef4444      /* Red */
--severity-medium: #f59e0b    /* Amber */
--severity-low: #3b82f6       /* Blue */
--severity-info: #6b7280      /* Gray */
```

### Typography

```css
/* Headings */
h1: 28px bold (Dashboard title)
h2: 18px bold (Section headers)
h3: 14px bold (Component titles)

/* Body */
body: 13px regular (Default text)
small: 11px regular (Captions)

/* Scores */
.score-large: 48px bold (Main score)
.score-medium: 24px bold (Framework/domain scores)
.score-small: 16px bold (Card scores)
```

### Layout

- Responsive: 320px mobile → 1920px desktop
- Grid-based: 12-column layout
- 16px base spacing (8px increments)
- Hover states for interactive elements
- Loading skeletons for async data
- Error boundaries & fallbacks

---

## State Management

**Dashboard-level state:**
```javascript
{
  tenantId: 'contoso.onmicrosoft.com',
  loading: false,
  error: null,
  data: {
    score: { score, breakdown, status },
    frameworks: { CIS, NIST, ... },
    domains: { TG-ID, TG-AUTH, ... },
    trend: { history, direction, velocity, projection },
    drift: { regressions, remediations, severity },
    summary: { recommendations, topRisks, nextSteps }
  },
  lastUpdated: timestamp,
  refreshInterval: 5000, // milliseconds
}
```

**Component-level state:**
- Sorting preferences (domains by score, frameworks by score)
- Filtering (show top N domains, time range for trend)
- Expanded/collapsed sections
- Modal visibility

---

## API Integration

**All calls go through complianceApi client:**

```javascript
import { complianceApi } from '../lib/compliance-api-client.js'

// In dashboard component
async function loadDashboardData(tenantId) {
  try {
    const [score, frameworks, domains, trend, drift, summary] = await Promise.all([
      complianceApi.getComplianceScore(tenantId),
      complianceApi.getFrameworkScores(tenantId),
      complianceApi.getDomainScores(tenantId),
      complianceApi.getComplianceTrend(tenantId, 30),
      complianceApi.getComplianceDrift(tenantId, 7),
      complianceApi.getExecutiveSummary(tenantId)
    ])

    return { score, frameworks, domains, trend, drift, summary }
  } catch (error) {
    console.error('Dashboard load failed:', error)
    throw error
  }
}
```

---

## Performance Considerations

- **Lazy loading:** Load below-fold components on demand
- **Caching:** Cache API responses for 5-30 seconds
- **Pagination:** Show top 10 domains, allow "show all"
- **Virtualization:** Use for large lists (if needed)
- **Skeleton loaders:** Show while data loads
- **Error boundaries:** Graceful failure of components
- **Debouncing:** Filter/sort changes
- **Service worker:** Cache static assets

---

## Testing Strategy

### Unit Tests
- Component rendering with various props
- Score color calculation
- Status badge assignment
- Trend direction detection

### Integration Tests
- Dashboard loads all data
- API errors handled gracefully
- Components update when data changes
- Refresh works correctly

### E2E Tests
- User can view full dashboard
- Click domain → drill-down works
- Export to PDF works
- Real-time updates work

### Performance Tests
- Dashboard loads in <2 seconds
- 30-day chart renders in <500ms
- 1000 controls handled efficiently
- Memory usage <100MB

---

## Accessibility (WCAG 2.1 AA)

- ✅ Proper heading hierarchy
- ✅ Alt text for charts
- ✅ Color not only indicator of status (use text + icons)
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ ARIA labels
- ✅ Tab order logical
- ✅ Contrast ratios ≥4.5:1

---

## Documentation

**For developers:**
- Component prop types
- API integration guide
- Styling conventions
- Testing patterns

**For users:**
- Dashboard guide
- Metric definitions
- How to interpret scores
- Recommendations guide

---

## Deployment Plan

1. **Development:** Feature branches for each component
2. **Testing:** Full QA on staging environment
3. **Review:** Code review + UX review
4. **Staging:** Deploy to staging, final testing
5. **Production:** Blue-green deployment
6. **Monitoring:** Error tracking + performance monitoring

---

## Success Metrics

✅ Dashboard loads in <2 seconds
✅ All charts render correctly
✅ Mobile responsive (tested on 3+ devices)
✅ 90%+ test coverage
✅ <0.5% error rate
✅ User can complete all primary tasks
✅ Accessibility audit passes (WCAG 2.1 AA)
✅ Performance budget met

---

## Next Phases

**Phase 3 (Advanced Features):**
- Control drill-down modals
- Custom date ranges
- PDF/CSV export
- Scheduled reports
- Alerting system
- User preferences

**Phase 4 (Intelligence):**
- AI-powered recommendations
- Anomaly detection
- Predictive scoring
- Remediation workflows
- Integration with ticketing

---

## Timeline Summary

| Week | Deliverable | Status |
|------|-------------|--------|
| **1** | 8 components + main dashboard | 📋 |
| **2** | Polish, testing, deployment | 📋 |
| **Total** | Full Phase 2 complete | 📋 |

---

**Next Step:** Create dashboard components

Start with compliance-score-card.js and framework-comparison.js
