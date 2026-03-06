# Employee Intelligence Platform

A comprehensive employee performance management system with risk detection, pay fairness analysis, and configurable scoring formulas.

## 🎯 Overview

The Employee Intelligence Platform helps organizations:
- Track employee performance with customizable scoring formulas
- Detect flight risk early with automated alerts
- Analyze pay fairness across teams
- Maintain audit trails with blockchain verification
- Collect anonymous peer feedback
- Generate compliance documentation

## 🏗️ Architecture

```
employee-intelligence/
├── backend/          # Node.js + Express + Prisma + PostgreSQL
│   ├── src/
│   │   ├── engines/      # Core business logic
│   │   ├── services/     # API services
│   │   ├── routes/       # REST endpoints
│   │   ├── jobs/         # Background jobs
│   │   └── middlewares/  # Auth, RBAC, validation
│   └── prisma/           # Database schema & migrations
│
└── frontend/         # Next.js 16 + React 19 + Tailwind v4
    ├── src/
    │   ├── app/          # Pages (App Router)
    │   ├── components/   # Reusable UI components
    │   ├── lib/          # API client & utilities
    │   └── stores/       # State management (Zustand)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install

```bash
git clone <repository-url>
cd employee-intelligence

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Database

```bash
cd backend

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/employee_intelligence"

# Run migrations
npx prisma migrate dev

# (Optional) Seed with sample data
npx prisma db seed
```

### 3. Start Backend

```bash
cd backend
npm run dev
# Backend runs on http://localhost:4000
```

### 4. Start Frontend

```bash
cd frontend

# Create .env.local
cp .env.example .env.local

# Start dev server
npm run dev
# Frontend runs on http://localhost:3000
```

### 5. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Key Features

### 1. Dashboard
- Real-time KPIs (average score, at-risk count, pending actions)
- Score trend charts (8-week view)
- Score distribution analysis
- Top performers leaderboard
- Recent activity feed

### 2. Employee Scorecard
- Searchable employee table
- Score badges with color coding (green/amber/red)
- Trend indicators (↑↓)
- Risk level pills
- Detailed employee profiles

### 3. Configurable Scoring Formula
- Drag-drop formula builder
- Adjustable component weights
- Team-specific overrides (with approval workflow)
- Version history & rollback
- Audit trail for all changes

### 4. Flight Risk Detection
- Automated risk flagging based on:
  - Score drops (configurable threshold)
  - Missed check-ins
  - Low peer feedback scores
  - Keyword detection in notes
  - Tenure sensitivity
- Severity levels (high/medium/low)
- Real-time alerts
- Action workflows (1:1 scheduling, dismissal, archival)

### 5. Pay Fairness Analysis
- Interactive scatter plot (score vs salary percentiles)
- Quadrant analysis:
  - ⭐ Stars (high score, high pay)
  - ⚠️ Underpaid (high score, low pay)
  - 🔴 Overpaid (low score, high pay)
  - 📉 Underperformers (low score, low pay)
- Adjustable thresholds
- Department color coding
- Export reports

### 6. Manager Rating Forms
- Bulk rating interface
- Progress tracking
- Keyword detection for risk flags
- Auto-save drafts
- Keyboard navigation

### 7. Peer Feedback
- Anonymous submissions
- Star ratings + comments
- Aggregated results
- Due date tracking

### 8. Audit Log & Documentation
- Complete change history
- Before/after diffs
- Blockchain verification
- PDF export
- Search & filters

## 🔐 Security & Compliance

- **Authentication**: JWT-based with httpOnly cookies
- **Authorization**: Role-based access control (Owner, HR, Manager, Employee)
- **Audit Trail**: Cryptographic hashing of all changes
- **Data Encryption**: Sensitive fields encrypted at rest
- **GDPR Compliance**: Data export, anonymization, deletion

## 🎨 Design System

### Visual Style
- **Theme**: Dark glassmorphism (mission control aesthetic)
- **Colors**: Deep space navy with electric blue accents
- **Typography**: Geist (body), Geist Mono (data)
- **Animations**: Smooth transitions, count-up numbers, pulse effects

### Components
- Glass cards with backdrop blur
- Neon glow shadows
- Score badges (color-coded)
- Trend indicators
- Risk pills
- Interactive charts (Recharts)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod
- **Jobs**: Node-cron
- **Security**: bcrypt, jsonwebtoken

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard/:companyId/me` - Get dashboard data
- `PUT /api/dashboard/layout` - Save dashboard layout

### Employees
- `GET /api/employees` - List employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees/import-csv` - Bulk import

### Scores
- `POST /api/scores/calculate` - Calculate employee score
- `GET /api/scores/employee/:id` - Get employee score history
- `GET /api/scores/company/:companyId` - Get company scores

### Configuration
- `GET /api/config/:companyId` - Get company config
- `PUT /api/config/:companyId/formula` - Update formula
- `GET /api/config/:companyId/formula/pending` - Get pending changes
- `POST /api/config/:companyId/formula/:changeId/approve` - Approve change

### Risk
- `POST /api/risk/:companyId/evaluate` - Run risk evaluation
- `GET /api/risk/:companyId/flags` - List risk flags
- `PATCH /api/risk/flags/:id/resolve` - Resolve flag

### Pay Fairness
- `GET /api/pay-fairness/:companyId/analyze` - Analyze pay fairness

### Feedback
- `POST /api/feedback` - Submit peer feedback
- `GET /api/feedback/employee/:id` - Get employee feedback

### Audit
- `GET /api/audit/employee/:id` - Get employee audit log
- `GET /api/audit/company/:companyId/verify-chain` - Verify blockchain

### Documentation
- `GET /api/docs/employee/:id/export.pdf` - Export employee PDF

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Backend (Node.js)
- Deploy to: Heroku, Railway, Render, AWS ECS
- Environment variables: DATABASE_URL, JWT_SECRET, PORT
- Database: PostgreSQL (managed service recommended)

### Frontend (Next.js)
- Deploy to: Vercel, Netlify, AWS Amplify
- Environment variables: NEXT_PUBLIC_API_BASE_URL
- Build command: `npm run build`
- Output: `.next` directory

### Database Migrations
```bash
npx prisma migrate deploy
```

## 🔧 Configuration

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=your-secret-key
PORT=4000
NODE_ENV=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourapp.com/api
```

## 📈 Roadmap

- [ ] Real-time WebSocket notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Slack/Teams integration
- [ ] AI-powered insights
- [ ] Multi-language support
- [ ] Custom report builder
- [ ] API rate limiting
- [ ] Two-factor authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourorg/employee-intelligence/issues)
- Documentation: See `/backend/README.md` and `/frontend/README.md`

## 👥 Team

Built with ❤️ by the Employee Intelligence team
