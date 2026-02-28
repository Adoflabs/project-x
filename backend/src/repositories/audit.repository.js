import { prisma } from '../config/prisma.js';

export const auditRepository = {
  async getLatestHash() {
    const row = await prisma.auditLog.findFirst({
      select: { hash: true },
      orderBy: { timestamp: 'desc' },
    });

    return row?.hash || '';
  },

  async insert(log) {
    const row = await prisma.auditLog.create({
      data: {
        tableName: log.table_name,
        changedBy: log.changed_by,
        employeeId: log.employee_id || null,
        oldValue: log.old_value ?? null,
        newValue: log.new_value ?? null,
        reason: log.reason || null,
        timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
        previousHash: log.previous_hash || null,
        hash: log.hash,
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
  },

  async listByEmployee(employeeId) {
    const rows = await prisma.auditLog.findMany({
      where: { employeeId },
      orderBy: { timestamp: 'desc' },
    });

    return rows.map((row) => ({
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
    }));
  },
};
