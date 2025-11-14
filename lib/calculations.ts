import { differenceInMinutes, parse, format, parseISO } from 'date-fns';
import { Trip, DailySummary, PerformanceMetrics, TripWithDetails, DayPerformance } from '@/types';

// Constants for scoring
const PUNCTUALITY_THRESHOLD = '08:30'; // 8:30 AM reporting time
const ON_TIME_THRESHOLD_MINS = 5; // 5 minutes grace period for deliveries
const AVAILABILITY_THRESHOLD_MINS = 5; // 5 minutes grace period for pickup arrival

/**
 * Calculate availability score for a trip
 * Based on how early/late the rider arrived for pickup
 */
export function calculateAvailabilityScore(pickupTime?: string, arrivalTime?: string): number {
  if (!pickupTime || !arrivalTime) return 5; // Neutral score if data missing

  const pickup = parseISO(pickupTime);
  const arrival = parseISO(arrivalTime);
  const diffMins = differenceInMinutes(arrival, pickup);

  // Perfect score if arrived early or within threshold
  if (diffMins <= AVAILABILITY_THRESHOLD_MINS) return 10;

  // Deduct points for lateness
  if (diffMins <= 10) return 9;
  if (diffMins <= 15) return 8;
  if (diffMins <= 20) return 7;
  if (diffMins <= 30) return 6;
  return 5; // More than 30 mins late
}

/**
 * Calculate on-time delivery score
 * Based on expected vs actual delivery time
 */
export function calculateOnTimeScore(
  pickupTime?: string,
  deliveryTime?: string,
  expectedDeliveryMins?: number
): number {
  if (!pickupTime || !deliveryTime || !expectedDeliveryMins) return 5;

  const pickup = parseISO(pickupTime);
  const delivery = parseISO(deliveryTime);
  const actualDeliveryMins = differenceInMinutes(delivery, pickup);
  const diffFromExpected = actualDeliveryMins - expectedDeliveryMins;

  // Perfect score if within threshold
  if (Math.abs(diffFromExpected) <= ON_TIME_THRESHOLD_MINS) return 10;

  // Early delivery is good
  if (diffFromExpected < 0) {
    if (diffFromExpected >= -10) return 9.5;
    if (diffFromExpected >= -15) return 9;
    return 8.5;
  }

  // Late delivery - deduct points
  if (diffFromExpected <= 10) return 9;
  if (diffFromExpected <= 15) return 8;
  if (diffFromExpected <= 20) return 7;
  if (diffFromExpected <= 30) return 6;
  return 5; // More than 30 mins late
}

/**
 * Calculate individual trip score
 */
export function calculateTripScore(trip: Trip): number {
  const availabilityScore = calculateAvailabilityScore(trip.pickupTime, trip.arrivalTime);
  const onTimeScore = calculateOnTimeScore(
    trip.pickupTime,
    trip.deliveryTimeCustomer || trip.deliveryTimeRider,
    trip.expectedDeliveryTime
  );

  // Customer confirmation bonus
  const confirmationBonus = trip.customerConfirmed ? 0.5 : 0;

  // Weighted average: 40% availability, 60% on-time delivery
  const baseScore = (availabilityScore * 0.4) + (onTimeScore * 0.6);
  return Math.min(10, baseScore + confirmationBonus);
}

/**
 * Check if reporting time is before 8:30 AM
 */
export function isPunctual(reportingTime?: string): boolean {
  if (!reportingTime) return false;

  try {
    const timeStr = reportingTime.includes('T')
      ? format(parseISO(reportingTime), 'HH:mm')
      : reportingTime;

    return timeStr <= PUNCTUALITY_THRESHOLD;
  } catch (error) {
    return false;
  }
}

/**
 * Calculate performance metrics for a rider in a period
 */
