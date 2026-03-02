import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { companyIdParamSchema, monthSchema } from '../../validation/common.schemas.js';
import { payFairnessService } from '../../services/pay-fairness.service.js';

const querySchema = z.object({
  month: monthSchema,
  groupBy: z.enum(['company', 'department', 'role']).default('company'),
  scoreTopPct: z.coerce.number().min(0).max(100).default(75),
  scoreBottomPct: z.coerce.number().min(0).max(100).default(25),
  payTopPct: z.coerce.number().min(0).max(100).default(50),
  payBottomPct: z.coerce.number().min(0).max(100).default(50),
  starsLabel: z.string().min(1).optional(),
  overpaidLabel: z.string().min(1).optional(),
});

import { requireCompanyAccess } from '../../middlewares/company-access.middleware.js';

export const payFairnessRouter = Router();

payFairnessRouter.get('/:companyId/analyze', requireAuth, allowRoles('owner', 'hr'), requireCompanyAccess, validate({ params: companyIdParamSchema, query: querySchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const parsed = req.validated.query;
  const analysis = await payFairnessService.analyze({
    companyId,
    month: parsed.month,
    groupBy: parsed.groupBy,
    thresholds: {
      scoreTopPct: parsed.scoreTopPct,
      scoreBottomPct: parsed.scoreBottomPct,
      payTopPct: parsed.payTopPct,
      payBottomPct: parsed.payBottomPct,
      starsLabel: parsed.starsLabel,
      overpaidLabel: parsed.overpaidLabel,
    },
  });
  res.json({ analysis });
}));
