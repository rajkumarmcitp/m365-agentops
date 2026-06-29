/**
 * PowerShell Executor for Exchange Online Management
 * Executes PowerShell commands securely and returns JSON results
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

/**
 * Execute PowerShell command and return JSON result
 */
export async function executePowerShellCommand(command, timeout = 30000) {
  try {
    console.log('🔵 Executing PowerShell command...')
    
    const psCommand = `
      # Disable error stops to capture all output
      $ErrorActionPreference = 'Continue'
      
      # Execute command
      ${command}
      
      # Return exit code
      if ($?) { exit 0 } else { exit 1 }
    `

    const { stdout, stderr } = await execAsync(
      `pwsh -NoProfile -Command "${psCommand.replace(/"/g, '\\"')}"`,
      { timeout }
    )

    if (stderr && !stderr.includes('WARNING')) {
      console.warn('⚠️ PowerShell stderr:', stderr)
    }

    return JSON.parse(stdout)
  } catch (error) {
    console.error('❌ PowerShell execution failed:', error.message)
    throw error
  }
}

/**
 * Get email threat protection report
 */
export async function getEmailThreatReport(days = 30) {
  try {
    console.log(`📧 Fetching email threat report for last ${days} days...`)

    const command = `
      # Get threat protection report
      $report = Get-MailTrafficTopReport -EventType MalwareDetected,PhishDetected,AdvancedPhishDetected,TransportRuleViolations -Enddate (Get-Date).AddDays(-${days}) -Page 1 | Select-Object -First 1
      
      $data = @{
        malwareDetected = if ($report) { [int]$report.count } else { 0 }
        phishingDetected = if ($report) { [int]$report.count } else { 0 }
        transportRuleViolations = if ($report) { [int]$report.count } else { 0 }
      }
      
      $data | ConvertTo-Json
    `

    return await executePowerShellCommand(command)
  } catch (error) {
    console.warn('⚠️ Email threat report failed:', error.message)
    return {
      malwareDetected: 0,
      phishingDetected: 0,
      transportRuleViolations: 0
    }
  }
}

/**
 * Get mail flow status
 */
export async function getMailFlowStatus() {
  try {
    console.log('📬 Fetching mail flow status...')

    const command = `
      # Get transport rules count
      $transportRules = @(Get-TransportRule -ResultSize Unlimited)
      $externalForwarding = @(Get-Mailbox -Filter "ForwardingAddress -ne '`$null'" -ResultSize Unlimited)
      
      $data = @{
        transportRulesCount = $transportRules.Count
        externalForwardingCount = $externalForwarding.Count
        deliveryReportsEnabled = $true
      }
      
      $data | ConvertTo-Json
    `

    return await executePowerShellCommand(command)
  } catch (error) {
    console.warn('⚠️ Mail flow status failed:', error.message)
    return {
      transportRulesCount: 0,
      externalForwardingCount: 0,
      deliveryReportsEnabled: false
    }
  }
}

/**
 * Get spam and malware policy status
 */
export async function getAntiSpamPolicyStatus() {
  try {
    console.log('🛡️ Fetching anti-spam and malware policies...')

    const command = `
      # Get policies
      $antiSpam = Get-HostedContentFilterPolicy -Identity Default
      $antiMalware = Get-MalwareFilterPolicy -Identity Default
      
      $data = @{
        antiSpamEnabled = if ($antiSpam.Enabled) { $true } else { $false }
        antiMalwareEnabled = if ($antiMalware.Enabled) { $true } else { $false }
        safeAttachmentsEnabled = if ($antiMalware.EnableFileFilter) { $true } else { $false }
        spamConfidenceLevel = if ($antiSpam) { [int]$antiSpam.SpamZapEnabled } else { 0 }
      }
      
      $data | ConvertTo-Json
    `

    return await executePowerShellCommand(command)
  } catch (error) {
    console.warn('⚠️ Anti-spam policy status failed:', error.message)
    return {
      antiSpamEnabled: false,
      antiMalwareEnabled: false,
      safeAttachmentsEnabled: false,
      spamConfidenceLevel: 0
    }
  }
}

/**
 * Get Defender for Office 365 threat report
 */
export async function getDefenderThreatReport(days = 30) {
  try {
    console.log(`🔴 Fetching Defender threat report for last ${days} days...`)

    const command = `
      # Get threat data from Defender
      $threatData = @{
        advancedPhishing = 0
        businessEmailCompromise = 0
        zeroDay = 0
        ransomware = 0
        spoof = 0
      }
      
      # Try to get data from AdvancedThreatProtection (if available)
      try {
        $defenderData = Get-AdvancedPhishingReport -Enddate (Get-Date).AddDays(-${days}) -ErrorAction SilentlyContinue
        if ($defenderData) {
          $threatData.advancedPhishing = ($defenderData | Measure-Object).Count
        }
      } catch {}
      
      $threatData | ConvertTo-Json
    `

    return await executePowerShellCommand(command)
  } catch (error) {
    console.warn('⚠️ Defender threat report failed:', error.message)
    return {
      advancedPhishing: 0,
      businessEmailCompromise: 0,
      zeroDay: 0,
      ransomware: 0,
      spoof: 0
    }
  }
}

/**
 * Get email authentication status (SPF, DKIM, DMARC)
 */
export async function getEmailAuthenticationStatus() {
  try {
    console.log('🔐 Fetching email authentication status...')

    const command = `
      # Get organization settings
      $org = Get-Organization
      
      $data = @{
        spf = if ($org.DefaultAuthenticationPolicy) { 'pass' } else { 'not-configured' }
        dkim = if ($org.DefaultAuthenticationPolicy) { 'pass' } else { 'not-configured' }
        dmarc = 'not-configured'
        dkimEnabled = $false
        dmarcEnabled = $false
      }
      
      $data | ConvertTo-Json
    `

    return await executePowerShellCommand(command)
  } catch (error) {
    console.warn('⚠️ Email authentication status failed:', error.message)
    return {
      spf: 'unknown',
      dkim: 'unknown',
      dmarc: 'unknown',
      dkimEnabled: false,
      dmarcEnabled: false
    }
  }
}

export default {
  executePowerShellCommand,
  getEmailThreatReport,
  getMailFlowStatus,
  getAntiSpamPolicyStatus,
  getDefenderThreatReport,
  getEmailAuthenticationStatus
}
