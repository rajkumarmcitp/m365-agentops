/**
 * Device Control Validations
 *
 * Comprehensive validation of 34 Intune/Device security controls
 * Uses data from DeviceCollectors to evaluate compliance state
 * NO DEMO DATA - All results based on real Graph API data
 */

export class DeviceValidations {
  constructor(collectedData) {
    this.data = collectedData
  }

  /**
   * Run all device validations
   */
  async validateAll() {
    return {
      authentication: await this.validateAuthentication(),
      deviceHealth: await this.validateDeviceHealth(),
      osSecurity: await this.validateOSSecurity(),
      encryption: await this.validateEncryption(),
      deviceRestrictions: await this.validateDeviceRestrictions(),
      dataProtection: await this.validateDataProtection(),
      applicationSecurity: await this.validateApplicationSecurity(),
      deploymentCompliance: await this.validateDeploymentCompliance()
    }
  }

  /**
   * Authentication & Access Control Validations
   */
  async validateAuthentication() {
    const results = []
    const compliance = this.data.compliance?.all || []

    // DEV-035: Password/Passcode Requirements - Validate actual policies exist
    const passwordPolicies = compliance.filter(p => p.passwordRequired === true)
    const platforms = new Set()
    passwordPolicies.forEach(p => {
      if (p.platform) platforms.add(p.platform)
    })

    const value = platforms.size === 0
      ? 'No password requirements found'
      : `${[...platforms].join(', ')}: Required (${passwordPolicies.length} policies)`

    results.push({
      id: 'DEV-035',
      name: 'Password/Passcode Requirements',
      status: passwordPolicies.length >= 1 ? 'pass' : 'fail',
      value,
      remediation: 'Create compliance policies requiring strong passwords across all platforms.'
    })

    // DEV-036: Password Complexity - Check for character set requirements
    const complexityPolicies = compliance.filter(p => p.passwordMinimumCharacterSetCount >= 4)
    results.push({
      id: 'DEV-036',
      name: 'Password Complexity Policy',
      status: complexityPolicies.length >= 1 ? 'pass' : 'warn',
      value: complexityPolicies.length === 0
        ? 'No character complexity policies found'
        : `${complexityPolicies.length} policies enforce character set complexity`,
      remediation: 'Ensure compliance policies enforce alphanumeric and special character requirements.'
    })

    // DEV-037: Password Expiration
    const expirationPolicies = compliance.filter(p => p.passwordExpirationDays && p.passwordExpirationDays <= 90)
    results.push({
      id: 'DEV-037',
      name: 'Password Expiration Policy',
      status: expirationPolicies.length >= 1 ? 'pass' : 'warn',
      value: expirationPolicies.length === 0
        ? 'No password expiration policies found'
        : `${expirationPolicies.length} policies enforce expiration (<=90 days)`,
      remediation: 'Set compliance policies to require password change every 90 days.'
    })

    return results
  }

  /**
   * Device Health & Threat Detection Validations
   */
  async validateDeviceHealth() {
    const results = []
    const compliance = this.data.compliance?.all || []
    const caPolicy = this.data.conditionalAccess?.all || []
    const mdeConfig = this.data.endpointSecurity?.mde?.configured

    // DEV-038: Jailbreak/Root Detection
    const jailbreakPolicies = compliance.filter(p => p.jailBreakDetected === true || p.jailbreakedDevice === true)
    results.push({
      id: 'DEV-038',
      name: 'Jailbreak/Root Detection',
      status: jailbreakPolicies.length >= 1 ? 'pass' : 'fail',
      value: jailbreakPolicies.length === 0
        ? 'Jailbreak/root detection not configured'
        : `${jailbreakPolicies.length} policies enforce jailbreak/root detection`,
      remediation: 'Enable jailbreak detection on iOS and root detection on Android compliance policies.'
    })

    // DEV-039: Google Play Integrity
    const playIntegrityPolicies = compliance.filter(p => p.platform === 'Android' && p.googlePlayIntegrityEnabled === true)
    results.push({
      id: 'DEV-039',
      name: 'Google Play Integrity Check (Android)',
      status: playIntegrityPolicies.length >= 1 ? 'pass' : 'warn',
      value: playIntegrityPolicies.length === 0
        ? 'Play Integrity check not configured'
        : `${playIntegrityPolicies.length} Android policies enforce Play Integrity`,
      remediation: 'Add Play Integrity check to Android compliance policy.'
    })

    // DEV-040: Defender for Endpoint Integration
    results.push({
      id: 'DEV-040',
      name: 'Defender for Endpoint Integration',
      status: mdeConfig ? 'pass' : 'warn',
      value: mdeConfig ? 'Defender for Endpoint connector enabled' : 'Defender integration not configured',
      remediation: 'Enable Defender for Endpoint connector in Intune.'
    })

    // DEV-041: Device Risk-Based Access
    const riskCA = caPolicy.find(p => p.displayName?.toLowerCase().includes('device risk') && p.state === 'enabled')
    results.push({
      id: 'DEV-041',
      name: 'Device Risk-Based Access',
      status: riskCA ? 'pass' : 'fail',
      value: riskCA ? `CA policy found: ${riskCA.displayName}` : 'No device risk-based CA policy found',
      remediation: 'Create CA policy using Defender device risk connector with Block control.'
    })

    return results
  }

