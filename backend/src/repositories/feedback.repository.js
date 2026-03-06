import { prisma } from '../config/prisma.js';

export const feedbackRepository = {
  async getPeerFeedbackAverage(employeeId, fromIso, toIso) {
    const aggregate = await prisma.peerFeedback.aggregate({
      where: {
        toEmployee: employeeId,
        timestamp: {
          gte: new Date(fromIso),
          lte: new Date(toIso),
        },
      },
      _avg: {
        score: true,
      },
    });

    const avg = aggregate._avg.score;
    if (avg == null) return 0;
    return Number(Number(avg).toFixed(2));
  },

  async createFeedback({ fromEmployeeId, toEmployeeId, score }) {
    const row = await prisma.peerFeedback.create({
      data: {
        fromEmployee: fromEmployeeId,
        toEmployee: toEmployeeId,
        score,
      },
    });

    return {
      id: Number(row.id),
      from_employee: row.fromEmployee,
      to_employee: row.toEmployee,
      score: Number(row.score),
      timestamp: row.timestamp,
    };
  },

  async listFeedbackForEmployee(employeeId) {
    const rows = await prisma.peerFeedback.findMany({
      where: { toEmployee: employeeId },
      orderBy: { timestamp: 'desc' },
    });

    return rows.map((row) => ({
      id: Number(row.id),
      from_employee: row.fromEmployee,
      to_employee: row.toEmployee,
      score: Number(row.score),
      timestamp: row.timestamp,
    }));
  },
};
