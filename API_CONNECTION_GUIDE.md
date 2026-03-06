# API Connection Guide

## ✅ Current Status

Your backend API is **RUNNING** and **WORKING** on `http://localhost:4000`

The frontend is now **CONNECTED** to the real API!

## How It Works

### 1. **Authentication (Auto-configured for Development)**
- In development mode, you're automatically logged in
- No need to manually login
- User ID: `9f3931aa-81ed-4801-b0b7-253ec0790a23`
- Company ID: `c7ebf8f6-4d27-4308-9c27-8fadf8983a1a`

### 2. **API Connection Flow**
```
Frontend (localhost:3000) 
    ↓
API Client (frontend/src/lib/api.ts)
    ↓
Backend API (localhost:4000/api)
    ↓
PostgreSQL Database (Neon)
```

### 3. **Smart Fallback System**
The app now uses this logic:
1. **Try to fetch from API** → If successful, use real data
2. **If API returns empty** → Show mock data (because database is empty)
3. **If API fails** → Show mock data with warning banner

## Why You See "Demo Mode"

You'll see "Demo Mode" warnings because:
- ✅ Backend is running
- ✅ API connection works
- ❌ **Database is empty** (no employees added yet)

## How to Use Real Data

### Option 1: Import CSV (Easiest)
1. Go to **Employees** page
2. Click **Import CSV** button
3. Paste this sample data:
```csv
name,email,role,department,salary,managerId
Alice Chen,alice@veridion.com,Lead Dev,Engineering,145000,
Bob Smith,bob@veridion.com,Sr. Dev,Engineering,130000,
Charlie Day,charlie@veridion.com,Jr. Dev,Engineering,95000,
Diana Prince,diana@veridion.com,Sales Dir,Sales,110000,
```
4. Click **Import**
5. Refresh the page → Real data appears!

### Option 2: Use API Directly
```bash
# Add an employee
curl -X POST http://localhost:4000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "c7ebf8f6-4d27-4308-9c27-8fadf8983a1a",
    "name": "John Doe",
    "email": "john@veridion.com",
    "role": "Engineer",
    "department": "Engineering",
    "salary": 120000
  }'
```

## Available API Endpoints

All endpoints are at `http://localhost:4000/api/`

- `/health` - Check if backend is running
- `/employees` - Employee management
- `/dashboard/:companyId/me` - Dashboard data
- `/risk/:companyId/flags` - Flight risk alerts
- `/pay-fairness/:companyId/analyze` - Pay fairness analysis
- `/scores/calculate` - Calculate employee scores
- `/feedback` - Peer feedback
- `/docs/employee/:id/export.pdf` - Export PDF
- `/audit/employee/:id` - Audit logs

## Testing the Connection

### 1. Check Backend Health
```bash
curl http://localhost:4000/health
# Should return: {"ok":true,"service":"employee-intelligence-backend","db":"connected"}
```

### 2. Check Employees Endpoint
```bash
curl http://localhost:4000/api/employees
# Should return: {"data":[],"meta":{"total":0,"page":1,"perPage":50,"hasMore":false}}
```

### 3. Check Frontend Connection
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Navigate to any page in the app
4. Look for API calls to `localhost:4000`
5. Check if they return 200 OK

## What Changed

### Before (Mock Data Only):
```typescript
// Old code - always used mock data
setEmployees(generateMockEmployees(10));
setDemoMode(true);
```

### After (Real API with Fallback):
```typescript
// New code - tries API first
try {
  const { data } = await api.listEmployees();
  if (data.length === 0) {
    // Database empty, use mock
    setEmployees(generateMockEmployees(10));
    setDemoMode(true);
  } else {
    // Real data!
    setEmployees(data);
    setDemoMode(false);
  }
} catch (error) {
  // API failed, use mock
  setEmployees(generateMockEmployees(10));
  setDemoMode(true);
}
```

## Troubleshooting

### "Demo Mode" Banner Won't Go Away
- **Cause**: Database is empty
- **Fix**: Import employees via CSV or API

### API Calls Failing
```bash
# Check if backend is running
lsof -i :4000

# If not running, start it
cd backend && npm run dev
```

### CORS Errors
- Backend is configured to allow `localhost:3000`
- Check `backend/.env` → `ALLOWED_ORIGINS=http://localhost:3000`

### Database Connection Issues
- Check `backend/.env` → `DATABASE_URL` is set
- Test: `curl http://localhost:4000/health`

## Next Steps

1. **Add Real Data**: Import employees via CSV
2. **Calculate Scores**: Go to Forms page and rate employees
3. **View Analytics**: Dashboard will show real metrics
4. **Test Features**: Risk alerts, pay fairness, etc.

## Production Deployment

For production, you'll need to:
1. Remove development auth bypass in `ProtectedRoute.tsx`
2. Set up real authentication (JWT tokens)
3. Configure environment variables
4. Deploy backend and frontend separately
5. Update `NEXT_PUBLIC_API_BASE_URL` to production API URL

---

**Summary**: Your API is working! The "Demo Mode" is just because the database is empty. Add some employees and you'll see real data flowing through the entire system.
