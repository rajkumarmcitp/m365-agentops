// ============================================================
// Real Controls Initialization
// Seeds the database with actual compliance controls
// ============================================================

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pkg from 'pg'
const { Client } = pkg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'm365_agentops',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
})

async function initializeRealControls() {
  try {
    console.log('🚀 Starting Real Controls Initialization...')

    await client.connect()
    console.log('✅ Connected to database')

    // Step 1: Create tables
    console.log('📋 Creating tables...')
    const schemaSql = fs.readFileSync(
      path.join(__dirname, 'migrations/003_real_controls.sql'),
      'utf-8'
    )
    await client.query(schemaSql)
    console.log('✅ Tables created')

    // Step 2: Load control data
    console.log('📦 Loading control definitions...')
    const controlData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, 'seeders/cis-controls.json'),
        'utf-8'
      )
    )

    // Step 3: Insert domains
    console.log('🗂️  Inserting domains...')
    let domainCount = 0
    for (const domain of controlData.domains) {
      await client.query(
        `INSERT INTO compliance_domains (id, name, workload)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [domain.id, domain.name, domain.workload]
      )
      domainCount++
    }
    console.log(`✅ Inserted ${domainCount} domains`)

    // Step 4: Insert controls
    console.log('🎯 Inserting controls...')
    let controlCount = 0
    for (const control of controlData.controls) {
      const graphQueries = control.graph_api_queries ? JSON.stringify(control.graph_api_queries) : null
      const psCommands = control.powershell_commands ? JSON.stringify(control.powershell_commands) : null

      await client.query(
        `INSERT INTO compliance_controls
         (control_id, framework, title, description, domain, severity,
          validation_method, graph_api_queries, powershell_commands,
          expected_values, remediation_steps)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (control_id) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         updated_at = CURRENT_TIMESTAMP`,
        [
          control.control_id,
          control.framework,
          control.title,
          control.description,
          control.domain,
          control.severity,
          control.validation_method,
          graphQueries,
          psCommands,
          control.expected_values,
          control.remediation_steps
        ]
      )
      controlCount++
    }
    console.log(`✅ Inserted ${controlCount} controls`)

    // Step 5: Get statistics
    console.log('📊 Calculating statistics...')
    const stats = await client.query(`
      SELECT
        COUNT(DISTINCT framework) as framework_count,
        COUNT(DISTINCT domain) as domain_count,
        COUNT(*) as total_controls,
        COUNT(CASE WHEN severity = 'Critical' THEN 1 END) as critical,
        COUNT(CASE WHEN severity = 'High' THEN 1 END) as high,
        COUNT(CASE WHEN severity = 'Medium' THEN 1 END) as medium,
        COUNT(CASE WHEN severity = 'Low' THEN 1 END) as low
      FROM compliance_controls
    `)

    const data = stats.rows[0]
    console.log('✅ Statistics:')
    console.log(`   • Frameworks: ${data.framework_count}`)
    console.log(`   • Domains: ${data.domain_count}`)
    console.log(`   • Total Controls: ${data.total_controls}`)
    console.log(`   • Critical: ${data.critical}`)
    console.log(`   • High: ${data.high}`)
    console.log(`   • Medium: ${data.medium}`)
    console.log(`   • Low: ${data.low}`)

    console.log('\n✨ Real Controls Initialization Complete!')
    console.log('📌 Next: Restart backend and test with real controls')

  } catch (error) {
    console.error('❌ Error during initialization:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

initializeRealControls()
