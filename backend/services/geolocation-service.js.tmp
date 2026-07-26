/**
 * Geolocation Service
 * Converts IP addresses to geographic coordinates (latitude/longitude)
 * Supports multiple geolocation data sources
 */

import geoip from 'geoip-lite'

let geoIpDatabase = null
const CACHE_SIZE = 10000
const locationCache = new Map()
const failureCache = new Set()

/**
 * Initialize geolocation service
 */
export function initGeolocationService() {
  try {
    // geoip-lite is loaded at require time
    console.log('✓ Geolocation service initialized (using geoip-lite)')
    return true
  } catch (error) {
    console.error('✗ Failed to initialize geolocation service:', error.message)
    return false
  }
}

/**
 * Get coordinates for an IP address
 * Returns { latitude, longitude, location, country, city, timezone } or null
 */
export function getCoordinatesByIP(ipAddress) {
  if (!ipAddress || typeof ipAddress !== 'string') {
    return null
  }

  // Check cache first
  if (locationCache.has(ipAddress)) {
    return locationCache.get(ipAddress)
  }

  // Skip if we already know this IP has no data
  if (failureCache.has(ipAddress)) {
    return null
  }

  try {
    const geo = geoip.lookup(ipAddress)

    if (!geo) {
      failureCache.add(ipAddress)
      return null
    }

    // Extract coordinates
    const location = {
      latitude: geo.ll?.[0],
      longitude: geo.ll?.[1],
      location: `${geo.city || 'Unknown'}, ${geo.country || ''}`.trim(),
      city: geo.city || 'Unknown',
      country: geo.country || 'Unknown',
      timezone: geo.timezone || 'Unknown',
      ipAddress: ipAddress,
      timestamp: new Date().toISOString()
    }

    // Cache the result
    cacheLocation(ipAddress, location)
    return location
  } catch (error) {
    console.error(`Error looking up IP ${ipAddress}:`, error.message)
    failureCache.add(ipAddress)
    return null
  }
}

/**
 * Enrich sign-in logs with geolocation data
 */
export function enrichSignInLogsWithGeolocation(signInLogs) {
  if (!signInLogs || !Array.isArray(signInLogs)) {
    return signInLogs
  }

  return signInLogs.map(log => {
    // Skip if already has coordinates
    if (log.latitude && log.longitude) {
      return log
    }

    // Try to get coordinates from IP
    if (log.ipAddress) {
      const geoData = getCoordinatesByIP(log.ipAddress)
      if (geoData) {
        return {
          ...log,
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          geoLocation: geoData.location,
          geoCity: geoData.city,
          geoCountry: geoData.country,
          geoTimezone: geoData.timezone
        }
      }
    }

    // If no IP data, try to parse location string
    if (log.location && !log.latitude) {
      const parsed = parseLocationString(log.location)
      if (parsed) {
        return {
          ...log,
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          geoLocation: parsed.location
        }
      }
    }

    return log
  })
}

/**
 * Parse location string to approximate coordinates
 * This is a fallback when IP geolocation isn't available
 */
export function parseLocationName(locationString) {
  return parseLocationString(locationString)
}

function parseLocationString(locationString) {
  if (!locationString) return null

  // Common location mappings (city -> coordinates)
  const locationMap = {
    'Seattle': { latitude: 47.6062, longitude: -122.3321 },
    'San Francisco': { latitude: 37.7749, longitude: -122.4194 },
    'New York': { latitude: 40.7128, longitude: -74.0060 },
    'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
    'Chicago': { latitude: 41.8781, longitude: -87.6298 },
    'Austin': { latitude: 30.2672, longitude: -97.7431 },
    'Boston': { latitude: 42.3601, longitude: -71.0589 },
    'Denver': { latitude: 39.7392, longitude: -104.9903 },
    'Atlanta': { latitude: 33.7490, longitude: -84.3880 },
    'Dallas': { latitude: 32.7767, longitude: -96.7970 },
    'Phoenix': { latitude: 33.4484, longitude: -112.0742 },
    'Portland': { latitude: 45.5152, longitude: -122.6784 },
    'London': { latitude: 51.5074, longitude: -0.1278 },
    'Paris': { latitude: 48.8566, longitude: 2.3522 },
    'Tokyo': { latitude: 35.6762, longitude: 139.6503 },
    'Sydney': { latitude: -33.8688, longitude: 151.2093 },
    'Toronto': { latitude: 43.6532, longitude: -79.3832 },
    'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
    'Singapore': { latitude: 1.3521, longitude: 103.8198 },
    'Hong Kong': { latitude: 22.3193, longitude: 114.1694 }
  }

  // Try exact match
  for (const [city, coords] of Object.entries(locationMap)) {
    if (locationString.includes(city)) {
      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        location: city
      }
    }
  }

  return null
}

/**
 * Cache location data with LRU eviction
 */
function cacheLocation(ipAddress, location) {
  if (locationCache.size >= CACHE_SIZE) {
    // Remove oldest entry (simple FIFO for now)
    const firstKey = locationCache.keys().next().value
    locationCache.delete(firstKey)
  }
  locationCache.set(ipAddress, location)
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    cachedLocations: locationCache.size,
    failedIPs: failureCache.size,
    cacheSize: CACHE_SIZE,
    hitRate: locationCache.size > 0
      ? `${Math.round((locationCache.size / (locationCache.size + failureCache.size)) * 100)}%`
      : 'N/A'
  }
}

/**
 * Clear caches
 */
export function clearCaches() {
  locationCache.clear()
  failureCache.clear()
  console.log('✓ Geolocation caches cleared')
}

/**
 * Batch enrich multiple sign-in logs
 */
export function batchEnrichSignInLogs(signInLogs) {
  if (!signInLogs || signInLogs.length === 0) {
    return signInLogs
  }

  const enrichedLogs = enrichSignInLogsWithGeolocation(signInLogs)

  // Count how many were enriched
  const enrichedCount = enrichedLogs.filter(log => log.latitude && log.longitude).length
  const stats = getCacheStats()

  console.log(`✓ Enriched ${enrichedCount}/${enrichedLogs.length} sign-in logs with geolocation data`)
  console.log(`  Cache stats: ${stats.cachedLocations} cached, ${stats.failedIPs} failed, ${stats.hitRate} hit rate`)

  return enrichedLogs
}

/**
 * Get location info for a specific IP (for debugging)
 */
export function getLocationInfo(ipAddress) {
  const geo = geoip.lookup(ipAddress)
  if (!geo) {
    return { error: 'Location not found for IP: ' + ipAddress }
  }

  return {
    ip: ipAddress,
    country: geo.country,
    city: geo.city,
    timezone: geo.timezone,
    latitude: geo.ll?.[0],
    longitude: geo.ll?.[1],
    location: `${geo.city || 'Unknown'}, ${geo.country || ''}`.trim()
  }
}

export default {
  initGeolocationService,
  getCoordinatesByIP,
  enrichSignInLogsWithGeolocation,
  getCacheStats,
  clearCaches,
  batchEnrichSignInLogs,
  getLocationInfo,
  parseLocationName
}
