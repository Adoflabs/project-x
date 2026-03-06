# 🚀 Quick Deployment Guide

## TL;DR - Deploy in 10 Minutes

### 1️⃣ Deploy Backend to Railway (5 min)

```bash
# 1. Go to Railway
https://railway.app/new

# 2. Click "Deploy from GitHub repo"
# 3. Select: Adoflabs/project-x
# 4. Add these environment variables:

NODE_ENV=production
DATABASE_URL=<copy from backend/.env>
JWT_SECRET=<copy from backend/.env>
ENCRYPTION_SECRET=<copy from backend/.env>
ALLOWED_ORIGINS=https://your-app.vercel.app
APP_BASE_URL=https://your-app.railway.app

# 5. Deploy and copy your Railway URL
```

### 2️⃣ Deploy Frontend to Vercel (5 min)

```bash
# 1. Go to Vercel
https://vercel.com/new

# 2. Import from GitHub: Adoflabs/project-x
# 3. Set Root Directory: frontend
# 4. Add environment variable:

NEXT_PUBLIC_API_BASE_URL=https://your-railway-url.railway.app/api

# 5. Deploy and copy your Vercel URL
```

### 3️⃣ Update CORS (1 min)

```bash
# Go back to Railway → Environment Variables
# Update ALLOWED_ORIGINS with your Vercel URL:

ALLOWED_ORIGINS=https://your-actual-vercel-url.vercel.app

# Redeploy Railway
```

### ✅ Done!

Visit your Vercel URL and see Veridion live! 🎉

---

## 📋 Environment Variables Cheat Sheet

### Railway (Backend)
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://neondb_owner:...@ep-bold-sea-aiwjhfgk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=95cd0d6f63cf0e5258239caa60e2e6b097060922224d6975ab7c618f1413ec50
ENCRYPTION_SECRET=198163226170c3bfd994ffd4bb5896b37b11d62f99c63554cc58da62c78358e8
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
EMAIL_PROVIDER=console
EMAIL_FROM_ADDRESS=noreply@veridion.app
EMAIL_FROM_NAME=Veridion
APP_BASE_URL=https://your-railway-app.railway.app
```

### Vercel (Frontend)
```env
NEXT_PUBLIC_API_BASE_URL=https://your-railway-app.railway.app/api
NODE_ENV=production
```

---

## 🔧 Troubleshooting

### Backend not working?
```bash
# Check health endpoint
curl https://your-railway-app.railway.app/health

# Should return: {"ok":true,"service":"employee-intelligence-backend","db":"connected"}
```

### Frontend can't connect to backend?
1. Check `NEXT_PUBLIC_API_BASE_URL` in Vercel
2. Check `ALLOWED_ORIGINS` in Railway
3. Redeploy both after changes

### CORS errors?
```bash
# Railway ALLOWED_ORIGINS must match EXACTLY:
ALLOWED_ORIGINS=https://your-app.vercel.app
# No trailing slash!
# No http:// (use https://)
```

---

## 📞 Quick Links

- **Railway Dashboard:** https://railway.app/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Full Guide:** See DEPLOYMENT_GUIDE.md
- **Help:** Check troubleshooting section in DEPLOYMENT_GUIDE.md

---

## 🎯 Deployment Checklist

- [ ] Railway project created
- [ ] Backend environment variables added
- [ ] Backend deployed successfully
- [ ] Railway URL copied
- [ ] Vercel project created
- [ ] Frontend environment variable added (with Railway URL)
- [ ] Frontend deployed successfully
- [ ] Vercel URL copied
- [ ] Railway ALLOWED_ORIGINS updated with Vercel URL
- [ ] Railway redeployed
- [ ] Tested: Can access Vercel URL
- [ ] Tested: Login works
- [ ] Tested: Dashboard loads

---

**Need detailed instructions? See DEPLOYMENT_GUIDE.md**