  /**
   * OS Security Validations
   */
  async validateOSSecurity() {
    const results = []
    const compliance = this.data.compliance?.all || []
    const devices = this.data.managedDevices || {}

    // DEV-042: Minimum OS Version
    const osVersionPolicies = compliance.filter(p => p.osMinimumVersion)
    results.push({
      id: 'DEV-042',
      name: 'Minimum OS Version Enforcement',
      status: osVersionPolicies.length >= 2 ? 'pass' : 'warn',
      value: osVersionPolicies.length === 0
        ? 'No minimum OS version policies found'
        : `${osVersionPolicies.length} policies enforce minimum OS versions`,
      remediation: 'Update compliance policies to enforce Windows 11, iOS 17+, Android 13+.'
    })

    // DEV-043: OS Update Compliance
    const complianceRate = devices.complianceRate || 0
    results.push({
      id: 'DEV-043',
      name: 'OS Update Compliance',
      status: complianceRate >= 95 ? 'pass' : (complianceRate >= 85 ? 'warn' : 'fail'),
      value: `${complianceRate}% of ${devices.total || 0} devices compliant`,
      remediation: 'Review update deployment schedule. Block non-compliant devices.'
    })

    return results
  }

  /**
   * Encryption & Hardware Security Validations
   */
  async validateEncryption() {
    const results = []
    const compliance = this.data.compliance?.all || []
    const config = this.data.configuration?.all || []
    const devices = this.data.managedDevices || {}

    // DEV-044: Disk Encryption
    const encryptionPolicies = compliance.filter(p => p.storageRequireEncryption === true)
    const encryptedDevices = devices.encryption?.encrypted || 0
    results.push({
      id: 'DEV-044',
      name: 'Disk Encryption (FileVault, BitLocker, FDE)',
      status: encryptedDevices > 0 ? 'pass' : (encryptionPolicies.length > 0 ? 'warn' : 'fail'),
      value: `${encryptedDevices}/${devices.total || 0} devices encrypted (${encryptionPolicies.length} policies)`,
      remediation: 'Ensure BitLocker, FileVault, and FDE are enforced.'
    })

    // DEV-045: TPM 2.0
    const tpmPolicies = config.filter(p => p.name?.toLowerCase().includes('tpm'))
    results.push({
      id: 'DEV-045',
      name: 'TPM 2.0 Requirement (Windows)',
      status: tpmPolicies.length >= 1 ? 'pass' : 'warn',
      value: tpmPolicies.length === 0 ? 'No TPM 2.0 policy found' : `${tpmPolicies.length} TPM policies configured`,
      remediation: 'Enforce TPM 2.0 in Windows compliance policies.'
    })

    // DEV-046: Secure Boot
    const secureBootPolicies = config.filter(p => p.name?.toLowerCase().includes('secure') && p.name?.toLowerCase().includes('boot'))
    results.push({
      id: 'DEV-046',
      name: 'Secure Boot Enforcement (Windows)',
      status: secureBootPolicies.length >= 1 ? 'pass' : 'warn',
      value: secureBootPolicies.length === 0 ? 'No Secure Boot policy found' : `${secureBootPolicies.length} Secure Boot policies configured`,
      remediation: 'Enforce Secure Boot in Windows compliance policies.'
    })

    return results
  }

