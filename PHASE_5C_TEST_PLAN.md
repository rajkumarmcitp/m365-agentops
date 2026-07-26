# Phase 5c: Compliance Drift - Integration & Testing Plan

**Objective:** Verify end-to-end compliance drift system works correctly with no regressions

**Test Date:** 2026-07-26  
**Tester:** QA  
**Status:** IN PROGRESS  

---

## Part 1: Backend API Testing

### Test 1.1: Fetch Open Drifts
```bash
GET /api/tenantguard/compliance/drifts
Expected: { success: true, data: [] }  (initially empty)
```
- ✓ Response format correct
- ✓ Empty array returned
- ✓ No errors in console

### Test 1.2: Fetch Compliance Stats
```bash
GET /api/tenantguard/compliance/stats
Expected: { success: true, data: { totalControlsMonitored, openDrifts, ... } }
```
- ✓ Shows 38 controls monitored (from normalized-controls)
- ✓ openDrifts: 0 initially
- ✓ Stats structure complete

### Test 1.3: Backend Agent Initialization
```
On server startup:
- ✓ Compliance Drift Agent initialized
- ✓ Monitoring starts every 15 minutes
- ✓ Database tables created
- ✓ Event bus integration ready
```

---

## Part 2: Frontend Integration Testing

### Test 2.1: Zero Trust Page Loads Drifts
```
Steps:
1. Open http://localhost:5173/app
2. Navigate to Zero Trust page
3. Wait for data to load

Expected:
- ✓ Drifts loaded in background
- ✓ complianceDrifts map populated
- ✓ No UI errors or console errors
```

### Test 2.2: Control Display Without Drifts
```
Steps:
1. View a control without active drift
2. Check control row rendering

Expected:
- ✓ Normal background (no red)
- ✓ No 🚨 badge
- ✓ No "Click to view drift" text
- ✓ Status icon shows correctly
```

### Test 2.3: Control Display With Drift Alert
```
Steps:
1. Backend creates test drift (via API or manual)
2. Refresh Zero Trust page
3. Find control with drift

Expected:
- ✓ Red background (#FCE8E8)
- ✓ 🚨 DRIFT badge shown
- ✓ Hover effect highlights row
- ✓ "Click to view drift" text shows
- ✓ Cursor changes to pointer
```

---

## Part 3: Drift Modal Workflow Testing

### Test 3.1: Open Drift Modal
```
Steps:
1. Click on control with active drift
2. Wait for modal to load

Expected:
- ✓ Modal appears with semi-transparent backdrop
- ✓ Modal header: "🚨 Compliance Drift Detected"
- ✓ Close button (×) visible
- ✓ All sections load correctly
```

### Test 3.2: Display Drift Information
```
Modal should show:
- ✓ Control ID
- ✓ Drift detection timestamp + time ago
- ✓ Changed by (if from audit log)
- ✓ Drift type (disabled/deleted/modified)
- ✓ Expected value
- ✓ Actual value
```

### Test 3.3: Display Remediation Recommendation
```
Modal should show:
- ✓ Title of recommendation
- ✓ Description
- ✓ Why it's important
- ✓ Estimated effort
- ✓ Numbered steps with actions
- ✓ External links [Open] where applicable
- ✓ Approval status badge
```

### Test 3.4: Display Drift History Timeline
```
Modal should show:
- ✓ Timeline with colored dots
- ✓ Detection timestamps
- ✓ Resolution timestamps (if resolved)
- ✓ Resolution method
- ✓ Resolved by (admin email)
- ✓ Correct time-ago formatting
```

---

## Part 4: Approval Workflow Testing

### Test 4.1: Approve Recommendation (PENDING → APPROVED)
```
Steps:
1. Open drift modal with PENDING recommendation
2. Click [✓ Approve] button
3. Enter optional notes (or skip)
4. Confirm

Expected:
- ✓ Notes prompt appears
- ✓ API call sent to approve endpoint
- ✓ Toast notification: "Recommendation approved"
- ✓ Modal closes
- ✓ Drifts reloaded
- ✓ Database updated with approval
```

### Test 4.2: Reject Recommendation (PENDING → REJECTED)
```
Steps:
1. Open drift modal with PENDING recommendation
2. Click [✗ Reject] button
3. Enter reason
4. Confirm

Expected:
- ✓ Reason prompt appears
- ✓ API call sent to reject endpoint
- ✓ Toast notification: "Recommendation rejected"
- ✓ Modal closes
- ✓ Drifts reloaded
- ✓ Database updated with rejection
```

