# How to add anything to the site — without writing code

Everything on the site lives in the **`data/`** folder. Pages are built from those files automatically.
To add a case, a video or a certificate, **copy an existing entry in the right file and change its values** — you never touch a component.

> Want an AI to do it for you? Open **`AI-PROMPT.md`**, copy the prompt, and write at the end what you want to add.

---

## The steps you repeat every time

```bash
npm run dev            # open http://localhost:3000 and check your change
npm run check:data     # checks ids, dates and the links between data files
npm run verify         # the full check (the same one GitHub runs before deploying)
git add -A && git commit -m "Add …" && git push    # deploy → the site updates in ~5 minutes
```

If `npm run verify` passes on your machine, it passes on GitHub. If it fails, the message names the file and the line.

---

## 1) A new case (blog)

**Files:** images and the PDF in `public/Assets/Cases/<Folder>/` — the data in `data/cases.ts`.

1. Put the case's files in a new folder:
   - the PDF (if there is one)
   - screenshots named exactly `Screenshot (1).webp`, `Screenshot (2).webp` … (convert them to WebP first)
   - an optional cover image (`1.webp`)
2. In `data/cases.ts`, copy the first entry of `caseEvidenceLibrary`, paste it **at the top** (newest first), and change:

| Field | What goes in it |
|---|---|
| `id` | the page address: lowercase with hyphens, e.g. `phishing-email-analysis` → `/blog/phishing-email-analysis` |
| `title` | the title |
| `description` | plain sentences: what happened, what you did, the outcome |
| `platform` | `TryHackMe` / `LetsDefend` / `CyberDefenders` / `INE (eCIR)` … |
| `type` | `PDF Report` for an investigation with a report, `Walkthrough` for a lab, `Project Report` for a project |
| `category` | `Digital Forensics` / `Malware Analysis` / `SOC Analysis` … (copy from a similar case) |
| `difficulty` | `Easy` / `Medium` / `Hard` |
| `href` | the PDF path without `public/` — delete the line if there is no PDF |
| `tags`, `tools`, `skillsGained` | lists of words |
| `readTime` | minutes to read |
| `date` | `YYYY-MM-DD` |
| `image` | the cover image (optional) |

3. Screenshots: in the same file, in `caseScreenshotsByEvidenceId`, add a line:
   ```ts
   "phishing-email-analysis": buildScreenshotRange("Folder name", 1, 14),
   ```
   (screenshots 1 to 14)
4. **Optional, but worth it:**
   - `data/case-details.ts` → verdict, severity, timeline, IOCs, detection rules — same id
   - `data/attack.ts` → the MITRE ATT&CK techniques **the report itself shows**: `"phishing-email-analysis": ["T1566.001", "T1204.002"],`
   - for a room / lab: `answers` in the same `data/case-details.ts` entry — every question with its answer, `{ task: "Task 3 · File Hash Lookup", q: "…", a: "…" }`; the case page lists them under **What I did**
5. Run:
   ```bash
   npm run thumbs      # small images for the cards
   npm run og:cases    # the case's share image
   npm run check:data
   ```

---

## 2) A new video

**Nothing to do — it is added by itself.** Every morning (05:17 Cairo) GitHub Actions reads the channel's feed, adds any new upload to `data/youtube-feed.ts` (commit "videos: add new uploads from YouTube") and deploys. The video gets its card, its page `/videos/<slug>` and its sitemap entry with the title, description and hashtags from YouTube (the Arabic parts of the title are dropped; the site is in English). To get it sooner: Actions → **Deploy to Pages** → **Run workflow**. The channel's numbers (videos, subscribers, views) update by themselves too — see **What updates by itself** below.

**To make its page better** (your own description, tags, a `caseId`, the "What the video covers" points): write it up in `data/youtube.ts` → `MANUAL_VIDEOS` with the same `videoId` — it then replaces the automatic one. Keep the **title as it shows on the site**, so its page address stays the same. A video that should not be on the site: put its `videoId` in `HIDDEN_VIDEOS` in the same file.

**File:** `data/youtube.ts` → `MANUAL_VIDEOS`. Copy an entry and change:

| Field | What goes in it |
|---|---|
| `videoId` | the part after `watch?v=` or after `youtu.be/` — e.g. `d2eWKWp6cnQ` |
| `title` | the video's title (its page address is made from it: `/videos/<title>`) |
| `description` | 2–4 sentences |
| `publishedAt` | `YYYY-MM-DD` |
| `tags` | the topics |
| `caseId` | optional: the id of the case the video explains — it then shows on that case's page and the two link to each other |

