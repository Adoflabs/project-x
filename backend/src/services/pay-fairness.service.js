import { runPayFairnessAnalysis } from '../engines/percentile.engine.js';
import { employeeRepository } from '../repositories/employee.repository.js';

export const payFairnessService = {
  async analyze({ companyId, month, groupBy = 'company', thresholds = {} }) {
    const rows = await employeeRepository.listCompanyEmployeeSalaryAndScores(companyId, month);

    const normalized = [];
    for (const row of rows) {
      const salary = await employeeRepository.decryptSalary(row.salaryEncrypted);
      if (salary == null) continue; // skip employees without salary
      normalized.push({
        employeeId: row.employeeId,
        score: row.score,
        salary,
        role: row.role,
        department: row.department,
        managerId: row.managerId,
      });
    }

    const grouped = new Map();
    for (const row of normalized) {
      let key;
      if (groupBy === 'department') {
        key = row.department || 'unknown_department';
      } else if (groupBy === 'role') {
        key = row.role || 'unknown_role';
      } else {
        key = 'company';
      }
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
