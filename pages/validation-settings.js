/**
 * Validation Settings Page
 * Allows administrators to configure validation method preferences
 * Switch between Graph API, PowerShell, and Hybrid validation
 */

import { html } from 'htm/preact'
import { useEffect, useState } from 'preact/hooks'

export default function ValidationSettingsPage() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [validationMethod, setValidationMethod] = useState('hybrid')
  const [timeout, setTimeout] = useState(30000)
  const [retryAttempts, setRetryAttempts] = useState(3)
  const [enablePowerShell, setEnablePowerShell] = useState(false)
  const [customMethods, setCustomMethods] = useState([])
  const [validationSummary, setValidationSummary] = useState(null)

  // Load configuration on mount
  useEffect(() => {
    loadConfiguration()
    loadValidationSummary()
  }, [])

  /**
   * Load validation configuration from backend
   */
  const loadConfiguration = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/config/validation-settings')
      if (!response.ok) throw new Error('Failed to load configuration')

      const data = await response.json()
      if (data.success) {
        setConfig(data.data)
        setValidationMethod(data.data.currentMethod)
        setEnablePowerShell(data.data.powerShellAvailable)
        setCustomMethods(data.data.customMethods || [])
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err) {
      console.error('Error loading configuration:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load validation summary
   */
  const loadValidationSummary = async () => {
    try {
      const response = await fetch('/api/validation/summary')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setValidationSummary(data.data)
        }
      }
    } catch (err) {
      console.warn('Could not load validation summary:', err)
    }
  }

  /**
   * Save configuration changes
   */
  const handleSaveConfig = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const updates = {
        validationMethod,
        timeout: parseInt(timeout),
        retryAttempts: parseInt(retryAttempts),
        enablePowerShell
      }

      const response = await fetch('/api/config/validation-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to save configuration')

      const data = await response.json()
      if (data.success) {
        setSuccess('Configuration saved successfully!')
        setConfig(data.data)
        setTimeout(() => setSuccess(null), 5000)
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err) {
      console.error('Error saving configuration:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  /**
   * Reset configuration to defaults
   */
  const handleReset = async () => {
    if (!window.confirm('Reset validation configuration to defaults?')) return

    try {
      setSaving(true)
      setError(null)

      const response = await fetch('/api/config/validation-reset', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to reset configuration')

      const data = await response.json()
      if (data.success) {
        setSuccess('Configuration reset to defaults')
        setConfig(data.data)
        setValidationMethod(data.data.currentMethod)
        setEnablePowerShell(data.data.powerShellAvailable)
        setCustomMethods(data.data.customMethods || [])
        setTimeout(() => setSuccess(null), 5000)
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err) {
      console.error('Error resetting configuration:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return html`
      <div class="page-container">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading validation settings...</p>
        </div>
      </div>
    `
  }

  return html`
    <div class="page-container validation-settings-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Validation Settings</h1>
          <p class="page-subtitle">Configure validation method preferences and hybrid validation options</p>
        </div>
      </div>

      <!-- Messages -->
      ${error && html`
        <div class="alert alert-error">
          <i class="icon-alert"></i>
          <div>
            <h3>Error</h3>
            <p>${error}</p>
          </div>
        </div>
      `}

      ${success && html`
        <div class="alert alert-success">
          <i class="icon-check"></i>
          <div>
            <h3>Success</h3>
            <p>${success}</p>
          </div>
        </div>
      `}

      <div class="settings-container">
        <!-- Validation Method Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2>Validation Method</h2>
            <p>Choose how CIS controls are validated</p>
          </div>

          <div class="setting-group">
            <label class="setting-label">Primary Validation Method</label>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" name="method" value="graphAPI"
                  checked=${validationMethod === 'graphAPI'}
                  onchange=${(e) => setValidationMethod(e.target.value)}
                  disabled=${saving}
                />
                <span class="radio-label">
                  <strong>Graph API</strong>
                  <small>Use Microsoft Graph API (recommended for most environments)</small>
                </span>
              </label>

              <label class="radio-option">
                <input type="radio" name="method" value="powershell"
                  checked=${validationMethod === 'powershell'}
                  onchange=${(e) => setValidationMethod(e.target.value)}
                  disabled=${saving}
                />
                <span class="radio-label">
                  <strong>PowerShell</strong>
                  <small>Use PowerShell cmdlets (requires modules installed)</small>
                </span>
              </label>

              <label class="radio-option">
                <input type="radio" name="method" value="hybrid"
                  checked=${validationMethod === 'hybrid'}
                  onchange=${(e) => setValidationMethod(e.target.value)}
                  disabled=${saving}
                />
                <span class="radio-label">
                  <strong>Hybrid (Recommended)</strong>
                  <small>Try Graph API first, fallback to PowerShell if needed</small>
                </span>
              </label>
            </div>
          </div>
        </section>

        <!-- PowerShell Configuration -->
        <section class="settings-section">
          <div class="section-header">
            <h2>PowerShell Configuration</h2>
            <p>Settings for PowerShell-based validation</p>
          </div>

          <div class="setting-group">
            <label class="checkbox-option">
              <input type="checkbox"
                checked=${enablePowerShell}
                onchange=${(e) => setEnablePowerShell(e.target.checked)}
                disabled=${saving}
              />
              <span>Enable PowerShell validation</span>
              <small>Enable this to allow PowerShell fallback (requires PowerShell modules installed on the server)</small>
            </label>
          </div>

          ${enablePowerShell && html`
            <div class="info-box">
              <i class="icon-info"></i>
              <div>
                <p><strong>Required PowerShell Modules:</strong></p>
                <ul>
                  <li>Microsoft.Graph</li>
                  <li>ExchangeOnlineManagement</li>
                  <li>MicrosoftTeams</li>
                  <li>Az.Accounts</li>
                </ul>
              </div>
            </div>
          `}
        </section>

        <!-- Performance Settings -->
        <section class="settings-section">
          <div class="section-header">
            <h2>Performance Settings</h2>
            <p>Configure timeout and retry behavior</p>
          </div>

          <div class="setting-group">
            <label class="setting-label">Timeout per Control (ms)</label>
            <input type="number" class="form-input"
              value=${timeout}
              onchange=${(e) => setTimeout(e.target.value)}
              disabled=${saving}
              min="5000" max="60000" step="1000"
            />
            <small>Maximum time to wait for validation of a single control</small>
          </div>

          <div class="setting-group">
            <label class="setting-label">Retry Attempts</label>
            <input type="number" class="form-input"
              value=${retryAttempts}
              onchange=${(e) => setRetryAttempts(e.target.value)}
              disabled=${saving}
              min="1" max="5"
            />
            <small>Number of times to retry failed validation attempts</small>
          </div>
        </section>

        <!-- Validation Summary -->
        ${validationSummary && html`
          <section class="settings-section">
            <div class="section-header">
              <h2>Last Validation Summary</h2>
              <p>Results from the most recent validation run</p>
            </div>

            <div class="validation-stats">
              <div class="stat-card">
                <div class="stat-value">${validationSummary.graphAPIControls || 0}</div>
                <div class="stat-label">Graph API</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${validationSummary.powerShellControls || 0}</div>
                <div class="stat-label">PowerShell</div>
              </div>
              <div class="stat-card ${validationSummary.fallbackControls > 0 ? 'stat-warning' : ''}">
                <div class="stat-value">${validationSummary.fallbackControls || 0}</div>
                <div class="stat-label">Fallbacks</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${Math.round(validationSummary.averageExecutionTime || 0)}ms</div>
                <div class="stat-label">Avg Time</div>
              </div>
            </div>
          </section>
        `}

        <!-- Custom Per-Control Methods -->
        ${customMethods.length > 0 && html`
          <section class="settings-section">
            <div class="section-header">
              <h2>Custom Control Methods</h2>
              <p>Controls with custom validation method settings</p>
            </div>

            <div class="custom-methods-list">
              ${customMethods.map(method => html`
                <div class="custom-method-item">
                  <span class="method-control-id">${method.controlId}</span>
                  <span class="method-badge" data-method=${method.method}>
                    ${method.method === 'graphAPI' && 'Graph API'}
                    ${method.method === 'powershell' && 'PowerShell'}
                    ${method.method === 'hybrid' && 'Hybrid'}
                  </span>
                </div>
              `)}
            </div>
          </section>
        `}

        <!-- Action Buttons -->
        <section class="settings-actions">
          <button class="btn btn-primary" onclick=${handleSaveConfig} disabled=${saving}>
            ${saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button class="btn btn-secondary" onclick=${handleReset} disabled=${saving}>
            Reset to Defaults
          </button>
        </section>
      </div>

      <style>${`
        .validation-settings-page {
          padding: 20px;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #1a1a1a;
        }

        .page-subtitle {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .settings-container {
          max-width: 800px;
        }

        .settings-section {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #1a1a1a;
        }

        .section-header p {
          font-size: 13px;
          color: #666;
          margin: 0;
        }

        .setting-group {
          margin-bottom: 20px;
        }

        .setting-group:last-child {
          margin-bottom: 0;
        }

        .setting-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          color: #1a1a1a;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .radio-option {
          display: flex;
          align-items: flex-start;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .radio-option:hover {
          background: #f5f5f5;
          border-color: #0078d4;
        }

        .radio-option input[type="radio"] {
          margin-right: 12px;
          margin-top: 2px;
          accent-color: #0078d4;
          cursor: pointer;
        }

        .radio-label {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .radio-label strong {
          font-size: 14px;
          color: #1a1a1a;
        }

        .radio-label small {
          font-size: 12px;
          color: #666;
        }

        .checkbox-option {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          cursor: pointer;
          padding: 8px 0;
        }

        .checkbox-option input[type="checkbox"] {
          accent-color: #0078d4;
          cursor: pointer;
          margin-top: 2px;
        }

        .checkbox-option small {
          display: block;
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d0d0d0;
          border-radius: 4px;
          font-size: 13px;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #0078d4;
          box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.1);
        }

        .form-input:disabled {
          background: #f5f5f5;
          color: #999;
        }

        .form-input small {
          display: block;
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .info-box {
          background: #e8f4f8;
          border: 1px solid #b3dce6;
          border-radius: 6px;
          padding: 12px;
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }

        .info-box i {
          color: #0078d4;
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-box ul {
          margin: 0;
          padding-left: 18px;
          font-size: 12px;
          color: #333;
        }

        .info-box li {
          margin-bottom: 4px;
        }

        .validation-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .stat-card {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 16px;
          text-align: center;
        }

        .stat-card.stat-warning {
          background: #fff4ce;
          border-color: #ffc107;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #0078d4;
          margin-bottom: 4px;
        }

        .stat-card.stat-warning .stat-value {
          color: #ff6b6b;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .custom-methods-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .custom-method-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 13px;
        }

        .method-control-id {
          font-weight: 500;
          color: #1a1a1a;
          font-family: monospace;
        }

        .method-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 600;
          background: #e0e0e0;
          color: #333;
        }

        .method-badge[data-method="graphAPI"] {
          background: #cfe9ff;
          color: #0078d4;
        }

        .method-badge[data-method="powershell"] {
          background: #fff4ce;
          color: #ff9800;
        }

        .method-badge[data-method="hybrid"] {
          background: #c8e6c9;
          color: #2e7d32;
        }

        .settings-actions {
          display: flex;
          gap: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #0078d4;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #006dbe;
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f3f3f3;
          color: #1a1a1a;
          border: 1px solid #d0d0d0;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #e8e8e8;
        }

        .btn-secondary:disabled {
          background: #f3f3f3;
          color: #999;
          cursor: not-allowed;
        }

        .alert {
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          display: flex;
          gap: 12px;
        }

        .alert-error {
          background: #fff0f0;
          border: 1px solid #ffcccc;
          color: #d32f2f;
        }

        .alert-success {
          background: #f0fff4;
          border: 1px solid #c6f6d5;
          color: #22863a;
        }

        .alert i {
          font-size: 18px;
          flex-shrink: 0;
        }

        .alert h3 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .alert p {
          margin: 0;
          font-size: 13px;
        }
      `}</style>
    </div>
  `
}
