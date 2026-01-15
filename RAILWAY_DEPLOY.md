# 🚀 Railway Deployment - Complete Setup Guide

## ✅ What We've Done

- ✅ Converted PHP backend to Node.js/Express
- ✅ Integrated MySQL database support  
- ✅ Created centralized API configuration
- ✅ Set up environment variables
- ✅ Tested backend locally (working!)

## 📋 Deployment Steps

### Step 1: Push Code to GitHub

Since git push had credential issues, use this method:

**Option A: GitHub Web Upload (Easiest)**
1. Go to https://github.com/Llander15/WeBook
2. Click "Upload files"
3. Select and upload these files:
   - `server.js` (new Express backend)
   - `Procfile` (Railway configuration)
   - `.env` and `.env.example`
   - Updated `package.json`
   - Commit message: "Add Node.js backend for Railway deployment"

**Option B: Fix Git Credentials**
```bash
# Remove cached credentials
git config --global --unset credential.helper
git config --local --unset credential.helper

# Try pushing again - use Personal Access Token as password
git push origin main
```

### Step 2: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (easiest)
3. Authorize Railway to access your repos

### Step 3: Deploy on Railway

1. Go to Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Find and select `WeBook` repository
5. Railway auto-detects it's a Node.js project ✅

### Step 4: Configure Environment Variables

In Railway dashboard → Project Settings → Variables:

```
DB_HOST=your-railway-mysql-host
DB_NAME=webook_db
DB_USER=mysql_user
DB_PASS=mysql_password
PORT=3000
NODE_ENV=production
```

### Step 5: Add MySQL Service

1. In Railway dashboard, click "Add Service"
2. Select "MySQL"
3. Choose version 8
4. Railway will auto-provide credentials
5. Copy the connection string to your `.env`

### Step 6: Deploy Database Schema

1. In Railway MySQL service, click "Connect"
2. Get the MySQL connection details
3. Run the schema:
```bash
mysql -h [host] -u [user] -p[password] [database] < php-backend/database/schema.sql
```

Or copy/paste the SQL from `php-backend/database/schema.sql` into Railway's SQL editor.

### Step 7: Deploy!

- Railway automatically deploys when you push to GitHub
- Watch the build logs in Railway dashboard
- Your app will be live at: `https://your-project.railway.app`

### Step 8: Update Frontend API URL

Once your Railway backend URL is live (e.g., `https://webook-api.railway.app`):

Update `.env`:
```
VITE_API_URL=https://webook-api.railway.app/api
```

Then build and deploy frontend:

**Option A: Deploy Frontend to Vercel**
1. Go to https://vercel.com
2. Import your GitHub repo
3. Framework: Vite
4. Environment variable: `VITE_API_URL=https://webook-api.railway.app/api`
5. Deploy! ✅

**Option B: Deploy Frontend to Railway Too**
1. In Railway, add another service
2. Select "GitHub Repo"
3. Configure build:
   - Build command: `npm run build`
   - Start command: `npm run preview`
   - Port: 5173

## 🔗 Your Live URLs

Once deployed:
- **Frontend**: `https://your-webook.vercel.app` (or Railway URL)
- **Backend API**: `https://your-project.railway.app/api`
- **Health Check**: `https://your-project.railway.app/health`

## 🧪 Test Your Deployment

### Test Backend
```bash
curl https://your-project.railway.app/health
curl https://your-project.railway.app/api/books
```

### Test Frontend
Visit your Vercel/Railway URL and try:
- Login with: admin@webook.com / password
- Create new user
- Buy books

## 📊 Monitoring

In Railway dashboard you can:
- View real-time logs
- Monitor CPU/memory usage
- Restart services
- Scale resources
- View deployment history

## 🆘 Troubleshooting

### Build Fails
- Check railway.log in Railway dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### Database Connection Error
- Verify DB credentials in Railway variables
- Check MySQL service is running
- Ensure schema is imported

### API Not Responding
- Check backend logs in Railway
- Verify PORT environment variable is set
- Check CORS headers (should be enabled)

### Frontend Can't Connect to Backend
- Update VITE_API_URL to correct Railway URL
- Rebuild and redeploy frontend
- Check browser console for CORS errors

## 💡 Next Steps

1. Push code to GitHub
2. Create Railway account
3. Deploy the project
4. Test all functionality
5. Share your live URL!

**Need help?** Railway docs: https://docs.railway.app
