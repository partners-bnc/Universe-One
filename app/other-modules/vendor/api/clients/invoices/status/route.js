import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/admin';
import { resolveAuthenticatedUserContext } from '@/utils/auth/context';

const VENDOR_INVOICES_TABLE = 'vendor_invoices';

async function getInternalAuthContext() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const authContext = await resolveAuthenticatedUserContext(supabase, user);
  if (!authContext || authContext.accountType === 'vendor') return null;

  return authContext;
}

export async function PATCH(request) {
  try {
    const authContext = await getInternalAuthContext();
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, payment_reference, remarks } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Invoice ID and status are required' }, { status: 400 });
    }

    const updates = {
      status,
      remarks: remarks || null,
      updated_at: new Date().toISOString()
    };

    if (payment_reference !== undefined) {
      updates.payment_reference = payment_reference || null;
    }

    if (status === 'paid') {
      updates.paid_at = new Date().toISOString();
    } else if (status !== 'paid') {
      updates.paid_at = null;
    }

    const { data: updatedInvoice, error } = await adminClient
      .from(VENDOR_INVOICES_TABLE)
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error('PATCH /api/clients/invoices/status error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
