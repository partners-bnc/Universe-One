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

