/**
 * TenantGuard Email Settings Page
 * Configure alert recipients, priorities, and notification preferences
 * Uses centralized email settings manager for global configuration
 */

import './styles/tenantguard-settings.css'
import emailSettings from '../lib/email-settings-manager.js'
import { api } from '../lib/api-client.js'

export function renderTenantGuardSettings(el) {
  const container = el.querySelector('.content-area')
  if (!container) return

  container.innerHTML = `
    <div class="tg-settings-container">
      <div class="settings-header">
        <h1>🔧 TenantGuard Alert Settings</h1>
        <p>Configure email notifications, recipients, and alert delivery preferences</p>
      </div>

      <div class="settings-grid">
        <!-- Email Configuration Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2>📧 Email Configuration</h2>
            <p>Set up email provider and SMTP settings</p>
          </div>

          <div class="settings-form">
            <div class="form-group">
              <label for="email-provider">Email Provider</label>
              <select id="email-provider" class="form-control">
                <option value="office365">Office 365 (SMTP)</option>
                <option value="smtp">Custom SMTP</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
              </select>
              <small class="form-hint">Currently: Office 365</small>
            </div>

            <div class="form-group">
              <label for="email-from">From Email Address</label>
              <input
                type="email"
                id="email-from"
                class="form-control"
                placeholder="TenantGuard@yourdomain.onmicrosoft.com"
                value="TenantGuard@yourdomain.onmicrosoft.com"
              />
              <small class="form-hint">Email address alerts will be sent from</small>
            </div>

            <div class="form-group">
              <label for="smtp-host">SMTP Host</label>
              <input
                type="text"
                id="smtp-host"
                class="form-control"
                placeholder="smtp.office365.com"
                value="smtp.office365.com"
              />
            </div>

            <div class="form-group">
              <label for="smtp-port">SMTP Port</label>
              <input
                type="number"
                id="smtp-port"
                class="form-control"
                placeholder="587"
                value="587"
              />
            </div>

            <div class="form-group">
              <label for="email-user">Email Username/UPN</label>
              <input
                type="text"
                id="email-user"
                class="form-control"
                placeholder="admin@yourdomain.onmicrosoft.com"
              />
              <small class="form-hint">Leave blank to use environment variable EMAIL_USER</small>
            </div>

            <div class="form-group">
              <label for="email-password">Email Password/App Password</label>
              <input
                type="password"
                id="email-password"
                class="form-control"
                placeholder="••••••••••"
              />
              <small class="form-hint">⚠️ Use app-specific password, not account password. Leave blank to use EMAIL_PASSWORD env var</small>
            </div>

            <div class="form-actions">
              <button id="btn-test-email" class="btn btn-secondary">
                🧪 Test Configuration
              </button>
              <button id="btn-save-email" class="btn btn-primary">
                💾 Save Email Settings
              </button>
            </div>
          </div>
        </section>

        <!-- Recipients Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2>👥 Alert Recipients</h2>
            <p>Manage who receives security alerts</p>
          </div>

          <div class="settings-form">
            <div class="form-group">
              <label>Add Recipient Email</label>
              <div class="input-group">
                <input
                  type="email"
                  id="input-recipient"
                  class="form-control"
                  placeholder="security-admin@yourdomain.com"
                />
                <button id="btn-add-recipient" class="btn btn-secondary">Add</button>
              </div>
            </div>

            <div id="recipients-list" class="recipients-list">
              <div class="recipient-item">
                <span>security-admin@yourdomain.onmicrosoft.com</span>
                <button class="btn-remove" data-email="security-admin@yourdomain.onmicrosoft.com">Remove</button>
              </div>
            </div>

            <small class="form-hint">At least one recipient required for alerts</small>
          </div>
        </section>

        <!-- Alert Thresholds Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2>🚨 Alert Delivery Preferences</h2>
            <p>Configure how alerts are delivered based on priority</p>
          </div>

          <div class="settings-form">
            <div class="threshold-grid">
              <div class="threshold-card">
                <div class="priority-badge p0">P0</div>
                <h3>Drop Everything</h3>
                <p class="desc">Immediate critical threats</p>
                <div class="settings">
                  <label>
                    <input type="radio" name="p0-delivery" value="immediate" checked>
                    Send Immediately
                  </label>
                </div>
              </div>

              <div class="threshold-card">
                <div class="priority-badge p1">P1</div>
                <h3>Critical</h3>
                <p class="desc">Active attack patterns</p>
                <div class="settings">
                  <label>
                    <input type="radio" name="p1-delivery" value="immediate" checked>
                    Send Immediately
                  </label>
                </div>
              </div>

              <div class="threshold-card">
                <div class="priority-badge p2">P2</div>
                <h3>High</h3>
                <p class="desc">Security-relevant events</p>
                <div class="settings">
                  <label>
                    <input type="radio" name="p2-delivery" value="digest" checked>
                    Hourly Digest
                  </label>
                  <label>
                    <input type="radio" name="p2-delivery" value="immediate">
                    Send Immediately
                  </label>
                </div>
              </div>

              <div class="threshold-card">
                <div class="priority-badge p3">P3</div>
                <h3>Medium</h3>
                <p class="desc">General activity</p>
                <div class="settings">
                  <label>
                    <input type="radio" name="p3-delivery" value="digest" checked>
                    Daily Digest
                  </label>
                  <label>
                    <input type="radio" name="p3-delivery" value="immediate">
                    Send Immediately
                  </label>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button id="btn-save-thresholds" class="btn btn-primary">
                💾 Save Preferences
              </button>
            </div>
          </div>
        </section>

        <!-- Rate Limiting Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2>⚙️ Rate Limiting</h2>
            <p>Prevent email overload with rate limits</p>
          </div>

          <div class="settings-form">
            <div class="form-group">
              <label for="max-emails-per-minute">Max Emails Per Minute</label>
              <input
                type="number"
                id="max-emails-per-minute"
                class="form-control"
                value="10"
                min="1"
                max="60"
              />
              <small class="form-hint">Prevents alert storm from overwhelming recipients</small>
            </div>

            <div class="form-group">
              <label for="dedup-window">Deduplication Window (minutes)</label>
              <input
                type="number"
                id="dedup-window"
                class="form-control"
                value="60"
                min="5"
                max="1440"
              />
              <small class="form-hint">Skip duplicate alerts within this timeframe</small>
            </div>

            <div class="form-actions">
              <button id="btn-save-rate-limit" class="btn btn-primary">
                💾 Save Rate Limits
              </button>
            </div>
          </div>
        </section>

        <!-- Test & Status Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2>🧪 Test & Status</h2>
            <p>Verify email configuration and check system status</p>
          </div>

          <div class="test-grid">
            <div class="test-card">
              <h3>Email Configuration</h3>
              <div id="config-status" class="status-indicator pending">
                ⏳ Testing...
              </div>
              <button id="btn-verify-config" class="btn btn-secondary">Verify Config</button>
            </div>

            <div class="test-card">
              <h3>Send Test Email</h3>
              <p>Send a test alert to verify delivery</p>
              <input
                type="email"
                id="test-recipient"
                class="form-control"
                placeholder="your-email@domain.com"
              />
              <button id="btn-send-test" class="btn btn-secondary">Send Test Alert</button>
            </div>
          </div>

          <div id="alert-stats" class="stats-box">
            <h3>Alert Queue Status</h3>
            <div class="stats-grid">
              <div class="stat">
                <span class="stat-label">P0 Immediate</span>
                <span class="stat-value">0</span>
              </div>
              <div class="stat">
                <span class="stat-label">P1 Immediate</span>
                <span class="stat-value">0</span>
              </div>
              <div class="stat">
                <span class="stat-label">P2 Digest (Hourly)</span>
                <span class="stat-value">0</span>
              </div>
              <div class="stat">
                <span class="stat-label">P3 Digest (Daily)</span>
                <span class="stat-value">0</span>
              </div>
            </div>
            <button id="btn-refresh-stats" class="btn btn-secondary">Refresh Stats</button>
          </div>
        </section>
      </div>

      <!-- Toast Notification -->
      <div id="toast" class="toast"></div>
    </div>
  `

  attachEventListeners()
  loadSettings()
  checkEmailConfig()
}

