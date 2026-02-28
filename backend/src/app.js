import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import './config/zod.js';

import { apiRouter } from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';
import { prisma } from './config/prisma.js';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, service: 'employee-intelligence-backend', db: 'connected' });
  } catch {
    res.status(503).json({ ok: false, service: 'employee-intelligence-backend', db: 'disconnected' });
  }
});

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
