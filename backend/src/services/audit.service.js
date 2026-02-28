import { auditRepository } from '../repositories/audit.repository.js';
import { buildAuditHash } from '../engines/audit.engine.js';

export const auditService = {
  async log({ tableName, changedBy, oldValue, newValue, reason, employeeId }) {
    const previousHash = await auditRepository.getLatestHash();

    const payload = {
      table_name: tableName,
      changed_by: changedBy,
      old_value: oldValue,
      new_value: newValue,
      reason,
      employee_id: employeeId,
      previous_hash: previousHash,
      timestamp: new Date().toISOString(),
    };

    const hash = buildAuditHash({ previousHash, payload });
    return auditRepository.insert({ ...payload, hash });
  },
};
