import { getAlertSummary, getAlerts, dismissAlert, getCorrelations, getPatterns, startInvestigation, getInvestigation, chatInvestigation, generateInvestigationReport } from '../lib/tenantguard-client.js'
import { showToast } from '../components/toast.js'
import { isDemoAccount } from '../lib/demo-account.js'

let activeSection = 'alerts'
let activeFilter = 'all'
let activePriorityFilter = 'all'
let selectedAlertId = null
let selectedCorrelationId = null
let selectedPatternId = null
let allAlerts = []
let allCorrelations = []
let allInvestigations = []
let currentInvestigation = null
let selectedInvestigation = null
let investigationStatusFilter = 'all'
let autoRefreshInterval = null

const SEVERITY_TABS = [
  { id: 'all', label: 'All Alerts', icon: 'ti-list' },
  { id: 'CRITICAL', label: 'Critical', icon: 'ti-alert-triangle' },
  { id: 'HIGH', label: 'High', icon: 'ti-alert-circle' },
  { id: 'MEDIUM', label: 'Medium', icon: 'ti-alert-octagon' },
]

const PRIORITY_TABS = [
  { id: 'all', label: 'All Priorities', icon: 'ti-list' },
  { id: 'P1', label: '🔴 P1 - Critical', icon: 'ti-alert-triangle', color: '#dc3545' },
  { id: 'P2', label: '🟠 P2 - High', icon: 'ti-alert-circle', color: '#fd7e14' },
  { id: 'P3', label: '🟡 P3 - Info', icon: 'ti-alert-octagon', color: '#ffc107' },
]

const MAIN_TABS = [
  { id: 'alerts', label: 'Alerts', icon: 'ti-list' },
  { id: 'correlations', label: 'Correlations', icon: 'ti-link' },
  { id: 'patterns', label: 'Attack Patterns', icon: 'ti-alert-triangle' },
  { id: 'investigations', label: 'Investigations', icon: 'ti-magnifying-glass' },
  { id: 'investigation', label: 'AI Analysis', icon: 'ti-robot' },
]

const INVESTIGATION_STATUSES = [
  { id: 'all', label: 'All', icon: 'ti-list' },
  { id: 'OPEN', label: 'Open', icon: 'ti-alert-circle', color: '#fd7e14' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: 'ti-loader', color: '#0dcaf0' },
  { id: 'RESOLVED', label: 'Resolved', icon: 'ti-check', color: '#198754' },
  { id: 'CLOSED', label: 'Closed', icon: 'ti-lock', color: '#6c757d' },
]

export async function initTenantGuard() {
  const el = document.getElementById('page-tenantguard')
  if (!el) return

  if (isDemoAccount()) {
    console.log('🎭 Demo account detected - showing demo TenantGuard alerts')
    renderDemoTenantGuard(el)
    return
  }

  el.innerHTML = `<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading TenantGuard alerts...</p></div>`

  try {
    await refreshData()
  } catch (error) {
    console.error('Error initializing TenantGuard:', error)
    showToast('Failed to load alerts', 'error')
  }

  // Set up auto-refresh (every 5 minutes)
  if (autoRefreshInterval) clearInterval(autoRefreshInterval)
  autoRefreshInterval = setInterval(refreshData, 5 * 60 * 1000)
}

async function refreshData() {
  try {
    const [summary, alerts, correlations] = await Promise.all([
      getAlertSummary(),
      getAlerts('all', 100),
      getCorrelations('all')
    ])

    // Use real data
    allAlerts = alerts || []
    allCorrelations = correlations || []

    // Recalculate summary with merged alerts and deduplicated correlations
    const mergedSummary = {
      critical: allAlerts.filter(a => a.severity === 'CRITICAL').length,
      high: allAlerts.filter(a => a.severity === 'HIGH').length,
      medium: allAlerts.filter(a => a.severity === 'MEDIUM').length,
      total: allAlerts.length
    }

    render(mergedSummary)
  } catch (error) {
    console.error('Error refreshing data:', error)
    showToast('Failed to refresh alerts: ' + error.message, 'error')
  }
}

function getDemoAlertsForTesting() {
  return [
    { id: 'alert-6', priority: 'P1', severity: 'CRITICAL', headline: 'MFA Requirement Disabled for Critical Users', description: 'MFA requirement has been disabled organization-wide, removing mandatory multi-factor authentication.', actor: 'security-admin@contoso.com', action_timestamp: '2026-06-19T15:20:10Z', source: 'Entra ID Audit', timestamp: '2026-06-19 15:20:10', status: 'open', score: 94, riskScore: 94 },
    { id: 'alert-7', priority: 'P1', severity: 'CRITICAL', headline: 'Conditional Access Policy Modified/Weakened', description: 'Critical Conditional Access policy blocking high-risk sign-ins was disabled.', actor: 'cloud-admin@contoso.com', action_timestamp: '2026-06-19T14:55:30Z', source: 'Entra ID', timestamp: '2026-06-19 14:55:30', status: 'open', score: 93, riskScore: 93 },
    { id: 'alert-8', priority: 'P2', severity: 'HIGH', headline: 'Conditional Access Exception Created', description: 'A Conditional Access policy exception was created excluding 25 users from MFA requirements.', actor: 'identity-admin@contoso.com', action_timestamp: '2026-06-19T14:30:45Z', source: 'Entra ID', timestamp: '2026-06-19 14:30:45', status: 'open', score: 82, riskScore: 82 },
    { id: 'alert-9', priority: 'P1', severity: 'CRITICAL', headline: 'Legacy Authentication Allowed', description: 'Legacy authentication protocols (IMAP, POP3) were enabled for all mailboxes.', actor: 'exchange-admin@contoso.com', action_timestamp: '2026-06-19T14:10:22Z', source: 'Exchange', timestamp: '2026-06-19 14:10:22', status: 'open', score: 91, riskScore: 91 },
    { id: 'alert-10', priority: 'P2', severity: 'HIGH', headline: 'Passwordless Sign-in Disabled', description: 'Windows Hello for Business and FIDO2 were disabled organization-wide.', actor: 'identity-team@contoso.com', action_timestamp: '2026-06-19T13:45:15Z', source: 'Entra ID', timestamp: '2026-06-19 13:45:15', status: 'open', score: 76, riskScore: 76 },
    { id: 'alert-11', priority: 'P1', severity: 'CRITICAL', headline: 'Security Defaults Policy Changed', description: 'Azure AD Security Defaults were disabled, removing baseline security protections.', actor: 'global-admin@contoso.com', action_timestamp: '2026-06-19T13:20:08Z', source: 'Entra ID', timestamp: '2026-06-19 13:20:08', status: 'open', score: 92, riskScore: 92 },
    { id: 'alert-12', priority: 'P2', severity: 'HIGH', headline: 'Password Expiration Policy Disabled', description: 'Password expiration policy was disabled allowing passwords to never expire.', actor: 'compliance-admin@contoso.com', action_timestamp: '2026-06-19T12:55:40Z', source: 'Config Drift', timestamp: '2026-06-19 12:55:40', status: 'open', score: 80, riskScore: 80 },
    { id: 'alert-13', priority: 'P1', severity: 'CRITICAL', headline: 'Risk-Based Sign-in Policy Disabled', description: 'Azure AD Identity Protection risk-based policies were disabled.', actor: 'security-admin@contoso.com', action_timestamp: '2026-06-19T12:30:25Z', source: 'Entra ID Protection', timestamp: '2026-06-19 12:30:25', status: 'open', score: 88, riskScore: 88 },
    { id: 'alert-14', priority: 'P2', severity: 'HIGH', headline: 'Multi-Tenant Access Policy Modified', description: 'Cross-tenant B2B collaboration restrictions were removed for external organizations.', actor: 'identity-admin@contoso.com', action_timestamp: '2026-06-19T12:05:33Z', source: 'Entra ID', timestamp: '2026-06-19 12:05:33', status: 'open', score: 75, riskScore: 75 },
    { id: 'alert-15', priority: 'P1', severity: 'CRITICAL', headline: 'Service Principal Secret Expired/Removed', description: 'Service principal "DataExport-API" credentials expired, breaking application authentication.', actor: 'app-admin@contoso.com', action_timestamp: '2026-06-19T11:40:12Z', source: 'Entra ID', timestamp: '2026-06-19 11:40:12', status: 'open', score: 87, riskScore: 87 },
    { id: 'alert-16', priority: 'P2', severity: 'HIGH', headline: 'Application Permission Grant Consent by User', description: 'User john.smith@contoso.com granted third-party app "CloudStorage Pro" access to Mail.Read.', actor: 'user@contoso.com', action_timestamp: '2026-06-19T11:15:50Z', source: 'Application', timestamp: '2026-06-19 11:15:50', status: 'open', score: 78, riskScore: 78 },
    { id: 'alert-17', priority: 'P1', severity: 'CRITICAL', headline: 'High-Risk OAuth Application Granted', description: 'OAuth app "MailSync-Pro" was granted Directory.ReadWrite.All permissions.', actor: 'system', action_timestamp: '2026-06-19T10:50:35Z', source: 'Application', timestamp: '2026-06-19 10:50:35', status: 'open', score: 90, riskScore: 90 },
    { id: 'alert-18', priority: 'P1', severity: 'CRITICAL', headline: 'Service Principal Granted Admin Consent', description: 'Service principal "AnalyticsEngine" received tenant-wide admin consent for sensitive APIs.', actor: 'admin@contoso.com', action_timestamp: '2026-06-19T10:25:18Z', source: 'Application', timestamp: '2026-06-19 10:25:18', status: 'open', score: 92, riskScore: 92 },
    { id: 'alert-19', priority: 'P2', severity: 'HIGH', headline: 'DLP Policy Exception Created', description: 'Exception created for "Finance Department" to bypass DLP policy restrictions on credit card data.', actor: 'dlp-admin@contoso.com', action_timestamp: '2026-06-19T10:00:45Z', source: 'DLP Compliance', timestamp: '2026-06-19 10:00:45', status: 'open', score: 74, riskScore: 74 },
    { id: 'alert-20', priority: 'P1', severity: 'CRITICAL', headline: 'Audit Log Purge/Deletion Detected', description: 'Audit logs from the past 60 days were purged from the unified audit log.', actor: 'compliance-admin@contoso.com', action_timestamp: '2026-06-19T09:35:22Z', source: 'Unified Audit Log', timestamp: '2026-06-19 09:35:22', status: 'open', score: 96, riskScore: 96 },
  ]
}

function getDemoCorrelationsForTesting() {
  return [
    { id: 'corr-3', description: 'MFA and Conditional Access Policy Changes - Coordinated Security Bypass', pattern_type: 'POLICY_MODIFICATION', correlation_type: 'PATTERN', correlation_score: 89, risk_level: 'CRITICAL', alert_count: 3, alert_ids: 'alert-6,alert-7,alert-11', start_timestamp: '2026-06-19T15:20:10Z', end_timestamp: '2026-06-19T15:45:00Z' },
    { id: 'corr-4', description: 'Authentication Mechanism Disablement - Potential Account Takeover Risk', pattern_type: 'AUTH_BYPASS', correlation_type: 'ACTOR', correlation_score: 85, risk_level: 'CRITICAL', alert_count: 4, alert_ids: 'alert-6,alert-9,alert-10,alert-13', start_timestamp: '2026-06-19T13:20:08Z', end_timestamp: '2026-06-19T15:20:10Z' },
    { id: 'corr-5', description: 'Application Security Compromise - Service Principal Admin Access Granted', pattern_type: 'APP_PRIVILEGE_ESCALATION', correlation_type: 'TARGET', correlation_score: 88, risk_level: 'CRITICAL', alert_count: 3, alert_ids: 'alert-15,alert-17,alert-18', start_timestamp: '2026-06-19T10:25:18Z', end_timestamp: '2026-06-19T11:40:12Z' },
    { id: 'corr-6', description: 'Access Control Policy Weakening - Tenant-Wide Security Degradation', pattern_type: 'POLICY_WEAKENING', correlation_type: 'PATTERN', correlation_score: 82, risk_level: 'HIGH', alert_count: 3, alert_ids: 'alert-8,alert-12,alert-14', start_timestamp: '2026-06-19T12:05:33Z', end_timestamp: '2026-06-19T12:55:40Z' },
    { id: 'corr-7', description: 'Compliance and Audit Controls Disabled - Evidence Destruction Risk', pattern_type: 'AUDIT_BYPASS', correlation_type: 'PATTERN', correlation_score: 91, risk_level: 'CRITICAL', alert_count: 2, alert_ids: 'alert-19,alert-20', start_timestamp: '2026-06-19T09:35:22Z', end_timestamp: '2026-06-19T10:00:45Z' },
  ]
}

