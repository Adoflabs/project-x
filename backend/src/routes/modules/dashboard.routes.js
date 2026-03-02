import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { requireCompanyAccess } from '../../middlewares/company-access.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { companyIdParamSchema } from '../../validation/common.schemas.js';
import { dashboardService } from '../../services/dashboard.service.js';

const bodySchema = z.object({
  widgetConfigJson: z.object({
    widgets: z.array(z.string()).min(1),
    defaultRangeDays: z.number().int().min(7).max(90),
  }),
}).strict();

export const dashboardRouter = Router();

dashboardRouter.get('/:companyId/me', requireAuth, allowRoles('owner', 'hr', 'manager'), requireCompanyAccess, validate({ params: companyIdParamSchema }), asyncHandler(async (req, res) => {
  const { companyId } = req.validated.params;
  const data = await dashboardService.getDashboardData({
    userId: req.appUser.id,
    companyId,
  });
  res.json(data);
}));

dashboardRouter.put('/layout', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ body: bodySchema }), asyncHandler(async (req, res) => {
  const { widgetConfigJson } = req.validated.body;
  const row = await dashboardService.saveLayout({ userId: req.appUser.id, widgetConfigJson });
  res.json({ layout: row.widget_config_json });
}));
