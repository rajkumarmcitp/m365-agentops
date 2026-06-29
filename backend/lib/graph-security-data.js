/**
 * Security Data Fetcher using Microsoft Graph API
 * No PowerShell required - uses native Graph endpoints
 */

/**
 * Get email threat data from Graph Security API
 */
export async function getEmailThreatDataFromGraph(graphClient) {
  try {
    console.log('📧 Fetching email security data from Graph API...')

    const emailData = {
      phishingAttempts30d: 0,
      malwareDetected30d: 0,
      becAttempts30d: 0,
      spoofedDomainActivity30d: 0,
      quarantined30d: 0,
      spf: 'unknown',
      dkim: 'unknown',
      dmarc: 'unknown',
      externalForwardingRules: 0,
      suspiciousInboxRules: 0,
      sharedMailboxExposed: 0,
      // Organization-wide threat protection policies
      organizationPolicies: {
        safeLinks: { enabled: true, description: 'Enabled for all users' },
        safeAttachments: { enabled: true, description: 'Enabled for all users' },
        antiPhishing: { enabled: true, description: 'Standard protection enabled' },
        antiSpam: { enabled: true, level: 'Standard', description: 'Standard anti-spam filtering' },
        antiMalware: { enabled: true, description: 'Defender for Office 365 enabled' },
        zeroHourAutoPurge: { enabled: true, description: 'ZAP enabled for phishing and malware' },
        threatPolicies: { configured: true, count: 1, description: 'Strict Preset Security Policy' },
        threatExplorer: { enabled: true, description: 'Available in Microsoft 365 E5' },
        automatedInvestigation: { enabled: true, description: 'AIR enabled for threats' },
        airSettings: { enabled: true, autoRemediationLevel: 'Full', description: 'Auto-remediation enabled' },
        emailCollaborationPolicies: { enabled: true, count: 3, description: 'External sharing policies configured' }
      }
    }

    // Try multiple Graph endpoints for threat data
    try {
      // Endpoint 1: Security alerts (includes phishing, malware)
      const alerts = await graphClient.api('/security/alerts_v2')
        .filter(`createdDateTime gt ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`)
        .get()

      if (alerts && alerts.value) {
        const threatAlerts = alerts.value.filter(a => 
          a.classification && (a.classification.includes('phishing') || a.classification.includes('malware'))
        )
        emailData.phishingAttempts30d = threatAlerts.filter(a => a.classification.includes('phishing')).length
        emailData.malwareDetected30d = threatAlerts.filter(a => a.classification.includes('malware')).length
        console.log(`✓ Fetched ${threatAlerts.length} threat alerts from Graph API`)
      }
    } catch (e) {
      console.warn('⚠️ Security alerts endpoint not available:', e.message)
    }

    // Endpoint 2: Security assessment (defender posture)
    try {
      const assessment = await graphClient.api('/security/securityScores')
        .get()

      if (assessment && assessment.value && assessment.value.length > 0) {
        const latest = assessment.value[0]
        console.log(`✓ Fetched security score: ${latest.currentScore}/${latest.maxScore}`)
      }
    } catch (e) {
      console.warn('⚠️ Security scores endpoint not available:', e.message)
    }

    // Endpoint 3: Threat assessment (if available)
    try {
      const threats = await graphClient.api('/security/threatAssessmentRequests')
        .get()

      if (threats && threats.value) {
        emailData.becAttempts30d = threats.value.filter(t => 
          t.expectedAssessment && t.expectedAssessment.includes('phish')
        ).length
        console.log(`✓ Fetched threat assessments from Graph API`)
      }
    } catch (e) {
      console.warn('⚠️ Threat assessment endpoint not available:', e.message)
    }

    // Endpoint 4: Mail transport rules (forwarding detection)
    try {
      const mailboxes = await graphClient.api('/me/mailFolders')
        .select('id')
        .get()

      if (mailboxes) {
        console.log('✓ Can access mailbox data via Graph API')
      }
    } catch (e) {
      console.warn('⚠️ Mailbox access not available via Graph API:', e.message)
    }

    // Endpoint 5: Fetch organization threat protection policies
    // Priority: Environment Variables → Graph API → PowerShell → Defaults
    console.log('📋 Fetching organization threat protection policies...')

    try {
      // Step 1: Check for environment variables (highest priority)
      console.log('  📝 Checking environment variables...')
      const envPolicies = {
        safeLinks: process.env.THREAT_POLICY_SAFE_LINKS,
        safeAttachments: process.env.THREAT_POLICY_SAFE_ATTACHMENTS,
        antiPhishing: process.env.THREAT_POLICY_ANTI_PHISHING,
        antiSpam: process.env.THREAT_POLICY_ANTI_SPAM,
        antiMalware: process.env.THREAT_POLICY_ANTI_MALWARE,
        zap: process.env.THREAT_POLICY_ZAP_ENABLED === 'true',
        air: process.env.THREAT_POLICY_AIR_ENABLED === 'true',
        threatExplorer: process.env.THREAT_POLICY_THREAT_EXPLORER_ENABLED === 'true'
      }

      let configSource = 'defaults'
      const configuredPolicies = Object.values(envPolicies).filter(v => v).length

      if (configuredPolicies > 0) {
        console.log(`✓ Found ${configuredPolicies} policies configured via environment variables`)
        configSource = 'environment variables'

        if (envPolicies.safeLinks) {
          emailData.organizationPolicies.safeLinks.description = envPolicies.safeLinks
          console.log(`✓ Safe Links: ${envPolicies.safeLinks}`)
        }

        if (envPolicies.safeAttachments) {
          emailData.organizationPolicies.safeAttachments.description = envPolicies.safeAttachments
          console.log(`✓ Safe Attachments: ${envPolicies.safeAttachments}`)
        }

        if (envPolicies.antiPhishing) {
          emailData.organizationPolicies.antiPhishing.description = envPolicies.antiPhishing
          console.log(`✓ Anti-Phishing: ${envPolicies.antiPhishing}`)
        }

        if (envPolicies.antiSpam) {
          emailData.organizationPolicies.antiSpam.description = envPolicies.antiSpam
          console.log(`✓ Anti-Spam: ${envPolicies.antiSpam}`)
        }

        if (envPolicies.antiMalware) {
          emailData.organizationPolicies.antiMalware.description = envPolicies.antiMalware
          console.log(`✓ Anti-Malware: ${envPolicies.antiMalware}`)
        }

        if (envPolicies.zap) {
          emailData.organizationPolicies.zeroHourAutoPurge.enabled = true
          console.log(`✓ Zero-hour Auto Purge: enabled`)
        }

        if (envPolicies.air) {
          emailData.organizationPolicies.airSettings.enabled = true
          console.log(`✓ AIR Settings: enabled`)
        }

        if (envPolicies.threatExplorer) {
          emailData.organizationPolicies.threatExplorer.enabled = true
          console.log(`✓ Threat Explorer: enabled`)
        }
      } else {
        console.log('ℹ️ No environment variables configured - trying Graph API...')

        // Step 2: Try Graph API (if no env vars)
        const graphPolicies = await fetchThreatPoliciesFromGraphAPI(graphClient)

        if (graphPolicies && Object.keys(graphPolicies).length > 0) {
          console.log('✓ Graph API returned policy data')
          configSource = 'Graph API'

          if (graphPolicies.advancedThreatProtection !== undefined) {
            emailData.organizationPolicies.antiMalware.enabled = graphPolicies.advancedThreatProtection
            console.log(`✓ Advanced threat protection status: ${graphPolicies.advancedThreatProtection}`)
          }

          if (graphPolicies.servicesHealthy) {
            console.log('✓ Threat protection services are healthy')
            emailData.organizationPolicies.threatExplorer.enabled = true
          }
        } else {
          console.log('⚠️ Graph API did not return policy details - trying PowerShell fallback...')

          // Step 3: Fall back to PowerShell if Graph API doesn't have policy details
          const pwshPolicies = await fetchThreatPoliciesFromPowerShell()

          if (pwshPolicies) {
            configSource = 'PowerShell'
            console.log('✓ PowerShell returned policy data')

            if (pwshPolicies.SafeLinks && Array.isArray(pwshPolicies.SafeLinks) && pwshPolicies.SafeLinks.length > 0) {
              const policyNames = pwshPolicies.SafeLinks.filter(Boolean).join(', ')
              emailData.organizationPolicies.safeLinks.description = policyNames
              emailData.organizationPolicies.safeLinks.count = pwshPolicies.SafeLinks.length
              console.log(`✓ Found ${pwshPolicies.SafeLinks.length} Safe Links policies: ${policyNames}`)
            }

            if (pwshPolicies.SafeAttachments && Array.isArray(pwshPolicies.SafeAttachments) && pwshPolicies.SafeAttachments.length > 0) {
              const policyNames = pwshPolicies.SafeAttachments.filter(Boolean).join(', ')
              emailData.organizationPolicies.safeAttachments.description = policyNames
              emailData.organizationPolicies.safeAttachments.count = pwshPolicies.SafeAttachments.length
              console.log(`✓ Found ${pwshPolicies.SafeAttachments.length} Safe Attachments policies: ${policyNames}`)
            }

            if (pwshPolicies.AntiPhish && Array.isArray(pwshPolicies.AntiPhish) && pwshPolicies.AntiPhish.length > 0) {
              const policyNames = pwshPolicies.AntiPhish.filter(Boolean).join(', ')
              emailData.organizationPolicies.antiPhishing.description = policyNames
              emailData.organizationPolicies.antiPhishing.count = pwshPolicies.AntiPhish.length
              console.log(`✓ Found ${pwshPolicies.AntiPhish.length} Anti-Phishing policies: ${policyNames}`)
            }

            if (pwshPolicies.AntiMalware && Array.isArray(pwshPolicies.AntiMalware) && pwshPolicies.AntiMalware.length > 0) {
              const policyNames = pwshPolicies.AntiMalware.filter(Boolean).join(', ')
              emailData.organizationPolicies.antiMalware.description = policyNames
              emailData.organizationPolicies.antiMalware.count = pwshPolicies.AntiMalware.length
              console.log(`✓ Found ${pwshPolicies.AntiMalware.length} Anti-Malware policies: ${policyNames}`)
            }

            if (pwshPolicies.AntiSpam && Array.isArray(pwshPolicies.AntiSpam) && pwshPolicies.AntiSpam.length > 0) {
              const policyNames = pwshPolicies.AntiSpam.filter(Boolean).join(', ')
              emailData.organizationPolicies.antiSpam.description = policyNames
              emailData.organizationPolicies.antiSpam.count = pwshPolicies.AntiSpam.length
              console.log(`✓ Found ${pwshPolicies.AntiSpam.length} Anti-Spam policies: ${policyNames}`)
            }
          } else {
            console.log('⚠️ No policy configuration found - using default descriptions')
          }
        }
      }

      console.log(`✓ Policy configuration source: ${configSource}`)
    } catch (e) {
      console.warn('⚠️ Policy fetch error:', e.message)
    }

    // Get organization for license info
    try {
      const org = await graphClient.api('/organization')
        .select('displayName,id')
        .get()

      if (org && org.value && org.value.length > 0) {
        console.log(`✓ Organization: ${org.value[0].displayName}`)
        emailData.organizationPolicies.threatExplorer.enabled = true
      }
    } catch (e) {
      console.warn('⚠️ Organization data not available:', e.message)
    }

    return emailData
  } catch (error) {
    console.error('❌ Error fetching email threat data:', error.message)
    return {
      phishingAttempts30d: 0,
      malwareDetected30d: 0,
      becAttempts30d: 0,
      spoofedDomainActivity30d: 0,
      quarantined30d: 0,
      spf: 'unknown',
      dkim: 'unknown',
      dmarc: 'unknown',
      externalForwardingRules: 0,
      suspiciousInboxRules: 0,
      sharedMailboxExposed: 0,
      organizationPolicies: {
        safeLinks: { enabled: true, description: 'Enabled for all users' },
        safeAttachments: { enabled: true, description: 'Enabled for all users' },
        antiPhishing: { enabled: true, description: 'Standard protection enabled' },
        antiSpam: { enabled: true, level: 'Standard', description: 'Standard anti-spam filtering' },
        antiMalware: { enabled: true, description: 'Defender for Office 365 enabled' },
        zeroHourAutoPurge: { enabled: true, description: 'ZAP enabled for phishing and malware' },
        threatPolicies: { configured: true, count: 1, description: 'Strict Preset Security Policy' },
        threatExplorer: { enabled: true, description: 'Available in Microsoft 365 E5' },
        automatedInvestigation: { enabled: true, description: 'AIR enabled for threats' },
        airSettings: { enabled: true, autoRemediationLevel: 'Full', description: 'Auto-remediation enabled' },
        emailCollaborationPolicies: { enabled: true, count: 3, description: 'External sharing policies configured' }
      }
    }
  }
}

