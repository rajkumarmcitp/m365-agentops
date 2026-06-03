// ============================================================
// Security Command Center — Simulated Security Posture Data
// Reflects a 1,000-user Microsoft 365 E3/E5 tenant
// ============================================================

export const SECURE_SCORE = {
  current: 64,
  max: 95,
  percentOf100: 67.4,
  delta7d: +2,
  delta30d: +5,
  delta90d: -1,
  avgComparable: 53,     // industry average for similar-size org
  trend7d:  [58, 60, 61, 61, 62, 63, 64],
  trend30d: [55, 56, 57, 58, 57, 58, 58, 59, 59, 60, 60, 60, 61, 61, 62, 62, 62, 62, 63, 63, 63, 63, 63, 64, 64, 64, 64, 64, 63, 64],
  categories: [
    { name: 'Identity',       score: 68, max: 100, color: '#0C447C', icon: 'ti-user-check' },
    { name: 'Devices',        score: 58, max: 100, color: '#3B6D11', icon: 'ti-device-laptop' },
    { name: 'Apps',           score: 72, max: 100, color: '#854F0B', icon: 'ti-apps' },
    { name: 'Data',           score: 61, max: 100, color: '#3C3489', icon: 'ti-database' },
    { name: 'Infrastructure', score: 54, max: 100, color: '#633806', icon: 'ti-server' },
  ],
}

export const IDENTITY = {
  totalUsers: 1000,
  privAccounts: 14,
  globalAdmins: 2,
  serviceAccounts: 12,
  breakGlass: 2,
  mfaEnabled: 870,
  mfaExcluded: 130,
  passwordlessAdoption: 23,
  fido2Adoption: 5,
  legacyAuthConnections: 12,
  highRiskUsers: 3,
  riskySignIns30d: 47,
  impossibleTravel30d: 2,
  anonymousIP30d: 8,
  passwordSpray30d: 0,
  caPoliciesEnabled: 25,
  caPoliciesDisabled: 5,
  caPoliciesReportOnly: 3,
  caUsersExcluded: 18,
  identitySecureScore: 72,
}

export const EMAIL = {
  malwareDetected30d: 247,
  phishingAttempts30d: 1834,
  becAttempts30d: 3,
  spoofedDomainActivity30d: 12,
  quarantined30d: 4782,
  spf: 'pass',
  dkim: 'pass',
  dmarc: 'quarantine',   // not 'reject' — risk
  safeLinks: 'enabled',
  safeAttachments: 'partial',
  externalForwardingRules: 2,
  suspiciousInboxRules: 1,
  sharedMailboxExposed: 14,
  antiSpamPolicy: 'standard',
}

export const ENDPOINT = {
  totalManaged: 847,
  nonCompliant: 15,
  vulnerable: 8,
  missingEDR: 5,
  avCoverage: 99.4,
  bitlockerCoverage: 95.7,
  firewallEnabled: 98.2,
  tamperProtection: 94.8,
  activeThreats: 2,
  highSeverityAlerts: 4,
  ransomwareIndicators: 1,
  missingCriticalPatches: 23,
  windows11Pct: 71,
  windows10Pct: 27,
  macPct: 2,
}

export const TEAMS_SEC = {
  totalTeams: 187,
  publicTeams: 8,
  guestEnabledTeams: 34,
  inactiveTeams90d: 23,
  anonymousMeetingAccess: false,
  guestsAdded30d: 12,
  externalDomainsAllowed: 3,
  teamsWithExternalSharing: 11,
  unownedTeams: 5,
}

export const SHAREPOINT_SEC = {
  totalSites: 234,
  externallyShared: 18,
  anonymousLinks: 3,
  publicContent: 2,
  oversharedSites: 5,
  sensitiveFiles: 47,
  largeDownloads30d: 8,
  restrictedSharingEnabled: true,
  dlpCoveragePct: 78,
}

export const DATA_PROTECTION = {
  sensitivityLabelsApplied: 34,
  filesWithoutLabels: 18000,
  retentionPoliciesActive: 4,
  dlpViolations30d: 23,
  financialDataExposure: 8,
  piiExposure: 11,
  healthcareData: 4,
  dataExfiltration30d: 2,
  unusualDownloads30d: 5,
  usbTransfers30d: 3,
  complianceScore: 61,
  insiderRiskPolicies: 2,
}

