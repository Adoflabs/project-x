import { evaluateFlightRisk } from '../engines/risk.engine.js';
import { scoreRepository } from '../repositories/score.repository.js';
import { employeeRepository } from '../repositories/employee.repository.js';
import { feedbackRepository } from '../repositories/feedback.repository.js';
import { riskRepository } from '../repositories/risk.repository.js';
import { configService } from './config.service.js';
import { notificationService } from './notification.service.js';
import { auditService } from './audit.service.js';
import { HttpError } from '../utils/http-error.js';

function getScoreDrop(history) {
  if (!history || history.length < 2) return 0;
  return Number((history[0].final_score - history[1].final_score).toFixed(2)) * -1;
}

function getMonthDateRange(month) {
  const [year, mon] = month.split('-').map(Number);
  const from = new Date(Date.UTC(year, mon - 1, 1));
  const to = new Date(Date.UTC(year, mon, 0, 23, 59, 59, 999)); // day 0 of next month = last day of this month
  return { fromIso: from.toISOString(), toIso: to.toISOString() };
}

export const riskService = {
  async evaluateCompany(companyId, month, actorUserId = 'system') {
    const config = await configService.getCompanyConfig(companyId);
    const riskConfig = config?.flightRisk || {};

    const employees = await employeeRepository.listByCompany(companyId);
    const flags = [];

    const { fromIso, toIso } = getMonthDateRange(month);

    for (const employee of employees) {
      const history = await scoreRepository.getEmployeeScores(employee.id, 2);
      const peerAvg = await feedbackRepository.getPeerFeedbackAverage(employee.id, fromIso, toIso);

      const context = {
        scoreDrop: getScoreDrop(history),
        missedCheckins: Number(employee.missed_checkins || 0),
        notes: employee.notes || '',
        peerFeedbackAvg: peerAvg,
        tenureMonths: employee.tenure_months || 0,
      };

      const result = evaluateFlightRisk(context, riskConfig);
      if (!result.flagged) continue;

      flags.push({
        employee_id: employee.id,
        reason: result.reasons.join(','),
        triggered_by: actorUserId,
        resolved_status: false,
      });
    }

    const inserted = await riskRepository.createFlags(flags);

    if (inserted.length > 0) {
      const recipients = config?.flightRisk?.alertRecipients || ['owner', 'hr'];
      await notificationService.notifyRoles(companyId, recipients, 'Flight Risk Alerts', `${inserted.length} flight-risk alerts generated.`);
    }

    return inserted;
  },

  async listOpenFlags(companyId) {
    return riskRepository.listOpenFlags(companyId);
  },

  async resolveFlag(flagId, companyId, actorUserId) {
    // Verify the flag belongs to this company before resolving
    const openFlags = await riskRepository.listOpenFlags(companyId);
    const flag = openFlags.find((f) => f.id === flagId);
    if (!flag) {
      throw new HttpError(404, 'Flag not found, already resolved, or does not belong to this company');
    }

    const updated = await riskRepository.resolveFlag(BigInt(flagId));

    await auditService.log({
      tableName: 'flight_risk_flags',
      changedBy: actorUserId,
      oldValue: { resolved_status: false },
      newValue: { resolved_status: true },
      reason: 'flag_resolved',
      employeeId: flag.employee_id,
    });

    return updated;
  },
};
