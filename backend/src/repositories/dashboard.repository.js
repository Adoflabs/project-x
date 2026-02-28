import { prisma } from '../config/prisma.js';

export const dashboardRepository = {
  async getLayout(userId) {
    const row = await prisma.dashboardLayout.findUnique({
      where: { userId },
    });

    if (!row) return null;

    return {
      user_id: row.userId,
      widget_config_json: row.widgetConfigJson,
      updated_at: row.updatedAt,
    };
  },

  async upsertLayout(userId, widgetConfigJson) {
    const row = await prisma.dashboardLayout.upsert({
      where: { userId },
      create: {
        userId,
        widgetConfigJson,
      },
      update: {
        widgetConfigJson,
        updatedAt: new Date(),
      },
    });

    return {
      user_id: row.userId,
      widget_config_json: row.widgetConfigJson,
      updated_at: row.updatedAt,
    };
  },
};
