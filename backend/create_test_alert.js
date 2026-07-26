import { getDatabase } from './tenantguard/database.js';

const db = getDatabase();

const alertId = 'test-p1-001';
db.prepare('INSERT INTO alerts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
  .run(
    alertId,
    'AUTH_ANOMALY',
    'HIGH',
    85,
    'P1',
    'Suspicious sign-in from Tor exit node',
    'User john.doe@contoso.com attempted login from 185.220.x.x at 02:30 UTC',
    'High risk - impossible travel detected',
    'Block user account, review OAuth consents',
    'john.doe@contoso.com',
    'Office 365',
    new Date().toISOString(),
    {},
    0,
    new Date().toISOString(),
    'Authentication'
  );

console.log(`✓ Created test alert: ${alertId}`);
console.log(`✓ Test with: curl -X POST http://localhost:3000/api/tenantguard/agent/investigate/${alertId}`);