function attachEventListeners() {
  // Email configuration
  document.getElementById('btn-test-email')?.addEventListener('click', handleTestEmail)
  document.getElementById('btn-save-email')?.addEventListener('click', handleSaveEmail)

  // Recipients
  document.getElementById('btn-add-recipient')?.addEventListener('click', handleAddRecipient)
  document.getElementById('input-recipient')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddRecipient()
  })

  // Remove recipient buttons
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const email = e.target.dataset.email
      handleRemoveRecipient(email)
    })
  })

  // Thresholds
  document.getElementById('btn-save-thresholds')?.addEventListener('click', handleSaveThresholds)

  // Rate limiting
  document.getElementById('btn-save-rate-limit')?.addEventListener('click', handleSaveRateLimit)

  // Test & status
  document.getElementById('btn-verify-config')?.addEventListener('click', handleVerifyConfig)
  document.getElementById('btn-send-test')?.addEventListener('click', handleSendTest)
  document.getElementById('btn-refresh-stats')?.addEventListener('click', handleRefreshStats)
}

async function handleTestEmail() {
  const btn = document.getElementById('btn-test-email')
  btn.disabled = true
  btn.textContent = '⏳ Testing...'

  try {
    const response = await fetch(`${api}/email/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: document.getElementById('email-from').value
      })
    })

    const result = await response.json()
    if (result.success) {
      showToast('✅ Test email sent successfully!', 'success')
    } else {
      showToast('❌ ' + result.message, 'error')
    }
  } catch (error) {
    showToast('❌ Error: ' + error.message, 'error')
  } finally {
    btn.disabled = false
    btn.textContent = '🧪 Test Configuration'
  }
}

async function handleSaveEmail() {
  const config = {
    provider: document.getElementById('email-provider').value,
    from: document.getElementById('email-from').value,
    smtpHost: document.getElementById('smtp-host').value,
    smtpPort: parseInt(document.getElementById('smtp-port').value),
    authUser: document.getElementById('email-user').value || '',
    authPass: document.getElementById('email-password').value || ''
  }

  try {
    // Save to local settings manager
    emailSettings.updateEmailConfig(config)

    // Also sync to backend
    const response = await fetch(`${api}/email/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })

    const result = await response.json()
    if (result.success) {
      showToast('✅ Email configuration saved!', 'success')
    } else {
      showToast('⚠️ Backend sync: ' + result.message, 'warning')
    }
  } catch (error) {
    // Still save locally even if backend fails
    showToast('✅ Settings saved locally (backend unreachable)', 'success')
  }
}

