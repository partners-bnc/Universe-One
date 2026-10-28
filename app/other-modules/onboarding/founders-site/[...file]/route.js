import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Serves Section 02's founders site (HTML, images, scripts) from
// app/other-modules/onboarding/_sections/02-about-founders/site/ so those files can live inside this module.
// URL: /other-modules/onboarding/founders-site/<file>. Login is required by middleware like the rest of /other-modules.

const SITE_DIR = path.join(process.cwd(), 'app/other-modules/onboarding/_sections/02-about-founders/site');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

export async function GET(_request, { params }) {
  const { file = [] } = await params;
  const target = path.normalize(path.join(SITE_DIR, ...file));
  const type = TYPES[path.extname(target).toLowerCase()];
  if (!target.startsWith(SITE_DIR + path.sep) || !type) {
    return new Response('Not found', { status: 404 });
  }
  try {
    const body = await readFile(target);
    return new Response(body, { headers: { 'Content-Type': type, 'Cache-Control': 'no-cache' } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