### Test 4.3: View Approved Recommendation
```
Steps:
1. After approval, open drift modal again
2. Check recommendation status

Expected:
- ✓ Status badge shows: "APPROVED by [admin email]"
- ✓ [Approve] and [Reject] buttons gone
- ✓ [✓ Mark Resolved] button visible
- ✓ Text area for notes visible
```

---

## Part 5: Manual Resolution Workflow

### Test 5.1: Mark Drift as Resolved
```
Steps:
1. Open drift modal with APPROVED recommendation
2. Admin goes to Azure AD (external) and fixes setting
3. Return to Zero Trust page
4. Open drift modal again
5. Type note in text area: "Fixed - enabled MFA policy"
6. Click [✓ Mark Resolved]

Expected:
- ✓ API call sent with notes
- ✓ Toast notification: "Drift marked as resolved"
- ✓ Modal closes
- ✓ Drifts reloaded
- ✓ Database updated: drift_resolved_at set, resolution_method = 'manual_approval'
- ✓ Timeline updated with new resolution entry
```

### Test 5.2: Auto-Detection of Resolution
```
Steps:
1. Drift is open (status = FAIL)
2. Admin fixes setting in Azure AD
3. Trigger compliance check manually (or wait 15 min)
4. Control now returns PASS
5. Check drift status

Expected:
- ✓ Agent detects control now passes
- ✓ Auto-creates resolution record
- ✓ Drift marked resolved: resolution_method = 'auto_detected'
- ✓ No admin approval needed
- ✓ Timeline shows: "✓ Resolved (auto-detected)"
```

### Test 5.3: Drift History Timeline Updates
```
After resolution, timeline should show:
- ✓ New entry at bottom
- ✓ Green dot (🟢) for resolved
- ✓ Timestamp of resolution
- ✓ Method (auto_detected | manual_approval)
- ✓ Admin email if manual
- ✓ Correct time-ago formatting
```

---

## Part 6: Edge Cases & Error Handling

### Test 6.1: No Drifts for Control
```
Steps:
1. Click control with no active drift
2. Wait

Expected:
- ✓ Alert shows: "No drifts for this control"
- ✓ No modal opens
- ✓ No errors in console
```

### Test 6.2: Network Error Handling
```
Steps:
1. Stop backend server
2. Try to open drift modal
3. Observe error handling

Expected:
- ✓ Toast error notification
- ✓ Graceful degradation
- ✓ No white screen or console crash
- ✓ Modal closes safely
```

### Test 6.3: Modal Close Scenarios
```
Steps:
1. Click [×] button
2. Click backdrop outside modal
3. Press ESC (if implemented)

Expected:
- ✓ Modal closes
- ✓ No unsaved changes lost (approval/rejection not sent)
- ✓ Page state preserved
```

### Test 6.4: Multiple Drifts per Control
```
If control has multiple drifts:
1. Open modal
2. Check which drift is shown

Expected:
- ✓ Most recent drift shown
- ✓ History timeline shows all drifts
- ✓ Navigation works correctly
```

### Test 6.5: Concurrent Actions
```
Steps:
1. Open 2 modals (if possible)
2. Approve in one while other is open
3. Observe consistency

Expected:
- ✓ No race conditions
- ✓ Reload handles concurrent updates
- ✓ Toast notifications clear
```

---

## Part 7: Data Integrity Testing

### Test 7.1: Audit Trail Verification
```
After each action (approve/reject/resolve):
Check database tables:
- compliance_recommendations: approval_status, approved_by, approved_at
- compliance_drifts: drift_resolved_at, resolution_method, resolved_by
- compliance_checks: check results logged

Expected:
- ✓ All timestamps accurate (within 1 second)
- ✓ Admin email captured correctly
- ✓ No data loss
- ✓ Chronological order preserved
```

### Test 7.2: Statistics Accuracy
```
After creating/resolving drifts:
GET /api/tenantguard/compliance/stats

Expected:
- ✓ openDrifts count accurate
- ✓ resolvedDrifts count accurate
- ✓ Breakdown by type correct
- ✓ Breakdown by severity correct
- ✓ Average resolution time calculated
```

### Test 7.3: Event Bus Integration
```
When drift events published:
- COMPLIANCE_VIOLATION
- REMEDIATION_APPROVED
- DRIFT_MANUALLY_RESOLVED

Expected:
- ✓ Events logged in event log
- ✓ Orchestrator receives events
- ✓ Can be queried via /api/orchestrator/events
```

---

## Part 8: UI/UX Testing