async function handleAddRecipient() {
  const input = document.getElementById('input-recipient')
  const email = input.value.trim()

  if (!email) {
    showToast('❌ Please enter an email address', 'error')
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('❌ Invalid email address', 'error')
    return
  }

  try {
    // Add to local settings manager
    const success = emailSettings.addRecipient(email)
    if (success) {
      showToast(`✅ Added ${email}`, 'success')
      input.value = ''
      loadSettings()

      // Also sync to backend
      fetch(`${api}/email/recipients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }).catch(err => console.log('Backend sync failed (non-critical):', err))
    } else {
      showToast('❌ Email already added or invalid', 'error')
    }
  } catch (error) {
    showToast('❌ Error: ' + error.message, 'error')
  }
}

async function handleRemoveRecipient(email) {
  try {
    // Remove from local settings manager
    const success = emailSettings.removeRecipient(email)
    if (success) {
      showToast(`✅ Removed ${email}`, 'success')
      loadSettings()

      // Also sync to backend
      fetch(`${api}/email/recipients`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }).catch(err => console.log('Backend sync failed (non-critical):', err))
    } else {
      showToast('❌ Cannot remove - at least one recipient required', 'error')
    }
  } catch (error) {
    showToast('❌ Error: ' + error.message, 'error')
  }
}

async function handleSaveThresholds() {
  const thresholds = {
    P0: document.querySelector('input[name="p0-delivery"]:checked').value,
    P1: document.querySelector('input[name="p1-delivery"]:checked').value,
    P2: document.querySelector('input[name="p2-delivery"]:checked').value,
    P3: document.querySelector('input[name="p3-delivery"]:checked').value
  }

  try {
    // Save to local settings manager
    emailSettings.setAlertThresholds(thresholds)

    // Also sync to backend
    const response = await fetch(`${api}/email/thresholds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(thresholds)
    })

    const result = await response.json()
    if (result.success) {
      showToast('✅ Alert preferences saved!', 'success')
    } else {
      showToast('⚠️ Backend sync: ' + result.message, 'warning')
    }
  } catch (error) {
    showToast('✅ Settings saved locally (backend unreachable)', 'success')
  }
}

