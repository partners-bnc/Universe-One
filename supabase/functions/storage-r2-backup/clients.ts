import { AwsClient } from 'aws4fetch';
import { XMLParser } from 'fast-xml-parser';

export const TARGET_BUCKET = 'universeone-backup';
export const PROJECT_REF = 'llfoaqnljjbneouiedbg';
export const PART_BYTES = 8 * 1024 * 1024;
export const MAX_SINGLE_BYTES = 16 * 1024 * 1024;

export interface Source {
  r2_key: string;
  bucket_id: string;
  bucket_name: string;
  object_path: string | null;
  kind: 'object' | 'bucket';
  revision: string;
  metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
  byte_size: number;
}

export interface Checkpoint {
  uploadId: string;
  revision: string;
  partBytes: number;
  parts: Array<{ number: number; etag: string }>;
}

export interface Inventory extends Omit<Source, 'revision'> {
  desired_revision: string | null;
  synced_revision: string | null;
  r2_etag: string | null;
  managed: boolean;
  checkpoint: Checkpoint | null;
  attempts: number;
}

export class HttpError extends Error {
  constructor(public service: string, public status: number, public code = '') {
    super(`${service} HTTP ${status}${code ? ` (${code})` : ''}`);
  }
}

export function encodePath(path: string): string {
  // Do not decode, normalize, trim, or otherwise rewrite object keys.
  return path.split('/').map((part) =>
    encodeURIComponent(part).replace(
      /[!'()*]/g,
      (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
    )
  ).join('/');
}

export function xmlEscape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export const xml = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  removeNSPrefix: true,
});

