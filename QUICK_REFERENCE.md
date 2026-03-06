# 🚀 Quick Reference - Employee Intelligence Platform

## ✅ User Created Successfully!

Your test user has been created:

```
📧 Email: admin@demo.com
🔑 Role: owner
🏢 Company: Demo Company
🆔 User ID: 9f3931aa-81ed-4801-b0b7-253ec0790a23
🏢 Company ID: c7ebf8f6-4d27-4308-9c27-8fadf8983a1a
```

---

## 🎯 What to Do Next

### 1. Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 2. Access the Application

Open: **http://localhost:3000**

You'll see the login page!

---

## ⚠️ Important: Password Authentication

The current schema **doesn't have a password field**, so login won't work yet.

### Quick Fix: Bypass Authentication (Development Only)

Edit `frontend/src/components/ProtectedRoute.tsx` and add this at the start of the `checkAuth` function:

```typescript
// TEMPORARY: Auto-login for development
if (process.env.NODE_ENV === 'development') {
  setUser({
    id: '9f3931aa-81ed-4801-b0b7-253ec0790a23',
    companyId: 'c7ebf8f6-4d27-4308-9c27-8fadf8983a1a',
    role: 'owner',
    email: 'admin@demo.com',
  });
  setLoading(false);
  return;
}
```

This will automatically log you in during development!

---

## 📋 Quick Commands

### Create Another User
```bash
cd backend
node create-test-user.js
```

### View Database
```bash
cd backend
npx prisma studio
```
Opens at http://localhost:5555

### Reset Database (⚠️ Deletes all data)
```bash
cd backend
npx prisma migrate reset
```

### Check Database Status
```bash
cd backend
npx prisma migrate status
```

---

## 🔧 Troubleshooting

### Frontend shows "Demo Mode" warning
**This is normal!** It means:
- Backend is not running, OR
- Backend API doesn't have data yet

The app will work with mock data.

### Can't login
**Expected!** Password authentication isn't implemented yet.

**Solutions:**
1. Use the bypass method above (recommended for now)
2. Add password field to schema (see CREATE_USER_GUIDE.md)

### Port already in use
```bash
# Kill backend (port 4000)
lsof -ti:4000 | xargs kill -9

# Kill frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

---

## 📚 Documentation

- **START_HERE.md** - Complete setup guide
- **INTEGRATION_COMPLETE.md** - Integration details
- **CREATE_USER_GUIDE.md** - How to create users
- **INTEGRATION_GUIDE.md** - API integration guide

---

## 🎨 What You'll See

### After Bypassing Auth:

1. **Dashboard** - KPI cards, charts, activity feed
2. **Employees** - Employee table (mock data)
3. **Config** - Formula builder
4. **Risk** - Flight risk alerts
5. **Pay Fairness** - Scatter plot
6. **Forms** - Rating interface
7. **Feedback** - Peer feedback
8. **Docs** - Audit log
9. **Notifications** - Notification center

All pages work with mock data!

---

## ✅ Current Status

- ✅ Database setup complete
- ✅ Company created
- ✅ User created
- ✅ Backend ready
- ✅ Frontend ready
- ✅ Integration complete
- ⚠️ Password auth pending

---

## 🚀 Next Steps

1. **Start both servers** (see commands above)
2. **Bypass authentication** (see Quick Fix above)
3. **Explore the application**
4. **Add password field** (optional, for production)
5. **Integrate other pages** with real API

---

**You're all set! Start the servers and explore the app!** 🎉

---

**Version:** 1.0.0  
**Last Updated:** March 4, 2026
