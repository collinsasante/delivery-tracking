import { NextResponse } from 'next/server';
import { tables } from '@/lib/airtable';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.zoneName) {
      return NextResponse.json(
        { error: 'Zone name is required' },
        { status: 400 }
      );
    }

    const record = await tables.zones.create([
      {
        fields: {
          'Zone Name': body.zoneName,
          'Default Distance (km)': body.defaultDistance || undefined,
          'Coordinates': body.coordinates || undefined,
        },
      },
    ]);

    const createdRecord = record[0];
    return NextResponse.json(
      {
        id: createdRecord.id,
        zoneName: createdRecord.get('Zone Name'),
        defaultDistance: createdRecord.get('Default Distance (km)'),
        coordinates: createdRecord.get('Coordinates'),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating zone:', error);
    return NextResponse.json(
      { error: 'Failed to create zone' },
      { status: 500 }
    );
  }
}
