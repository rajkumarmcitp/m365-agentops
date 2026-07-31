# 🧪 Sprint 3 End-to-End Test Plan

**Estimated Duration:** 30-45 minutes  
**Test Environment:** http://localhost:5173  
**Date:** 2026-07-30

---

## ✅ TEST 1: Scheduler Tab (Feature #1)

### 1.1 - Navigate to Scheduler
- [ ] Click **Scheduler** tab in backup page
- **Expected:** See "Daily Full Backup" schedule card
- **Status:** PASS / FAIL

### 1.2 - Verify Default Schedule
- [ ] Check schedule displays:
  - Name: "Daily Full Backup"
  - Frequency: "Daily at 02:00"
  - Services: Exchange, SharePoint, Teams, Security, OneDrive
  - Type: Full
  - Retention: 30 days
  - Status: Active ✓
- **Expected:** All info visible and correct
- **Status:** PASS / FAIL

### 1.3 - Check Stats Cards
- [ ] Verify 3 stat cards at bottom:
  - Active Schedules: 1
  - Total Schedules: 1
  - Success Rate: 97-98%
- **Expected:** All stats show correct values
- **Status:** PASS / FAIL

### 1.4 - Manual Backup Button
- [ ] Click "Backup All Services Now" button
- **Expected:** Toast shows "🔄 Starting backup..."
- [ ] Wait 2 seconds
- **Expected:** Toast shows "✅ Backup completed successfully"
- [ ] Check stats - "Total Schedules" should still be 1
- **Status:** PASS / FAIL

### 1.5 - Create New Schedule
- [ ] Click "+ Add Schedule" button
- **Expected:** Modal appears with "⏰ New Schedule"
- [ ] Fill in:
  - Name: "Weekly Security Backup"
  - Frequency: Weekly
  - Time: 23:00
  - Type: Full
  - Services: Select 2-3 services
  - Retention: 60
- [ ] Click "✓ Save"
- **Expected:** Modal closes, toast shows "✓ Schedule created"
- [ ] Verify new schedule appears in list
- **Status:** PASS / FAIL

### 1.6 - Run Schedule Now
- [ ] Click "▶️ Run" on the new schedule
- **Expected:** Toast shows "▶️ Running: Weekly Security Backup..."
- [ ] Wait 2 seconds
- **Expected:** Toast shows "✓ Weekly Security Backup done"
- **Status:** PASS / FAIL

### 1.7 - Edit Schedule
- [ ] Click "✏️ Edit" on any schedule
- **Expected:** Modal shows current values
- [ ] Change retention to 90 days
- [ ] Click "✓ Save"
- **Expected:** Modal closes, schedule updates
- **Status:** PASS / FAIL

### 1.8 - Delete Schedule
- [ ] Click "🗑️" on the new schedule
- **Expected:** Confirmation dialog appears
- [ ] Click confirm
- **Expected:** Schedule removed, toast shows "✓ Schedule deleted"
- **Status:** PASS / FAIL

---

## ✅ TEST 2: Versioning Tab (Feature #2)

### 2.1 - Navigate to Versioning
- [ ] Click **Versioning** tab
- **Expected:** See version list with version tags (v0.0.0, v0.1.0, etc.)
- **Status:** PASS / FAIL

### 2.2 - Check Date Picker
- [ ] Verify date picker at top:
  - Input field visible
  - [Clear] button visible
  - Counter shows "X total backups"
- **Expected:** Date picker functional
- [ ] Click date picker
- **Expected:** Calendar appears
- **Status:** PASS / FAIL

### 2.3 - Test Date Filter
- [ ] Select a date from calendar
- **Expected:** Table filters to show only backups from that date
- [ ] Counter updates to "X backups on [date]"
- **Expected:** Correct count displayed
- [ ] Click [Clear] button
- **Expected:** Filter resets, counter shows "total backups" again
- **Status:** PASS / FAIL

