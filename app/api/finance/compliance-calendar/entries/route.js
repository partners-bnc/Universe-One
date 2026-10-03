import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';
import { resolveEffectiveEntry } from '@/utils/finance-compliance-master';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || searchParams.get('clientId');
    const month = parseInt(searchParams.get('month') || '9', 10);
    const year = parseInt(searchParams.get('year') || '2026', 10);

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
    }

    const { data: company, error } = await adminClient
      .from('finance_compliance')
      .select('compliance_items, monthly_entries')
      .eq('id', companyId)
      .single();

    if (error) {
      console.warn('GET entries error from finance_compliance:', error.message);
      return NextResponse.json({ entries: {} });
    }

    const items = company?.compliance_items || [];
    const allMonthlyEntries = company?.monthly_entries || {};
    const periodKey = `${year}_${month}`;
    const directPeriodEntries = allMonthlyEntries[periodKey] || {};

    const resolvedEntries = { ...directPeriodEntries };

    items.forEach((item) => {
      const effective = resolveEffectiveEntry(item, allMonthlyEntries, month, year);
      if (effective && Object.keys(effective).length > 0) {
        resolvedEntries[item.id] = {
          ...(resolvedEntries[item.id] || {}),
          ...effective,
        };
      }
    });

    return NextResponse.json({ entries: resolvedEntries });
  } catch (error) {
    console.error('GET /api/finance/compliance-calendar/entries error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      item_id,
      company_id,
      client_id,
      period_month,
      period_year,
      actual_payment_date,
      status,
      remarks,
      updated_by_name,
    } = body;

    const targetCompanyId = company_id || client_id;

    if (!item_id || !targetCompanyId || !period_month || !period_year) {
      return NextResponse.json(
        { error: 'item_id, company_id, period_month, and period_year are required' },
        { status: 400 }
      );
    }

    const { data: company, error: fetchErr } = await adminClient
      .from('finance_compliance')
      .select('monthly_entries')
      .eq('id', targetCompanyId)
      .single();

    if (fetchErr) throw fetchErr;

    const currentMonthlyEntries = company?.monthly_entries || {};
    const periodKey = `${period_year}_${period_month}`;
    const currentPeriodMap = currentMonthlyEntries[periodKey] || {};

    const updatedEntry = {
      ...(currentPeriodMap[item_id] || {}),
      item_id,
      actual_payment_date: actual_payment_date || null,
      status: status || 'Pending',
      remarks: remarks || null,
      updated_by_name: updated_by_name || 'Finance User',
      updated_at: new Date().toISOString(),
    };

    const updatedMonthlyEntries = {
      ...currentMonthlyEntries,
      [periodKey]: {
        ...currentPeriodMap,
        [item_id]: updatedEntry,
      },
    };

    const { error: updateErr } = await adminClient
      .from('finance_compliance')
      .update({
        monthly_entries: updatedMonthlyEntries,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetCompanyId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, entry: updatedEntry });
  } catch (error) {
    console.error('POST /api/finance/compliance-calendar/entries error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update entry' }, { status: 500 });
  }
}
