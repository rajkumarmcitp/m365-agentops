export const PA_ACCOUNTS = [
  { id: 'pa1',  upn: 'aisha.raza@contoso.com',    name: 'Aisha Raza',     bg: '#791F1F', roles: ['Global Admin', 'Security Admin'], mfa: ['FIDO2', 'Authenticator'], risk: 'None',   pim: true,  tagged: true,  isSPN: false },
  { id: 'pa2',  upn: 'chen.wei@contoso.com',       name: 'Chen Wei',       bg: '#633806', roles: ['Global Admin', 'Exchange Admin'], mfa: ['Authenticator'],          risk: 'None',   pim: true,  tagged: true,  isSPN: false },
  { id: 'pa3',  upn: 'kevin.osei@contoso.com',     name: 'Kevin Osei',     bg: '#0C447C', roles: ['Exchange Admin'],                 mfa: ['Authenticator'],          risk: 'High',   pim: true,  tagged: false, isSPN: false },
  { id: 'pa4',  upn: 'nina.patel@contoso.com',     name: 'Nina Patel',     bg: '#3C3489', roles: ['Teams Admin'],                    mfa: ['SMS'],                    risk: 'High',   pim: false, tagged: false, isSPN: false },
  { id: 'pa5',  upn: 'tom.brooks@contoso.com',     name: 'Tom Brooks',     bg: '#4A6741', roles: ['Power Platform Admin'],           mfa: [],                         risk: 'None',   pim: false, tagged: false, isSPN: false },
  { id: 'pa6',  upn: 'dev.bot@contoso.com',        name: 'Dev Bot (SPN)',  bg: '#5a5a5a', roles: ['Application Admin'],              mfa: [],                         risk: 'None',   pim: false, tagged: false, isSPN: true  },
  { id: 'pa7',  upn: 'james.liu@contoso.com',      name: 'James Liu',      bg: '#4B3B8C', roles: ['SharePoint Admin'],              mfa: ['Authenticator'],          risk: 'None',   pim: true,  tagged: true,  isSPN: false },
  { id: 'pa8',  upn: 'sara.ogden@contoso.com',     name: 'Sara Ogden',     bg: '#6B3C4A', roles: ['User Admin'],                     mfa: ['Authenticator'],          risk: 'Medium', pim: false, tagged: false, isSPN: false },
  { id: 'pa9',  upn: 'raj.mehta@contoso.com',      name: 'Raj Mehta',      bg: '#2C5F6A', roles: ['Helpdesk Admin'],                 mfa: ['Authenticator'],          risk: 'None',   pim: false, tagged: false, isSPN: false },
  { id: 'pa10', upn: 'lucy.chan@contoso.com',       name: 'Lucy Chan',      bg: '#7A4E2D', roles: ['Billing Admin'],                  mfa: ['Authenticator'],          risk: 'Medium', pim: false, tagged: false, isSPN: false },
  { id: 'pa11', upn: 'sam.torres@contoso.com',     name: 'Sam Torres',     bg: '#1F5C47', roles: ['Compliance Admin'],               mfa: ['Authenticator', 'FIDO2'], risk: 'None',   pim: true,  tagged: true,  isSPN: false },
  { id: 'pa12', upn: 'backup.admin@contoso.com',   name: 'Backup Admin',   bg: '#555555', roles: ['Global Admin'],                   mfa: ['Authenticator'],          risk: 'None',   pim: true,  tagged: true,  isSPN: false },
  { id: 'pa13', upn: 'reporting.svc@contoso.com',  name: 'Reporting SVC',  bg: '#5a5a5a', roles: ['Reports Reader'],                 mfa: [],                         risk: 'None',   pim: false, tagged: false, isSPN: true  },
  { id: 'pa14', upn: 'intune.admin@contoso.com',   name: 'Intune Admin',   bg: '#3B6D11', roles: ['Intune Admin'],                   mfa: ['Authenticator'],          risk: 'None',   pim: false, tagged: false, isSPN: false },
]

