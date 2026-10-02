import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || searchParams.get('clientId');

    if (companyId) {
      const { data, error } = await adminClient
        .from('finance_compliance')
        .select('id, company_name, email_logs')
        .eq('id', companyId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching email logs for company:', error.message);
        return NextResponse.json({ logs: [] });
      }

      const logs = Array.isArray(data?.email_logs) ? data.email_logs : [];
      return NextResponse.json({ logs });
    }

    // Otherwise return logs across all companies
    const { data: companies, error } = await adminClient
      .from('finance_compliance')
      .select('id, company_name, email_logs');

    if (error) {
      console.warn('Error fetching all email logs:', error.message);
      return NextResponse.json({ logs: [] });
    }

    const allLogs = (companies || []).flatMap((c) =>
      Array.isArray(c.email_logs)
        ? c.email_logs.map((l) => ({
            ...l,
            company_id: c.id,
            company_name: c.company_name,
          }))
        : []
    );

    allLogs.sort((a, b) => new Date(b.sent_at || 0) - new Date(a.sent_at || 0));

    return NextResponse.json({ logs: allLogs });
  } catch (error) {
    console.error('GET /api/finance/compliance-calendar/email-logs error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch email logs' }, { status: 500 });
  }
}