That's it — the video's page, its card on the blog and on `/videos`, and its sitemap entry are made automatically.
**After deploying:** Search Console → URL Inspection → the video page's address → Request indexing.

**A new playlist:** nothing to do — it appears by itself the next morning, with its real size. To give it your own description and tags, add it to `MANUAL_PLAYLISTS` in the same file (`playlistId` is the part after `list=`; even a wrong id is corrected by matching the title).

---

## 3) A new certificate — or a new photo

Certificates and personal photos live in **two separate folders** and two separate data files.

**A certificate** (its own page appears at `/certificates/<slug>`):

1. Pick a slug: lowercase words with dashes, e.g. `comptia-security-plus`. Save the scan as `public/Assets/certificates/<slug>.webp`.
2. In `data/certificates.ts`, copy an entry and change: `slug`, `title` (as printed), `issuer`, `kind`, `group` (`certifications` if you passed an exam, `courses`, `education`, `exams`, `badges`), `date` (`"2026-02-15"`), and whatever the document prints: `period`, `hours`, `score`, `credentialId`, `instructor`, `nameOnDocument`, **`verifyUrl`** (a Verify button appears). Then `summary` (one line), `description` (the full explanation) and `covers` (topics).
3. If it is a professional (exam) certification, also add it to `certifications` in `data/certifications.ts` with `certificate: "<slug>"` (those are counted on the home page).

**A personal photo** (the gallery, `/gallery#<slug>`):

1. Save it as `public/Assets/gallery/<slug>.webp`.
2. In `data/gallery-photos.ts`, copy an entry: `slug`, `title`, `description`, `category` (`athletics`, `teaching`, `community`, `internship`, `university`), `event`, and `date`, `place`, `source` (for a screenshot of an official post: who posted it and when) when known.

**Then** nothing else by hand: on the next deploy GitHub Actions makes the small `-thumb.webp` (`npm run thumbs`) and writes the title, description, keywords, date, place and copyright **into the image file itself** (`npm run images:tag`, ExifTool). To do it on your own machine: `npm run thumbs && npm run images:tag`.

---

## 4) A new job or teaching role

- **Job, internship or volunteering:** `data/experience.ts` — copy a `{ … }` and change `tag` (the title), `kind` (`work` / `volunteer` / `education`), `subTag` (the organisation), `desc` (points separated by ` • `), `startDate`, and `endDate` (delete it if you still work there).
- **A place you taught:** `data/teaching.ts` → `TEACHING_ROLES`, **and also** `data/teaching-ar.ts` (the same entry for the `/ar/teaching` page).
- **The organisation's logo:** `data/logos.ts`.

---

## 5) Everything else

