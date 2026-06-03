export const USERS = [
  {
    id: 'priya',
    name: 'Priya Kumar',
    email: 'priya@contoso.com',
    role: 'user',
    initials: 'PK',
    color: '#0C447C',
    navAccess: ['portal', 'myreqs', 'chat'],
  },
  {
    id: 'sanjay',
    name: 'Sanjay Kumar',
    email: 'sanjay@contoso.com',
    role: 'manager',
    initials: 'SK',
    color: '#3C3489',
    navAccess: ['approvals', 'portal', 'myreqs', 'chat'],
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
      'dashboard', 'requests', 'security', 'zerotrust', 'privaccts',
      'm365config', 'licenses', 'agents', 'msgcenter', 'applications', 'intune',
      'portal', 'myreqs', 'chat',
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
      'dashboard', 'requests', 'security', 'zerotrust', 'privaccts',
      'm365config', 'licenses', 'agents', 'msgcenter', 'applications', 'intune',
      'portal', 'myreqs', 'chat',
      'audit', 'settings',
      'graphapi', 'sso'
    ],
  },
]
