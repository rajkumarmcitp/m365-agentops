import { showToast } from '../components/toast.js'

const REQUESTS = [
  { id: 'REQ-001', type: 'Distribution Group', requestor: 'Priya Kumar', sla: '2h left', status: 'pending' },
  { id: 'REQ-002', type: 'Mail-Enabled SG', requestor: 'Sara Ogden', sla: '1h left', status: 'pending' },
  { id: 'REQ-003', type: 'MFA Reset', requestor: 'James Liu', sla: 'Overdue', status: 'overdue' },
  { id: 'REQ-004', type: 'SharePoint Access', requestor: 'Kevin Osei', sla: '4h left', status: 'in-progress' },
  { id: 'REQ-005', type: 'Shared Mailbox', requestor: 'Lucy Chan', sla: 'Completed', status: 'approved' },
]

let reqState = REQUESTS.map(r => ({ ...r }))

export function initRequests() {
  const el = document.getElementById('page-requests')
  if (!el) return
  renderRequests(el)
}

function renderRequests(el) {
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-inbox"></i> Access Requests</div>
        <div class="page-subtitle">Manage all pending and recent access requests</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-filter"></i> Filter</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">7</div><div class="kpi-label">Total Open</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">4</div><div class="kpi-label">Pending</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">1</div><div class="kpi-label">Overdue</div></div>
      <div class="kpi-tile"><div class="kpi-value success">2</div><div class="kpi-label">Approved Today</div></div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:10%">#</th>
          <th style="width:22%">Type</th>
          <th style="width:18%">Requestor</th>
          <th style="width:12%">SLA</th>
          <th style="width:15%">Status</th>
          <th style="width:23%">Action</th>
        </tr></thead>
        <tbody id="req-tbody">
          ${reqState.map(r => requestRow(r)).join('')}
        </tbody>
      </table>
    </div>
  `
  wireReqEvents(el)
}

function statusBadge(s) {
  if (s === 'approved') return `<span class="badge success dot">Approved</span>`
  if (s === 'overdue') return `<span class="badge danger dot">Overdue</span>`
  if (s === 'in-progress') return `<span class="badge info dot">In Progress</span>`
  if (s === 'rejected') return `<span class="badge neutral dot">Rejected</span>`
  return `<span class="badge warning dot">Pending</span>`
}

function requestRow(r) {
  const canAct = r.status === 'pending' || r.status === 'overdue' || r.status === 'in-progress'
  return `
    <tr data-id="${r.id}">
      <td class="monospace">${r.id}</td>
      <td>${r.type}</td>
      <td>${r.requestor}</td>
      <td ${r.sla === 'Overdue' ? 'class="sla-overdue"' : ''}>${r.sla}</td>
      <td class="req-status-cell">${statusBadge(r.status)}</td>
      <td>
        ${canAct ? `
          <button class="btn btn-xs btn-success req-approve-btn" data-id="${r.id}"><i class="ti ti-check"></i> Approve</button>
          <button class="btn btn-xs btn-danger req-reject-btn" data-id="${r.id}" style="margin-left:4px"><i class="ti ti-x"></i> Reject</button>
        ` : ''}
      </td>
    </tr>
  `
}

function wireReqEvents(el) {
  el.querySelectorAll('.req-approve-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const r = reqState.find(x => x.id === id)
      if (r) r.status = 'approved'
      const row = el.querySelector(`tr[data-id="${id}"]`)
      if (row) {
        row.querySelector('.req-status-cell').innerHTML = statusBadge('approved')
        row.querySelector('td:last-child').innerHTML = ''
      }
      showToast(`Request ${id} approved successfully.`, 'success')
    })
  })
  el.querySelectorAll('.req-reject-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const r = reqState.find(x => x.id === id)
      if (r) r.status = 'rejected'
      const row = el.querySelector(`tr[data-id="${id}"]`)
      if (row) {
        row.querySelector('.req-status-cell').innerHTML = statusBadge('rejected')
        row.querySelector('td:last-child').innerHTML = ''
      }
      showToast(`Request ${id} rejected.`, 'warning')
    })
  })
}
