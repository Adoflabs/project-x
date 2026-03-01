import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';

async function sendEmailConsole(to, subject, body) {
  console.log('[email:console] ---');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log('---');
  return { provider: 'console', delivered: true };
}

async function sendEmailResend(to, subject, body) {
  if (!env.resendApiKey) {
    console.warn('[email:resend] RESEND_API_KEY not configured, falling back to console');
    return sendEmailConsole(to, subject, body);
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${env.emailFromName} <${env.emailFromAddress}>`,
        to: [to],
        subject,
        html: body,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await response.json();
    return { provider: 'resend', delivered: true, id: data.id };
  } catch (error) {
    console.error('[email:resend] failed:', error.message);
    return { provider: 'resend', delivered: false, error: error.message };
  }
}

async function sendEmailPostmark(to, subject, body) {
  if (!env.postmarkApiKey) {
    console.warn('[email:postmark] POSTMARK_API_KEY not configured, falling back to console');
    return sendEmailConsole(to, subject, body);
  }

  try {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': env.postmarkApiKey,
      },
      body: JSON.stringify({
        From: `${env.emailFromName} <${env.emailFromAddress}>`,
        To: to,
        Subject: subject,
        HtmlBody: body,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Postmark API error: ${error}`);
    }

    const data = await response.json();
    return { provider: 'postmark', delivered: true, id: data.MessageID };
  } catch (error) {
    console.error('[email:postmark] failed:', error.message);
    return { provider: 'postmark', delivered: false, error: error.message };
  }
}

async function sendEmail(to, subject, body) {
  const provider = env.emailProvider;

  if (provider === 'resend') {
    return sendEmailResend(to, subject, body);
  }

  if (provider === 'postmark') {
    return sendEmailPostmark(to, subject, body);
  }

  return sendEmailConsole(to, subject, body);
}

export const notificationService = {
  async notifyRoles(companyId, roles, subject, body) {
    const users = await userRepository.getUsersByCompanyAndRoles(companyId, roles);

    const results = [];
    for (const user of users) {
      if (user.email) {
        const result = await sendEmail(user.email, subject, body);
        results.push({ userId: user.id, email: user.email, ...result });
      }
    }

    return {
      delivered: results.filter((r) => r.delivered).length,
      failed: results.filter((r) => !r.delivered).length,
      results,
    };
  },
};
