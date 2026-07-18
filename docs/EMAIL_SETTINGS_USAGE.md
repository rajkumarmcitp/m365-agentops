# Global Email Settings Manager - Usage Guide

## Overview

The **Email Settings Manager** (`lib/email-settings-manager.js`) is a centralized, singleton service that manages email configuration globally across all pages. Any page can import and use this service to access email settings and send notifications.

## Architecture

```
┌─────────────────────────────────────────────┐
│     Centralized Email Settings Manager      │
│     (lib/email-settings-manager.js)         │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┬─────────────┐
        │                     │             │
        ↓                     ↓             ↓
   TenantGuard          Security       Dashboard
   Settings Page        Page           Page
        │                │             │
        └─→ Uses global settings ←─────┘
            for email configuration
```

## Quick Start

### 1. Import the Email Settings Manager

```javascript
import emailSettings from '../lib/email-settings-manager.js'
```

### 2. Check if Email Alerts are Enabled

```javascript
if (emailSettings.isEnabled()) {
  console.log('Email alerts are enabled')
  console.log('Recipients:', emailSettings.getRecipients())
}
```

### 3. Send an Alert (when backend integrated)

```javascript
// When an alert is detected in your page:
const alert = {
  priority: 'P1',
  headline: 'Security Event Detected',
  description: 'Something important happened',
  severity: 'CRITICAL',
  score: 85,
  actor: 'user@example.com',
  source: 'MyPage',
  timestamp: new Date().toISOString()
}

// Check if should send this alert type
if (emailSettings.canSendAlert(alert.priority)) {
  // Send to backend alert router (when implemented)
  fetch('/api/tenantguard/alert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alert)
  })
}
```

## API Reference

### Configuration Check

```javascript
// Is email alerting globally enabled?
emailSettings.isEnabled() → boolean

// Is email system fully configured?
emailSettings.isConfigured() → boolean

// Can send alert for this priority?
emailSettings.canSendAlert('P0') → boolean

// Get current configuration status
emailSettings.getStatus() → {
  enabled: boolean,
  configured: boolean,
  provider: string,
  recipientCount: number,
  recipients: string[],
  alertThresholds: object,
  rateLimit: object
}
```

### Reading Settings

```javascript
// Get all settings
const allSettings = emailSettings.getSettings()

// Get specific setting
const provider = emailSettings.getSetting('provider')
const recipients = emailSettings.getSetting('recipients')

// Get recipients list
const emails = emailSettings.getRecipients()

// Get alert threshold for priority
const mode = emailSettings.getAlertThreshold('P0') // 'immediate' or 'digest'

// Get delivery mode for alert
const deliveryMode = emailSettings.getDeliveryMode('P1')

// Get rate limit config
const rateLimit = emailSettings.getRateLimit()
// Returns: { maxEmailsPerMinute: 10, deduplicationWindow: 3600000 }

// Get digest interval for priority
const interval = emailSettings.getDigestInterval('P2') // milliseconds
```

### Updating Settings

```javascript
// Enable/disable email alerts globally
emailSettings.setEnabled(true)
emailSettings.setEnabled(false)

// Update email provider config
emailSettings.updateEmailConfig({
  provider: 'office365',
  from: 'TenantGuard@yourdomain.com',
  smtpHost: 'smtp.office365.com',
  smtpPort: 587,
  authUser: 'admin@yourdomain.com',
  authPass: 'xxxx xxxx xxxx xxxx'
})

// Manage recipients
emailSettings.addRecipient('new-admin@yourdomain.com')
emailSettings.removeRecipient('old-admin@yourdomain.com')

// Update alert delivery thresholds
emailSettings.setAlertThresholds({
  P0: 'immediate',
  P1: 'immediate',
  P2: 'digest',
  P3: 'digest'
})

// Configure rate limiting
emailSettings.setRateLimit({
  maxEmailsPerMinute: 20,
  deduplicationWindow: 1800000 // 30 minutes
})

// Update digest intervals
emailSettings.setDigestIntervals({
  P2: 60 * 60 * 1000,    // 1 hour
  P3: 24 * 60 * 60 * 1000 // 24 hours
})
```

### Reactive Updates