| To add | File |
|---|---|
| A project | `data/portfolio-data.ts` → `work` |
| The note that explains each page (bottom corner, once per page) | `data/page-guides.ts` — change its `id` to show an edited note again |
| Sports ("Off the Clock." on the home page) | `data/about.ts` → `ATHLETICS` |
| The loader's timing (full on the first page, short after) | `DURATION` / `QUICK` / `READY_WAIT` in `components/layout/AppLoader.tsx` |
| A role card ("What I Do." on the home page) | `components/home/ServicesSection.tsx` → `ROLES` (its `service:` picks the e-mail subject) |
| A service (the e-mail subject, and the list Google reads) | `data/services.ts` — then point a role card at it with `service: "<id>"` |
| A student note / recommendation | `data/testimonials.ts` — **copy it word for word**; Arabic ones get `lang: "ar"` |
| A detection rule | `data/detection-rules.ts` |
| A training platform | `data/platforms.ts` |
| Numbers / your details / links | `data/profile.ts` and `data/live-copy.ts` |
| LinkedIn followers | `linkedinFollowers` in `AUDIENCE`, `lib/shared.ts` — the only number written by hand (LinkedIn has no public way to read it). The stats, the CV line, the footer chips, every page's description and the JSON-LD (Google) update from it |
| A new GitHub repository | **nothing** — every public repo shows under "More on GitHub" (below the projects) the morning after you make it. To make it a full project card: add it to `work` in `data/portfolio-data.ts`. To keep one off the site: its name in `HIDDEN_REPOS` (same file). Forks, archived repos, the profile README and the github.io site are never listed |
| A new profile (like Wuzzuf or LinkedIn) | its link in `data/profile.ts` → `contact`, then the icon lists in `components/layout/ContactFooter.tsx` and `components/home/HeroSection.tsx`, and `SAME_AS` in `lib/seo.ts` (tells Google it is the same person) |
| The CV | **only** replace `public/Assets/cv/AhmedEmadNasr_CV.pdf` (same name) and push — the site follows it by itself (see *What updates by itself*) |
| A tool page (`/projects/<id>`) — what it does, how to run it, screenshots | `data/tools.ts` (the `id` must match the project in `data/portfolio-data.ts`); screenshots go in `public/Assets/projects/<id>/` as `.webp` — its share card: add a `tool-<id>` entry to `PAGES` in `scripts/og/generate-case-og.mjs`, then `npm run og:cases` |
| A platform write-ups page (`/writeups/<platform>`) | `lib/collections.ts` → `PLATFORM_PAGES` (`platform` = the exact text the cases use) |
| The training pages (`/training` and `/ar/training`) | the words of both in `data/training.ts` (English and Arabic — change both); the diploma comes from `data/teaching.ts` / `data/teaching-ar.ts` |
| The words of the gallery pages (`/gallery` and `/ar/gallery`) | `data/gallery-copy.ts` (English and Arabic — change both); the certificates themselves stay in `data/certifications.ts` |
| The written part of a video page — "What the video covers" and "Key terms" | `data/video-notes.ts` (`VIDEO_NOTES` by videoId, `GLOSSARY` by tag) |
| A brand logo or icon | its drawing in `data/logo-paths.ts` (or `components/ui/icon-data.ts`) — every icon is served from one cached file, `/icons.svg` |

**Pages that fill themselves:** `/attack/<T-id>` (one per ATT&CK technique) and `/writeups/<platform>` list the cases automatically. Map a new case in `data/attack.ts` and give it the right `platform`, and it appears on those pages on the next build — nothing else to do.

---

## What updates by itself

Every morning (05:17 Cairo) GitHub Actions (`.github/workflows/nextjs.yml`) refreshes these, commits the data back and deploys — nothing to do:

| What | Where it comes from | Written to |
|---|---|---|
| New YouTube uploads (card, page, sitemap) | the channel's feed — `scripts/sync-youtube.mjs` | `data/youtube-feed.ts` |
| YouTube subscribers, total views, upload count | YouTube — `scripts/sync-stats.mjs` | `data/live-stats.ts` |
| Playlists: size, real id, new playlists | YouTube — `scripts/sync-stats.mjs` | `data/live-stats.ts` |
| TryHackMe rank, rooms, badges | TryHackMe at build time; the saved fallback by `scripts/sync-stats.mjs` | `data/live-stats.ts` |
| GitHub stars, new repos, contribution graph | the GitHub API at build time | — |
| Share cards that show numbers | `npm run og:cases` in the deploy | the deployed site |
| The CV: the `/cv` page, new jobs and end dates on the home Experience, phone / e-mail / WhatsApp, the PDF's title & keywords | the CV PDF, read when it changes — `scripts/sync-cv.mjs` | `data/cv-from-pdf.ts` |
| New Credly badges (picture, issuer, date, skills, verify link) — each gets its own `/certificates/<slug>` page | your public Credly profile (`credly.com/users/ahmed-emad-nasr`) — `scripts/sync-credly.mjs`; a badge already on the site is never added twice | `data/credly-badges.ts`, `public/Assets/certificates/credly-*.webp` |
| Image details written into every certificate / photo file | `data/certificates.ts`, `data/gallery-photos.ts` — `scripts/tag-images.mjs` | the image files |
| The kanji font: re-cut when a page shows a new kanji | the built pages — `scripts/kanji-font.mjs` (then one more build, and the new font is committed) | `app/fonts/yuji-site-*.woff2` |
| The footer's "Updated <date>" | the day of the build | — |
| The national-service note (contact section + footer), on only between its dates | `data/status.ts` — change the dates there | — |
| Years at Al Ahly, the © year | counted at every build (`AHLY_SINCE` in `data/about.ts`) | — |
| security.txt "Expires" date | every build | — |
| Package updates | Dependabot every Monday; minor/patch updates that pass the checks merge and deploy by themselves (`.github/workflows/dependabot-auto-merge.yml`); major versions wait for you | — |

