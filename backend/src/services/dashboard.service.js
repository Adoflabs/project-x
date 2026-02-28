import { dashboardRepository } from '../repositories/dashboard.repository.js';
import { riskRepository } from '../repositories/risk.repository.js';

export const dashboardService = {
  async getDashboardData({ userId, companyId }) {
    const layout = await dashboardRepository.getLayout(userId);
    const openFlags = await riskRepository.listOpenFlags(companyId);

    return {
      layout: layout?.widget_config_json || {
        widgets: ['alert_summary', 'score_trends', 'pay_fairness', 'team_comparison', 'activity_feed'],
        defaultRangeDays: 30,
      },
      alertSummary: {
        openRiskFlags: openFlags.length,
      },
    };
  },

  async saveLayout({ userId, widgetConfigJson }) {
    return dashboardRepository.upsertLayout(userId, widgetConfigJson);
  },
};