function renderDemoTenantGuard(el) {
  const demoAlerts = [
    { id: 'alert-1', priority: 'P1', severity: 'CRITICAL', headline: 'Suspicious Bulk User Creation', description: 'Detected 47 user accounts created in 3 minutes from unusual location', actor: 'Azure AD System', action_timestamp: '2026-06-01T14:32:15Z', source: 'Azure AD', timestamp: '2026-06-01 14:32:15', status: 'open', score: 95, riskScore: 95 },
    { id: 'alert-2', priority: 'P1', severity: 'CRITICAL', headline: 'Global Admin Role Assignment Detected', description: 'User aisha.raza@contoso.com assigned Global Admin role outside normal hours', actor: 'identity-admin@contoso.com', action_timestamp: '2026-06-01T13:45:22Z', source: 'Azure AD Audit', timestamp: '2026-06-01 13:45:22', status: 'open', score: 92, riskScore: 92 },
    { id: 'alert-3', priority: 'P1', severity: 'HIGH', headline: 'Impossible Travel Detected', description: 'Sign-in from UK (London) followed by sign-in from Australia (Sydney) within 2 hours', actor: 'Identity Protection', action_timestamp: '2026-06-01T12:15:43Z', source: 'Identity Protection', timestamp: '2026-06-01 12:15:43', status: 'open', score: 78, riskScore: 78 },
    { id: 'alert-4', priority: 'P2', severity: 'HIGH', headline: 'Abnormal Token Usage', description: 'Service principal exchanged 342 tokens in 45 minutes (baseline: 8 tokens/hour)', actor: 'Token Audit System', action_timestamp: '2026-06-01T11:30:21Z', source: 'Token Audit', timestamp: '2026-06-01 11:30:21', status: 'investigating', score: 75, riskScore: 75 },
    { id: 'alert-5', priority: 'P2', severity: 'MEDIUM', headline: 'MFA Configuration Change', description: 'MFA enforcement policy disabled by chen.wei@contoso.com', actor: 'chen.wei@contoso.com', action_timestamp: '2026-06-01T10:15:09Z', source: 'Azure AD Config', timestamp: '2026-06-01 10:15:09', status: 'open', score: 58, riskScore: 58 },
    // NEW ALERTS: MFA & CONDITIONAL ACCESS
    { id: 'alert-6', priority: 'P1', severity: 'CRITICAL', headline: 'MFA Requirement Disabled for Critical Users', description: 'MFA requirement has been disabled organization-wide, removing mandatory multi-factor authentication.', actor: 'security-admin@contoso.com', action_timestamp: '2026-06-19T15:20:10Z', source: 'Entra ID Audit', timestamp: '2026-06-19 15:20:10', status: 'open', score: 94, riskScore: 94 },
    { id: 'alert-7', priority: 'P1', severity: 'CRITICAL', headline: 'Conditional Access Policy Modified/Weakened', description: 'Critical Conditional Access policy blocking high-risk sign-ins was disabled.', actor: 'cloud-admin@contoso.com', action_timestamp: '2026-06-19T14:55:30Z', source: 'Entra ID', timestamp: '2026-06-19 14:55:30', status: 'open', score: 93, riskScore: 93 },
    { id: 'alert-8', priority: 'P2', severity: 'HIGH', headline: 'Conditional Access Exception Created', description: 'A Conditional Access policy exception was created excluding 25 users from MFA requirements.', actor: 'identity-admin@contoso.com', action_timestamp: '2026-06-19T14:30:45Z', source: 'Entra ID', timestamp: '2026-06-19 14:30:45', status: 'open', score: 82, riskScore: 82 },
    { id: 'alert-9', priority: 'P1', severity: 'CRITICAL', headline: 'Legacy Authentication Allowed', description: 'Legacy authentication protocols (IMAP, POP3) were enabled for all mailboxes.', actor: 'exchange-admin@contoso.com', action_timestamp: '2026-06-19T14:10:22Z', source: 'Exchange', timestamp: '2026-06-19 14:10:22', status: 'open', score: 91, riskScore: 91 },
    { id: 'alert-10', priority: 'P2', severity: 'HIGH', headline: 'Passwordless Sign-in Disabled', description: 'Windows Hello for Business and FIDO2 were disabled organization-wide.', actor: 'identity-team@contoso.com', action_timestamp: '2026-06-19T13:45:15Z', source: 'Entra ID', timestamp: '2026-06-19 13:45:15', status: 'open', score: 76, riskScore: 76 },
    // NEW ALERTS: SECURITY DEFAULTS & POLICIES
    { id: 'alert-11', priority: 'P1', severity: 'CRITICAL', headline: 'Security Defaults Policy Changed', description: 'Azure AD Security Defaults were disabled, removing baseline security protections.', actor: 'global-admin@contoso.com', action_timestamp: '2026-06-19T13:20:08Z', source: 'Entra ID', timestamp: '2026-06-19 13:20:08', status: 'open', score: 92, riskScore: 92 },
    { id: 'alert-12', priority: 'P2', severity: 'HIGH', headline: 'Password Expiration Policy Disabled', description: 'Password expiration policy was disabled allowing passwords to never expire.', actor: 'compliance-admin@contoso.com', action_timestamp: '2026-06-19T12:55:40Z', source: 'Config Drift', timestamp: '2026-06-19 12:55:40', status: 'open', score: 80, riskScore: 80 },
    { id: 'alert-13', priority: 'P1', severity: 'CRITICAL', headline: 'Risk-Based Sign-in Policy Disabled', description: 'Azure AD Identity Protection risk-based policies were disabled.', actor: 'security-admin@contoso.com', action_timestamp: '2026-06-19T12:30:25Z', source: 'Entra ID Protection', timestamp: '2026-06-19 12:30:25', status: 'open', score: 88, riskScore: 88 },
    { id: 'alert-14', priority: 'P2', severity: 'HIGH', headline: 'Multi-Tenant Access Policy Modified', description: 'Cross-tenant B2B collaboration restrictions were removed for external organizations.', actor: 'identity-admin@contoso.com', action_timestamp: '2026-06-19T12:05:33Z', source: 'Entra ID', timestamp: '2026-06-19 12:05:33', status: 'open', score: 75, riskScore: 75 },
    // NEW ALERTS: APPLICATION GOVERNANCE
    { id: 'alert-15', priority: 'P1', severity: 'CRITICAL', headline: 'Service Principal Secret Expired/Removed', description: 'Service principal "DataExport-API" credentials expired, breaking application authentication.', actor: 'app-admin@contoso.com', action_timestamp: '2026-06-19T11:40:12Z', source: 'Entra ID', timestamp: '2026-06-19 11:40:12', status: 'open', score: 87, riskScore: 87 },
    { id: 'alert-16', priority: 'P2', severity: 'HIGH', headline: 'Application Permission Grant Consent by User', description: 'User john.smith@contoso.com granted third-party app "CloudStorage Pro" access to Mail.Read.', actor: 'user@contoso.com', action_timestamp: '2026-06-19T11:15:50Z', source: 'Application', timestamp: '2026-06-19 11:15:50', status: 'open', score: 78, riskScore: 78 },
    { id: 'alert-17', priority: 'P1', severity: 'CRITICAL', headline: 'High-Risk OAuth Application Granted', description: 'OAuth app "MailSync-Pro" was granted Directory.ReadWrite.All permissions.', actor: 'system', action_timestamp: '2026-06-19T10:50:35Z', source: 'Application', timestamp: '2026-06-19 10:50:35', status: 'open', score: 90, riskScore: 90 },
    { id: 'alert-18', priority: 'P1', severity: 'CRITICAL', headline: 'Service Principal Granted Admin Consent', description: 'Service principal "AnalyticsEngine" received tenant-wide admin consent for sensitive APIs.', actor: 'admin@contoso.com', action_timestamp: '2026-06-19T10:25:18Z', source: 'Application', timestamp: '2026-06-19 10:25:18', status: 'open', score: 92, riskScore: 92 },
    // NEW ALERTS: DLP & AUDIT
    { id: 'alert-19', priority: 'P2', severity: 'HIGH', headline: 'DLP Policy Exception Created', description: 'Exception created for "Finance Department" to bypass DLP policy restrictions on credit card data.', actor: 'dlp-admin@contoso.com', action_timestamp: '2026-06-19T10:00:45Z', source: 'DLP Compliance', timestamp: '2026-06-19 10:00:45', status: 'open', score: 74, riskScore: 74 },
    { id: 'alert-20', priority: 'P1', severity: 'CRITICAL', headline: 'Audit Log Purge/Deletion Detected', description: 'Audit logs from the past 60 days were purged from the unified audit log.', actor: 'compliance-admin@contoso.com', action_timestamp: '2026-06-19T09:35:22Z', source: 'Unified Audit Log', timestamp: '2026-06-19 09:35:22', status: 'open', score: 96, riskScore: 96 },
  ]

  const demoCorrelations = [
    {
      id: 'corr-1',
      pattern_type: 'CREDENTIAL_COMPROMISE',
      description: 'Multiple accounts experiencing impossible travel, abnormal token usage, and suspicious sign-ins',
      alert_ids: 'alert-2,alert-3,alert-4',
      alert_count: 3,
      risk_level: 'CRITICAL',
      correlation_score: 96,
      start_timestamp: '2026-06-19T08:15:00Z',
      end_timestamp: '2026-06-19T11:45:00Z',
      actor: 'john.doe@contoso.com',
      target: 'Azure AD'
    },
    {
      id: 'corr-2',
      pattern_type: 'LATERAL_MOVEMENT',
      description: 'User access patterns suggest attacker moving through service principals to access sensitive data',
      alert_ids: 'alert-4,alert-5',
      alert_count: 2,
      risk_level: 'HIGH',
      correlation_score: 87,
      start_timestamp: '2026-06-19T12:00:00Z',
      end_timestamp: '2026-06-19T14:30:00Z',
      actor: 'service-principal-001',
      target: 'SharePoint & Exchange'
    },
    {
      id: 'corr-3',
      pattern_type: 'PRIVILEGE_ESCALATION',
      description: 'Sequential elevation of privileges detected with global admin role assignments outside business hours',
      alert_ids: 'alert-1,alert-6,alert-7',
      alert_count: 3,
      risk_level: 'CRITICAL',
      correlation_score: 92,
      start_timestamp: '2026-06-18T22:30:00Z',
      end_timestamp: '2026-06-19T01:15:00Z',
      actor: 'unknown-actor',
      target: 'Entra ID Admin Roles'
    },
    {
      id: 'corr-4',
      pattern_type: 'DATA_EXFILTRATION',
      description: 'Large volume of data downloaded from SharePoint followed by immediate resource deletion',
      alert_ids: 'alert-8,alert-9,alert-10',
      alert_count: 3,
      risk_level: 'CRITICAL',
      correlation_score: 89,
      start_timestamp: '2026-06-19T15:00:00Z',
      end_timestamp: '2026-06-19T17:45:00Z',
      actor: 'emily.johnson@contoso.com',
      target: 'SharePoint Libraries'
    },
    {
      id: 'corr-5',
      pattern_type: 'PERSISTENCE',
      description: 'OAuth app granted high-privilege consent followed by token refresh and background sync activity',
      alert_ids: 'alert-11,alert-12',
      alert_count: 2,
      risk_level: 'HIGH',
      correlation_score: 85,
      start_timestamp: '2026-06-17T09:00:00Z',
      end_timestamp: '2026-06-17T16:00:00Z',
      actor: 'suspicious-app-001',
      target: 'Exchange Online'
    },
    {
      id: 'corr-6',
      pattern_type: 'SERVICE_PRINCIPAL_ABUSE',
      description: 'Service principal making API calls from unusual IP addresses with credential creation events',
      alert_ids: 'alert-13,alert-14,alert-15',
      alert_count: 3,
      risk_level: 'HIGH',
      correlation_score: 83,
      start_timestamp: '2026-06-19T10:30:00Z',
      end_timestamp: '2026-06-19T13:00:00Z',
      actor: 'sp-risk-assessment-tool',
      target: 'Microsoft Graph API'
    },
    {
      id: 'corr-7',
      pattern_type: 'CREDENTIAL_COMPROMISE',
      description: 'Multiple failed login attempts followed by successful authentication from new device',
      alert_ids: 'alert-2,alert-16',
      alert_count: 2,
      risk_level: 'HIGH',
      correlation_score: 81,
      start_timestamp: '2026-06-20T06:00:00Z',
      end_timestamp: '2026-06-20T08:30:00Z',
      actor: 'alex.kumar@contoso.com',
      target: 'Azure AD'
    },
    {
      id: 'corr-8',
      pattern_type: 'PRIVILEGE_ESCALATION',
      description: 'Owner role added to multiple SharePoint sites followed by bulk item deletion',
      alert_ids: 'alert-17,alert-18,alert-19,alert-20',
      alert_count: 4,
      risk_level: 'CRITICAL',
      correlation_score: 91,
      start_timestamp: '2026-06-19T19:00:00Z',
      end_timestamp: '2026-06-19T22:00:00Z',
      actor: 'system-account-mgmt',
      target: 'SharePoint Online'
    },
  ]

  const demoInvestigations = [
    {
      id: 'inv-1',
      title: 'Account Compromise Investigation',
      type: 'ALERT',
      priority: 'P1',
      severity: 'CRITICAL',
      status: 'IN_PROGRESS',
      riskScore: 92,
      assignedTo: 'rajkumar.mcitp@gmail.com',
      startedBy: 'Security Team',
      startedAt: '2026-06-19T10:00:00Z',
      completedAt: null,
      relatedAlerts: ['alert-1', 'alert-2', 'alert-3'],
      relatedCorrelations: ['corr-1'],
      notes: 'Pattern matching privilege escalation attack. Multiple admin roles assigned outside normal hours. Reviewing cross-tenant activity logs.',
      aiAnalysis: 'High confidence account takeover attempt. Recommend immediate password reset and MFA enforcement.',
      recommendations: ['Reset affected account passwords', 'Enable MFA for all admin accounts', 'Review Azure AD sign-in logs for past 7 days', 'Block suspicious IP addresses'],
      reportGenerated: false,
    },
    {
      id: 'inv-2',
      title: 'Bulk User Creation Analysis',
      type: 'CORRELATION',
      priority: 'P1',
      severity: 'CRITICAL',
      status: 'OPEN',
      riskScore: 95,
      assignedTo: 'analyst@contoso.com',
      startedBy: 'Auto-Detection',
      startedAt: '2026-06-19T09:30:00Z',
      completedAt: null,
      relatedAlerts: ['alert-1'],
      relatedCorrelations: ['corr-1'],
      notes: 'Bulk user creation detected from unusual location. 47 users created in 3 minutes.',
      aiAnalysis: 'Pattern consistent with supply chain attack. Recommend investigation of data access.',
      recommendations: ['Verify user creation legitimacy', 'Audit Azure AD activity', 'Check data access logs'],
      reportGenerated: false,
    },
    {
      id: 'inv-3',
      title: 'Lateral Movement Detection',
      type: 'PATTERN',
      priority: 'P2',
      severity: 'HIGH',
      status: 'RESOLVED',
      riskScore: 87,
      assignedTo: 'rajkumar.mcitp@gmail.com',
      startedBy: 'Pattern Engine',
      startedAt: '2026-06-18T14:00:00Z',
      completedAt: '2026-06-18T16:30:00Z',
      relatedAlerts: ['alert-4', 'alert-5'],
      relatedCorrelations: ['corr-2'],
      notes: 'Service principal token exchange spike detected. Confirmed as scheduled maintenance activity.',
      aiAnalysis: 'Investigation complete. False positive - activity matches scheduled maintenance window.',
      recommendations: ['Update alert rules to exclude maintenance windows', 'Document service principal usage patterns'],
      reportGenerated: true,
    },
  ]

  const demoSummary = {
    critical: 11,
    high: 8,
    medium: 1,
    total: 20
  }

  activeSection = 'alerts'
  activeFilter = 'all'
  allAlerts = demoAlerts
  allCorrelations = demoCorrelations
  allInvestigations = demoInvestigations

  renderDemoTenantGuardUI(el, demoSummary)
}

