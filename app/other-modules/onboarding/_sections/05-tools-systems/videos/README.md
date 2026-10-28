# How-to videos for Section 05 · Tools & Systems

**Where videos live:** the private Supabase Storage bucket `onboarding-videos`, one folder per platform/module:

```
onboarding-videos/
└── universe-one/
    ├── hrms/
    ├── task-manager/
    └── crm/
```

File names can be anything. Each guide is linked to its file by `onboarding_steps.video_path`
(e.g. `universe-one/hrms/Checkin.mp4`, step id `video:check-in`). Set or change a link with:

```sql
update public.onboarding_steps set video_path = 'universe-one/hrms/Checkin.mp4', updated_at = now() where id = 'video:check-in';
```

The page asks `/other-modules/onboarding/api/video/<guide id>` for a 1-hour signed link (login required).
Until a guide has a video_path, a "Video coming soon" placeholder shows. Uploaded videos count towards an
employee's onboarding % only once linked.

Fallback (local dev): a file dropped in this folder with the guide's `video` name from content.js
(e.g. `hrms-check-in.mp4`) still plays when no bucket link exists.

Guide ids: check-in, check-out, work-log, regularization, leave, expense, ticket,
tm-dashboard, tm-create, tm-manage, tm-task, tm-collaborate, tm-todos, tm-chat, tm-team-settings.

Tips: MP4 (H.264 + AAC, "fast start"), 1920×1080 is plenty.
