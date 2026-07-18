# TenantGuard Real-Time Data Configuration

## Overview

TenantGuard is now configured to display **real-time security data** from your Microsoft 365 environment with a **10-second update interval**. This enables security administrators to monitor threats as they occur.

## Real-Time Features

### ✨ Live Indicators
- **🟢 LIVE** badge shows when data is current
- **⏳ Updating...** indicator shows when refresh is in progress
- **Last updated timestamp** displays exact time of latest data fetch
- **Update counter** tracks number of data refreshes

### 🔄 Automatic Updates
- **Refresh Interval**: 10 seconds (configurable)
- **Background Polling**: Non-blocking updates while you work
- **Parallel API Calls**: Simultaneous fetch of alerts, correlations, patterns
- **Graceful Fallback**: Demo data if backend unavailable

### 🎯 Manual Refresh
- **Refresh Button** available in header for immediate data update
- **Disabled during update** to prevent duplicate requests
- **Toast notification** shows update status

## Architecture

### Update Flow
```
┌─────────────────────────────────────┐
│ TenantGuard Dashboard               │
│ (10-second polling)                 │
└──────────────┬──────────────────────┘
               │
               ├─→ GET /api/tenantguard/alerts (100 limit)
               │      ↓ Parse alerts
               │
               ├─→ GET /api/tenantguard/correlations
               │      ↓ Parse correlations
               │
               ├─→ GET /api/tenantguard/patterns
               │      ↓ Parse patterns
               │
               ├─→ Update allAlerts, allCorrelations, allPatterns
               │
               ├─→ Re-render UI with latest data
               │
               └─→ Update lastUpdateTime & updateCount
```

## Configuration

### Update Interval
**Current:** 10 seconds (10,000 milliseconds)
**Location:** `pages/tenantguard.js` line 19
**To change:**
```javascript
const REFRESH_INTERVAL = 10 * 1000 // Change to 5 * 1000 for 5 seconds, etc.
```

**Recommended Intervals:**
- **5 seconds**: Ultra-responsive for critical monitoring
- **10 seconds**: Balanced (default - recommended)
- **30 seconds**: Reduced server load
- **60 seconds**: Minimal load (not recommended for real-time)

### API Base URL
**Auto-detected** from hostname:
- **Localhost**: `http://localhost:3000`
- **Production**: `https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net`

**To override:**
```javascript
const API_BASE = 'https://your-custom-url.com'
```

## API Endpoints

### Real-Time Data Sources

#### 1. Alerts Endpoint
```
GET /api/tenantguard/alerts?limit=100
```
**Returns:** Up to 100 most recent alerts
**Fields:**
- `id` - Alert unique identifier
- `priority` - P0/P1/P2/P3 priority level
- `severity` - CRITICAL/HIGH/MEDIUM/LOW
- `headline` - Alert title
- `description` - Full alert description
- `actor` - User who triggered alert
- `source` - Which M365 service (Entra ID, Exchange, etc.)
- `timestamp` - When alert was generated
- `score` - Risk score (0-100)
- `status` - open/investigating/resolved

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "alert-1",
      "priority": "P0",
      "severity": "CRITICAL",
      "headline": "MFA Disabled for Global Admin",
      "description": "MFA requirement removed",
      "actor": "admin@contoso.com",
      "source": "Entra ID",
      "timestamp": "2026-07-18T10:30:00Z",
      "score": 95,
      "status": "open"
    }
  ]
}
```

#### 2. Correlations Endpoint
```
GET /api/tenantguard/correlations
```
**Returns:** Attack chain correlations
**Fields:**
- `id` - Correlation ID
- `description` - Attack chain description
- `alert_count` - Number of related events
- `correlation_type` - ACTOR/TARGET/PATTERN
- `risk_level` - CRITICAL/HIGH/MEDIUM
- `correlation_score` - Score 0-100
- `start_timestamp` - When attack started
- `end_timestamp` - When attack ended

#### 3. Patterns Endpoint
```
GET /api/tenantguard/patterns
```
**Returns:** MITRE ATT&CK attack patterns
**Fields:** Attack pattern details with T-codes

## Performance Considerations

### Optimization Tips

1. **Reduce Alerts Limit**
   - Change `?limit=100` to `?limit=50` for faster responses
   - Trade-off: See fewer alerts but faster updates

2. **Increase Update Interval**
   - If server load is high, increase to 30-60 seconds
   - Users see slightly delayed data but reduced API calls

3. **Conditional Updates**
   - Skip re-render if data hasn't changed
   - Reduces browser CPU usage

4. **Database Indexes**
   - Ensure backend has indexes on `priority`, `severity`, `timestamp`
   - Improves query speed

### Expected Performance

**Network:**
- Alerts fetch: ~500ms
- Correlations fetch: ~200ms
- Patterns fetch: ~100ms
- **Total**: ~800ms per 10-second cycle

**Browser:**
- Rendering: ~200ms
- Event listeners: ~50ms
- **Total**: ~250ms per update

**API Load:**
- Requests per minute: 6 (at 10-second interval)
- Requests per hour: 360
- Per day: ~8,640 requests

## Monitoring Real-Time Updates

### Browser Console Logs
```javascript
// When starting TenantGuard
🚀 Starting TenantGuard with real-time updates (every 10 seconds)

