#!/usr/bin/env node
// ============================================================
// UCC Production Initialization
// Loads 1,010 real controls into database
// ============================================================

import 'dotenv/config'
import pkg from 'pg'
import { generateAllUCCControls, getUCCStatistics, UCC_DOMAINS } from './seeders/ucc-1010-controls.js'

const { Client } = pkg

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'm365_agentops',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
})

async function initializeUCC() {
  try {
    console.log('🚀 Starting UCC 1,010 Controls Initialization...\n')

    await client.connect()
    console.log('✅ Connected to database\n')

    // Step 1: Create tables if they don't exist
    console.log('📋 Creating tables...')

    await client.query(`
      CREATE TABLE IF NOT EXISTS compliance_domains (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        workload VARCHAR(50)
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS compliance_controls (
        id SERIAL PRIMARY KEY,
        control_id VARCHAR(50) NOT NULL UNIQUE,
        framework VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        domain VARCHAR(20),
        severity VARCHAR(20),
        topic VARCHAR(100),
        validation_method VARCHAR(100),
        graph_api_queries TEXT[],
        powershell_commands TEXT[],
        expected_values TEXT,
        remediation_steps TEXT,
        control_references TEXT,
        frameworks TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (domain) REFERENCES compliance_domains(id)
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS control_validations (
        id SERIAL PRIMARY KEY,
        tenant_id VARCHAR(255) NOT NULL,
        control_id VARCHAR(50) NOT NULL,
        status VARCHAR(20),
        score INT,
        details JSONB,
        validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (control_id) REFERENCES compliance_controls(control_id)
      )
    `)

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_controls_framework ON compliance_controls(framework)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_controls_domain ON compliance_controls(domain)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_controls_severity ON compliance_controls(severity)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_validations_tenant ON control_validations(tenant_id)`)

    console.log('✅ Tables created\n')

    // Step 2: Insert domains
    console.log('🗂️  Inserting 20 domains...')
    let domainCount = 0

    for (const domain of UCC_DOMAINS) {
      await client.query(
        `INSERT INTO compliance_domains (id, name, workload)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [domain.id, domain.name, domain.workload]
      )
      domainCount++
    }
    console.log(`✅ Inserted ${domainCount} domains\n`)

    // Step 3: Generate and insert 1,010 controls
    console.log('🎯 Generating 1,010 UCC controls...')
    const controls = generateAllUCCControls()
    console.log(`✅ Generated ${controls.length} controls\n`)

    console.log('💾 Inserting controls into database...')
    let insertCount = 0
    let batchSize = 100

    for (let i = 0; i < controls.length; i += batchSize) {
      const batch = controls.slice(i, i + batchSize)

      const values = batch.map((control, idx) => {
        const paramBase = idx * 10 + 1
        return `($${paramBase}, $${paramBase + 1}, $${paramBase + 2}, $${paramBase + 3}, $${paramBase + 4}, $${paramBase + 5}, $${paramBase + 6}, $${paramBase + 7}, $${paramBase + 8}, $${paramBase + 9})`
      }).join(',')

      const params = batch.flatMap(c => [
        c.control_id,
        c.framework,
        c.title,
        c.description,
        c.domain,
        c.severity,
        c.validation_method,
        c.expected_values,
        c.remediation_steps,
        c.frameworks  // Pass as array directly, not JSON string
      ])

      const query = `
        INSERT INTO compliance_controls
        (control_id, framework, title, description, domain, severity, validation_method, expected_values, remediation_steps, frameworks)
        VALUES ${values}
        ON CONFLICT (control_id) DO UPDATE SET
        title = EXCLUDED.title,
        updated_at = CURRENT_TIMESTAMP
      `

      await client.query(query, params)
      insertCount += batch.length
      process.stdout.write(`\r  Inserted ${insertCount}/${controls.length} controls...`)
    }
    console.log('\n✅ All controls inserted\n')

    // Step 4: Get statistics
    console.log('📊 Calculating statistics...')
    const stats = getUCCStatistics()

    console.log('\n📈 UCC Control Inventory:')
    console.log(`   • Total Controls: ${stats.total_controls}`)
    console.log(`   • Domains: ${stats.domains}`)
    console.log(`   • Critical: ${stats.by_severity.critical}`)
    console.log(`   • High: ${stats.by_severity.high}`)
    console.log(`   • Medium: ${stats.by_severity.medium}`)
    console.log(`   • Low: ${stats.by_severity.low}`)
    console.log(`\n   Validation Methods:`)
    console.log(`   • Graph API: ${stats.by_validation_method.graph_api}`)
    console.log(`   • PowerShell: ${stats.by_validation_method.powershell}`)
    console.log(`   • Hybrid: ${stats.by_validation_method.hybrid}`)

    // Verify insertion
    const result = await client.query('SELECT COUNT(*) FROM compliance_controls')
    const dbCount = parseInt(result.rows[0].count)

    console.log(`\n✨ Database verification: ${dbCount} controls found`)

    if (dbCount === stats.total_controls) {
      console.log('✅ UCC Production Initialization COMPLETE!\n')
      console.log('📌 Next Steps:')
      console.log('   1. Restart the backend server')
      console.log('   2. Update the domain controls API to use real controls from database')
      console.log('   3. Test with dashboard domain drill-down')
      console.log('   4. Map controls to compliance frameworks (Phase 2)\n')
    } else {
      console.error(`⚠️ Warning: Expected ${stats.total_controls} controls, found ${dbCount}`)
    }

  } catch (error) {
    console.error('❌ Error during initialization:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

initializeUCC()
