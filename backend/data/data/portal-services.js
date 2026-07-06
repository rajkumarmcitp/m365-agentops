// ============================================================
// Portal Service Catalog — 11 services, 60+ operations
// ============================================================

export const WORKFLOW_STEPS = [
  { id: 'submit',    label: 'Request Submitted',   icon: 'ti-send',          color: 'info' },
  { id: 'manager',   label: 'Manager Approval',     icon: 'ti-user-check',    color: 'warning' },
  { id: 'dataowner', label: 'Data Owner Approval',  icon: 'ti-shield-check',  color: 'purple' },
  { id: 'it',        label: 'IT Review',            icon: 'ti-settings',      color: 'warning' },
  { id: 'agent',     label: 'AI Agent Validation',  icon: 'ti-robot',         color: 'teal' },
  { id: 'action',    label: 'System Provisioning',  icon: 'ti-api',           color: 'info' },
  { id: 'done',      label: 'Completion',           icon: 'ti-circle-check',  color: 'success' },
]

// Top-level service groups (the 11 tiles)
export const SERVICE_GROUPS = [
  { id: 'exchange',        name: 'Exchange Online',          icon: 'ti-mail',             color: '#854F0B', bg: '#FAEEDA', desc: 'Groups, shared mailboxes, room resources, and email settings', badge: '4 services' },
  { id: 'teams',           name: 'Microsoft Teams',          icon: 'ti-brand-teams',      color: '#3C3489', bg: '#EEEDFE', desc: 'Create teams, manage members, channels, and guest access', badge: '5 actions' },
  { id: 'sharepoint',      name: 'SharePoint Services',      icon: 'ti-brand-sharepoint', color: '#3B6D11', bg: '#EAF3DE', desc: 'Sites, permissions, external sharing, and storage management', badge: '6 actions' },
  { id: 'onedrive',        name: 'OneDrive Administration',  icon: 'ti-cloud',            color: '#0C447C', bg: '#E6F1FB', desc: 'Storage increases and former employee OneDrive access', badge: '2 actions' },
  { id: 'ext-sharing',     name: 'External Sharing',         icon: 'ti-world',            color: '#791F1F', bg: '#FCEBEB', desc: 'Invite, extend, or remove external guest access', badge: '4 actions' },
  { id: 'user-access',     name: 'User Access Management',   icon: 'ti-lock-access',      color: '#185FA5', bg: '#E6F1FB', desc: 'Request access to mailboxes, Teams, SharePoint and groups', badge: '5 actions' },
  { id: 'licenses',        name: 'License Management',       icon: 'ti-license',          color: '#854F0B', bg: '#FAEEDA', desc: 'Request Microsoft 365, Power BI, Visio, Project, and Copilot licenses', badge: '8 licenses' },
  { id: 'power-platform',  name: 'Power Platform',           icon: 'ti-bolt',             color: '#3B6D11', bg: '#EAF3DE', desc: 'Environments, premium connectors, DLP exceptions', badge: '4 actions' },
  { id: 'intune',          name: 'Intune Services',          icon: 'ti-device-laptop',    color: '#0C447C', bg: '#E6F1FB', desc: 'Device retirement, wipe, and compliance exceptions', badge: '3 actions' },
  { id: 'guest-lifecycle', name: 'Guest User Lifecycle',     icon: 'ti-user-plus',        color: '#633806', bg: '#FAEEDA', desc: 'Invite guests, extend or remove access, quarterly reviews', badge: '4 actions' },
]

// ---- Exchange Online sub-service panels ----
export const EXCHANGE_SUB = [
  { id: 'exchange-groups',   name: 'Distribution & Security Groups', icon: 'ti-users-group',  desc: 'M365 Groups, Distribution Groups, Security Groups' },
  { id: 'shared-mailbox',    name: 'Shared Mailboxes',               icon: 'ti-mailbox',       desc: 'Create, delete, and manage shared mailbox permissions' },
  { id: 'room-equipment',    name: 'Room & Equipment Mailboxes',     icon: 'ti-building',      desc: 'Meeting rooms, equipment resources, booking policies' },
  { id: 'email-services',    name: 'Email Services',                 icon: 'ti-mail-forward',  desc: 'SMTP addresses, mail forwarding, auto-reply configuration' },
]

