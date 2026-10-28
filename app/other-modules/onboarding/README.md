# Onboarding module

Everything for the employee Onboarding module lives in this folder. There is no HR access control yet. "Mark as read" is saved per user in the browser (localStorage `ob-read:<user id>`), not on the server.

The page is at `/other-modules/onboarding` (login required).

```
onboarding/
├── page.jsx                     Route entry. Loads the styles and renders the shell.
├── onboarding-styles.css        All module styles (scoped under .ob): colours, cards, fonts.
│
├── _shell/                      The frame around every section
│   ├── OnboardingShell.jsx      Picks the active section, animates between sections, keeps the read marks.
│   ├── navContext.js            Shared context: active section, select(), user, readIds, markRead().
│   ├── SectionMenu.jsx          Three-dot menu (top left): all sections, read ones in green + progress.
│   └── ComingSoon.jsx           Shown for sections that are not built yet.
│
├── _shared/
│   ├── ui.jsx                   Reusable pieces: Glass card, Reveal/scroll animations,
│   │                            SplitHeading, Counter, Icon, Eyebrow.
│   ├── ChapterHead.jsx          Chapter heading: title left, outlined number right.
│   └── SectionEnd.jsx           End-of-section card: "Mark as read" (one-way, never automatic) + "Continue to …".
│
├── _sections/                   One folder per onboarding section
│   ├── index.js                 THE SECTION LIST: order, titles, icons, which are available.
│   │
│   ├── 01-about-company/
│   │   ├── AboutCompany.jsx     Entry point: puts the chapters below in order.
│   │   ├── content.js           All text and data for this section (edit wording here).
│   │   ├── assets/              Images used by this section.
│   │   └── components/          One file per part of the page:
│   │       ├── Hero.jsx             "Welcome to BNC Global Consultech." + KPI cards
│   │       ├── HeroBackdrop.jsx     light grid / rings behind the hero
│   │       ├── Overview.jsx         Chapter 01 · Overview + At a glance
│   │       ├── WhoWeAre.jsx         Chapter 02
│   │       ├── Leadership.jsx       Chapter 03
│   │       ├── WhatWeDo.jsx         Chapter 04 (practice tabs)
│   │       ├── Brands.jsx           Chapter 05
│   │       ├── Partners.jsx         Chapter 06
│   │       ├── Offices.jsx          Chapter 07
│   │       └── Websites.jsx         Chapter 08
│   │
│   ├── 02-about-founders/
│   │   ├── AboutFounders.jsx    Entry point: shows ./site full screen in an iframe; the site's last section has
│   │                            "Mark as read" + "Continue", which talk to this page via postMessage.
│   │   └── site/                The founders website, kept as-is:
│   │       ├── index.html       All of its HTML, CSS and JS (edit content here).
│   │       ├── assets/          Its images (founder photos, logos).
│   │       └── vendor/          Its libraries (three.js, GSAP, ScrollTrigger, Lenis, globe data).
│   │
│   └── 03-our-team/
│       ├── OurTeam.jsx          Entry point: loads the team once and renders the parts below.
│       ├── content.js           Fixed text (headings, intros). People come live from HRM.
│       ├── useTeamMembers.js    Fetches /other-modules/onboarding/api/team; groups by department.
│       └── components/
│           ├── TeamHero.jsx         Centred heading + photo ring + highlights
│           ├── CurvedCarousel.jsx   3D curved photo ring, auto-scrolls left → right
│           ├── TeamHighlights.jsx   Three columns: people, departments, offices
│           ├── Departments.jsx      Department cards with faces
│           ├── TeamDirectory.jsx    Everyone, with department filter + search
│           ├── Avatar.jsx           Photo with initials fallback
│           └── richTitle.jsx        Turns content.js titles into JSX
│   │
│   └── 04-role-team/
│       ├── RoleTeam.jsx         Entry point: loads the signed-in employee once (loading / error states).
│       ├── content.js           Fixed text, document list, module list.
│       ├── useMyProfile.js      Fetches /other-modules/onboarding/api/me.
│       ├── format.js            Date, tenure, money and file-size helpers.
│       └── components/
│           ├── RoleHero.jsx         Heading + 4 stats + layered employee ID card
│           ├── ReportingLine.jsx    Reporting line: your manager → you → people who report to you
│           ├── RoleDetails.jsx      Employment, probation, working week, experience, pay (hidden), module access
│           ├── AboutYou.jsx         Contact card + personal facts
│           └── Documents.jsx        Required-docs ring + one tile per document (open / upload in HRM)
│   │
│   └── 05-tools-systems/
│       ├── ToolsSystems.jsx     Entry point: platform picker → module tabs → guides; "coming soon" for the rest.
│       ├── content.js           ALL guide text: platforms, modules, the 7 HRMS guides (steps, form, tips, video file).
│       ├── videos/              Drop the how-to MP4s here (names in videos/README.md); they play automatically.
│       └── components/
│           ├── ToolsHero.jsx        Heading + one card per platform
│           ├── ModuleGuides.jsx     Guide list (left / strip on phones) + the open guide
│           ├── GuideViewer.jsx      One guide: where to find it, video, steps, form, what happens next, tips
│           └── VideoSlot.jsx        Plays videos/<file> if present, else a "Video coming soon" placeholder
│
├── tools-videos/[file]/route.js Serves 05-tools-systems/videos/<file> (with seeking); HEAD tells the page if it exists.
│
├── api/me/route.js              GET: the signed-in employee's own profile, manager, direct reports and
│                                documents. Data is built in api/me/load.js.
│
├── api/team/route.js            GET: current employees for Section 03 (name, designation, department,
│                                profile photo URL from Supabase Storage bucket `employee-avatars`).
│                                Login required; returns no email/phone.
│
└── founders-site/[...file]/route.js
                                 Serves files from _sections/02-about-founders/site/ at
                                 /other-modules/onboarding/founders-site/<file>.
```

Folders that start with `_` are private to Next.js. They are never turned into URLs; they only organise the code.

## Common tasks

- **Change Section 01 text:** edit `_sections/01-about-company/content.js`.
- **Change a part of Section 01's layout:** open the matching file in `_sections/01-about-company/components/`.
- **Add a how-to video:** put the MP4 in `_sections/05-tools-systems/videos/` with the file name listed in `videos/README.md`. No code change.
- **Add or edit a guide:** edit `_sections/05-tools-systems/content.js` (set `ready: true` and `guides` on a module to publish it).
- **Change Section 03 text:** edit `_sections/03-our-team/content.js`. Photos update automatically when employees change their HRM profile picture.
- **Change Section 02 (founders):** edit `_sections/02-about-founders/site/index.html`.
- **Add a new section:**
  1. Create `_sections/03-your-section/` with an entry component, e.g. `YourSection.jsx`, plus its own `components/`, `content.js` and `assets/` as needed.
  2. In `_sections/index.js`, import it and set `available: true` and `component: YourSection` on its entry.
  3. Leave room at the top left for the fixed three-dot menu.
- **Change colours or card styles:** edit `onboarding-styles.css`. Cards are plain white; small cards use `<Glass tint>` for the light blue fill.

The launcher card that opens this module is in `app/components-homepage/OthersSection.jsx` (entry `id: 'onboarding'`).
