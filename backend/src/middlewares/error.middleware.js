import { ZodError } from 'zod';

const isProd = process.env.NODE_ENV === 'production';

export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message, code: i.code })),
    });
  }

  const status = err.status || 500;

  if (isProd && status === 500) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(err.details ? { details: err.details } : {}),
  });
};
