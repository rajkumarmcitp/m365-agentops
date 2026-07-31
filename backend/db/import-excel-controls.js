#!/usr/bin/env node
// ============================================================
// Import Controls from Excel File
// Loads 1,198 real Microsoft controls from Controls.xlsx
// ============================================================

import 'dotenv/config'
import pkg from 'pg'
import XLSX from 'xlsx'
import fs from 'fs'

const { Pool } = pkg

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'm365_agentops',
  user: process.env.DB_USER || 'vasanthipromoters',
  password: process.env.DB_PASSWORD || ''
})

async function importExcelControls() {
  let client
  try {
    console.log('🚀 Starting Excel Controls Import...\n')

    // Connect to database
    client = await pool.connect()
    console.log('✅ Connected to PostgreSQL\n')

    // Read Excel file
    const excelPath = '/Users/vasanthipromoters/Documents/Controls.xlsx'
    if (!fs.existsSync(excelPath)) {
      throw new Error(`Excel file not found: ${excelPath}`)
    }

    console.log('📖 Reading Excel file...')
    const workbook = XLSX.readFile(excelPath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const rawData = XLSX.utils.sheet_to_json(worksheet)

    console.log(`✅ Read ${rawData.length} controls from Excel\n`)

    // Map Excel columns to database fields
    const parseControl = (row, index) => {
      const frameworks = []

      // Collect framework mappings
      if (row['CIS M365']) frameworks.push('CIS')
      if (row['NIST CSF 2.0']) frameworks.push('NIST')
      if (row['ISO 27001:2022']) frameworks.push('ISO')
      if (row['Zero Trust']) frameworks.push('Zero Trust')

      // Parse Graph endpoints
      const graphEndpoints = row['Graph Endpoint(s)']
        ? row['Graph Endpoint(s)'].split(',').map(e => e.trim()).filter(e => e)
        : []

      // Parse PowerShell commands
      const psCommands = row['PowerShell Fallback']
        ? row['PowerShell Fallback'].split(',').map(c => c.trim()).filter(c => c)
        : []

      return {
        control_id: row['Control ID'] || `TG-UNKNOWN-${index}`,
        framework: 'REAL', // Mark as real controls from Excel
        domain: row['Domain'] || 'Uncategorized',
        title: row['Control Name'] || row['Control ID'],
        description: row['Validation Logic'] || 'No description',
        category: row['Category'] || '',
        service: row['Service'] || '',
        severity: row['Severity'] || 'Medium',
        weight: parseInt(row['Weight']) || 0,
        validation_method: row['Validation Engine'] || 'Graph',
        graph_api_queries: graphEndpoints,
        powershell_commands: psCommands,
        graph_property: row['Graph Property'] || '',
        expected_values: row['Expected Value'] || '',
        remediation_steps: row['Remediation'] || '',
        license: row['License'] || '',
        auto_remediation: (row['Auto'] || '').toLowerCase() === 'yes',
        effort: row['Effort'] || '',
        business_impact: row['Business Impact'] || '',
        frameworks: frameworks,
        cis_mapping: row['CIS M365'] || '',
        secure_score_mapping: row['Secure Score'] || '',
        nist_csf_mapping: row['NIST CSF 2.0'] || '',
        nist_800_53_mapping: row['NIST 800-53'] || '',
        iso_mapping: row['ISO 27001:2022'] || '',
        zero_trust_mapping: row['Zero Trust'] || '',
        mitre_mapping: row['MITRE'] || '',
        capec_mapping: row['CAPEC'] || ''
      }
    }

    // Parse all controls
    console.log('🔄 Parsing controls...')
    const controls = rawData.map((row, idx) => parseControl(row, idx + 2))

    // Filter out any controls with missing required fields
    const validControls = controls.filter(c => c.control_id && c.domain)
    console.log(`✅ Parsed ${validControls.length} valid controls\n`)

    // Create table with full schema
    console.log('📋 Creating table with full schema...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS compliance_controls (
        id SERIAL PRIMARY KEY,
        control_id TEXT NOT NULL UNIQUE,
        framework TEXT NOT NULL,
        domain TEXT,
        title TEXT,
        description TEXT,
        category TEXT,
        service TEXT,
        severity TEXT,
        weight INT,
        validation_method TEXT,
        graph_api_queries TEXT[],
        powershell_commands TEXT[],
        graph_property TEXT,
        expected_values TEXT,
        remediation_steps TEXT,
        license TEXT,
        auto_remediation BOOLEAN DEFAULT false,
        effort TEXT,
        business_impact TEXT,
        frameworks TEXT[],
        cis_mapping TEXT,
        secure_score_mapping TEXT,
        nist_csf_mapping TEXT,
        nist_800_53_mapping TEXT,
        iso_mapping TEXT,
        zero_trust_mapping TEXT,
        mitre_mapping TEXT,
        capec_mapping TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Table schema ready\n')

    // Batch insert controls
    console.log('💾 Inserting controls into database...')
    let insertCount = 0
    const batchSize = 50

    for (let i = 0; i < validControls.length; i += batchSize) {
      const batch = validControls.slice(i, i + batchSize)

      const values = batch
        .map((_, idx) => {
          const paramBase = idx * 28 + 1
          return `(
            $${paramBase}, $${paramBase + 1}, $${paramBase + 2}, $${paramBase + 3},
            $${paramBase + 4}, $${paramBase + 5}, $${paramBase + 6}, $${paramBase + 7},
            $${paramBase + 8}, $${paramBase + 9}, $${paramBase + 10}, $${paramBase + 11},
            $${paramBase + 12}, $${paramBase + 13}, $${paramBase + 14}, $${paramBase + 15},
            $${paramBase + 16}, $${paramBase + 17}, $${paramBase + 18}, $${paramBase + 19},
            $${paramBase + 20}, $${paramBase + 21}, $${paramBase + 22}, $${paramBase + 23},
            $${paramBase + 24}, $${paramBase + 25}, $${paramBase + 26}, $${paramBase + 27}
          )`
        })
        .join(',')

      const params = batch.flatMap(c => [
        c.control_id,
        c.framework,
        c.domain,
        c.title,
        c.description,
        c.category,
        c.service,
        c.severity,
        c.weight,
        c.validation_method,
        c.graph_api_queries,
        c.powershell_commands,
        c.graph_property,
        c.expected_values,
        c.remediation_steps,
        c.license,
        c.auto_remediation,
        c.effort,
        c.business_impact,
        c.frameworks,
        c.cis_mapping,
        c.secure_score_mapping,
        c.nist_csf_mapping,
        c.nist_800_53_mapping,
        c.iso_mapping,
        c.zero_trust_mapping,
        c.mitre_mapping,
        c.capec_mapping
      ])

      const query = `
        INSERT INTO compliance_controls (
          control_id, framework, domain, title, description, category, service,
          severity, weight, validation_method, graph_api_queries, powershell_commands,
          graph_property, expected_values, remediation_steps, license, auto_remediation,
          effort, business_impact, frameworks, cis_mapping, secure_score_mapping,
          nist_csf_mapping, nist_800_53_mapping, iso_mapping, zero_trust_mapping,
          mitre_mapping, capec_mapping
        ) VALUES ${values}
        ON CONFLICT (control_id) DO UPDATE SET
          title = EXCLUDED.title,
          updated_at = CURRENT_TIMESTAMP
      `

      await client.query(query, params)
      insertCount += batch.length
      process.stdout.write(`\r  Inserted ${insertCount}/${validControls.length} controls...`)
    }

    console.log('\n✅ All controls inserted\n')

    // Get statistics
    console.log('📊 Import Statistics:')

    const frameworkStats = await client.query(`
      SELECT framework, COUNT(*) as count FROM compliance_controls GROUP BY framework ORDER BY count DESC
    `)
    console.log('  Frameworks:')
    frameworkStats.rows.forEach(row => {
      console.log(`    • ${row.framework}: ${row.count}`)
    })

    const severityStats = await client.query(`
      SELECT severity, COUNT(*) as count FROM compliance_controls
      WHERE framework = 'REAL' GROUP BY severity ORDER BY count DESC
    `)
    console.log('\n  Severity Distribution:')
    severityStats.rows.forEach(row => {
      console.log(`    • ${row.severity}: ${row.count}`)
    })

    const methodStats = await client.query(`
      SELECT validation_method, COUNT(*) as count FROM compliance_controls
      WHERE framework = 'REAL' GROUP BY validation_method ORDER BY count DESC
    `)
    console.log('\n  Validation Methods:')
    methodStats.rows.forEach(row => {
      console.log(`    • ${row.validation_method}: ${row.count}`)
    })

    const domainsCount = await client.query(`
      SELECT COUNT(DISTINCT domain) as count FROM compliance_controls WHERE framework = 'REAL'
    `)
    console.log(`\n  Unique Domains: ${domainsCount.rows[0].count}`)

    const autoRemediationCount = await client.query(`
      SELECT COUNT(*) as count FROM compliance_controls WHERE framework = 'REAL' AND auto_remediation = true
    `)
    console.log(`  Auto-Remediation Capable: ${autoRemediationCount.rows[0].count}`)

    console.log('\n✨ Excel Controls Import Complete!')
    console.log('📌 Next Steps:')
    console.log('   1. Restart the backend server')
    console.log('   2. Test the compliance dashboard')
    console.log('   3. Verify 1,198 real controls are displayed')

  } catch (error) {
    console.error('❌ Error during import:', error.message)
    process.exit(1)
  } finally {
    if (client) await client.release()
    await pool.end()
  }
}

importExcelControls()
