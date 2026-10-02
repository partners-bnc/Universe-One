import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Company ID required' }, { status: 400 });

    const { data: company, error } = await adminClient
      .from('finance_compliance')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

    return NextResponse.json({ company });
  } catch (error) {
    console.error('GET /api/finance/companies/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch company' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Company ID required' }, { status: 400 });

    const body = await request.json();
    const {
      company_name,
      industry,
      pan_number,
      gstin,
      cin_number,
      address,
      website,
      note,
      persons,
      compliance_items,
      monthly_entries,
      email_logs,
      is_active,
    } = body;

    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (company_name !== undefined) updates.company_name = company_name.trim();
    if (industry !== undefined) updates.industry = industry?.trim() || null;
    if (pan_number !== undefined) updates.pan_number = pan_number?.trim() || null;
    if (gstin !== undefined) updates.gstin = gstin?.trim() || null;
    if (cin_number !== undefined) updates.cin_number = cin_number?.trim() || null;
    if (address !== undefined) updates.address = address?.trim() || null;
    if (website !== undefined) updates.website = website?.trim() || null;
    if (note !== undefined) updates.note = note?.trim() || null;
    if (persons !== undefined) updates.persons = persons;
    if (compliance_items !== undefined) updates.compliance_items = compliance_items;
    if (monthly_entries !== undefined) updates.monthly_entries = monthly_entries;
    if (email_logs !== undefined) updates.email_logs = email_logs;
    if (is_active !== undefined) updates.is_active = Boolean(is_active);

    const { data: updated, error } = await adminClient
      .from('finance_compliance')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, company: updated });
  } catch (error) {
    console.error('PUT /api/finance/companies/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update company' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Company ID required' }, { status: 400 });

    const { error } = await adminClient
      .from('finance_compliance')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/finance/companies/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete company' }, { status: 500 });
  }
}
