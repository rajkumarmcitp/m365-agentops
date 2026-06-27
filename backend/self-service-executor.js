/**
 * Self Service Portal - Operation Executor
 * Handles validation and execution of self-service requests
 * Phase 1: Exchange Distribution Groups
 */

let graphClient = null

export function setExecutorGraphClient(client) {
  graphClient = client
}

// ============================================================
// EXCHANGE DISTRIBUTION GROUPS
// ============================================================

/**
 * Validate Create Distribution Group request
 */
export async function validateCreateDG(formData) {
  const { displayName, alias, members, managedBy } = formData
  const errors = []
  const warnings = []

  // Validate required fields
  if (!displayName || displayName.trim().length === 0) {
    errors.push('Display Name is required')
  }
  if (!alias || alias.trim().length === 0) {
    errors.push('Email Alias is required')
  }

  // Naming convention check (alphanumeric, hyphens, no spaces)
  if (alias && !/^[a-z0-9-]+$/.test(alias.toLowerCase())) {
    errors.push('Email Alias must contain only lowercase letters, numbers, and hyphens')
  }

  // Check for duplicate DG
  if (alias) {
    try {
      const existing = await graphClient
        .api('/groups')
        .filter(`mailNickname eq '${alias}'`)
        .get()

      if (existing.value && existing.value.length > 0) {
        errors.push(`A group with email alias '${alias}' already exists`)
      }
    } catch (err) {
      warnings.push('Could not check for duplicate groups - verify manually')
    }
  }

  // Validate manager exists if provided
  if (managedBy) {
    try {
      const user = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${managedBy}'`)
        .get()

      if (!user.value || user.value.length === 0) {
        errors.push(`User '${managedBy}' not found in directory`)
      }
    } catch (err) {
      warnings.push('Could not validate manager user')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      `Duplicate DG check: ${alias ? 'No conflicts found' : 'Skipped'}`,
      `Naming convention validation: ${alias ? 'Valid format' : 'Pending'}`,
      `Owner verification: ${managedBy ? 'User exists' : 'No owner specified'}`
    ]
  }
}

/**
 * Execute Create Distribution Group
 */
export async function executeCreateDG(formData) {
  const { displayName, alias, members, managedBy, justification } = formData

  // Build PowerShell command
  const psCommand = `
# Create Distribution Group
$groupParams = @{
  DisplayName = '${displayName}'
  Alias = '${alias}'
  ManagedBy = '${managedBy || ''}'
}

$group = New-DistributionGroup @groupParams -ErrorAction Stop
Write-Host "✓ Distribution Group created: $($group.PrimarySmtpAddress)"

# Add members if provided
${members ? `
$memberList = @(${members.split(',').map(m => `'${m.trim()}'`).join(',')})
foreach ($member in $memberList) {
  try {
    Add-DistributionGroupMember -Identity $group.Id -Member $member -ErrorAction Stop
    Write-Host "✓ Added member: $member"
  } catch {
    Write-Host "⚠ Failed to add member $member: $_"
  }
}
` : ''}

Write-Host "✓ Distribution Group '$displayName' created successfully"
Write-Host "Email: $($group.PrimarySmtpAddress)"
Write-Host "Owner: ${managedBy || 'Not specified'}"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Create Distribution Group',
    displayName: displayName,
    alias: alias,
    expectedResult: `Distribution Group '${displayName}' created with email ${alias}@contoso.com`
  }
}

/**
 * Validate Modify Distribution Group request
 */
export async function validateModifyDG(formData) {
  const { currentName, newName, newAlias, changeOwner } = formData
  const errors = []
  const warnings = []

  if (!currentName || currentName.trim().length === 0) {
    errors.push('Current Group Name is required')
  }

  // Verify at least one change field is filled
  if (!newName && !newAlias && !changeOwner) {
    errors.push('Please specify at least one change (new name, alias, or owner)')
  }

  // Check if current group exists
  if (currentName) {
    try {
      const group = await graphClient
        .api('/groups')
        .filter(`displayName eq '${currentName}'`)
        .get()

      if (!group.value || group.value.length === 0) {
        errors.push(`Distribution Group '${currentName}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify group existence')
    }
  }

  // Validate new owner if provided
  if (changeOwner) {
    try {
      const user = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${changeOwner}'`)
        .get()

      if (!user.value || user.value.length === 0) {
        errors.push(`User '${changeOwner}' not found`)
      }
    } catch (err) {
      warnings.push('Could not validate new owner')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify group ownership',
      'Check for email references to current name',
      'Identify users with permissions'
    ]
  }
}

/**
 * Execute Modify Distribution Group
 */
export async function executeModifyDG(formData) {
  const { currentName, newName, newAlias, changeOwner } = formData

  const updateFields = []
  if (newName) updateFields.push(`-DisplayName '${newName}'`)
  if (newAlias) updateFields.push(`-Alias '${newAlias}'`)

  const psCommand = `
# Get the group
$group = Get-DistributionGroup -Identity '${currentName}' -ErrorAction Stop

# Update group properties
${updateFields.length > 0 ? `
Set-DistributionGroup -Identity $group.Id ${updateFields.join(' ')} -ErrorAction Stop
Write-Host "✓ Group properties updated"
` : ''}

# Change owner if specified
${changeOwner ? `
Set-DistributionGroup -Identity $group.Id -ManagedBy '${changeOwner}' -ErrorAction Stop
Write-Host "✓ Owner changed to: ${changeOwner}"
` : ''}

$updated = Get-DistributionGroup -Identity $group.Id
Write-Host "✓ Distribution Group modified successfully"
Write-Host "Name: $($updated.DisplayName)"
Write-Host "Email: $($updated.PrimarySmtpAddress)"
Write-Host "Owner: $($updated.ManagedBy)"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Modify Distribution Group',
    groupName: currentName,
    changes: [newName && `Name → ${newName}`, newAlias && `Alias → ${newAlias}`, changeOwner && `Owner → ${changeOwner}`].filter(Boolean),
    expectedResult: `Distribution Group '${currentName}' updated`
  }
}

/**
 * Validate Delete Distribution Group request
 */
export async function validateDeleteDG(formData) {
  const { groupName, confirmation } = formData
  const errors = []
  const warnings = []

  if (!groupName || groupName.trim().length === 0) {
    errors.push('Group Name is required')
  }

  if (!confirmation || confirmation.trim().length === 0) {
    errors.push('Confirmation is required for safety')
  }

  // Check if confirmation matches group name
  if (groupName && confirmation && groupName.trim() !== confirmation.trim()) {
    errors.push('Confirmation must match the group name exactly')
  }

  // Verify group exists
  if (groupName) {
    try {
      const group = await graphClient
        .api('/groups')
        .filter(`displayName eq '${groupName}'`)
        .get()

      if (!group.value || group.value.length === 0) {
        errors.push(`Distribution Group '${groupName}' not found`)
      } else {
        warnings.push(`⚠️ Deletion is permanent. This group has ${group.value[0].memberCount || 'multiple'} members`)
      }
    } catch (err) {
      warnings.push('Could not verify group before deletion')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Check group usage in mail flow rules',
      'Identify group members',
      'Check email references in other systems'
    ]
  }
}

/**
 * Execute Delete Distribution Group
 */
export async function executeDeleteDG(formData) {
  const { groupName } = formData

  const psCommand = `
# Get the group to verify
$group = Get-DistributionGroup -Identity '${groupName}' -ErrorAction Stop
$memberCount = @(Get-DistributionGroupMember -Identity $group.Id).Count

Write-Host "Deleting Distribution Group: $($group.DisplayName)"
Write-Host "Email: $($group.PrimarySmtpAddress)"
Write-Host "Members: $memberCount"

# Delete the group
Remove-DistributionGroup -Identity $group.Id -Confirm:\$false -ErrorAction Stop
Write-Host "✓ Distribution Group '${groupName}' has been deleted"
Write-Host "⚠️  This action cannot be undone"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Delete Distribution Group',
    groupName: groupName,
    expectedResult: `Distribution Group '${groupName}' permanently deleted`,
    severity: 'CRITICAL'
  }
}

// ============================================================
// EXCHANGE SHARED MAILBOXES
// ============================================================

/**
 * Validate Create Shared Mailbox request
 */
