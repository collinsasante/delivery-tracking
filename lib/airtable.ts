import Airtable from 'airtable';

// Initialize Airtable
const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || '';
const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || '';

// Create a dummy base for build time (will be replaced at runtime)
const base = apiKey && baseId
  ? new Airtable({ apiKey }).base(baseId)
  : new Airtable({ apiKey: 'dummy' }).base('dummy');

// Helper function to get base with runtime validation
function getBase() {
  if (!apiKey || !baseId) {
    throw new Error('Missing Airtable credentials in environment variables');
  }
  return base;
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

export default base;
