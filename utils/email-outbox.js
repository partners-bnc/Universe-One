import { adminClient } from '@/utils/supabase/admin';

const EMAIL_NOTIFICATIONS_ENABLED = process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true';

export async function enqueueEmployeeCreatedEmail({
  employeeId,
  recipientEmail,
  employeeName,
  username,
  tempPassword,
}) {
  if (!EMAIL_NOTIFICATIONS_ENABLED) return;

  const normalizedEmail = String(recipientEmail || '').trim().toLowerCase();
  if (!normalizedEmail) return;

  const dedupeKey = `employee_created:${employeeId}:${Date.now()}`;

  const { error } = await adminClient
    .from('email_outbox')
    .insert({
      event_type: 'employee_created',
      recipient_email: normalizedEmail,
      payload: {
        employee_id: employeeId,
        employee_name: employeeName,
        username,
        temp_password: tempPassword,
      },
      dedupe_key: dedupeKey,
    });

  if (error) {
    throw new Error(error.message || 'Failed to enqueue onboarding email');
  }
}

const ZEPTOMAIL_URL = 'https://api.zeptomail.in/v1.1/email';
const ZEPTOMAIL_FROM = {
  address: process.env.ZEPTOMAIL_FROM_ADDRESS || 'noreply@bncglobal.in',
  name: process.env.ZEPTOMAIL_FROM_NAME || 'BNC Global',
};

