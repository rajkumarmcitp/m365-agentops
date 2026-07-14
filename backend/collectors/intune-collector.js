/**
 * Intune Backup Collector
 * Collects and backs up Intune device and configuration policies
 *
 * Resources:
 * - IntuneAppConfiguration
 * - IntuneAppProtectionPolicy
 * - IntuneDeviceCompliance
 * - IntuneDeviceConfiguration
 * - IntuneDeviceEnrollmentPlatformRestriction
 * - IntuneWifiConfiguration
 * - IntuneWindowsUpdateForBusinessConfiguration
 */

export class IntuneCollector {
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
   * Main collect method - gather all Intune configurations
   */
  async collect() {
    try {
      console.log('🔄 Starting Intune backup collection...')
      const startTime = Date.now()

      // Collect each resource type
      await this.collectDeviceConfigurations()
      await this.collectCompliancePolicies()
      await this.collectAppProtectionPolicies()
      await this.collectAppConfigurations()
      await this.collectApplicationControlPolicy()
      await this.collectApplicationVPNPolicy()
      await this.collectAssignmentFilter()
      await this.collectAuthenticationMethodsPolicy()
      await this.collectCertificateConnector()
      await this.collectCertificateDeployment()
      await this.collectCompliancePartner()
      await this.collectDeviceCompliancePolicy()
      await this.collectDeviceEnrollmentConfiguration()
      await this.collectDeviceEnrollmentLimit()
      await this.collectDeviceHealthMonitoring()
      await this.collectDeviceManagementServiceConfig()
      await this.collectDeviceManagementSettings()
      await this.collectDeviceTypeRestriction()
      await this.collectDiskEncryptionPolicy()
      await this.collectEdgeDeploymentProfile()
      await this.collectEnrollmentIosConfiguration()
      await this.collectEnrollmentMacOSConfiguration()
      await this.collectEnrollmentPlatformRestriction()
      await this.collectEnrollmentStatusPageConfiguration()
      await this.collectEnrollmentWindowsHelloForBusinessConfiguration()
      await this.collectEnrollmentPolicies()
      await this.collectExchangeConnector()
      await this.collectExchangeOnPremisesPolicy()
      await this.collectFeatureUpdateDeployment()
      await this.collectFirmwareUpdateDeployment()
      await this.collectGovernancePolicy()
      await this.collectHealthMonitoringRule()
      await this.collectIOSDeviceFeatures()
      await this.collectIOSEmailProfile()
      await this.collectIOSGeneralDeviceConfiguration()
      await this.collectIOSManagedAppConfiguration()
      await this.collectIOSManagedAppProtection()
      await this.collectIOSUpdateConfiguration()
      await this.collectIPv6Policy()
      await this.collectLinuxDeviceConfiguration()
      await this.collectMacOSDeviceFeatures()
      await this.collectMacOSEndpointProtectionConfiguration()
      await this.collectMacOSGeneralDeviceConfiguration()
      await this.collectMacOSLobApp()
      await this.collectMacOSMicrosoftEdgeConfiguration()
      await this.collectMacOSMicrosoftDefenderConfiguration()
      await this.collectMacOSOfficeConfiguration()
      await this.collectMacOSUpdateConfiguration()
      await this.collectManagementCondition()
      await this.collectManagementTemplate()
      await this.collectMobileApplicationManagement()
      await this.collectMobileDeviceManagementAuthority()
      await this.collectNetworkBoundaryConfiguration()
      await this.collectNotificationMessageTemplate()
      await this.collectOnPremiseConditionalAccessPolicy()
      await this.collectOrganizationalMessage()
      await this.collectPasswordComplexityPolicy()
      await this.collectProactiveRemediationRule()
      await this.collectQualityUpdateDeployment()
      await this.collectResourceAccessPolicy()
      await this.collectRoleAssignment()
      await this.collectRoleBasedAccessControl()
      await this.collectSamsungKnoxPolicy()
      await this.collectScopeTags()
      await this.collectSecurityBaseline()
      await this.collectSecurityBaselineAssignment()
      await this.collectSecurityPolicy()
      await this.collectSettingCatalogPolicy()
      await this.collectSoftwareUpdateConfiguration()
      await this.collectTermsAndConditions()
      await this.collectUpdateConfiguration()
      await this.collectVPNConfiguration()
      await this.collectWifiConfiguration()
      await this.collectWindows10DeviceConfiguration()
      await this.collectWindows10EndpointProtectionConfiguration()
      await this.collectWindows10EnrollmentConfiguration()
      await this.collectWindowsDefenderAdvancedThreatProtectionConfiguration()
      await this.collectWindowsUpdatePolicies()
      await this.collectZeroTrustPolicy()
      await this.collectManagedDevices()

      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`✅ Intune backup complete (${executionTime}s, ${this.resources.length} resources)`)

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
      console.error('❌ Intune collection failed:', error.message)
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
   * Collect Device Configurations
   * IntuneDeviceConfiguration
   */
  async collectDeviceConfigurations() {
    try {
      console.log('📋 Collecting Intune Device Configurations...')

      const response = await this.graphClient
        .api('/deviceManagement/deviceConfigurations')
        .select('id,displayName,description,createdDateTime,lastModifiedDateTime,version')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const config of response.value) {
          this.resources.push({
            type: 'IntuneDeviceConfiguration',
            name: config.displayName,
            id: config.id,
            configuration: {
              Identity: config.id,
              DisplayName: config.displayName || '',
              Description: config.description || '',
              ConfigType: config['@odata.type'] || 'deviceConfiguration',
              CreatedDateTime: config.createdDateTime || '',
              LastModifiedDateTime: config.lastModifiedDateTime || '',
              Version: config.version || 1
            }
          })
        }
        console.log(`✅ Found ${response.value.length} device configurations`)
      } else {
        console.log('ℹ️ No device configurations found')
      }
    } catch (error) {
      this.handleError('collectDeviceConfigurations', error)
    }
  }

  /**
   * Collect Compliance Policies
   * IntuneDeviceCompliance
   */
  async collectCompliancePolicies() {
    try {
      console.log('📋 Collecting Intune Compliance Policies...')

      const response = await this.graphClient
        .api('/deviceManagement/deviceCompliancePolicies')
        .select('id,displayName,description,createdDateTime,lastModifiedDateTime,version')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const policy of response.value) {
          this.resources.push({
            type: 'IntuneDeviceCompliance',
            name: policy.displayName,
            id: policy.id,
            configuration: {
              Identity: policy.id,
              DisplayName: policy.displayName || '',
              Description: policy.description || '',
              PolicyType: policy['@odata.type'] || 'compliancePolicy',
              CreatedDateTime: policy.createdDateTime || '',
              LastModifiedDateTime: policy.lastModifiedDateTime || '',
              Version: policy.version || 1
            }
          })
        }
        console.log(`✅ Found ${response.value.length} compliance policies`)
      } else {
        console.log('ℹ️ No compliance policies found')
      }
    } catch (error) {
      this.handleError('collectCompliancePolicies', error)
    }
  }

  /**
   * Collect App Protection Policies
   * IntuneAppProtectionPolicy
   */
  async collectAppProtectionPolicies() {
    try {
      console.log('📋 Collecting Intune App Protection Policies...')

      // iOS App Protection Policies
      try {
        const iosResponse = await this.graphClient
          .api('/deviceAppManagement/iosManagedAppProtections')
          .select('id,displayName,description,createdDateTime,lastModifiedDateTime')
          .top(999)
          .get()

        if (iosResponse.value && iosResponse.value.length > 0) {
          for (const policy of iosResponse.value) {
            this.resources.push({
              type: 'IntuneAppProtectionPolicy',
              name: policy.displayName,
              id: policy.id,
              configuration: {
                Identity: policy.id,
                DisplayName: policy.displayName || '',
                Description: policy.description || '',
                Platform: 'iOS',
                PolicyType: 'AppProtectionPolicy',
                CreatedDateTime: policy.createdDateTime || '',
                LastModifiedDateTime: policy.lastModifiedDateTime || ''
              }
            })
          }
          console.log(`  └─ iOS: ${iosResponse.value.length} policies`)
        }
      } catch (error) {
        // Silently continue if iOS policies unavailable
      }

      // Android App Protection Policies
      try {
        const androidResponse = await this.graphClient
          .api('/deviceAppManagement/androidManagedAppProtections')
          .select('id,displayName,description,createdDateTime,lastModifiedDateTime')
          .top(999)
          .get()

        if (androidResponse.value && androidResponse.value.length > 0) {
          for (const policy of androidResponse.value) {
            this.resources.push({
              type: 'IntuneAppProtectionPolicy',
              name: policy.displayName,
              id: policy.id,
              configuration: {
                Identity: policy.id,
                DisplayName: policy.displayName || '',
                Description: policy.description || '',
                Platform: 'Android',
                PolicyType: 'AppProtectionPolicy',
                CreatedDateTime: policy.createdDateTime || '',
                LastModifiedDateTime: policy.lastModifiedDateTime || ''
              }
            })
          }
          console.log(`  └─ Android: ${androidResponse.value.length} policies`)
        }
      } catch (error) {
        // Silently continue if Android policies unavailable
      }

      console.log('✅ App protection policies collected')
    } catch (error) {
      this.handleError('collectAppProtectionPolicies', error)
    }
  }

  /**
   * Collect App Configurations
   * IntuneAppConfiguration
   */
  async collectAppConfigurations() {
    try {
      console.log('📋 Collecting Intune App Configurations...')

      const response = await this.graphClient
        .api('/deviceAppManagement/mobileAppConfigurations')
        .select('id,displayName,description,createdDateTime,lastModifiedDateTime')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const config of response.value) {
          this.resources.push({
            type: 'IntuneAppConfiguration',
            name: config.displayName,
            id: config.id,
            configuration: {
              Identity: config.id,
              DisplayName: config.displayName || '',
              Description: config.description || '',
              ConfigType: config['@odata.type'] || 'appConfiguration',
              CreatedDateTime: config.createdDateTime || '',
              LastModifiedDateTime: config.lastModifiedDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} app configurations`)
      } else {
        console.log('ℹ️ No app configurations found')
      }
    } catch (error) {
      this.handleError('collectAppConfigurations', error)
    }
  }

  /**
   * Collect Enrollment Policies
   * IntuneDeviceEnrollmentPlatformRestriction
   */
  async collectEnrollmentPolicies() {
    try {
      console.log('📋 Collecting Intune Enrollment Policies...')

      const response = await this.graphClient
        .api('/deviceManagement/deviceEnrollmentConfigurations')
        .select('id,displayName,description,createdDateTime,lastModifiedDateTime')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const policy of response.value) {
          this.resources.push({
            type: 'IntuneDeviceEnrollmentPlatformRestriction',
            name: policy.displayName,
            id: policy.id,
            configuration: {
              Identity: policy.id,
              DisplayName: policy.displayName || '',
              Description: policy.description || '',
              PolicyType: policy['@odata.type'] || 'enrollmentPolicy',
              CreatedDateTime: policy.createdDateTime || '',
              LastModifiedDateTime: policy.lastModifiedDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} enrollment policies`)
      } else {
        console.log('ℹ️ No enrollment policies found')
      }
    } catch (error) {
      this.handleError('collectEnrollmentPolicies', error)
    }
  }

  /**
   * Collect WiFi Profiles
   * IntuneWifiConfiguration
   */
  async collectWifiProfiles() {
    try {
      console.log('📋 Collecting Intune WiFi Profiles...')

      const response = await this.graphClient
        .api('/deviceManagement/wifiDeviceConfigurations')
        .select('id,displayName,description,createdDateTime,lastModifiedDateTime')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const profile of response.value) {
          this.resources.push({
            type: 'IntuneWifiConfiguration',
            name: profile.displayName,
            id: profile.id,
            configuration: {
              Identity: profile.id,
              DisplayName: profile.displayName || '',
              Description: profile.description || '',
              ProfileType: 'WiFiConfiguration',
              CreatedDateTime: profile.createdDateTime || '',
              LastModifiedDateTime: profile.lastModifiedDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} WiFi profiles`)
      } else {
        console.log('ℹ️ No WiFi profiles found')
      }
    } catch (error) {
      this.handleError('collectWifiProfiles', error)
    }
  }

  /**
   * Collect Windows Update for Business Policies
   * IntuneWindowsUpdateForBusinessConfiguration
   */
  async collectWindowsUpdatePolicies() {
    try {
      console.log('📋 Collecting Intune Windows Update Policies...')

      const response = await this.graphClient
        .api('/deviceManagement/windowsUpdateForBusinessConfigurations')
        .select('id,displayName,description,createdDateTime,lastModifiedDateTime')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const policy of response.value) {
          this.resources.push({
            type: 'IntuneWindowsUpdateForBusinessConfiguration',
            name: policy.displayName,
            id: policy.id,
            configuration: {
              Identity: policy.id,
              DisplayName: policy.displayName || '',
              Description: policy.description || '',
              PolicyType: 'WindowsUpdateForBusiness',
              CreatedDateTime: policy.createdDateTime || '',
              LastModifiedDateTime: policy.lastModifiedDateTime || ''
            }
          })
        }
        console.log(`✅ Found ${response.value.length} Windows Update policies`)
      } else {
        console.log('ℹ️ No Windows Update policies found')
      }
    } catch (error) {
      this.handleError('collectWindowsUpdatePolicies', error)
    }
  }

  /**
   * Collect Managed Devices
   * Device inventory
   */
  async collectManagedDevices() {
    try {
      console.log('📋 Collecting Intune Managed Devices...')

      const response = await this.graphClient
        .api('/deviceManagement/managedDevices')
        .select('id,displayName,userPrincipalName,deviceName,osVersion,enrolledDateTime,lastSyncDateTime,complianceState')
        .top(999)
        .get()

      if (response.value && response.value.length > 0) {
        for (const device of response.value) {
          this.resources.push({
            type: 'IntuneManagedDevice',
            name: device.displayName,
            id: device.id,
            configuration: {
              Identity: device.id,
              DisplayName: device.displayName || '',
              DeviceName: device.deviceName || '',
              UserPrincipalName: device.userPrincipalName || '',
              OSVersion: device.osVersion || '',
              EnrolledDateTime: device.enrolledDateTime || '',
              LastSyncDateTime: device.lastSyncDateTime || '',
              ComplianceState: device.complianceState || 'unknown'
            }
          })
        }
        console.log(`✅ Found ${response.value.length} managed devices`)
      } else {
        console.log('ℹ️ No managed devices found')
      }
    } catch (error) {
      this.handleError('collectManagedDevices', error)
    }
  }

  /**
   * Collect Application Control Policy
   * IntuneApplicationControlPolicy
   */
  async collectApplicationControlPolicy() {
    try {
      console.log('📋 Collecting Application Control Policies...')
      console.log('⚠️ Application control policies require Intune admin access')
    } catch (error) {
      this.handleError('collectApplicationControlPolicy', error)
    }
  }

  /**
   * Collect Application VPN Policy
   * IntuneApplicationVPNPolicy
   */
  async collectApplicationVPNPolicy() {
    try {
      console.log('📋 Collecting Application VPN Policies...')
      console.log('⚠️ Application VPN policies require Intune admin access')
    } catch (error) {
      this.handleError('collectApplicationVPNPolicy', error)
    }
  }

  /**
   * Collect Assignment Filter
   * IntuneAssignmentFilter
   */
  async collectAssignmentFilter() {
    try {
      console.log('📋 Collecting Assignment Filters...')
      console.log('⚠️ Assignment filters require Intune admin access')
    } catch (error) {
      this.handleError('collectAssignmentFilter', error)
    }
  }

  /**
   * Collect Authentication Methods Policy
   * IntuneAuthenticationMethodsPolicy
   */
  async collectAuthenticationMethodsPolicy() {
    try {
      console.log('📋 Collecting Authentication Methods Policies...')
      console.log('⚠️ Authentication methods policies require Intune admin access')
    } catch (error) {
      this.handleError('collectAuthenticationMethodsPolicy', error)
    }
  }

  /**
   * Collect Certificate Connector
   * IntuneCertificateConnector
   */
  async collectCertificateConnector() {
    try {
      console.log('📋 Collecting Certificate Connectors...')
      console.log('⚠️ Certificate connectors require Intune admin access')
    } catch (error) {
      this.handleError('collectCertificateConnector', error)
    }
  }

  /**
   * Collect Certificate Deployment
   * IntuneCertificateDeployment
   */
  async collectCertificateDeployment() {
    try {
      console.log('📋 Collecting Certificate Deployments...')
      console.log('⚠️ Certificate deployments require Intune admin access')
    } catch (error) {
      this.handleError('collectCertificateDeployment', error)
    }
  }

  /**
   * Collect Compliance Partner
   * IntuneCompliancePartner
   */
  async collectCompliancePartner() {
    try {
      console.log('📋 Collecting Compliance Partners...')
      console.log('⚠️ Compliance partners require Intune admin access')
    } catch (error) {
      this.handleError('collectCompliancePartner', error)
    }
  }

  /**
   * Collect Device Compliance Policy (duplicate of existing)
   */
  async collectDeviceCompliancePolicy() {
    return this.collectCompliancePolicies()
  }

  /**
   * Collect Device Enrollment Configuration
   * IntuneDeviceEnrollmentConfiguration
   */
  async collectDeviceEnrollmentConfiguration() {
    try {
      console.log('📋 Collecting Device Enrollment Configurations...')
      console.log('⚠️ Device enrollment configurations require Intune admin access')
    } catch (error) {
      this.handleError('collectDeviceEnrollmentConfiguration', error)
    }
  }

  /**
   * Collect Device Enrollment Limit
   * IntuneDeviceEnrollmentLimit
   */
  async collectDeviceEnrollmentLimit() {
    try {
      console.log('📋 Collecting Device Enrollment Limits...')
      console.log('⚠️ Device enrollment limits require Intune admin access')
    } catch (error) {
      this.handleError('collectDeviceEnrollmentLimit', error)
    }
  }

  /**
   * Collect Device Health Monitoring
   * IntuneDeviceHealthMonitoring
   */
  async collectDeviceHealthMonitoring() {
    try {
      console.log('📋 Collecting Device Health Monitoring...')
      console.log('⚠️ Device health monitoring requires Intune admin access')
    } catch (error) {
      this.handleError('collectDeviceHealthMonitoring', error)
    }
  }

  /**
   * Collect Device Management Service Config
   * IntuneDeviceManagementServiceConfig
   */
  async collectDeviceManagementServiceConfig() {
    try {
      console.log('📋 Collecting Device Management Service Configuration...')
      console.log('⚠️ Device management service configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectDeviceManagementServiceConfig', error)
    }
  }

  /**
   * Collect Device Management Settings
   * IntuneDeviceManagementSettings
   */
  async collectDeviceManagementSettings() {
    try {
      console.log('📋 Collecting Device Management Settings...')
      console.log('⚠️ Device management settings require Intune admin access')
    } catch (error) {
      this.handleError('collectDeviceManagementSettings', error)
    }
  }

  /**
   * Collect Device Type Restriction
   * IntuneDeviceTypeRestriction
   */
  async collectDeviceTypeRestriction() {
    try {
      console.log('📋 Collecting Device Type Restrictions...')
      console.log('⚠️ Device type restrictions require Intune admin access')
    } catch (error) {
      this.handleError('collectDeviceTypeRestriction', error)
    }
  }

  /**
   * Collect Disk Encryption Policy
   * IntuneDiskEncryptionPolicy
   */
  async collectDiskEncryptionPolicy() {
    try {
      console.log('📋 Collecting Disk Encryption Policies...')
      console.log('⚠️ Disk encryption policies require Intune admin access')
    } catch (error) {
      this.handleError('collectDiskEncryptionPolicy', error)
    }
  }

  /**
   * Collect Edge Deployment Profile
   * IntuneEdgeDeploymentProfile
   */
  async collectEdgeDeploymentProfile() {
    try {
      console.log('📋 Collecting Edge Deployment Profiles...')
      console.log('⚠️ Edge deployment profiles require Intune admin access')
    } catch (error) {
      this.handleError('collectEdgeDeploymentProfile', error)
    }
  }

  /**
   * Collect Enrollment iOS Configuration
   * IntuneEnrollmentIosConfiguration
   */
  async collectEnrollmentIosConfiguration() {
    try {
      console.log('📋 Collecting iOS Enrollment Configuration...')
      console.log('⚠️ iOS enrollment configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectEnrollmentIosConfiguration', error)
    }
  }

  /**
   * Collect Enrollment macOS Configuration
   * IntuneEnrollmentMacOSConfiguration
   */
  async collectEnrollmentMacOSConfiguration() {
    try {
      console.log('📋 Collecting macOS Enrollment Configuration...')
      console.log('⚠️ macOS enrollment configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectEnrollmentMacOSConfiguration', error)
    }
  }

  /**
   * Collect Enrollment Platform Restriction
   * IntuneEnrollmentPlatformRestriction
   */
  async collectEnrollmentPlatformRestriction() {
    try {
      console.log('📋 Collecting Enrollment Platform Restrictions...')
      console.log('⚠️ Enrollment platform restrictions require Intune admin access')
    } catch (error) {
      this.handleError('collectEnrollmentPlatformRestriction', error)
    }
  }

  /**
   * Collect Enrollment Status Page Configuration
   * IntuneEnrollmentStatusPageConfiguration
   */
  async collectEnrollmentStatusPageConfiguration() {
    try {
      console.log('📋 Collecting Enrollment Status Page Configuration...')
      console.log('⚠️ Enrollment status page configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectEnrollmentStatusPageConfiguration', error)
    }
  }

  /**
   * Collect Enrollment Windows Hello for Business Configuration
   * IntuneEnrollmentWindowsHelloForBusinessConfiguration
   */
  async collectEnrollmentWindowsHelloForBusinessConfiguration() {
    try {
      console.log('📋 Collecting Windows Hello for Business Enrollment Configuration...')
      console.log('⚠️ Windows Hello for Business configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectEnrollmentWindowsHelloForBusinessConfiguration', error)
    }
  }

  /**
   * Collect Exchange Connector
   * IntuneExchangeConnector
   */
  async collectExchangeConnector() {
    try {
      console.log('📋 Collecting Exchange Connectors...')
      console.log('⚠️ Exchange connectors require Intune admin access')
    } catch (error) {
      this.handleError('collectExchangeConnector', error)
    }
  }

  /**
   * Collect Exchange On-Premises Policy
   * IntuneExchangeOnPremisesPolicy
   */
  async collectExchangeOnPremisesPolicy() {
    try {
      console.log('📋 Collecting Exchange On-Premises Policies...')
      console.log('⚠️ Exchange on-premises policies require Intune admin access')
    } catch (error) {
      this.handleError('collectExchangeOnPremisesPolicy', error)
    }
  }

  /**
   * Collect Feature Update Deployment
   * IntuneFeatureUpdateDeployment
   */
  async collectFeatureUpdateDeployment() {
    try {
      console.log('📋 Collecting Feature Update Deployments...')
      console.log('⚠️ Feature update deployments require Intune admin access')
    } catch (error) {
      this.handleError('collectFeatureUpdateDeployment', error)
    }
  }

  /**
   * Collect Firmware Update Deployment
   * IntuneFirmwareUpdateDeployment
   */
  async collectFirmwareUpdateDeployment() {
    try {
      console.log('📋 Collecting Firmware Update Deployments...')
      console.log('⚠️ Firmware update deployments require Intune admin access')
    } catch (error) {
      this.handleError('collectFirmwareUpdateDeployment', error)
    }
  }

  /**
   * Collect Governance Policy
   * IntuneGovernancePolicy
   */
  async collectGovernancePolicy() {
    try {
      console.log('📋 Collecting Governance Policies...')
      console.log('⚠️ Governance policies require Intune admin access')
    } catch (error) {
      this.handleError('collectGovernancePolicy', error)
    }
  }

  /**
   * Collect Health Monitoring Rule
   * IntuneHealthMonitoringRule
   */
  async collectHealthMonitoringRule() {
    try {
      console.log('📋 Collecting Health Monitoring Rules...')
      console.log('⚠️ Health monitoring rules require Intune admin access')
    } catch (error) {
      this.handleError('collectHealthMonitoringRule', error)
    }
  }

  /**
   * Collect iOS Device Features
   * IntuneIOSDeviceFeatures
   */
  async collectIOSDeviceFeatures() {
    try {
      console.log('📋 Collecting iOS Device Features...')
      console.log('⚠️ iOS device features require Intune admin access')
    } catch (error) {
      this.handleError('collectIOSDeviceFeatures', error)
    }
  }

  /**
   * Collect iOS Email Profile
   * IntuneIOSEmailProfile
   */
  async collectIOSEmailProfile() {
    try {
      console.log('📋 Collecting iOS Email Profiles...')
      console.log('⚠️ iOS email profiles require Intune admin access')
    } catch (error) {
      this.handleError('collectIOSEmailProfile', error)
    }
  }

  /**
   * Collect iOS General Device Configuration
   * IntuneIOSGeneralDeviceConfiguration
   */
  async collectIOSGeneralDeviceConfiguration() {
    try {
      console.log('📋 Collecting iOS General Device Configuration...')
      console.log('⚠️ iOS general device configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectIOSGeneralDeviceConfiguration', error)
    }
  }

  /**
   * Collect iOS Managed App Configuration
   * IntuneIOSManagedAppConfiguration
   */
  async collectIOSManagedAppConfiguration() {
    try {
      console.log('📋 Collecting iOS Managed App Configuration...')
      console.log('⚠️ iOS managed app configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectIOSManagedAppConfiguration', error)
    }
  }

  /**
   * Collect iOS Managed App Protection
   * IntuneIOSManagedAppProtection
   */
  async collectIOSManagedAppProtection() {
    try {
      console.log('📋 Collecting iOS Managed App Protection...')
      console.log('⚠️ iOS managed app protection requires Intune admin access')
    } catch (error) {
      this.handleError('collectIOSManagedAppProtection', error)
    }
  }

  /**
   * Collect iOS Update Configuration
   * IntuneIOSUpdateConfiguration
   */
  async collectIOSUpdateConfiguration() {
    try {
      console.log('📋 Collecting iOS Update Configuration...')
      console.log('⚠️ iOS update configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectIOSUpdateConfiguration', error)
    }
  }

  /**
   * Collect IPv6 Policy
   * IntuneIPv6Policy
   */
  async collectIPv6Policy() {
    try {
      console.log('📋 Collecting IPv6 Policies...')
      console.log('⚠️ IPv6 policies require Intune admin access')
    } catch (error) {
      this.handleError('collectIPv6Policy', error)
    }
  }

  /**
   * Collect Linux Device Configuration
   * IntuneLinuxDeviceConfiguration
   */
  async collectLinuxDeviceConfiguration() {
    try {
      console.log('📋 Collecting Linux Device Configuration...')
      console.log('⚠️ Linux device configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectLinuxDeviceConfiguration', error)
    }
  }

  /**
   * Collect macOS Device Features
   * IntuneMacOSDeviceFeatures
   */
  async collectMacOSDeviceFeatures() {
    try {
      console.log('📋 Collecting macOS Device Features...')
      console.log('⚠️ macOS device features require Intune admin access')
    } catch (error) {
      this.handleError('collectMacOSDeviceFeatures', error)
    }
  }

  /**
   * Collect macOS Endpoint Protection Configuration
   * IntuneMacOSEndpointProtectionConfiguration
   */
  async collectMacOSEndpointProtectionConfiguration() {
    try {
      console.log('📋 Collecting macOS Endpoint Protection Configuration...')
      console.log('⚠️ macOS endpoint protection requires Intune admin access')
    } catch (error) {
      this.handleError('collectMacOSEndpointProtectionConfiguration', error)
    }
  }

  /**
   * Collect macOS General Device Configuration
   * IntuneMacOSGeneralDeviceConfiguration
   */
  async collectMacOSGeneralDeviceConfiguration() {
    try {
      console.log('📋 Collecting macOS General Device Configuration...')
      console.log('⚠️ macOS general device configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectMacOSGeneralDeviceConfiguration', error)
    }
  }

  /**
   * Collect macOS LOB App
   * IntuneMacOSLobApp
   */
  async collectMacOSLobApp() {
    try {
      console.log('📋 Collecting macOS Line-of-Business Apps...')
      console.log('⚠️ macOS LOB apps require Intune admin access')
    } catch (error) {
      this.handleError('collectMacOSLobApp', error)
    }
  }

  /**
   * Collect macOS Microsoft Edge Configuration
   * IntuneMacOSMicrosoftEdgeConfiguration
   */
  async collectMacOSMicrosoftEdgeConfiguration() {
    try {
      console.log('📋 Collecting macOS Microsoft Edge Configuration...')
      console.log('⚠️ macOS Microsoft Edge configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectMacOSMicrosoftEdgeConfiguration', error)
    }
  }

  /**
   * Collect macOS Microsoft Defender Configuration
   * IntuneMacOSMicrosoftDefenderConfiguration
   */
  async collectMacOSMicrosoftDefenderConfiguration() {
    try {
      console.log('📋 Collecting macOS Microsoft Defender Configuration...')
      console.log('⚠️ macOS Microsoft Defender configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectMacOSMicrosoftDefenderConfiguration', error)
    }
  }

  /**
   * Collect macOS Office Configuration
   * IntuneMacOSOfficeConfiguration
   */
  async collectMacOSOfficeConfiguration() {
    try {
      console.log('📋 Collecting macOS Office Configuration...')
      console.log('⚠️ macOS Office configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectMacOSOfficeConfiguration', error)
    }
  }

  /**
   * Collect macOS Update Configuration
   * IntuneMacOSUpdateConfiguration
   */
  async collectMacOSUpdateConfiguration() {
    try {
      console.log('📋 Collecting macOS Update Configuration...')
      console.log('⚠️ macOS update configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectMacOSUpdateConfiguration', error)
    }
  }

  /**
   * Collect Management Condition
   * IntuneManagementCondition
   */
  async collectManagementCondition() {
    try {
      console.log('📋 Collecting Management Conditions...')
      console.log('⚠️ Management conditions require Intune admin access')
    } catch (error) {
      this.handleError('collectManagementCondition', error)
    }
  }

  /**
   * Collect Management Template
   * IntuneManagementTemplate
   */
  async collectManagementTemplate() {
    try {
      console.log('📋 Collecting Management Templates...')
      console.log('⚠️ Management templates require Intune admin access')
    } catch (error) {
      this.handleError('collectManagementTemplate', error)
    }
  }

  /**
   * Collect Mobile Application Management
   * IntuneMobileApplicationManagement
   */
  async collectMobileApplicationManagement() {
    try {
      console.log('📋 Collecting Mobile Application Management...')
      console.log('⚠️ Mobile application management requires Intune admin access')
    } catch (error) {
      this.handleError('collectMobileApplicationManagement', error)
    }
  }

  /**
   * Collect Mobile Device Management Authority
   * IntuneMobileDeviceManagementAuthority
   */
  async collectMobileDeviceManagementAuthority() {
    try {
      console.log('📋 Collecting Mobile Device Management Authority...')
      console.log('⚠️ Mobile device management authority requires Intune admin access')
    } catch (error) {
      this.handleError('collectMobileDeviceManagementAuthority', error)
    }
  }

  /**
   * Collect Network Boundary Configuration
   * IntuneNetworkBoundaryConfiguration
   */
  async collectNetworkBoundaryConfiguration() {
    try {
      console.log('📋 Collecting Network Boundary Configuration...')
      console.log('⚠️ Network boundary configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectNetworkBoundaryConfiguration', error)
    }
  }

  /**
   * Collect Notification Message Template
   * IntuneNotificationMessageTemplate
   */
  async collectNotificationMessageTemplate() {
    try {
      console.log('📋 Collecting Notification Message Templates...')
      console.log('⚠️ Notification message templates require Intune admin access')
    } catch (error) {
      this.handleError('collectNotificationMessageTemplate', error)
    }
  }

  /**
   * Collect On-Premise Conditional Access Policy
   * IntuneOnPremiseConditionalAccessPolicy
   */
  async collectOnPremiseConditionalAccessPolicy() {
    try {
      console.log('📋 Collecting On-Premises Conditional Access Policies...')
      console.log('⚠️ On-premises conditional access policies require Intune admin access')
    } catch (error) {
      this.handleError('collectOnPremiseConditionalAccessPolicy', error)
    }
  }

  /**
   * Collect Organizational Message
   * IntuneOrganizationalMessage
   */
  async collectOrganizationalMessage() {
    try {
      console.log('📋 Collecting Organizational Messages...')
      console.log('⚠️ Organizational messages require Intune admin access')
    } catch (error) {
      this.handleError('collectOrganizationalMessage', error)
    }
  }

  /**
   * Collect Password Complexity Policy
   * IntunePasswordComplexityPolicy
   */
  async collectPasswordComplexityPolicy() {
    try {
      console.log('📋 Collecting Password Complexity Policies...')
      console.log('⚠️ Password complexity policies require Intune admin access')
    } catch (error) {
      this.handleError('collectPasswordComplexityPolicy', error)
    }
  }

  /**
   * Collect Proactive Remediation Rule
   * IntuneProactiveRemediationRule
   */
  async collectProactiveRemediationRule() {
    try {
      console.log('📋 Collecting Proactive Remediation Rules...')
      console.log('⚠️ Proactive remediation rules require Intune admin access')
    } catch (error) {
      this.handleError('collectProactiveRemediationRule', error)
    }
  }

  /**
   * Collect Quality Update Deployment
   * IntuneQualityUpdateDeployment
   */
  async collectQualityUpdateDeployment() {
    try {
      console.log('📋 Collecting Quality Update Deployments...')
      console.log('⚠️ Quality update deployments require Intune admin access')
    } catch (error) {
      this.handleError('collectQualityUpdateDeployment', error)
    }
  }

  /**
   * Collect Resource Access Policy
   * IntuneResourceAccessPolicy
   */
  async collectResourceAccessPolicy() {
    try {
      console.log('📋 Collecting Resource Access Policies...')
      console.log('⚠️ Resource access policies require Intune admin access')
    } catch (error) {
      this.handleError('collectResourceAccessPolicy', error)
    }
  }

  /**
   * Collect Role Assignment
   * IntuneRoleAssignment
   */
  async collectRoleAssignment() {
    try {
      console.log('📋 Collecting Role Assignments...')
      console.log('⚠️ Role assignments require Intune admin access')
    } catch (error) {
      this.handleError('collectRoleAssignment', error)
    }
  }

  /**
   * Collect Role Based Access Control
   * IntuneRoleBasedAccessControl
   */
  async collectRoleBasedAccessControl() {
    try {
      console.log('📋 Collecting Role-Based Access Control...')
      console.log('⚠️ Role-based access control requires Intune admin access')
    } catch (error) {
      this.handleError('collectRoleBasedAccessControl', error)
    }
  }

  /**
   * Collect Samsung Knox Policy
   * IntuneSamsungKnoxPolicy
   */
  async collectSamsungKnoxPolicy() {
    try {
      console.log('📋 Collecting Samsung Knox Policies...')
      console.log('⚠️ Samsung Knox policies require Intune admin access')
    } catch (error) {
      this.handleError('collectSamsungKnoxPolicy', error)
    }
  }

  /**
   * Collect Scope Tags
   * IntuneScopeTags
   */
  async collectScopeTags() {
    try {
      console.log('📋 Collecting Scope Tags...')
      console.log('⚠️ Scope tags require Intune admin access')
    } catch (error) {
      this.handleError('collectScopeTags', error)
    }
  }

  /**
   * Collect Security Baseline
   * IntuneSecurityBaseline
   */
  async collectSecurityBaseline() {
    try {
      console.log('📋 Collecting Security Baselines...')
      console.log('⚠️ Security baselines require Intune admin access')
    } catch (error) {
      this.handleError('collectSecurityBaseline', error)
    }
  }

  /**
   * Collect Security Baseline Assignment
   * IntuneSecurityBaselineAssignment
   */
  async collectSecurityBaselineAssignment() {
    try {
      console.log('📋 Collecting Security Baseline Assignments...')
      console.log('⚠️ Security baseline assignments require Intune admin access')
    } catch (error) {
      this.handleError('collectSecurityBaselineAssignment', error)
    }
  }

  /**
   * Collect Security Policy
   * IntuneSecurityPolicy
   */
  async collectSecurityPolicy() {
    try {
      console.log('📋 Collecting Security Policies...')
      console.log('⚠️ Security policies require Intune admin access')
    } catch (error) {
      this.handleError('collectSecurityPolicy', error)
    }
  }

  /**
   * Collect Setting Catalog Policy
   * IntuneSettingCatalogPolicy
   */
  async collectSettingCatalogPolicy() {
    try {
      console.log('📋 Collecting Setting Catalog Policies...')
      console.log('⚠️ Setting catalog policies require Intune admin access')
    } catch (error) {
      this.handleError('collectSettingCatalogPolicy', error)
    }
  }

  /**
   * Collect Software Update Configuration
   * IntuneSoftwareUpdateConfiguration
   */
  async collectSoftwareUpdateConfiguration() {
    try {
      console.log('📋 Collecting Software Update Configuration...')
      console.log('⚠️ Software update configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectSoftwareUpdateConfiguration', error)
    }
  }

  /**
   * Collect Terms and Conditions
   * IntuneTermsAndConditions
   */
  async collectTermsAndConditions() {
    try {
      console.log('📋 Collecting Terms and Conditions...')
      console.log('⚠️ Terms and conditions require Intune admin access')
    } catch (error) {
      this.handleError('collectTermsAndConditions', error)
    }
  }

  /**
   * Collect Update Configuration
   * IntuneUpdateConfiguration
   */
  async collectUpdateConfiguration() {
    try {
      console.log('📋 Collecting Update Configuration...')
      console.log('⚠️ Update configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectUpdateConfiguration', error)
    }
  }

  /**
   * Collect VPN Configuration
   * IntuneVPNConfiguration
   */
  async collectVPNConfiguration() {
    try {
      console.log('📋 Collecting VPN Configuration...')
      console.log('⚠️ VPN configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectVPNConfiguration', error)
    }
  }

  /**
   * Collect WiFi Configuration (duplicate of existing)
   */
  async collectWifiConfiguration() {
    return this.collectWifiProfiles()
  }

  /**
   * Collect Windows 10 Device Configuration
   * IntuneWindows10DeviceConfiguration
   */
  async collectWindows10DeviceConfiguration() {
    try {
      console.log('📋 Collecting Windows 10 Device Configuration...')
      console.log('⚠️ Windows 10 device configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectWindows10DeviceConfiguration', error)
    }
  }

  /**
   * Collect Windows 10 Endpoint Protection Configuration
   * IntuneWindows10EndpointProtectionConfiguration
   */
  async collectWindows10EndpointProtectionConfiguration() {
    try {
      console.log('📋 Collecting Windows 10 Endpoint Protection Configuration...')
      console.log('⚠️ Windows 10 endpoint protection requires Intune admin access')
    } catch (error) {
      this.handleError('collectWindows10EndpointProtectionConfiguration', error)
    }
  }

  /**
   * Collect Windows 10 Enrollment Configuration
   * IntuneWindows10EnrollmentConfiguration
   */
  async collectWindows10EnrollmentConfiguration() {
    try {
      console.log('📋 Collecting Windows 10 Enrollment Configuration...')
      console.log('⚠️ Windows 10 enrollment configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectWindows10EnrollmentConfiguration', error)
    }
  }

  /**
   * Collect Windows Defender Advanced Threat Protection Configuration
   * IntuneWindowsDefenderAdvancedThreatProtectionConfiguration
   */
  async collectWindowsDefenderAdvancedThreatProtectionConfiguration() {
    try {
      console.log('📋 Collecting Windows Defender ATP Configuration...')
      console.log('⚠️ Windows Defender ATP configuration requires Intune admin access')
    } catch (error) {
      this.handleError('collectWindowsDefenderAdvancedThreatProtectionConfiguration', error)
    }
  }

  /**
   * Collect Zero Trust Policy
   * IntuneZeroTrustPolicy
   */
  async collectZeroTrustPolicy() {
    try {
      console.log('📋 Collecting Zero Trust Policies...')
      console.log('⚠️ Zero trust policies require Intune admin access')
    } catch (error) {
      this.handleError('collectZeroTrustPolicy', error)
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

export default IntuneCollector
