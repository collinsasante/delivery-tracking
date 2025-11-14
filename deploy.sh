#!/bin/bash

# Deployment script for Cloudflare Pages
# This script helps you prepare and deploy your app

echo "🚀 Delivery Tracking System - Cloudflare Deployment Helper"
echo "=========================================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
    echo ""
fi

# Check if there's a remote
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  No Git remote found!"
    echo ""
    echo "Please create a repository on GitHub, then run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/delivery-tracking.git"
    echo ""
    read -p "Press Enter when you've created the repository and added the remote..."
fi

# Build the project to check for errors
echo "🔨 Building project to check for errors..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors above before deploying."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Uncommitted changes detected. Committing..."
    git add .

    read -p "Enter commit message (or press Enter for default): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Deploy to Cloudflare Pages"
    fi

    git commit -m "$commit_msg"
    echo "✅ Changes committed"
    echo ""
fi

# Push to remote
echo "⬆️  Pushing to remote repository..."
git push origin main

if [ $? -ne 0 ]; then
    # Try master branch if main doesn't exist
    echo "Trying master branch..."
    git push origin master

    if [ $? -ne 0 ]; then
        echo "❌ Push failed! Please check your Git setup."
        exit 1
    fi
fi

echo "✅ Code pushed successfully!"
echo ""

# Instructions for Cloudflare
echo "✨ Next Steps:"
echo "=============="
echo ""
echo "1. Go to: https://dash.cloudflare.com/"
echo "2. Click 'Workers & Pages' → 'Create application' → 'Pages' → 'Connect to Git'"
echo "3. Select your repository"
echo "4. Configure build settings:"
echo "   - Framework preset: Next.js"
echo "   - Build command: npm run build"
echo "   - Build output directory: .next"
echo ""
echo "5. Add these environment variables:"
echo "   NEXT_PUBLIC_AIRTABLE_API_KEY"
echo "   NEXT_PUBLIC_AIRTABLE_BASE_ID"
echo "   NEXT_PUBLIC_AIRTABLE_RIDERS_TABLE"
echo "   NEXT_PUBLIC_AIRTABLE_ZONES_TABLE"
echo "   NEXT_PUBLIC_AIRTABLE_TRIPS_TABLE"
echo "   NEXT_PUBLIC_AIRTABLE_DAILY_SUMMARIES_TABLE"
echo "   NEXT_PUBLIC_AIRTABLE_PERIODS_TABLE"
echo ""
echo "6. Click 'Save and Deploy'"
echo ""
echo "📖 For detailed instructions, see CLOUDFLARE_DEPLOYMENT.md"
echo ""
echo "🎉 Your code is ready for Cloudflare Pages!"