function formatExpiryDate(value) {
  if (!value) return '24 hours';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export async function sendVendorAccountCreatedEmail({
  vendorName,
  recipientEmail,
  phone,
  tempPassword,
  loginUrl,
}) {
  const normalizedEmail = String(recipientEmail || '').trim().toLowerCase();
  if (!normalizedEmail) return;

  const zohoToken = process.env.ZOHO_TOKEN || process.env.ZEPTOMAIL_TOKEN;
  const name = vendorName || 'Vendor Partner';
  let rawUrl = loginUrl || `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://universeone.bncglobal.in'}/login`;
  const targetUrl = rawUrl.replace('tasks.bncglobal.in', 'universeone.bncglobal.in');

  const subject = `Welcome to Vendora — Your Vendor Portal Access (BNC Global)`;
  const textBody = `Dear ${name},

Welcome to Vendora, powered by Universe One (BNC Global).

Your vendor portal account is now active. You can sign in to complete your vendor profile and submit invoices directly for payment processing.

Sign-in Information:
- Portal URL: ${targetUrl}
- Username / Email: ${normalizedEmail}
- Initial Password: ${tempPassword}

Next Steps:
1. Sign in with your registered email and password.
2. Complete your company profile registration and compliance records.
3. Submit service invoices directly for streamlined review and clearance.

Need assistance? Contact us at info@bncglobal.in or call +91-9304002266.

Best regards,
BNC Global • Universe One Vendor Operations`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to Vendora</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a { text-decoration: none; }

    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 20px 8px !important; }
      .email-card { width: 100% !important; border-radius: 12px !important; }
      .pad-lg { padding-left: 20px !important; padding-right: 20px !important; }
      .logo-img { width: 180px !important; height: auto !important; }
      .btn-cell a { display: block !important; width: 100% !important; box-sizing: border-box; text-align: center !important; }
      .btn-table { width: 100% !important; }
      .cred-table td { display: block !important; width: 100% !important; padding: 3px 0 !important; }
      .support-cols td { display: block !important; width: 100% !important; padding-bottom: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #0f172a;">
  <!-- Preheader text (improves inbox placement & preview) -->
  <div style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    Your vendor portal account on Vendora has been successfully activated. Sign in to access your portal and submit invoices.
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="email-wrapper" style="background-color: #f1f5f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="email-card" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 16px 36px -12px rgba(15, 23, 42, 0.08);">

          <!-- Brand Header -->
          <tr>
            <td class="pad-lg" style="background-color: #ffffff; padding: 36px 40px 24px; border-bottom: 1px solid #f8fafc;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <a href="${targetUrl}" target="_blank" style="display: inline-block; text-decoration: none;">
                      <img src="https://ik.imagekit.io/rgng6ajcy/images/header_logo-ClUUROTP.png" alt="BNC Global" width="220" height="42" border="0" class="logo-img" style="display: block; width: 220px; max-width: 100%; height: auto; outline: none; border: none; font-family: 'Segoe UI', Arial, sans-serif; font-size: 22px; font-weight: 800; color: #0372CC;" />
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="pad-lg" style="padding: 24px 40px 36px;">
              <p style="margin: 0 0 18px; color: #0f172a; font-size: 16px; font-weight: 700; line-height: 1.5;">
                Dear ${name},
              </p>
              <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.7;">
                We are pleased to inform you that your vendor account on <strong>Vendora</strong> has been activated. Through this portal, you can complete your profile registration, upload compliance documentation, and submit service invoices with real-time clearance tracking.
              </p>

              <!-- Access Information Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 14px 22px; border-bottom: 1px solid #eef2f6; background-color: #f1f5f9;">
                    <span style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.8px;">
                      Your Portal Sign-In Details
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 18px 22px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="6" class="cred-table">
                      <tr>
                        <td width="34%" style="font-size: 13px; color: #64748b; font-weight: 500;">Portal URL:</td>
                        <td width="66%" style="font-size: 13px; color: #0f172a; font-weight: 600;">
                          <a href="${targetUrl}" target="_blank" style="color: #0372CC; text-decoration: underline;">${targetUrl}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #64748b; font-weight: 500;">Registered Email:</td>
                        <td style="font-size: 13px; color: #0f172a; font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">${normalizedEmail}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #64748b; font-weight: 500;">Initial Password:</td>
                        <td style="font-size: 14px; color: #0372CC; font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">${tempPassword}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Primary Action Button -->
              <table border="0" cellspacing="0" cellpadding="0" class="btn-table" style="margin-bottom: 30px;">
                <tr>
                  <td class="btn-cell" style="background-color: #0372CC; border-radius: 12px;">
                    <a href="${targetUrl}" target="_blank" style="display: inline-block; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 32px; letter-spacing: 0.3px;">
                      Sign in to Vendora &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Getting Started Guide -->
              <div style="background-color: #f8fafc; border-radius: 14px; padding: 20px 22px; border: 1px solid #e2e8f0; margin-bottom: 28px;">
                <p style="margin: 0 0 14px; font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.8px;">
                  Quick Start Guide
                </p>
                <table width="100%" border="0" cellspacing="0" cellpadding="6">
                  <tr>
                    <td width="22" style="vertical-align: top; color: #0372CC; font-weight: 800; font-size: 13px;">1.</td>
                    <td style="font-size: 13px; color: #334155; line-height: 1.6;">
                      <strong>Sign in</strong> with your email and initial password.
                    </td>
                  </tr>
                  <tr>
                    <td width="22" style="vertical-align: top; color: #0372CC; font-weight: 800; font-size: 13px;">2.</td>
                    <td style="font-size: 13px; color: #334155; line-height: 1.6;">
                      <strong>Complete your Profile Registration</strong> (GST, MSME, TDS exemptions, or Lower Deduction Certificate).
                    </td>
                  </tr>
                  <tr>
                    <td width="22" style="vertical-align: top; color: #0372CC; font-weight: 800; font-size: 13px;">3.</td>
                    <td style="font-size: 13px; color: #334155; line-height: 1.6;">
                      <strong>Submit Invoices</strong> with supporting PDF documents to start the payment approval cycle.
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Support Section -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 18px 22px;">
                    <p style="margin: 0 0 12px; font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.8px;">
                      Support & Helpdesk
                    </p>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="support-cols">
                      <tr>
                        <td width="50%" style="vertical-align: top; padding-right: 12px;">
                          <span style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 3px;">Vendor Helpdesk</span>
                          <a href="mailto:info@bncglobal.in" style="font-size: 13px; color: #0372CC; font-weight: 600;">info@bncglobal.in</a>
                        </td>
                        <td width="50%" style="vertical-align: top;">
                          <span style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 3px;">Finance Support</span>
                          <a href="tel:+919304002266" style="font-size: 13px; color: #0372CC; font-weight: 600;">+91-9304002266</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer with Compliance & Identity info -->
          <tr>
            <td class="pad-lg" style="padding: 24px 40px 28px; background-color: #fafbfc; border-top: 1px solid #eef2f6;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <p style="margin: 0 0 4px; font-size: 12px; font-weight: 700; color: #334155;">BNC Global &bull; Universe One</p>
                    <p style="margin: 0 0 6px; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                      This is an automated administrative notification sent to verified vendor partners. Please do not reply directly to this automated email.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                      &copy; ${new Date().getFullYear()} BNC Global. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // 1. Dispatch via ZeptoMail if configured
  if (zohoToken) {
    try {
      const response = await fetch(ZEPTOMAIL_URL, {
        method: 'POST',
        headers: {
          Authorization: zohoToken,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          from: ZEPTOMAIL_FROM,
          reply_to: [
            {
              address: 'info@bncglobal.in',
              name: 'BNC Global Support',
            },
          ],
          to: [
            {
              email_address: {
                address: normalizedEmail,
                name: name,
              },
            },
          ],
          subject,
          textbody: textBody,
          htmlbody: htmlBody,
          client_reference: `vendor_account_created=${normalizedEmail}`,
        }),
      });

      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('ZeptoMail vendor invite failed:', response.status, responseBody);
      } else {
        console.log('ZeptoMail vendor credentials sent successfully to:', normalizedEmail);
      }
    } catch (zeptoErr) {
      console.error('ZeptoMail vendor credentials dispatch error:', zeptoErr);
    }
  }

  // 2. Also log to email_outbox if enabled
  if (EMAIL_NOTIFICATIONS_ENABLED) {
    const dedupeKey = `vendor_created:${normalizedEmail}:${Date.now()}`;
    await adminClient
      .from('email_outbox')
      .insert({
        event_type: 'vendor_created',
        recipient_email: normalizedEmail,
        payload: {
          vendor_name: name,
          email: normalizedEmail,
          temp_password: tempPassword,
          login_url: targetUrl,
        },
        dedupe_key: dedupeKey,
      })
      .catch((err) => {
        console.error('Failed to log to email_outbox:', err);
      });
  }
}

