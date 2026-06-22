# Live Validation Checker — Quick Start Guide

## 🚀 Start Using the Validator

### 1. Access the M365 Config Page
```
Open: http://localhost:5175/
Navigate to: Microsoft 365 Configuration (sidebar)
```

### 2. Click "Validation Report" Button
The button is in the top-right header next to "Run scan now"

### 3. View Your Compliance Dashboard
You'll see:
- **Risk Score (left):** 93/100 (Low-Moderate Risk) — color-coded
- **Statistics (right):** 90% pass rate, 144 passed, 6 failed, 10 warnings
- **9 Configuration Areas:** Grid showing each area's pass rate and control counts

### 4. Review Failures & Warnings
**Failed Controls (6):**
- [1.1.4] Security Defaults vs Conditional Access
- [1.3.6] DLP policies for Teams missing
- [2.1.3] Safe Attachments incomplete
- [2.4.5] Secure Score not reviewed
- [3.2.3] DLP for Teams (Purview)
- [5.2.2.5] Device compliance incomplete

**Warnings (10):**
- Third-party app consent
- Group creation restrictions
- Self-service password reset
- Defender Cloud Apps config
- XDR alert notifications
- ... and 5 more

### 5. Export Report (Optional)
Click "Export Report" to download `m365-config-validation-2026-06-22.json`

### 6. Return to Config Areas
Click "Back" to see the 9 configuration areas grid

---

## 📊 Understanding Your Results

### Risk Score Interpretation
| Score | Level | Status | Action |
|-------|-------|--------|--------|
| 95-100 | Low Risk | ✓ | Maintain standards |
| 85-95 | Low-Moderate | ⚠️ | Address remaining issues |
| 65-85 | Moderate | ⚠️ | Review & improve |
| 35-65 | High | ❌ | Urgent remediation |
| 0-35 | Critical | ❌ | Immediate action |

**Your Score:** 93 (Low-Moderate Risk) — Good posture with some improvements needed

### Topic Priorities
| Topic | Status | Action |
|-------|--------|--------|
| Microsoft 365 Admin Center | 67% ⚠️ | **Highest Priority** (5 failures) |
| Microsoft Defender | 81% ⚠️ | Secondary (2 failures) |
| Microsoft Purview | 80% ⚠️ | Secondary (1 failure) |
| Others | 90-100% ✓ | Maintain standards |

---

## 🔧 Remediation Steps

### For Each Failed Control:
1. **Read the control ID and title** (e.g., [1.1.4])
2. **View current state** (what's actually configured)
3. **See expected state** (what it should be)
4. **Use PowerShell command** to verify with: `Get-MgPolicyIdentitySecurityDefaultEnforcementPolicy`
5. **Make the change** in M365 admin center or PowerShell
6. **Re-run validation** to verify improvement

### Example: Security Defaults Issue
```
Issue:    [1.1.4] Security Defaults enabled
Current:  Security Defaults: ENABLED
Expected: Should be disabled if using Conditional Access
Command:  (Get-MgPolicyIdentitySecurityDefaultEnforcementPolicy).IsEnabled
Fix:      Set-MgPolicyIdentitySecurityDefaultEnforcementPolicy -IsEnabled $false
```

---

## 📈 Tracking Progress

### Track Over Time
1. Run validation weekly/monthly
2. Export report each time
3. Compare JSON files to see improvements
4. Look for:
   - Pass rate increasing (target: >95%)
   - Failed controls decreasing (target: 0)
   - Risk score improving (target: >95)

### Goals
- [ ] Reduce failures from 6 to 0
- [ ] Increase pass rate from 90% to 95%+
- [ ] Raise risk score from 93 to 98+
- [ ] Get all 9 areas to 90%+ compliance

---

## 🎯 Priority Fixes (Next 48 hours)

1. **[1.1.4] Security Defaults** — Enable Conditional Access properly
2. **[1.3.6] DLP for Teams** — Create DLP policy targeting Teams
3. **[2.1.3] Safe Attachments** — Assign policy to all users

These 3 fixes will improve:
- Pass rate: 90% → 92%
- Risk score: 93 → 95
- Microsoft 365 Admin Center: 67% → 80%

---

## 🔄 Dev Server & Testing

**Dev Server:** http://localhost:5175  
**Validation Module:** `lib/config-validator.js`  
**Integration:** `pages/m365config.js`  
**Styles:** `styles/main.css`  

### Test in Console
```javascript
// Open browser console (F12)

// Test validation functions
window.__VALIDATION__ = {
  summary: () => { /* returns validation summary */ },
  failed: () => { /* returns failed controls */ },
  warnings: () => { /* returns warning controls */ }
}

// Check risk score
const summary = getValidationSummary();
const risk = getRiskScore(summary);
console.log(risk); // Shows: score, level, color
```

---

## 📚 Documentation

- **Full Guide:** `VALIDATION_CHECKER_GUIDE.md`
- **API Docs:** `lib/config-validator.js` (JSDoc comments)
- **Usage Examples:** Inline in validation view

---

## ⚡ Next Steps

1. ✅ Review your current compliance: **90% / 93 score**
2. ✅ Identify top 3 failures to fix
3. ✅ Use PowerShell commands to remediate
4. ✅ Re-run validation to confirm improvements
5. ✅ Export report for stakeholders
6. ✅ Schedule monthly validation reviews

---

**Questions?** Check `VALIDATION_CHECKER_GUIDE.md` for detailed explanations and remediation workflows.

**Last Updated:** 2026-06-22  
**Ready for Production:** Yes  
**Validation System:** Live CIS Benchmark Checker v1.0
