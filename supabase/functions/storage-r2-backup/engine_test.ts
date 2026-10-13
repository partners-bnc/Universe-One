import {
  Database,
  encodePath,
  type Inventory,
  PROJECT_REF,
  R2,
  sameSecret,
  type Source,
} from './clients.ts';
import { type Counts, processOne } from './engine.ts';

function assert(value: unknown, message = 'Assertion failed'): void {
  if (!value) throw new Error(message);
}
const freshCounts = (): Counts => ({
  scanned: 0,
  uploaded: 0,
  deleted: 0,
  verified: 0,
  parts: 0,
  errors: 0,
});
function fixture(): Inventory {
  return {
    r2_key: 'exact-bucket/nested folder/資料.txt',
    bucket_id: 'exact-bucket',
    bucket_name: 'exact-bucket',
    object_path: 'nested folder/資料.txt',
    kind: 'object',
    desired_revision: 'version-1',
    synced_revision: null,
    r2_etag: null,
    managed: false,
    metadata: { mimetype: 'text/plain' },
    user_metadata: {},
    byte_size: 3,
    checkpoint: null,
    attempts: 0,
  };
}

class TestDatabase extends Database {
  source: Source | null;
  bytes = new Uint8Array([1, 2, 3]);
  failSuccessPatch = false;
  constructor(public row: Inventory) {
    super('https://example.invalid', 'test');
    this.source = { ...row, revision: row.desired_revision! };
  }
  override current(): Promise<Source | null> {
    return Promise.resolve(this.source);
  }
  override patch(_row: Inventory, changes: Record<string, unknown>): Promise<void> {
    if (this.failSuccessPatch && changes.synced_at) {
      return Promise.reject(new Error('Simulated database interruption'));
    }
    Object.assign(this.row, changes);
    return Promise.resolve();
  }
  override download(_row: Inventory, start?: number, end?: number): Promise<Uint8Array> {
    return Promise.resolve(start === undefined ? this.bytes : this.bytes.slice(start, end! + 1));
  }
}

class TestR2 extends R2 {
  object: { headers: Headers; bytes: Uint8Array } | null = null;
  writes = 0;
  deletes = 0;
  aborted = 0;
  complete = 0;
  parts = new Map<number, Uint8Array>();
  onPut?: () => void;
  private uploadHeaders = new Headers();
  constructor() {
    super('https://test.r2.cloudflarestorage.com', 'test', 'test');
  }
  override head(): Promise<Response> {
    if (!this.object) return Promise.resolve(new Response(null, { status: 404 }));
    const headers = new Headers(this.object.headers);
    headers.set('etag', '"etag"');
    headers.set('content-length', String(this.object.bytes.length));
    return Promise.resolve(new Response(null, { status: 200, headers }));
  }
  override abort(): Promise<void> {
    this.aborted++;
    return Promise.resolve();
  }
  override request(
    method: string,
    _key?: string,
    query?: Record<string, string>,
    body?: Uint8Array | string,
    headers?: HeadersInit,
  ): Promise<Response> {
    if (method === 'DELETE') {
      this.deletes++;
      this.object = null;
      return Promise.resolve(new Response(null, { status: 204 }));
    }
    if (method === 'POST' && query?.uploads === '') {
      this.uploadHeaders = new Headers(headers);
      return Promise.resolve(
        new Response(
          '<InitiateMultipartUploadResult><UploadId>test-upload</UploadId></InitiateMultipartUploadResult>',
        ),
      );
    }
    if (method === 'PUT' && query?.partNumber) {
      this.parts.set(Number(query.partNumber), body as Uint8Array);
      return Promise.resolve(
        new Response(null, { headers: { etag: `"part-${query.partNumber}"` } }),
      );
    }
    if (method === 'POST' && query?.uploadId) {
      const bytes = new Uint8Array(
        [...this.parts.values()].reduce((sum, item) => sum + item.length, 0),
      );
      let offset = 0;
      for (const part of this.parts.values()) {
        bytes.set(part, offset);
        offset += part.length;
      }
      this.object = { headers: this.uploadHeaders, bytes };
      this.complete++;
      return Promise.resolve(
        new Response(
          '<CompleteMultipartUploadResult><ETag>"etag"</ETag></CompleteMultipartUploadResult>',
        ),
      );
    }
    assert(method === 'PUT', 'Unexpected R2 method');
    this.object = { headers: new Headers(headers), bytes: body as Uint8Array };
    this.writes++;
    this.onPut?.();
    return Promise.resolve(new Response(null, { headers: { etag: '"etag"' } }));
  }
}

