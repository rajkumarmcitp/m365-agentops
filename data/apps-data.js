// ============================================================
// Entra Applications & App Registrations Management
// Graph API: GET /applications, GET /servicePrincipals,
//            GET /oauth2PermissionGrants, GET /auditLogs/signIns
// ============================================================

export const APPS_SUMMARY = {
  totalAppRegistrations: 87,
  totalEnterpriseApplications: 124,
  multiTenantApps: 12,
  highPrivilegeApps: 8,
  expiringSecrets30d: 5,
  expiringSecrets60d: 9,
  expiredSecrets: 2,
  certificateBasedApps: 18,
  unusedApps90d: 14,
  appsRequiringConsent: 3,
}

export const APP_REGISTRATIONS = [
  { id: 'app-001', name: 'HR Portal API', appId: '8f4c3d1e-2b5a-4f9e-8c2d-3a1b9f5e8c2d', objectId: 'obj-hr-001', created: '2024-03-15', owners: ['Aisha Raza'], audience: 'AzureADMyOrg', type: 'Web', status: 'active', category: 'Business' },
  { id: 'app-002', name: 'CRM Connector', appId: '9e5d4e2f-3c6b-5g0f-9d3e-4b2c0g6f9d3e', objectId: 'obj-crm-001', created: '2024-01-20', owners: ['Chen Wei', 'Priya Kumar'], audience: 'AzureADMultipleOrgs', type: 'Web', status: 'active', category: 'Production' },
  { id: 'app-003', name: 'Mobile Auth App', appId: '0f6e5f3g-4d7c-6h1g-0e4f-5c3d1h7g0e4f', objectId: 'obj-mobile-001', created: '2024-02-10', owners: ['Priya Kumar'], audience: 'AzureADMyOrg', type: 'Mobile/Desktop', status: 'active', category: 'Production' },
  { id: 'app-004', name: 'Test Integration', appId: '1g7f6g4h-5e8d-7i2h-1f5g-6d4e2i8h1f5g', objectId: 'obj-test-001', created: '2024-05-01', owners: ['Chen Wei'], audience: 'AzureADMyOrg', type: 'Web', status: 'active', category: 'Test' },
  { id: 'app-005', name: 'Legacy App (Orphaned)', appId: '2h8g7h5i-6f9e-8j3i-2g6h-7e5f3j9i2g6h', objectId: 'obj-legacy-001', created: '2022-11-05', owners: [], audience: 'AzureADMyOrg', type: 'Web', status: 'inactive', category: 'Production', risk: 'critical' },
  { id: 'app-006', name: 'Partner Integration', appId: '3i9h8i6j-7g0f-9k4j-3h7i-8f6g4k0j3h7i', objectId: 'obj-partner-001', created: '2023-08-22', owners: ['Aisha Raza'], audience: 'AzureADMultipleOrgs', type: 'Web', status: 'active', category: 'Business', risk: 'high' },
  { id: 'app-007', name: 'Finance Automation', appId: '4j0i9j7k-8h1g-0l5k-4i8j-9g7h5l1k4i8j', objectId: 'obj-finance-001', created: '2024-04-12', owners: ['Chen Wei', 'Aisha Raza', 'Priya Kumar'], audience: 'AzureADMyOrg', type: 'Web', status: 'active', category: 'Business' },
  { id: 'app-008', name: 'Inactive App', appId: '5k1j0k8l-9i2h-1m6l-5j9k-0h8i6m2l5j9k', objectId: 'obj-inactive-001', created: '2023-12-01', owners: ['Priya Kumar'], audience: 'AzureADMyOrg', type: 'Web', status: 'inactive', category: 'Test', lastSignIn: '2025-12-10', risk: 'medium' },
  { id: 'app-009', name: 'Compliance Bot', appId: '6l2k1l9m-0j3i-2n7m-6k0l-1i9j7n3m6k0l', objectId: 'obj-bot-001', created: '2024-06-05', owners: ['Aisha Raza'], audience: 'AzureADMyOrg', type: 'Web', status: 'active', category: 'Business' },
  { id: 'app-010', name: 'DataSync Engine', appId: '7m3l2m0n-1k4j-3o8n-7l1m-2j0k8o4n7l1m', objectId: 'obj-datasync-001', created: '2024-01-08', owners: ['Chen Wei'], audience: 'AzureADMyOrg', type: 'Web', status: 'active', category: 'Production' },
]

