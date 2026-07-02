/**
 * Zero Trust Applications Data Collectors
 *
 * 7 reusable collector modules for 22 application security controls
 * Implements Zero Trust principles: never trust applications, continuously verify identity,
 * permissions, credentials, and behavior
 */

import { unifiedGraphClient } from './graph-client-unified.js'

export class ApplicationCollectors {
  constructor() {
    this.cache = {}
  }

  /**
   * Enterprise Application Collector
   * Covers: App-001 to App-004 (Inventory, Owners, Enabled State, Stale Apps)
   */
  async collectEnterpriseApplications() {
    if (this.cache.enterpriseApps) return this.cache.enterpriseApps

    try {
      const spResponse = await unifiedGraphClient.get('/servicePrincipals')
      const servicePrincipals = spResponse.value || []

      // Enrich with owner and sign-in data in parallel
      const enrichedApps = await Promise.all(
        servicePrincipals.slice(0, 100).map(async (sp) => {
          try {
            const [owners, signIns] = await Promise.all([
              this.graphClient.api(`/servicePrincipals/${sp.id}/owners`).get()
                .catch(() => ({ value: [] })),
              this.graphClient.api(`/auditLogs/signIns?$filter=servicePrincipalId eq '${sp.id}'&$top=1`)
                .get().catch(() => ({ value: [] }))
            ])

            return {
              id: sp.id,
              displayName: sp.displayName,
              appId: sp.appId,
              accountEnabled: sp.accountEnabled,
              createdDateTime: sp.createdDateTime,
              owners: owners.value || [],
              ownerCount: (owners.value || []).length,
              lastSignIn: signIns.value?.[0]?.createdDateTime,
              servicePrincipalType: sp.servicePrincipalType,
              tags: sp.tags || []
            }
          } catch (e) {
            return {
              id: sp.id,
              displayName: sp.displayName,
              appId: sp.appId,
              accountEnabled: sp.accountEnabled,
              error: e.message
            }
          }
        })
      )

      const data = {
        total: servicePrincipals.length,
        applications: enrichedApps,
        byState: {
          enabled: enrichedApps.filter(a => a.accountEnabled === true).length,
          disabled: enrichedApps.filter(a => a.accountEnabled === false).length
        },
        withOwners: enrichedApps.filter(a => a.ownerCount > 0).length,
        orphaned: enrichedApps.filter(a => a.ownerCount === 0).length,
        stale: enrichedApps.filter(a => {
          const lastSignIn = a.lastSignIn ? new Date(a.lastSignIn) : null
          if (!lastSignIn) return true
          const daysSinceSignIn = Math.floor((Date.now() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24))
          return daysSinceSignIn > 90
        }).length,
        timestamp: new Date().toISOString()
      }

      this.cache.enterpriseApps = data
      return data
    } catch (e) {
      console.warn('⚠️ Enterprise Applications collection failed:', e.message)
      return { total: 0, applications: [], byState: {}, error: e.message }
    }
  }

