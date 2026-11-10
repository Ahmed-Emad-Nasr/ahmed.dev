# Architecture

A static Next.js 16 export (`output: "export"`) served by GitHub Pages under
`/ahmed.dev`. Three primary pages (`/`, `/blog` and `/gallery`) plus one
static page per case.
Everything is built at build time; there is no server.

## Folders

| Folder | Rule |
|---|---|
| `app/` | Routes only. Pages are Server Components that read `data/` and pass finished values down. |
| `components/layout/` | Mounted on every page (from `app/layout.tsx` or `PageShell`). |
| `components/ui/` | Small shared building blocks; `kit.tsx` holds the shared class strings. |
| `components/home/`, `components/blog/`, `components/gallery/` | One file per section. Home and blog have a `dynamic.tsx`; the gallery is a page-owned interactive surface. |
| `data/` | Content only. `cases.ts`, `case-details.ts` and `attack.ts` are large — keep them out of client components (see below). |
| `lib/` | Helpers with no UI: URLs (`site.ts`), JSON-LD (`seo.ts`), paths and case kinds (`shared.ts`), section → page routing (`routes.ts`), scrolling (`scroll.ts`). |
| `lib/perf/` | Everything that decides *when* work happens. |

## Server and client

Server Components ship no JavaScript, so pages and text sections stay on the
server. A client component pulls everything it imports into the browser, so:

- client components never import `data/cases.ts`, `data/case-details.ts` or
  `data/attack.ts` — the page computes what they need (`data/live-copy.ts`,
  `lib/library-data.ts`) and passes it as props, or the section's own chunk
  imports the precomputed result;
- `data/portfolio-data.ts` is read by client sections, so it must stay free
  of those imports too.

## How a page loads

1. **In the HTML:** the navbar, the intro loader, the hero (home), the blog's
   intro, the case pages' content, and each page's metadata / JSON-LD.
2. **Split per section:** every section is its own JavaScript chunk —
   `next/dynamic` imports in `components/home/dynamic.tsx`,
   `components/blog/dynamic.tsx` and `components/gallery/dynamic.tsx`.
   (`next/dynamic` only code-splits when called from a Client Component,
   which is why those files exist.) Global visual effects that are not needed
   for first paint are deferred by `components/layout/DeferredGlobalEffects.tsx`
   until the browser is idle.
3. **Lazy:** every section after the hero on `/`, and every section of
   `/blog` and `/gallery`, is wrapped in `LazySection` (`lib/perf/lazy.tsx`):
   not in the HTML, a placeholder of the expected height (`.lazy-h-*` in
   `app/globals.css`) holds its place, and it mounts in idle time or when the
   reader gets within ~3 screens. A jump to its `#id` mounts it first.
   While a section's chunk downloads, `SectionSkeleton` shows (it carries
   `data-lazy-pending`, so jumps wait for it).
4. **Idle queue:** all background work goes through `whenIdle()` in
   `lib/perf/schedule.ts` — one task at a time, only after load, in idle time,
   and never while the reader is scrolling.
5. **Off-screen animations pause:** `lib/perf/OffscreenAnimations.tsx` tags
   infinite CSS loops when they start and pauses them (via `data-offscreen`)
   while their section is off screen; framer-motion loops are paused through
   the Animation API.

Links to other pages use `PageLink`, which prefetches on hover/focus/touch
instead of on sight.

## Jumps

Every in-page jump (nav, palette, `g` shortcuts, `#hash` arrivals, filtered
library links) goes through `scrollToHash()` in `lib/perf/jump.ts`: mount the
lazy sections above the target, measure deferred sections above it, then jump
**instantly** under the fixed header. For a few seconds after, it corrects
the position if late images move the target — unless the reader has
scrolled. `lib/routes.ts` knows which page each section id lives on.

## Motion

- Scrolling: native browser scrolling, with instant in-page jumps handled by
  `lib/scroll.ts`.
- Entrances: `components/ui/FadeIn.tsx` (framer-motion, opacity + transform
  only, staggered top to bottom). framer-motion loads lazily
  (`LazyMotion` + `m`).
- Hero entrance: GSAP, imported on demand.
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

`public/sw.js` caches what the visitor has already loaded: pages
network-first, hashed build files cache-first, images
stale-while-revalidate, all bounded. Registered after load, production only.

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
| Name, title, roles (typing line), contact links, hero tagline/specs | `data/portfolio-data.ts` → `PORTFOLIO_DATA.profile` |
| The hero summary paragraph / the 4 numbers under the roles | `data/cv.ts` (`CV_SUMMARY`), `data/live-copy.ts` (`stats`) |
| The "roles I fit" cards | `components/home/RolesCards.tsx` → `ROLES` |
| A project card | `data/portfolio-data.ts` → `work` |
| A job / course in the experience timeline and CV | `data/experience.ts` (+ `ROLE_INTRO` / `ROLE_PROOF` in `data/portfolio-data.ts`) |
| Teaching numbers, diploma modules | `data/teaching.ts` |
| Training platforms | `data/platforms.ts` |
| A case report | `data/cases.ts` (+ `data/case-details.ts`, `data/attack.ts`) — steps in the header of `data/cases.ts` |
| A video | `data/youtube.ts` |
| A Wazuh rule in the detection library | `data/detection-rules.ts` |
| A gallery photo / certificate | numbered image + `GALLERY_IMAGE_COUNT` / `ALL_GALLERY_CERTIFICATES` in `data/certifications.ts` |
| The CV page | `data/cv.ts`, `data/experience.ts`, `data/certifications.ts` |
| Navbar links | `components/layout/SiteNav.tsx` → `navItems` |
| Command palette entries | `components/layout/CommandPalette.tsx` → `commands` |
| Keyboard shortcuts / terminal commands | `components/layout/KeyboardShortcuts.tsx`, `components/layout/Terminal.tsx` |
| Colours, theme, global animations | `app/globals.css` (`:root` = light, `.dark` = dark) |
| Fonts | `app/fonts.ts` |
| Page titles / descriptions / share cards | `metadata` in each `app/**/page.tsx`; defaults in `app/layout.tsx` |
| Allow a new external site (image, embed, API) | `lib/security.ts` (Content-Security-Policy) |
| Add a new section | recipe in the header of `app/page.tsx` |
