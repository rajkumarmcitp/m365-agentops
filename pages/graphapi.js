import { state } from '../app.js'
import { showToast } from '../components/toast.js'
import { skeletonLoader } from '../lib/skeleton-loader.js'

// Determine API base URL - use App Service in production, local in dev
function getApiBaseUrl() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Local development - use backend port 3000
    return 'http://localhost:3000'
  }
  // Production - use App Service backend URL (matches api-client.js)
  return 'https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net'
}

const API_BASE = getApiBaseUrl()

async function loadGraphApiData() {
  const el = document.getElementById('page-graphapi')

  try {
    const headers = {
      'Content-Type': 'application/json',
      'X-User-Id': state.currentUser?.id || state.currentUser?.email || 'aisha',
      'X-User-Role': state.currentUser?.role || 'user'
    }

    const [configRes, healthRes, statsRes, endpointsRes, permissionsRes, historyRes] = await Promise.all([
      fetch(`${API_BASE}/api/graph/config`, { headers }).then(r => r.json()),
      fetch(`${API_BASE}/api/graph/config/health`, { headers }).then(r => r.json()),
      fetch(`${API_BASE}/api/graph/config/stats`, { headers }).then(r => r.json()),
      fetch(`${API_BASE}/api/graph/config/endpoints`, { headers }).then(r => r.json()),
      fetch(`${API_BASE}/api/graph/config/permissions`, { headers }).then(r => r.json()),
      fetch(`${API_BASE}/api/graph/config/history?limit=15`, { headers }).then(r => r.json())
    ])

    const config = configRes.data || {}
    const health = healthRes.data || {}
    const stats = statsRes.data?.configService || {}
    const endpoints = endpointsRes.data || {}
    const perms = permissionsRes.data || {}
    const history = historyRes.data || []

    renderGraphApiPage(el, config, health, stats, endpoints, perms, history)
  } catch (error) {
    console.error('Failed to load Graph API data:', error)
    showToast('Failed to load Graph API configuration', 'error')
    renderGraphApiPage(el, {}, {}, {}, {}, {}, [])
  }
}

function formatTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', { hour12: false })
}

function getHealthStatusBadge(status) {
  const statusMap = {
    'connected': { class: 'success', icon: 'ti-circle-check' },
    'initializing': { class: 'warning', icon: 'ti-hourglass' },
    'error': { class: 'danger', icon: 'ti-circle-x' },
    'disconnected': { class: 'secondary', icon: 'ti-wifi-off' }
  }
  const s = statusMap[status] || statusMap['disconnected']
  return `<span class="badge ${s.class}"><i class="ti ${s.icon}"></i> ${status}</span>`
}