export function calculatePerformanceMetrics(
  trips: Trip[],
  dailySummaries: DailySummary[],
  startDate: string,
  endDate: string,
  riderName: string,
  zoneMap: Map<string, string>
): PerformanceMetrics {
  // Calculate trip scores
  const tripsWithScores: TripWithDetails[] = trips.map(trip => ({
    ...trip,
    availabilityScore: calculateAvailabilityScore(trip.pickupTime, trip.arrivalTime),
    onTimeScore: calculateOnTimeScore(
      trip.pickupTime,
      trip.deliveryTimeCustomer || trip.deliveryTimeRider,
      trip.expectedDeliveryTime
    ),
    tripScore: calculateTripScore(trip),
    pickupZoneName: trip.pickupLocation?.[0] ? zoneMap.get(trip.pickupLocation[0]) : undefined,
    deliveryZoneName: trip.deliveryLocation?.[0] ? zoneMap.get(trip.deliveryLocation[0]) : undefined,
  }));

  // Calculate average ride score
  const averageRideScore = tripsWithScores.length > 0
    ? tripsWithScores.reduce((sum, trip) => sum + trip.tripScore!, 0) / tripsWithScores.length
    : 0;

  // Group trips by day
  const tripsByDay = new Map<string, TripWithDetails[]>();
  tripsWithScores.forEach(trip => {
    const date = trip.date;
    if (!tripsByDay.has(date)) {
      tripsByDay.set(date, []);
    }
    tripsByDay.get(date)!.push(trip);
  });

  // Calculate daily scores
  const dayPerformances: DayPerformance[] = Array.from(tripsByDay.entries()).map(([date, dayTrips]) => {
    const dailySummary = dailySummaries.find(s => s.date === date);
    const avgScore = dayTrips.reduce((sum, t) => sum + t.tripScore!, 0) / dayTrips.length;

    return {
      date,
      trips: dayTrips,
      score: avgScore,
      punctual: dailySummary ? isPunctual(dailySummary.reportingTime) : false,
      reportingTime: dailySummary?.reportingTime,
    };
  });

  // Find top day
  const topDayPerformance = dayPerformances.reduce((best, current) =>
    current.score > best.score ? current : best
  , dayPerformances[0] || { date: startDate, score: 0, trips: [], punctual: false });

  // Calculate punctuality
  const punctualDays = dayPerformances.filter(d => d.punctual).length;
  const totalDays = dayPerformances.length;

  // Calculate most frequent zone
  const zoneFrequency = new Map<string, number>();
  tripsWithScores.forEach(trip => {
    const pickupZone = trip.pickupZoneName;
    const deliveryZone = trip.deliveryZoneName;

    if (pickupZone) {
      zoneFrequency.set(pickupZone, (zoneFrequency.get(pickupZone) || 0) + 1);
    }
    if (deliveryZone) {
      zoneFrequency.set(deliveryZone, (zoneFrequency.get(deliveryZone) || 0) + 1);
    }
  });

  const mostFrequentZone = Array.from(zoneFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([zone]) => zone)
    .join(' / ') || 'N/A';

  // Calculate overall rating (combination of all factors)
  const punctualityScore = punctualDays / Math.max(totalDays, 1);
  const overallRating = (averageRideScore * 0.7) + (punctualityScore * 10 * 0.3);

  return {
    workPeriod: `${format(parseISO(startDate), 'dd/MM/yyyy')} – ${format(parseISO(endDate), 'dd/MM/yyyy')}`,
    averageRideScore: Math.round(averageRideScore * 10) / 10,
    totalTrips: trips.length,
    topDay: {
      date: topDayPerformance.date ? format(parseISO(topDayPerformance.date), 'dd/MM/yyyy') : 'N/A',
      score: Math.round(topDayPerformance.score * 10) / 10,
    },
    mostFrequentZone,
    punctuality: {
      isPunctual: punctualDays === totalDays && totalDays > 0,
      reportsBefore830: punctualDays === totalDays && totalDays > 0,
      punctualDaysCount: punctualDays,
      totalDays,
    },
    availability: {
      isActive: totalDays >= 5, // Active if worked at least 5 days
      activeDays: totalDays,
      totalWorkdays: 6, // Assuming 6 workdays per week
    },
    overallRating: Math.round(overallRating * 10) / 10,
  };
}

/**
 * Calculate distance between zones
 * This is a placeholder - in production, you'd use actual coordinates
 * or integrate with a mapping API
 */
export function calculateDistance(
  pickupZone?: string,
  deliveryZone?: string,
  defaultDistance?: number
): number {
  // Use default distance if provided
  if (defaultDistance) return defaultDistance;

  // Fallback distance calculations based on zone names
  // This is simplified - you should use actual coordinates or API
  return 10; // Default 10km
}
