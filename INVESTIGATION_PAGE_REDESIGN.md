# User Investigation Page - Redesigned Layout

## Overview

The User Investigation page has been reorganized for better analyst workflow with:
- **Risk Dashboard First** - Immediate risk assessment
- **Tabbed Interface** - Organized by investigation flow
- **Priority-Based Ordering** - Most critical information first

---

## New Layout Structure

### 1. Investigation Header (Top)
```
┌─────────────────────────────────────────────────────┐
│ User Search    Date Range    Investigate Button     │
└─────────────────────────────────────────────────────┘
```

### 2. Risk Dashboard (High Priority)
```
┌─────────────────────────────────────────────────────┐
│ 🔴 User Investigation Report                       │
│ ─────────────────────────────────────────────────  │
│ User: John Doe          Window: Last 24 Hours       │
│ Overall Risk: 75/100 [HIGH]                         │
│ [Sign-ins:3] [Devices:2] [Risk:2] [OAuth:1]...     │
│ ─────────────────────────────────────────────────  │
│ Investigation Summary                               │
│ Key Findings                                         │
│ Recommended Actions                                  │
└─────────────────────────────────────────────────────┘
```

### 3. Investigation Tabs (Organized by Category)
```
┌─────────────────────────────────────────────────────┐
│ 📋 Account Changes │ 🚨 Security Events │ 🔐 Access │ 📊 Activity
├─────────────────────────────────────────────────────┤
│ [Tab content shown here]                            │
└─────────────────────────────────────────────────────┘
```

---

## Tab Structure

### Tab 1: Account Changes (Default)
**Most Critical Investigation Data**

Shows:
- ⚡ Privilege Changes (role assignments)
- 🔐 Authentication Changes (MFA, authenticators)
- 👤 Identity Changes (password resets, enable/disable)
- ♻️ Account Lifecycle (create, delete, restore)
- 📋 License Changes

**Why First:**
- Directly answers: "What happened to this account?"
- Shows administrative modifications
- Reveals privilege escalation attempts
- Identifies account compromise indicators

---

### Tab 2: Security Events
**Threat Detection Data**

Shows:
- 🚨 Risk Detections (impossible travel, unfamiliar locations)
- 🔔 Security Alerts (account risks, policy violations)
- 📱 Sign-in Activity (locations, devices, times, outcomes)

**Why Second:**
- Shows threat detection signals
- Indicates anomalous behavior
- Links to authentication risks
- Reveals account compromise evidence

---

### Tab 3: Access & Permissions
**Authorization Level Data**

Shows:
- 👑 Directory Roles (admin roles, privileged accounts)
- 👥 Group Memberships (team assignments, access rights)
- 🔑 OAuth Permissions (third-party app access)
- 🔓 Authentication Methods (MFA status, security keys)
- 📱 Enterprise Applications (app ownership)

**Why Third:**
- Shows what user can access
- Reveals privilege levels
- Indicates third-party integrations
- Helps assess authorization scope

---

### Tab 4: Activity Details
**Extended Investigation Data**

Shows:
- 💻 Devices Used (registered, managed devices)
- 📲 Application Access (Teams, SharePoint, Exchange, etc.)
- 📧 Mailbox Settings (forwarding, delegates)
- ⚠️ Risky User Status (Azure AD risk level)
- 📋 Audit Actions (legacy audit logs)
- 👤 Actions on Other Accounts (user performed actions)
- 📅 Risk Timeline (event sequence)

**Why Last:**
- Supporting contextual data
- Helps correlate incidents
- Provides timeline view
- Offers deep dive details

---

## Investigation Workflow

### Analyst's Natural Flow

1. **See Risk Dashboard First**
   - Get instant risk assessment
   - Understand verdict (normal, suspicious, compromise)
   - See key findings

2. **Check Account Changes Tab**
   - Answer: "What happened to this account?"
   - Identify privilege escalation
   - Spot unauthorized modifications

3. **Check Security Events Tab (if risk is high)**
   - Find threat indicators
   - Correlate with sign-in events
   - Identify attack patterns

4. **Check Access & Permissions Tab (if suspicious)**
   - Verify authorization scope
   - Check for unexpected roles/permissions
   - Review OAuth applications

5. **Check Activity Details Tab (for full context)**
   - Build complete picture
   - Create timeline
   - Document for incident report

---

## Visual Improvements

### Risk Dashboard (Prominent)
```
┌─────────────────────────────────────┐
│         RISK ASSESSMENT             │
├─────────────────────────────────────┤
│ ⚠️  SUSPICIOUS ACTIVITY (75/100)    │
│                                     │
│ This account shows signs of:        │
│  • Privilege escalation             │
│  • Geographic anomaly               │
│  • New OAuth consent                │
│                                     │
│ Recommended Actions:                │
│  → Review role assignments          │
│  → Verify OAuth applications        │
│  → Check sign-in locations          │
└─────────────────────────────────────┘
```