export const ENTERPRISE_APPLICATIONS = [
  { id: 'sp-001', name: 'Microsoft Office 365', publisher: 'Microsoft', category: 'Microsoft', usersAssigned: 1000, adminConsent: true, riskLevel: 'low', lastSignIn: 'Today', signInCount30d: 45000 },
  { id: 'sp-002', name: 'Microsoft Teams', publisher: 'Microsoft', category: 'Microsoft', usersAssigned: 950, adminConsent: true, riskLevel: 'low', lastSignIn: 'Today', signInCount30d: 28000 },
  { id: 'sp-003', name: 'Salesforce', publisher: 'Salesforce Inc.', category: 'SaaS', usersAssigned: 450, adminConsent: true, riskLevel: 'low', lastSignIn: 'Today', signInCount30d: 8500 },
  { id: 'sp-004', name: 'Slack', publisher: 'Slack Technologies', category: 'SaaS', usersAssigned: 620, adminConsent: true, riskLevel: 'low', lastSignIn: 'Today', signInCount30d: 12000 },
  { id: 'sp-005', name: 'Custom HR System', publisher: 'Internal', category: 'Custom', usersAssigned: 280, adminConsent: false, riskLevel: 'medium', lastSignIn: '2 days ago', signInCount30d: 1200 },
  { id: 'sp-006', name: 'ServiceNow', publisher: 'ServiceNow', category: 'SaaS', usersAssigned: 180, adminConsent: true, riskLevel: 'low', lastSignIn: 'Today', signInCount30d: 2800 },
  { id: 'sp-007', name: 'Okta Integration', publisher: 'Okta Inc.', category: 'SaaS', usersAssigned: 12, adminConsent: true, riskLevel: 'high', lastSignIn: '5 days ago', signInCount30d: 340 },
  { id: 'sp-008', name: 'Unused App (Archive)', publisher: 'External Vendor', category: 'SaaS', usersAssigned: 0, adminConsent: true, riskLevel: 'medium', lastSignIn: '180 days ago', signInCount30d: 0 },
]

export const SECRETS_CERTIFICATES = [
  { appName: 'HR Portal API', appId: 'app-001', secretId: 'sec-001', type: 'secret', expiryDate: '2026-06-15', daysRemaining: 13, status: 'expiring', created: '2024-06-15', rotation: 'Manual' },
  { appName: 'CRM Connector', appId: 'app-002', secretId: 'sec-002', type: 'certificate', expiryDate: '2026-12-20', daysRemaining: 202, status: 'healthy', created: '2024-12-20', rotation: 'Automatic' },
  { appName: 'Mobile Auth App', appId: 'app-003', secretId: 'sec-003', type: 'secret', expiryDate: '2026-05-30', daysRemaining: -2, status: 'expired', created: '2024-05-30', rotation: 'Manual' },
  { appName: 'Test Integration', appId: 'app-004', secretId: 'sec-004', type: 'secret', expiryDate: '2026-07-10', daysRemaining: 38, status: 'expiring', created: '2024-07-10', rotation: 'Manual' },
  { appName: 'Finance Automation', appId: 'app-007', secretId: 'sec-007', type: 'certificate', expiryDate: '2027-03-15', daysRemaining: 287, status: 'healthy', created: '2024-03-15', rotation: 'Automatic' },
  { appName: 'Compliance Bot', appId: 'app-009', secretId: 'sec-009', type: 'secret', expiryDate: '2026-06-01', daysRemaining: 0, status: 'expired', created: '2024-06-01', rotation: 'Manual' },
  { appName: 'DataSync Engine', appId: 'app-010', secretId: 'sec-010', type: 'secret', expiryDate: '2026-07-25', daysRemaining: 53, status: 'expiring', created: '2024-07-25', rotation: 'Manual' },
  { appName: 'Partner Integration', appId: 'app-006', secretId: 'sec-006', type: 'certificate', expiryDate: '2026-09-10', daysRemaining: 100, status: 'healthy', created: '2024-09-10', rotation: 'Automatic' },
]

export const API_PERMISSIONS = [
  { appName: 'HR Portal API', appId: 'app-001', permissions: ['User.Read.All', 'Mail.Read', 'Directory.Read.All'], riskLevel: 'high', requiredGrant: true },
  { appName: 'CRM Connector', appId: 'app-002', permissions: ['Directory.ReadWrite.All', 'User.ReadWrite.All'], riskLevel: 'critical', requiredGrant: true },
  { appName: 'Mobile Auth App', appId: 'app-003', permissions: ['User.Read', 'Mail.Read'], riskLevel: 'low', requiredGrant: false },
  { appName: 'Finance Automation', appId: 'app-007', permissions: ['Directory.ReadWrite.All', 'AppRoleAssignment.ReadWrite.All'], riskLevel: 'critical', requiredGrant: true },
  { appName: 'Compliance Bot', appId: 'app-009', permissions: ['Directory.Read.All', 'User.Read.All'], riskLevel: 'high', requiredGrant: true },
  { appName: 'Partner Integration', appId: 'app-006', permissions: ['User.Read', 'Directory.Read.All', 'Mail.ReadWrite'], riskLevel: 'high', requiredGrant: true },
]

