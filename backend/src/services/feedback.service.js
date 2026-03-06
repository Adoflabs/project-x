import { feedbackRepository } from '../repositories/feedback.repository.js';
import { employeeRepository } from '../repositories/employee.repository.js';
import { auditService } from './audit.service.js';
import { HttpError } from '../utils/http-error.js';

export const feedbackService = {
  async submitFeedback({ fromEmployeeId, toEmployeeId, score, actorUserId }) {
    const [fromEmp, toEmp] = await Promise.all([
      employeeRepository.getById(fromEmployeeId),
      employeeRepository.getById(toEmployeeId),
    ]);

    if (!fromEmp) throw new HttpError(404, 'From-employee not found');
    if (!toEmp) throw new HttpError(404, 'To-employee not found');
    if (fromEmp.company_id !== toEmp.company_id) {
      throw new HttpError(403, 'Employees must belong to the same company');
    }
    if (fromEmployeeId === toEmployeeId) {
      throw new HttpError(400, 'An employee cannot review themselves');
    }

    const feedback = await feedbackRepository.createFeedback({ fromEmployeeId, toEmployeeId, score });

    await auditService.log({
      tableName: 'peer_feedback',
      changedBy: actorUserId,
      oldValue: null,
      newValue: feedback,
      reason: 'peer_feedback_submission',
      employeeId: toEmployeeId,
    });

    return feedback;
  },

  async getFeedbackForEmployee(employeeId) {
    return feedbackRepository.listFeedbackForEmployee(employeeId);
  },
};
