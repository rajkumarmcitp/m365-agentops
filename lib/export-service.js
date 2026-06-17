// ============================================================
// Export & Reporting Service
// Generates CSV exports and compliance reports
// ============================================================

export function exportToCSV(requests, filename = 'requests.csv') {
  const headers = [
    'Request ID',
    'Service',
    'Operation',
    'Status',
    'Priority',
    'Submitted By',
    'Submitted Date',
    'Approved Date',
    'Completed Date',
    'SLA Hours',
    'Approval Time (hours)'
  ]

  const rows = requests.map(req => {
    const submittedDate = new Date(req.createdDate)
    const approvedDate = req.approvedDate ? new Date(req.approvedDate) : null
    const approvalTime = approvedDate
      ? ((approvedDate.getTime() - submittedDate.getTime()) / (1000 * 60 * 60)).toFixed(2)
      : 'N/A'

    return [
      req.requestId,
      req.service || '',
      req.operation || '',
      req.status || '',
      req.priority || 'normal',
      req.requesterId || '',
      submittedDate.toISOString(),
      approvedDate ? approvedDate.toISOString() : '',
      req.completedDate ? new Date(req.completedDate).toISOString() : '',
      req.slaHours || '24',
      approvalTime
    ]
  })

  // Build CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function generateComplianceReport(requests) {
  const now = new Date()
  const last30days = requests.filter(r => {
    const submittedDate = new Date(r.createdDate)
    return (now.getTime() - submittedDate.getTime()) < (30 * 24 * 60 * 60 * 1000)
  })

  const stats = {
    totalRequests: requests.length,
    requestsLast30Days: last30days.length,
    submitted: requests.filter(r => r.status === 'Submitted').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
    completed: requests.filter(r => r.status === 'Completed').length,
    approvalRate: requests.length > 0
      ? (requests.filter(r => r.status === 'Approved' || r.status === 'Completed').length / requests.length * 100).toFixed(2)
      : 0,
    rejectionRate: requests.length > 0
      ? (requests.filter(r => r.status === 'Rejected').length / requests.length * 100).toFixed(2)
      : 0,
    avgApprovalTime: calculateAverageApprovalTime(requests),
    slaCompliance: calculateSLACompliance(requests),
    priorityBreakdown: {
      critical: requests.filter(r => r.priority === 'critical').length,
      high: requests.filter(r => r.priority === 'high').length,
      normal: requests.filter(r => r.priority === 'normal').length,
      low: requests.filter(r => r.priority === 'low').length
    },
    serviceBreakdown: getServiceBreakdown(requests)
  }

  return stats
}

export function generateComplianceReportHTML(stats) {
  const reportDate = new Date().toLocaleString()

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 900px; margin: 0 auto;">
      <h1 style="color: #333; border-bottom: 2px solid #0066CC; padding-bottom: 10px;">
        Service Request Compliance Report
      </h1>
      <p style="color: #666; font-size: 12px;">Generated: ${reportDate}</p>

      <h2 style="color: #0066CC; margin-top: 30px;">Overview</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background: #F5F5F5;">
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Total Requests</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.totalRequests}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Requests (Last 30 Days)</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.requestsLast30Days}</td>
        </tr>
        <tr style="background: #F5F5F5;">
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Approval Rate</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.approvalRate}%</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Rejection Rate</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.rejectionRate}%</td>
        </tr>
        <tr style="background: #F5F5F5;">
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Avg Approval Time</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.avgApprovalTime} hours</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>SLA Compliance</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD; color: ${stats.slaCompliance >= 95 ? 'green' : 'orange'}; font-weight: bold;">
            ${stats.slaCompliance}%
          </td>
        </tr>
      </table>

      <h2 style="color: #0066CC; margin-top: 30px;">Status Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background: #F5F5F5;">
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Submitted</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.submitted}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Approved</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.approved}</td>
        </tr>
        <tr style="background: #F5F5F5;">
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Rejected</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.rejected}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Completed</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.completed}</td>
        </tr>
      </table>

      <h2 style="color: #0066CC; margin-top: 30px;">Priority Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background: #F5F5F5;">
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Critical</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.priorityBreakdown.critical}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>High</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.priorityBreakdown.high}</td>
        </tr>
        <tr style="background: #F5F5F5;">
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Normal</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.priorityBreakdown.normal}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #DDD;"><strong>Low</strong></td>
          <td style="padding: 10px; border: 1px solid #DDD;">${stats.priorityBreakdown.low}</td>
        </tr>
      </table>

      <p style="color: #666; font-size: 11px; margin-top: 30px; border-top: 1px solid #DDD; padding-top: 10px;">
        This report was auto-generated. For detailed request information, see the request list.
      </p>
    </div>
  `
}

function calculateAverageApprovalTime(requests) {
  const approvedRequests = requests.filter(r =>
    r.status === 'Approved' || r.status === 'Completed'
  ).filter(r => r.approvedDate)

  if (approvedRequests.length === 0) return 0

  const totalTime = approvedRequests.reduce((sum, r) => {
    const submitted = new Date(r.createdDate).getTime()
    const approved = new Date(r.approvedDate).getTime()
    return sum + (approved - submitted)
  }, 0)

  return (totalTime / approvedRequests.length / (1000 * 60 * 60)).toFixed(2)
}

function calculateSLACompliance(requests) {
  const completedRequests = requests.filter(r =>
    r.status === 'Completed' || r.status === 'Approved'
  ).filter(r => r.approvedDate)

  if (completedRequests.length === 0) return 100

  const onTime = completedRequests.filter(r => {
    const submitted = new Date(r.createdDate).getTime()
    const approved = new Date(r.approvedDate).getTime()
    const slaMs = (r.slaHours || 24) * 60 * 60 * 1000
    return (approved - submitted) <= slaMs
  })

  return ((onTime.length / completedRequests.length) * 100).toFixed(2)
}

function getServiceBreakdown(requests) {
  const breakdown = {}
  requests.forEach(r => {
    const service = r.service || 'Unknown'
    breakdown[service] = (breakdown[service] || 0) + 1
  })
  return breakdown
}
