# Testing Guide - Delivery Rider Performance Tracking System

This guide will walk you through testing all features of the application.

## Prerequisites

Before testing, ensure:
1. ✅ Airtable base is set up with all required tables
2. ✅ Environment variables are configured in `.env.local`
3. ✅ Development server is running (`npm run dev`)
4. ✅ Browser is open at `http://localhost:3000`

## Testing Checklist

### Phase 1: Initial Setup & Data Entry

#### Step 1: Add Zones (in Airtable)
Since there's no UI for zones yet, add them directly in Airtable:

1. Open your Airtable base
2. Go to the **Zones** table
3. Add at least 3 zones manually:
   ```
   Zone Name: Madina
   Default Distance (km): 15

   Zone Name: Kasoa
   Default Distance (km): 25

   Zone Name: Accra
   Default Distance (km): 10
   ```

#### Step 2: Add Riders (via the App)
1. Navigate to `http://localhost:3000`
2. Click **"Manage Riders"** button
3. Fill in the form:
   ```
   Rider ID: R-001
   Full Name: Gideon Mensah
   Phone: +233 123 456 789
   Assigned Zone: Select "Madina"
   Joined Date: 2024-01-01
   Active: ✓ (checked)
   ```
4. Click **"Add Rider"**
5. ✅ **Expected Result**: Success message appears, rider shows in the list
6. Add 2 more riders (R-002, R-003) for testing

#### Step 3: Add Daily Summary (Punctuality Tracking)
1. Click **"Add Data"** from the main dashboard
2. Click **"Add Daily Summary"** tab
3. Fill in the form:
   ```
   Rider: Select "Gideon Mensah (R-001)"
   Date: 2025-01-06
   Reporting Time: 08:15 (before 8:30 AM = punctual)
   ```
4. Click **"Create Daily Summary"**
5. ✅ **Expected Result**: Success message
6. Add more daily summaries for different dates:
   - 2025-01-07 at 08:20 (punctual)
   - 2025-01-08 at 08:45 (late)
   - 2025-01-09 at 08:10 (punctual)
   - 2025-01-10 at 08:25 (punctual)

#### Step 4: Add Trips
1. Stay on the **"Add Data"** page
2. Click **"Add Trip"** tab
3. Fill in a complete trip:
   ```
   Rider: Gideon Mensah (R-001)
   Date: 2025-01-06
   Period: 06/01/2025 – 12/01/2025
   Pickup Location: Madina
   Delivery Location: Accra
   Pickup Time: 2025-01-06 09:00
   Arrival Time: 2025-01-06 08:58 (early = good score!)
   Delivery Time (Rider): 2025-01-06 09:35
   Delivery Time (Customer): 2025-01-06 09:35
   Distance (km): 15
   Expected Delivery Time (mins): 35
   Customer Confirmed: ✓ (checked = bonus!)
   Notes: Test trip - perfect timing
   ```
4. Click **"Create Trip"**
5. ✅ **Expected Result**: Success message

6. Add more trips with varying performance:

   **Trip 2 - Late arrival:**
   ```
   Date: 2025-01-07
   Pickup Time: 2025-01-07 10:00
   Arrival Time: 2025-01-07 10:12 (12 mins late)
   Delivery Time: 2025-01-07 10:50
   Expected Delivery Time: 40 mins
   ```

   **Trip 3 - Late delivery:**
   ```
   Date: 2025-01-08
   Pickup Time: 2025-01-08 11:00
   Arrival Time: 2025-01-08 11:02
   Delivery Time: 2025-01-08 12:10 (70 mins, expected 45)
   Expected Delivery Time: 45 mins
   ```

   **Trip 4 - Perfect:**
   ```
   Date: 2025-01-09
   Pickup Time: 2025-01-09 14:00
   Arrival Time: 2025-01-09 13:55
   Delivery Time: 2025-01-09 14:30
   Expected Delivery Time: 30 mins
   Customer Confirmed: ✓
   ```

### Phase 2: Performance Report Testing

#### Step 5: Generate Performance Report
1. Go back to the main dashboard (`http://localhost:3000`)
2. Select **Rider**: "Gideon Mensah (R-001)"
3. Set **Start Date**: 2025-01-06
4. Set **End Date**: 2025-01-12
5. Click **"Generate Performance Report"**

#### Expected Results:
✅ **Report should show:**
- **Work Period**: 06/01/2025 – 12/01/2025
- **Average Ride Score**: Should be between 7-10 depending on your data
- **Total Trips**: 4 (or however many you added)
- **Top Day**: The date with the highest average score
- **Most Frequent Zone**: "Madina / Accra" or similar
- **Punctuality**:
  - ✅ if all reporting times were before 8:30 AM
  - ⚠️ with count if some were late
- **Availability**:
  - ✅ if rider worked on multiple days
  - Shows active days count
- **Overall Rating**: Calculated score out of 10

### Phase 3: Edge Cases & Error Testing