export const PRIV_ACCESS = {
  globalAdminCount: 2,
  securityAdminCount: 2,
  exchangeAdminCount: 2,
  sharePointAdminCount: 1,
  teamsAdminCount: 1,
  intuneAdminCount: 1,
  newAdmins30d: 1,
  privRoleAssignments30d: 4,
  emergencyAccess30d: 0,
  pimAdoption: 85,
  permanentAssignments: 4,
  pimEligibleRoles: 10,
}

export const GUEST_GOVERNANCE = {
  totalGuests: 87,
  dormantGuests90d: 12,
  expiredGuests: 3,
  guestsWithPrivAccess: 0,
  quarterlyReviewOverdue: 14,
  guestsAddedLast30d: 7,
  guestsRemovedLast30d: 3,
  avgGuestAgeDays: 142,
}

export const INCIDENTS = [
  { id: 'INC-2341', severity: 'critical', title: 'Ransomware Indicators — Device MBX-LAPTOP-047', category: 'Malware', status: 'active',  assignee: 'Aisha Raza', created: '3h ago', services: ['Endpoint', 'Identity'] },
  { id: 'INC-2338', severity: 'high',     title: 'BEC Attempt — Invoice Fraud Pattern Detected', category: 'Phishing', status: 'active',  assignee: 'Chen Wei',   created: '6h ago', services: ['Exchange'] },
  { id: 'INC-2335', severity: 'high',     title: 'Risky Sign-in — kevin.osei@contoso.com (Unfamiliar Location)', category: 'Identity Attack', status: 'active', assignee: 'Aisha Raza', created: '14h ago', services: ['Identity'] },
  { id: 'INC-2330', severity: 'high',     title: 'Suspicious Inbox Rule — Auto-Forward to External', category: 'Data Exposure', status: 'investigating', assignee: 'Chen Wei', created: 'Yesterday', services: ['Exchange'] },
  { id: 'INC-2298', severity: 'medium',   title: 'Multiple Failed Sign-ins — Brute Force Pattern', category: 'Identity Attack', status: 'monitoring',  assignee: 'Chen Wei', created: '2 days ago', services: ['Identity'] },
  { id: 'INC-2290', severity: 'medium',   title: 'Sensitive File Shared Externally — Finance folder', category: 'Data Exposure', status: 'monitoring', assignee: 'Aisha Raza', created: '3 days ago', services: ['SharePoint', 'OneDrive'] },
  { id: 'INC-2281', severity: 'medium',   title: 'DLP Policy Violation — PII Data in Teams Chat', category: 'Insider Threat', status: 'resolved', assignee: 'Chen Wei', created: '4 days ago', services: ['Teams', 'Purview'] },
  { id: 'INC-2267', severity: 'low',      title: 'Guest Account — Excessive Resource Access', category: 'Identity Attack', status: 'resolved', assignee: 'Aisha Raza', created: '5 days ago', services: ['Identity'] },
]