  /**
   * Device Restrictions Validations
   */
  async validateDeviceRestrictions() {
    const results = []
    const config = this.data.configuration?.all || []

    const restrictions = [
      {
        id: 'DEV-047',
        name: 'USB Restrictions',
        keywords: ['usb', 'file transfer', 'debugging']
      },
      {
        id: 'DEV-048',
        name: 'Developer Mode / Developer Options Disabled',
        keywords: ['developer', 'dev mode']
      },
      {
        id: 'DEV-049',
        name: 'Camera Restrictions',
        keywords: ['camera']
      },
      {
        id: 'DEV-050',
        name: 'Unknown Sources Blocked (Android)',
        keywords: ['unknown', 'sideload']
      },
      {
        id: 'DEV-051',
        name: 'Bluetooth Restrictions',
        keywords: ['bluetooth']
      },
      {
        id: 'DEV-052',
        name: 'NFC Restrictions (Mobile)',
        keywords: ['nfc']
      },
      {
        id: 'DEV-053',
        name: 'Screen Capture Disabled',
        keywords: ['screenshot', 'screen capture']
      }
    ]

    for (const restriction of restrictions) {
      const matching = config.filter(p =>
        restriction.keywords.some(k => p.name?.toLowerCase().includes(k))
      )
      results.push({
        id: restriction.id,
        name: restriction.name,
        status: matching.length >= 1 ? 'pass' : 'warn',
        value: matching.length === 0
          ? `No ${restriction.name.toLowerCase()} policy configured`
          : `${matching.length} policies configure ${restriction.name.toLowerCase()}`,
        remediation: `Configure and assign policies for ${restriction.name.toLowerCase()}.`
      })
    }

    return results
  }

  /**
   * Data Protection Validations
   */
  async validateDataProtection() {
    const results = []
    const appProt = this.data.appProtection || {}
    const config = this.data.configuration?.all || []

    // DEV-054: Clipboard Restrictions
    const clipboardPolicies = (appProt.ios?.policies?.filter(p => p.clipboardSharingLevel) || [])
      .concat(appProt.android?.policies?.filter(p => p.clipboardSharingLevel) || [])
    results.push({
      id: 'DEV-054',
      name: 'Clipboard Restrictions',
      status: clipboardPolicies.length >= 1 ? 'pass' : 'warn',
      value: `${clipboardPolicies.length} app protection policies restrict clipboard`,
      remediation: 'Ensure iOS and Android APP policies restrict clipboard access.'
    })

    // DEV-055: AirDrop/Nearby Share
    const airdropPolicies = config.filter(p => p.name?.toLowerCase().includes('airdrop') || p.name?.toLowerCase().includes('nearby'))
    results.push({
      id: 'DEV-055',
      name: 'AirDrop/Nearby Share Disabled',
      status: airdropPolicies.length >= 1 ? 'pass' : 'warn',
      value: airdropPolicies.length === 0 ? 'No AirDrop/Nearby Share restrictions' : `${airdropPolicies.length} policies restrict AirDrop/Nearby Share`,
      remediation: 'Create iOS/Android configuration profiles disabling AirDrop/Nearby Share.'
    })

    // DEV-056: iCloud Backup
    const icloudPolicies = appProt.ios?.policies?.filter(p => p.iCloudBackupBlocked) || []
    results.push({
      id: 'DEV-056',
      name: 'iCloud Backup Restrictions (iOS)',
      status: icloudPolicies.length >= 1 ? 'pass' : 'warn',
      value: `${icloudPolicies.length} policies block iCloud backup`,
      remediation: 'Create iOS managed app policy disabling iCloud backup.'
    })

    // DEV-057: Voice Assistant
    const voicePolicies = config.filter(p => p.name?.toLowerCase().includes('siri') || p.name?.toLowerCase().includes('assistant'))
    results.push({
      id: 'DEV-057',
      name: 'Voice Assistant Restrictions (Siri/Google Assistant)',
      status: voicePolicies.length >= 1 ? 'pass' : 'warn',
      value: voicePolicies.length === 0 ? 'No voice assistant restrictions' : `${voicePolicies.length} policies restrict voice assistants`,
      remediation: 'Create configuration profiles restricting voice assistants.'
    })

    return results
  }

  /**
   * Application Security Validations
   */
  async validateApplicationSecurity() {
    const results = []
    const config = this.data.configuration?.all || []
    const appProt = this.data.appProtection || {}

    // DEV-058: App Store Restrictions
    const appStorePolicies = config.filter(p => p.name?.toLowerCase().includes('app store') || p.name?.toLowerCase().includes('play store'))
    results.push({
      id: 'DEV-058',
      name: 'App Store / Play Store Restrictions',
      status: appStorePolicies.length >= 1 ? 'pass' : 'warn',
      value: appStorePolicies.length === 0 ? 'No app store restrictions found' : `${appStorePolicies.length} policies enforce app store restrictions`,
      remediation: 'Enforce official app stores and block sideloading.'
    })

    // DEV-059: Managed Browser
    const managedBrowserPolicies = (appProt.ios?.policies?.filter(p => p.managedBrowserRequired) || [])
      .concat(appProt.android?.policies?.filter(p => p.managedBrowserRequired) || [])
    results.push({
      id: 'DEV-059',
      name: 'Managed Browser Enforcement',
      status: managedBrowserPolicies.length >= 1 ? 'pass' : 'warn',
      value: `${managedBrowserPolicies.length} app protection policies require managed browser`,
      remediation: 'Create APP policies requiring Microsoft Edge for corporate data.'
    })

    // DEV-060: Mobile App Protection
    const totalMAMPolicies = (appProt.ios?.count || 0) + (appProt.android?.count || 0)
    results.push({
      id: 'DEV-060',
      name: 'Mobile App Protection Policies (MAM)',
      status: totalMAMPolicies >= 2 ? 'pass' : (totalMAMPolicies >= 1 ? 'warn' : 'fail'),
      value: `iOS: ${appProt.ios?.count || 0}, Android: ${appProt.android?.count || 0} MAM policies configured`,
      remediation: 'Ensure MAM policies are configured for iOS and Android.'
    })

    return results
  }

