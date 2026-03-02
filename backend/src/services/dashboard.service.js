import { dashboardRepository } from '../repositories/dashboard.repository.js';
import { riskRepository } from '../repositories/risk.repository.js';
import { employeeRepository } from '../repositories/employee.repository.js';
import { scoreRepository } from '../repositories/score.repository.js';
import { companyRepository } from '../repositories/company.repository.js';
import { auditRepository } from '../repositories/audit.repository.js';

function currentMonthString() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export const dashboardService = {
  async getDashboardData({ userId, companyId }) {
    const month = currentMonthString();
    const [layout, openFlagsResult, headcount, recentScores, company, recentAuditPage] = await Promise.all([
      dashboardRepository.getLayout(userId),
      riskRepository.listFlags(companyId, { status: 'open', page: 1, perPage: 5 }),
      employeeRepository.countByCompany(companyId),
      scoreRepository.listCompanyScores(companyId, month).catch(() => []),
      companyRepository.getCompanyById(companyId),
      auditRepository.listForVerification(companyId),
    ]);

    const topRiskEmployees = openFlagsResult.data.slice(0, 5).map((f) => ({
      employee_id: f.employee_id,
      reason: f.reason,
      severity: f.severity,
    }));

    const pendingFormulaChanges = ((company?.config_json?.pendingFormulaChanges) || [])
      .filter((c) => c.status === 'pending').length;

    const recentScoresSummary = Array.isArray(recentScores)
      ? recentScores.slice(0, 10).map((s) => ({ employee_id: s.employee_id, month: s.month, final_score: s.final_score }))
      : [];

    const recentAuditActions = recentAuditPage
      .slice(-10)
      .reverse()
      .map((l) => ({ id: l.id, table_name: l.table_name, changed_by: l.changed_by, reason: l.reason, timestamp: l.timestamp }));

    return {
      layout: layout?.widget_config_json || {
        widgets: ['alert_summary', 'score_trends', 'pay_fairness', 'team_comparison', 'activity_feed'],
        defaultRangeDays: 30,
      },
      alertSummary: {
        openRiskFlags: openFlagsResult.meta.total,
        topRiskEmployees,
      },
      headcount,
      recentScores: recentScoresSummary,
      pendingFormulaChanges,
      recentAuditActions,
    };
  },

  async saveLayout({ userId, widgetConfigJson }) {
    return dashboardRepository.upsertLayout(userId, widgetConfigJson);
  },
};
