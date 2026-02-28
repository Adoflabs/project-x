import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { changeIdParamSchema, companyIdParamSchema } from '../../validation/common.schemas.js';
import { configService } from '../../services/config.service.js';

const bodySchema = z.object({
  patch: z.object({
    components: z.array(z.object({ name: z.string(), weight: z.number(), scale: z.number() })),
    frequency: z.enum(['weekly', 'monthly', 'quarterly']),
    customMetrics: z.array(z.string()).optional(),
  }).strict(),
  reason: z.string().min(3),
}).strict();

const rejectBodySchema = z.object({
  reason: z.string().min(3),
}).strict();

const companyAndChangeIdParamsSchema = companyIdParamSchema.extend(changeIdParamSchema.shape);

export const configRouter = Router();

configRouter.get('/:companyId', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ params: companyIdParamSchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const config = await configService.getCompanyConfig(companyId);
  res.json({ config });
}));

configRouter.put('/:companyId/formula', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ params: companyIdParamSchema, body: bodySchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const { patch, reason } = req.validated.body;
  const updated = await configService.updateFormulaConfig({
    companyId,
    changedBy: req.appUser.id,
    role: req.appUser.role,
    patch,
    reason,
  });
  res.json({ config: updated });
}));

configRouter.post('/:companyId/formula/:changeId/approve', requireAuth, allowRoles('owner', 'hr'), validate({ params: companyAndChangeIdParamsSchema }), asyncHandler(async (req, res) => {
  const { companyId, changeId } = req.validated.params;
  const config = await configService.approvePendingFormulaChange({
    companyId,
    approverUserId: req.appUser.id,
    changeId,
  });
  res.json({ config });
}));

configRouter.post('/:companyId/formula/:changeId/reject', requireAuth, allowRoles('owner', 'hr'), validate({ params: companyAndChangeIdParamsSchema, body: rejectBodySchema }), asyncHandler(async (req, res) => {
  const { companyId, changeId } = req.validated.params;
  const { reason } = req.validated.body;
  const config = await configService.rejectPendingFormulaChange({
    companyId,
    approverUserId: req.appUser.id,
    changeId,
    reason,
  });
  res.json({ config });
}));