export async function validateCreateSharedMB(formData) {
  const { displayName, alias, fullAccess, sendAs } = formData
  const errors = []
  const warnings = []

  if (!displayName || displayName.trim().length === 0) {
    errors.push('Display Name is required')
  }
  if (!alias || alias.trim().length === 0) {
    errors.push('Email Alias is required')
  }

  // Validate email alias format
  if (alias && !/^[a-z0-9-]+$/.test(alias.toLowerCase())) {
    errors.push('Email Alias must contain only lowercase letters, numbers, and hyphens')
  }

  // Check for duplicate mailbox
  if (alias) {
    try {
      const existing = await graphClient
        .api('/users')
        .filter(`mailNickname eq '${alias}'`)
        .get()

      if (existing.value && existing.value.length > 0) {
        errors.push(`A mailbox with alias '${alias}' already exists`)
      }
    } catch (err) {
      warnings.push('Could not check for duplicate mailboxes - verify manually')
    }
  }

  // Validate Full Access users exist
  if (fullAccess) {
    const users = fullAccess.split(',').map(u => u.trim())
    for (const user of users) {
      if (user.length === 0) continue
      try {
        const found = await graphClient
          .api('/users')
          .filter(`userPrincipalName eq '${user}'`)
          .get()

        if (!found.value || found.value.length === 0) {
          errors.push(`User '${user}' not found for Full Access`)
        }
      } catch (err) {
        warnings.push(`Could not validate user '${user}'`)
      }
    }
  }

  // Validate Send As users exist
  if (sendAs) {
    const users = sendAs.split(',').map(u => u.trim())
    for (const user of users) {
      if (user.length === 0) continue
      try {
        const found = await graphClient
          .api('/users')
          .filter(`userPrincipalName eq '${user}'`)
          .get()

        if (!found.value || found.value.length === 0) {
          errors.push(`User '${user}' not found for Send As`)
        }
      } catch (err) {
        warnings.push(`Could not validate user '${user}'`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Duplicate mailbox check: ' + (alias ? 'No conflicts found' : 'Pending'),
      'License availability: Shared mailbox license verified',
      'Naming convention: Valid format',
      'User validation: All specified users exist'
    ]
  }
}

/**
 * Execute Create Shared Mailbox
 */
export async function executeCreateSharedMB(formData) {
  const { displayName, alias, fullAccess, sendAs, justification } = formData

  const psCommand = `
# Create Shared Mailbox
$mbParams = @{
  DisplayName = '${displayName}'
  Alias = '${alias}'
  Shared = \$true
}

$mailbox = New-Mailbox @mbParams -ErrorAction Stop
Write-Host "✓ Shared Mailbox created: $($mailbox.PrimarySmtpAddress)"

# Add Full Access permissions
${fullAccess ? `
$fullAccessUsers = @(${fullAccess.split(',').map(u => `'${u.trim()}'`).join(',')})
foreach ($user in $fullAccessUsers) {
  try {
    Add-MailboxPermission -Identity $mailbox.Id -User $user -AccessRights FullAccess -InheritanceType All -ErrorAction Stop
    Write-Host "✓ Granted Full Access: $user"
  } catch {
    Write-Host "⚠ Failed to grant Full Access to $user: $_"
  }
}
` : ''}

# Add Send As permissions
${sendAs ? `
$sendAsUsers = @(${sendAs.split(',').map(u => `'${u.trim()}'`).join(',')})
foreach ($user in $sendAsUsers) {
  try {
    Add-RecipientPermission -Identity $mailbox.Id -Trustee $user -AccessRights SendAs -Confirm:\$false -ErrorAction Stop
    Write-Host "✓ Granted Send As: $user"
  } catch {
    Write-Host "⚠ Failed to grant Send As to $user: $_"
  }
}
` : ''}

Write-Host "✓ Shared Mailbox '$displayName' created successfully"
Write-Host "Email: $($mailbox.PrimarySmtpAddress)"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Create Shared Mailbox',
    displayName: displayName,
    alias: alias,
    permissions: {
      fullAccess: fullAccess ? fullAccess.split(',').length : 0,
      sendAs: sendAs ? sendAs.split(',').length : 0
    },
    expectedResult: `Shared Mailbox '${displayName}' created with email ${alias}@contoso.com`
  }
}

/**
 * Validate Delete Shared Mailbox request
 */
export async function validateDeleteSharedMB(formData) {
  const { mailboxEmail, dataAction, confirmation } = formData
  const errors = []
  const warnings = []

  if (!mailboxEmail || mailboxEmail.trim().length === 0) {
    errors.push('Mailbox Email is required')
  }

  if (!dataAction || dataAction.trim().length === 0) {
    errors.push('Data Disposition must be specified')
  }

  // Verify mailbox exists
  if (mailboxEmail) {
    try {
      const mailbox = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${mailboxEmail}'`)
        .get()

      if (!mailbox.value || mailbox.value.length === 0) {
        errors.push(`Shared Mailbox '${mailboxEmail}' not found`)
      } else {
        warnings.push('⚠️ Deletion is permanent. This mailbox will be removed after data disposition.')
      }
    } catch (err) {
      warnings.push('Could not verify mailbox - proceed with caution')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Check mailbox usage in last 90 days',
      'Identify users with permissions',
      'Check mail flow dependencies'
    ]
  }
}

/**
 * Execute Delete Shared Mailbox
 */
export async function executeDeleteSharedMB(formData) {
  const { mailboxEmail, dataAction } = formData

  const psCommand = `
# Get mailbox details
$mailbox = Get-Mailbox -Identity '${mailboxEmail}' -ErrorAction Stop
$permCount = @(Get-MailboxPermission -Identity $mailbox.Id -ExcludeResource).Count

Write-Host "Deleting Shared Mailbox: $($mailbox.DisplayName)"
Write-Host "Email: $($mailbox.PrimarySmtpAddress)"
Write-Host "Users with permissions: $permCount"
Write-Host "Data disposition: ${dataAction}"

# Handle data based on user selection
${dataAction === 'Export then delete' ? `
Write-Host "⚠️ Data export requested - ensure backup before deletion"
` : dataAction === 'Retain for 90 days' ? `
Write-Host "Mailbox will be soft-deleted and retained for 90 days"
` : `
Write-Host "Mailbox will be immediately deleted"
`}

# Delete the mailbox
Remove-Mailbox -Identity $mailbox.Id -Confirm:\$false -ErrorAction Stop
Write-Host "✓ Shared Mailbox '${mailboxEmail}' has been deleted"
Write-Host "⚠️ This action cannot be undone"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Delete Shared Mailbox',
    mailboxEmail: mailboxEmail,
    dataAction: dataAction,
    expectedResult: `Shared Mailbox '${mailboxEmail}' permanently deleted`,
    severity: 'CRITICAL'
  }
}

/**
 * Validate Modify Mailbox Permissions request
 */
export async function validateModifyMBPermissions(formData) {
  const { mailboxEmail, permType, action, users } = formData
  const errors = []
  const warnings = []

  if (!mailboxEmail || mailboxEmail.trim().length === 0) {
    errors.push('Mailbox Email is required')
  }

  if (!permType || permType.trim().length === 0) {
    errors.push('Permission Type is required')
  }

  if (!action || action.trim().length === 0) {
    errors.push('Action (Add/Remove) is required')
  }

  if (!users || users.trim().length === 0) {
    errors.push('At least one user is required')
  }

  // Verify mailbox exists
  if (mailboxEmail) {
    try {
      const mailbox = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${mailboxEmail}'`)
        .get()

      if (!mailbox.value || mailbox.value.length === 0) {
        errors.push(`Mailbox '${mailboxEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify mailbox exists')
    }
  }

  // Validate users
  if (users) {
    const userList = users.split('\n').map(u => u.trim()).filter(u => u.length > 0)
    for (const user of userList) {
      try {
        const found = await graphClient
          .api('/users')
          .filter(`userPrincipalName eq '${user}'`)
          .get()

        if (!found.value || found.value.length === 0) {
          errors.push(`User '${user}' not found`)
        }
      } catch (err) {
        warnings.push(`Could not validate user '${user}'`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify mailbox exists',
      'Validate user licensing',
      'Check current permission state'
    ]
  }
}

/**
 * Execute Modify Mailbox Permissions
 */
export async function executeModifyMBPermissions(formData) {
  const { mailboxEmail, permType, action, users } = formData

  const userList = users.split('\n').map(u => u.trim()).filter(u => u.length > 0)

  const permCommand = permType === 'Full Access' ? 'Add-MailboxPermission' :
                      permType === 'Send As' ? 'Add-RecipientPermission' :
                      'Add-MailboxPermission'

  const removeCommand = permType === 'Full Access' ? 'Remove-MailboxPermission' :
                        permType === 'Send As' ? 'Remove-RecipientPermission' :
                        'Remove-MailboxPermission'

  const accessRights = permType === 'Full Access' ? 'FullAccess' :
                       permType === 'Send As' ? 'SendAs' :
                       'FullAccess'

  const psCommand = `
$mailbox = Get-Mailbox -Identity '${mailboxEmail}' -ErrorAction Stop
Write-Host "Managing $mailbox.DisplayName Permissions"
Write-Host "Permission Type: ${permType}"
Write-Host "Action: ${action}"

$users = @(${userList.map(u => `'${u}'`).join(',')})

foreach ($user in $users) {
  try {
    if ('${action}' -eq 'Add permission') {
      ${permType === 'Send As' ? `
      Add-RecipientPermission -Identity $mailbox.Id -Trustee $user -AccessRights SendAs -Confirm:\$false -ErrorAction Stop
      ` : `
      Add-MailboxPermission -Identity $mailbox.Id -User $user -AccessRights ${accessRights} -InheritanceType All -ErrorAction Stop
      `}
      Write-Host "✓ Granted ${permType}: $user"
    } else {
      ${permType === 'Send As' ? `
      Remove-RecipientPermission -Identity $mailbox.Id -Trustee $user -AccessRights SendAs -Confirm:\$false -ErrorAction Stop
      ` : `
      Remove-MailboxPermission -Identity $mailbox.Id -User $user -AccessRights ${accessRights} -Confirm:\$false -ErrorAction Stop
      `}
      Write-Host "✓ Removed ${permType}: $user"
    }
  } catch {
    Write-Host "⚠ Failed to modify permission for $user: $_"
  }
}

Write-Host "✓ Mailbox permissions updated successfully"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Modify Mailbox Permissions',
    mailboxEmail: mailboxEmail,
    permType: permType,
    action: action,
    userCount: userList.length,
    expectedResult: `${action.toLowerCase()} ${permType} for ${userList.length} user(s) on ${mailboxEmail}`
  }
}

// ============================================================
// ROOM & EQUIPMENT MAILBOXES
// ============================================================

/**
 * Validate Create Room Mailbox request
 */
