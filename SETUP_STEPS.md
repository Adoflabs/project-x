# 🚀 Employee Intelligence Platform - Setup Steps

## ✅ Issues Found & Fixed

1. ✅ **Puppeteer Download Issue** - Fixed by skipping Chrome download
2. ✅ **Backend Dependencies** - Installed successfully
3. ✅ **Frontend Build** - Verified and passing
4. ⚠️ **Database Migration** - Needs to be applied (see steps below)

---

## 📋 Manual Steps Required

### Step 1: Apply Database Migration

The database migration needs to be applied to create all tables.

```bash
cd backend
npx prisma migrate deploy
```

**Expected Output:**
```
✔ Applied migration: 20260302140922_add_department_severity
```

**Alternative (for development with seed data):**
```bash
cd backend
npx prisma migrate dev
```

This will:
- Apply the migration
- Generate Prisma Client
- Optionally seed the database

---

### Step 2: Update Backend .env Secrets

Your `.env` file has placeholder secrets. Update these for security:

**File:** `backend/.env`

```env
# Generate a strong JWT secret (32+ characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Generate a strong encryption secret (32+ characters)
ENCRYPTION_SECRET=your-super-secret-encryption-key-min-32-chars
```

**Quick way to generate secrets:**
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste into your `.env` file.

---

### Step 3: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:4000
✅ Database connected
⏰ Cron jobs scheduled
```

**Verify it's working:**
```bash
curl http://localhost:4000/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`

---

### Step 4: Start Frontend Server

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

---

### Step 5: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the **Employee Intelligence Dashboard** with:
- 4 KPI cards (animated count-up)
- Score trend chart
- Score distribution pie chart
- Recent activity feed
- Top performers list

---

## 🔧 Troubleshooting

### Issue: "Port 4000 already in use"

**Solution:**
```bash
# Find and kill the process
lsof -ti:4000 | xargs kill -9

# Or use a different port
# Edit backend/.env and change PORT=4000 to PORT=4001
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or Next.js will automatically use 3001
```

### Issue: "Database connection failed"

**Solution:**
1. Verify your `DATABASE_URL` in `backend/.env` is correct
2. Check if the database is accessible:
   ```bash
   cd backend
   npx prisma db pull
   ```
3. If using Neon.tech, ensure the database is not paused

### Issue: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
PUPPETEER_SKIP_DOWNLOAD=true npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Frontend shows "Failed to fetch"

**Solution:**
1. Ensure backend is running on port 4000
2. Check `frontend/.env.local` has:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
   ```
3. Check browser console for CORS errors
4. Verify backend CORS is configured (already done in code)

---

## 🎯 Quick Start Commands

### Terminal 1 (Backend):
```bash
cd backend
npx prisma migrate deploy  # First time only
npm run dev
```

### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Terminal 3 (Optional - Watch logs):
```bash
# Backend logs
tail -f backend/logs/*.log

# Or use PM2 for process management
npm install -g pm2
pm2 start backend/src/server.js --name "ei-backend"
pm2 logs ei-backend
```

---

## 📊 Verify Everything Works

### 1. Backend Health Check
```bash
curl http://localhost:4000/api/health
```
Expected: `{"status":"ok",...}`

### 2. Frontend Loading
Open: http://localhost:3000
Expected: Dashboard with charts and data

### 3. API Integration (Optional - for later)
```bash
# Test login endpoint
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 🎨 What You'll See

### Dashboard (http://localhost:3000)
- ✅ 4 animated KPI cards
- ✅ Score trend area chart (8 weeks)
- ✅ Score distribution pie chart
- ✅ Recent activity timeline
- ✅ Top performers leaderboard

### Navigation (Sidebar)
- 🏠 Dashboard
- 👥 Employees (searchable table)
- ⚙️ Scorecard Config (formula builder)
- 🚨 Flight Risk (alert system)
- 💰 Pay Fairness (scatter plot)
- 📝 Forms (rating interface)
- 💬 Peer Feedback
- 📄 Documentation (audit log)
- 🔔 Notifications

---

## 🔄 Next Steps (After Setup)

### 1. Create Sample Data (Optional)
```bash
cd backend
# Create a seed file or use Prisma Studio
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can:
- Add companies
- Add users
- Add employees
- Add scores

### 2. Connect Frontend to Real API

Currently, the frontend uses mock data. To connect to real API:

1. Follow the **INTEGRATION_GUIDE.md**
2. Replace mock data calls with API calls
3. Implement authentication flow

### 3. Customize Configuration

Edit these files as needed:
- `backend/.env` - Backend configuration
- `frontend/.env.local` - Frontend configuration
- `backend/prisma/schema.prisma` - Database schema
- `frontend/src/app/globals.css` - UI styling

---

## 📚 Documentation Reference

- **README.md** - Project overview
- **INTEGRATION_GUIDE.md** - Connect frontend & backend
- **FEATURES.md** - Complete feature list
- **CHECKLIST.md** - Integration checklist
- **frontend/COMPONENTS.md** - UI component library
- **backend/README.md** - Backend API documentation

---

## 🆘 Need Help?

### Common Commands

```bash
# Check if ports are in use
lsof -i :3000
lsof -i :4000

# View backend logs
cd backend && npm run dev

# View frontend logs
cd frontend && npm run dev

# Rebuild everything
cd backend && npm run build
cd frontend && npm run build

# Reset database (CAUTION: Deletes all data)
cd backend
npx prisma migrate reset
```

### Logs Location
- Backend: Console output
- Frontend: Browser console (F12)
- Database: Check Neon.tech dashboard

---

## ✅ Success Checklist

- [ ] Backend dependencies installed
- [ ] Database migration applied
- [ ] JWT_SECRET and ENCRYPTION_SECRET updated
- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] Dashboard loads with charts
- [ ] All pages accessible
- [ ] No console errors

---

## 🎉 You're Ready!

Once all steps are complete, you have a fully functional Employee Intelligence Platform running locally!

**Next:** Follow the **INTEGRATION_GUIDE.md** to connect the frontend to the backend API and replace mock data with real data.

---

**Last Updated:** March 4, 2026
**Version:** 1.0.0
