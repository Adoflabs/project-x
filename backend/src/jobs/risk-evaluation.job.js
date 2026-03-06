import cron from 'node-cron';
import { env } from '../config/env.js';
import { companyRepository } from '../repositories/company.repository.js';
import { riskService } from '../services/risk.service.js';

export function startRiskEvaluationScheduler() {
  cron.schedule(env.riskEvalCron, async () => {
    const month = new Date().toISOString().slice(0, 7);
    let companies = [];
    try {
      companies = await companyRepository.listAllCompanies();
    } catch (error) {
      console.error('[risk-job] failed to fetch companies:', error.message);
      return;
    }

    let processed = 0;
    for (const company of companies) {
      try {
        await riskService.evaluateCompany(company.id, month, 'system_scheduler');
        processed++;
      } catch (error) {
        console.error(`[risk-job] failed for company ${company.id}:`, error.message);
      }
    }
    console.log(`[risk-job] completed for ${processed}/${companies.length} companies @ ${month}`);
  });

  console.log(`[risk-job] scheduler started with cron "${env.riskEvalCron}"`);
}