export async function sha256(value: string | Uint8Array): Promise<string> {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value;
  const hash = await crypto.subtle.digest('SHA-256', bytes as BufferSource);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function sameSecret(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let different = 0;
  for (let i = 0; i < left.length; i++) different |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return different === 0;
}

export function objectHeaders(row: Inventory): Headers {
  const headers = new Headers({
    'Content-Type': String(row.metadata.mimetype || 'application/octet-stream'),
    'x-amz-meta-backup-project': PROJECT_REF,
    'x-amz-meta-backup-revision': row.desired_revision || '',
  });
  const cacheControl = row.metadata.cacheControl;
  if (cacheControl) {
    headers.set(
      'Cache-Control',
      /^\d+$/.test(String(cacheControl)) ? `max-age=${cacheControl}` : String(cacheControl),
    );
  }
  const disposition = row.metadata.contentDisposition;
  if (disposition) headers.set('Content-Disposition', String(disposition));
  const metadata = new TextEncoder().encode(JSON.stringify(row.user_metadata));
  if (metadata.length <= 1024 && metadata.length > 2) {
    headers.set('x-amz-meta-source-user-metadata', btoa(String.fromCharCode(...metadata)));
  }
  return headers;
}

export class Database {
  constructor(public url: string, public key: string, private signal?: AbortSignal) {}

  async request<T>(
    path: string,
    method = 'GET',
    body?: unknown,
    query?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(`${this.url}/rest/v1/${path}`);
    for (const [key, value] of Object.entries(query || {})) url.searchParams.set(key, value);
    const response = await fetch(url, {
      method,
      headers: {
        apikey: this.key,
        Authorization: `Bearer ${this.key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: this.signal
        ? AbortSignal.any([this.signal, AbortSignal.timeout(20_000)])
        : AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new HttpError('Supabase database', response.status, data.code || '');
    }
    return response.status === 204 ? undefined as T : await response.json();
  }

  rpc<T>(name: string, body: Record<string, unknown>): Promise<T> {
    return this.request<T>(`rpc/${name}`, 'POST', body);
  }

  patch(row: Inventory, changes: Record<string, unknown>): Promise<void> {
    return this.request<void>('storage_r2_inventory', 'PATCH', changes, {
      r2_key: `eq.${row.r2_key}`,
    });
  }

  current(row: Inventory): Promise<Source | null> {
    return this.rpc<Source | null>('storage_r2_current', { p_key: row.r2_key });
  }

  async download(row: Inventory, start?: number, end?: number): Promise<Uint8Array> {
    const url = `${this.url}/storage/v1/object/authenticated/${encodePath(row.bucket_id)}/${
      encodePath(row.object_path || '')
    }`;
    const headers = new Headers({ apikey: this.key, Authorization: `Bearer ${this.key}` });
    if (start !== undefined) headers.set('Range', `bytes=${start}-${end}`);
    const response = await fetch(url, {
      headers,
      signal: this.signal
        ? AbortSignal.any([this.signal, AbortSignal.timeout(25_000)])
        : AbortSignal.timeout(25_000),
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new HttpError('Supabase Storage', response.status);
    }
    if (
      start !== undefined && (response.status !== 206 ||
        response.headers.get('content-range') !== `bytes ${start}-${end}/${row.byte_size}`)
    ) {
      await response.body?.cancel();
      throw new Error('Storage did not honor the requested byte range');
    }
    const expected = start === undefined ? row.byte_size : (end! - start + 1);
    // Bound memory even if metadata is stale or the server ignores download limits.
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Storage returned an empty response body');
    const bytes = new Uint8Array(expected);
    let offset = 0;
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        if (offset + chunk.value.byteLength > expected) {
          throw new Error('Storage file size changed during download');
        }
        bytes.set(chunk.value, offset);
        offset += chunk.value.byteLength;
      }
      if (offset !== expected) throw new Error('Storage file size changed during download');
      return bytes;
    } finally {
      await reader.cancel().catch(() => {});
    }
  }
}

export class R2 {
  private client: AwsClient;
  private endpoint: string;

  constructor(endpoint: string, accessKey: string, secret: string, private signal?: AbortSignal) {
    const url = new URL(endpoint);
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.r2.cloudflarestorage.com')) {
      throw new Error('CLOUDFLARE_S3_API must be an HTTPS R2 S3 endpoint');
    }
    if (
      url.pathname !== '/' && url.pathname !== `/${TARGET_BUCKET}` &&
      url.pathname !== `/${TARGET_BUCKET}/`
    ) {
      throw new Error('CLOUDFLARE_S3_API must identify the account or universeone-backup bucket');
    }
    this.endpoint = `${url.origin}/${TARGET_BUCKET}`;
    this.client = new AwsClient({
      accessKeyId: accessKey,
      secretAccessKey: secret,
      service: 's3',
      region: 'auto',
      retries: 0,
    });
  }

  async request(
    method: string,
    key?: string,
    query?: Record<string, string>,
    body?: Uint8Array | string,
    headers?: HeadersInit,
    allowMissing = false,
  ): Promise<Response> {
    const url = new URL(`${this.endpoint}${key === undefined ? '' : `/${encodePath(key)}`}`);
    for (const [name, value] of Object.entries(query || {})) url.searchParams.set(name, value);
    const signed = await this.client.sign(url, {
      method,
      body: body as BodyInit | undefined,
      headers,
      aws: { allHeaders: true },
    });
    const response = await fetch(signed, {
      signal: this.signal
        ? AbortSignal.any([this.signal, AbortSignal.timeout(25_000)])
        : AbortSignal.timeout(25_000),
    });
    if (!response.ok && !(allowMissing && response.status === 404)) {
      const text = (await response.text()).slice(0, 4096);
      const code = /<Code>([A-Za-z0-9]+)<\/Code>/.exec(text)?.[1] || '';
      throw new HttpError('Cloudflare R2', response.status, code);
    }
    return response;
  }

  head(key: string): Promise<Response> {
    return this.request('HEAD', key, undefined, undefined, undefined, true);
  }

  async assertOwned(key: string): Promise<Response> {
    const head = await this.head(key);
    if (head.status !== 404 && head.headers.get('x-amz-meta-backup-project') !== PROJECT_REF) {
      throw new Error('Destination key exists and is not owned by this mirror');
    }
    return head;
  }

  async abort(key: string, uploadId: string): Promise<void> {
    await this.request('DELETE', key, { uploadId }, undefined, undefined, true);
  }
}