### 2.4 - Tag a Version
- [ ] Click "🏷️ Tag" on any version
- **Expected:** Modal shows "🏷️ Tag Version [tag]"
- [ ] Change fields:
  - Version Tag: v1.0.0
  - Commit Message: "Initial production release"
  - Check "Mark as Release"
  - Tags: production, v1
- [ ] Click "✓ Save"
- **Expected:** Modal closes, version updates with new info
- [ ] Verify version shows "⭐ RELEASE" badge
- **Status:** PASS / FAIL

### 2.5 - Verify Version Details
- [ ] Check tagged version displays:
  - Version tag badge
  - Commit message
  - Resource count
  - Size (MB)
  - Created timestamp
  - Tags below message
  - Buttons: 🏷️ Tag, ↩️ Rollback
- **Expected:** All info visible
- **Status:** PASS / FAIL

### 2.6 - Rollback Version
- [ ] Click "↩️ Rollback" on any version
- **Expected:** Modal shows "↩️ Rollback to [version]"
- [ ] Verify warning shows
- [ ] Verify impact section shows resources count
- [ ] Check confirmation checkbox
- **Expected:** "↩️ Confirm" button becomes enabled
- [ ] Click "↩️ Confirm"
- **Expected:** Modal closes, toast shows "⚠️ Rolling back to [version]..."
- [ ] Wait 1 second
- **Expected:** Toast shows "✓ Rolled back successfully"
- [ ] Verify new rollback version appears in list
- **Status:** PASS / FAIL

### 2.7 - Export Versions
- [ ] Click "📥 Export" button
- **Expected:** CSV file downloads to browser
- [ ] Open CSV file
- **Expected:** Contains columns: Version, Tag, Message, Resources, Size, Created, Release
- **Status:** PASS / FAIL

### 2.8 - Stats Section
- [ ] Check bottom stats:
  - Total: Number of versions
  - Releases: Count of release-tagged versions
  - Oldest: Date of oldest version
- **Expected:** All stats correct
- **Status:** PASS / FAIL

---

## ✅ TEST 3: Audit Log Tab (Feature #3)

### 3.1 - Navigate to Audit Log
- [ ] Click **Audit Log** tab
- **Expected:** See list of audit events
- [ ] Each event shows: timestamp, action, service, status
- **Status:** PASS / FAIL

### 3.2 - Check Date Filter
- [ ] Verify date picker at top (same as Versioning)
- [ ] Select a date
- **Expected:** Audit log filters to that date
- [ ] Clear filter
- **Expected:** All events visible again
- **Status:** PASS / FAIL

### 3.3 - Filter by Action
- [ ] Click "Action" filter dropdown
- **Expected:** Shows action types (BACKUP_CREATED, BACKUP_COMPLETED, etc.)
- [ ] Select one action
- **Expected:** List filters to show only that action
- **Status:** PASS / FAIL

### 3.4 - Filter by Service
- [ ] Click "Service" filter dropdown
- **Expected:** Shows service names
- [ ] Select a service
- **Expected:** List filters to show only that service
- **Status:** PASS / FAIL

### 3.5 - Search Functionality
- [ ] Type in search box
- **Expected:** List filters in real-time
- [ ] Clear search
- **Expected:** All events visible again
- **Status:** PASS / FAIL

### 3.6 - Event Details
- [ ] Click on any event
- **Expected:** Expands to show full details:
  - Timestamp
  - Action
  - Service
  - Actor
  - Status
  - Message
  - Resource count
  - Duration
- **Status:** PASS / FAIL

### 3.7 - Export Audit Log
- [ ] Click "📥 Export" button
- **Expected:** CSV downloads
- [ ] Open CSV
- **Expected:** Contains audit event columns
- **Status:** PASS / FAIL

### 3.8 - Stats Section
- [ ] Check stats at bottom:
  - Total Events
  - Success count
  - Warning count
  - Failure count
- **Expected:** Counts match visible events
- **Status:** PASS / FAIL

