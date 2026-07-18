# Sign-in Locations Map - Troubleshooting Guide

## Why the Map Isn't Showing Location Data

The Sign-in Locations Map feature is working correctly, but the map may show "Location data not available for this user" message. This is **normal** and happens because:

### 1. Graph API Doesn't Include Coordinates
**Root Cause**: Microsoft Graph API's sign-in logs endpoint doesn't always include latitude/longitude coordinates.

**What happens**:
- Sign-in events are recorded in audit logs
- Most logs include location names (city, region) but NOT GPS coordinates
- Map requires GPS coordinates (lat/long) to plot markers
- No coordinates = no markers on map

### 2. What Data IS Available
The Graph API provides:
- ✅ Timestamp of sign-in
- ✅ Location (city/region as text)
- ✅ Device information
- ✅ Application name
- ✅ Success/failure status
- ✅ Risk level
- ❌ **Latitude/Longitude coordinates**

### 3. Why Demo Works
Demo mode includes sample data with GPS coordinates:
- Seattle, WA: 47.6062, -122.3321
- San Francisco, CA: 37.7749, -122.4194
- New York, NY: 40.7128, -74.0060

This is why the map works perfectly in demo mode.

## How to Check if Map is Working

### Step 1: Open Browser Console
1. Press **F12** to open Developer Tools
2. Click the **Console** tab
3. Look for these messages:

**If coordinates available**:
```
📍 Map initialization: Found 3 of 10 logs with coordinates
✓ Leaflet loaded
✓ Sign-in map rendered with 3 locations
```

**If coordinates NOT available**:
```
📍 Map initialization: Found 0 of 10 logs with coordinates
⚠️ No logs with valid coordinates found. Available fields: timestamp, location, device, status, riskLevel
```

### Step 2: Check What Fields Are Available
If you see the warning message, note the available fields. The map needs:
- `latitude` (number)
- `longitude` (number)

If these fields don't exist, the Graph API isn't returning coordinates.

### Step 3: Test with Demo Data
1. Click **Demo Mode** if available
2. Map should immediately show 3-4 locations
3. If demo map works but real data doesn't → Issue is with data source

## Solutions to Get Location Data

### Option 1: IP Geolocation Enrichment
Enhance sign-in logs with IP-to-location conversion:
```javascript
// Pseudo-code
const ipGeoService = new IpGeoLocation()
signInLogs.forEach(log => {
  if (log.ipAddress && !log.latitude) {
    const coords = ipGeoService.getCoordinates(log.ipAddress)
    log.latitude = coords.lat
    log.longitude = coords.lon
  }
})
```

**Pros**:
- Works with existing Graph API data
- Covers most sign-in events

**Cons**:
- IP geolocation is approximate (city-level)
- Requires external service (GeoIP2, MaxMind, etc.)
- VPN/proxy masks real location

### Option 2: Azure Maps Integration
Use Azure Maps API to convert location names to coordinates:
```javascript
// Pseudo-code
const mapsClient = new AzureMapsClient(key)
signInLogs.forEach(async log => {
  if (log.location && !log.latitude) {
    const result = await mapsClient.searchAddress(log.location)
    if (result.position) {
      log.latitude = result.position.lat
      log.longitude = result.position.lon
    }
  }
})
```

**Pros**:
- Precise location conversion
- Handles ambiguous location names
- Microsoft-native solution

**Cons**:
- Requires Azure Maps subscription
- API rate limits
- Not real-time

### Option 3: Enhanced Sign-in Client
Update `user-investigation-client.js` to return enriched data:
```javascript
export async function getSignInLogs(userId, mail, from, to) {
  const logs = await graphClient.get(`/auditLogs/signIns`)
  
  // Enrich with location data
  return enrichLogsWithCoordinates(logs)
}

function enrichLogsWithCoordinates(logs) {
  return logs.map(log => ({
    ...log,
    latitude: extractLatitude(log),
    longitude: extractLongitude(log)
  }))
}
```