export const PA_GROUPS = [
  { id: 'pg1', name: 'Global Administrators',       roles: ['Global Admin'],             members: 2, pim: true,  pimType: 'Eligible', lastActivity: '2 hours ago',     ml: ['aisha.raza@contoso.com', 'chen.wei@contoso.com'] },
  { id: 'pg2', name: 'Security Admins',             roles: ['Security Admin'],           members: 2, pim: true,  pimType: 'Eligible', lastActivity: '1 day ago',       ml: ['aisha.raza@contoso.com', 'sam.torres@contoso.com'] },
  { id: 'pg3', name: 'Exchange Admins',             roles: ['Exchange Admin'],           members: 2, pim: true,  pimType: 'Active',   lastActivity: '3 days ago',      ml: ['chen.wei@contoso.com', 'kevin.osei@contoso.com'] },
  { id: 'pg4', name: 'SharePoint Admins',           roles: ['SharePoint Admin'],         members: 1, pim: false, pimType: null,       lastActivity: '5 days ago',      ml: ['james.liu@contoso.com'] },
  { id: 'pg5', name: 'Teams Admins',                roles: ['Teams Admin'],              members: 1, pim: false, pimType: null,       lastActivity: '1 week ago',      ml: ['nina.patel@contoso.com'] },
  { id: 'pg6', name: 'Helpdesk Admins',             roles: ['Helpdesk Admin', 'User Admin'], members: 2, pim: false, pimType: null,   lastActivity: '1 day ago',       ml: ['raj.mehta@contoso.com', 'sara.ogden@contoso.com'] },
  { id: 'pg7', name: 'Compliance Admins',           roles: ['Compliance Admin'],         members: 1, pim: true,  pimType: 'Eligible', lastActivity: '4 days ago',      ml: ['sam.torres@contoso.com'] },
  { id: 'pg8', name: 'Break Glass Accounts',        roles: ['Global Admin'],             members: 2, pim: true,  pimType: 'Active',   lastActivity: '30 days ago',     ml: ['aisha.raza@contoso.com', 'backup.admin@contoso.com'] },
]

export const PA_LOG = [
  { id: 'l1',  type: 'add',     icls: 'ti-user-plus',   ic: 'var(--clr-info-text)',    bg: 'var(--clr-info-bg)',    title: 'Role assignment added',       detail: 'aisha.raza assigned Global Admin via PIM',         by: 'System',       time: '2 min ago' },
  { id: 'l2',  type: 'risk',    icls: 'ti-alert-triangle', ic: 'var(--clr-danger-text)', bg: 'var(--clr-danger-bg)', title: 'Risk detected',               detail: 'kevin.osei — High risk sign-in from unknown location', by: 'Entra ID',   time: '14 min ago' },
  { id: 'l3',  type: 'remove',  icls: 'ti-user-minus',  ic: 'var(--clr-warning-text)', bg: 'var(--clr-warning-bg)', title: 'Member removed from group',   detail: 'sara.ogden removed from Helpdesk Admins',          by: 'Chen Wei',     time: '1 hour ago' },
  { id: 'l4',  type: 'add',     icls: 'ti-user-plus',   ic: 'var(--clr-info-text)',    bg: 'var(--clr-info-bg)',    title: 'PIM role activated',          detail: 'sam.torres activated Compliance Admin for 8 hours', by: 'Sam Torres',   time: '3 hours ago' },
  { id: 'l5',  type: 'remove',  icls: 'ti-user-minus',  ic: 'var(--clr-warning-text)', bg: 'var(--clr-warning-bg)', title: 'PIM role deactivated',        detail: 'chen.wei deactivated Exchange Admin role',         by: 'Chen Wei',     time: '5 hours ago' },
  { id: 'l6',  type: 'mfa',     icls: 'ti-shield',      ic: 'var(--clr-success-text)', bg: 'var(--clr-success-bg)', title: 'MFA method registered',       detail: 'tom.brooks enrolled Authenticator app',            by: 'Tom Brooks',   time: '7 hours ago' },
  { id: 'l7',  type: 'tag',     icls: 'ti-tag',         ic: 'var(--clr-info-text)',    bg: 'var(--clr-info-bg)',    title: 'Account tagged as privileged', detail: 'james.liu tagged as SharePoint Admin',            by: 'Aisha Raza',   time: 'Yesterday' },
  { id: 'l8',  type: 'risk',    icls: 'ti-alert-triangle', ic: 'var(--clr-danger-text)', bg: 'var(--clr-danger-bg)', title: 'Risk detected',               detail: 'nina.patel — High risk user detection',            by: 'Entra ID',     time: 'Yesterday' },
  { id: 'l9',  type: 'add',     icls: 'ti-user-plus',   ic: 'var(--clr-info-text)',    bg: 'var(--clr-info-bg)',    title: 'New admin account created',   detail: 'intune.admin created with Intune Admin role',      by: 'Aisha Raza',   time: '2 days ago' },
  { id: 'l10', type: 'review',  icls: 'ti-clipboard-check', ic: 'var(--clr-success-text)', bg: 'var(--clr-success-bg)', title: 'Access review completed',   detail: 'Q1 review — Global Admins. 0 removed.',           by: 'Aisha Raza',   time: '3 days ago' },
  { id: 'l11', type: 'add',     icls: 'ti-key',         ic: 'var(--clr-warning-text)', bg: 'var(--clr-warning-bg)', title: 'Break glass account used',    detail: 'backup.admin signed in — emergency access',       by: 'backup.admin', time: '30 days ago' },
  { id: 'l12', type: 'remove',  icls: 'ti-user-minus',  ic: 'var(--clr-warning-text)', bg: 'var(--clr-warning-bg)', title: 'Role removed',                detail: 'lucy.chan removed from Exchange Admins',           by: 'Chen Wei',     time: '35 days ago' },
]
