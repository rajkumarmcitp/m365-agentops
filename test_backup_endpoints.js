import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000';

async function testEndpoints() {
  console.log('🧪 Testing M365 Backup API Endpoints\n');
  console.log('═══════════════════════════════════════\n');

  const endpoints = [
    { method: 'GET', path: '/api/backup/m365/services/list', desc: 'List all services' },
    { method: 'GET', path: '/api/backup/m365/services/ExchangeOnline', desc: 'Get ExchangeOnline details' },
    { method: 'GET', path: '/api/backup/m365/backups', desc: 'Get backup history (NEW ENDPOINT)' },
    { method: 'GET', path: '/api/backup/m365/status', desc: 'Get backup status' },
    { method: 'GET', path: '/api/backup/m365/history', desc: 'Get full backup history' },
  ];

  let passed = 0;
  let failed = 0;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_BASE}${endpoint.path}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${endpoint.method} ${endpoint.path}`);
        console.log(`   └─ ${endpoint.desc}`);
        if (data.data) {
          if (Array.isArray(data.data)) {
            console.log(`   └─ ${data.data.length} items returned`);
          } else if (typeof data.data === 'object') {
            console.log(`   └─ Data: ${JSON.stringify(data.data).substring(0, 60)}...`);
          }
        }
        passed++;
      } else {
        console.log(`❌ ${endpoint.method} ${endpoint.path}`);
        console.log(`   └─ Status: ${response.status} ${response.statusText}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${endpoint.method} ${endpoint.path}`);
      console.log(`   └─ Error: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log('═══════════════════════════════════════\n');
  console.log(`Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('✅ ALL ENDPOINTS WORKING!\n');
    console.log('The backup page should now load without errors.');
    console.log('✅ 404 error on /backups endpoint is FIXED\n');
  }
}

testEndpoints();
