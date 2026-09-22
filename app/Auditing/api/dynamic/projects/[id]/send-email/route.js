import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req, { params }) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { client_person_id, tracker_ids } = body;

    if (!client_person_id) {
      return NextResponse.json({ success: false, error: "Client Person is required" }, { status: 400 });
    }

    const supabase = adminClient();

    // 1. Fetch Client Person details
    const { data: clientPerson, error: personError } = await supabase
      .from('audit_pre_execution_org')
      .select('*')
      .eq('id', client_person_id)
      .single();

    if (personError || !clientPerson || !clientPerson.email) {
      return NextResponse.json({ success: false, error: "Client Person email not found in Org Structure" }, { status: 400 });
    }

    // 2. Generate 24-Hour Token
    const tokenStr = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { data: tokenRecord, error: tokenError } = await supabase
      .from('audit_upload_tokens')
      .insert([{
        token: tokenStr,
        project_id: projectId,
        client_person_id: client_person_id,
        client_email: clientPerson.email,
        data_tracker_ids: tracker_ids || [],
        expires_at: expiresAt,
        is_used: false
      }])
      .select()
      .single();

    if (tokenError) {
      return NextResponse.json({ success: false, error: tokenError.message }, { status: 500 });
    }

    // 3. Construct Public Upload Portal Link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://universeone.bncglobal.in';
    const uploadPortalUrl = `${baseUrl}/audit-upload?token=${tokenStr}`;

    // 4. Send Email via Brevo API if available
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (brevoApiKey) {
      try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: 'UniverseOne Audit', email: 'noreply@bncglobal.in' },
            to: [{ email: clientPerson.email, name: clientPerson.member_name }],
            subject: 'Action Required: Information & Document Request (IDR)',
            htmlContent: `
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
                              <span style="font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #1a2b4c; text-transform: uppercase; font-family: Arial, sans-serif;">
                                UNIVERSEONE <span style="color: #3d63ab; font-weight: 400;">AUDIT</span>
                              </span>
                            </td>
                            <td align="right" style="font-size: 12px; color: #64748b; font-weight: 500;">
                              Confidential Audit Notice
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #ffffff; border-radius: 8px; border: 1px solid #dbe2ea; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden;">
                        
                        <div style="padding: 36px 36px 32px;">
                          
                          <!-- MEMO HEADER BLOCK -->
                          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px;">
                            <tr>
                              <td>
                                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #3d63ab; margin-bottom: 6px;">
                                  Information Document Request (IDR)
                                </div>
                                <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                                  Audit Document Upload Request
                                </h1>
                              </td>
                            </tr>
                          </table>

                          <!-- SALUTATION & INSTRUCTIONS -->
                          <p style="font-size: 14.5px; color: #1e293b; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                            Dear <strong>${clientPerson.member_name}</strong>,
                          </p>
                          
                          <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
                            The Audit Team has issued an Information Document Request (IDR) for your review. Please click the button below to upload the requested audit files:
                          </p>

                          <!-- PRIMARY ACTION BUTTON -->
                          <div style="text-align: center; margin: 32px 0 28px;">
                            <a href="${uploadPortalUrl}" target="_blank" style="display: inline-block; background-color: #3d63ab; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 6px; font-weight: 600; font-size: 14px; letter-spacing: 0.2px;">
                              Access Secure Upload Portal &rarr;
                            </a>
                          </div>

                          <!-- SECURITY NOTICE -->
                          <div style="background-color: #f8fafc; border-left: 3px solid #3d63ab; border-radius: 0 4px 4px 0; padding: 12px 16px; margin-bottom: 24px;">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td width="22" valign="middle">
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3d63ab" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                  </svg>
                                </td>
                                <td style="font-size: 12px; color: #475569; line-height: 1.4;">
                                  This upload link is secured with 256-bit encryption and will remain active for <strong>24 hours</strong>.
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
                          This message was generated by UniverseOne Audit Engine for <strong>${clientPerson.email}</strong>.<br/>
                          Confidentiality Note: This transmission is intended solely for the designated recipient.
                        </div>

                      </td>
                    </tr>
                  </table>
                </body>
              </html>
            `
          })
        });
      } catch (emailErr) {
        console.error("Brevo dispatch error:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      token: tokenStr,
      upload_url: uploadPortalUrl,
      recipient: clientPerson.email,
      expires_at: expiresAt
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
