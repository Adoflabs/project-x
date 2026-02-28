import { parse } from 'csv-parse/sync';

import { employeeRepository } from '../repositories/employee.repository.js';
import { auditService } from './audit.service.js';
import { HttpError } from '../utils/http-error.js';

function normalizeCsvRows(csvText, companyId) {
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records.map((r) => {
    if (!r.id) throw new HttpError(400, 'CSV row missing required field: id');

    return {
      id: r.id,
      company_id: companyId,
      manager_id: r.manager_id || null,
      salary: r.salary || null,
      role: r.role || 'employee',
      tenure_start: r.tenure_start || null,
      tenure_months: r.tenure_months ? Number(r.tenure_months) : 0,
      missed_checkins: r.missed_checkins ? Number(r.missed_checkins) : 0,
      notes: r.notes || '',
    };
  });
}

export const employeeService = {
  async importEmployeesCsv({ companyId, csvText, actorUserId }) {
    const rows = normalizeCsvRows(csvText, companyId);
    const result = await employeeRepository.upsertMany(rows);

    await auditService.log({
      tableName: 'employees',
      changedBy: actorUserId,
      oldValue: null,
      newValue: { importedCount: result.length, companyId },
      reason: 'employee_csv_import',
    });

    return {
      importedCount: result.length,
      employeeIds: result.map((x) => x.id),
    };
  },
};
