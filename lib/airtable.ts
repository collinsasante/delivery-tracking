import Airtable from 'airtable';

// Initialize Airtable
const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  throw new Error('Missing Airtable credentials in environment variables');
}

const base = new Airtable({ apiKey }).base(baseId);

// Table references
export const tables = {
  riders: base(process.env.NEXT_PUBLIC_AIRTABLE_RIDERS_TABLE || 'Riders'),
  zones: base(process.env.NEXT_PUBLIC_AIRTABLE_ZONES_TABLE || 'Zones'),
  trips: base(process.env.NEXT_PUBLIC_AIRTABLE_TRIPS_TABLE || 'Trips'),
  dailySummaries: base(process.env.NEXT_PUBLIC_AIRTABLE_DAILY_SUMMARIES_TABLE || 'Daily Summaries'),
  periods: base(process.env.NEXT_PUBLIC_AIRTABLE_PERIODS_TABLE || 'Periods / Reports'),
};

export default base;