### Test 8.1: Responsive Design
```
Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

Expected:
- ✓ Modal fits screen
- ✓ All text readable
- ✓ Buttons clickable on touch
- ✓ No overflow or truncation
```

### Test 8.2: Color & Visual Hierarchy
```
Visual elements should be:
- ✓ Drift badge clearly visible (#A32D2D red)
- ✓ Status icons consistent
- ✓ Timeline dots clear
- ✓ Button states distinct (hover/active/disabled)
```

### Test 8.3: Accessibility
```
Check:
- ✓ Focus management (tab through modal)
- ✓ Color not only indicator (has text)
- ✓ Semantic HTML
- ✓ ARIA labels (if applicable)
```

### Test 8.4: Performance
```
Measure:
- ✓ Modal open time < 500ms
- ✓ Approval/rejection < 2s
- ✓ No lag on scroll/interaction
- ✓ No memory leaks (open/close multiple times)
```

---

## Part 9: Production Readiness Checklist

### Code Quality
- ✓ No console errors or warnings
- ✓ No unused variables or functions
- ✓ Error handling complete
- ✓ Code follows project style guide
- ✓ Comments clear and minimal

### Documentation
- ✓ API endpoints documented
- ✓ Client functions documented
- ✓ Modal workflows documented
- ✓ Database schema documented
- ✓ Testing guide complete (this doc)

### Security
- ✓ No XSS vulnerabilities (sanitize user input if any)
- ✓ No CSRF issues
- ✓ Admin email capture safe
- ✓ Notes/reasons properly escaped

### Performance
- ✓ API calls optimized
- ✓ Frontend rendering efficient
- ✓ Modal doesn't block UI
- ✓ Large drift histories handled

### Browser Support
- ✓ Chrome ✓
- ✓ Firefox ✓
- ✓ Safari ✓
- ✓ Edge ✓

---

## Test Results Summary

### Backend (Part 1)
| Test | Status | Notes |
|------|--------|-------|
| 1.1 | ⏳ PENDING | |
| 1.2 | ⏳ PENDING | |
| 1.3 | ⏳ PENDING | |

### Frontend Integration (Part 2)
| Test | Status | Notes |
|------|--------|-------|
| 2.1 | ⏳ PENDING | |
| 2.2 | ⏳ PENDING | |
| 2.3 | ⏳ PENDING | |

### Modal Workflow (Part 3)
| Test | Status | Notes |
|------|--------|-------|
| 3.1 | ⏳ PENDING | |
| 3.2 | ⏳ PENDING | |
| 3.3 | ⏳ PENDING | |
| 3.4 | ⏳ PENDING | |

### Approval Workflow (Part 4)
| Test | Status | Notes |
|------|--------|-------|
| 4.1 | ⏳ PENDING | |
| 4.2 | ⏳ PENDING | |
| 4.3 | ⏳ PENDING | |

### Resolution Workflow (Part 5)
| Test | Status | Notes |
|------|--------|-------|
| 5.1 | ⏳ PENDING | |
| 5.2 | ⏳ PENDING | |
| 5.3 | ⏳ PENDING | |

### Edge Cases (Part 6)
| Test | Status | Notes |
|------|--------|-------|
| 6.1 | ⏳ PENDING | |
| 6.2 | ⏳ PENDING | |
| 6.3 | ⏳ PENDING | |
| 6.4 | ⏳ PENDING | |
| 6.5 | ⏳ PENDING | |

### Data Integrity (Part 7)
| Test | Status | Notes |
|------|--------|-------|
| 7.1 | ⏳ PENDING | |
| 7.2 | ⏳ PENDING | |
| 7.3 | ⏳ PENDING | |

### UI/UX (Part 8)
| Test | Status | Notes |
|------|--------|-------|
| 8.1 | ⏳ PENDING | |
| 8.2 | ⏳ PENDING | |
| 8.3 | ⏳ PENDING | |
| 8.4 | ⏳ PENDING | |

### Production Readiness (Part 9)
| Area | Status | Notes |
|------|--------|-------|
| Code Quality | ⏳ PENDING | |
| Documentation | ⏳ PENDING | |
| Security | ⏳ PENDING | |
| Performance | ⏳ PENDING | |
| Browser Support | ⏳ PENDING | |

---

## Issues Found

(None yet - testing in progress)

---

## Sign-Off

- Tester: _______________
- Date: _______________
- Status: ☐ PASS ☐ FAIL ☐ BLOCKED
- Known Issues: _______________
- Ready for Production: ☐ YES ☐ NO
