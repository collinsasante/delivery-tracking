# Delivery Rider Performance Tracking System

A comprehensive Next.js application built with TypeScript and Airtable to track and analyze delivery rider performance metrics.

## Features

- **Performance Analytics**: Calculate and display rider performance metrics including:
  - Average Ride Score (out of 10)
  - Total Trips
  - Top Performing Day
  - Most Frequent Zones
  - Punctuality Tracking
  - Availability Metrics
  - Overall Rating

- **Data Management**:
  - Easy-to-use forms for adding trips and daily summaries
  - Real-time data syncing with Airtable
  - Automatic score calculations

- **Professional Reports**:
  - Clean, professional performance reports
  - Period-based analysis
  - Visual progress indicators

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Airtable
- **Date Handling**: date-fns
- **Deployment**: Vercel-ready

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- An Airtable account
- Basic knowledge of Next.js and React

## Airtable Setup

### 1. Create Your Airtable Base

Create a new Airtable base with the following tables and fields:

#### **Riders Table**
- Rider ID (Single line text)
- Name (Single line text)
- Phone (Phone number)
- Zone (Link to Zones)
- Active (Checkbox)
- Joined Date (Date)
- Trips (Link to Trips)
- Daily Summaries (Link to Daily Summaries)
- Periods / Reports (Link to Periods / Reports)

#### **Zones Table**
- Zone Name (Single line text) - e.g., "Madina", "Kasoa", "Accra"
- Riders (Link to Riders)
- Default Distance (km) (Number)
- Coordinates (Single line text)
- Trips (Pickup Location) (Link to Trips)
- Trips (Delivery Location) (Link to Trips)

#### **Trips Table**
- Trip ID (Auto number)
- Rider (Link to Riders) *Required*
- Date (Date) *Required*
- Period (Single line text)
- Pickup Location (Link to Zones)
- Delivery Location (Link to Zones)
- Pickup Time (Date time)
- Arrival Time (Date time)
- Delivery Time (Rider) (Date time)
- Delivery Time (Customer Confirmed) (Date time)
- Distance (km) (Number)
- Expected Delivery Time (mins) (Number)
- Customer Confirmed (Checkbox)
- Notes (Long text)
- Daily Summaries (Link to Daily Summaries)

#### **Daily Summaries Table**
- Id (Auto number)
- Date (Date) *Required*
- Rider (Link to Riders) *Required*
- Reporting Time (Date time or Time)
- Trips (Link to Trips)
- Total Trips (daily) (Count from Trips)
- Punctual Days (Rollup)

#### **Periods / Reports Table**
- Period Name (Single line text)
- Start Date (Date)
- End Date (Date)
- Riders (Link to Riders)
- Average Period Score (Number)
- Export (Attachment)

### 2. Get Your Airtable Credentials

