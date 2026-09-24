import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

const ZEPTOMAIL_URL = 'https://api.zeptomail.in/v1.1/email';
const ZEPTOMAIL_FROM = {
  address: process.env.ZEPTOMAIL_FROM_ADDRESS || 'noreply@bncglobal.in',
  name: process.env.ZEPTOMAIL_FROM_NAME || 'UniverseOne Audit'
};

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      emailType, // 'calendar' | 'idr'
      recipientEmail,
      recipientName,
      recipients, // array of { email, name } (Primary TO)
      ccRecipients, // array of { email, name } or string (Carbon Copy CC)
      subject,
      bodyText,
      portalUrl,
      portalToken,
      items,
      calendarItems,
      projectName,
      clientName,
      leadName,
      projectId,
      clientPersonId
    } = body;

    // Resolve Origin / Base URL dynamically for production domain or local environment
    const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const forwardedProto = req.headers.get('x-forwarded-proto') || (forwardedHost?.includes('localhost') ? 'http' : 'https');
    const resolvedOrigin = req.headers.get('origin') || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://universeone.in');

    let resolvedPortalUrl = portalUrl || '';
    if (!resolvedPortalUrl && portalToken) {
      resolvedPortalUrl = `${resolvedOrigin}/Auditing/client-portal/${portalToken}`;
    } else if (resolvedPortalUrl.startsWith('/')) {
      resolvedPortalUrl = `${resolvedOrigin}${resolvedPortalUrl}`;
    }
    const parseRecipientItem = (item) => {
      if (!item) return null;
      if (typeof item === 'object' && item.email) {
        const cleanEmail = String(item.email).trim().toLowerCase();
        if (!cleanEmail.includes('@')) return null;
        return {
          email: cleanEmail,
          name: item.name || cleanEmail
        };
      }
      if (typeof item === 'string') {
        const str = item.trim();
        const match = str.match(/^(.*?)(?:<(.+@.+)>)$/);
        if (match) {
          const em = match[2].trim().toLowerCase();
          return { name: match[1].trim() || em, email: em };
        }
        const clean = str.replace(/[<>]/g, '').trim().toLowerCase();
        if (clean.includes('@')) {
          return { name: clean, email: clean };
        }
      }
      return null;
    };

    // 1. Resolve Primary "TO" Recipients
    let targetRecipients = [];
    if (Array.isArray(recipients) && recipients.length > 0) {
      targetRecipients = recipients.map(parseRecipientItem).filter(Boolean);
    } else if (recipientEmail) {
      const parts = String(recipientEmail).split(/[,;\n]/).map(e => e.trim()).filter(Boolean);
      targetRecipients = parts.map(e => parseRecipientItem({ email: e, name: recipientName })).filter(Boolean);
    }

    // 2. Resolve "CC" Recipients
    let targetCc = [];
    if (Array.isArray(ccRecipients) && ccRecipients.length > 0) {
      targetCc = ccRecipients.map(parseRecipientItem).filter(Boolean);
    } else if (typeof ccRecipients === 'string' && ccRecipients.trim()) {
      const parts = ccRecipients.split(/[,;\n]/).map(e => e.trim()).filter(Boolean);
      targetCc = parts.map(parseRecipientItem).filter(Boolean);
    }

    // Deduplicate CC recipients so they aren't duplicate of TO
    const toEmailSet = new Set(targetRecipients.map(r => r.email.toLowerCase()));
    targetCc = targetCc.filter(c => !toEmailSet.has(c.email.toLowerCase()));

    if (targetRecipients.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one valid primary recipient email address (TO) is required' }, { status: 400 });
    }

    const primaryEmail = targetRecipients[0].email;
    const primaryName = targetRecipients[0].name || primaryEmail;

    const zohoToken = process.env.ZOHO_TOKEN || process.env.ZEPTOMAIL_TOKEN;
    const brevoApiKey = process.env.BREVO_API_KEY;

    let emailSent = false;
    let serviceUsed = '';
    let apiResponse = null;
    let htmlContent = '';

    if (emailType === 'calendar') {
      // ══════════════════════════════════════════════════════════════════════════
      // WEEKLY CALENDAR PLAN HTML EMAIL TEMPLATE (MERGED GROUPED PRESENTATION)
      // ══════════════════════════════════════════════════════════════════════════
      const calList = Array.isArray(calendarItems) ? calendarItems : [];

      // Calculate rowSpans for Week and Week Description
      const rows = [...calList];
      const calendarRowsWithSpans = [];
      let i = 0;
      while (i < rows.length) {
        const currentWeek = rows[i].week_name || "";
        let weekSpan = 0;
        while (i + weekSpan < rows.length && (rows[i + weekSpan].week_name || "") === currentWeek) {
          weekSpan++;
        }

        let j = 0;
        while (j < weekSpan) {
          const currentDesc = rows[i + j].week_description || "";
          let descSpan = 0;
          while (j + descSpan < weekSpan && (rows[i + j + descSpan].week_description || "") === currentDesc) {
            descSpan++;
          }

          for (let k = 0; k < descSpan; k++) {
            const rowIndex = i + j + k;
            calendarRowsWithSpans.push({
              ...rows[rowIndex],
              showWeek: j === 0 && k === 0,
              weekRowSpan: j === 0 && k === 0 ? weekSpan : 0,
              showDesc: k === 0,
              descRowSpan: k === 0 ? descSpan : 0,
              isFirstInWeek: j === 0 && k === 0,
              isLastInWeek: j + k === weekSpan - 1
            });
          }
          j += descSpan;
        }
        i += weekSpan;
      }
      
      const calRowsHtml = calendarRowsWithSpans.length > 0
        ? calendarRowsWithSpans.map((item, idx) => {
            const pVal = item.progress !== undefined && item.progress !== null ? item.progress : (item.status === 'Done' ? 100 : 0);
            const statusColor = item.status === 'Done' ? '#16a34a' : (item.status === 'In Progress' ? '#0d9488' : '#d97706');
            const statusBg = item.status === 'Done' ? '#dcfce7' : (item.status === 'In Progress' ? '#ccfbf1' : '#fef3c7');
            const statusBorder = item.status === 'Done' ? '#86efac' : (item.status === 'In Progress' ? '#5eead4' : '#fde68a');

            return `
              <tr style="border-bottom: ${item.isLastInWeek ? '2px solid #cbd5e1' : '1px solid #e2e8f0'}; background-color: #ffffff;">
                ${item.showWeek ? `
                  <td rowspan="${item.weekRowSpan}" valign="middle" align="center" style="padding: 12px 14px; font-size: 12px; font-weight: 800; color: #0d9488; background-color: #f8fafc; border-right: 1px solid #e2e8f0; border-bottom: 2px solid #cbd5e1;">
                    <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; color: #0d9488; padding: 6px 10px; border-radius: 6px; font-weight: 800; display: inline-block; white-space: nowrap;">
                      ${item.week_name || 'Week'}
                    </div>
                  </td>
                ` : ''}

                ${item.showDesc ? `
                  <td rowspan="${item.descRowSpan}" valign="middle" style="padding: 12px 14px; font-size: 12.5px; font-weight: 700; color: #1e293b; background-color: #ffffff; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                    ${item.week_description || '—'}
                  </td>
                ` : ''}

                <td valign="top" style="padding: 12px 14px; border-right: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a;">
                  ${item.activity || '—'}
                </td>

                <td valign="top" style="padding: 12px 14px; border-right: 1px solid #e2e8f0; font-size: 12px; color: #475569; line-height: 1.45;">
                  ${item.detailed_audit_work || '—'}
                </td>

                <td valign="middle" align="center" style="padding: 12px 14px; border-right: 1px solid #e2e8f0; width: 85px;">
                  <div style="font-size: 12px; font-weight: 800; color: ${pVal === 100 ? '#16a34a' : (pVal > 0 ? '#0d9488' : '#64748b')}; margin-bottom: 4px;">
                    ${pVal}%
                  </div>
                  <div style="width: 70px; height: 6px; background-color: #e2e8f0; border-radius: 4px; overflow: hidden; margin: 0 auto;">
                    <div style="width: ${pVal}%; height: 100%; background-color: ${pVal === 100 ? '#16a34a' : '#0d9488'}; border-radius: 4px;"></div>
                  </div>
                </td>

                <td valign="middle" align="center" style="padding: 12px 14px; border-right: 1px solid #e2e8f0; width: 95px; white-space: nowrap;">
                  <span style="display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; color: ${statusColor}; background-color: ${statusBg}; border: 1px solid ${statusBorder};">
                    ${item.status || 'Pending'}
                  </span>
                </td>

                <td valign="top" style="padding: 12px 14px; font-size: 12px; color: #64748b;">
                  ${item.remarks || '—'}
                </td>
              </tr>
            `;
          }).join('')
        : `
          <tr>
            <td colspan="7" style="padding: 24px; text-align: center; color: #64748b; font-size: 13px;">
              No schedule items specified.
            </td>
          </tr>
        `;

      // Resolve the primary client contact name
      const primaryClientName = targetRecipients[0]?.name || clientName || 'Client Team';

      // Ensure body message has single clean salutation with real client name
      let cleanBodyMessage = (bodyText || '').trim();
      if (!cleanBodyMessage) {
        cleanBodyMessage = `Dear ${primaryClientName},\n\nPlease find detailed below the updated Weekly Audit Execution Schedule, planned milestones, and activity timelines for our ongoing audit review at ${clientName || 'your organization'}.\n\nKindly review and let us know if any adjustments are needed.`;
      }

      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Weekly Audit Execution Schedule</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 32px 12px; -webkit-font-smoothing: antialiased;">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 760px; margin: 0 auto;">
              <!-- TOP BRAND HEADER -->
              <tr>
                <td style="padding-bottom: 14px;">
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <span style="font-size: 16px; font-weight: 900; letter-spacing: 1px; color: #0f172a; text-transform: uppercase;">
                          UNIVERSEONE <span style="color: #0d9488; font-weight: 700;">AUDIT</span>
                        </span>
                      </td>
                      <td align="right" style="font-size: 12px; color: #64748b; font-weight: 600;">
                        Weekly Execution Plan Notice
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CARD CONTAINER -->
              <tr>
                <td style="background-color: #ffffff; border-radius: 10px; border: 1px solid #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                  
                  <!-- BANNER -->
                  <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px 32px; color: #ffffff; border-bottom: 3px solid #0d9488;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #2dd4bf; margin-bottom: 6px;">
                      Audit Execution Schedule & Timelines
                    </div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                      ${clientName || 'Audit Engagement Plan'}
                    </h1>
                  </div>

                  <div style="padding: 28px 32px;">
                    
                    <!-- USER COVER NOTE -->
                    <div style="font-size: 13.5px; color: #334155; line-height: 1.6; margin-bottom: 24px; white-space: pre-wrap; background-color: #f8fafc; border-left: 3px solid #0d9488; padding: 14px 18px; border-radius: 0 6px 6px 0;">${cleanBodyMessage}</div>

                    <!-- SUMMARY BADGES -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="font-size: 13px; font-weight: 800; color: #0f172a;">
                          📅 Scheduled Audit Activities (${calList.length})
                        </td>
                        <td align="right" style="font-size: 12px; color: #64748b;">
                          Audit Lead: <strong style="color: #0f172a;">${leadName || 'Assigned Lead'}</strong>
                        </td>
                      </tr>
                    </table>

                    <!-- EXECUTION SCHEDULE TABLE -->
                    <div style="overflow-x: auto; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 28px;">
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%; text-align: left;">
                        <thead>
                          <tr style="background-color: #f1f5f9; color: #475569; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 2px solid #cbd5e1;">
                            <th align="center" style="padding: 10px 14px; border-right: 1px solid #cbd5e1; width: 100px;">Week</th>
                            <th align="left" style="padding: 10px 14px; border-right: 1px solid #cbd5e1; width: 170px;">Week Description</th>
                            <th align="left" style="padding: 10px 14px; border-right: 1px solid #cbd5e1; width: 200px;">Activity</th>
                            <th align="left" style="padding: 10px 14px; border-right: 1px solid #cbd5e1;">Detailed Audit Work</th>
                            <th align="center" style="padding: 10px 14px; border-right: 1px solid #cbd5e1; width: 85px;">Progress</th>
                            <th align="center" style="padding: 10px 14px; border-right: 1px solid #cbd5e1; width: 95px;">Status</th>
                            <th align="left" style="padding: 10px 14px; width: 130px;">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${calRowsHtml}
                        </tbody>
                      </table>
                    </div>

                    <!-- SIGN-OFF -->
                    <div style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                      Warm regards,<br/>
                      <strong style="color: #0f172a;">UniverseOne Internal Audit Team</strong>
                    </div>

                  </div>

                  <!-- FOOTER -->
                  <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                    This execution plan was generated by UniverseOne Audit Engine for <strong>${targetRecipients.map(r => r.email).join(', ')}</strong>${targetCc.length > 0 ? ` &bull; CC: <strong>${targetCc.map(c => c.email).join(', ')}</strong>` : ''}.<br/>
                    Confidentiality Note: This transmission and its attachments are intended solely for the designated recipient(s).
                  </div>

                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    } else {
      // ══════════════════════════════════════════════════════════════════════════
      // IDR (INFORMATION DOCUMENT REQUEST) HTML EMAIL TEMPLATE
      // ══════════════════════════════════════════════════════════════════════════
      const parsedFlatItems = [];
      if (Array.isArray(items) && items.length > 0) {
        items.forEach((it, idx) => {
          const rowNum = idx + 1;
          const docName =
            it.data_requirement ||
            it.document_name ||
            it.name ||
            it.title ||
            it.row_data?.data_requirement ||
            it.row_data?.document_name ||
            it.sub_process ||
            it.procedure ||
            it.row_data?.procedure ||
            'Requested Audit Document';

          const procNote = it.procedure || it.row_data?.procedure || it.row_data?.sub_process || '';
          const rawText = String(docName || '').trim();
          const parts = rawText.split(/,|\n/).map(p => p.trim()).filter(Boolean);
          const cleanSubItems = parts.map(part => {
            return part
              .replace(/^(\d+[\.\)]\s*)+/g, '')
              .replace(/^[a-zA-Z][\.\)]\s*/g, '')
              .replace(/^[-•*]\s*/, '')
              .trim();
          }).filter(Boolean);

          const finalSubs = cleanSubItems.length > 0 ? cleanSubItems : [rawText];

          const itemRemarks = (it.remarks || it.status_json?.remarks || '').trim();

          if (finalSubs.length > 1) {
            finalSubs.forEach((sub, subIdx) => {
              parsedFlatItems.push({
                numLabel: `${rowNum}.${subIdx + 1}`,
                docName: sub,
                procNote: subIdx === 0 ? procNote : '',
                remarks: subIdx === 0 ? itemRemarks : ''
              });
            });
          } else {
            parsedFlatItems.push({
              numLabel: `${rowNum}`,
              docName: finalSubs[0],
              procNote: procNote,
              remarks: itemRemarks
            });
          }
        });
      }

      const itemsListHtml = parsedFlatItems.length > 0
        ? parsedFlatItems.map((it, idx) => {
            return `
              <tr>
                <td valign="top" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #3d63ab; border-bottom: ${idx < parsedFlatItems.length - 1 ? '1px solid #e2e8f0' : 'none'}; width: 45px;">${it.numLabel}</td>
                <td valign="top" style="padding: 12px 16px; font-size: 13px; color: #1e293b; border-bottom: ${idx < parsedFlatItems.length - 1 ? '1px solid #e2e8f0' : 'none'};">
                  <div style="font-weight: 600; color: #0f172a;">${it.docName}</div>
                  ${it.remarks ? `
                    <div style="margin-top: 6px; font-size: 12px; color: #9a3412; background-color: #fff7ed; border-left: 3px solid #f97316; padding: 6px 10px; border-radius: 0 4px 4px 0;">
                      <strong>Auditor Note:</strong> ${it.remarks}
                    </div>
                  ` : ''}
                </td>
              </tr>
            `;
          }).join('')
        : `
          <tr>
            <td valign="top" style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #3d63ab;">1</td>
            <td valign="top" style="padding: 12px 16px; font-size: 13px; color: #1e293b;">
              <div style="font-weight: 600; color: #0f172a;">Requested Audit Information & Documents</div>
            </td>
          </tr>
        `;

      // Sanitize body text so salutations, raw numbered lists, or URLs never duplicate
      let cleanBody = bodyText || '';
      cleanBody = cleanBody.replace(/^Dear\s+[^,\n]+,\s*/i, '').trim();
      cleanBody = cleanBody.split(/SECURE UPLOAD LINK:/i)[0].trim();
      cleanBody = cleanBody.split(/Best regards,/i)[0].trim();
      cleanBody = cleanBody.split(/Regards,/i)[0].trim();

      if (parsedFlatItems.length > 0) {
        const lines = cleanBody.split('\n');
        const introLines = lines.filter(l => !/^\s*\d+[\.\)]\s*/.test(l));
        cleanBody = introLines.join('\n').trim();
      }

      if (!cleanBody) {
        cleanBody = `As part of our audit engagement (${projectName || 'Internal Audit'} - ${financialYear || 'FY 2026-27'}), please upload the requested audit document(s) listed below through our secure client portal:`;
      }

      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Information Document Request</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6fa; color: #1e293b; margin: 0; padding: 40px 16px; -webkit-font-smoothing: antialiased;">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
              <tr>
                <td style="padding-bottom: 16px; text-align: left;">
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <span style="font-size: 18px; font-weight: 800; letter-spacing: 0.5px; color: #1e293b;">
                          UNIVERSEONE <span style="color: #3d63ab;">AUDIT</span>
                        </span>
                      </td>
                      <td align="right" style="font-size: 12px; color: #64748b; font-weight: 600;">
                        Official Audit Request
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden;">
                  
                  <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px 36px; color: #ffffff;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #93c5fd; margin-bottom: 8px;">
                      Information Document Request (IDR)
                    </div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                      ${clientName || 'Internal Audit Data Request'}
                    </h1>
                    <div style="font-size: 13px; color: #cbd5e1; margin-top: 8px;">
                      Project: <strong style="color: #ffffff;">${projectName || 'Internal Audit Engagement'}</strong>
                    </div>
                  </div>

                  <div style="padding: 32px 36px;">
                    
                    <p style="font-size: 15px; color: #1e293b; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                      Dear <strong>${primaryName}</strong>,
                    </p>
                    
                    <div style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; white-space: pre-wrap;">${cleanBody}</div>

                    <div style="margin-bottom: 28px;">
                      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; margin-bottom: 10px;">
                        Requested Audit Documentation & Information
                      </div>
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; border-collapse: separate; border-spacing: 0;">
                        <tbody>
                          ${itemsListHtml}
                        </tbody>
                      </table>
                    </div>

                    ${resolvedPortalUrl ? `
                      <div style="text-align: center; margin: 32px 0 24px 0;">
                        <a href="${resolvedPortalUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #3d63ab; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 4px 6px -1px rgba(61, 99, 171, 0.3);">
                          &rarr; Open Secure Document Upload Portal
                        </a>
                      </div>
                    ` : ''}

                    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px 18px; margin-top: 24px;">
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td valign="top" style="width: 24px; padding-right: 12px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </td>
                          <td style="font-size: 12px; color: #475569; line-height: 1.4;">
                            This upload link is secured with 256-bit encryption for confidential document uploads.
                          </td>
                        </tr>
                      </table>
                    </div>

                    <div style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                      Regards,<br/>
                      <strong style="color: #1e293b;">UniverseOne Audit Team</strong>
                    </div>

                  </div>

                  <!-- FOOTER -->
                  <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 36px; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                    This message was generated by UniverseOne Audit Engine for <strong>${primaryEmail}</strong>.<br/>
                    Confidentiality Note: This transmission is intended solely for the designated recipient.
                  </div>

                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    }

    const emailSubject = subject || (emailType === 'calendar' 
      ? `[Weekly Audit Schedule] Execution Plan for ${clientName || 'Company'}`
      : `[Information Document Request] Data Requirements for ${clientName || 'Company'}`);

    // Method 1: Try ZeptoMail API with ZOHO_TOKEN
    if (zohoToken) {
      try {
        const toAddresses = targetRecipients.map(r => ({
          email_address: {
            address: r.email,
            name: r.name || r.email
          }
        }));

        const zeptoPayload = {
          from: ZEPTOMAIL_FROM,
          to: toAddresses,
          subject: emailSubject,
          htmlbody: htmlContent
        };

        // Pass CC recipients to ZeptoMail API
        if (targetCc.length > 0) {
          zeptoPayload.cc = targetCc.map(r => ({
            email_address: {
              address: r.email,
              name: r.name || r.email
            }
          }));
        }

        const res = await fetch(ZEPTOMAIL_URL, {
          method: 'POST',
          headers: {
            Authorization: zohoToken.startsWith('Zoho-') ? zohoToken : `Zoho-enczapikey ${zohoToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(zeptoPayload)
        });

        apiResponse = await res.json().catch(() => ({}));
        if (res.ok) {
          emailSent = true;
          serviceUsed = 'ZeptoMail (Zoho)';
        } else {
          console.warn('ZeptoMail API error:', apiResponse);
        }
      } catch (err) {
        console.error('ZeptoMail dispatch exception:', err);
      }
    }

    // Method 2: Fallback to Brevo API if ZeptoMail was not used or failed
    if (!emailSent && brevoApiKey) {
      try {
        const toBrevo = targetRecipients.map(r => ({ email: r.email, name: r.name }));
        const brevoPayload = {
          sender: { name: 'UniverseOne Audit', email: 'noreply@bncglobal.in' },
          to: toBrevo,
          subject: emailSubject,
          htmlContent: htmlContent
        };

        // Pass CC recipients to Brevo API
        if (targetCc.length > 0) {
          brevoPayload.cc = targetCc.map(r => ({ email: r.email, name: r.name }));
        }

        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(brevoPayload)
        });

        apiResponse = await res.json().catch(() => ({}));
        if (res.ok) {
          emailSent = true;
          serviceUsed = 'Brevo SMTP API';
        } else {
          console.warn('Brevo API error:', apiResponse);
        }
      } catch (err) {
        console.error('Brevo API dispatch exception:', err);
      }
    }

    // PERSIST TO DATABASE: audit_upload_tokens & audit_logs
    const supabase = adminClient;
    const tokenStr = portalToken || (portalUrl ? portalUrl.split('/').pop() : null);
    const validUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    const validProjectId = projectId && validUuidPattern.test(projectId) ? projectId : null;
    const validClientPersonId = clientPersonId && validUuidPattern.test(clientPersonId) ? clientPersonId : null;

    if (tokenStr && validProjectId && emailType !== 'calendar') {
      const trackerIds = Array.isArray(items) ? items.map(i => i.id).filter(id => id && validUuidPattern.test(id)) : [];
      try {
        await supabase.from('audit_upload_tokens').insert([{
          token: tokenStr,
          project_id: validProjectId,
          client_person_id: validClientPersonId,
          client_email: primaryEmail,
          data_tracker_ids: trackerIds,
          expires_at: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString(),
          is_used: false
        }]);
      } catch (tokenInsertErr) {
        console.warn("Notice: audit_upload_tokens insert:", tokenInsertErr.message);
      }

      // Update dedicated audit_data_tracker items with email status & communication trail
      if (Array.isArray(items) && items.length > 0) {
        try {
          const nowIso = new Date().toISOString();
          for (const it of items) {
            let dbMatch = null;
            if (it.id && validUuidPattern.test(it.id)) {
              const { data } = await supabase.from('audit_data_tracker').select('*').eq('project_id', validProjectId).eq('id', it.id).limit(1);
              if (data && data.length > 0) dbMatch = data;
            }
            if (!dbMatch && it.programme_id && validUuidPattern.test(it.programme_id)) {
              const { data } = await supabase.from('audit_data_tracker').select('*').eq('project_id', validProjectId).eq('programme_id', it.programme_id).limit(1);
              if (data && data.length > 0) dbMatch = data;
            }
            if (!dbMatch && (it.data_requirement || it.document_name)) {
              const reqTitle = (it.data_requirement || it.document_name || '').trim();
              if (reqTitle) {
                const { data } = await supabase.from('audit_data_tracker').select('*').eq('project_id', validProjectId).ilike('data_requirement', reqTitle).limit(1);
                if (data && data.length > 0) dbMatch = data;
              }
            }

            const existingRow = dbMatch && dbMatch[0];
            if (!existingRow) continue;

            const prevTrail = Array.isArray(existingRow?.communication_trail)
              ? [...existingRow.communication_trail]
              : (Array.isArray(existingRow?.status_json?.communication_trail) ? [...existingRow.status_json.communication_trail] : []);

            // If prevTrail was empty but email_sent_at existed, synthesize prior initial dispatch first
            if (prevTrail.length === 0 && (existingRow.email_sent_at || existingRow.status_json?.sent_at)) {
              prevTrail.push({
                id: `email_prior_${Date.now()}`,
                type: 'INITIAL_DISPATCH',
                title: 'Initial IDR Email Sent',
                timestamp: existingRow.email_sent_at || existingRow.status_json?.sent_at,
                recipient_name: recipientName || '',
                recipient_email: primaryEmail || '',
                subject: 'Information Document Request (IDR)',
                remarks: existingRow.remarks || existingRow.status_json?.remarks || '',
                status: 'Delivered'
              });
            }

            const isResend = (existingRow?.email_status && existingRow.email_status !== 'Not Sent') || prevTrail.length > 0;
            const newEmailStatus = isResend ? 'Resent' : 'Email Sent';

            const trailEvent = {
              id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              type: isResend ? 'RESENT' : 'INITIAL_DISPATCH',
              title: isResend ? 'IDR Follow-up Email Resent' : 'Initial IDR Email Sent',
              timestamp: nowIso,
              recipient_name: recipientName || '',
              recipient_email: primaryEmail || '',
              cc_emails: ccEmails || '',
              subject: emailSubject || '',
              remarks: (it.remarks || '').trim(),
              portal_url: resolvedPortalUrl || '',
              status: 'Delivered'
            };

            const updatedTrail = [...prevTrail, trailEvent];
            const updatedStatusJson = {
              ...(existingRow?.status_json || {}),
              email_status: newEmailStatus,
              sent_at: nowIso,
              portal_token: tokenStr,
              communication_trail: updatedTrail
            };

            let { error: updateErr } = await supabase
              .from('audit_data_tracker')
              .update({
                email_status: newEmailStatus,
                email_sent_at: nowIso,
                communication_trail: updatedTrail,
                status_json: updatedStatusJson,
                client_person_id: validClientPersonId || existingRow.client_person_id,
                updated_at: nowIso
              })
              .eq('id', existingRow.id);

            if (updateErr && (updateErr.code === '42703' || updateErr.message?.includes('column'))) {
              await supabase
                .from('audit_data_tracker')
                .update({
                  status_json: updatedStatusJson,
                  updated_at: nowIso
                })
                .eq('id', existingRow.id);
            }
          }
        } catch (trailErr) {
          console.warn("Notice updating audit_data_tracker communication trail in send-email:", trailErr);
        }
      }
    }

    // Write log entry to audit_logs table
    try {
      await supabase.from('audit_logs').insert([{
        module_name: emailType === 'calendar' ? 'Weekly Calendar' : 'Data Tracker',
        entity_type: emailType === 'calendar' ? 'CALENDAR_EMAIL' : 'IDR_EMAIL',
        entity_id: validProjectId,
        action: 'EMAIL_DISPATCHED',
        actor_id: null,
        old_payload: null,
        new_payload: {
          recipients: targetRecipients,
          subject: emailSubject,
          portal_url: resolvedPortalUrl || null,
          items_count: emailType === 'calendar' ? (calendarItems?.length || 0) : (items?.length || 0),
          service_used: serviceUsed || 'Gateway Activation'
        },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1',
        user_agent: req.headers.get('user-agent') || 'Browser'
      }]);
    } catch (logErr) {
      console.warn("Notice: audit_logs insert:", logErr.message);
    }

    return NextResponse.json({
      success: true,
      emailSent,
      serviceUsed: serviceUsed || 'Simulated Portal Activation',
      recipients: targetRecipients,
      apiResponse
    });
  } catch (err) {
    console.error('Error in send-email API route:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
