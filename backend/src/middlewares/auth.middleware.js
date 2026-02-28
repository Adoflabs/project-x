import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing bearer token'));
  }

  if (!env.jwtSecret) {
    return next(new HttpError(500, 'JWT_SECRET is not configured'));
  }

  const token = header.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, env.jwtSecret);
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