export async function sendOnboardingInviteEmail({
  onboardingRequestId,
  recipientEmail,
  candidateName,
  onboardingLink,
  expiresAt,
}) {
  const normalizedEmail = String(recipientEmail || '').trim().toLowerCase();
  if (!normalizedEmail) return;

  const zohoToken = process.env.ZOHO_TOKEN || process.env.ZEPTOMAIL_TOKEN;
  const name = candidateName || 'Candidate';
  const expiryText = formatExpiryDate(expiresAt);

  const subject = `Welcome to BNC Global — Complete Your Onboarding Details`;
  const textBody = `Dear ${name},

Welcome to BNC Global! We are excited to begin your onboarding process.

Please complete your employee onboarding details using the secure link below:
${onboardingLink}

Important: This secure one-time link is valid until ${expiryText}.

If you have any questions, please reach out to the HR team.

Best regards,
BNC Global HR Team`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to BNC Global</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7fb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #4885f1 100%); padding: 36px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">BNC Global</h1>
              <p style="margin: 6px 0 0; color: #e0e7ff; font-size: 14px; font-weight: 500;">Employee Onboarding Portal</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 20px; font-weight: 700;">Welcome, ${name}!</h2>
              
              <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
                We are thrilled to welcome you to <strong>BNC Global</strong>. To get started with your official employee profile and compliance setup, please complete your onboarding form.
              </p>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${onboardingLink}" target="_blank" style="display: inline-block; background-color: #4885f1; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 36px; border-radius: 12px; box-shadow: 0 4px 14px rgba(72, 133, 241, 0.35);">
                      Complete Onboarding Form &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Direct Link Fallback -->
              <p style="margin: 20px 0 0; color: #64748b; font-size: 12px; line-height: 1.5; word-break: break-all;">
                Or copy and paste this secure link directly in your browser:<br>
                <a href="${onboardingLink}" style="color: #4885f1;">${onboardingLink}</a>
              </p>

              <!-- Expiry Note -->
              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                <p style="margin: 0 0 6px;">&#9201; <strong>Link Expiry:</strong> This secure single-use link is valid until <strong>${expiryText}</strong>.</p>
                <p style="margin: 0;">&#128274; <strong>Security Notice:</strong> This invitation was generated specifically for you. Please do not forward this email to anyone else.</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 500;">BNC Global &bull; Human Resources</p>
              <p style="margin: 4px 0 0; color: #94a3b8; font-size: 12px;">For any queries, please reach out to your HR coordinator.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // 1. Dispatch via ZeptoMail if token is configured
  if (zohoToken) {
    try {
      const response = await fetch(ZEPTOMAIL_URL, {
        method: 'POST',
        headers: {
          Authorization: zohoToken,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          from: ZEPTOMAIL_FROM,
          to: [
            {
              email_address: {
                address: normalizedEmail,
                name: name,
              },
            },
          ],
          subject,
          textbody: textBody,
          htmlbody: htmlBody,
          client_reference: `onboarding_request_id=${onboardingRequestId}`,
        }),
      });

      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('ZeptoMail onboarding invite failed:', response.status, responseBody);
      } else {
        console.log('ZeptoMail onboarding invite sent successfully to:', normalizedEmail);
      }
    } catch (zeptoErr) {
      console.error('ZeptoMail dispatch error:', zeptoErr);
    }
  }

  // 2. Also record in email_outbox if enabled
  if (EMAIL_NOTIFICATIONS_ENABLED) {
    const dedupeKey = `onboarding_invite:${onboardingRequestId}:${Date.now()}`;
    await adminClient
      .from('email_outbox')
      .insert({
        event_type: 'onboarding_invite',
        recipient_email: normalizedEmail,
        payload: {
          onboarding_request_id: onboardingRequestId,
          candidate_name: candidateName,
          onboarding_link: onboardingLink,
          expires_at: expiresAt,
        },
        dedupe_key: dedupeKey,
      })
      .catch((err) => {
        console.error('Failed to log to email_outbox:', err);
      });
  }
}