export const ADMIN_CONSENTS = [
  { appName: 'CRM Connector', grantedBy: 'Aisha Raza', grantDate: '2024-01-22', permissions: 'Directory.ReadWrite.All, User.ReadWrite.All', scope: 'Tenant-wide', riskAlert: true },
  { appName: 'Finance Automation', grantedBy: 'Chen Wei', grantDate: '2024-04-15', permissions: 'Directory.ReadWrite.All, AppRoleAssignment.ReadWrite.All', scope: 'Tenant-wide', riskAlert: true },
  { appName: 'HR Portal API', grantedBy: 'Aisha Raza', grantDate: '2024-03-18', permissions: 'User.Read.All, Mail.Read, Directory.Read.All', scope: 'Tenant-wide', riskAlert: false },
  { appName: 'Partner Integration', grantedBy: 'Chen Wei', grantDate: '2023-08-25', permissions: 'User.Read, Directory.Read.All, Mail.ReadWrite', scope: 'Tenant-wide', riskAlert: true },
  { appName: 'Custom HR System', grantedBy: 'Priya Kumar', grantDate: '2024-05-10', permissions: 'Directory.Read.All', scope: 'User', riskAlert: false },
]

export const SIGN_IN_ANALYTICS = [
  { appName: 'HR Portal API', lastSignIn: '2 hours ago', signInCount30d: 3400, activeUsers30d: 280, failedSignins: 12, status: 'active' },
  { appName: 'CRM Connector', lastSignIn: '15 min ago', signInCount30d: 8900, activeUsers30d: 420, failedSignins: 45, status: 'active' },
  { appName: 'Mobile Auth App', lastSignIn: 'Yesterday', signInCount30d: 2100, activeUsers30d: 150, failedSignins: 8, status: 'active' },
  { appName: 'Inactive App', lastSignIn: '180 days ago', signInCount30d: 0, activeUsers30d: 0, failedSignins: 0, status: 'unused', riskLevel: 'medium' },
  { appName: 'Legacy App (Orphaned)', lastSignIn: '200 days ago', signInCount30d: 0, activeUsers30d: 0, failedSignins: 0, status: 'unused', riskLevel: 'critical' },
  { appName: 'Finance Automation', lastSignIn: '1 day ago', signInCount30d: 5600, activeUsers30d: 320, failedSignins: 78, status: 'active' },
  { appName: 'Test Integration', lastSignIn: '3 days ago', signInCount30d: 180, activeUsers30d: 8, failedSignins: 2, status: 'lowuse' },
]

export const RISK_ASSESSMENT = [
  { appName: 'CRM Connector', riskScore: 95, risks: ['Directory.ReadWrite.All', 'Admin Consent Granted', 'Multi-Tenant'], severity: 'critical' },
  { appName: 'Finance Automation', riskScore: 92, risks: ['AppRoleAssignment.ReadWrite.All', 'Directory.ReadWrite.All', 'Admin Consent'], severity: 'critical' },
  { appName: 'Partner Integration', riskScore: 78, risks: ['Multi-Tenant App', 'Admin Consent', 'External Publisher'], severity: 'high' },
  { appName: 'Legacy App (Orphaned)', riskScore: 85, risks: ['No Owner', 'Unused 200+ days', 'Expired Secret'], severity: 'critical' },
  { appName: 'HR Portal API', riskScore: 68, risks: ['Directory.Read.All', 'Admin Consent', 'Secret Expires in 13 days'], severity: 'high' },
  { appName: 'Inactive App', riskScore: 55, risks: ['Unused 180+ days', 'Single Owner'], severity: 'medium' },
  { appName: 'Mobile Auth App', riskScore: 28, risks: ['Secret Expired'], severity: 'low' },
  { appName: 'Okta Integration', riskScore: 72, risks: ['Admin Consent', 'Low Activity', 'External SaaS'], severity: 'high' },
]

