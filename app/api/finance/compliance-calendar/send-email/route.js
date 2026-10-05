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
      recipientEmails = [],
      recipientName,
      recipientNames = [],
      ccEmails = [],
      periodMonth = 9,
      periodYear = 2026,
      financialYear = null,
      includeHeatmap = true,
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

    // Determine target recipient emails
    let targetRecipients = [];
    if (Array.isArray(recipientEmails) && recipientEmails.length > 0) {
      targetRecipients = recipientEmails.filter(Boolean);
    } else if (recipientEmail) {
      targetRecipients = [recipientEmail];
    } else if (company?.persons && company.persons.length > 0) {
      targetRecipients = [company.persons[0].email];
    } else if (company?.email) {
      targetRecipients = [company.email];
    }

    if (targetRecipients.length === 0) {
      return NextResponse.json(
        { error: 'Please specify at least one recipient email address.' },
        { status: 400 }
      );
    }

    // Dynamic resolution of recipient names from company directory
    const companyPersons = Array.isArray(company?.persons) ? company.persons : [];
    const matchedRecipientDetails = targetRecipients.map((email, idx) => {
      const cleanEmail = email.trim();
      const foundPerson = companyPersons.find(
        (p) => p.email && p.email.trim().toLowerCase() === cleanEmail.toLowerCase()
      );
      const providedName = Array.isArray(recipientNames) && recipientNames[idx] ? recipientNames[idx] : null;
      
      const resolvedName =
        foundPerson?.name ||
        providedName ||
        (targetRecipients.length === 1 && recipientName ? recipientName : cleanEmail.split('@')[0]);

      return {
        email: cleanEmail,
        name: resolvedName,
      };
    });

    const recipientNamesList = matchedRecipientDetails.map((r) => r.name).filter(Boolean);
    const finalRecipientName =
      recipientNamesList.length > 0
        ? recipientNamesList.length <= 3
          ? recipientNamesList.join(', ')
          : `${recipientNamesList.slice(0, 2).join(', ')} & ${recipientNamesList.length - 2} more`
        : recipientName || companyName;

    // Calculate FY start year
    const fyStartYear = financialYear
      ? Number(financialYear)
      : Number(periodMonth) >= 4
      ? Number(periodYear)
      : Number(periodYear) - 1;

    const fyEndYear = fyStartYear + 1;
    const fyLabel = `FY ${fyStartYear}–${String(fyEndYear).slice(-2)}`;

    const finalSubject =
      customSubject?.trim() ||
      `Statutory Compliance Heat Map - ${companyName} (${fyLabel})`;

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

    // 3. Build HTML Email Body featuring the complete 12-Month Financial Year Heat Map
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
      fyStartYear,
      monthlyEntries: allMonthlyEntries,
      companyCreatedAt: company?.created_at,
      includeHeatmap: true,
    });

    // 4. Send Email via ZeptoMail
    let sendResult = { success: true };
    let errorMessage = null;
    let status = 'sent';

    try {
      sendResult = await sendComplianceReportEmail({
        recipientEmail: targetRecipients[0],
        recipientEmails: matchedRecipientDetails,
        recipientName: finalRecipientName,
        ccEmails,
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
      recipient_email: targetRecipients.join(', '),
      recipient_name: finalRecipientName,
      cc_emails: Array.isArray(ccEmails) ? ccEmails.join(', ') : ccEmails,
      financial_year: fyLabel,
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
      message: `Compliance heat map emailed to ${targetRecipients.join(', ')}`,
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
