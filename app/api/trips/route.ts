import { NextResponse } from 'next/server';
import { createTrip } from '@/lib/airtable-helpers';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.rider || !body.date) {
      return NextResponse.json(
        { error: 'Rider and date are required' },
        { status: 400 }
      );
    }

    const trip = await createTrip(body);
    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    );
  }
}
