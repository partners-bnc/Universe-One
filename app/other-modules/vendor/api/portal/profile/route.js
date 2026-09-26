import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/admin';

const BUCKET_NAME = 'vendor-portal-docs';
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

async function getVendorUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
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
    const user = await getVendorUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const normalizedEmail = String(user.email || '').trim().toLowerCase();

    // 1. Look up profile by auth_user_id
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
        // Link auth_user_id
        await adminClient
          .from('vendor_profiles')
          .update({ auth_user_id: user.id })
          .eq('id', profile.id);
        profile.auth_user_id = user.id;
      }
    }

    const fallbackName = user.user_metadata?.full_name || user.user_metadata?.name || '';
    const fallbackPhone = user.phone || user.user_metadata?.phone_number || '';

    if (profile) {
      if (!profile.vendor_name && fallbackName) {
        profile.vendor_name = fallbackName;
      }
      if (!profile.phone_number && fallbackPhone) {
        profile.phone_number = fallbackPhone;
      }
      return NextResponse.json({ profile });
    }

    // 3. Fallback profile if no record existed yet
    const fallbackProfile = {
      auth_user_id: user.id,
      vendor_name: fallbackName || normalizedEmail.split('@')[0] || 'Vendor',
      email: normalizedEmail,
      phone_number: fallbackPhone || '',
      is_profile_completed: false,
    };

    return NextResponse.json({ profile: fallbackProfile });
  } catch (error) {
    console.error('GET /api/portal/profile error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getVendorUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureBucket();

    const formData = await request.formData();
    const vendorName = formData.get('vendor_name');
    const email = formData.get('email') || user.email;
    const phoneNumber = formData.get('phone_number');
    
    const subjectToTds = formData.get('subject_to_tds') === 'true';
    const lowerDeductionCert = formData.get('lower_deduction_cert') === 'true';
    const msmeCertificate = formData.get('msme_certificate') === 'true';
    const reverseChargeApplicable = formData.get('reverse_charge_applicable') === 'true';
    const gstNumber = formData.get('gst_number') || null;

    // Existing URLs if keeping old uploads
    let gstCertUrl = formData.get('existing_gst_certificate_url') || null;
    let lowerDedCertUrl = formData.get('existing_lower_deduction_cert_url') || null;
    let msmeCertUrl = formData.get('existing_msme_cert_url') || null;

    // Existing other documents JSON
    const existingOtherDocsStr = formData.get('existing_other_documents');
    let otherDocuments = existingOtherDocsStr ? JSON.parse(existingOtherDocsStr) : [];

    // Check for new file uploads
    const gstFile = formData.get('gst_certificate_file');
    if (gstFile && typeof gstFile !== 'string' && gstFile.size > 0) {
      const ext = gstFile.name.split('.').pop() || 'pdf';
      const storagePath = `compliance/${user.id}/gst-${Date.now()}.${ext}`;
      const buffer = Buffer.from(await gstFile.arrayBuffer());
      const { error: uploadError } = await adminClient.storage.from(BUCKET_NAME).upload(storagePath, buffer, {
        contentType: gstFile.type || 'application/pdf',
        upsert: true
      });
      if (uploadError) throw uploadError;
      const { data: urlData } = adminClient.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
      gstCertUrl = urlData?.publicUrl || '';
    }

    const lowerDedFile = formData.get('lower_deduction_cert_file');
    if (lowerDedFile && typeof lowerDedFile !== 'string' && lowerDedFile.size > 0) {
      const ext = lowerDedFile.name.split('.').pop() || 'pdf';
      const storagePath = `compliance/${user.id}/lower-ded-${Date.now()}.${ext}`;
      const buffer = Buffer.from(await lowerDedFile.arrayBuffer());
      const { error: uploadError } = await adminClient.storage.from(BUCKET_NAME).upload(storagePath, buffer, {
        contentType: lowerDedFile.type || 'application/pdf',
        upsert: true
      });
      if (uploadError) throw uploadError;
      const { data: urlData } = adminClient.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
      lowerDedCertUrl = urlData?.publicUrl || '';
    }

    const msmeFile = formData.get('msme_cert_file');
    if (msmeFile && typeof msmeFile !== 'string' && msmeFile.size > 0) {
      const ext = msmeFile.name.split('.').pop() || 'pdf';
      const storagePath = `compliance/${user.id}/msme-${Date.now()}.${ext}`;
      const buffer = Buffer.from(await msmeFile.arrayBuffer());
      const { error: uploadError } = await adminClient.storage.from(BUCKET_NAME).upload(storagePath, buffer, {
        contentType: msmeFile.type || 'application/pdf',
        upsert: true
      });
      if (uploadError) throw uploadError;
      const { data: urlData } = adminClient.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
      msmeCertUrl = urlData?.publicUrl || '';
    }

    // Multiple other documents
    const newOtherFiles = formData.getAll('new_other_documents');
    for (const file of newOtherFiles) {
      if (!file || typeof file === 'string' || file.size <= 0) continue;
      const ext = file.name.split('.').pop() || 'pdf';
      const storagePath = `compliance/${user.id}/other-${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const { error: uploadError } = await adminClient.storage.from(BUCKET_NAME).upload(storagePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true
      });
      if (uploadError) throw uploadError;
      const { data: urlData } = adminClient.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
      otherDocuments.push({
        name: file.name,
        url: urlData?.publicUrl || '',
        file_size: file.size,
        uploaded_at: new Date().toISOString()
      });
    }

    const normalizedEmail = String(email || user.email || '').trim().toLowerCase();

    // Check if profile already exists
    let { data: existingProfiles } = await adminClient
      .from('vendor_profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    let existingProfile = existingProfiles?.[0] || null;

    if (!existingProfile && normalizedEmail) {
      const { data: profilesByEmail } = await adminClient
        .from('vendor_profiles')
        .select('*')
        .ilike('email', normalizedEmail)
        .order('created_at', { ascending: false })
        .limit(1);
      existingProfile = profilesByEmail?.[0] || null;
    }

    const finalVendorName = existingProfile?.vendor_name || vendorName || user.user_metadata?.full_name || 'Vendor';
    const finalEmail = existingProfile?.email || normalizedEmail;
    const finalPhone = existingProfile?.phone_number || phoneNumber || user.phone || user.user_metadata?.phone_number || null;

    const profilePayload = {
      auth_user_id: user.id,
      vendor_name: finalVendorName,
      email: finalEmail,
      phone_number: finalPhone,
      subject_to_tds: subjectToTds,
      lower_deduction_cert: lowerDeductionCert,
      lower_deduction_cert_url: lowerDeductionCert ? lowerDedCertUrl : null,
      msme_certificate: msmeCertificate,
      msme_cert_url: msmeCertificate ? msmeCertUrl : null,
      reverse_charge_applicable: reverseChargeApplicable,
      gst_number: gstNumber,
      gst_certificate_url: gstCertUrl,
      other_documents: otherDocuments,
      is_profile_completed: true,
      updated_at: new Date().toISOString()
    };

    let resultProfile = null;
    if (existingProfile) {
      const { data: updated, error: updateError } = await adminClient
        .from('vendor_profiles')
        .update(profilePayload)
        .eq('id', existingProfile.id)
        .select('*')
        .single();

      if (updateError) throw updateError;
      resultProfile = updated;
    } else {
      const { data: inserted, error: insertError } = await adminClient
        .from('vendor_profiles')
        .insert(profilePayload)
        .select('*')
        .single();

      if (insertError) throw insertError;
      resultProfile = inserted;
    }

    return NextResponse.json({
      success: true,
      profile: resultProfile
    });
  } catch (error) {
    console.error('POST /api/portal/profile error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