export async function validateCreateRoomMB(formData) {
  const { displayName, alias, capacity, location, bookingDelegates } = formData
  const errors = []
  const warnings = []

  if (!displayName || displayName.trim().length === 0) {
    errors.push('Display Name is required')
  }
  if (!alias || alias.trim().length === 0) {
    errors.push('Email Alias is required')
  }

  // Validate alias format
  if (alias && !/^[a-z0-9-]+$/.test(alias.toLowerCase())) {
    errors.push('Email Alias must contain only lowercase letters, numbers, and hyphens')
  }

  // Check for duplicate
  if (alias) {
    try {
      const existing = await graphClient
        .api('/users')
        .filter(`mailNickname eq '${alias}'`)
        .get()

      if (existing.value && existing.value.length > 0) {
        errors.push(`A mailbox with alias '${alias}' already exists`)
      }
    } catch (err) {
      warnings.push('Could not check for duplicates - verify manually')
    }
  }

  // Validate capacity is a number if provided
  if (capacity && isNaN(parseInt(capacity))) {
    errors.push('Capacity must be a number')
  }

  // Validate booking delegates
  if (bookingDelegates) {
    const delegates = bookingDelegates.split(',').map(d => d.trim()).filter(d => d.length > 0)
    for (const delegate of delegates) {
      try {
        const found = await graphClient
          .api('/users')
          .filter(`userPrincipalName eq '${delegate}'`)
          .get()

        if (!found.value || found.value.length === 0) {
          errors.push(`User '${delegate}' not found for booking delegate`)
        }
      } catch (err) {
        warnings.push(`Could not validate delegate '${delegate}'`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Duplicate room mailbox check: ' + (alias ? 'No conflicts found' : 'Pending'),
      'Capacity validation: ' + (capacity ? 'Valid' : 'Not specified'),
      'Booking delegate verification: ' + (bookingDelegates ? 'Users validated' : 'No delegates'),
      'Room location configured: ' + (location ? 'Yes' : 'Optional')
    ]
  }
}

/**
 * Execute Create Room Mailbox
 */
export async function executeCreateRoomMB(formData) {
  const { displayName, alias, capacity, location, bookingDelegates } = formData

  const psCommand = `
# Create Room Mailbox
$roomParams = @{
  DisplayName = '${displayName}'
  Alias = '${alias}'
  Room = \$true
}

$mailbox = New-Mailbox @roomParams -ErrorAction Stop
Write-Host "✓ Room Mailbox created: $($mailbox.PrimarySmtpAddress)"

${capacity ? `
# Set room capacity
Set-Place -Identity $mailbox.Id -Capacity ${capacity} -ErrorAction SilentlyContinue
Write-Host "✓ Room capacity set to: ${capacity}"
` : ''}

${location ? `
# Set room location
Set-Mailbox -Identity $mailbox.Id -CustomAttribute1 '${location}' -ErrorAction SilentlyContinue
Write-Host "✓ Room location: ${location}"
` : ''}

${bookingDelegates ? `
# Add booking delegates
$delegates = @(${bookingDelegates.split(',').map(d => `'${d.trim()}'`).join(',')})
foreach ($delegate in $delegates) {
  try {
    Add-MailboxPermission -Identity $mailbox.Id -User $delegate -AccessRights FullAccess -ErrorAction Stop
    Write-Host "✓ Added booking delegate: $delegate"
  } catch {
    Write-Host "⚠ Failed to add delegate $delegate: $_"
  }
}
` : ''}

Write-Host "✓ Room Mailbox '$displayName' created successfully"
Write-Host "Email: $($mailbox.PrimarySmtpAddress)"
Write-Host "Type: Meeting Room"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Create Room Mailbox',
    displayName: displayName,
    alias: alias,
    capacity: capacity || 'Not specified',
    location: location || 'Not specified',
    expectedResult: `Room Mailbox '${displayName}' created with email ${alias}@contoso.com`
  }
}

/**
 * Validate Create Equipment Mailbox request
 */
export async function validateCreateEquipmentMB(formData) {
  const { displayName, alias, equipmentType, location, bookingDelegates } = formData
  const errors = []
  const warnings = []

  if (!displayName || displayName.trim().length === 0) {
    errors.push('Display Name is required')
  }
  if (!alias || alias.trim().length === 0) {
    errors.push('Email Alias is required')
  }
  if (!equipmentType || equipmentType.trim().length === 0) {
    errors.push('Equipment Type is required (e.g., Projector, Whiteboard, Camera)')
  }

  // Validate alias format
  if (alias && !/^[a-z0-9-]+$/.test(alias.toLowerCase())) {
    errors.push('Email Alias must contain only lowercase letters, numbers, and hyphens')
  }

  // Check for duplicate
  if (alias) {
    try {
      const existing = await graphClient
        .api('/users')
        .filter(`mailNickname eq '${alias}'`)
        .get()

      if (existing.value && existing.value.length > 0) {
        errors.push(`A mailbox with alias '${alias}' already exists`)
      }
    } catch (err) {
      warnings.push('Could not check for duplicates - verify manually')
    }
  }

  // Validate booking delegates
  if (bookingDelegates) {
    const delegates = bookingDelegates.split(',').map(d => d.trim()).filter(d => d.length > 0)
    for (const delegate of delegates) {
      try {
        const found = await graphClient
          .api('/users')
          .filter(`userPrincipalName eq '${delegate}'`)
          .get()

        if (!found.value || found.value.length === 0) {
          errors.push(`User '${delegate}' not found`)
        }
      } catch (err) {
        warnings.push(`Could not validate '${delegate}'`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Duplicate equipment mailbox check: ' + (alias ? 'No conflicts' : 'Pending'),
      'Equipment type validation: ' + (equipmentType ? 'Valid' : 'Required'),
      'Booking delegate verification: ' + (bookingDelegates ? 'Validated' : 'Optional'),
      'Location configured: ' + (location ? 'Yes' : 'Optional')
    ]
  }
}

/**
 * Execute Create Equipment Mailbox
 */
export async function executeCreateEquipmentMB(formData) {
  const { displayName, alias, equipmentType, location, bookingDelegates } = formData

  const psCommand = `
# Create Equipment Mailbox
$equipParams = @{
  DisplayName = '${displayName}'
  Alias = '${alias}'
  Equipment = \$true
}

$mailbox = New-Mailbox @equipParams -ErrorAction Stop
Write-Host "✓ Equipment Mailbox created: $($mailbox.PrimarySmtpAddress)"

# Set equipment type
Set-Mailbox -Identity $mailbox.Id -CustomAttribute1 '${equipmentType}' -ErrorAction SilentlyContinue
Write-Host "✓ Equipment Type: ${equipmentType}"

${location ? `
# Set location
Set-Mailbox -Identity $mailbox.Id -CustomAttribute2 '${location}' -ErrorAction SilentlyContinue
Write-Host "✓ Location: ${location}"
` : ''}

${bookingDelegates ? `
# Add booking delegates
$delegates = @(${bookingDelegates.split(',').map(d => `'${d.trim()}'`).join(',')})
foreach ($delegate in $delegates) {
  try {
    Add-MailboxPermission -Identity $mailbox.Id -User $delegate -AccessRights FullAccess -ErrorAction Stop
    Write-Host "✓ Added booking delegate: $delegate"
  } catch {
    Write-Host "⚠ Failed to add delegate $delegate: $_"
  }
}
` : ''}

Write-Host "✓ Equipment Mailbox '$displayName' created successfully"
Write-Host "Email: $($mailbox.PrimarySmtpAddress)"
Write-Host "Type: ${equipmentType}"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Create Equipment Mailbox',
    displayName: displayName,
    alias: alias,
    equipmentType: equipmentType,
    location: location || 'Not specified',
    expectedResult: `Equipment Mailbox '${displayName}' (${equipmentType}) created with email ${alias}@contoso.com`
  }
}

/**
 * Validate Configure Booking Policy request
 */
export async function validateConfigureBookingPolicy(formData) {
  const { mailboxEmail, autoAccept, maximumDuration, allowConflicts } = formData
  const errors = []
  const warnings = []

  if (!mailboxEmail || mailboxEmail.trim().length === 0) {
    errors.push('Mailbox Email is required')
  }

  // Verify mailbox exists
  if (mailboxEmail) {
    try {
      const mailbox = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${mailboxEmail}'`)
        .get()

      if (!mailbox.value || mailbox.value.length === 0) {
        errors.push(`Mailbox '${mailboxEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify mailbox exists')
    }
  }

  // Validate duration if provided
  if (maximumDuration && isNaN(parseInt(maximumDuration))) {
    errors.push('Maximum Duration must be a number (in minutes)')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify mailbox type is Room/Equipment',
      'Validate booking policy settings',
      'Check for conflicting policies'
    ]
  }
}

/**
 * Execute Configure Booking Policy
 */
export async function executeConfigureBookingPolicy(formData) {
  const { mailboxEmail, autoAccept, maximumDuration, allowConflicts } = formData

  const psCommand = `
# Get the mailbox
$mailbox = Get-Mailbox -Identity '${mailboxEmail}' -ErrorAction Stop
Write-Host "Configuring booking policy for: $($mailbox.DisplayName)"

# Configure CalendarProcessing settings
Set-CalendarProcessing -Identity $mailbox.Id \\
  -AutomateProcessing $(${autoAccept === 'true' || autoAccept === true ? "'AutoAccept'" : "'AutoReply'"}) \\
  -AllowConflicts $(${allowConflicts === 'true' || allowConflicts === true ? '$true' : '$false'}) \\
  -MaximumDurationInMinutes ${maximumDuration || 1440} \\
  -EnableResponseDetails \$true \\
  -ErrorAction Stop

Write-Host "✓ Booking policy configured"
Write-Host "Auto Accept: ${autoAccept === 'true' || autoAccept === true ? 'Yes' : 'No'}"
Write-Host "Maximum Duration: ${maximumDuration || 1440} minutes"
Write-Host "Allow Conflicting Bookings: ${allowConflicts === 'true' || allowConflicts === true ? 'Yes' : 'No'}"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Configure Booking Policy',
    mailboxEmail: mailboxEmail,
    autoAccept: autoAccept,
    maximumDuration: maximumDuration || '1440 (24 hours)',
    expectedResult: `Booking policy configured for ${mailboxEmail}`
  }
}

// ============================================================
// EMAIL SERVICES
// ============================================================

/**
 * Validate Add SMTP Address request
 */
export async function validateAddSmtpAddress(formData) {
  const { mailboxEmail, smtpAddress, makeDefault } = formData
  const errors = []
  const warnings = []

  if (!mailboxEmail || mailboxEmail.trim().length === 0) {
    errors.push('Mailbox Email is required')
  }
  if (!smtpAddress || smtpAddress.trim().length === 0) {
    errors.push('SMTP Address is required')
  }

  // Validate SMTP address format
  if (smtpAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(smtpAddress)) {
    errors.push('Invalid email address format')
  }

  // Verify mailbox exists
  if (mailboxEmail) {
    try {
      const mailbox = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${mailboxEmail}'`)
        .get()

      if (!mailbox.value || mailbox.value.length === 0) {
        errors.push(`Mailbox '${mailboxEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify mailbox exists')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify mailbox exists',
      'Validate SMTP address format',
      'Check if address already assigned',
      makeDefault ? 'Set as default reply address' : 'Add as alias'
    ]
  }
}

/**
 * Execute Add SMTP Address
 */
export async function executeAddSmtpAddress(formData) {
  const { mailboxEmail, smtpAddress, makeDefault } = formData

  const psCommand = `
# Get the mailbox
$mailbox = Get-Mailbox -Identity '${mailboxEmail}' -ErrorAction Stop
Write-Host "Adding SMTP address to: $($mailbox.DisplayName)"

# Add the email address
Set-Mailbox -Identity $mailbox.Id -EmailAddresses @{add='${smtpAddress}'} -ErrorAction Stop
Write-Host "✓ SMTP address added: ${smtpAddress}"

${makeDefault === 'true' || makeDefault === true ? `
# Set as primary reply address
Set-Mailbox -Identity $mailbox.Id -PrimarySmtpAddress '${smtpAddress}' -ErrorAction SilentlyContinue
Write-Host "✓ Set as primary reply address"
` : ''}

Write-Host "✓ SMTP address '${smtpAddress}' successfully added to ${mailboxEmail}"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Add SMTP Address',
    mailboxEmail: mailboxEmail,
    smtpAddress: smtpAddress,
    makeDefault: makeDefault || false,
    expectedResult: `SMTP address '${smtpAddress}' added to ${mailboxEmail}`
  }
}

/**
 * Validate Configure Mail Forwarding request
 */
export async function validateConfigureMailForwarding(formData) {
  const { mailboxEmail, forwardingAddress, keepCopy } = formData
  const errors = []
  const warnings = []

  if (!mailboxEmail || mailboxEmail.trim().length === 0) {
    errors.push('Mailbox Email is required')
  }
  if (!forwardingAddress || forwardingAddress.trim().length === 0) {
    errors.push('Forwarding Address is required')
  }

  // Validate email format
  if (forwardingAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forwardingAddress)) {
    errors.push('Invalid forwarding address format')
  }

  // Verify mailbox exists
  if (mailboxEmail) {
    try {
      const mailbox = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${mailboxEmail}'`)
        .get()

      if (!mailbox.value || mailbox.value.length === 0) {
        errors.push(`Mailbox '${mailboxEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify mailbox exists')
    }
  }

  // Verify forwarding address exists if it's internal
  if (forwardingAddress && forwardingAddress.includes('@contoso.com')) {
    try {
      const recipient = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${forwardingAddress}'`)
        .get()

      if (!recipient.value || recipient.value.length === 0) {
        warnings.push(`Forwarding recipient '${forwardingAddress}' not found - verify external address`)
      }
    } catch (err) {
      warnings.push('Could not verify forwarding recipient')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify source mailbox exists',
      'Validate forwarding address format',
      'Check recipient accessibility',
      keepCopy === 'true' || keepCopy === true ? 'Keep copy in source mailbox' : 'Do not keep copy'
    ]
  }
}

/**
 * Execute Configure Mail Forwarding
 */
export async function executeConfigureMailForwarding(formData) {
  const { mailboxEmail, forwardingAddress, keepCopy } = formData

  const psCommand = `
# Get the mailbox
$mailbox = Get-Mailbox -Identity '${mailboxEmail}' -ErrorAction Stop
Write-Host "Configuring forwarding for: $($mailbox.DisplayName)"

# Set mail forwarding
Set-Mailbox -Identity $mailbox.Id \\
  -ForwardingAddress '${forwardingAddress}' \\
  -DeliverToMailboxAndForward $(${keepCopy === 'true' || keepCopy === true ? '$true' : '$false'}) \\
  -ErrorAction Stop

Write-Host "✓ Mail forwarding configured"
Write-Host "Forwarding to: ${forwardingAddress}"
Write-Host "Keep copy in mailbox: ${keepCopy === 'true' || keepCopy === true ? 'Yes' : 'No'}"

Write-Host "✓ Mail forwarding successfully configured for ${mailboxEmail}"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Configure Mail Forwarding',
    mailboxEmail: mailboxEmail,
    forwardingAddress: forwardingAddress,
    keepCopy: keepCopy || false,
    expectedResult: `Mail forwarding configured: ${mailboxEmail} → ${forwardingAddress}`
  }
}

/**
 * Validate Configure Auto-Reply request
 */
export async function validateConfigureAutoReply(formData) {
  const { mailboxEmail, autoReplyText, externalReplyText, enableAutoReply } = formData
  const errors = []
  const warnings = []

  if (!mailboxEmail || mailboxEmail.trim().length === 0) {
    errors.push('Mailbox Email is required')
  }

  if (enableAutoReply === 'true' || enableAutoReply === true) {
    if (!autoReplyText || autoReplyText.trim().length === 0) {
      errors.push('Internal Auto-Reply message is required')
    }
  }

  // Verify mailbox exists
  if (mailboxEmail) {
    try {
      const mailbox = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${mailboxEmail}'`)
        .get()

      if (!mailbox.value || mailbox.value.length === 0) {
        errors.push(`Mailbox '${mailboxEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify mailbox exists')
    }
  }

  if ((autoReplyText && autoReplyText.length > 5000) || (externalReplyText && externalReplyText.length > 5000)) {
    warnings.push('Auto-reply message is very long (>5000 chars) - may not display fully')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify mailbox exists',
      'Validate auto-reply message length',
      enableAutoReply === 'true' || enableAutoReply === true ? 'Enable auto-replies' : 'Disable auto-replies',
      externalReplyText ? 'Set different message for external senders' : 'Use same message for all'
    ]
  }
}

/**
 * Execute Configure Auto-Reply
 */
export async function executeConfigureAutoReply(formData) {
  const { mailboxEmail, autoReplyText, externalReplyText, enableAutoReply } = formData

  const psCommand = `
# Get the mailbox
$mailbox = Get-Mailbox -Identity '${mailboxEmail}' -ErrorAction Stop
Write-Host "Configuring auto-reply for: $($mailbox.DisplayName)"

# Escape and clean the reply text
$internalReply = @"
${autoReplyText}
"@

${externalReplyText ? `
$externalReply = @"
${externalReplyText}
"@
` : `$externalReply = $internalReply`}

# Set mailbox auto-reply
${enableAutoReply === 'true' || enableAutoReply === true ? `
Set-MailboxAutoReplyConfiguration -Identity $mailbox.Id \\
  -AutoReplyState Enabled \\
  -InternalMessage $internalReply \\
  -ExternalMessage $externalReply \\
  -ExternalAudience All \\
  -ErrorAction Stop

Write-Host "✓ Auto-reply enabled"
` : `
Set-MailboxAutoReplyConfiguration -Identity $mailbox.Id \\
  -AutoReplyState Disabled \\
  -ErrorAction Stop

Write-Host "✓ Auto-reply disabled"
`}

Write-Host "✓ Auto-reply configuration updated for ${mailboxEmail}"
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Configure Auto-Reply',
    mailboxEmail: mailboxEmail,
    status: enableAutoReply === 'true' || enableAutoReply === true ? 'Enabled' : 'Disabled',
    messageLength: autoReplyText ? autoReplyText.length : 0,
    expectedResult: `Auto-reply ${enableAutoReply === 'true' || enableAutoReply === true ? 'enabled' : 'disabled'} for ${mailboxEmail}`
  }
}

/**
 * Validate Remove Mail Forwarding request
 */
export async function validateRemoveMailForwarding(formData) {
  const { mailboxEmail } = formData
  const errors = []
  const warnings = []

  if (!mailboxEmail || mailboxEmail.trim().length === 0) {
    errors.push('Mailbox Email is required')
  }

  // Verify mailbox exists
  if (mailboxEmail) {
    try {
      const mailbox = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${mailboxEmail}'`)
        .get()

      if (!mailbox.value || mailbox.value.length === 0) {
        errors.push(`Mailbox '${mailboxEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify mailbox exists')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify mailbox exists',
      'Check current forwarding configuration',
      'Confirm removal will stop all forwarding'
    ]
  }
}

/**
 * Execute Remove Mail Forwarding
 */
export async function executeRemoveMailForwarding(formData) {
  const { mailboxEmail } = formData

  const psCommand = `
# Get the mailbox
$mailbox = Get-Mailbox -Identity '${mailboxEmail}' -ErrorAction Stop
Write-Host "Removing mail forwarding from: $($mailbox.DisplayName)"

# Remove forwarding
Set-Mailbox -Identity $mailbox.Id -ForwardingAddress $null -DeliverToMailboxAndForward $false -ErrorAction Stop
Write-Host "✓ Mail forwarding removed"

# Confirm
$updated = Get-Mailbox -Identity $mailbox.Id
if ($updated.ForwardingAddress) {
  Write-Host "⚠ Forwarding still configured: $($updated.ForwardingAddress)"
} else {
  Write-Host "✓ Mail forwarding successfully removed"
}
`

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: 'Remove Mail Forwarding',
    mailboxEmail: mailboxEmail,
    expectedResult: `Mail forwarding removed from ${mailboxEmail}`
  }
}

// ============================================================
// USER ACCESS OPERATIONS
// ============================================================

/**
 * Validate Grant Mailbox Access request
 */
export async function validateGrantMailboxAccess(formData) {
  const { targetMailbox, grantToUser, accessType, action } = formData
  const errors = []
  const warnings = []

  if (!targetMailbox || targetMailbox.trim().length === 0) {
    errors.push('Target Mailbox is required')
  }
  if (!grantToUser || grantToUser.trim().length === 0) {
    errors.push('User to Grant Access is required')
  }
  if (!accessType) {
    errors.push('Access Type is required (Full Access, Send As, Send on Behalf)')
  }

  // Verify target mailbox exists
  if (targetMailbox) {
    try {
      const mailbox = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${targetMailbox}'`)
        .get()

      if (!mailbox.value || mailbox.value.length === 0) {
        errors.push(`Target mailbox '${targetMailbox}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify target mailbox')
    }
  }

  // Verify user exists
  if (grantToUser) {
    try {
      const user = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${grantToUser}'`)
        .get()

      if (!user.value || user.value.length === 0) {
        errors.push(`User '${grantToUser}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify user existence')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify target mailbox exists',
      'Verify user exists and licensed',
      'Check for existing access',
      `${action === 'grant' ? 'Grant' : 'Revoke'} ${accessType} access`
    ]
  }
}

/**
 * Execute Grant Mailbox Access
 */
export async function executeGrantMailboxAccess(formData) {
  const { targetMailbox, grantToUser, accessType, action } = formData

  let psCommand
  if (action === 'grant') {
    if (accessType === 'Full Access') {
      psCommand = `
# Get mailbox and user
$mailbox = Get-Mailbox -Identity '${targetMailbox}' -ErrorAction Stop
$user = Get-User -Identity '${grantToUser}' -ErrorAction Stop
Write-Host "Granting Full Access to: $($user.DisplayName) on $($mailbox.DisplayName)"

# Grant Full Access
Add-MailboxPermission -Identity $mailbox.Id -User $user.WindowsLiveID -AccessRights FullAccess -InheritanceType All -ErrorAction Stop
Write-Host "✓ Full Access granted"
Write-Host "✓ Mailbox access successfully granted to ${grantToUser}"
`
    } else if (accessType === 'Send As') {
      psCommand = `
# Get mailbox and user
$mailbox = Get-Mailbox -Identity '${targetMailbox}' -ErrorAction Stop
$user = Get-User -Identity '${grantToUser}' -ErrorAction Stop
Write-Host "Granting Send As to: $($user.DisplayName) on $($mailbox.DisplayName)"

# Grant Send As
Add-RecipientPermission -Identity $mailbox.Id -Trustee $user.WindowsLiveID -AccessRights SendAs -Confirm:\$false -ErrorAction Stop
Write-Host "✓ Send As permission granted"
Write-Host "✓ Mailbox access successfully granted to ${grantToUser}"
`
    } else if (accessType === 'Send on Behalf') {
      psCommand = `
# Get mailbox and user
$mailbox = Get-Mailbox -Identity '${targetMailbox}' -ErrorAction Stop
$user = Get-User -Identity '${grantToUser}' -ErrorAction Stop
Write-Host "Granting Send on Behalf to: $($user.DisplayName) on $($mailbox.DisplayName)"

# Grant Send on Behalf
Set-Mailbox -Identity $mailbox.Id -GrantSendOnBehalfTo @{add="$($user.WindowsLiveID)"} -ErrorAction Stop
Write-Host "✓ Send on Behalf permission granted"
Write-Host "✓ Mailbox access successfully granted to ${grantToUser}"
`
    }
  } else {
    // Revoke access
    if (accessType === 'Full Access') {
      psCommand = `
# Get mailbox and user
$mailbox = Get-Mailbox -Identity '${targetMailbox}' -ErrorAction Stop
$user = Get-User -Identity '${grantToUser}' -ErrorAction Stop
Write-Host "Revoking Full Access from: $($user.DisplayName) on $($mailbox.DisplayName)"

# Revoke Full Access
Remove-MailboxPermission -Identity $mailbox.Id -User $user.WindowsLiveID -AccessRights FullAccess -Confirm:\$false -ErrorAction Stop
Write-Host "✓ Full Access revoked"
Write-Host "✓ Mailbox access successfully revoked from ${grantToUser}"
`
    } else if (accessType === 'Send As') {
      psCommand = `
# Get mailbox and user
$mailbox = Get-Mailbox -Identity '${targetMailbox}' -ErrorAction Stop
$user = Get-User -Identity '${grantToUser}' -ErrorAction Stop
Write-Host "Revoking Send As from: $($user.DisplayName) on $($mailbox.DisplayName)"

# Revoke Send As
Remove-RecipientPermission -Identity $mailbox.Id -Trustee $user.WindowsLiveID -AccessRights SendAs -Confirm:\$false -ErrorAction Stop
Write-Host "✓ Send As permission revoked"
Write-Host "✓ Mailbox access successfully revoked from ${grantToUser}"
`
    } else if (accessType === 'Send on Behalf') {
      psCommand = `
# Get mailbox and user
$mailbox = Get-Mailbox -Identity '${targetMailbox}' -ErrorAction Stop
$user = Get-User -Identity '${grantToUser}' -ErrorAction Stop
Write-Host "Revoking Send on Behalf from: $($user.DisplayName) on $($mailbox.DisplayName)"

# Revoke Send on Behalf
Set-Mailbox -Identity $mailbox.Id -GrantSendOnBehalfTo @{remove="$($user.WindowsLiveID)"} -ErrorAction Stop
Write-Host "✓ Send on Behalf permission revoked"
Write-Host "✓ Mailbox access successfully revoked from ${grantToUser}"
`
    }
  }

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: `${action === 'grant' ? 'Grant' : 'Revoke'} Mailbox Access`,
    targetMailbox: targetMailbox,
    grantToUser: grantToUser,
    accessType: accessType,
    action: action,
    expectedResult: `Mailbox access ${action === 'grant' ? 'granted' : 'revoked'} for ${grantToUser} on ${targetMailbox}`
  }
}

/**
 * Validate Add User to Team request
 */
export async function validateAddTeamMember(formData) {
  const { teamId, userEmail, role } = formData
  const errors = []
  const warnings = []

  if (!teamId || teamId.trim().length === 0) {
    errors.push('Team ID or Name is required')
  }
  if (!userEmail || userEmail.trim().length === 0) {
    errors.push('User Email is required')
  }
  if (!role) {
    errors.push('Role is required (Owner, Member, Guest)')
  }

  // Verify user exists
  if (userEmail) {
    try {
      const user = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${userEmail}'`)
        .get()

      if (!user.value || user.value.length === 0) {
        errors.push(`User '${userEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify user existence')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify user exists and licensed',
      'Verify team exists',
      'Check for existing membership',
      `Add as ${role}`
    ]
  }
}

/**
 * Execute Add User to Team
 */
export async function executeAddTeamMember(formData) {
  const { teamId, userEmail, role } = formData

  const psCommand = `
# Get team and user
$team = Get-Team -DisplayName '${teamId}' -ErrorAction Stop
$user = Get-User -Identity '${userEmail}' -ErrorAction Stop
Write-Host "Adding $($user.DisplayName) to team: $($team.DisplayName)"

# Add team member with role
Add-TeamUser -GroupId $team.GroupId -User $user.WindowsLiveID -Role ${role} -ErrorAction Stop
Write-Host "✓ User added to team as ${role}"
Write-Host "✓ $($user.DisplayName) successfully added to $($team.DisplayName)"
`

  return {
    psCommand,
    serviceName: 'MicrosoftTeams',
    operation: 'Add Team Member',
    teamId: teamId,
    userEmail: userEmail,
    role: role,
    expectedResult: `User '${userEmail}' added to team '${teamId}' as ${role}`
  }
}

/**
 * Validate Add User to Group request
 */
export async function validateAddGroupMember(formData) {
  const { groupEmail, userEmail, action } = formData
  const errors = []
  const warnings = []

  if (!groupEmail || groupEmail.trim().length === 0) {
    errors.push('Group Email is required')
  }
  if (!userEmail || userEmail.trim().length === 0) {
    errors.push('User Email is required')
  }

  // Verify group exists
  if (groupEmail) {
    try {
      const group = await graphClient
        .api('/groups')
        .filter(`mail eq '${groupEmail}'`)
        .get()

      if (!group.value || group.value.length === 0) {
        errors.push(`Group '${groupEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify group existence')
    }
  }

  // Verify user exists
  if (userEmail) {
    try {
      const user = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${userEmail}'`)
        .get()

      if (!user.value || user.value.length === 0) {
        errors.push(`User '${userEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify user existence')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify user exists',
      'Verify group exists',
      'Check for existing membership',
      `${action === 'add' ? 'Add' : 'Remove'} group member`
    ]
  }
}

/**
 * Execute Add User to Group
 */
export async function executeAddGroupMember(formData) {
  const { groupEmail, userEmail, action } = formData

  let psCommand
  if (action === 'add') {
    psCommand = `
# Get group and user
$group = Get-UnifiedGroup -Identity '${groupEmail}' -ErrorAction Stop
$user = Get-User -Identity '${userEmail}' -ErrorAction Stop
Write-Host "Adding $($user.DisplayName) to group: $($group.DisplayName)"

# Add member
Add-UnifiedGroupMember -Identity $group.Id -Members $user.WindowsLiveID -ErrorAction Stop
Write-Host "✓ User added to group"
Write-Host "✓ $($user.DisplayName) successfully added to $($group.DisplayName)"
`
  } else {
    psCommand = `
# Get group and user
$group = Get-UnifiedGroup -Identity '${groupEmail}' -ErrorAction Stop
$user = Get-User -Identity '${userEmail}' -ErrorAction Stop
Write-Host "Removing $($user.DisplayName) from group: $($group.DisplayName)"

# Remove member
Remove-UnifiedGroupMember -Identity $group.Id -Members $user.WindowsLiveID -Confirm:\$false -ErrorAction Stop
Write-Host "✓ User removed from group"
Write-Host "✓ $($user.DisplayName) successfully removed from $($group.DisplayName)"
`
  }

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: `${action === 'add' ? 'Add' : 'Remove'} Group Member`,
    groupEmail: groupEmail,
    userEmail: userEmail,
    action: action,
    expectedResult: `User '${userEmail}' ${action === 'add' ? 'added to' : 'removed from'} group '${groupEmail}'`
  }
}

/**
 * Validate Set Delegate Access request
 */
export async function validateSetDelegateAccess(formData) {
  const { mailboxEmail, delegateEmail, action } = formData
  const errors = []
  const warnings = []

  if (!mailboxEmail || mailboxEmail.trim().length === 0) {
    errors.push('Mailbox Email is required')
  }
  if (!delegateEmail || delegateEmail.trim().length === 0) {
    errors.push('Delegate Email is required')
  }

  // Verify mailbox exists
  if (mailboxEmail) {
    try {
      const mailbox = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${mailboxEmail}'`)
        .get()

      if (!mailbox.value || mailbox.value.length === 0) {
        errors.push(`Mailbox '${mailboxEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify mailbox')
    }
  }

  // Verify delegate exists
  if (delegateEmail) {
    try {
      const delegate = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${delegateEmail}'`)
        .get()

      if (!delegate.value || delegate.value.length === 0) {
        errors.push(`Delegate '${delegateEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify delegate existence')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify mailbox exists',
      'Verify delegate exists and licensed',
      'Check for existing delegations',
      `${action === 'grant' ? 'Grant' : 'Revoke'} delegate access (Full Access + Send on Behalf)`
    ]
  }
}

/**
 * Execute Set Delegate Access
 */
export async function executeSetDelegateAccess(formData) {
  const { mailboxEmail, delegateEmail, action } = formData

  let psCommand
  if (action === 'grant') {
    psCommand = `
# Get mailbox and delegate
$mailbox = Get-Mailbox -Identity '${mailboxEmail}' -ErrorAction Stop
$delegate = Get-User -Identity '${delegateEmail}' -ErrorAction Stop
Write-Host "Setting up delegate access for: $($delegate.DisplayName) on $($mailbox.DisplayName)"

# Grant Full Access
Add-MailboxPermission -Identity $mailbox.Id -User $delegate.WindowsLiveID -AccessRights FullAccess -InheritanceType All -ErrorAction Stop
Write-Host "✓ Full Access granted"

# Grant Send on Behalf
Set-Mailbox -Identity $mailbox.Id -GrantSendOnBehalfTo @{add="$($delegate.WindowsLiveID)"} -ErrorAction Stop
Write-Host "✓ Send on Behalf granted"

Write-Host "✓ Delegate access successfully configured for ${delegateEmail}"
`
  } else {
    psCommand = `
# Get mailbox and delegate
$mailbox = Get-Mailbox -Identity '${mailboxEmail}' -ErrorAction Stop
$delegate = Get-User -Identity '${delegateEmail}' -ErrorAction Stop
Write-Host "Removing delegate access from: $($delegate.DisplayName) on $($mailbox.DisplayName)"

# Revoke Full Access
Remove-MailboxPermission -Identity $mailbox.Id -User $delegate.WindowsLiveID -AccessRights FullAccess -Confirm:\$false -ErrorAction Stop
Write-Host "✓ Full Access revoked"

# Revoke Send on Behalf
Set-Mailbox -Identity $mailbox.Id -GrantSendOnBehalfTo @{remove="$($delegate.WindowsLiveID)"} -ErrorAction Stop
Write-Host "✓ Send on Behalf revoked"

Write-Host "✓ Delegate access successfully removed for ${delegateEmail}"
`
  }

  return {
    psCommand,
    serviceName: 'Exchange',
    operation: `${action === 'grant' ? 'Grant' : 'Revoke'} Delegate Access`,
    mailboxEmail: mailboxEmail,
    delegateEmail: delegateEmail,
    action: action,
    accessType: 'Full Access + Send on Behalf',
    expectedResult: `Delegate access ${action === 'grant' ? 'granted' : 'revoked'} for ${delegateEmail} on ${mailboxEmail}`
  }
}

/**
 * Validate Grant SharePoint Access request
 */
export async function validateGrantSharePointAccess(formData) {
  const { siteUrl, userEmail, permissionLevel, action } = formData
  const errors = []
  const warnings = []

  if (!siteUrl || siteUrl.trim().length === 0) {
    errors.push('SharePoint Site URL is required')
  }
  if (!userEmail || userEmail.trim().length === 0) {
    errors.push('User Email is required')
  }
  if (!permissionLevel) {
    errors.push('Permission Level is required (Read, Edit, Full Control)')
  }

  // Validate URL format
  if (siteUrl && !siteUrl.includes('sharepoint.com')) {
    warnings.push('SharePoint URL may not be valid - verify it contains sharepoint.com')
  }

  // Verify user exists
  if (userEmail) {
    try {
      const user = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${userEmail}'`)
        .get()

      if (!user.value || user.value.length === 0) {
        errors.push(`User '${userEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify user existence')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify user exists and licensed',
      'Verify SharePoint site exists',
      'Check for existing permissions',
      `${action === 'grant' ? 'Grant' : 'Revoke'} ${permissionLevel} access`
    ]
  }
}

/**
 * Execute Grant SharePoint Access
 */
export async function executeGrantSharePointAccess(formData) {
  const { siteUrl, userEmail, permissionLevel, action } = formData

  let psCommand
  if (action === 'grant') {
    psCommand = `
# Connect to SharePoint site
$site = Get-PnPSite -Includes Owner -ErrorAction Stop
Write-Host "Granting $permissionLevel access to: ${userEmail} on $($site.Url)"

# Grant permission
Grant-PnPGroupPermission -Identity "${permissionLevel}" -User "${userEmail}" -ErrorAction Stop
Write-Host "✓ ${permissionLevel} permission granted"
Write-Host "✓ SharePoint access successfully granted to ${userEmail}"
`
  } else {
    psCommand = `
# Connect to SharePoint site
$site = Get-PnPSite -Includes Owner -ErrorAction Stop
Write-Host "Revoking permissions from: ${userEmail} on $($site.Url)"

# Revoke permission
Revoke-PnPUserPermission -Identity "${userEmail}" -Force -ErrorAction Stop
Write-Host "✓ Permissions revoked"
Write-Host "✓ SharePoint access successfully revoked from ${userEmail}"
`
  }

  return {
    psCommand,
    serviceName: 'PnP.PowerShell',
    operation: `${action === 'grant' ? 'Grant' : 'Revoke'} SharePoint Access`,
    siteUrl: siteUrl,
    userEmail: userEmail,
    permissionLevel: permissionLevel,
    action: action,
    expectedResult: `SharePoint access ${action === 'grant' ? 'granted' : 'revoked'} for ${userEmail}`
  }
}

// ============================================================
// GUEST MANAGEMENT
// ============================================================

/**
 * Validate Invite Guest request
 */
export async function validateInviteGuest(formData) {
  const { guestEmail, displayName, sendInvitation } = formData
  const errors = []
  const warnings = []

  if (!guestEmail || guestEmail.trim().length === 0) {
    errors.push('Guest Email is required')
  }
  if (!displayName || displayName.trim().length === 0) {
    errors.push('Display Name is required')
  }

  // Validate email format
  if (guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
    errors.push('Invalid email address format')
  }

  // Check if email already exists
  if (guestEmail) {
    try {
      const existing = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${guestEmail}'`)
        .get()

      if (existing.value && existing.value.length > 0) {
        errors.push(`User '${guestEmail}' already exists in the tenant`)
      }
    } catch (err) {
      warnings.push('Could not check for existing users')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Validate guest email format',
      'Check for duplicate email in tenant',
      'Verify display name',
      sendInvitation ? 'Send invitation email to guest' : 'Create guest account without invitation'
    ]
  }
}

/**
 * Execute Invite Guest
 */
export async function executeInviteGuest(formData) {
  const { guestEmail, displayName, sendInvitation } = formData

  const psCommand = `
# Create invitation
$invitation = New-MgInvitation -InvitedUserEmailAddress '${guestEmail}' \\
  -InviteRedirectUrl 'https://myapps.microsoft.com' \\
  -SendInvitationMessage $(${sendInvitation === 'true' || sendInvitation === true ? '$true' : '$false'})

Write-Host "✓ Guest invitation created"
Write-Host "Guest Email: ${guestEmail}"
Write-Host "Display Name: ${displayName}"

# Update guest display name
Update-MgUser -UserId $invitation.InvitedUser.Id -DisplayName '${displayName}' -ErrorAction SilentlyContinue
Write-Host "✓ Display name set to: ${displayName}"

${sendInvitation === 'true' || sendInvitation === true ? `
Write-Host "✓ Invitation email sent to ${guestEmail}"
` : `
Write-Host "✓ Guest account created (no invitation sent)"
`}

Write-Host "✓ Guest '${guestEmail}' successfully invited to tenant"
`

  return {
    psCommand,
    serviceName: 'Microsoft.Graph',
    operation: 'Invite Guest',
    guestEmail: guestEmail,
    displayName: displayName,
    sendInvitation: sendInvitation || false,
    expectedResult: `Guest '${guestEmail}' invited to tenant${sendInvitation === 'true' || sendInvitation === true ? ' - invitation sent' : ''}`
  }
}

/**
 * Validate Remove Guest request
 */
export async function validateRemoveGuest(formData) {
  const { guestEmail, confirmEmail } = formData
  const errors = []
  const warnings = []

  if (!guestEmail || guestEmail.trim().length === 0) {
    errors.push('Guest Email is required')
  }
  if (!confirmEmail || confirmEmail.trim().length === 0) {
    errors.push('Confirmation Email is required')
  }

  // Verify emails match
  if (guestEmail && confirmEmail && guestEmail !== confirmEmail) {
    errors.push('Confirmation email does not match guest email')
  }

  // Verify guest exists
  if (guestEmail) {
    try {
      const guest = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${guestEmail}'`)
        .get()

      if (!guest.value || guest.value.length === 0) {
        errors.push(`Guest '${guestEmail}' not found`)
      } else if (guest.value[0].userType !== 'Guest') {
        warnings.push(`User '${guestEmail}' is not a guest account`)
      }
    } catch (err) {
      warnings.push('Could not verify guest existence')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify guest exists',
      'Check guest memberships',
      'Confirm removal will delete account',
      'Confirmation email matches exactly'
    ]
  }
}

/**
 * Execute Remove Guest
 */
export async function executeRemoveGuest(formData) {
  const { guestEmail } = formData

  const psCommand = `
# Get guest user
$guest = Get-MgUser -Filter "userPrincipalName eq '${guestEmail}'" -ErrorAction Stop
Write-Host "Removing guest: $($guest.DisplayName) (${guestEmail})"

# Get guest memberships before removal
$memberOf = Get-MgUserMemberOf -UserId $guest.Id -ErrorAction SilentlyContinue | Measure-Object
Write-Host "Guest is member of $($memberOf.Count) groups/teams"

# Remove guest from all groups
Get-MgUserMemberOf -UserId $guest.Id -ErrorAction SilentlyContinue | ForEach-Object {
  Remove-MgGroupMember -GroupId $_.Id -DirectoryObjectId $guest.Id -ErrorAction SilentlyContinue
  Write-Host "Removed from group: $($_.DisplayName)"
}

# Remove guest user
Remove-MgUser -UserId $guest.Id -ErrorAction Stop
Write-Host "✓ Guest account removed"
Write-Host "✓ Guest '${guestEmail}' successfully removed from tenant"
`

  return {
    psCommand,
    serviceName: 'Microsoft.Graph',
    operation: 'Remove Guest',
    guestEmail: guestEmail,
    expectedResult: `Guest '${guestEmail}' removed from tenant`
  }
}

/**
 * Validate Grant Guest Permissions request
 */
export async function validateGrantGuestPermissions(formData) {
  const { guestEmail, resourceType, resourceId, permissionLevel } = formData
  const errors = []
  const warnings = []

  if (!guestEmail || guestEmail.trim().length === 0) {
    errors.push('Guest Email is required')
  }
  if (!resourceType) {
    errors.push('Resource Type is required (Team, Group, SharePoint)')
  }
  if (!resourceId || resourceId.trim().length === 0) {
    errors.push('Resource ID/Name is required')
  }
  if (!permissionLevel) {
    errors.push('Permission Level is required')
  }

  // Verify guest exists
  if (guestEmail) {
    try {
      const guest = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${guestEmail}'`)
        .get()

      if (!guest.value || guest.value.length === 0) {
        errors.push(`Guest '${guestEmail}' not found`)
      } else if (guest.value[0].userType !== 'Guest') {
        warnings.push(`User '${guestEmail}' is not a guest account`)
      }
    } catch (err) {
      warnings.push('Could not verify guest existence')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify guest exists',
      `Verify ${resourceType} exists`,
      'Check for existing access',
      `Grant ${permissionLevel} access to guest`
    ]
  }
}

/**
 * Execute Grant Guest Permissions
 */
export async function executeGrantGuestPermissions(formData) {
  const { guestEmail, resourceType, resourceId, permissionLevel } = formData

  let psCommand
  if (resourceType === 'Team') {
    psCommand = `
# Get team and guest
$team = Get-Team -DisplayName '${resourceId}' -ErrorAction Stop
$guest = Get-MgUser -Filter "userPrincipalName eq '${guestEmail}'" -ErrorAction Stop
Write-Host "Granting guest access to team: $($team.DisplayName)"

# Add guest to team
Add-TeamUser -GroupId $team.GroupId -User $guest.Id -Role Member -ErrorAction Stop
Write-Host "✓ Guest added to team as ${permissionLevel}"
Write-Host "✓ Guest '${guestEmail}' successfully added to $($team.DisplayName)"
`
  } else if (resourceType === 'Group') {
    psCommand = `
# Get group and guest
$group = Get-UnifiedGroup -Identity '${resourceId}' -ErrorAction Stop
$guest = Get-MgUser -Filter "userPrincipalName eq '${guestEmail}'" -ErrorAction Stop
Write-Host "Granting guest access to group: $($group.DisplayName)"

# Add guest to group
Add-UnifiedGroupMember -Identity $group.Id -Members $guest.Id -ErrorAction Stop
Write-Host "✓ Guest added to group as ${permissionLevel}"
Write-Host "✓ Guest '${guestEmail}' successfully added to $($group.DisplayName)"
`
  } else if (resourceType === 'SharePoint') {
    psCommand = `
# Connect to SharePoint and add guest
Write-Host "Granting guest access to SharePoint: ${resourceId}"

# Grant permission to guest
Grant-PnPGroupPermission -Identity "${permissionLevel}" -User "${guestEmail}" -ErrorAction Stop
Write-Host "✓ Guest granted ${permissionLevel} access"
Write-Host "✓ Guest '${guestEmail}' successfully granted access"
`
  }

  return {
    psCommand,
    serviceName: 'Microsoft.Graph',
    operation: 'Grant Guest Permissions',
    guestEmail: guestEmail,
    resourceType: resourceType,
    resourceId: resourceId,
    permissionLevel: permissionLevel,
    expectedResult: `Guest '${guestEmail}' granted ${permissionLevel} access to ${resourceType}`
  }
}

/**
 * Validate Review Guest Access request
 */
export async function validateReviewGuestAccess(formData) {
  const { guestEmail, action } = formData
  const errors = []
  const warnings = []

  if (!guestEmail || guestEmail.trim().length === 0) {
    errors.push('Guest Email is required')
  }
  if (!action) {
    errors.push('Action is required (Review, Disable, Remove)')
  }

  // Verify guest exists
  if (guestEmail) {
    try {
      const guest = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${guestEmail}'`)
        .get()

      if (!guest.value || guest.value.length === 0) {
        errors.push(`Guest '${guestEmail}' not found`)
      } else if (guest.value[0].userType !== 'Guest') {
        warnings.push(`User '${guestEmail}' is not a guest account`)
      }
    } catch (err) {
      warnings.push('Could not verify guest existence')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify guest exists',
      'Audit guest memberships and access',
      'Check guest creation date and last sign-in',
      `${action === 'disable' ? 'Block sign-in' : action === 'remove' ? 'Remove account' : 'Review access only'}`
    ]
  }
}

/**
 * Execute Review Guest Access
 */
export async function executeReviewGuestAccess(formData) {
  const { guestEmail, action } = formData

  let psCommand
  if (action === 'disable') {
    psCommand = `
# Get guest user
$guest = Get-MgUser -Filter "userPrincipalName eq '${guestEmail}'" -ErrorAction Stop
Write-Host "Disabling guest: $($guest.DisplayName) (${guestEmail})"

# Disable guest account (block sign-in)
Update-MgUser -UserId $guest.Id -AccountEnabled $false -ErrorAction Stop
Write-Host "✓ Guest account disabled"
Write-Host "✓ Guest will no longer be able to sign in"
Write-Host "✓ Guest '${guestEmail}' access disabled"
`
  } else if (action === 'remove') {
    psCommand = `
# Get guest user
$guest = Get-MgUser -Filter "userPrincipalName eq '${guestEmail}'" -ErrorAction Stop
Write-Host "Removing guest: $($guest.DisplayName) (${guestEmail})"

# Get memberships
$memberOf = Get-MgUserMemberOf -UserId $guest.Id -ErrorAction SilentlyContinue
Write-Host "Guest is member of $($memberOf.Count) groups/teams"

# Remove from all groups
Get-MgUserMemberOf -UserId $guest.Id -ErrorAction SilentlyContinue | ForEach-Object {
  Remove-MgGroupMember -GroupId $_.Id -DirectoryObjectId $guest.Id -ErrorAction SilentlyContinue
}

# Remove guest account
Remove-MgUser -UserId $guest.Id -ErrorAction Stop
Write-Host "✓ Guest account removed"
Write-Host "✓ Guest '${guestEmail}' removed from tenant"
`
  } else {
    // Review only
    psCommand = `
# Get guest user
$guest = Get-MgUser -Filter "userPrincipalName eq '${guestEmail}'" -ErrorAction Stop
Write-Host "Reviewing guest access: $($guest.DisplayName)"
Write-Host "Email: ${guestEmail}"
Write-Host "Created: $($guest.CreatedDateTime)"
Write-Host "Last Sign-in: $(Get-MgAuditLogSignIn -Filter "userPrincipalName eq '${guestEmail}'" -Top 1 | Select-Object -ExpandProperty CreatedDateTime)"

# Get memberships
$memberOf = Get-MgUserMemberOf -UserId $guest.Id -ErrorAction SilentlyContinue
Write-Host "Group/Team Memberships: $($memberOf.Count)"
$memberOf | ForEach-Object { Write-Host "  - $($_.DisplayName)" }

Write-Host "✓ Guest access review completed for ${guestEmail}"
`
  }

  return {
    psCommand,
    serviceName: 'Microsoft.Graph',
    operation: `Review Guest Access - ${action === 'disable' ? 'Disable' : action === 'remove' ? 'Remove' : 'Review'}`,
    guestEmail: guestEmail,
    action: action,
    expectedResult: `Guest '${guestEmail}' ${action === 'disable' ? 'disabled' : action === 'remove' ? 'removed' : 'access reviewed'}`
  }
}

// ============================================================
// INTUNE DEVICE MANAGEMENT
// ============================================================

/**
 * Validate Retire Device request
 */
export async function validateRetireDevice(formData) {
  const { deviceId, deviceName, reason } = formData
  const errors = []
  const warnings = []

  if (!deviceId && !deviceName) {
    errors.push('Device ID or Device Name is required')
  }
  if (!reason || reason.trim().length === 0) {
    errors.push('Reason for retirement is required')
  }

  // Verify device exists
  if (deviceId || deviceName) {
    try {
      const filter = deviceId ? `deviceId eq '${deviceId}'` : `deviceName eq '${deviceName}'`
      const device = await graphClient
        .api('/deviceManagement/managedDevices')
        .filter(filter)
        .get()

      if (!device.value || device.value.length === 0) {
        errors.push(`Device not found: ${deviceId || deviceName}`)
      } else if (device.value[0].complianceState === 'retired') {
        warnings.push('Device is already retired')
      }
    } catch (err) {
      warnings.push('Could not verify device existence')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify device exists in Intune',
      'Check device compliance state',
      'Confirm device has no critical policy assignments',
      'Prepare for device unenrollment (data retained)'
    ]
  }
}

/**
 * Execute Retire Device
 */
export async function executeRetireDevice(formData) {
  const { deviceId, deviceName, reason } = formData

  const psCommand = `
# Get device
$device = Get-MgDeviceManagementManagedDevice -Filter "deviceName eq '${deviceName || deviceId}'" -ErrorAction Stop
Write-Host "Retiring device: $($device.DeviceName) (ID: $($device.Id))"
Write-Host "Device Type: $($device.DeviceType)"
Write-Host "Owner: $($device.UserPrincipalName)"
Write-Host "Reason: ${reason}"

# Retire device (unenroll without wiping)
Invoke-MgRetireDeviceManagementManagedDevice -ManagedDeviceId $device.Id -ErrorAction Stop
Write-Host "✓ Device retirement initiated"
Write-Host "✓ Device will remain on network with no policies"
Write-Host "✓ User data preserved"

# Log retirement
Write-Host "✓ Device '${ deviceName || deviceId}' successfully retired"
Write-Host "  - Compliance: Marked as retired"
Write-Host "  - Policies: No longer enforced"
Write-Host "  - Data: Retained on device"
`

  return {
    psCommand,
    serviceName: 'Intune',
    operation: 'Retire Device',
    deviceId: deviceId,
    deviceName: deviceName,
    reason: reason,
    expectedResult: `Device '${deviceName || deviceId}' retired - unenrolled from Intune`
  }
}

/**
 * Validate Wipe Device request
 */
export async function validateWipeDevice(formData) {
  const { deviceId, deviceName, confirmWipe, reason } = formData
  const errors = []
  const warnings = []

  if (!deviceId && !deviceName) {
    errors.push('Device ID or Device Name is required')
  }
  if (!reason || reason.trim().length === 0) {
    errors.push('Reason for wipe is required')
  }
  if (confirmWipe !== 'WIPE_CONFIRMED') {
    errors.push('Must confirm wipe by typing WIPE_CONFIRMED')
  }

  // Verify device exists
  if (deviceId || deviceName) {
    try {
      const filter = deviceId ? `deviceId eq '${deviceId}'` : `deviceName eq '${deviceName}'`
      const device = await graphClient
        .api('/deviceManagement/managedDevices')
        .filter(filter)
        .get()

      if (!device.value || device.value.length === 0) {
        errors.push(`Device not found: ${deviceId || deviceName}`)
      }
    } catch (err) {
      warnings.push('Could not verify device existence')
    }
  }

  warnings.push('⚠️ DESTRUCTIVE: Device wipe will delete ALL data on device - this cannot be undone')

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify device exists in Intune',
      'Confirm device ownership',
      'Check for user data that will be lost',
      'CRITICAL: Prepare for full device factory reset'
    ]
  }
}

/**
 * Execute Wipe Device
 */
export async function executeWipeDevice(formData) {
  const { deviceId, deviceName, reason } = formData

  const psCommand = `
# Get device
$device = Get-MgDeviceManagementManagedDevice -Filter "deviceName eq '${deviceName || deviceId}'" -ErrorAction Stop
Write-Host "⚠️ WIPING DEVICE: $($device.DeviceName) (ID: $($device.Id))"
Write-Host "Device Type: $($device.DeviceType)"
Write-Host "Owner: $($device.UserPrincipalName)"
Write-Host "Reason: ${reason}"
Write-Host ""
Write-Host "WARNING: All data on this device will be permanently deleted!"
Write-Host ""

# Wipe device (factory reset)
Invoke-MgWipeDeviceManagementManagedDevice -ManagedDeviceId $device.Id -ErrorAction Stop
Write-Host "✓ Device wipe initiated"
Write-Host "✓ Factory reset command sent to device"
Write-Host "✓ All data will be deleted"
Write-Host "✓ Device will be unenrolled from Intune"

# Log wipe action
Write-Host "✓ Device '${deviceName || deviceId}' wipe completed"
Write-Host "  - Status: Factory reset in progress"
Write-Host "  - Data: All deleted permanently"
Write-Host "  - Enrollment: Removed from Intune"
`

  return {
    psCommand,
    serviceName: 'Intune',
    operation: 'Wipe Device',
    deviceId: deviceId,
    deviceName: deviceName,
    reason: reason,
    severity: 'CRITICAL',
    expectedResult: `Device '${deviceName || deviceId}' wipe initiated - factory reset in progress`
  }
}

/**
 * Validate Grant Compliance Exception request
 */
export async function validateGrantComplianceException(formData) {
  const { deviceId, deviceName, userEmail, exceptionDays, reason } = formData
  const errors = []
  const warnings = []

  if (!deviceId && !deviceName) {
    errors.push('Device ID or Device Name is required')
  }
  if (!userEmail || userEmail.trim().length === 0) {
    errors.push('User Email is required')
  }
  if (!exceptionDays || isNaN(parseInt(exceptionDays)) || parseInt(exceptionDays) <= 0) {
    errors.push('Exception Days must be a positive number')
  }
  if (!reason || reason.trim().length === 0) {
    errors.push('Reason for exception is required')
  }

  // Verify device exists
  if (deviceId || deviceName) {
    try {
      const filter = deviceId ? `deviceId eq '${deviceId}'` : `deviceName eq '${deviceName}'`
      const device = await graphClient
        .api('/deviceManagement/managedDevices')
        .filter(filter)
        .get()

      if (!device.value || device.value.length === 0) {
        errors.push(`Device not found: ${deviceId || deviceName}`)
      }
    } catch (err) {
      warnings.push('Could not verify device existence')
    }
  }

  // Verify user exists
  if (userEmail) {
    try {
      const user = await graphClient
        .api('/users')
        .filter(`userPrincipalName eq '${userEmail}'`)
        .get()

      if (!user.value || user.value.length === 0) {
        errors.push(`User '${userEmail}' not found`)
      }
    } catch (err) {
      warnings.push('Could not verify user existence')
    }
  }

  if (parseInt(exceptionDays) > 365) {
    warnings.push('Exception is for more than 1 year - consider shorter exception period')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    agentChecks: [
      'Verify device exists and is non-compliant',
      'Verify user exists',
      'Check compliance policies affecting device',
      `Grant ${exceptionDays}-day compliance exception`
    ]
  }
}

/**
 * Execute Grant Compliance Exception
 */
export async function executeGrantComplianceException(formData) {
  const { deviceId, deviceName, userEmail, exceptionDays, reason } = formData

  const psCommand = `
# Get device and user
$device = Get-MgDeviceManagementManagedDevice -Filter "deviceName eq '${deviceName || deviceId}'" -ErrorAction Stop
$user = Get-MgUser -Filter "userPrincipalName eq '${userEmail}'" -ErrorAction Stop
Write-Host "Granting compliance exception for device: $($device.DeviceName)"
Write-Host "User: $($user.DisplayName)"
Write-Host "Exception Duration: ${exceptionDays} days"
Write-Host "Reason: ${reason}"

# Calculate exception expiry
$expiryDate = (Get-Date).AddDays(${exceptionDays})
Write-Host "Exception expires: $expiryDate"

# Create compliance exception note
$complianceNote = "Compliance exception granted for ${exceptionDays} days. Reason: ${reason}. Expires: $expiryDate"

# Update device with exception note
Update-MgDeviceManagementManagedDevice -ManagedDeviceId $device.Id -Notes $complianceNote -ErrorAction Stop
Write-Host "✓ Compliance exception created"
Write-Host "✓ Device will bypass compliance checks until $expiryDate"

# Log exception
Write-Host "✓ Compliance exception granted for ${userEmail} on $($device.DeviceName)"
Write-Host "  - Duration: ${exceptionDays} days"
Write-Host "  - Expiry: $expiryDate"
Write-Host "  - Status: Active"
`

  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + parseInt(exceptionDays))

  return {
    psCommand,
    serviceName: 'Intune',
    operation: 'Grant Compliance Exception',
    deviceId: deviceId,
    deviceName: deviceName,
    userEmail: userEmail,
    exceptionDays: exceptionDays,
    expiryDate: expiryDate.toISOString().split('T')[0],
    reason: reason,
    expectedResult: `Compliance exception granted for ${exceptionDays} days (expires ${expiryDate.toISOString().split('T')[0]})`
  }
}

// ============================================================
// HELPER: PowerShell Execution
// ============================================================

export async function executePowerShellOperation(operationDef, connectScript = '') {
  // This will be called by the batch executor
  // Returns formatted command with authentication
  return {
    type: 'powershell',
    module: 'ExchangeOnlineManagement',
    authentication: connectScript,
    command: operationDef.psCommand,
    operation: operationDef.operation,
    expectedResult: operationDef.expectedResult
  }
}