  /**
   * Permission Analyzer Collector
   * Covers: App-005 to App-009 (Risky Permissions, High-Risk Permissions, Excessive Permissions)
   */
  async collectPermissionsAnalysis() {
    if (this.cache.permissions) return this.cache.permissions

    try {
      const spResponse = await unifiedGraphClient.get('/servicePrincipals')
      const servicePrincipals = spResponse.value || []

      const highRiskPermissions = [
        'Directory.ReadWrite.All',
        'RoleManagement.ReadWrite.Directory',
        'Application.ReadWrite.All',
        'User.ReadWrite.All',
        'Group.ReadWrite.All',
        'Mail.ReadWrite',
        'Files.ReadWrite.All',
        'Sites.FullControl.All'
      ]

      const appsWithHighRiskPerms = []

      for (const sp of servicePrincipals.slice(0, 100)) {
        try {
          const appRoles = await this.graphClient.api(`/servicePrincipals/${sp.id}/appRoleAssignments`).get()
          const assignments = appRoles.value || []

          const riskAssignments = assignments.filter(a => {
            return highRiskPermissions.some(perm => a.resourceDisplayName?.includes(perm))
          })

          if (riskAssignments.length > 0) {
            appsWithHighRiskPerms.push({
              appId: sp.id,
              displayName: sp.displayName,
              assignmentCount: assignments.length,
              highRiskCount: riskAssignments.length,
              permissions: riskAssignments.map(a => ({
                resourceDisplayName: a.resourceDisplayName,
                appRoleId: a.appRoleId
              }))
            })
          }
        } catch (e) {
          // Skip apps that can't be queried
        }
      }

      const data = {
        highRiskPermissionsList: highRiskPermissions,
        appsWithHighRiskPermissions: appsWithHighRiskPerms,
        countWithHighRiskPerms: appsWithHighRiskPerms.length,
        totalPermissionsAnalyzed: servicePrincipals.slice(0, 100).length,
        permissionTypes: {
          graph: appsWithHighRiskPerms.filter(a =>
            a.permissions.some(p => p.resourceDisplayName?.includes('Microsoft Graph'))
          ).length,
          exchange: appsWithHighRiskPerms.filter(a =>
            a.permissions.some(p => p.resourceDisplayName?.includes('Exchange'))
          ).length,
          sharepoint: appsWithHighRiskPerms.filter(a =>
            a.permissions.some(p => p.resourceDisplayName?.includes('SharePoint'))
          ).length
        },
        timestamp: new Date().toISOString()
      }

      this.cache.permissions = data
      return data
    } catch (e) {
      console.warn('⚠️ Permissions Analysis collection failed:', e.message)
      return { highRiskPermissionsList: [], appsWithHighRiskPermissions: [], error: e.message }
    }
  }

  /**
   * Credential Collector
   * Covers: App-010 to App-013 (Long-lived Secrets, Client Secrets, Certificate Expiry, Multiple Active Secrets)
   */
  async collectCredentials() {
    if (this.cache.credentials) return this.cache.credentials

    try {
      const appResponse = await unifiedGraphClient.get('/applications')
      const applications = appResponse.value || []

      const credentialAnalysis = applications.map(app => {
        const passwords = app.passwordCredentials || []
        const keys = app.keyCredentials || []

        const expiredSecrets = passwords.filter(p => new Date(p.endDateTime) < new Date()).length
        const expiringSecrets = passwords.filter(p => {
          const daysToExpiry = Math.floor((new Date(p.endDateTime) - Date.now()) / (1000 * 60 * 60 * 24))
          return daysToExpiry <= 180 && daysToExpiry > 0
        }).length

        const expiredCerts = keys.filter(k => new Date(k.endDateTime) < new Date()).length
        const expiringCerts = keys.filter(k => {
          const daysToExpiry = Math.floor((new Date(k.endDateTime) - Date.now()) / (1000 * 60 * 60 * 24))
          return daysToExpiry <= 180 && daysToExpiry > 0
        }).length

        return {
          appId: app.id,
          displayName: app.displayName,
          credentials: {
            secrets: {
              total: passwords.length,
              active: passwords.filter(p => new Date(p.endDateTime) > new Date()).length,
              expired: expiredSecrets,
              expiring: expiringSecrets,
              longLived: passwords.filter(p => {
                const daysValid = Math.floor((new Date(p.endDateTime) - new Date(p.startDateTime)) / (1000 * 60 * 60 * 24))
                return daysValid > 180
              }).length
            },
            certificates: {
              total: keys.length,
              active: keys.filter(k => new Date(k.endDateTime) > new Date()).length,
              expired: expiredCerts,
              expiring: expiringCerts
            }
          },
          credentialType: passwords.length > 0 ? 'clientSecret' : (keys.length > 0 ? 'certificate' : 'none'),
          riskLevel: expiredSecrets > 0 || expiredCerts > 0 ? 'critical' : (expiringSecrets > 0 || expiringCerts > 0 ? 'high' : 'low')
        }
      })

      const data = {
        totalApplications: applications.length,
        applications: credentialAnalysis,
        credentialSummary: {
          appsWithSecrets: credentialAnalysis.filter(a => a.credentials.secrets.total > 0).length,
          appsWithCertificates: credentialAnalysis.filter(a => a.credentials.certificates.total > 0).length,
          appsWithExpiredSecrets: credentialAnalysis.filter(a => a.credentials.secrets.expired > 0).length,
          appsWithExpiredCerts: credentialAnalysis.filter(a => a.credentials.certificates.expired > 0).length,
          appsWithExpiringSecrets: credentialAnalysis.filter(a => a.credentials.secrets.expiring > 0).length,
          appsWithLongLivedSecrets: credentialAnalysis.filter(a => a.credentials.secrets.longLived > 0).length
        },
        byRiskLevel: {
          critical: credentialAnalysis.filter(a => a.riskLevel === 'critical').length,
          high: credentialAnalysis.filter(a => a.riskLevel === 'high').length,
          low: credentialAnalysis.filter(a => a.riskLevel === 'low').length
        },
        timestamp: new Date().toISOString()
      }

      this.cache.credentials = data
      return data
    } catch (e) {
      console.warn('⚠️ Credentials collection failed:', e.message)
      return { totalApplications: 0, applications: [], credentialSummary: {}, error: e.message }
    }
  }

