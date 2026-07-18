# Email Settings Quick Reference

**One-page quick reference for using the global email settings manager in any page.**

## Import

```javascript
import emailSettings from '../lib/email-settings-manager.js'
```

## Essential Methods

### Check Configuration

```javascript
emailSettings.isEnabled()          // → boolean
emailSettings.isConfigured()       // → boolean
emailSettings.canSendAlert('P0')   // → boolean
```

### Get Settings

```javascript
emailSettings.getSettings()        // → all settings object
emailSettings.getRecipients()      // → string array
emailSettings.getStatus()          // → status summary object
```

### Send Alert

```javascript
if (emailSettings.canSendAlert('P1')) {
  fetch('/api/tenantguard/alert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priority: 'P1',
      headline: 'Alert Title',
      description: 'Alert Details',
      severity: 'CRITICAL',
      score: 85,
      actor: 'user@example.com',
      source: 'MyPage',
      timestamp: new Date().toISOString()
    })
  })
}
```

## Common Patterns

### Pattern 1: Check Before Sending

```javascript
const alert = { priority: 'P0', ... }
if (emailSettings.canSendAlert(alert.priority)) {
  sendAlert(alert)
}
```

### Pattern 2: React to Settings Changes

```javascript
emailSettings.subscribe(settings => {
  if (settings.enabled) {
    enableAlertFeatures()
  } else {
    disableAlertFeatures()
  }
})
```

### Pattern 3: Show Configuration Status

```javascript
const { enabled, configured, recipientCount } = emailSettings.getStatus()
console.log(`Email alerts: ${enabled ? '✅' : '❌'} (${recipientCount} recipients)`)
```

### Pattern 4: Add/Remove Recipients

```javascript
emailSettings.addRecipient('new@example.com')
emailSettings.removeRecipient('old@example.com')
```

### Pattern 5: Update Thresholds

```javascript
emailSettings.setAlertThresholds({
  P0: 'immediate',
  P1: 'immediate',
  P2: 'digest',
  P3: 'digest'
})
```

## Settings Structure

```javascript
{
  enabled: false,
  provider: 'office365',
  from: 'TenantGuard@yourdomain.com',
  smtpHost: 'smtp.office365.com',
  smtpPort: 587,
  recipients: ['admin@yourdomain.com'],
  alertThresholds: {
    P0: 'immediate',
    P1: 'immediate',
    P2: 'digest',
    P3: 'digest'
  }
}
```

## Storage

- **Location**: `app-email-settings` in localStorage
- **Format**: JSON
- **Reset**: `emailSettings.reset()` or `localStorage.removeItem('app-email-settings')`

## Examples by Page Type

### Security Page
```javascript
import emailSettings from '../lib/email-settings-manager.js'

export function checkSecurityEvent(event) {
  if (event.severity === 'CRITICAL' && emailSettings.canSendAlert('P0')) {
    sendAlert({ priority: 'P0', headline: event.name, ... })
  }
}
```

### Dashboard
```javascript
const status = emailSettings.getStatus()
return status.configured ? '✅ Email alerts ready' : '⚠️ Configure email alerts'
```

### Custom Settings
```javascript
return `
  <label>
    <input type="checkbox" 
      ${emailSettings.isEnabled() ? 'checked' : ''}
      onchange="emailSettings.setEnabled(this.checked)"
    />
    Enable Email Alerts
  </label>
`
```

### Compliance Page
```javascript
if (violations.length > 0 && emailSettings.canSendAlert('P1')) {
  sendAlert({
    priority: 'P1',
    headline: `${violations.length} violations found`,
    description: violations.map(v => v.name).join(', '),
    source: 'Compliance'
  })
}
```

## Alert Priorities

| Priority | Label | When | Delivery |
|----------|-------|------|----------|
| **P0** | Drop Everything | Critical attacks | Immediate |
| **P1** | Critical | Active threats | Immediate |
| **P2** | High | Security changes | Hourly Digest |
| **P3** | Medium | General events | Daily Digest |

## Receiver/Sender Format

**Alert Object**:
```javascript
{
  priority: 'P0' | 'P1' | 'P2' | 'P3',
  headline: string,              // e.g., "MFA Disabled"
  description: string,           // Full details
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  score: 0-100,                  // Risk score
  actor: string,                 // Who did it
  source: string,                // Which page/system
  timestamp: ISO8601             // When it happened
}
```

## Error Handling

```javascript
try {
  const success = emailSettings.addRecipient(email)
  if (success) {
    console.log('✅ Recipient added')
  } else {
    console.error('❌ Invalid email or duplicate')
  }
} catch (error) {
  console.error('Error:', error)
}
```

## Testing

```javascript
// Enable alerts
emailSettings.setEnabled(true)

// Add test recipient
emailSettings.addRecipient('test@example.com')

// Send test alert
if (emailSettings.canSendAlert('P1')) {
  console.log('✅ Can send P1 alerts')
}

// View settings
console.log('Current settings:', emailSettings.getSettings())
```

## Debugging

```javascript
// Full status
console.log('Status:', emailSettings.getStatus())

// All recipients
console.log('Recipients:', emailSettings.getRecipients())

// Check specific threshold
console.log('P0 delivery mode:', emailSettings.getAlertThreshold('P0'))

// View localStorage
console.log('Stored settings:', localStorage.getItem('app-email-settings'))
```

## Best Practices

✅ Always check `canSendAlert()` before sending
✅ Use proper priority levels (P0-P3)
✅ Include complete alert metadata
✅ Handle API errors gracefully
✅ Subscribe to settings changes if UI depends on them
✅ Use async/await for backend calls

❌ Don't store credentials client-side
❌ Don't spam with unnecessary alerts
❌ Don't assume settings are always enabled
❌ Don't modify settings directly - use methods

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Settings not saving | Check localStorage available via DevTools |
| Alerts not sending | Verify `canSendAlert()` returns true |
| Settings not persisting | Clear browser data, refresh page |
| Multiple instances | Use singleton instance (already done) |
| Settings sync fail | Backend not responding - check network |

## Links

- [Full Documentation](./EMAIL_SETTINGS_USAGE.md)
- [TenantGuard Implementation](../pages/tenantguard-settings.js)
- [Email Service](../backend/services/email-service.js)
- [Alert Router](../backend/services/alert-router.js)

---

**Last Updated**: 2026-07-18
**Status**: ✅ Production Ready