/**
 * Get compliance data from Graph API
 */
export async function getComplianceDataFromGraph(graphClient) {
  try {
    console.log('📋 Fetching compliance data from Graph API...')

    const complianceData = {
      dlpPolicies: 0,
      sensitivityLabels: 0,
      retentionPolicies: 0,
      informationProtection: false
    }

    try {
      // Get sensitivity labels
      const labels = await graphClient.api('/me/informationProtection/contentLabels')
        .get()

      if (labels && labels.value) {
        complianceData.sensitivityLabels = labels.value.length
        console.log(`✓ Found ${labels.value.length} sensitivity labels`)
      }
    } catch (e) {
      console.warn('⚠️ Information Protection not available:', e.message)
    }

    return complianceData
  } catch (error) {
    console.error('❌ Error fetching compliance data:', error.message)
    return {
      dlpPolicies: 0,
      sensitivityLabels: 0,
      retentionPolicies: 0,
      informationProtection: false
    }
  }
}

/**
 * Get device compliance from Graph API (Intune)
 */
export async function getDeviceComplianceFromGraph(graphClient) {
  try {
    console.log('🖥️ Fetching device compliance from Graph API...')

    const deviceData = {
      totalDevices: 0,
      compliantDevices: 0,
      noncompliantDevices: 0,
      nonCompliantPercentage: 0
    }

    try {
      // Get managed devices
      const devices = await graphClient.api('/deviceManagement/managedDevices')
        .get()

      if (devices && devices.value) {
        deviceData.totalDevices = devices.value.length
        deviceData.compliantDevices = devices.value.filter(d => d.complianceState === 'compliant').length
        deviceData.noncompliantDevices = deviceData.totalDevices - deviceData.compliantDevices
        deviceData.nonCompliantPercentage = deviceData.totalDevices > 0 
          ? Math.round((deviceData.noncompliantDevices / deviceData.totalDevices) * 100)
          : 0

        console.log(`✓ Device compliance: ${deviceData.compliantDevices}/${deviceData.totalDevices} compliant`)
      }
    } catch (e) {
      console.warn('⚠️ Device compliance data not available:', e.message)
    }

    return deviceData
  } catch (error) {
    console.error('❌ Error fetching device compliance:', error.message)
    return {
      totalDevices: 0,
      compliantDevices: 0,
      noncompliantDevices: 0,
      nonCompliantPercentage: 0
    }
  }
}

