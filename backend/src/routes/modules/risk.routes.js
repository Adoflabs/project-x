import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { requireCompanyAccess } from '../../middlewares/company-access.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { companyIdParamSchema, flagIdParamSchema, monthSchema } from '../../validation/common.schemas.js';
import { riskService } from '../../services/risk.service.js';

const bodySchema = z.object({
  month: monthSchema,
}).strict();

export const riskRouter = Router();

riskRouter.post('/:companyId/evaluate', requireAuth, allowRoles('owner', 'hr'), requireCompanyAccess, validate({ params: companyIdParamSchema, body: bodySchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const { month } = req.validated.body;
  const flags = await riskService.evaluateCompany(companyId, month, req.appUser.id);
  res.json({ generated: flags.length, flags });
}));

riskRouter.get('/:companyId/flags', requireAuth, allowRoles('owner', 'hr', 'manager'), requireCompanyAccess, validate({ params: companyIdParamSchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const flags = await riskService.listOpenFlags(companyId);
  res.json({ flags });
}));

riskRouter.patch('/flags/:flagId/resolve', requireAuth, allowRoles('owner', 'hr'), validate({ params: flagIdParamSchema }), asyncHandler(async (req, res) => {
  const { flagId } = req.validated.params;
  const flag = await riskService.resolveFlag(Number(flagId), req.appUser.companyId, req.appUser.id);
  res.json({ flag });
}));
