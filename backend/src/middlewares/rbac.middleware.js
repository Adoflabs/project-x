import { HttpError } from '../utils/http-error.js';
import { userRepository } from '../repositories/user.repository.js';

export const allowRoles = (...allowedRoles) => async (req, res, next) => {
  const authUserId = req.auth?.id;
  const user = await userRepository.getByAuthUserId(authUserId);

  if (!user) {
    return next(new HttpError(403, 'User profile not found in application context'));
  }

  req.appUser = user;

  if (!allowedRoles.includes(user.role)) {
    return next(new HttpError(403, 'Insufficient permissions'));
  }

  next();
};
