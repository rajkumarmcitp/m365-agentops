export function initMyReqs() {
  const el = document.getElementById('page-myreqs')
  if (!el) return

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title"><i class="ti ti-list-check"></i> My Requests</div>
      <div class="page-subtitle">Track the status of your submitted access requests</div>
    </div>

    <!-- Request 1: MESG awaiting admin -->
    <div class="request-card">
      <div class="req-header">
        <div>
          <div style="font-size:13px;font-weight:700">Mail-Enabled Security Group</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">REQ-008 · Submitted 3 hours ago</div>
        </div>
        <span class="badge warning dot">Awaiting Admin Approval</span>
      </div>
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.5">
        <strong>Group:</strong> security-ops@contoso.com &nbsp;·&nbsp; <strong>Owner:</strong> ${localStorage.getItem('m365ops_user') || 'You'} &nbsp;·&nbsp; <strong>Approval path:</strong> Admin approval required
      </div>
      <div class="alert-banner info" style="margin-bottom:10px">
        <i class="ti ti-api"></i>
        <span>Execution will use <strong>POST /groups</strong> via Graph API to provision the group with security settings.</span>
      </div>
      <div class="req-timeline">
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Submitted</strong> · 3 hours ago</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Manager approved</strong> · 2 hours ago</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot active"></div>
          <div class="tl-label active"><strong>Awaiting admin approval</strong> · SLA: 4h remaining</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot pending"></div>
          <div class="tl-label">Execution via Graph API</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot pending"></div>
          <div class="tl-label">Completed</div>
        </div>
      </div>
    </div>

    <!-- Request 2: DG awaiting manager -->
    <div class="request-card">
      <div class="req-header">
        <div>
          <div style="font-size:13px;font-weight:700">Distribution Group</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">REQ-007 · Submitted yesterday</div>
        </div>
        <span class="badge warning dot">Awaiting Manager Approval</span>
      </div>
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.5">
        <strong>Group:</strong> marketing-emea@contoso.com &nbsp;·&nbsp; <strong>Approval path:</strong> Manager approval
      </div>
      <div class="req-timeline">
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Submitted</strong> · Yesterday at 14:30</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot active"></div>
          <div class="tl-label active"><strong>Awaiting manager approval</strong> · SLA: 2h remaining</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot pending"></div>
          <div class="tl-label">Provisioning via Exchange Admin Center</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot pending"></div>
          <div class="tl-label">Completed</div>
        </div>
      </div>
    </div>

    <!-- Request 3: Completed SharePoint -->
    <div class="request-card">
      <div class="req-header">
        <div>
          <div style="font-size:13px;font-weight:700">SharePoint Site Access</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">REQ-005 · Completed 3 days ago</div>
        </div>
        <span class="badge success dot">Completed</span>
      </div>
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.5">
        <strong>Site:</strong> HR Documents &nbsp;·&nbsp; <strong>Level:</strong> Read &nbsp;·&nbsp; <strong>Granted by:</strong> Sanjay Kumar
      </div>
      <div class="req-timeline">
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Submitted</strong> · 4 days ago</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Manager approved</strong> · 3 days ago</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Access granted</strong> · 3 days ago at 09:15</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Completed</strong> · Notification sent</div>
        </div>
      </div>
    </div>
  `
}
