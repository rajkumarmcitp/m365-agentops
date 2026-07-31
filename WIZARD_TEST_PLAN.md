# 🧙 Restore Wizard - E2E Test Plan

**Tested Feature:** Sprint 2.2 & 2.3 - 7-Step Restore Wizard + Conflict Detection  
**Test Date:** 2026-07-30  
**Dev Server:** http://localhost:5173

---

## ✅ Pre-Test Checklist

- [ ] Dev server running (`npm run dev`)
- [ ] Dev server accessible at http://localhost:5173
- [ ] Browser ready (Chrome/Firefox/Safari)
- [ ] JavaScript console open (F12)

---

## 📋 Full E2E Test Flow

### **TEST 1: Launch Wizard (with Date Filter)**

1. Navigate to **http://localhost:5173**
2. Click on **Backup** in the sidebar navigation
3. You should see the Backup page with multiple tabs (Services, Backup Jobs, History, Compare Backups, Restore Explorer)
4. Click the **History** tab
5. **NEW:** Date Picker appears at the top:
   - Label: "Select Date:"
   - Date input field (calendar/date picker)
   - [Clear] button next to date input
   - Counter showing "(N backups)" or "(N backups on [date])"
   - Today's date is pre-populated by default
   - **Expected:** Date picker shows calendar on click

6. **Test Date Picker:**
   - Click on the date input field
   - Calendar picker appears (native browser date picker)
   - Select a different date from calendar
   - Table updates to show only backups from that date
   - Counter updates: "X backups on [date]"
   - Click [Clear] button to reset filter
   - Counter resets: "X total backups"
   - All backups are visible again

7. In the filtered backup history table, look for the **[Wizard]** button (green/primary button)
   - Expected: At least one backup should have a Wizard button
   - If not found: Try selecting a different date or "All Dates"

8. Click any **[Wizard]** button
9. **Verify:** A modal appears with title "🧙 Restore Wizard" and "Step 1 of 7: Choose Backup"

**✓ TEST 1A (Date Filter):** `[ ] PASS  [ ] FAIL`  
**✓ TEST 1B (Launch Wizard):** `[ ] PASS  [ ] FAIL`

---

### **TEST 2: Step 1 - Choose Backup**

**Current State:** Wizard modal is open at Step 1

1. **Verify Step 1 Title:** "Choose Backup" is displayed
2. **Verify Dropdown:** A dropdown with label "Select Backup to Restore From" exists
3. **Click the dropdown** and see a list of completed backups (should show timestamps, service names, resource counts)
4. **Select any backup** from the dropdown
5. **Verify Tip:** Text appears below dropdown saying "💡 Tip: Select a backup to restore from..."
6. **Progress Bar:** Check the progress bar at the top shows 1/7 filled (one bar filled)
7. **Navigation:** 
   - Verify [Back] button is **DISABLED** (grayed out)
   - Verify [Cancel] button is available
   - Verify [Next] button is **ENABLED** and says "Next →"

**Test Edge Case:**
- Try clicking [Next] WITHOUT selecting a backup
- Expected: Toast message appears saying "Please select a backup to continue"
- Select a backup, then click [Next]

**✓ TEST 2 RESULT:** `[ ] PASS  [ ] FAIL`

---

### **TEST 3: Step 2 - Choose Service**

**Current State:** Wizard advanced to Step 2

1. **Verify Step 2 Title:** "Choose Service" is displayed
2. **Verify Summary:** Shows "Restore from: [date] • [N] resources"
3. **Verify Services List:** A list of 6 services displayed as checkboxes with:
   - Service name (e.g., "Exchange", "SharePoint")
   - Resource count (e.g., "245 resources")
   - Checkboxes for selection
4. **Select 2-3 services** by clicking their checkboxes
   - Checkboxes should show visual feedback when checked
5. **Navigation:**
   - Verify [Back] button is now **ENABLED**
   - Verify [Next] button is enabled
6. **Step Counter:** Progress bar now shows 2/7

**Test Edge Case:**
- Try clicking [Next] WITHOUT selecting any services
- Expected: Toast message "Please select at least one service"
- Check a service, then click [Next]

**✓ TEST 3 RESULT:** `[ ] PASS  [ ] FAIL`

---

### **TEST 4: Step 3 - Choose Objects**

**Current State:** Wizard advanced to Step 3

