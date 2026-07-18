/**
 * Email Service - Send real-time alerts via Office 365
 * Supports SMTP, Office 365, and custom email providers
 */

import nodemailer from 'nodemailer'
import crypto from 'crypto'

let transporter = null
let emailConfig = null
let alertCache = new Map() // Deduplication cache
const CACHE_TTL = 3600000 // 1 hour dedup window

/**
 * Initialize email service
 */
function initEmailService(config = {}) {
  emailConfig = {
    provider: config.provider || 'office365',
    from: config.from || 'TenantGuard@yourdomain.onmicrosoft.com',
    recipients: config.recipients || ['security-admin@yourdomain.onmicrosoft.com'],
    smtpHost: config.smtpHost || 'smtp.office365.com',
    smtpPort: config.smtpPort || 587,
    useAuth: config.useAuth !== false,
    auth: {
      user: config.authUser || process.env.EMAIL_USER,
      pass: config.authPass || process.env.EMAIL_PASSWORD
    },
    // Alert thresholds
    alertThresholds: {
      P0: 'immediate', // Send immediately
      P1: 'immediate', // Send immediately
      P2: 'digest',    // Send in hourly digest
      P3: 'digest'     // Send in daily digest
    },
    // Rate limiting
    maxEmailsPerMinute: config.maxEmailsPerMinute || 10,
    deduplicationWindow: config.deduplicationWindow || CACHE_TTL
  }

  // Setup nodemailer transporter
  transporter = nodemailer.createTransport({
    host: emailConfig.smtpHost,
    port: emailConfig.smtpPort,
    secure: false, // TLS
    auth: emailConfig.useAuth ? emailConfig.auth : undefined,
    logger: false,
    debug: false
  })

  console.log(`📧 Email service initialized - Provider: ${emailConfig.provider}`)
  return emailConfig
}

/**
 * Generate unique alert hash for deduplication
 */
function generateAlertHash(alert) {
  const hashKey = `${alert.headline}|${alert.severity}|${alert.actor || 'system'}`
  return crypto.createHash('md5').update(hashKey).digest('hex')
}

/**
 * Check if alert is duplicate
 */
function isDuplicateAlert(alert) {
  const hash = generateAlertHash(alert)
  const cached = alertCache.get(hash)

  if (cached && Date.now() - cached < emailConfig.deduplicationWindow) {
    return true // Duplicate within window
  }

  alertCache.set(hash, Date.now())
  return false
}

/**
 * Clean old entries from cache
 */
function cleanAlertCache() {
  const now = Date.now()
  for (const [key, timestamp] of alertCache.entries()) {
    if (now - timestamp > emailConfig.deduplicationWindow) {
      alertCache.delete(key)
    }
  }
}

/**
 * Format alert for email
 */