function renderDemoTenantGuardUI(el, summary) {
  const criticalCount = summary.critical || 0
  const highCount = summary.high || 0
  const mediumCount = summary.medium || 0
  const totalCount = summary.total || 0
  const correlationCount = allCorrelations.length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-alert-triangle"></i> TenantGuard Alert Center</div>
        <div class="page-subtitle">Real-time alerts, correlations & attack pattern detection · ${totalCount} alerts · ${correlationCount} correlations</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="tg-refresh"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample TenantGuard alerts</span>
    </div>

    <!-- KPI Tiles -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value danger">${criticalCount}</div>
        <div class="kpi-label">Critical Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${highCount}</div>
        <div class="kpi-label">High Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${correlationCount}</div>
        <div class="kpi-label">Correlations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${totalCount}</div>
        <div class="kpi-label">Total Alerts</div>
      </div>
    </div>

    <div class="tabs">
      <button class="tab-btn active" data-section="alerts">
        <i class="ti ti-list"></i> Alerts
      </button>
      <button class="tab-btn" data-section="correlations">
        <i class="ti ti-link"></i> Correlations
      </button>
    </div>

    <div id="demo-content"></div>
  `

  const contentEl = el.querySelector('#demo-content')
  renderDemoAlerts(contentEl)

  el.querySelectorAll('.tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      const section = btn.dataset.section
      if (section === 'alerts') renderDemoAlerts(contentEl)
      else if (section === 'correlations') renderDemoCorrelations(contentEl)
    })
  })

  el.querySelector('#tg-refresh')?.addEventListener('click', () => {
    const btn = el.querySelector('#tg-refresh')
    btn.innerHTML = `<span class="spinner dark"></span> Refreshing...`
    btn.disabled = true
    setTimeout(() => {
      btn.innerHTML = `<i class="ti ti-refresh"></i> Refresh`
      btn.disabled = false
    }, 2000)
  })
}

function renderDemoAlerts(el) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Security Alerts</span>
        <span class="badge danger">${allAlerts.length} alerts</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Severity</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Alert Title</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Source</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Risk Score</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Time</th>
          </tr>
        </thead>
        <tbody>
          ${allAlerts.map((alert, i) => `
            <tr style="border-bottom:${i < allAlerts.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'}">
              <td style="padding:10px 12px"><span class="badge ${alert.severity === 'CRITICAL' ? 'danger' : 'warning'}">${alert.severity}</span></td>
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${alert.title}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${alert.source}</td>
              <td style="padding:10px 12px;font-size:10px">
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:40px;height:6px;background:var(--color-background-secondary);border-radius:3px;overflow:hidden">
                    <div style="height:100%;width:${alert.riskScore}%;background:${alert.riskScore >= 80 ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}"></div>
                  </div>
                  <span style="font-weight:600;color:${alert.riskScore >= 80 ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">${alert.riskScore}</span>
                </div>
              </td>
              <td style="padding:10px 12px"><span class="badge ${alert.status === 'open' ? 'danger' : 'warning'}">${alert.status}</span></td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-tertiary)">${alert.timestamp.split(' ')[1]}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderDemoCorrelations(el) {
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Attack Pattern Correlations</span>
        <span class="badge danger">${allCorrelations.length} correlations</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;padding:12px">
        ${allCorrelations.map((corr, i) => `
          <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border-left:3px solid ${corr.severity === 'CRITICAL' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--color-text-primary)">${corr.title}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${corr.description}</div>
              </div>
              <span class="badge ${corr.severity === 'CRITICAL' ? 'danger' : 'warning'}">${corr.severity}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:9px;color:var(--color-text-tertiary)">
              <span>${corr.alerts.length} related alerts</span>
              <span style="font-weight:600;color:var(--clr-success-text)">${corr.confidence}% confidence</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function showRelatedAlerts(correlation) {
  const el = document.getElementById('page-tenantguard')
  if (!el) return

  // Parse alert IDs from correlation
  const relatedAlertIds = correlation.alert_ids.split(',').map(id => id.trim())

  // Find matching alerts
  const relatedAlerts = allAlerts.filter(a => relatedAlertIds.includes(a.id))

  const modalHTML = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000" id="alert-modal">
      <div style="background:var(--color-background-primary);border-radius:var(--border-radius-lg);max-width:800px;width:90%;max-height:90vh;overflow-y:auto;padding:24px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1)">

        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px">
          <div>
            <div style="font-size:16px;font-weight:700;color:var(--color-text-primary);margin-bottom:4px">
              ${escapeHtml(correlation.pattern_type)}
            </div>
            <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:8px">
              ${escapeHtml(correlation.description)}
            </div>
          </div>
          <button onclick="document.getElementById('alert-modal').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--color-text-secondary)">×</button>
        </div>

        <!-- Correlation Details -->
        <div style="background:var(--color-background-secondary);padding:12px;border-radius:var(--border-radius-md);margin-bottom:16px">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;font-size:11px">
            <div>
              <div style="color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Confidence</div>
              <div style="font-weight:700;font-size:14px;color:var(--clr-success-text)">${correlation.correlation_score}/100</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Type</div>
              <div style="font-weight:600">${correlation.correlation_type}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Related Alerts</div>
              <div style="font-weight:600">${relatedAlerts.length}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Risk Level</div>
              <span class="badge ${getBadgeClass(correlation.risk_level)}" style="font-size:10px">${correlation.risk_level}</span>
            </div>
          </div>
        </div>

        <!-- Related Alerts Header -->
        <div style="font-size:12px;font-weight:600;color:var(--color-text-primary);margin-bottom:12px">
          🔗 Related Alerts (${relatedAlerts.length})
        </div>

        <!-- Related Alerts List -->
        <div style="display:flex;flex-direction:column;gap:10px">
          ${relatedAlerts.map(alert => `
            <div style="padding:12px;background:var(--color-background-secondary);border-left:3px solid ${alert.severity === 'CRITICAL' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'};border-radius:var(--border-radius-md)">
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
                <div>
                  <div style="font-weight:600;font-size:11px;color:var(--color-text-primary)">
                    ${escapeHtml(alert.headline || 'Unknown Alert')}
                  </div>
                  <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">
                    ${escapeHtml(alert.description || '')}
                  </div>
                </div>
                <span class="badge ${alert.severity === 'CRITICAL' ? 'danger' : alert.severity === 'HIGH' ? 'warning' : 'info'}" style="font-size:9px">
                  ${alert.severity}
                </span>
              </div>
              <div style="display:flex;gap:16px;font-size:9px;color:var(--color-text-tertiary)">
                <span><i class="ti ti-trending-up" style="font-size:9px"></i> Score: ${alert.score}/100</span>
                <span><i class="ti ti-user" style="font-size:9px"></i> ${alert.actor || 'System'}</span>
                <span><i class="ti ti-clock" style="font-size:9px"></i> ${new Date(alert.action_timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Close Button -->
        <div style="margin-top:16px;display:flex;gap:8px">
          <button onclick="document.getElementById('alert-modal').remove()" style="flex:1;padding:8px 12px;background:var(--color-background-secondary);border:1px solid var(--color-border-secondary);border-radius:var(--border-radius-md);cursor:pointer;font-size:11px;font-weight:600">
            Close
          </button>
        </div>
      </div>
    </div>
  `

  // Add modal to DOM
  const modalDiv = document.createElement('div')
  modalDiv.innerHTML = modalHTML
  document.body.appendChild(modalDiv.firstElementChild)
}

function render(summary) {
  const el = document.getElementById('page-tenantguard')
  if (!el) return

  const criticalCount = summary.critical || 0
  const highCount = summary.high || 0
  const mediumCount = summary.medium || 0
  const totalCount = summary.total || 0
  const correlationCount = allCorrelations.length

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-alert-triangle"></i> TenantGuard Alert Center</div>
        <div class="page-subtitle">Real-time alerts, correlations & attack pattern detection · ${totalCount} alerts · ${correlationCount} correlations</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="tg-refresh"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <!-- KPI Tiles -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value danger">${criticalCount}</div>
        <div class="kpi-label">Critical Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${highCount}</div>
        <div class="kpi-label">High Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${correlationCount}</div>
        <div class="kpi-label">Correlations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${totalCount}</div>
        <div class="kpi-label">Total Alerts</div>
      </div>
    </div>

    <!-- Main Tabs -->
    <div class="tabs" id="tg-main-tabs">
      ${MAIN_TABS.map(t => `
        <button class="tab-btn ${activeSection === t.id ? 'active' : ''}" data-section="${t.id}">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
          ${t.id === 'alerts' && totalCount > 0 ? `<span class="badge" style="background:var(--clr-danger-bg);color:var(--clr-danger-text)">${totalCount}</span>` : ''}
          ${t.id === 'correlations' && correlationCount > 0 ? `<span class="badge" style="background:var(--clr-warning-bg);color:var(--clr-warning-text)">${correlationCount}</span>` : ''}
        </button>
      `).join('')}
    </div>

    <!-- Content Area -->
    <div id="tg-content" style="margin-top:16px">
      ${activeSection === 'alerts' ? renderAlertsSection() : activeSection === 'correlations' ? renderCorrelationsSection() : activeSection === 'patterns' ? renderPatternsSection() : activeSection === 'investigations' ? renderInvestigationsSection() : renderInvestigationSection()}
    </div>
  `

  // Attach main tab listeners
  el.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSection = btn.dataset.section
      activeFilter = 'all'
      investigationStatusFilter = 'all'
      const content = el.querySelector('#tg-content')
      if (content) {
        content.innerHTML = activeSection === 'alerts' ? renderAlertsSection() : activeSection === 'correlations' ? renderCorrelationsSection() : activeSection === 'patterns' ? renderPatternsSection() : activeSection === 'investigations' ? renderInvestigationsSection() : renderInvestigationSection()
        if (activeSection === 'alerts') wireAlerts(el)
        if (activeSection === 'correlations') wireCorrelations(el)
        if (activeSection === 'patterns') wirePatterns(el)
        if (activeSection === 'investigations') wireInvestigations(el)
      }
      el.querySelectorAll('[data-section]').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
    })
  })

  el.querySelector('#tg-refresh')?.addEventListener('click', async () => {
    const btn = el.querySelector('#tg-refresh')
    const originalText = btn.innerHTML
    btn.innerHTML = `<span class="spinner dark"></span> Scanning...`
    btn.disabled = true
    await refreshData()
    btn.innerHTML = originalText
    btn.disabled = false
  })

  if (activeSection === 'alerts') wireAlerts(el)
}

