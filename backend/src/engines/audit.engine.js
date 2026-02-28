import crypto from 'crypto';

export function buildAuditHash({ previousHash = '', payload }) {
  const raw = `${previousHash}|${JSON.stringify(payload)}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}
