const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ei_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('ei_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ei_token');
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      throw new ApiError(res.status, error.error || error.message || 'Request failed');
    }

    if (res.headers.get('content-type')?.includes('application/pdf')) {
      return (await res.blob()) as unknown as T;
    }

    return res.json();
  }

  // ──── Auth ────
  getMe() {
    return this.request<{ user: import('@/types').AppUser }>('/auth/me');
  }

  // ──── Dashboard ────
  getDashboard(companyId: string) {
    return this.request<import('@/types').DashboardData>(`/dashboard/${companyId}/me`);
  }

  saveDashboardLayout(widgets: string[], defaultRangeDays: number) {
    return this.request('/dashboard/layout', {
      method: 'PUT',
      body: JSON.stringify({ widgetConfigJson: { widgets, defaultRangeDays } }),
    });
  }

  // ──── Employees ────
  listEmployees(params?: { page?: number; perPage?: number; managerId?: string }) {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.perPage) q.set('perPage', String(params.perPage));
    if (params?.managerId) q.set('managerId', params.managerId);
    return this.request<import('@/types').PaginatedResult<import('@/types').Employee>>(
      `/employees?${q.toString()}`
    );
  }

  getEmployee(employeeId: string) {
    return this.request<{ employee: import('@/types').Employee }>(`/employees/${employeeId}`);
  }

  importCsv(companyId: string, csvText: string) {
    return this.request('/employees/import-csv', {
      method: 'POST',
      body: JSON.stringify({ companyId, csvText }),
    });
  }

  // ──── Scores ────
  calculateScore(payload: {
    companyId: string;
    employeeId: string;
    componentValues: Record<string, number>;
    month: string;
    managerOverridePct?: number;
  }) {
    return this.request<{ score: import('@/types').Score }>('/scores/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  getEmployeeScores(employeeId: string, limit = 12) {
    return this.request<{ scores: import('@/types').Score[] }>(
      `/scores/employee/${employeeId}?limit=${limit}`
    );
  }

  getCompanyScores(companyId: string, month: string) {
    return this.request<{ scores: import('@/types').Score[] }>(
      `/scores/company/${companyId}?month=${month}`
    );
  }

  // ──── Config ────
  getConfig(companyId: string) {
    return this.request<{ config: import('@/types').CompanyConfig }>(`/config/${companyId}`);
  }

  updateFormula(companyId: string, patch: import('@/types').FormulaConfig, reason: string) {
    return this.request(`/config/${companyId}/formula`, {
      method: 'PUT',
      body: JSON.stringify({ patch, reason }),
    });
  }

  getPendingChanges(companyId: string) {
    return this.request<{ pending: import('@/types').PendingChange[] }>(
      `/config/${companyId}/formula/pending`
    );
  }

  approveChange(companyId: string, changeId: string) {
    return this.request(`/config/${companyId}/formula/${changeId}/approve`, { method: 'POST' });
  }

  rejectChange(companyId: string, changeId: string, reason: string) {
    return this.request(`/config/${companyId}/formula/${changeId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // ──── Risk ────
  evaluateRisk(companyId: string, month: string) {
    return this.request(`/risk/${companyId}/evaluate`, {
      method: 'POST',
      body: JSON.stringify({ month }),
    });
  }

  listRiskFlags(companyId: string, params?: { status?: 'open' | 'resolved' | 'all'; page?: number; perPage?: number }) {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.page) q.set('page', String(params.page));
    if (params?.perPage) q.set('perPage', String(params.perPage));
    return this.request<import('@/types').PaginatedResult<import('@/types').FlightRiskFlag>>(
      `/risk/${companyId}/flags?${q.toString()}`
    );
  }

  resolveFlag(flagId: number) {
    return this.request(`/risk/flags/${flagId}/resolve`, { method: 'PATCH' });
  }

  // ──── Pay Fairness ────
  analyzePayFairness(companyId: string, params: {
    month: string;
    groupBy?: string;
    scoreTopPct?: number;
    scoreBottomPct?: number;
    payTopPct?: number;
    payBottomPct?: number;
  }) {
    const q = new URLSearchParams();
    q.set('month', params.month);
    if (params.groupBy) q.set('groupBy', params.groupBy);
    if (params.scoreTopPct !== undefined) q.set('scoreTopPct', String(params.scoreTopPct));
    if (params.scoreBottomPct !== undefined) q.set('scoreBottomPct', String(params.scoreBottomPct));
    if (params.payTopPct !== undefined) q.set('payTopPct', String(params.payTopPct));
    if (params.payBottomPct !== undefined) q.set('payBottomPct', String(params.payBottomPct));
    return this.request<{ analysis: import('@/types').PayFairnessAnalysis }>(
      `/pay-fairness/${companyId}/analyze?${q.toString()}`
    );
  }

  // ──── Feedback ────
  submitFeedback(payload: { fromEmployeeId: string; toEmployeeId: string; score: number }) {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  getEmployeeFeedback(employeeId: string) {
    return this.request<{ feedback: import('@/types').PeerFeedback[] }>(
      `/feedback/employee/${employeeId}`
    );
  }

  // ──── Audit ────
  getEmployeeAudit(employeeId: string, params?: { page?: number; perPage?: number }) {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.perPage) q.set('perPage', String(params.perPage));
    return this.request<import('@/types').PaginatedResult<import('@/types').AuditLog>>(
      `/audit/employee/${employeeId}?${q.toString()}`
    );
  }

  verifyChain(companyId: string) {
    return this.request(`/audit/company/${companyId}/verify-chain`);
  }

  // ──── Docs ────
  exportPdf(employeeId: string) {
    return this.request<Blob>(`/docs/employee/${employeeId}/export.pdf`);
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient();
