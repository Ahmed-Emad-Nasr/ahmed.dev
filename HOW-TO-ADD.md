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

## 3) A new certificate

1. Put the certificate image in `public/Assets/art-gallery/Images/image_display_thumb/` with the next number (if the last one is `99.webp`, it is `100.webp`).
2. In `data/certifications.ts`:
   - raise `GALLERY_IMAGE_COUNT` by one.
   - in `ALL_GALLERY_CERTIFICATES`, copy an entry and change: `galleryIndex` (the image number), `title`, `issuer`, `kind`, `group` (`certifications` if you passed an exam, `courses` for a course, `badges`, `exams`, `education`), `summary`, and **`verifyUrl` if it has a verification link** — a Verify button appears.
   - if it is a professional (exam) certification, also add it to `certifications` above (those are the ones counted on the home page).

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
| Years at Al Ahly, the © year | counted at every build (`AHLY_SINCE` in `data/about.ts`) | — |
| security.txt "Expires" date | every build | — |
| Package updates | Dependabot every Monday; minor/patch updates that pass the checks merge and deploy by themselves (`.github/workflows/dependabot-auto-merge.yml`); major versions wait for you | — |

**Official YouTube numbers (optional, recommended):** create a free *YouTube Data API v3* key (Google Cloud Console → APIs & Services → enable "YouTube Data API v3" → Credentials → Create API key), then in GitHub: **Settings → Secrets and variables → Actions → New repository secret**, name `YOUTUBE_API_KEY`. Without it the numbers are read from the channel's public pages, which works but can break if YouTube changes its page — then the last numbers simply stay.

**When the CV can't be read:** a section the script can't read with confidence keeps its last good version, and the deploy opens a GitHub issue **"CV sync needs a look"** (GitHub e-mails you) saying which section and why. If even the Experience section can't be read, nothing at all is changed. A job that is in the CV but not yet in `data/experience.ts` appears on the home page with the CV's bullet points; to give it a logo, a website and an intro line, add it to `data/experience.ts` / `ROLE_INTRO` as usual — the CV keeps its dates in step.

Run any sync by hand: `npm run videos:sync`, `npm run stats:sync`, `npm run cv:sync` (`-- --force` to read the same CV again).

## If something fails

- **`check:data` says an id does not exist** → the id you wrote in `case-details` / `attack` / `youtube` does not match the one in `cases.ts`.
- **`technique Txxxx is not in TECHNIQUES`** → add the parent technique to `TECHNIQUES` in `data/attack.ts` (the top of that file explains how).
- **An image does not show** → the file name or path is wrong (upper/lower case and spaces matter) — `npm run check:assets` names it.
- **A yellow "over 300 KB" warning on the GitHub Actions run** → that image is heavy for phones; convert it with the WebP tool (quality ~80) or resize it to ~1600 px wide. `npm run check:images` lists them. It never blocks the deploy.
- **After adding or removing Japanese text** → update the site's small font cut, or the new characters cost extra font downloads (they still show, in the same brush): `npm run build`, then `python3 scripts/subset-yuji-site.py <YujiSyuku_400Regular.ttf>` (steps at the top of that file), then build again.
- **The GitHub Action is red** → open it; the red step shows the line with the problem.
