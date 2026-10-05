import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export async function GET(request, { params }) {
  try {
    const { id: companyId } = await params;
    if (!companyId) return NextResponse.json({ error: 'Company ID required' }, { status: 400 });

    const { data: company, error } = await adminClient
      .from('finance_compliance')
      .select('persons')
      .eq('id', companyId)
      .single();

    if (error) {
      console.warn('GET persons error from finance_compliance:', error.message);
      return NextResponse.json({ persons: [] });
    }

    return NextResponse.json({ persons: company?.persons || [] });
  } catch (error) {
    console.error('GET /api/finance/companies/[id]/persons error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch persons' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id: companyId } = await params;
    if (!companyId) return NextResponse.json({ error: 'Company ID required' }, { status: 400 });

    const body = await request.json();
    const { name, designation, email, phone, is_primary = false, company_directory = '' } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    // Fetch current persons array
    const { data: company, error: fetchErr } = await adminClient
      .from('finance_compliance')
      .select('persons')
      .eq('id', companyId)
      .single();

    if (fetchErr) throw fetchErr;

    const currentPersons = Array.isArray(company?.persons) ? company.persons : [];

    // If new person is primary, unmark others
    const adjustedPersons = is_primary
      ? currentPersons.map((p) => ({ ...p, is_primary: false }))
      : currentPersons;

    const newPerson = {
      id: `person-${Date.now()}`,
      name: name.trim(),
      designation: designation?.trim() || null,
      company_directory: company_directory?.trim() || 'General Directory',
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      is_primary: Boolean(is_primary) || adjustedPersons.length === 0,
      created_at: new Date().toISOString(),
    };

    const updatedPersons = [...adjustedPersons, newPerson];

    const { error: updateErr } = await adminClient
      .from('finance_compliance')
      .update({
        persons: updatedPersons,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, person: newPerson, persons: updatedPersons });
  } catch (error) {
    console.error('POST /api/finance/companies/[id]/persons error:', error);
    return NextResponse.json({ error: error.message || 'Failed to add person' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: companyId } = await params;
    if (!companyId) return NextResponse.json({ error: 'Company ID required' }, { status: 400 });

    const body = await request.json();
    const { personId, name, designation, email, phone, is_primary, company_directory } = body;

    if (!personId) return NextResponse.json({ error: 'personId is required' }, { status: 400 });

    const { data: company, error: fetchErr } = await adminClient
      .from('finance_compliance')
      .select('persons')
      .eq('id', companyId)
      .single();

    if (fetchErr) throw fetchErr;

    let currentPersons = Array.isArray(company?.persons) ? company.persons : [];

    let updatedPerson = null;
    currentPersons = currentPersons.map((p) => {
      if (p.id === personId) {
        updatedPerson = {
          ...p,
          name: name !== undefined ? name.trim() : p.name,
          designation: designation !== undefined ? designation?.trim() || null : p.designation,
          company_directory:
            company_directory !== undefined
              ? company_directory?.trim() || 'General Directory'
              : p.company_directory || 'General Directory',
          email: email !== undefined ? email.trim().toLowerCase() : p.email,
          phone: phone !== undefined ? phone?.trim() || null : p.phone,
          is_primary: is_primary !== undefined ? Boolean(is_primary) : p.is_primary,
          updated_at: new Date().toISOString(),
        };
        return updatedPerson;
      }
      if (is_primary) {
        return { ...p, is_primary: false };
      }
      return p;
    });

    const { error: updateErr } = await adminClient
      .from('finance_compliance')
      .update({
        persons: currentPersons,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, person: updatedPerson, persons: currentPersons });
  } catch (error) {
    console.error('PUT /api/finance/companies/[id]/persons error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update person' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: companyId } = await params;
    if (!companyId) return NextResponse.json({ error: 'Company ID required' }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const personId = searchParams.get('personId');

    if (!personId) return NextResponse.json({ error: 'personId query parameter required' }, { status: 400 });

    const { data: company, error: fetchErr } = await adminClient
      .from('finance_compliance')
      .select('persons')
      .eq('id', companyId)
      .single();

    if (fetchErr) throw fetchErr;

    const currentPersons = Array.isArray(company?.persons) ? company.persons : [];
    const updatedPersons = currentPersons.filter((p) => p.id !== personId);

    const { error: updateErr } = await adminClient
      .from('finance_compliance')
      .update({
        persons: updatedPersons,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, persons: updatedPersons });
  } catch (error) {
    console.error('DELETE /api/finance/companies/[id]/persons error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete person' }, { status: 500 });
  }
}
