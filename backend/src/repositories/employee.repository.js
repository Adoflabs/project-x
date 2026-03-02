import { prisma } from '../config/prisma.js';

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
            tenureMonths: Number(row.tenure_months || 0),
            missedCheckins: Number(row.missed_checkins || 0),
            notes: row.notes || null,
          },
          update: {
            companyId: row.company_id,
            managerId: row.manager_id || null,
            salary: row.salary || null,
            role: row.role || 'employee',
            tenureMonths: Number(row.tenure_months || 0),
            missedCheckins: Number(row.missed_checkins || 0),
            notes: row.notes || null,
            updatedAt: new Date(),
          },
          select: {
            id: true,
          },
        }),
      ),
    );

    return upserted;
  },

  async listByCompany(companyId) {
    const rows = await prisma.employee.findMany({
      where: { companyId },
      orderBy: { createdAt: 'asc' },
    });

    return rows.map((row) => ({
      id: row.id,
      company_id: row.companyId,
      manager_id: row.managerId,
      salary: row.salary,
      role: row.role,
      tenure_months: row.tenureMonths,
      missed_checkins: row.missedCheckins,
      notes: row.notes,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    }));
  },

  async listByManager(managerId) {
    const rows = await prisma.employee.findMany({
      where: { managerId },
      orderBy: { createdAt: 'asc' },
    });

    return rows.map((row) => ({
      id: row.id,
      company_id: row.companyId,
      manager_id: row.managerId,
      salary: row.salary,
      role: row.role,
      tenure_months: row.tenureMonths,
      missed_checkins: row.missedCheckins,
      notes: row.notes,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    }));
  },

  async getById(employeeId) {
    const row = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!row) return null;

    return {
      id: row.id,
      company_id: row.companyId,
      manager_id: row.managerId,
      salary: row.salary,
      role: row.role,
      tenure_months: row.tenureMonths,
      missed_checkins: row.missedCheckins,
      notes: row.notes,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    };
  },

  async listCompanyEmployeeSalaryAndScores(companyId, month) {
    const data = await prisma.score.findMany({
      where: {
        month,
        employee: {
          companyId,
        },
      },
      select: {
        employeeId: true,
        finalScore: true,
        employee: {
          select: {
            role: true,
            salary: true,
            managerId: true,
          },
        },
      },
    });

    return (data || []).map((r) => ({
      employeeId: r.employeeId,
      role: r.employee.role,
      managerId: r.employee.managerId,
      salaryEncrypted: r.employee.salary,
      score: Number(r.finalScore),
    }));
  },

  async decryptSalary(encryptedSalary) {
    const { decryptSalary } = await import('../utils/encryption.js');
    return decryptSalary(encryptedSalary);
  },
};
