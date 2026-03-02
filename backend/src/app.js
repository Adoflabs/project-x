import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import './config/zod.js';

import { apiRouter } from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';
import { prisma } from './config/prisma.js';
import { env } from './config/env.js';

export const app = express();

app.use(helmet());

const allowedOrigin = env.appBaseUrl;
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origin === allowedOrigin) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Global rate limit: 100 req / 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

// Stricter limit for compute-heavy endpoints
const heavyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded for this resource. Try again in a minute.' },
});
app.use('/api/docs', heavyLimiter);
app.use('/api/pay-fairness', heavyLimiter);
app.use('/api/risk', heavyLimiter);

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
