import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let query = adminClient
      .from('finance_compliance')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`company_name.ilike.%${search}%,industry.ilike.%${search}%`);
    }

    const { data: companies, error } = await query;

    if (error) {
      console.warn('finance_compliance query error:', error.message);
      return NextResponse.json({ companies: [], db_error: error.message });
    }

    return NextResponse.json({ companies: companies || [] });
  } catch (error) {
    console.error('GET /api/finance/compliance error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      company_name,
      industry,
      pan_number,
      gstin,
      cin_number,
      address,
      website,
      persons = [],
      compliance_items = [],
      monthly_entries = {},
    } = body;

    if (!company_name?.trim()) {
      return NextResponse.json({ error: 'Company Name is required' }, { status: 400 });
    }

    const items = Array.isArray(compliance_items) ? compliance_items : [];

    const { data: newCompany, error } = await adminClient
      .from('finance_compliance')
      .insert({
        company_name: company_name.trim(),
        industry: industry?.trim() || null,
        pan_number: pan_number?.trim() || null,
        gstin: gstin?.trim() || null,
        cin_number: cin_number?.trim() || null,
        address: address?.trim() || null,
        website: website?.trim() || null,
        persons: persons || [],
        compliance_items: items || [],
        monthly_entries: monthly_entries || {},
        email_logs: [],
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, company: newCompany });
  } catch (error) {
    console.error('POST /api/finance/compliance error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create company' }, { status: 500 });
  }
}
