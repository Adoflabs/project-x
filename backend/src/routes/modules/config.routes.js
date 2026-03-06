import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { requireCompanyAccess } from '../../middlewares/company-access.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { changeIdParamSchema, companyIdParamSchema } from '../../validation/common.schemas.js';
import { configService } from '../../services/config.service.js';

const bodySchema = z.object({
  patch: z.object({
    components: z.array(z.object({
      name: z.string(),
      weight: z.number(),
      scale: z.union([z.literal(5), z.literal(10), z.literal(100)]),
    })),
    frequency: z.enum(['weekly', 'monthly', 'quarterly']),
    customMetrics: z.array(z.string()).optional(),
  }).strict().refine(
    (p) => Math.round(p.components.reduce((s, c) => s + c.weight, 0)) === 100,
    { message: 'Component weights must sum to 100', path: ['components'] },
  ),
  reason: z.string().min(3),
}).strict();

const rejectBodySchema = z.object({
  reason: z.string().min(3),
}).strict();

const companyAndChangeIdParamsSchema = companyIdParamSchema.extend(changeIdParamSchema.shape);

export const configRouter = Router();

configRouter.get('/:companyId', requireAuth, allowRoles('owner', 'hr', 'manager'), requireCompanyAccess, validate({ params: companyIdParamSchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const config = await configService.getCompanyConfig(companyId);
  res.json({ config });
}));

configRouter.get('/:companyId/formula/pending', requireAuth, allowRoles('owner', 'hr'), requireCompanyAccess, validate({ params: companyIdParamSchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const pending = await configService.listPendingFormulaChanges(companyId);
  res.json({ pending });
}));

configRouter.put('/:companyId/formula', requireAuth, allowRoles('owner', 'hr', 'manager'), requireCompanyAccess, validate({ params: companyIdParamSchema, body: bodySchema }), asyncHandler(async (req, res) => {
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

configRouter.post('/:companyId/formula/:changeId/approve', requireAuth, allowRoles('owner', 'hr'), requireCompanyAccess, validate({ params: companyAndChangeIdParamsSchema }), asyncHandler(async (req, res) => {
  const { companyId, changeId } = req.validated.params;
  const config = await configService.approvePendingFormulaChange({
    companyId,
    approverUserId: req.appUser.id,
    changeId,
  });
  res.json({ config });
}));

configRouter.post('/:companyId/formula/:changeId/reject', requireAuth, allowRoles('owner', 'hr'), requireCompanyAccess, validate({ params: companyAndChangeIdParamsSchema, body: rejectBodySchema }), asyncHandler(async (req, res) => {
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
