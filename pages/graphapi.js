import { state } from '../app.js'
import { showToast } from '../components/toast.js'

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

    <div class="alert-banner success mb-3">
      <i class="ti ti-circle-check"></i>
      <strong>Connected</strong> — Graph API connection is active. Last token refresh: 14 min ago.
      <span class="badge success" style="margin-left:auto">Live</span>
    </div>

    <div class="tabs" id="graph-tabs">
      <button class="tab-btn active" data-tab="reg">App Registration</button>
      <button class="tab-btn" data-tab="perms">Permissions</button>
      <button class="tab-btn" data-tab="endpoints">Endpoints</button>
      <button class="tab-btn" data-tab="throttle">Throttling</button>
      <button class="tab-btn" data-tab="logs">Logs</button>
    </div>

    <div class="tab-panel active" id="graph-tab-reg">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-apps"></i> App Registration</div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Client ID</label>
            <div style="display:flex;gap:6px">
              <input type="text" class="form-input monospace" value="a1b2c3d4-e5f6-7890-abcd-ef1234567890" readonly>
              <button class="btn btn-icon copy-val" data-val="a1b2c3d4-e5f6-7890-abcd-ef1234567890"><i class="ti ti-copy"></i></button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tenant ID</label>
            <div style="display:flex;gap:6px">
              <input type="text" class="form-input monospace" value="9f8e7d6c-5b4a-3210-fedc-ba9876543210" readonly>
              <button class="btn btn-icon copy-val" data-val="9f8e7d6c-5b4a-3210-fedc-ba9876543210"><i class="ti ti-copy"></i></button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Client Secret</label>
            <div style="display:flex;gap:6px">
              <input type="password" class="form-input monospace" id="graph-secret" value="•••••••••••••••••••••••••••••">
              <button class="btn btn-icon" id="graph-secret-toggle"><i class="ti ti-eye"></i></button>
            </div>
            <div style="display:flex;align-items:center;gap:6px;margin-top:4px">
              <span class="badge warning"><i class="ti ti-clock"></i> Expires in 47 days</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Redirect URI</label>
            <input type="text" class="form-input monospace" value="https://m365agentops.contoso.com/auth/callback" readonly>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-primary" id="graph-save"><i class="ti ti-device-floppy"></i> Save</button>
          <button class="btn" id="graph-refresh-token"><i class="ti ti-refresh"></i> Refresh token</button>
        </div>
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-perms">
      <div class="card mb-3">
        <div class="card-title mb-3">Application Permissions</div>
        <table>
          <thead><tr><th style="width:35%">Permission</th><th style="width:45%">Description</th><th style="width:20%">Enabled</th></tr></thead>
          <tbody>
            ${[
              ['User.Read.All', 'Read all users'],
              ['Group.ReadWrite.All', 'Read and write all groups'],
              ['Mail.ReadWrite', 'Read and write all mailboxes'],
              ['Directory.Read.All', 'Read directory data'],
              ['AuditLog.Read.All', 'Read audit log data'],
              ['Policy.Read.All', 'Read all policies'],
              ['DeviceManagementConfiguration.Read.All', 'Read Intune device configuration'],
            ].map(([perm, desc]) => `
              <tr>
                <td class="monospace" style="font-size:10px">${perm}</td>
                <td style="font-size:11px;color:var(--color-text-secondary)">${desc}</td>
                <td>
                  <label class="toggle-switch">
                    <input type="checkbox" checked>
                    <span class="toggle-track"></span>
                  </label>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <button class="btn btn-primary mt-3" id="graph-grant-consent"><i class="ti ti-shield-check"></i> Grant admin consent</button>
      </div>
      <div class="card">
        <div class="card-title mb-3">Delegated Permissions</div>
        <table>
          <thead><tr><th style="width:35%">Permission</th><th style="width:45%">Description</th><th style="width:20%">Enabled</th></tr></thead>
          <tbody>
            ${[
              ['User.Read', 'Read signed-in user profile'],
              ['openid', 'OpenID Connect sign-in'],
              ['offline_access', 'Maintain access offline'],
            ].map(([perm, desc]) => `
              <tr>
                <td class="monospace" style="font-size:10px">${perm}</td>
                <td style="font-size:11px;color:var(--color-text-secondary)">${desc}</td>
                <td>
                  <label class="toggle-switch">
                    <input type="checkbox" checked>
                    <span class="toggle-track"></span>
                  </label>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-endpoints">
      <div class="card">
        <div class="card-title mb-3">Graph API Endpoints</div>
        ${[
          { section: 'Groups', endpoints: [
            { method: 'GET', path: '/v1.0/groups', desc: 'List all groups' },
            { method: 'POST', path: '/v1.0/groups', desc: 'Create a new group' },
            { method: 'PATCH', path: '/v1.0/groups/{id}', desc: 'Update group properties' },
          ]},
          { section: 'Mailbox', endpoints: [
            { method: 'GET', path: '/v1.0/users/{id}/mailboxSettings', desc: 'Get mailbox settings' },
            { method: 'POST', path: '/v1.0/users/{id}/sendMail', desc: 'Send a message' },
          ]},
          { section: 'Identity', endpoints: [
            { method: 'GET', path: '/v1.0/users', desc: 'List all users' },
            { method: 'GET', path: '/v1.0/identity/conditionalAccess/policies', desc: 'List CA policies' },
          ]},
        ].map(section => `
          <div class="section-heading">${section.section}</div>
          ${section.endpoints.map(ep => `
            <div class="graph-endpoint-row">
              <span class="method-badge ${ep.method}">${ep.method}</span>
              <span class="graph-path">${ep.path}</span>
              <span style="flex:1;font-size:10px;color:var(--color-text-secondary)">${ep.desc}</span>
              <div class="status-dot active" title="Online"></div>
            </div>
          `).join('')}
        `).join('')}
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-throttle">
      <div class="card">
        <div class="card-title mb-3">Throttling Configuration</div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Max retries</label>
            <input type="number" class="form-input" value="3" min="1" max="10">
          </div>
          <div class="form-group">
            <label class="form-label">Backoff interval (ms)</label>
            <input type="number" class="form-input" value="1000" min="500">
          </div>
          <div class="form-group">
            <label class="form-label">Retry strategy</label>
            <select class="form-select"><option>Exponential backoff</option><option>Linear backoff</option><option>Fixed interval</option></select>
          </div>
          <div class="form-group">
            <label class="form-label">Concurrent requests</label>
            <input type="number" class="form-input" value="4" min="1" max="20">
          </div>
        </div>
        <button class="btn btn-primary" id="throttle-save"><i class="ti ti-device-floppy"></i> Save throttling config</button>
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-logs">
      <div class="card" style="padding:0;overflow:hidden">
        <table>
          <thead><tr>
            <th style="width:10%">Status</th>
            <th style="width:8%">Method</th>
            <th style="width:40%">Endpoint</th>
            <th style="width:25%">Description</th>
            <th style="width:17%">Time</th>
          </tr></thead>
          <tbody>
            ${[
              { status: 200, method: 'GET', path: '/v1.0/groups', desc: 'List groups', time: '08:47:12' },
              { status: 201, method: 'POST', path: '/v1.0/groups', desc: 'Create group: marketing-emea', time: '08:45:58' },
              { status: 200, method: 'GET', path: '/v1.0/users', desc: 'List users (all)', time: '08:45:03' },
              { status: 429, method: 'GET', path: '/v1.0/auditLogs/signIns', desc: 'Throttled — retrying', time: '08:44:21' },
            ].map(log => `
              <tr>
                <td><span class="badge ${log.status >= 400 ? 'danger' : log.status >= 200 && log.status < 300 ? 'success' : 'warning'}">${log.status}</span></td>
                <td class="monospace" style="font-size:10px">${log.method}</td>
                <td class="graph-path">${log.path}</td>
                <td style="font-size:10px;color:var(--color-text-secondary)">${log.desc}</td>
                <td class="monospace" style="font-size:10px">${log.time}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `

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
      navigator.clipboard.writeText(btn.dataset.val)
      showToast('Copied to clipboard.', 'success')
    })
  })

  el.querySelector('#graph-secret-toggle')?.addEventListener('click', () => {
    const inp = el.querySelector('#graph-secret')
    inp.type = inp.type === 'password' ? 'text' : 'password'
  })

  el.querySelector('#graph-save')?.addEventListener('click', () => showToast('Configuration saved.', 'success'))
  el.querySelector('#graph-refresh-token')?.addEventListener('click', () => showToast('Token refreshed successfully.', 'success'))
  el.querySelector('#graph-grant-consent')?.addEventListener('click', () => showToast('Admin consent granted for all permissions.', 'success'))
  el.querySelector('#throttle-save')?.addEventListener('click', () => showToast('Throttling configuration saved.', 'success'))
}
