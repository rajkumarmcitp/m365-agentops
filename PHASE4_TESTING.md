# Phase 4: Service Health Integration - End-to-End Testing

## Test Scenarios

### Scenario 1: Fresh Start (No SharePoint Configured)
**Expected Behavior:** Service Health shows demo data, refresh button available

**Steps:**
1. Launch app
2. Login as any user
3. Navigate to Service Health page
4. ✅ Should show demo messages (Exchange, Teams, SharePoint, Entra)
5. ✅ Filters should work
6. ✅ Click message → detail panel shows
7. ✅ Admin Actions form editable but not saved to DB

**Verification Points:**
- [ ] Service Health page loads without errors
- [ ] Demo data displays correctly
- [ ] Filters work (service, status, severity, search)
- [ ] Message detail panel opens on click
- [ ] Admin Actions form fields editable
- [ ] Console shows "[Messages] Service Health not configured, using demo data"

---

### Scenario 2: Admin Configure SharePoint
**Expected Behavior:** Admin sets up SharePoint list for Service Health

**Steps:**
1. Login as Admin or Super Admin
2. Navigate to Settings
3. Find "Service Health Messages Configuration" section
4. Enter SharePoint Site URL: `root` (or `/sites/ServiceHealth`)
5. Click "Test" button
6. ✅ Should show "✓ Connected! Site: root"
7. Click "Create Service Health List" button
8. ✅ Should show "✓ Service Health list created successfully"
9. Configuration details display: Site ID, List ID, 14 columns created

**Verification Points:**
- [ ] Settings page loads configuration section
- [ ] Test button validates connection
- [ ] Test button shows success with site name
- [ ] Create button initializes list
- [ ] Status shows "Creating lists and fields..."
- [ ] Success shows "✓ Service Health list created successfully"
- [ ] Configuration details appear with Site ID and List ID
- [ ] Copy button copies configuration
- [ ] Settings saved to state (serviceHealthSiteUrl, siteId, listId)

---

### Scenario 3: First Login After Configuration
**Expected Behavior:** App initializes sync service and starts hourly sync

**Steps:**
1. Admin configured SharePoint (Scenario 2 complete)
2. Logout from admin account
3. Login as Super Admin (Aisha Raza) or Admin (Demo Account)
4. ✅ Should see "[Service Health] Initializing sync service..." in console
5. Navigate to Service Health page
6. ✅ Should show demo data OR real data if sync completed
7. Check browser console for "[Service Health] ✓ Sync service initialized and running"

**Verification Points:**
- [ ] initializeServiceHealth() called after login
- [ ] Console shows "Initializing sync service..."
- [ ] Service Health manager imports correctly
- [ ] State has siteId and listId from previous setup
- [ ] Sync service starts (1-hour interval begins)
- [ ] Service Health page loads successfully
- [ ] Console shows "✓ Sync service initialized and running"
- [ ] Messages page shows data (demo or real)

---

### Scenario 4: Service Health Page with Real Data
**Expected Behavior:** Page displays messages from sync service

**Steps:**
1. Service Health configured and initialized (Scenario 3 complete)
2. Navigate to Service Health page
3. ✅ See message list on left (compact cards)
4. ✅ Right panel shows "Select a message to view details"
5. Click first message card
6. ✅ Right panel updates with message details
7. Summary section shows icon, title, ID, severity, status
8. Admin Actions form shows:
   - Review Status dropdown
   - Assign To field
   - Set Deadline field
   - Notes textarea
   - Save Changes button

**Verification Points:**
- [ ] Messages load from isServiceHealthInitialized() check
- [ ] Left panel shows compact message cards
- [ ] Color-coded status indicators (red/orange/green border)
- [ ] Click message → highlights and shows detail panel
- [ ] Detail panel shows all fields correctly
- [ ] Admin Actions form is editable
- [ ] Form fields pre-populate with current values
- [ ] Save button has visual feedback

