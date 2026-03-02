import { HttpError } from '../utils/http-error.js';

/**
 * Ensures :companyId param matches the authenticated user's own company.
 * Must be placed AFTER allowRoles() so that req.appUser is populated.
 */
export const requireCompanyAccess = (req, res, next) => {
  const { companyId } = req.params;
  if (!companyId) return next();

  if (req.appUser.companyId !== companyId) {
    return next(new HttpError(403, 'Access denied: company mismatch'));
  }
  next();
};

/**
 * Ensures req.validated.body.companyId matches the authenticated user's company.
 * Must be placed AFTER validate() so that req.validated is populated.
 */
export const requireBodyCompanyAccess = (req, res, next) => {
  const companyId = req.validated?.body?.companyId;
  if (companyId && req.appUser.companyId !== companyId) {
    return next(new HttpError(403, 'Access denied: company mismatch'));
  }
  next();
};
