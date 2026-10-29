import { adminClient } from '@/utils/supabase/admin';
import { requirePdplActor, sanitizeStorageFileName } from '@/utils/auditing-pdpl';
import { DEFAULT_STATIC_TRACKER_SEEDS } from '@/utils/auditing-static-tracker-seeds';

export const STATIC_TRACKER_BUCKET = 'auditing-static-tracker';
export const STATIC_TRACKER_FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB per file
export const STATIC_TRACKER_TABLE = 'auditing_static_tracker';

export function isMissingStaticTrackerSchemaError(error) {
  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('auditing_static_tracker') &&
    (message.includes('schema cache') || message.includes('relation') || message.includes('does not exist'))
  );
}

export async function ensureStaticTrackerBucket() {
  try {
    const { data: buckets, error } = await adminClient.storage.listBuckets();
    if (!error && buckets) {
      const exists = buckets.some((b) => b.name === STATIC_TRACKER_BUCKET);
      if (!exists) {
        await adminClient.storage.createBucket(STATIC_TRACKER_BUCKET, {
          public: true,
          fileSizeLimit: STATIC_TRACKER_FILE_SIZE_LIMIT,
        });
      }
    }
  } catch (err) {
    console.warn('Could not automatically check/create static tracker bucket:', err);
  }
}

/**
 * List all static audit trackers.
 * If none exist and table is ready, seed with the 2 default companies (Raise India & ShikshaDaan).
 */
export async function listStaticTrackers() {
  const { data, error } = await adminClient
    .from(STATIC_TRACKER_TABLE)
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  // If table is completely empty, automatically seed with the 2 companies
  if (!data || data.length === 0) {
    const seeded = await seedDefaultTrackers();
    return seeded;
  }

  return data;
}

/**
 * Seeds default companies into the tracker table.
 */
export async function seedDefaultTrackers(userId = null) {
  const insertPayload = DEFAULT_STATIC_TRACKER_SEEDS.map((seed) => ({
    company_name: seed.company_name,
    csr_donor: seed.csr_donor,
    project_name: seed.project_name,
    status: seed.status || 'in_progress',
    company_details: seed.company_details || {},
    expense_data: seed.expense_data || [],
    invoice_data: seed.invoice_data || [],
    ngo_questions: seed.ngo_questions || [],
    student_questions: seed.student_questions || [],
    created_by: userId,
  }));

  const { data, error } = await adminClient
    .from(STATIC_TRACKER_TABLE)
    .insert(insertPayload)
    .select('*');

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Get a single tracker by ID.
 */
export async function getStaticTrackerById(id) {
  const { data, error } = await adminClient
    .from(STATIC_TRACKER_TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Create a new static tracker record (Create in CRUD).
 */
export async function createStaticTracker(payload, actor) {
  const record = {
    company_name: String(payload.company_name || payload.companyName || 'New Company').trim(),
    csr_donor: String(payload.csr_donor || payload.csrDonor || '').trim() || null,
    project_name: String(payload.project_name || payload.projectName || '').trim() || null,
    status: payload.status || 'in_progress',
    company_details: payload.company_details || payload.companyDetails || {},
    expense_data: payload.expense_data || payload.expenseData || [],
    invoice_data: payload.invoice_data || payload.invoiceData || [],
    ngo_questions: payload.ngo_questions || payload.ngoQuestions || [],
    student_questions: payload.student_questions || payload.studentQuestions || [],
    created_by: actor?.authUserId || null,
  };

  const { data, error } = await adminClient
    .from(STATIC_TRACKER_TABLE)
    .insert([record])
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update a static tracker record (Update in CRUD).
 */
export async function updateStaticTracker(id, payload, _actor) {
  const updateData = {
    updated_at: new Date().toISOString(),
  };

  if (payload.company_name !== undefined) updateData.company_name = payload.company_name;
  if (payload.csr_donor !== undefined) updateData.csr_donor = payload.csr_donor;
  if (payload.project_name !== undefined) updateData.project_name = payload.project_name;
  if (payload.status !== undefined) updateData.status = payload.status;
  if (payload.company_details !== undefined) updateData.company_details = payload.company_details;
  if (payload.expense_data !== undefined) updateData.expense_data = payload.expense_data;
  if (payload.invoice_data !== undefined) updateData.invoice_data = payload.invoice_data;
  if (payload.ngo_questions !== undefined) updateData.ngo_questions = payload.ngo_questions;
  if (payload.student_questions !== undefined) updateData.student_questions = payload.student_questions;

  const { data, error } = await adminClient
    .from(STATIC_TRACKER_TABLE)
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Delete a tracker (Delete in CRUD).
 */
export async function deleteStaticTracker(id, _actor) {
  const { error } = await adminClient
    .from(STATIC_TRACKER_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
}

function findQuestionTarget(list = [], targetId) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === targetId) {
      return list[i];
    }
    if (Array.isArray(list[i].sub_questions)) {
      for (let j = 0; j < list[i].sub_questions.length; j++) {
        if (list[i].sub_questions[j].id === targetId) {
          return list[i].sub_questions[j];
        }
      }
    }
  }
  return null;
}

function removeDocFromQuestion(list = [], questionId, documentId) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === questionId) {
      const existing = list[i].documents || [];
      const doc = existing.find((d) => d.id === documentId);
      list[i].documents = existing.filter((d) => d.id !== documentId);
      return doc;
    }
    if (Array.isArray(list[i].sub_questions)) {
      for (let j = 0; j < list[i].sub_questions.length; j++) {
        if (list[i].sub_questions[j].id === questionId) {
          const existing = list[i].sub_questions[j].documents || [];
          const doc = existing.find((d) => d.id === documentId);
          list[i].sub_questions[j].documents = existing.filter((d) => d.id !== documentId);
          return doc;
        }
      }
    }
  }
  return null;
}

