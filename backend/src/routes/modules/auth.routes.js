import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';

export const authRouter = Router();

authRouter.get('/me', requireAuth, allowRoles('owner', 'hr', 'manager', 'employee'), (req, res) => {
  res.json({ auth: req.auth, appUser: req.appUser });
});
