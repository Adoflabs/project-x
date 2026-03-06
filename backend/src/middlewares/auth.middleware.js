import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';

export async function requireAuth(req, res, next) {
  // Development bypass
  if (process.env.NODE_ENV === 'development') {
    req.auth = {
      id: '9f3931aa-81ed-4801-b0b7-253ec0790a23',
    };
    req.appUser = {
      id: '9f3931aa-81ed-4801-b0b7-253ec0790a23',
      companyId: 'c7ebf8f6-4d27-4308-9c27-8fadf8983a1a',
      role: 'owner',
      email: 'admin@demo.com',
    };
    return next();
  }

  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing bearer token'));
  }

  if (!env.jwtSecret) {
    return next(new HttpError(500, 'JWT_SECRET is not configured'));
  }

  const token = header.slice('Bearer '.length);
  try {
    const verifyOptions = {};
    if (env.jwtAudience) verifyOptions.audience = env.jwtAudience;
    if (env.jwtIssuer) verifyOptions.issuer = env.jwtIssuer;

    const payload = jwt.verify(token, env.jwtSecret, verifyOptions);
    const authUserId = payload.sub || payload.id;

    if (!authUserId) {
      return next(new HttpError(401, 'Invalid auth token payload'));
    }

    req.auth = {
      ...payload,
      id: authUserId,
    };
    next();
  } catch {
    return next(new HttpError(401, 'Invalid auth token'));
  }
}
