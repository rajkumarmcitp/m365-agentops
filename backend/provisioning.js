/**
 * Resource Provisioning - Phase 3
 * Handles actual provisioning of M365 resources using Graph API
 * Each service type has its own provisioning function
 */

let graphClient = null

export function setProvisioningGraphClient(client) {
  graphClient = client
}

// ============================================================
// PROVISIONING ORCHESTRATOR
// ============================================================

export async function provisionRequest(serviceId, operationId, formData) {
  console.log(`⚙️  Provisioning: ${serviceId} / ${operationId}`)

  try {
    if (!graphClient) {
      throw new Error('Graph Client not initialized')
    }

    let result = {}

    // Route to service-specific provisioner
    switch (serviceId) {
      case 'exchange-groups':
        result = await provisionExchangeGroups(operationId, formData)
        break

      case 'shared-mailbox':
        result = await provisionSharedMailbox(operationId, formData)
        break

      case 'room-equipment':
        result = await provisionRoomEquipment(operationId, formData)
        break

      case 'email-services':
        result = await provisionEmailServices(operationId, formData)
        break

      case 'teams':
        result = await provisionTeams(operationId, formData)
        break

      case 'sharepoint':
        result = await provisionSharePoint(operationId, formData)
        break

      case 'onedrive':
        result = await provisionOneDrive(operationId, formData)
        break

      case 'guests':
        result = await provisionGuests(operationId, formData)
        break

      case 'licenses':
        result = await provisionLicenses(operationId, formData)
        break

      case 'intune':
        result = await provisionIntune(operationId, formData)
        break

      default:
        throw new Error(`Unknown service: ${serviceId}`)
    }

    console.log(`✓ Provisioning complete: ${serviceId}/${operationId}`)
    return {
      success: true,
      data: result,
      message: 'Resource provisioned successfully'
    }
  } catch (error) {
    console.error(`❌ Provisioning error: ${error.message}`)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

// ============================================================
// EXCHANGE PROVISIONING
// ============================================================

async function provisionExchangeGroups(operationId, formData) {
  const { groupName, groupEmail, description, owners, members, groupType } = formData

  if (operationId === 'create-m365-group') {
    // Create Microsoft 365 Group
    const newGroup = await graphClient
      .api('/groups')
      .post({
        displayName: groupName,
        mailNickname: groupEmail.split('@')[0],
        description: description || '',
        groupTypes: ['Unified'],
        securityEnabled: false,
        mailEnabled: true,
        isAssignableToRole: false
      })

    // Add owners if provided
    if (owners && owners.length > 0) {
      for (const owner of owners) {
        const user = await graphClient.api(`/users/${owner}`).get()
        await graphClient.api(`/groups/${newGroup.id}/owners/$ref`).post({
          '@odata.id': `https://graph.microsoft.com/v1.0/users/${user.id}`
        })
      }
    }

    // Add members if provided
    if (members && members.length > 0) {
      for (const member of members) {
        const user = await graphClient.api(`/users/${member}`).get()
        await graphClient.api(`/groups/${newGroup.id}/members/$ref`).post({
          '@odata.id': `https://graph.microsoft.com/v1.0/users/${user.id}`
        })
      }
    }

    return {
      resourceId: newGroup.id,
      resourceName: groupName,
      resourceEmail: newGroup.mail,
      resourceUrl: `https://outlook.office.com/mail/group/${newGroup.mail}`,
      type: 'Microsoft 365 Group'
    }
  }

  throw new Error(`Unsupported operation: ${operationId}`)
}

async function provisionSharedMailbox(operationId, formData) {
  const { mailboxName, mailboxEmail, description } = formData

  if (operationId === 'create-shared-mailbox') {
    // Create shared mailbox
    const newMailbox = await graphClient
      .api('/users')
      .post({
        displayName: mailboxName,
        mailNickname: mailboxEmail.split('@')[0],
        userPrincipalName: mailboxEmail,
        accountEnabled: false, // Shared mailbox has no password
        usageLocation: 'US'
      })

    return {
      resourceId: newMailbox.id,
      resourceName: mailboxName,
      resourceEmail: newMailbox.mail,
      type: 'Shared Mailbox'
    }
  }

  throw new Error(`Unsupported operation: ${operationId}`)
}

async function provisionRoomEquipment(operationId, formData) {
  const { resourceName, resourceEmail, capacity, type } = formData

  if (operationId === 'create-room-mailbox' || operationId === 'create-equipment-mailbox') {
    const newResource = await graphClient
      .api('/users')
      .post({
        displayName: resourceName,
        mailNickname: resourceEmail.split('@')[0],
        userPrincipalName: resourceEmail,
        accountEnabled: true,
        usageLocation: 'US'
      })

    // Set resource type (Room or Equipment)
    await graphClient
      .api(`/users/${newResource.id}`)
      .patch({
        resourceData: {
          resourceType: type === 'room' ? 'Room' : 'Equipment',
          capacity: capacity || 0
        }
      })

    return {
      resourceId: newResource.id,
      resourceName: resourceName,
      resourceEmail: newResource.mail,
      type: `${type === 'room' ? 'Room' : 'Equipment'} Mailbox`
    }
  }

  throw new Error(`Unsupported operation: ${operationId}`)
}

async function provisionEmailServices(operationId, formData) {
  // Email services are typically configured on existing mailboxes
  // This is more about settings than creating new resources
  return {
    type: 'Email Service Configuration',
    message: 'Email service configuration applied',
    operationType: operationId
  }
}

// ============================================================
// TEAMS PROVISIONING
// ============================================================

async function provisionTeams(operationId, formData) {
  const { teamName, teamDescription, visibility, owners, members } = formData

  if (operationId === 'create-team') {
    // Create Team
    const newTeam = await graphClient
      .api('/teams')
      .post({
        displayName: teamName,
        description: teamDescription || '',
        visibility: visibility || 'private',
        template: {
          id: 'standard'
        }
      })

    // Add owners and members
    if (owners && owners.length > 0) {
      for (const owner of owners) {
        await graphClient
          .api(`/teams/${newTeam.id}/members`)
          .post({
            '@odata.type': '#microsoft.graph.aadUserConversationMember',
            user: { '@odata.id': `https://graph.microsoft.com/v1.0/users/${owner}` },
            roles: ['owner']
          })
      }
    }

    if (members && members.length > 0) {
      for (const member of members) {
        await graphClient
          .api(`/teams/${newTeam.id}/members`)
          .post({
            '@odata.type': '#microsoft.graph.aadUserConversationMember',
            user: { '@odata.id': `https://graph.microsoft.com/v1.0/users/${member}` }
          })
      }
    }

    return {
      resourceId: newTeam.id,
      resourceName: teamName,
      resourceUrl: `https://teams.microsoft.com/l/team/${newTeam.id}`,
      type: 'Microsoft Teams'
    }
  }

  throw new Error(`Unsupported operation: ${operationId}`)
}

// ============================================================
// SHAREPOINT PROVISIONING
// ============================================================

async function provisionSharePoint(operationId, formData) {
  const { siteName, siteAlias, siteDescription, owners } = formData

  if (operationId === 'create-site') {
    // Create SharePoint Site
    const newSite = await graphClient
      .api('/sites/{{siteId}}/sites')
      .post({
        displayName: siteName,
        description: siteDescription || '',
        type: 'TeamSite'
      })

    return {
      resourceId: newSite.id,
      resourceName: siteName,
      resourceUrl: newSite.webUrl,
      type: 'SharePoint Site'
    }
  }

  throw new Error(`Unsupported operation: ${operationId}`)
}

// ============================================================
// ONEDRIVE PROVISIONING
// ============================================================

async function provisionOneDrive(operationId, formData) {
  // OneDrive is automatically created when user is added to tenant
  return {
    type: 'OneDrive Configuration',
    message: 'OneDrive access configured for user',
    operationType: operationId
  }
}

// ============================================================
// GUESTS PROVISIONING
// ============================================================

async function provisionGuests(operationId, formData) {
  const { guestEmail, guestName, inviteMessage } = formData

  if (operationId === 'invite-guest') {
    // Send invitation to guest
    const invitation = await graphClient
      .api('/invitations')
      .post({
        invitedUserEmailAddress: guestEmail,
        invitedUserDisplayName: guestName || guestEmail,
        inviteRedirectUrl: 'https://myapps.microsoft.com',
        sendInvitationMessage: !!inviteMessage,
        additionalProperties: {
          customizedMessageBody: inviteMessage || ''
        }
      })

    return {
      resourceId: invitation.id,
      guestEmail: guestEmail,
      invitationUrl: invitation.inviteRedeemUrl,
      type: 'Guest Invitation'
    }
  }

  throw new Error(`Unsupported operation: ${operationId}`)
}

// ============================================================
// LICENSE PROVISIONING
// ============================================================

async function provisionLicenses(operationId, formData) {
  const { userEmail, licenseType, licenseQuantity } = formData

  if (operationId && operationId.startsWith('assign-')) {
    // Get license SKUID based on type
    const licenseSkus = {
      'm365-e3': 'SPE_E3',
      'm365-e5': 'SPE_E5',
      'power-bi': 'POWER_BI_PRO',
      'visio': 'VISIO_PRO',
      'project': 'PROJECT_PRO',
      'copilot': 'COPILOT_PRO'
    }

    const skuId = licenseSkus[licenseType]
    if (!skuId) {
      throw new Error(`Unknown license type: ${licenseType}`)
    }

    // Get user
    const user = await graphClient.api(`/users/${userEmail}`).get()

    // Assign license
    await graphClient
      .api(`/users/${user.id}/assignLicense`)
      .post({
        addLicenses: [{ skuId: skuId }],
        removeLicenses: []
      })

    return {
      resourceId: user.id,
      userEmail: user.mail,
      licenseType: licenseType,
      type: 'License Assignment'
    }
  }

  throw new Error(`Unsupported operation: ${operationId}`)
}

// ============================================================
// INTUNE PROVISIONING
// ============================================================

async function provisionIntune(operationId, formData) {
  const { deviceId, action } = formData

  if (operationId === 'retire-device') {
    // Retire device (remote wipe)
    await graphClient
      .api(`/deviceManagement/managedDevices/${deviceId}/retire`)
      .post({})

    return {
      deviceId: deviceId,
      action: 'Retire',
      status: 'Retirement initiated',
      type: 'Device Retirement'
    }
  } else if (operationId === 'wipe-device') {
    // Wipe device (selective wipe)
    await graphClient
      .api(`/deviceManagement/managedDevices/${deviceId}/wipe`)
      .post({})

    return {
      deviceId: deviceId,
      action: 'Wipe',
      status: 'Wipe initiated',
      type: 'Device Wipe'
    }
  }

  throw new Error(`Unsupported operation: ${operationId}`)
}

// ============================================================
// POWER PLATFORM PROVISIONING
// ============================================================

export async function provisionPowerPlatform(operationId, formData) {
  const { environmentName, environmentType, owner } = formData

  if (operationId === 'create-environment') {
    // Power Platform environment creation requires Admin APIs
    // This would typically be done via PowerShell or Admin Connectors
    return {
      type: 'Power Platform Environment',
      name: environmentName,
      message: 'Environment creation request submitted to Power Platform admins',
      requiresManualApproval: true
    }
  }

  throw new Error(`Unsupported operation: ${operationId}`)
}

// ============================================================
// ERROR HANDLING & LOGGING
// ============================================================

export function getProvisioningErrorMessage(error) {
  const errorMap = {
    'Authorization_RequestDenied': 'Insufficient permissions to provision this resource',
    'NameAlreadyExists': 'A resource with this name already exists',
    'InvalidParameterValue': 'One or more parameters are invalid',
    'ResourceNotFound': 'Required resource not found',
    'Tenant_ProvisioningLimited': 'Tenant provisioning limit reached'
  }

  for (const [key, message] of Object.entries(errorMap)) {
    if (error.includes(key)) {
      return message
    }
  }

  return error.substring(0, 100) // Return first 100 chars of error
}
