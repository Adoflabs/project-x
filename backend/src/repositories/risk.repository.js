import { prisma } from '../config/prisma.js';
import { HttpError } from '../utils/http-error.js';

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
            severity: flag.severity || 'low',
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
      severity: row.severity,
      created_at: row.createdAt,
    }));
  },

  async findOpenFlagForEmployee(employeeId) {
    const existing = await prisma.flightRiskFlag.findFirst({
      where: { employeeId, resolvedStatus: false },
      select: { id: true },
    });
    return !!existing;
  },

  async listFlags(companyId, { status = 'open', page = 1, perPage = 50 } = {}) {
    const where = {
      employee: { companyId },
    };
    if (status === 'open') where.resolvedStatus = false;
    else if (status === 'resolved') where.resolvedStatus = true;
    // 'all' — no resolvedStatus filter

    const skip = (page - 1) * perPage;
    const [rows, total] = await prisma.$transaction([
      prisma.flightRiskFlag.findMany({
        where,
        include: { employee: { select: { companyId: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPage,
      }),
      prisma.flightRiskFlag.count({ where }),
    ]);

    return {
      data: rows.map((row) => ({
        id: Number(row.id),
        employee_id: row.employeeId,
        reason: row.reason,
        triggered_by: row.triggeredBy,
        resolved_status: row.resolvedStatus,
        severity: row.severity,
        created_at: row.createdAt,
        employee: { company_id: row.employee.companyId },
      })),
      meta: { total, page, perPage, hasMore: skip + rows.length < total },
    };
  },

  /** @deprecated use listFlags — kept for backwards compatibility */
  async listOpenFlags(companyId) {
    const { data } = await this.listFlags(companyId, { status: 'open', page: 1, perPage: 500 });
    return data;
  },

  async resolveFlag(flagId) {
    try {
      const row = await prisma.flightRiskFlag.update({
        where: { id: flagId },
        data: { resolvedStatus: true },
      });

      return {
        id: Number(row.id),
        employee_id: row.employeeId,
        reason: row.reason,
        triggered_by: row.triggeredBy,
        resolved_status: row.resolvedStatus,
        severity: row.severity,
        created_at: row.createdAt,
      };
    } catch (error) {
      if (error.code === 'P2025') throw new HttpError(404, 'Flag not found');
      throw error;
    }
  },

  async resolveManyFlags(flagIds) {
    const updated = await prisma.flightRiskFlag.updateMany({
      where: { id: { in: flagIds }, resolvedStatus: false },
      data: { resolvedStatus: true },
    });
    return updated.count;
  },
};
