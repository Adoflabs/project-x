import { prisma } from '../config/prisma.js';

export const scoreRepository = {
  async insertScore(payload) {
    const row = await prisma.score.upsert({
      where: {
        employeeId_month: {
          employeeId: payload.employee_id,
          month: payload.month,
        },
      },
      create: {
        employeeId: payload.employee_id,
        componentValues: payload.component_values,
        finalScore: payload.final_score,
        formulaVersion: payload.formula_version,
        month: payload.month,
      },
      update: {
        componentValues: payload.component_values,
        finalScore: payload.final_score,
        formulaVersion: payload.formula_version,
      },
    });

    return {
      id: Number(row.id),
      employee_id: row.employeeId,
      component_values: row.componentValues,
      final_score: Number(row.finalScore),
      formula_version: row.formulaVersion,
      month: row.month,
      created_at: row.createdAt,
    };
  },

  async getEmployeeScores(employeeId, limit = 6) {
    const rows = await prisma.score.findMany({
      where: { employeeId },
      orderBy: { month: 'desc' },
      take: limit,
    });

    return rows.map((row) => ({
      id: Number(row.id),
      employee_id: row.employeeId,
      component_values: row.componentValues,
      final_score: Number(row.finalScore),
      formula_version: row.formulaVersion,
      month: row.month,
      created_at: row.createdAt,
    }));
  },

  async listCompanyScores(companyId, month) {
    const rows = await prisma.score.findMany({
      where: {
        month,
        employee: {
          companyId,
        },
      },
      select: {
        employeeId: true,
        finalScore: true,
        month: true,
        employee: {
          select: {
            companyId: true,
            role: true,
            salary: true,
          },
        },
      },
    });

    return rows.map((row) => ({
      employee_id: row.employeeId,
      final_score: Number(row.finalScore),
      month: row.month,
      employees: {
        company_id: row.employee.companyId,
        role: row.employee.role,
        salary: row.employee.salary,
      },
    }));
  },
};
