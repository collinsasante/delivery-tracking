import { Zone } from '@/types';

/**
 * Calculate distance between two points using Haversine formula
 * This gives accurate distance based on GPS coordinates (latitude, longitude)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Parse coordinates string into lat/lon
 * Expected format: "5.6037,-0.1870" or "5.6037, -0.1870"
 */
export function parseCoordinates(coordString: string): { lat: number; lon: number } | null {
  if (!coordString) return null;

  const parts = coordString.split(',').map(s => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some(isNaN)) return null;

  return { lat: parts[0], lon: parts[1] };
}

/**
 * Calculate distance between two zones using their coordinates
 */
export function calculateZoneDistance(
  pickupZone: Zone | null,
  deliveryZone: Zone | null
): number | null {
  if (!pickupZone || !deliveryZone) return null;

  // Try to use coordinates if available
  if (pickupZone.coordinates && deliveryZone.coordinates) {
    const pickup = parseCoordinates(pickupZone.coordinates);
    const delivery = parseCoordinates(deliveryZone.coordinates);

    if (pickup && delivery) {
      return calculateHaversineDistance(
        pickup.lat,
        pickup.lon,
        delivery.lat,
        delivery.lon
      );
    }
  }

  // Fallback to default distance if no coordinates
  if (pickupZone.defaultDistance) {
    return pickupZone.defaultDistance;
  }

  return null;
}

/**
 * Pre-configured distance matrix for common Ghana routes (in km)
 * This is a fallback when coordinates are not available
 */
export const GHANA_DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  'Madina': {
    'Madina': 0,
    'Accra': 15,
    'Kasoa': 45,
    'Tema': 25,
    'Legon': 8,
    'Achimota': 12,
    'Kumasi': 250,
    'Takoradi': 220,
  },
  'Accra': {
    'Madina': 15,
    'Accra': 0,
    'Kasoa': 35,
    'Tema': 25,
    'Legon': 12,
    'Achimota': 8,
    'Kumasi': 245,
    'Takoradi': 200,
  },
  'Kasoa': {
    'Madina': 45,
    'Accra': 35,
    'Kasoa': 0,
    'Tema': 55,
    'Legon': 40,
    'Achimota': 30,
    'Kumasi': 220,
    'Takoradi': 180,
  },
  'Tema': {
    'Madina': 25,
    'Accra': 25,
    'Kasoa': 55,
    'Tema': 0,
    'Legon': 20,
    'Achimota': 30,
    'Kumasi': 270,
    'Takoradi': 225,
  },
  'Legon': {
    'Madina': 8,
    'Accra': 12,
    'Kasoa': 40,
    'Tema': 20,
    'Legon': 0,
    'Achimota': 10,
    'Kumasi': 248,
    'Takoradi': 212,
  },
  'Achimota': {
    'Madina': 12,
    'Accra': 8,
    'Kasoa': 30,
    'Tema': 30,
    'Legon': 10,
    'Achimota': 0,
    'Kumasi': 240,
    'Takoradi': 205,
  },
  'Kumasi': {
    'Madina': 250,
    'Accra': 245,
    'Kasoa': 220,
    'Tema': 270,
    'Legon': 248,
    'Achimota': 240,
    'Kumasi': 0,
    'Takoradi': 240,
  },
  'Takoradi': {
    'Madina': 220,
    'Accra': 200,
    'Kasoa': 180,
    'Tema': 225,
    'Legon': 212,
    'Achimota': 205,
    'Kumasi': 240,
    'Takoradi': 0,
  },
};

/**
 * Get distance from pre-configured matrix
 */
export function getDistanceFromMatrix(
  pickupZoneName: string,
  deliveryZoneName: string
): number | null {
  const pickup = GHANA_DISTANCE_MATRIX[pickupZoneName];
  if (!pickup) return null;

  const distance = pickup[deliveryZoneName];
  return distance !== undefined ? distance : null;
}

/**
 * Auto-calculate distance with fallback strategy:
 * 1. Try GPS coordinates (most accurate)
 * 2. Try distance matrix (pre-configured)
 * 3. Try default distance from pickup zone
 * 4. Return null if all fail
 */
export function autoCalculateDistance(
  pickupZone: Zone | null,
  deliveryZone: Zone | null
): number | null {
  if (!pickupZone || !deliveryZone) return null;

  // Same zone = 0 km
  if (pickupZone.id === deliveryZone.id) return 0;

  // Strategy 1: Use GPS coordinates
  const coordDistance = calculateZoneDistance(pickupZone, deliveryZone);
  if (coordDistance !== null) return coordDistance;

  // Strategy 2: Use distance matrix
  const matrixDistance = getDistanceFromMatrix(
    pickupZone.zoneName,
    deliveryZone.zoneName
  );
  if (matrixDistance !== null) return matrixDistance;

  // Strategy 3: Use default distance from pickup zone
  if (pickupZone.defaultDistance) return pickupZone.defaultDistance;

  // Strategy 4: Estimate based on zone names (very rough)
  // This is a last resort fallback
  return estimateDistanceByName(pickupZone.zoneName, deliveryZone.zoneName);
}

/**
 * Rough estimation based on zone names
 * This is a very basic fallback
 */
function estimateDistanceByName(pickup: string, delivery: string): number {
  // Check if both contain "Accra" - assume they're close
  if (pickup.includes('Accra') && delivery.includes('Accra')) return 10;

  // Check if both contain same major city name
  const cities = ['Kumasi', 'Takoradi', 'Tema', 'Cape Coast'];
  for (const city of cities) {
    if (pickup.includes(city) && delivery.includes(city)) return 15;
  }

  // Default to 20km for same region, 100km for different regions
  return 20;
}

/**
 * Calculate expected delivery time based on distance
 * Assumes average speed of 30 km/h in city traffic
 */
export function calculateExpectedDeliveryTime(distanceKm: number): number {
  const AVERAGE_SPEED_KMH = 30; // km/h in city traffic
  const BASE_TIME_MINS = 5; // Base time for pickup/handoff

  const travelTimeMins = (distanceKm / AVERAGE_SPEED_KMH) * 60;
  const totalMins = Math.ceil(travelTimeMins + BASE_TIME_MINS);

  return totalMins;
}