function renderAlertsSection() {
  return `
    <!-- Priority Tabs (P1/P2/P3) -->
    <div class="tabs" id="tg-priority-tabs" style="border-bottom:2px solid var(--color-border);margin-bottom:12px;padding-bottom:8px">
      ${PRIORITY_TABS.map(t => `
        <button class="tab-btn ${activePriorityFilter === t.id ? 'active' : ''}" data-priority="${t.id}" style="font-weight:600;font-size:12px">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
        </button>
      `).join('')}
    </div>

    <!-- Severity Tabs -->
    <div class="tabs" id="tg-severity-tabs" style="margin-bottom:12px">
      ${SEVERITY_TABS.map(t => `
        <button class="tab-btn ${activeFilter === t.id ? 'active' : ''}" data-severity="${t.id}">
          <i class="ti ${t.icon}"></i><span>${t.label}</span>
        </button>
      `).join('')}
    </div>
    <div id="tg-alerts-list" style="margin-top:12px">${renderAlerts()}</div>
  `
}

function renderCorrelationsSection() {
  if (allCorrelations.length === 0) {
    return `
      <div style="text-align:center;padding:40px 20px;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:12px;opacity:0.5">🔗</div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">No correlations detected</div>
        <div style="font-size:12px">When alerts are related, they will be grouped here</div>
      </div>
    `
  }

  const selectedCorr = selectedCorrelationId ? allCorrelations.find(c => c.id === selectedCorrelationId) : null
  const actionBar = selectedCorr ? `
    <div style="display:flex;gap:8px;padding:12px;background:var(--color-background-secondary);border-bottom:1px solid var(--color-border-secondary);margin-bottom:12px;border-radius:4px;align-items:center">
      <span style="flex:1;font-size:12px;font-weight:600;color:var(--color-text-primary)">Selected: ${escapeHtml(selectedCorr.description || 'Correlation')}</span>
      <button class="btn" onclick="handleCorrelationClick('${selectedCorr.id}')" style="font-size:11px">
        <i class="ti ti-info-circle"></i> View Details
      </button>
      <button class="btn" onclick="createInvestigationFromCorrelation('${selectedCorr.id}', '${escapeHtml(selectedCorr.description)}')" style="font-size:11px;white-space:nowrap">
        <i class="ti ti-magnifying-glass"></i> Create Investigation
      </button>
      <button class="btn" onclick="selectCorrelation(null)" style="font-size:11px">
        <i class="ti ti-x"></i> Clear Selection
      </button>
    </div>
  ` : ''

  const corrCards = allCorrelations.map(corr => {
    const isSelected = selectedCorrelationId === corr.id
    const selectedStyle = isSelected ? 'background:var(--color-background-secondary);border:2px solid var(--clr-primary);' : 'border:1px solid var(--color-border-secondary);'

    return `
      <div class="tenantguard-alert-card" onclick="selectCorrelation('${corr.id}')" style="${selectedStyle}padding:12px;border-radius:6px;cursor:pointer;transition:all 0.2s;margin-bottom:8px">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <span style="font-size:20px;margin-top:2px">🔗</span>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:12px;color:var(--color-text-primary);margin-bottom:4px">
              ${escapeHtml(corr.description || 'Correlation')}
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:10px;color:var(--color-text-tertiary)">
              <span><i class="ti ti-link"></i> ${corr.alert_count} alerts</span>
              <span><i class="ti ti-trending-up"></i> Score: ${corr.correlation_score}/100</span>
              <span><i class="ti ti-tag"></i> ${corr.pattern_type}</span>
            </div>
          </div>
          <span class="badge ${getBadgeClass(corr.risk_level)}">${corr.risk_level}</span>
        </div>
      </div>
    `
  }).join('')

  return actionBar + corrCards
}

function renderPatternsSection() {
  if (allCorrelations.length === 0) {
    return `
      <div style="text-align:center;padding:40px 20px;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:12px;opacity:0.5">🔍</div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">No attack patterns detected</div>
        <div style="font-size:12px">Patterns will appear when related alerts are detected</div>
      </div>
    `
  }

  const riskIcon = {
    'CRITICAL': '🚨',
    'HIGH': '⚠️',
    'MEDIUM': '⚡',
    'LOW': 'ℹ️'
  }

  const patternCards = allCorrelations.map(pattern => {
    const riskEmoji = riskIcon[pattern.risk_level] || '🔷'
    const isSelected = selectedPatternId === pattern.id
    const selectedStyle = isSelected ? 'background:var(--color-background-secondary);border:2px solid var(--clr-primary);' : 'border:1px solid var(--color-border-secondary);'

    return `
      <div class="tenantguard-alert-card" data-pattern-id="${pattern.id}" onclick="selectPattern('${pattern.id}')" style="${selectedStyle}padding:12px;border-radius:6px;cursor:pointer;transition:all 0.2s;margin-bottom:8px">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <span style="font-size:20px;margin-top:2px">${riskEmoji}</span>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:12px;color:var(--color-text-primary);margin-bottom:4px">
              ${escapeHtml(pattern.pattern_type)}
            </div>
            <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.4;margin-bottom:6px">
              ${escapeHtml(pattern.description)}
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:10px;color:var(--color-text-tertiary)">
              <span><i class="ti ti-link"></i> ${pattern.alert_count} related alerts</span>
              <span><i class="ti ti-trending-up"></i> Score: ${pattern.correlation_score}/100</span>
              <span><i class="ti ti-clock"></i> ${new Date(pattern.start_timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;min-width:fit-content">
            <span class="badge ${getBadgeClass(pattern.risk_level)}">${pattern.risk_level}</span>
          </div>
        </div>
      </div>
    `
  }).join('')

  return patternCards
}

function renderInvestigationsSection() {
  if (selectedInvestigation) {
    return renderInvestigationDetails()
  }

  // Filter investigations by status
  let filtered = allInvestigations
  if (investigationStatusFilter !== 'all') {
    filtered = filtered.filter(inv => inv.status === investigationStatusFilter)
  }

  if (filtered.length === 0) {
    return `
      <div style="text-align:center;padding:60px 20px;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:12px;opacity:0.5">🔍</div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">No investigations ${investigationStatusFilter !== 'all' ? 'with status ' + investigationStatusFilter.toLowerCase() : ''}</div>
        <div style="font-size:12px;margin-bottom:24px">Create an investigation from an alert or correlation to get started</div>
        <button class="btn btn-primary" onclick="showCreateInvestigationModal()" style="white-space:nowrap">
          <i class="ti ti-plus"></i> Create Investigation
        </button>
      </div>
    `
  }

  return `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-magnifying-glass"></i> Security Investigations (${allInvestigations.length})</span>
        <button class="btn btn-primary" onclick="showCreateInvestigationModal()" style="margin-left:auto;white-space:nowrap">
          <i class="ti ti-plus"></i> New Investigation
        </button>
      </div>

      <!-- Status Filter Tabs -->
      <div class="tabs" id="investigation-status-tabs" style="margin:12px 16px 0">
        ${INVESTIGATION_STATUSES.map(status => `
          <button class="tab-btn ${investigationStatusFilter === status.id ? 'active' : ''}" data-status="${status.id}" style="${status.color ? `border-left-color: ${status.color}` : ''}">
            <i class="ti ${status.icon}"></i> ${status.label}
          </button>
        `).join('')}
      </div>

      <!-- Investigations List -->
      <div style="padding:0;max-height:800px;overflow-y:auto">
        ${filtered.map((inv, idx) => {
          const statusConfig = INVESTIGATION_STATUSES.find(s => s.id === inv.status)
          const statusColor = statusConfig?.color || '#6c757d'
          const priorityColor = inv.priority === 'P1' ? '#dc3545' : inv.priority === 'P2' ? '#fd7e14' : '#ffc107'
          const priorityIcon = inv.priority === 'P1' ? '🔴' : inv.priority === 'P2' ? '🟠' : '🟡'

          return `
            <div style="padding:16px;border-bottom:${idx < filtered.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none'};border-left:4px solid ${statusColor};cursor:pointer;transition:background 0.2s" onclick="selectInvestigation('${inv.id}')" onmouseover="this.style.background='var(--color-background-secondary)'" onmouseout="this.style.background='transparent'">
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
                <div style="flex:1">
                  <div style="font-weight:700;font-size:13px;color:var(--color-text-primary);display:flex;align-items:center;gap:8px;margin-bottom:4px">
                    <span>${priorityIcon} ${inv.priority}</span>
                    <span>${escapeHtml(inv.title)}</span>
                  </div>
                  <div style="font-size:10px;color:var(--color-text-tertiary);display:flex;gap:12px;flex-wrap:wrap;margin-bottom:6px">
                    <span><i class="ti ti-user"></i> ${escapeHtml(inv.assignedTo || 'Unassigned')}</span>
                    <span><i class="ti ti-clock"></i> ${new Date(inv.startedAt).toLocaleDateString()}</span>
                    <span><i class="ti ti-trending-up"></i> Risk: ${inv.riskScore}/100</span>
                  </div>
                  <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.4">
                    ${escapeHtml(inv.notes || 'No notes yet')}
                  </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;margin-left:8px">
                  <span class="badge" style="background:${statusColor};color:white">${inv.status}</span>
                  <span class="badge" style="background:${priorityColor};color:white">${inv.priority}</span>
                  <span class="badge ${getBadgeClass(inv.severity)}">${inv.severity}</span>
                </div>
              </div>
              <div style="display:flex;gap:4px;font-size:9px;color:var(--color-text-tertiary)">
                <span>📌 ${inv.relatedAlerts?.length || 0} alerts</span>
                <span>🔗 ${inv.relatedCorrelations?.length || 0} correlations</span>
                <span>${inv.reportGenerated ? '✓ Report generated' : 'No report'}</span>
              </div>
            </div>
          `
        }).join('')}
      </div>
    </div>
  `
}

