// ============================================================
// Request Templates — Pre-built forms for common requests
// ============================================================

export const REQUEST_TEMPLATES = [
  // ============== EXCHANGE ==============
  {
    id: 'tmpl-m365-group-team',
    name: 'Create M365 Group (Team)',
    description: 'Quick setup for a team collaboration group',
    serviceId: 'exchange-groups',
    operationId: 'create-m365-group',
    category: 'Exchange',
    icon: 'ti-users-group',
    color: '#854F0B',
    estimatedTime: '2-3 days',
    popularity: 'Very Popular',
    tags: ['groups', 'collaboration', 'fast'],
    thumbnail: '👥',
    formDefaults: {
      privacy: 'Private',
      description: 'Team collaboration space',
    },
    helpText: 'Best for team projects, departments, or functional groups that need regular collaboration',
  },

  {
    id: 'tmpl-shared-mailbox-dept',
    name: 'Create Department Shared Mailbox',
    description: 'Shared inbox for department communications',
    serviceId: 'shared-mailbox',
    operationId: 'create-shared-mailbox',
    category: 'Exchange',
    icon: 'ti-mailbox',
    color: '#854F0B',
    estimatedTime: '1-2 days',
    popularity: 'Popular',
    tags: ['mailbox', 'department', 'shared'],
    thumbnail: '📧',
    formDefaults: {
      mailboxType: 'shared',
    },
    helpText: 'For departments needing a shared inbox (support, info, noreply, etc.)',
  },

  {
    id: 'tmpl-meeting-room',
    name: 'Create Meeting Room Mailbox',
    description: 'Room or equipment mailbox for scheduling',
    serviceId: 'room-equipment',
    operationId: 'create-room-mailbox',
    category: 'Exchange',
    icon: 'ti-building',
    color: '#854F0B',
    estimatedTime: '1-2 days',
    popularity: 'Popular',
    tags: ['room', 'resource', 'equipment'],
    thumbnail: '🏢',
    formDefaults: {
      roomType: 'MeetingRoom',
      capacity: '10',
    },
    helpText: 'Create a room or equipment mailbox for booking in Outlook',
  },

  // ============== TEAMS ==============
  {
    id: 'tmpl-teams-project',
    name: 'Create Teams Project Channel',
    description: 'New team for project collaboration',
    serviceId: 'teams',
    operationId: 'create-team',
    category: 'Teams',
    icon: 'ti-brand-teams',
    color: '#3C3489',
    estimatedTime: '1-2 days',
    popularity: 'Very Popular',
    tags: ['teams', 'project', 'collaboration'],
    thumbnail: '👨‍💼',
    formDefaults: {
      visibility: 'Private',
      type: 'standard',
    },
    helpText: 'Perfect for time-limited projects with defined teams',
  },

  {
    id: 'tmpl-teams-department',
    name: 'Create Department Team',
    description: 'Permanent team for department organization',
    serviceId: 'teams',
    operationId: 'create-team',
    category: 'Teams',
    icon: 'ti-brand-teams',
    color: '#3C3489',
    estimatedTime: '1-2 days',
    popularity: 'Popular',
    tags: ['teams', 'department', 'permanent'],
    thumbnail: '🏛️',
    formDefaults: {
      visibility: 'Private',
      type: 'standard',
      description: 'Department collaboration space',
    },
    helpText: 'For permanent department teams with multiple channels',
  },

  // ============== SHAREPOINT ==============
  {
    id: 'tmpl-sharepoint-project',
    name: 'Create Project Site',
    description: 'Document and project management site',
    serviceId: 'sharepoint',
    operationId: 'create-site',
    category: 'SharePoint',
    icon: 'ti-brand-sharepoint',
    color: '#3B6D11',
    estimatedTime: '1 day',
    popularity: 'Very Popular',
    tags: ['sharepoint', 'site', 'project'],
    thumbnail: '📄',
    formDefaults: {
      siteType: 'Team',
      classification: 'Internal',
    },
    helpText: 'For organizing project documents and collaboration',
  },

  {
    id: 'tmpl-sharepoint-document-library',
    name: 'Create Document Library',
    description: 'Centralized document repository',
    serviceId: 'sharepoint',
    operationId: 'create-library',
    category: 'SharePoint',
    icon: 'ti-brand-sharepoint',
    color: '#3B6D11',
    estimatedTime: '1 day',
    popularity: 'Popular',
    tags: ['sharepoint', 'documents', 'library'],
    thumbnail: '🗂️',
    formDefaults: {
      libraryType: 'Document',
      versioning: 'enabled',
    },
    helpText: 'For organizing and sharing business documents',
  },

  // ============== LICENSES ==============
  {
    id: 'tmpl-license-office365',
    name: 'Request Office 365 E5 License',
    description: 'Full Microsoft 365 with Copilot',
    serviceId: 'licenses',
    operationId: 'assign-license',
    category: 'Licenses',
    icon: 'ti-license',
    color: '#854F0B',
    estimatedTime: '1 day',
    popularity: 'Very Popular',
    tags: ['license', 'office365', 'e5'],
    thumbnail: '📊',
    formDefaults: {
      licenseType: 'Office 365 E5',
    },
    helpText: 'Full Microsoft 365 suite including Teams, SharePoint, and Copilot',
  },

  {
    id: 'tmpl-license-powerbi',
    name: 'Request Power BI License',
    description: 'Analytics and reporting license',
    serviceId: 'licenses',
    operationId: 'assign-license',
    category: 'Licenses',
    icon: 'ti-license',
    color: '#854F0B',
    estimatedTime: '1 day',
    popularity: 'Popular',
    tags: ['license', 'powerbi', 'analytics'],
    thumbnail: '📈',
    formDefaults: {
      licenseType: 'Power BI Pro',
    },
    helpText: 'For users needing advanced analytics and reporting',
  },

  // ============== ACCESS MANAGEMENT ==============
  {
    id: 'tmpl-access-sharepoint',
    name: 'Request SharePoint Access',
    description: 'Get access to existing SharePoint site',
    serviceId: 'user-access',
    operationId: 'request-access',
    category: 'Access',
    icon: 'ti-lock-access',
    color: '#185FA5',
    estimatedTime: '1-2 days',
    popularity: 'Very Popular',
    tags: ['access', 'sharepoint', 'permissions'],
    thumbnail: '🔐',
    formDefaults: {
      accessLevel: 'Contributor',
    },
    helpText: 'Request access to existing SharePoint sites and document libraries',
  },

  {
    id: 'tmpl-access-mailbox',
    name: 'Request Shared Mailbox Access',
    description: 'Get access to a shared mailbox',
    serviceId: 'user-access',
    operationId: 'request-access',
    category: 'Access',
    icon: 'ti-lock-access',
    color: '#185FA5',
    estimatedTime: '1-2 days',
    popularity: 'Popular',
    tags: ['access', 'mailbox', 'permissions'],
    thumbnail: '📮',
    formDefaults: {
      accessLevel: 'Contributor',
    },
    helpText: 'Request access to shared mailboxes for your role',
  },

  // ============== GUEST MANAGEMENT ==============
  {
    id: 'tmpl-guest-invite',
    name: 'Invite External Guest',
    description: 'Add external user to Teams/SharePoint',
    serviceId: 'guest-lifecycle',
    operationId: 'invite-guest',
    category: 'Guests',
    icon: 'ti-user-plus',
    color: '#633806',
    estimatedTime: '1-2 days',
    popularity: 'Very Popular',
    tags: ['guest', 'external', 'invite'],
    thumbnail: '👋',
    formDefaults: {
      accessType: 'Guest',
      expirationDays: '365',
    },
    helpText: 'Invite external partners or contractors to collaborate',
  },

  {
    id: 'tmpl-guest-extend',
    name: 'Extend Guest Access',
    description: 'Extend expiring guest access',
    serviceId: 'guest-lifecycle',
    operationId: 'extend-guest',
    category: 'Guests',
    icon: 'ti-user-plus',
    color: '#633806',
    estimatedTime: '1 day',
    popularity: 'Popular',
    tags: ['guest', 'extend', 'renewal'],
    thumbnail: '⏱️',
    formDefaults: {
      expirationDays: '365',
    },
    helpText: 'Extend access for guests whose accounts are about to expire',
  },

  // ============== INTUNE ==============
  {
    id: 'tmpl-device-retire',
    name: 'Retire Managed Device',
    description: 'Remove device from Intune management',
    serviceId: 'intune',
    operationId: 'retire-device',
    category: 'Intune',
    icon: 'ti-device-laptop',
    color: '#0C447C',
    estimatedTime: '1 day',
    popularity: 'Popular',
    tags: ['intune', 'device', 'retire'],
    thumbnail: '🖥️',
    formDefaults: {
      actionType: 'retire',
    },
    helpText: 'Retire devices no longer managed by your organization',
  },
]

// Get template by ID
export function getTemplate(templateId) {
  return REQUEST_TEMPLATES.find(t => t.id === templateId)
}

// Get all templates for a service
export function getTemplatesForService(serviceId) {
  return REQUEST_TEMPLATES.filter(t => t.serviceId === serviceId)
}

// Get templates by category
export function getTemplatesByCategory(category) {
  return REQUEST_TEMPLATES.filter(t => t.category === category)
}

// Get all unique categories
export function getTemplateCategories() {
  const categories = new Set(REQUEST_TEMPLATES.map(t => t.category))
  return Array.from(categories).sort()
}

// Search templates
export function searchTemplates(query) {
  const q = query.toLowerCase()
  return REQUEST_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q))
  )
}
