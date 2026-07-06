// My Account Page Data
// Real data will come from Graph API in Phase 5

export const USER_PROFILE = {
  displayName: 'Rajkumar Duraisami',
  upn: 'rajkumar.duraisami@contoso.com',
  email: 'rajkumar.duraisami@contoso.com',
  employeeId: 'EMP-2024-001',
  jobTitle: 'Cloud Solutions Architect',
  department: 'Cloud Engineering',
  manager: 'Sarah Johnson',
  lastSignIn: 'Today 08:45',
  accountStatus: 'Enabled',
  phone: '+1 (555) 123-4567',
  office: 'Seattle, WA',
  mobilePhone: '+1 (555) 987-6543'
}

export const SECURITY_DASHBOARD = {
  mfaStatus: 'Enabled',
  mfaDefaultMethod: 'Microsoft Authenticator',
  passwordLastChanged: '45 days ago',
  passwordExpiryDate: '15 days remaining',
  ssfrRegistration: 'Completed',
  riskLevel: 'Low',
  securityScore: 92,
  authenticationMethods: [
    { type: 'Password', status: 'Enabled' },
    { type: 'Microsoft Authenticator', status: 'Enabled', registered: true },
    { type: 'FIDO2 Security Key', status: 'Not registered' },
    { type: 'Phone Authentication', status: 'Enabled' },
    { type: 'Email OTP', status: 'Not registered' }
  ],
  riskDetections: [
    { type: 'Impossible Travel', status: 'No', lastDetected: null },
    { type: 'Anonymous IP', status: 'No', lastDetected: null },
    { type: 'Malware-linked IP', status: 'No', lastDetected: null },
    { type: 'Unfamiliar Sign-in', status: 'No', lastDetected: null }
  ]
}

