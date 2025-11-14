import Airtable from 'airtable';

// Helper function to get base with runtime validation
function getBase() {
  const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error('Missing Airtable credentials in environment variables');
  }

  return new Airtable({ apiKey }).base(baseId);
}

// Table references with lazy initialization
export const tables = {
  get riders() {
    return getBase()(process.env.NEXT_PUBLIC_AIRTABLE_RIDERS_TABLE || 'Riders');
  },
  get zones() {
    return getBase()(process.env.NEXT_PUBLIC_AIRTABLE_ZONES_TABLE || 'Zones');
  },
  get trips() {
    return getBase()(process.env.NEXT_PUBLIC_AIRTABLE_TRIPS_TABLE || 'Trips');
  },
  get dailySummaries() {
    return getBase()(process.env.NEXT_PUBLIC_AIRTABLE_DAILY_SUMMARIES_TABLE || 'Daily Summaries');
  },
  get periods() {
    return getBase()(process.env.NEXT_PUBLIC_AIRTABLE_PERIODS_TABLE || 'Periods / Reports');
  },
};

// Default export for backwards compatibility
export default getBase();
