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
      console.warn('Companies query error:', error.message);
      return NextResponse.json({ companies: [], db_error: error.message });
    }

    const enriched = (companies || []).map(c => ({
      ...c,
      persons: c.persons || [],
      items_count: (c.compliance_items || []).length,
    }));

    return NextResponse.json({ companies: enriched });
  } catch (error) {
    console.error('GET /api/finance/companies error:', error);
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
      note,
      persons = [],
      initial_persons = [],
      compliance_items = [],
    } = body;

    if (!company_name?.trim()) {
      return NextResponse.json({ error: 'Company Name is required.' }, { status: 400 });
    }

    const membersList = persons.length > 0 ? persons : initial_persons;
    const formattedPersons = membersList
      .filter(p => p.name?.trim() && p.email?.trim())
      .map((p, idx) => ({
        id: p.id || `person-${Date.now()}-${idx + 1}`,
        name: p.name.trim(),
        designation: p.designation?.trim() || null,
        email: p.email.trim().toLowerCase(),
        phone: p.phone?.trim() || null,
        is_primary: idx === 0 || Boolean(p.is_primary),
      }));

    const items = Array.isArray(compliance_items) ? compliance_items : [];

    const { data: newCompany, error } = await adminClient
      .from('finance_compliance')
      .insert({
        company_name: company_name.trim(),
        industry: industry?.trim() || null,
        pan_number: pan_number?.trim() || null,
        gstin: (gstin || body.gst_number)?.trim() || null,
        cin_number: cin_number?.trim() || null,
        address: address?.trim() || null,
        website: website?.trim() || null,
        note: note?.trim() || null,
        persons: formattedPersons,
        compliance_items: items,
        monthly_entries: {},
        email_logs: [],
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      company: newCompany,
    });
  } catch (error) {
    console.error('POST /api/finance/companies error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create company' }, { status: 500 });
  }
}