export const SIGNIN_ACTIVITY = [
  { date: 'Today 08:45', app: 'Microsoft 365 Portal', device: 'Windows-Laptop', browser: 'Chrome', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
  { date: 'Yesterday 17:30', app: 'Teams', device: 'iPhone', browser: 'Safari', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
  { date: 'Yesterday 09:15', app: 'Exchange Online', device: 'Windows-Laptop', browser: 'Edge', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
  { date: '2 days ago 14:20', app: 'SharePoint', device: 'iPad', browser: 'Safari', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' },
  { date: '3 days ago 10:00', app: 'OneDrive', device: 'Windows-Laptop', browser: 'Chrome', location: 'Seattle, WA', ip: '203.0.113.45', result: 'Success' }
]

export const LICENSES = [
  { name: 'Microsoft 365 E5', sku: 'ENTERPRISEPREMIUM', assignmentType: 'Direct', assignmentSource: 'Admin' },
  { name: 'Enterprise Mobility + Security E5', sku: 'EMSPREMIUM', assignmentType: 'Direct', assignmentSource: 'Admin' },
  { name: 'Power BI Premium', sku: 'POWER_BI_PREMIUM_P1', assignmentType: 'Group', assignmentSource: 'Group License' },
  { name: 'Teams Phone Standard', sku: 'TEAMS_PHONE_STANDARD', assignmentType: 'Direct', assignmentSource: 'Admin' }
]

export const GROUP_MEMBERSHIPS = {
  securityGroups: [
    { name: 'Cloud Architects', type: 'Security', membershipType: 'Member' },
    { name: 'M365-Admins', type: 'Security', membershipType: 'Member' },
    { name: 'Security Review Board', type: 'Security', membershipType: 'Member' },
    { name: 'Global Readers', type: 'Security', membershipType: 'Member' }
  ],
  microsoft365Groups: [
    { name: 'Engineering Team', type: 'Microsoft 365', teamConnected: true, dynamicMembership: false },
    { name: 'Cloud Solutions Architects', type: 'Microsoft 365', teamConnected: true, dynamicMembership: true },
    { name: 'Product Innovation', type: 'Microsoft 365', teamConnected: false, dynamicMembership: false }
  ],
  distributionLists: [
    { name: 'Cloud-Engineering@contoso.com', type: 'Distribution List', membershipType: 'Member' },
    { name: 'Security-Team@contoso.com', type: 'Distribution List', membershipType: 'Owner' }
  ]
}

export const ONEDRIVE_INFO = {
  totalStorage: '1 TB',
  usedStorage: '420 GB',
  availableStorage: '580 GB',
  percentageUsed: 42,
  lastActivity: 'Today 08:45',
  fileCount: 2847,
  sharedItems: 156,
  externalShares: 12,
  anonymousLinks: 3
}

export const TEAMS_INFO = {
  teamsMembership: 12,
  teamsOwned: 3,
  guestAccessTeams: 2,
  teamsPhoneLicense: true,
  assignedNumber: '+1 (555) 123-7890',
  callingPlan: 'Domestic and International',
  teams: [
    { name: 'Engineering Team', role: 'Member', owner: 'Sarah Johnson' },
    { name: 'Cloud Architects', role: 'Owner', owner: 'Rajkumar Duraisami' },
    { name: 'Security Review Board', role: 'Member', owner: 'Chen Wei' },
    { name: 'Product Innovation', role: 'Owner', owner: 'Rajkumar Duraisami' },
    { name: 'Global Company', role: 'Member', owner: 'System' }
  ]
}

export const DEVICES = [
  { name: 'LAPTOP-RAJ-001', type: 'Windows', osVersion: '22H2', complianceStatus: 'Compliant', ownership: 'Corporate', lastCheckIn: 'Today', encryption: 'BitLocker Enabled', defender: 'Active' },
  { name: 'IPHONE-RAJ-001', type: 'iOS', osVersion: '17.5', complianceStatus: 'Compliant', ownership: 'Corporate', lastCheckIn: 'Today', encryption: 'Device Encrypted', defender: 'Enabled' },
  { name: 'IPAD-RAJ-001', type: 'iPadOS', osVersion: '17.5', complianceStatus: 'Compliant', ownership: 'BYOD', lastCheckIn: 'Yesterday', encryption: 'Device Encrypted', defender: 'Enabled' }
]

export const APP_ACCESS = [
  { name: 'Microsoft Teams', lastAccessed: 'Today 08:45', permissionScope: 'Full', riskLevel: 'Low' },
  { name: 'SharePoint Online', lastAccessed: 'Yesterday 14:20', permissionScope: 'Read/Write', riskLevel: 'Low' },
  { name: 'OneDrive for Business', lastAccessed: 'Today 10:15', permissionScope: 'Full', riskLevel: 'Low' },
  { name: 'Exchange Online', lastAccessed: 'Today 09:30', permissionScope: 'Full', riskLevel: 'Low' },
  { name: 'Power BI', lastAccessed: '2 days ago', permissionScope: 'Admin', riskLevel: 'Medium' },
  { name: 'Dynamics 365', lastAccessed: '5 days ago', permissionScope: 'Read/Write', riskLevel: 'Low' }
]

export const PENDING_APPROVALS = [
  { type: 'Group Membership Request', group: 'Data Governance Board', status: 'Pending', submittedDate: '2 days ago', description: 'Waiting for manager approval' },
  { type: 'Distribution List Request', list: 'Customer Success@contoso.com', status: 'Pending', submittedDate: '1 day ago', description: 'Awaiting IT approval' }
]

export const COPILOT_READINESS = {
  personalAIReadinessScore: 85,
  recommendations: [
    { title: 'Enable Microsoft Authenticator', impact: 'Improves security by 15%', priority: 'High', status: 'Recommended' },
    { title: 'Complete Security Awareness Training', impact: 'Unlocks advanced features', priority: 'High', status: 'Recommended' },
    { title: 'Review OneDrive Sharing Settings', impact: 'Improves data governance by 8%', priority: 'Medium', status: 'Recommended' },
    { title: 'Register FIDO2 Security Key', impact: 'Improves security by 20%', priority: 'Medium', status: 'Optional' }
  ],
  exchangeUsage: 78,
  teamsUsage: 92,
  oneDriveUsage: 42,
  sharePointUsage: 65
}

export const EXECUTIVE_SUMMARY = {
  securityScore: 92,
  mfaStatus: 'Enabled',
  riskLevel: 'Low',
  assignedLicenses: 4,
  devices: 3,
  groups: 18,
  teams: 12,
  mailboxUsage: 68,
  oneDriveUsage: 42,
  pendingRequests: 2
}

export const MYACCOUNT_COPILOT_KB = [
  { keywords: ['profile', 'account', 'information', 'details'], response: 'Your profile shows you are a Cloud Solutions Architect in the Cloud Engineering department, reporting to Sarah Johnson. Your account is fully compliant with security policies.' },
  { keywords: ['security', 'mfa', 'authentication', 'password'], response: 'Your security posture is excellent with MFA enabled via Microsoft Authenticator. Your password will expire in 15 days. Consider registering a FIDO2 security key for passwordless authentication.' },
  { keywords: ['sign', 'signin', 'login', 'activity'], response: 'Your sign-in activity over the last 30 days shows normal patterns with no suspicious activity detected. All signs-in were successful from expected locations and devices.' },
  { keywords: ['license', 'assigned', 'subscription'], response: 'You have 4 licenses assigned: Microsoft 365 E5 (your primary license), EMS E5, Power BI Premium, and Teams Phone Standard. All licenses are active and properly assigned.' },
  { keywords: ['group', 'membership', 'teams', 'distribution'], response: 'You are a member of 4 security groups and owner of 2 Microsoft 365 Teams. You have 12 total team memberships and 2 distribution list memberships, giving you broad collaboration capabilities.' },
  { keywords: ['device', 'compliance', 'encryption', 'security'], response: 'All 3 of your registered devices are compliant with security policies. Your Windows laptop and mobile devices all have encryption enabled and are actively managed.' },
  { keywords: ['storage', 'onedrive', 'quota', 'files'], response: 'You are using 420 GB out of your 1 TB OneDrive quota (42%). You have 2,847 files with 156 shared items. Consider archiving older files to maintain optimal performance.' },
  { keywords: ['app', 'application', 'access', 'permissions'], response: 'You have access to 6 enterprise applications with the most recent use being Teams today. All your application access levels are appropriate for your role and within security guidelines.' },
  { keywords: ['approval', 'request', 'pending'], response: 'You have 2 pending approval requests: one for the Data Governance Board (2 days old) and one for Customer Success distribution list (1 day old). Contact your manager to expedite if needed.' },
  { keywords: ['copilot', 'ai', 'readiness', 'recommendation'], response: 'Your Copilot readiness score is 85/100. Top recommendations: enable Microsoft Authenticator (+15% security) and complete security training. You are well-positioned to leverage AI-powered features.' }
]
