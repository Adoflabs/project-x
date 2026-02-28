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
};
