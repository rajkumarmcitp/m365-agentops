# TenantGuard Real-Time Email Alerting System

## Overview

The TenantGuard Real-Time Email Alerting System automatically notifies security administrators of critical M365 threats via email. This document covers configuration, usage, and integration details.

## Architecture

### Components

1. **Email Service** (`backend/services/email-service.js`)
   - Handles SMTP connection to Office 365
   - Sends immediate alerts for P0/P1 events
   - Formats professional HTML email templates
   - Implements deduplication to prevent alert storms
   - Rate limiting (configurable max emails/minute)

2. **Alert Router** (`backend/services/alert-router.js`)
   - Routes alerts to email based on priority
   - Queues P2/P3 alerts for digest delivery
   - Implements delivery rules (immediate vs digest)
   - Tracks alert queue status

3. **Settings UI** (`pages/tenantguard-settings.js`)
   - Configure email provider and SMTP settings
   - Manage recipient email addresses
   - Set alert delivery preferences by priority
   - Configure rate limiting and deduplication
   - Test email configuration

### Alert Priority & Delivery

| Priority | Label | Delivery | Trigger |
|----------|-------|----------|---------|
| **P0** | 🚨 Drop Everything | Immediate | Critical attacks, disabled MFA, admin changes |
| **P1** | 🔴 Critical | Immediate | Active attack patterns, failed logins |
| **P2** | 🟠 High | Hourly Digest | Security-relevant configuration changes |
| **P3** | 🟡 Medium | Daily Digest | General activity and audit events |

## Configuration

### 1. Office 365 Setup

#### Using App Password (Recommended)

1. Sign in to your Office 365 account
2. Navigate to **Security > My Account > Advanced Security Options** or https://account.microsoft.com/security
3. Scroll to **Additional security verification**
4. Click **Create and manage app passwords**
5. Select "Mail" and "Windows Phone"
6. Copy the generated 16-character password
7. Use this in TenantGuard settings (not your actual account password)

#### Environment Variables

Set in `.env` file:

```bash
# Email Configuration
EMAIL_FROM=TenantGuard@yourdomain.onmicrosoft.com
EMAIL_USER=admin@yourdomain.onmicrosoft.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_RECIPIENTS=["security-admin@yourdomain.com","siem@yourdomain.com"]
```

### 2. Frontend Configuration

1. Navigate to **TenantGuard > Settings** tab
2. **Email Configuration Section:**
   - Provider: Office 365 (default)
   - From Email: Your organization's email
   - SMTP Host: smtp.office365.com
   - SMTP Port: 587
3. Click **Test Configuration** to verify connectivity
4. Click **Send Test Email** to confirm delivery

### 3. Recipient Management

1. Go to **TenantGuard > Settings > Alert Recipients**
2. Enter email address and click **Add**
3. Recipients receive alerts based on their priority preference
4. At least one recipient required

### 4. Alert Preferences

1. Go to **TenantGuard > Settings > Alert Delivery Preferences**
2. For each priority level (P0, P1, P2, P3):
   - **P0/P1**: Always send immediately (required)
   - **P2/P3**: Choose between:
     - **Hourly Digest**: Receive once per hour
     - **Daily Digest**: Receive once per day
     - **Send Immediately**: Get each alert instantly

### 5. Rate Limiting

1. Go to **TenantGuard > Settings > Rate Limiting**
2. **Max Emails Per Minute**: Prevents alert storm (default: 10)
3. **Deduplication Window**: Skip duplicate alerts within this timeframe (default: 60 min)

## Email Templates

### P0/P1 Alert Email

```
📧 TO: security-admin@yourdomain.com
SUBJECT: 🚨 DROP EVERYTHING [Alert Headline]

┌─────────────────────────────────┐
│ 🚨 DROP EVERYTHING              │
│ [Alert Headline]                │
├─────────────────────────────────┤
│ DESCRIPTION                     │
│ [Full alert description]        │
├─────────────────────────────────┤
│ P0 Priority  CRITICAL  85/100   │
├─────────────────────────────────┤
│ Graph API - Audit Logs          │
│ admin@contoso.com               │
│ 7/18/2026 3:41:56 PM            │
├─────────────────────────────────┤
│ [View in TenantGuard] [Details] │
└─────────────────────────────────┘
```

### Digest Email

