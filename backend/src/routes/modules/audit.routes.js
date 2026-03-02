import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { requireCompanyAccess } from '../../middlewares/company-access.middleware.js';
import { employeeIdParamSchema, companyIdParamSchema, paginationQuerySchema } from '../../validation/common.schemas.js';
import { auditRepository } from '../../repositories/audit.repository.js';
import { employeeRepository } from '../../repositories/employee.repository.js';
import { verifyChain } from '../../engines/audit.engine.js';
import { HttpError } from '../../utils/http-error.js';

export const auditRouter = Router();

auditRouter.get('/employee/:employeeId', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ params: employeeIdParamSchema, query: paginationQuerySchema }), asyncHandler(async (req, res) => {
  const { employeeId } = req.validated.params;
  const { page, perPage } = req.validated.query;

  const emp = await employeeRepository.getById(employeeId);
  if (!emp) throw new HttpError(404, 'Employee not found');
  if (emp.company_id !== req.appUser.companyId) throw new HttpError(403, 'Access denied: company mismatch');

  const result = await auditRepository.listByEmployee(employeeId, { page, perPage });
  res.json(result);
}));

auditRouter.get('/company/:companyId/verify-chain', requireAuth, allowRoles('owner'), requireCompanyAccess, validate({ params: companyIdParamSchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const logs = await auditRepository.listForVerification(companyId);
  const result = verifyChain(logs);
  res.json(result);
}));