Deno.test('keys and authentication preserve Unicode, percent signs, slashes, and exact comparisons', () => {
  assert(
    encodePath('bucket/nested folder/資料%2F.txt') ===
      'bucket/nested%20folder/%E8%B3%87%E6%96%99%252F.txt',
  );
  assert(sameSecret('abc', 'abc') && !sameSecret('abc', 'abd') && !sameSecret('', 'a'));
});

Deno.test('upload bytes and supported metadata; skip an unchanged verified object', async () => {
  const row = fixture(), db = new TestDatabase(row), r2 = new TestR2(), counts = freshCounts();
  await processOne(db, r2, row, counts);
  assert(
    r2.object?.bytes.join(',') === '1,2,3' && row.managed && row.synced_revision === 'version-1',
  );
  assert(r2.object?.headers.get('content-type') === 'text/plain');
  await processOne(db, r2, row, counts);
  assert(r2.writes === 1 && counts.verified === 1);
});

Deno.test('zero-byte bucket markers and zero-byte objects', async () => {
  for (const kind of ['bucket', 'object'] as const) {
    const row = fixture();
    row.kind = kind;
    row.byte_size = 0;
    const db = new TestDatabase(row);
    db.bytes = new Uint8Array();
    const r2 = new TestR2();
    await processOne(db, r2, row, freshCounts());
    assert(r2.object?.bytes.length === 0 && row.managed);
  }
});

Deno.test('foreign destination objects are preserved on both overwrite and deletion', async () => {
  for (const deletion of [false, true]) {
    const row = fixture(), db = new TestDatabase(row), r2 = new TestR2();
    r2.object = { headers: new Headers(), bytes: new Uint8Array([9]) };
    if (deletion) {
      db.source = null;
      row.desired_revision = null;
    }
    let rejected = false;
    try {
      await processOne(db, r2, row, freshCounts());
    } catch {
      rejected = true;
    }
    assert(rejected && r2.writes === 0 && r2.deletes === 0);
  }
});

Deno.test('successful PUT followed by DB interruption is still tracked for deletion', async () => {
  const row = fixture(), db = new TestDatabase(row), r2 = new TestR2();
  db.failSuccessPatch = true;
  let interrupted = false;
  try {
    await processOne(db, r2, row, freshCounts());
  } catch {
    interrupted = true;
  }
  assert(interrupted && row.managed && r2.object !== null && row.synced_revision === null);
  db.failSuccessPatch = false;
  db.source = null;
  row.desired_revision = null;
  await processOne(db, r2, row, freshCounts());
  assert(r2.deletes === 1 && !row.managed && r2.object === null);
});

Deno.test('source changes during upload are queued without falsely marking the new revision synced', async () => {
  const row = fixture(), db = new TestDatabase(row), r2 = new TestR2();
  r2.onPut = () => {
    db.source = { ...db.source!, revision: 'version-2' };
  };
  await processOne(db, r2, row, freshCounts());
  assert(row.desired_revision === 'version-2' && row.synced_revision === null && row.managed);
});

Deno.test('multipart checkpoints resume and stale source versions abort unfinished uploads', async () => {
  const row = fixture(), db = new TestDatabase(row), r2 = new TestR2();
  row.checkpoint = { uploadId: 'test', revision: 'version-1', partBytes: 2, parts: [] };
  // Inject the metadata that an initiation would have set.
  await r2.request('POST', row.r2_key, { uploads: '' }, undefined, {
    'x-amz-meta-backup-project': PROJECT_REF,
    'x-amz-meta-backup-revision': 'version-1',
  });
  const counts = freshCounts();
  await processOne(db, r2, row, counts);
  assert(row.checkpoint?.parts.length === 1 && r2.complete === 0);
  await processOne(db, r2, row, counts);
  assert(row.checkpoint === null && r2.complete === 1 && r2.object?.bytes.join(',') === '1,2,3');
  row.checkpoint = { uploadId: 'stale', revision: 'version-1', partBytes: 2, parts: [] };
  db.source = { ...db.source!, revision: 'version-2' };
  await processOne(db, r2, row, counts);
  assert(r2.aborted === 1 && row.checkpoint === null && row.desired_revision === 'version-2');
});

Deno.test('daily reconciliation repairs a missing or modified managed object', async () => {
  const row = fixture(), db = new TestDatabase(row), r2 = new TestR2(), counts = freshCounts();
  await processOne(db, r2, row, counts);
  r2.object = null;
  await processOne(db, r2, row, counts);
  assert(r2.writes === 2);
  r2.object!.headers.set('x-amz-meta-backup-revision', 'foreign-revision');
  await processOne(db, r2, row, counts);
  assert(r2.writes === 3);
});
