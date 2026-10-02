import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let query = adminClient
      .from('finance_compliance_calendar_clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`company_name.ilike.%${search}%,client_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: clients, error } = await query;

    if (error) {
      // If table not migrated in DB yet, fallback gracefully
      console.warn('Clients query error:', error.message);
      return NextResponse.json({ clients: [], db_error: error.message });
    }

    // Fetch items counts for each client
    const { data: allItems } = await adminClient
      .from('finance_compliance_calendar_items')
      .select('client_id');

    const countsMap = {};
    (allItems || []).forEach(item => {
      countsMap[item.client_id] = (countsMap[item.client_id] || 0) + 1;
    });

    const enrichedClients = (clients || []).map(client => ({
      ...client,
      items_count: countsMap[client.id] || 0,
    }));

    return NextResponse.json({ clients: enrichedClients });
  } catch (error) {
    console.error('GET /api/finance/compliance-calendar/clients error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      company_name,
      client_name,
      designation,
      email,
      phone,
      pan_number,
      gstin,
      address,
    } = body;

    if (!company_name?.trim() || !client_name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Company Name, Contact Person Name, and Email are required.' },
        { status: 400 }
      );
    }

    const { data: newClient, error: clientError } = await adminClient
      .from('finance_compliance_calendar_clients')
      .insert({
        company_name: company_name.trim(),
        client_name: client_name.trim(),
        designation: designation?.trim() || null,
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        pan_number: pan_number?.trim() || null,
        gstin: gstin?.trim() || null,
        address: address?.trim() || null,
      })
      .select('*')
      .single();

    if (clientError) {
      throw clientError;
    }

    return NextResponse.json({
      success: true,
      client: newClient,
    });
  } catch (error) {
    console.error('POST /api/finance/compliance-calendar/clients error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create client' }, { status: 500 });
  }
}