/**
 * Upload one or more documents for an answer in NGO or Student section.
 * Updates the tracker's JSON column with the uploaded file info.
 */
export async function uploadStaticTrackerFiles({ trackerId, sectionType, questionId, files, actor }) {
  if (!trackerId || !sectionType || !questionId) {
    throw new Error('Missing trackerId, sectionType, or questionId.');
  }

  const tracker = await getStaticTrackerById(trackerId);
  if (!tracker) {
    throw new Error('Tracker not found.');
  }

  const targetList = sectionType === 'ngo' ? tracker.ngo_questions : tracker.student_questions;
  const targetQuestion = findQuestionTarget(targetList, questionId);
  if (!targetQuestion) {
    throw new Error(`Question ${questionId} not found in ${sectionType} section.`);
  }

  const uploadedDocs = [];
  const validFiles = Array.isArray(files) ? files : [files];

  for (const file of validFiles) {
    if (!(file instanceof File) || file.size <= 0) continue;
    if (file.size > STATIC_TRACKER_FILE_SIZE_LIMIT) {
      throw new Error(`File ${file.name} exceeds the 5 MB size limit.`);
    }

    const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const safeName = sanitizeStorageFileName(file.name);
    const storagePath = `trackers/${trackerId}/${sectionType}/${questionId}/${Date.now()}_${safeName}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await adminClient.storage
      .from(STATIC_TRACKER_BUCKET)
      .upload(storagePath, bytes, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(uploadError.message || `Failed to upload ${file.name}`);
    }

    const { data: publicUrlData } = adminClient.storage
      .from(STATIC_TRACKER_BUCKET)
      .getPublicUrl(storagePath);

    uploadedDocs.push({
      id: docId,
      name: file.name,
      file_name: file.name,
      size: file.size,
      formatted_size: `${(file.size / 1024).toFixed(1)} KB`,
      mime_type: file.type || 'application/octet-stream',
      storage_bucket: STATIC_TRACKER_BUCKET,
      storage_path: storagePath,
      url: publicUrlData?.publicUrl || '',
      uploaded_by: actor?.authUserId || null,
      uploaded_at: new Date().toISOString(),
    });
  }

  // Append new documents to target question
  const existingDocs = targetQuestion.documents || [];
  targetQuestion.documents = [...existingDocs, ...uploadedDocs];

  // Save back to DB
  const updatePayload = {};
  if (sectionType === 'ngo') {
    updatePayload.ngo_questions = targetList;
  } else {
    updatePayload.student_questions = targetList;
  }

  const updatedTracker = await updateStaticTracker(trackerId, updatePayload, actor);
  return { updatedTracker, uploadedDocs };
}

/**
 * Remove an uploaded document from a question and storage.
 */
export async function removeStaticTrackerFile({ trackerId, sectionType, questionId, documentId, actor }) {
  const tracker = await getStaticTrackerById(trackerId);
  if (!tracker) throw new Error('Tracker not found.');

  const targetList = sectionType === 'ngo' ? tracker.ngo_questions : tracker.student_questions;
  const removedDoc = removeDocFromQuestion(targetList, questionId, documentId);

  if (removedDoc?.storage_path) {
    try {
      await adminClient.storage
        .from(STATIC_TRACKER_BUCKET)
        .remove([removedDoc.storage_path]);
    } catch (e) {
      console.warn('Could not remove file from storage:', e);
    }
  }

  const updatePayload = {};
  if (sectionType === 'ngo') {
    updatePayload.ngo_questions = targetList;
  } else {
    updatePayload.student_questions = targetList;
  }

  return await updateStaticTracker(trackerId, updatePayload, actor);
}

