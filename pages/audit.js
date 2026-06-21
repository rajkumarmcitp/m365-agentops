import { skeletonLoader } from '../lib/skeleton-loader.js'

export function initAudit() {
  const el = document.getElementById('page-audit')
  if (!el) return

  // Show skeleton immediately
  el.innerHTML = `
    <div>
      ${skeletonLoader.renderPageHeader('Audit Log', 'Administrative and security event audit trail', true)}
      ${skeletonLoader.renderMetricsRowSkeleton(3)}
      ${skeletonLoader.renderTableSkeleton(5, 10)}
    </div>
  `

  renderAuditContent(el)
}

function renderAuditContent(el) {
  const events = [
    { time: 'Today 08:47', event: 'Config Agent scan completed', user: 'M365 Config Agent', category: 'Compliance', severity: 'info', sevCls: 'info' },
    { time: 'Today 08:15', event: 'High-risk sign-in detected', user: 'kevin.osei@contoso.com', category: 'Security', severity: 'high', sevCls: 'danger' },
    { time: 'Yesterday 16:30', event: 'Access request approved (REQ-005)', user: 'Sanjay Kumar', category: 'Access', severity: 'low', sevCls: 'success' },
    { time: 'Yesterday 14:12', event: 'PIM role activated — Compliance Admin', user: 'sam.torres@contoso.com', category: 'Identity', severity: 'medium', sevCls: 'warning' },
  ]

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-database"></i> Audit Log</div>
      <div class="page-subtitle">Administrative and security event audit trail</div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">248</div><div class="kpi-label">Events today</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">3</div><div class="kpi-label">High severity</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">14</div><div class="kpi-label">Medium severity</div></div>
    </div>

    <div class="filter-bar mb-3">
      <input type="text" class="form-input search" placeholder="Search events...">
      <select class="form-select"><option>All categories</option><option>Security</option><option>Compliance</option><option>Identity</option><option>Access</option></select>
      <select class="form-select"><option>All severity</option><option>High</option><option>Medium</option><option>Low</option></select>
      <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:15%">Time</th>
          <th style="width:35%">Event</th>
          <th style="width:20%">User</th>
          <th style="width:15%">Category</th>
          <th style="width:15%">Severity</th>
        </tr></thead>
        <tbody>
          ${events.map(e => `
            <tr>
              <td class="monospace" style="font-size:10px">${e.time}</td>
              <td style="font-size:11px">${e.event}</td>
              <td class="monospace" style="font-size:10px">${e.user}</td>
              <td><span class="badge neutral">${e.category}</span></td>
              <td><span class="badge ${e.sevCls}" style="text-transform:capitalize">${e.severity}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}
}
