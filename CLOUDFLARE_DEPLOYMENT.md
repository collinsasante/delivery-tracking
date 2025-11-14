# Deploying to Cloudflare Pages

This guide will walk you through deploying your Delivery Tracking app to Cloudflare Pages.

## Prerequisites

- A Cloudflare account (free tier works fine)
- Git repository (GitHub, GitLab, or Bitbucket)
- Your Airtable credentials ready

## Step-by-Step Deployment

### 1. Prepare Your Repository

First, initialize a git repository and push to GitHub (or your preferred Git provider):

```bash
cd "/Users/breezyyy/Downloads/Delivery tracking/delivery-tracking"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Delivery tracking system"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/delivery-tracking.git
git branch -M main
git push -u origin main
```

### 2. Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **"Workers & Pages"** in the left sidebar
3. Click **"Create application"**
4. Select **"Pages"** tab
5. Click **"Connect to Git"**

### 3. Configure Your Project

#### Build Settings:

```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: (leave blank)
```

#### Environment Variables:

Click **"Environment variables"** and add these (one by one):

**Copy the values from your local `.env.local` file:**

```
NEXT_PUBLIC_AIRTABLE_API_KEY = your_airtable_api_key_here

NEXT_PUBLIC_AIRTABLE_BASE_ID = your_airtable_base_id_here

NEXT_PUBLIC_AIRTABLE_RIDERS_TABLE = Riders

NEXT_PUBLIC_AIRTABLE_ZONES_TABLE = Zones

NEXT_PUBLIC_AIRTABLE_TRIPS_TABLE = Trips

NEXT_PUBLIC_AIRTABLE_DAILY_SUMMARIES_TABLE = Daily Summaries

NEXT_PUBLIC_AIRTABLE_PERIODS_TABLE = Periods / Reports
```

**Note**: Replace the placeholder values with your actual credentials from `.env.local`

**Important**: Add these variables to **both** Production AND Preview environments.

### 4. Deploy

1. Click **"Save and Deploy"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Once complete, you'll get a URL like: `https://delivery-tracking-abc.pages.dev`

### 5. Custom Domain (Optional)

If you have a custom domain:

1. Go to your project settings
2. Click **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Follow the instructions to add DNS records

## Troubleshooting

### Build Fails

If the build fails, check these common issues:

#### Issue 1: Node Version
Add this to your environment variables:
```
NODE_VERSION = 18
```

#### Issue 2: Build Output Directory
If Cloudflare can't find the build output, make sure:
- Build output directory is set to `.next`
- Build command is `npm run build`

#### Issue 3: Environment Variables Not Working
- Make sure all env vars are added to BOTH Production and Preview
- Variable names must be EXACTLY as shown (case-sensitive)
- No quotes around the values in Cloudflare dashboard

### Runtime Errors

#### "Failed to fetch riders" Error
- Check that environment variables are correctly set in Cloudflare
- Verify your Airtable API key has correct permissions
- Make sure table names match exactly with your Airtable base

### Slow Initial Load
Cloudflare Pages uses edge caching, so the first load might be slower. Subsequent loads will be much faster.

## Cloudflare-Specific Optimizations

### Edge Caching
Cloudflare automatically caches static assets at the edge for faster global delivery.

### Automatic HTTPS
Your site automatically gets HTTPS with Let's Encrypt certificates.

### DDoS Protection
Cloudflare provides built-in DDoS protection for free.

## Continuous Deployment

Every time you push to your main branch:
1. Cloudflare automatically detects the changes
2. Builds a new version
3. Deploys it to production
4. Your site updates with zero downtime

### Preview Deployments

When you create a Pull Request:
- Cloudflare creates a preview deployment
- You get a unique URL to test changes
- Perfect for testing before merging to main

## Post-Deployment Checklist

After deployment, verify:

- ✅ Home page loads correctly
- ✅ Can view list of riders
- ✅ Can add new riders
- ✅ Can add new zones
- ✅ Can add trips and daily summaries
- ✅ Performance reports generate correctly
- ✅ All environment variables are working
- ✅ No console errors in browser

## Performance Tips

### 1. Enable Cloudflare Analytics
- Go to your Pages project
- Enable Web Analytics
- Get insights on traffic and performance

### 2. Use Cloudflare Cache
Cloudflare automatically caches:
- Static assets (JS, CSS, images)
- API responses (with proper headers)

### 3. Monitor Build Minutes
Free tier includes:
- 500 builds per month
- Unlimited requests
- Unlimited bandwidth

## Updating Your Deployment

To deploy updates:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main
```

Cloudflare will automatically rebuild and deploy!

## Alternative: Deploy via Wrangler CLI

You can also deploy using Cloudflare's CLI tool:

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy .next
```

## Rollback to Previous Version

If something goes wrong:

1. Go to Cloudflare Dashboard
2. Click on your project
3. Go to **"Deployments"**
4. Find a previous working deployment
5. Click **"Rollback to this deployment"**

## Cost

**Free Tier Includes:**
- Unlimited requests
- Unlimited bandwidth
- 500 builds/month
- 1 concurrent build
- Custom domains
- HTTPS
- DDoS protection

**Perfect for this app!** You likely won't need to upgrade.

## Support

If you encounter issues:

1. Check [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
2. Check [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
3. Ask in [Cloudflare Discord](https://discord.gg/cloudflaredev)

## Security Notes

### Protecting Your Airtable Credentials

**Current Setup**: Your Airtable credentials are in environment variables, which is correct.

**Important**: Never commit `.env.local` to Git! It's already in `.gitignore`.

### Adding Authentication (Future Enhancement)

To add password protection:

1. Use Cloudflare Access (Zero Trust)
2. Or implement authentication with:
   - Auth0
   - Clerk
   - NextAuth.js

## Monitoring

Track your app's health:

1. **Cloudflare Analytics**: Built-in traffic analytics
2. **Logs**: View deployment logs in Cloudflare dashboard
3. **Uptime**: Cloudflare automatically monitors uptime

## Next Steps After Deployment

1. **Test thoroughly** with real data
2. **Share URL** with your team
3. **Set up custom domain** (if desired)
4. **Enable notifications** for deployment status
5. **Monitor usage** in Cloudflare dashboard

---

## Quick Deployment Checklist

- [ ] Repository pushed to GitHub/GitLab
- [ ] Connected to Cloudflare Pages
- [ ] Build settings configured (Next.js preset)
- [ ] All environment variables added
- [ ] Environment variables added to BOTH Production and Preview
- [ ] First deployment successful
- [ ] Website loads correctly
- [ ] Can fetch riders from Airtable
- [ ] Can add new data
- [ ] Performance reports work
- [ ] No console errors

**Your app is now live! 🚀**

Need help? Check the troubleshooting section or the Cloudflare documentation.
