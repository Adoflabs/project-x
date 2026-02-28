import { HttpError } from '../utils/http-error.js';

export function getLatestConfig(company) {
  if (!company?.config_json) {
    throw new HttpError(400, 'Company config is missing.');
  }

  return company.config_json;
}

export function createVersionedConfigUpdate(previousConfig, nextConfigPatch, reason, changedBy) {
  if (!reason?.trim()) {
    throw new HttpError(400, 'Config/formula change reason is required.');
  }

  const nextVersion = Number(previousConfig.version || 0) + 1;
  const merged = {
    ...previousConfig,
    ...nextConfigPatch,
    version: nextVersion,
    updatedAt: new Date().toISOString(),
    updatedBy: changedBy,
  };

  return {
    nextConfig: merged,
    changeMeta: {
      type: 'config_update',
      version: nextVersion,
      reason,
      changedBy,
      timestamp: new Date().toISOString(),
    },
  };
}