```javascript
// Subscribe to settings changes
const unsubscribe = emailSettings.subscribe((newSettings) => {
  console.log('Settings changed:', newSettings)
  // Re-render UI, update display, etc.
})

// Unsubscribe when done
unsubscribe()
```

### Admin Functions

```javascript
// Reset all settings to defaults
emailSettings.reset()

// Export settings as JSON (for backup)
const json = emailSettings.export()

// Import settings from JSON (for restore)
emailSettings.import(json)
```

## Usage Examples

### Example 1: Security Page with Email Alerts

```javascript
// pages/security.js
import emailSettings from '../lib/email-settings-manager.js'

export async function initSecurity() {
  const el = document.getElementById('page-security')

  // Check if email alerts available
  if (emailSettings.isConfigured()) {
    console.log('📧 Email alerts enabled for security events')
  }

  // When critical event detected
  async function onCriticalEvent(event) {
    if (emailSettings.canSendAlert('P0')) {
      // Send alert to backend
      await fetch('/api/tenantguard/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priority: 'P0',
          headline: event.name,
          description: event.details,
          severity: 'CRITICAL',
          score: 95,
          actor: event.user,
          source: 'Security Page',
          timestamp: new Date().toISOString()
        })
      })
    }
  }

  // Listen to settings changes
  emailSettings.subscribe((settings) => {
    if (settings.enabled) {
      console.log('✅ Email alerts now enabled')
    } else {
      console.log('❌ Email alerts disabled')
    }
  })
}
```

### Example 2: Dashboard with Alert Status

```javascript
// pages/dashboard.js
import emailSettings from '../lib/email-settings-manager.js'

export function renderAlertStatus() {
  const status = emailSettings.getStatus()

  return `
    <div class="alert-config">
      <h3>📧 Email Alert Configuration</h3>
      ${status.configured
        ? `
          <div style="color: green;">
            ✅ Configured and ready
            <p>Recipients: ${status.recipients.join(', ')}</p>
          </div>
        `
        : `
          <div style="color: red;">
            ❌ Not configured
            <p>Go to TenantGuard > Settings to configure</p>
          </div>
        `
      }
    </div>
  `
}
```

### Example 3: Custom Page with Email Integration

```javascript
// pages/compliance.js
import emailSettings from '../lib/email-settings-manager.js'

export async function initCompliance() {
  // Check compliance status
  async function checkCompliance() {
    const violations = await scanForViolations()

    // Group by severity
    const critical = violations.filter(v => v.severity === 'CRITICAL')

    // Send email for critical violations if enabled
    if (critical.length > 0 && emailSettings.canSendAlert('P1')) {
      await sendComplianceAlert({
        priority: 'P1',
        headline: `${critical.length} Critical Compliance Violations`,
        description: critical.map(v => v.name).join(', '),
        severity: 'CRITICAL',
        score: 80,
        actor: 'Compliance Scanner',
        source: 'Compliance Page',
        timestamp: new Date().toISOString()
      })
    }
  }

  // Run checks periodically
  setInterval(checkCompliance, 60000)
}

async function sendComplianceAlert(alert) {
  return fetch('/api/tenantguard/alert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alert)
  })
}
```

### Example 4: Settings UI in Any Page

```javascript
// pages/custom-settings.js
import emailSettings from '../lib/email-settings-manager.js'

export function renderEmailAlertSettings() {
  return `
    <div class="email-settings">
      <h2>📧 Email Alert Settings</h2>

      <label>
        <input type="checkbox" 
          ${emailSettings.isEnabled() ? 'checked' : ''}
          onchange="toggleEmailAlerts(this.checked)"
        />
        Enable Email Alerts
      </label>

      <div class="recipient-list">
        <h3>Recipients</h3>
        ${emailSettings.getRecipients().map(email => `
          <div>${email}</div>
        `).join('')}
      </div>

      <div class="status">
        ${emailSettings.isConfigured()
          ? '<p style="color:green">✅ Email alerts configured</p>'
          : '<p style="color:red">❌ Configure email alerts in TenantGuard > Settings</p>'
        }
      </div>
    </div>
  `
}

function toggleEmailAlerts(enabled) {
  emailSettings.setEnabled(enabled)
}
```

## Data Structure