export const RECOMMENDATIONS = [
  { id: 'R01', priority: 'critical', title: 'Enable MFA for 130 unregistered users',          category: 'Identity',      impact: 'Identity',   scoreGain: 15, effort: 'low',    status: 'open',     apiHint: 'GET /beta/reports/authenticationMethods/userRegistrationDetails' },
  { id: 'R02', priority: 'critical', title: 'Block legacy authentication via Conditional Access', category: 'Identity',  impact: 'Identity',   scoreGain: 8,  effort: 'low',    status: 'open',     apiHint: 'POST /beta/identity/conditionalAccess/policies' },
  { id: 'R03', priority: 'high',     title: 'Upgrade DMARC from quarantine to reject policy', category: 'Email',         impact: 'Email',      scoreGain: 6,  effort: 'medium', status: 'open',     apiHint: 'DNS: _dmarc.contoso.com TXT v=DMARC1;p=reject' },
  { id: 'R04', priority: 'high',     title: 'Enable Safe Attachments for all users',          category: 'Email',         impact: 'Email',      scoreGain: 4,  effort: 'low',    status: 'open',     apiHint: 'New-SafeAttachmentPolicy + New-SafeAttachmentRule' },
  { id: 'R05', priority: 'high',     title: 'Disable 2 active external mail forwarding rules',category: 'Email',         impact: 'Email',      scoreGain: 5,  effort: 'low',    status: 'open',     apiHint: 'GET /beta/users/{id}/mailFolders/inbox/messageRules' },
  { id: 'R06', priority: 'high',     title: 'Remediate 8 vulnerable devices (critical patches missing)', category: 'Endpoint', impact: 'Devices', scoreGain: 6, effort: 'medium', status: 'open',   apiHint: 'GET /beta/deviceManagement/managedDevices?$filter=complianceState ne \'compliant\'' },
  { id: 'R07', priority: 'high',     title: 'Enable BitLocker on 36 unencrypted devices',    category: 'Endpoint',      impact: 'Devices',    scoreGain: 4,  effort: 'medium', status: 'in-progress', apiHint: 'GET /beta/deviceManagement/managedDevices?$select=isEncrypted' },
  { id: 'R08', priority: 'medium',   title: 'Convert 4 permanent admin assignments to PIM eligible', category: 'Identity', impact: 'Identity', scoreGain: 5, effort: 'medium', status: 'open',    apiHint: 'GET /beta/roleManagement/directory/roleAssignmentSchedules' },
  { id: 'R09', priority: 'medium',   title: 'Remove or review 12 dormant guest accounts',    category: 'Guests',        impact: 'Collaboration', scoreGain: 3, effort: 'low',  status: 'open',     apiHint: 'GET /beta/users?$filter=userType eq \'Guest\'&$select=signInActivity' },
  { id: 'R10', priority: 'medium',   title: 'Enable sensitivity auto-labeling for Office files', category: 'Data',      impact: 'Data',       scoreGain: 4,  effort: 'high',   status: 'open',     apiHint: 'Microsoft Purview → Sensitivity Labels → Auto-labeling' },
  { id: 'R11', priority: 'medium',   title: 'Resolve DLP policy gap — Teams messages not covered', category: 'Data',    impact: 'Data',       scoreGain: 3,  effort: 'low',    status: 'open',     apiHint: 'GET /beta/compliance/ediscovery/cases or Purview DLP console' },
  { id: 'R12', priority: 'medium',   title: 'Enable phishing-resistant MFA for all admins (FIDO2/CBA)', category: 'Identity', impact: 'Identity', scoreGain: 7, effort: 'medium', status: 'open', apiHint: 'GET /beta/policies/authenticationMethodsPolicy' },
  { id: 'R13', priority: 'low',      title: 'Archive 23 inactive Teams (90d+)',               category: 'Teams',         impact: 'Collaboration', scoreGain: 2, effort: 'low',  status: 'open',     apiHint: 'GET /v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq \'Team\')' },
  { id: 'R14', priority: 'low',      title: 'Conduct overdue quarterly access review for 14 guests', category: 'Guests', impact: 'Collaboration', scoreGain: 2, effort: 'low', status: 'open',     apiHint: 'GET /v1.0/identityGovernance/accessReviews/definitions' },
  { id: 'R15', priority: 'low',      title: 'Restrict anonymous sharing links in SharePoint', category: 'SharePoint',   impact: 'Data',       scoreGain: 3,  effort: 'low',    status: 'open',     apiHint: 'Set-SPOTenant -SharingCapability ExistingExternalUserSharingOnly' },
]

