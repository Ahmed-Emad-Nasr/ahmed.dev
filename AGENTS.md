<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Adding content to this site

Everything a visitor reads comes from the data files in `data/` — pages,
cards, counts, the sitemap, JSON-LD and share images are generated from them.
To add a case, video, certificate, job, project or testimonial, copy an
existing entry in the right data file and change its values; do not create
pages or components. Each data file starts with a "HOW TO ADD" comment —
follow it. Where each thing goes and the full rules are in `AI-PROMPT.md`
(for AI tools) and `HOW-TO-ADD.md` (for people). The short version:

- Use only facts the owner gives or that are in the attached files — never
  invent numbers, dates, links, verification URLs or ATT&CK techniques; ask.
- Testimonials are quoted exactly. A teaching change goes in both
  `data/teaching.ts` and `data/teaching-ar.ts`.
- Keep CRLF line endings and the existing style; no new dependencies; don't
  touch components, styles or config unless asked.
- Finish with `npm run check:data` and `npm run verify` (plus `npm run thumbs`
  for new images and `npm run og:cases` for a new case).
