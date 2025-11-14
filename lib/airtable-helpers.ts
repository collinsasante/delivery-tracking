import { tables } from './airtable';
import { Rider, Zone, Trip, DailySummary, PeriodReport } from '@/types';

// Fetch all riders
export async function fetchRiders(): Promise<Rider[]> {
  const records = await tables.riders.select().all();
  return records.map(record => ({
    id: record.id,
    riderId: record.get('Rider ID') as string,
    name: record.get('Name') as string,
    phone: record.get('Phone') as string,
    zone: record.get('Zone') as string[] | undefined,
    active: record.get('Active') as boolean,
    joinedDate: record.get('Joined Date') as string,
    trips: record.get('Trips') as string[] | undefined,
    dailySummaries: record.get('Daily Summaries') as string[] | undefined,
    periods: record.get('Periods / Reports') as string[] | undefined,
  }));
}

// Fetch single rider by ID
export async function fetchRider(riderId: string): Promise<Rider | null> {
  try {
    const record = await tables.riders.find(riderId);
    return {
      id: record.id,
      riderId: record.get('Rider ID') as string,
      name: record.get('Name') as string,
      phone: record.get('Phone') as string,
      zone: record.get('Zone') as string[] | undefined,
      active: record.get('Active') as boolean,
      joinedDate: record.get('Joined Date') as string,
      trips: record.get('Trips') as string[] | undefined,
      dailySummaries: record.get('Daily Summaries') as string[] | undefined,
      periods: record.get('Periods / Reports') as string[] | undefined,
    };
  } catch (error) {
    console.error('Error fetching rider:', error);
    return null;
  }
}

// Fetch all zones
export async function fetchZones(): Promise<Zone[]> {
  const records = await tables.zones.select().all();
  return records.map(record => ({
    id: record.id,
    zoneName: record.get('Zone Name') as string,
    riders: record.get('Riders') as string[] | undefined,
    defaultDistance: record.get('Default Distance (km)') as number | undefined,
    coordinates: record.get('Coordinates') as string | undefined,
    tripsPickup: record.get('Trips (Pickup Location)') as string[] | undefined,
    tripsDelivery: record.get('Trips (Delivery Location)') as string[] | undefined,
  }));
}

// Fetch trips for a specific rider and period
export async function fetchTripsForRider(
  riderId: string,
  startDate: string,
  endDate: string
): Promise<Trip[]> {
  const formula = `AND(
    {Rider} = '${riderId}',
    IS_AFTER({Date}, '${startDate}'),
    IS_BEFORE({Date}, '${endDate}')
  )`;

  const records = await tables.trips
    .select({
      filterByFormula: formula,
      sort: [{ field: 'Date', direction: 'asc' }],
    })
    .all();

  return records.map(record => ({
    id: record.id,
    tripId: record.get('Trip ID') as number,
    rider: record.get('Rider') as string[],
    date: record.get('Date') as string,
    period: record.get('Period') as string | undefined,
    pickupLocation: record.get('Pickup Location') as string[] | undefined,
    deliveryLocation: record.get('Delivery Location') as string[] | undefined,
    pickupTime: record.get('Pickup Time') as string | undefined,
    arrivalTime: record.get('Arrival Time') as string | undefined,
    deliveryTimeRider: record.get('Delivery Time (Rider)') as string | undefined,
    deliveryTimeCustomer: record.get('Delivery Time (Customer Confirmed)') as string | undefined,
    distance: record.get('Distance (km)') as number | undefined,
    expectedDeliveryTime: record.get('Expected Delivery Time (mins)') as number | undefined,
    customerConfirmed: record.get('Customer Confirmed') as boolean | undefined,
    notes: record.get('Notes') as string | undefined,
    dailySummaries: record.get('Daily Summaries') as string[] | undefined,
  }));
}

