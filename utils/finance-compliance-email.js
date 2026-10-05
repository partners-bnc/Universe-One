import { adminClient } from '@/utils/supabase/admin';
import {
  MONTH_NAMES,
  formatPeriodLabel,
  formatPeriodFull,
  computeEffectiveStatus,
  resolveEffectiveEntry,
} from '@/utils/finance-compliance-master';

const ZEPTOMAIL_URL = 'https://api.zeptomail.in/v1.1/email';
const ZEPTOMAIL_FROM = {
  address: process.env.ZEPTOMAIL_FROM_ADDRESS || 'noreply@bncglobal.in',
  name: process.env.ZEPTOMAIL_FROM_NAME || 'BNC Global - Finance Desk',
};

const FY_MONTHS = [
  { month: 4, name: 'Apr', label: 'April', yearOffset: 0 },
  { month: 5, name: 'May', label: 'May', yearOffset: 0 },
  { month: 6, name: 'Jun', label: 'June', yearOffset: 0 },
  { month: 7, name: 'Jul', label: 'July', yearOffset: 0 },
  { month: 8, name: 'Aug', label: 'August', yearOffset: 0 },
  { month: 9, name: 'Sep', label: 'September', yearOffset: 0 },
  { month: 10, name: 'Oct', label: 'October', yearOffset: 0 },
  { month: 11, name: 'Nov', label: 'November', yearOffset: 0 },
  { month: 12, name: 'Dec', label: 'December', yearOffset: 0 },
  { month: 1, name: 'Jan', label: 'January', yearOffset: 1 },
  { month: 2, name: 'Feb', label: 'February', yearOffset: 1 },
  { month: 3, name: 'Mar', label: 'March', yearOffset: 1 },
];

function getCellStateForEmail(item, mObj, fyStartYear, monthlyEntries = {}, companyCreatedAt = null, now = new Date()) {
  const calcYear = fyStartYear + mObj.yearOffset;
  const month = mObj.month;

  // 1. Pre-inception check
  if (companyCreatedAt) {
    const cd = new Date(companyCreatedAt);
    if (!isNaN(cd.getTime())) {
      const createdYear = cd.getFullYear();
      const createdMonth = cd.getMonth() + 1;
      if (calcYear < createdYear || (calcYear === createdYear && month < createdMonth)) {
        return { status: 'NA', label: '—', isApplicable: false };
      }
    }
  }

  // 2. Resolve entry
  const entry = resolveEffectiveEntry(item, monthlyEntries, month, calcYear);
  const freq = (item.frequency || 'Monthly').toLowerCase().trim();

  // 3. Frequency cadence check
  let isDueMonth = true;
  if (freq === 'monthly') {
    isDueMonth = true;
  } else if (freq.includes('quarter')) {
    const quarterEndMonths = [7, 10, 1, 4];
    isDueMonth = quarterEndMonths.includes(month) || Boolean(entry?.actual_payment_date || entry?.status);
  } else if (freq.includes('half')) {
    const hyMonths = [9, 10, 3, 4];
    isDueMonth = hyMonths.includes(month) || Boolean(entry?.actual_payment_date || entry?.status);
  } else if (freq === 'annual' || freq === 'yearly' || freq.includes('year')) {
    const statRaw = item.statutory_due_date || '';
    const annualMatch = statRaw.match(/(\d{1,2}(?:st|nd|rd|th)?)\s+([A-Za-z]+)/i);
    let targetDueMonth = 9;
    if (annualMatch) {
      const foundIdx = MONTH_NAMES.findIndex((m) =>
        m.toLowerCase().startsWith(annualMatch[2].toLowerCase().slice(0, 3))
      );
      if (foundIdx !== -1) targetDueMonth = foundIdx + 1;
    }
    isDueMonth = month === targetDueMonth || Boolean(entry?.actual_payment_date);
  } else if (freq === 'one time' || freq === 'onetime' || freq === 'one-time') {
    const statRaw = item.statutory_due_date || '';
    const mMatch =
      statRaw.match(/([A-Za-z]+)\s+(\d{4})/i) ||
      statRaw.match(/(\d{1,2}(?:st|nd|rd|th)?)\s+([A-Za-z]+)/i);
    let targetDueMonth = 9;
    if (mMatch) {
      const monthStr = mMatch[1] && isNaN(mMatch[1]) ? mMatch[1] : mMatch[2];
      if (monthStr) {
        const foundIdx = MONTH_NAMES.findIndex((m) =>
          m.toLowerCase().startsWith(monthStr.toLowerCase().slice(0, 3))
        );
        if (foundIdx !== -1) targetDueMonth = foundIdx + 1;
      }
    }
    isDueMonth = month === targetDueMonth || Boolean(entry?.actual_payment_date);
  }

  if (!isDueMonth && !entry?.actual_payment_date) {
    return { status: 'NA', label: '—', isApplicable: false };
  }

  const effectiveStatus = computeEffectiveStatus(item, entry, month, calcYear, now, companyCreatedAt);
  let shortText = 'Pending';
  if (effectiveStatus === 'Completed') {
    shortText = entry?.actual_payment_date ? 'Paid' : 'Done';
  } else if (effectiveStatus === 'In Progress') {
    shortText = 'In Prog';
  } else if (effectiveStatus === 'Overdue') {
    shortText = 'Overdue';
  }

  return {
    status: effectiveStatus,
    label: shortText,
    isApplicable: true,
  };
}

