import { HttpError } from '../utils/http-error.js';

function formatIssues(issues = []) {
  return issues.map((i) => ({
    path: i.path.join('.'),
    message: i.message,
    code: i.code,
  }));
}

export const validate = ({ params, query, body } = {}) => (req, res, next) => {
  const validated = {};

  if (params) {
    const parsed = params.safeParse(req.params);
    if (!parsed.success) {
      return next(new HttpError(400, 'Validation failed for route params', formatIssues(parsed.error.issues)));
    }
    validated.params = parsed.data;
  }

  if (query) {
    const parsed = query.safeParse(req.query);
    if (!parsed.success) {
      return next(new HttpError(400, 'Validation failed for query params', formatIssues(parsed.error.issues)));
    }
    validated.query = parsed.data;
  }

  if (body) {
    const parsed = body.safeParse(req.body);
    if (!parsed.success) {
      return next(new HttpError(400, 'Validation failed for request body', formatIssues(parsed.error.issues)));
    }
    validated.body = parsed.data;
  }

  req.validated = validated;
  next();
};