---

## ✅ TEST 4: Alerts Tab (Feature #4)

### 4.1 - Navigate to Alerts
- [ ] Click **Alerts** tab
- **Expected:** See "🔔 Backup Alerts Configuration"
- **Status:** PASS / FAIL

### 4.2 - Email Alerts Configuration
- [ ] Verify email section visible with:
  - Checkbox "📧 Email Alerts"
  - Recipients field (hidden when unchecked)
  - [📧 Send Test Email] button (hidden)
- [ ] Check the email checkbox
- **Expected:** Recipients field appears
- [ ] Enter test email: `rajkumar.mcitp@gmail.com`
- [ ] Click [📧 Send Test Email]
- **Expected:** Toast shows "📧 Sending test email..."
- [ ] Wait 2 seconds
- **Expected:** Toast shows result (success or error)
- **Note:** Email requires SMTP configured
- **Status:** PASS / FAIL

### 4.3 - Slack Alerts Configuration
- [ ] Verify Slack section with:
  - Checkbox "💬 Slack Alerts"
  - Webhook URL field (hidden)
  - [💬 Send Test Slack Alert] button (hidden)
- [ ] Check Slack checkbox
- **Expected:** Webhook field appears
- [ ] Enter dummy webhook: `https://hooks.slack.com/services/TEST`
- [ ] Click [💬 Send Test Slack Alert]
- **Expected:** Toast shows "💬 Sending test Slack alert..."
- **Note:** Will fail without real webhook, which is OK
- **Status:** PASS / FAIL

### 4.4 - Teams Alerts Configuration
- [ ] Verify Teams section with:
  - Checkbox "🔵 Microsoft Teams Alerts"
  - Webhook URL field (hidden)
  - [🔵 Send Test Teams Alert] button (hidden)
- [ ] Check Teams checkbox
- **Expected:** Webhook field appears
- [ ] Enter dummy webhook: `https://outlook.webhook.office.com/webhookb2/TEST`
- [ ] Click [🔵 Send Test Teams Alert]
- **Expected:** Toast shows "🔵 Sending test Teams alert..."
- **Status:** PASS / FAIL

### 4.5 - Alert Rules
- [ ] Verify checkboxes:
  - ☑ Notify on backup completed
  - ☑ Notify on backup failed
  - ☑ Notify on schedule triggered
- [ ] Uncheck one
- **Expected:** Checkbox state changes
- **Status:** PASS / FAIL

### 4.6 - Quiet Hours
- [ ] Check quiet hours section:
  - Start Hour: 22
  - End Hour: 6
- [ ] Change start to 21
- [ ] Change end to 7
- **Expected:** Values update
- **Status:** PASS / FAIL

### 4.7 - Save Configuration
- [ ] Click [💾 Save Alert Configuration]
- **Expected:** Toast shows "✓ Alert configuration saved"
- [ ] Status message appears: "✅ Configuration saved"
- [ ] Disappears after 3 seconds
- **Status:** PASS / FAIL

### 4.8 - Verify Persistence
- [ ] Refresh page (F5)
- [ ] Navigate back to Alerts tab
- **Expected:** All settings are preserved
- **Status:** PASS / FAIL

---

## ✅ TEST 5: SharePoint Integration

### 5.1 - Page Refresh Data Persistence
- [ ] On Scheduler tab, create a new schedule
- [ ] Refresh page
- **Expected:** New schedule still visible
- **Note:** Requires SharePoint configured
- **Status:** PASS / FAIL

### 5.2 - Version Tag Persistence
- [ ] On Versioning tab, tag a version with specific message
- [ ] Refresh page
- **Expected:** Tagged version shows same tag and message
- **Status:** PASS / FAIL

### 5.3 - Audit Log Persistence
- [ ] Create an event (e.g., run backup)
- [ ] Refresh page
- [ ] Go to Audit Log tab
- **Expected:** New event is still visible
- **Status:** PASS / FAIL