---

### Scenario 5: Filter Messages
**Expected Behavior:** Filters work correctly with real/demo data

**Steps:**
1. Service Health page loaded with messages (Scenario 4)
2. Filter by Service: "Exchange Online"
3. ✅ Should show only Exchange messages
4. Filter by Status: "Resolved"
5. ✅ Should show only resolved messages
6. Filter by Severity: "High"
7. ✅ Should show only high-severity messages
8. Search: type "delay"
9. ✅ Should show messages matching "delay"

**Verification Points:**
- [ ] Service dropdown filters work
- [ ] Status dropdown filters work
- [ ] Severity dropdown filters work
- [ ] Search field filters in real-time
- [ ] Multiple filters combine (AND logic)
- [ ] Clear all filters → shows all messages
- [ ] Filtered count updates

---

### Scenario 6: Manual Refresh
**Expected Behavior:** Refresh button triggers sync and reloads data

**Steps:**
1. Service Health page loaded (Scenario 4)
2. Click "Refresh" button
3. ✅ Button shows spinner and "Refreshing..."
4. ✅ Button disabled during refresh
5. Wait for completion (1-2 seconds)
6. ✅ Button returns to normal state
7. Messages may update if new data synced

**Verification Points:**
- [ ] Refresh button disables when clicked
- [ ] Shows spinner + "Refreshing..." text
- [ ] Calls refreshServiceHealth() if initialized
- [ ] Calls loadMessages() after sync
- [ ] Button re-enables after completion
- [ ] Button text returns to "Refresh"
- [ ] No console errors during refresh

---

### Scenario 7: Admin Actions (Save Changes)
**Expected Behavior:** Editing and saving message updates

**Steps:**
1. Service Health page with message selected (Scenario 4)
2. Edit message fields:
   - Change Review Status to "Reviewed"
   - Enter Assign To: "john.smith@contoso.com"
   - Set Deadline: pick a date
   - Add Notes: "Investigating issue"
3. Click "Save Changes" button
4. ✅ Button shows "✓ Saved!" with green background
5. Wait 2 seconds
6. ✅ Button returns to "Save Changes"

**Verification Points:**
- [ ] All form fields are editable
- [ ] Review Status dropdown has options: Pending Review, Reviewed
- [ ] Assign To field accepts text input
- [ ] Deadline field is a date picker
- [ ] Notes textarea expandable
- [ ] Save button click calls update API
- [ ] Success feedback shows
- [ ] Changes persist in local cache
- [ ] Form populated correctly for next selection

---

### Scenario 8: Hourly Sync Background Job
**Expected Behavior:** Service automatically syncs every 60 minutes

**Steps:**
1. Service Health configured and running (Scenario 3+)
2. Check browser console for sync start message
3. ✅ Should see "[Service Health Sync] Service started. Next sync in 60 minutes."
4. Look for logs like:
   - "[Service Health Sync] Running scheduled sync..."
   - "[Service Health Sync] ✓ Successfully synced X messages..."
5. Service Health page auto-refreshes when sync completes

**Verification Points:**
- [ ] startHourlySync() called on initialization
- [ ] syncInterval set to 60*60*1000 (3600000 ms)
- [ ] Console logs sync start
- [ ] Periodic logs show sync completion
- [ ] Service Health page auto-refreshes on sync
- [ ] Message count updates if changed
- [ ] No errors during scheduled syncs

---

### Scenario 9: Fallback to Demo Data
**Expected Behavior:** If SharePoint not configured, show demo data

**Steps:**
1. Fresh app load without any SharePoint configuration
2. Navigate to Service Health
3. ✅ Should show demo messages:
   - Exchange Online: Delays in Email Delivery
   - Microsoft Teams: Meeting Join Failures
4. All functionality works (filters, detail panel, etc.)
5. Console shows "[Messages] Service Health not configured, using demo data"

