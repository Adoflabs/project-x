# Frontend-Backend Integration Guide

This guide explains how to connect the Employee Intelligence frontend with the backend API.

## 🔌 Quick Integration Steps

### 1. Start Both Services

**Terminal 1 - Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL
npx prisma migrate dev
npm run dev
# Backend runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
npm run dev
# Frontend runs on http://localhost:3000
```

### 2. Test the Connection

Open [http://localhost:3000](http://localhost:3000) and check the browser console for any API errors.

## 📡 API Client Configuration

The frontend uses a centralized API client located at `frontend/src/lib/api.ts`.

### Current Setup (Mock Data)
The frontend currently uses mock data from `frontend/src/lib/mock-data.ts` for development.

### Switching to Real API

**Step 1:** Set the API base URL in `frontend/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

**Step 2:** Update pages to use real API instead of mock data:

**Before (Mock):**
```typescript
// frontend/src/app/page.tsx
import { generateMockDashboard } from '@/lib/mock-data';

export default function DashboardPage() {
  const dashboard = generateMockDashboard();
  // ...
}
```

**After (Real API):**
```typescript
// frontend/src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { DashboardData } from '@/types';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await api.getDashboard('your-company-id');
        setDashboard(data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!dashboard) return <div>Error loading dashboard</div>;

  return (
    // ... render dashboard
  );
}
```

## 🔐 Authentication Flow

### 1. Login Page (To Be Created)

Create `frontend/src/app/login/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      api.setToken(data.token);
      setUser(data.user);
      router.push('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="glass-card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Login</h1>
        {error && <div className="text-danger mb-4">{error}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary mb-4"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary mb-4"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg bg-accent-blue hover:bg-accent-blue/90 text-white font-medium"
        >
          Login
        </button>
      </form>
    </div>
  );
}
```

### 2. Protected Routes

Create `frontend/src/components/ProtectedRoute.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { api } from '@/lib/api';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { user } = await api.getMe();
        setUser(user);
      } catch (error) {
        router.push('/login');
      }
    }
    
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, router, setUser]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
```

### 3. Update Layout

Wrap the main layout with ProtectedRoute:

```typescript
// frontend/src/app/layout.tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProtectedRoute>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-[240px]">
              <Header />
              <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
                {children}
              </main>
            </div>
          </div>
        </ProtectedRoute>
      </body>
    </html>
  );
}
```

## 🔄 Data Fetching Patterns

### Pattern 1: Client-Side Fetching (Current)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Page() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    api.getData().then(setData);
  }, []);
  
  return <div>{/* render data */}</div>;
}
```

### Pattern 2: Server-Side Fetching (Recommended for SEO)

```typescript
// app/employees/page.tsx
import { api } from '@/lib/api';

export default async function EmployeesPage() {
  const { data } = await api.listEmployees();
  
  return <EmployeeTable employees={data} />;
}
```

### Pattern 3: React Query (Best for Complex Apps)

Install:
```bash
npm install @tanstack/react-query
```

Setup:
```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