function renderInvestigationDetails() {
  const inv = selectedInvestigation
  const statusConfig = INVESTIGATION_STATUSES.find(s => s.id === inv.status)
  const statusColor = statusConfig?.color || '#6c757d'
  const priorityColor = inv.priority === 'P1' ? '#dc3545' : inv.priority === 'P2' ? '#fd7e14' : '#ffc107'
  const priorityIcon = inv.priority === 'P1' ? '🔴' : inv.priority === 'P2' ? '🟠' : '🟡'

  return `
    <div class="card mb-3">
      <!-- Header -->
      <div class="card-header" style="border-left:4px solid ${statusColor}">
        <div style="display:flex;justify-content:space-between;align-items:start;width:100%">
          <div style="flex:1">
            <div style="font-weight:700;font-size:15px;color:var(--color-text-primary);display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span>${priorityIcon} ${inv.priority}</span>
              <span>${escapeHtml(inv.title)}</span>
            </div>
            <div style="font-size:11px;color:var(--color-text-secondary)">
              <i class="ti ti-robot"></i> Type: ${inv.type} | Started: ${new Date(inv.startedAt).toLocaleString()}
            </div>
          </div>
          <div style="display:flex;gap:4px">
            <button class="btn" onclick="closeInvestigationDetails()" style="white-space:nowrap">
              <i class="ti ti-arrow-left"></i> Back
            </button>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div style="display:grid;grid-template-columns:1fr 350px;gap:16px;padding:16px">
        <!-- Main Content -->
        <div>
          <!-- Status & Workflow -->
          <div class="card" style="border:0.5px solid var(--color-border-secondary);margin-bottom:16px">
            <div style="padding:12px;border-bottom:0.5px solid var(--color-border-secondary)">
              <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:8px">INVESTIGATION STATUS</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                ${['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(s => `
                  <button class="btn" style="flex:1;${s === inv.status ? `background:${statusColor};color:white` : 'background:var(--color-background-secondary)'}" onclick="updateInvestigationStatus('${s}')">
                    ${s}
                  </button>
                `).join('')}
              </div>
            </div>
            <div style="padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:11px">
              <div>
                <div style="color:var(--color-text-tertiary);margin-bottom:4px;font-weight:600">Assigned To</div>
                <select id="assigned-to-select" style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-primary);color:var(--color-text-primary);font-size:11px" onchange="updateInvestigationAssignee(this.value)">
                  <option value="">Unassigned</option>
                  <option value="rajkumar.mcitp@gmail.com" ${inv.assignedTo === 'rajkumar.mcitp@gmail.com' ? 'selected' : ''}>Rajkumar (rajkumar.mcitp@gmail.com)</option>
                  <option value="analyst@contoso.com" ${inv.assignedTo === 'analyst@contoso.com' ? 'selected' : ''}>Security Analyst (analyst@contoso.com)</option>
                  <option value="soc@contoso.com" ${inv.assignedTo === 'soc@contoso.com' ? 'selected' : ''}>SOC Team (soc@contoso.com)</option>
                </select>
              </div>
              <div>
                <div style="color:var(--color-text-tertiary);margin-bottom:4px;font-weight:600">Priority</div>
                <select id="priority-select" style="width:100%;padding:6px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-primary);color:var(--color-text-primary);font-size:11px" onchange="updateInvestigationPriority(this.value)">
                  <option value="P1" ${inv.priority === 'P1' ? 'selected' : ''}>P1 - Critical</option>
                  <option value="P2" ${inv.priority === 'P2' ? 'selected' : ''}>P2 - High</option>
                  <option value="P3" ${inv.priority === 'P3' ? 'selected' : ''}>P3 - Info</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Investigation Notes -->
          <div class="card" style="border:0.5px solid var(--color-border-secondary);margin-bottom:16px">
            <div style="padding:12px;border-bottom:0.5px solid var(--color-border-secondary)">
              <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:8px">INVESTIGATION NOTES</div>
              <textarea id="investigation-notes" placeholder="Add investigation notes..." style="width:100%;min-height:100px;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-primary);color:var(--color-text-primary);font-size:11px;font-family:monospace;resize:vertical">${escapeHtml(inv.notes || '')}</textarea>
              <button class="btn btn-primary" onclick="saveInvestigationNotes()" style="margin-top:8px;width:100%">
                <i class="ti ti-save"></i> Save Notes
              </button>
            </div>
          </div>

          <!-- AI Analysis -->
          <div class="card" style="border:0.5px solid var(--color-border-secondary);margin-bottom:16px">
            <div style="padding:12px;border-bottom:0.5px solid var(--color-border-secondary);background:linear-gradient(135deg, rgba(13,202,240,0.05) 0%, rgba(13,202,240,0.02) 100%)">
              <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:8px">
                <i class="ti ti-robot"></i> AI ANALYSIS & RECOMMENDATIONS
              </div>
            </div>
            <div style="padding:12px">
              ${inv.aiAnalysis ? `
                <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:12px;background:var(--color-background-secondary);padding:8px;border-radius:4px">
                  ${escapeHtml(inv.aiAnalysis)}
                </div>
              ` : '<div style="font-size:11px;color:var(--color-text-tertiary);font-style:italic">No AI analysis yet</div>'}

              ${inv.recommendations && inv.recommendations.length > 0 ? `
                <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:8px;margin-top:12px">Recommended Actions:</div>
                <ul style="margin:0;padding-left:16px;font-size:11px;color:var(--color-text-secondary);line-height:1.6">
                  ${inv.recommendations.map(rec => `<li style="margin-bottom:4px">${escapeHtml(rec)}</li>`).join('')}
                </ul>
              ` : ''}

              <button class="btn btn-primary" onclick="generateAIAnalysis('${inv.id}')" style="margin-top:12px;width:100%">
                <i class="ti ti-sparkles"></i> Generate AI Analysis
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div style="display:flex;gap:8px">
            <button class="btn" onclick="generateInvestigationReport('${inv.id}')" style="flex:1">
              <i class="ti ti-file-text"></i> Generate Report
            </button>
            <button class="btn" onclick="shareInvestigationFindings('${inv.id}')" style="flex:1">
              <i class="ti ti-share-2"></i> Share Findings
            </button>
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <!-- Key Metrics -->
          <div class="card" style="border:0.5px solid var(--color-border-secondary);margin-bottom:16px;padding:12px">
            <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:12px;padding-bottom:8px;border-bottom:0.5px solid var(--color-border-tertiary)">METRICS</div>
            <div style="display:flex;flex-direction:column;gap:12px;font-size:11px">
              <div>
                <div style="color:var(--color-text-tertiary);margin-bottom:4px">Risk Score</div>
                <div style="font-weight:700;font-size:18px;color:${inv.riskScore >= 80 ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">${inv.riskScore}/100</div>
              </div>
              <div style="background:var(--color-background-secondary);padding:8px;border-radius:4px">
                <div style="color:var(--color-text-tertiary);margin-bottom:4px">Severity</div>
                <span class="badge ${getBadgeClass(inv.severity)}">${inv.severity}</span>
              </div>
              <div style="background:var(--color-background-secondary);padding:8px;border-radius:4px">
                <div style="color:var(--color-text-tertiary);margin-bottom:4px">Status</div>
                <span class="badge" style="background:${statusColor};color:white">${inv.status}</span>
              </div>
            </div>
          </div>

          <!-- Related Alerts -->
          <div class="card" style="border:0.5px solid var(--color-border-secondary);margin-bottom:16px;padding:12px">
            <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:8px">RELATED ALERTS (${inv.relatedAlerts?.length || 0})</div>
            ${inv.relatedAlerts && inv.relatedAlerts.length > 0 ? `
              <div style="display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto">
                ${inv.relatedAlerts.map(alertId => {
                  const alert = allAlerts.find(a => a.id === alertId)
                  return alert ? `
                    <div style="padding:6px;background:var(--color-background-secondary);border-radius:4px;font-size:10px;cursor:pointer;transition:background 0.2s" onclick="showAlertDetails('${alert.id}')" onmouseover="this.style.background='var(--color-border-secondary)'" onmouseout="this.style.background='var(--color-background-secondary)'">
                      <div style="font-weight:600;color:var(--color-text-primary)">${escapeHtml(alert.headline)}</div>
                      <div style="color:var(--color-text-tertiary);margin-top:2px">${alert.priority} · ${alert.severity}</div>
                    </div>
                  ` : ''
                }).join('')}
              </div>
            ` : '<div style="font-size:11px;color:var(--color-text-tertiary);font-style:italic">No related alerts</div>'}
          </div>

          <!-- Related Correlations -->
          <div class="card" style="border:0.5px solid var(--color-border-secondary);padding:12px">
            <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:8px">RELATED CORRELATIONS (${inv.relatedCorrelations?.length || 0})</div>
            ${inv.relatedCorrelations && inv.relatedCorrelations.length > 0 ? `
              <div style="display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto">
                ${inv.relatedCorrelations.map(corrId => {
                  const corr = allCorrelations.find(c => c.id === corrId)
                  return corr ? `
                    <div style="padding:6px;background:var(--color-background-secondary);border-radius:4px;font-size:10px;cursor:pointer;transition:background 0.2s" onclick="handleCorrelationClick('${corr.id}')" onmouseover="this.style.background='var(--color-border-secondary)'" onmouseout="this.style.background='var(--color-background-secondary)'">
                      <div style="font-weight:600;color:var(--color-text-primary)">${escapeHtml(corr.description?.substring(0, 40) || 'Correlation')}</div>
                      <div style="color:var(--color-text-tertiary);margin-top:2px">Score: ${corr.correlation_score}/100</div>
                    </div>
                  ` : ''
                }).join('')}
              </div>
            ` : '<div style="font-size:11px;color:var(--color-text-tertiary);font-style:italic">No related correlations</div>'}
          </div>
        </div>
      </div>
    </div>
  `
}

