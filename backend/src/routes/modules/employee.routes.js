import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { uuidSchema } from '../../validation/common.schemas.js';
import { employeeService } from '../../services/employee.service.js';

const bodySchema = z.object({
  companyId: uuidSchema,
  csvText: z.string().min(1),
}).strict();

export const employeeRouter = Router();

employeeRouter.post('/import-csv', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ body: bodySchema }), asyncHandler(async (req, res) => {
  const { companyId, csvText } = req.validated.body;
  const result = await employeeService.importEmployeesCsv({
    companyId,
    csvText,
    actorUserId: req.appUser.id,
  });
  res.status(201).json(result);
}));
