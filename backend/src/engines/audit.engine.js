import crypto from 'crypto';

/** Produce a deterministic JSON string regardless of key insertion order. */
function canonicalJSON(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(canonicalJSON).join(',')}]`;
  const sorted = Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${canonicalJSON(obj[k])}`);
  return `{${sorted.join(',')}}`;
}

export function buildAuditHash({ previousHash = '', payload }) {
  const raw = `${previousHash}|${canonicalJSON(payload)}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

/**
 * Verify the integrity of an ordered array of audit log rows.
 * Returns { valid: true, count } or { valid: false, failedAt: logId }.
 */
export function verifyChain(logs) {
  const sorted = [...logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  for (const log of sorted) {
    // Rebuild hash from the stored previous_hash and the rest of the fields
    const { hash, ...rest } = log;
    const expected = buildAuditHash({ previousHash: log.previous_hash || '', payload: rest });
    if (expected !== log.hash) return { valid: false, failedAt: log.id };
  }
  return { valid: true, count: sorted.length };
}
