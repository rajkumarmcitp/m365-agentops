# TenantGuard UI Redesign - Professional SOC Dashboard

## Overview

The TenantGuard page has been completely redesigned with a **professional, modern SOC-grade dashboard** optimized for security administrators. The new design emphasizes clarity, threat visibility, and quick decision-making through:

- **Dynamic Risk Gauge** showing current tenant threat level (0-100)
- **Critical Alert Management** with visual priority indicators (P0-P3)
- **Attack Chain Visualization** showing multi-stage attack patterns
- **Service Impact Map** identifying affected M365 services
- **Monitoring Agent Status** displaying health of detection systems
- **Multi-view Navigation** for different operational needs

---

## New UI Layout

### 🎯 Dashboard Tab (Default View)

The main dashboard provides an at-a-glance view of tenant security posture:

```
┌─────────────────────────────────────────────────────────────────┐
│ 🛡️ TenantGuard Security Monitoring                              │
│ Real-time threat detection & attack pattern analysis            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────┐
│ TENANT RISK LEVEL: 87/100        │ CRITICAL ALERTS SUMMARY     │
│ 🔴 CRITICAL (Action Required)    │ 🚨 P0 Drop Everything: 5    │
│                                  │ 🔴 P1 Critical: 8           │
│ [Risk Gauge Visualization]       │ 🟠 P2 High: 12              │
│ ↑ 12 points since last hour     │ 🟡 P3 Medium: 3             │
└──────────────────────────────────┴──────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────┐
│ TOP ALERTS (Last 5)              │ ACTIVE ATTACK CHAINS        │
│ 1. Global Admin Assigned (P0)    │ 1. Admin Compromise Chain   │
│ 2. MFA Disabled (P1)             │    - 3 events | Score: 95   │
│ 3. OAuth Consent (P1)            │ 2. OAuth Backdoor           │
│ 4. External Forward (P2)         │    - 2 events | Score: 88   │
│ 5. Role Changed (P2)             │ 3. Policy Weakening         │
│                                  │    - 4 events | Score: 92   │
└──────────────────────────────────┴──────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────┐
│ SERVICE IMPACT MAP               │ MONITORING AGENTS            │
│ 🔴 Entra ID: 8 alerts           │ ✅ Security Agent (Healthy)  │
│ 🟠 Exchange: 5 alerts            │ ✅ Audit Collection (5min)   │
│ 🟠 SharePoint: 4 alerts          │ ✅ Correlation (15min)       │
│ 🟡 OneDrive: 2 alerts            │ ✅ Config Agent (4hrs)       │
│ 🟡 Teams: 1 alert                │ ✅ Approval Agent (2hrs)     │
└──────────────────────────────────┴──────────────────────────────┘
```

### Key Dashboard Features

#### 1. Risk Gauge
- **Dynamic SVG gauge** showing 0-100 risk score
- **Color-coded** by threat level (Red = Critical, Orange = High, Yellow = Medium, Green = Low)
- **Real-time updates** as new alerts arrive
- **Contextual message** explaining current status

#### 2. Critical Alerts Summary
- **Four-panel layout** showing alert distribution by priority
- **P0 (Drop Everything)** - Red, highest urgency
- **P1 (Critical)** - Dark Red, 15-minute response window
- **P2 (High)** - Orange, 1-hour response window
- **P3 (Medium)** - Yellow, 4-hour response window

#### 3. Top Alerts Panel
- **Last 5 most recent alerts**
- **Clickable cards** for quick investigation
- **Priority indicator** with color coding
- **Timestamp and actor** for context
- **Hover effects** showing the alert is interactive

#### 4. Active Attack Chains
- **Multi-event correlation display**
- **Chain description** explaining the attack pattern
- **Event count** and correlation score
- **Risk level indicator** (CRITICAL/HIGH)
- **Time span** showing attack duration

#### 5. Service Impact Map
- **Grid view of affected M365 services**
- **Alert count per service**
- **Color-coded status** (Red for critical issues)
- **Visual identification** of primary attack targets
- **Priority indication** (which services need attention first)

#### 6. Monitoring Agent Status
- **Health status** of all security agents
- **Last execution time** for each agent
- **Schedule information** (how often runs)
- **Quick health indicator** (✅ for healthy, ❌ for issues)

---

### 📊 Alerts Tab

Comprehensive alert management view:

