import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';

export const authRouter = Router();

authRouter.get('/me', requireAuth, allowRoles('owner', 'hr', 'manager', 'employee'), (req, res) => {
  const { id, companyId, role, email } = req.appUser;
  res.json({ user: { id, companyId, role, email } });
});
