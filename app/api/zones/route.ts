import { NextResponse } from 'next/server';
import { fetchZones } from '@/lib/airtable-helpers';

export const runtime = 'edge';

export async function GET() {
  try {
    const zones = await fetchZones();
    return NextResponse.json(zones);
  } catch (error) {
    console.error('Error fetching zones:', error);
    return NextResponse.json(
      { error: 'Failed to fetch zones' },
      { status: 500 }
    );
  }
}