// ============================================================
// Service Catalog — operations per service
// approvalPath: array of step IDs from WORKFLOW_STEPS (excluding submit/agent/action/done)
// ============================================================
export const SERVICE_CATALOG = {

  // ==============  EXCHANGE — GROUPS  ==============
  'exchange-groups': {
    parentGroup: 'exchange',
    operations: [
      // — M365 Groups —
      {
        id: 'create-m365-group', group: 'Microsoft 365 Groups', label: 'Create M365 Group',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check for duplicate group names', 'Suggest existing groups with similar purpose', 'Validate naming convention', 'Verify requestor eligibility'],
        systemAction: 'POST /v1.0/groups (groupTypes: Unified)',
        fields: [
          { id: 'displayName',  label: 'Display Name',          type: 'text',     required: true,  placeholder: 'e.g. Marketing EMEA' },
          { id: 'alias',        label: 'Email Alias',           type: 'text',     required: true,  placeholder: 'marketing-emea', hint: '@contoso.com appended automatically' },
          { id: 'privacy',      label: 'Privacy',               type: 'select',   required: true,  options: ['Private', 'Public'] },
          { id: 'members',      label: 'Initial Members',       type: 'text',     required: false, placeholder: 'user1@contoso.com, user2@contoso.com', hint: 'Comma-separated UPNs' },
          { id: 'description',  label: 'Group Description',     type: 'textarea', required: false, placeholder: 'Purpose of this group...' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true,  placeholder: 'Why is this group needed?' },
        ],
      },
      {
        id: 'add-m365-members', group: 'Microsoft 365 Groups', label: 'Add Members to M365 Group',
        approvalPath: ['manager'],
        agentChecks: ['Verify group exists', 'Check member licensing', 'Validate UPNs'],
        systemAction: 'POST /v1.0/groups/{id}/members/$ref',
        fields: [
          { id: 'groupName',    label: 'Group Name / Email',    type: 'text',     required: true,  placeholder: 'Search for group...', hint: 'Type to search M365 Groups' },
          { id: 'members',      label: 'Members to Add',        type: 'text',     required: true,  placeholder: 'user1@contoso.com, user2@contoso.com', hint: 'Comma-separated UPNs or search for users' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true,  placeholder: 'Why do these users need to join?' },
        ],
      },
      {
        id: 'remove-m365-members', group: 'Microsoft 365 Groups', label: 'Remove Members from M365 Group',
        approvalPath: ['manager'],
        agentChecks: ['Verify group membership', 'Check if member is owner'],
        systemAction: 'DELETE /v1.0/groups/{id}/members/{userId}/$ref',
        fields: [
          { id: 'groupName',    label: 'Group Name / Email',    type: 'text',     required: true,  placeholder: 'Search for group...', hint: 'Type to search M365 Groups' },
          { id: 'members',      label: 'Members to Remove',     type: 'text',     required: true,  placeholder: 'user1@contoso.com, user2@contoso.com', hint: 'Comma-separated UPNs or search for users' },
          { id: 'justification',label: 'Reason',                type: 'textarea', required: true,  placeholder: 'Why are these members being removed?' },
        ],
      },
      {
        id: 'archive-m365-group', group: 'Microsoft 365 Groups', label: 'Archive M365 Group',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check last activity date', 'Identify active owners', 'Verify no active workflows depend on group'],
        systemAction: 'PATCH /v1.0/groups/{id} (visibility: archived)',
        fields: [
          { id: 'groupName',    label: 'Group Name / Email',    type: 'text',     required: true },
          { id: 'archiveDate',  label: 'Archive By Date',       type: 'date',     required: false },
          { id: 'dataRetention',label: 'Data Retention Period', type: 'select',   required: true, options: ['30 days', '90 days', '180 days', '1 year', 'Indefinite'] },
          { id: 'justification',label: 'Reason for Archiving',  type: 'textarea', required: true },
        ],
      },
      // — Distribution Groups —
      {
        id: 'create-dg', group: 'Distribution Groups', label: 'Create Distribution Group',
        approvalPath: ['manager'],
        agentChecks: ['Duplicate DG check', 'Naming convention validation', 'Suggest existing DGs'],
        systemAction: 'New-DistributionGroup via Exchange PowerShell',
        fields: [
          { id: 'displayName',  label: 'Display Name',          type: 'text',     required: true,  placeholder: 'e.g. All Staff UK' },
          { id: 'alias',        label: 'Email Alias',           type: 'text',     required: true,  placeholder: 'all-staff-uk' },
          { id: 'members',      label: 'Initial Members',       type: 'text',     required: false, placeholder: 'Comma-separated UPNs' },
          { id: 'managedBy',    label: 'Managed By (Owner)',    type: 'text',     required: false, placeholder: 'UPN of owner' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'modify-dg', group: 'Distribution Groups', label: 'Rename / Modify Distribution Group',
        approvalPath: ['manager'],
        agentChecks: ['Verify group ownership', 'Check for email references to current name'],
        systemAction: 'Set-DistributionGroup via Exchange PowerShell',
        fields: [
          { id: 'currentName',  label: 'Current Group Name',    type: 'text',     required: true },
          { id: 'newName',      label: 'New Display Name',      type: 'text',     required: false, placeholder: 'Leave blank if not changing' },
          { id: 'newAlias',     label: 'New Email Alias',       type: 'text',     required: false, placeholder: 'Leave blank if not changing' },
          { id: 'changeOwner',  label: 'New Owner UPN',         type: 'text',     required: false },
          { id: 'justification',label: 'Reason for Change',     type: 'textarea', required: true },
        ],
      },
      {
        id: 'delete-dg', group: 'Distribution Groups', label: 'Delete Distribution Group',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check group usage in mail flow rules', 'Identify group members', 'Check email references in other systems'],
        systemAction: 'Remove-DistributionGroup via Exchange PowerShell',
        fields: [
          { id: 'groupName',    label: 'Group Name / Email',    type: 'text',     required: true },
          { id: 'confirmation', label: 'Type group name to confirm deletion', type: 'text', required: true, placeholder: 'Must match exactly' },
          { id: 'justification',label: 'Reason for Deletion',   type: 'textarea', required: true },
        ],
      },
      // — Security Groups —
      {
        id: 'create-sg', group: 'Security Groups', label: 'Create Security Group',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Duplicate check', 'Naming convention', 'Suggest existing groups', 'Review intended resource access'],
        systemAction: 'POST /v1.0/groups (securityEnabled: true)',
        fields: [
          { id: 'displayName',  label: 'Display Name',          type: 'text',     required: true,  placeholder: 'e.g. SG-Finance-ReadOnly' },
          { id: 'purpose',      label: 'Purpose / Resource',    type: 'text',     required: true,  placeholder: 'What resource will this secure?' },
          { id: 'members',      label: 'Initial Members',       type: 'text',     required: false, placeholder: 'Comma-separated UPNs' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'manage-sg-members', group: 'Security Groups', label: 'Add / Remove Security Group Members',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Verify requester is group owner', 'Check member eligibility', 'Validate access to secured resource'],
        systemAction: 'POST/DELETE /v1.0/groups/{id}/members/$ref',
        fields: [
          { id: 'groupName',    label: 'Security Group Name',   type: 'text',     required: true },
          { id: 'action',       label: 'Action',                type: 'select',   required: true,  options: ['Add members', 'Remove members'] },
          { id: 'members',      label: 'Members (UPNs)',        type: 'textarea', required: true,  placeholder: 'One UPN per line' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
    ],
  },

  // ==============  EXCHANGE — SHARED MAILBOX  ==============
  'shared-mailbox': {
    parentGroup: 'exchange',
    operations: [
      {
        id: 'create-shared-mb', group: 'Create / Delete', label: 'Create Shared Mailbox',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Duplicate mailbox check', 'License availability', 'Naming convention', 'Verify owner details'],
        systemAction: 'New-Mailbox -Shared via Exchange PowerShell',
        fields: [
          { id: 'displayName',  label: 'Display Name',          type: 'text',     required: true,  placeholder: 'e.g. HR Department' },
          { id: 'alias',        label: 'Email Alias',           type: 'text',     required: true,  placeholder: 'hr@contoso.com' },
          { id: 'fullAccess',   label: 'Full Access Users',     type: 'text',     required: false, placeholder: 'UPNs comma-separated' },
          { id: 'sendAs',       label: 'Send As Users',         type: 'text',     required: false, placeholder: 'UPNs comma-separated' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'delete-shared-mb', group: 'Create / Delete', label: 'Delete Shared Mailbox',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check mailbox usage in last 90 days', 'Identify users with permissions', 'Check mail flow dependencies'],
        systemAction: 'Remove-Mailbox via Exchange PowerShell',
        fields: [
          { id: 'mailboxEmail', label: 'Mailbox Email Address', type: 'email',    required: true },
          { id: 'dataAction',   label: 'Data Disposition',      type: 'select',   required: true,  options: ['Export then delete', 'Retain for 90 days', 'Immediate deletion'] },
          { id: 'justification',label: 'Reason for Deletion',   type: 'textarea', required: true },
        ],
      },
      {
        id: 'mb-permissions', group: 'Permissions', label: 'Modify Mailbox Permissions',
        approvalPath: ['manager'],
        agentChecks: ['Verify mailbox exists', 'Validate user licensing', 'Check current permission state'],
        systemAction: 'Add/Remove-MailboxPermission via Exchange PowerShell',
        fields: [
          { id: 'mailboxEmail', label: 'Mailbox Email Address', type: 'email',    required: true },
          { id: 'permType',     label: 'Permission Type',       type: 'select',   required: true,  options: ['Full Access', 'Send As', 'Send on Behalf'] },
          { id: 'action',       label: 'Action',                type: 'select',   required: true,  options: ['Add permission', 'Remove permission'] },
          { id: 'users',        label: 'Users (UPNs)',          type: 'textarea', required: true,  placeholder: 'One UPN per line' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
    ],
  },

  // ==============  EXCHANGE — ROOM & EQUIPMENT  ==============
  'room-equipment': {
    parentGroup: 'exchange',
    operations: [
      {
        id: 'create-room', group: 'Create', label: 'Create Room Mailbox',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check for duplicate room names', 'Validate capacity settings', 'Verify location exists in directory'],
        systemAction: 'New-Mailbox -Room via Exchange PowerShell',
        fields: [
          { id: 'displayName',  label: 'Room Name',             type: 'text',     required: true,  placeholder: 'e.g. London — Boardroom A' },
          { id: 'alias',        label: 'Email Alias',           type: 'text',     required: true,  placeholder: 'london-boardroom-a' },
          { id: 'capacity',     label: 'Capacity (persons)',    type: 'text',     required: true,  placeholder: '12' },
          { id: 'location',     label: 'Building / Floor',      type: 'text',     required: false, placeholder: 'e.g. 1 Canada Square, Floor 4' },
          { id: 'autoAccept',   label: 'Auto-accept bookings',  type: 'select',   required: true,  options: ['Auto-accept all', 'Require approval', 'Manual only'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'create-equipment', group: 'Create', label: 'Create Equipment Mailbox',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Duplicate equipment name check', 'Validate equipment type'],
        systemAction: 'New-Mailbox -Equipment via Exchange PowerShell',
        fields: [
          { id: 'displayName',  label: 'Equipment Name',        type: 'text',     required: true,  placeholder: 'e.g. Projector — Floor 3' },
          { id: 'alias',        label: 'Email Alias',           type: 'text',     required: true },
          { id: 'equipType',    label: 'Equipment Type',        type: 'select',   required: true,  options: ['Projector', 'Video conferencing unit', 'Laptop pool', 'Car/Fleet', 'Other'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'modify-booking', group: 'Modify', label: 'Modify Booking Policy',
        approvalPath: ['manager'],
        agentChecks: ['Verify resource exists', 'Check current booking conflicts'],
        systemAction: 'Set-CalendarProcessing via Exchange PowerShell',
        fields: [
          { id: 'resourceEmail',label: 'Resource Email',        type: 'email',    required: true },
          { id: 'autoAccept',   label: 'Auto-accept policy',    type: 'select',   required: false, options: ['Auto-accept all', 'Require approval', 'Manual only'] },
          { id: 'maxDuration',  label: 'Max booking duration',  type: 'select',   required: false, options: ['1 hour', '2 hours', '4 hours', '8 hours', '1 day', 'Unlimited'] },
          { id: 'bookingWindow',label: 'Advance booking window',type: 'select',   required: false, options: ['1 week', '2 weeks', '1 month', '3 months', '6 months'] },
          { id: 'justification',label: 'Reason for Change',     type: 'textarea', required: true },
        ],
      },
      {
        id: 'add-delegate', group: 'Modify', label: 'Add Room/Equipment Delegate',
        approvalPath: ['manager'],
        agentChecks: ['Verify resource exists', 'Verify delegate licensing'],
        systemAction: 'Set-CalendarProcessing -ResourceDelegates',
        fields: [
          { id: 'resourceEmail',label: 'Resource Email',        type: 'email',    required: true },
          { id: 'delegates',    label: 'Delegate UPNs',         type: 'text',     required: true,  placeholder: 'Comma-separated UPNs' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'delete-resource', group: 'Delete', label: 'Remove Room / Equipment Mailbox',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check for future bookings', 'Identify delegates', 'Cancel existing calendar entries'],
        systemAction: 'Remove-Mailbox via Exchange PowerShell',
        fields: [
          { id: 'resourceEmail',label: 'Resource Email',        type: 'email',    required: true },
          { id: 'deleteDate',   label: 'Removal Date',          type: 'date',     required: false, hint: 'Leave blank for immediate removal' },
          { id: 'justification',label: 'Reason for Removal',    type: 'textarea', required: true },
        ],
      },
    ],
  },

  // ==============  EXCHANGE — EMAIL SERVICES  ==============
  'email-services': {
    parentGroup: 'exchange',
    operations: [
      {
        id: 'smtp-change', group: 'Email Configuration', label: 'SMTP Address Change',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Verify mailbox ownership', 'Check SMTP address availability', 'Check for email references in other systems'],
        systemAction: 'Set-Mailbox -EmailAddresses via Exchange PowerShell',
        fields: [
          { id: 'mailboxUpn',   label: 'Mailbox UPN',           type: 'email',    required: true },
          { id: 'newSmtp',      label: 'New Primary SMTP',      type: 'email',    required: true,  hint: 'New primary email address' },
          { id: 'keepOld',      label: 'Retain old address as alias', type: 'select', required: true, options: ['Yes — keep as alias', 'No — remove old address'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'mail-forwarding', group: 'Email Configuration', label: 'Configure Mail Forwarding',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check for external forwarding policy', 'Verify destination address', 'Flag if forwarding to external domain'],
        systemAction: 'Set-Mailbox -ForwardingSmtpAddress via Exchange PowerShell',
        fields: [
          { id: 'mailboxUpn',   label: 'Mailbox UPN',           type: 'email',    required: true },
          { id: 'forwardTo',    label: 'Forward To',            type: 'email',    required: true },
          { id: 'keepCopy',     label: 'Keep a copy in mailbox',type: 'select',   required: true,  options: ['Yes', 'No'] },
          { id: 'duration',     label: 'Forwarding Duration',   type: 'select',   required: false, options: ['Indefinite', '30 days', '90 days', '6 months', '1 year'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'auto-reply', group: 'Email Configuration', label: 'Auto Reply Configuration',
        approvalPath: ['manager'],
        agentChecks: ['Validate mailbox ownership', 'Check message content for compliance'],
        systemAction: 'Set-MailboxAutoReplyConfiguration via Exchange PowerShell',
        fields: [
          { id: 'mailboxUpn',   label: 'Mailbox UPN',           type: 'email',    required: true },
          { id: 'scope',        label: 'Reply Scope',           type: 'select',   required: true,  options: ['Internal only', 'Internal and external'] },
          { id: 'startDate',    label: 'Start Date',            type: 'date',     required: false },
          { id: 'endDate',      label: 'End Date',              type: 'date',     required: false },
          { id: 'message',      label: 'Auto Reply Message',    type: 'textarea', required: true,  placeholder: 'Out of office message...' },
        ],
      },
    ],
  },

  // ==============  TEAMS  ==============
  'teams': {
    parentGroup: null,
    operations: [
      {
        id: 'create-team', group: 'Team Management', label: 'Create Team',
        approvalPath: ['manager'],
        agentChecks: ['Duplicate team name check', 'Suggest existing teams', 'Validate naming convention', 'Check M365 group quota'],
        systemAction: 'POST /v1.0/teams',
        fields: [
          { id: 'displayName',  label: 'Team Name',             type: 'text',     required: true,  placeholder: 'e.g. Project Phoenix' },
          { id: 'description',  label: 'Description',           type: 'textarea', required: false },
          { id: 'privacy',      label: 'Privacy',               type: 'select',   required: true,  options: ['Private (invite only)', 'Public (open to all)'] },
          { id: 'template',     label: 'Team Template',         type: 'select',   required: false, options: ['Standard', 'Project', 'Retail', 'Healthcare', 'Education'] },
          { id: 'owners',       label: 'Team Owners',           type: 'text',     required: true,  placeholder: 'Comma-separated UPNs (at least 1)' },
          { id: 'members',      label: 'Initial Members',       type: 'text',     required: false, placeholder: 'Comma-separated UPNs' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'add-team-members', group: 'Team Management', label: 'Add / Remove Team Members',
        approvalPath: ['manager'],
        agentChecks: ['Verify team exists', 'Check user licensing', 'Validate requester is owner'],
        systemAction: 'POST/DELETE /v1.0/teams/{id}/members',
        fields: [
          { id: 'teamName',     label: 'Team Name',             type: 'text',     required: true },
          { id: 'action',       label: 'Action',                type: 'select',   required: true,  options: ['Add members', 'Remove members', 'Promote to owner', 'Demote from owner'] },
          { id: 'users',        label: 'Users (UPNs)',          type: 'textarea', required: true,  placeholder: 'One UPN per line' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'create-channel', group: 'Channel Management', label: 'Create Channel',
        approvalPath: ['manager'],
        agentChecks: ['Verify team exists', 'Check for duplicate channel names', 'Validate channel type eligibility'],
        systemAction: 'POST /v1.0/teams/{id}/channels',
        fields: [
          { id: 'teamName',     label: 'Team Name',             type: 'text',     required: true },
          { id: 'channelName',  label: 'Channel Name',          type: 'text',     required: true,  placeholder: 'e.g. Project Updates' },
          { id: 'channelType',  label: 'Channel Type',          type: 'select',   required: true,  options: ['Standard', 'Private', 'Shared'] },
          { id: 'description',  label: 'Description',           type: 'textarea', required: false },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'team-guest-access', group: 'Guest Access', label: 'Request Guest Access to Team',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Verify guest policy allows external access', 'Check guest domain restrictions', 'Validate team guest access setting'],
        systemAction: 'POST /v1.0/teams/{id}/members (guest)',
        fields: [
          { id: 'teamName',     label: 'Team Name',             type: 'text',     required: true },
          { id: 'guestEmails',  label: 'Guest Email Addresses', type: 'textarea', required: true,  placeholder: 'One email per line (external addresses)' },
          { id: 'guestOrg',     label: 'Guest Organisation',    type: 'text',     required: true,  placeholder: 'External company name' },
          { id: 'duration',     label: 'Access Duration',       type: 'select',   required: true,  options: ['30 days', '60 days', '90 days', '6 months', '1 year'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
    ],
  },

  // ==============  SHAREPOINT  ==============
  'sharepoint': {
    parentGroup: null,
    operations: [
      {
        id: 'new-site', group: 'Site Management', label: 'Request New SharePoint Site',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check for similar existing sites', 'Validate site URL availability', 'Check storage quota', 'Verify naming convention'],
        systemAction: 'POST /v1.0/sites — Invoke-RestMethod SharePoint REST API',
        fields: [
          { id: 'siteTitle',    label: 'Site Title',            type: 'text',     required: true,  placeholder: 'e.g. Finance Department Hub' },
          { id: 'siteUrl',      label: 'Site URL',              type: 'text',     required: true,  placeholder: 'finance-hub', hint: 'contoso.sharepoint.com/sites/ prefix appended' },
          { id: 'siteTemplate', label: 'Template',              type: 'select',   required: true,  options: ['Team site', 'Communication site', 'Hub site', 'Document center'] },
          { id: 'owners',       label: 'Site Owners',           type: 'text',     required: true,  placeholder: 'Comma-separated UPNs' },
          { id: 'storageQuota', label: 'Initial Storage Quota', type: 'select',   required: false, options: ['1 GB (default)', '5 GB', '10 GB', '25 GB', '100 GB'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'add-site-members', group: 'Site Permissions', label: 'Add Site Members / Owners',
        approvalPath: ['manager'],
        agentChecks: ['Verify site exists', 'Check user eligibility', 'Validate permission level request'],
        systemAction: 'SharePoint REST API — /_api/web/roleassignments',
        fields: [
          { id: 'siteUrl',      label: 'Site URL',              type: 'text',     required: true,  placeholder: 'contoso.sharepoint.com/sites/...' },
          { id: 'role',         label: 'Permission Level',      type: 'select',   required: true,  options: ['Read', 'Contribute', 'Edit', 'Full Control', 'Site Owner'] },
          { id: 'users',        label: 'Users / Groups (UPNs)', type: 'textarea', required: true,  placeholder: 'One UPN or group name per line' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'external-sharing', group: 'External Sharing', label: 'Request External Sharing',
        approvalPath: ['manager', 'dataowner', 'it'],
        agentChecks: ['Check tenant external sharing policy', 'Verify domain not blocked', 'Classify data sensitivity', 'Check DLP policy applicability'],
        systemAction: 'Set-SPOSite -SharingCapability via PnP PowerShell',
        fields: [
          { id: 'siteUrl',      label: 'Site URL',              type: 'text',     required: true },
          { id: 'sharingLevel', label: 'Sharing Level',         type: 'select',   required: true,  options: ['Specific people (authenticated)', 'Anyone with link (no sign-in)', 'Existing guests only'] },
          { id: 'externalOrg',  label: 'External Organisation', type: 'text',     required: true },
          { id: 'duration',     label: 'Duration',              type: 'select',   required: true,  options: ['30 days', '90 days', '6 months', '1 year', 'Ongoing (reviewed annually)'] },
          { id: 'dataSensitivity', label: 'Data Sensitivity',   type: 'select',   required: true,  options: ['Public', 'Internal', 'Confidential', 'Highly Confidential'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'storage-increase', group: 'Site Management', label: 'Request Storage Increase',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check current usage vs quota', 'Validate increase request is proportionate', 'Check tenant storage pool'],
        systemAction: 'Set-SPOSite -StorageQuota via PnP PowerShell',
        fields: [
          { id: 'siteUrl',      label: 'Site URL',              type: 'text',     required: true },
          { id: 'currentSize',  label: 'Current Storage Used',  type: 'text',     required: false, placeholder: 'Approx. current usage (e.g. 4.5 GB)' },
          { id: 'requestedGB',  label: 'Additional Storage (GB)',type: 'text',    required: true,  placeholder: 'e.g. 10' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'delete-site', group: 'Site Management', label: 'Request Site Deletion',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check last site activity', 'Identify site owners', 'Check for active flows or apps referencing site', 'Verify data retention requirements'],
        systemAction: 'Remove-SPOSite via PnP PowerShell',
        fields: [
          { id: 'siteUrl',      label: 'Site URL',              type: 'text',     required: true },
          { id: 'contentAction',label: 'Content Action',        type: 'select',   required: true,  options: ['Export content then delete', 'Move to archive library', 'Immediate deletion'] },
          { id: 'confirmation', label: 'Type site name to confirm', type: 'text', required: true },
          { id: 'justification',label: 'Reason for Deletion',   type: 'textarea', required: true },
        ],
      },
    ],
  },

  // ==============  ONEDRIVE  ==============
  'onedrive': {
    parentGroup: null,
    operations: [
      {
        id: 'onedrive-storage', group: 'Storage', label: 'Request OneDrive Storage Increase',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check current OneDrive usage', 'Verify user licensing tier', 'Check tenant storage pool'],
        systemAction: 'Set-SPOSite (OneDrive) -StorageQuota via PnP PowerShell',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true,  placeholder: 'user@contoso.com' },
          { id: 'currentUsage', label: 'Current Usage (approx)',type: 'text',     required: false, placeholder: 'e.g. 800 GB' },
          { id: 'requestedQuota',label: 'Requested Quota (GB)', type: 'select',   required: true,  options: ['1 TB (default)', '2 TB', '5 TB', '10 TB', '25 TB (requires approval)'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'former-employee-od', group: 'Access', label: 'Access Former Employee OneDrive',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Verify employee account status', 'Check data retention policy', 'Validate manager relationship', 'Check GDPR/legal hold status'],
        systemAction: 'Set-SPOUser -Site (OneDrive URL) -LoginName via PnP PowerShell',
        fields: [
          { id: 'formerEmployee',label: 'Former Employee UPN',  type: 'email',    required: true },
          { id: 'requestorUpn', label: 'Requestor UPN',         type: 'email',    required: true,  hint: 'Your UPN — will be granted access' },
          { id: 'reason',       label: 'Reason for Access',     type: 'select',   required: true,  options: ['Business continuity', 'Legal / compliance', 'Data recovery', 'Project handover', 'GDPR subject access request'] },
          { id: 'duration',     label: 'Access Duration',       type: 'select',   required: true,  options: ['7 days', '30 days', '90 days'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
    ],
  },

  // ==============  EXTERNAL SHARING  ==============
  'ext-sharing': {
    parentGroup: null,
    operations: [
      {
        id: 'invite-guest', group: 'Guest Invitations', label: 'Invite External Guest',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check domain against block list', 'Verify guest invitation policy', 'Check existing guest account', 'Validate business relationship'],
        systemAction: 'POST /v1.0/invitations',
        fields: [
          { id: 'guestEmail',   label: 'Guest Email Address',   type: 'email',    required: true },
          { id: 'guestName',    label: 'Guest Full Name',       type: 'text',     required: true },
          { id: 'guestOrg',     label: 'Guest Organisation',    type: 'text',     required: true },
          { id: 'accessNeeded', label: 'Access Required',       type: 'text',     required: true,  placeholder: 'Teams, SharePoint site, etc.' },
          { id: 'duration',     label: 'Access Duration',       type: 'select',   required: true,  options: ['30 days', '60 days', '90 days', '6 months', '1 year'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'extend-guest', group: 'Guest Lifecycle', label: 'Extend Guest Access',
        approvalPath: ['manager', 'dataowner'],
        agentChecks: ['Verify current expiry date', 'Check if guest is still active', 'Validate business relationship still active'],
        systemAction: 'PATCH /v1.0/users/{guestId} — update account expiry',
        fields: [
          { id: 'guestEmail',   label: 'Guest Email Address',   type: 'email',    required: true },
          { id: 'extension',    label: 'Extend By',             type: 'select',   required: true,  options: ['30 days', '60 days', '90 days', '6 months', '1 year'] },
          { id: 'reviewDate',   label: 'Next Review Date',      type: 'date',     required: false },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'remove-guest', group: 'Guest Lifecycle', label: 'Remove Guest Access',
        approvalPath: ['manager'],
        agentChecks: ['Enumerate all resources guest has access to', 'Check for owned content', 'Schedule account removal'],
        systemAction: 'DELETE /v1.0/users/{guestId}',
        fields: [
          { id: 'guestEmail',   label: 'Guest Email Address',   type: 'email',    required: true },
          { id: 'removeDate',   label: 'Removal Date',          type: 'date',     required: false, hint: 'Leave blank for immediate removal' },
          { id: 'reassignContent', label: 'Reassign owned content to', type: 'text', required: false, placeholder: 'UPN of new owner (optional)' },
          { id: 'justification',label: 'Reason',                type: 'textarea', required: true },
        ],
      },
      {
        id: 'enable-ext-sharing', group: 'Sharing Policy', label: 'Request External Sharing Enablement',
        approvalPath: ['manager', 'dataowner', 'it'],
        agentChecks: ['Verify DLP policies cover new sharing scope', 'Check Conditional Access for guest sign-in', 'Review tenant sharing policy settings'],
        systemAction: 'Set-SPOTenant -SharingCapability via PnP PowerShell',
        fields: [
          { id: 'scope',        label: 'Sharing Scope',         type: 'select',   required: true,  options: ['Specific SharePoint sites', 'All SharePoint sites', 'OneDrive', 'All workloads'] },
          { id: 'sharingLevel', label: 'Sharing Level',         type: 'select',   required: true,  options: ['New and existing guests', 'Existing guests only', 'Anyone (anonymous links)'] },
          { id: 'domains',      label: 'Allowed External Domains', type: 'text', required: false, placeholder: 'partner1.com, partner2.com' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
    ],
  },

  // ==============  USER ACCESS  ==============
  'user-access': {
    parentGroup: null,
    operations: [
      {
        id: 'access-mailbox', group: 'Access Requests', label: 'Access to Shared Mailbox',
        approvalPath: ['manager'],
        agentChecks: ['Verify mailbox exists', 'Check existing permissions', 'Validate requester eligibility'],
        systemAction: 'Add-MailboxPermission via Exchange PowerShell',
        fields: [
          { id: 'mailboxEmail', label: 'Shared Mailbox Email',  type: 'email',    required: true },
          { id: 'permLevel',    label: 'Permission Level',      type: 'select',   required: true,  options: ['Full Access', 'Send As', 'Send on Behalf'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'access-teams', group: 'Access Requests', label: 'Access to Teams Team or Channel',
        approvalPath: ['manager'],
        agentChecks: ['Verify team exists', 'Check if team is private/public', 'Check channel accessibility'],
        systemAction: 'POST /v1.0/teams/{id}/members',
        fields: [
          { id: 'teamName',     label: 'Team Name',             type: 'text',     required: true },
          { id: 'channelName',  label: 'Channel Name',          type: 'text',     required: false, placeholder: 'Leave blank for general access' },
          { id: 'role',         label: 'Role',                  type: 'select',   required: true,  options: ['Member', 'Owner'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'access-sharepoint', group: 'Access Requests', label: 'Access to SharePoint Site',
        approvalPath: ['manager'],
        agentChecks: ['Verify site exists', 'Check current permissions', 'Classify data sensitivity'],
        systemAction: 'SharePoint REST API — /_api/web/roleassignments',
        fields: [
          { id: 'siteUrl',      label: 'Site URL',              type: 'text',     required: true },
          { id: 'permLevel',    label: 'Permission Level',      type: 'select',   required: true,  options: ['Read', 'Contribute', 'Edit'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'access-dl', group: 'Access Requests', label: 'Access to Distribution List',
        approvalPath: ['manager'],
        agentChecks: ['Verify DL exists', 'Check for closed membership', 'Check for similar groups'],
        systemAction: 'Add-DistributionGroupMember via Exchange PowerShell',
        fields: [
          { id: 'dlEmail',      label: 'Distribution List Email', type: 'email',  required: true },
          { id: 'action',       label: 'Action',                type: 'select',   required: true,  options: ['Subscribe (add)', 'Unsubscribe (remove)'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'access-sg', group: 'Access Requests', label: 'Access to Security Group',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Verify SG exists', 'Identify what resources are secured', 'Validate eligibility based on role/department'],
        systemAction: 'POST /v1.0/groups/{id}/members/$ref',
        fields: [
          { id: 'sgName',       label: 'Security Group Name',   type: 'text',     required: true },
          { id: 'resourceAccess',label: 'Resource you need to access', type: 'text', required: true, placeholder: 'What will this SG membership unlock?' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
    ],
  },

  // ==============  LICENSES  ==============
  'licenses': {
    parentGroup: null,
    operations: [
      {
        id: 'req-f3', group: 'Microsoft 365', label: 'Request Microsoft 365 F3 License (Frontline Worker)',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check F3 license availability', 'Verify frontline worker eligibility', 'Check group-based assignment config'],
        systemAction: 'Assign via group or direct — configurable in admin settings',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'costCenter',   label: 'Cost Center',           type: 'text',     required: true },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'req-e3', group: 'Microsoft 365', label: 'Request Microsoft 365 E3 License',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check E3 license availability', 'Verify current license assignment', 'Validate user eligibility', 'Apply group-based assignment if configured'],
        systemAction: 'Assign via group or direct — configurable in admin settings',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'startDate',    label: 'Required From Date',    type: 'date',     required: false },
          { id: 'costCenter',   label: 'Cost Center',           type: 'text',     required: true },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'req-e5', group: 'Microsoft 365', label: 'Request Microsoft 365 E5 License',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check E5 license availability (CRITICAL — low stock)', 'Verify E5 features needed vs E3', 'Validate cost center approval', 'Apply group-based assignment if configured'],
        systemAction: 'Assign via group or direct — configurable in admin settings',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'featuresNeeded',label: 'E5 Features Required', type: 'select',   required: true,  options: ['Defender for Endpoint P2', 'Purview compliance', 'Advanced analytics', 'All E5 features'] },
          { id: 'costCenter',   label: 'Cost Center',           type: 'text',     required: true },
          { id: 'startDate',    label: 'Required From Date',    type: 'date',     required: false },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'convert-shared-mb', group: 'Mailbox Services', label: 'Convert Shared Mailbox to Licensed User Mailbox',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Verify shared mailbox exists', 'Check license availability', 'Confirm mailbox conversion eligible', 'User will be able to login after conversion'],
        systemAction: 'Convert shared → regular user mailbox + assign selected license',
        fields: [
          { id: 'mailboxEmail', label: 'Shared Mailbox Email',   type: 'email',    required: true },
          { id: 'licenseType',  label: 'License to Assign',      type: 'select',   required: true,  options: ['Microsoft 365 F3', 'Microsoft 365 E3', 'Microsoft 365 E5'] },
          { id: 'costCenter',   label: 'Cost Center',            type: 'text',     required: true },
          { id: 'justification',label: 'Business Justification', type: 'textarea', required: true },
        ],
      },
      {
        id: 'req-copilot', group: 'Copilot & Add-ons', label: 'Request Microsoft 365 Copilot License',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check Copilot license availability', 'Verify M365 E3/E5 prerequisite', 'Validate cost center budget', 'Apply group-based assignment if configured'],
        systemAction: 'Assign via group or direct — configurable in admin settings',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'useCase',      label: 'Intended Use Case',     type: 'textarea', required: true,  placeholder: 'How will Copilot improve your productivity?' },
          { id: 'costCenter',   label: 'Cost Center',           type: 'text',     required: true },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'remove-copilot', group: 'Copilot & Add-ons', label: 'Remove Microsoft 365 Copilot License',
        approvalPath: ['manager'],
        agentChecks: ['Verify current Copilot assignment', 'Check active Copilot usage metrics', 'Confirm removal will not impact productivity'],
        systemAction: 'POST /v1.0/users/{id}/assignLicense (removeLicenses)',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'reason',       label: 'Reason for Removal',    type: 'select',   required: true,  options: ['User departure', 'Cost reduction', 'Low utilisation', 'Role change', 'Other'] },
          { id: 'justification',label: 'Additional Details',    type: 'textarea', required: false },
        ],
      },
      {
        id: 'req-powerbi', group: 'Copilot & Add-ons', label: 'Request Power BI Pro License',
        approvalPath: ['manager'],
        agentChecks: ['Check Power BI Pro availability', 'Verify user not already licensed', 'Check for Power BI Free upgrade path'],
        systemAction: 'POST /v1.0/users/{id}/assignLicense (PBIPREMIUM)',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'useCase',      label: 'Use Case',              type: 'textarea', required: true,  placeholder: 'How will Power BI Pro be used?' },
          { id: 'costCenter',   label: 'Cost Center',           type: 'text',     required: true },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'req-visio', group: 'Copilot & Add-ons', label: 'Request Visio Plan License',
        approvalPath: ['manager'],
        agentChecks: ['Check Visio license availability', 'Verify Visio Plan 1 vs Plan 2 need'],
        systemAction: 'POST /v1.0/users/{id}/assignLicense (VISIO_PLAN2)',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'visioTier',    label: 'Visio Plan',            type: 'select',   required: true,  options: ['Visio Plan 1 (web only)', 'Visio Plan 2 (desktop + web)'] },
          { id: 'costCenter',   label: 'Cost Center',           type: 'text',     required: true },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'req-project', group: 'Copilot & Add-ons', label: 'Request Project Plan License',
        approvalPath: ['manager'],
        agentChecks: ['Check Project Plan availability', 'Validate PM role or equivalent'],
        systemAction: 'POST /v1.0/users/{id}/assignLicense (PROJECT_PLAN3)',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'projectTier',  label: 'Project Plan',          type: 'select',   required: true,  options: ['Project Plan 1 (web only)', 'Project Plan 3 (full)', 'Project Plan 5 (enterprise)'] },
          { id: 'costCenter',   label: 'Cost Center',           type: 'text',     required: true },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
    ],
  },

  // ==============  COPILOT  ==============
  'copilot': {
    parentGroup: null,
    operations: [
      {
        id: 'req-copilot', group: 'Copilot License', label: 'Request Microsoft 365 Copilot License',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check Copilot license availability', 'Verify M365 E3/E5 prerequisite', 'Validate cost center budget'],
        systemAction: 'POST /v1.0/users/{id}/assignLicense (COPILOT_M365)',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'useCase',      label: 'Intended Use Case',     type: 'textarea', required: true,  placeholder: 'How will Copilot improve your productivity?' },
          { id: 'pilotGroup',   label: 'Pilot / rollout group', type: 'text',     required: false, placeholder: 'Team or department (optional)' },
          { id: 'costCenter',   label: 'Cost Center',           type: 'text',     required: true },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'remove-copilot', group: 'Copilot License', label: 'Remove Microsoft 365 Copilot License',
        approvalPath: ['manager'],
        agentChecks: ['Verify current Copilot assignment', 'Check active Copilot usage metrics'],
        systemAction: 'POST /v1.0/users/{id}/assignLicense (removeLicenses)',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'reason',       label: 'Reason for Removal',    type: 'select',   required: true,  options: ['User departure', 'Cost reduction', 'Low utilisation', 'Role change', 'Other'] },
          { id: 'justification',label: 'Additional Details',    type: 'textarea', required: false },
        ],
      },
    ],
  },

  // ==============  POWER PLATFORM  ==============
  'power-platform': {
    parentGroup: null,
    operations: [
      {
        id: 'create-env', group: 'Environments', label: 'Create Power Platform Environment',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check environment quota', 'Validate environment type eligibility', 'Check DLP policy coverage for new environment'],
        systemAction: 'Power Platform Admin API — POST /environments',
        fields: [
          { id: 'envName',      label: 'Environment Name',      type: 'text',     required: true,  placeholder: 'e.g. Finance-Production' },
          { id: 'envType',      label: 'Environment Type',      type: 'select',   required: true,  options: ['Sandbox', 'Production', 'Developer', 'Trial'] },
          { id: 'region',       label: 'Region',                type: 'select',   required: true,  options: ['United Kingdom', 'Europe', 'United States', 'Australia'] },
          { id: 'purpose',      label: 'Purpose',               type: 'textarea', required: true },
          { id: 'costCenter',   label: 'Cost Center',           type: 'text',     required: true },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'premium-connector', group: 'Connectors', label: 'Request Premium Connector Access',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check DLP policy for requested connector', 'Verify Power Automate license', 'Assess data exposure risk'],
        systemAction: 'Power Platform DLP API — update connector classification',
        fields: [
          { id: 'connector',    label: 'Premium Connector',     type: 'text',     required: true,  placeholder: 'e.g. Salesforce, SAP, ServiceNow' },
          { id: 'environment',  label: 'Environment Name',      type: 'text',     required: true },
          { id: 'useCase',      label: 'Use Case',              type: 'textarea', required: true },
          { id: 'dataFlow',     label: 'Data Flow Description', type: 'textarea', required: true,  placeholder: 'What data will flow through this connector?' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'dlp-exception', group: 'Policies', label: 'Request DLP Policy Exception',
        approvalPath: ['manager', 'dataowner', 'it'],
        agentChecks: ['Validate exception scope', 'Assess compliance risk', 'Check for alternative compliant approach', 'Flag sensitive connectors'],
        systemAction: 'Power Platform DLP API — environment-level policy override',
        fields: [
          { id: 'environment',  label: 'Environment',           type: 'text',     required: true },
          { id: 'dlpPolicy',    label: 'DLP Policy Name',       type: 'text',     required: true },
          { id: 'connector',    label: 'Connector(s) Affected', type: 'text',     required: true },
          { id: 'riskMitigation',label: 'Risk Mitigation Plan', type: 'textarea', required: true },
          { id: 'duration',     label: 'Exception Duration',    type: 'select',   required: true,  options: ['30 days', '90 days', '6 months', '1 year'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'pa-license', group: 'Licensing', label: 'Request Power Automate License',
        approvalPath: ['manager'],
        agentChecks: ['Check Power Automate license availability', 'Verify M365 base license', 'Determine if Premium or per-flow license needed'],
        systemAction: 'POST /v1.0/users/{id}/assignLicense (FLOW_PER_USER)',
        fields: [
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'licenseType',  label: 'License Type',          type: 'select',   required: true,  options: ['Power Automate Premium (per user)', 'Power Automate per flow', 'Power Automate Process'] },
          { id: 'useCase',      label: 'Use Case',              type: 'textarea', required: true },
          { id: 'costCenter',   label: 'Cost Center',           type: 'text',     required: true },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
    ],
  },

  // ==============  INTUNE  ==============
  'intune': {
    parentGroup: null,
    operations: [
      {
        id: 'retire-device', group: 'Device Actions', label: 'Retire Device',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Verify device ownership', 'Check for company data on device', 'Confirm MFA device registration', 'Check for pending updates'],
        systemAction: 'POST /beta/deviceManagement/managedDevices/{id}/retire',
        fields: [
          { id: 'deviceName',   label: 'Device Name',           type: 'text',     required: true,  placeholder: 'Device display name from Intune' },
          { id: 'userUpn',      label: 'Device User UPN',       type: 'email',    required: true },
          { id: 'reason',       label: 'Reason for Retirement', type: 'select',   required: true,  options: ['Device being replaced', 'User departure', 'Device lost/stolen', 'End of lifecycle', 'Other'] },
          { id: 'returnDate',   label: 'Device Return / Disposal Date', type: 'date', required: false },
          { id: 'justification',label: 'Additional Details',    type: 'textarea', required: false },
        ],
      },
      {
        id: 'wipe-device', group: 'Device Actions', label: 'Wipe Device',
        approvalPath: ['it'],
        agentChecks: ['Verify device ownership', 'Check for unsynced data', 'CRITICAL: Confirm user awareness — device wipe is irreversible'],
        systemAction: 'POST /beta/deviceManagement/managedDevices/{id}/wipe',
        fields: [
          { id: 'deviceName',   label: 'Device Name',           type: 'text',     required: true },
          { id: 'userUpn',      label: 'Device User UPN',       type: 'email',    required: true },
          { id: 'wipeType',     label: 'Wipe Type',             type: 'select',   required: true,  options: ['Full wipe (factory reset)', 'Selective wipe (remove corporate data only)'] },
          { id: 'reason',       label: 'Reason',                type: 'select',   required: true,  options: ['Device lost', 'Device stolen', 'Security incident', 'User departure', 'Other'] },
          { id: 'confirmation', label: 'Type CONFIRM to proceed', type: 'text',   required: true,  hint: 'This action is irreversible' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'compliance-exception', group: 'Compliance', label: 'Request Compliance Exception',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Assess compliance gap', 'Check for compensating controls', 'Review exception policy limits', 'Flag if exception creates Zero Trust gap'],
        systemAction: 'Update device compliance policy exclusion group via Intune API',
        fields: [
          { id: 'deviceName',   label: 'Device Name',           type: 'text',     required: true },
          { id: 'userUpn',      label: 'User UPN',              type: 'email',    required: true },
          { id: 'nonCompliantItem', label: 'Non-Compliant Item', type: 'select', required: true,  options: ['OS version', 'Encryption', 'Screen lock', 'Jailbreak/Root detection', 'Threat level', 'Other'] },
          { id: 'compensatingControls', label: 'Compensating Controls', type: 'textarea', required: true, placeholder: 'What security controls mitigate the compliance gap?' },
          { id: 'duration',     label: 'Exception Duration',    type: 'select',   required: true,  options: ['7 days', '30 days', '90 days'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
    ],
  },

  // ==============  GUEST LIFECYCLE  ==============
  'guest-lifecycle': {
    parentGroup: null,
    operations: [
      {
        id: 'invite-guest-user', group: 'Guest Management', label: 'Invite Guest User',
        approvalPath: ['manager', 'it'],
        agentChecks: ['Check domain against block list', 'Check for existing guest account', 'Verify guest invitation policy', 'Check Conditional Access guest policy'],
        systemAction: 'POST /v1.0/invitations',
        fields: [
          { id: 'guestEmail',   label: 'Guest Email',           type: 'email',    required: true },
          { id: 'guestName',    label: 'Guest Full Name',       type: 'text',     required: true },
          { id: 'guestOrg',     label: 'Organisation',          type: 'text',     required: true },
          { id: 'accessScope',  label: 'Access Scope',          type: 'text',     required: true,  placeholder: 'Teams, SharePoint sites, etc.' },
          { id: 'sponsor',      label: 'Internal Sponsor UPN',  type: 'email',    required: true,  hint: 'Accountable internal contact for this guest' },
          { id: 'duration',     label: 'Access Duration',       type: 'select',   required: true,  options: ['30 days', '90 days', '6 months', '1 year'] },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'extend-guest-access', group: 'Guest Management', label: 'Extend Guest Access',
        approvalPath: ['manager', 'dataowner'],
        agentChecks: ['Verify guest activity (last 30 days)', 'Check access scope still appropriate', 'Validate sponsor still in organisation'],
        systemAction: 'PATCH /v1.0/users/{guestId} — update account expiry',
        fields: [
          { id: 'guestEmail',   label: 'Guest Email',           type: 'email',    required: true },
          { id: 'extension',    label: 'Extend Access By',      type: 'select',   required: true,  options: ['30 days', '90 days', '6 months', '1 year'] },
          { id: 'accessReview', label: 'Access Still Required For', type: 'textarea', required: true, placeholder: 'Confirm ongoing business need...' },
          { id: 'justification',label: 'Business Justification',type: 'textarea', required: true },
        ],
      },
      {
        id: 'remove-guest-user', group: 'Guest Management', label: 'Remove Guest User',
        approvalPath: ['manager'],
        agentChecks: ['Enumerate guest resource access', 'Check for owned content', 'Check active collaborations', 'Flag any open items'],
        systemAction: 'DELETE /v1.0/users/{guestId}',
        fields: [
          { id: 'guestEmail',   label: 'Guest Email',           type: 'email',    required: true },
          { id: 'removeDate',   label: 'Removal Date',          type: 'date',     required: false, hint: 'Leave blank for immediate removal' },
          { id: 'contentAction',label: 'Owned Content Action',  type: 'select',   required: true,  options: ['Reassign to sponsor', 'Export then delete', 'No action needed'] },
          { id: 'justification',label: 'Reason',                type: 'textarea', required: true },
        ],
      },
      {
        id: 'quarterly-review', group: 'Access Review', label: 'Request Quarterly Access Review',
        approvalPath: ['it'],
        agentChecks: ['Enumerate all active guest accounts', 'Identify guests inactive >60 days', 'Check expiry dates', 'Identify guests without sponsors'],
        systemAction: 'GET /v1.0/users?$filter=userType eq "Guest" — generate review report',
        fields: [
          { id: 'scope',        label: 'Review Scope',          type: 'select',   required: true,  options: ['All guest users', 'Specific department guests', 'Guests expiring in 30 days', 'Inactive guests only'] },
          { id: 'reviewerUpn',  label: 'Reviewer UPN',          type: 'email',    required: true,  hint: 'Who should receive the review report' },
          { id: 'justification',label: 'Additional Notes',      type: 'textarea', required: false },
        ],
      },
    ],
  },
}
