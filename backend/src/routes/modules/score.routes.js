import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { requireBodyCompanyAccess } from '../../middlewares/company-access.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { monthSchema, uuidSchema, employeeIdParamSchema, companyIdParamSchema } from '../../validation/common.schemas.js';
import { scoreService } from '../../services/score.service.js';
import { scoreRepository } from '../../repositories/score.repository.js';
import { employeeRepository } from '../../repositories/employee.repository.js';
import { HttpError } from '../../utils/http-error.js';

const bodySchema = z.object({
  companyId: uuidSchema,
  employeeId: uuidSchema,
  componentValues: z.record(z.string(), z.number().min(0)),
  managerOverridePct: z.number().min(-10).max(10).optional(),
  month: monthSchema,
}).strict();

const companyScoresQuerySchema = z.object({
  month: monthSchema,
});

export const scoreRouter = Router();

scoreRouter.post('/calculate', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ body: bodySchema }), requireBodyCompanyAccess, asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const row = await scoreService.calculateAndPersist({
    ...payload,
    actorUserId: req.appUser.id,
  });
  res.status(201).json({ score: row });
}));

scoreRouter.get('/employee/:employeeId', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ params: employeeIdParamSchema }), asyncHandler(async (req, res) => {
  const { employeeId } = req.validated.params;
  const emp = await employeeRepository.getById(employeeId);
  if (!emp) throw new HttpError(404, 'Employee not found');
  if (emp.company_id !== req.appUser.companyId) throw new HttpError(403, 'Access denied: company mismatch');
  const limit = Math.min(Number(req.query.limit) || 12, 24);
  const scores = await scoreRepository.getEmployeeScores(employeeId, limit);
  res.json({ scores });
}));

scoreRouter.get('/company/:companyId', requireAuth, allowRoles('owner', 'hr'), validate({ params: companyIdParamSchema, query: companyScoresQuerySchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  if (companyId !== req.appUser.companyId) throw new HttpError(403, 'Access denied: company mismatch');
  const { month } = req.validated.query;
  const scores = await scoreRepository.listCompanyScores(companyId, month);
  res.json({ scores });
}));
