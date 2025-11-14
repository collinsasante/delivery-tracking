import { NextResponse } from 'next/server';
import { fetchRiders } from '@/lib/airtable-helpers';

export async function GET() {
  try {
    const riders = await fetchRiders();
    return NextResponse.json(riders);
  } catch (error) {
    console.error('Error fetching riders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch riders' },
      { status: 500 }
    );
  }
}
