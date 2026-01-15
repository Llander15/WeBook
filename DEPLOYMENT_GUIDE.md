# Railway.app Deployment Guide

## Overview
This guide will help you deploy the WeBook bookstore application on Railway.app with:
- React frontend (Vite)
- PHP backend with MySQL database

## Prerequisites
1. GitHub account
2. Railway.app account (free signup at https://railway.app)
3. Your code pushed to GitHub

## Step 1: Push Code to GitHub

```bash
cd /opt/lampp/htdocs/bookstore

# Stage all changes
git add .

# Commit your changes
git commit -m "Update BookStore - Ready for Railway deployment"

# Push to GitHub
git push origin main
```

## Step 2: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account
5. Select the `bookstore` repository
6. Railway will auto-detect it's a Node.js project

## Step 3: Configure Environment Variables

In Railway dashboard:

1. Go to your project settings
2. Add these variables in Railway:
   - `DB_HOST`: (Railway will provide MySQL host)
   - `DB_NAME`: `webook_db`
   - `DB_USER`: (Railway default)
   - `DB_PASS`: (Railway auto-generated)
   - `NODE_ENV`: `production`

3. In the variables, you'll see Railway provides:
   - `DATABASE_URL` (Railway MySQL service)

## Step 4: Add MySQL Database

1. In Railway dashboard, click "Add Service"
2. Select "MySQL"
3. Railway will auto-inject connection credentials

## Step 5: Update API URLs

After Railway deployment, update your frontend API URLs:

In `src/components/views/AuthView.tsx`, `src/components/views/HomeView.tsx`, etc.:

```javascript
// Replace:
const API_URL = 'http://localhost/bookstore/php-backend/api';

// With your Railway backend URL:
const API_URL = 'https://your-railway-app.up.railway.app/api';
```

## Step 6: Configure PHP Backend

Railway will handle:
- PHP execution
- MySQL connection
- Environment variables

The `.htaccess` file in `php-backend/` handles URL routing.

## Step 7: Deploy

Railway automatically deploys on every push to main branch.

## Troubleshooting

### API Not Connecting
- Check Railway logs
- Verify MySQL is running
- Check CORS headers in `php-backend/api/index.php`

### Database Not Found
- Run the schema.sql script in Railway MySQL
- Check DB credentials in environment variables

### Static Files Not Loading
- Ensure Vite build output in `dist/`
- Check web server configuration

## Support

- Railway Docs: https://docs.railway.app
- Railway Community: https://discord.gg/railway