  /**
   * Consent & Governance Collector
   * Covers: App-014 to App-016 (User Consent Disabled, Admin Consent Requests, Verified Publisher)
   */
  async collectConsentAndGovernance() {
    if (this.cache.consentGovernance) return this.cache.consentGovernance

    try {
      const [authPolicyResponse, appResponse] = await Promise.all([
        unifiedGraphClient.get('/policies/authorizationPolicy').catch(e => ({ error: e.message })),
        unifiedGraphClient.get('/applications').catch(e => ({ value: [] }))
      ])

      const policy = authPolicyResponse
      const applications = appResponse.value || []

      const verifiedPublishers = applications.filter(a => a.verifiedPublisher && a.verifiedPublisher.verifiedPublisherId).length
      const unverifiedMultiTenant = applications.filter(a =>
        a.signInAudience === 'AzureADMultipleOrgs' && (!a.verifiedPublisher || !a.verifiedPublisher.verifiedPublisherId)
      ).length

      const data = {
        consentPolicy: {
          policyType: policy?.appConsentPolicyType,
          userConsentEnabled: policy?.permissionGrantPolicyIdsAssignedToDefaultUserRole?.length > 0,
          requireAdminConsent: policy?.appConsentPolicyType !== 'permissionGrantPolicy',
          policy: policy
        },
        publisherVerification: {
          verifiedApps: verifiedPublishers,
          unverifiedMultiTenantApps: unverifiedMultiTenant,
          totalApps: applications.length,
          verificationRate: applications.length > 0 ?
            Math.round((verifiedPublishers / applications.length) * 100) : 0
        },
        applicationGovernance: {
          multiTenantApps: applications.filter(a => a.signInAudience === 'AzureADMultipleOrgs').length,
          singleTenantApps: applications.filter(a => a.signInAudience === 'AzureADMyOrg').length,
          externalApps: applications.filter(a => a.signInAudience?.includes('External')).length
        },
        timestamp: new Date().toISOString()
      }

      this.cache.consentGovernance = data
      return data
    } catch (e) {
      console.warn('⚠️ Consent & Governance collection failed:', e.message)
      return { consentPolicy: {}, publisherVerification: {}, applicationGovernance: {}, error: e.message }
    }
  }

