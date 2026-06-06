import { callAPI } from '../lib/api-client.js'

let realLicenses = []
let licenseSummary = { total: 0, consumed: 0, available: 0, utilizationPct: 0 }

export async function initLicenses() {
  const el = document.getElementById('page-licenses')
  if (!el) return

  el.innerHTML = `<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading license data...</p></div>`

  // Fetch real licenses
  try {
    console.log('📡 Fetching real license data from backend...')
    const result = await callAPI('/licenses')
    if (result.success && result.data) {
      realLicenses = result.data
      licenseSummary = result.summary || { total: 0, consumed: 0, available: 0, utilizationPct: 0 }
      console.log(`✅ Loaded ${realLicenses.length} licenses`)
    }
  } catch (error) {
    console.error('❌ Error loading license data:', error)
  }

  const licenses = realLicenses.length > 0 ? realLicenses : [
    { name: 'Microsoft 365 E3', total: 600, consumed: 581, available: 19, status: 'monitor', statusCls: 'warning' },
    { name: 'Microsoft 365 E5', total: 150, consumed: 148, available: 2, status: 'critical', statusCls: 'danger' },
    { name: 'Exchange Online P1', total: 100, consumed: 72, available: 28, status: 'healthy', statusCls: 'success' },
    { name: 'Power BI Pro', total: 100, consumed: 38, available: 62, status: 'healthy', statusCls: 'success' },
  ]

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-license"></i> License Management</div>
        <div class="page-subtitle">Track and manage Microsoft 365 license assignments</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">${licenseSummary.total.toLocaleString()}</div><div class="kpi-label">Total Licenses</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${licenseSummary.consumed.toLocaleString()}</div><div class="kpi-label">Consumed</div></div>
      <div class="kpi-tile"><div class="kpi-value success">${licenseSummary.available.toLocaleString()}</div><div class="kpi-label">Available</div></div>
      <div class="kpi-tile"><div class="kpi-value" style="color:var(--clr-warning-text)">${licenseSummary.utilizationPct}%</div><div class="kpi-label">Utilization</div></div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:30%">License</th>
          <th style="width:12%">Total</th>
          <th style="width:12%">Consumed</th>
          <th style="width:12%">Available</th>
          <th style="width:22%">Usage</th>
          <th style="width:12%">Health</th>
        </tr></thead>
        <tbody>
          ${licenses.map(l => {
            const pct = l.utilizationPct || 0
            return `
              <tr>
                <td><strong style="font-size:11px">${l.name || '—'}</strong></td>
                <td>${(l.total || 0).toLocaleString()}</td>
                <td>${(l.consumed || 0).toLocaleString()}</td>
                <td>${(l.available || 0).toLocaleString()}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="score-bar" style="flex:1">
                      <div class="score-bar-fill ${l.statusCls || 'success'}" style="width:${pct}%"></div>
                    </div>
                    <span style="font-size:10px;font-weight:600;min-width:30px">${pct}%</span>
                  </div>
                </td>
                <td><span class="badge ${l.statusCls || 'success'}" style="text-transform:capitalize">${l.status || 'healthy'}</span></td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    </div>

    ${licenses.some(l => l.status === 'critical') ? `
    <div class="alert-banner danger mt-3">
      <i class="ti ti-alert-triangle"></i>
      <strong>${licenses.find(l => l.status === 'critical')?.name || 'A license'}</strong> is at ${licenses.find(l => l.status === 'critical')?.utilizationPct || 0}% capacity. Consider purchasing additional licenses to prevent service disruption.
    </div>
    ` : licenses.some(l => l.status === 'monitor') ? `
    <div class="alert-banner warning mt-3">
      <i class="ti ti-alert-triangle"></i>
      <strong>${licenses.find(l => l.status === 'monitor')?.name || 'A license'}</strong> is at ${licenses.find(l => l.status === 'monitor')?.utilizationPct || 0}% capacity. Monitor usage and plan for additional licenses.
    </div>
    ` : ''}
  `
}