```
┌─────────────────────────────────────────────────────────────────┐
│ All Alerts (28)                        [Search box]             │
│ Filters: [All] [P0] [P1] [P2] [P3]                              │
└─────────────────────────────────────────────────────────────────┘

[Alert List with full details]
- Alert Headline (truncated to 60 chars)
- Full description
- Actor / Source / Timestamp
- Priority badge (P0-P3)
- Severity badge (CRITICAL/HIGH/MEDIUM/LOW)
- Risk Score (0-100)
```

**Features:**
- Real-time search/filter capability
- Priority-based filtering
- Inline risk scores
- Clickable for detailed investigation
- Sortable by time, priority, severity

---

### ⏱️ Timeline Tab

Attack timeline visualization:

```
Visual Timeline:
         ↓ Event 1: Global Admin Assigned (15:20)
         ├→ Event 2: MFA Disabled (15:25)
         ├→ Event 3: CA Policy Disabled (15:30)
         └→ Event 4: External Forwarding (15:35)
         ↓ Event 5: Large File Download (15:40)
```

**Features:**
- Chronological alert display
- Visual timeline with colored dots
- Event details on hover
- Multi-stage attack visualization
- Attack progression tracking

---

### 🔗 Incidents Tab

Correlated incident groupings:

```
Incident 1: Admin Compromise
├ Score: 96/100 (CRITICAL)
├ Events: 4 | Type: ACTOR correlation
├ Timeline: 15:20 → 15:40 (20 minutes)
└ Description: Coordinated admin compromise with MFA bypass

Incident 2: OAuth Backdoor
├ Score: 88/100 (CRITICAL)
├ Events: 3 | Type: TARGET correlation
├ Timeline: 14:10 → 14:45 (35 minutes)
└ Description: Suspicious application with admin consent
```

**Features:**
- Auto-grouped related alerts
- Correlation score visualization
- Time span of attack
- Event count and correlation type
- Drill-down to component events

---

### 📋 Audit Tab

Compliance and audit trail view:

```
Compliance Status          Audit Trail
├ Total Alerts: 28        ✅ Audit collection: Every 5 min
├ Critical: 5             ✅ Correlation analysis: Every 15 min
├ Avg Risk Score: 82/100  ✅ Agent health: Monitoring
└ Last Refresh: 5 min ago 📊 Last refresh: 5 minutes ago

Recent Activities (Last 20):
[Activity log with timestamps]
```

**Features:**
- Alert statistics
- System health indicators
- Audit trail of events
- Compliance status
- Refresh timing information

---

## Color Scheme

Professional dark theme optimized for 24/7 monitoring:

```
Background:    #0f1419 (Deep Navy)
Surface:       #1a1f26 (Slightly lighter)
Text Primary:  #e4e8eb (Light Gray)
Text Secondary: #a0a8b0 (Medium Gray)
Borders:       #2a2f37 (Dark Gray)
Accent:        #0d6efd (Blue)

Severity Colors:
├ CRITICAL:    #ff4444 (Bright Red)
├ HIGH:        #fd7e14 (Orange)
├ MEDIUM:      #ffc107 (Yellow)
└ LOW:         #28a745 (Green)

Priority Colors:
├ P0:          #ff4444 (Bright Red)
├ P1:          #dc3545 (Dark Red)
├ P2:          #fd7e14 (Orange)
└ P3:          #ffc107 (Yellow)
```

---

## Key Features

### 1. **Dynamic Risk Gauge**
- SVG circular gauge showing 0-100 risk score
- Color transitions (Red → Orange → Yellow → Green)
- Real-time updates as alerts arrive
- Contextual status message

### 2. **Smart Alert Prioritization**
- P0: "Drop Everything" (Requires immediate action < 5 min)
- P1: Critical (Response required < 15 min)
- P2: High (Investigate < 1 hour)
- P3: Medium (Schedule < 4 hours)

### 3. **Multi-Stage Attack Visualization**
- Automatic correlation of related events
- Attack timeline showing progression
- MITRE ATT&CK stage identification
- Risk score per attack chain

### 4. **Service-Centric View**
- Identify which M365 services are under attack
- Alert distribution across services
- Quick prioritization of response efforts

### 5. **Agent Health Monitoring**
- Real-time status of security monitoring agents
- Schedule visibility (5 min, 15 min, 2-4 hours, daily)
- Ensures detection systems are functioning

### 6. **Responsive Design**
- Works on desktop, tablet, and mobile
- Auto-adjusting layouts
- Touch-friendly controls
- Optimized for continuous monitoring

---

## Navigation & Tab System

