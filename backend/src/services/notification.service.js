export const notificationService = {
  async notifyRoles(companyId, roles, subject, body) {
    return {
      delivered: true,
      transport: 'placeholder',
      companyId,
      roles,
      subject,
      body,
    };
  },
};
