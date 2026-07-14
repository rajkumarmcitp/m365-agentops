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
      await this.collectEnrollmentPolicies()
      await this.collectWifiProfiles()
      await this.collectWindowsUpdatePolicies()
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
