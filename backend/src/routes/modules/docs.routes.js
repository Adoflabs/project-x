import { Router } from 'express';

import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { employeeIdParamSchema } from '../../validation/common.schemas.js';
import { documentationService } from '../../services/documentation.service.js';

export const docsRouter = Router();

docsRouter.get('/employee/:employeeId/export.pdf', requireAuth, allowRoles('owner', 'hr', 'manager'), validate({ params: employeeIdParamSchema }), asyncHandler(async (req, res) => {
  const { employeeId } = req.validated.params;
  const pdfBuffer = await documentationService.exportEmployeeAuditPdf(employeeId);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="employee-${employeeId}-audit.pdf"`);
  res.send(pdfBuffer);
}));
