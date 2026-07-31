/**
 * Application Collector
 * Collects application registration and enterprise app data
 * Feeds 90+ application security controls
 *
 * API Calls: 8-12 per full collection
 * Delta Queries: Supported
 */

import { BaseCollector } from '../lib/base-collector.js'

export class ApplicationCollector extends BaseCollector {
  constructor(deltaHelper) {
    super('ApplicationCollector', { supportsDelta: true, deltaHelper })
  }

  /**
   * Full collection of application data
   */
  async collect(graphClient, tenantId) {
    this.startTimer()
    console.log('📥 Starting Application collection...')

    try {
      const [
        applications,
        servicePrincipals,
        appRoleAssignments,
        oauth2PermissionGrants,
        appCredentials,
        owners
      ] = await Promise.allSettled([
        this.getApplications(graphClient),
        this.getServicePrincipals(graphClient),
        this.getAppRoleAssignments(graphClient),
        this.getOAuth2PermissionGrants(graphClient),
        this.getApplicationCredentials(graphClient),
        this.getApplicationOwners(graphClient)
      ])

      const data = {
        applications: this.normalizeResult(applications),
        servicePrincipals: this.normalizeResult(servicePrincipals),
        appRoleAssignments: this.normalizeResult(appRoleAssignments),
        oauth2PermissionGrants: this.normalizeResult(oauth2PermissionGrants),
        credentials: this.normalizeResult(appCredentials),
        owners: this.normalizeResult(owners),
        tenantId,
        collectedAt: new Date().toISOString(),
        apiCallCount: this.apiCallCount
      }

      this.recordDataSize(data)
      this.logSummary()

      return data
    } catch (err) {
      console.error('❌ Application collection failed:', err.message)
      throw err
    }
  }

  /**
   * Incremental sync
   */
  async delta(graphClient, tenantId, deltaToken) {
    console.log('⚡ Starting Application incremental sync...')

    try {
      const changes = {
        applications: await this.deltaHelper.getDeltaPaginated('/applications', { trackToken: true }),
        servicePrincipals: await this.deltaHelper.getDeltaPaginated('/servicePrincipals', { trackToken: true }),
        changes: 0,
        apiCallCount: 2
      }

      changes.changes =
        (changes.applications.itemCount || 0) +
        (changes.servicePrincipals.itemCount || 0)

      return changes
    } catch (err) {
      console.error('❌ Application incremental sync failed:', err.message)
      throw err
    }
  }

  /**
   * Get all applications
   */
  async getApplications(graphClient) {
    return this.getPaginatedData(graphClient, '/applications', {
      select: 'id,appId,displayName,publisherDomain,signInAudience,createdDateTime,passwordCredentials,keyCredentials,owners'
    })
  }

  /**
   * Get all service principals
   */
  async getServicePrincipals(graphClient) {
    return this.getPaginatedData(graphClient, '/servicePrincipals', {
      select: 'id,appId,displayName,servicePrincipalType,createdDateTime,accountEnabled,owners'
    })
  }

  /**
   * Get app role assignments
   */
  async getAppRoleAssignments(graphClient) {
    return this.getPaginatedData(graphClient, '/servicePrincipals?$expand=appRoleAssignments', {
      select: 'id,appRoleAssignments'
    })
  }

  /**
   * Get OAuth2 permission grants
   */
  async getOAuth2PermissionGrants(graphClient) {
    return this.getPaginatedData(graphClient, '/oauth2PermissionGrants', {
      select: 'id,clientId,resourceId,scope,consentType,createdDateTime'
    })
  }

  /**
   * Get application credentials (secrets and certificates)
   */
  async getApplicationCredentials(graphClient) {
    try {
      const apps = await this.getApplications(graphClient)

      const credentials = {
        secrets: [],
        certificates: [],
        expiredSecrets: [],
        expiredCertificates: []
      }

      // Get credentials for each app
      for (const app of apps.slice(0, 50)) { // Limit to first 50 to avoid throttling
        try {
          const appDetails = await graphClient
            .api(`/applications/${app.id}`)
            .select('id,passwordCredentials,keyCredentials')
            .get()

          if (appDetails.passwordCredentials) {
            const now = new Date()
            appDetails.passwordCredentials.forEach(secret => {
              const credential = {
                appId: app.id,
                type: 'secret',
                startDate: secret.startDateTime,
                endDate: secret.endDateTime,
                expired: new Date(secret.endDateTime) < now
              }
              if (credential.expired) {
                credentials.expiredSecrets.push(credential)
              } else {
                credentials.secrets.push(credential)
              }
            })
          }

          if (appDetails.keyCredentials) {
            const now = new Date()
            appDetails.keyCredentials.forEach(cert => {
              const credential = {
                appId: app.id,
                type: 'certificate',
                startDate: cert.startDateTime,
                endDate: cert.endDateTime,
                expired: new Date(cert.endDateTime) < now
              }
              if (credential.expired) {
                credentials.expiredCertificates.push(credential)
              } else {
                credentials.certificates.push(credential)
              }
            })
          }

          this.apiCallCount++
        } catch (err) {
          console.warn(`Failed to get credentials for app ${app.id}:`, err.message)
        }
      }

      return credentials
    } catch (err) {
      console.error('Failed to get application credentials:', err.message)
      return { secrets: [], certificates: [], expiredSecrets: [], expiredCertificates: [] }
    }
  }

  /**
   * Get application owners
   */
  async getApplicationOwners(graphClient) {
    try {
      const apps = await this.getApplications(graphClient)
      const owners = {}

      // Get owners for each app
      for (const app of apps.slice(0, 50)) { // Limit to first 50
        try {
          const appOwners = await graphClient
            .api(`/applications/${app.id}/owners`)
            .get()

          owners[app.id] = {
            appId: app.appId,
            displayName: app.displayName,
            ownerCount: appOwners.value?.length || 0,
            owners: appOwners.value?.map(o => ({
              id: o.id,
              displayName: o.displayName,
              userPrincipalName: o.userPrincipalName || o.mail
            })) || []
          }

          this.apiCallCount++
        } catch (err) {
          console.warn(`Failed to get owners for app ${app.id}:`, err.message)
        }
      }

      return owners
    } catch (err) {
      console.error('Failed to get application owners:', err.message)
      return {}
    }
  }

  /**
   * Normalize result
   */
  normalizeResult(result) {
    if (result.status === 'fulfilled') {
      return result.value || []
    }
    console.warn('API call failed:', result.reason?.message)
    return []
  }

  /**
   * Normalize data
   */
  normalize(rawData) {
    return {
      ...rawData,
      normalized: true,
      version: '1.0'
    }
  }
}

export default ApplicationCollector
