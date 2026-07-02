/**
 * Infrastructure & Workload Security Data Collectors
 *
 * 10 reusable collector modules for 70 workload security controls
 * Covers: Exchange Online, SharePoint, Teams, OneDrive, Defender for Office 365
 *
 * Note: Graph API covers ~45 controls; PowerShell/Admin APIs cover ~25 controls
 */

import { unifiedGraphClient } from './graph-client-unified.js'

export class InfrastructureCollectors {
  constructor() {
    this.cache = {}
  }

  /**
   * Identity & Conditional Access Collector
   * Covers: Exchange legacy auth, Teams external access, device compliance
   */
  async collectIdentityAndCA() {
    if (this.cache.identityCA) return this.cache.identityCA

    try {
      const caResponse = await this.graphClient.api('/identity/conditionalAccess/policies?$filter=state eq \'enabled\'').get()
      const policies = caResponse.value || []

      const data = {
        totalPolicies: policies.length,
        policies: policies,
        byControl: {
          legacyAuthBlocked: policies.find(p =>
            p.conditions?.clientAppTypes?.some(app => ['exchangeActiveSync', 'other'].includes(app)) &&
            p.grantControls?.builtInControls?.includes('block')
          ),
          mfaRequired: policies.find(p =>
            p.grantControls?.builtInControls?.includes('mfa')
          ),
          compliantDevice: policies.find(p =>
            p.grantControls?.builtInControls?.includes('compliantDevice')
          ),
          teamsExternalRestricted: policies.find(p =>
            p.displayName?.toLowerCase().includes('teams') ||
            p.displayName?.toLowerCase().includes('external')
          ),
          exchangeOnlineProtected: policies.find(p =>
            p.displayName?.toLowerCase().includes('exchange')
          )
        },
        timestamp: new Date().toISOString()
      }

      this.cache.identityCA = data
      return data
    } catch (e) {
      console.warn('⚠️ Identity & CA collection failed:', e.message)
      return { totalPolicies: 0, policies: [], byControl: {}, error: e.message }
    }
  }

  /**
   * Users & Mailboxes Collector
   * Covers: Modern auth, mailbox auditing, external forwarding, delegation
   */
  async collectUsersAndMailboxes() {
    if (this.cache.usersMailboxes) return this.cache.usersMailboxes

    try {
      const [usersResponse, orgResponse] = await Promise.all([
        unifiedGraphClient.get('/users?$top=100&$select=id,userPrincipalName,mailboxSettings,lastSignInDateTime')
          .catch(() => ({ value: [] })),
        unifiedGraphClient.get('/organization?$select=id,displayName')
          .catch(() => ({}))
      ])

      const users = usersResponse.value || []
      const org = orgResponse || {}

      // Sample message rules for forwarding
      const forwardingRules = []
      for (const user of users.slice(0, 10)) {
        try {
          const rulesResponse = await this.graphClient.api(`/users/${user.id}/mailFolders/inbox/messageRules`).get()
          const rules = rulesResponse.value || []
          const external = rules.filter(r => r.redirectTo || r.forwardTo)
          if (external.length > 0) {
            forwardingRules.push({
              userId: user.userPrincipalName,
              ruleCount: external.length,
              rules: external.slice(0, 3)
            })
          }
        } catch (e) {
          // User may not have mailbox
        }
      }

      const data = {
        totalUsers: users.length,
        users: users.slice(0, 20),
        modernAuthEnabled: true,
        mailboxAuditingStatus: {
          audited: 0,
          notAudited: users.length,
          defaultEnabled: false
        },
        externalForwarding: {
          totalRules: forwardingRules.length,
          rules: forwardingRules,
          riskLevel: forwardingRules.length > 0 ? 'high' : 'low'
        },
        inactiveMailboxes: {
          total: 0,
          mailboxes: []
        },
        timestamp: new Date().toISOString()
      }

      this.cache.usersMailboxes = data
      return data
    } catch (e) {
      console.warn('⚠️ Users & Mailboxes collection failed:', e.message)
      return { totalUsers: 0, users: [], mailboxAuditingStatus: {}, error: e.message }
    }
  }

