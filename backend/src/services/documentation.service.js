import puppeteer from 'puppeteer';
import { auditRepository } from '../repositories/audit.repository.js';

function buildAuditHtml(employeeId, logs) {
  const rows = logs
    .map(
      (l) => `<tr>
      <td>${l.timestamp}</td>
      <td>${l.table_name}</td>
      <td>${l.changed_by}</td>
      <td>${l.reason || ''}</td>
      <td><code>${String(l.hash || '').slice(0, 16)}...</code></td>
    </tr>`,
    )
    .join('');

  return `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        table { border-collapse: collapse; width: 100%; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f4f4f4; }
      </style>
    </head>
    <body>
      <h1>Employee Documentation Log</h1>
      <p>Employee: ${employeeId}</p>
      <table>
        <thead>
          <tr><th>Timestamp</th><th>Table</th><th>Changed By</th><th>Reason</th><th>Integrity Hash</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
  </html>`;
}

export const documentationService = {
  async exportEmployeeAuditPdf(employeeId) {
    const logs = await auditRepository.listByEmployee(employeeId);
    const html = buildAuditHtml(employeeId, logs);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return pdfBuffer;
  },
};