```
📧 TO: security-admin@yourdomain.com
SUBJECT: 📋 TenantGuard Daily Digest - 15 Alerts

Alert Summary:
- 🚨 P0 (Drop Everything): 1
- 🔴 P1 (Critical): 3
- 🟠 P2 (High): 8
- 🟡 P3 (Medium): 3

Recent Alerts:
1. P0 Global Admin added to external user
2. P1 Failed sign-in from unusual location
3. P2 SharePoint external sharing policy modified
...
```

## API Endpoints

### Email Configuration

```bash
# Configure email provider
POST /api/email/config
{
  "provider": "office365",
  "from": "TenantGuard@yourdomain.onmicrosoft.com",
  "smtpHost": "smtp.office365.com",
  "smtpPort": 587,
  "authUser": "admin@yourdomain.onmicrosoft.com",
  "authPass": "xxxx xxxx xxxx xxxx"
}

# Verify configuration
GET /api/email/verify
Response: { success: true, message: "Email service ready" }

# Send test email
POST /api/email/test
{ "recipient": "test@yourdomain.com" }
```

### Recipients Management

```bash
# Add recipient
POST /api/email/recipients
{ "email": "new-admin@yourdomain.com" }

# Remove recipient
DELETE /api/email/recipients
{ "email": "old-admin@yourdomain.com" }
```

### Alert Preferences

```bash
# Update delivery thresholds
POST /api/email/thresholds
{
  "P0": "immediate",
  "P1": "immediate",
  "P2": "digest",
  "P3": "digest"
}

# Set rate limits
POST /api/email/rate-limit
{
  "maxEmailsPerMinute": 10,
  "deduplicationWindow": 3600000
}

# Get queue stats
GET /api/email/stats
Response: {
  "immediateQueue": 0,
  "digestQueues": { "P1": 2, "P2": 5, "P3": 0 },
  "activeTimers": ["P2", "P3"]
}
```

## Alert Routing Logic

### When Alert is Detected

```
Alert Generated
    ↓
Check Priority
    ├─→ P0/P1: Send Email Immediately
    │   ├─→ Check Deduplication
    │   ├─→ Check Rate Limit
    │   └─→ Send HTML Email
    │
    └─→ P2/P3: Queue for Digest
        ├─→ Add to digest queue
        ├─→ Start digest timer (1 hour or 24 hours)
        └─→ Send when timer fires
```

### Deduplication

Alerts are considered duplicates if they have:
- Same headline
- Same severity
- Same actor
- Within deduplication window (default 60 minutes)

Duplicate alerts are **skipped** and not sent.

### Rate Limiting

If more than **10 emails** are sent in a minute:
- Excess alerts are **queued** for next minute
- Or **added to digest** if digest already scheduled
- Or **dropped** if they're older than their priority window

## Monitoring & Troubleshooting

### Check Email Service Status

1. Go to **TenantGuard > Settings > Test & Status**
2. Click **Verify Config** to check connectivity
3. View **Alert Queue Status** for pending emails
4. Click **Refresh Stats** to update queue counts

### Common Issues

#### "Configuration verified" fails
- **Cause**: SMTP credentials invalid or network blocked
- **Solution**: 
  1. Verify Office 365 email and app password
  2. Check firewall allows SMTP port 587
  3. Verify account has "Send on behalf" permission

#### Test email not received
- **Cause**: Email filtered to spam or rate limited
- **Solution**:
  1. Check spam/junk folder
  2. Check email filter rules
  3. Verify sender address is whitelisted
  4. Try sending from different recipient

#### Too many duplicate emails
- **Cause**: Deduplication window too short
- **Solution**: Increase deduplication window in Settings

#### Emails not sending automatically
- **Cause**: Alert router not initialized or rate limited
- **Solution**:
  1. Restart backend: `npm run dev`
  2. Check backend logs for errors
  3. Verify recipients configured
  4. Trigger P0 alert manually to test

### Backend Logs

When alerts are processed, you'll see:

```
📧 Email service initialized - Provider: office365
🚨 Immediate alert routing: P0 - [Headline]
📧 Alert email sent: P0 - [Headline] (message-id)
📋 Queuing alert for digest: P2 - [Headline]
⏰ Digest timer started for P2 (60 minutes)
📧 Digest email sent: P2 - 5 alerts
```

## Best Practices