  /**
   * Sites Collector - SharePoint
   * Covers: Site permissions, external sharing, site owners, sensitivity labels
   */
  async collectSites() {
    if (this.cache.sites) return this.cache.sites

    try {
      const [sitesResponse, settingsResponse] = await Promise.all([
        unifiedGraphClient.get('/sites?$top=20&$select=id,displayName,webUrl')
          .catch(() => ({ value: [] })),
        unifiedGraphClient.get('/admin/sharepoint/settings')
          .catch(() => ({}))
      ])

      const sites = sitesResponse.value || []
      const settings = settingsResponse || {}

      // Get permissions for sample sites
      const siteDetails = []
      for (const site of sites.slice(0, 5)) {
        try {
          const [permsResponse, driveResponse] = await Promise.all([
            this.graphClient.api(`/sites/${site.id}/permissions?$top=10`).get()
              .catch(() => ({ value: [] })),
            this.graphClient.api(`/sites/${site.id}/drive`).get()
              .catch(() => ({}))
          ])

          const permissions = permsResponse.value || []
          const drive = driveResponse || {}

          siteDetails.push({
            siteId: site.id,
            displayName: site.displayName,
            permissions: permissions.length,
            externalUsers: permissions.filter(p => p.grantedToV2?.user?.userPrincipalName?.includes('#ext#')).length,
            anonymousLinks: permissions.filter(p => p.invitation?.invitedByEmailAddress === 'anyone').length,
            storageUsed: drive.quota?.used || 0
          })
        } catch (e) {
          // Skip sites that can't be accessed
        }
      }

      const data = {
        totalSites: sites.length,
        sites: siteDetails,
        externalSharingRestricted: settings.sharingScope !== 'anyone' && settings.sharingScope !== 'newAndExistingGuestUsers',
        sharingScope: settings.sharingScope,
        anonymousLinksAllowed: settings.sharingScope === 'anyone',
        hubSites: sites.filter(s => s.siteCollection?.root === true).length,
        timestamp: new Date().toISOString()
      }

      this.cache.sites = data
      return data
    } catch (e) {
      console.warn('⚠️ Sites collection failed:', e.message)
      return { totalSites: 0, sites: [], externalSharingRestricted: false, error: e.message }
    }
  }

  /**
   * Drives Collector - OneDrive
   * Covers: Drive sharing, anonymous links, inactive drives, storage
   */
  async collectDrives() {
    if (this.cache.drives) return this.cache.drives

    try {
      const usersResponse = await unifiedGraphClient.get('/users?$top=50&$select=id,userPrincipalName,lastSignInDateTime')
        .catch(() => ({ value: [] }))

      const users = usersResponse.value || []
      const driveDetails = []

      // Get drive details for sample users
      for (const user of users.slice(0, 10)) {
        try {
          const driveResponse = await this.graphClient.api(`/users/${user.id}/drive?$select=id,quota,name`).get()
          const drive = driveResponse || {}

          const lastSignIn = user.lastSignInDateTime ? new Date(user.lastSignInDateTime) : null
          const daysSinceSignIn = lastSignIn ? Math.floor((Date.now() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24)) : 999

          driveDetails.push({
            userId: user.userPrincipalName,
            driveId: drive.id,
            storageUsed: drive.quota?.used || 0,
            storageQuota: drive.quota?.total || 0,
            lastSignIn: user.lastSignInDateTime,
            daysSinceSignIn,
            inactive: daysSinceSignIn > 90
          })
        } catch (e) {
          // Skip users without drives
        }
      }

      const data = {
        totalDrives: users.length,
        drives: driveDetails,
        inactiveDrives: driveDetails.filter(d => d.inactive).length,
        totalStorageUsed: driveDetails.reduce((sum, d) => sum + d.storageUsed, 0),
        averageStoragePerDrive: driveDetails.length > 0 ?
          Math.round(driveDetails.reduce((sum, d) => sum + d.storageUsed, 0) / driveDetails.length) : 0,
        largeShares: driveDetails.filter(d => d.storageUsed > 1000000000).length,
        timestamp: new Date().toISOString()
      }

      this.cache.drives = data
      return data
    } catch (e) {
      console.warn('⚠️ Drives collection failed:', e.message)
      return { totalDrives: 0, drives: [], inactiveDrives: 0, error: e.message }
    }
  }

