import crypto from 'crypto';
import { env } from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32; // bytes prepended to ciphertext for per-encryption random salt

function deriveKey(secret, salt) {
  if (!secret) {
    throw new Error('ENCRYPTION_SECRET is not configured. Set it in backend/.env');
  }
  return crypto.scryptSync(secret, salt, 32);
}

export function encryptSalary(salaryValue) {
  if (!salaryValue) return null;

  // Generate a unique salt per encryption — protects against key-derivation rainbow tables
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(env.encryptionSecret, salt);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const plaintext = String(salaryValue);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Layout: [salt(64 hex)][iv(32 hex)][authTag(32 hex)][ciphertext]
  const combined = salt.toString('hex') + iv.toString('hex') + authTag.toString('hex') + encrypted;
  return combined;
}

export function decryptSalary(encryptedValue) {
  if (!encryptedValue) return null;

  if (!encryptedValue.includes(':') && !isNaN(Number(encryptedValue))) {
    return Number(encryptedValue);
  }

  try {
    const offset = SALT_LENGTH * 2; // hex chars for salt
    const saltHex = encryptedValue.slice(0, offset);
    const ivHex = encryptedValue.slice(offset, offset + IV_LENGTH * 2);
    const authTagHex = encryptedValue.slice(offset + IV_LENGTH * 2, offset + (IV_LENGTH + AUTH_TAG_LENGTH) * 2);
    const encryptedHex = encryptedValue.slice(offset + (IV_LENGTH + AUTH_TAG_LENGTH) * 2);

    const salt = Buffer.from(saltHex, 'hex');
    const key = deriveKey(env.encryptionSecret, salt);
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const encryptedBuf = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedBuf, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    return Number(decrypted);
  } catch (error) {
    const fallback = Number(encryptedValue);
    if (!isNaN(fallback)) return fallback;

    throw new Error(`Failed to decrypt salary: ${error.message}`);
  }
}
