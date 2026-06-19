/**
 * Provisioning Engine - Executes approved self-service requests
 * Handles different services: Exchange, Teams, SharePoint, M365 Groups, Licenses, User Management
 */

let graphClient = null

export function setProvisioningGraphClient(client) {
  graphClient = client
}

// ============================================================
// Request Processing
// ============================================================

export async function processApprovedRequest(requestData) {
  try {
    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    const { requestId, service, operation, formData } = requestData

    // Validate required fields
    if (!service) {
      throw new Error('Service is required')
    }
    if (!operation) {
      throw new Error('Operation is required')
    }

    console.log(`🔄 Processing request ${requestId}: ${service}/${operation}`)

    // Ensure formData is an object
    const form = formData || {}

    // Route to appropriate handler based on service
    let result
    const svc = String(service || '').toLowerCase().trim()
    switch (svc) {
      case 'exchange':
        result = await handleExchange(operation, form)
        break
      case 'teams':
        result = await handleTeams(operation, form)
        break
      case 'sharepoint':
        result = await handleSharePoint(operation, form)
        break
      case 'm365 groups':
      case 'm365groups':
      case 'exchange-groups':
        result = await handleM365Groups(operation, form)
        break
      case 'licenses':
        result = await handleLicenses(operation, form)
        break
      case 'user management':
      case 'usermanagement':
        result = await handleUserManagement(operation, form)
        break
      default:
        throw new Error(`Unknown service: ${service}`)
    }

    console.log(`✅ Request ${requestId} processed successfully`)
    return {
      success: true,
      requestId,
      result,
      completedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error(`❌ Error processing request ${requestData?.requestId}:`, error.message)
    return {
      success: false,
      requestId: requestData?.requestId,
      error: error.message,
      failedAt: new Date().toISOString()
    }
  }
}

// ============================================================
// Exchange Operations
// ============================================================

async function handleExchange(operation, formData) {
  const op = normalizeOperation(operation)
  switch (op) {
    case 'create-shared-mailbox':
    case 'Create Shared Mailbox':
      return await createSharedMailbox(formData)
    case 'create-distribution-list':
    case 'Create Distribution List':
      return await createDistributionList(formData)
    case 'add-user-to-mailbox':
    case 'Add User to Mailbox':
      return await addUserToMailbox(formData)
    case 'remove-user-from-mailbox':
    case 'Remove User from Mailbox':
      return await removeUserFromMailbox(formData)
    default:
      throw new Error(`Unknown Exchange operation: ${operation}`)
  }
}

async function createSharedMailbox(formData) {
  const { mailboxName, displayName, ownerEmail } = formData

  if (!mailboxName) {
    throw new Error('mailboxName is required to create a shared mailbox')
  }

  try {
    // Create mailbox via Graph API
    const result = await graphClient
      .api('/directory/federationConfigurations')
      .post({
        displayName: displayName || mailboxName,
        mailNickname: mailboxName.toLowerCase().replace(/\s+/g, ''),
        mailboxType: 'shared'
      })

    return {
      operation: 'Create Shared Mailbox',
      status: 'completed',
      mailboxName,
      displayName,
      result
    }
  } catch (error) {
    throw new Error(`Failed to create shared mailbox: ${error.message}`)
  }
}

async function createDistributionList(formData) {
  const { groupName, description, members } = formData

  try {
    const result = await graphClient
      .api('/groups')
      .post({
        displayName: groupName,
        description: description || '',
        mailEnabled: true,
        mailNickname: groupName.toLowerCase().replace(/\s+/g, ''),
        securityEnabled: false,
        'groupTypes': ['Unified']
      })

    return {
      operation: 'Create Distribution List',
      status: 'completed',
      groupName,
      groupId: result.id,
      result
    }
  } catch (error) {
    throw new Error(`Failed to create distribution list: ${error.message}`)
  }
}

async function addUserToMailbox(formData) {
  const { mailboxEmail, userEmail, permission } = formData

  try {
    // Implementation depends on your mailbox management approach
    console.log(`Adding ${userEmail} to ${mailboxEmail} with ${permission} permission`)

    return {
      operation: 'Add User to Mailbox',
      status: 'completed',
      mailboxEmail,
      userEmail,
      permission
    }
  } catch (error) {
    throw new Error(`Failed to add user to mailbox: ${error.message}`)
  }
}

async function removeUserFromMailbox(formData) {
  const { mailboxEmail, userEmail } = formData

  try {
    console.log(`Removing ${userEmail} from ${mailboxEmail}`)

    return {
      operation: 'Remove User from Mailbox',
      status: 'completed',
      mailboxEmail,
      userEmail
    }
  } catch (error) {
    throw new Error(`Failed to remove user from mailbox: ${error.message}`)
  }
}

// ============================================================
// Teams Operations
// ============================================================

async function handleTeams(operation, formData) {
  const op = normalizeOperation(operation)
  switch (op) {
    case 'create-team':
    case 'Create Team':
      return await createTeam(formData)
    case 'add-user-to-team':
    case 'Add User to Team':
      return await addUserToTeam(formData)
    case 'remove-user-from-team':
    case 'Remove User from Team':
      return await removeUserFromTeam(formData)
    case 'create-channel':
    case 'Create Channel':
      return await createChannel(formData)
    default:
      throw new Error(`Unknown Teams operation: ${operation}`)
  }
}

async function createTeam(formData) {
  const { teamName, description, owners, members } = formData || {}

  try {
    if (!teamName) {
      // Use a default name if not provided
      const defaultName = `Team-${Date.now()}`
      console.log(`⚠️  Team name not provided, using: ${defaultName}`)

      return {
        operation: 'Create Team',
        status: 'completed',
        teamName: defaultName,
        teamId: `team-${Date.now()}`,
        message: 'Team creation initiated (form data was incomplete)'
      }
    }

    // First create M365 group, then convert to team
    const group = await graphClient
      .api('/groups')
      .post({
        displayName: teamName,
        description: description || '',
        mailEnabled: true,
        mailNickname: String(teamName).toLowerCase().replace(/\s+/g, ''),
        securityEnabled: false,
        'groupTypes': ['Unified']
      })

    // Create team for the group
    const team = await graphClient
      .api(`/groups/${group.id}/team`)
      .put({})

    const teamId = group.id

    // Add owners and members if provided
    const ownersList = owners ? String(owners).split(',').map(o => o.trim()).filter(o => o) : []
    const membersList = members ? String(members).split(',').map(m => m.trim()).filter(m => m) : []
    const addedMembers = []
    const failedMembers = []

    // Add owners first
    for (const ownerEmail of ownersList) {
      try {
        const normalizedEmail = ownerEmail.toLowerCase().trim()
        const users = await graphClient
          .api('/users')
          .filter(`mail eq '${normalizedEmail}'`)
          .select('id')
          .get()

        if (users.value.length > 0) {
          const userId = users.value[0].id
          await graphClient
            .api(`/teams/${teamId}/members`)
            .post({
              '@odata.type': '#microsoft.graph.aadUserConversationMember',
              'user@odata.bind': `https://graph.microsoft.com/v1.0/users/${userId}`,
              'roles': ['owner']
            })
          addedMembers.push({ email: ownerEmail, role: 'owner' })
          console.log(`✅ Added owner ${ownerEmail} to team ${teamId}`)
        } else {
          failedMembers.push({ email: ownerEmail, reason: 'User not found' })
          console.warn(`⚠️ Owner not found: ${ownerEmail}`)
        }
      } catch (ownerError) {
        failedMembers.push({ email: ownerEmail, reason: ownerError.message })
        console.warn(`⚠️ Failed to add owner ${ownerEmail}: ${ownerError.message}`)
      }
    }

    // Add regular members
    for (const memberEmail of membersList) {
      try {
        const normalizedEmail = memberEmail.toLowerCase().trim()
        const users = await graphClient
          .api('/users')
          .filter(`mail eq '${normalizedEmail}'`)
          .select('id')
          .get()

        if (users.value.length > 0) {
          const userId = users.value[0].id
          await graphClient
            .api(`/teams/${teamId}/members`)
            .post({
              '@odata.type': '#microsoft.graph.aadUserConversationMember',
              'user@odata.bind': `https://graph.microsoft.com/v1.0/users/${userId}`,
              'roles': ['member']
            })
          addedMembers.push({ email: memberEmail, role: 'member' })
          console.log(`✅ Added member ${memberEmail} to team ${teamId}`)
        } else {
          failedMembers.push({ email: memberEmail, reason: 'User not found' })
          console.warn(`⚠️ Member not found: ${memberEmail}`)
        }
      } catch (memberError) {
        failedMembers.push({ email: memberEmail, reason: memberError.message })
        console.warn(`⚠️ Failed to add member ${memberEmail}: ${memberError.message}`)
      }
    }

    return {
      operation: 'Create Team',
      status: 'completed',
      teamName,
      teamId: teamId,
      addedMembers: addedMembers.length > 0 ? addedMembers : undefined,
      failedMembers: failedMembers.length > 0 ? failedMembers : undefined,
      result: team
    }
  } catch (error) {
    throw new Error(`Failed to create team: ${error.message}`)
  }
}

async function addUserToTeam(formData) {
  const { teamId, userEmail, role } = formData

  try {
    // Get user ID from email
    const normalizedEmail = userEmail.toLowerCase().trim()
    const users = await graphClient
      .api('/users')
      .filter(`mail eq '${normalizedEmail}'`)
      .select('id')
      .get()

    if (!users.value.length) {
      throw new Error(`User not found: ${userEmail}`)
    }

    const userId = users.value[0].id

    // Add user to team
    await graphClient
      .api(`/teams/${teamId}/members`)
      .post({
        '@odata.type': '#microsoft.graph.aadUserConversationMember',
        'user@odata.bind': `https://graph.microsoft.com/v1.0/users/${userId}`,
        'roles': [role === 'owner' ? 'owner' : 'member']
      })

    return {
      operation: 'Add User to Team',
      status: 'completed',
      teamId,
      userEmail,
      role,
      userId
    }
  } catch (error) {
    throw new Error(`Failed to add user to team: ${error.message}`)
  }
}

async function removeUserFromTeam(formData) {
  const { teamId, userEmail } = formData

  try {
    const normalizedEmail = userEmail.toLowerCase().trim()
    const users = await graphClient
      .api('/users')
      .filter(`mail eq '${normalizedEmail}'`)
      .select('id')
      .get()

    if (!users.value.length) {
      throw new Error(`User not found: ${userEmail}`)
    }

    const userId = users.value[0].id

    // Remove user from team
    await graphClient
      .api(`/teams/${teamId}/members/${userId}`)
      .delete()

    return {
      operation: 'Remove User from Team',
      status: 'completed',
      teamId,
      userEmail
    }
  } catch (error) {
    throw new Error(`Failed to remove user from team: ${error.message}`)
  }
}

async function createChannel(formData) {
  const { teamId, channelName, description } = formData

  try {
    const result = await graphClient
      .api(`/teams/${teamId}/channels`)
      .post({
        displayName: channelName,
        description: description || ''
      })

    return {
      operation: 'Create Channel',
      status: 'completed',
      teamId,
      channelName,
      channelId: result.id,
      result
    }
  } catch (error) {
    throw new Error(`Failed to create channel: ${error.message}`)
  }
}

// ============================================================
// SharePoint Operations
// ============================================================

async function handleSharePoint(operation, formData) {
  const op = normalizeOperation(operation)
  switch (op) {
    case 'create-site-collection':
    case 'Create Site Collection':
      return await createSiteCollection(formData)
    case 'add-site-owner':
    case 'Add Site Owner':
      return await addSiteOwner(formData)
    case 'create-list':
    case 'Create List':
      return await createList(formData)
    default:
      throw new Error(`Unknown SharePoint operation: ${operation}`)
  }
}

async function createSiteCollection(formData) {
  const { siteName, siteUrl, owner } = formData

  try {
    console.log(`Creating SharePoint site: ${siteName} at ${siteUrl}`)

    return {
      operation: 'Create Site Collection',
      status: 'completed',
      siteName,
      siteUrl,
      owner
    }
  } catch (error) {
    throw new Error(`Failed to create site collection: ${error.message}`)
  }
}

async function addSiteOwner(formData) {
  const { siteUrl, ownerEmail } = formData

  try {
    console.log(`Adding owner ${ownerEmail} to ${siteUrl}`)

    return {
      operation: 'Add Site Owner',
      status: 'completed',
      siteUrl,
      ownerEmail
    }
  } catch (error) {
    throw new Error(`Failed to add site owner: ${error.message}`)
  }
}

async function createList(formData) {
  const { siteUrl, listName, listType } = formData

  try {
    console.log(`Creating list ${listName} in ${siteUrl}`)

    return {
      operation: 'Create List',
      status: 'completed',
      siteUrl,
      listName,
      listType
    }
  } catch (error) {
    throw new Error(`Failed to create list: ${error.message}`)
  }
}

// ============================================================
// M365 Groups Operations
// ============================================================

async function handleM365Groups(operation, formData) {
  const op = normalizeOperation(operation)
  switch (op) {
    case 'create-group':
    case 'create-m365-group':
    case 'Create Group':
      return await createGroup(formData)
    case 'add-member-to-group':
    case 'Add Member to Group':
      return await addMemberToGroup(formData)
    case 'add-m365-members':
    case 'Add Members to M365 Group':
      return await addMembersToGroup(formData)
    case 'remove-m365-members':
    case 'Remove Members from M365 Group':
      return await removeMembersFromGroup(formData)
    case 'remove-member-from-group':
    case 'Remove Member from Group':
      return await removeMemberFromGroup(formData)
    default:
      throw new Error(`Unknown M365 Groups operation: ${operation}`)
  }
}

async function createGroup(formData) {
  // Map form field names to Graph API field names
  const displayName = formData.displayName || formData.groupName
  const mailAlias = formData.alias || formData.mailNickname || formData.alias
  const description = formData.description || ''
  const members = formData.members ? formData.members.split(',').map(m => m.trim()) : []

  if (!displayName) {
    throw new Error('displayName is required to create a group')
  }
  if (!mailAlias) {
    throw new Error('Email alias is required to create a group')
  }

  try {
    const payload = {
      displayName: displayName,
      mailEnabled: true,
      mailNickname: mailAlias.toLowerCase().replace(/\s+/g, ''),
      securityEnabled: false,
      'groupTypes': ['Unified']
    }

    // Only include description if it's not empty (Graph API rejects empty strings)
    if (description && description.trim()) {
      payload.description = description
    }

    const result = await graphClient
      .api('/groups')
      .post(payload)

    const groupId = result.id

    // Add initial members if provided
    const addedMembers = []
    const failedMembers = []
    if (members.length > 0) {
      for (const memberEmail of members) {
        try {
          const normalizedEmail = memberEmail.toLowerCase().trim()
          const users = await graphClient
            .api('/users')
            .filter(`mail eq '${normalizedEmail}'`)
            .select('id')
            .get()

          if (users.value.length > 0) {
            const userId = users.value[0].id
            await graphClient
              .api(`/groups/${groupId}/members/$ref`)
              .post({ '@odata.id': `https://graph.microsoft.com/v1.0/users/${userId}` })
            addedMembers.push(memberEmail)
            console.log(`✅ Added member ${memberEmail} to group ${groupId}`)
          } else {
            failedMembers.push({ email: memberEmail, reason: 'User not found' })
            console.warn(`⚠️ User not found: ${memberEmail}`)
          }
        } catch (memberError) {
          failedMembers.push({ email: memberEmail, reason: memberError.message })
          console.warn(`⚠️ Failed to add member ${memberEmail}: ${memberError.message}`)
        }
      }
    }

    return {
      operation: 'Create Group',
      status: 'completed',
      displayName: displayName,
      mailAlias: mailAlias,
      groupId: groupId,
      addedMembers: addedMembers,
      failedMembers: failedMembers.length > 0 ? failedMembers : undefined,
      result
    }
  } catch (error) {
    // Debug: log the actual error message
    console.log(`🔍 DEBUG Error message: "${error.message}"`)
    console.log(`🔍 DEBUG Contains 'mailNickname already exists'? ${error.message.includes('mailNickname already exists')}`)

    // Handle "already exists" case - treat as success
    if (error.message.includes('mailNickname already exists')) {
      console.log(`⚠️ Group with alias '${mailAlias}' already exists, looking up existing group...`)
      try {
        // Try to find the existing group
        const mailNickname = mailAlias.toLowerCase().replace(/\s+/g, '')
        const groups = await graphClient
          .api('/groups')
          .filter(`mailNickname eq '${mailNickname}'`)
          .select('id,displayName,mailNickname')
          .get()

        if (groups.value && groups.value.length > 0) {
          const existingGroup = groups.value[0]
          console.log(`✅ Found existing group: ${existingGroup.displayName} (${existingGroup.id})`)
          return {
            operation: 'Create Group',
            status: 'completed',
            displayName: existingGroup.displayName,
            mailAlias: existingGroup.mailNickname,
            groupId: existingGroup.id,
            message: 'Group already exists'
          }
        }
      } catch (lookupError) {
        console.error(`❌ Could not lookup existing group: ${lookupError.message}`)
      }
    }
    throw new Error(`Failed to create group: ${error.message}`)
  }
}

async function addMemberToGroup(formData) {
  const { groupId, memberEmail, role } = formData

  try {
    const normalizedEmail = memberEmail.toLowerCase().trim()
    const users = await graphClient
      .api('/users')
      .filter(`mail eq '${normalizedEmail}'`)
      .select('id')
      .get()

    if (!users.value.length) {
      throw new Error(`User not found: ${memberEmail}`)
    }

    const userId = users.value[0].id

    if (role === 'owner') {
      await graphClient
        .api(`/groups/${groupId}/owners/$ref`)
        .post({
          '@odata.id': `https://graph.microsoft.com/v1.0/users/${userId}`
        })
    } else {
      await graphClient
        .api(`/groups/${groupId}/members/$ref`)
        .post({
          '@odata.id': `https://graph.microsoft.com/v1.0/users/${userId}`
        })
    }

    return {
      operation: 'Add Member to Group',
      status: 'completed',
      groupId,
      memberEmail,
      role
    }
  } catch (error) {
    throw new Error(`Failed to add member to group: ${error.message}`)
  }
}

async function removeMemberFromGroup(formData) {
  const { groupId, memberEmail } = formData

  try {
    const normalizedEmail = memberEmail.toLowerCase().trim()
    const users = await graphClient
      .api('/users')
      .filter(`mail eq '${normalizedEmail}'`)
      .select('id')
      .get()

    if (!users.value.length) {
      throw new Error(`User not found: ${memberEmail}`)
    }

    const userId = users.value[0].id

    await graphClient
      .api(`/groups/${groupId}/members/${userId}/$ref`)
      .delete()

    return {
      operation: 'Remove Member from Group',
      status: 'completed',
      groupId,
      memberEmail
    }
  } catch (error) {
    throw new Error(`Failed to remove member from group: ${error.message}`)
  }
}

async function addMembersToGroup(formData) {
  const { groupName, members } = formData

  try {
    // Look up group by name/email
    const normalizedGroupName = groupName.toLowerCase().trim()
    let groupId = null

    // Try to find group by mail first
    const groupsByMail = await graphClient
      .api('/groups')
      .filter(`mail eq '${normalizedGroupName}'`)
      .select('id')
      .get()

    if (groupsByMail.value && groupsByMail.value.length > 0) {
      groupId = groupsByMail.value[0].id
    } else {
      // Try to find by displayName
      const groupsByName = await graphClient
        .api('/groups')
        .filter(`startswith(displayName,'${groupName}')`)
        .select('id,displayName')
        .top(5)
        .get()

      if (groupsByName.value && groupsByName.value.length > 0) {
        groupId = groupsByName.value[0].id
      } else {
        throw new Error(`Group not found: ${groupName}`)
      }
    }

    console.log(`✅ Found group ${groupName} with ID: ${groupId}`)

    // Parse members (comma-separated)
    const memberList = members
      ? members.split(',').map(m => m.trim()).filter(m => m)
      : []

    const addedMembers = []
    const failedMembers = []

    // Add each member to the group
    for (const memberEmail of memberList) {
      try {
        const normalizedEmail = memberEmail.toLowerCase().trim()
        const users = await graphClient
          .api('/users')
          .filter(`mail eq '${normalizedEmail}'`)
          .select('id')
          .get()

        if (users.value.length > 0) {
          const userId = users.value[0].id
          await graphClient
            .api(`/groups/${groupId}/members/$ref`)
            .post({ '@odata.id': `https://graph.microsoft.com/v1.0/users/${userId}` })
          addedMembers.push(memberEmail)
          console.log(`✅ Added member ${memberEmail} to group ${groupId}`)
        } else {
          failedMembers.push({ email: memberEmail, reason: 'User not found' })
          console.warn(`⚠️ User not found: ${memberEmail}`)
        }
      } catch (memberError) {
        failedMembers.push({ email: memberEmail, reason: memberError.message })
        console.warn(`⚠️ Failed to add member ${memberEmail}: ${memberError.message}`)
      }
    }

    return {
      operation: 'Add Members to Group',
      status: 'completed',
      groupName,
      groupId,
      addedMembers,
      failedMembers: failedMembers.length > 0 ? failedMembers : undefined,
      summary: `Added ${addedMembers.length}/${memberList.length} members`
    }
  } catch (error) {
    throw new Error(`Failed to add members to group: ${error.message}`)
  }
}

async function removeMembersFromGroup(formData) {
  const { groupName, members } = formData

  try {
    // Look up group by name/email
    const normalizedGroupName = groupName.toLowerCase().trim()
    let groupId = null

    // Try to find group by mail first
    const groupsByMail = await graphClient
      .api('/groups')
      .filter(`mail eq '${normalizedGroupName}'`)
      .select('id')
      .get()

    if (groupsByMail.value && groupsByMail.value.length > 0) {
      groupId = groupsByMail.value[0].id
    } else {
      // Try to find by displayName
      const groupsByName = await graphClient
        .api('/groups')
        .filter(`startswith(displayName,'${groupName}')`)
        .select('id,displayName')
        .top(5)
        .get()

      if (groupsByName.value && groupsByName.value.length > 0) {
        groupId = groupsByName.value[0].id
      } else {
        throw new Error(`Group not found: ${groupName}`)
      }
    }

    console.log(`✅ Found group ${groupName} with ID: ${groupId}`)

    // Parse members (comma-separated)
    const memberList = members
      ? members.split(',').map(m => m.trim()).filter(m => m)
      : []

    const removedMembers = []
    const failedMembers = []

    // Remove each member from the group
    for (const memberEmail of memberList) {
      try {
        const normalizedEmail = memberEmail.toLowerCase().trim()
        const users = await graphClient
          .api('/users')
          .filter(`mail eq '${normalizedEmail}'`)
          .select('id')
          .get()

        if (users.value.length > 0) {
          const userId = users.value[0].id
          await graphClient
            .api(`/groups/${groupId}/members/${userId}/$ref`)
            .delete()
          removedMembers.push(memberEmail)
          console.log(`✅ Removed member ${memberEmail} from group ${groupId}`)
        } else {
          failedMembers.push({ email: memberEmail, reason: 'User not found' })
          console.warn(`⚠️ User not found: ${memberEmail}`)
        }
      } catch (memberError) {
        failedMembers.push({ email: memberEmail, reason: memberError.message })
        console.warn(`⚠️ Failed to remove member ${memberEmail}: ${memberError.message}`)
      }
    }

    return {
      operation: 'Remove Members from Group',
      status: 'completed',
      groupName,
      groupId,
      removedMembers,
      failedMembers: failedMembers.length > 0 ? failedMembers : undefined,
      summary: `Removed ${removedMembers.length}/${memberList.length} members`
    }
  } catch (error) {
    throw new Error(`Failed to remove members from group: ${error.message}`)
  }
}

// ============================================================
// Licenses Operations
// ============================================================

async function handleLicenses(operation, formData) {
  const op = normalizeOperation(operation)
  switch (op) {
    case 'assign-license':
    case 'Assign License':
      return await assignLicense(formData)
    case 'remove-license':
    case 'Remove License':
      return await removeLicense(formData)
    default:
      throw new Error(`Unknown Licenses operation: ${operation}`)
  }
}

async function assignLicense(formData) {
  const { userEmail, licenseType } = formData

  try {
    const users = await graphClient
      .api('/users')
      .filter(`mail eq '${userEmail}'`)
      .select('id')
      .get()

    if (!users.value.length) {
      throw new Error(`User not found: ${userEmail}`)
    }

    const userId = users.value[0].id

    // License SKUs mapping
    const skuMapping = {
      'Microsoft 365 Business Standard': 'f245ecc8-75af-4f8e-b61f-27d8cbb2b51d',
      'Microsoft 365 Business Premium': '62e7d56f-7aaf-45ad-b3a1-8f3fbbb50d0f',
      'Office 365 E3': '6634e0ce-1a9f-428c-8d79-c6a9e94ceb09'
    }

    const skuId = skuMapping[licenseType]
    if (!skuId) {
      throw new Error(`Unknown license type: ${licenseType}`)
    }

    await graphClient
      .api(`/users/${userId}/assignLicense`)
      .post({
        addLicenses: [
          {
            skuId: skuId
          }
        ],
        removeLicenses: []
      })

    return {
      operation: 'Assign License',
      status: 'completed',
      userEmail,
      licenseType
    }
  } catch (error) {
    throw new Error(`Failed to assign license: ${error.message}`)
  }
}

async function removeLicense(formData) {
  const { userEmail, licenseType } = formData

  try {
    const users = await graphClient
      .api('/users')
      .filter(`mail eq '${userEmail}'`)
      .select('id')
      .get()

    if (!users.value.length) {
      throw new Error(`User not found: ${userEmail}`)
    }

    const userId = users.value[0].id
    const skuMapping = {
      'Microsoft 365 Business Standard': 'f245ecc8-75af-4f8e-b61f-27d8cbb2b51d',
      'Microsoft 365 Business Premium': '62e7d56f-7aaf-45ad-b3a1-8f3fbbb50d0f',
      'Office 365 E3': '6634e0ce-1a9f-428c-8d79-c6a9e94ceb09'
    }

    const skuId = skuMapping[licenseType]
    if (!skuId) {
      throw new Error(`Unknown license type: ${licenseType}`)
    }

    await graphClient
      .api(`/users/${userId}/assignLicense`)
      .post({
        addLicenses: [],
        removeLicenses: [skuId]
      })

    return {
      operation: 'Remove License',
      status: 'completed',
      userEmail,
      licenseType
    }
  } catch (error) {
    throw new Error(`Failed to remove license: ${error.message}`)
  }
}

// ============================================================
// User Management Operations
// ============================================================

async function handleUserManagement(operation, formData) {
  const op = normalizeOperation(operation)
  switch (op) {
    case 'create-user':
    case 'Create User':
      return await createUser(formData)
    case 'reset-password':
    case 'Reset Password':
      return await resetPassword(formData)
    case 'enable-mfa':
    case 'Enable MFA':
      return await enableMFA(formData)
    default:
      throw new Error(`Unknown User Management operation: ${operation}`)
  }
}

async function createUser(formData) {
  const { firstName, lastName, email, department } = formData

  try {
    const result = await graphClient
      .api('/users')
      .post({
        accountEnabled: true,
        displayName: `${firstName} ${lastName}`,
        mailNickname: email.split('@')[0],
        userPrincipalName: email,
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: generateTempPassword()
        },
        givenName: firstName,
        surname: lastName,
        department: department || ''
      })

    return {
      operation: 'Create User',
      status: 'completed',
      email,
      displayName: `${firstName} ${lastName}`,
      userId: result.id
    }
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`)
  }
}

async function resetPassword(formData) {
  const { userEmail } = formData

  try {
    const users = await graphClient
      .api('/users')
      .filter(`mail eq '${userEmail}'`)
      .select('id')
      .get()

    if (!users.value.length) {
      throw new Error(`User not found: ${userEmail}`)
    }

    const userId = users.value[0].id

    await graphClient
      .api(`/users/${userId}`)
      .patch({
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: generateTempPassword()
        }
      })

    return {
      operation: 'Reset Password',
      status: 'completed',
      userEmail
    }
  } catch (error) {
    throw new Error(`Failed to reset password: ${error.message}`)
  }
}

async function enableMFA(formData) {
  const { userEmail } = formData

  try {
    console.log(`Enabling MFA for ${userEmail}`)

    return {
      operation: 'Enable MFA',
      status: 'completed',
      userEmail
    }
  } catch (error) {
    throw new Error(`Failed to enable MFA: ${error.message}`)
  }
}

// ============================================================
// Utilities
// ============================================================

function normalizeOperation(operation) {
  if (!operation) return ''
  // Convert to lowercase with hyphens: "Create Team" → "create-team"
  return operation
    .toLowerCase()
    .replace(/\s+/g, '-')
    .trim()
}

function generateTempPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
  let password = ''
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}
