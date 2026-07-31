/**
 * Backup Alerts Service
 * Sends notifications via Email, Slack, and Teams
 */

import nodemailer from 'nodemailer'

/**
 * Email Alert Configuration
 */
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
}

/**
 * Initialize email transporter
 */
let emailTransporter = null
function getEmailTransporter() {
  if (!emailTransporter && emailConfig.auth.user && emailConfig.auth.pass) {
    emailTransporter = nodemailer.createTransport(emailConfig)
  }
  return emailTransporter
}

/**
 * Send Email Alert
 */
export async function sendEmailAlert(recipients, subject, htmlContent) {
  try {
    const transporter = getEmailTransporter()
    if (!transporter) {
      console.warn('⚠️ Email not configured (missing SMTP credentials)')
      return false
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || emailConfig.auth.user,
      to: Array.isArray(recipients) ? recipients.join(',') : recipients,
      subject: subject,
      html: htmlContent,
      replyTo: process.env.SMTP_REPLY_TO || emailConfig.auth.user
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`✓ Email sent: ${info.messageId}`)
    return true
  } catch (error) {
    console.error('❌ Error sending email:', error.message)
    return false
  }
}

/**
 * Send Slack Alert
 */
export async function sendSlackAlert(webhookUrl, message) {
  try {
    if (!webhookUrl) {
      console.warn('⚠️ Slack webhook not configured')
      return false
    }

    const payload = {
      text: message.title,
      attachments: [
        {
          color: message.color || '#36a64f',
          title: message.title,
          text: message.text,
          fields: message.fields || [],
          footer: 'M365 Backup Alerts',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      console.log('✓ Slack alert sent')
      return true
    } else {
      console.error(`❌ Slack error: ${response.status}`)
      return false
    }
  } catch (error) {
    console.error('❌ Error sending Slack alert:', error.message)
    return false
  }
}

/**
 * Send Teams Alert (Adaptive Card)
 */
export async function sendTeamsAlert(webhookUrl, message) {
  try {
    if (!webhookUrl) {
      console.warn('⚠️ Teams webhook not configured')
      return false
    }

    const payload = {
      '@type': 'MessageCard',
      '@context': 'https://schema.org/extensions',
      summary: message.title,
      themeColor: message.color || '0078D4',
      sections: [
        {
          activityTitle: message.title,
          activitySubtitle: message.subtitle,
          text: message.text,
          facts: message.facts || []
        }
      ],
      potentialAction: message.actions || []
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      console.log('✓ Teams alert sent')
      return true
    } else {
      console.error(`❌ Teams error: ${response.status}`)
      return false
    }
  } catch (error) {
    console.error('❌ Error sending Teams alert:', error.message)
    return false
  }
}

/**
 * Check if alert should be sent (quiet hours, rules, etc)
 */
export function shouldSendAlert(alertConfig, event) {
  const now = new Date()
  const hour = now.getHours()

  // Check quiet hours (10 PM - 6 AM)
  const quietStart = alertConfig.quietHoursStart || 22
  const quietEnd = alertConfig.quietHoursEnd || 6

  if (quietStart <= hour || hour < quietEnd) {
    if (!event.isUrgent) {
      console.log('⏸️ Alert suppressed during quiet hours')
      return false
    }
  }

  // Check if alert type is enabled
  const enabledAlerts = alertConfig.enabledAlerts || []
  if (!enabledAlerts.includes(event.type)) {
    return false
  }

  return true
}

/**
 * Format backup event for alert
 */
export function formatBackupAlert(event) {
  const isSuccess = event.status === 'success'
  const icon = isSuccess ? '✅' : '❌'
  const color = isSuccess ? '#36a64f' : '#c41e3a'

  return {
    title: `${icon} Backup ${event.action} - ${event.service}`,
    subtitle: event.timestamp,
    text: event.message,
    color: color,
    facts: [
      { name: 'Service', value: event.service },
      { name: 'Status', value: event.status.toUpperCase() },
      { name: 'Resources', value: `${event.resourceCount}` },
      { name: 'Duration', value: `${event.duration}s` },
      ...(event.errorMessage ? [{ name: 'Error', value: event.errorMessage }] : [])
    ]
  }
}

/**
 * Generate HTML email template
 */
export function generateEmailTemplate(event, alerts) {
  const isSuccess = event.status === 'success'
  const icon = isSuccess ? '✅' : '❌'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${isSuccess ? '#36a64f' : '#c41e3a'}; color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .content { margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 8px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .value { margin-left: 10px; color: #333; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${icon} ${event.action}</h2>
          <p>${event.service} - ${event.timestamp}</p>
        </div>

        <div class="content">
          <div class="field">
            <span class="label">Status:</span>
            <span class="value">${event.status.toUpperCase()}</span>
          </div>
          <div class="field">
            <span class="label">Service:</span>
            <span class="value">${event.service}</span>
          </div>
          <div class="field">
            <span class="label">Resources:</span>
            <span class="value">${event.resourceCount}</span>
          </div>
          <div class="field">
            <span class="label">Duration:</span>
            <span class="value">${event.duration}s</span>
          </div>
          ${event.message ? `<div class="field"><span class="label">Message:</span><span class="value">${event.message}</span></div>` : ''}
          ${event.errorMessage ? `<div class="field"><span class="label">Error:</span><span class="value">${event.errorMessage}</span></div>` : ''}
        </div>

        <div class="footer">
          <p>M365 Backup & Restore Alert System</p>
          <p>© 2026 All rights reserved</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Process all alerts for an event
 */
export async function processAlerts(event, alertConfig) {
  try {
    if (!shouldSendAlert(alertConfig, event)) {
      console.log('⏸️ Alert rules did not trigger')
      return { success: false, reason: 'Rules did not apply' }
    }

    const results = {
      email: false,
      slack: false,
      teams: false
    }

    // Send Email
    if (alertConfig.emailEnabled && alertConfig.emailRecipients?.length > 0) {
      const htmlContent = generateEmailTemplate(event, alertConfig)
      results.email = await sendEmailAlert(
        alertConfig.emailRecipients,
        `[${event.status.toUpperCase()}] ${event.action} - ${event.service}`,
        htmlContent
      )
    }

    // Send Slack
    if (alertConfig.slackEnabled && alertConfig.slackWebhook) {
      const slackMessage = formatBackupAlert(event)
      results.slack = await sendSlackAlert(alertConfig.slackWebhook, slackMessage)
    }

    // Send Teams
    if (alertConfig.teamsEnabled && alertConfig.teamsWebhook) {
      const teamsMessage = formatBackupAlert(event)
      results.teams = await sendTeamsAlert(alertConfig.teamsWebhook, teamsMessage)
    }

    console.log('✓ Alert processing complete:', results)
    return { success: true, results }
  } catch (error) {
    console.error('❌ Error processing alerts:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Get default alert configuration
 */
export function getDefaultAlertConfig() {
  return {
    emailEnabled: false,
    emailRecipients: [],
    slackEnabled: false,
    slackWebhook: '',
    slackChannel: '#backup-alerts',
    teamsEnabled: false,
    teamsWebhook: '',
    enabledAlerts: ['BACKUP_COMPLETED', 'BACKUP_FAILED', 'SCHEDULE_TRIGGERED'],
    quietHoursStart: 22,
    quietHoursEnd: 6,
    escalateAfterFailures: 3,
    lastUpdated: new Date().toISOString()
  }
}
