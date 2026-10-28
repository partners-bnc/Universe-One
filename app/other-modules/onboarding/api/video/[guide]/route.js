import { stat } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';
import { VIDEO_BUCKET, getSignedInEmployee, isMissingTable } from '../../progress/shared';

export const dynamic = 'force-dynamic';

const LOCAL_VIDEO_DIR = path.join(process.cwd(), 'app/other-modules/onboarding/_sections/05-tools-systems/videos');

// GET /other-modules/onboarding/api/video/<guideId>?file=<legacy file name>
// -> { url } a 1-hour signed link to the guide's video in the private `onboarding-videos` bucket
//    (path from onboarding_steps.video_path). Falls back to a file dropped into the module's local videos
//    folder (served by ../../tools-videos/). 404 when the guide has no video yet ("Video coming soon").

export async function GET(request, { params }) {
  try {
    const { user } = await getSignedInEmployee();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { guide } = await params;
    if (!/^[a-z0-9-]{1,60}$/.test(String(guide))) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { data: step, error } = await adminClient
      .from('onboarding_steps')
      .select('video_path')
      .eq('id', `video:${guide}`)
      .maybeSingle();
    if (error && !isMissingTable(error)) throw error;

    if (step?.video_path) {
      const { data: signed, error: signError } = await adminClient.storage.from(VIDEO_BUCKET).createSignedUrl(step.video_path, 60 * 60);
      if (!signError && signed?.signedUrl) return NextResponse.json({ url: signed.signedUrl, source: 'bucket' });
      console.error('[onboarding/video] could not sign', step.video_path, signError?.message);
    }

    // fallback: a file in app/other-modules/onboarding/_sections/05-tools-systems/videos/
    const file = new URL(request.url).searchParams.get('file') || '';
    if (/^[\w.-]+\.(mp4|webm|mov)$/i.test(file)) {
      const found = await stat(path.join(LOCAL_VIDEO_DIR, file)).catch(() => null);
      if (found?.isFile()) return NextResponse.json({ url: `/other-modules/onboarding/tools-videos/${file}`, source: 'local' });
    }
    return NextResponse.json({ error: 'No video yet' }, { status: 404 });
  } catch (err) {
    console.error('[onboarding/video] failed:', err);
    return NextResponse.json({ error: 'Could not load the video' }, { status: 500 });
  }
}
