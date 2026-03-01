# Employee Intelligence MVP - Complete Guide

Full-stack SaaS platform for data-driven employee management.

## 🎯 MVP Features

1. **Configurable Employee Scorecard** - Define custom scoring formulas
2. **Flight Risk Alerts** - Identify employees at risk of leaving
3. **Pay Fairness Check** - Analyze salary distribution
4. **Documentation Log** - PDF audit reports
5. **Owner Dashboard** - Company metrics overview

## 🏗️ Architecture

- **Frontend**: React 18 + Vite + React Router
- **Backend**: Node.js 20 + Express 4.21
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (no external providers)
- **Security**: AES-256-GCM salary encryption
- **Email**: Resend/Postmark/Console
- **PDF**: Puppeteer
- **Scheduled Jobs**: node-cron

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or pnpm

### 1. Database Setup

Create a PostgreSQL database and update `.env`:

```bash
# In backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/employee_intelligence"
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your settings

# Generate Prisma client and push schema
npm run prisma:generate
npm run prisma:push

# Start backend
npm start
```

Backend runs at: http://localhost:4000

### 3. Frontend Setup

```bash
cd frontend
npm install

# Copy environment template
cp .env.example .env

# Start frontend
npm run dev
```

Frontend runs at: http://localhost:3000

## 📦 Backend Structure

```
backend/
├── prisma/
│   └── schema.prisma         # Database schema
├── src/
│   ├── server.js             # Entry point
│   ├── app.js                # Express setup
│   ├── config/               # Configuration
│   ├── engines/              # Business logic engines
│   │   ├── formula.engine.js
│   │   ├── risk.engine.js
│   │   ├── percentile.engine.js
│   │   ├── config-versioning.engine.js
│   │   └── audit.engine.js
│   ├── services/             # Service layer
│   ├── repositories/         # Data access layer
│   ├── routes/               # API routes
│   ├── middlewares/          # Auth, RBAC, validation
│   ├── jobs/                 # Scheduled jobs
│   ├── utils/                # Utilities
│   └── validation/           # Zod schemas
└── package.json
```

## 📦 Frontend Structure

```
frontend/
├── src/
│   ├── components/           # Reusable components
│   ├── pages/                # Route pages (7 pages)
│   ├── lib/                  # API client + auth
│   ├── App.jsx               # Router
│   ├── main.jsx              # Entry point
│   └── styles.css            # Global styles
└── package.json
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=4000
APP_BASE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/employee_intelligence

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Encryption (for salary data)
ENCRYPTION_SECRET=your-32-char-encryption-secret!!

# Email Provider (console, resend, or postmark)
EMAIL_PROVIDER=console
EMAIL_FROM=noreply@yourcompany.com
EMAIL_FROM_NAME=Employee Intelligence

# Resend (if using)
RESEND_API_KEY=re_your_api_key

# Postmark (if using)
POSTMARK_API_KEY=your_postmark_key

# Cron Jobs
RISK_EVAL_CRON=0 3 * * *
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## 🗄️ Database Schema

8 models:
- **companies** - Company configuration
- **users** - User accounts (JWT auth)
- **employees** - Employee data (encrypted salary)
- **scores** - Performance scores
- **peer_feedback** - Feedback records
- **flight_risk_flags** - Risk alerts
- **audit_logs** - Hash-chained audit trail
- **dashboard_layout** - User dashboard config

## 🔌 API Endpoints

### Auth
- `GET /api/auth/me` - Get current user

### Config
- `GET /api/config/:companyId` - Get formula config
- `PUT /api/config/:companyId/formula` - Update formula
- `POST /api/config/:companyId/:changeId/approve` - Approve change
- `POST /api/config/:companyId/:changeId/reject` - Reject change

### Employees
- `POST /api/employees/import/csv` - Bulk CSV import

### Scores
- `POST /api/scores/calculate` - Calculate employee score

### Risk
- `POST /api/risk/:companyId/evaluate` - Run risk evaluation

### Pay Fairness
- `POST /api/pay-fairness/analyze` - Analyze salary distribution

### Dashboard
- `GET /api/dashboard/:companyId` - Get dashboard data
- `POST /api/dashboard/layout` - Save layout

### Documentation
- `GET /api/docs/employee/:employeeId` - Export PDF

## 🧪 Testing the System

### 1. Import Employees

Use the `/employees` page or API:

```bash
curl -X POST http://localhost:4000/api/employees/import/csv \
	-H "Authorization: Bearer YOUR_JWT" \
	-H "Content-Type: application/json" \
	-d '{
		"companyId": "your-company-id",
		"csvText": "id,manager_id,salary,role,tenure_months,missed_checkins,notes\n11111111-1111-1111-1111-111111111111,,80000,engineer,24,1,Good"
	}'
```

### 2. Calculate Scores

```bash
curl -X POST http://localhost:4000/api/scores/calculate \
	-H "Authorization: Bearer YOUR_JWT" \
	-H "Content-Type: application/json" \
	-d '{
		"companyId": "your-company-id",
		"employeeId": "11111111-1111-1111-1111-111111111111",
		"componentValues": {"delivery": 85, "quality": 90, "collaboration": 88},
		"month": "2026-02"
	}'
```

### 3. Evaluate Risk

```bash
curl -X POST http://localhost:4000/api/risk/your-company-id/evaluate?month=2026-02 \
	-H "Authorization: Bearer YOUR_JWT"
```

## 🔒 Security Features

- ✅ JWT authentication
- ✅ RBAC middleware
- ✅ AES-256-GCM salary encryption
- ✅ SHA-256 hash chaining for audit logs
- ✅ Helmet.js security headers
- ✅ CORS configured
- ✅ Input validation with Zod

## 📅 Scheduled Jobs

- **Risk Evaluation**: Daily at 3:00 AM
- **Formula Auto-Approval**: Hourly (after 24h waiting period)

## 🎨 Frontend Features

- ✅ Responsive design (mobile-friendly)
- ✅ Dark theme
- ✅ Protected routes
- ✅ Local state management
- ✅ API error handling
- ✅ Form validation
- ✅ PDF download
- ✅ CSV import

## 📝 TODO for Production

### Backend
- [ ] Add POST /auth/login and /auth/register endpoints
- [ ] Add refresh token support
- [ ] Add rate limiting
- [ ] Add request logging (Winston/Pino)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add database backups
- [ ] Add monitoring (Application Insights)

### Frontend
- [ ] Add data visualization charts
- [ ] Add pagination
- [ ] Add search/filters
- [ ] Add error boundaries
- [ ] Add loading skeletons
- [ ] Add toast notifications
- [ ] Add unit/E2E tests

### DevOps
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Deploy to Azure/AWS
- [ ] Set up staging environment
- [ ] Configure CDN for frontend

## 💰 Pricing

Target: **$299-499/month** for 10-50 employees

## 📄 License

Proprietary - All rights reserved

## 🤝 Support

For issues or questions, contact your development team.