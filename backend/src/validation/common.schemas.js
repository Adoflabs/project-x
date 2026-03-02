import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const companyIdParamSchema = z.object({ companyId: uuidSchema });
export const employeeIdParamSchema = z.object({ employeeId: uuidSchema });
export const changeIdParamSchema = z.object({ changeId: uuidSchema });
export const flagIdParamSchema = z.object({ flagId: z.coerce.number().int().positive() });
export const monthSchema = z.string().regex(/^\d{4}-\d{2}$/, 'Expected format YYYY-MM');