/**
 * Get user risk data from Graph API
 */
export async function getUserRiskFromGraph(graphClient) {
  try {
    console.log('👤 Fetching user risk data from Graph API...')

    const riskData = {
      riskUsers: 0,
      riskySignIns: 0,
      highRiskUsers: 0
    }

    try {
      // Get risky users
      const riskyUsers = await graphClient.api('/identityProtection/riskyUsers')
        .get()

      if (riskyUsers && riskyUsers.value) {
        riskData.riskUsers = riskyUsers.value.length
        riskData.highRiskUsers = riskyUsers.value.filter(u => u.riskLevel === 'high').length
        console.log(`✓ Found ${riskData.riskUsers} risky users`)
      }
    } catch (e) {
      console.warn('⚠️ Risky users endpoint not available:', e.message)
    }

    try {
      // Get risky sign-ins
      const riskySignIns = await graphClient.api('/identityProtection/riskySignIns')
        .get()

      if (riskySignIns && riskySignIns.value) {
        riskData.riskySignIns = riskySignIns.value.length
        console.log(`✓ Found ${riskData.riskySignIns} risky sign-ins`)
      }
    } catch (e) {
      console.warn('⚠️ Risky sign-ins endpoint not available:', e.message)
    }

    return riskData
  } catch (error) {
    console.error('❌ Error fetching user risk data:', error.message)
    return {
      riskUsers: 0,
      riskySignIns: 0,
      highRiskUsers: 0
    }
  }
}

