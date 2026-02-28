import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { monthSchema, uuidSchema } from '../../validation/common.schemas.js';
import { scoreService } from '../../services/score.service.js';

const bodySchema = z.object({
  companyId: uuidSchema,
  employeeId: uuidSchema,
  componentValues: z.record(z.string(), z.number()),
  managerOverridePct: z.number().min(-10).max(10).optional(),
  month: monthSchema,
}).strict();

export const scoreRouter = Router();

scoreRouter.post('/calculate', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ body: bodySchema }), asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const row = await scoreService.calculateAndPersist({
    ...payload,
    actorUserId: req.appUser.id,
  });
  res.status(201).json({ score: row });
}));
