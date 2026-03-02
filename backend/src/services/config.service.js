import { z } from 'zod';
import crypto from 'crypto';

import { companyRepository } from '../repositories/company.repository.js';
import { auditService } from './audit.service.js';
import { createVersionedConfigUpdate } from '../engines/config-versioning.engine.js';
import { validateFormulaConfig } from '../engines/formula.engine.js';
import { notificationService } from './notification.service.js';
import { HttpError } from '../utils/http-error.js';

const formulaConfigSchema = z.object({
  components: z.array(z.object({ name: z.string().min(1), weight: z.number().min(1).max(100), scale: z.number() })).min(2).max(4),
  frequency: z.enum(['weekly', 'monthly', 'quarterly']).default('monthly'),
  customMetrics: z.array(z.string()).optional(),
});

function enforcePlanCaps(company, parsedPatch) {
  const plan = company.plan || 'starter';
  const customMetricsCount = parsedPatch.customMetrics?.length || 0;

  if (plan === 'starter' && customMetricsCount > 3) {
    throw new HttpError(403, 'Starter plan supports up to 3 custom metrics.');
  }
}

export const configService = {
  async getCompanyConfig(companyId) {
    const company = await companyRepository.getCompanyById(companyId);
    if (!company) throw new HttpError(404, 'Company not found');
    return company.config_json;
  },

  async listPendingFormulaChanges(companyId) {
    const company = await companyRepository.getCompanyById(companyId);
    if (!company) throw new HttpError(404, 'Company not found');
    const config = company.config_json || {};
    return (config.pendingFormulaChanges || []).filter((c) => c.status === 'pending');
  },


  async updateFormulaConfig({ companyId, changedBy, role, patch, reason }) {
    const company = await companyRepository.getCompanyById(companyId);
    const parsed = formulaConfigSchema.parse(patch);
    validateFormulaConfig(parsed);
    enforcePlanCaps(company, parsed);

    const previous = company.config_json || { version: 0 };

    if (role === 'manager') {
      const pendingChange = {
        id: crypto.randomUUID(),
        patch: { scorecard: parsed },
        reason,
        changedBy,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      const nextConfig = {
        ...previous,
        pendingFormulaChanges: [...(previous.pendingFormulaChanges || []), pendingChange],
      };

      const updatedPending = await companyRepository.updateCompanyConfig(companyId, nextConfig);

      await auditService.log({
        tableName: 'companies.config_json.pendingFormulaChanges',
        changedBy,
        oldValue: previous.pendingFormulaChanges || [],
        newValue: nextConfig.pendingFormulaChanges,
        reason,
      });

      await notificationService.notifyRoles(
        companyId,
        ['owner'],
        'Manager formula update pending review',
        'Manager changed formula config; auto-approval is set for 24 hours unless rejected.',
      );

      return updatedPending.config_json;
    }

    const { nextConfig } = createVersionedConfigUpdate(previous, { scorecard: parsed }, reason, changedBy);

    const updated = await companyRepository.updateCompanyConfig(companyId, nextConfig);

    await auditService.log({
      tableName: 'companies.config_json',
      changedBy,
      oldValue: company.config_json,
      newValue: nextConfig,
      reason,
    });
    return updated.config_json;
  },

  async approvePendingFormulaChange({ companyId, approverUserId, changeId }) {
    const company = await companyRepository.getCompanyById(companyId);
    const previous = company.config_json || { version: 0 };
    const pending = previous.pendingFormulaChanges || [];

    const change = pending.find((c) => c.id === changeId && c.status === 'pending');
    if (!change) {
      throw new HttpError(404, 'Pending formula change not found.');
    }

    const { nextConfig } = createVersionedConfigUpdate(previous, change.patch, change.reason, change.changedBy);
    nextConfig.pendingFormulaChanges = pending.map((c) =>
      c.id === changeId
        ? { ...c, status: 'approved', approvedBy: approverUserId, approvedAt: new Date().toISOString() }
        : c,
    );

    const updated = await companyRepository.updateCompanyConfig(companyId, nextConfig);

    await auditService.log({
      tableName: 'companies.config_json',
      changedBy: approverUserId,
      oldValue: previous,
      newValue: nextConfig,
      reason: `approve_formula_change:${changeId}`,
    });

    return updated.config_json;
  },

  async rejectPendingFormulaChange({ companyId, approverUserId, changeId, reason }) {
    const company = await companyRepository.getCompanyById(companyId);
    const previous = company.config_json || { version: 0 };
    const pending = previous.pendingFormulaChanges || [];

    const exists = pending.find((c) => c.id === changeId && c.status === 'pending');
    if (!exists) {
      throw new HttpError(404, 'Pending formula change not found.');
    }

    const nextConfig = {
      ...previous,
      pendingFormulaChanges: pending.map((c) =>
        c.id === changeId
          ? { ...c, status: 'rejected', rejectedBy: approverUserId, rejectedAt: new Date().toISOString(), rejectionReason: reason }
          : c,
      ),
    };

    const updated = await companyRepository.updateCompanyConfig(companyId, nextConfig);

    await auditService.log({
      tableName: 'companies.config_json.pendingFormulaChanges',
      changedBy: approverUserId,
      oldValue: previous.pendingFormulaChanges || [],
      newValue: nextConfig.pendingFormulaChanges,
      reason: `reject_formula_change:${changeId}`,
    });

    return updated.config_json;
  },

  async autoApproveExpiredPendingChanges(companyId) {
    const company = await companyRepository.getCompanyById(companyId);
    let current = company.config_json || { version: 0 };
    const pending = (current.pendingFormulaChanges || []).filter((c) => c.status === 'pending');

    for (const change of pending) {
      const ageMs = Date.now() - new Date(change.createdAt).getTime();
      if (ageMs < 24 * 60 * 60 * 1000) continue;

      current = await this.approvePendingFormulaChange({
        companyId,
        approverUserId: 'system_auto_approval',
        changeId: change.id,
      });
    }

    return current;
  },
};