  /**
   * Compliance & Deployment Validations
   */
  async validateDeploymentCompliance() {
    const results = []
    const complianceAssign = this.data.complianceAssignments || {}
    const configAssign = this.data.configurationAssignments || {}
    const devices = this.data.managedDevices || {}

    // DEV-061: Compliance Policy Deployment
    const compAssigned = complianceAssign.assignmentStatus?.assigned || 0
    const compTotal = (complianceAssign.assignmentStatus?.assigned || 0) + (complianceAssign.assignmentStatus?.unassigned || 0)
    const compRate = compTotal > 0 ? Math.round((compAssigned / compTotal) * 100) : 0
    results.push({
      id: 'DEV-061',
      name: 'Compliance Policy Deployment Status',
      status: compRate >= 90 ? 'pass' : (compRate >= 75 ? 'warn' : 'fail'),
      value: compTotal === 0 ? 'No compliance policies found' : `${compRate}% of policies assigned (${compAssigned}/${compTotal})`,
      remediation: 'Ensure compliance policies are assigned to all appropriate groups.'
    })

    // DEV-062: Configuration Profile Deployment
    const cfgAssigned = configAssign.assignmentStatus?.assigned || 0
    const cfgTotal = (configAssign.assignmentStatus?.assigned || 0) + (configAssign.assignmentStatus?.unassigned || 0)
    const cfgRate = cfgTotal > 0 ? Math.round((cfgAssigned / cfgTotal) * 100) : 0
    results.push({
      id: 'DEV-062',
      name: 'Configuration Profile Deployment',
      status: cfgRate >= 90 ? 'pass' : (cfgRate >= 75 ? 'warn' : 'fail'),
      value: cfgTotal === 0 ? 'No configuration profiles found' : `${cfgRate}% of profiles assigned (${cfgAssigned}/${cfgTotal})`,
      remediation: 'Increase configuration profile deployment across all platforms.'
    })

    // DEV-063: Device Compliance Rate
    const compliantCount = devices.byCompliance?.compliant || 0
    const totalDevices = devices.total || 0
    const complianceRate = devices.complianceRate || 0
    results.push({
      id: 'DEV-063',
      name: 'Device Compliance Rate',
      status: complianceRate >= 95 ? 'pass' : (complianceRate >= 85 ? 'warn' : 'fail'),
      value: totalDevices === 0 ? 'No managed devices found' : `${complianceRate}% compliant (${compliantCount}/${totalDevices})`,
      remediation: 'Investigate non-compliant devices and enforce remediation.'
    })

    // DEV-064: Device Inventory
    const windowsCount = devices.byPlatform?.windows || 0
    const iosCount = devices.byPlatform?.ios || 0
    const androidCount = devices.byPlatform?.android || 0
    results.push({
      id: 'DEV-064',
      name: 'Managed Device Inventory',
      status: totalDevices > 0 ? 'pass' : 'warn',
      value: totalDevices === 0
        ? 'No managed devices'
        : `Windows: ${windowsCount}, iOS: ${iosCount}, Android: ${androidCount}, Total: ${totalDevices}`,
      remediation: 'Monitor device inventory and onboarding.'
    })

    // DEV-065: Device Sync Health
    const syncedCount = devices.syncHealth?.synced7d || 0
    const staleCount = devices.syncHealth?.stale || 0
    const syncRate = totalDevices > 0 ? Math.round((syncedCount / totalDevices) * 100) : 0
    results.push({
      id: 'DEV-065',
      name: 'Device Sync Health',
      status: syncRate >= 99 ? 'pass' : (syncRate >= 95 ? 'warn' : 'fail'),
      value: totalDevices === 0
        ? 'No managed devices'
        : `${syncRate}% synced (${syncedCount}/${totalDevices}), ${staleCount} stale (>30d)`,
      remediation: 'Retire devices not syncing for >60 days.'
    })

    return results
  }
}

export default DeviceValidations
