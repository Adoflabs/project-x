import { Router } from 'express';

import { authRouter } from './modules/auth.routes.js';
import { configRouter } from './modules/config.routes.js';
import { scoreRouter } from './modules/score.routes.js';
import { riskRouter } from './modules/risk.routes.js';
import { payFairnessRouter } from './modules/pay-fairness.routes.js';
import { dashboardRouter } from './modules/dashboard.routes.js';
import { docsRouter } from './modules/docs.routes.js';
import { employeeRouter } from './modules/employee.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/config', configRouter);
apiRouter.use('/scores', scoreRouter);
apiRouter.use('/risk', riskRouter);
apiRouter.use('/pay-fairness', payFairnessRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/docs', docsRouter);
apiRouter.use('/employees', employeeRouter);