**Official YouTube numbers (optional, recommended):** create a free *YouTube Data API v3* key (Google Cloud Console → APIs & Services → enable "YouTube Data API v3" → Credentials → Create API key), then in GitHub: **Settings → Secrets and variables → Actions → New repository secret**, name `YOUTUBE_API_KEY`. Without it the numbers are read from the channel's public pages, which works but can break if YouTube changes its page — then the last numbers simply stay.

**When the CV can't be read:** a section the script can't read with confidence keeps its last good version, and the deploy opens a GitHub issue **"CV sync needs a look"** (GitHub e-mails you) saying which section and why. If even the Experience section can't be read, nothing at all is changed. A job that is in the CV but not yet in `data/experience.ts` appears on the home page with the CV's bullet points; to give it a logo, a website and an intro line, add it to `data/experience.ts` / `ROLE_INTRO` as usual — the CV keeps its dates in step.

After each deploy the changed pages are sent to Bing & co. through **IndexNow** (`scripts/indexnow.mjs`, free, no account) — Google reads the sitemap instead.

Every week a dated copy of the main pages and the CV PDF is saved on the **Wayback Machine** (`scripts/archive.mjs`) — at `https://web.archive.org/web/*/ahmed-emad-nasr.github.io/ahmed.dev*`, readable even if GitHub Pages is ever down.

**The schedules never fall asleep:** GitHub stops the scheduled runs of a repo with no activity for 60 days. The `keepalive` job (in `nextjs.yml` daily and `site-health.yml` weekly) re-enables every scheduled workflow through GitHub's API, which resets that count — no dummy commits.

**Accessibility:** every pull request (Dependabot's too) runs `npm run check:a11y` (axe-core, WCAG 2.2 AA, phone + desktop, dark + light) — an update that breaks accessibility is not merged by itself.

**When something breaks you get an e-mail** (a GitHub issue; one at a time, and it closes by itself once things work again). This needs **Issues turned on**: repository **Settings → General → Features → Issues** ✓. With Issues off nothing breaks: a failed deploy still sends GitHub's own "Run failed" e-mail, and the weekly checks (live site, links) fail their run on purpose so that e-mail reaches you, with the report in the run's summary — only the CV note stays a warning in the deploy log.

| Issue | Opened by | When |
|---|---|---|
| "The daily deploy failed" | `nextjs.yml` (the `alert` job) | a check, the build or the deploy failed — the live site keeps its last good version |
| "CV sync needs a look" | `nextjs.yml` | the new CV PDF could not be read with confidence |
| "The live site needs a look" | `.github/workflows/site-health.yml`, every Monday | a page or image on the LIVE site does not open, the CV PDF is missing, the last deploy is over 3 days old, YouTube / TryHackMe numbers have not been read for a week (an expired `YOUTUBE_API_KEY`, for example), or a Lighthouse score fell under its floor (`scripts/check-speed.mjs` — the issue names what costs the points) |
| "Broken external links" | `links.yml`, every Monday | a link to another site is dead |

Run any of it by hand: `npm run videos:sync`, `npm run stats:sync`, `npm run cv:sync` (`-- --force` to read the same CV again), `npm run credly:sync`, `npm run fonts:kanji` (after a build), `npm run health:live`, `npm run health:speed`, `npm run archive`, `npm run check:a11y` (after a build).

## If something fails

- **`check:data` says an id does not exist** → the id you wrote in `case-details` / `attack` / `youtube` does not match the one in `cases.ts`.
- **`technique Txxxx is not in TECHNIQUES`** → add the parent technique to `TECHNIQUES` in `data/attack.ts` (the top of that file explains how).
- **An image does not show** → the file name or path is wrong (upper/lower case and spaces matter) — `npm run check:assets` names it.
- **A yellow "over 300 KB" warning on the GitHub Actions run** → that image is heavy for phones; convert it with the WebP tool (quality ~80) or resize it to ~1600 px wide. `npm run check:images` lists them. It never blocks the deploy.
- **After adding or removing Japanese text** → update the site's small font cut, or the new characters cost extra font downloads (they still show, in the same brush): `npm run build`, then `python3 scripts/subset-yuji-site.py <YujiSyuku_400Regular.ttf>` (steps at the top of that file), then build again.
- **The GitHub Action is red** → open it; the red step shows the line with the problem.
