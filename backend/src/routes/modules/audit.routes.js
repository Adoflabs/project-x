import { Router } from 'express';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { employeeIdParamSchema } from '../../validation/common.schemas.js';
import { auditRepository } from '../../repositories/audit.repository.js';
import { employeeRepository } from '../../repositories/employee.repository.js';
import { HttpError } from '../../utils/http-error.js';

export const auditRouter = Router();

auditRouter.get('/employee/:employeeId', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ params: employeeIdParamSchema }), asyncHandler(async (req, res) => {
  const { employeeId } = req.validated.params;

  const emp = await employeeRepository.getById(employeeId);
  if (!emp) throw new HttpError(404, 'Employee not found');
  if (emp.company_id !== req.appUser.companyId) throw new HttpError(403, 'Access denied: company mismatch');

  const logs = await auditRepository.listByEmployee(employeeId);
  res.json({ logs });
}));
