import { evaluateFlightRisk } from '../engines/risk.engine.js';
import { scoreRepository } from '../repositories/score.repository.js';
import { employeeRepository } from '../repositories/employee.repository.js';
import { feedbackRepository } from '../repositories/feedback.repository.js';
import { riskRepository } from '../repositories/risk.repository.js';
import { configService } from './config.service.js';
import { notificationService } from './notification.service.js';

function getScoreDrop(history) {
  if (!history || history.length < 2) return 0;
  return Number((history[0].final_score - history[1].final_score).toFixed(2)) * -1;
}

export const riskService = {
  async evaluateCompany(companyId, month, actorUserId = 'system') {
    const config = await configService.getCompanyConfig(companyId);
    const riskConfig = config?.flightRisk || {};

    const employees = await employeeRepository.listByCompany(companyId);
    const flags = [];

    const fromIso = `${month}-01T00:00:00.000Z`;
    const toIso = `${month}-31T23:59:59.999Z`;

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
};