### Main Tabs
```
📊 Dashboard  | 🚨 Alerts | ⏱️ Timeline | 🔗 Incidents | 📋 Audit
```

- **Dashboard:** Overview + quick actions
- **Alerts:** Detailed alert list + search/filter
- **Timeline:** Chronological event view
- **Incidents:** Correlated attack groupings
- **Audit:** Compliance & history

### Interactions
- Click alert card → select for investigation
- Click priority filter → narrow results
- Click service tile → see related alerts
- Search box → real-time filtering
- Refresh button → manual data refresh

---

## Risk Scoring & Severity Mapping

```
Risk Score  →  Threat Level  →  Action Required
─────────────────────────────────────────────────
80-100      →  CRITICAL     →  Immediate (< 5 min)
50-79       →  HIGH         →  Urgent (< 1 hour)
20-49       →  MEDIUM       →  Soon (< 4 hours)
0-19        →  LOW          →  Monitor (track)
```

---

## Performance Optimizations

1. **Debounced Refresh:** Every 5 minutes (configurable)
2. **Lazy Loading:** Data loaded on-demand per tab
3. **Caching:** Alert data cached client-side
4. **Efficient Rendering:** React-less DOM updates
5. **Dark Theme:** Reduced battery drain on OLED displays

---

## Security Considerations

✅ All data from authenticated backend only
✅ No sensitive data in client-side storage
✅ HTTPS enforcement in production
✅ CSRF protection via backend
✅ Input validation on search/filters
✅ Rate limiting on API calls

---

## Future Enhancements

1. **Real-time Alerts:** WebSocket integration for instant updates
2. **Custom Rules:** User-defined correlation patterns
3. **Alert Actions:** One-click remediation playbooks
4. **Threat Intel:** Integration with threat feeds
5. **Export/Reporting:** PDF reports and CSV exports
6. **Mobile Alerts:** Push notifications for P0 events
7. **Team Collaboration:** Alert assignment and notes
8. **Historical Analysis:** Trend charts and metrics

---

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Implementation Notes

### File Location
- **Frontend:** `/pages/tenantguard.js`
- **Styles:** Dark theme included inline
- **Dependencies:** None (vanilla JavaScript)
- **API:** Uses existing `/api/tenantguard/*` endpoints

### Initialization
```javascript
import { initTenantGuard } from '../pages/tenantguard.js'

// In main app initialization:
initTenantGuard()
```

### Data Sources
1. Alert data: `/api/tenantguard/alerts`
2. Correlations: `/api/tenantguard/correlations`
3. Patterns: `/api/tenantguard/patterns`
4. Summaries: `/api/tenantguard/summary`

---

## Testing the New Design

### Manual Testing Checklist
- [ ] Dashboard loads with no errors
- [ ] Risk gauge displays and updates
- [ ] Alert cards are clickable
- [ ] Tab navigation works smoothly
- [ ] Search/filter functionality works
- [ ] Mobile responsiveness verified
- [ ] Dark theme renders correctly
- [ ] All 6+ monitoring agents display
- [ ] Attack chains show correlation score
- [ ] Service impact map shows all services

### Demo Mode
If no real alerts available, demo alerts are automatically loaded:
- 5 demo alerts covering P0-P2 priorities
- 2 demo attack chains
- Full service impact visualization
- All tabs functional with demo data

---

## Comparison: Old vs. New Design

### Old Design Issues
❌ Multiple nested tabs (confusing navigation)
❌ Text-heavy layout (hard to scan quickly)
❌ No visual threat level indicator
❌ Poor priority hierarchy
❌ Limited context per alert
❌ No attack chain visualization

### New Design Solutions
✅ Clear tab structure (5 main views)
✅ Visual hierarchy (dashboard first)
✅ Dynamic risk gauge (at-a-glance status)
✅ Priority-based color coding
✅ Contextual information (actor, source, time)
✅ Attack timeline and correlations
✅ Service impact map
✅ Agent health dashboard
✅ Professional dark theme
✅ Responsive layout

---

## Conclusion

The redesigned TenantGuard dashboard transforms security monitoring from a complex multi-tab interface into an intuitive, modern SOC-grade platform. Security administrators can now:

1. **Assess** tenant risk at a glance (risk gauge)
2. **Prioritize** response efforts (alert distribution)
3. **Investigate** threats quickly (alert details + timeline)
4. **Understand** attack chains (correlation visualization)
5. **Monitor** detection systems (agent health)
6. **Document** compliance (audit trail)

All within a single, professional, easy-to-understand interface optimized for 24/7 security operations.