// On each successful update
📡 Fetching real-time data from backend...
✅ Loaded 15 real alerts
✅ Loaded 3 correlations
✅ Loaded 5 patterns

// On errors
Failed to fetch alerts: <error message>
⚠️ No real alerts, using demo data
```

### Dashboard Indicators
- **🟢 LIVE** - Data is current (updated within last 10 seconds)
- **⏳ Updating...** - Refresh in progress
- **Timestamp** - Exact time of last update
- **Update counter** - How many refreshes have occurred

## Troubleshooting

### "No real alerts, using demo data"
**Cause:** Backend is returning no alerts (normal initially)
**Solution:** 
- Check backend is running (`npm run dev`)
- Verify audit collection job is running
- Check backend logs for errors

### "Failed to fetch alerts"
**Cause:** Network error or backend unreachable
**Solution:**
- Verify backend URL is correct
- Check CORS headers
- Verify network connectivity
- Check backend server status

### Updates stopping
**Cause:** Unhandled error in refresh cycle
**Solution:**
- Check browser console for errors
- Restart TenantGuard page
- Check backend health: `GET /health`

### High CPU usage
**Cause:** Too frequent updates or large data sets
**Solution:**
- Increase REFRESH_INTERVAL to 30+ seconds
- Reduce alert limit to 50
- Check browser performance tab
- Verify backend isn't slow

## Advanced Configuration

### Custom Refresh Logic
```javascript
// Skip refresh if no new data in past 5 minutes
let lastDataChangeTime = Date.now()

const enhancedRefreshData = async () => {
  const oldData = JSON.stringify(allAlerts)
  await refreshData()
  const newData = JSON.stringify(allAlerts)
  
  if (oldData !== newData) {
    lastDataChangeTime = Date.now()
  }
}
```

### Slack/Email Notifications
```javascript
// Alert on critical P0 alerts
if (newAlerts.some(a => a.priority === 'P0')) {
  sendNotification({
    channel: 'security-alerts',
    message: 'P0 Alert Detected!',
    data: newAlerts.filter(a => a.priority === 'P0')
  })
}
```

### Real-Time WebSocket (Future)
```javascript
// When WebSocket API is available:
const ws = new WebSocket('wss://api.example.com/tenantguard/live')
ws.onmessage = (event) => {
  const update = JSON.parse(event.data)
  allAlerts = update.alerts
  renderContent(el)
}
```

## User Experience

### What Users See

**Initial Load:**
- ⏳ "Loading TenantGuard (Real-Time)..." spinner
- Backend fetches latest data
- Dashboard renders with current threats

**Continuous Monitoring:**
- 🟢 LIVE indicator shows data is fresh
- Every 10 seconds: silent background update
- Last updated: timestamp updates
- New alerts appear automatically
- Risk gauge updates in real-time

**During Update:**
- ⏳ "Updating..." status briefly shown
- Refresh button disabled
- No interruption to viewing data
- Non-blocking update

**Manual Refresh:**
- Click [↻ Refresh] button
- Status: "Refreshing real-time data..."
- Toast: "✅ Data refreshed (42 updates)" when complete

## Best Practices

### For Security Teams
1. **Monitor dashboard regularly** - Check every hour minimum
2. **React to P0 alerts** - Respond within 5 minutes
3. **Review correlations** - Understand attack patterns
4. **Track update count** - Indicates system health

### For Administrators
1. **Set reasonable update interval** - 10-30 seconds is typical
2. **Monitor backend performance** - Ensure API response time < 1 second
3. **Archive old alerts** - Keep database lean
4. **Test failure modes** - Verify demo data fallback works

### For DevOps
1. **Scale backend API** - Handle 6+ requests/min
2. **Monitor database** - Ensure query performance
3. **Enable caching** - Cache alert summaries for 5-10 seconds
4. **Set up alerts** - Monitor API latency and error rates

## Conclusion

TenantGuard now provides **true real-time visibility** into threats in your Microsoft 365 environment. The 10-second update cycle ensures security administrators see threats within seconds of detection, enabling rapid incident response.

**Current Configuration:**
✅ 10-second polling interval
✅ Parallel API fetches
✅ Live status indicators
✅ Demo data fallback
✅ Real-time updates active

**To customize:** Edit `pages/tenantguard.js` or adjust backend API response times.