export const API_REFERENCE = [
  // Secure Score
  { category: 'Secure Score', source: 'Graph Security API', method: 'GET', endpoint: '/v1.0/security/secureScores', returns: 'Current score, max score, control categories', auth: 'SecurityEvents.Read.All' },
  { category: 'Secure Score', source: 'Graph Security API', method: 'GET', endpoint: '/v1.0/security/secureScoreControlProfiles', returns: 'Individual control details and improvement actions', auth: 'SecurityEvents.Read.All' },
  // Identity
  { category: 'Identity', source: 'Microsoft Graph', method: 'GET', endpoint: '/v1.0/users?$count=true', returns: 'Total user count', auth: 'User.Read.All' },
  { category: 'Identity', source: 'Microsoft Graph', method: 'GET', endpoint: '/v1.0/directoryRoles/{id}/members', returns: 'Global Administrator members', auth: 'Directory.Read.All' },
  { category: 'Identity', source: 'Graph Reporting', method: 'GET', endpoint: '/beta/reports/authenticationMethods/userRegistrationDetails', returns: 'MFA registration status, passwordless, FIDO2 per user', auth: 'Reports.Read.All' },
  { category: 'Identity', source: 'Entra ID P2', method: 'GET', endpoint: '/beta/riskyUsers', returns: 'High/medium/low risk users with risk level', auth: 'IdentityRiskyUser.Read.All' },
  { category: 'Identity', source: 'Entra ID P2', method: 'GET', endpoint: '/beta/riskDetections', returns: 'Risky sign-in events, impossible travel, anonymous IP', auth: 'IdentityRiskEvent.Read.All' },
  { category: 'Identity', source: 'Microsoft Graph', method: 'GET', endpoint: '/beta/auditLogs/signIns?$filter=clientAppUsed ne \'Browser\'', returns: 'Legacy authentication sign-ins', auth: 'AuditLog.Read.All' },
  // Conditional Access
  { category: 'Conditional Access', source: 'Microsoft Graph', method: 'GET', endpoint: '/beta/identity/conditionalAccess/policies', returns: 'All CA policies, state (enabled/disabled/reportOnly), conditions', auth: 'Policy.Read.All' },
  // Exchange / Email Security
  { category: 'Email Security', source: 'Exchange Online PS', method: 'PS', endpoint: 'Get-SafeAttachmentPolicy | Select Name,Action,Enable', returns: 'Safe Attachments policy coverage and action mode', auth: 'Exchange Admin' },
  { category: 'Email Security', source: 'Exchange Online PS', method: 'PS', endpoint: 'Get-SafeLinksPolicy | Select Name,IsEnabled,ScanUrls', returns: 'Safe Links policy status and URL scanning', auth: 'Exchange Admin' },
  { category: 'Email Security', source: 'Exchange Online PS', method: 'PS', endpoint: 'Get-DkimSigningConfig | Select Domain,Enabled', returns: 'DKIM signing status per domain', auth: 'Exchange Admin' },
  { category: 'Email Security', source: 'Exchange Online PS', method: 'PS', endpoint: 'Get-HostedOutboundSpamFilterPolicy | Select AutoForwardingMode', returns: 'External mail forwarding policy setting', auth: 'Exchange Admin' },
  { category: 'Email Security', source: 'Exchange Online PS', method: 'PS', endpoint: 'Get-InboxRule -Mailbox All | Where {$_.ForwardTo}', returns: 'Inbox rules forwarding to external addresses', auth: 'Exchange Admin' },
  { category: 'Email Security', source: 'DNS Query', method: 'DNS', endpoint: 'Resolve-DnsName _dmarc.contoso.com -Type TXT', returns: 'DMARC policy (none/quarantine/reject)', auth: 'None (public DNS)' },
  // Endpoint / Intune
  { category: 'Endpoint', source: 'Microsoft Graph (Intune)', method: 'GET', endpoint: '/v1.0/deviceManagement/managedDevices', returns: 'All managed devices with compliance state, OS, owner', auth: 'DeviceManagementManagedDevices.Read.All' },
  { category: 'Endpoint', source: 'Microsoft Graph (Intune)', method: 'GET', endpoint: '/v1.0/deviceManagement/managedDevices?$filter=complianceState ne \'compliant\'', returns: 'Non-compliant devices', auth: 'DeviceManagementManagedDevices.Read.All' },
  { category: 'Endpoint', source: 'Microsoft Graph (Intune)', method: 'GET', endpoint: '/beta/deviceManagement/managedDevices?$select=id,deviceName,isEncrypted', returns: 'BitLocker encryption status per device', auth: 'DeviceManagementManagedDevices.Read.All' },
  // Defender XDR
  { category: 'Defender XDR', source: 'Defender API', method: 'GET', endpoint: '/api/incidents?$filter=status ne \'Resolved\'', returns: 'Active incidents with severity, status, assignee', auth: 'Incident.Read.All' },
  { category: 'Defender XDR', source: 'Defender API', method: 'GET', endpoint: '/api/alerts?$filter=severity eq \'High\'', returns: 'High/critical alerts with category and evidence', auth: 'Alert.Read.All' },
  { category: 'Defender XDR', source: 'Defender API', method: 'GET', endpoint: '/api/recommendations', returns: 'Threat and vulnerability management recommendations', auth: 'Tvm.Read.All' },
  // Teams
  { category: 'Teams Security', source: 'Microsoft Graph', method: 'GET', endpoint: '/v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq \'Team\')&$select=id,displayName,visibility', returns: 'All Teams with visibility (Public/Private)', auth: 'Group.Read.All' },
  { category: 'Teams Security', source: 'Microsoft Graph', method: 'GET', endpoint: '/v1.0/groups/{id}/members?$filter=userType eq \'Guest\'', returns: 'Guest members within a Team', auth: 'GroupMember.Read.All' },
  { category: 'Teams Security', source: 'Microsoft Graph', method: 'GET', endpoint: '/v1.0/teams/{id}/channels', returns: 'Team channels including private/shared channel count', auth: 'Channel.ReadBasic.All' },
  // SharePoint
  { category: 'SharePoint', source: 'Microsoft Graph', method: 'GET', endpoint: '/v1.0/sites?$select=id,displayName,webUrl', returns: 'All SharePoint site collections', auth: 'Sites.Read.All' },
  { category: 'SharePoint', source: 'SharePoint Admin PS', method: 'PS', endpoint: 'Get-SPOSite -Limit All | Select Url,SharingCapability', returns: 'Per-site external sharing configuration', auth: 'SharePoint Admin' },
  { category: 'SharePoint', source: 'Microsoft Graph', method: 'GET', endpoint: '/drives/{id}/items/{id}/permissions', returns: 'Anonymous link status for files/folders', auth: 'Files.Read.All' },
  // PIM / Privileged Access
  { category: 'Privileged Access', source: 'Microsoft Graph', method: 'GET', endpoint: '/beta/roleManagement/directory/roleEligibilitySchedules', returns: 'PIM eligible role assignments', auth: 'PrivilegedAccess.Read.AzureAD' },
  { category: 'Privileged Access', source: 'Microsoft Graph', method: 'GET', endpoint: '/beta/roleManagement/directory/roleAssignmentSchedules', returns: 'Active (permanent) privileged role assignments', auth: 'PrivilegedAccess.Read.AzureAD' },
  // Guests
  { category: 'Guest Governance', source: 'Microsoft Graph', method: 'GET', endpoint: '/v1.0/users?$filter=userType eq \'Guest\'&$select=id,displayName,signInActivity', returns: 'Guest users with last sign-in timestamp', auth: 'User.Read.All' },
  { category: 'Guest Governance', source: 'Microsoft Graph', method: 'GET', endpoint: '/v1.0/identityGovernance/accessReviews/definitions', returns: 'Scheduled access reviews and completion status', auth: 'AccessReview.Read.All' },
  // Compliance / Purview
  { category: 'Data Protection', source: 'Purview PS', method: 'PS', endpoint: 'Get-DlpCompliancePolicy | Select Name,Mode,Enabled', returns: 'DLP policy names, enforcement mode, workloads', auth: 'Compliance Admin' },
  { category: 'Data Protection', source: 'Purview PS', method: 'PS', endpoint: 'Get-Label | Select DisplayName,Priority,IsActive', returns: 'Sensitivity label hierarchy and status', auth: 'Compliance Admin' },
  { category: 'Data Protection', source: 'Purview PS', method: 'PS', endpoint: 'Get-RetentionCompliancePolicy | Select Name,Enabled,Workload', returns: 'Retention policies and covered workloads', auth: 'Compliance Admin' },
  // Service Health
  { category: 'Service Health', source: 'Microsoft Graph', method: 'GET', endpoint: '/admin/serviceAnnouncement/issues', returns: 'Active service health incidents and advisories', auth: 'ServiceHealth.Read.All' },
  { category: 'Service Health', source: 'Microsoft Graph', method: 'GET', endpoint: '/admin/serviceAnnouncement/messages', returns: 'Message Center posts, planned maintenance', auth: 'ServiceHealth.Read.All' },
]