### Tab Navigation
```
┌─────────────────────────────────────────────────────┐
│ [📋 Account Changes] │ 🚨 Security │ 🔐 Access │ 📊 Activity
├─────────────────────────────────────────────────────┤
```
- **Active Tab:** Bold, underlined, primary color
- **Inactive Tabs:** Gray text
- **Hover:** Show preview

### Content Sections
- Clean card layout
- Clear icons and labels
- Color-coded severity
- Organized data tables

---

## Usability Benefits

### For Security Analysts

1. **Faster Threat Assessment**
   - Risk score visible immediately
   - Most critical data (account changes) first
   - Tab structure guides investigation

2. **Better Pattern Recognition**
   - Organized by threat category
   - Related data grouped together
   - Visual hierarchy shows priority

3. **Reduced Cognitive Load**
   - Focus on one category at a time
   - Less scrolling required
   - Clear investigation path

4. **Actionable Insights**
   - Verdict and recommendations at top
   - Key findings highlighted
   - Clear next steps

### For Incident Response

1. **Quick Triage**
   - Risk score answers "how serious?"
   - Verdict answers "normal or breach?"
   - Recommendations answer "what next?"

2. **Evidence Gathering**
   - All related data in one section
   - Easy to export/document
   - Chronological organization

3. **Collaboration**
   - Share with team members
   - All information in one view
   - Professional presentation

---

## Example Investigations

### Investigation 1: Suspected Privilege Escalation

**Analyst's Path:**
1. See Risk Dashboard → Risk: 85/100 (HIGH)
2. Click "Account Changes" → Find role assignments
3. Identify who assigned the role
4. Click "Security Events" → Check for risky sign-ins
5. Click "Access & Permissions" → Verify role scope
6. Document findings

**Key Data Points Found:**
- Role assigned by unauthorized admin
- High-risk sign-in from unusual location
- OAuth app granted Exchange access same day
- **Verdict:** Account Compromise Likely

---

### Investigation 2: Unusual Application Access

**Analyst's Path:**
1. See Risk Dashboard → Risk: 42/100 (MEDIUM)
2. Click "Account Changes" → No unusual modifications
3. Click "Security Events" → Check alerts
4. Click "Access & Permissions" → Review OAuth apps
5. Find suspicious third-party app
6. **Verdict:** Unauthorized App - Revoke

---

### Investigation 3: Routine Account Management

**Analyst's Path:**
1. See Risk Dashboard → Risk: 15/100 (LOW)
2. Glance at "Account Changes" → Normal modifications
3. **Verdict:** Normal Activity - Close

---

## Implementation Details

### Tab Switching Code
```javascript
function setupInvestigationTabs(el) {
  const tabs = el.querySelectorAll('.investigation-tab')
  const tabContents = el.querySelectorAll('.investigation-tab-content')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab')
      
      // Update active tab styling
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      
      // Update visible content
      tabContents.forEach(tc => tc.style.display = 'none')
      const activeContent = el.querySelector(`.investigation-tab-content[data-tab="${tabName}"]`)
      if (activeContent) activeContent.style.display = 'block'
    })
  })
}
```

### HTML Structure
```html
<div id="investigation-tabs">
  <button class="investigation-tab active" data-tab="account-changes">
    Account Changes
  </button>
  <button class="investigation-tab" data-tab="security-events">
    Security Events
  </button>
  <!-- More tabs... -->
</div>

<div class="investigation-tab-content active" data-tab="account-changes">
  <!-- Account Changes content -->
</div>
<div class="investigation-tab-content" data-tab="security-events">
  <!-- Security Events content -->
</div>
```

---

## Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Time to Risk Assessment** | Scroll through sections | Instant (Risk Dashboard) |
| **Finding Account Changes** | Down page #2 | First tab (default) |
| **Investigating Threat** | Jump between sections | Organized tabs |
| **Data Organization** | Linear/sequential | Categorized |
| **Analyst Guidance** | Self-directed | Guided workflow |
| **Mobile Experience** | Long scrolling | Tabbed (easier) |

---

## Migration Notes

- ✅ All data preserved in new structure
- ✅ All functionality maintained
- ✅ Backward compatible (same data sources)
- ✅ No data loss
- ✅ Performance optimized (lazy loading tabs)

---

## Future Enhancements

- **Saved Investigations** - Save and export findings
- **Investigation Templates** - Predefined checklists
- **Comparison View** - Compare multiple users
- **Collaboration** - Assign investigations
- **Custom Tabs** - User-configurable order
- **Bulk Analysis** - Investigate multiple users

---

## Feedback & Improvements

The new layout is designed for analyst workflow. As you use it:
- Note what works well
- Identify missing data
- Suggest tab reorganization
- Request new groupings

This is a living design that improves with usage feedback.
