import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { hasLinkedEmployeeAccess, resolveAuthenticatedUserContext } from '@/utils/auth/context';

const EMPLOYEE_FILES_BUCKET = 'employee-files';
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_DOCUMENT_TYPES = [
  'aadhaar_card',
  'pan_card',
  'bank_passbook_cancel_cheque',
  'passport',
  'appointment_letter',
  'experience_letter',
  'salary_slip',
];

const ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
];

async function requireEmployee(request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const authContext = await resolveAuthenticatedUserContext(supabase, user);
  if (!hasLinkedEmployeeAccess(authContext)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  const employeeId = authContext.employee?.id || user.user_metadata?.employee_uuid;
  if (!employeeId) {
    return { error: NextResponse.json({ error: 'Employee identity not found' }, { status: 404 }) };
  }

  const { data: employee, error: employeeError } = await adminClient
    .from('hrm_employees')
    .select('id, employee_id, name, email')
    .eq('id', employeeId)
    .single();

  if (employeeError || !employee) {
    return { error: NextResponse.json({ error: 'Employee record not found' }, { status: 404 }) };
  }

  return { employee };
}

async function ensureBucket() {
  try {
    const { data: buckets } = await adminClient.storage.listBuckets();
    const exists = (buckets || []).some((b) => b.name === EMPLOYEE_FILES_BUCKET);
    if (!exists) {
      await adminClient.storage.createBucket(EMPLOYEE_FILES_BUCKET, {
        public: true,
        fileSizeLimit: MAX_DOCUMENT_BYTES,
      });
    }
  } catch (err) {
    // Ignore error if bucket already exists
  }
}

// GET /HRM/api/employee/documents
export async function GET(request) {
  try {
    const ctx = await requireEmployee(request);
    if (ctx.error) return ctx.error;

    const { data: documents, error } = await adminClient
      .from('hrm_employee_documents')
      .select('*')
      .eq('employee_id', ctx.employee.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ documents: documents || [] });
  } catch (err) {
    console.error('Error fetching employee documents:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST /HRM/api/employee/documents
export async function POST(request) {
  try {
    const ctx = await requireEmployee(request);
    if (ctx.error) return ctx.error;
    const { employee } = ctx;

    const formData = await request.formData();
    const documentType = String(formData.get('document_type') || '').trim();
    const file = formData.get('file');

    if (!documentType || !ALLOWED_DOCUMENT_TYPES.includes(documentType)) {
      return NextResponse.json(
        { error: 'Invalid or unsupported document type.' },
        { status: 400 }
      );
    }

    // Check if the employee already has this document uploaded (allow only once!)
    const { data: existingDoc } = await adminClient
      .from('hrm_employee_documents')
      .select('id, file_name, file_url')
      .eq('employee_id', employee.id)
      .eq('document_type', documentType)
      .maybeSingle();

    if (existingDoc) {
      return NextResponse.json(
        { error: 'This document has already been uploaded. Documents can only be uploaded once.' },
        { status: 400 }
      );
    }

    if (!file || typeof file === 'string' || file.size <= 0) {
      return NextResponse.json({ error: 'Please select a valid file to upload.' }, { status: 400 });
    }

    // Strict file extension and MIME validation
    const originalName = String(file.name || '');
    const extension = originalName.split('.').pop()?.toLowerCase() || '';
    const mimeType = String(file.type || '').toLowerCase();

    const isAllowedExt = ALLOWED_EXTENSIONS.includes(extension);
    const isAllowedMime = ALLOWED_MIME_TYPES.includes(mimeType) || !mimeType;

    if (!isAllowedExt || !isAllowedMime) {
      return NextResponse.json(
        {
          error: 'The file type is different. Please upload with the correct file type (PDF, PNG, JPEG).',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_DOCUMENT_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 10 MB.' },
        { status: 400 }
      );
    }

    await ensureBucket();

    const safeEmployeeCode = String(employee.employee_id || employee.id || 'employee')
      .trim()
      .replace(/[^A-Za-z0-9_-]/g, '-');
    const storagePath = `${safeEmployeeCode}/documents/${documentType}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await adminClient.storage
      .from(EMPLOYEE_FILES_BUCKET)
      .upload(storagePath, buffer, {
        contentType: mimeType || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      console.error('Failed to upload employee document to storage:', uploadError);
      return NextResponse.json({ error: 'Failed to upload document file.' }, { status: 500 });
    }

    const { data: urlData } = adminClient.storage
      .from(EMPLOYEE_FILES_BUCKET)
      .getPublicUrl(storagePath);
    const publicUrl = urlData?.publicUrl || '';

    const { data: insertedDoc, error: insertError } = await adminClient
      .from('hrm_employee_documents')
      .insert({
        employee_id: employee.id,
        document_type: documentType,
        file_name: originalName,
        file_path: storagePath,
        file_url: publicUrl,
        file_size: file.size,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to insert employee document record:', insertError);
      await adminClient.storage.from(EMPLOYEE_FILES_BUCKET).remove([storagePath]);
      return NextResponse.json({ error: 'Failed to record uploaded document.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      document: insertedDoc,
      message: 'Document uploaded successfully.',
    });
  } catch (err) {
    console.error('Error in employee document upload:', err);
    return NextResponse.json({ error: err.message || 'Failed to upload document' }, { status: 500 });
  }
}
