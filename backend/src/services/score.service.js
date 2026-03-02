import { calculateScore, getScoreTrend } from '../engines/formula.engine.js';
import { scoreRepository } from '../repositories/score.repository.js';
import { configService } from './config.service.js';
import { auditService } from './audit.service.js';
import { HttpError } from '../utils/http-error.js';

export const scoreService = {
  async calculateAndPersist({ companyId, employeeId, componentValues, managerOverridePct = 0, actorUserId, month }) {
    const config = await configService.getCompanyConfig(companyId);
    const formula = config?.scorecard;
    if (!formula) {
      throw new HttpError(400, 'No scoring formula configured for this company. Set up the formula via PUT /api/config/:companyId/formula first.');
    }

    const score = calculateScore(formula, componentValues, managerOverridePct);

    const row = await scoreRepository.insertScore({
      employee_id: employeeId,
      component_values: componentValues,
      final_score: score.finalScore,
      formula_version: config.version,
      month,
    });

    const history = await scoreRepository.getEmployeeScores(employeeId, 2);
    const trend = getScoreTrend(history);

    await auditService.log({
      tableName: 'scores',
      changedBy: actorUserId,
      oldValue: null,
      newValue: row,
      reason: 'score_calculation',
      employeeId,
    });

    return { ...row, trend };
  },
};
