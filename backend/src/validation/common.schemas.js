import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const companyIdParamSchema = z.object({ companyId: uuidSchema });
export const employeeIdParamSchema = z.object({ employeeId: uuidSchema });
export const changeIdParamSchema = z.object({ changeId: uuidSchema });
export const monthSchema = z.string().regex(/^\d{4}-\d{2}$/, 'Expected format YYYY-MM');
