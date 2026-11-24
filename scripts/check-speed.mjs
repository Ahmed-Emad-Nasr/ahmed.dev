/*
 * check-speed.mjs — is the LIVE site still fast and easy to use? (weekly)
 *
 *   SITE_URL=https://… node scripts/check-speed.mjs
 *
 * Runs Google Lighthouse (the same test as PageSpeed Insights, on a
 * simulated mid-range phone on a slow 4G line) on a few pages of the live
 * site and checks four scores: Performance, Accessibility, Best practices
 * and SEO. A score under its floor (FLOORS below) is added to
 * .live-report.md, the file the weekly "Live site health" workflow turns
 * into a GitHub issue (an e-mail to Ahmed) — with the audits that cost the
 * most points, so the cause is clear (a heavy new image, a missing alt…).
 *
 * Each page is measured twice and the better run counts: one slow run on a
 * busy GitHub machine is noise, not a problem. Lighthouse is fetched by npx
 * at a fixed version (LIGHTHOUSE); Chrome is the one GitHub's runner has
 * (CHROME_PATH to use another). Never fails: anything it can't measure is a
 * warning.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPORT = join(ROOT, ".live-report.md");
const SITE = (process.env.SITE_URL || "https://ahmed-emad-nasr.github.io/ahmed.dev").replace(/\/+$/, "");
const LIGHTHOUSE = "lighthouse@13.6.0";

/* The pages most people open first */
const PAGES = ["/", "/blog", "/certificates", "/cv"];
/* The lowest score (0–100) each category may have before it is reported.
   Performance on a simulated phone (measured Nov 2026, with compression as
   GitHub Pages serves it): home ≈ 90, /cv ≈ 96, /blog and /certificates
   ≈ 55–65 (long pages, a lot of script on a slow phone). The floor sits
   under all of them, so only a page that clearly got WORSE is reported —
   not the same known numbers every week. Raise it once those pages are
   faster. */
const FLOORS = { performance: 45, accessibility: 95, "best-practices": 90, seo: 95 };
const RUNS = 2;

const warn = (msg) => console.warn(`::warning::check-speed — ${msg}`);

/* One Lighthouse run → the parsed report (or null) */
async function lighthouse(url) {
  const args = [
    "--yes",
    LIGHTHOUSE,
    url,
    "--output=json",
    "--output-path=stdout",
    "--quiet",
    `--only-categories=${Object.keys(FLOORS).join(",")}`,
    "--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage",
  ];
  try {
    const { stdout } = await run("npx", args, { maxBuffer: 64 * 1024 * 1024, timeout: 180000 });
    return JSON.parse(stdout);
  } catch (e) {
    const why = String(e.stderr || e.message).trim().split("\n").filter(Boolean).pop() || "no output";
    warn(`${url}: Lighthouse did not finish (${why.slice(0, 200)})`);
    return null;
  }
}

const score = (report, id) => Math.round((report.categories[id]?.score ?? 0) * 100);

/* The audits of one category that cost the most points */
function worstAudits(report, id, max = 3) {
  const refs = report.categories[id]?.auditRefs ?? [];
  return refs
    .filter((r) => r.weight > 0)
    .map((r) => ({ ...report.audits[r.id], weight: r.weight }))
    .filter((a) => a && typeof a.score === "number" && a.score < 0.9)
    .sort((a, b) => b.weight * (1 - b.score) - a.weight * (1 - a.score))
    .slice(0, max)
    .map((a) => `${a.title}${a.displayValue ? ` (${a.displayValue})` : ""}`);
}

const problems = [];
const lines = [];

for (const path of PAGES) {
  const url = `${SITE}${path}`;
  let best = null;
  for (let i = 0; i < RUNS; i++) {
    const report = await lighthouse(url);
    if (report?.categories && (!best || score(report, "performance") > score(best, "performance"))) best = report;
  }
  if (!best) continue;
  const scores = Object.keys(FLOORS).map((id) => `${id} ${score(best, id)}`).join(" · ");
  lines.push(`${path} — ${scores}`);
  for (const [id, floor] of Object.entries(FLOORS)) {
    const s = score(best, id);
    if (s < floor) {
      const why = worstAudits(best, id);
      problems.push(
        `- **${path}** — ${best.categories[id].title} is ${s} (the floor is ${floor})${why.length ? `. Costing the most: ${why.join("; ")}` : ""}. Details: https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`,
      );
    }
  }
}

console.log(`check-speed — ${SITE}\n  ${lines.join("\n  ") || "(nothing measured)"}`);

if (problems.length) {
  const section = `\n### Speed & accessibility (Lighthouse, phone)\n\n${problems.join("\n")}\n`;
  const before = existsSync(REPORT)
    ? readFileSync(REPORT, "utf8")
    : `The weekly check of ${SITE} found a problem:\n\nThe site keeps serving its last good version. This issue closes by itself after a clean check (Actions → "Live site health").\n`;
  writeFileSync(REPORT, before + section);
  console.log(`check-speed — ${problems.length} score(s) under the floor:\n${problems.join("\n")}`);
} else if (lines.length) {
  console.log("check-speed — every score is above its floor");
}
