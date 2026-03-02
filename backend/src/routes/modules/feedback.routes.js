import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { uuidSchema, employeeIdParamSchema } from '../../validation/common.schemas.js';
import { feedbackService } from '../../services/feedback.service.js';
import { employeeRepository } from '../../repositories/employee.repository.js';
import { HttpError } from '../../utils/http-error.js';

const bodySchema = z.object({
  fromEmployeeId: uuidSchema,
  toEmployeeId: uuidSchema,
  score: z.number().min(0).max(100),
}).strict();

export const feedbackRouter = Router();

feedbackRouter.post('/', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ body: bodySchema }), asyncHandler(async (req, res) => {
  const { fromEmployeeId, toEmployeeId, score } = req.validated.body;

  // Confirm the target employee belongs to the caller's company
  const toEmp = await employeeRepository.getById(toEmployeeId);
  if (!toEmp) throw new HttpError(404, 'To-employee not found');
  if (toEmp.company_id !== req.appUser.companyId) throw new HttpError(403, 'Access denied: company mismatch');

  const feedback = await feedbackService.submitFeedback({
    fromEmployeeId,
    toEmployeeId,
    score,
    actorUserId: req.appUser.id,
  });
  res.status(201).json({ feedback });
}));

feedbackRouter.get('/employee/:employeeId', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ params: employeeIdParamSchema }), asyncHandler(async (req, res) => {
  const { employeeId } = req.validated.params;

  const emp = await employeeRepository.getById(employeeId);
  if (!emp) throw new HttpError(404, 'Employee not found');
  if (emp.company_id !== req.appUser.companyId) throw new HttpError(403, 'Access denied: company mismatch');

  const feedback = await feedbackService.getFeedbackForEmployee(employeeId);
  res.json({ feedback });
}));