### 5.4 - Cross-Tab Consistency
- [ ] Create schedule in Scheduler tab
- [ ] Go to Audit Log tab
- **Expected:** Audit event shows the schedule creation
- **Status:** PASS / FAIL

---

## ✅ TEST 6: Navigation & UI

### 6.1 - All Tabs Accessible
- [ ] Verify all tabs visible:
  - Services
  - Scheduler
  - Backup History
  - Compare Backups
  - Versioning
  - Audit Log
  - Restore Explorer
  - Alerts
- **Expected:** All 8 tabs present
- **Status:** PASS / FAIL

### 6.2 - Tab Switching
- [ ] Click each tab in sequence
- **Expected:** Content changes for each tab
- [ ] Active tab shows primary button style
- [ ] Inactive tabs show secondary style
- **Status:** PASS / FAIL

### 6.3 - Responsive Design
- [ ] Open browser DevTools (F12)
- [ ] Resize to mobile (375px width)
- **Expected:** Layout adapts, buttons stack
- [ ] Resize to tablet (768px)
- **Expected:** Layout adapts
- [ ] Resize to desktop (1920px)
- **Expected:** Layout optimal
- **Status:** PASS / FAIL

### 6.4 - Toast Notifications
- [ ] Perform actions that trigger toasts:
  - Create schedule → ✓ Schedule created
  - Save config → ✓ Configuration saved
  - Run backup → ✅ Backup completed
- **Expected:** Toast appears, auto-dismisses after 3s
- **Status:** PASS / FAIL

---

## ✅ TEST 7: Error Handling

### 7.1 - Required Fields Validation
- [ ] Try to create schedule without selecting services
- **Expected:** Toast shows "Select at least one service"
- **Status:** PASS / FAIL

### 7.2 - Invalid Dates
- [ ] Try to select future date in date picker (if blocked)
- **Expected:** Behavior is sensible
- **Status:** PASS / FAIL

### 7.3 - Network Errors (Optional)
- [ ] Disconnect internet temporarily
- [ ] Try to save configuration
- **Expected:** Error message shows gracefully
- **Status:** PASS / FAIL (skipped if no network)

---

## ✅ TEST 8: Performance

### 8.1 - Page Load Time
- [ ] Open Backup page
- **Expected:** Loads in <2 seconds
- **Status:** PASS / FAIL

### 8.2 - Tab Switching Speed
- [ ] Switch between tabs
- **Expected:** Instant or <500ms
- **Status:** PASS / FAIL

### 8.3 - Data Filtering
- [ ] Filter audit log by date/action/service
- **Expected:** Filters apply instantly
- **Status:** PASS / FAIL

### 8.4 - Export Speed
- [ ] Click export CSV
- **Expected:** Downloads within 1 second
- **Status:** PASS / FAIL

---

## 📊 Test Summary

**Total Tests:** 47  
**Passed:** ___/47  
**Failed:** ___/47  
**Skipped:** ___/47

### Critical Tests (Must Pass)
- [ ] Scheduler create/edit/delete
- [ ] Versioning tag/rollback
- [ ] Audit log filtering
- [ ] Alert configuration save
- [ ] Data persistence after refresh

### High Priority Tests (Should Pass)
- [ ] Date picker filtering
- [ ] Export functionality
- [ ] Stats calculations
- [ ] Test email/Slack/Teams buttons

### Nice to Have
- [ ] Mobile responsiveness
- [ ] Performance benchmarks
- [ ] Error handling edge cases

---

## 🎯 Overall Status

**PASS** - All critical tests passed, ready for deployment  
**PARTIAL** - Some tests failed, needs fixes  
**FAIL** - Critical features broken, not production-ready

---

## 📝 Notes

Add any issues or observations:

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## ✅ Sign-Off

- **Tested By:** [Your Name]
- **Date:** 2026-07-30
- **Environment:** Local (http://localhost:5173)
- **Status:** PASS / PARTIAL / FAIL
