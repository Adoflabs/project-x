import { prisma } from '../config/prisma.js';

export const userRepository = {
  async getByAuthUserId(authUserId) {
    return prisma.user.findUnique({
      where: { id: authUserId },
    });
  },

  async getUsersByCompanyAndRoles(companyId, roles) {
    return prisma.user.findMany({
      where: {
        companyId,
        role: {
          in: roles,
        },
      },
      select: {
        id: true,
        role: true,
        email: true,
      },
    });
  },
};
