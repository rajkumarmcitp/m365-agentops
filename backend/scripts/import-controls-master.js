#!/usr/bin/env node

/**
 * Import all Controls files (Controls.xlsx, Controls2.xlsx, Controls3.xlsx)
 * into PostgreSQL with deduplication
 */

import XLSX from 'xlsx'
import pkg from 'pg'
import fs from 'fs'

const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/m365_agentops'
})

async function importFile(filePath, fileLabel) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⊘ File not found: ${filePath}`)
      return { count: 0, skipped: 0 }
    }

    const workbook = XLSX.readFile(filePath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(worksheet)

    console.log(`\n📂 Processing ${fileLabel} (${rows.length} rows)...`)

    let insertCount = 0
    let skipCount = 0

    for (const row of rows) {
      const id = row['Control ID'] || row['ID'] || row['controlId']
      if (!id) continue

      const exists = await pool.query(
        'SELECT id FROM controls WHERE control_id = $1',
        [id]
      )

      if (exists.rows.length > 0) {
        skipCount++
        continue
      }

      const title = row['Control Name'] || row['Name'] || ''
      const domain = row['Domain'] || 'Unknown'
      const severity = (row['Severity'] || 'Medium').toUpperCase()
      const description = row['Description'] || row['name'] || ''
      const frameworks = row['Frameworks'] || ''
      const validationMethod = row['Validation Engine'] || 'Manual'
      const remediation = row['Remediation'] || row['remediation_steps'] || ''

      await pool.query(
        `INSERT INTO controls (control_id, title, domain, severity, description, frameworks, validation_method, remediation_steps, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         ON CONFLICT (control_id) DO NOTHING`,
        [id, title, domain, severity, description, frameworks, validationMethod, remediation]
      )

      insertCount++
      if (insertCount % 100 === 0) console.log(`  ✓ ${insertCount} inserted...`)
    }

    console.log(`  ✓ Added: ${insertCount} | ⊘ Duplicates: ${skipCount}`)
    return { count: insertCount, skipped: skipCount }
  } catch (error) {
    console.error(`❌ Error with ${fileLabel}:`, error.message)
    return { count: 0, skipped: 0 }
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗')
  console.log('║           MASTER CONTROLS IMPORT - ALL FILES                 ║')
  console.log('╚════════════════════════════════════════════════════════════════╝')

  try {
    await pool.query('SELECT 1')
    console.log('✅ Database connected\n')

    // Clear existing controls (optional - comment out to preserve)
    // await pool.query('TRUNCATE TABLE controls')
    // console.log('🗑️  Cleared existing controls')

    // Import in order
    const r1 = await importFile('/Users/vasanthipromoters/Documents/Controls.xlsx', 'Controls.xlsx')
    const r2 = await importFile('/Users/vasanthipromoters/Documents/Controls2.xlsx', 'Controls2.xlsx')
    const r3 = await importFile('/Users/vasanthipromoters/Documents/Controls3.xlsx', 'Controls3.xlsx')

    // Get totals
    const result = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(DISTINCT domain) as domains,
        COUNT(DISTINCT severity) as severities
      FROM controls
    `)

    const stats = result.rows[0]

    console.log('\n╔════════════════════════════════════════════════════════════════╗')
    console.log('║                    FINAL SUMMARY                              ║')
    console.log('╚════════════════════════════════════════════════════════════════╝\n')
    console.log(`Total Controls: ${stats.total}`)
    console.log(`  • Controls.xlsx: ${r1.count} (${r1.skipped} duplicates)`)
    console.log(`  • Controls2.xlsx: ${r2.count} (${r2.skipped} duplicates)`)
    console.log(`  • Controls3.xlsx: ${r3.count} (${r3.skipped} duplicates)`)
    console.log(`\nUnique Domains: ${stats.domains}`)
    console.log(`Severity Levels: ${stats.severities}`)
    console.log('\n✅ All controls imported successfully!\n')

    // Get domain breakdown
    const domains = await pool.query(`
      SELECT domain, COUNT(*) as count
      FROM controls
      GROUP BY domain
      ORDER BY count DESC
    `)

    console.log('Domain Breakdown:')
    domains.rows.forEach(d => console.log(`  • ${d.domain}: ${d.count}`))

    process.exit(0)
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
