import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { companyIdParamSchema, monthSchema } from '../../validation/common.schemas.js';
import { riskService } from '../../services/risk.service.js';

const bodySchema = z.object({
  month: monthSchema,
}).strict();

export const riskRouter = Router();

riskRouter.post('/:companyId/evaluate', requireAuth, allowRoles('owner', 'hr'), validate({ params: companyIdParamSchema, body: bodySchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const { month } = req.validated.body;
  const flags = await riskService.evaluateCompany(companyId, month, req.appUser.id);
  res.json({ generated: flags.length, flags });
}));
