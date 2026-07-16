import puppeteer from 'puppeteer';

(async () => {
  console.log('🔍 Testing Backup Navigation with Authentication\n');

  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();

    console.log('1️⃣ Loading app...');
    await page.goto('http://localhost:5173', { 
      waitUntil: 'load',
      timeout: 45000 
    });

    console.log('✅ App loaded\n');

    console.log('2️⃣ Logging in with Aisha Raza (SUPER user)...');
    // Look for Aisha button and click it
    const aishaButton = await page.$('text=Aisha');
    if (aishaButton) {
      await aishaButton.click();
      console.log('✅ Clicked Aisha Raza');
    }

    // Wait for login to process
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n3️⃣ Checking navigation after login...');
    const navItems = await page.evaluate(() => {
      const items = document.querySelectorAll('.nav-item[data-page]');
      return Array.from(items).map(n => ({
        id: n.getAttribute('data-page'),
        label: n.textContent.split('\n')[0].trim()
      }));
    });

    console.log(`Found ${navItems.length} navigation items`);
    
    const backupItem = navItems.find(item => item.id === 'backup');
    if (backupItem) {
      console.log(`\n✅ BACKUP NAVIGATION WORKING!`);
      console.log(`   Item ID: ${backupItem.id}`);
      console.log(`   Label: ${backupItem.label}`);
    } else {
      console.log(`\n❌ Backup not found in navigation`);
      console.log('Items found:', navItems.map(i => i.id).join(', '));
    }

    // List all config items
    console.log('\n4️⃣ Config section items:');
    const configItems = navItems.filter(item => 
      ['backup', 'audit', 'settings', 'graphapi', 'sso', 'setup-wizard'].includes(item.id)
    );
    configItems.forEach(item => {
      console.log(`   • ${item.id}: ${item.label}`);
    });

    if (configItems.some(i => i.id === 'backup')) {
      console.log('\n🎉 SUCCESS - Backup page is visible in navigation!');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) await browser.close();
  }
})();