function renderInvestigationSection() {
  if (currentInvestigation) {
    return renderInvestigationChat()
  }

  return `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-robot"></i> AI Security Investigation Agent</span>
      </div>
      <div style="padding:16px;color:var(--color-text-secondary);text-align:center">
        <div style="font-size:48px;margin-bottom:12px">🤖</div>
        <div style="font-size:13px;font-weight:600;margin-bottom:8px">Select an incident to investigate</div>
        <div style="font-size:12px;margin-bottom:16px">
          Click on an alert or correlation to start an AI-powered investigation.
          TenantGuard will analyze the incident and answer your questions.
        </div>

        <div style="margin-top:20px;border-top:0.5px solid var(--color-border-tertiary);padding-top:16px">
          <div style="font-size:12px;font-weight:600;margin-bottom:12px;color:var(--color-text-primary)">Recent Correlations</div>
          ${allCorrelations.slice(0, 3).map(corr => `
            <button class="btn" style="width:100%;margin-bottom:8px;justify-content:flex-start" onclick="startCorrInvestigation('${corr.id}', '${escapeHtml(corr.description)}')">
              <i class="ti ti-link"></i>
              <span style="text-align:left;flex:1">${escapeHtml(corr.description.substring(0, 50))}...</span>
              <span class="badge ${getBadgeClass(corr.risk_level)}">${corr.risk_level}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

function renderInvestigationChat() {
  return `
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-robot"></i> ${escapeHtml(currentInvestigation.title)}</span>
        <button class="btn" style="margin-left:auto" onclick="closeInvestigation()">
          <i class="ti ti-x"></i> Close
        </button>
      </div>

      <div id="investigation-chat" style="display:flex;flex-direction:column;height:500px;border:0.5px solid var(--color-border-secondary);border-top:none;border-radius:0 0 4px 4px;overflow:hidden;background:var(--color-background-primary)">
        <div id="investigation-messages" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px"></div>

        <div style="display:flex;gap:8px;padding:12px;border-top:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)">
          <input type="text" id="investigation-input" placeholder="Ask me about this incident..." style="flex:1;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-primary);color:var(--color-text-primary);font-size:12px" />
          <button id="investigation-send" class="btn btn-primary" style="white-space:nowrap">
            <i class="ti ti-send"></i> Send
          </button>
          <button id="investigation-report" class="btn" style="white-space:nowrap">
            <i class="ti ti-file-text"></i> Report
          </button>
        </div>
      </div>
    </div>
  `
}

function renderAlerts() {
  let filtered = allAlerts

  // Filter by priority
  if (activePriorityFilter !== 'all') {
    filtered = filtered.filter(a => a.priority === activePriorityFilter)
  }

  // Filter by severity
  if (activeFilter !== 'all') {
    filtered = filtered.filter(a => a.severity === activeFilter)
  }

  if (filtered.length === 0) {
    return `
      <div style="text-align:center;padding:40px 20px;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:12px;opacity:0.5">✓</div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">All clear</div>
        <div style="font-size:12px">
          ${activeFilter === 'all'
            ? 'No active alerts. Your tenant is secure.'
            : `No ${activeFilter.toLowerCase()} severity alerts.`
          }
        </div>
      </div>
    `
  }

  const selectedAlert = selectedAlertId ? filtered.find(a => a.id === selectedAlertId) : null
  const actionBar = selectedAlert ? `
    <div style="display:flex;gap:8px;padding:12px;background:var(--color-background-secondary);border-bottom:1px solid var(--color-border-secondary);margin-bottom:12px;border-radius:4px;align-items:center">
      <span style="flex:1;font-size:12px;font-weight:600;color:var(--color-text-primary)">Selected: ${escapeHtml(selectedAlert.headline)}</span>
      <button class="btn tg-details-btn" data-alert-id="${selectedAlert.id}" style="font-size:11px">
        <i class="ti ti-info-circle"></i> Details & Remediation
      </button>
      <button class="btn" onclick="createInvestigationFromAlert('${selectedAlert.id}', '${escapeHtml(selectedAlert.headline)}')" style="font-size:11px;white-space:nowrap">
        <i class="ti ti-magnifying-glass"></i> Create Investigation
      </button>
      <button class="btn tg-dismiss-btn" data-alert-id="${selectedAlert.id}" style="font-size:11px">
        <i class="ti ti-x"></i> Dismiss
      </button>
      <button class="btn" onclick="selectAlert(null)" style="font-size:11px">
        <i class="ti ti-x"></i> Clear Selection
      </button>
    </div>
  ` : ''

  const alertCards = filtered.map(alert => {
    const priorityIcon = alert.priority === 'P1' ? '🔴' : alert.priority === 'P2' ? '🟠' : '🟡'
    const riskScore = alert.score || alert.riskScore || 0
    const isSelected = selectedAlertId === alert.id
    const selectedStyle = isSelected ? 'background:var(--color-background-secondary);border:2px solid var(--clr-primary);' : 'border:1px solid var(--color-border-secondary);'

    return `
      <div class="tenantguard-alert-card" data-alert-id="${alert.id}" onclick="selectAlert('${alert.id}')" style="${selectedStyle}padding:12px;border-radius:6px;cursor:pointer;transition:all 0.2s;margin-bottom:8px">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <span style="font-size:20px;margin-top:2px">${priorityIcon}</span>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:12px;color:var(--color-text-primary);margin-bottom:4px">
              ${escapeHtml(alert.headline)}
            </div>
            <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.4;margin-bottom:6px">
              ${escapeHtml(alert.description)}
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:10px;color:var(--color-text-tertiary)">
              <span><i class="ti ti-user"></i> ${escapeHtml(alert.actor || 'System')}</span>
              <span><i class="ti ti-clock"></i> ${formatTime(alert.action_timestamp)}</span>
              <span><i class="ti ti-trending-up"></i> ${riskScore}/100</span>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;min-width:fit-content">
            <span class="badge" style="background:${alert.priority === 'P1' ? '#dc3545' : alert.priority === 'P2' ? '#fd7e14' : '#ffc107'};color:white;padding:4px 8px;border-radius:4px;font-weight:600;font-size:10px">${alert.priority || 'P3'}</span>
            <span class="badge ${getBadgeClass(alert.severity)}">${alert.severity}</span>
          </div>
        </div>
      </div>
    `
  }).join('')

  return actionBar + alertCards
}

function wireAlerts(el) {
  // Priority tab listeners
  const priorityTabs = el.querySelector('#tg-priority-tabs')
  if (priorityTabs) {
    priorityTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activePriorityFilter = btn.dataset.priority
        priorityTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const alertsList = el.querySelector('#tg-alerts-list')
        if (alertsList) alertsList.innerHTML = renderAlerts()
        wireAlertButtons(el)
      })
    })
  }

  // Severity tab listeners
  const severityTabs = el.querySelector('#tg-severity-tabs')
  if (severityTabs) {
    severityTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.severity
        severityTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const alertsList = el.querySelector('#tg-alerts-list')
        if (alertsList) alertsList.innerHTML = renderAlerts()
        wireAlertButtons(el)
      })
    })
  }

  wireAlertButtons(el)
}

function wireAlertButtons(el) {
  el.querySelectorAll('.tg-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      showAlertDetails(e.target.closest('button').dataset.alertId)
    })
  })

  el.querySelectorAll('.tg-dismiss-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const alertId = e.target.closest('button').dataset.alertId
      try {
        await dismissAlert(alertId, 'Dismissed from dashboard')
        showToast('Alert dismissed', 'success')
        await refreshData()
      } catch (error) {
        showToast('Failed to dismiss alert', 'error')
      }
    })
  })
}

function wireCorrelations(el) {
  // Add click handlers to correlation cards to show related alerts
  setTimeout(() => {
    const content = el.querySelector('#tg-content')
    if (!content) {
      console.warn('Content element not found')
      return
    }

    content.querySelectorAll('[data-corr-id]').forEach(card => {
      card.addEventListener('click', function(e) {
        e.stopPropagation()
        const corrId = this.dataset.corrId
        console.log('Clicked correlation:', corrId, 'Active section:', activeSection)
        const correlation = allCorrelations.find(c => c.id === corrId)
        if (correlation) {
          // Check if this is from patterns tab or correlations tab
          if (activeSection === 'patterns') {
            console.log('Showing attack timeline')
            showAttackChainTimeline(correlation)
          } else {
            console.log('Showing related alerts')
            showRelatedAlerts(correlation)
          }
        } else {
          console.warn('Correlation not found:', corrId)
        }
      })
    })
  }, 100)
}

function wirePatterns(el) {
  setTimeout(() => {
    const content = el.querySelector('#tg-content')
    if (!content) {
      console.warn('Content element not found')
      return
    }

    content.querySelectorAll('[data-pattern-id]').forEach(card => {
      card.addEventListener('click', function(e) {
        e.stopPropagation()
        const patternId = this.dataset.patternId
        const pattern = allCorrelations.find(c => c.id === patternId)
        if (pattern) {
          showAttackChainTimeline(pattern)
        }
      })
    })
  }, 100)
}