async function handleSaveRateLimit() {
  const limits = {
    maxEmailsPerMinute: parseInt(document.getElementById('max-emails-per-minute').value),
    deduplicationWindow: parseInt(document.getElementById('dedup-window').value) * 60 * 1000
  }

  try {
    // Save to local settings manager
    emailSettings.setRateLimit(limits)

    // Also sync to backend
    const response = await fetch(`${api}/email/rate-limit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(limits)
    })

    const result = await response.json()
    if (result.success) {
      showToast('✅ Rate limits saved!', 'success')
    } else {
      showToast('⚠️ Backend sync: ' + result.message, 'warning')
    }
  } catch (error) {
    showToast('✅ Settings saved locally (backend unreachable)', 'success')
  }
}

async function handleVerifyConfig() {
  try {
    const status = document.getElementById('config-status')
    if (!status) return

    const response = await fetch(`${api}/email/verify`, {
      method: 'GET'
    })

    const result = await response.json()

    if (result.success) {
      status.className = 'status-indicator success'
      status.textContent = '✅ Configuration verified'
      showToast('✅ Email configuration is valid!', 'success')
    } else {
      status.className = 'status-indicator error'
      status.textContent = '❌ ' + result.message
      showToast('❌ ' + result.message, 'error')
    }
  } catch (error) {
    const status = document.getElementById('config-status')
    if (status) {
      status.className = 'status-indicator error'
      status.textContent = '❌ ' + error.message
    }
    showToast('❌ Error: ' + error.message, 'error')
  }
}

async function handleSendTest() {
  const recipient = document.getElementById('test-recipient').value.trim()

  if (!recipient) {
    showToast('❌ Please enter a recipient email', 'error')
    return
  }

  try {
    const response = await fetch(`${api}/email/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient })
    })

    const result = await response.json()
    if (result.success) {
      showToast('✅ Test email sent to ' + recipient, 'success')
    } else {
      showToast('❌ ' + result.message, 'error')
    }
  } catch (error) {
    showToast('❌ Error: ' + error.message, 'error')
  }
}

async function handleRefreshStats() {
  try {
    const response = await fetch(`${api}/email/stats`, {
      method: 'GET'
    })

    const result = await response.json()
    if (result.data) {
      const stats = result.data.digestQueues || {}
      document.querySelector('.stat:nth-child(3) .stat-value').textContent = stats.P2 || 0
      document.querySelector('.stat:nth-child(4) .stat-value').textContent = stats.P3 || 0
      showToast('✅ Stats refreshed', 'success')
    }
  } catch (error) {
    showToast('❌ Error: ' + error.message, 'error')
  }
}

async function loadSettings() {
  try {
    // Load recipients from global settings manager
    const recipients = emailSettings.getRecipients()
    const container = document.getElementById('recipients-list')

    if (recipients.length === 0) {
      container.innerHTML = '<div style="color:var(--color-text-secondary);text-align:center;padding:20px">No recipients added yet</div>'
      return
    }

    container.innerHTML = recipients.map(email => `
      <div class="recipient-item">
        <span>${email}</span>
        <button class="btn-remove" data-email="${email}">Remove</button>
      </div>
    `).join('')

    // Re-attach remove handlers
    container.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const email = e.target.dataset.email
        handleRemoveRecipient(email)
      })
    })
  } catch (error) {
    console.error('Error loading recipients:', error)
  }
}

async function checkEmailConfig() {
  try {
    const status = document.getElementById('config-status')
    if (!status) return

    const response = await fetch(`${api}/email/verify`, {
      method: 'GET'
    })

    const result = await response.json()

    if (result.success) {
      status.className = 'status-indicator success'
      status.textContent = '✅ Configuration verified'
    } else {
      status.className = 'status-indicator error'
      status.textContent = '❌ ' + result.message
    }
  } catch (error) {
    const status = document.getElementById('config-status')
    if (status) {
      status.className = 'status-indicator error'
      status.textContent = '❌ Unreachable'
    }
  }
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast')
  toast.textContent = message
  toast.className = `toast show ${type}`
  setTimeout(() => {
    toast.classList.remove('show')
  }, 4000)
}
