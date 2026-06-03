import { showToast } from '../components/toast.js'

const APPROVALS = [
  { id: 'REQ-001', type: 'Distribution Group', requestor: 'Priya Kumar', submitted: '2h ago', sla: '2h left', status: 'pending', detail: 'Create DG: marketing-emea@contoso.com' },
  { id: 'REQ-003', type: 'MFA Reset',          requestor: 'James Liu',   submitted: '3h ago', sla: 'Overdue', status: 'overdue', detail: 'MFA reset requested — lost device' },
  { id: 'REQ-006', type: 'SharePoint Access',   requestor: 'Sara Ogden',  submitted: '1h ago', sla: '3h left', status: 'pending', detail: 'SharePoint site: HR Documents — Read access' },
]

let approvalState = APPROVALS.map(r => ({ ...r }))

export function initApprovals() {
  const el = document.getElementById('page-approvals')
  if (!el) return
  renderApprovals(el)
}

function renderApprovals(el) {
  const pending = approvalState.filter(r => r.status === 'pending' || r.status === 'overdue').length
  const overdue = approvalState.filter(r => r.status === 'overdue').length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-check-list"></i> Pending Approvals</div>
        <div class="page-subtitle">Access requests awaiting your decision</div>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value warning">${pending}</div><div class="kpi-label">Pending</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${overdue}</div><div class="kpi-label">Overdue</div></div>
      <div class="kpi-tile"><div class="kpi-value success">4</div><div class="kpi-label">Approved Today</div></div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:10%">Ref</th>
          <th style="width:20%">Type</th>
          <th style="width:16%">Requestor</th>
          <th style="width:25%">Details</th>
          <th style="width:12%">SLA</th>
          <th style="width:17%">Action</th>
        </tr></thead>
        <tbody id="approvals-tbody">
          ${approvalState.map(r => approvalRow(r)).join('')}
        </tbody>
      </table>
    </div>
  `
  wireApprovalEvents(el)
}

function approvalRow(r) {
  const canAct = r.status === 'pending' || r.status === 'overdue'
  return `
    <tr data-id="${r.id}">
      <td class="monospace">${r.id}</td>
      <td>${r.type}</td>
      <td>${r.requestor}</td>
      <td style="font-size:10px;color:var(--color-text-secondary)">${r.detail}</td>
      <td ${r.sla === 'Overdue' ? 'class="sla-overdue"' : ''}>${r.sla}</td>
      <td class="approval-action-cell">
        ${canAct ? `
          <button class="btn btn-xs btn-success approval-approve" data-id="${r.id}"><i class="ti ti-check"></i> Approve</button>
          <button class="btn btn-xs btn-danger approval-reject" data-id="${r.id}" style="margin-left:4px"><i class="ti ti-x"></i> Reject</button>
        ` : `<span class="badge ${r.status === 'approved' ? 'success' : 'neutral'}">${r.status}</span>`}
      </td>
    </tr>
  `
}

function wireApprovalEvents(el) {
  el.querySelectorAll('.approval-approve').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const r = approvalState.find(x => x.id === id)
      if (r) r.status = 'approved'
      const cell = el.querySelector(`tr[data-id="${id}"] .approval-action-cell`)
      if (cell) cell.innerHTML = `<span class="badge success">Approved</span>`

      // Update nav badge
      const nb = document.querySelector('#n-approvals .nav-badge')
      if (nb) {
        const cur = parseInt(nb.textContent) - 1
        nb.textContent = Math.max(0, cur)
        if (cur <= 1) nb.style.display = 'none'
      }
      showToast(`Request ${id} approved.`, 'success')
    })
  })
  el.querySelectorAll('.approval-reject').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const r = approvalState.find(x => x.id === id)
      if (r) r.status = 'rejected'
      const cell = el.querySelector(`tr[data-id="${id}"] .approval-action-cell`)
      if (cell) cell.innerHTML = `<span class="badge neutral">Rejected</span>`
      showToast(`Request ${id} rejected.`, 'warning')
    })
  })
}
