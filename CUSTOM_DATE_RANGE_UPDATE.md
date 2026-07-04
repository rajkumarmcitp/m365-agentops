# Custom Date Range Feature Update

## Problem Fixed
Previously, the custom date range selector:
- Only allowed selecting a single date
- Ignored that single date and always pulled data from the last 7 days (based on "Days Back" dropdown)
- The "Days Back" option should only apply when custom date range is NOT set

## Solution Implemented

### 1. UI Changes
Updated the custom date range selector from a single date input to a proper date range selector:

**Before:**
```html
<input type="date" id="custom-date" class="form-input">
```

**After:**
```html
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
  <div>
    <label>Start Date</label>
    <input type="date" id="custom-start-date" class="form-input">
  </div>
  <div>
    <label>End Date</label>
    <input type="date" id="custom-end-date" class="form-input">
  </div>
</div>
```

### 2. Logic Changes
Updated the investigation logic to properly handle date selection:

```javascript
// Check if custom date range is set
const customStartDate = customStartDateInput.value
const customEndDate = customEndDateInput.value

let dateStr, endDateStr

if (customStartDate && customEndDate) {
  // Use custom date range (BOTH dates required)
  dateStr = customStartDate
  endDateStr = customEndDate
} else if (customStartDate || customEndDate) {
  // If only one date is set, show error
  showToast('Please enter both start and end dates for custom range', 'warning')
  return
} else {
  // Use days back dropdown (only when custom range NOT set)
  const daysBack = parseInt(daysBackSelect.value)
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - daysBack)

  dateStr = startDate.toISOString().split('T')[0]
  endDateStr = endDate.toISOString().split('T')[0]
}
```

## Behavior

### Scenario 1: Custom Date Range Set
- If user enters **both** start and end dates
- ✅ Uses the custom date range
- ❌ Ignores the "Days Back" dropdown

### Scenario 2: Only One Date Set
- If user enters only start date OR only end date
- ❌ Shows error: "Please enter both start and end dates for custom range"
- ❌ Investigation does not proceed

### Scenario 3: No Custom Dates
- If custom date fields are empty
- ✅ Uses the "Days Back" dropdown value
- Examples:
  - "Last 7 days" → pulls data from 7 days ago to today
  - "Last 14 days" → pulls data from 14 days ago to today
  - "Last 30 days" → pulls data from 30 days ago to today

## Files Modified
- `/pages/user-investigation.js`
  - Updated HTML to show two date inputs (start and end)
  - Updated JavaScript to read both date inputs
  - Added logic to prefer custom dates, fall back to "Days Back" dropdown
  - Added validation to require both dates in custom range

## Testing

All scenarios tested and working:
- ✅ Custom date range (2026-06-01 to 2026-06-15) → uses exact dates
- ✅ Only start date → shows error
- ✅ Only end date → shows error
- ✅ No custom dates, 7 days back → calculates 7 days ago
- ✅ No custom dates, 30 days back → calculates 30 days ago

## User Experience Improvement

Before:
```
User selects: Single date = 2026-06-01
System: "Ignoring your date, pulling last 7 days instead"
Result: User confused ❌
```

After:
```
User selects: Start = 2026-06-01, End = 2026-06-15
System: "Using your custom date range"
Result: Pulls exact data for those dates ✅

OR

User leaves custom dates empty, selects "Last 7 days"
System: "Using Days Back option"
Result: Pulls last 7 days of data ✅
```

## Migration Notes
- No data migration needed
- The change is backward compatible
- Users with existing workflows will work seamlessly
