// ============================================================
// Request Priority Levels
// Allows users to mark requests as urgent
// ============================================================

export const PRIORITY_LEVELS = {
  'low': {
    label: 'Low',
    icon: 'ti-flag-off',
    color: '#808080',
    bg: '#F5F5F5',
    value: 1,
    description: 'Non-urgent, routine work'
  },
  'normal': {
    label: 'Normal',
    icon: 'ti-flag',
    color: '#0066CC',
    bg: '#E6F2FF',
    value: 2,
    description: 'Standard priority'
  },
  'high': {
    label: 'High',
    icon: 'ti-flag-2',
    color: '#FF9800',
    bg: '#FFF3E0',
    value: 3,
    description: 'Urgent, needed soon'
  },
  'critical': {
    label: 'Critical',
    icon: 'ti-alert-triangle',
    color: '#F44336',
    bg: '#FFEBEE',
    value: 4,
    description: 'Blocker, needs immediate attention'
  }
}

export function getPriorityLevel(priority) {
  return PRIORITY_LEVELS[priority] || PRIORITY_LEVELS['normal']
}

export function getAllPriorities() {
  return Object.entries(PRIORITY_LEVELS).map(([key, val]) => ({
    id: key,
    ...val
  }))
}

export function getPriorityIcon(priority) {
  const p = getPriorityLevel(priority)
  return p.icon
}

export function getPriorityColor(priority) {
  const p = getPriorityLevel(priority)
  return p.color
}