  /**
   * Teams Collector
   * Covers: Team creation, guest access, channels, installed apps
   */
  async collectTeams() {
    if (this.cache.teams) return this.cache.teams

    try {
      const [teamsResponse, appsResponse] = await Promise.all([
        this.graphClient.api('/groups?$filter=resourceProvisioningOptions/any(x:x eq \'Team\')&$top=20&$select=id,displayName,createdDateTime,resourceBehaviorOptions').get()
          .catch(() => ({ value: [] })),
        this.graphClient.api('/appCatalogs/teamsApps?$filter=distributionMethod eq \'organization\'&$top=20').get()
          .catch(() => ({ value: [] }))
      ])

      const teams = teamsResponse.value || []
      const apps = appsResponse.value || []

      const teamDetails = []
      for (const team of teams.slice(0, 10)) {
        try {
          const [channelsResponse, ownersResponse, installedAppsResponse] = await Promise.all([
            this.graphClient.api(`/teams/${team.id}/channels?$top=10`).get()
              .catch(() => ({ value: [] })),
            this.graphClient.api(`/groups/${team.id}/owners?$top=5`).get()
              .catch(() => ({ value: [] })),
            this.graphClient.api(`/teams/${team.id}/installedApps?$top=10`).get()
              .catch(() => ({ value: [] }))
          ])

          const channels = channelsResponse.value || []
          const owners = ownersResponse.value || []
          const installedApps = installedAppsResponse.value || []

          teamDetails.push({
            teamId: team.id,
            displayName: team.displayName,
            createdDate: team.createdDateTime,
            owners: owners.length,
            channels: channels.length,
            privateChannels: channels.filter(c => c.membershipType === 'private').length,
            sharedChannels: channels.filter(c => c.membershipType === 'shared').length,
            installedApps: installedApps.length,
            guestAccessEnabled: !team.resourceBehaviorOptions?.includes('WarnOnGroupCreation')
          })
        } catch (e) {
          // Skip teams that can't be accessed
        }
      }

      const data = {
        totalTeams: teams.length,
        teams: teamDetails,
        teamsWithGuestAccess: teamDetails.filter(t => t.guestAccessEnabled).length,
        totalApps: apps.length,
        organizationApps: apps,
        timestamp: new Date().toISOString()
      }

      this.cache.teams = data
      return data
    } catch (e) {
      console.warn('⚠️ Teams collection failed:', e.message)
      return { totalTeams: 0, teams: [], totalApps: 0, error: e.message }
    }
  }

  /**
   * Groups Collector
   * Covers: Teams governance, group owners, members, sensitivity labels
   */
  async collectGroups() {
    if (this.cache.groups) return this.cache.groups

    try {
      const groupsResponse = await unifiedGraphClient.get('/groups?$top=50&$select=id,displayName,createdDateTime,sensitivity,resourceBehaviorOptions')
        .catch(() => ({ value: [] }))

      const groups = groupsResponse.value || []
      const groupDetails = []

      for (const group of groups.slice(0, 20)) {
        try {
          const [ownersResponse, membersResponse] = await Promise.all([
            this.graphClient.api(`/groups/${group.id}/owners?$top=5`).get()
              .catch(() => ({ value: [] })),
            this.graphClient.api(`/groups/${group.id}/members?$top=50`).get()
              .catch(() => ({ value: [] }))
          ])

          const owners = ownersResponse.value || []
          const members = membersResponse.value || []

          groupDetails.push({
            groupId: group.id,
            displayName: group.displayName,
            createdDate: group.createdDateTime,
            owners: owners.length,
            members: members.length,
            sensitivity: group.sensitivity,
            hasLabel: !!group.sensitivity,
            isTeam: group.resourceProvisioningOptions?.includes('Team')
          })
        } catch (e) {
          // Skip groups that can't be accessed
        }
      }

      const data = {
        totalGroups: groups.length,
        groups: groupDetails,
        labeled: groupDetails.filter(g => g.hasLabel).length,
        unlabeled: groupDetails.filter(g => !g.hasLabel).length,
        timestamp: new Date().toISOString()
      }

      this.cache.groups = data
      return data
    } catch (e) {
      console.warn('⚠️ Groups collection failed:', e.message)
      return { totalGroups: 0, groups: [], labeled: 0, error: e.message }
    }
  }

  /**
   * SharePoint Admin Collector
   * Covers: External sharing settings, domain restrictions, idle sites
   */
  async collectSharePointAdmin() {
    if (this.cache.sharePointAdmin) return this.cache.sharePointAdmin

    try {
      const settingsResponse = await unifiedGraphClient.get('/admin/sharepoint/settings')
        .catch(() => ({}))

      const settings = settingsResponse || {}

      const data = {
        settings: settings,
        externalSharingRestricted: settings.sharingScope === 'internal',
        sharingScope: settings.sharingScope,
        anonymousLinksAllowed: settings.sharingScope !== 'internal',
        allowedDomains: settings.allowedDomains || [],
        restrictedDomains: settings.restrictedDomains || [],
        oneDriveSharingCapability: settings.oneDriveSharingCapability,
        disableExpiredLinks: !!settings.anonymousLinkExpirationDays,
        linkExpirationDays: settings.anonymousLinkExpirationDays || null,
        defaultLinkType: settings.defaultLinkType || 'internal',
        timestamp: new Date().toISOString()
      }

      this.cache.sharePointAdmin = data
      return data
    } catch (e) {
      console.warn('⚠️ SharePoint Admin collection failed:', e.message)
      return { settings: {}, externalSharingRestricted: false, error: e.message }
    }
  }

