# 🚀 START HERE - Employee Intelligence Platform

## ⚡ Quick Start (Recommended)

Run the automated setup script:

```bash
./quick-setup.sh
```

This will:
1. ✅ Generate secure JWT and encryption secrets
2. ✅ Update your backend/.env file
3. ✅ Apply database migrations
4. ✅ Generate Prisma Client
5. ✅ Set up frontend environment

Then follow the instructions to start both servers.

---

## 📋 Manual Setup (Alternative)

If you prefer to do it manually, follow these steps:

### Step 1: Generate Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_SECRET  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the outputs and update `backend/.env`:
```env
JWT_SECRET=<paste-first-output-here>
ENCRYPTION_SECRET=<paste-second-output-here>
```

### Step 2: Apply Database Migration

```bash
cd backend
npx prisma migrate deploy
```

### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

### Step 4: Setup Frontend Environment

```bash
cd ../frontend
cp .env.example .env.local
```

---

## 🎯 Start the Application

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

**Expected output:**
```
🚀 Server running on http://localhost:4000
✅ Database connected
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 16.1.6
- Local: http://localhost:3000
✓ Ready in 2.5s
```

### Open Browser:
```
http://localhost:3000
```

---

## ✅ What You Should See

### Dashboard (Main Page)
- 4 animated KPI cards showing:
  - Total Score Average: 74.2
  - Employees at Risk: 13
  - Pending Ratings: 76
  - Feedback Due: 19
- Score trend chart (8-week area chart)
- Score distribution pie chart
- Recent activity feed
- Top performers leaderboard

### Navigation (Left Sidebar)
- 🏠 Dashboard
- 👥 Employees
- ⚙️ Scorecard Config
- 🚨 Flight Risk
- 💰 Pay Fairness
- 📝 Forms
- 💬 Peer Feedback
- 📄 Documentation
- 🔔 Notifications

---

## 🐛 Troubleshooting

### Backend won't start

**Check 1: Port already in use**
```bash
lsof -ti:4000 | xargs kill -9
```

**Check 2: Database connection**
```bash
cd backend
npx prisma db pull
```

**Check 3: Environment variables**
Verify `backend/.env` has valid `DATABASE_URL`

### Frontend won't start

**Check 1: Port already in use**
```bash
lsof -ti:3000 | xargs kill -9
```

**Check 2: Dependencies**
```bash
cd frontend
rm -rf node_modules .next
npm install
```

### Database migration fails

**Solution:**
1. Check your `DATABASE_URL` in `backend/.env`
2. Ensure the database is accessible
3. Try: `npx prisma migrate reset` (⚠️ This deletes all data)

### "Module not found" errors

**Solution:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
PUPPETEER_SKIP_DOWNLOAD=true npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

Once you have the app running, check these docs:

1. **SETUP_STEPS.md** - Detailed setup instructions
2. **INTEGRATION_GUIDE.md** - Connect frontend to backend API
3. **FEATURES.md** - Complete feature showcase
4. **CHECKLIST.md** - Integration checklist
5. **README.md** - Project overview

---

## 🎯 Current Status

### ✅ Working
- Frontend build successful
- Backend dependencies installed
- Database configured
- All pages created
- All components built
- Mock data working

### ⚠️ Needs Setup
- Database migration (run `npx prisma migrate deploy`)
- Secrets generation (run `./quick-setup.sh`)
- Backend server start
- Frontend server start

### 🔄 Future Integration
- Replace mock data with real API calls
- Add authentication flow
- Implement WebSocket notifications
- Add PDF export functionality

---

## 🆘 Need Help?

### Quick Commands

```bash
# Check what's running
lsof -i :3000  # Frontend
lsof -i :4000  # Backend

# View logs
cd backend && npm run dev    # Backend logs
cd frontend && npm run dev   # Frontend logs

# Database GUI
cd backend && npx prisma studio  # Opens at http://localhost:5555

# Rebuild
cd backend && npm run build
cd frontend && npm run build
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | `lsof -ti:PORT \| xargs kill -9` |
| Database error | Check `DATABASE_URL` in `.env` |
| Module not found | Delete `node_modules` and reinstall |
| Build fails | Check for TypeScript errors |
| CORS error | Backend CORS already configured |

---

## 🎉 Success Checklist

- [ ] Ran `./quick-setup.sh` OR completed manual steps
- [ ] Backend running on http://localhost:4000
- [ ] Frontend running on http://localhost:3000
- [ ] Dashboard loads with charts and data
- [ ] Can navigate to all pages
- [ ] No errors in browser console
- [ ] No errors in backend terminal

---

## 🚀 You're Ready!

Once all steps are complete:
1. ✅ Backend is running
2. ✅ Frontend is running
3. ✅ Dashboard is visible
4. ✅ All pages are accessible

**Next:** Explore the application and check out **INTEGRATION_GUIDE.md** to connect to real API data!

---

**Quick Links:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- API Health: http://localhost:4000/api/health
- Prisma Studio: http://localhost:5555 (run `npx prisma studio`)

---

**Version:** 1.0.0  
**Last Updated:** March 4, 2026  
**Status:** ✅ Ready to Run
