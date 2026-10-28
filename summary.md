# Universe One (BNC) — Codebase Summary

A quick-reference map of this repo so future work does not require re-reading the code.
Written 2026-10-25 from a read-only review. Line numbers are approximate and drift as files change; search for the named function or array if a line has moved.

Paths are relative to the repo root (`/Users/anshu/Desktop/Universe one Bnc`). The `@/` import alias points to the repo root.

---

## 1. Stack

- **Framework:** Next.js 16 (App Router) with React 19.
- **Data:** Supabase for Postgres, Auth and Storage (`@supabase/ssr`, `@supabase/supabase-js`).
- **Styling:** Tailwind CSS v4. The theme is defined in `app/globals.css` with `@theme`.
- **UI libraries:** lucide-react icons, Material Symbols icons (HRM and the homepage), framer-motion (used rarely), recharts.
- **Other libraries:** date-fns, xlsx, jspdf, @react-pdf/renderer, pdfjs, qrcode. Email is sent through ZeptoMail. AI calls use `@google/genai` and `openai`.
- **Languages:** mostly JS/JSX. HRM components and views are TSX. `tsconfig` has `strict: false` and `allowJs`.
- **Rendering:** almost all pages are `'use client'` and fetch from their module's own `api/*/route.js`. There are no server actions and no SWR or React Query.
- **Loading:** `app/loading.js` (`BrandedFullPageLoader`) is the only `loading.js`. There are no `error.js` or `not-found.js` files.

## 2. Top-level layout

```
app/
  page.js                  public marketing home (HomeShell: Navbar, Hero, FeatureSteps, Footer)
  layout.js                root layout; loads Material Symbols; mounts global <NoticePopup/>
  globals.css              Tailwind v4 theme tokens
  login/                   login page (uses Taskmanager/components/Login.js)
  other-modules/           MODULE PICKER (page.jsx) + crm/, vendor/, finance/, far/
  HRM/                     HRM module (employee app + HR admin app)
  Taskmanager/             Task Manager module
  Auditing/                Auditing module
  dashboard/tasks/         task detail routes only (NOT a launcher)
  superadmin/              super admin page
  onboarding/[token]/      EXISTING pre-hire candidate form (public, token link)
  employee-intake/         leftover; just redirects to /login
  api/                     shared APIs (auth/login, auth/context, onboarding/[token], notices, finance, ...)
  components-homepage/     Navbar, OthersSection (module tiles), ModuleAccessGate, workspace auth helpers
components/ui/             loader.tsx (cube loader), eye-tracking.tsx
utils/                     server helpers (all JS): auth/, supabase/, onboarding.js, email-outbox.js, hrm-*.js, api-helpers.js ...
supabase/                  schema.sql (OLD, pre-rename), migrations/ (~118 files), functions/ (email-dispatcher, auto-mark-attendance, storage-r2-backup)
middleware.js              route protection
DESIGN.md                  Apple design-system reference (~600KB). NOT used by most of the app; only CRM follows it.
```

## 3. Auth and roles

**Supabase helpers** in `utils/supabase/`:
- `server.js` exports `createClient()` (async, cookie-based, anon key).
- `client.js` is the browser client.
- `admin.js` exports `adminClient`, which uses the service role and bypasses RLS. Most server queries go through it.

**Roles** are defined in `utils/auth/roles.js`:
- The portals are `super_admin`, `hr_admin`, `support`, `employee` and `vendor`.
- A profile role of `'admin'` is treated as `hr_admin`. `isHrAdminRole` is true for both `hr_admin` and `super_admin`.
- `resolveAccountType` gives priority in this order: super_admin > hr_admin > support > vendor > employee (an employee needs a linked `hrm_employees` row).
- **"Manager" is NOT a login role.** It only exists as a reporting relationship (`reporting_manager_id`).
- hr_admin, super_admin and support also need a row in `privileged_accounts`.

**Current user:** `resolveAuthenticatedUserContext(supabase, user)` in `utils/auth/context.js` (around L106-313).
- It reads `hrm_profiles` (by auth id), `hrm_employees` (by `auth_user_id`, with fallbacks), `privileged_accounts` and `vendor_profiles`.
- It returns `{ userId, accountType, isHrAdmin, isSuperAdmin, isSupport, isVendor, employee (incl. module_access), moduleAccess, destination, user{id, employeeId, email, name, avatarUrl} }`.

**Standard server pattern** (copy this, NOT the CRM routes, which skip auth):
```js
import { createClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/admin';
import { resolveAuthenticatedUserContext } from '@/utils/auth/context';

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
const authContext = await resolveAuthenticatedUserContext(supabase, user);
if (!authContext) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// role / module check → 403, then query via adminClient, wrap in try/catch → 500
```
- `utils/api-helpers.js` provides `requireAdmin()` and `requireAdminOrSupport()`.
- HRM routes define local helpers such as `requireHrAdminAccess()` (checks `authContext.isHrAdmin`).

**Login flow:**
1. `/login` → `DataContext.js` → `POST /api/auth/login`.
2. The route checks bcrypt against `hrm_employees.password_hash`, calls `ensureEmployeeAuthUser` and `signInWithPassword`, and returns `destination`.
3. The client does `window.location.href = destination`.
4. **The employee destination is `/other-modules`** (the module picker). HR admins go to `/HRM/hrm/admin`; super admins go to `/Taskmanager/admin`.

**Client-side context:**
- `GET /api/auth/context` is consumed by `components-homepage/workspaceAuthClient.js`, `useWorkspaceRouting.js` and `ModuleAccessGate.jsx`.
- The result is cached in sessionStorage under `workspace-auth-context-v1`.

**`middleware.js`:**
- Matcher: `/Taskmanager/admin`, `/Taskmanager/dashboard`, `/HRM/hrm`, `/Auditing/auditing`, `/superadmin`, `/employee-intake`, `/other-modules`, `/login`. `/onboarding` and `/api` are not matched.
- Logged-out users are sent to `/login`.
- Vendors are isolated to `/other-modules/vendor/portal`.
- `/superadmin` requires super admin.
- HRM admin paths and `/employee-intake` require HR admin.
- `/HRM/hrm` is for employees only.
- Employees whose access is disabled (`isEmployeeAccessDisabledNow`, `utils/hrm-employment.js`) are sent to `/login`.
- **It never checks per-module flags.**

**First-login gating:** none exists today.
- `hrm_employees.must_change_password` is set true on create, but it is simply cleared on the first login, with no forced screen.
- The only "must complete" pattern is in the vendor portal (`vendor_profiles.is_profile_completed`).

## 4. Module access (per-employee on/off) — IMPORTANT

**Storage:** table `public.hrm_module_access`, one row per employee (`employee_id` is unique and used for upserts; FK `module_access_employee_id_fkey` → `hrm_employees.id`).
- Columns: `task_manager`, `task_manager_role`, `hrm_admin`, `auditing`, `auditing_role`, `crm`, `crm_role`, `vendor`, `vendor_role`, `finance`, `finance_role`, `granted_by`, `granted_at`, `updated_at`.
- The table predates the migrations; it was renamed from `module_access`.
- `*_role` values are `admin`/`member`/`viewer`. They exist but are not edited by the UI.

