import { decryptSalary } from '../utils/encryption.js';
import { prisma } from '../config/prisma.js';

function mapRow(row) {
  return {
    id: row.id,
    company_id: row.companyId,
    manager_id: row.managerId,
    salary: row.salary,
    role: row.role,
    department: row.department,
    tenure_months: row.tenureMonths,
    missed_checkins: row.missedCheckins,
    notes: row.notes,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export const employeeRepository = {
  async upsertMany(rows) {
    const upserted = await prisma.$transaction(
      rows.map((row) =>
        prisma.employee.upsert({
          where: { id: row.id },
          create: {
            id: row.id,
            companyId: row.company_id,
            managerId: row.manager_id || null,
            salary: row.salary || null,
            role: row.role || 'employee',
            department: row.department || null,
            tenureMonths: Number(row.tenure_months || 0),
            missedCheckins: Number(row.missed_checkins || 0),
            notes: row.notes || null,
          },
          update: {
            companyId: row.company_id,
            managerId: row.manager_id || null,
            salary: row.salary || null,
            role: row.role || 'employee',
            department: row.department || null,
            tenureMonths: Number(row.tenure_months || 0),
            missedCheckins: Number(row.missed_checkins || 0),
            notes: row.notes || null,
            updatedAt: new Date(),
          },
          select: { id: true },
        }),
      ),
    );

    return upserted;
  },

  async listByCompany(companyId, { page = 1, perPage = 50 } = {}) {
    const skip = (page - 1) * perPage;
    const [rows, total] = await prisma.$transaction([
      prisma.employee.findMany({
        where: { companyId },
        orderBy: { createdAt: 'asc' },
        skip,
        take: perPage,
      }),
      prisma.employee.count({ where: { companyId } }),
    ]);

    return {
      data: rows.map(mapRow),
      meta: { total, page, perPage, hasMore: skip + rows.length < total },
    };
  },

  async listByManager(managerId, { page = 1, perPage = 50 } = {}) {
    const skip = (page - 1) * perPage;
    const [rows, total] = await prisma.$transaction([
      prisma.employee.findMany({
        where: { managerId },
        orderBy: { createdAt: 'asc' },
        skip,
        take: perPage,
      }),
      prisma.employee.count({ where: { managerId } }),
    ]);

    return {
      data: rows.map(mapRow),
      meta: { total, page, perPage, hasMore: skip + rows.length < total },
    };
  },

  async getById(employeeId) {
    const row = await prisma.employee.findUnique({ where: { id: employeeId } });
    return row ? mapRow(row) : null;
  },

  async countByCompany(companyId) {
    return prisma.employee.count({ where: { companyId } });
  },

  async listCompanyEmployeeSalaryAndScores(companyId, month) {
    const data = await prisma.score.findMany({
      where: {
        month,
        employee: { companyId },
      },
      select: {
        employeeId: true,
        finalScore: true,
        employee: {
          select: {
            role: true,
            department: true,
            salary: true,
            managerId: true,
          },
        },
      },
    });

    return (data || []).map((r) => ({
      employeeId: r.employeeId,
      role: r.employee.role,
      department: r.employee.department,
      managerId: r.employee.managerId,
      salaryEncrypted: r.employee.salary,
      score: Number(r.finalScore),
    }));
  },

  async decryptSalary(encryptedSalary) {
    return decryptSalary(encryptedSalary);
  },
};
