import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { requireCompanyAccess } from '../../middlewares/company-access.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { companyIdParamSchema, flagIdParamSchema, monthSchema, paginationQuerySchema } from '../../validation/common.schemas.js';
import { riskService } from '../../services/risk.service.js';

const bodySchema = z.object({
  month: monthSchema,
}).strict();

const flagsQuerySchema = paginationQuerySchema.extend({
  status: z.enum(['open', 'resolved', 'all']).default('open'),
});

export const riskRouter = Router();

riskRouter.post('/:companyId/evaluate', requireAuth, allowRoles('owner', 'hr'), requireCompanyAccess, validate({ params: companyIdParamSchema, body: bodySchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const { month } = req.validated.body;
  const flags = await riskService.evaluateCompany(companyId, month, req.appUser.id);
  res.json({ generated: flags.length, flags });
}));

riskRouter.get('/:companyId/flags', requireAuth, allowRoles('owner', 'hr', 'manager'), requireCompanyAccess, validate({ params: companyIdParamSchema, query: flagsQuerySchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const { status, page, perPage } = req.validated.query;
  const result = await riskService.listFlags(companyId, { status, page, perPage });
  res.json(result);
}));

riskRouter.patch('/flags/:flagId/resolve', requireAuth, allowRoles('owner', 'hr'), validate({ params: flagIdParamSchema }), asyncHandler(async (req, res) => {
  const { flagId } = req.validated.params;
  const flag = await riskService.resolveFlag(Number(flagId), req.appUser.companyId, req.appUser.id);
  res.json({ flag });
}));