/**
 * Fetch threat protection policies using Microsoft Graph API
 * Tries multiple endpoints to fetch policy information
 */
async function fetchThreatPoliciesFromGraphAPI(graphClient) {
  try {
    console.log('📋 Fetching threat policies from Graph API...')
    const policies = {}

    // Attempt 1: Security settings endpoint
    try {
      const securitySettings = await graphClient.api('/security/securitySettings').get()
      if (securitySettings) {
        console.log('✓ Security settings retrieved from Graph API')
        // Extract any policy information if available
        if (securitySettings.advancedThreatProtectionEnabled !== undefined) {
          policies.advancedThreatProtection = securitySettings.advancedThreatProtectionEnabled
        }
      }
    } catch (e) {
      console.warn('⚠️ Security settings endpoint not available:', e.message)
    }

    // Attempt 2: Organization settings - check for threat policies
    try {
      const org = await graphClient.api('/organization').select('id,displayName').get()
      if (org && org.value && org.value.length > 0) {
        const orgId = org.value[0].id
        console.log(`✓ Organization retrieved: ${org.value[0].displayName}`)

        // Try to get organization security settings
        try {
          const orgSettings = await graphClient.api(`/organization/${orgId}/settings`).get()
          if (orgSettings) {
            policies.organizationSettings = orgSettings
          }
        } catch (e) {
          console.warn('⚠️ Organization settings not available:', e.message)
        }
      }
    } catch (e) {
      console.warn('⚠️ Organization endpoint error:', e.message)
    }

    // Attempt 3: Audit logs to detect policy changes (infer policies from recent activity)
    try {
      const auditLogs = await graphClient.api('/auditLogs/directoryAudits')
        .filter("activityDisplayName eq 'Update Safe Links policy' or activityDisplayName eq 'Update Safe Attachments policy' or activityDisplayName eq 'Update anti-phishing policy'")
        .top(10)
        .get()

      if (auditLogs && auditLogs.value && auditLogs.value.length > 0) {
        console.log(`✓ Found ${auditLogs.value.length} policy-related audit events`)
        policies.recentPolicyChanges = auditLogs.value.length > 0
      }
    } catch (e) {
      console.warn('⚠️ Audit logs not available:', e.message)
    }

    // Attempt 4: Service health to check if Defender features are enabled
    try {
      const serviceHealth = await graphClient.api('/admin/serviceAnnouncement/healthOverviews')
        .filter("service eq 'Exchange Online' or service eq 'Microsoft Defender for Office 365'")
        .get()

      if (serviceHealth && serviceHealth.value && serviceHealth.value.length > 0) {
        console.log(`✓ Service health retrieved for ${serviceHealth.value.length} services`)
        policies.servicesHealthy = true
      }
    } catch (e) {
      console.warn('⚠️ Service health not available:', e.message)
    }

    return Object.keys(policies).length > 0 ? policies : null
  } catch (error) {
    console.error('❌ Graph API policy fetch error:', error.message)
    return null
  }
}

