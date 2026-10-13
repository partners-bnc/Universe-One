import {
  Database,
  HttpError,
  type Inventory,
  MAX_SINGLE_BYTES,
  objectHeaders,
  PART_BYTES,
  PROJECT_REF,
  R2,
  sha256,
  type Source,
  xml,
  xmlEscape,
} from './clients.ts';

export interface Counts {
  scanned: number;
  uploaded: number;
  deleted: number;
  verified: number;
  parts: number;
  errors: number;
}

function tomorrow(): string {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}

async function refresh(db: Database, row: Inventory, current: Source | null): Promise<void> {
  await db.patch(row, {
    desired_revision: current?.revision || null,
    ...(current
      ? {
        metadata: current.metadata,
        user_metadata: current.user_metadata,
        byte_size: current.byte_size,
        bucket_id: current.bucket_id,
        bucket_name: current.bucket_name,
        object_path: current.object_path,
      }
      : {}),
    attempts: 0,
    next_attempt_at: new Date().toISOString(),
    last_error: null,
  });
}

async function discardCheckpoint(db: Database, r2: R2, row: Inventory): Promise<void> {
  if (!row.checkpoint) return;
  await r2.abort(row.r2_key, row.checkpoint.uploadId);
  await db.patch(row, { checkpoint: null });
  row.checkpoint = null;
}

async function recordSuccess(db: Database, row: Inventory, etag: string | null): Promise<void> {
  await db.patch(row, {
    synced_revision: row.desired_revision,
    r2_etag: etag,
    checkpoint: null,
    managed: true,
    synced_at: new Date().toISOString(),
    verify_after: tomorrow(),
    attempts: 0,
    last_error: null,
    next_attempt_at: new Date().toISOString(),
  });
}

