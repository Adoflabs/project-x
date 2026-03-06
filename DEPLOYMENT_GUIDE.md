# Deployment Guide - Veridion Platform

This guide will help you deploy the backend to Railway and frontend to Vercel.

---

## 🚂 Part 1: Deploy Backend to Railway

### Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository access

### Step 1: Create Railway Project

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Click "New Project"

2. **Deploy from GitHub**
   - Select "Deploy from GitHub repo"
   - Choose your repository: `Adoflabs/project-x`
   - Select the `backend` folder (or main branch)

3. **Configure Service**
   - Railway will auto-detect Node.js
   - It will use the `railway.json` configuration

### Step 2: Add Environment Variables

In Railway dashboard, go to your service → Variables tab and add:

```env
# Required Variables
NODE_ENV=production
PORT=4000
DATABASE_URL=your_neon_database_url_here
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_SECRET=your_encryption_secret_here

# CORS Configuration
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://veridion.vercel.app

# Email Configuration
EMAIL_PROVIDER=console
EMAIL_FROM_ADDRESS=noreply@veridion.app
EMAIL_FROM_NAME=Veridion

# Optional: Cron Jobs
RISK_EVAL_CRON=0 3 * * *

# App URL (will be your Railway URL)
APP_BASE_URL=https://your-app.railway.app
```

**Important:** 
- Copy `DATABASE_URL` from your current `backend/.env` file
- Copy `JWT_SECRET` and `ENCRYPTION_SECRET` from `backend/.env`
- Update `ALLOWED_ORIGINS` after you get your Vercel URL

### Step 3: Deploy

1. **Trigger Deployment**
   - Railway will automatically deploy when you push to GitHub
   - Or click "Deploy" in Railway dashboard

2. **Wait for Build**
   - Watch the build logs
   - Should complete in 2-3 minutes

3. **Get Your Railway URL**
   - After deployment, Railway provides a URL like:
   - `https://your-app.railway.app`
   - Copy this URL - you'll need it for frontend!

### Step 4: Verify Backend Deployment

Test your backend:
```bash
# Health check
curl https://your-app.railway.app/health

# Should return:
# {"ok":true,"service":"employee-intelligence-backend","db":"connected"}
```

---

## ▲ Part 2: Deploy Frontend to Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Railway backend URL from Part 1

### Step 1: Create Vercel Project

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import from GitHub**
   - Select your repository: `Adoflabs/project-x`
   - Vercel will auto-detect Next.js

3. **Configure Project**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

### Step 2: Add Environment Variables

In Vercel project settings → Environment Variables:

```env
# Backend API URL (from Railway)
NEXT_PUBLIC_API_BASE_URL=https://your-app.railway.app/api

# Node Environment
NODE_ENV=production
```

**Important:** Replace `your-app.railway.app` with your actual Railway URL!

### Step 3: Deploy

1. **Click "Deploy"**
   - Vercel will build and deploy
   - Takes 2-3 minutes

2. **Get Your Vercel URL**
   - After deployment: `https://your-project.vercel.app`
   - Or custom domain if configured

### Step 4: Update Railway CORS

**IMPORTANT:** Go back to Railway and update `ALLOWED_ORIGINS`:

```env
ALLOWED_ORIGINS=https://your-project.vercel.app,https://veridion.vercel.app
```

Then redeploy Railway backend.

### Step 5: Verify Frontend Deployment

