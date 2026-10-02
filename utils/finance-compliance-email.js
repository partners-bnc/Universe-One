import { adminClient } from '@/utils/supabase/admin';

const ZEPTOMAIL_URL = 'https://api.zeptomail.in/v1.1/email';
const ZEPTOMAIL_FROM = {
  address: process.env.ZEPTOMAIL_FROM_ADDRESS || 'noreply@bncglobal.in',
  name: process.env.ZEPTOMAIL_FROM_NAME || 'BNC Global - Finance Desk',
};

export function buildComplianceEmailHtml({
  companyName,
  clientName,
  periodLabel,
  periodFull,
  itemsWithEntries = [],
  customMessage = '',
  stats = { total: 0, completed: 0, inProgress: 0, pending: 0, score: 0 }
}) {
  const rowsHtml = itemsWithEntries.map((item, idx) => {
    const status = item.status || 'Pending';
    let statusBg = '#f1f5f9';
    let statusColor = '#475569';
    let statusBorder = '#cbd5e1';

    if (status === 'Completed') {
      statusBg = '#ecfdf5';
      statusColor = '#047857';
      statusBorder = '#a7f3d0';
    } else if (status === 'In Progress') {
      statusBg = '#fefce8';
      statusColor = '#a16207';
      statusBorder = '#fef08a';
    } else if (status === 'Overdue') {
      statusBg = '#fef2f2';
      statusColor = '#b91c1c';
      statusBorder = '#fecaca';
    }

    const isEven = idx % 2 === 0;
    const rowBg = isEven ? '#ffffff' : '#f8fafc';

    return `
      <tr style="background-color: ${rowBg}; border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 12px; font-size: 12px; color: #64748b; font-weight: 600; text-align: center;">${item.s_no || idx + 1}</td>
        <td style="padding: 10px 12px; font-size: 13px; color: #0f172a; font-weight: 600;">${escapeHtml(item.compliance_nature)}</td>
        <td style="padding: 10px 12px; font-size: 12px; color: #334155;">${escapeHtml(item.statutory_due_date || '--')}</td>
        <td style="padding: 10px 12px; font-size: 12px; color: #0284c7; font-weight: 500; text-align: center;">
          <span style="background: #f0f9ff; color: #0284c7; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; border: 1px solid #bae6fd;">
            ${escapeHtml(item.frequency || 'Monthly')}
          </span>
        </td>
        <td style="padding: 10px 12px; font-size: 12px; color: #475569;">${escapeHtml(item.internal_control_due_date || '--')}</td>
        <td style="padding: 10px 12px; font-size: 12px; color: #0f172a; font-weight: 500;">${escapeHtml(item.actual_payment_date || '--')}</td>
        <td style="padding: 10px 12px; text-align: center;">
          <span style="background-color: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusBorder}; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">
            ${status}
          </span>
        </td>
        <td style="padding: 10px 12px; font-size: 12px; color: #64748b; max-width: 220px;">${escapeHtml(item.remarks || '--')}</td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compliance Calendar - ${escapeHtml(companyName)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 900px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
          
          <!-- Top Header Banner (#0372CC Theme) -->
          <tr>
            <td style="background: linear-gradient(135deg, #0372CC 0%, #02599f 100%); padding: 32px 36px; text-align: left;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.35); border-radius: 9999px; padding: 4px 14px; font-size: 11px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">
                      Statutory Compliance Report
                    </div>
                    <h1 style="margin: 6px 0 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">
                      ${escapeHtml(companyName)}
                    </h1>
                    <p style="margin: 6px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                      Compliance Tracking Period: <strong style="color: #ffffff;">${escapeHtml(periodFull)} (${escapeHtml(periodLabel)})</strong>
                    </p>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <div style="background-color: #ffffff; color: #0f172a; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; text-align: center; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                      <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Health Score</div>
                      <div style="font-size: 20px; color: #0372CC; font-weight: 800;">${stats.score}%</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Summary Metric Pills -->
          <tr>
            <td style="padding: 20px 36px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="font-size: 13px; color: #475569;">
                    Dear <strong>${escapeHtml(clientName || 'Valued Client')}</strong>, please find below the detailed compliance tracking statement for <strong>${escapeHtml(periodFull)}</strong>.
                  </td>
                </tr>
                ${customMessage ? `
                <tr>
                  <td style="padding-top: 12px;">
                    <div style="background-color: #f0f7ff; border-left: 4px solid #0372CC; padding: 10px 14px; border-radius: 4px; font-size: 13px; color: #0c4a6e; line-height: 1.5;">
                      <strong style="color: #0372CC;">Note from Finance Team:</strong> ${escapeHtml(customMessage)}
                    </div>
                  </td>
                </tr>` : ''}
              </table>

              <!-- KPI Badges Row -->
              <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 18px;">
                <tr>
                  <td width="25%" style="padding-right: 8px;">
                    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
                      <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">Total Compliances</div>
                      <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 2px;">${stats.total}</div>
                    </div>
                  </td>
                  <td width="25%" style="padding: 0 4px;">
                    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px; text-align: center;">
                      <div style="font-size: 11px; color: #047857; text-transform: uppercase; font-weight: 600;">Completed</div>
                      <div style="font-size: 18px; font-weight: 800; color: #047857; margin-top: 2px;">${stats.completed}</div>
                    </div>
                  </td>
                  <td width="25%" style="padding: 0 4px;">
                    <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 10px; text-align: center;">
                      <div style="font-size: 11px; color: #a16207; text-transform: uppercase; font-weight: 600;">In Progress</div>
                      <div style="font-size: 18px; font-weight: 800; color: #a16207; margin-top: 2px;">${stats.inProgress}</div>
                    </div>
                  </td>
                  <td width="25%" style="padding-left: 8px;">
                    <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; text-align: center;">
                      <div style="font-size: 11px; color: #475569; text-transform: uppercase; font-weight: 600;">Pending / Next</div>
                      <div style="font-size: 18px; font-weight: 800; color: #475569; margin-top: 2px;">${stats.pending}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Compliance Table (#0372CC Table Header) -->
          <tr>
            <td style="padding: 24px 36px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #0372CC; color: #ffffff;">
                    <th style="padding: 12px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; border-right: 1px solid rgba(255, 255, 255, 0.25);">S.No</th>
                    <th style="padding: 12px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; border-right: 1px solid rgba(255, 255, 255, 0.25);">Compliance Nature</th>
                    <th style="padding: 12px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; border-right: 1px solid rgba(255, 255, 255, 0.25);">Statutory Due</th>
                    <th style="padding: 12px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; border-right: 1px solid rgba(255, 255, 255, 0.25);">Frequency</th>
                    <th style="padding: 12px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; border-right: 1px solid rgba(255, 255, 255, 0.25);">Internal Due</th>
                    <th style="padding: 12px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; border-right: 1px solid rgba(255, 255, 255, 0.25);">Actual Date</th>
                    <th style="padding: 12px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; border-right: 1px solid rgba(255, 255, 255, 0.25);">Status</th>
                    <th style="padding: 12px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: left;">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
              <p style="margin: 0 0 6px;">This is an automated compliance report generated by <strong>Universe One Finance Module</strong>.</p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">&copy; ${new Date().getFullYear()} BNC Global. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendComplianceReportEmail({
  recipientEmail,
  recipientName,
  subject,
  htmlBody,
}) {
  const token =
    process.env.ZOHO_TOKEN ||
    process.env.ZEPTOMAIL_TOKEN ||
    process.env.ZEPTOMAIL_API_KEY ||
    process.env.ZEPTO_MAIL_TOKEN;

  if (!token) {
    console.warn('ZEPTOMAIL / ZOHO token missing in environment. Email simulated.');
    return { success: true, simulated: true };
  }

  const payload = {
    from: ZEPTOMAIL_FROM,
    to: [
      {
        email_address: {
          address: recipientEmail,
          name: recipientName || recipientEmail,
        },
      },
    ],
    subject,
    htmlbody: htmlBody,
  };

  const authHeader = token.startsWith('Zoho-')
    ? token
    : token.startsWith('PH')
    ? `Zoho-enczapikey ${token}`
    : token;

  const res = await fetch(ZEPTOMAIL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`ZeptoMail failed with status ${res.status}: ${errText}`);
  }

  const data = await res.json().catch(() => ({}));
  return { success: true, data };
}
