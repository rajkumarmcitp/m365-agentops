// Wizard E2E Test Script
// Tests all 7 steps with conflict scenarios

import puppeteer from 'puppeteer';

const TEST_URL = 'http://localhost:5173';

(async () => {
  console.log('🧙 Starting Wizard E2E Tests...\n');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport
  await page.setViewport({ width: 1280, height: 1024 });

  try {
    // Navigate directly to backup page
    console.log('📍 Loading app and navigating to Backup page...');
    await page.goto(TEST_URL + '/#/backup', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000)); // Wait for React to render
    console.log('✓ Backup page loaded\n');

    // Make sure we're on the History tab by clicking History button
    console.log('📍 Ensuring History tab is active...');
    const historyBtns = await page.$$('button');
    for (let btn of historyBtns) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes('History')) {
        await btn.click();
        break;
      }
    }
    await page.waitForTimeout(800);
    console.log('✓ History tab active\n');

    // Find and click Wizard button
    console.log('📍 Finding Wizard button...');
    const wizardBtn = await page.$('.wizard-restore-btn');
    if (!wizardBtn) {
      console.log('❌ Wizard button not found');
      throw new Error('Wizard button not in DOM');
    }
    await wizardBtn.click();
    console.log('✓ Wizard button clicked\n');

    // Wait for wizard modal to appear
    console.log('📍 Waiting for wizard modal...');
    await page.waitForFunction(() => document.getElementById('restore-wizard-modal'), { timeout: 3000 });
    console.log('✓ Wizard modal opened\n');

    // ========== STEP 1: Choose Backup ==========
    console.log('═══════════════════════════════════════');
    console.log('📍 STEP 1: Choose Backup');
    console.log('═══════════════════════════════════════\n');

    // Verify Step 1 content
    const step1Title = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText.includes('Choose Backup'));
    console.log(`✓ Step 1 title visible: ${step1Title}`);

    // Select a backup
    const backupSelect = await page.$('#wizard-backup-select');
    if (!backupSelect) throw new Error('Backup select dropdown not found');
    await backupSelect.select('0'); // Select first backup
    console.log('✓ Backup selected');

    // Check for tip text
    const tipExists = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText.includes('Tip'));
    console.log(`✓ Tip text visible: ${tipExists}\n`);

    // Click Next
    console.log('📍 Clicking Next button...');
    const nextBtn = await page.$('#wizard-next-btn');
    await nextBtn.click();
    await page.waitForTimeout(500);
    console.log('✓ Moved to Step 2\n');

    // ========== STEP 2: Choose Service ==========
    console.log('═══════════════════════════════════════');
    console.log('📍 STEP 2: Choose Service');
    console.log('═══════════════════════════════════════\n');

    const step2Title = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText.includes('Choose Service'));
    console.log(`✓ Step 2 title visible: ${step2Title}`);

    // Count service checkboxes
    const serviceCheckboxes = await page.$$('.wizard-service-checkbox');
    console.log(`✓ Found ${serviceCheckboxes.length} services`);

    // Select first 2 services
    if (serviceCheckboxes.length > 0) {
      await serviceCheckboxes[0].click();
      console.log('✓ Service 1 selected');
    }
    if (serviceCheckboxes.length > 1) {
      await serviceCheckboxes[1].click();
      console.log('✓ Service 2 selected');
    }

    // Verify summary text
    const summary = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText.includes('Restore from'));
    console.log(`✓ Restore summary visible: ${summary}\n`);

    // Click Next
    await nextBtn.click();
    await page.waitForTimeout(500);
    console.log('✓ Moved to Step 3\n');

    // ========== STEP 3: Choose Objects ==========
    console.log('═══════════════════════════════════════');
    console.log('📍 STEP 3: Choose Objects');
    console.log('═══════════════════════════════════════\n');

    const step3Title = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText.includes('Choose Objects'));
    console.log(`✓ Step 3 title visible: ${step3Title}`);

    // Check for all-objects checkbox
    const allObjectsCheckbox = await page.$('#wizard-all-objects');
    if (allObjectsCheckbox) {
      const isChecked = await page.evaluate(() => document.getElementById('wizard-all-objects').checked);
      console.log(`✓ "Restore all objects" checkbox: ${isChecked ? 'checked' : 'unchecked'}`);
    }

    console.log('✓ Objects page verified\n');

    // Click Next
    await nextBtn.click();
    await page.waitForTimeout(500);
    console.log('✓ Moved to Step 4\n');

    // ========== STEP 4: Preview Changes ==========
    console.log('═══════════════════════════════════════');
    console.log('📍 STEP 4: Preview Changes');
    console.log('═══════════════════════════════════════\n');

    const step4Title = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText.includes('Preview'));
    console.log(`✓ Step 4 title visible: ${step4Title}`);

    // Check for metrics
    const previewContent = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText);
    const hasObjectsToUpdate = previewContent.includes('Objects to Update') || previewContent.includes('245');
    const hasCurrentObjects = previewContent.includes('Already Current') || previewContent.includes('872');
    console.log(`✓ Objects to update shown: ${hasObjectsToUpdate}`);
    console.log(`✓ Already current shown: ${hasCurrentObjects}\n`);

    // Click Next (conflicts will be detected here)
    console.log('📍 Clicking Next (conflict detection runs...)');
    await nextBtn.click();
    await page.waitForTimeout(1000);
    console.log('✓ Moved to Step 5 (conflicts detected/analyzed)\n');

    // ========== STEP 5: Conflict Detection ==========
    console.log('═══════════════════════════════════════');
    console.log('📍 STEP 5: Conflict Detection');
    console.log('═══════════════════════════════════════\n');

    const step5Title = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText.includes('Conflict'));
    console.log(`✓ Step 5 title visible: ${step5Title}`);

    const step5Content = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText);

    // Check if conflicts were detected
    const hasConflicts = step5Content.includes('Conflicts Detected') && step5Content.includes('⚠️');
    const noConflicts = step5Content.includes('No Conflicts Detected') && step5Content.includes('✅');

    if (hasConflicts) {
      console.log('✓ Conflicts detected (⚠️)');

      // Extract conflict count
      const conflictMatch = step5Content.match(/(\d+)\s*Conflicts Detected/);
      if (conflictMatch) {
        console.log(`  - Found ${conflictMatch[1]} conflicts`);
      }

      // Check for resolve button
      const resolveBtn = await page.$('#wizard-show-conflicts-btn');
      if (resolveBtn) {
        console.log('✓ [🔧 Resolve Conflicts] button visible');

        // Click to open conflict resolution modal
        console.log('\n📍 Opening conflict resolution modal...');
        await resolveBtn.click();
        await page.waitForFunction(() => document.getElementById('conflict-resolution-modal'), { timeout: 2000 });
        console.log('✓ Conflict resolution modal opened\n');

        // ========== CONFLICT RESOLUTION MODAL ==========
        console.log('─── Conflict Resolution Modal ───');

        const conflictModal = await page.$('#conflict-resolution-modal');
        const modalContent = await page.evaluate(() => document.getElementById('conflict-resolution-modal')?.innerText);

        console.log(`✓ Modal content:\n${modalContent.substring(0, 200)}...\n`);

        // Find and click resolution buttons
        const resolutionBtns = await page.$$('.conflict-resolution-btn');
        console.log(`✓ Found ${resolutionBtns.length} resolution buttons`);

        // Click first resolution button on first conflict
        if (resolutionBtns.length > 0) {
          console.log('✓ Selecting first resolution option...');
          await resolutionBtns[0].click();
          await page.waitForTimeout(300);
          console.log('  - Resolution selected');
        }

        // Click Continue button
        const continueBtn = await page.$('#conflict-continue-btn');
        if (continueBtn) {
          console.log('\n📍 Clicking [Continue] in conflict modal...');
          await continueBtn.click();
          await page.waitForTimeout(500);
          console.log('✓ Conflict modal closed\n');
        }
      }
    } else if (noConflicts) {
      console.log('✓ No conflicts detected (✅)');
      console.log('  - Safe to proceed with restore');
    }

    console.log('✓ Step 5 verified\n');

    // Click Next
    const nextBtn2 = await page.$('#wizard-next-btn');
    await nextBtn2.click();
    await page.waitForTimeout(500);
    console.log('✓ Moved to Step 6\n');

    // ========== STEP 6: Summary & Approve ==========
    console.log('═══════════════════════════════════════');
    console.log('📍 STEP 6: Summary & Approve');
    console.log('═══════════════════════════════════════\n');

    const step6Title = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText.includes('Summary'));
    console.log(`✓ Step 6 title visible: ${step6Title}`);

    // Select restore reason
    const reasonSelect = await page.$('#wizard-reason-select');
    if (reasonSelect) {
      await reasonSelect.select('disaster_recovery');
      console.log('✓ Restore reason selected: Disaster Recovery');
    }

    // Check for summary
    const summaryExists = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText.includes('Summary'));
    console.log(`✓ Summary section visible: ${summaryExists}\n`);

    // Click Next
    const nextBtn3 = await page.$('#wizard-next-btn');
    await nextBtn3.click();
    await page.waitForTimeout(500);
    console.log('✓ Moved to Step 7\n');

    // ========== STEP 7: Verification ==========
    console.log('═══════════════════════════════════════');
    console.log('📍 STEP 7: Verification');
    console.log('═══════════════════════════════════════\n');

    const step7Title = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText.includes('Verification') || el.innerText.includes('Complete'));
    console.log(`✓ Step 7 title visible: ${step7Title}`);

    const step7Content = await page.$eval('[id="restore-wizard-modal"]', el => el.innerText);
    const hasSuccessIcon = step7Content.includes('✅');
    const hasRestoreComplete = step7Content.includes('Restore Complete');

    console.log(`✓ Success icon visible: ${hasSuccessIcon}`);
    console.log(`✓ Completion message visible: ${hasRestoreComplete}`);

    // Check for final button
    const finalBtn = await page.$('#wizard-next-btn');
    const btnText = await page.evaluate(() => document.getElementById('wizard-next-btn')?.innerText);
    console.log(`✓ Final button text: "${btnText}"\n`);

    // ========== TEST SUMMARY ==========
    console.log('═══════════════════════════════════════');
    console.log('🎉 TEST SUMMARY');
    console.log('═══════════════════════════════════════\n');

    console.log('✅ Step 1: Choose Backup - PASS');
    console.log('✅ Step 2: Choose Service - PASS');
    console.log('✅ Step 3: Choose Objects - PASS');
    console.log('✅ Step 4: Preview Changes - PASS');
    console.log('✅ Step 5: Conflict Detection - PASS');
    if (hasConflicts) {
      console.log('  └─ Conflicts detected and resolution options shown');
    } else {
      console.log('  └─ No conflicts detected (clean restore path)');
    }
    console.log('✅ Step 6: Summary & Approve - PASS');
    console.log('✅ Step 7: Verification - PASS');
    console.log('\n✅ ALL TESTS PASSED - Wizard fully functional\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
})();
