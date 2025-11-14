# Fix Cloudflare Pages 404 - Step by Step

## Update Your Cloudflare Pages Settings

### Step 1: Go to Cloudflare Dashboard
1. Visit: https://dash.cloudflare.com
2. Click **Workers & Pages**
3. Click on your **delivery-tracking** project

### Step 2: Update Build Configuration
1. Click the **Settings** tab
2. Scroll to **Build & deployments**
3. Click **Edit configuration**

### Step 3: Update Build Settings
Change the following:

**Build command:**
```
npm run pages:build
```

**Build output directory:**
```
.vercel/output/static
```

**Root directory:**
```
(leave blank)
```

### Step 4: Add Node Version
1. Scroll to **Environment variables**
2. Click **Add variable**
3. Add:
   - Variable name: `NODE_VERSION`
   - Value: `18`
4. Apply to: **Production** and **Preview**

### Step 5: Verify Your Environment Variables
Make sure these 7 variables exist:

1. `NEXT_PUBLIC_AIRTABLE_API_KEY` = (your key from .env.local)
2. `NEXT_PUBLIC_AIRTABLE_BASE_ID` = (your base ID from .env.local)
3. `NEXT_PUBLIC_AIRTABLE_RIDERS_TABLE` = `Riders`
4. `NEXT_PUBLIC_AIRTABLE_ZONES_TABLE` = `Zones`
5. `NEXT_PUBLIC_AIRTABLE_TRIPS_TABLE` = `Trips`
6. `NEXT_PUBLIC_AIRTABLE_DAILY_SUMMARIES_TABLE` = `Daily Summaries`
7. `NEXT_PUBLIC_AIRTABLE_PERIODS_TABLE` = `Periods / Reports`

### Step 6: Save and Redeploy
1. Click **Save**
2. Go to **Deployments** tab
3. Click **Retry deployment** on the latest deployment

OR trigger a new deployment:
- Click **Create deployment**
- Select **Production** branch
- Click **Save and Deploy**

### Step 7: Wait for Build
Wait 2-5 minutes for the build to complete.

### Step 8: Check Build Logs
1. Click on the deployment in progress
2. Watch the build logs
3. Look for any errors

### Expected Build Output:
You should see:
```
✓ Compiled successfully
✓ Generating static pages
✓ Creating optimized production build
✓ Cloudflare Pages build completed
```

### Step 9: Test Your App
Once deployed, visit: `https://delivery-tracking.pages.dev`

Test these pages:
- `/` - Dashboard (should load)
- `/riders` - Manage Riders
- `/zones` - Manage Zones
- `/input` - Add Data

## Troubleshooting

### If Build Fails:
Check the error message in build logs. Common issues:
- Missing environment variables
- Node version mismatch
- Build command typo

### If Still Getting 404:
The issue is Next.js 16 compatibility. Cloudflare adapter doesn't fully support it yet.

### Alternative: Use Cloudflare Workers
For full Next.js 16 support on Cloudflare, you'd need to use Cloudflare Workers instead of Pages, which is more complex.

## Quick Check
After deployment, test the API:
- Visit: `https://delivery-tracking.pages.dev/api/riders`
- Should return JSON data (empty array [] if no riders yet)

If you get 404 on API routes, the Next.js adapter isn't working properly due to Next.js 16.

## Summary
Your code is now configured for Cloudflare Pages. Just update the settings in the dashboard as described above and redeploy!