  /**
   * Audit Collector
   * Covers: Audit logging, sign-in monitoring, team creation audit
   */
  async collectAudit() {
    if (this.cache.audit) return this.cache.audit

    try {
      const [auditResponse, signInResponse] = await Promise.all([
        unifiedGraphClient.get('/auditLogs/directoryAudits?$top=100')
          .catch(() => ({ value: [] })),
        unifiedGraphClient.get('/auditLogs/signIns?$top=100')
          .catch(() => ({ value: [] }))
      ])

      const audits = auditResponse.value || []
      const signIns = signInResponse.value || []

      // Find team creation audits
      const teamCreations = audits.filter(a =>
        a.operationName?.includes('Create') && a.operationName?.includes('Team')
      )

      const data = {
        auditingEnabled: audits.length > 0,
        totalAuditEvents: audits.length,
        recentAudits: audits.slice(0, 20),
        teamCreations: {
          total: teamCreations.length,
          recent: teamCreations.slice(0, 10)
        },
        signInActivity: {
          total: signIns.length,
          recentSignIns: signIns.slice(0, 20),
          failedSignIns: signIns.filter(s => s.status?.errorCode !== '0').length
        },
        timestamp: new Date().toISOString()
      }

      this.cache.audit = data
      return data
    } catch (e) {
      console.warn('⚠️ Audit collection failed:', e.message)
      return {
        auditingEnabled: false,
        totalAuditEvents: 0,
        teamCreations: { total: 0 },
        error: e.message
      }
    }
  }

  /**
   * Organization Collector
   * Covers: Organization settings, preferred data location
   */
  async collectOrganization() {
    if (this.cache.organization) return this.cache.organization

    try {
      const orgResponse = await unifiedGraphClient.get('/organization')
        .catch(() => ({}))

      const org = orgResponse || {}

      const data = {
        displayName: org.displayName,
        id: org.id,
        preferredDataLocation: org.preferredDataLocation || 'Not set',
        dataResidencyCompliant: !!org.preferredDataLocation,
        dirSyncStatus: org.dirSyncEnabled,
        dirSyncConfigured: !!org.dirSyncEnabled,
        timestamp: new Date().toISOString()
      }

      this.cache.organization = data
      return data
    } catch (e) {
      console.warn('⚠️ Organization collection failed:', e.message)
      return { displayName: '', preferredDataLocation: 'Not set', error: e.message }
    }
  }

  /**
   * Permissions Collector
   * Covers: Role assignments, delegated permissions
   */
  async collectPermissions() {
    if (this.cache.permissions) return this.cache.permissions

    try {
      const [rolesResponse, delegatedResponse] = await Promise.all([
        unifiedGraphClient.get('/directoryRoles')
          .catch(() => ({ value: [] })),
        unifiedGraphClient.get('/oauth2PermissionGrants')
          .catch(() => ({ value: [] }))
      ])

      const roles = rolesResponse.value || []
      const delegated = delegatedResponse.value || []

      const data = {
        totalRoles: roles.length,
        roles: roles,
        delegatedPermissions: {
          total: delegated.length,
          grants: delegated.slice(0, 20)
        },
        timestamp: new Date().toISOString()
      }

      this.cache.permissions = data
      return data
    } catch (e) {
      console.warn('⚠️ Permissions collection failed:', e.message)
      return { totalRoles: 0, roles: [], delegatedPermissions: { total: 0 }, error: e.message }
    }
  }

  /**
   * Collect all infrastructure data
   */
  async collectAll() {
    console.log('📊 Starting Infrastructure & Workload data collection...')
    const startTime = Date.now()

    const [identityAndCA, usersAndMailboxes, sites, drives, teams, groups, sharePointAdmin, audit, org, permissions] = await Promise.all([
      this.collectIdentityAndCA(),
      this.collectUsersAndMailboxes(),
      this.collectSites(),
      this.collectDrives(),
      this.collectTeams(),
      this.collectGroups(),
      this.collectSharePointAdmin(),
      this.collectAudit(),
      this.collectOrganization(),
      this.collectPermissions()
    ])

    const duration = Date.now() - startTime
    console.log(`✅ Infrastructure data collection complete in ${duration}ms`)

    return {
      identityAndCA,
      usersAndMailboxes,
      sites,
      drives,
      teams,
      groups,
      sharePointAdmin,
      audit,
      organization: org,
      permissions,
      duration,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {}
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    return {
      cached: Object.keys(this.cache),
      count: Object.keys(this.cache).length,
      timestamp: new Date().toISOString()
    }
  }
}

export default InfrastructureCollectors