function formatAlertEmail(alert) {
  const priorityColors = {
    P0: '#dc3545',
    P1: '#fd7e14',
    P2: '#ffc107',
    P3: '#0c447c'
  }

  const priorityLabels = {
    P0: '🚨 DROP EVERYTHING',
    P1: '🔴 CRITICAL',
    P2: '🟠 HIGH',
    P3: '🟡 MEDIUM'
  }

  const riskColor = alert.score >= 80 ? '#dc3545' : alert.score >= 50 ? '#fd7e14' : '#28a745'

  return {
    subject: `${priorityLabels[alert.priority]} ${alert.headline}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: ${priorityColors[alert.priority]}; color: white; padding: 20px; }
          .header h2 { margin: 0; font-size: 18px; }
          .header p { margin: 4px 0 0 0; font-size: 14px; opacity: 0.9; }
          .content { padding: 20px; }
          .alert-item { background: #f9f9f9; border-left: 4px solid ${priorityColors[alert.priority]}; padding: 16px; margin-bottom: 16px; border-radius: 4px; }
          .label { font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; margin-bottom: 4px; }
          .value { font-size: 14px; color: #333; margin-bottom: 12px; }
          .metric { display: inline-block; background: #f0f0f0; padding: 8px 12px; border-radius: 4px; margin-right: 8px; margin-bottom: 8px; }
          .metric-value { font-weight: 600; }
          .actions { display: flex; gap: 10px; margin-top: 16px; }
          .btn { display: inline-block; padding: 10px 16px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 600; }
          .btn-primary { background: #0d6efd; color: white; }
          .btn-secondary { background: #e9ecef; color: #333; }
          .footer { background: #f9f9f9; padding: 16px 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; text-align: center; }
          .risk-score { font-size: 24px; font-weight: 700; color: ${riskColor}; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${priorityLabels[alert.priority]}</h2>
            <p>${alert.headline}</p>
          </div>

          <div class="content">
            <div class="alert-item">
              <div class="label">Description</div>
              <div class="value">${alert.description || 'No description'}</div>

              <div class="label">Details</div>
              <div>
                <div class="metric"><span class="metric-value">${alert.priority}</span> Priority</div>
                <div class="metric"><span class="metric-value">${alert.severity}</span> Severity</div>
                <div class="metric"><span class="metric-value">${Math.round(alert.score)}/100</span> Risk Score</div>
              </div>

              <div style="margin-top: 12px;">
                <div class="label">Source Information</div>
                <div class="value">
                  <strong>Source:</strong> ${alert.source || 'Unknown'}<br/>
                  <strong>Actor:</strong> ${alert.actor || 'System'}<br/>
                  <strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}<br/>
                  <strong>ID:</strong> <code>${alert.id}</code>
                </div>
              </div>
            </div>

            <div class="actions">
              <a href="http://localhost:5173/#/tenantguard" class="btn btn-primary">View in TenantGuard</a>
              <a href="http://localhost:5173/#/tenantguard?alert=${alert.id}" class="btn btn-secondary">View Details</a>
            </div>
          </div>

          <div class="footer">
            <p>TenantGuard Real-Time Alert System<br/>
            This alert was generated automatically. Do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

/**
 * Send alert email
 */
async function sendAlertEmail(alert, recipients = null) {
  if (!transporter) {
    console.warn('⚠️ Email service not initialized')
    return false
  }

  // Check for duplicates
  if (isDuplicateAlert(alert)) {
    console.log(`⏭️ Skipping duplicate alert: ${alert.headline}`)
    return false
  }

  // Rate limiting check
  if (alertCache.size > emailConfig.maxEmailsPerMinute) {
    console.warn(`⚠️ Email rate limit exceeded: ${alertCache.size} emails`)
    return false
  }

  const emailRecipients = recipients || emailConfig.recipients
  const emailContent = formatAlertEmail(alert)

  try {
    const mailOptions = {
      from: emailConfig.from,
      to: emailRecipients.join(', '),
      subject: emailContent.subject,
      html: emailContent.html
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`📧 Alert email sent: ${alert.priority} - ${alert.headline} (${info.messageId})`)
    return true
  } catch (error) {
    console.error(`❌ Failed to send alert email: ${error.message}`)
    return false
  }
}

/**
 * Send digest email (multiple alerts)
 */
async function sendDigestEmail(alerts, recipients = null) {
  if (!transporter || alerts.length === 0) return false

  const emailRecipients = recipients || emailConfig.recipients

  // Count by priority
  const counts = {
    P0: alerts.filter(a => a.priority === 'P0').length,
    P1: alerts.filter(a => a.priority === 'P1').length,
    P2: alerts.filter(a => a.priority === 'P2').length,
    P3: alerts.filter(a => a.priority === 'P3').length
  }

  const alertList = alerts
    .map(a => `<li><strong>${a.priority}</strong> ${a.headline} (${a.severity})</li>`)
    .join('')

  try {
    await transporter.sendMail({
      from: emailConfig.from,
      to: emailRecipients.join(', '),
      subject: `📋 TenantGuard Daily Digest - ${alerts.length} Alerts`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h2>TenantGuard Alert Digest</h2>
            <p>You have <strong>${alerts.length}</strong> security alerts since the last digest.</p>

            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Summary:</strong></p>
              <ul>
                <li>🚨 P0 (Drop Everything): ${counts.P0}</li>
                <li>🔴 P1 (Critical): ${counts.P1}</li>
                <li>🟠 P2 (High): ${counts.P2}</li>
                <li>🟡 P3 (Medium): ${counts.P3}</li>
              </ul>
            </div>

            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Recent Alerts:</strong></p>
              <ul>
                ${alertList}
              </ul>
            </div>

            <p>
              <a href="http://localhost:5173/#/tenantguard" style="background: #0d6efd; color: white; padding: 10px 16px; border-radius: 4px; text-decoration: none; font-weight: 600;">View All Alerts</a>
            </p>
          </div>
        </body>
        </html>
      `
    })
    console.log(`📧 Digest email sent: ${alerts.length} alerts to ${emailRecipients.join(', ')}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to send digest email: ${error.message}`)
    return false
  }
}

/**
 * Verify email configuration
 */
async function verifyEmailConfig() {
  if (!transporter) {
    return { success: false, message: 'Email service not initialized' }
  }

  try {
    await transporter.verify()
    console.log('✅ Email configuration verified')
    return { success: true, message: 'Email service ready' }
  } catch (error) {
    console.error(`❌ Email configuration error: ${error.message}`)
    return { success: false, message: error.message }
  }
}

/**
 * Send test email
 */
async function sendTestEmail(recipient) {
  return sendAlertEmail({
    id: 'test-' + Date.now(),
    priority: 'P1',
    severity: 'CRITICAL',
    headline: '🧪 TenantGuard Email Test',
    description: 'This is a test email to verify your email configuration is working correctly.',
    score: 85,
    actor: 'System',
    source: 'Test',
    timestamp: new Date().toISOString()
  }, [recipient])
}

// Clean cache periodically (every 10 minutes)
setInterval(cleanAlertCache, 10 * 60 * 1000)

export default {
  initEmailService,
  sendAlertEmail,
  sendDigestEmail,
  verifyEmailConfig,
  sendTestEmail,
  getEmailConfig: () => emailConfig
}

export {
  initEmailService,
  sendAlertEmail,
  sendDigestEmail,
  verifyEmailConfig,
  sendTestEmail
}