export async function processOne(
  db: Database,
  r2: R2,
  row: Inventory,
  counts: Counts,
  forceMultipart = false,
): Promise<void> {
  // Always use the latest source state, including deletes and rapid delete/recreate.
  let current = await db.current(row);
  if ((current?.revision || null) !== row.desired_revision) {
    await discardCheckpoint(db, r2, row);
    await refresh(db, row, current);
    return;
  }
  if (row.checkpoint && row.checkpoint.revision !== row.desired_revision) {
    await discardCheckpoint(db, r2, row);
  }
  const head = await r2.assertOwned(row.r2_key);

  if (!current) {
    await discardCheckpoint(db, r2, row);
    // Recheck immediately before destructive work; do not delete a newly recreated key.
    if (await db.current(row)) return;
    if (head.status !== 404) await r2.request('DELETE', row.r2_key);
    await db.patch(row, {
      synced_revision: null,
      r2_etag: null,
      checkpoint: null,
      managed: false,
      attempts: 0,
      last_error: null,
      next_attempt_at: new Date().toISOString(),
    });
    counts.deleted++;
    return;
  }

  if (
    row.synced_revision === row.desired_revision && !row.checkpoint && head.status !== 404 &&
    head.headers.get('x-amz-meta-backup-revision') === row.desired_revision &&
    head.headers.get('etag') === row.r2_etag &&
    Number(head.headers.get('content-length')) === row.byte_size
  ) {
    await db.patch(row, { verify_after: tomorrow(), attempts: 0, last_error: null });
    counts.verified++;
    return;
  }

  if (
    row.kind === 'bucket' ||
    (row.byte_size <= MAX_SINGLE_BYTES && !forceMultipart && !row.checkpoint)
  ) {
    const bytes = row.kind === 'bucket' ? new Uint8Array() : await db.download(row);
    current = await db.current(row);
    if (current?.revision !== row.desired_revision) {
      await refresh(db, row, current);
      return;
    }
    const headers = objectHeaders(row);
    headers.set('x-amz-meta-backup-sha256', await sha256(bytes));
    // Save ownership intent BEFORE writing. A killed worker must not orphan a successful PUT.
    await db.patch(row, { managed: true });
    const response = await r2.request('PUT', row.r2_key, undefined, bytes, headers);
    await response.body?.cancel();
    current = await db.current(row);
    if (current?.revision !== row.desired_revision) {
      await refresh(db, row, current);
      return;
    }
    await recordSuccess(db, row, response.headers.get('etag'));
    counts.uploaded++;
    return;
  }

  if (!row.checkpoint) {
    // R2 allows at most 10,000 parts. Keep each download bounded to 64 MiB.
    const partBytes = Math.max(
      PART_BYTES,
      Math.ceil(row.byte_size / 10_000 / (1024 * 1024)) * 1024 * 1024,
    );
    if (partBytes > 64 * 1024 * 1024) {
      throw new Error('File exceeds the bounded multipart transfer size limit');
    }
    await db.patch(row, { managed: true });
    const response = await r2.request(
      'POST',
      row.r2_key,
      { uploads: '' },
      undefined,
      objectHeaders(row),
    );
    const parsed = xml.parse(await response.text());
    const uploadId = parsed.InitiateMultipartUploadResult?.UploadId;
    if (!uploadId) throw new Error('R2 did not return a multipart upload ID');
    row.checkpoint = { uploadId, revision: row.desired_revision!, partBytes, parts: [] };
    try {
      await db.patch(row, { checkpoint: row.checkpoint });
    } catch (error) {
      await r2.abort(row.r2_key, uploadId).catch(() => {});
      throw error;
    }
  }

  const checkpoint = row.checkpoint;
  const start = checkpoint.parts.length * checkpoint.partBytes;
  if (start < row.byte_size) {
    const end = Math.min(start + checkpoint.partBytes, row.byte_size) - 1;
    const bytes = await db.download(row, start, end);
    current = await db.current(row);
    if (current?.revision !== row.desired_revision) {
      await discardCheckpoint(db, r2, row);
      await refresh(db, row, current);
      return;
    }
    const number = checkpoint.parts.length + 1;
    let response: Response;
    try {
      response = await r2.request('PUT', row.r2_key, {
        uploadId: checkpoint.uploadId,
        partNumber: String(number),
      }, bytes);
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        await db.patch(row, { checkpoint: null });
        row.checkpoint = null;
      }
      throw error;
    }
    await response.body?.cancel();
    const etag = response.headers.get('etag');
    if (!etag) throw new Error('R2 did not return a part ETag');
    checkpoint.parts.push({ number, etag });
    await db.patch(row, {
      checkpoint,
      attempts: 0,
      last_error: null,
      next_attempt_at: new Date().toISOString(),
    });
    counts.parts++;
    if (end + 1 < row.byte_size) return;
  }

  current = await db.current(row);
  if (current?.revision !== row.desired_revision) {
    await discardCheckpoint(db, r2, row);
    await refresh(db, row, current);
    return;
  }
  const body = `<CompleteMultipartUpload>${
    checkpoint.parts.map((part) =>
      `<Part><PartNumber>${part.number}</PartNumber><ETag>${xmlEscape(part.etag)}</ETag></Part>`
    ).join('')
  }</CompleteMultipartUpload>`;
  let response: Response;
  try {
    response = await r2.request('POST', row.r2_key, { uploadId: checkpoint.uploadId }, body, {
      'Content-Type': 'application/xml',
    });
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      // A prior completion may have succeeded before its DB checkpoint was saved.
      const completed = await r2.assertOwned(row.r2_key);
      if (
        completed.status !== 404 &&
        completed.headers.get('x-amz-meta-backup-revision') === row.desired_revision &&
        Number(completed.headers.get('content-length')) === row.byte_size
      ) {
        await recordSuccess(db, row, completed.headers.get('etag'));
        counts.uploaded++;
        return;
      }
      await db.patch(row, { checkpoint: null });
    }
    throw error;
  }
  const result = xml.parse(await response.text());
  if (result.Error || !result.CompleteMultipartUploadResult?.ETag) {
    throw new Error('R2 multipart completion failed');
  }
  const completed = await r2.assertOwned(row.r2_key);
  if (Number(completed.headers.get('content-length')) !== row.byte_size) {
    throw new Error('R2 multipart size verification failed');
  }
  current = await db.current(row);
  if (current?.revision !== row.desired_revision) {
    await db.patch(row, { checkpoint: null });
    await refresh(db, row, current);
    return;
  }
  await recordSuccess(db, row, completed.headers.get('etag'));
  counts.uploaded++;
}

export function safeError(error: unknown): string {
  // Our own errors never contain credentials, signed URLs, file bodies, or upstream response bodies.
  return error instanceof HttpError
    ? error.message
    : error instanceof Error
    ? error.message.slice(0, 250)
    : 'Unknown mirror error';
}

export async function recordFailure(db: Database, row: Inventory, error: unknown): Promise<void> {
  const attempts = row.attempts + 1;
  const waitSeconds = Math.min(3600, 30 * 2 ** Math.min(attempts, 7));
  await db.patch(row, {
    attempts,
    last_error: safeError(error),
    next_attempt_at: new Date(Date.now() + waitSeconds * 1000).toISOString(),
  });
}

export function ownedHeaders(headers: Headers): boolean {
  return headers.get('x-amz-meta-backup-project') === PROJECT_REF;
}
