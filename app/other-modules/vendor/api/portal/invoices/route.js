import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/admin';

const BUCKET_NAME = 'vendor-portal-docs';
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

async function getVendorContext() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const normalizedEmail = String(user.email || '').trim().toLowerCase();

  // 1. Search by auth_user_id
  let { data: profilesByAuth } = await adminClient
    .from('vendor_profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1);

  let profile = profilesByAuth?.[0] || null;

  // 2. If not found by auth_user_id, match by email
  if (!profile && normalizedEmail) {
    const { data: profilesByEmail } = await adminClient
      .from('vendor_profiles')
      .select('*')
      .ilike('email', normalizedEmail)
      .order('created_at', { ascending: false })
      .limit(1);

    profile = profilesByEmail?.[0] || null;
    if (profile) {
      await adminClient
        .from('vendor_profiles')
        .update({ auth_user_id: user.id })
        .eq('id', profile.id);
      profile.auth_user_id = user.id;
    }
  }

  return { user, profile };
}

async function ensureBucket() {
  try {
    const { data: buckets } = await adminClient.storage.listBuckets();
    const exists = (buckets || []).some(b => b.name === BUCKET_NAME);
    if (!exists) {
      await adminClient.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE
      });
    }
  } catch (err) {
    console.error('Bucket ensure error:', err.message);
  }
}

export async function GET(request) {
  try {
    const vendorCtx = await getVendorContext();
    if (!vendorCtx?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!vendorCtx.profile) {
      return NextResponse.json({ invoices: [] });
    }

    const { data: invoices, error } = await adminClient
      .from('vendor_invoices')
      .select('*')
      .eq('vendor_id', vendorCtx.profile.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ invoices: invoices || [] });
  } catch (error) {
    console.error('GET /api/portal/invoices error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const vendorCtx = await getVendorContext();
    if (!vendorCtx?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to submit invoices.' },
        { status: 401 }
      );
    }

    if (!vendorCtx.profile || !vendorCtx.profile.is_profile_completed) {
      return NextResponse.json(
        { error: 'Action Required: You must complete your Vendor Profile Registration before submitting invoices.' },
        { status: 403 }
      );
    }

    await ensureBucket();

    const formData = await request.formData();
    const invoiceNumber = formData.get('invoice_number') || null;
    const invoiceAmountStr = formData.get('invoice_amount');
    const currency = formData.get('currency') || 'INR';
    const invoiceDate = formData.get('invoice_date');
    const descriptionOfServices = formData.get('description_of_services');
    const bncPoc = formData.get('bnc_poc');
    const files = formData.getAll('invoice_files');

    if (!invoiceAmountStr || !invoiceDate || !descriptionOfServices || !bncPoc) {
      return NextResponse.json(
        { error: 'Invoice Amount, Date, Description of Services, and BNC POC are required.' },
        { status: 400 }
      );
    }

    const amount = parseFloat(invoiceAmountStr);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid invoice amount. Must be greater than 0.' }, { status: 400 });
    }

    // Upload invoice documents
    const invoiceDocuments = [];
    for (const file of files) {
      if (!file || typeof file === 'string' || file.size <= 0) continue;
      const ext = (file.name || 'document.pdf').split('.').pop() || 'pdf';
      const storagePath = `invoices/${vendorCtx.profile.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await adminClient.storage.from(BUCKET_NAME).upload(storagePath, buffer, {
        contentType: file.type || 'application/pdf',
        upsert: true
      });

      if (uploadError) {
        throw new Error(`Failed to upload file ${file.name || 'document'}: ${uploadError.message}`);
      }

      const { data: urlData } = adminClient.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
      invoiceDocuments.push({
        name: file.name || 'Invoice Document',
        url: urlData?.publicUrl || '',
        file_size: file.size,
        uploaded_at: new Date().toISOString()
      });
    }

    // Insert invoice record
    const { data: newInvoice, error: insertError } = await adminClient
      .from('vendor_invoices')
      .insert({
        vendor_id: vendorCtx.profile.id,
        invoice_number: invoiceNumber,
        invoice_amount: amount,
        currency,
        invoice_date: invoiceDate,
        description_of_services: descriptionOfServices,
        invoice_documents: invoiceDocuments,
        bnc_poc: bncPoc,
        status: 'submitted'
      })
      .select('*')
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      invoice: newInvoice
    });
  } catch (error) {
    console.error('POST /api/portal/invoices error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred while saving invoice' }, { status: 500 });
  }
}