### 1. Email Recipients
- **Minimum**: At least 1 security admin
- **Recommended**: 3-5 security roles
- **Enterprise**: Separate P0/P1 and P2/P3 distribution lists

### 2. Alert Preferences
```
P0/P1: ALWAYS immediate (non-negotiable)
P2: Hourly digest (avoid email fatigue)
P3: Daily digest or disable (informational only)
```

### 3. Rate Limiting
- **Small tenant**: 10 emails/min (default)
- **Large tenant**: 20-30 emails/min
- **High-security**: 5 emails/min (stricter)

### 4. Deduplication
- **Standard**: 60 minutes (default)
- **High-volume**: 30 minutes
- **Critical alerts only**: 5 minutes

### 5. Testing
1. Test email configuration weekly
2. Trigger P0 alert manually to verify delivery
3. Check email logs for delivery failures
4. Monitor queue stats during incidents

## Integration Points

### TenantGuard Page
- **Settings Tab**: Configure email alerts
- **Alert Detail Modal**: Shows email status
- **Dashboard**: Displays "Alerts sent via email" counter

### Audit Logs
- All alert emails logged in audit trail
- Recipient list changes tracked
- Configuration changes recorded

### API Consumers
- Custom dashboards can trigger alerts via API
- Automation rules can configure email settings
- External systems can subscribe to alert emails

## Security Considerations

### Credential Management
- Never commit credentials to git
- Use environment variables for credentials
- Rotate app passwords quarterly
- Monitor failed authentication attempts

### Email Content
- Alerts include minimal sensitive data
- No passwords or secrets in email body
- Includes action link to TenantGuard (authentication required)
- Fully formatted HTML prevents disclosure

### Access Control
- Settings accessible to admins only
- Email recipient list requires admin approval
- Test emails sent to configured recipient only
- API endpoints protected by CORS

### Compliance
- Email retention follows Office 365 policy
- SMTP traffic encrypted (TLS)
- Audit log tracks all email actions
- GDPR-compliant recipient management

## Support & Troubleshooting

### Logs Location
- **Frontend**: Browser console (F12)
- **Backend**: Server logs with 📧 emoji prefix
- **Email**: Office 365 mail trace

### Common Commands

```bash
# Restart backend with email debug
NODE_DEBUG=http npm run dev

# Test SMTP connectivity
npm test -- --email-config

# Clear alert queues (admin only)
curl -X POST http://localhost:3000/api/email/clear-queues

# Force send pending digests
curl -X POST http://localhost:3000/api/email/send-digests
```

### Support Channels
- Documentation: See this file
- Issues: GitHub Issues (tagged email-alerts)
- Questions: Slack #security-team
- Emergency: Page oncall admin

## Roadmap

### Upcoming Features
- [x] Office 365 SMTP integration
- [x] Email templates with branding
- [x] Immediate alerts for P0/P1
- [x] Digest emails for P2/P3
- [ ] Slack integration
- [ ] Teams webhook notifications
- [ ] SMS for P0 alerts
- [ ] Custom email templates
- [ ] Advanced filtering rules
- [ ] Recipient groups/teams

### Planned Enhancements
- **Phase 2**: Slack/Teams integration
- **Phase 3**: SMS notifications
- **Phase 4**: Custom rules engine
- **Phase 5**: ML-based alert aggregation

## FAQ

**Q: Can I use Gmail instead of Office 365?**
A: Yes! Change provider to "smtp", set host to smtp.gmail.com, port 587, and use app password.

**Q: How do I get more frequent digests?**
A: Change P2/P3 from "daily digest" to "hourly digest" or "send immediately" in settings.

**Q: What if my email is rate limited?**
A: Increase "Max Emails Per Minute" in rate limiting settings, or use digest delivery for P2/P3.

**Q: How do I stop duplicate alerts?**
A: Increase deduplication window (larger number = longer dedup period).

**Q: Can alerts be sent to Teams/Slack?**
A: Phase 2 feature (coming soon). Currently email only.

## Conclusion

The TenantGuard Real-Time Email Alerting System provides enterprise-grade security notifications with:
- ✅ Immediate P0/P1 alerting (within seconds)
- ✅ Intelligent digest delivery for lower priorities
- ✅ Professional HTML email templates
- ✅ Deduplication and rate limiting
- ✅ Easy configuration UI
- ✅ Office 365 integration

For immediate security alerts, ensure P0/P1 alerts are configured to send immediately to your security team.
