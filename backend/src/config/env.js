import dotenv from 'dotenv';

dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[env] Missing ${key}. Set it in backend/.env`);
  }
}

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  encryptionSecret: process.env.ENCRYPTION_SECRET,
  riskEvalCron: process.env.RISK_EVAL_CRON || '0 3 * * *',
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:4000',
  emailProvider: process.env.EMAIL_PROVIDER || 'console',
  resendApiKey: process.env.RESEND_API_KEY,
  postmarkApiKey: process.env.POSTMARK_API_KEY,
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@employeeintel.app',
  emailFromName: process.env.EMAIL_FROM_NAME || 'Employee Intelligence',
};