1. **Verify Step 3 Title:** "Choose Objects" is displayed
2. **Verify Summary:** Shows list of selected services from Step 2
3. **Verify Instructions:** Checkbox section showing "✓ All objects in selected services will be restored"
4. **Verify Checkbox:** "Restore all objects in selected services" is checked by default
5. **Visual Feedback:** Can optionally toggle the checkbox on/off
6. **Step Counter:** Progress bar shows 3/7

**Expected:** This step is straightforward - just pass through
- Click [Next] to proceed to Step 4

**✓ TEST 4 RESULT:** `[ ] PASS  [ ] FAIL`

---

### **TEST 5: Step 4 - Preview Changes**

**Current State:** Wizard advanced to Step 4

1. **Verify Step 4 Title:** "Preview Changes" is displayed
2. **Verify Metrics Grid:** 2 cards showing:
   - **Left Card:** "Objects to Update" with large number "245"
   - **Right Card:** "Already Current" with large number "872"
3. **Verify Impact Warning:** Yellow/warning box showing:
   - "⚠️ Impact: 245 objects will be updated to match the backup state. 872 are already current."
4. **Step Counter:** Progress bar shows 4/7
5. **Click [Next]** - This triggers conflict detection

**Expected Behavior:**
- When you click Next, the app will:
  - Run conflict detection in the background
  - Analyze the 2-3 services you selected
  - Detect any conflicts (6 types: exists, modified, dependencies, licenses, permissions, reference loops)
  - Move to Step 5 (Conflict Detection)

**✓ TEST 5 RESULT:** `[ ] PASS  [ ] FAIL`

---

### **TEST 6: Step 5 - Conflict Detection** ⚠️ CRITICAL TEST

**Current State:** Wizard advanced to Step 5 (conflicts auto-detected)

**SCENARIO A: No Conflicts Detected** (most likely ~60-70% of runs)

1. **Verify Content:**
   - **Icon:** ✅ (green checkmark)
   - **Title:** "No Conflicts Detected"
   - **Message:** "Safe to proceed with restore"
   - **Validation List:** 4 checkmarks:
     - ✓ No resource name conflicts
     - ✓ All dependencies available
     - ✓ No permission conflicts
     - ✓ Required licenses available

2. **Step Counter:** Progress bar shows 5/7
3. **Navigation:** [Next] button enabled → Click to proceed to Step 6

**SCENARIO B: Conflicts Detected** (30-40% of runs - simulated)

1. **Verify Header:**
   - **Icon:** ⚠️ (warning icon, yellow/orange)
   - **Title:** "N Conflicts Detected" (e.g., "3 Conflicts Detected")
   - **Subtitle:** "X need resolution"

2. **Verify Conflict Grid:** First 4 conflicts shown as cards, each displaying:
   - **Resource Name** (bold, e.g., "User already exists")
   - **Service** (smaller text, e.g., "Exchange")
   - **Status Badge:** Either "🟢 Resolved" or "⚠️ Pending"
   - **Color Border:** Red (🔴) for high severity | Orange (🟡) for medium

3. **Verify Reference Section:** "Conflict Types" reference showing all 6 types:
   - Resource already exists
   - Modified after backup
   - Missing dependencies
   - Missing licenses
   - Permission conflicts
   - Reference loops

4. **Verify Buttons:**
   - **[🔧 Resolve Conflicts]** button (primary color)
   - Click it to open conflict resolution modal

5. **Conflict Resolution Modal Opens:**

   **Modal Layout:**
   - **Header:** "⚠️ Resolve Conflicts" with count "N of M conflicts need resolution"
   - **Conflict List:** Each conflict shows:
     - Resource name (bold)
     - Service name (smaller)
     - Status badge (Resolved/Pending)
     - Description of the conflict
     - Color-coded left border (red/orange per severity)
   - **Resolution Options:** For each conflict, multiple buttons:
     - ⏭️ Skip
     - ⚡ Force Overwrite
     - ✏️ Rename
     - 🔗 Update References
     - ✓ Enable Dependency
     - ✗ Disable Feature
     - ⚖️ Merge

   **Test Conflict Resolution:**
   - Click a resolution button for each conflict
   - **Expected:** Button changes color to primary (blue/selected)
   - Modal header updates: "0 of M conflicts need resolution" (count decreases)
   - Click [Continue] in modal
   - **Expected:** Toast appears (if auto-resolving), modal closes, back to Step 5

