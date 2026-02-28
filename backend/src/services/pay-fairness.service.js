import { runPayFairnessAnalysis } from '../engines/percentile.engine.js';
import { employeeRepository } from '../repositories/employee.repository.js';

export const payFairnessService = {
  async analyze({ companyId, month, groupBy = 'company', thresholds = {} }) {
    const rows = await employeeRepository.listCompanyEmployeeSalaryAndScores(companyId, month);

    const normalized = [];
    for (const row of rows) {
      const salary = await employeeRepository.decryptSalary(row.salaryEncrypted);
      normalized.push({
        employeeId: row.employeeId,
        score: row.score,
        salary,
        role: row.role,
        managerId: row.managerId,
      });
    }

    const grouped = new Map();
    for (const row of normalized) {
      const key =
        groupBy === 'department'
          ? row.department || 'unknown_department'
          : groupBy === 'role'
            ? row.role || 'unknown_role'
            : 'company';
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(row);
    }

    const result = {};
    for (const [key, groupRows] of grouped) {
      result[key] = runPayFairnessAnalysis(groupRows, thresholds);
    }

    return result;
  },
};
