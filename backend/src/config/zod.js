import { z } from 'zod';

z.setErrorMap((issue, ctx) => {
  if (issue.code === 'invalid_type') {
    return { message: `Expected ${issue.expected}, received ${issue.received}` };
  }

  if (issue.code === 'invalid_string' && issue.validation === 'uuid') {
    return { message: 'Expected a valid UUID' };
  }

  if (issue.code === 'too_small') {
    return { message: `Value is too small (minimum ${issue.minimum})` };
  }

  if (issue.code === 'too_big') {
    return { message: `Value is too large (maximum ${issue.maximum})` };
  }

  return { message: ctx.defaultError };
});