  /**
   * Application Activity Collector
   * Covers: App-017 to App-019 (Never Used Apps, Failed Sign-ins, New Applications)
   */
  async collectApplicationActivity() {
    if (this.cache.appActivity) return this.cache.appActivity

    try {
      const [signInsResponse, auditResponse] = await Promise.all([
        unifiedGraphClient.get('/auditLogs/signIns?$filter=appDisplayName ne null')
          .catch(e => ({ value: [], error: e.message })),
        this.graphClient.api('/auditLogs/directoryAudits?$filter=operationName in (\'Add Service Principal\',\'Add application\')').get()
          .catch(e => ({ value: [], error: e.message }))
      ])

      const signIns = signInsResponse.value || []
      const auditLogs = auditResponse.value || []

      // Analyze sign-in patterns
      const appActivity = new Map()
      signIns.forEach(signin => {
        if (!appActivity.has(signin.appDisplayName)) {
          appActivity.set(signin.appDisplayName, {
            displayName: signin.appDisplayName,
            appId: signin.appId,
            totalSignIns: 0,
            failedSignIns: 0,
            lastSignIn: signin.createdDateTime,
            byStatus: {}
          })
        }

        const app = appActivity.get(signin.appDisplayName)
        app.totalSignIns++
        if (signin.status?.errorCode !== '0') {
          app.failedSignIns++
        }
        app.byStatus[signin.status?.errorCode || '0'] = (app.byStatus[signin.status?.errorCode || '0'] || 0) + 1
        if (new Date(signin.createdDateTime) > new Date(app.lastSignIn)) {
          app.lastSignIn = signin.createdDateTime
        }
      })

      const neverUsedApps = Array.from(appActivity.values()).filter(a => {
        const lastSignIn = new Date(a.lastSignIn)
        const daysSinceUse = Math.floor((Date.now() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceUse > 90
      })

      const failurePatterns = Array.from(appActivity.values()).filter(a => a.failedSignIns > 10)

      const data = {
        applicationUsage: {
          trackedApps: appActivity.size,
          activeApps: Array.from(appActivity.values()).filter(a => a.totalSignIns > 0).length,
          neverUsedCount: neverUsedApps.length,
          neverUsedApps: neverUsedApps.slice(0, 20)
        },
        failureAnalysis: {
          appsWithFailures: Array.from(appActivity.values()).filter(a => a.failedSignIns > 0).length,
          failurePatterns: failurePatterns,
          totalFailedSignIns: Array.from(appActivity.values()).reduce((sum, a) => sum + a.failedSignIns, 0)
        },
        newApplications: {
          total: auditLogs.length,
          recentApps: auditLogs.slice(0, 20),
          last30Days: auditLogs.filter(a => {
            const createdDate = new Date(a.activityDateTime)
            const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
            return daysSinceCreation <= 30
          }).length
        },
        timestamp: new Date().toISOString()
      }

      this.cache.appActivity = data
      return data
    } catch (e) {
      console.warn('⚠️ Application Activity collection failed:', e.message)
      return { applicationUsage: {}, failureAnalysis: {}, newApplications: {}, error: e.message }
    }
  }

  /**
   * Workload Identity Collector
   * Covers: App-020 to App-022 (Workload Identity CA, Managed Identity Adoption, Sign-in Monitoring)
   */
  async collectWorkloadIdentity() {
    if (this.cache.workloadIdentity) return this.cache.workloadIdentity

    try {
      const [caResponse, spResponse, signInResponse] = await Promise.all([
        this.graphClient.api('/identity/conditionalAccess/policies?$filter=state eq \'enabled\'').get()
          .catch(e => ({ value: [], error: e.message })),
        this.graphClient.api('/servicePrincipals?$filter=servicePrincipalType eq \'ManagedIdentity\'').get()
          .catch(e => ({ value: [], error: e.message })),
        unifiedGraphClient.get('/auditLogs/signIns?$filter=servicePrincipalId ne null')
          .catch(e => ({ value: [], error: e.message }))
      ])

      const caPolicies = caResponse.value || []
      const managedIdentities = spResponse.value || []
      const workloadSignIns = signInResponse.value || []

      const workloadCAPolicy = caPolicies.find(p =>
        p.displayName?.toLowerCase().includes('workload') ||
        p.conditions?.servicePrincipals?.includeServicePrincipals?.length > 0
      )

      // Analyze workload sign-in risk
      const riskfulSignIns = workloadSignIns.filter(signin => {
        const riskLevel = signin.riskLevelAggregated || signin.riskLevelDuringSignIn
        return riskLevel && riskLevel !== 'none'
      })

      const data = {
        workloadIdentityPolicy: {
          enabled: !!workloadCAPolicy,
          policyId: workloadCAPolicy?.id,
          requiresMFA: workloadCAPolicy?.grantControls?.builtInControls?.includes('mfa'),
          requiresCompliantDevice: workloadCAPolicy?.grantControls?.builtInControls?.includes('compliantDevice')
        },
        managedIdentityAdoption: {
          totalManagedIdentities: managedIdentities.length,
          byType: {
            userAssigned: managedIdentities.filter(m => m.servicePrincipalType === 'ManagedIdentity' && m.tags?.includes('UserAssigned')).length,
            systemAssigned: managedIdentities.filter(m => m.servicePrincipalType === 'ManagedIdentity' && m.tags?.includes('SystemAssigned')).length
          },
          managedIdentities: managedIdentities.slice(0, 50)
        },
        workloadSignInActivity: {
          totalSignIns: workloadSignIns.length,
          riskySignIns: riskfulSignIns.length,
          riskSummary: {
            high: workloadSignIns.filter(s => s.riskLevelAggregated === 'high').length,
            medium: workloadSignIns.filter(s => s.riskLevelAggregated === 'medium').length,
            low: workloadSignIns.filter(s => s.riskLevelAggregated === 'low').length
          },
          failedSignIns: workloadSignIns.filter(s => s.status?.errorCode !== '0').length
        },
        timestamp: new Date().toISOString()
      }

      this.cache.workloadIdentity = data
      return data
    } catch (e) {
      console.warn('⚠️ Workload Identity collection failed:', e.message)
      return { workloadIdentityPolicy: {}, managedIdentityAdoption: {}, workloadSignInActivity: {}, error: e.message }
    }
  }

  /**
   * Application Governance Collector
   * Covers: App-023 to App-025 (Orphaned Apps, Lifecycle, Duplicates)
   */
  async collectApplicationGovernance() {
    if (this.cache.appGovernance) return this.cache.appGovernance

    try {
      const [appResponse, spResponse] = await Promise.all([
        unifiedGraphClient.get('/applications').catch(e => ({ value: [] })),
        unifiedGraphClient.get('/servicePrincipals').catch(e => ({ value: [] }))
      ])

      const applications = appResponse.value || []
      const servicePrincipals = spResponse.value || []

      // Find orphaned applications (no owners)
      const orphanedApps = []
      for (const sp of servicePrincipals.slice(0, 50)) {
        try {
          const owners = await this.graphClient.api(`/servicePrincipals/${sp.id}/owners`).get()
            .catch(() => ({ value: [] }))
          if (!owners.value || owners.value.length === 0) {
            orphanedApps.push({
              id: sp.id,
              displayName: sp.displayName,
              createdDateTime: sp.createdDateTime
            })
          }
        } catch (e) {
          // Skip
        }
      }

      // Find disabled applications
      const disabledApps = servicePrincipals.filter(sp => sp.accountEnabled === false)

      // Find duplicate applications (same redirect URI or similar names)
      const redirectUris = new Map()
      const duplicates = []
      applications.forEach(app => {
        const uris = app.replyUrls || []
        uris.forEach(uri => {
          if (!redirectUris.has(uri)) {
            redirectUris.set(uri, [])
          }
          redirectUris.get(uri).push(app.displayName)
        })
      })

      redirectUris.forEach((apps, uri) => {
        if (apps.length > 1) {
          duplicates.push({
            redirectUri: uri,
            applications: apps,
            count: apps.length
          })
        }
      })

      const data = {
        orphanedApplications: {
          total: orphanedApps.length,
          apps: orphanedApps,
          criticalRisk: orphanedApps.length > 0
        },
        disabledApplications: {
          total: disabledApps.length,
          apps: disabledApps.slice(0, 20),
          needsReview: disabledApps.length > 0
        },
        duplicateApplications: {
          total: duplicates.length,
          duplicates: duplicates,
          affectedApps: duplicates.reduce((sum, d) => sum + d.applications.length, 0)
        },
        applicationLifecycle: {
          recentlyCreated: applications.filter(a => {
            const createdDate = new Date(a.createdDateTime)
            const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
            return daysSinceCreation <= 30
          }).length,
          total: applications.length
        },
        timestamp: new Date().toISOString()
      }

      this.cache.appGovernance = data
      return data
    } catch (e) {
      console.warn('⚠️ Application Governance collection failed:', e.message)
      return { orphanedApplications: {}, disabledApplications: {}, duplicateApplications: {}, error: e.message }
    }
  }

  /**
   * Collect all application security data
   */
  async collectAll() {
    console.log('📊 Starting Application Security data collection...')
    const startTime = Date.now()

    const [enterpriseApps, permissions, credentials, consentGov, appActivity, workloadId, appGov] = await Promise.all([
      this.collectEnterpriseApplications(),
      this.collectPermissionsAnalysis(),
      this.collectCredentials(),
      this.collectConsentAndGovernance(),
      this.collectApplicationActivity(),
      this.collectWorkloadIdentity(),
      this.collectApplicationGovernance()
    ])

    const duration = Date.now() - startTime
    console.log(`✅ Application Security data collection complete in ${duration}ms`)

    return {
      enterpriseApplications: enterpriseApps,
      permissionsAnalysis: permissions,
      credentials,
      consentAndGovernance: consentGov,
      applicationActivity: appActivity,
      workloadIdentity: workloadId,
      applicationGovernance: appGov,
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

export default ApplicationCollectors
