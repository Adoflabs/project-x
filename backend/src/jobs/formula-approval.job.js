import cron from 'node-cron';

import { env } from '../config/env.js';
import { companyRepository } from '../repositories/company.repository.js';
import { configService } from '../services/config.service.js';

export function startFormulaApprovalScheduler() {
  cron.schedule(env.formulaApprovalCron, async () => {
    let companies = [];
    try {
      companies = await companyRepository.listAllCompanies();
    } catch (error) {
      console.error('[formula-approval-job] failed to fetch companies:', error.message);
      return;
    }

    let processed = 0;
    for (const company of companies) {
      try {
        await configService.autoApproveExpiredPendingChanges(company.id);
        processed++;
      } catch (error) {
        console.error(`[formula-approval-job] failed for company ${company.id}:`, error.message);
      }
    }
    console.log(`[formula-approval-job] checked ${processed}/${companies.length} companies`);
  });

  console.log(`[formula-approval-job] scheduler started with cron "${env.formulaApprovalCron}"`);
}
