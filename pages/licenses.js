export function initLicenses() {
  const el = document.getElementById('page-licenses')
  if (!el) return

  const licenses = [
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
      <div class="kpi-tile"><div class="kpi-value info">1,000</div><div class="kpi-label">Total Licenses</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">847</div><div class="kpi-label">Consumed</div></div>
      <div class="kpi-tile"><div class="kpi-value success">153</div><div class="kpi-label">Available</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">38</div><div class="kpi-label">Unused 90d+</div></div>
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
            const pct = Math.round(l.consumed / l.total * 100)
            return `
              <tr>
                <td><strong style="font-size:11px">${l.name}</strong></td>
                <td>${l.total.toLocaleString()}</td>
                <td>${l.consumed.toLocaleString()}</td>
                <td>${l.available.toLocaleString()}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="score-bar" style="flex:1">
                      <div class="score-bar-fill ${l.statusCls}" style="width:${pct}%"></div>
                    </div>
                    <span style="font-size:10px;font-weight:600;min-width:30px">${pct}%</span>
                  </div>
                </td>
                <td><span class="badge ${l.statusCls}" style="text-transform:capitalize">${l.status}</span></td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="alert-banner warning mt-3">
      <i class="ti ti-alert-triangle"></i>
      <strong>Microsoft 365 E5</strong> is at 98.7% capacity. Consider purchasing additional licenses to prevent service disruption.
    </div>
  `
}