**There are three key styles for the same module** — keep them in sync:

| DB column | Client key (`moduleAccess`, `ModuleAccessGate`) | PATCH body field |
|---|---|---|
| `task_manager` | `taskManager` | `taskManagerAccess` |
| `hrm_admin` | `hrm` | `hrmAdminAccess` |
| `auditing` | `auditing` | `auditingAccess` |
| `crm` | `crm` | `crmAccess` |
| `vendor` | `vendor` | `vendorAccess` |
| `finance` | `finance` | `financeAccess` |

**Resolution rules** (`utils/auth/context.js`):
- `getDefaultModuleAccess()` (around L13-22).
- `buildModuleAccessState()` (around L37-80) maps each flag to `{enabled, href}`.
- HR admins and super admins get every module. Support users get only `taskManager`. Employees get only the flags that are true.
- If the employee's access is disabled, everything is off.
- Example:
  ```js
  const financeEnabled = !employeeAccessBlocked && (isHrOrSuperAdmin ? true : Boolean(employeeModuleAccess.finance));
  finance: { enabled: financeEnabled, href: financeEnabled ? '/other-modules/finance' : null },
  ```
- Note: an employee needs `hrm_admin = true` even to open the employee HRM app (`/HRM/hrm`).

**HR admin toggle UI:** HRM admin → sidebar "Module Access" (`admin-module-access`).
- Component: `app/HRM/components/views/admin/ModuleAccessManager.tsx`.
  - `ModuleKey` type around L10.
  - `MODULES` array around L35-60.
  - `buildPatchBody` around L106-132.
  - Header text around L251.
- It loads with `GET /HRM/api/employees?includeMeta=1` and saves with `PATCH /HRM/api/employees?id=<uuid>`.

**API (`app/HRM/api/employees/route.js`):**
- `upsertModuleAccess()` around L1025.
- GET select list around L1302-1314.
- POST creates the initial access row around L1728-1741 (all flags false except `task_manager`, which comes from the form).
- PATCH:
  - parses `*Access` fields around L2006-2011
  - computes `hasModuleAccessUpdate` around L2208
  - builds the full upsert payload around L2243-2258; every column is listed explicitly.

**Enforcement:**
- Launcher tiles: `app/components-homepage/OthersSection.jsx`.
  - Static `otherModules` array around L5-55, with `{id, title, image, video, accessKey}` and assets in `/public/assets`.
  - Disabled tiles show "Access Off" and a "No Access" dialog. Tiles are never hidden.
  - `far` is always enabled; `finance` is special-cased.
- Page gate: `app/components-homepage/ModuleAccessGate.jsx` (`moduleKey`, `moduleLabel`). It shows a loader, then a "Login Required" or "No Access" card, otherwise the children. It does not redirect.
  - Used by hrm, auditing, taskManager, vendor and finance.
  - **CRM is not gated, and FAR is always open.**
- Server API checks are inconsistent:
  - Enforced: HRM `employee/me` (needs `hrm_admin`), task APIs, auditing.
  - Login only: vendor and CRM APIs.
  - No auth at all: `api/finance/companies`.

**RLS pattern:** each module has a SQL function such as `finance_has_module_access()`. It returns true for admin, hr_admin or super_admin, or when the `hrm_module_access` flag is true. See `20260930000000_create_finance_compliance_calendar.sql`.

