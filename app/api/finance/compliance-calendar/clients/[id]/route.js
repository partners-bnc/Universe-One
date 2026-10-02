import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

    const { data: client, error } = await adminClient
      .from('finance_compliance_calendar_clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error('GET /api/finance/compliance-calendar/clients/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch client' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

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
      is_active,
    } = body;

    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (company_name !== undefined) updates.company_name = company_name.trim();
    if (client_name !== undefined) updates.client_name = client_name.trim();
    if (designation !== undefined) updates.designation = designation?.trim() || null;
    if (email !== undefined) updates.email = email.trim().toLowerCase();
    if (phone !== undefined) updates.phone = phone?.trim() || null;
    if (pan_number !== undefined) updates.pan_number = pan_number?.trim() || null;
    if (gstin !== undefined) updates.gstin = gstin?.trim() || null;
    if (address !== undefined) updates.address = address?.trim() || null;
    if (is_active !== undefined) updates.is_active = Boolean(is_active);

    const { data: updatedClient, error } = await adminClient
      .from('finance_compliance_calendar_clients')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, client: updatedClient });
  } catch (error) {
    console.error('PUT /api/finance/compliance-calendar/clients/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

    const { error } = await adminClient
      .from('finance_compliance_calendar_clients')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/finance/compliance-calendar/clients/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete client' }, { status: 500 });
  }
}
