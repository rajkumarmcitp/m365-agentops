// ============================================================
// M365 AgentOps: UCC Initialization (Phase 1.2)
// Initializes database schema + 1,000+ controls + mappings
// ============================================================

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Pool } from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'm365_agentops',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL === 'true'
})

async function runMigration(name, sqlFile) {
  try {
    console.log(`\n📋 Running migration: ${name}...`)

    const sqlPath = path.join(__dirname, 'migrations', sqlFile)
    const sql = fs.readFileSync(sqlPath, 'utf-8')

    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
      await pool.query(statement)
    }

    console.log(`✅ Migration completed: ${name}`)
    return true
  } catch (error) {
    console.error(`❌ Migration failed: ${name}`)
    console.error(error.message)
    return false
  }
}

async function seedControlCatalog(name, sqlFile) {
  try {
    console.log(`\n🌱 Seeding ${name}...`)

    const sqlPath = path.join(__dirname, 'data', sqlFile)

    // Check if file exists
    if (!fs.existsSync(sqlPath)) {
      console.warn(`⚠️ File not found: ${sqlFile}`)
      console.log('   Note: Run "node generate-ucc-controls.js" first')
      return false
    }

    const sql = fs.readFileSync(sqlPath, 'utf-8')

    // Split and execute in batches to handle large datasets
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    let insertCount = 0
    const batchSize = 100

    for (let i = 0; i < statements.length; i += batchSize) {
      const batch = statements.slice(i, i + batchSize)
      const batchSql = batch.join('; ') + ';'

      try {
        const result = await pool.query(batchSql)
        insertCount += result.rowCount || 0
      } catch (e) {
        console.error(`Error in batch ${Math.floor(i / batchSize) + 1}:`, e.message)
        throw e
      }

      // Progress indicator
      const progress = Math.min(i + batchSize, statements.length)
      process.stdout.write(`\r   Processing: ${progress}/${statements.length}`)
    }

    console.log(`\n✅ Seeded ${insertCount} records: ${name}`)
    return true
  } catch (error) {
    console.error(`❌ Seeding failed: ${name}`)
    console.error(error.message)
    return false
  }
}

async function verifySchema() {
  try {
    console.log('\n🔍 Verifying schema...')

    const tables = [
      'm365_control_catalog',
      'm365_control_mappings',
      'm365_control_results',
      'm365_control_evidence',
      'm365_compliance_snapshots',
      'm365_compliance_drift',
      'm365_control_history'
    ]

    for (const table of tables) {
      const result = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = $1
        )`,
        [table]
      )

      if (result.rows[0].exists) {
        console.log(`✅ Table exists: ${table}`)
      } else {
        console.log(`❌ Table missing: ${table}`)
        return false
      }
    }

    // Count records
    console.log('\n📊 Control Catalog Statistics:')

    const controlResult = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(DISTINCT domain) as domains,
        MIN(control_id) as first,
        MAX(control_id) as last
      FROM m365_control_catalog
    `)
    const { total, domains, first, last } = controlResult.rows[0]
    console.log(`   Total Controls: ${total}`)
    console.log(`   Domains: ${domains}`)
    console.log(`   Range: ${first} to ${last}`)

    // Severity breakdown
    const severityResult = await pool.query(`
      SELECT severity, COUNT(*) as count
      FROM m365_control_catalog
      GROUP BY severity
      ORDER BY CASE
        WHEN severity = 'Critical' THEN 1
        WHEN severity = 'High' THEN 2
        WHEN severity = 'Medium' THEN 3
        WHEN severity = 'Low' THEN 4
        WHEN severity = 'Informational' THEN 5
      END
    `)

    console.log(`\n   By Severity:`)
    for (const row of severityResult.rows) {
      console.log(`     ${row.severity}: ${row.count}`)
    }

    // Domain breakdown
    const domainResult = await pool.query(`
      SELECT domain, COUNT(*) as count
      FROM m365_control_catalog
      GROUP BY domain
      ORDER BY domain
    `)

    console.log(`\n   By Domain:`)
    for (const row of domainResult.rows) {
      console.log(`     ${row.domain}: ${row.count} controls`)
    }

    // Mapping stats
    const mappingResult = await pool.query(`
      SELECT framework, COUNT(*) as count
      FROM m365_control_mappings
      GROUP BY framework
      ORDER BY count DESC
    `)

    console.log(`\n📊 Framework Mappings:`)
    for (const row of mappingResult.rows) {
      console.log(`     ${row.framework}: ${row.count} mappings`)
    }

    const totalMappings = mappingResult.rows.reduce((sum, r) => sum + r.count, 0)
    console.log(`   Total Mappings: ${totalMappings}`)
    console.log(`   Avg per Control: ${(totalMappings / total).toFixed(2)}`)

    return true
  } catch (error) {
    console.error('❌ Schema verification failed:', error.message)
    return false
  }
}

async function initializeUCC() {
  try {
    console.log('🚀 Starting M365 AgentOps UCC Phase 1.2 Initialization...\n')

    // Step 1: Run schema migration (if not already done)
    console.log('Step 1/4: Schema Setup')
    const schemaOk = await runMigration(
      'M365-UCC Initial Schema',
      '001_m365_ucc_schema.sql'
    )
    if (!schemaOk) {
      console.log('⚠️ Schema migration skipped (may already exist)')
    }

    // Step 2: Seed Phase 1.1 controls (Identity & Auth)
    console.log('\nStep 2/4: Phase 1.1 Controls (Identity & Auth)')
    const phase1Ok = await seedControlCatalog(
      'Identity & Auth Controls (Phase 1.1)',
      'ucc_identity_controls.sql'
    )

    // Step 3: Seed Phase 1.2 controls (All domains)
    console.log('\nStep 3/4: Phase 1.2 Controls (All Domains)')
    const phase2Ok = await seedControlCatalog(
      'Full Control Catalog (Phase 1.2)',
      'ucc_controls_phase_1_2.sql'
    )

    // Step 4: Seed all framework mappings
    console.log('\nStep 4/4: Framework Mappings')
    const mappingsOk = await seedControlCatalog(
      'Framework Mappings (Phase 1.2)',
      'ucc_mappings_phase_1_2.sql'
    )

    // Verify
    console.log('\nStep 5/4: Verification')
    const verifyOk = await verifySchema()

    console.log('\n' + '='.repeat(60))
    if (verifyOk) {
      console.log('✨ Phase 1.2 Initialization Complete!')
      console.log('\n🎯 Ready for:')
      console.log('   1. Phase 1.3: Compliance Engine (weighted scoring)')
      console.log('   2. Phase 1.4: v2.0 API Endpoints')
      console.log('   3. Phase 2: Executive Dashboards')
    } else {
      console.log('⚠️ Initialization completed with warnings')
    }

    console.log('\n📚 Next Steps:')
    console.log('   1. Integrate validation engine')
    console.log('   2. Add compliance calculation endpoints')
    console.log('   3. Build executive dashboard views')

    await pool.end()
  } catch (error) {
    console.error('❌ Initialization failed:', error)
    await pool.end()
    process.exit(1)
  }
}

// Run initialization
initializeUCC()