function showAttackChainTimeline(pattern) {
  // Parse alert IDs from pattern
  const relatedAlertIds = pattern.alert_ids.split(',').map(id => id.trim())

  // Find matching alerts and sort by timestamp
  const relatedAlerts = allAlerts
    .filter(a => relatedAlertIds.includes(a.id))
    .sort((a, b) => new Date(a.action_timestamp) - new Date(b.action_timestamp))

  // Determine attack phase for each alert
  const getPhase = (index, total) => {
    if (index === 0) return 'Initial Access'
    if (index < total * 0.33) return 'Reconnaissance'
    if (index < total * 0.66) return 'Privilege Escalation'
    return 'Persistence & Exfiltration'
  }

  const modalHTML = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000" id="attack-modal">
      <div style="background:var(--color-background-primary);border-radius:var(--border-radius-lg);max-width:900px;width:90%;max-height:90vh;overflow-y:auto;padding:24px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1)">

        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px">
          <div>
            <div style="font-size:18px;font-weight:700;color:var(--color-text-primary);margin-bottom:4px">
              🎯 ${escapeHtml(pattern.pattern_type)}
            </div>
            <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:8px">
              ${escapeHtml(pattern.description)}
            </div>
          </div>
          <button onclick="document.getElementById('attack-modal').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--color-text-secondary)">×</button>
        </div>

        <!-- Attack Summary -->
        <div style="background:var(--color-background-secondary);padding:12px;border-radius:var(--border-radius-md);margin-bottom:16px;border-left:4px solid var(--clr-danger-text)">
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;font-size:11px">
            <div>
              <div style="color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Confidence</div>
              <div style="font-weight:700;font-size:14px;color:var(--clr-danger-text)">${pattern.correlation_score}/100</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Attack Type</div>
              <div style="font-weight:600">${pattern.pattern_type}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Steps</div>
              <div style="font-weight:600">${relatedAlerts.length}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Duration</div>
              <div style="font-weight:600">${Math.round((new Date(relatedAlerts[relatedAlerts.length - 1].action_timestamp) - new Date(relatedAlerts[0].action_timestamp)) / 60000)} min</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary);font-size:10px;margin-bottom:4px">Risk</div>
              <span class="badge ${getBadgeClass(pattern.risk_level)}" style="font-size:10px">${pattern.risk_level}</span>
            </div>
          </div>
        </div>

        <!-- Attack Chain Timeline -->
        <div style="font-size:12px;font-weight:600;color:var(--color-text-primary);margin-bottom:12px">
          ⏱️ Attack Timeline
        </div>

        <div style="position:relative;padding:12px 0;padding-left:30px">
          <!-- Vertical line -->
          <div style="position:absolute;left:12px;top:0;bottom:0;width:2px;background:var(--clr-danger-text);opacity:0.3"></div>

          <!-- Timeline events -->
          ${relatedAlerts.map((alert, index) => {
            const phase = getPhase(index, relatedAlerts.length)
            const phaseColor = phase === 'Initial Access' ? 'var(--clr-info-text)' :
                              phase === 'Reconnaissance' ? 'var(--clr-warning-text)' :
                              phase === 'Privilege Escalation' ? 'var(--clr-danger-text)' :
                              'var(--clr-danger-text)'

            return `
              <div style="margin-bottom:16px;position:relative">
                <!-- Timeline dot -->
                <div style="position:absolute;left:-24px;top:6px;width:16px;height:16px;background:${phaseColor};border:3px solid var(--color-background-primary);border-radius:50%;z-index:2"></div>

                <!-- Event card -->
                <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border-left:3px solid ${alert.severity === 'CRITICAL' ? 'var(--clr-danger-text)' : 'var(--clr-warning-text)'}">
                  <!-- Step number and phase -->
                  <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
                    <div>
                      <span style="display:inline-block;background:${phaseColor};color:white;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:600;margin-right:8px">${phase}</span>
                      <span style="font-size:9px;color:var(--color-text-tertiary)">Step ${index + 1}/${relatedAlerts.length}</span>
                    </div>
                    <span class="badge ${alert.severity === 'CRITICAL' ? 'danger' : 'warning'}" style="font-size:9px">
                      ${alert.severity}
                    </span>
                  </div>

                  <!-- Event headline -->
                  <div style="font-weight:600;font-size:11px;color:var(--color-text-primary);margin-bottom:4px">
                    ${escapeHtml(alert.headline || 'Unknown Event')}
                  </div>

                  <!-- Event description -->
                  <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:6px">
                    ${escapeHtml(alert.description || '')}
                  </div>

                  <!-- Event metadata -->
                  <div style="display:flex;gap:12px;font-size:9px;color:var(--color-text-tertiary);flex-wrap:wrap">
                    <span><i class="ti ti-clock" style="font-size:9px"></i> ${new Date(alert.action_timestamp).toLocaleTimeString()}</span>
                    <span><i class="ti ti-user" style="font-size:9px"></i> ${alert.actor || 'System'}</span>
                    <span><i class="ti ti-trending-up" style="font-size:9px"></i> Score: ${alert.score}/100</span>
                  </div>
                </div>
              </div>
            `
          }).join('')}
        </div>

        <!-- Impact Assessment -->
        <div style="background:var(--color-background-secondary);padding:12px;border-radius:var(--border-radius-md);margin-top:16px">
          <div style="font-size:11px;font-weight:600;color:var(--color-text-primary);margin-bottom:8px">
            ⚠️ Attack Impact
          </div>
          <div style="font-size:10px;color:var(--color-text-secondary);line-height:1.5">
            ${pattern.pattern_type === 'PRIVILEGE_ESCALATION' ? 'Attacker gained elevated privileges, potentially compromising system security.' :
              pattern.pattern_type === 'CREDENTIAL_COMPROMISE' ? 'User account credentials have been compromised. Immediate password reset recommended.' :
              pattern.pattern_type === 'DATA_EXFILTRATION' ? 'Data exfiltration mechanisms detected. Sensitive data may have been accessed or stolen.' :
              pattern.pattern_type === 'SUSPICIOUS_LOGIN' ? 'Suspicious authentication activity detected. Account security may be at risk.' :
              pattern.pattern_type === 'BURST_ACTIVITY' ? 'Multiple security events in rapid succession indicate active attack.' :
              'Multiple indicators suggest malicious activity.'}
          </div>
        </div>

        <!-- Recommended Actions -->
        <div style="background:rgba(76,175,80,0.1);padding:12px;border-radius:var(--border-radius-md);margin-top:12px;border-left:3px solid var(--clr-success-text)">
          <div style="font-size:11px;font-weight:600;color:var(--clr-success-text);margin-bottom:8px">
            ✓ Recommended Actions
          </div>
          <div style="font-size:10px;color:var(--color-text-secondary);line-height:1.6">
            ${pattern.pattern_type === 'PRIVILEGE_ESCALATION' ? '1. Review recent privilege assignments<br/>2. Disable unnecessary elevated accounts<br/>3. Audit permission changes<br/>4. Enable MFA for admin accounts' :
              pattern.pattern_type === 'CREDENTIAL_COMPROMISE' ? '1. Reset affected user password immediately<br/>2. Review all recent sign-ins<br/>3. Disable active sessions<br/>4. Enable MFA if not active' :
              pattern.pattern_type === 'DATA_EXFILTRATION' ? '1. Review email forwarding rules<br/>2. Disable OAuth app grants<br/>3. Check shared data items<br/>4. Monitor data access logs' :
              pattern.pattern_type === 'SUSPICIOUS_LOGIN' ? '1. Verify user location<br/>2. Check for account compromises<br/>3. Review login details<br/>4. Enable additional security' :
              '1. Investigate all related alerts<br/>2. Monitor account activity<br/>3. Review access logs<br/>4. Contact security team'}
          </div>
        </div>

        <!-- Close Button -->
        <div style="margin-top:16px;display:flex;gap:8px">
          <button onclick="document.getElementById('attack-modal').remove()" style="flex:1;padding:8px 12px;background:var(--color-background-secondary);border:1px solid var(--color-border-secondary);border-radius:var(--border-radius-md);cursor:pointer;font-size:11px;font-weight:600">
            Close
          </button>
        </div>
      </div>
    </div>
  `

  // Add modal to DOM
  const modalDiv = document.createElement('div')
  modalDiv.innerHTML = modalHTML
  document.body.appendChild(modalDiv.firstElementChild)
}

function showAlertDetails(alertId) {
  const alert = allAlerts.find(a => a.id === alertId)
  if (!alert) return

  const el = document.getElementById('tg-content')
  if (!el) return

  let recommendations = []
  let riskAssessment = {}

  try {
    recommendations = JSON.parse(alert.recommendations || '[]')
    riskAssessment = JSON.parse(alert.risk_assessment || '{}')
  } catch (e) {
    // Ignore parse errors
  }

  const priorityColor = alert.priority === 'P1' ? '#dc3545' : alert.priority === 'P2' ? '#fd7e14' : '#ffc107'
  const priorityIcon = alert.priority === 'P1' ? '🔴' : alert.priority === 'P2' ? '🟠' : '🟡'
  const riskScore = alert.score || alert.riskScore || 0

  el.innerHTML = `
    <div class="card mb-3">
      <div class="card-header">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="font-size:16px">${priorityIcon}</span>
            <span class="badge" style="background:${priorityColor};color:white;padding:4px 12px;border-radius:4px;font-weight:600;font-size:12px">${alert.priority || 'P3'} - ${alert.severity || 'UNKNOWN'}</span>
          </div>
          <div class="card-title">${escapeHtml(alert.headline)}</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">
            Risk Score: ${riskScore}/100 · ${formatTime(alert.action_timestamp)}
          </div>
        </div>
        <button class="btn" onclick="closeAlertDetails()"><i class="ti ti-x"></i> Back to Alerts</button>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:8px">Description</div>
        <div style="font-size:12px;color:var(--color-text-secondary);line-height:1.6">
          ${escapeHtml(alert.description)}
        </div>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:8px">Risk Assessment</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px">
          <div>
            <div style="color:var(--color-text-tertiary)">Score</div>
            <div style="font-weight:700;font-size:14px;color:${getSeverityColor(riskAssessment.severity || alert.severity)}">${riskAssessment.score || alert.score}/100</div>
          </div>
          <div>
            <div style="color:var(--color-text-tertiary)">Severity</div>
            <div style="font-weight:700;margin-top:4px"><span class="badge ${getBadgeClass(riskAssessment.severity || alert.severity)}">${riskAssessment.severity || alert.severity}</span></div>
          </div>
          ${Object.entries(riskAssessment.levels || {}).map(([key, val]) => `
            <div>
              <div style="color:var(--color-text-tertiary)">${capitalize(key)}</div>
              <div style="font-weight:700">${val}</div>
            </div>
          `).join('')}
        </div>
        ${riskAssessment.impacts && riskAssessment.impacts.length > 0 ? `
          <div style="margin-top:8px;padding:8px;background:var(--color-background-secondary);border-radius:4px;font-size:11px">
            <strong>Impacts:</strong> ${riskAssessment.impacts.join(', ')}
          </div>
        ` : ''}
      </div>

      ${recommendations.length > 0 ? `
        <div style="margin-bottom:16px">
          <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:8px">Recommended Actions</div>
          <ul style="list-style:none;padding:0;margin:0;font-size:12px">
            ${recommendations.map(rec => `
              <li style="padding:6px 0;padding-left:20px;position:relative;color:var(--color-text-secondary)">
                <span style="position:absolute;left:0;color:var(--clr-primary)">→</span>
                ${escapeHtml(rec)}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="border-top:0.5px solid var(--color-border-tertiary);padding-top:12px">
        <button class="btn btn-danger" onclick="dismissAndRefreshDetail('${alertId}')">
          <i class="ti ti-check"></i> Dismiss This Alert
        </button>
      </div>
    </div>

    <div id="other-alerts" style="margin-top:16px;font-size:11px;color:var(--color-text-tertiary);padding:8px">
      Loading other alerts...
    </div>
  `

  // Render other alerts
  const otherAlerts = activeFilter === 'all'
    ? allAlerts.filter(a => a.id !== alertId)
    : allAlerts.filter(a => a.severity === activeFilter && a.id !== alertId)

  if (otherAlerts.length > 0) {
    const html = `
      <div style="margin-top:24px">
        <div style="font-size:12px;font-weight:600;color:var(--color-text-primary);margin-bottom:12px">Other Alerts</div>
        ${otherAlerts.map(a => `
          <div class="tenantguard-alert-card ${a.severity.toLowerCase()}" style="cursor:pointer" onclick="showAlertDetailsFromDetail('${a.id}')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div style="flex:1">
                <div style="font-weight:600;font-size:12px">${escapeHtml(a.headline)}</div>
                <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">${formatTime(a.action_timestamp)}</div>
              </div>
              <span class="badge ${getBadgeClass(a.severity)}">${a.severity}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `
    const container = el.querySelector('#other-alerts')
    if (container) container.innerHTML = html
  } else {
    const container = el.querySelector('#other-alerts')
    if (container) container.style.display = 'none'
  }
}

window.selectAlert = function(alertId) {
  selectedAlertId = alertId
  const el = document.getElementById('page-tenantguard')
  if (el) {
    const content = el.querySelector('#tg-content')
    if (content) {
      content.innerHTML = renderAlertsSection()
      wireAlerts(el)
    }
  }
}

window.closeAlertDetails = function() {
  const el = document.getElementById('page-tenantguard')
  if (el) {
    const content = el.querySelector('#tg-content')
    if (content) {
      content.innerHTML = renderAlertsSection()
      wireAlerts(el)
    }
  }
}

window.selectCorrelation = function(corrId) {
  selectedCorrelationId = corrId
  const el = document.getElementById('page-tenantguard')
  if (el) {
    const content = el.querySelector('#tg-content')
    if (content) {
      content.innerHTML = renderCorrelationsSection()
      wireCorrelations(el)
    }
  }
}

window.selectPattern = function(patternId) {
  selectedPatternId = patternId
  const el = document.getElementById('page-tenantguard')
  if (el) {
    const content = el.querySelector('#tg-content')
    if (content) {
      content.innerHTML = renderPatternsSection()
      wirePatterns(el)
    }
  }
}

window.dismissAndRefreshDetail = async function(alertId) {
  try {
    await dismissAlert(alertId)
    showToast('Alert dismissed', 'success')
    await refreshData()
  } catch (error) {
    showToast('Failed to dismiss alert', 'error')
  }
}

window.showAlertDetailsFromDetail = function(alertId) {
  showAlertDetails(alertId)
}

window.startCorrInvestigation = async function(correlationId, title) {
  try {
    activeSection = 'investigation'
    currentInvestigation = await startInvestigation(null, correlationId, title)
    const el = document.getElementById('page-tenantguard')
    if (el) {
      const content = el.querySelector('#tg-content')
      if (content) {
        content.innerHTML = renderInvestigationChat()
        wireInvestigationChat(el)
        loadInvestigationMessages()
      }
    }
  } catch (error) {
    showToast('Failed to start investigation: ' + error.message, 'error')
  }
}

// Global click handlers for correlations and patterns
window.handleCorrelationClick = function(corrId) {
  console.log('Correlation clicked:', corrId)
  const correlation = allCorrelations.find(c => c.id === corrId)
  if (correlation) {
    showRelatedAlerts(correlation)
  } else {
    console.warn('Correlation not found:', corrId)
  }
}

window.handlePatternClick = function(patternId) {
  console.log('Pattern clicked:', patternId)
  const pattern = allCorrelations.find(c => c.id === patternId)
  if (pattern) {
    showAttackChainTimeline(pattern)
  } else {
    console.warn('Pattern not found:', patternId)
  }
}

window.closeInvestigation = function() {
  currentInvestigation = null
  activeSection = 'alerts'
  const el = document.getElementById('page-tenantguard')
  if (el) {
    const content = el.querySelector('#tg-content')
    if (content) {
      content.innerHTML = renderAlertsSection()
      wireAlerts(el)
    }
  }
}

async function wireInvestigationChat(el) {
  const sendBtn = el.querySelector('#investigation-send')
  const input = el.querySelector('#investigation-input')
  const reportBtn = el.querySelector('#investigation-report')

  if (sendBtn && input) {
    sendBtn.addEventListener('click', sendInvestigationMessage)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendInvestigationMessage()
      }
    })
  }

  if (reportBtn) {
    reportBtn.addEventListener('click', async () => {
      try {
        reportBtn.disabled = true
        reportBtn.innerHTML = '<span class="spinner dark"></span>'
        const report = await generateInvestigationReport(currentInvestigation.id)
        showToast('Report generated! Downloading...', 'success')
        // Could download the report or display it
        reportBtn.disabled = false
        reportBtn.innerHTML = '<i class="ti ti-file-text"></i> Report'
      } catch (error) {
        showToast('Failed to generate report: ' + error.message, 'error')
        reportBtn.disabled = false
        reportBtn.innerHTML = '<i class="ti ti-file-text"></i> Report'
      }
    })
  }
}

async function sendInvestigationMessage() {
  const el = document.getElementById('page-tenantguard')
  const input = el?.querySelector('#investigation-input')
  if (!input) return

  const message = input.value.trim()
  if (!message) return

  try {
    input.value = ''
    input.disabled = true

    // Add user message to display
    const messagesEl = el.querySelector('#investigation-messages')
    if (messagesEl) {
      messagesEl.innerHTML += `
        <div style="margin-bottom:8px;text-align:right">
          <div style="display:inline-block;max-width:70%;background:var(--clr-primary);color:white;padding:8px 12px;border-radius:4px;font-size:12px;text-align:left">
            ${escapeHtml(message)}
          </div>
        </div>
      `
      messagesEl.scrollTop = messagesEl.scrollHeight
    }

    // Get agent response
    const response = await chatInvestigation(currentInvestigation.id, message)

    // Add agent response
    if (messagesEl) {
      messagesEl.innerHTML += `
        <div style="margin-bottom:8px">
          <div style="display:inline-block;max-width:70%;background:var(--color-background-secondary);padding:8px 12px;border-radius:4px;font-size:12px;border:0.5px solid var(--color-border-secondary);color:var(--color-text-secondary)">
            ${escapeHtml(response.response).replace(/\n/g, '<br>')}
          </div>
        </div>
      `
      messagesEl.scrollTop = messagesEl.scrollHeight
    }

    input.disabled = false
    input.focus()
  } catch (error) {
    showToast('Failed to send message: ' + error.message, 'error')
    const input = el?.querySelector('#investigation-input')
    if (input) input.disabled = false
  }
}