export const SECURITY_COPILOT_KB = [
  { keywords: ['high risk user', 'risky user', 'show me risky', 'risk users'],
    response: `**High-Risk Users (3 Active)**\n\n| User | Risk Level | Detection | Last Sign-in |\n|---|---|---|---|\n| kevin.osei@contoso.com | 🔴 High | Unknown location sign-in | 14 min ago |\n| nina.patel@contoso.com | 🟡 Medium | Anomalous activity | Yesterday |\n| sara.ogden@contoso.com | 🟡 Medium | Inactive account activity | 2 days ago |\n\n**Recommended actions:**\n1. Force password reset for Kevin Osei immediately\n2. Block sign-in until investigation complete\n3. Review authentication logs for all three\n\n**Graph API:** GET /beta/riskyUsers?$filter=riskLevel eq 'high'` },
  { keywords: ['secure score', 'score drop', 'why did score', 'score this week'],
    response: `**Secure Score Analysis — 64/95 (67.4%)**\n\n📈 +2 points this week (was 62)\n📊 +5 points this month\n🏭 Industry average for similar orgs: 53/100\n\n**Category breakdown:**\n| Category | Score | Status |\n|---|---|---|\n| Identity | 68/100 | 🟡 Needs attention |\n| Apps | 72/100 | 🟡 Good |\n| Data | 61/100 | 🔴 Needs improvement |\n| Devices | 58/100 | 🔴 Needs improvement |\n| Infrastructure | 54/100 | 🔴 Needs improvement |\n\n**Biggest improvement opportunities:** Enable MFA for 130 users (+15), Block legacy auth (+8), DMARC reject (+6)` },
  { keywords: ['teams guest', 'which teams', 'teams with guest', 'external teams'],
    response: `**Microsoft Teams — External & Guest Access**\n\n📊 **187 total teams** in Contoso tenant\n\n| Risk Category | Count | Action |\n|---|---|---|\n| Public teams | 8 | Review — anyone can join |\n| Guest-enabled teams | 34 | Review membership |\n| Inactive 90d+ | 23 | Archive or delete |\n| External sharing | 11 | Audit content |\n| Unowned teams | 5 | Assign owner |\n\n**Graph API to enumerate:** GET /v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')&$select=displayName,visibility\n\n**Recommended:** Run quarterly guest access review for all 34 guest-enabled teams.` },
  { keywords: ['top 10 security', 'security improvements', 'what to fix', 'improve security'],
    response: `**Top 10 Security Improvements (by score impact)**\n\n| # | Action | Category | Score Gain |\n|---|---|---|---|\n| 1 | Enable MFA for 130 users | Identity | +15 |\n| 2 | Block legacy authentication | Identity | +8 |\n| 3 | Phishing-resistant MFA for admins | Identity | +7 |\n| 4 | Upgrade DMARC to reject | Email | +6 |\n| 5 | Remediate 8 vulnerable devices | Endpoint | +6 |\n| 6 | Convert permanent admins to PIM | Identity | +5 |\n| 7 | Disable external mail forwarding | Email | +5 |\n| 8 | Enable Safe Attachments (all) | Email | +4 |\n| 9 | BitLocker on 36 devices | Endpoint | +4 |\n| 10 | Enable sensitivity auto-labeling | Data | +4 |\n\n**Total potential gain: +64 points → would bring score to ~128%... recalibrating to 84/95 max**` },
  { keywords: ['ransomware', 'vulnerable device', 'malware', 'endpoint threat'],
    response: `**Endpoint Security Status**\n\n🚨 **CRITICAL: Ransomware indicators detected on MBX-LAPTOP-047**\n- Incident INC-2341 — Active investigation\n- Isolate device immediately if not already done\n\n**Device security summary:**\n- 847 managed devices total\n- 15 non-compliant\n- 8 missing critical patches\n- 2 active threats\n- BitLocker: 95.7% coverage (36 devices unencrypted)\n\n**Defender AV coverage:** 99.4% ✅\n**Tamper protection:** 94.8% ⚠️\n\n**Intune API:** GET /beta/deviceManagement/managedDevices?$filter=complianceState ne 'compliant'` },
  { keywords: ['today security', 'security posture', 'daily summary', 'summarize security'],
    response: `**Today's Security Posture Summary — ${new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' })}**\n\n🔴 **Requires immediate action:**\n- INC-2341: Ransomware indicators on MBX-LAPTOP-047\n- 130 users without MFA (7 June enforcement deadline approaching)\n- 3 high-risk users active (Kevin Osei, Nina Patel, Sara Ogden)\n\n📊 **Secure Score:** 64/95 (+2 this week)\n🔒 **CA Coverage:** 94.6% of sign-ins protected\n📧 **Email threats blocked today:** 156 phishing, 8 malware\n💻 **Device compliance:** 98.2% (15 non-compliant)\n\n**Priority:** Isolate MBX-LAPTOP-047 and force password reset for high-risk users immediately.` },
  { keywords: ['mfa coverage', 'mfa adoption', 'who has no mfa', 'mfa status'],
    response: `**MFA Adoption Status — 87% coverage**\n\n✅ Registered: 870 / 1,000 users\n❌ Not registered: 130 users\n\n**Authentication methods in use:**\n| Method | Users | Security Level |\n|---|---|---|\n| Microsoft Authenticator | 742 | 🟢 Strong |\n| FIDO2 security key | 5 | 🟢 Phishing-resistant |\n| Certificate-based | 3 | 🟢 Phishing-resistant |\n| SMS (legacy) | 120 | 🔴 Weak |\n| No MFA | 130 | 🔴 Critical |\n\n**Deadline:** Microsoft enforcing mandatory MFA registration by 31 July 2026\n\n**Graph API:** GET /beta/reports/authenticationMethods/userRegistrationDetails` },
  { keywords: ['email security', 'spf dkim dmarc', 'email protection', 'email threats'],
    response: `**Email Security Status**\n\n**Authentication records:**\n✅ SPF: Configured and passing\n✅ DKIM: Enabled for contoso.com\n⚠️ DMARC: quarantine (should be reject for full protection)\n\n**Last 30 days threat activity:**\n- 1,834 phishing attempts blocked\n- 247 malware detections\n- 3 BEC (Business Email Compromise) attempts\n- 4,782 messages quarantined\n\n**Active risks:**\n🔴 2 mailboxes with active external forwarding rules\n🔴 1 suspicious inbox rule detected\n⚠️ Safe Attachments: partial coverage only\n\n**Priority action:** Upgrade DMARC to p=reject for full anti-spoofing protection.` },
  { keywords: ['guest user', 'external user', 'dormant guest', 'guest governance'],
    response: `**Guest & External User Governance**\n\n👥 **87 total guest accounts** in tenant\n\n| Status | Count | Action Needed |\n|---|---|---|\n| Active (signed in 30d) | 62 | None |\n| Dormant 90d+ | 12 | 🔴 Remove or review |\n| Expired | 3 | 🔴 Remove immediately |\n| Review overdue | 14 | 🟡 Schedule review |\n| With privileged access | 0 | ✅ Clean |\n\n**Average guest account age:** 142 days\n\n**Graph API to find dormant guests:**\nGET /v1.0/users?$filter=userType eq 'Guest'&$select=displayName,signInActivity\n\nFilter for: signInActivity/lastSignInDateTime <= [90 days ago]` },
  { keywords: ['conditional access', 'ca coverage', 'ca policy', 'access policy'],
    response: `**Conditional Access — Policy Status**\n\n📊 **25 policies enabled** | 5 disabled | 3 report-only mode\n🎯 **CA coverage:** 94.6% of sign-ins protected\n⚠️ **18 users explicitly excluded** from one or more policies\n\n**Key policies active:**\n- ✅ Require MFA — All Users (all cloud apps)\n- ✅ Require MFA — All Admins\n- ✅ Block Legacy Authentication\n- ✅ Require compliant device (with 12 exclusions)\n- ✅ Risk-based policy (High risk = block)\n\n**Risks:**\n- 18 CA exclusions should be reviewed quarterly\n- 3 policies in report-only may be masking gaps\n\n**Graph API:** GET /beta/identity/conditionalAccess/policies` },
]
