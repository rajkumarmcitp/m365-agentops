import { showToast } from '../components/toast.js'

export function initM365Config() {
  const el = document.getElementById('page-m365config')
  if (!el) return

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> M365 Config — CIS Benchmark</div>
        <div class="page-subtitle">Configuration compliance assessment from Graph API</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-scan-now"><i class="ti ti-refresh"></i> Run scan</button>
      </div>
    </div>

    <div class="blank-state">
      <i class="ti ti-settings-off" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:12px"></i>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">No Configuration Data Available</div>
      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:16px">
        M365 Configuration scanning requires real-time assessment through Microsoft Graph API
      </div>
      <div style="font-size:10px;color:var(--color-text-tertiary);padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);text-align:left;max-width:400px">
        <strong>Data sources:</strong>
        <div style="margin-top:6px;font-family:monospace;font-size:9px">
          /deviceManagement/deviceCompliancePolicies<br>
          /policies/conditionalAccessPolicies<br>
          /identity/authenticationMethods/policies<br>
          /admin/windows/updates/configs
        </div>
      </div>
    </div>
  `

  el.querySelector('#cfg-scan-now').addEventListener('click', () => {
    const btn = el.querySelector('#cfg-scan-now')
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Run scan`
      btn.disabled = false
      showToast('No configuration data available from Graph API', 'info')
    }, 2000)
  })
}
