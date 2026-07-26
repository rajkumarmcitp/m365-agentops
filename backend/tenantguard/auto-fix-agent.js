/**
 * Auto-Fix Agent
 * Automatically applies Graph API fixes for compliance drifts when enabled
 */

import { SettingsService } from './settings-service.js'

let autoFixAgent = null

export class AutoFixAgent {
  constructor(graphClient) {
    this.graphClient = graphClient
  }

  /**
   * Check if auto-remediation is enabled
   */
  async isEnabled() {
    const settings = SettingsService.getRemediationSettings()
    return settings.enabled
  }

  /**
   * Check if approval is required before fixing
   */
  async requiresApproval() {
    const settings = SettingsService.getRemediationSettings()
    return settings.requiresApproval
  }

  /**
   * Execute remediation for a control
   * Returns { executed, method, result, controlId, timestamp, error }
   */
  async executeRemediation(controlId, drift) {
    if (!this.graphClient) {
      return {
        executed: false,
        reason: 'Graph client not available',
        controlId,
        timestamp: new Date().toISOString(),
        method: 'none'
      }
    }

    try {
      // Route by control ID to specific handler
      let result = { executed: false, reason: 'Not auto-fixable' }

      // Con-025: Legacy Auth Block
      if (controlId === 'Con-025' || controlId === '2.5.1') {
        result = await this.fixLegacyAuthBlock()
      }
      // Con-001: Conditional Access Enabled
      else if (controlId === 'Con-001' || controlId === '1.1.2') {
        result = await this.fixConditionalAccess()
      }
      // Con-003: MFA Required
      else if (controlId === 'Con-003' || controlId === '5.1.3') {
        result = await this.fixMFAAuthPolicy()
      }
      // Security defaults fallback
      else if (controlId === 'security-defaults') {
        result = await this.fixSecurityDefaults()
      }
      // All others unsupported
      else {
        result = {
          executed: false,
          reason: 'Manual remediation required for this control'
        }
      }

      console.log(`✓ Remediation executed for ${controlId}:`, result)
      return {
        ...result,
        controlId,
        timestamp: new Date().toISOString(),
        method: result.executed ? 'auto_fix' : 'manual'
      }
    } catch (error) {
      console.error(`❌ Remediation failed for ${controlId}:`, error.message)
      return {
        executed: false,
        error: error.message,
        controlId,
        timestamp: new Date().toISOString(),
        method: 'none'
      }
    }
  }

  /**
   * Fix: Block Legacy Authentication
   * POST /beta/identity/conditionalAccess/policies
   */
  async fixLegacyAuthBlock() {
    if (!this.graphClient) {
      return { executed: false, reason: 'Graph client unavailable' }
    }

    try {
      const policy = {
        displayName: '[M365 OpsAgent] Block Legacy Authentication',
        description: 'Automatically created by compliance auto-fix agent',
        state: 'enabled',
        conditions: {
          clientAppTypes: ['exchangeActiveSync', 'other'],
          applications: { includeApplications: ['all'] },
          users: { includeUsers: ['all'] }
        },
        grantControls: {
          operator: 'OR',
          builtInControls: ['block']
        }
      }

      // Uncomment when ready for production (requires write permissions)
      // const result = await this.graphClient.api('/beta/identity/conditionalAccess/policies').post(policy)
      // Stub for now
      console.log('[DRY-RUN] Would create CA policy:', policy)

      return {
        executed: false,
        reason: 'Requires manual approval in Azure AD (dry-run mode)'
      }
    } catch (error) {
      return {
        executed: false,
        error: error.message,
        reason: 'Failed to create legacy auth block policy'
      }
    }
  }

  /**
   * Fix: Enable Conditional Access (if disabled)
   * PATCH /beta/identity/conditionalAccess/policies/{id}
   */
  async fixConditionalAccess(policyId = null) {
    if (!this.graphClient) {
      return { executed: false, reason: 'Graph client unavailable' }
    }

    try {
      // First, get existing CA policies to find a disabled one
      const policies = await this.graphClient
        .api('/beta/identity/conditionalAccess/policies')
        .get()

      const disabledPolicy = policies.value?.find(p => p.state === 'disabled')

      if (!disabledPolicy) {
        return {
          executed: false,
          reason: 'No disabled CA policies found to enable'
        }
      }

      const update = { state: 'enabled' }

      // Uncomment when ready for production
      // const result = await this.graphClient
      //   .api(`/beta/identity/conditionalAccess/policies/${disabledPolicy.id}`)
      //   .patch(update)
      // Stub for now
      console.log(`[DRY-RUN] Would enable CA policy ${disabledPolicy.id}:`, update)

      return {
        executed: false,
        reason: 'Requires manual approval in Azure AD (dry-run mode)',
        policyId: disabledPolicy.id
      }
    } catch (error) {
      return {
        executed: false,
        error: error.message,
        reason: 'Failed to enable conditional access policy'
      }
    }
  }

  /**
   * Fix: Enable MFA via Authentication Methods Policy
   * PATCH /policies/authenticationMethodsPolicy
   */
  async fixMFAAuthPolicy() {
    if (!this.graphClient) {
      return { executed: false, reason: 'Graph client unavailable' }
    }

    try {
      const update = {
        microsoftAuthenticatorAuthenticationMethodConfiguration: {
          state: 'enabled'
        }
      }

      // Uncomment when ready for production
      // const result = await this.graphClient
      //   .api('/policies/authenticationMethodsPolicy')
      //   .patch(update)
      // Stub for now
      console.log('[DRY-RUN] Would enable MFA policy:', update)

      return {
        executed: false,
        reason: 'Requires manual approval in Azure AD (dry-run mode)'
      }
    } catch (error) {
      return {
        executed: false,
        error: error.message,
        reason: 'Failed to enable MFA authentication policy'
      }
    }
  }

  /**
   * Fix: Enable Security Defaults
   * PATCH /policies/identitySecurityDefaultsEnforcementPolicy
   */
  async fixSecurityDefaults() {
    if (!this.graphClient) {
      return { executed: false, reason: 'Graph client unavailable' }
    }

    try {
      const update = {
        isEnabled: true
      }

      // Uncomment when ready for production
      // const result = await this.graphClient
      //   .api('/policies/identitySecurityDefaultsEnforcementPolicy')
      //   .patch(update)
      // Stub for now
      console.log('[DRY-RUN] Would enable security defaults:', update)

      return {
        executed: false,
        reason: 'Requires manual approval in Azure AD (dry-run mode)'
      }
    } catch (error) {
      return {
        executed: false,
        error: error.message,
        reason: 'Failed to enable security defaults'
      }
    }
  }
}

export function initializeAutoFixAgent(graphClient) {
  if (!autoFixAgent) {
    autoFixAgent = new AutoFixAgent(graphClient)
    console.log('✅ Auto-Fix Agent initialized')
  }
  return autoFixAgent
}

export function getAutoFixAgent() {
  return autoFixAgent
}
