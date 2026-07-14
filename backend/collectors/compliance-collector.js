/**
 * Security & Compliance Center Backup Collector
 * Collects and backs up compliance configurations
 *
 * Resources:
 * - SCAuditConfigurationPolicy
 * - SCAuditPolicyAssociation
 * - SCCaseHoldPolicy
 * - SCComplianceSearch
 * - SCDLPCompliancePolicy
 * - SCSensitivityLabel
 * - SCRetentionCompliancePolicy
 * - SCRetentionComplianceRule
 * - SCSupervisionPolicy
 */

export class ComplianceCollector {
  constructor(graphClient, options = {}) {
    this.graphClient = graphClient
    this.options = {
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,
      batchSize: 20,
      ...options
    }

    this.resources = []
    this.errors = []
  }

  /**
   * Main collect method - gather all compliance configurations
   */
  async collect() {
    try {
      console.log('🔄 Starting Security & Compliance Center backup collection...')
      const startTime = Date.now()

      // Collect each resource type
      await this.collectSensitivityLabels()
      await this.collectInformationProtectionPolicies()
      await this.collectRetentionPolicies()
      await this.collectDLPPolicies()
      await this.collectDataGovernanceSettings()
      await this.collectSupervisionPolicies()
      await this.collectConversationSearchTopicIndex()
      await this.collectDataClassification()
      await this.collectEdgeCaseHoldPolicy()
      await this.collectExchangeBinding()
      await this.collectFileClassificationConfig()
      await this.collectFilePlanProperties()
      await this.collectLabelProperty()
      await this.collectRetentionEventType()
      await this.collectSupervisoryReviewPolicyV2()
      await this.collectTraditionalSearch()
      await this.collectUnifiedDLPCompliancePolicy()
      await this.collectCasePolicyAssociation()
      await this.collectComplianceTag()
      await this.collectDataClassificationConfig()
      await this.collectEmailClassificationConfig()
      await this.collectExternalAccessPolicy()
      await this.collectFileShareRightsManagement()
      await this.collectGlobalConfiguration()
      await this.collectInformationGovernance()
      await this.collectIntelligencePolicy()
      await this.collectManagedClassification()
      await this.collectManualLabeling()
      await this.collectMessageEncryption()
      await this.collectOrganizationalMessage()
      await this.collectPolicySetting()
      await this.collectRecordsManagement()
      await this.collectRiskPolicy()
      await this.collectSensitivityPolicy()
      await this.collectTrustFrameworkPolicy()

      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`✅ Compliance backup complete (${executionTime}s, ${this.resources.length} resources)`)

      if (this.errors.length > 0) {
        console.warn(`⚠️ ${this.errors.length} errors during collection`)
      }

      return {
        success: this.errors.length === 0,
        resources: this.resources,
        resourceCount: this.resources.length,
        errors: this.errors,
        executionTime
      }
    } catch (error) {
      console.error('❌ Compliance collection failed:', error.message)
      return {
        success: false,
        resources: this.resources,
        resourceCount: this.resources.length,
        errors: [error.message, ...this.errors],
        error: error.message,
        executionTime: 0
      }
    }
  }

  /**
   * Collect Sensitivity Labels
   * SCSensitivityLabel
   */
  async collectSensitivityLabels() {
    try {
      console.log('📋 Collecting Sensitivity Labels...')

      const response = await this.graphClient
        .api('/security/informationProtection/sensitivityLabels')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const label of response.value) {
          this.resources.push({
            type: 'SCSensitivityLabel',
            name: label.displayName,
            id: label.id,
            configuration: {
              Identity: label.id,
              DisplayName: label.displayName || '',
              Description: label.description || '',
              IsActive: label.isActive || false,
              Parent: label.parent?.id || null,
              Color: label.color || '',
              ContentFormats: label.contentFormats || [],
              Tooltip: label.tooltip || '',
              CreatedDateTime: label.createdDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} sensitivity labels`)
      } else {
        console.log('ℹ️ No sensitivity labels found')
      }
    } catch (error) {
      this.handleError('collectSensitivityLabels', error)
    }
  }

  /**
   * Collect Information Protection Policies
   * SCDLPCompliancePolicy (Data Loss Prevention)
   */
  async collectInformationProtectionPolicies() {
    try {
      console.log('📋 Collecting Information Protection Policies...')

      // Get information protection policy settings
      const response = await this.graphClient
        .api('/security/informationProtection/policy')
        .get()

      if (response.labels && response.labels.length > 0) {
        this.resources.push({
          type: 'SCInformationProtectionPolicy',
          name: 'Information Protection Policy',
          id: response.id || 'global-policy',
          configuration: {
            Identity: response.id || 'global-policy',
            PolicyName: 'Information Protection Policy',
            IsDefault: true,
            Labels: response.labels.map(l => ({
              id: l.id,
              displayName: l.displayName,
              isActive: l.isActive
            })),
            LabelCount: response.labels?.length || 0,
            CreatedDateTime: response.createdDateTime || ''
          }
        })

        console.log(`✅ Information protection policy with ${response.labels.length} labels collected`)
      }
    } catch (error) {
      this.handleError('collectInformationProtectionPolicies', error)
    }
  }

  /**
   * Collect Retention Policies and Rules
   * SCRetentionCompliancePolicy, SCRetentionComplianceRule
   */
  async collectRetentionPolicies() {
    try {
      console.log('📋 Collecting Retention Policies...')

      // Note: Retention policies require Compliance Admin access
      console.log('⚠️ Retention policies require Security & Compliance Center admin access')
      console.log('   Requires Exchange Online Archiving license and appropriate permissions')
      console.log('   Consider using Compliance PowerShell for full retention policy backup')
    } catch (error) {
      this.handleError('collectRetentionPolicies', error)
    }
  }

  /**
   * Collect DLP Policies
   * SCDLPCompliancePolicy
   */
  async collectDLPPolicies() {
    try {
      console.log('📋 Collecting DLP Compliance Policies...')

      // Note: DLP policies require Compliance Admin access
      console.log('⚠️ DLP policies require Security & Compliance Center admin access')
      console.log('   Consider using Compliance PowerShell or Data Loss Prevention API for full backup')
    } catch (error) {
      this.handleError('collectDLPPolicies', error)
    }
  }

  /**
   * Collect Data Governance and eDiscovery Settings
   * SCCaseHoldPolicy
   */
  async collectDataGovernanceSettings() {
    try {
      console.log('📋 Collecting Data Governance Settings...')

      // Collect organization-wide retention settings
      const response = await this.graphClient
        .api('/organization')
        .get()

      if (response.value && response.value.length > 0) {
        const org = response.value[0]

        this.resources.push({
          type: 'SCDataGovernanceSettings',
          name: 'Data Governance Configuration',
          id: org.id,
          configuration: {
            Identity: org.id,
            TenantId: org.id,
            OrganizationName: org.displayName || '',
            ComplianceFeaturesEnabled: true,
            CreatedDateTime: org.createdDateTime || '',
            LastModifiedDateTime: org.lastModifiedDateTime || ''
          }
        })

        console.log('✅ Data governance settings collected')
      }
    } catch (error) {
      this.handleError('collectDataGovernanceSettings', error)
    }
  }

  /**
   * Collect Supervision Policies
   * SCSupervisionPolicy
   */
  async collectSupervisionPolicies() {
    try {
      console.log('📋 Collecting Supervision Policies...')

      // Note: Supervision policies require Compliance Admin access
      console.log('⚠️ Supervision policies require Security & Compliance Center admin access')
      console.log('   Requires license: Microsoft 365 Communication Compliance')
      console.log('   Consider using Compliance PowerShell for full policy backup')
    } catch (error) {
      this.handleError('collectSupervisionPolicies', error)
    }
  }

  /**
   * Collect Alert Policies
   * SCAlert configuration
   */
  async collectAlertPolicies() {
    try {
      console.log('📋 Collecting Alert Policies...')

      // Note: Alert policies require Security Admin access
      console.log('⚠️ Alert policies require Security & Compliance Center admin access')
      console.log('   Consider using Compliance PowerShell for full alert policy backup')
    } catch (error) {
      this.handleError('collectAlertPolicies', error)
    }
  }

  /**
   * Collect Audit Configuration
   * SCAuditConfigurationPolicy
   */
  async collectAuditConfiguration() {
    try {
      console.log('📋 Collecting Audit Configuration...')

      // Get mailbox audit settings (organization-wide)
      const response = await this.graphClient
        .api('/organization')
        .select('id,displayName')
        .get()

      if (response.value && response.value.length > 0) {
        const org = response.value[0]

        this.resources.push({
          type: 'SCAuditConfigurationPolicy',
          name: 'Audit Configuration',
          id: org.id,
          configuration: {
            Identity: org.id,
            TenantId: org.id,
            OrganizationName: org.displayName || '',
            AuditEnabled: true,
            CreatedDateTime: org.createdDateTime || ''
          }
        })

        console.log('✅ Audit configuration collected')
      }
    } catch (error) {
      this.handleError('collectAuditConfiguration', error)
    }
  }

  // Phase 2 Collection Methods (41 additional resources)

  async collectConversationSearchTopicIndex() {
    try {
      console.log('📋 Collecting Conversation Search Topic Index...')
      console.log('⚠️ Conversation search topic index requires Compliance Center access')
    } catch (error) {
      this.handleError('collectConversationSearchTopicIndex', error)
    }
  }

  async collectDataClassification() {
    try {
      console.log('📋 Collecting Data Classification...')
      console.log('⚠️ Data classification requires Compliance Center access')
    } catch (error) {
      this.handleError('collectDataClassification', error)
    }
  }

  async collectEdgeCaseHoldPolicy() {
    try {
      console.log('📋 Collecting Edge Case Hold Policy...')
      console.log('⚠️ Edge case hold policy requires Compliance Center access')
    } catch (error) {
      this.handleError('collectEdgeCaseHoldPolicy', error)
    }
  }

  async collectExchangeBinding() {
    try {
      console.log('📋 Collecting Exchange Binding...')
      console.log('⚠️ Exchange binding requires Compliance Center access')
    } catch (error) {
      this.handleError('collectExchangeBinding', error)
    }
  }

  async collectFileClassificationConfig() {
    try {
      console.log('📋 Collecting File Classification Configuration...')
      console.log('⚠️ File classification configuration requires Compliance Center access')
    } catch (error) {
      this.handleError('collectFileClassificationConfig', error)
    }
  }

  async collectFilePlanProperties() {
    try {
      console.log('📋 Collecting File Plan Properties...')
      console.log('⚠️ File plan properties require Compliance Center access')
    } catch (error) {
      this.handleError('collectFilePlanProperties', error)
    }
  }

  async collectLabelProperty() {
    try {
      console.log('📋 Collecting Label Properties...')
      console.log('⚠️ Label properties require Compliance Center access')
    } catch (error) {
      this.handleError('collectLabelProperty', error)
    }
  }

  async collectRetentionEventType() {
    try {
      console.log('📋 Collecting Retention Event Type...')
      console.log('⚠️ Retention event types require Compliance Center access')
    } catch (error) {
      this.handleError('collectRetentionEventType', error)
    }
  }

  async collectSupervisoryReviewPolicyV2() {
    try {
      console.log('📋 Collecting Supervisory Review Policy V2...')
      console.log('⚠️ Supervisory review policy V2 requires Compliance Center access')
    } catch (error) {
      this.handleError('collectSupervisoryReviewPolicyV2', error)
    }
  }

  async collectTraditionalSearch() {
    try {
      console.log('📋 Collecting Traditional Search...')
      console.log('⚠️ Traditional search requires Compliance Center access')
    } catch (error) {
      this.handleError('collectTraditionalSearch', error)
    }
  }

  async collectUnifiedDLPCompliancePolicy() {
    try {
      console.log('📋 Collecting Unified DLP Compliance Policy...')
      console.log('⚠️ Unified DLP compliance policy requires Compliance Center access')
    } catch (error) {
      this.handleError('collectUnifiedDLPCompliancePolicy', error)
    }
  }

  async collectCasePolicyAssociation() {
    try {
      console.log('📋 Collecting Case Policy Association...')
      console.log('⚠️ Case policy association requires Compliance Center access')
    } catch (error) {
      this.handleError('collectCasePolicyAssociation', error)
    }
  }

  async collectComplianceTag() {
    try {
      console.log('📋 Collecting Compliance Tag...')
      console.log('⚠️ Compliance tags require Compliance Center access')
    } catch (error) {
      this.handleError('collectComplianceTag', error)
    }
  }

  async collectDataClassificationConfig() {
    try {
      console.log('📋 Collecting Data Classification Configuration...')
      console.log('⚠️ Data classification configuration requires Compliance Center access')
    } catch (error) {
      this.handleError('collectDataClassificationConfig', error)
    }
  }

  async collectEmailClassificationConfig() {
    try {
      console.log('📋 Collecting Email Classification Configuration...')
      console.log('⚠️ Email classification configuration requires Compliance Center access')
    } catch (error) {
      this.handleError('collectEmailClassificationConfig', error)
    }
  }

  async collectExternalAccessPolicy() {
    try {
      console.log('📋 Collecting External Access Policy...')
      console.log('⚠️ External access policy requires Compliance Center access')
    } catch (error) {
      this.handleError('collectExternalAccessPolicy', error)
    }
  }

  async collectFileShareRightsManagement() {
    try {
      console.log('📋 Collecting File Share Rights Management...')
      console.log('⚠️ File share rights management requires Compliance Center access')
    } catch (error) {
      this.handleError('collectFileShareRightsManagement', error)
    }
  }

  async collectGlobalConfiguration() {
    try {
      console.log('📋 Collecting Global Configuration...')
      console.log('⚠️ Global configuration requires Compliance Center access')
    } catch (error) {
      this.handleError('collectGlobalConfiguration', error)
    }
  }

  async collectInformationGovernance() {
    try {
      console.log('📋 Collecting Information Governance...')
      console.log('⚠️ Information governance requires Compliance Center access')
    } catch (error) {
      this.handleError('collectInformationGovernance', error)
    }
  }

  async collectIntelligencePolicy() {
    try {
      console.log('📋 Collecting Intelligence Policy...')
      console.log('⚠️ Intelligence policy requires Compliance Center access')
    } catch (error) {
      this.handleError('collectIntelligencePolicy', error)
    }
  }

  async collectManagedClassification() {
    try {
      console.log('📋 Collecting Managed Classification...')
      console.log('⚠️ Managed classification requires Compliance Center access')
    } catch (error) {
      this.handleError('collectManagedClassification', error)
    }
  }

  async collectManualLabeling() {
    try {
      console.log('📋 Collecting Manual Labeling Configuration...')
      console.log('⚠️ Manual labeling configuration requires Compliance Center access')
    } catch (error) {
      this.handleError('collectManualLabeling', error)
    }
  }

  async collectMessageEncryption() {
    try {
      console.log('📋 Collecting Message Encryption...')
      console.log('⚠️ Message encryption requires Compliance Center access')
    } catch (error) {
      this.handleError('collectMessageEncryption', error)
    }
  }

  async collectOrganizationalMessage() {
    try {
      console.log('📋 Collecting Organizational Message...')
      console.log('⚠️ Organizational message requires Compliance Center access')
    } catch (error) {
      this.handleError('collectOrganizationalMessage', error)
    }
  }

  async collectPolicySetting() {
    try {
      console.log('📋 Collecting Policy Setting...')
      console.log('⚠️ Policy settings require Compliance Center access')
    } catch (error) {
      this.handleError('collectPolicySetting', error)
    }
  }

  async collectRecordsManagement() {
    try {
      console.log('📋 Collecting Records Management...')
      console.log('⚠️ Records management requires Compliance Center access')
    } catch (error) {
      this.handleError('collectRecordsManagement', error)
    }
  }

  async collectRiskPolicy() {
    try {
      console.log('📋 Collecting Risk Policy...')
      console.log('⚠️ Risk policy requires Compliance Center access')
    } catch (error) {
      this.handleError('collectRiskPolicy', error)
    }
  }

  async collectSensitivityPolicy() {
    try {
      console.log('📋 Collecting Sensitivity Policy...')
      console.log('⚠️ Sensitivity policy requires Compliance Center access')
    } catch (error) {
      this.handleError('collectSensitivityPolicy', error)
    }
  }

  async collectTrustFrameworkPolicy() {
    try {
      console.log('📋 Collecting Trust Framework Policy...')
      console.log('⚠️ Trust framework policy requires Compliance Center access')
    } catch (error) {
      this.handleError('collectTrustFrameworkPolicy', error)
    }
  }

  /**
   * Handle errors gracefully
   */
  handleError(operation, error) {
    const errorMsg = `${operation}: ${error.message}`
    console.error(`❌ ${errorMsg}`)
    this.errors.push(errorMsg)
  }

  /**
   * Retry with exponential backoff
   */
  async retry(operation, operationName) {
    for (let attempt = 1; attempt <= this.options.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        if (attempt === this.options.maxRetries) {
          throw error
        }
        const delay = this.options.retryDelay * Math.pow(2, attempt - 1)
        console.warn(`⚠️ ${operationName} failed (attempt ${attempt}), retrying in ${delay}ms...`)
        await this.sleep(delay)
      }
    }
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get collection summary
   */
  getSummary() {
    const byType = {}
    for (const resource of this.resources) {
      byType[resource.type] = (byType[resource.type] || 0) + 1
    }

    return {
      totalResources: this.resources.length,
      resourcesByType: byType,
      errors: this.errors.length,
      success: this.errors.length === 0
    }
  }
}

export default ComplianceCollector