6. **After Resolution:**
   - Step 5 now shows "✅ No Conflicts Detected" (all resolved)
   - All conflicts have status "✓ Resolved"
   - Can proceed to Step 6 via [Next]

**✓ TEST 6 RESULT (No Conflicts):** `[ ] PASS  [ ] FAIL`  
**✓ TEST 6 RESULT (Conflicts):** `[ ] PASS  [ ] FAIL`

---

### **TEST 7: Step 6 - Summary & Approve**

**Current State:** Wizard advanced to Step 6

1. **Verify Step 6 Title:** "Summary & Approve" is displayed
2. **Verify Dropdown:** "Restore Reason" with 6 options:
   - -- Select reason --
   - Disaster Recovery
   - User Request
   - Testing/Validation
   - Data Recovery
   - Migration
   - Other

3. **Select a Reason:** Choose "Disaster Recovery" from dropdown
4. **Verify Summary Section:** Shows:
   - Services: [number] selected
   - Objects: 245 to update, 872 current
   - Conflicts: None detected (or X resolved)

5. **Test "Other" Reason:**
   - Change dropdown to "Other"
   - **Expected:** A textarea appears below with placeholder "Optional notes about this restore..."
   - Type some text in the notes field
   - Change dropdown back to a different reason
   - **Expected:** Textarea disappears

6. **Step Counter:** Progress bar shows 6/7
7. **Navigation:** [Next] button enabled → Click to proceed

**Edge Case:**
- Try clicking [Next] WITHOUT selecting a reason
- Expected: Toast "Please select a restore reason"
- Select a reason, then click [Next]

**✓ TEST 7 RESULT:** `[ ] PASS  [ ] FAIL`

---

### **TEST 8: Step 7 - Verification** ✅ FINAL STEP

**Current State:** Wizard advanced to Step 7

1. **Verify Step 7 Title:** "Verification" is displayed
2. **Verify Success Message:**
   - **Icon:** ✅ (green checkmark)
   - **Title:** "Restore Complete"
   - **Message:** "All changes have been applied successfully"
   - **Background:** Light green success color

3. **Verify Metrics Grid:** 2 cards:
   - **Left:** "Objects Restored" with number "245"
   - **Right:** "Duration" with time "2m 34s"

4. **Verify Validation Results:** Section showing:
   - "Validation Results:" heading (bold)
   - ✓ Configuration Exists: 245/245
   - ✓ Permissions Valid: 245/245
   - ✓ References Valid: 245/245
   - ✓ Successfully Applied: 245/245

5. **Step Counter:** Progress bar shows 7/7 (full)
6. **Final Button:** [Next] button text changes to "✓ Restore"
7. **Click [✓ Restore]:**
   - **Expected:** Modal closes
   - **Expected:** Toast appears: "✅ Restore completed successfully"
   - **Expected:** Return to Backup page

**✓ TEST 8 RESULT:** `[ ] PASS  [ ] FAIL`

---

### **TEST 9: Navigation - Back Button**

**Test from Step 7:**

1. Start at Step 7 (Verification)
2. Click [Back] button
3. **Expected:** Move to Step 6 (Summary & Approve)
4. Click [Back] again
5. **Expected:** Move to Step 5 (Conflict Detection)
6. Continue clicking [Back] through all steps
7. **Expected:** Eventually reach Step 1
8. Try clicking [Back] at Step 1
9. **Expected:** [Back] button is disabled, cannot go further back

**✓ TEST 9 RESULT:** `[ ] PASS  [ ] FAIL`

---

### **TEST 10: Cancel Functionality**

**Test from any step:**

1. Start a wizard (at any step)
2. Click [Cancel] button
3. **Expected:** Modal closes immediately
4. **Expected:** Return to Backup page (History tab)
5. No changes should be applied

**✓ TEST 10 RESULT:** `[ ] PASS  [ ] FAIL`

---

### **TEST 11: Progress Indicator**

**Observe through all steps:**

1. At Step 1: Progress bar shows 1/7 filled
2. At Step 2: Progress bar shows 2/7 filled
3. At Step 3: Progress bar shows 3/7 filled
4. Continue through all 7 steps
5. **Expected:** Progress indicator fills incrementally
6. **Expected:** Visual line/bar shows current progress clearly

**✓ TEST 11 RESULT:** `[ ] PASS  [ ] FAIL`

---

### **TEST 12: History Date Picker Filter** (NEW)

**Test Date Picker Functionality:**

