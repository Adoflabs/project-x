// ──── User / Auth ────
export type UserRole = "owner" | "hr" | "manager" | "employee";

export interface AppUser {
  id: string;
  companyId: string;
  role: UserRole;
  email: string;
}

// ──── Company / Config ────
export interface FormulaComponent {
  name: string;
  weight: number;
  scale: 5 | 10 | 100;
}

export interface FormulaConfig {
  components: FormulaComponent[];
  frequency: "weekly" | "monthly" | "quarterly";
  customMetrics?: string[];
}

export interface PendingChange {
  id: string;
  patch: FormulaConfig;
  reason: string;
  changedBy: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface CompanyConfig {
  formula: FormulaConfig;
  riskThresholds?: RiskThresholds;
  pendingChanges?: PendingChange[];
}

// ──── Employee ────
export interface Employee {
  id: string;
  companyId: string;
  managerId?: string;
  salary?: string;
  role?: string;
  department?: string;
  tenureMonths: number;
  missedCheckins: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Joined relations
  scores?: Score[];
  riskFlags?: FlightRiskFlag[];
  latestScore?: number;
  scoreTrend?: number;
  riskLevel?: "low" | "medium" | "high";
  // Display helpers
  name?: string;
  avatar?: string;
}

// ──── Score ────
export interface Score {
  id: number;
  employeeId: string;
  componentValues: Record<string, number>;
  finalScore: number;
  formulaVersion?: number;
  month: string;
  createdAt: string;
}

// ──── Peer Feedback ────
export interface PeerFeedback {
  id: number;
  fromEmployee: string;
  toEmployee: string;
  score: number;
  timestamp: string;
}

// ──── Flight Risk ────
export interface FlightRiskFlag {
  id: number;
  employeeId: string;
  reason: string;
  triggeredBy: string;
  resolvedStatus: boolean;
  severity: "low" | "medium" | "high";
  createdAt: string;
  employee?: Employee;
}

export interface RiskThresholds {
  scoreDropThreshold: number;
  missedCheckinsThreshold: number;
  peerFeedbackThreshold: number;
  keywords: string[];
  tenureSensitivity: boolean;
  notifyOwner: boolean;
  notifyHr: boolean;
  notifyManager: boolean;
}

// ──── Pay Fairness ────
export interface PayFairnessPoint {
  employeeId: string;
  name: string;
  role: string;
  department: string;
  scorePercentile: number;
  salaryPercentile: number;
  tenure: number;
  quadrant: "stars" | "underpaid" | "overpaid" | "underperformer";
}

export interface PayFairnessAnalysis {
  points: PayFairnessPoint[];
  thresholds: {
    scoreTopPct: number;
    scoreBottomPct: number;
    payTopPct: number;
    payBottomPct: number;
  };
  summary: {
    total: number;
    stars: number;
    underpaid: number;
    overpaid: number;
    underperformer: number;
  };
}

// ──── Audit ────
export interface AuditLog {
  id: number;
  tableName: string;
  changedBy: string;
  employeeId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  reason?: string;
  timestamp: string;
  previousHash?: string;
  hash: string;
}

// ──── Dashboard ────
export interface DashboardData {
  averageScore: number;
  employeesAtRisk: number;
  pendingRatings: number;
  feedbackDue: number;
  scoreTrends: { week: string; avg: number; deptAvg: number; atRisk: number }[];
  scoreDistribution: { name: string; value: number; color: string }[];
  recentActivity: AuditLog[];
  topPerformers: { name: string; score: number; department: string }[];
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  cols: number;
  order: number;
}

// ──── Pagination ────
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ──── Navigation ────
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
}