### Checklist: adding a NEW module `<key>` (e.g. `onboarding`)
1. **Migration:** `ALTER TABLE public.hrm_module_access ADD COLUMN IF NOT EXISTS <key> BOOLEAN NOT NULL DEFAULT FALSE;`, plus an optional `<key>_role` and an RLS function and policies for the module's own tables.
2. **`utils/auth/context.js`:** add to `getDefaultModuleAccess`, to `buildModuleAccessState` (enabled and href), and to the **three** `hrm_module_access` select lists (around L126-135, L173-182, L203-212).
3. **`app/api/auth/context/route.js`:** add `<key>: {enabled:false, href:null}` to all **four** default `modules` objects.
4. **`app/components-homepage/workspaceAuthClient.js`:** add to `buildDefaultModules` and `normalizeWorkspaceState`. **A key missing from `normalizeWorkspaceState` is silently dropped.** Consider bumping the cache key `workspace-auth-context-v1`.
5. **`OthersSection.jsx`:** add a tile `{id, title, image, video, accessKey}` and its assets under `public/assets/`.
6. **`ModuleAccessManager.tsx`:** add to `ModuleKey`, `MODULES` and `buildPatchBody` (`<key>Access`), and optionally update the header text.
7. **`app/HRM/api/employees/route.js`:** parse `body.<key>Access`, include it in `hasModuleAccessUpdate`, add it to the PATCH upsert payload, add `<key>: false` to the POST initial upsert, and **add it to the GET select** (otherwise the grid can't show its state).
8. **Optional:** add it to the select lists in `utils/api-helpers.js` and `app/HRM/api/employee/me/route.js`, and to `scripts/seed-hr-admins.mjs`.
9. **Pages:** create `app/other-modules/<key>/` wrapped in `<ModuleAccessGate moduleKey="<key>" moduleLabel="...">`. The middleware already requires login for `/other-modules/*`.
10. **APIs:** require `authContext.moduleAccess.<key>.enabled` (or HR or super admin), otherwise return 403. Add this explicitly, since many existing modules skip it.
11. **Optional:** a middleware redirect if the flag is off. No module has one today.

## 5. HRM module

- **Routes:**
  - `app/HRM/hrm/page.jsx` is the employee app, gated with `moduleKey="hrm"`.
  - `app/HRM/hrm/admin/page.jsx` is the HR admin app.
  - Both import `app/HRM/components/styles/index.css` and render inside `<Suspense>`.
- **Single-page tab shells:**
  - `components/App.tsx` (employee) and `components/AdminApp.tsx` (admin).
  - The active tab is held in `?tab=`, updated with `pushState` plus a popstate listener. Views mount lazily once visited.
  - The employee app bootstraps with `GET /HRM/api/employee/me`.
  - The employee tab map is in App.tsx around L126-141, and the employee nav in `layout/Sidebar.tsx` around L49-60.
  - The admin nav is in `layout/AdminSidebar.tsx`; tab ids include `admin-module-access`, `admin-onboarding` and `admin-add-employee`.
- **Views:** `components/views/*.tsx` and `views/admin/*.tsx`. These include Dashboard, Attendance, Leave, Salary/payroll, Expenses, Tickets, PolicyManual, Profile and daily logs.
- **Shared UI:** `app/HRM/components/ui/`:
  - `EmployeePageHeader`, `HrmEmptyState`
  - `Skeleton` (Skeleton, Spinner, LoadingPanel, ShellSkeleton, …)
  - `HrmFeedback` (`useHrmFeedback()` provides `showFeedback` and a promise-based `confirmFeedback`)
- **APIs:** `app/HRM/api/**/route.js` (JS), covering attendance, leaves, holidays, expenses, tickets, policies, employee, employees, manager and admin.
- **Logout:** `supabase.auth.signOut()` → `POST /api/auth/signout` → `/login`.

### Adding an employee (HR)
- **UI:** `views/admin/AddEmployee.tsx` (tab `admin-add-employee`).
- **API:** `POST /HRM/api/employees` (multipart form, HR only). Required fields: `employeeId`, `name`, `email`, `password`, `department`, `designation`.
- **Steps:**
  1. Insert into `hrm_employees` (with `role:'employee'`, `must_change_password:true`).
  2. Create the auth user with `ensureEmployeeAuthUser` (`utils/employee-auth.js`) and write `auth_user_id` back.
  3. Upsert `hrm_profiles`.
  4. Sync auth `user_metadata`.
  5. Insert the education, certification and document child rows.
  6. Upsert `hrm_module_access`.
  7. Queue the `employee_created` email.
- **`hrm_employees` key columns:**
  - Identity and auth: `id` (uuid), `employee_id` (code), `name`, `email`, `auth_user_id`, `password_hash`, `must_change_password`, `password_set_at`.
  - Organisation: `department_id`, `designation_id`, `reporting_manager_id`, `reporting_super_admin_id`, `company`, `division`.
  - Joining and status: `date_of_joining`, `confirmation_date`, `employee_type`, `employment_lifecycle_status` (active/inactive/separated), `current_stage` (none/probation/notice_period/on_leave), `access_disabled_at`.
  - Other: `profile_picture_url`, plus personal, address, bank and ID fields.
- **Related tables:**
  - `hrm_profiles` (`id` = auth id, `role` CHECK: super_admin/hr_admin/support/employee)
  - `hrm_departments`, `hrm_designations`
  - `hrm_employee_education`, `hrm_employee_certifications`, `hrm_employee_documents`
  - `hrm_employee_lifecycle_events`
  - `privileged_accounts`, `hr_admins`, `super_admins`, `vendor_profiles`
  - `hrm_policies`, `hrm_policy_documents` (policy manual)
  - notices

## 6. EXISTING "Employee Onboarding" (pre-hire) — do not collide

This is a **logged-out candidate form**, sent before the person is an employee.

**Flow:**
1. HR opens HRM admin → "Employee Onboarding" (tab `admin-onboarding`, `views/admin/EmployeeOnboarding.tsx`) and calls `POST /HRM/api/admin/onboarding`.
   - This creates a token; only its SHA-256 hash is stored. It expires after 24h.
   - Status is set to `invited` and an email (`onboarding_invite`) is sent with the link `{appUrl}/onboarding/{token}`.
2. The candidate fills in `app/onboarding/[token]/page.jsx` + `OnboardingFormClient.jsx`, which talk to `app/api/onboarding/[token]/route.js` and `.../upload/route.js`.
   - Sections: personal details, addresses, ID and bank details, education, experience, certifications, documents and a declaration.
   - Saving a draft sets `in_progress`. Submitting sets `submitted` and clears the token.
3. HR reviews with `PATCH /HRM/api/admin/onboarding/[id]`: approve, reject, archive, cancel, request_changes or regenerate_link.
4. **Convert:** `AddEmployee` prefills from `GET /HRM/api/admin/onboarding/[id]/prefill`. Then `POST /HRM/api/employees` (with `onboardingRequestId`) moves the files across and sets the request to `converted`.

**Statuses:** invited, in_progress, submitted, approved, changes_requested, rejected, converted, expired, cancelled.

**Taken names — avoid for anything new:**
- Routes `/onboarding/*`, `/api/onboarding/*`, `/HRM/api/admin/onboarding/*`. The `[token]` segments catch everything, so `/onboarding/about` would be treated as a token.
- Tables `hrm_onboarding_requests`, `hrm_onboarding_education`, `hrm_onboarding_certifications`, `hrm_onboarding_documents`, `hrm_onboarding_review_events`.
- Trigger `set_hrm_onboarding_updated_at`, bucket `hrm-onboarding-files`, email type `onboarding_invite`.
- Code exports in `utils/onboarding.js` (`ONBOARDING_STATUSES`, `fetchOnboardingBundleById`, …).
- Tab id `admin-onboarding` and the label "Employee Onboarding".

**Adding a new email type** means rewriting the `email_outbox_event_type_check` constraint (latest version in `20260708180000_daily_work_log_report.sql`) and updating the type union in `supabase/functions/email-dispatcher/templates/index.ts`.

## 7. Other modules (`app/other-modules/`)

- **Vendor ("Vendora")** — the cleanest template to copy:
  - `page.jsx` redirects to `/dashboard`.
  - `layout.jsx` (`'use client'`) creates a `VendorContext` + `useVendor()`, gets the user from `useWorkspaceRouting()`, fetches with `fetch('/other-modules/vendor/api/...')`, forces light mode, and wraps everything in `<ModuleAccessGate moduleKey="vendor">`.
  - `components/Sidebar.jsx` is collapsible (`w-56`/`w-20`) and has an "All Modules" link back to `/other-modules`.
  - APIs live at `api/<resource>/route.js`.
  - `portal/` is the vendor-facing portal (vendor role) and gates profile completion.
- **Finance:** a hub page (no layout) gated with `moduleKey="finance"`, plus `compliance-calendar/`.
- **CRM:** its own layout (a server component with `metadata`), `context/` providers (including `ToastContext`), many sub-routes, and Apple-style UI with dark mode. It is **not gated** and its APIs skip auth.
- **FAR:** always enabled, at `far/[companyId]`.

## 8. Design system (what the app actually uses)

**Tokens in `app/globals.css`:**
- `--color-primary #3170c6`, hover `#2158a4`, light `#edf4fc`, dark `#0f172a`.
- **`violet-*` and `purple-*` are remapped to a BLUE scale:** 50 `#edf4fc`, 100 `#d7e7f9`, 200 `#afd0f4`, 300 `#7eb0ec`, 400 `#4f8be4`, 500 `#3170c6`, 600 `#2558a2`, 700 `#1d4581`, 800 `#183868`, 900 `#142c52`, 950 `#0d1a33`. So `text-violet-700` renders as brand blue.
- Dark mode is class-based (`.dark`) but is effectively only used by CRM. Design light-first.
- Font: Inter.

**HRM tokens** (`app/HRM/components/styles/index.css`): Material-3 style, with primary `#3170c5`, surfaces `#f8f9fa`/`#f1f4f5`/`#ebeef0`, and error `#a8364b`. Headlines use Manrope and body text uses Inter.

**Common patterns:**
- Page: `p-4 md:p-8 space-y-6 bg-slate-50`. Title: `text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900`.
- Eyebrow: `text-[10px]/[11px] uppercase tracking-[0.2em] font-extrabold text-[#3170c6]`, often in a `bg-[#edf4fc] border-[#afd0f4] rounded-full` chip.
- Card: `bg-white rounded-2xl|3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md`.
- Icon chip: `p-2.5 rounded-2xl bg-[linear-gradient(135deg,#e0f2fe_0%,#bae6fd_100%)]`.
- Radius: cards `rounded-2xl`/`3xl`, modals `rounded-[1.75rem]`/`[2rem]`, launcher tiles `rounded-[28px]`. **All buttons and badges are `rounded-full`.**
- Buttons:
  - Primary `rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white`.
  - HRM primary: blue gradient `bg-[linear-gradient(180deg,#d7e7f9_0%,#7eb0ec_100%)] text-violet-950 font-extrabold`.
  - Secondary: `border border-violet-200 bg-white/80 text-violet-700`.
- Shadows are soft and blue-tinted, e.g. `shadow-[0_12px_32px_rgba(49,112,197,0.1)]`.
- Sidebar active item (Vendor): `bg-[linear-gradient(180deg,#d7e7f9_0%,#7eb0ec_100%)] text-violet-950 font-extrabold rounded-xl`.

**Icons:** lucide-react in other-modules; Material Symbols (`<span className="material-symbols-outlined">`) in HRM and the homepage.

**Feedback:** there is no global toast library. HRM uses `useHrmFeedback` (modal dialogs), CRM uses `ToastContext`, and Vendor and Finance use `alert()`.

## 9. Gotchas

- `supabase/schema.sql` is **outdated**: it uses the pre-rename names `employees`, `profiles` and `module_access`. Trust `supabase/migrations/` instead.
- `DESIGN.md` is an Apple reference, not this app's design system.
- The module list is hard-coded in about six places (see the checklist in §4). Missing one makes a module silently disappear or always show as off.
- The working tree has uncommitted changes in Auditing, CRM and Taskmanager files. Don't overwrite them.
- `utils/auth/roles.js` `getDefaultDestinationForAccountType` says `/HRM/hrm`, but the destination actually used comes from `context.js`, which sends employees to `/other-modules`.

## 10. Onboarding module (post-joining, in-app) — FRONT-END BUILT

**Everything lives in `app/other-modules/onboarding/`.** Read `app/other-modules/onboarding/README.md` first: it has the full file tree and the common tasks.

- **Status:** UI only. There is no access logic, no database and no completion tracking ("Mark section as read" is local state).
- **Launcher card:** in `app/components-homepage/OthersSection.jsx`, the `onboarding` entry is first. It is special-cased to be always enabled with href `/other-modules/onboarding`. When HR access control is added, follow the §4 checklist.
- **Structure:**
  - `page.jsx` → `_shell/OnboardingShell.jsx`
  - `_shell/SectionMenu.jsx` is the fixed three-dot menu.
  - `_shared/ui.jsx` holds `Glass` (with a `tint` prop for light-blue small cards), `Reveal`, `SplitHeading`, `Counter` and `Icon`.
  - `_sections/index.js` is the section list; each entry has a `component`.
  - `_sections/01-about-company/` contains `AboutCompany.jsx`, `content.js`, `assets/` and one file per chapter in `components/`.
  - `_sections/02-about-founders/` contains `AboutFounders.jsx` (iframe) and `site/`, the founders website kept as-is with its own assets and vendor JS: three, gsap, lenis.
  - `founders-site/[...file]/route.js` serves `site/` at `/other-modules/onboarding/founders-site/*`. It is login-protected by middleware and guarded against path traversal.
- **Section 03 · Meet the Team** (`_sections/03-our-team/`):
  - Live data comes from `api/team/route.js`, which requires login and queries `hrm_employees` (not separated or disabled) joined with `hrm_designations(title)` and `hrm_departments(name)`. It returns `{id, name, role, department, photo}`, where photo = `profile_picture_url`, a public URL in the Supabase Storage bucket `employee-avatars`.
  - Its UI follows the user's reference design:
    - **The hero is exactly one screen**, with its blocks grouped centrally (`justify-center`): a compact serif + bold heading, the photo circle, then 3 highlight columns. The "Onboarding · Section 03" chip sits top-right.
    - `CurvedCarousel`: the camera sits at the centre of the cylinder (CSS perspective = radius R), giving the reference's look: small centre cards that grow wider and more tilted towards the edges.
      - Cards are placed at angle steps of 0.27 rad with a 7% gap.
      - Card size comes from the screen's width and height so the hero fits.
      - It auto-turns continuously left→right, pauses on hover and can be dragged.
      - Step 1 (approved): a card is hidden only once its inner edge is past the screen edge (`limit`), so cards scroll in and out with no popping. Verified by sampling: 0 pops at 4 sizes.
      - Step 2:
        - Card **height grows from the centre outwards** (`GROW` 0.18, smoothstep on |a|/view), by setting the real height so photos aren't stretched.
        - A soft top/bottom mask fade (`fadeY` intersected with `fadeX`) and `pad` (≤ 28px, 2.5% of vh) remove the hard line where shadows were clipped.
        - To keep the hero on one screen, the **circle radius R is fixed from the full card size**; cards shrink only as needed and their angle `geo.step` shrinks with them.
        - Verified: the hero fits at 1280×720, 1440×900, 1536×864, 1920×1080 and 1024×768, with 0 edge pops.
      - Step 3 (fewer, bigger cards):
        - The number of cards per frame is fixed by width: `across` = 7 (≥1100px), 5 (≥640px) or 3. R is derived so that `across` cards span the screen, and cards are up to 220px wide.
        - The strip's height budget is the space left in the hero (`otherHeroHeight`: viewport minus the other blocks, gaps and padding). A ResizeObserver watches those blocks.
        - If the strip is too tall, the curve is first flattened (the half-angle drops to 0.7 at minimum). After that, cards get narrower, and the gap can grow up to `MAX_GAP` 0.33 before the spacing tightens.
        - Verified: the hero fits on all 6 test sizes, with 0 pops. The centre card is 156×228 at 1440×900 (it was 92×134) and 88×128 at 1280×720 (it was 74×108).
      - Step 4 (tighter, more curved): `STEP` 0.27→0.32 (deeper curve), `GAP` 0.07→0.03, `MAX_GAP` 0.33→0.12 and a minimum flatten angle of 0.9. The centre card is 131×194 at 1440×900. Backup: `scratchpad/CurvedCarousel.before-step4.jsx`.
    - **Rejected by the user and reverted (do not reapply):** a 3+1+3 glide-and-pause variant, and a flat equal-width strip with gentle height growth, edge fades and a one-line stats row.
    - Below the hero: a department bento grid, then `TeamDirectory`, a one-person spotlight. It has department chips plus a search over name, role and ID. The photo sits in the centre, with the previous and next people peeking behind it in greyscale. The left side shows the name, Employee ID and Designation; the right side shows the Department, Joined on date and time with BNC (years + months). It has prev/next arrows, a thumbnail strip, ←/→ keys and swipe.
      - The API also returns `code` (`hrm_employees.employee_id`, e.g. E019) and `joined` (`date_of_joining`). All 34 employees have both.
      - Backups: `scratchpad/TeamDirectory.before-spotlight.jsx` and `team-route.before-spotlight.js`.
      - v2 (user feedback):
        - The background circle/rings and thin divider lines are removed. The thumbnail strip is removed; only two equal navy arrow buttons (56px) sit centred under the photo.
        - On change, the photo flips (rotateY) and the grey people behind it slide along. Every value flips up or down like a split-flap board (`Flip`), staggered, with direction following the arrow.
        - The department filter is a single soft rail: the active option is a white pill that glides (layoutId) and shows a count badge. The rail fades out at the right edge.
        - Backup of v1: `scratchpad/TeamDirectory.spotlight-v1.jsx`.
  - As of 2026-10-25: 34 employees, 29 with photos, 9 departments.
- **Shared parts:** `_shared/ChapterHead.jsx` and `_shared/SectionEnd.jsx` (with `number` and `headline` props) are used by every section.
- **Images:** Section 01 images are imported statically (`import x from './assets/x.png'` → `x.src`). There are **no onboarding files in `public/` any more**.
- **Design rules (from user requests):**
  - Page background `#FFFFFF`. No gradients on big cards. Small cards use `<Glass tint>`.
  - No globe, dotted background or 3D card objects in Section 01. three.js is not an npm dependency; it is only vendored inside the Section 02 site.
  - The section 01 hero is "Welcome to / BNC Global Consultech." with 4 KPI cards and a light grid/rings backdrop.
  - `ChapterHead`: the title runs full width, the outlined number sits on the right, and the intro text sits below.
  - `Glass` sets its background inline as well, because Safari once cached stale CSS.
- **Founder titles differ between sources:** the company profile docx (Section 01) says Summit Goyal is Founder; the founders PDF/site (Section 02) says Gurvinder Pal Singh is Co-Founder & MD. This is pending confirmation from the user.

### Original plan / still to do

This is a different feature from §6. It is for employees who already have an account, and HR switches it on or off per employee in Module Access.

**Agreed so far:**
- Module key `onboarding` (a column in `hrm_module_access`, default FALSE so no existing behaviour changes).
- Route `/other-modules/onboarding` (NOT `/onboarding`).
- Its own tables with a non-colliding prefix (e.g. `hrm_induction_*`) for per-employee progress.
- Follow the §4 checklist and the Vendor template.
- First section: **About the Company** (who we are, what we do, how the company runs). The content will be provided by the user. More sections will follow.

**Open decisions (pending from the user):**
1. Visual style: the BNC Global website style (navy/blue, glass cards, Manrope) or the in-app Vendor/HRM style.
2. Whether completion is mandatory (block other modules until it's done) or optional.
3. Whether the content is static in code or editable by HR.
4. Whether HR sees per-employee progress.

### Onboarding update (2026-10-25): Mark as read + Section 04
- **Mark as read:** every section ends with `SectionEnd`. Section 02 now has one below the founders iframe.
  - The button is one-way: once marked, it stays marked. It is never automatic, so Continue does not mark the section.
  - Read state lives in `OnboardingShell` via `useSyncExternalStore` over localStorage `ob-read:<user id|email>`, and is shared through `_shell/navContext.js`.
  - The menu shows read sections with a green tick tile and a "Read" badge, plus a green "X of N read" progress bar.
  - This is browser-only for now; there is no server table yet.
- **Section 04 · Your Role & Team** (`_sections/04-role-team/`, moved from 07; Culture/Policies/Tools are now 05–07).
  - It uses its own API, `api/me` (`load.js`), because `/HRM/api/employee/me` requires the `hrm_admin` module.
  - The API returns:
    - the profile: the same fields as HRM → My Profile, including salary, modules and probation dates;
    - the manager (`reporting_manager_id`);
    - direct reports;
    - documents (`hrm_employee_documents`: file_url, file_name, file_size).
  - UI: hero with a layered ID card → reporting-line org tree → role bento (salary hidden until the eye button is clicked) → about you → documents with a required-docs ring.
  - The reporting line is (per user) **only** manager → you → your direct reports. Peers who share your manager are not shown and are no longer returned by the API. The hero's "Your team" stat counts your direct reports.
  - Sample: E104 has manager E074 and 1 direct report; E074 has no manager and 10 reports.
- Backups: `scratchpad/before-read-role/`.
- **Section menu scroll:**
  - The panel is capped at `100svh-92px` (108px on md).
  - The header and "All Modules" footer stay fixed, and only the section list scrolls.
  - The list uses `.ob-scroll-y`: a 4px slim scrollbar that darkens on hover, smooth scrolling, and overscroll that is contained.
  - Backup: `scratchpad/SectionMenu.before-scroll.jsx`.
- **Founders end buttons (Section 02):**
  - The site's closing CTA ("Book a consultation" / "Meet the founders") is replaced by `#obRead` "Mark as read" and `#obNext` "Continue to <next>".
  - They postMessage `{source:'ob-founders', type:'ready'|'markRead'|'next'}` to `AboutFounders.jsx`, which replies with `{source:'ob-shell', isRead, nextTitle, hasNext}`. Both sides check the same origin and window.
  - The separate `SectionEnd` below the iframe was removed.
  - Backups: `scratchpad/founders-index.before-cta.html` and `AboutFounders.before-cta.jsx`.
- **Section 01 hero (2026-10-25):**
  - The circle rings and round glow are removed from `HeroBackdrop`, and the grid is kept.
  - Added a pointer spotlight (brighter grid lines around the cursor, on mouse devices only), 12 twinkling "+" marks on grid corners (`.ob-twinkle`) and a faint light line that scans down the grid every ~10s.
  - "Consultech." has `.ob-shine`: the same font and blue, with a light sheen sweeping left→right every 6s. It is off with reduced motion.
  - Backups: `scratchpad/Hero.before-shine.jsx` and `HeroBackdrop.before-bg.jsx`.
- **Section 01 hero update:**
  - The twinkling "+" marks and the scanning light line were removed (the user didn't like them). The grid and pointer spotlight remain.
  - The "Consultech." shine cycle is now 3.1s: a ~2.1s sweep, then a 1s rest.
  - KPI cards have `.ob-card-shine`: a diagonal white reflection (::after) that sweeps in ~1.4s, then rests 5s (6.4s cycle). Each card is staggered by 0.18s.
  - Backups: `scratchpad/HeroBackdrop.with-twinkle.jsx` and `onboarding-styles.before-kpi-shine.css`.
- **Section 01 hero, liquid glass:**
  - Behind the heading are 4 blurred "liquid" shapes (`.ob-liquid l1–l4`: blue, sky, periwinkle, aqua), which drift, rotate and morph their border-radius over 22–34s.
  - A white/35 frosted sheet sits over them, and they fade out at the bottom (`liquidFade`) before the KPI cards. The grid and spotlight stay on top.
  - The Begin button's arrow bobs on its own (`.ob-arrow-bob`, 1.6s).
  - Backups: `scratchpad/HeroBackdrop.before-liquid.jsx`, `Hero.before-arrow.jsx` and `onboarding-styles.before-liquid.css`.
  - The liquid glass colour was removed again because the user found it unprofessional. The hero is white with the grid and spotlight only, and the arrow bob stays.
- **Hero grid cells:**
  - The round spotlight is replaced by cell lighting. The grid square under the pointer gets `.ob-cell.is-on`: a soft blue fill with a 1px brighter edge that fades in over 0.18s.
  - It fades out over 0.9s once the pointer leaves, leaving a fading trail.
  - Cells are reused DOM spans computed from the centred 56px tile. They are cleared on resize, work on mouse devices only, and are off with reduced motion.
  - Backup: `scratchpad/HeroBackdrop.before-cells.jsx`.
  - Cells are now faster and darker: 0.08s in, 0.45s out, a .16 fill and a .45 edge.
  - Cells are now darker and solid: a .30 fill and a .65 edge. On leave they fade and shrink to .86 over 1.2s for a soft trail. On enter they appear in 0.08s.
  - Grid cells are now 44px (were 56). Lit cells are darker (.38 fill, .75 edge). On leave they fade dark→light over 1.1s with no shrink.
  - The lit cell now uses the same solid blue as the Begin button (`var(--ob-blue)` #1257c0, edge #0f4aa6) at full opacity.

### Other Modules page (`app/components-homepage/OthersSection.jsx`), 2026-10-25
- The Onboarding card uses the HRM cover video. `OnboardingCardArt` was removed.
- **Fit:**
  - The heading is smaller (28/34/38px) and the fixed 100px header height was removed.
  - Card height is `MODULE_CARD_HEIGHT`: 230px below xl, and `clamp(160px,(100svh-300px)/2,250px)` on xl.
  - All 8 cards fit without scrolling at 1280×720, 1366×768, 1440×900, 1536×864 and 1920×1080. Phones scroll.
- **Loader:**
  - The cards render hidden (opacity-0) under an 8-card `ModuleCardsSkeleton` (it now takes `count` and `cardClassName`).
  - They stay hidden until every video fires loadeddata/error (or readyState≥2 on mount) and the Material Symbols font is ready. The font is detected by an offscreen "arrow_forward" probe being narrower than 40px, because `document.fonts` reports ready before the stylesheet arrives.
  - An 8s timeout reveals the cards anyway. The arrow stays `invisible` until the font is ready, so the raw icon name never shows.
- Backups: `scratchpad/OthersSection.before-fit.jsx` and `ExperienceLoaders.before-fit.jsx`.

### Homepage hero dashboard (`app/components-homepage/DashboardPreview.jsx`), 2026-10-25
- The `/assets/img.png` screenshot under "Get Access" in `Hero.js` is replaced by a coded copy of the current super-admin Task Manager dashboard inside a Mac window (traffic lights plus a "Universe One — Task Manager" title pill). The scroll tilt in Hero.js is unchanged, and `img.png` is kept.
- It is drawn at a fixed 1440×1110 "screen" and scaled to the container width (ResizeObserver), so it looks like a screenshot at every size.
- Contents:
  - The admin sidebar menu.
  - A greeting with the viewer's own time and date.
  - 8 KPIs: Total 1,383, Pending 183, In Progress 103, Completed 1,097, Open Tickets 5, Late 0, Breached 0, and Avg Resolve Hrs fixed at **10** (the user's choice; the real value was 421.5).
  - A 15-day creation trend, the distribution donut, the priority bars (21 / 1,132 / 209 / 21) and Recent Tasks.
- The homepage is public, so the numbers are a fixed snapshot from 25 Oct 2026, and the user (Aarav Mehta, "AM") and the task names are samples. Real titles contain client names.
- Animations start in view: count-up, line draw (pathLength), donut segments and bar grow. They are off with reduced motion.
- Backup: `scratchpad/Hero.homepage.before-preview.js`.
- **Update: the preview now switches between two dashboards.**
  - `DashboardPreview.jsx` is just the Mac frame: a title-bar switcher with **HRM** and **Task Manager** tabs (blue sliding pill) and a progress line under the active tab.
  - It moves to the next screen every 7s while in view, pauses on hover, and slides/crossfades between screens. Screens remount on switch, so their animations replay.
  - The screens live in `app/components-homepage/dashboard-preview/`:
    - `HrmScreen.jsx`: a copy of the HRM employee Home dashboard and sidebar, with sample employee "Aarav Mehta", E201. It includes the attendance summary with weekly bars, the Daily Inspiration card with looking eyes, upcoming holidays, Request Leave / Policy Manual, the live ticking clock with View Swipes / Check Out, and Team Attendance Summary with 3 sample reportees.
    - `TaskManagerScreen.jsx`: the earlier super-admin Task Manager screen.
    - `shared.js`: SCREEN_W 1440, SCREEN_H 1040 (reduced from 1110 at the user's request), useToday and CountUp.
  - Backup of the single-screen version: `scratchpad/DashboardPreview.tm-only.jsx`.
- **Update:**
  - The HRM / Task Manager tabs are removed. The title bar now shows only a "Universe One" pill in the centre, plus two small icon-only arrow buttons (chevron left/right) at the top right for previous/next. The 7s auto-advance and hover pause remain.
  - SCREEN_H is now 980 (from 1040).
  - Backup: `scratchpad/DashboardPreview.with-tabs.jsx`.

### Onboarding Section 05 · Tools & Systems (2026-10-26)
- The section is now 05; Culture & Values moves to 06 and Policies to 07.
- It lives in `_sections/05-tools-systems/`. All text is in `content.js`.
- Platforms:
  - **Universe One** (ready), with modules HRMS (ready), Task Manager (soon) and CRM (soon).
  - "Second platform": a placeholder whose name the user is to confirm (they said something like "CI deck").
  - **Partner Module** (soon).
- **HRMS has 7 guides**, written from the real HRM code (agent-traced): Check in, Check out, Fill the check-out form (Daily Work Log), Regularize attendance, Apply for leave, Claim an expense, Raise a ticket. Each has:
  - where to find it
  - a video slot
  - numbered steps with exact UI labels
  - a required/optional form table
  - what happens next
  - Good to know / Watch out notes
- **Videos:**
  - Drop `hrms-check-in.mp4` etc. (names in `videos/README.md`) into `_sections/05-tools-systems/videos/`.
  - `tools-videos/[file]/route.js` serves them with Range/206 seeking and HEAD, and has a traversal guard.
  - `VideoSlot` HEAD-checks the file and needs `content-type: video/*`, so a login redirect isn't treated as a video. If the check fails it shows a "Video coming soon" placeholder.
  - Tested end to end with a sample MP4 (removed afterwards).
- Notable real rules included in the guides:
  - Location is optional at check-in.
  - The work log total must be >0 and ≤8 hours, and Pending tasks can't be logged.
  - Regularization covers only past Half Day/Absent dates and is blocked after the payroll lock; the HR approver or the reporting manager (whoever reviews first) decides.
  - Leave can't be edited or cancelled after submitting.
  - Expense reviewer is chosen by the employee; resubmit is possible after "Needs Changes".
  - Tickets: Late after 24h, SLA breach after 72h.
- **Update (2026-10-26):**
  - The platforms are now **Universe One**, **Ciedeck** (recruitment) and **BNC LEG** (partner platform).
  - Their logos were trimmed and copied into `_sections/05-tools-systems/assets/` (from `public/assets/`) and are shown on the cards with next/image.
  - All three cards are white; the selected card has a blue ring.
  - **Task Manager is now ready, with 9 employee-side guides** (agent-traced from `app/Taskmanager/components/*`):
    - Your dashboard
    - Create a task
    - Manage your tasks (views/filters/sort/hide)
    - Update a task (status, progress slider, creator-only edit/delete, subtasks block completion)
    - Subtasks, comments and files
    - Personal to-dos (browser-only storage)
    - Task tickets
    - Chat (1:1 only, no edit/delete)
    - Team and settings (password only)
  - Calendar is a "Coming Soon" page in the app, and the guides say so.
  - Video names are `tm-*.mp4` (listed in `videos/README.md`).
  - Backups: `scratchpad/tools-content.before-tm.js` and `ToolsHero.before-logos.jsx`.
  - **Fixes:**
    - Guide list cards no longer have their side borders clipped. The strip keeps 6px padding on every side, because the unlayered `.ob-scroll-x` overflow beats Tailwind's `lg:overflow-visible`. Unselected cards have a soft #f8fafd fill and a ring.
    - Previous/Next are now compact pills side by side on the left ("← Previous", "Next: <title> →").
    - Backups: `scratchpad/ModuleGuides.before-fix.jsx` and `GuideViewer.before-fix.jsx`.

### HR admin panel UI refresh (2026-10-26) — UI only, no backend changes
- **Sidebar** (`app/HRM/components/layout/AdminSidebar.tsx`): 224px instead of 256px (collapsed 80px instead of 96px), tighter item padding, 13px labels. `AdminApp.tsx` content margin is now `md:ml-56` / `md:ml-20`.
- **Dashboard** (`views/admin/AdminDashboard.tsx`): the same data and handlers (dashboard API, birthday-card download).
  - New white metric cards with a coloured top bar and icon chip, `SectionCard` / `Avatar` helpers, and tables for Recent Employees.
  - **New "Employees on Probation" table:**
    - Data comes client-side from the existing `GET /HRM/api/employees` (HR admins allowed), filtered on `resolved_current_stage === 'probation'` and not separated.
    - Start = `probation_started_at` or `date_of_joining`. End = `probation_ends_at` or start + `probation_period_days` (180).
    - Each row shows a progress bar with quarter ticks, "Day X of Y", a days-left chip (amber ≤15 days, green "Completed · confirm" when past), and the end date. Sorted by soonest end. Clicking a row opens the employee profile.
  - **Birthday card:** warm card with confetti, overlapping photos, a countdown chip ("In 2 days · 28 Oct"), and a "Next up" list (the remaining `upcomingBirthdays`).
  - **Anniversary card:** navy card with a gold years badge, gold-ringed photos, the anniversary label, a countdown/date chip, and a "Next up" list.
  - The live clock now starts after mount, which fixes a pre-existing hydration mismatch.
- Backups: `scratchpad/hr-admin-before/` (AdminApp.tsx, AdminSidebar.tsx, AdminDashboard.tsx).
- **v2 (user feedback):** the dashboard was split into `views/admin/dashboard/`:
  - `shared.tsx`: Avatar, CountUp, glass Panel, shimmer Skeleton.
  - `GlassKpi.tsx`
  - `TodayAttendance.tsx`
  - `ProbationPanel.tsx`
  - `CelebrationCard.tsx`
  - `LeaveToday.tsx`
- Animation keyframes (`hrm-*`) are added to `app/HRM/components/styles/index.css`.
- **KPIs** are 5 liquid-glass cards: frosted white over drifting colour blobs, a gradient icon, shimmer while loading, and a count-up. They show Active employees, Checked in today (x / working, %), On leave today, Pending HR tasks and On probation. The coloured top bars are removed.
- **Recent Employees is removed.**
- **New Today's Attendance panel** (existing `GET /HRM/api/admin/attendance?mode=daily`):
  - "Checked in" means checkIn is not '--' or swipeCount > 0. Employees on leave, holidays or weekends count as "off today".
  - Shows a % ring, a "Not checked in yet" group first (rose tiles), then a scrollable "Checked in" group with check-in times. Each tile has photo, name and ID; photos come from `/HRM/api/employees`.
- **Celebration cards** are light (birthday: blush→peach→lavender; anniversary: champagne→ice-blue), with:
  - a spinning conic ring around photos
  - falling confetti (birthday)
  - twinkling sparkles and bobbing balloons
  - "Next up" shown as a horizontal row of photos (name and date in the tooltip)
  - the birthday download unchanged
- **On Leave Today** is a table with photo, leave badge, ID, dates, session and a days pill, plus a "Full house today" empty state.
- Lifecycle reminders are now an "Action Needed" panel.
- Backup of v1: `scratchpad/hr-admin-v1/`.
- **v3 (user feedback, 2026-10-26):**
  - **KPIs** use the HRM theme: a white→#e8f1fc light gradient, a black round icon, and the value centred. The colour tones and the `tone` prop are removed.
  - **Celebration cards** are white, professional cards with no balloons:
    - Birthday: two party poppers fire a looping confetti burst every 3.8s (`hrm-burst`, `hrm-popper`), with a blue/gold ring around the photos.
    - Anniversary: soft gold sparkles and a gold ring.
    - The two cards sit stacked in one right column with a 16px gap. The layout is now a left column (attendance + probation) and a right column (birthday + anniversary).
  - **Today's Attendance** has three tabs:
    - **Check-in:** as before.
    - **Check-out:** "Still in office" vs "Checked out", using `checkOut`.
    - **Final:** absent %, plus Present / Half day / Absent groups. Status present → present; halfday/late → half day; absent, or no check-in → absent.
    - The ring text is smaller (20px), and there's a lighter, thinner scrollbar (`.hrm-soft-scroll`).
  - **Probation progress** is 6 month-blocks (one per month of the 6-month period), with "Month X of 6".
  - **On Leave Today** empty state is back to the original `HrmEmptyState` "No leave record for today".
  - Backup of v2: `scratchpad/hr-admin-v2/`.
- **v4 (user feedback, 2026-10-26):**
  - **KPI:** a plain black icon (no background) at the top-left. The card backgrounds are back to the original dashboard's light gradients: violet/blue, emerald→teal, amber→orange, purple. The value stays centred.
  - **Today's Attendance:**
    - The Check-in / Check-out / Final tabs are now a vertical list above the ring.
    - The active tab is grey (`bg-slate-100`), not black.
    - The date badge is removed.
  - **Birthday card:**
    - The download button is hidden: `onDownload` is no longer passed. The handler is kept, so it is easy to restore.
    - The header icons are plain icons.
    - The countdown chips are light: blue for birthday, gold for anniversary. No black backgrounds remain.
  - Backup of v3: `scratchpad/hr-admin-v3/`.
- **v5 (2026-10-26):**
  - KPI values are softer: semibold, `text-slate-700`, 34px.
  - **Today's Attendance:**
    - Check-in / Check-out / Final tabs sit in the panel header (top right, horizontal; the active one is white/grey).
    - The left column stacks all three mini charts vertically: Check-in % (in / not yet), Check-out % (out / still in), and Final absent % (present / half day / absent), plus "off today".
    - The selected chart is highlighted, and clicking a chart also switches the list.
  - The `Panel` header now wraps on narrow screens.
  - Backup of v4: `scratchpad/hr-admin-v4/`.

### HR Attendance page: Visual view (2026-10-26). UI only, no backend changes
- **`views/admin/AdminAttendance.tsx`**
  - New `viewMode` state (`table` default / `visual`) and an icon toggle (table_rows / monitoring) placed left of the Daily / Individual / Monthly switcher.
  - Visual is disabled for Monthly.
  - The tables, filters, export and data loading are unchanged. Visual mode swaps the table for the new components, which use the same rows and the same filters.
- **New folder `views/admin/attendance-visual/`:**
  - **`helpers.tsx`:**
    - parsers for "09:15 AM" and "8h 30m"
    - `STATUS_META`: colour, icon and label per status (holiday uses explicit hex, because the theme remaps violet to blue)
    - `Ring`, `LegendItem`, `Card`, `Stat`
    - `useEmployeePhotos()`, which reads the existing `GET /HRM/api/employees`
  - **`DailyVisual.tsx`:**
    - Check-in / Check-out / Final rings. The wording switches to "no check-in" / "no check-out" for past dates.
    - Status mix stacked bar.
    - Arrival timeline: 30-min bins, stacked on time vs late (late = `lateIn` set), with earliest / average / latest / late stats.
    - Department bars (checked in / working).
    - People board with status filter chips. Clicking a tile opens the existing swipes modal.
  - **`IndividualVisual.tsx`:**
    - Profile card with photo and an attended % ring: (present + ½ half day) / working days.
    - Status counts.
    - Six stats: average in, average out, average hours, total hours, late days, early outs.
    - Month calendar heatmap: the full month always shows, future days are faded, today is outlined.
    - "In → out" span chart per day: blue for a full shift (≥ 8h30), amber for a short day or no check-out, a rose dot for absent.
- Backup: `scratchpad/attendance-before/AdminAttendance.tsx`.

### Onboarding progress tracking + onboarding videos bucket (2026-10-27)
- **Migration (to run in the Supabase SQL Editor):** `supabase/migrations/20261027120000_onboarding_progress_tracking.sql`. It creates:
  - Bucket `onboarding-videos`: private, mp4/mov/webm, 500 MB per file.
  - `onboarding_steps`: 7 sections (06 and 07 inactive) plus 16 guide videos. `video_path` holds the path inside the bucket.
  - `onboarding_progress`: one row per (employee, step), with first/last opened, open_count, watched_seconds, duration, max watched_pct, and completed_at.
  - RPC `onboarding_record_progress`: the only write path. It keeps the highest %, never un-completes, and a video counts as completed at 90% watched.
  - View `onboarding_employee_summary`: pending / in_progress / completed, plus section %, video % and overall %.
  - RLS is on with no policies, so only the server (service role) can access these.
- **Employee side** (`app/other-modules/onboarding/`):
  - `api/progress` GET/POST: own rows only; the employee id comes from the session.
  - `api/video/[guide]`: returns a 1-hour signed URL from `video_path`, falling back to the local `videos/` folder.
  - `_shell/useOnboardingProgress.js`: "Mark as read" now also saves to the database, opening a section logs an "open", and ticks already saved in the browser are copied to the database once.
  - `VideoSlot`: loads the signed URL and saves the seconds actually played every 15s, plus on pause, on end and when the tab is hidden.
  - Without the migration, everything still works and nothing is saved (`tracking: false`).
- **HR admin:**
  - New sidebar item "Onboarding Progress" (`admin-onboarding-progress`) → `views/admin/onboarding-tracker/OnboardingTracker.tsx`.
  - API: `GET /HRM/api/admin/onboarding-progress` (HR admin only). It excludes separated employees and sorts by joining date, newest first.
  - The page shows KPIs (employees / pending / in progress / completed / average %), status filter, search, and one row per employee: status, overall %, section and video strips, last activity.
  - Expanding a row shows each section (read / opened / pending) and each video (watched %, time watched / length).
  - Before the migration is run, the page shows a "run the migration" notice.
- Video linking: after upload, set `onboarding_steps.video_path` (see `_sections/05-tools-systems/videos/README.md`).
- Backups: `scratchpad/onboarding-before-tracking/`, `scratchpad/hr-sidebar-before-tracker/`.
- **Videos linked (2026-10-27):** 15 compressed videos (each under 50 MB, so the spend cap stays on) are in the `onboarding-videos` bucket under `universe-one/hrms/` and `universe-one/task-manager/`.
  - `onboarding_steps.video_path` is set for all 15. The mapping is in `scratchpad/linkvideos.mjs`.
  - `video:tm-tickets` (Task Manager · Task tickets) has no video yet and still shows "Video coming soon".
  - Every signed link was verified to serve `video/mp4` with HTTP 206, and Check in plays in the guide at 1920×1080.
  - The migration file's bucket limit now matches 50 MB.
- **Task tickets removed (2026-10-27):** it's covered by HRMS "Raise a ticket".
  - The guide was removed from `05-tools-systems/content.js`, so Task Manager now has 8 guides.
  - The `video:tm-tickets` row was deleted from `onboarding_steps` (it had no progress rows).
  - The migration seed no longer includes it and now contains a `delete` for it, so 15 videos count.
- **Employee Tracker** (HR sidebar sub-item under Onboarding Progress, tab `admin-onboarding-employee`): `views/admin/onboarding-tracker/EmployeeTracker.tsx`.
  - **Left:** an employee picker (search, newest joiners first, status dot and % bar).
  - **Profile card:** overall % ring, sections read, videos completed, % of video content watched, a pending banner that lists the unread sections, time watched, first opened, last activity and completed on.
  - **"Onboarding journey" stepper:** each section shows read / opened / not opened with open count and dates. Each section lists its videos grouped by module (completed / % watched / not watched, time watched / length, plays, first and last played, completed at).
  - **Activity timeline:** opened, read, started and finished events.
  - The overview's expanded row has a "Full tracking" link into it. `AdminApp` keeps the selected employee in `onboardingEmployeeId`.
  - The sidebar supports `sub: true` items (indented with a guide line).
  - The API now also returns `sectionId`, `lastOpenedAt`, `openedAt` and `playCount`.
- Verified with live data: 34 employees. One employee already has 4/5 sections read, which were migrated from browser ticks.
- **Guide ticks now persist (2026-10-27):** in `05-tools-systems/components/ModuleGuides.jsx`, the green tick now means "video watched" (≥ 90%). It used to mean "opened this visit" and was lost on refresh.
  - Ticks come from `onboarding_progress` through `useOnboardingProgress` → `videoProgress` in the nav context, so they survive refresh and follow the employee to other devices.
  - A started video shows "x% watched", and the header shows "N guides · X completed".
  - While a video plays, the % updates live, using the same 90% rule as the database and never going down.
  - Backup: `scratchpad/onboarding-before-video-ticks/`.