#### Test 6: Empty Data
1. Create a new rider with no trips
2. Try to generate a performance report
3. ✅ **Expected**: Should handle gracefully (may show 0 trips)

#### Test 7: Missing Customer Confirmation
1. Add a trip without checking "Customer Confirmed"
2. Generate report
3. ✅ **Expected**: Score should be slightly lower (no 0.5 bonus)

#### Test 8: Multiple Zones
1. Add trips to different zones for the same rider
2. Generate report
3. ✅ **Expected**: "Most Frequent Zone" should show top 3 zones

#### Test 9: Date Range Filtering
1. Select a date range that excludes some trips
2. Generate report
3. ✅ **Expected**: Only trips within range are counted

### Phase 4: UI/UX Testing

#### Test 10: Responsive Design
1. Resize browser window to mobile size
2. ✅ **Expected**: Layout should adapt (buttons stack, grids become single column)

#### Test 11: Form Validation
1. Try to submit trip form without required fields (Rider, Date)
2. ✅ **Expected**: Browser validation prevents submission
3. Try to submit rider form without Rider ID or Name
4. ✅ **Expected**: Form won't submit

#### Test 12: Loading States
1. Click "Generate Performance Report"
2. ✅ **Expected**: Button shows "Loading..." while fetching data
3. Button is disabled during loading

### Phase 5: Data Verification in Airtable

#### Test 13: Verify Airtable Sync
1. After adding a rider, check Airtable **Riders** table
2. ✅ **Expected**: New rider appears in Airtable
3. After adding a trip, check **Trips** table
4. ✅ **Expected**: New trip appears with all fields
5. Check **Daily Summaries** table
6. ✅ **Expected**: Daily summaries are created

## Sample Test Data Set

For a complete test, create this dataset:

### Rider: Gideon Mensah (R-001)
**Week of 06/01/2025 - 12/01/2025**

| Date | Reporting Time | Trips | Arrival | Delivery Performance |
|------|---------------|-------|---------|---------------------|
| 06/01 | 08:15 ✅ | 2 | On time | On time |
| 07/01 | 08:20 ✅ | 3 | Mixed | Mixed |
| 08/01 | 08:45 ⚠️ | 2 | Late | Late |
| 09/01 | 08:10 ✅ | 4 | Perfect | Perfect |
| 10/01 | 08:25 ✅ | 3 | On time | On time |
| 11/01 | 08:28 ✅ | 2 | On time | Early |
| 12/01 | 08:05 ✅ | 2 | Early | On time |

**Expected Overall Performance:**
- Total Trips: 18
- Punctuality: 6/7 days (85.7%)
- Top Day: 09/01/2025 (perfect scores)
- Overall Rating: ~9.0-9.5 / 10

## Common Issues & Solutions

### Issue 1: "Failed to load riders"
**Solution**:
- Check `.env.local` has correct Airtable credentials
- Verify table names match exactly (case-sensitive)
- Restart dev server after changing `.env.local`

### Issue 2: No zones appearing in dropdown
**Solution**:
- Add zones manually in Airtable (no UI for zones yet)
- Refresh the page

### Issue 3: Performance report shows 0 trips
**Solution**:
- Verify trips are linked to the correct rider in Airtable
- Check date range includes the trip dates
- Ensure trip dates are in YYYY-MM-DD format

### Issue 4: Scores seem incorrect
**Solution**:
- Verify time fields are in datetime format (not just time)
- Check that pickup time is before delivery time
- Ensure expected delivery time is reasonable (in minutes)

## Testing the Scoring Algorithm

To verify scoring works correctly, create these specific test cases:

### Perfect Score Trip (Should be ~10/10):
- Arrival: 5 mins early
- Delivery: Exactly on expected time
- Customer confirmed: Yes

### Good Score Trip (Should be ~8-9/10):
- Arrival: On time (within 5 mins)
- Delivery: 5 mins late
- Customer confirmed: Yes

### Average Score Trip (Should be ~6-7/10):
- Arrival: 15 mins late
- Delivery: 15 mins late
- Customer confirmed: No

### Poor Score Trip (Should be ~5/10):
- Arrival: 30+ mins late
- Delivery: 30+ mins late
- Customer confirmed: No

## Automated Testing Commands

While the app doesn't have automated tests yet, you can verify build:

```bash
# Check for TypeScript errors
npm run build

# If successful, the app is type-safe and ready for production
```

## Success Criteria

Your testing is complete when:
- ✅ Can add riders successfully
- ✅ Can add daily summaries and trips
- ✅ Performance reports generate correctly
- ✅ Scores make logical sense (better performance = higher score)
- ✅ All data appears in Airtable
- ✅ UI is responsive and user-friendly
- ✅ No console errors in browser
- ✅ Loading states work properly
- ✅ Form validation works

## Next Steps After Testing

Once testing is complete:
1. Deploy to production (Vercel)
2. Add more riders and real data
3. Consider future enhancements:
   - Zone management UI
   - Export reports to PDF
   - Charts and graphs
   - Email notifications
   - Mobile app

---

Happy Testing! 🚀