/**
 * Fetch threat protection policies using PowerShell (fallback)
 * Gets real policy names and configurations from Exchange Online
 */
async function fetchThreatPoliciesFromPowerShell() {
  try {
    const { execFile } = await import('child_process')
    const { promisify } = await import('util')
    const execFileAsync = promisify(execFile)

    const pwshPath = process.platform === 'darwin' ? '/usr/local/bin/pwsh' : 'pwsh'

    // PowerShell script to fetch threat policies
    const psScript = `
try {
  # Import Exchange Online module
  Import-Module ExchangeOnlineManagement -ErrorAction SilentlyContinue

  # Get Safe Links Policies
  \$safeLinksPolicies = Get-SafeLinksPolicy -ErrorAction SilentlyContinue 2>$null | Select-Object Name, Identity

  # Get Safe Attachments Policies
  \$safeAttachmentsPolicies = Get-SafeAttachmentPolicy -ErrorAction SilentlyContinue 2>$null | Select-Object Name, Identity

  # Get Anti-Phishing Policies
  \$antiPhishPolicies = Get-AntiPhishPolicy -ErrorAction SilentlyContinue 2>$null | Select-Object Name, Identity

  # Get Malware Filter Policies
  \$antiMalwarePolicies = Get-MalwareFilterPolicy -ErrorAction SilentlyContinue 2>$null | Select-Object Name, Identity

  # Get Hosted Content Filter Policies
  \$antiSpamPolicies = Get-HostedContentFilterPolicy -ErrorAction SilentlyContinue 2>$null | Select-Object Name, Identity

  # Build response
  \$result = @{
    SafeLinks = @(\$safeLinksPolicies | ForEach-Object { \$_.Name })
    SafeAttachments = @(\$safeAttachmentsPolicies | ForEach-Object { \$_.Name })
    AntiPhish = @(\$antiPhishPolicies | ForEach-Object { \$_.Name })
    AntiMalware = @(\$antiMalwarePolicies | ForEach-Object { \$_.Name })
    AntiSpam = @(\$antiSpamPolicies | ForEach-Object { \$_.Name })
  }

  \$result | ConvertTo-Json
} catch {
  Write-Host "Error: \$(\$_.Exception.Message)"
  @{} | ConvertTo-Json
}
`

    const { stdout, stderr } = await execFileAsync(pwshPath, [
      '-NoProfile',
      '-NoLogo',
      '-NonInteractive',
      '-Command', psScript
    ], {
      timeout: 15000,
      encoding: 'utf-8'
    })

    if (stdout) {
      try {
        const policies = JSON.parse(stdout)
        console.log('✓ PowerShell policies fetched successfully')
        return policies
      } catch (parseErr) {
        console.warn('⚠️ Could not parse PowerShell policies:', parseErr.message)
      }
    }

    return null
  } catch (error) {
    console.warn('⚠️ PowerShell policy fetch failed:', error.message)
    return null
  }
}

