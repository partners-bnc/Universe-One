import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || searchParams.get('clientId');

    if (!companyId) {
      return NextResponse.json({ error: 'companyId query parameter is required' }, { status: 400 });
    }

    const { data: company, error } = await adminClient
      .from('finance_compliance')
      .select('compliance_items')
      .eq('id', companyId)
      .single();

    if (error) {
      console.warn('GET items error from finance_compliance:', error.message);
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: company?.compliance_items || [] });
  } catch (error) {
    console.error('GET /api/finance/compliance-calendar/items error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      company_id,
      client_id,
      compliance_nature,
      frequency,
      statutory_due_date,
      internal_control_due_date,
      s_no,
    } = body;

    const targetCompanyId = company_id || client_id;

    if (!targetCompanyId) {
      return NextResponse.json({ error: 'company_id is required' }, { status: 400 });
    }

    // Fetch current company
    const { data: company, error: fetchErr } = await adminClient
      .from('finance_compliance')
      .select('compliance_items')
      .eq('id', targetCompanyId)
      .single();

    if (fetchErr) throw fetchErr;

    const currentItems = Array.isArray(company?.compliance_items) ? company.compliance_items : [];

    if (!compliance_nature?.trim() || !frequency || !statutory_due_date) {
      return NextResponse.json(
        { error: 'Compliance Nature, Frequency, and Statutory Due Date are required.' },
        { status: 400 }
      );
    }

    const nextSNo =
      s_no ||
      (currentItems.length > 0 ? Math.max(...currentItems.map((it) => it.s_no || 0)) + 1 : 1);

    const newItem = {
      id: `item-${Date.now()}`,
      s_no: nextSNo,
      compliance_nature: compliance_nature.trim(),
      frequency,
      statutory_due_date: statutory_due_date.trim(),
      internal_control_due_date: internal_control_due_date?.trim() || null,
    };

    const updatedItems = [...currentItems, newItem];

    const { error: updateErr } = await adminClient
      .from('finance_compliance')
      .update({
        compliance_items: updatedItems,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetCompanyId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, item: newItem, items: updatedItems });
  } catch (error) {
    console.error('POST /api/finance/compliance-calendar/items error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create item' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      item_id,
      id,
      company_id,
      client_id,
      compliance_nature,
      frequency,
      statutory_due_date,
      internal_control_due_date,
    } = body;

    const targetItemId = item_id || id;
    const targetCompanyId = company_id || client_id;

    if (!targetItemId || !targetCompanyId) {
      return NextResponse.json({ error: 'item_id and company_id are required' }, { status: 400 });
    }

    const { data: company, error: fetchErr } = await adminClient
      .from('finance_compliance')
      .select('compliance_items')
      .eq('id', targetCompanyId)
      .single();

    if (fetchErr) throw fetchErr;

    const currentItems = Array.isArray(company?.compliance_items) ? company.compliance_items : [];
    const updatedItems = currentItems.map((it) => {
      if (it.id === targetItemId) {
        return {
          ...it,
          compliance_nature: compliance_nature ? compliance_nature.trim() : it.compliance_nature,
          frequency: frequency || it.frequency,
          statutory_due_date: statutory_due_date ? statutory_due_date.trim() : it.statutory_due_date,
          internal_control_due_date:
            internal_control_due_date !== undefined
              ? (internal_control_due_date?.trim() || null)
              : it.internal_control_due_date,
        };
      }
      return it;
    });

    const { error: updateErr } = await adminClient
      .from('finance_compliance')
      .update({
        compliance_items: updatedItems,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetCompanyId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, items: updatedItems });
  } catch (error) {
    console.error('PUT /api/finance/compliance-calendar/items error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const companyId = searchParams.get('companyId');

    if (!id) {
      return NextResponse.json({ error: 'id query parameter is required' }, { status: 400 });
    }

    if (companyId) {
      const { data: company, error: fetchErr } = await adminClient
        .from('finance_compliance')
        .select('compliance_items')
        .eq('id', companyId)
        .single();

      if (!fetchErr && company) {
        const currentItems = Array.isArray(company.compliance_items) ? company.compliance_items : [];
        const updatedItems = currentItems.filter((it) => it.id !== id);

        await adminClient
          .from('finance_compliance')
          .update({
            compliance_items: updatedItems,
            updated_at: new Date().toISOString(),
          })
          .eq('id', companyId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/finance/compliance-calendar/items error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete item' }, { status: 500 });
  }
}