**Verification Points:**
- [ ] isServiceHealthInitialized() returns false
- [ ] loadMessages() loads SVC_HEALTH demo data
- [ ] Demo messages display correctly
- [ ] All filters work with demo data
- [ ] Detail panel works with demo data
- [ ] Save Changes available but not persisted
- [ ] Refresh button works but doesn't change data

---

### Scenario 10: Error Handling
**Expected Behavior:** Graceful handling of configuration/sync errors

**Steps:**
1. Admin tries to configure with invalid SharePoint URL
2. Click "Test" button with bad URL
3. ✅ Status shows error message
4. Try to initialize list
5. ✅ Status shows error
6. Fallback: Service Health page still works with demo data

**Verification Points:**
- [ ] Test button catches errors gracefully
- [ ] Error message displayed to user
- [ ] No unhandled exceptions in console
- [ ] App continues to function
- [ ] Demo data available as fallback
- [ ] Retry is possible

---

## Integration Checklist

### Files & Imports
- [ ] `app.js` imports `service-health-manager.js`
- [ ] `pages/messages.js` imports manager functions
- [ ] `lib/service-health-sync.js` exists and exports functions
- [ ] `lib/graph-sharepoint.js` exists and exports functions
- [ ] All imports resolve correctly (no 404s)

### App Startup
- [ ] `initializeServiceHealth()` called in `doLogin()`
- [ ] `initializeServiceHealth()` called in `doLoginWithEntraID()`
- [ ] Service Health settings added to state
- [ ] No errors during initialization

### Settings Page
- [ ] Service Health configuration card displays
- [ ] Test connection button works
- [ ] Create list button works
- [ ] Status messages display correctly
- [ ] Configuration saved to state

### Service Health Page
- [ ] Page renders without errors
- [ ] Left panel (filters + list) loads
- [ ] Right panel (detail) loads
- [ ] Demo data shows if not configured
- [ ] Real data shows if configured
- [ ] All filters work
- [ ] Detail panel functionality complete

### Sync Service
- [ ] Initializes on app login
- [ ] Starts 60-minute interval
- [ ] Manual refresh works
- [ ] Events dispatch correctly
- [ ] Page auto-refreshes on sync

### Backward Compatibility
- [ ] Demo data still works
- [ ] App functions without SharePoint
- [ ] No breaking changes to other pages
- [ ] All existing features intact

---

## Test Results Summary

| Scenario | Status | Notes |
|----------|--------|-------|
| 1. Fresh Start | ⏳ | Testing demo data flow |
| 2. Admin Configure | ⏳ | Testing Settings panel |
| 3. First Login After Config | ⏳ | Testing initialization |
| 4. Real Data Display | ⏳ | Testing Service Health page |
| 5. Filtering | ⏳ | Testing filter logic |
| 6. Manual Refresh | ⏳ | Testing refresh button |
| 7. Admin Actions | ⏳ | Testing form save |
| 8. Hourly Sync | ⏳ | Testing background job |
| 9. Fallback Mode | ⏳ | Testing demo data fallback |
| 10. Error Handling | ⏳ | Testing error scenarios |

---

## Known Limitations

1. **Backend API** - Currently returns mock data (no real SharePoint calls)
2. **Graph API** - Not fully integrated (would need real credentials)
3. **Hourly Sync** - 60-minute interval (can test with shorter interval in dev)
4. **Persistence** - Changes saved to memory cache, not SharePoint (yet)

---

## Next Steps After Verification

1. ✅ Verify all scenarios pass
2. ✅ Check console for errors/warnings
3. ✅ Validate UI/UX flow
4. ✅ Test on different browsers/devices
5. ⏳ Deploy to staging
6. ⏳ Configure real SharePoint site
7. ⏳ Test with real Graph API credentials
8. ⏳ Performance testing (sync with many messages)
9. ⏳ User acceptance testing (with real users)