1. Go to Backup → History tab
2. **Verify Date Picker UI:**
   - Label "Select Date:" is visible
   - Date input field with today's date pre-filled
   - [Clear] button next to the date input
   - Counter showing "(N total backups)"

3. **Test Date Picker:**
   - Click on the date input field
   - Native browser date picker appears (calendar)
   - Select a different date from the calendar
   - Calendar closes automatically
   - Date input updates with selected date

4. **Test Table Filtering:**
   - After selecting a date, table immediately updates
   - Table shows ONLY backups from that date
   - Counter updates to "(X backups on [date])"
   - All visible rows should have timestamps matching the selected date

5. **Test Multiple Date Selections:**
   - Select Date A from calendar → table filters
   - Click date input again, select Date B → table re-filters
   - Select Date C → table re-filters again
   - Each change should update instantly

6. **Test Clear Button:**
   - Select any date (table is filtered)
   - Click [Clear] button
   - Date input clears (becomes empty)
   - Table shows all backups again
   - Counter resets to "(N total backups)"

7. **Test Edge Cases:**
   - Select today's date → shows today's backups
   - Select a date with no backups → table shows no rows (but filtered)
   - Select a past date → shows only backups from that day

8. **Test With Wizard:**
   - Select a specific date in date picker
   - Click [Wizard] button on one of the filtered backups
   - Wizard modal should open
   - When selecting backup in Step 1, it should show the backup from the filtered date

**✓ TEST 12 (Date Picker):** `[ ] PASS  [ ] FAIL`

---

### **TEST 13: Multiple Runs**

**Repeat the full wizard 2-3 times:**

1. Complete a full wizard run (Steps 1-7)
2. Start a new wizard (click [Wizard] button again)
3. Select DIFFERENT backups/services each time
4. **Expected:** Each run starts fresh with no state carryover
5. **Expected:** Wizard behaves consistently across multiple runs
6. On second run, conflicts might be different than first run

**✓ TEST 12 RESULT:** `[ ] PASS  [ ] FAIL`

---

## 📊 Test Summary

### Checklist - Full E2E Test Results:

- [ ] Test 1: Launch Wizard (with Date Filter) - PASS
- [ ] Test 2: Step 1 (Choose Backup) - PASS
- [ ] Test 3: Step 2 (Choose Service) - PASS
- [ ] Test 4: Step 3 (Choose Objects) - PASS
- [ ] Test 5: Step 4 (Preview Changes) - PASS
- [ ] Test 6: Step 5 (Conflict Detection) - PASS
- [ ] Test 7: Step 6 (Summary & Approve) - PASS
- [ ] Test 8: Step 7 (Verification) - PASS
- [ ] Test 9: Navigation (Back Button) - PASS
- [ ] Test 10: Cancel Functionality - PASS
- [ ] Test 11: Progress Indicator - PASS
- [ ] Test 12: History Date Filter - PASS
- [ ] Test 13: Multiple Runs - PASS

### Overall Verdict:

**Total Tests:** 13  
**Passed:** [ ] / 13  
**Failed:** [ ] / 13  

**✅ WIZARD STATUS:** `[ ] PRODUCTION READY  [ ] NEEDS FIXES`

---

## 🐛 Issues Found (if any):

List any issues, bugs, or unexpected behavior discovered during testing:

1. _Issue:_ (description)  
   _Expected:_ (what should happen)  
   _Actual:_ (what actually happened)  

2. _Issue:_ (description)  
   _Expected:_ (what should happen)  
   _Actual:_ (what actually happened)  

---

## 📝 Notes:

Add any additional observations, performance notes, or UI/UX feedback:

---

## ✅ Test Sign-Off:

- **Tested By:** [Your Name]
- **Test Date:** 2026-07-30
- **Browser:** [e.g., Chrome 131]
- **Platform:** [e.g., macOS, Windows]
- **Status:** APPROVED FOR PRODUCTION / NEEDS FIXES

---

## 🎯 Expected Outcomes:

✅ All 7 wizard steps function correctly  
✅ Conflict detection works (with or without conflicts)  
✅ Conflict resolution modal appears when needed  
✅ Navigation (Back/Next/Cancel) works properly  
✅ Progress indicator updates correctly  
✅ Final restore completion shows success message  
✅ Can launch wizard multiple times without issues  

If all expected outcomes are met, **Sprint 2 is production-ready!** 🚀
