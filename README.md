# Trendline - Burndown Chart App
# 📊 Trendline - Simple Project Tracker

A clean, simple burndown chart web application for tracking project progress over time. Perfect for students, freelancers, or anyone who needs to track whether they're on schedule to complete a project by a deadline.

## Features

- **Live Burndown Chart**: Visual representation of progress vs. ideal timeline
- **Daily Progress Tracking**: Record how many tasks you complete each day
- **Status Indicators**: Instantly see if you're ahead, on track, or behind schedule
- **Multi-Device Access**: Your data is stored in Cloudflare KV, accessible from any device
- **Edit History**: Update previous entries if you forgot to log progress
- **Free Hosting**: Runs entirely on Cloudflare's free tier

## How It Works

1. **Create a Project**: Enter total tasks, start date, and end date
2. **Track Daily Progress**: Each day, enter how many tasks you completed
3. **Monitor Status**: The app calculates if you're on track to finish on time
4. **View the Chart**: See your actual progress vs. the ideal burndown line

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js
- **Backend**: Cloudflare Pages Functions
- **Storage**: Cloudflare Workers KV (Key-Value storage)
- **Hosting**: Cloudflare Pages (Free Tier)

## Local Development

### Prerequisites

- Node.js 16+ installed
- A Cloudflare account (free tier is fine)

### Setup Steps

1. **Clone/Download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```

4. **Create a KV namespace**
   ```bash
   npm run create-kv
   ```
   
   This will output something like:
   ```
   { binding = "TRENDLINE_KV", id = "abc123def456..." }
   ```

5. **Update wrangler.toml**
   
   Replace the `id` in `wrangler.toml` with the actual ID from step 4:
   ```toml
   [[kv_namespaces]]
   binding = "TRENDLINE_KV"
   id = "your-actual-kv-id-here"
   ```

6. **Run locally**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:8788`

## Deploying to Cloudflare Pages

### Option 1: Wrangler CLI (Recommended)

1. **Ensure you're logged in**
   ```bash
   npx wrangler login
   ```

2. **Deploy the application**
   ```bash
   npm run deploy
   ```

3. **Configure KV binding in dashboard**
   - Go to the [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Workers & Pages
   - Select your `trendline` project
   - Go to Settings → Functions → KV namespace bindings
   - Add binding:
     - Variable name: `TRENDLINE_KV`
     - KV namespace: Select the namespace you created
   - Save and redeploy

### Option 2: GitHub Actions (Automated Deployment)

This repository includes a GitHub Action that automatically deploys to Cloudflare Pages when you push to the `main` branch.

1. **Get your Cloudflare API Token**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Click on your profile → API Tokens
   - Click "Create Token"
   - Use "Edit Cloudflare Workers" template or create custom token with:
     - Account → Cloudflare Pages: Edit
     - Account → Workers KV Storage: Edit
   - Copy the generated token

2. **Get your Cloudflare Account ID**
   - In Cloudflare Dashboard, click on any domain
   - Scroll down in the right sidebar to find "Account ID"
   - Copy the Account ID

3. **Add GitHub Secrets**
   - Go to your GitHub repository
   - Click Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add two secrets:
     - Name: `CLOUDFLARE_API_TOKEN`, Value: (your API token from step 1)
     - Name: `CLOUDFLARE_ACCOUNT_ID`, Value: (your Account ID from step 2)

4. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

5. **Verify deployment**
   - Go to the "Actions" tab in your GitHub repository
   - Watch the deployment workflow run
   - Once complete, your app will be live at `https://trendline.pages.dev`

6. **Configure KV binding in Cloudflare Dashboard**
   - Go to Workers & Pages → trendline project
   - Settings → Functions → KV namespace bindings
   - Add binding:
     - Variable name: `TRENDLINE_KV`
     - KV namespace: Select your KV namespace
   - Save

### Option 3: Manual GitHub Integration

1. **Push code to GitHub**

2. **Connect to Cloudflare Pages**
   - Go to Workers & Pages in Cloudflare Dashboard
   - Click "Create application" → "Pages" → "Connect to Git"
   - Select your repository
   - Configure build settings:
     - Build output directory: `public`
     - Build command: (leave empty)

3. **Configure KV binding** (same as Option 2, step 6)

## Usage Guide

### Creating Your First Project

1. Open the app
2. Fill in the form:
   - **Project ID**: A unique name (e.g., "homework-2025" or "client-project")
   - **Total Tasks**: How many items you need to complete
   - **Start Date**: When you started (or will start)
   - **End Date**: Your deadline
3. Click "Create Project"
4. The URL will automatically update to `/p/your-project-id`

### Direct Access via URL

You can access any project directly by navigating to:
```
https://your-domain.pages.dev/p/project-id
```

For example:
- `https://trendline.pages.dev/p/Cards` loads the "Cards" project
- `http://localhost:8788/p/homework-2025` loads the "homework-2025" project

**Bookmarking**: Simply bookmark the project URL to quickly access it later from any device!

### Sharing Your Project

1. When viewing a project, click the "📋 Copy Link" button
2. Share the copied URL with others
3. Anyone with the link can view and update the project

### Loading an Existing Project

**Option 1 - Direct URL**: Navigate to `/p/your-project-id`

**Option 2 - Load Form**:
1. Click "Load Existing Project"
2. Enter your Project ID
3. Click "Load Project"

### Recording Daily Progress

1. Select the date (defaults to today)
2. Enter how many tasks you completed on that day
3. Click "Update"
4. The chart and statistics update automatically

### Editing Previous Entries

1. Scroll to "Progress History"
2. Click "Edit" next to any date
3. Update the number of tasks
4. Click "Update"

## Understanding the Status

- **🟢 On Track**: You're within 5% of where you should be
- **🔵 Ahead**: You're more than 5% ahead of schedule
- **🔴 Behind**: You're more than 5% behind schedule

## Cost & Limits

### Cloudflare Free Tier Includes:

- **KV Storage**: 1 GB (plenty for thousands of projects)
- **KV Reads**: 100,000/day
- **KV Writes**: 1,000/day
- **Pages Deployments**: 500/month
- **Pages Requests**: Unlimited

This should be more than enough for personal use!

## Troubleshooting

### "Failed to create project"
- Check that you're logged in to Cloudflare
- Verify your KV namespace is properly configured
- Check browser console for detailed errors

### "Project not found"
- Double-check your Project ID (it's case-sensitive)
- Ensure the project was created successfully

### Chart not displaying
- Check your browser console for JavaScript errors
- Ensure Chart.js CDN is accessible
- Try refreshing the page

### Local development not working
- Make sure Wrangler is installed: `npm install`
- Ensure you're logged in: `npx wrangler login`
- Check that port 8788 isn't in use

## Privacy & Data

- All data is stored in your Cloudflare KV namespace
- No analytics or tracking
- Data is not shared with anyone
- Only accessible via your Project ID

## Contributing

Feel free to fork and modify for your needs! Some ideas:

- Add authentication for security
- Export data to CSV
- Multiple team members
- Notifications when falling behind
- Weekly/monthly views
- Task categories or tags

## License

ISC License - Free to use and modify!

## Support

For issues or questions, check the Cloudflare documentation:
- [Pages Documentation](https://developers.cloudflare.com/pages/)
- [KV Documentation](https://developers.cloudflare.com/kv/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

**Made with ❤️ for simple project tracking**
