import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';

// Serves Section 05's how-to videos from app/other-modules/onboarding/_sections/05-tools-systems/videos/
// so they can live inside this module. URL: /other-modules/onboarding/tools-videos/<file>.mp4
// Supports HTTP Range requests so the video player can seek. Login is required by middleware like the rest of /other-modules.

const VIDEO_DIR = path.join(process.cwd(), 'app/other-modules/onboarding/_sections/05-tools-systems/videos');
const TYPES = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime' };

async function open(file) {
  const target = path.normalize(path.join(VIDEO_DIR, file));
  const type = TYPES[path.extname(target).toLowerCase()];
  if (!target.startsWith(VIDEO_DIR + path.sep) || !type) return null;
  try {
    const info = await stat(target);
    return info.isFile() ? { target, type, size: info.size } : null;
  } catch {
    return null;
  }
}

// HEAD lets the page check whether a video has been added yet
export async function HEAD(_request, { params }) {
  const { file } = await params;
  const video = await open(file);
  if (!video) return new Response(null, { status: 404 });
  return new Response(null, { headers: { 'Content-Type': video.type, 'Content-Length': String(video.size), 'Accept-Ranges': 'bytes' } });
}

export async function GET(request, { params }) {
  const { file } = await params;
  const video = await open(file);
  if (!video) return new Response('Not found', { status: 404 });
  const { target, type, size } = video;
  const headers = { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };

  const range = /bytes=(\d*)-(\d*)/.exec(request.headers.get('range') || '');
  if (!range) {
    return new Response(Readable.toWeb(createReadStream(target)), { headers: { ...headers, 'Content-Length': String(size) } });
  }
  const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
  const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  return new Response(Readable.toWeb(createReadStream(target, { start, end })), {
    status: 206,
    headers: { ...headers, 'Content-Length': String(end - start + 1), 'Content-Range': `bytes ${start}-${end}/${size}` },
  });
}
