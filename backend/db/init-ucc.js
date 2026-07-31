// ============================================================
// M365 AgentOps: Universal Control Catalog (UCC) Initialization
// Initializes the database schema and control catalog
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
    console.log(`\n🌱 Seeding control catalog: ${name}...`)

    const sqlPath = path.join(__dirname, 'data', sqlFile)
    const sql = fs.readFileSync(sqlPath, 'utf-8')

    // Split and execute
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    let insertCount = 0
    for (const statement of statements) {
      const result = await pool.query(statement)
      if (statement.toLowerCase().includes('insert')) {
        insertCount += result.rowCount || 0
      }
    }

    console.log(`✅ Seeded ${insertCount} records: ${name}`)
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

    // Count controls
    const controlResult = await pool.query('SELECT COUNT(*) as count FROM m365_control_catalog')
    const controlCount = controlResult.rows[0].count
    console.log(`\n📊 Total controls in catalog: ${controlCount}`)

    // Count mappings
    const mappingResult = await pool.query('SELECT COUNT(*) as count FROM m365_control_mappings')
    const mappingCount = mappingResult.rows[0].count
    console.log(`📊 Total framework mappings: ${mappingCount}`)

    return true
  } catch (error) {
    console.error('❌ Schema verification failed:', error.message)
    return false
  }
}

async function initializeUCC() {
  try {
    console.log('🚀 Starting M365 AgentOps UCC Initialization...\n')

    // Step 1: Run schema migration
    const schemaOk = await runMigration(
      'M365-UCC Initial Schema',
      '001_m365_ucc_schema.sql'
    )
    if (!schemaOk) process.exit(1)

    // Step 2: Seed Identity controls
    const identityOk = await seedControlCatalog(
      'Identity & Auth Controls',
      'ucc_identity_controls.sql'
    )
    if (!identityOk) process.exit(1)

    // Step 3: Seed framework mappings
    const mappingsOk = await seedControlCatalog(
      'Framework Mappings',
      'ucc_framework_mappings.sql'
    )
    if (!mappingsOk) process.exit(1)

    // Step 4: Verify
    const verifyOk = await verifySchema()
    if (!verifyOk) process.exit(1)

    console.log('\n✨ UCC initialization complete!')
    console.log('\n📈 Summary:')
    console.log('   ✅ Schema created')
    console.log('   ✅ Control catalog populated')
    console.log('   ✅ Framework mappings configured')
    console.log('   ✅ Verification passed')

    console.log('\n🔗 Framework Coverage:')
    const frameworks = await pool.query(
      `SELECT framework, COUNT(DISTINCT control_id) as control_count
       FROM m365_control_mappings
       GROUP BY framework
       ORDER BY control_count DESC`
    )

    for (const row of frameworks.rows) {
      console.log(`   • ${row.framework}: ${row.control_count} controls`)
    }

    await pool.end()
  } catch (error) {
    console.error('❌ Initialization failed:', error)
    await pool.end()
    process.exit(1)
  }
}

// Run initialization
initializeUCC()
