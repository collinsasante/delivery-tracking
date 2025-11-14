import { NextResponse } from 'next/server';
import {
  fetchRider,
  fetchTripsForRider,
  fetchDailySummariesForRider,
  fetchZones,
} from '@/lib/airtable-helpers';
import { calculatePerformanceMetrics } from '@/lib/calculations';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Fetch rider data
    const rider = await fetchRider(id);
    if (!rider) {
      return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
    }

    // Fetch trips and daily summaries
    const [trips, dailySummaries, zones] = await Promise.all([
      fetchTripsForRider(id, startDate, endDate),
      fetchDailySummariesForRider(id, startDate, endDate),
      fetchZones(),
    ]);

    // Create zone map for lookup
    const zoneMap = new Map(zones.map(z => [z.id, z.zoneName]));

    // Calculate performance metrics
    const metrics = calculatePerformanceMetrics(
      trips,
      dailySummaries,
      startDate,
      endDate,
      rider.name,
      zoneMap
    );

    return NextResponse.json({
      rider: {
        id: rider.id,
        name: rider.name,
        riderId: rider.riderId,
      },
      metrics,
      trips,
      dailySummaries,
    });
  } catch (error) {
    console.error('Error calculating performance:', error);
    return NextResponse.json(
      { error: 'Failed to calculate performance metrics' },
      { status: 500 }
    );
  }
}