async function loadInvestigationMessages() {
  try {
    const investigation = await getInvestigation(currentInvestigation.id)
    const messagesEl = document.querySelector('#investigation-messages')

    if (messagesEl && investigation.messages) {
      messagesEl.innerHTML = investigation.messages.map(m => `
        <div style="margin-bottom:8px;${m.sender_type === 'user' ? 'text-align:right' : ''}">
          <div style="display:inline-block;max-width:70%;${m.sender_type === 'user' ? 'background:var(--clr-primary);color:white' : 'background:var(--color-background-secondary);border:0.5px solid var(--color-border-secondary);color:var(--color-text-secondary)'};padding:8px 12px;border-radius:4px;font-size:12px;${m.sender_type !== 'user' ? 'text-align:left' : ''}">
            ${escapeHtml(m.message_text).replace(/\n/g, '<br>')}
          </div>
        </div>
      `).join('')
      messagesEl.scrollTop = messagesEl.scrollHeight
    }
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

function formatTime(isoString) {
  if (!isoString) return 'Unknown'
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function escapeHtml(text) {
  if (!text) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return String(text).replace(/[&<>"']/g, m => map[m])
}

function getBadgeClass(severity) {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL': return 'danger'
    case 'HIGH': return 'warning'
    case 'MEDIUM': return 'info'
    default: return 'neutral'
  }
}

function getSeverityColor(severity) {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL': return 'var(--clr-danger-text)'
    case 'HIGH': return 'var(--clr-warning-text)'
    case 'MEDIUM': return 'var(--clr-info-text)'
    default: return 'var(--color-text-primary)'
  }
}

// ====== Investigation Management Functions ======

window.wireInvestigations = function(el) {
  const statusTabs = el.querySelector('#investigation-status-tabs')
  if (statusTabs) {
    statusTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        investigationStatusFilter = btn.dataset.status
        statusTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const content = el.querySelector('#tg-content')
        if (content) {
          content.innerHTML = renderInvestigationsSection()
          wireInvestigations(el)
        }
      })
    })
  }
}

window.selectInvestigation = function(invId) {
  selectedInvestigation = allInvestigations.find(inv => inv.id === invId)
  const el = document.getElementById('page-tenantguard')
  if (el) {
    const content = el.querySelector('#tg-content')
    if (content) {
      content.innerHTML = renderInvestigationsSection()
    }
  }
}

window.closeInvestigationDetails = function() {
  selectedInvestigation = null
  const el = document.getElementById('page-tenantguard')
  if (el) {
    const content = el.querySelector('#tg-content')
    if (content) {
      content.innerHTML = renderInvestigationsSection()
      wireInvestigations(el)
    }
  }
}

window.updateInvestigationStatus = function(newStatus) {
  if (selectedInvestigation) {
    selectedInvestigation.status = newStatus
    selectedInvestigation.completedAt = newStatus === 'CLOSED' ? new Date().toISOString() : null
    const el = document.getElementById('page-tenantguard')
    if (el) {
      const content = el.querySelector('#tg-content')
      if (content) {
        content.innerHTML = renderInvestigationsSection()
      }
    }
    showToast(`Investigation status updated to ${newStatus}`, 'success')
  }
}

window.updateInvestigationAssignee = function(assignee) {
  if (selectedInvestigation) {
    selectedInvestigation.assignedTo = assignee
    showToast(`Investigation assigned to ${assignee || 'Unassigned'}`, 'success')
  }
}

window.updateInvestigationPriority = function(priority) {
  if (selectedInvestigation) {
    selectedInvestigation.priority = priority
    showToast(`Priority updated to ${priority}`, 'success')
  }
}

window.saveInvestigationNotes = function() {
  if (selectedInvestigation) {
    const notesEl = document.querySelector('#investigation-notes')
    if (notesEl) {
      selectedInvestigation.notes = notesEl.value
      showToast('Investigation notes saved', 'success')
    }
  }
}

window.showCreateInvestigationModal = function() {
  const modal = document.createElement('div')
  modal.id = 'create-investigation-modal'
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000'
  modal.innerHTML = `
    <div style="background:var(--color-background-primary);border-radius:8px;padding:24px;max-width:500px;width:90%;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1)">
      <div style="font-size:16px;font-weight:700;margin-bottom:16px;color:var(--color-text-primary)">Create New Investigation</div>

      <div style="margin-bottom:16px">
        <label style="display:block;font-size:12px;font-weight:600;color:var(--color-text-secondary);margin-bottom:6px">Investigation Title</label>
        <input type="text" id="new-inv-title" placeholder="e.g., Suspicious Admin Activity" style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-primary);color:var(--color-text-primary);font-size:12px" />
      </div>

      <div style="margin-bottom:16px">
        <label style="display:block;font-size:12px;font-weight:600;color:var(--color-text-secondary);margin-bottom:6px">Type</label>
        <select id="new-inv-type" style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-primary);color:var(--color-text-primary);font-size:12px">
          <option value="ALERT">Alert Investigation</option>
          <option value="CORRELATION">Correlation Analysis</option>
          <option value="PATTERN">Attack Pattern</option>
        </select>
      </div>

      <div style="margin-bottom:16px">
        <label style="display:block;font-size:12px;font-weight:600;color:var(--color-text-secondary);margin-bottom:6px">Priority</label>
        <select id="new-inv-priority" style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-primary);color:var(--color-text-primary);font-size:12px">
          <option value="P1">P1 - Critical</option>
          <option value="P2">P2 - High</option>
          <option value="P3">P3 - Info</option>
        </select>
      </div>

      <div style="margin-bottom:16px">
        <label style="display:block;font-size:12px;font-weight:600;color:var(--color-text-secondary);margin-bottom:6px">Assign To</label>
        <select id="new-inv-assignee" style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-primary);color:var(--color-text-primary);font-size:12px">
          <option value="">Unassigned</option>
          <option value="rajkumar.mcitp@gmail.com">Rajkumar</option>
          <option value="analyst@contoso.com">Security Analyst</option>
          <option value="soc@contoso.com">SOC Team</option>
        </select>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn" id="cancel-inv-modal">Cancel</button>
        <button class="btn btn-primary" onclick="createNewInvestigation()">Create Investigation</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)

  const cancelBtn = document.getElementById('cancel-inv-modal')
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      modal.remove()
    })
  }
}

window.createNewInvestigation = function() {
  const titleEl = document.querySelector('#new-inv-title')
  const typeEl = document.querySelector('#new-inv-type')
  const priorityEl = document.querySelector('#new-inv-priority')
  const assigneeEl = document.querySelector('#new-inv-assignee')

  const title = titleEl?.value.trim()
  if (!title) {
    showToast('Please enter a title', 'error')
    return
  }

  const newInv = {
    id: 'inv-' + Date.now(),
    title,
    type: typeEl?.value || 'ALERT',
    priority: priorityEl?.value || 'P2',
    severity: 'HIGH',
    status: 'OPEN',
    riskScore: 75,
    assignedTo: assigneeEl?.value || '',
    startedBy: 'User',
    startedAt: new Date().toISOString(),
    completedAt: null,
    relatedAlerts: [],
    relatedCorrelations: [],
    notes: '',
    aiAnalysis: '',
    recommendations: [],
    reportGenerated: false
  }

  allInvestigations.unshift(newInv)
  selectedInvestigation = newInv
  document.getElementById('create-investigation-modal')?.remove()

  const el = document.getElementById('page-tenantguard')
  if (el) {
    const content = el.querySelector('#tg-content')
    if (content) {
      content.innerHTML = renderInvestigationsSection()
    }
  }
  showToast('Investigation created successfully', 'success')
}

window.generateAIAnalysis = function(invId) {
  if (selectedInvestigation) {
    selectedInvestigation.aiAnalysis = 'Pattern matching privilege escalation attack. Multiple admin roles assigned outside normal hours indicating potential account compromise. Recommend immediate password reset and MFA enforcement for affected accounts.'
    selectedInvestigation.recommendations = [
      'Reset affected account passwords immediately',
      'Enable MFA for all administrative accounts',
      'Review Azure AD sign-in logs for past 7 days',
      'Block suspicious IP addresses from accessing admin portal',
      'Conduct user awareness training'
    ]
    const el = document.getElementById('page-tenantguard')
    if (el) {
      const content = el.querySelector('#tg-content')
      if (content) {
        content.innerHTML = renderInvestigationsSection()
      }
    }
    showToast('AI analysis generated', 'success')
  }
}

window.generateInvestigationReport = function(invId) {
  if (selectedInvestigation) {
    selectedInvestigation.reportGenerated = true
    showToast('Investigation report generated and ready for download', 'success')
    // In a real app, this would generate and download a PDF or document
  }
}

window.shareInvestigationFindings = function(invId) {
  if (selectedInvestigation) {
    const recList = selectedInvestigation.recommendations.map((r, i) => (i + 1) + '. ' + r).join('\n')
    const findings = `Investigation: ${selectedInvestigation.title}
Status: ${selectedInvestigation.status}
Priority: ${selectedInvestigation.priority}
Risk Score: ${selectedInvestigation.riskScore}/100

Notes:
${selectedInvestigation.notes}

AI Analysis:
${selectedInvestigation.aiAnalysis}

Recommendations:
${recList}`
    // Copy to clipboard
    navigator.clipboard.writeText(findings).then(() => {
      showToast('Investigation findings copied to clipboard', 'success')
    }).catch(() => {
      showToast('Failed to copy findings', 'error')
    })
  }
}

window.createInvestigationFromAlert = function(alertId, alertTitle) {
  const alert = allAlerts.find(a => a.id === alertId)
  if (!alert) return

  const newInv = {
    id: 'inv-' + Date.now(),
    title: 'Investigating: ' + alertTitle,
    type: 'ALERT',
    priority: alert.priority || 'P2',
    severity: alert.severity || 'HIGH',
    status: 'OPEN',
    riskScore: alert.riskScore || alert.score || 75,
    assignedTo: '',
    startedBy: 'User',
    startedAt: new Date().toISOString(),
    completedAt: null,
    relatedAlerts: [alertId],
    relatedCorrelations: [],
    notes: 'Alert: ' + escapeHtml(alert.description),
    aiAnalysis: '',
    recommendations: [],
    reportGenerated: false
  }

  allInvestigations.unshift(newInv)
  activeSection = 'investigations'
  selectedInvestigation = newInv

  const el = document.getElementById('page-tenantguard')
  if (el) {
    const content = el.querySelector('#tg-content')
    if (content) {
      content.innerHTML = renderInvestigationsSection()
    }
  }
  showToast('Investigation created from alert', 'success')
}

window.createInvestigationFromCorrelation = function(corrId, corrDesc) {
  const corr = allCorrelations.find(c => c.id === corrId)
  if (!corr) return

  const newInv = {
    id: 'inv-' + Date.now(),
    title: 'Investigating: ' + (corrDesc || 'Correlation'),
    type: 'CORRELATION',
    priority: 'P1',
    severity: 'CRITICAL',
    status: 'OPEN',
    riskScore: corr.correlation_score || corr.risk_score || 85,
    assignedTo: '',
    startedBy: 'User',
    startedAt: new Date().toISOString(),
    completedAt: null,
    relatedAlerts: corr.alert_ids ? corr.alert_ids.split(',').map(id => id.trim()) : [],
    relatedCorrelations: [corrId],
    notes: 'Correlation: ' + escapeHtml(corr.description || ''),
    aiAnalysis: '',
    recommendations: [],
    reportGenerated: false
  }

  allInvestigations.unshift(newInv)
  activeSection = 'investigations'
  selectedInvestigation = newInv

  const el = document.getElementById('page-tenantguard')
  if (el) {
    const content = el.querySelector('#tg-content')
    if (content) {
      content.innerHTML = renderInvestigationsSection()
    }
  }
  showToast('Investigation created from correlation', 'success')
}
