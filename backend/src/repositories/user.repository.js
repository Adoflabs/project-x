import { prisma } from '../config/prisma.js';

export const userRepository = {
  async getByAuthUserId(authUserId) {
    return prisma.user.findUnique({
      where: { id: authUserId },
    });
  },
};
