import cron from 'node-cron';

import { companyRepository } from '../repositories/company.repository.js';
import { configService } from '../services/config.service.js';

export function startFormulaApprovalScheduler() {
  cron.schedule('0 * * * *', async () => {
    try {
      const companies = await companyRepository.listAllCompanies();
      for (const company of companies) {
        await configService.autoApproveExpiredPendingChanges(company.id);
      }
      console.log(`[formula-approval-job] checked ${companies.length} companies`);
    } catch (error) {
      console.error('[formula-approval-job] failed', error.message);
    }
  });

  console.log('[formula-approval-job] scheduler started (hourly)');
}