export const APPS_RECOMMENDATIONS = [
  { id: 'rec-001', priority: 'critical', title: 'Remove expired secret from Mobile Auth App', app: 'Mobile Auth App', category: 'Secrets', effort: 'low' },
  { id: 'rec-002', priority: 'critical', title: 'Assign owner to Legacy App (Orphaned)', app: 'Legacy App (Orphaned)', category: 'Governance', effort: 'low' },
  { id: 'rec-003', priority: 'critical', title: 'Review Directory.ReadWrite.All permissions for CRM Connector', app: 'CRM Connector', category: 'Permissions', effort: 'medium' },
  { id: 'rec-004', priority: 'high', title: 'Rotate HR Portal API secret (expires in 13 days)', app: 'HR Portal API', category: 'Secrets', effort: 'low' },
  { id: 'rec-005', priority: 'high', title: 'Assign owner to Finance Automation (3 owners is excessive)', app: 'Finance Automation', category: 'Governance', effort: 'low' },
  { id: 'rec-006', priority: 'high', title: 'Decommission Inactive App (unused 180+ days)', app: 'Inactive App', category: 'Lifecycle', effort: 'medium' },
  { id: 'rec-007', priority: 'high', title: 'Reduce DataSync Engine secret expiry to every 90 days', app: 'DataSync Engine', category: 'Secrets', effort: 'medium' },
  { id: 'rec-008', priority: 'medium', title: 'Replace client secrets with Managed Identity (eligible apps)', app: 'Multiple', category: 'Architecture', effort: 'high' },
  { id: 'rec-009', priority: 'medium', title: 'Audit unused enterprise application (Archive app)', app: 'Unused App (Archive)', category: 'Lifecycle', effort: 'low' },
  { id: 'rec-010', priority: 'medium', title: 'Implement secret rotation automation', app: 'Multiple', category: 'Governance', effort: 'high' },
]