1. Go to [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
2. Click on your base
3. Copy your **Base ID** (starts with "app...")
4. Generate a **Personal Access Token**:
   - Go to [Airtable Account](https://airtable.com/create/tokens)
   - Create new token with the following scopes:
     - `data.records:read`
     - `data.records:write`
     - `schema.bases:read`
   - Add access to your specific base
   - Copy the generated token

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd delivery-tracking
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Airtable credentials:
   ```env
   NEXT_PUBLIC_AIRTABLE_API_KEY=your_personal_access_token_here
   NEXT_PUBLIC_AIRTABLE_BASE_ID=your_base_id_here

   # Table names (match your Airtable table names exactly)
   NEXT_PUBLIC_AIRTABLE_RIDERS_TABLE=Riders
   NEXT_PUBLIC_AIRTABLE_ZONES_TABLE=Zones
   NEXT_PUBLIC_AIRTABLE_TRIPS_TABLE=Trips
   NEXT_PUBLIC_AIRTABLE_DAILY_SUMMARIES_TABLE=Daily Summaries
   NEXT_PUBLIC_AIRTABLE_PERIODS_TABLE=Periods / Reports
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Adding Data

1. Click the **"Add Data"** button on the main dashboard
2. Choose between:
   - **Add Trip**: Record individual delivery trips with all details
   - **Add Daily Summary**: Record daily reporting times for punctuality tracking

#### Adding a Trip
Fill in the following information:
- Select the rider
- Set the trip date
- Choose pickup and delivery locations (zones)
- **Distance & Time Auto-Calculation**: When you select both zones, the system automatically calculates:
  - Distance in kilometers (based on GPS coordinates or pre-configured matrix)
  - Expected delivery time in minutes (based on 30 km/h average speed)
  - You can edit these values if needed
- Enter pickup time and actual arrival time (for availability scoring)
- Enter delivery times (both rider-reported and customer-confirmed)
- Check "Customer Confirmed" if verified
- Add any notes

#### Adding a Daily Summary
- Select the rider
- Set the date
- Enter the reporting time (punctuality threshold: 8:30 AM)

### Viewing Performance Reports

1. On the main dashboard, select a rider from the dropdown
2. Choose a date range (start and end dates)
3. Click **"Generate Performance Report"**
4. View the comprehensive performance metrics including:
   - Average Ride Score
   - Total Trips
   - Top Day with score
   - Most Frequent Zones
   - Punctuality status
   - Availability status
   - Overall Rating

## Scoring System

### Trip Score Calculation (out of 10)

The system calculates individual trip scores based on:

1. **Availability Score (40% weight)**:
   - 10 points: Arrived on time or early (within 5 mins)
   - 9 points: 5-10 mins late
   - 8 points: 10-15 mins late
   - 7 points: 15-20 mins late
   - 6 points: 20-30 mins late
   - 5 points: More than 30 mins late

2. **On-Time Delivery Score (60% weight)**:
   - 10 points: Delivered within expected time (±5 mins)
   - 9-9.5 points: Delivered early (up to 15 mins)
   - 9 points: 5-10 mins late
   - 8 points: 10-15 mins late
   - 7 points: 15-20 mins late
   - 6 points: 20-30 mins late
   - 5 points: More than 30 mins late

3. **Customer Confirmation Bonus**: +0.5 points if confirmed

### Overall Rating Calculation

The overall rating combines:
- 70% Average Ride Score
- 30% Punctuality Score (percentage of days reporting before 8:30 AM × 10)

### Punctuality

- ✅ Punctual: Reporting time before 8:30 AM
- ⚠️ Late: Reporting time after 8:30 AM

### Availability

- ✅ Active: Worked 5+ days in the period
- ⚠️ Inconsistent: Worked fewer than 5 days

## Project Structure

```
delivery-tracking/
├── app/
│   ├── api/
│   │   ├── riders/          # Rider API endpoints
│   │   ├── zones/           # Zone API endpoints
│   │   ├── trips/           # Trip creation endpoint
│   │   └── daily-summaries/ # Daily summary endpoint
│   ├── input/               # Data input page
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard
├── components/
│   ├── DateRangePicker.tsx  # Date range selector
│   ├── PerformanceReport.tsx # Performance report display
│   └── RiderSelector.tsx    # Rider dropdown selector
├── lib/
│   ├── airtable.ts          # Airtable configuration
│   ├── airtable-helpers.ts  # Data fetching functions
│   └── calculations.ts      # Score calculation logic
├── types/
│   └── index.ts             # TypeScript type definitions
└── .env.local               # Environment variables (create this)
```

## API Routes

### GET `/api/riders`
Fetch all riders from Airtable

### GET `/api/riders/[id]/performance`
Calculate performance metrics for a specific rider
- Query params: `startDate`, `endDate`

### GET `/api/zones`
Fetch all delivery zones

### POST `/api/trips`
Create a new trip record

### POST `/api/daily-summaries`
Create a new daily summary record

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. Configure environment variables in Vercel:
   - Add all variables from `.env.local`
   - Make sure to use the same variable names

4. Deploy!

### Environment Variables for Production

Remember to set these in your deployment platform:
- `NEXT_PUBLIC_AIRTABLE_API_KEY`
- `NEXT_PUBLIC_AIRTABLE_BASE_ID`
- `NEXT_PUBLIC_AIRTABLE_RIDERS_TABLE`
- `NEXT_PUBLIC_AIRTABLE_ZONES_TABLE`
- `NEXT_PUBLIC_AIRTABLE_TRIPS_TABLE`
- `NEXT_PUBLIC_AIRTABLE_DAILY_SUMMARIES_TABLE`
- `NEXT_PUBLIC_AIRTABLE_PERIODS_TABLE`

## Troubleshooting

### "Failed to load riders" Error
- Check that your Airtable API key is correct
- Verify your Base ID is accurate
- Ensure your table names match exactly (case-sensitive)
- Confirm your Personal Access Token has the correct scopes

### No Data Appearing
- Verify you have created records in Airtable
- Check that linked records are properly connected
- Ensure date formats are correct (YYYY-MM-DD for dates)

### Calculation Errors
- Ensure all time fields use datetime format in Airtable
- Verify pickup times are before delivery times
- Check that expected delivery times are reasonable (in minutes)

## Future Enhancements

Potential features to add:
- [ ] PDF report generation
- [ ] Email notifications for low performance
- [ ] Real-time GPS tracking integration
- [ ] Mobile app for riders
- [ ] Advanced analytics and charts
- [ ] Multi-language support
- [ ] Export to Excel/CSV
- [ ] Automated period report generation

## Contributing

This is a custom project. If you'd like to contribute or suggest improvements, feel free to fork and submit pull requests.

## License

This project is licensed for use with your delivery tracking needs.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Airtable API documentation
3. Check Next.js documentation for framework-specific issues

---

Built with ❤️ using Next.js, TypeScript, and Airtable
