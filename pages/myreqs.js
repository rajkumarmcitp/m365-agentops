export function initMyReqs() {
  const el = document.getElementById('page-myreqs')
  if (!el) return

  const statusColors = {
    'Submitted': { bg: 'var(--clr-info-bg)', text: 'var(--clr-info-text)', icon: 'ti-send' },
    'Awaiting Admin Approval': { bg: 'var(--clr-warning-bg)', text: 'var(--clr-warning-text)', icon: 'ti-alert-circle' },
    'Awaiting Manager Approval': { bg: 'var(--clr-warning-bg)', text: 'var(--clr-warning-text)', icon: 'ti-alert-circle' },
    'Completed': { bg: 'var(--clr-success-bg)', text: 'var(--clr-success-text)', icon: 'ti-circle-check' }
  }

  const mockRequests = [
    {
      requestId: 'REQ-008',
      title: 'Mail-Enabled Security Group',
      status: 'Awaiting Admin Approval',
      createdDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      details: {
        group: 'security-ops@contoso.com',
        owner: localStorage.getItem('m365ops_user') || 'You',
        path: 'Admin approval required'
      },
      timeline: [
        { event: 'Submitted', time: '3 hours ago', status: 'done' },
        { event: 'Manager approved', time: '2 hours ago', status: 'done' },
        { event: 'Awaiting admin approval', time: 'SLA: 4h remaining', status: 'active' },
        { event: 'Execution via Graph API', status: 'pending' },
        { event: 'Completed', status: 'pending' }
      ]
    },
    {
      requestId: 'REQ-007',
      title: 'Distribution Group',
      status: 'Awaiting Manager Approval',
      createdDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      details: {
        group: 'marketing-emea@contoso.com',
        path: 'Manager approval'
      },
      timeline: [
        { event: 'Submitted', time: 'Yesterday at 14:30', status: 'done' },
        { event: 'Awaiting manager approval', time: 'SLA: 2h remaining', status: 'active' },
        { event: 'Provisioning via Exchange', status: 'pending' },
        { event: 'Completed', status: 'pending' }
      ]
    },
    {
      requestId: 'REQ-005',
      title: 'SharePoint Site Access',
      status: 'Completed',
      createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      details: {
        site: 'HR Documents',
        level: 'Read',
        grantedBy: 'Sanjay Kumar'
      },
      timeline: [
        { event: 'Submitted', time: '4 days ago', status: 'done' },
        { event: 'Manager approved', time: '3 days ago', status: 'done' },
        { event: 'Access granted', time: '3 days ago at 09:15', status: 'done' },
        { event: 'Completed', time: 'Notification sent', status: 'done' }
      ]
    }
  ]

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-list-check"></i> My Requests</div>
        <div class="page-subtitle">Track the status of your submitted access requests</div>
      </div>
    </div>

    <div style="margin:16px">
      <div class="myreq-stats">
        <div class="myreq-stat-card">
          <div class="stat-value" style="color:var(--clr-info-text)">${mockRequests.length}</div>
          <div class="stat-label">Total Requests</div>
        </div>
        <div class="myreq-stat-card">
          <div class="stat-value" style="color:var(--clr-warning-text)">${mockRequests.filter(r => r.status.includes('Awaiting')).length}</div>
          <div class="stat-label">Pending Approval</div>
        </div>
        <div class="myreq-stat-card">
          <div class="stat-value" style="color:var(--clr-success-text)">${mockRequests.filter(r => r.status === 'Completed').length}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>

      <div class="card" style="padding:0;overflow:hidden;margin-top:16px">
        <table style="width:100%;border-collapse:collapse">
          <thead style="background:var(--color-background-secondary);border-bottom:1px solid var(--color-border-primary)">
            <tr>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--color-text-secondary)">Request ID</th>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--color-text-secondary)">Request Type</th>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--color-text-secondary)">Submitted On</th>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--color-text-secondary)">Current Status</th>
            </tr>
          </thead>
          <tbody>
            ${mockRequests.map(req => {
              const color = statusColors[req.status] || statusColors['Submitted']
              const createdDate = new Date(req.createdDate).toLocaleString('en-GB', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
              return `
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer;transition:background var(--transition)" class="req-table-row" data-req-id="${req.requestId}">
                  <td style="padding:12px;font-size:12px;font-weight:700;color:var(--clr-info-text)">${req.requestId}</td>
                  <td style="padding:12px;font-size:12px;color:var(--color-text-primary)">${req.title}</td>
                  <td style="padding:12px;font-size:12px;color:var(--color-text-secondary)">${createdDate}</td>
                  <td style="padding:12px;font-size:11px">
                    <span style="background:${color.bg};color:${color.text};padding:4px 8px;border-radius:4px;font-weight:600;display:inline-flex;align-items:center;gap:4px">
                      <i class="ti ${color.icon}" style="font-size:11px"></i> ${req.status}
                    </span>
                  </td>
                </tr>
                <tr style="display:none;background:var(--color-background-secondary);border-bottom:1px solid var(--color-border-primary)" class="req-details-row" data-req-id="${req.requestId}">
                  <td colspan="4" style="padding:16px">
                    <div style="font-size:11px;color:var(--color-text-primary);margin-bottom:16px;line-height:1.6">
                      ${Object.entries(req.details).map(([key, val], i) => `
                        <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${val}${i < Object.entries(req.details).length - 1 ? ' · ' : ''}
                      `).join('')}
                    </div>

                    <div style="font-size:10px;font-weight:600;text-transform:uppercase;color:var(--color-text-secondary);margin-bottom:8px">Timeline</div>
                    <div style="display:flex;flex-direction:column;gap:8px">
                      ${req.timeline.map(step => `
                        <div style="display:flex;gap:8px;align-items:flex-start">
                          <div style="width:20px;height:20px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;background:${step.status === 'done' ? 'var(--clr-success-bg)' : step.status === 'active' ? 'var(--clr-warning-bg)' : 'var(--color-border-secondary)'};color:${step.status === 'done' ? 'var(--clr-success-text)' : step.status === 'active' ? 'var(--clr-warning-text)' : 'var(--color-text-tertiary)'}">
                            ${step.status === 'done' ? '<i class="ti ti-check" style="font-size:10px"></i>' : step.status === 'active' ? '●' : '○'}
                          </div>
                          <div style="flex:1;padding-top:2px">
                            <div style="font-size:11px;font-weight:600;color:var(--color-text-primary)">${step.event}</div>
                            ${step.time ? `<div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">${step.time}</div>` : ''}
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `

  // Add click handlers for expand/collapse
  setTimeout(() => {
    document.querySelectorAll('.req-table-row').forEach(row => {
      row.addEventListener('mouseover', () => {
        row.style.background = 'var(--color-background-secondary)'
      })
      row.addEventListener('mouseout', () => {
        row.style.background = 'transparent'
      })

      row.addEventListener('click', () => {
        const reqId = row.dataset.reqId
        const detailsRow = document.querySelector(`.req-details-row[data-req-id="${reqId}"]`)

        // Close other expanded rows
        document.querySelectorAll('.req-details-row').forEach(dr => {
          if (dr.dataset.reqId !== reqId) {
            dr.style.display = 'none'
          }
        })

        // Toggle current row
        if (detailsRow.style.display === 'none' || detailsRow.style.display === '') {
          detailsRow.style.display = 'table-row'
        } else {
          detailsRow.style.display = 'none'
        }
      })
    })
  }, 100)
}
