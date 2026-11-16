# Prompt for any AI — add content to the site

Copy everything inside the box into ChatGPT, Claude, Gemini, Cursor, Copilot…
Fill in the last part (**WHAT I WANT TO ADD**) and attach what it needs:
the PDF / screenshots list / video link, and the data file it will edit
(e.g. `data/cases.ts`) if the AI cannot open the repository itself.

> AI tools that open the repository (Claude Code, Cursor, Codex, Copilot
> agent) also read these same rules from `AGENTS.md` automatically.

````text
You are editing the content of my portfolio website (repository "ahmed.dev",
Next.js static site on GitHub Pages). I am Ahmed Emad Nasr, information
security officer and cybersecurity instructor.

HOW THE SITE WORKS
- All content lives in data files under data/. Pages, cards, counts, the
  sitemap, structured data and share images are generated from them.
- To add something you COPY AN EXISTING ENTRY in the right data file and
  change its values. You do not create pages or components.
- Every data file starts with a comment block "HOW TO ADD …" — read it first
  and follow it exactly.

WHERE EACH THING GOES
- Case / write-up / lab  → data/cases.ts (caseEvidenceLibrary, newest FIRST)
    + screenshots        → same file, caseScreenshotsByEvidenceId:
                           "<id>": buildScreenshotRange("<Folder>", first, last)
                           files: public/Assets/Cases/<Folder>/Screenshot (N).webp
    + case page details  → data/case-details.ts (verdict, severity, facts,
                           chain, timeline, iocs, response, detection, outcome)
    + MITRE ATT&CK       → data/attack.ts (caseAttackMapping: "<id>": ["T1566.001"])
- Video                  → data/youtube.ts (blogYoutubeVideos). Its own page
                           /videos/<slug> is made from the title automatically.
                           caseId = optional id of the case it explains.
- Playlist               → data/youtube.ts (blogYoutubePlaylists)
- Video page text        → data/video-notes.ts: VIDEO_NOTES["<videoId>"] = 3–5
                           points taken ONLY from what the video shows; a new
                           term in its tags can get one sentence in GLOSSARY
- Certificate            → image public/Assets/art-gallery/Images/image_display_thumb/<N>.webp
                           data/certifications.ts: raise GALLERY_IMAGE_COUNT,
                           add to ALL_GALLERY_CERTIFICATES (galleryIndex = N,
                           verifyUrl only if I give you the official link);
                           exam-based certifications also go in `certifications`
- Job / internship / volunteering / course → data/experience.ts
- A place I taught       → data/teaching.ts (TEACHING_ROLES) AND the same in
                           Arabic in data/teaching-ar.ts
- Project                → data/portfolio-data.ts (work)
- Service ("What I Do.") → data/services.ts
- Tool page /projects/<id> → data/tools.ts (id = the project's id; screenshots
                           in public/Assets/projects/<id>/*.webp) and set
                           links.docs: "/projects/<id>" on the project
- Platform write-ups page → lib/collections.ts (PLATFORM_PAGES); the
                           /attack/<T-id> and /writeups/<platform> pages fill
                           themselves from cases.ts and attack.ts
- Testimonial            → data/testimonials.ts
- Wazuh detection rule   → data/detection-rules.ts
- Training platform      → data/platforms.ts
- Organisation logo      → data/logos.ts
- CV                     → data/cv.ts (the /cv page) — keep it identical to the PDF CV

RULES — follow all of them
1. Use ONLY facts I give you or that are in the files I attach. Never invent
   numbers, dates, results, links, verification URLs or ATT&CK techniques.
   If something required is missing, ask me instead of guessing.
2. ATT&CK techniques: only what the report/screenshots actually show.
3. Testimonials: copy the words EXACTLY (typos included); Arabic ones get
   lang: "ar".
4. ids: lowercase-with-hyphens, unique, they become the URL (/blog/<id>).
   Dates: "YYYY-MM-DD". Paths are relative to public/ (no "public/" prefix).
5. Match the style of the existing entries: same fields, same tone (plain
   sentences a non-technical reader can follow, technical detail after).
6. Do not change components, styles, animations, config or other entries
   unless I ask. No new dependencies.
7. Keep the files' Windows line endings (CRLF) and formatting.
8. If the build says "technique Txxxx is not in TECHNIQUES", add the PARENT
   technique to TECHNIQUES in data/attack.ts as its header explains.

WHAT TO GIVE ME BACK
- The exact edits: for each file, the full new entry and where it goes
  (or apply them, if you can edit the repository).
- Then the commands to run, in order:
    npm run thumbs        (if there are new images)
    npm run og:cases      (if there is a new case)
    npm run check:data
    npm run verify
- Then what to do after deploying (e.g. Search Console → Request indexing
  for the new page's URL: https://ahmed-emad-nasr.github.io/ahmed.dev/<path>).

WHAT I WANT TO ADD
<describe it here, e.g.:
 - A new case: TryHackMe room "…", PDF report attached, 14 screenshots in
   folder "…" numbered 1–14, done on 2026-11-20.
 - A new video: https://youtu.be/XXXXXXXXXXX — title "…", published
   2026-11-18, it explains the case "<case id>".>
````
