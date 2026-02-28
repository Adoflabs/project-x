import { prisma } from '../config/prisma.js';

export const companyRepository = {
  async listAllCompanies() {
    return prisma.company.findMany({
      select: { id: true },
    });
  },

  async getCompanyById(companyId) {
    const row = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      plan: row.plan,
      config_json: row.configJson,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    };
  },

  async updateCompanyConfig(companyId, configJson) {
    const row = await prisma.company.update({
      where: { id: companyId },
      data: { configJson },
    });

    return {
      id: row.id,
      name: row.name,
      plan: row.plan,
      config_json: row.configJson,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    };
  },
};
