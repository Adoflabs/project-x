import crypto from 'crypto';
import { env } from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;

function getEncryptionKey() {
  if (!env.encryptionSecret) {
    throw new Error('ENCRYPTION_SECRET is not configured. Set it in backend/.env');
  }

  return crypto.scryptSync(env.encryptionSecret, 'salary-encryption-salt', 32);
}

export function encryptSalary(salaryValue) {
  if (!salaryValue) return null;

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const plaintext = String(salaryValue);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  const combined = iv.toString('hex') + authTag.toString('hex') + encrypted;
  return combined;
}

export function decryptSalary(encryptedValue) {
  if (!encryptedValue) return null;

  if (!encryptedValue.includes(':') && !isNaN(Number(encryptedValue))) {
    return Number(encryptedValue);
  }

  try {
    const key = getEncryptionKey();

    const ivHex = encryptedValue.slice(0, IV_LENGTH * 2);
    const authTagHex = encryptedValue.slice(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2);
    const encryptedHex = encryptedValue.slice((IV_LENGTH + AUTH_TAG_LENGTH) * 2);

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    return Number(decrypted);
  } catch (error) {
    const fallback = Number(encryptedValue);
    if (!isNaN(fallback)) return fallback;

    throw new Error(`Failed to decrypt salary: ${error.message}`);
  }
}
