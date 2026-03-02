import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { requireBodyCompanyAccess } from '../../middlewares/company-access.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { uuidSchema, employeeIdParamSchema } from '../../validation/common.schemas.js';
import { employeeService } from '../../services/employee.service.js';
import { employeeRepository } from '../../repositories/employee.repository.js';
import { HttpError } from '../../utils/http-error.js';

const importBodySchema = z.object({
  companyId: uuidSchema,
  csvText: z.string().min(1).max(5 * 1024 * 1024),
}).strict();

export const employeeRouter = Router();

employeeRouter.get('/', requireAuth, allowRoles('owner', 'hr', 'manager'), asyncHandler(async (req, res) => {
  const companyId = req.appUser.companyId;
  const managerId = req.query.managerId;

  let employees;
  if (req.appUser.role === 'manager' && managerId) {
    // Managers can only see their own direct reports
    if (managerId !== req.appUser.id) throw new HttpError(403, 'Managers can only list their own direct reports');
    employees = await employeeRepository.listByManager(managerId);
  } else {
    employees = await employeeRepository.listByCompany(companyId);
  }
  res.json({ employees });
}));

employeeRouter.get('/:employeeId', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ params: employeeIdParamSchema }), asyncHandler(async (req, res) => {
  const { employeeId } = req.validated.params;
  const employee = await employeeRepository.getById(employeeId);
  if (!employee) throw new HttpError(404, 'Employee not found');
  if (employee.company_id !== req.appUser.companyId) throw new HttpError(403, 'Access denied: company mismatch');
  res.json({ employee });
}));

employeeRouter.post('/import-csv', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ body: importBodySchema }), requireBodyCompanyAccess, asyncHandler(async (req, res) => {
  const { companyId, csvText } = req.validated.body;
  const result = await employeeService.importEmployeesCsv({
    companyId,
    csvText,
    actorUserId: req.appUser.id,
  });
  res.status(201).json(result);
}));
