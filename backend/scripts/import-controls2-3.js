#!/usr/bin/env node

/**
 * Import Controls2.xlsx and Controls3.xlsx into PostgreSQL
 * Adds Dynamics 365, Viva, Fabric, and Power Platform controls
 */

import XLSX from 'xlsx'
import pkg from 'pg'
import fs from 'fs'
import path from 'path'

const { Pool } = pkg

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/m365_agentops'
})

async function importControls(filePath, fileLabel) {
  try {
    console.log(`\n📂 Reading ${fileLabel}...`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`)
      return { success: false, count: 0, errors: [`File not found: ${filePath}`] }
    }

    // Read Excel file
    const workbook = XLSX.readFile(filePath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(worksheet)

    console.log(`📊 Found ${rows.length} rows in ${fileLabel}`)

    // Filter unique controls (avoid duplicates from Controls.xlsx)
    const uniqueControls = []
    const seenIds = new Set()

    for (const row of rows) {
      const controlId = row['Control ID'] || row['ID'] || row['controlId']
      if (!controlId) continue

      if (seenIds.has(controlId)) {
        continue
      }

      seenIds.add(controlId)
      uniqueControls.push(row)
    }

    console.log(`✅ Unique controls: ${uniqueControls.length}`)

    // Prepare data for database
    let insertCount = 0
    let skipCount = 0

    for (const control of uniqueControls) {
      try {
        const id = control['Control ID'] || control['ID'] || control['controlId']
        const title = control['Control Name'] || control['Name'] || control['name']
        const domain = control['Domain'] || control['domain'] || 'Unknown'
        const severity = control['Severity'] || control['severity'] || 'Medium'
        const description = control['Description'] || control['description'] || ''
        const frameworks = control['Frameworks'] || control['frameworks'] || ''
        const validationMethod = control['Validation Engine'] || control['validationMethod'] || 'Manual'
        const remediationSteps = control['Remediation'] || control['remediation'] || ''

        // Check if control already exists
        const existsResult = await pool.query(
          'SELECT id FROM controls WHERE control_id = $1',
          [id]
        )

        if (existsResult.rows.length > 0) {
          skipCount++
          continue
        }

        // Insert control
        await pool.query(
          `INSERT INTO controls
           (control_id, title, domain, severity, description, frameworks, validation_method, remediation_steps, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
          [id, title, domain, severity, description, frameworks, validationMethod, remediationSteps]
        )

        insertCount++

        if (insertCount % 50 === 0) {
          console.log(`  📥 Inserted ${insertCount}...`)
        }
      } catch (rowError) {
        console.warn(`  ⚠️  Error inserting control: ${control['Control ID']} - ${rowError.message}`)
      }
    }

    console.log(`✅ ${fileLabel} Import Complete:`)
    console.log(`   ✓ Inserted: ${insertCount}`)
    console.log(`   ⊘ Skipped (duplicates): ${skipCount}`)

    return { success: true, count: insertCount, skipped: skipCount }
  } catch (error) {
    console.error(`❌ Error importing ${fileLabel}:`, error.message)
    return { success: false, count: 0, error: error.message }
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════════╗')
  console.log('║         Import Controls2 & Controls3 into Database             ║')
  console.log('╚══════════════════════════════════════════════════════════════════╝\n')

  try {
    // Connect to database
    const testConnection = await pool.query('SELECT 1')
    console.log('✅ Database connection established')

    // Verify table exists
    const tableCheck = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'controls')`
    )

    if (!tableCheck.rows[0].exists) {
      console.log('\n📋 Creating controls table...')
      await pool.query(`
        CREATE TABLE IF NOT EXISTS controls (
          id SERIAL PRIMARY KEY,
          control_id VARCHAR(50) UNIQUE NOT NULL,
          title VARCHAR(255) NOT NULL,
          domain VARCHAR(100),
          severity VARCHAR(20),
          description TEXT,
          frameworks TEXT,
          validation_method VARCHAR(50),
          remediation_steps TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `)
      console.log('✅ Controls table created')
    }

    // Import Control2
    const result2 = await importControls(
      '/Users/vasanthipromoters/Documents/Controls2.xlsx',
      'Controls2.xlsx (Dynamics 365 + Viva)'
    )

    // Import Control3
    const result3 = await importControls(
      '/Users/vasanthipromoters/Documents/Controls3.xlsx',
      'Controls3.xlsx (Fabric + Power Platform)'
    )

    // Get total count
    const totalResult = await pool.query('SELECT COUNT(*) as count FROM controls')
    const totalControls = totalResult.rows[0].count

    console.log('\n╔══════════════════════════════════════════════════════════════════╗')
    console.log('║                    IMPORT SUMMARY                               ║')
    console.log('╚══════════════════════════════════════════════════════════════════╝')
    console.log(`\nTotal Controls in Database: ${totalControls}`)
    console.log(`  • Controls.xlsx: ~1,499`)
    console.log(`  • Controls2.xlsx: ${result2.count} added`)
    console.log(`  • Controls3.xlsx: ${result3.count} added`)
    console.log(`\nGrand Total: ${totalControls} controls`)
    console.log('\n✅ Import complete!\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