function buildHeatmapHtmlSection({
  items = [],
  monthlyEntries = {},
  fyStartYear = 2026,
  companyCreatedAt = null,
  currentMonth = new Date().getMonth() + 1,
  currentYear = new Date().getFullYear(),
}) {
  const fyEndYear = fyStartYear + 1;
  const fyLabel = `FY ${fyStartYear}–${String(fyEndYear).slice(-2)}`;

  const headerMonthCols = FY_MONTHS.map((mObj) => {
    const mYear = fyStartYear + mObj.yearOffset;
    const isCurrent = currentMonth === mObj.month && currentYear === mYear;
    return `
      <th style="padding: 8px 3px; font-size: 10px; font-weight: 700; text-align: center; color: #ffffff; border-right: 1px solid rgba(255, 255, 255, 0.25); min-width: 44px; ${isCurrent ? 'background-color: #02599f;' : ''}">
        ${mObj.name}<br/>
        <span style="font-size: 8.5px; opacity: 0.85; font-weight: 400;">'${String(mYear).slice(-2)}</span>
        ${isCurrent ? '<br/><span style="display:inline-block; font-size:7px; background:#ffffff; color:#02599f; font-weight:800; padding:1px 3px; border-radius:3px; margin-top:2px;">CURRENT</span>' : ''}
      </th>
    `;
  }).join('');

  const bodyRows = items.map((item, idx) => {
    const freq = item.frequency || 'Monthly';
    const isEven = idx % 2 === 0;
    const baseRowBg = isEven ? '#ffffff' : '#f8fafc';

    const monthCells = FY_MONTHS.map((mObj) => {
      const cell = getCellStateForEmail(item, mObj, fyStartYear, monthlyEntries, companyCreatedAt);
      const mYear = fyStartYear + mObj.yearOffset;
      const isCurrent = currentMonth === mObj.month && currentYear === mYear;

      if (!cell.isApplicable || cell.status === 'NA') {
        return `
          <td style="padding: 6px 2px; text-align: center; font-size: 10px; color: #cbd5e1; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; background-color: #fafafa; ${isCurrent ? 'border-left: 1px solid #0372CC; border-right: 1px solid #0372CC;' : ''}">
            —
          </td>
        `;
      }

      let bg = '#f8fafc';
      let color = '#64748b';
      let border = '#e2e8f0';

      if (cell.status === 'Completed') {
        bg = '#ecfdf5';
        color = '#047857';
        border = '#a7f3d0';
      } else if (cell.status === 'In Progress') {
        bg = '#fefce8';
        color = '#a16207';
        border = '#fef08a';
      } else if (cell.status === 'Overdue') {
        bg = '#fef2f2';
        color = '#b91c1c';
        border = '#fecaca';
      }

      return `
        <td style="padding: 6px 2px; text-align: center; font-size: 9.5px; font-weight: 700; color: ${color}; background-color: ${bg}; border-right: 1px solid ${border}; border-bottom: 1px solid ${border};">
          ${cell.label}
        </td>
      `;
    }).join('');

    return `
      <tr style="background-color: ${baseRowBg};">
        <td style="padding: 6px 6px; font-size: 10px; color: #64748b; font-weight: 600; text-align: center; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
          ${item.s_no || idx + 1}
        </td>
        <td style="padding: 6px 8px; font-size: 11px; color: #0f172a; font-weight: 600; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; max-width: 220px;">
          ${escapeHtml(item.compliance_nature)}
        </td>
        <td style="padding: 6px 4px; font-size: 9.5px; color: #0284c7; font-weight: 600; text-align: center; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
          ${escapeHtml(freq)}
        </td>
        ${monthCells}
      </tr>
    `;
  }).join('');

  return `
    <!-- Heatmap Matrix Section in Email -->
    <tr>
      <td style="padding: 24px 36px 16px;">
        <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
          <tr>
            <td>
              <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #0f172a;">
                Compliance Heat Map (${fyLabel})
              </h3>
              <p style="margin: 3px 0 0; font-size: 12px; color: #64748b;">
                12-Month statutory execution matrix (April ${fyStartYear} to March ${fyEndYear})
              </p>
            </td>
          </tr>
        </table>

        <div style="overflow-x: auto; border: 1px solid #cbd5e1; border-radius: 8px;">
          <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; min-width: 650px;">
            <thead>
              <tr style="background-color: #0372CC; color: #ffffff;">
                <th style="padding: 8px 6px; font-size: 10px; font-weight: 700; text-align: center; color: #ffffff; border-right: 1px solid rgba(255, 255, 255, 0.25); width: 28px;">#</th>
                <th style="padding: 8px 8px; font-size: 10px; font-weight: 700; text-align: left; color: #ffffff; border-right: 1px solid rgba(255, 255, 255, 0.25);">Compliance Nature</th>
                <th style="padding: 8px 4px; font-size: 10px; font-weight: 700; text-align: center; color: #ffffff; border-right: 1px solid rgba(255, 255, 255, 0.25); width: 65px;">Frequency</th>
                ${headerMonthCols}
              </tr>
            </thead>
            <tbody>
              ${bodyRows}
            </tbody>
          </table>
        </div>

        <!-- Heatmap Legend -->
        <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 12px; font-size: 11px; color: #64748b;">
          <tr>
            <td align="left">
              <span style="font-weight: 700; color: #334155; margin-right: 10px;">Status Legend:</span>
              <span style="display: inline-block; background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 2px 7px; border-radius: 4px; font-weight: 700; margin-right: 6px;">Paid / Done</span>
              <span style="display: inline-block; background-color: #fefce8; color: #a16207; border: 1px solid #fef08a; padding: 2px 7px; border-radius: 4px; font-weight: 700; margin-right: 6px;">In Progress</span>
              <span style="display: inline-block; background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; padding: 2px 7px; border-radius: 4px; font-weight: 700; margin-right: 6px;">Overdue</span>
              <span style="display: inline-block; background-color: #f8fafc; color: #64748b; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 4px; font-weight: 600; margin-right: 6px;">Pending</span>
              <span style="display: inline-block; color: #94a3b8; font-weight: 600;">— Not Due</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

export function buildComplianceEmailHtml({
  companyName,
  clientName,
  periodLabel,
  periodFull,
  itemsWithEntries = [],
  customMessage = '',
  stats = { total: 0, completed: 0, inProgress: 0, pending: 0, score: 0 },
  fyStartYear = 2026,
  monthlyEntries = {},
  companyCreatedAt = null,
  includeHeatmap = true,
}) {
  const fyEndYear = fyStartYear + 1;
  const fyLabel = `FY ${fyStartYear}–${String(fyEndYear).slice(-2)}`;

  const heatmapSectionHtml = buildHeatmapHtmlSection({
    items: itemsWithEntries,
    monthlyEntries,
    fyStartYear,
    companyCreatedAt,
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compliance Heat Map - ${escapeHtml(companyName)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 960px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
          
          <!-- Top Header Banner (#0372CC Theme) -->
          <tr>
            <td style="background: linear-gradient(135deg, #0372CC 0%, #02599f 100%); padding: 28px 36px; text-align: left;">
              <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.35); border-radius: 9999px; padding: 4px 14px; font-size: 11px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">
                Statutory Compliance Report
              </div>
              <h1 style="margin: 4px 0 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">
                ${escapeHtml(companyName)}
              </h1>
              <p style="margin: 6px 0 0; color: rgba(255, 255, 255, 0.95); font-size: 13.5px;">
                Financial Year: <strong style="color: #ffffff;">${fyLabel} (April ${fyStartYear} – March ${fyEndYear})</strong>
              </p>
            </td>
          </tr>

          <!-- Greeting & Custom Note -->
          <tr>
            <td style="padding: 20px 36px 14px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="font-size: 13.5px; color: #334155; line-height: 1.5;">
                    Dear <strong>${escapeHtml(clientName || 'Valued Client')}</strong>, please find below the statutory compliance heat map for <strong>${escapeHtml(companyName)}</strong> for <strong>${fyLabel}</strong>.
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
            </td>
          </tr>

          <!-- Heatmap Section -->
          ${heatmapSectionHtml}

          <!-- Footer -->
          <tr>
            <td style="padding: 22px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
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
  recipientEmails = [],
  recipientName,
  ccEmails = [],
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

  // Build TO recipients list
  let toList = [];
  if (Array.isArray(recipientEmails) && recipientEmails.length > 0) {
    toList = recipientEmails
      .filter(Boolean)
      .map((r) => {
        if (typeof r === 'string') {
          return {
            email_address: {
              address: r.trim(),
              name: r.trim(),
            },
          };
        }
        return {
          email_address: {
            address: r.email?.trim(),
            name: r.name?.trim() || r.email?.trim(),
          },
        };
      })
      .filter((r) => Boolean(r.email_address.address));
  }

  if (toList.length === 0 && recipientEmail) {
    toList = [
      {
        email_address: {
          address: recipientEmail.trim(),
          name: recipientName?.trim() || recipientEmail.trim(),
        },
      },
    ];
  }

  // Build CC recipients list
  let ccList = [];
  if (Array.isArray(ccEmails)) {
    ccList = ccEmails
      .map((e) => (typeof e === 'string' ? e.trim() : e.email?.trim()))
      .filter(Boolean)
      .map((email) => ({
        email_address: {
          address: email,
          name: email,
        },
      }));
  } else if (typeof ccEmails === 'string' && ccEmails.trim()) {
    ccList = ccEmails
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean)
      .map((email) => ({
        email_address: {
          address: email,
          name: email,
        },
      }));
  }

  const payload = {
    from: ZEPTOMAIL_FROM,
    to: toList,
    ...(ccList.length > 0 ? { cc: ccList } : {}),
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
