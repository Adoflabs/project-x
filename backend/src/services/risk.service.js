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
  const to = new Date(Date.UTC(year, mon, 0, 23, 59, 59, 999));
  return { fromIso: from.toISOString(), toIso: to.toISOString() };
}

export const riskService = {
  async evaluateCompany(companyId, month, actorUserId = 'system') {
    const config = await configService.getCompanyConfig(companyId);
    const riskConfig = config?.flightRisk || {};

    const { data: employees } = await employeeRepository.listByCompany(companyId, { page: 1, perPage: 500 });
    const flags = [];

    const { fromIso, toIso } = getMonthDateRange(month);

    for (const employee of employees) {
      // Skip if there is already an open flag for this employee
      const hasOpenFlag = await riskRepository.findOpenFlagForEmployee(employee.id);
      if (hasOpenFlag) continue;

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
        severity: result.severity,
      });
    }

    const inserted = await riskRepository.createFlags(flags);

    if (inserted.length > 0) {
      const recipients = config?.flightRisk?.alertRecipients || ['owner', 'hr'];
      await notificationService.notifyRoles(companyId, recipients, 'Flight Risk Alerts', `${inserted.length} flight-risk alert(s) generated for ${month}.`);
    }

    return inserted;
  },

  async listFlags(companyId, { status = 'open', page = 1, perPage = 50 } = {}) {
    return riskRepository.listFlags(companyId, { status, page, perPage });
  },

  /** @deprecated use listFlags */
  async listOpenFlags(companyId) {
    return riskRepository.listOpenFlags(companyId);
  },

  async resolveFlag(flagId, companyId, actorUserId) {
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

    await notificationService.notifyRoles(
      companyId,
      ['owner', 'hr'],
      'Flight Risk Flag Resolved',
      `Flag for employee ${flag.employee_id} (reason: ${flag.reason}) was resolved by ${actorUserId}.`,
    );

    return updated;
  },

  async bulkResolveFlags(flagIds, companyId, actorUserId) {
    // Verify all flags belong to this company (via open flags)
    const allOpen = await riskRepository.listOpenFlags(companyId);
    const ownedIds = new Set(allOpen.map((f) => f.id));
    const validIds = flagIds.filter((id) => ownedIds.has(id));

    if (validIds.length === 0) throw new HttpError(404, 'No matching open flags found for this company');

    const resolvedCount = await riskRepository.resolveManyFlags(validIds.map((id) => BigInt(id)));

    await auditService.log({
      tableName: 'flight_risk_flags',
      changedBy: actorUserId,
      oldValue: null,
      newValue: { resolvedIds: validIds },
      reason: 'bulk_flag_resolved',
    });

    return { resolved: resolvedCount, skipped: flagIds.length - validIds.length };
  },
};
