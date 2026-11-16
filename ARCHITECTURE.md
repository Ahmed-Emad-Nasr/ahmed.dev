# Architecture

A static Next.js 16 export (`output: "export"`) served by GitHub Pages under
`/ahmed.dev`. One page (`/`) holds the whole portfolio — the blog (`#blog`)
and the gallery (`#gallery`) are its last parts — plus one static page per
case (`/blog/<id>`).
Everything is built at build time; there is no server.

## Folders

| Folder | Rule |
|---|---|
| `app/` | Routes only. Pages are Server Components that read `data/` and pass finished values down. |
| `components/layout/` | Mounted on every page (from `app/layout.tsx` or `PageShell.tsx`, the frame of every page except home). |
| `components/ui/` | Small shared building blocks; `kit.tsx` holds the shared class strings (strings and tiny markup only — nothing with behaviour, so borrowing a class never drags a navbar into a section's chunk). |
| `components/home/`, `components/blog/`, `components/gallery/` | One file per section. Each folder has a `dynamic.tsx` (the code-splitting list); all of them are arranged by `app/page.tsx`. |
| `data/` | Content only. `cases.ts`, `case-details.ts` and `attack.ts` are large — keep them out of client components (see below). |
| `lib/` | Helpers with no UI: URLs (`site.ts`), JSON-LD (`seo.ts`), paths and case kinds (`shared.ts`), the old-page forwarding (`routes.ts`), scrolling (`scroll.ts`). |
| `lib/perf/` | Everything that decides *when* work happens. |

## Server and client

Server Components ship no JavaScript, so pages and text sections stay on the
server. A client component pulls everything it imports into the browser, so:

- client components never import `data/cases.ts`, `data/case-details.ts` or
  `data/attack.ts` — the page computes what they need (`data/live-copy.ts`,
  `lib/library-data.ts`) at build time and passes it as props
  (`AttackCoverage coverage={attackCoverage}`) or, when it is large,
  writes it to a static JSON file the section fetches together with its
  code (`app/library.json/route.ts` → `CaseLibrary` in
  `components/blog/dynamic.tsx` — ~100 KB the home HTML no longer carries). Client files may only
  `import type` from `lib/library-data.ts`: a value import would bundle every
  case file, IOC and timeline into the browser. The one exception is the
  hidden terminal, a chunk that loads only when someone opens it;
- `data/portfolio-data.ts` is read by client sections, so it must stay free
  of those imports too;
- `data/profile.ts` (name, roles, contact) is the only content in the first
  download: the hero, footer bar, palette and terminal import `PROFILE` from
  it, never `PORTFOLIO_DATA` — that object carries every project and job, and
  loads later with the sections that show them. The hero's project count and
  language codes arrive as props from `app/page.tsx` for the same reason.

Libraries that are not needed to paint stay out of the first download too:
`focus-trap` (fetched in idle time / when a dialog opens —
`lib/use-focus-trap.ts`), the
lightbox, the command palette and the terminal.

## How a page loads

1. **In the HTML:** everything — the navbar, the intro loader, every section
   of the home page (as on Sensei-Dev), the case pages' content, and each
   page's metadata / JSON-LD. Only the case library's cards are filled in by
   the browser, from `/library.json`, right after load (a skeleton holds
   `#cases` until then).
2. **Split per section:** every section is its own JavaScript chunk —
   `next/dynamic` imports in `components/home/dynamic.tsx`,
   `components/blog/dynamic.tsx` and `components/gallery/dynamic.tsx`.
   (`next/dynamic` only code-splits when called from a Client Component,
   which is why those files exist.) Global visual effects that are not needed
   for first paint are deferred by `components/layout/DeferredGlobalEffects.tsx`
   until the browser is idle.
3. **Ahead of time, only what is opened on demand:** the command palette,
   shortcuts help and lightboxes are `preloadable()` (`lib/perf/lazy.tsx`):
   their code downloads in idle time so they open at once. A case page is
   fetched only when the visitor reaches for its card (mouse over, touch,
   keyboard focus — `components/blog/CaseCard.tsx`), not all 82 on every
   visit.
4. **Idle queue:** all background work goes through `whenIdle()` in
   `lib/perf/schedule.ts` — one task at a time, only after load, in idle time,
   and never while the reader is scrolling.
5. **Off-screen animations pause:** `lib/perf/OffscreenAnimations.tsx` tags
   infinite CSS loops when they start and pauses them (via `data-offscreen`)
   while their section is off screen; framer-motion loops are paused through
   the Animation API.

Links to other pages are plain `next/link` with `prefetch={false}`: nothing
is downloaded until a link is clicked.

## Jumps

Every in-page jump (nav, palette, `g` shortcuts, `#hash` arrivals, filtered
library links) goes through `scrollToHash()` in `lib/perf/jump.ts`: it jumps
**instantly** under the fixed header (every section is already in the page). For a few seconds after, it corrects
the position if late images move the target — unless the reader has
scrolled. `lib/routes.ts` knows which page each section id lives on.

## Motion

- Scrolling: native browser scrolling, with instant in-page jumps handled by
  `lib/scroll.ts`; `lockScroll()` there holds the page still behind the
  dialogs.
- Smooth while scrolling: above a certain speed an invisible sheet
  (`.scroll-shield`, `lib/perf/ScrollShield.tsx`) sits between the cursor and
  the content, so cards sliding under a still cursor do not each start a
  hover (measured: half the work of a scrolled frame). It lifts as soon as
  the scroll slows.
- Intro: `components/layout/AppLoader.tsx` (home page only, about 2 s, once per
  visit — sessionStorage + an inline script, `lib/intro.ts`). Its
  bar is a compositor animation, so it stays smooth while the page wakes up
  underneath. Entrances wait for it through `lib/intro.ts`, and the idle
  queue starts early under it (`lib/perf/schedule.ts`) so the sections are
  ready when it lifts.
- Card hover: `SpotlightHost` writes the glow position once per frame;
  `--mx` / `--my` are registered as non-inherited so a mouse move restyles
  the glow layer only, not the whole card. Card geometry is cached (`rectOf`
  in `components/ui/Motion.tsx`).
- ATT&CK tiles fill with their heat once, on arrival
  (`components/blog/HeatReveal.tsx`) — not on every scrolled frame.
- Calmness dials: `CALM` and the duration factor in `components/ui/FadeIn.tsx`,
  `MOTION_ENTER_DURATION` / `MOTION_STAGGER_STEP` in `lib/motion.ts`.
- Entrances: `components/ui/FadeIn.tsx` (framer-motion, opacity + transform
  only, staggered top to bottom). framer-motion loads lazily
  (`LazyMotion` + `m`).
- Hero entrance: GSAP (`gsap.from` in `components/home/HeroSection.tsx`),
  the same code as Sensei-Dev's hero; it waits for the intro screen to lift.
- No `backdrop-filter` except on the navbar: it is re-computed every
  scrolled frame, and a translucent background looks the same.
- Section dividers drift with a CSS scroll timeline (framer fallback).
- Reduced motion is respected everywhere (`MotionConfig reducedMotion="user"`
  and the CSS rules at the end of `globals.css`).

## Fonts

`app/fonts.ts` loads Dela Gothic One, Outfit, JetBrains Mono, Noto Sans JP and
Yuji Syuku through `next/font/google` (self-hosted at build time, with
size-matched fallbacks). `app/fonts-yuji-site.css` adds a tiny Yuji Syuku cut
of exactly the characters the site uses, placed first in the Japanese stacks
so the brush text costs one small file. Regenerate it with
`scripts/subset-yuji-site.py` when new Japanese text is added.

## Offline

`public/sw.js` caches what the visitor has already loaded: pages, RSC
payloads and the site's JSON files network-first, hashed build files
cache-first, images stale-while-revalidate, all bounded. Registered after
load, production only, as `sw.js?v=<build id>` (`NEXT_PUBLIC_BUILD_ID` in
`next.config.mjs` — the commit on GitHub Actions): every deploy installs a
fresh worker that drops the old page cache by itself; nothing to bump.

## Security

A Content-Security-Policy `<meta>` (`lib/security.ts`; GitHub Pages cannot
send headers), strict referrer policy, no third-party scripts, and YouTube embeds load only after a click.

## Measurements

Headless Chrome, production build, scrolling the whole page (worst frame /
long-animation-frame total / layout shift):

| | Desktop | Desktop, 4× CPU | Phone, 4× CPU |
|---|---|---|---|
| One-page site (before) | 145 ms / 428 ms / 1.093 | 759 ms worst | — |
| Home (now) | 66 ms / 131 ms / 0.001 | 252 ms worst | 54 ms worst |

Checks that pass on every change: `npm run lint`, `type-check`, `check:data`,
`check:links`, `check:a11y` (0 violations) and `check:layout` (0 findings).

## Where to edit what

Every file starts with a comment saying what it is and how to change it.
The common edits:

| I want to change… | Edit |
|---|---|
| Name, title, roles (typing line), contact links, hero tagline/specs | `data/profile.ts` → `PROFILE` |
| Footer links | `components/layout/FooterBar.tsx` |
| Security contact / PGP key | `SECURITY.md` (steps), `data/profile.ts` → `contact.pgpFingerprint`, `app/.well-known/security.txt/route.ts` |
| The RSS feed | nothing — `app/blog/feed.xml/route.ts` follows `data/cases.ts` |
| The hero summary paragraph / the 4 numbers under the roles | `data/live-copy.ts` (`CV_SUMMARY`, `stats`) |
| The "roles I fit" cards | `components/home/RolesCards.tsx` → `ROLES` |
| A project card | `data/portfolio-data.ts` → `work` |
| A job / course in the experience timeline | `data/experience.ts` (+ `ROLE_INTRO` / `ROLE_PROOF` in `data/portfolio-data.ts`) |
| Teaching numbers, diploma modules | `data/teaching.ts` |
| Training platforms | `data/platforms.ts` |
| A case report | `data/cases.ts` (+ `data/case-details.ts`, `data/attack.ts`) — steps in the header of `data/cases.ts` |
| The figures at the top of a case ("By the numbers") | counted automatically — `lib/case-numbers.ts`; measured results go in `outcome` in `data/case-details.ts` |
| A video | `data/youtube.ts` |
| A Wazuh rule in the detection library | `data/detection-rules.ts` |
| A gallery photo / certificate | numbered image + `GALLERY_IMAGE_COUNT` / `ALL_GALLERY_CERTIFICATES` in `data/certifications.ts` |
| The CV | the PDF in `public/Assets/cv/` (`CV_PDF_HREF` in `lib/shared.ts`) |
| Navbar links | `components/layout/SiteNav.tsx` → `navItems` |
| Command palette entries | `components/layout/CommandPalette.tsx` → `commands` |
| Keyboard shortcuts / terminal commands | `components/layout/KeyboardShortcuts.tsx`, `components/layout/Terminal.tsx` |
| Colours, theme, global animations | `app/globals.css` (`:root` = light, `.dark` = dark) |
| Fonts | `app/fonts.ts` |
| Page titles / descriptions / share cards | `metadata` in each `app/**/page.tsx`; defaults in `app/layout.tsx` |
| Allow a new external site (image, embed, API) | `lib/security.ts` (Content-Security-Policy) |
| Add a new section | recipe in the header of `app/page.tsx` |
