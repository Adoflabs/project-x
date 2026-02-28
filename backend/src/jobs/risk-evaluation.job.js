import cron from 'node-cron';
import { env } from '../config/env.js';
import { companyRepository } from '../repositories/company.repository.js';
import { riskService } from '../services/risk.service.js';

export function startRiskEvaluationScheduler() {
  cron.schedule(env.riskEvalCron, async () => {
    const month = new Date().toISOString().slice(0, 7);
    try {
      const companies = await companyRepository.listAllCompanies();
      for (const company of companies) {
        await riskService.evaluateCompany(company.id, month, 'system_scheduler');
      }
      console.log(`[risk-job] completed for ${companies.length} companies @ ${month}`);
    } catch (error) {
      console.error('[risk-job] failed', error.message);
    }
  });

  console.log(`[risk-job] scheduler started with cron "${env.riskEvalCron}"`);
}