## Testing the Map

### Test 1: Demo Mode
```
1. Navigate to User Investigation
2. Select Demo Account
3. Map should show 3-4 colored markers
4. Click markers to see location details
5. All popups should display properly
```

**Expected Result**: ✅ Map renders with sample locations

### Test 2: Browser Console
```
1. Open browser console (F12)
2. Navigate to User Investigation
3. Select a real user account
4. Check console for map initialization messages
5. Note the coordinates count
```

**Expected Output**:
- If coordinates available: `Found X of Y logs with coordinates`
- If not available: `No logs with valid coordinates found`

### Test 3: HTML Element
```javascript
// In browser console
const mapEl = document.getElementById('signin-locations-map')
console.log('Map container:', mapEl)
console.log('Map content:', mapEl.innerHTML)
```

**What to look for**:
- Map element should exist
- If content is "Location data not available..." → No coordinates
- If content is empty gray box → Leaflet might be loading

## Current Limitations

### What Won't Work Yet
- ❌ Real-time location plotting (no coordinates in Graph API)
- ❌ Precise geographic visualization (city-level only)
- ❌ Offline location detection
- ❌ VPN/Proxy detection

### What Does Work
- ✅ Demo mode with sample locations
- ✅ Map UI and controls (zoom, pan, etc.)
- ✅ Leaflet library integration
- ✅ Error handling and messaging
- ✅ Future data enrichment support

## Recommended Workflow

### For Security Analysts (Until Enhanced)
1. ✅ Use sign-in table below map for detailed location info
2. ✅ Manually correlate locations with user activity timeline
3. ✅ Check device information for geographic indicators
4. ✅ Cross-reference with risk detection alerts

### For Admins (Enhancement)
1. Implement IP geolocation service
2. Add Azure Maps integration
3. Enrich Graph API data before rendering
4. Update user-investigation-client.js with new data

### For Developers
1. Add geolocation service to backend
2. Enrich sign-in logs in collection job
3. Update frontend data models
4. Test with various user data

## Future Roadmap

### Phase 1 (Current)
- [x] Map UI framework
- [x] Leaflet integration
- [x] Demo mode with coordinates
- [x] Error handling

### Phase 2 (Planned)
- [ ] IP geolocation enrichment
- [ ] Azure Maps integration
- [ ] Location name parsing
- [ ] Coordinate caching

### Phase 3 (Advanced)
- [ ] Heatmap visualization
- [ ] Anomalous location detection
- [ ] Travel time analysis
- [ ] Impossible travel alerts

## FAQ

### Q: Is the map broken?
**A**: No! The map is working correctly. It just doesn't have location coordinates from Graph API. This is expected.

### Q: Why does demo work but real data doesn't?
**A**: Demo data includes sample GPS coordinates. Real Graph API data typically doesn't include lat/long.

### Q: Can I add coordinates myself?
**A**: Yes! Update the Graph API response or create a data enrichment layer. See "Solutions" section.

### Q: Will this ever show real locations?
**A**: Yes, once coordinates are added via enrichment service. The map framework is ready to use them.

### Q: What's the best enrichment method?
**A**: IP geolocation is simplest. Azure Maps is most accurate. Combination of both is ideal.

## Support

For questions about the map:
1. Check browser console for debug messages
2. Run test steps above
3. Verify demo mode works
4. Review this troubleshooting guide
5. Check available fields in console output

## Related Documentation

- [USER_INVESTIGATION_MAP.md](USER_INVESTIGATION_MAP.md) - Feature overview
- [Graph API Sign-In Logs](https://learn.microsoft.com/en-us/graph/api/signin-list) - API documentation
- [Azure Maps Documentation](https://docs.microsoft.com/en-us/azure/azure-maps/) - Location services

---

**Remember**: The map is working as designed. It will display locations once coordinate data is available. Demo mode proves the functionality works perfectly!