export const enqueueOnboardingInviteEmail = sendOnboardingInviteEmail;

export async function enqueueTicketEmail({
  recipientEmail,
  ticket,
  recipientName,
  role,
  action,
  actorName,
}) {
  if (!EMAIL_NOTIFICATIONS_ENABLED) return;

  const normalizedEmail = String(recipientEmail || '').trim().toLowerCase();
  if (!normalizedEmail) return;

  const dedupeKey = `ticket_email:${ticket.id}:${role}:${action}:${Date.now()}:${Math.random()}`;

  const { error } = await adminClient
    .from('email_outbox')
    .insert({
      event_type: 'task_assigned',
      recipient_email: normalizedEmail,
      payload: {
        is_ticket: true,
        ticket_id: ticket.id,
        ticket_no: ticket.ticket_no,
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        recipient_name: recipientName,
        email_role: role,
        action: action,
        actor_name: actorName,
        source_module: ticket.source_module || 'hrm',
      },
      dedupe_key: dedupeKey,
    });

  if (error) {
    throw new Error(error.message || 'Failed to enqueue ticket email');
  }
}

export async function enqueueLeaveRequestEmail({
  recipientEmail,
  recipientName,
  employeeName,
  leaveType,
  startDate,
  endDate,
  durationDays,
  reason,
  role,
}) {
  if (!EMAIL_NOTIFICATIONS_ENABLED) return;

  const normalizedEmail = String(recipientEmail || '').trim().toLowerCase();
  if (!normalizedEmail) return;

  const dedupeKey = `leave_email:${employeeName}:${startDate}:${normalizedEmail}:${Date.now()}:${Math.random()}`;

  const { error } = await adminClient
    .from('email_outbox')
    .insert({
      event_type: 'task_assigned',
      recipient_email: normalizedEmail,
      payload: {
        is_leave: true,
        recipient_name: recipientName,
        employee_name: employeeName,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        duration_days: durationDays,
        reason: reason,
        recipient_role: role,
      },
      dedupe_key: dedupeKey,
    });

  if (error) {
    throw new Error(error.message || 'Failed to enqueue leave request email');
  }
}

export async function enqueueRegularizationRequestEmail({
  recipientEmail,
  recipientName,
  employeeName,
  date,
  requestType,
  requestedCheckIn,
  requestedCheckOut,
  reason,
  role,
}) {
  if (!EMAIL_NOTIFICATIONS_ENABLED) return;

  const normalizedEmail = String(recipientEmail || '').trim().toLowerCase();
  if (!normalizedEmail) return;

  const dedupeKey = `regularization_email:${employeeName}:${date}:${normalizedEmail}:${Date.now()}:${Math.random()}`;

  const { error } = await adminClient
    .from('email_outbox')
    .insert({
      event_type: 'task_assigned',
      recipient_email: normalizedEmail,
      payload: {
        is_regularization: true,
        recipient_name: recipientName,
        employee_name: employeeName,
        date: date,
        request_type: requestType,
        requested_check_in: requestedCheckIn,
        requested_check_out: requestedCheckOut,
        reason: reason,
        recipient_role: role,
      },
      dedupe_key: dedupeKey,
    });

  if (error) {
    throw new Error(error.message || 'Failed to enqueue regularization request email');
  }
}