function renderGraphApiPage(el, config, health, stats, endpoints, perms, history) {
  const statusColor = health.status === 'connected' ? 'success' : health.status === 'initializing' ? 'warning' : 'danger'
  const lastRefresh = health.lastTokenRefresh ? new Date(health.lastTokenRefresh).toLocaleString() : 'Never'

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-api"></i> Graph API Configuration</div>
      <div class="page-subtitle">Microsoft Graph API connection and permissions</div>
    </div>

    <div class="alert-banner ${statusColor} mb-3">
      <i class="ti ${health.status === 'connected' ? 'ti-circle-check' : health.status === 'initializing' ? 'ti-hourglass' : 'ti-circle-x'}"></i>
      <strong>${health.status ? health.status.charAt(0).toUpperCase() + health.status.slice(1) : 'Unknown'}</strong>
      — Last token refresh: ${formatTime(health.lastTokenRefresh) || 'Never'}
      <span class="badge ${statusColor}" style="margin-left:auto">Live</span>
    </div>

    <div class="tabs" id="graph-tabs">
      <button class="tab-btn active" data-tab="reg">App Registration</button>
      <button class="tab-btn" data-tab="perms">Permissions</button>
      <button class="tab-btn" data-tab="stats">Statistics</button>
      <button class="tab-btn" data-tab="endpoints">Endpoints</button>
      <button class="tab-btn" data-tab="throttle">Throttling</button>
      <button class="tab-btn" data-tab="logs">Audit Trail</button>
    </div>

    <div class="tab-panel active" id="graph-tab-reg">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-apps"></i> App Registration</div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Client ID</label>
            <div style="display:flex;gap:6px">
              <input type="text" class="form-input monospace" value="${config.credentials?.clientId || '—'}" readonly>
              <button class="btn btn-icon copy-val" data-val="${config.credentials?.clientId || ''}"><i class="ti ti-copy"></i></button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tenant ID</label>
            <div style="display:flex;gap:6px">
              <input type="text" class="form-input monospace" value="${config.credentials?.tenantId || '—'}" readonly>
              <button class="btn btn-icon copy-val" data-val="${config.credentials?.tenantId || ''}"><i class="ti ti-copy"></i></button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Client Secret</label>
            <div style="display:flex;gap:6px">
              <input type="password" class="form-input monospace" id="graph-secret" value="${config.credentials?.clientSecret || '•••••••••'}" readonly>
              <button class="btn btn-icon" id="graph-secret-toggle"><i class="ti ti-eye"></i></button>
              <button class="btn btn-icon" id="graph-rotate-secret" title="Rotate secret"><i class="ti ti-refresh"></i></button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Redirect URI</label>
            <input type="text" class="form-input monospace" value="${config.credentials?.redirectUri || '—'}" readonly>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-primary" id="graph-test-conn"><i class="ti ti-wifi-check"></i> Test connection</button>
          <button class="btn" id="graph-refresh-token"><i class="ti ti-refresh"></i> Refresh token</button>
          <button class="btn" id="graph-clear-cache"><i class="ti ti-trash"></i> Clear cache</button>
        </div>
        <div id="graph-status-display" style="margin-top:12px;padding:10px;border-radius:4px;background:#f5f5f5;border-left:3px solid #ccc;min-height:20px;font-size:12px;color:#666">
          <span style="color:#999">Status: Waiting for action...</span>
        </div>
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-perms">
      <div class="card mb-3">
        <div class="card-title mb-3">Application Permissions (${perms.app?.length || 0})</div>
        <table>
          <thead><tr><th style="width:40%">Permission</th><th style="width:60%">Description</th></tr></thead>
          <tbody>
            ${(perms.app || []).slice(0, 10).map(perm => `
              <tr>
                <td class="monospace" style="font-size:10px">${perm}</td>
                <td style="font-size:11px;color:var(--color-text-secondary)">Application permission</td>
              </tr>
            `).join('')}
            ${(!perms.app || perms.app.length === 0) ? '<tr><td colspan="2" style="text-align:center;color:var(--color-text-secondary)">No permissions configured</td></tr>' : ''}
          </tbody>
        </table>
      </div>
      <div class="card">
        <div class="card-title mb-3">Delegated Permissions (${perms.delegated?.length || 0})</div>
        <table>
          <thead><tr><th style="width:40%">Permission</th><th style="width:60%">Description</th></tr></thead>
          <tbody>
            ${(perms.delegated || []).map(perm => `
              <tr>
                <td class="monospace" style="font-size:10px">${perm}</td>
                <td style="font-size:11px;color:var(--color-text-secondary)">Delegated permission</td>
              </tr>
            `).join('')}
            ${(!perms.delegated || perms.delegated.length === 0) ? '<tr><td colspan="2" style="text-align:center;color:var(--color-text-secondary)">No permissions configured</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-stats">
      <div class="grid-2 mb-3">
        <div class="stat-card">
          <div class="stat-label">Total Requests</div>
          <div class="stat-value">${stats.totalRequests || 0}</div>
          <div class="stat-detail">${stats.successRate || 0}% success rate</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Cache Hit Rate</div>
          <div class="stat-value">${stats.cacheHitRate || '0'}%</div>
          <div class="stat-detail">${stats.cachedResponses || 0} cached responses</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Avg Latency</div>
          <div class="stat-value">${stats.avgLatency || '—'}</div>
          <div class="stat-detail">Min: ${stats.minLatency || '—'} / Max: ${stats.maxLatency || '—'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Throttled Requests</div>
          <div class="stat-value">${stats.throttledRequests || 0}</div>
          <div class="stat-detail">${stats.failedRequests || 0} failed</div>
        </div>
      </div>
      <div class="card">
        <div class="card-title mb-3">Health Status</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">Status</div>
            <div>${getHealthStatusBadge(health.status)}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">Error Count</div>
            <div style="font-size:18px;font-weight:600;color:${health.errorCount > 0 ? 'var(--color-danger)' : 'var(--color-success)'}">${health.errorCount || 0}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">Success Count</div>
            <div style="font-size:18px;font-weight:600;color:var(--color-success)">${health.successCount || 0}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">Uptime</div>
            <div style="font-size:12px">${health.uptime ? Math.floor(health.uptime / 3600000) + 'h' : '—'}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-endpoints">
      <div class="card">
        <div class="card-title mb-3">Graph API Endpoints by Category</div>
        ${Object.entries(endpoints).map(([section, eps]) => `
          <div class="section-heading">${section}</div>
          ${(eps || []).map(ep => `
            <div class="graph-endpoint-row">
              <span class="method-badge ${ep.method}">${ep.method}</span>
              <span class="graph-path">${ep.path}</span>
              <span style="flex:1;font-size:10px;color:var(--color-text-secondary)">${ep.description}</span>
            </div>
          `).join('')}
        `).join('')}
        ${Object.keys(endpoints).length === 0 ? '<p style="color:var(--color-text-secondary);text-align:center;padding:20px">No endpoints loaded</p>' : ''}
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-throttle">
      <div class="card">
        <div class="card-title mb-3">Throttling Configuration</div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Max retries</label>
            <input type="number" class="form-input" id="throttle-max-retries" value="${config.throttling?.maxRetries || 3}" min="1" max="10">
          </div>
          <div class="form-group">
            <label class="form-label">Backoff interval (ms)</label>
            <input type="number" class="form-input" id="throttle-backoff" value="${config.throttling?.backoffInterval || 1000}" min="500">
          </div>
          <div class="form-group">
            <label class="form-label">Retry strategy</label>
            <select class="form-select" id="throttle-strategy">
              <option value="exponential" ${config.throttling?.strategy === 'exponential' ? 'selected' : ''}>Exponential backoff</option>
              <option value="linear" ${config.throttling?.strategy === 'linear' ? 'selected' : ''}>Linear backoff</option>
              <option value="fixed" ${config.throttling?.strategy === 'fixed' ? 'selected' : ''}>Fixed interval</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Concurrent requests</label>
            <input type="number" class="form-input" id="throttle-concurrent" value="${config.throttling?.maxConcurrent || 4}" min="1" max="20">
          </div>
          <div class="form-group">
            <label class="form-label">Cache TTL (ms)</label>
            <input type="number" class="form-input" id="cache-ttl" value="${config.cache?.ttl || 1800000}" min="60000">
          </div>
          <div class="form-group">
            <label class="form-label">Cache enabled</label>
            <label class="toggle-switch">
              <input type="checkbox" id="cache-enabled" ${config.cache?.enabled ? 'checked' : ''}>
              <span class="toggle-track"></span>
            </label>
          </div>
        </div>
        <button class="btn btn-primary" id="throttle-save"><i class="ti ti-device-floppy"></i> Save throttling config</button>
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-logs">
      <div class="card" style="padding:0;overflow:hidden">
        <table>
          <thead><tr>
            <th style="width:15%">Action</th>
            <th style="width:20%">Changes</th>
            <th style="width:15%">Status</th>
            <th style="width:35%">Time</th>
            <th style="width:15%">Source</th>
          </tr></thead>
          <tbody>
            ${history.length > 0 ? history.map(entry => `
              <tr>
                <td style="font-size:11px;font-weight:500">${entry.action}</td>
                <td style="font-size:10px;color:var(--color-text-secondary)">${Object.keys(entry.changes || {}).join(', ') || '—'}</td>
                <td><span class="badge ${entry.status === 'success' ? 'success' : 'warning'}">${entry.status}</span></td>
                <td class="monospace" style="font-size:10px">${formatTime(entry.timestamp)}</td>
                <td style="font-size:10px;color:var(--color-text-secondary)">${entry.source || 'api'}</td>
              </tr>
            `).join('') : '<tr><td colspan="5" style="text-align:center;color:var(--color-text-secondary);padding:20px">No audit history available</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `

  setupEventHandlers(el, config)
}

function setupEventHandlers(el, config) {
  el.querySelectorAll('#graph-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('#graph-tabs .tab-btn').forEach(b => b.classList.remove('active'))
      el.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
      btn.classList.add('active')
      el.querySelector(`#graph-tab-${btn.dataset.tab}`).classList.add('active')
    })
  })

  el.querySelectorAll('.copy-val').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.val) {
        navigator.clipboard.writeText(btn.dataset.val)
        showToast('Copied to clipboard', 'success')
      }
    })
  })

  el.querySelector('#graph-secret-toggle')?.addEventListener('click', () => {
    const inp = el.querySelector('#graph-secret')
    inp.type = inp.type === 'password' ? 'text' : 'password'
  })

  el.querySelector('#graph-test-conn')?.addEventListener('click', async () => {
    const btn = el.querySelector('#graph-test-conn')
    const statusDisplay = el.querySelector('#graph-status-display')
    btn.disabled = true
    btn.innerHTML = '<i class="ti ti-hourglass"></i> Testing...'
    statusDisplay.innerHTML = '<span style="color:#ff9800">⏳ Testing connection...</span>'
    statusDisplay.style.borderLeftColor = '#ff9800'
    statusDisplay.style.background = '#fff3e0'

    try {
      const res = await fetch(`${API_BASE}/api/graph/config/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': state.currentUser?.id || state.currentUser?.email || 'aisha',
          'X-User-Role': state.currentUser?.role || 'user'
        }
      })

      if (!res.ok) {
        statusDisplay.innerHTML = `<span style="color:#d32f2f">❌ Connection failed: HTTP ${res.status}</span>`
        statusDisplay.style.borderLeftColor = '#d32f2f'
        statusDisplay.style.background = '#ffebee'
        return
      }

      const data = await res.json()
      console.log('Test connection response:', data)

      if (data.success) {
        statusDisplay.innerHTML = `<span style="color:#388e3c">✅ Connected successfully</span><br><small style="color:#666">Latency: ${data.latency}ms | ${new Date(data.timestamp).toLocaleString()}</small>`
        statusDisplay.style.borderLeftColor = '#388e3c'
        statusDisplay.style.background = '#e8f5e9'
      } else {
        statusDisplay.innerHTML = `<span style="color:#d32f2f">❌ ${data.message || 'Connection failed'}</span>`
        statusDisplay.style.borderLeftColor = '#d32f2f'
        statusDisplay.style.background = '#ffebee'
      }
    } catch (error) {
      console.error('Test connection error:', error)
      statusDisplay.innerHTML = `<span style="color:#d32f2f">❌ Connection test failed: ${error.message}</span>`
      statusDisplay.style.borderLeftColor = '#d32f2f'
      statusDisplay.style.background = '#ffebee'
    } finally {
      btn.disabled = false
      btn.innerHTML = '<i class="ti ti-wifi-check"></i> Test connection'
    }
  })

  el.querySelector('#graph-refresh-token')?.addEventListener('click', async () => {
    const btn = el.querySelector('#graph-refresh-token')
    const statusDisplay = el.querySelector('#graph-status-display')
    btn.disabled = true
    btn.innerHTML = '<i class="ti ti-hourglass"></i> Refreshing...'
    statusDisplay.innerHTML = '<span style="color:#ff9800">⏳ Refreshing token...</span>'
    statusDisplay.style.borderLeftColor = '#ff9800'
    statusDisplay.style.background = '#fff3e0'

    try {
      const res = await fetch(`${API_BASE}/api/graph/config/refresh-token`, { method: 'POST', headers: { 'X-User-Id': state.currentUser?.id || 'aisha', 'X-User-Role': state.currentUser?.role || 'user' } })
      const data = await res.json()
      if (data.success) {
        statusDisplay.innerHTML = `<span style="color:#388e3c">✅ Token refreshed successfully</span><br><small style="color:#666">Last refresh: ${new Date(data.lastRefresh || Date.now()).toLocaleString()}</small>`
        statusDisplay.style.borderLeftColor = '#388e3c'
        statusDisplay.style.background = '#e8f5e9'
      } else {
        statusDisplay.innerHTML = `<span style="color:#d32f2f">❌ Token refresh failed: ${data.message || 'Unknown error'}</span>`
        statusDisplay.style.borderLeftColor = '#d32f2f'
        statusDisplay.style.background = '#ffebee'
      }
    } catch (error) {
      statusDisplay.innerHTML = `<span style="color:#d32f2f">❌ Token refresh failed: ${error.message}</span>`
      statusDisplay.style.borderLeftColor = '#d32f2f'
      statusDisplay.style.background = '#ffebee'
    } finally {
      btn.disabled = false
      btn.innerHTML = '<i class="ti ti-refresh"></i> Refresh token'
    }
  })

  el.querySelector('#graph-clear-cache')?.addEventListener('click', async () => {
    const btn = el.querySelector('#graph-clear-cache')
    btn.disabled = true
    try {
      const res = await fetch(`${API_BASE}/api/graph/config/clear-cache`, { method: 'POST', headers: { 'X-User-Id': state.currentUser?.id || 'aisha', 'X-User-Role': state.currentUser?.role || 'user' } })
      const data = await res.json()
      if (data.success) {
        showToast('Cache cleared successfully', 'success')
      } else {
        showToast('Failed to clear cache', 'error')
      }
    } catch (error) {
      showToast('Cache clear failed: ' + error.message, 'error')
    } finally {
      btn.disabled = false
    }
  })

  el.querySelector('#graph-rotate-secret')?.addEventListener('click', () => {
    const newSecret = prompt('Enter new client secret:')
    if (newSecret) {
      fetch(`${API_BASE}/api/graph/config/rotate-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': state.currentUser?.email || state.currentUser?.id || 'aisha', 'X-User-Role': state.currentUser?.role || 'user' },
        body: JSON.stringify({ clientSecret: newSecret })
      }).then(r => r.json()).then(data => {
        if (data.success) {
          showToast('Credentials rotated successfully', 'success')
        } else {
          showToast('Failed to rotate credentials: ' + data.error, 'error')
        }
      }).catch(error => {
        showToast('Error: ' + error.message, 'error')
      })
    }
  })

  el.querySelector('#throttle-save')?.addEventListener('click', async () => {
    const btn = el.querySelector('#throttle-save')
    btn.disabled = true
    btn.innerHTML = '<i class="ti ti-hourglass"></i> Saving...'
    try {
      const res = await fetch(`${API_BASE}/api/graph/config/throttling`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': state.currentUser?.email || state.currentUser?.id || 'aisha', 'X-User-Role': state.currentUser?.role || 'user' },
        body: JSON.stringify({
          maxRetries: parseInt(el.querySelector('#throttle-max-retries').value),
          backoffInterval: parseInt(el.querySelector('#throttle-backoff').value),
          strategy: el.querySelector('#throttle-strategy').value,
          maxConcurrent: parseInt(el.querySelector('#throttle-concurrent').value)
        })
      })
      const data = await res.json()
      if (data.success) {
        showToast('Throttling configuration saved', 'success')
        const cacheRes = await fetch(`${API_BASE}/api/graph/config/cache`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-User-Id': state.currentUser?.email || state.currentUser?.id || 'aisha', 'X-User-Role': state.currentUser?.role || 'user' },
          body: JSON.stringify({
            ttl: parseInt(el.querySelector('#cache-ttl').value),
            enabled: el.querySelector('#cache-enabled').checked
          })
        })
        if (cacheRes.ok) {
          showToast('Cache configuration saved', 'success')
        }
      } else {
        showToast('Failed to save: ' + data.error, 'error')
      }
    } catch (error) {
      showToast('Save failed: ' + error.message, 'error')
    } finally {
      btn.disabled = false
      btn.innerHTML = '<i class="ti ti-device-floppy"></i> Save throttling config'
    }
  })
}

export function initGraphApi() {
  const el = document.getElementById('page-graphapi')
  if (!el) return

  if (state.currentUser?.role !== 'super') {
    el.innerHTML = `
      <div class="page-header"><div class="page-title"><i class="ti ti-api"></i> Graph API</div></div>
      <div class="locked-banner">
        <i class="ti ti-lock"></i>
        <h3>Super Admin access required</h3>
        <p>The Graph API configuration page is restricted to Super Admin role. Contact your administrator to request elevated access.</p>
      </div>
    `
    return
  }

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-api"></i> Graph API Configuration</div>
      <div class="page-subtitle">Microsoft Graph API connection and permissions</div>
    </div>
    <div style="padding:20px;text-align:center">
      <i class="ti ti-loader" style="animation:spin 1s linear infinite;font-size:24px"></i>
      <p style="margin-top:12px;color:var(--color-text-secondary)">Loading Graph API configuration...</p>
    </div>
  `

  loadGraphApiData()
}