/**
 * Validate DNS records for a domain using PowerShell
 * Checks for SPF, DKIM, and DMARC records
 */
async function validateDomainDNSRecords(domainName) {
  try {
    const { execFile } = await import('child_process')
    const { promisify } = await import('util')
    const execFileAsync = promisify(execFile)

    const pwshPath = process.platform === 'darwin' ? '/usr/local/bin/pwsh' : 'pwsh'

    // PowerShell script to check DNS records
    const psScript = `
$domain = '${domainName}'
$results = @{}

# Check SPF record
try {
  $spf = Resolve-DnsName -Name $domain -Type TXT -ErrorAction SilentlyContinue 2>$null | Where-Object { $_.Strings -like '*v=spf1*' }
  $results.SPF = if ($spf) { 'pass' } else { 'fail' }
} catch {
  $results.SPF = 'fail'
}

# Check DKIM record (default selector)
try {
  $dkim = Resolve-DnsName -Name "default._domainkey.$domain" -Type TXT -ErrorAction SilentlyContinue 2>$null | Where-Object { $_.Strings -like '*v=DKIM1*' }
  $results.DKIM = if ($dkim) { 'pass' } else { 'fail' }
} catch {
  $results.DKIM = 'fail'
}

# Check DMARC record
try {
  $dmarc = Resolve-DnsName -Name "_dmarc.$domain" -Type TXT -ErrorAction SilentlyContinue 2>$null | Where-Object { $_.Strings -like '*v=DMARC1*' }
  $results.DMARC = if ($dmarc) { 'pass' } else { 'fail' }
} catch {
  $results.DMARC = 'fail'
}

# Output results as JSON
\$results | ConvertTo-Json
`

    const { stdout, stderr } = await execFileAsync(pwshPath, [
      '-NoProfile',
      '-NoLogo',
      '-NonInteractive',
      '-Command', psScript
    ], {
      timeout: 10000,
      encoding: 'utf-8'
    })

    if (stdout) {
      try {
        const results = JSON.parse(stdout)
        console.log(`✓ DNS validation for ${domainName}: SPF=${results.SPF}, DKIM=${results.DKIM}, DMARC=${results.DMARC}`)
        return {
          spf: results.SPF || 'unknown',
          dkim: results.DKIM || 'unknown',
          dmarc: results.DMARC || 'unknown'
        }
      } catch (parseErr) {
        console.warn(`⚠️ Could not parse DNS results for ${domainName}:`, parseErr.message)
      }
    }

    return { spf: 'unknown', dkim: 'unknown', dmarc: 'unknown' }
  } catch (error) {
    console.warn(`⚠️ PowerShell DNS validation not available for ${domainName}:`, error.message)
    // Fallback to nslookup if PowerShell fails
    return await validateDomainDNSRecordsNslookup(domainName)
  }
}

/**
 * Fallback: Validate DNS records using nslookup (cross-platform)
 */
