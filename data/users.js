export const USERS = [
  {
    id: 'demo',
    name: 'Demo Account',
    email: 'demo@contoso.com',
    role: 'admin',
    initials: 'DM',
    color: '#00C7B7',
    navAccess: [
      'dashboard', 'requests', 'security', 'tenantguard', 'tenantguard-enhanced', 'zerotrust', 'privaccts',
      'm365config', 'licenses', 'agents', 'approvals', 'msgcenter', 'applications', 'intune',
      'portal', 'myreqs', 'myaccount', 'chat', 'audit', 'settings'
    ],
    isDemoAccount: true,
  },
  {
    id: 'priya',
    name: 'Priya Kumar',
    email: 'priya@contoso.com',
    role: 'user',
    initials: 'PK',
    color: '#0C447C',
    navAccess: ['portal', 'myreqs', 'myaccount', 'chat'],
  },
  {
    id: 'sanjay',
    name: 'Sanjay Kumar',
    email: 'sanjay@contoso.com',
    role: 'manager',
    initials: 'SK',
    color: '#3C3489',
    navAccess: ['requests', 'msgcenter', 'portal', 'myreqs', 'myaccount', 'chat'],
    pendingApprovals: 3,
  },
  {
    id: 'chen',
    name: 'Chen Wei',
    email: 'chen@contoso.com',
    role: 'admin',
    initials: 'CW',
    color: '#633806',
    navAccess: [
      'dashboard', 'requests', 'security', 'tenantguard', 'tenantguard-enhanced', 'zerotrust', 'privaccts',
      'm365config', 'licenses', 'agents', 'approvals', 'msgcenter', 'applications', 'intune',
      'portal', 'myreqs', 'myaccount', 'chat',
      'audit', 'settings'
    ],
  },
  {
    id: 'aisha',
    name: 'Aisha Raza',
    email: 'aisha@contoso.com',
    role: 'super',
    initials: 'AR',
    color: '#791F1F',
    navAccess: [
      'dashboard', 'requests', 'security', 'tenantguard', 'tenantguard-enhanced', 'zerotrust', 'privaccts',
      'm365config', 'licenses', 'agents', 'approvals', 'msgcenter', 'applications', 'intune',
      'portal', 'myreqs', 'myaccount', 'chat',
      'audit', 'settings',
      'graphapi', 'sso'
    ],
  },
]
