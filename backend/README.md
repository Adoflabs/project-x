# Employee Intelligence Backend (MVP)

Backend-only implementation for the rule-driven analytics SaaS.

## Stack

- Node.js + Express
- PostgreSQL + Prisma ORM
- Zod for payload validation
- Puppeteer for audit PDF export
- node-cron for scheduled flight-risk checks
- Email providers: Resend or Postmark (configurable)
- AES-256-GCM encryption for sensitive data

## What is implemented

### Core Engines

- `src/engines/formula.engine.js`
  - Config validation (2–4 components, weights total 100)
  - Score normalization from scales 5/10/100
  - Manager override clamp (`-10%` to `+10%`)
  - Trend arrows (`↗ ↘ →`)
- `src/engines/risk.engine.js`
  - Rule-based flight risk triggers
  - Keyword matching
  - Tenure sensitivity toggle support
- `src/engines/percentile.engine.js`
  - Percentile ranking
  - Quadrant classification (`stars`, `overpaid`, `balanced`)
- `src/engines/config-versioning.engine.js`
  - Version increment + reason enforcement
- `src/engines/audit.engine.js`
  - SHA-256 hash generation for tamper-evident audit trail

### Services / APIs

- Formula config get/update with audit + owner notification
- Manager formula updates queued for owner/HR approval
- Auto-approval of pending manager formula changes after 24h
- Score calculation + persistence + trend
- Scheduled/manual flight risk evaluation + notification
- Pay fairness analysis with grouping options
- Dashboard layout persistence + alert summary widget data
- Employee CSV import endpoint
- Employee audit PDF export endpoint

### Auth + RBAC

- JWT token validation (`Bearer <token>`)
- Roles enforced: `owner`, `hr`, `manager`, `employee`

## API Routes

- `GET /health`
- `GET /api/auth/me`
- `GET /api/config/:companyId`
- `PUT /api/config/:companyId/formula`
- `POST /api/config/:companyId/formula/:changeId/approve`
- `POST /api/config/:companyId/formula/:changeId/reject`
- `POST /api/employees/import-csv`
- `POST /api/scores/calculate`
- `POST /api/risk/:companyId/evaluate`
- `GET /api/pay-fairness/:companyId/analyze`
- `GET /api/dashboard/:companyId/me`
- `PUT /api/dashboard/layout`
- `GET /api/docs/employee/:employeeId/export.pdf`

## Required PostgreSQL objects (DB teammate)

### Tables expected by backend

- `companies` (`id`, `name`, `plan`, `config_json`)
- `users` (`id`, `company_id`, `role`, `email`)
- `employees` (`id`, `company_id`, `manager_id`, `salary`, `role`, `tenure_months`, `missed_checkins`, `notes`)
- `scores` (`employee_id`, `component_values`, `final_score`, `formula_version`, `month`)
- `peer_feedback` (`from_employee`, `to_employee`, `score`, `timestamp`)
- `flight_risk_flags` (`employee_id`, `reason`, `triggered_by`, `resolved_status`)
- `audit_logs` (`table_name`, `changed_by`, `employee_id`, `old_value`, `new_value`, `reason`, `timestamp`, `hash`)
- `dashboard_layout` (`user_id`, `widget_config_json`)

### Config JSON additions expected

- `pendingFormulaChanges[]` in `companies.config_json`:
  - `id`, `patch`, `reason`, `changedBy`, `createdAt`, `status`
  - optional: `approvedBy`, `approvedAt`, `rejectedBy`, `rejectedAt`, `rejectionReason`

## Database encryption

Salary data is encrypted using AES-256-GCM cipher in the application layer (no PostgreSQL RPC needed).

## Plan gates implemented

- Starter (`plan=starter`) max custom metrics: `3`
- Growth can exceed starter cap (no upper cap enforced in code)

## Run

1. Fill `backend/.env`
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Create/update PostgreSQL tables from Prisma schema: `npm run prisma:push`
   - or use migrations in team/dev workflow: `npm run prisma:migrate`
5. Start API: `npm run dev`

## Notes

- Email notifications support three providers (via `EMAIL_PROVIDER` env var):
  - `console` (default) - logs to console for development
  - `resend` - uses Resend API (requires `RESEND_API_KEY`)
  - `postmark` - uses Postmark API (requires `POSTMARK_API_KEY`)
- Salary data is encrypted using AES-256-GCM (requires `ENCRYPTION_SECRET` in .env)
- Audit records are hash-chained (`previous_hash` + current payload) for stronger tamper evidence.
- Prisma schema is included at `backend/prisma/schema.prisma`.