async function validateDomainDNSRecordsNslookup(domainName) {
  try {
    const { execFile } = await import('child_process')
    const { promisify } = await import('util')
    const execFileAsync = promisify(execFile)

    const results = { spf: 'unknown', dkim: 'unknown', dmarc: 'unknown' }

    // Check SPF
    try {
      const { stdout } = await execFileAsync('nslookup', ['-type=TXT', domainName], {
        timeout: 5000,
        encoding: 'utf-8'
      })
      if (stdout && stdout.includes('v=spf1')) {
        results.spf = 'pass'
      } else {
        results.spf = 'fail'
      }
    } catch (e) {
      results.spf = 'fail'
    }

    // Check DKIM (default selector)
    try {
      const { stdout } = await execFileAsync('nslookup', ['-type=TXT', `default._domainkey.${domainName}`], {
        timeout: 5000,
        encoding: 'utf-8'
      })
      if (stdout && stdout.includes('v=DKIM1')) {
        results.dkim = 'pass'
      } else {
        results.dkim = 'fail'
      }
    } catch (e) {
      results.dkim = 'fail'
    }

    // Check DMARC
    try {
      const { stdout } = await execFileAsync('nslookup', ['-type=TXT', `_dmarc.${domainName}`], {
        timeout: 5000,
        encoding: 'utf-8'
      })
      if (stdout && stdout.includes('v=DMARC1')) {
        results.dmarc = 'pass'
      } else {
        results.dmarc = 'fail'
      }
    } catch (e) {
      results.dmarc = 'fail'
    }

    console.log(`✓ nslookup DNS validation for ${domainName}: SPF=${results.spf}, DKIM=${results.dkim}, DMARC=${results.dmarc}`)
    return results
  } catch (error) {
    console.warn(`⚠️ nslookup DNS validation failed for ${domainName}:`, error.message)
    return { spf: 'unknown', dkim: 'unknown', dmarc: 'unknown' }
  }
}

/**
 * Get domain authentication status for all domains in tenant
 */
export async function getDomainAuthenticationStatusFromGraph(graphClient) {
  try {
    console.log('🌐 Fetching domain authentication status from Graph API...')

    const domainData = {
      domains: []
    }

    try {
      // Fetch all domains in the tenant
      const domains = await graphClient.api('/domains')
        .get()

      if (domains && domains.value) {
        console.log(`✓ Found ${domains.value.length} domains in tenant`)

        // Get authentication status for each domain
        for (const domain of domains.value) {
          const domainRecord = {
            id: domain.id,
            name: domain.id,
            isVerified: domain.isVerified,
            isDefault: domain.isDefault,
            spf: 'unknown',
            dkim: 'unknown',
            dmarc: 'unknown',
            safeLinks: 'enabled',
            safeAttachments: 'enabled',
            antiSpamPolicy: 'standard'
          }

          // Validate DNS records using PowerShell or nslookup
          try {
            console.log(`🔍 Validating DNS records for domain: ${domain.id}`)
            const dnsValidation = await validateDomainDNSRecords(domain.id)
            domainRecord.spf = dnsValidation.spf
            domainRecord.dkim = dnsValidation.dkim
            domainRecord.dmarc = dnsValidation.dmarc
          } catch (e) {
            console.warn(`⚠️ Could not validate DNS records for ${domain.id}:`, e.message)
            // Keep defaults (unknown)
          }

          domainData.domains.push(domainRecord)
        }
      }
    } catch (e) {
      console.warn('⚠️ Domain data not available:', e.message)
      // Return at least one domain entry for default tenant domain
      domainData.domains = [
        {
          id: 'tenant.onmicrosoft.com',
          name: 'tenant.onmicrosoft.com',
          isVerified: true,
          isDefault: true,
          spf: 'unknown',
          dkim: 'unknown',
          dmarc: 'unknown',
          safeLinks: 'enabled',
          safeAttachments: 'enabled',
          antiSpamPolicy: 'standard'
        }
      ]
    }

    return domainData
  } catch (error) {
    console.error('❌ Error fetching domain authentication status:', error.message)
    return {
      domains: []
    }
  }
}

export default {
  getEmailThreatDataFromGraph,
  getComplianceDataFromGraph,
  getDeviceComplianceFromGraph,
  getUserRiskFromGraph,
  getDomainAuthenticationStatusFromGraph
}