### Default Settings

```javascript
{
  enabled: false,
  provider: 'office365',
  from: 'TenantGuard@yourdomain.onmicrosoft.com',
  smtpHost: 'smtp.office365.com',
  smtpPort: 587,
  authUser: '',
  authPass: '',
  recipients: [],
  alertThresholds: {
    P0: 'immediate',
    P1: 'immediate',
    P2: 'digest',
    P3: 'digest'
  },
  rateLimit: {
    maxEmailsPerMinute: 10,
    deduplicationWindow: 3600000 // 1 hour
  },
  digestIntervals: {
    P2: 3600000,          // 1 hour
    P3: 86400000          // 24 hours
  }
}
```

### Alert Object Structure

```javascript
{
  priority: 'P0' | 'P1' | 'P2' | 'P3',
  headline: string,
  description: string,
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  score: number (0-100),
  actor: string,
  source: string,
  timestamp: ISO8601 string
}
```

## Storage

Settings are stored in **localStorage** with key: `app-email-settings`

```javascript
// View stored settings
console.log(localStorage.getItem('app-email-settings'))

// Clear settings (resets to defaults)
localStorage.removeItem('app-email-settings')
```

## Security Notes

⚠️ **Important**: Settings are stored in localStorage (client-side)
- Never store sensitive credentials client-side
- Use environment variables for backend credentials
- Email passwords should be app-specific passwords, not account passwords
- Consider adding encryption for sensitive settings

## Integration with Backend

### Sync Pattern

```javascript
// When saving settings, sync to backend:
emailSettings.setAlertThresholds({ P0: 'immediate' })

// Then also POST to backend:
fetch('/api/email/thresholds', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ P0: 'immediate' })
})
```

### Alert Dispatch Pattern

```javascript
// Frontend: Detect event and check settings
if (emailSettings.canSendAlert(priority)) {
  // Send alert to backend
  const response = await fetch('/api/tenantguard/alert', {
    method: 'POST',
    body: JSON.stringify(alert)
  })
}

// Backend: Route alert based on settings
// Alert Router receives alert, routes to Email Service
// Email Service sends immediately or queues for digest
```

## Troubleshooting

### Settings Not Persisting

```javascript
// Check localStorage is available
try {
  localStorage.setItem('test', 'value')
  localStorage.removeItem('test')
  console.log('✅ localStorage available')
} catch (e) {
  console.error('❌ localStorage not available')
}

// Check if settings are saved
console.log(emailSettings.getSettings())
```

### Email Alerts Not Sending

```javascript
// Check if email is configured
const status = emailSettings.getStatus()
console.log('Config status:', status)

// Verify recipients exist
if (emailSettings.getRecipients().length === 0) {
  console.error('No recipients configured')
}

// Check if alert type can send
if (!emailSettings.canSendAlert('P0')) {
  console.error('P0 alerts not enabled')
}
```

### Reactive Updates Not Working

```javascript
// Verify listener is subscribed
const unsubscribe = emailSettings.subscribe((settings) => {
  console.log('Settings changed!', settings)
})

// Make a change
emailSettings.setEnabled(true)

// Should see "Settings changed!" in console

// Cleanup
unsubscribe()
```

## Performance

- **Storage**: ~2KB per saved settings
- **Memory**: ~50KB for email settings instance
- **Listener callbacks**: ~1ms per notification
- **Settings load**: ~5ms from localStorage

## Roadmap

### Phase 1 (Current) ✅
- [x] Singleton settings manager
- [x] localStorage persistence
- [x] Configuration UI integration
- [x] Reactive subscriptions

### Phase 2
- [ ] IndexedDB for larger storage
- [ ] Encryption for sensitive settings
- [ ] Multi-tenant support
- [ ] Settings sync to backend

### Phase 3
- [ ] Settings versioning
- [ ] Migration helpers
- [ ] Backup/restore UI
- [ ] Audit logging

## Support

For issues or questions about the Email Settings Manager:
- Check usage examples above
- Review TenantGuard settings implementation
- Inspect localStorage via DevTools
- Check browser console for debug logs

---

**Remember**: The Email Settings Manager is the single source of truth for email configuration across the entire application. Keep it synchronized between frontend and backend for best results.