1. Visit your Vercel URL
2. You should see the Veridion login page
3. Try logging in (development auto-login won't work in production)

---

## 🔧 Post-Deployment Configuration

### 1. Disable Development Auto-Login

The frontend has development auto-login enabled. For production, update:

**File:** `frontend/src/components/ProtectedRoute.tsx`

Change this:
```typescript
if (process.env.NODE_ENV === 'development') {
  // Auto-login code...
}
```

To:
```typescript
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_AUTO_LOGIN === 'true') {
  // Auto-login code...
}
```

Then in Vercel, don't set `NEXT_PUBLIC_ENABLE_AUTO_LOGIN` (or set it to 'false').

### 2. Create Test User in Database

Since auto-login is disabled, create a real user:

```bash
# Connect to your database and run:
INSERT INTO "User" (id, email, name, role, "companyId", "passwordHash")
VALUES (
  gen_random_uuid(),
  'admin@veridion.com',
  'Admin User',
  'owner',
  'your-company-id',
  'hashed-password-here'
);
```

Or use the backend API to create a user.

### 3. Set Up Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your domain (e.g., `app.veridion.com`)
3. Follow DNS configuration instructions

**Railway:**
1. Go to Service Settings → Networking
2. Add custom domain (e.g., `api.veridion.com`)
3. Update DNS records

---

## 🔍 Troubleshooting

### Backend Issues

**Problem:** Database connection fails
```
Solution: Check DATABASE_URL in Railway environment variables
Verify: curl https://your-app.railway.app/health
```

**Problem:** CORS errors
```
Solution: Update ALLOWED_ORIGINS in Railway to include your Vercel URL
Format: https://your-app.vercel.app (no trailing slash)
```

**Problem:** Build fails
```
Solution: Check Railway build logs
Common fix: Ensure package.json has "postinstall": "prisma generate"
```

### Frontend Issues

**Problem:** API calls fail
```
Solution: Check NEXT_PUBLIC_API_BASE_URL in Vercel
Should be: https://your-railway-app.railway.app/api
```

**Problem:** Build fails
```
Solution: Check Vercel build logs
Common fix: Ensure all dependencies are in package.json
Run locally: npm run build
```

**Problem:** Environment variables not working
```
Solution: Redeploy after adding environment variables
Vercel requires redeployment for env var changes
```

---

## 📊 Monitoring

### Railway Monitoring
- View logs: Railway Dashboard → Service → Logs
- Metrics: Railway Dashboard → Service → Metrics
- Alerts: Set up in Railway settings

### Vercel Monitoring
- View logs: Vercel Dashboard → Project → Logs
- Analytics: Vercel Dashboard → Project → Analytics
- Performance: Built-in Web Vitals tracking

---

## 🚀 Continuous Deployment

Both platforms support automatic deployments:

### Railway
- Automatically deploys on push to `main` branch
- Configure in: Service Settings → Source

### Vercel
- Automatically deploys on push to `main` branch
- Preview deployments for PRs
- Configure in: Project Settings → Git

---

## 📝 Environment Variables Reference

### Backend (Railway)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| NODE_ENV | Yes | production | Environment mode |
| PORT | Yes | 4000 | Server port |
| DATABASE_URL | Yes | postgresql://... | Neon database URL |
| JWT_SECRET | Yes | random-secret-key | JWT signing key |
| ENCRYPTION_SECRET | Yes | random-secret-key | Data encryption key |
| ALLOWED_ORIGINS | Yes | https://app.vercel.app | CORS allowed origins |
| EMAIL_PROVIDER | No | console | Email service provider |
| APP_BASE_URL | Yes | https://api.railway.app | Backend URL |

### Frontend (Vercel)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| NEXT_PUBLIC_API_BASE_URL | Yes | https://api.railway.app/api | Backend API URL |
| NODE_ENV | Yes | production | Environment mode |

---

## 🎯 Quick Deployment Checklist

### Before Deployment
- [ ] Merge all feature branches to main
- [ ] Test locally with `npm run build`
- [ ] Update environment variables
- [ ] Commit deployment config files

### Railway Deployment
- [ ] Create Railway project
- [ ] Connect GitHub repository
- [ ] Add environment variables
- [ ] Deploy and verify health endpoint
- [ ] Copy Railway URL

### Vercel Deployment
- [ ] Create Vercel project
- [ ] Set root directory to `frontend`
- [ ] Add NEXT_PUBLIC_API_BASE_URL with Railway URL
- [ ] Deploy and verify
- [ ] Copy Vercel URL

### Post-Deployment
- [ ] Update Railway ALLOWED_ORIGINS with Vercel URL
- [ ] Redeploy Railway backend
- [ ] Test login flow
- [ ] Test all features
- [ ] Set up custom domains (optional)
- [ ] Configure monitoring/alerts

---

## 🆘 Need Help?

### Railway Support
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### Vercel Support
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Status: https://vercel-status.com

---

## 🎉 Success!

Once deployed, your application will be live at:
- **Frontend:** https://your-project.vercel.app
- **Backend:** https://your-app.railway.app
- **API:** https://your-app.railway.app/api

Share the frontend URL with your client! 🚀
