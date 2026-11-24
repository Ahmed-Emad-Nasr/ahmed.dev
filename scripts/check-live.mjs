/*
 * check-live.mjs — is the LIVE site healthy? (weekly, .github/workflows/site-health.yml)
 *
 *   npm run health:live                 the public address below
 *   SITE_URL=https://… npm run health:live
 *
 * Checks the site people actually see, not the build:
 *   · the main pages open (200) and carry the name
 *   · a sample of the pages and images listed in sitemap.xml open
 *   · the CV PDF downloads as a PDF
 *   · the daily sync is still reading YouTube / TryHackMe (data/live-stats.ts
 *     "checked" no older than a week — older means the API key or the
 *     public pages stopped answering)
 *   · the last deploy is recent (the footer's build date, no older than 3 days)
 * Anything wrong → .live-report.md (the workflow turns it into a GitHub
 * issue, which e-mails Ahmed; a later clean run closes it). Uses only Node's
 * own fetch — no install needed.
 */

import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
/* https always (GitHub can hand the address over as http://), localhost aside */
const SITE = (process.env.SITE_URL || "https://ahmed-emad-nasr.github.io/ahmed.dev")
  .replace(/^http:\/\/(?!localhost|127\.0\.0\.1)/i, "https://")
  .replace(/\/+$/, "");
const REPORT = join(ROOT, ".live-report.md");
const NAME = "Ahmed Emad Nasr";
const PAGES = ["/", "/blog", "/teaching", "/training", "/certificates", "/journey", "/gallery", "/cv", "/videos", "/ar/teaching"];
const SAMPLE = 30;

const problems = [];
const fail = (what) => problems.push(`- ${what}`);

async function get(url, { method = "GET" } = {}) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, { method, redirect: "follow", headers: { "User-Agent": "ahmed.dev health check" }, signal: AbortSignal.timeout(25000) });
      return res;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

/* The main pages: open, and the name is on them */
for (const path of PAGES) {
  const url = `${SITE}${path}`;
  try {
    const res = await get(url);
    if (!res.ok) fail(`${url} → HTTP ${res.status}`);
    else if (!(await res.text()).includes(NAME)) fail(`${url} opens but does not show "${NAME}" — the page may be broken`);
  } catch (e) {
    fail(`${url} → ${e.message}`);
  }
}

/* A sample of everything in the sitemap (a different slice each week) */
let sitemap = "";
try {
  const res = await get(`${SITE}/sitemap.xml`);
  if (!res.ok) fail(`sitemap.xml → HTTP ${res.status}`);
  else sitemap = await res.text();
} catch (e) {
  fail(`sitemap.xml → ${e.message}`);
}
const week = Math.floor(Date.now() / (7 * 24 * 3600 * 1000));
const pick = (list) => {
  if (list.length <= SAMPLE) return list;
  const start = (week * SAMPLE) % list.length;
  return [...list, ...list].slice(start, start + SAMPLE);
};
/* The sitemap names the address the site was built for; check the same
   paths on SITE (the same address in the weekly run, a test server locally) */
const builtFor = sitemap.match(/<loc>([^<]+?)\/?<\/loc>/)?.[1] ?? SITE;
const here = (u) => (u.startsWith(builtFor) ? SITE + u.slice(builtFor.length) : u);
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => here(m[1]));
const images = [...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => here(m[1]));
for (const url of [...pick(pages), ...pick(images)]) {
  try {
    const res = await get(url, { method: "HEAD" });
    if (!res.ok) fail(`${url} → HTTP ${res.status}`);
  } catch (e) {
    fail(`${url} → ${e.message}`);
  }
}

/* The CV PDF (the link on /cv) */
try {
  const html = await (await get(`${SITE}/cv`)).text();
  const pdf = html.match(/href="([^"]+\.pdf)"/)?.[1];
  if (!pdf) fail("/cv has no link to the CV PDF");
  else {
    const url = new URL(pdf, `${SITE}/cv`).href;
    const res = await get(url, { method: "HEAD" });
    if (!res.ok || !/pdf/i.test(res.headers.get("content-type") ?? "")) fail(`CV PDF ${url} → HTTP ${res.status} ${res.headers.get("content-type") ?? ""}`);
  }
} catch (e) {
  fail(`CV PDF → ${e.message}`);
}

/* The last deploy: the footer's "Updated" date (<time dateTime="…">) */
try {
  const html = await (await get(`${SITE}/`)).text();
  const built = html.match(/<time dateTime="(\d{4}-\d{2}-\d{2}T[^"]+)"/)?.[1];
  if (built) {
    const days = (Date.now() - Date.parse(built)) / 86400000;
    if (days > 3) fail(`the live site was last deployed ${Math.floor(days)} days ago (${built.slice(0, 10)}) — the daily deploy has stopped; see the Actions tab`);
  }
} catch {
  /* reported above */
}

/* The daily numbers sync (repo data) */
const stats = join(ROOT, "data", "live-stats.ts");
if (existsSync(stats)) {
  const checked = readFileSync(stats, "utf8").match(/"checked":\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
  if (checked) {
    const days = (Date.now() - Date.parse(checked)) / 86400000;
    if (days > 7)
      fail(
        `YouTube / TryHackMe numbers were last read ${Math.floor(days)} days ago (${checked}). The YOUTUBE_API_KEY secret may have expired or been restricted, or the public pages changed — see the "stats:sync" warnings in the last deploy.`,
      );
  }
}

if (problems.length) {
  writeFileSync(
    REPORT,
    `The weekly check of ${SITE} found ${problems.length} problem(s):\n\n${problems.join("\n")}\n\nThe site keeps serving its last good version. This issue closes by itself after a clean check (Actions → "Live site health").\n`,
  );
  console.log(`health:live — ${problems.length} problem(s):\n${problems.join("\n")}`);
} else {
  if (existsSync(REPORT)) rmSync(REPORT);
  console.log(`health:live — ${SITE}: all good (${PAGES.length} pages, ${Math.min(SAMPLE, pages.length)} sitemap pages, ${Math.min(SAMPLE, images.length)} images, CV PDF)`);
}
