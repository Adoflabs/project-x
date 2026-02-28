import { prisma } from '../config/prisma.js';

export const riskRepository = {
  async createFlags(flags) {
    if (!flags.length) return [];

    const created = await prisma.$transaction(
      flags.map((flag) =>
        prisma.flightRiskFlag.create({
          data: {
            employeeId: flag.employee_id,
            reason: flag.reason,
            triggeredBy: flag.triggered_by,
            resolvedStatus: flag.resolved_status ?? false,
          },
        }),
      ),
    );

    return created.map((row) => ({
      id: Number(row.id),
      employee_id: row.employeeId,
      reason: row.reason,
      triggered_by: row.triggeredBy,
      resolved_status: row.resolvedStatus,
      created_at: row.createdAt,
    }));
  },

  async listOpenFlags(companyId) {
    const rows = await prisma.flightRiskFlag.findMany({
      where: {
        resolvedStatus: false,
        employee: {
          companyId,
        },
      },
      include: {
        employee: {
          select: {
            companyId: true,
          },
        },
      },
    });

    return rows.map((row) => ({
      id: Number(row.id),
      employee_id: row.employeeId,
      reason: row.reason,
      triggered_by: row.triggeredBy,
      resolved_status: row.resolvedStatus,
      created_at: row.createdAt,
      employees: {
        company_id: row.employee.companyId,
      },
    }));
  },
};
