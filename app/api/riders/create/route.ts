import { NextResponse } from 'next/server';
import { tables } from '@/lib/airtable';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.riderId || !body.name) {
      return NextResponse.json(
        { error: 'Rider ID and name are required' },
        { status: 400 }
      );
    }

    const record = await tables.riders.create([
      {
        fields: {
          'Rider ID': body.riderId,
          'Name': body.name,
          'Phone': body.phone || undefined,
          'Zone': body.zone || undefined,
          'Active': body.active !== undefined ? body.active : true,
          'Joined Date': body.joinedDate || new Date().toISOString().split('T')[0],
        },
      },
    ]);

    const createdRecord = record[0];
    return NextResponse.json(
      {
        id: createdRecord.id,
        riderId: createdRecord.get('Rider ID'),
        name: createdRecord.get('Name'),
        phone: createdRecord.get('Phone'),
        zone: createdRecord.get('Zone'),
        active: createdRecord.get('Active'),
        joinedDate: createdRecord.get('Joined Date'),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating rider:', error);
    return NextResponse.json(
      { error: 'Failed to create rider' },
      { status: 500 }
    );
  }
}
