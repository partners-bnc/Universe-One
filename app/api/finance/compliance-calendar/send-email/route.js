import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';
import {
  buildComplianceEmailHtml,
  sendComplianceReportEmail,
} from '@/utils/finance-compliance-email';
import {
  formatPeriodLabel,
  formatPeriodFull,
  computeEffectiveStatus,
  resolveEffectiveEntry,
} from '@/utils/finance-compliance-master';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      companyId,
      recipientEmail,
      recipientName,
      periodMonth = 9,
      periodYear = 2026,
      subject: customSubject,
      customMessage = '',
      senderName = 'Universe One Finance Team',
      itemsOverride = null,
      entriesOverride = null,
    } = body;

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
    }

    // 1. Fetch Company from Unified Table
    let { data: company, error: compErr } = await adminClient
      .from('finance_compliance')
      .select('*')
      .eq('id', companyId)
      .maybeSingle();

    if (!company) {
      // Fallback in case old table is queried
      const { data: oldComp } = await adminClient
        .from('finance_compliance_companies')
        .select('*')
        .eq('id', companyId)
        .maybeSingle();
      company = oldComp;
    }

    const companyName = company?.company_name || 'Valued Client';
    const periodLabel = formatPeriodLabel(Number(periodMonth), Number(periodYear));
    const periodFull = formatPeriodFull(Number(periodMonth), Number(periodYear));
    const finalSubject =
      customSubject?.trim() ||
      `Statutory Compliance Calendar - ${companyName} (${periodLabel})`;

    // Determine target recipient email
    const finalRecipientEmail =
      recipientEmail ||
      (company?.persons && company.persons[0]?.email) ||
      company?.email;
    const finalRecipientName =
      recipientName ||
      (company?.persons && company.persons[0]?.name) ||
      companyName;

    if (!finalRecipientEmail) {
      return NextResponse.json(
        { error: 'Please specify a recipient email address.' },
        { status: 400 }
      );
    }

    // 2. Fetch or Extract Items & Entries
    let items = itemsOverride;
    let entriesMap = entriesOverride || {};

    if (!items) {
      if (company?.compliance_items && Array.isArray(company.compliance_items)) {
        items = company.compliance_items;
        const periodKey = `${periodYear}_${periodMonth}`;
        entriesMap = company.monthly_entries?.[periodKey] || {};
      } else {
        const { data: fetchedItems } = await adminClient
          .from('finance_compliance_calendar_items')
          .select('*')
          .eq('company_id', companyId)
          .order('s_no', { ascending: true });
        items = fetchedItems || [];
      }
    }

    let completedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    const allMonthlyEntries = company?.monthly_entries || {};

    const itemsWithEntries = (items || []).map((item, idx) => {
      const entry = {
        ...(entriesMap[item.id] || {}),
        ...resolveEffectiveEntry(item, allMonthlyEntries, Number(periodMonth), Number(periodYear)),
      };
      const status = computeEffectiveStatus(
        item,
        entry,
        Number(periodMonth),
        Number(periodYear),
        new Date(),
        company?.created_at
      );

      if (status === 'Completed') completedCount++;
      else if (status === 'In Progress') inProgressCount++;
      else if (status === 'Overdue') overdueCount++;
      else pendingCount++;

      return {
        ...item,
        s_no: item.s_no || idx + 1,
        actual_payment_date: entry.actual_payment_date || '—',
        status,
        remarks: entry.remarks || '—',
      };
    });

    const totalCount = itemsWithEntries.length;
    const score = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // 3. Build HTML Email Body with formatted table & status badges
    const htmlBody = buildComplianceEmailHtml({
      companyName,
      clientName: finalRecipientName,
      periodLabel,
      periodFull,
      itemsWithEntries,
      customMessage,
      stats: {
        total: totalCount,
        completed: completedCount,
        inProgress: inProgressCount,
        pending: pendingCount,
        overdue: overdueCount,
        score,
      },
    });

    // 4. Send Email via ZeptoMail
    let sendResult = { success: true };
    let errorMessage = null;
    let status = 'sent';

    try {
      sendResult = await sendComplianceReportEmail({
        recipientEmail: finalRecipientEmail,
        recipientName: finalRecipientName,
        subject: finalSubject,
        htmlBody,
      });
    } catch (err) {
      console.error('Email sending error:', err);
      status = 'failed';
      errorMessage = err.message || 'Failed to dispatch email';
    }

    // 5. Append to email_logs in finance_compliance table
    const logEntry = {
      id: `email-log-${Date.now()}`,
      sent_at: new Date().toISOString(),
      recipient_email: finalRecipientEmail,
      recipient_name: finalRecipientName,
      subject: finalSubject,
      status,
      items_count: totalCount,
      completed_count: completedCount,
      error_message: errorMessage,
      sent_by: senderName,
    };

    if (company && company.id) {
      const currentLogs = Array.isArray(company.email_logs) ? company.email_logs : [];
      await adminClient
        .from('finance_compliance')
        .update({
          email_logs: [logEntry, ...currentLogs],
        })
        .eq('id', company.id);
    }

    if (status === 'failed') {
      return NextResponse.json(
        { error: errorMessage || 'Failed to dispatch email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Compliance calendar report sent to ${finalRecipientEmail}`,
      simulated: Boolean(sendResult?.simulated),
      logEntry,
    });
  } catch (error) {
    console.error('POST /api/finance/compliance-calendar/send-email error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
