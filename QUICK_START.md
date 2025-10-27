# 🚀 Quick Start Guide

## For Your Son - Easy Instructions

### What This App Does

This app helps you track if you're on schedule to finish a project. You enter:
- How many things you need to do (tasks)
- When you started
- When you need to finish

Then each day, you tell it how many things you finished that day. It shows you a chart that tells you if you're ahead, on time, or behind schedule!

### First Time Setup (Dad Does This Part)

1. **Install Node.js** (if not already installed)
   - Go to https://nodejs.org
   - Download and install the LTS version

2. **Open Terminal in this folder**

3. **Run these commands:**
   ```bash
   npm install
   npx wrangler login
   ```
   
4. **You're ready to test it locally!**

### Running the App Locally

1. Open Terminal in this folder
2. Run: `npm run dev`
3. Open your browser to: http://localhost:8788
4. To stop: Press `Ctrl+C` in the terminal

### Using the App

#### Step 1: Create Your Project

1. Fill in the form:
   - **Project ID**: Give it a name (like "homework-fall-2025")
   - **Total Tasks**: How many things total (like 50 problems, 20 chapters, etc.)
   - **Start Date**: Today or when you started
   - **End Date**: Your deadline

2. Click "Create Project"

#### Step 2: Track Your Daily Work

Every day:
1. The date should already be set to today
2. Enter how many tasks you completed
3. Click "Update"
4. Look at your chart!

#### Step 3: Understanding Your Status

The app will tell you:
- **🟢 On Track** = You're doing great! Keep going at this pace.
- **🔵 Ahead** = You're ahead of schedule! Nice work!
- **🔴 Behind** = You need to pick up the pace a bit.

### Tips

- **Forgot a day?** Click "Edit" next to any date in the history
- **Made a mistake?** Just edit the entry and update it
- **Lost your project?** Click "Load Existing Project" and enter your Project ID

### Example

Let's say you have:
- 100 math problems to do
- 20 days to do them
- That's 5 problems per day

If you do 5 problems each day, you'll stay "On Track"!

---

## Deploying Online (So You Can Access From Anywhere)

### One-Time Setup

1. **Create Cloudflare Account**
   - Go to https://dash.cloudflare.com
   - Sign up (it's free!)

2. **Create KV Namespace**
   ```bash
   npm run create-kv
   ```
   Copy the ID that appears

3. **Update wrangler.toml**
   - Open `wrangler.toml`
   - Replace `placeholder_id` with the ID from step 2

### Deploy

```bash
npm run deploy
```

After deploying:
1. Go to Cloudflare Dashboard
2. Find your project under "Workers & Pages"
3. Go to Settings → Functions → KV namespace bindings
4. Add: Variable name = `TRENDLINE_KV`, select your namespace
5. Save and redeploy

Now you can access it from anywhere at the URL Cloudflare gives you!

---

## Troubleshooting

### "Failed to create project"
- Make sure the dev server is running (`npm run dev`)
- Check the browser console (F12) for errors

### Chart not showing
- Make sure you have internet (it needs Chart.js from CDN)
- Refresh the page

### Can't access from other device
- You need to deploy it online first (see "Deploying Online" above)
- Local server only works on your computer

---

**Need help? Ask Dad!** 😊
