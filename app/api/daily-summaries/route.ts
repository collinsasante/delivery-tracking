import { NextResponse } from 'next/server';
import { createDailySummary } from '@/lib/airtable-helpers';

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

    const summary = await createDailySummary(body);
    return NextResponse.json(summary, { status: 201 });
  } catch (error) {
    console.error('Error creating daily summary:', error);
    return NextResponse.json(
      { error: 'Failed to create daily summary' },
      { status: 500 }
    );
  }
}
