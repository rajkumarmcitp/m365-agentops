/**
 * Azure Automation Runbook Handler
 *
 * Unified interface for calling Azure Automation Runbooks
 * Same pattern works for ALL 11 services
 *
 * Usage:
 *   const result = await callAutomationRunbook('Exchange-DG', {
 *     action: 'create',
 *     displayName: 'Test Group',
 *     alias: 'test-group',
 *     members: 'user@contoso.com',
 *     managedBy: 'admin@contoso.com'
 *   });
 */

const axios = require('axios');

/**
 * Call an Azure Automation Runbook via webhook
 *
 * @param {string} serviceName - Service identifier (e.g., 'Exchange-DG', 'Teams-Operations')
 * @param {object} params - Parameters to pass to the runbook
 * @returns {Promise<object>} - Result object from runbook
 * @throws {Error} - If webhook URL not configured or runbook fails
 *
 * Environment variables required:
 *   AUTOMATION_EXCHANGE_DG_WEBHOOK
 *   AUTOMATION_TEAMS_OPERATIONS_WEBHOOK
 *   AUTOMATION_SHAREPOINT_SITES_WEBHOOK
 *   etc.
 */
async function callAutomationRunbook(serviceName, params) {
  // Convert service name to environment variable format
  // 'Exchange-DG' -> 'AUTOMATION_EXCHANGE_DG_WEBHOOK'
  const envVarName = `AUTOMATION_${serviceName.toUpperCase().replace(/-/g, '_')}_WEBHOOK`;
  const webhookUrl = process.env[envVarName];

  if (!webhookUrl) {
    const error = new Error(
      `Webhook URL not configured for service: ${serviceName}\n` +
      `Please set environment variable: ${envVarName}\n` +
      `Example: ${envVarName}=https://eus2-v2.azure-automation.net/webhooks?token=...`
    );
    console.error(`❌ Configuration Error:`, error.message);
    throw error;
  }

  try {
    console.log(`🔌 Calling Azure Automation Runbook: ${serviceName}`);
    console.log(`   Parameters:`, JSON.stringify(params, null, 2));

    // Make the webhook call
    const response = await axios.post(webhookUrl, params, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000  // 60 second timeout for runbook execution
    });

    // Parse response (runbook returns JSON)
    let result;

    if (typeof response.data === 'string') {
      try {
        result = JSON.parse(response.data);
      } catch (parseError) {
        throw new Error(`Failed to parse runbook response: ${response.data}`);
      }
    } else {
      result = response.data;
    }

    // Check if runbook reported success
    if (result.success === false) {
      const error = new Error(`Runbook reported failure: ${result.error || 'Unknown error'}`);
      console.error(`❌ Runbook Failed:`, error.message);
      throw error;
    }

    console.log(`✅ Success: ${serviceName}`);
    console.log(`   Result:`, JSON.stringify(result, null, 2));

    return result;

  } catch (error) {
    if (error.response) {
      // HTTP error from Azure
      console.error(`❌ HTTP Error: ${error.response.status}`);
      console.error(`   Response:`, error.response.data);
      throw new Error(`Azure Automation HTTP ${error.response.status}: ${error.response.statusText}`);
    } else if (error.code === 'ECONNABORTED') {
      console.error(`❌ Timeout: Runbook took longer than 60 seconds`);
      throw new Error(`Automation runbook timeout after 60 seconds`);
    } else {
      console.error(`❌ Error calling ${serviceName}:`, error.message);
      throw error;
    }
  }
}

/**
 * Helper: Create Distribution Group
 * Shorthand for callAutomationRunbook('Exchange-DG', {action: 'create', ...})
 */
async function createDistributionGroup(displayName, alias, members, managedBy) {
  return callAutomationRunbook('Exchange-DG', {
    action: 'create',
    displayName,
    alias,
    members: members || '',
    managedBy: managedBy || ''
  });
}

/**
 * Helper: Add members to Distribution Group
 */
async function addDistributionGroupMembers(displayName, members) {
  return callAutomationRunbook('Exchange-DG', {
    action: 'add-members',
    displayName,
    members
  });
}

/**
 * Helper: Delete Distribution Group
 */
async function deleteDistributionGroup(displayName) {
  return callAutomationRunbook('Exchange-DG', {
    action: 'delete',
    displayName
  });
}

module.exports = {
  callAutomationRunbook,
  createDistributionGroup,
  addDistributionGroupMembers,
  deleteDistributionGroup
};
