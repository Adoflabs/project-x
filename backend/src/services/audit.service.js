import { prisma } from '../config/prisma.js';
import { buildAuditHash } from '../engines/audit.engine.js';

export const auditService = {
  async log({ tableName, changedBy, oldValue, newValue, reason, employeeId }) {
    return prisma.$transaction(async (tx) => {
      // Read latest hash inside the transaction to prevent race conditions on the hash chain
      const latest = await tx.auditLog.findFirst({
        select: { hash: true },
        orderBy: { timestamp: 'desc' },
      });
      const previousHash = latest?.hash || '';

      const timestamp = new Date();
      const payload = {
        table_name: tableName,
        changed_by: changedBy,
        old_value: oldValue,
        new_value: newValue,
        reason,
        employee_id: employeeId,
        previous_hash: previousHash,
        timestamp: timestamp.toISOString(),
      };

      const hash = buildAuditHash({ previousHash, payload });

      const row = await tx.auditLog.create({
        data: {
          tableName,
          changedBy,
          employeeId: employeeId || null,
          oldValue: oldValue ?? null,
          newValue: newValue ?? null,
          reason: reason || null,
          timestamp,
          previousHash: previousHash || null,
          hash,
        },
      });

      return {
        id: Number(row.id),
        table_name: row.tableName,
        changed_by: row.changedBy,
        employee_id: row.employeeId,
        old_value: row.oldValue,
        new_value: row.newValue,
        reason: row.reason,
        timestamp: row.timestamp,
        previous_hash: row.previousHash,
        hash: row.hash,
      };
    }, { isolationLevel: 'Serializable' });
  },
};