// Fetch daily summaries for a rider in a period
export async function fetchDailySummariesForRider(
  riderId: string,
  startDate: string,
  endDate: string
): Promise<DailySummary[]> {
  const formula = `AND(
    {Rider} = '${riderId}',
    IS_AFTER({Date}, '${startDate}'),
    IS_BEFORE({Date}, '${endDate}')
  )`;

  const records = await tables.dailySummaries
    .select({
      filterByFormula: formula,
      sort: [{ field: 'Date', direction: 'asc' }],
    })
    .all();

  return records.map(record => ({
    id: record.id,
    summaryId: record.get('Id') as number,
    date: record.get('Date') as string,
    rider: record.get('Rider') as string[],
    trips: record.get('Trips') as string[] | undefined,
    totalTrips: record.get('Total Trips (daily)') as number | undefined,
    punctualDays: record.get('Punctual Days') as number | undefined,
    reportingTime: record.get('Reporting Time') as string | undefined,
  }));
}

// Create a new trip
export async function createTrip(tripData: Partial<Trip>): Promise<Trip> {
  const record = await tables.trips.create([
    {
      fields: {
        'Rider': tripData.rider,
        'Date': tripData.date,
        'Period': tripData.period,
        'Pickup Location': tripData.pickupLocation,
        'Delivery Location': tripData.deliveryLocation,
        'Pickup Time': tripData.pickupTime,
        'Arrival Time': tripData.arrivalTime,
        'Delivery Time (Rider)': tripData.deliveryTimeRider,
        'Delivery Time (Customer Confirmed)': tripData.deliveryTimeCustomer,
        'Distance (km)': tripData.distance,
        'Expected Delivery Time (mins)': tripData.expectedDeliveryTime,
        'Customer Confirmed': tripData.customerConfirmed,
        'Notes': tripData.notes,
      },
    },
  ]);

  const createdRecord = record[0];
  return {
    id: createdRecord.id,
    tripId: createdRecord.get('Trip ID') as number,
    rider: createdRecord.get('Rider') as string[],
    date: createdRecord.get('Date') as string,
    period: createdRecord.get('Period') as string | undefined,
    pickupLocation: createdRecord.get('Pickup Location') as string[] | undefined,
    deliveryLocation: createdRecord.get('Delivery Location') as string[] | undefined,
    pickupTime: createdRecord.get('Pickup Time') as string | undefined,
    arrivalTime: createdRecord.get('Arrival Time') as string | undefined,
    deliveryTimeRider: createdRecord.get('Delivery Time (Rider)') as string | undefined,
    deliveryTimeCustomer: createdRecord.get('Delivery Time (Customer Confirmed)') as string | undefined,
    distance: createdRecord.get('Distance (km)') as number | undefined,
    expectedDeliveryTime: createdRecord.get('Expected Delivery Time (mins)') as number | undefined,
    customerConfirmed: createdRecord.get('Customer Confirmed') as boolean | undefined,
    notes: createdRecord.get('Notes') as string | undefined,
    dailySummaries: createdRecord.get('Daily Summaries') as string[] | undefined,
  };
}

// Create a daily summary
export async function createDailySummary(summaryData: Partial<DailySummary>): Promise<DailySummary> {
  const record = await tables.dailySummaries.create([
    {
      fields: {
        'Date': summaryData.date,
        'Rider': summaryData.rider,
        'Reporting Time': summaryData.reportingTime,
      },
    },
  ]);

  const createdRecord = record[0];
  return {
    id: createdRecord.id,
    summaryId: createdRecord.get('Id') as number,
    date: createdRecord.get('Date') as string,
    rider: createdRecord.get('Rider') as string[],
    trips: createdRecord.get('Trips') as string[] | undefined,
    totalTrips: createdRecord.get('Total Trips (daily)') as number | undefined,
    punctualDays: createdRecord.get('Punctual Days') as number | undefined,
    reportingTime: createdRecord.get('Reporting Time') as string | undefined,
  };
}

// Fetch zone by ID
export async function fetchZone(zoneId: string): Promise<Zone | null> {
  try {
    const record = await tables.zones.find(zoneId);
    return {
      id: record.id,
      zoneName: record.get('Zone Name') as string,
      riders: record.get('Riders') as string[] | undefined,
      defaultDistance: record.get('Default Distance (km)') as number | undefined,
      coordinates: record.get('Coordinates') as string | undefined,
      tripsPickup: record.get('Trips (Pickup Location)') as string[] | undefined,
      tripsDelivery: record.get('Trips (Delivery Location)') as string[] | undefined,
    };
  } catch (error) {
    console.error('Error fetching zone:', error);
    return null;
  }
}