Usage:
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'company-id'],
    queryFn: () => api.getDashboard('company-id'),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* render data */}</div>;
}
```

## 🎯 Page-by-Page Integration Checklist

### ✅ Dashboard (`/`)
- [ ] Replace `generateMockDashboard()` with `api.getDashboard(companyId)`
- [ ] Add loading state
- [ ] Add error handling
- [ ] Test KPI cards update correctly
- [ ] Test charts render with real data

### ✅ Employees (`/employees`)
- [ ] Replace `generateMockEmployees()` with `api.listEmployees()`
- [ ] Implement pagination
- [ ] Connect search/filter to API
- [ ] Test employee detail drawer
- [ ] Test CSV import

### ✅ Config (`/config`)
- [ ] Load formula with `api.getConfig(companyId)`
- [ ] Connect save button to `api.updateFormula()`
- [ ] Load pending changes with `api.getPendingChanges()`
- [ ] Connect approve/reject buttons

### ✅ Risk (`/risk`)
- [ ] Replace `generateMockRiskFlags()` with `api.listRiskFlags()`
- [ ] Connect resolve/dismiss actions
- [ ] Save config changes with API
- [ ] Test real-time updates

### ✅ Pay Fairness (`/pay-fairness`)
- [ ] Replace `generatePayFairnessPoints()` with `api.analyzePayFairness()`
- [ ] Connect threshold sliders to API
- [ ] Test export functionality

### ✅ Forms (`/forms`)
- [ ] Load employees from API
- [ ] Submit ratings with `api.calculateScore()`
- [ ] Save drafts
- [ ] Test keyword detection

### ✅ Feedback (`/feedback`)
- [ ] Load pending reviews from API
- [ ] Submit feedback with `api.submitFeedback()`
- [ ] Load received feedback

### ✅ Docs (`/docs`)
- [ ] Replace `generateMockAuditLogs()` with `api.getEmployeeAudit()`
- [ ] Implement search/filter
- [ ] Connect PDF export

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors

**Problem:** Browser blocks API requests due to CORS policy.

**Solution:** Add CORS middleware in backend:

```javascript
// backend/src/app.js
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

### Issue 2: 401 Unauthorized

**Problem:** API returns 401 even after login.

**Solution:** Ensure JWT token is being sent:

```typescript
// frontend/src/lib/api.ts
private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = this.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // ... rest of request
}
```

### Issue 3: Type Mismatches

**Problem:** TypeScript errors due to API response shape differences.

**Solution:** Update types in `frontend/src/types/index.ts` to match backend responses.

### Issue 4: Hydration Errors

**Problem:** Next.js hydration mismatch errors.

**Solution:** Use `'use client'` directive and client-side data fetching for dynamic content.

## 🧪 Testing Integration

### 1. Manual Testing Checklist

- [ ] Login works and stores token
- [ ] Dashboard loads and displays data
- [ ] Employee table loads and is searchable
- [ ] Score calculation works
- [ ] Risk flags are created correctly
- [ ] Config changes are saved
- [ ] Audit log shows all changes
- [ ] Logout clears session

### 2. API Testing with curl

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  -c cookies.txt

# Get dashboard (using saved cookies)
curl http://localhost:4000/api/dashboard/company-id/me \
  -b cookies.txt

# List employees
curl http://localhost:4000/api/employees \
  -b cookies.txt
```

## 📊 Performance Optimization

### 1. Enable API Response Caching

```typescript
// frontend/src/lib/api.ts
const cache = new Map();

async request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const cacheKey = `${path}-${JSON.stringify(options)}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();
  
  cache.set(cacheKey, data);
  setTimeout(() => cache.delete(cacheKey), 60000); // 1 min cache
  
  return data;
}
```

### 2. Implement Request Debouncing

```typescript
// For search inputs
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    api.searchEmployees(query).then(setResults);
  }, 300),
  []
);
```

### 3. Use Optimistic Updates

```typescript
// Update UI immediately, rollback on error
const handleResolveFlag = async (flagId: number) => {
  // Optimistic update
  setFlags(flags.filter(f => f.id !== flagId));
  
  try {
    await api.resolveFlag(flagId);
  } catch (error) {
    // Rollback on error
    setFlags(originalFlags);
    alert('Failed to resolve flag');
  }
};
```

## 🚀 Deployment

### Production Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:pass@prod-db.example.com:5432/db
JWT_SECRET=your-production-secret-key
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://yourapp.com
```

**Frontend (.env.production):**
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourapp.com/api
```

### Health Check Endpoint

Add to backend:
```javascript
// backend/src/routes/health.js
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

Test from frontend:
```typescript
// Check if backend is reachable
const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
```

## 📚 Additional Resources

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand State Management](https://github.com/pmndrs/zustand)

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify environment variables are set correctly
4. Test API endpoints directly with curl/Postman
5. Check CORS configuration
6. Verify database connection

For more help, create an issue on GitHub with:
- Error message
- Steps to reproduce
- Browser/Node.js version
- Environment (dev/prod)