export const APPS_COPILOT_KB = [
  { keywords: ['expiring secret', 'secret expir', 'secret rotation', 'credential'],
    response: `**Application Secrets Expiring — Action Required**\n\n🔴 **Expired (immediate):**\n- Mobile Auth App: Secret expired 2 days ago\n- Compliance Bot: Secret expired TODAY\n\n🟠 **Expiring soon (<30 days):**\n- HR Portal API: 13 days remaining\n- Test Integration: 38 days remaining\n\n🟢 **Healthy (>60 days):**\n- Finance Automation: 287 days\n- Partner Integration: 100 days\n- CRM Connector: 202 days\n\n**Recommended actions:**\n1. Rotate expired secrets immediately\n2. Schedule rotation for HR Portal API this week\n3. Consider automatic certificate-based rotation\n4. Set calendar reminders for Test Integration (38d)\n\n→ Navigate to **Applications → Secret & Certificate Expiry** to see full list and rotation history.` },
  { keywords: ['directory.readwrite', 'high privilege', 'critical permission', 'readwrite'],
    response: `**High-Risk Applications — Directory.ReadWrite.All Permissions**\n\n🔴 **Critical (2 apps):**\n1. **CRM Connector** — Directory.ReadWrite.All + User.ReadWrite.All\n   - Risk Score: 95/100 (CRITICAL)\n   - Admin Consent: Tenant-wide\n   - Multi-Tenant: Yes (external access)\n   - Last Sign-in: 15 min ago\n   \n2. **Finance Automation** — Directory.ReadWrite.All + AppRoleAssignment.ReadWrite.All\n   - Risk Score: 92/100 (CRITICAL)\n   - Admin Consent: Tenant-wide\n   - Last Sign-in: 1 day ago\n\n**Immediate actions:**\n1. Review current permission usage for both apps\n2. Consider reducing to Directory.Read.All if possible\n3. Implement Conditional Access restrictions\n4. Monitor for anomalous activity\n\n→ **Applications → Permissions & Consent** to audit all grants.` },
  { keywords: ['application owner', 'no owner', 'owner assignment'],
    response: `**Applications Without Owners — Governance Risk**\n\n🔴 **Critical (1 app):**\n- **Legacy App (Orphaned)** — No owner assigned\n  - Created: Nov 2022 (18 months old)\n  - Last Sign-in: 200 days ago (UNUSED)\n  - Risk Score: 85/100 (CRITICAL)\n  - Action: Decommission or assign owner immediately\n\n**Multi-owner issue:**\n- Finance Automation has 3 owners (excessive)\n  - Recommend: 1 primary + 1 backup\n\n**Best practices:**\n1. Assign minimum 2 owners per app (primary + backup)\n2. Owners must be active employees\n3. Review ownership quarterly\n4. Automated alerts when owner leaves\n\n→ **Applications → Owners & Governance** for full audit.` },
  { keywords: ['unused application', 'no sign-in', 'inactive', '90 day'],
    response: `**Unused Applications (90+ days inactive)**\n\n🔴 **Critical for decommissioning (1 app):**\n- **Legacy App (Orphaned)** — 200+ days, no sign-ins, no owner\n  - Recommendation: Delete immediately\n\n🟡 **Consider archiving (2 apps):**\n1. **Inactive App** — 180 days no activity, 0 users assigned\n2. **Unused App (Archive)** — Never used in tenant, 0 sign-ins\n\n**Before decommissioning:**\n1. Notify app owners 30 days in advance\n2. Verify no scheduled jobs use the app\n3. Check for any OAuth token grants\n4. Export audit logs as archive\n\n→ **Applications → Lifecycle Management** to see decommission checklist.` },
  { keywords: ['multi-tenant', 'external', 'third party'],
    response: `**Multi-Tenant Applications — External Access Risk**\n\n📊 **Inventory:**\n- Total multi-tenant apps: 12\n- With admin consent: 4\n- High-risk: 2 (CRM Connector, Partner Integration)\n\n🔴 **Critical multi-tenant apps:**\n1. **CRM Connector** — Risk 95/100\n   - Directory.ReadWrite.All + User.ReadWrite.All\n   - Tenant-wide admin consent granted\n   \n2. **Partner Integration** — Risk 78/100\n   - Directory.Read.All + Mail.ReadWrite\n   - External publisher (Okta)\n\n**Security controls:**\n1. Require admin consent (already configured)\n2. Restrict to specific users/groups via CA\n3. Monitor for unusual activity\n4. Quarterly permission audit\n\n→ **Applications → Risk Assessment** for full risk scoring.` },
  { keywords: ['admin consent', 'tenant-wide', 'consent grant'],
    response: `**Admin Consent Grants — Tenant-Wide Permissions**\n\n📋 **Summary:**\n- Total consent grants: 5\n- Tenant-wide: 4\n- User-scoped: 1\n- High-risk: 2\n\n🔴 **High-risk tenant-wide grants:**\n1. **CRM Connector** — Directory.ReadWrite.All, User.ReadWrite.All\n   - Granted by: Aisha Raza (Jan 2024)\n   - Risk: CRITICAL — full directory modification\n   \n2. **Finance Automation** — Directory.ReadWrite.All, AppRoleAssignment.ReadWrite.All\n   - Granted by: Chen Wei (Apr 2024)\n   - Risk: CRITICAL — can assign admin roles\n\n**Governance:**\n- Tenant-wide consent should be rare\n- Review all grants quarterly\n- Consider user-scoped consent instead\n- Implement consent risk assessment workflow\n\n→ **Applications → Permissions & Consent** for consent audit trail.` },
  { keywords: ['risk assessment', 'risk score', 'high risk'],
    response: `**High-Risk Applications — Risk Scoring**\n\n📊 **Risk Distribution:**\n| Score | Count | Severity |\n|---|---|---|\n| 90+ | 2 | 🔴 Critical |\n| 70-89 | 3 | 🟠 High |\n| 50-69 | 2 | 🟡 Medium |\n| <50 | 2 | 🟢 Low |\n\n🔴 **Critical (2 apps):**\n1. CRM Connector — 95/100 (Directory.ReadWrite.All, admin consent, multi-tenant)\n2. Finance Automation — 92/100 (AppRoleAssignment.ReadWrite.All, admin consent)\n\n🟠 **High (3 apps):**\n1. Partner Integration — 78/100 (External, admin consent)\n2. Legacy App (Orphaned) — 85/100 (No owner, unused 200d)\n3. HR Portal API — 68/100 (Admin consent, expiring secret)\n\n**Risk factors:** Directory write perms, admin consent, multi-tenant, no owner, expired secrets, unused apps.\n\n→ **Applications → Risk Assessment** for detailed risk breakdown per app.` },
  { keywords: ['certificate', 'managed identity', 'secret rotation'],
    response: `**Application Credentials — Certificate vs Secret**\n\n📊 **Current State:**\n| Type | Count | Status |\n|---|---|---|\n| Secrets | 6 | 2 expired, 2 expiring |\n| Certificates | 2 | All healthy |\n| Managed Identity | 0 | Recommended! |\n\n✅ **Certificate-based apps (2):**\n- CRM Connector — Auto-rotated, 202 days remaining\n- Finance Automation — Auto-rotated, 287 days remaining\n\n❌ **Secret-based apps needing rotation:**\n- Mobile Auth App — EXPIRED (2 days ago)\n- Compliance Bot — EXPIRED (TODAY)\n- HR Portal API — Expires in 13 days\n- Test Integration — Expires in 38 days\n- DataSync Engine — Expires in 53 days\n\n**Recommendation:** Replace all secrets with certificates or Managed Identities where possible.\n\n→ **Applications → Secret & Certificate Expiry** for rotation roadmap.` },
]
