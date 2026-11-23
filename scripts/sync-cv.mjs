#!/usr/bin/env node
/*
 * scripts/sync-cv.mjs — the site follows the CV PDF by itself.
 *   npm run cv:sync            (GitHub Actions runs it on every deploy)
 *   npm run cv:sync -- --force read the PDF again even if it did not change
 *
 * Replace public/Assets/cv/AhmedEmadNasr_CV.pdf with a new export (same
 * name) and push — that's all. On the next deploy this:
 *
 *   1. gives the PDF its title / author / keywords (scripts/pdf-cv-meta.py)
 *   2. reads it (scripts/cv-parse.py): headline, contact, education,
 *      experience, projects, skills, certifications, volunteering, awards,
 *      languages
 *   3. checks every section (dates that are dates, entries with points …);
 *      a section that doesn't pass is NOT used — the last good one stays
 *   4. writes data/cv-from-pdf.ts, which the site reads:
 *        /cv page                 everything (data/cv.ts)
 *        home Experience + JSON-LD  new jobs appear, dates follow the CV (data/experience.ts)
 *        phone / e-mail           site-wide (data/profile.ts)
 *
 * The very first reading is compared with what the site already shows: if
 * they don't mostly agree, the CV's layout was not understood and nothing
 * is changed. Any problem is written to .cv-sync-report.md, which the deploy
 * turns into a GitHub issue ("CV sync needs a look") — the site keeps
 * working with the last good data either way. Never fails the build.
 */
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PDF = join(ROOT, "public/Assets/cv/AhmedEmadNasr_CV.pdf");
const OUT = join(ROOT, "data/cv-from-pdf.ts");
const REPORT = join(ROOT, ".cv-sync-report.md");
const FORCE = process.argv.includes("--force");
const MARK = "export const CV_FROM_PDF: CvFromPdf | null = ";

const today = () => new Date().toISOString().slice(0, 10);
const say = (msg) => console.log(`cv:sync — ${msg}`);

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function python(args) {
  const tries = process.platform === "win32" ? [["py", ["-3"]], ["python", []]] : [["python3", []], ["python", []]];
  for (const [cmd, pre] of tries) {
    const r = spawnSync(cmd, [...pre, ...args], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
    if (r.error?.code === "ENOENT") continue;
    return r;
  }
  return { status: 1, stdout: "", stderr: "Python 3 not found" };
}

/* data/cv.ts as the site shows it now (TypeScript loaded without a build) */
function loadCurrentCv() {
  const require = createRequire(join(ROOT, "package.json"));
  const ts = require("typescript");
  const tsFile = (b) => (existsSync(`${b}.ts`) ? `${b}.ts` : `${b}.tsx`);
  const load = (file) => {
    const out = ts.transpileModule(readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    const mod = { exports: {} };
    new Function("require", "module", "exports", "process", out)(
      (p) => (p.startsWith(".") ? load(tsFile(resolve(dirname(file), p))) : p.startsWith("@/") ? load(tsFile(join(ROOT, p.slice(2)))) : require(p)),
      mod,
      mod.exports,
      process,
    );
    return mod.exports;
  };
  return { cv: load(join(ROOT, "data/cv.ts")).CV, saved: load(OUT).CV_FROM_PDF };
}

const plain = (s = "") => String(s).replace(/\*\*/g, "");
const words = (s) => new Set(plain(s).toLowerCase().match(/[a-z0-9+#]+/g) ?? []);
/** 0 … 1: how many words two strings share */
const sim = (a, b) => {
  const A = words(a), B = words(b);
  if (!A.size || !B.size) return 0;
  let n = 0;
  for (const w of A) if (B.has(w)) n++;
  return n / Math.max(A.size, B.size);
};

const DATE = String.raw`(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}/\d{4}|\d{4})`;
const DATES_RE = new RegExp(String.raw`^${DATE}(?:\s*[–—-]\s*(?:${DATE}|Present|Now|Current|Today))?$`, "i");
const tidyDates = (d) => d.replace(/\s*(?:--|—|-|to)\s*/i, " – ").replace(/\s+/g, " ").trim();

/* ─── Reading → the site's shape ─────────────────────────────────────────── */

function orientation(parsed, current, savedTitleFirst) {
  /* Is the first heading line the job title or the organisation? Vote with
     the entries the site already knows. */
  const known = [...(current.experience ?? []), ...(current.volunteering ?? [])];
  let first = 0, second = 0;
  for (const e of [...(parsed.experience ?? []), ...(parsed.volunteering ?? [])]) {
    for (const k of known) {
      const asIs = sim(e.a, k.title) + sim(e.b, k.org);
      const swapped = sim(e.a, k.org) + sim(e.b, k.title);
      if (Math.max(asIs, swapped) >= 1) asIs >= swapped ? first++ : second++;
    }
  }
  if (first || second) return first >= second;
  return savedTitleFirst ?? true;
}

const toEntry = (titleFirst) => (e) => ({
  title: titleFirst ? e.a : e.b,
  org: titleFirst ? e.b : e.a,
  place: e.place ?? "",
  dates: tidyDates(e.dates ?? ""),
  points: e.points ?? [],
});

/* Each check returns "" when the section is fine, or what is wrong */
const okPoints = (pts) => pts.length > 0 && pts.every((p) => plain(p).length >= 8 && plain(p).length <= 500);
const CHECKS = {
  headline: (v) => (v.length >= 4 && v.length <= 120 ? "" : "headline looks wrong"),
  contact: (v) => (!v.email || /^[\w.+-]+@[\w-]+\.[\w.]+$/.test(v.email) ? "" : "e-mail looks wrong"),
  education: (v) => (v.degree && v.school ? "" : "degree or school missing"),
  experience: (v) =>
    !v.length ? "no entries"
    : v.find((e) => !e.title || !e.org) ? "an entry without a title or organisation"
    : v.find((e) => !DATES_RE.test(e.dates)) ? `dates not understood ("${v.find((e) => !DATES_RE.test(e.dates)).dates}")`
    : v.find((e) => !okPoints(e.points)) ? "an entry without bullet points"
    : "",
  volunteering: (v) => CHECKS.experience(v),
  projects: (v) => (!v.length ? "no entries" : v.find((p) => !p.title || !okPoints(p.points)) ? "a project without a title or points" : ""),
  skills: (v) => (v.length >= 2 && v.every(([l, x]) => l && l.length <= 60 && x) ? "" : "not read as 'Label: values' lines"),
  certifications: (v) => (v.length && v.every(([n, , y]) => n && n.length <= 200 && (!y || /^\d{4}$/.test(y))) ? "" : "rows not understood"),
  awards: (v) => (v.length && v.every((a) => plain(a).length >= 8 && plain(a).length <= 500) ? "" : "items not understood"),
  languages: (v) => (v.length && v.every(([l]) => l && l.length <= 30) ? "" : "not understood"),
};

function shape(parsed, titleFirst) {
  const h = parsed.header ?? {};
  const s = {};
  if (h.headline) s.headline = h.headline.replace(/\s+\|\s+/g, " · ");
  const contact = Object.fromEntries(
    ["phone", "email", "linkedin", "github", "wuzzuf"].filter((k) => h[k]).map((k) => [k, h[k]]),
  );
  if (Object.keys(contact).length) s.contact = contact;
  if (parsed.education) {
    const e = parsed.education;
    s.education = {
      degree: titleFirst ? e.a : e.b || e.a,
      school: titleFirst ? e.b : e.a,
      place: e.place ?? "",
      date: tidyDates(e.dates ?? ""),
      gpa: e.gpa ?? "",
      coursework: e.coursework ?? "",
    };
    /* "Benha University" is the school whichever line it is on */
    if (/universit|college|institute|school|academy/i.test(s.education.degree) && !/universit|college|institute|school|academy/i.test(s.education.school)) {
      [s.education.degree, s.education.school] = [s.education.school, s.education.degree];
    }
  }
  for (const key of ["experience", "volunteering"]) if (parsed[key]) s[key] = parsed[key].map(toEntry(titleFirst));
  if (parsed.projects) {
    s.projects = parsed.projects.map((p) => ({
      title: p.title,
      stack: p.stack,
      ...(p.github ? { github: p.github } : {}),
      ...(p.demo ? { demo: p.demo } : {}),
      points: p.points,
    }));
  }
  for (const key of ["skills", "certifications", "awards", "languages"]) if (parsed[key]) s[key] = parsed[key];
  return s;
}

/* The first reading must look like the CV the site already shows */
function agreesWithSite(s, cv) {
  const titles = (list, key) => (list ?? []).map((x) => x[key]);
  const share = (got, have) => (got.length ? got.filter((g) => have.some((h) => sim(g, h) >= 0.6)).length / got.length : 0);
  const exp = share(titles(s.experience, "title"), titles(cv.experience, "title"));
  const proj = share(titles(s.projects, "title"), titles(cv.projects, "title"));
  return { ok: exp >= 0.5 && (proj >= 0.5 || !s.projects), exp, proj };
}

/* ─── Run ────────────────────────────────────────────────────────────────── */

function writeReport(lines, nothingChanged = false) {
  writeFileSync(
    REPORT,
    [
      "The CV PDF changed, but the site could not take all of it over by itself.",
      nothingChanged
        ? "Nothing was changed: the site keeps showing the last good version of the CV."
        : "The site keeps showing the last good version of what is listed below; everything else was updated.",
      "",
      ...lines.map((l) => `- ${l}`),
      "",
      "How to fix: keep the usual section names (Experience, Projects, Skills …), one entry = a heading line",
      "(title, dates on the right) + a line with the organisation, then its bullet points. Push the PDF again —",
      "or edit `data/cv.ts` by hand. Run `npm run cv:sync` locally to see the same messages.",
      "",
      `_${today()} · scripts/sync-cv.mjs_`,
    ].join("\n"),
  );
}

function main() {
  rmSync(REPORT, { force: true });
  if (!existsSync(PDF)) return say("no CV PDF — nothing to do");

  /* 1. The PDF's own title / keywords (changes the file only the first time) */
  const meta = python([join(ROOT, "scripts/pdf-cv-meta.py"), PDF]);
  if (meta.status !== 0) say(`metadata step skipped (${(meta.stderr || meta.stdout).trim().split("\n").pop()})`);

  const hash = createHash("sha256").update(readFileSync(PDF)).digest("hex");
  const { cv, saved } = loadCurrentCv();
  if (!FORCE && saved?.hash === hash) return say("the CV did not change");

  /* 2. Read it */
  const r = python([join(ROOT, "scripts/cv-parse.py"), PDF]);
  if (r.status !== 0) {
    const why = (r.stderr || "unknown error").trim().split("\n").pop();
    if (/not found|needs\s+pip/i.test(why)) return say(`skipped — ${why}`);
    writeReport([`The PDF could not be read: ${why}`], true);
    return say(`could not read the PDF: ${why}`);
  }
  const parsed = JSON.parse(r.stdout);

  /* 3. Shape and check every section */
  const titleFirst = orientation(parsed, cv, saved?.titleFirst);
  const fresh = shape(parsed, titleFirst);
  const problems = [];
  const sections = {};
  for (const [key, value] of Object.entries(fresh)) {
    const wrong = CHECKS[key]?.(value) ?? "";
    if (wrong) problems.push(`**${key}**: ${wrong}`);
    else sections[key] = value;
  }
  for (const key of ["experience", "projects", "skills"]) {
    if (!(key in fresh)) problems.push(`**${key}**: section not found in the PDF`);
  }

  /* Without a readable Experience section the reading is not trusted at all
     (a wrong file, a scan, a layout the reader doesn't know) */
  if (!sections.experience) {
    writeReport(["The **experience** section could not be read, so the reading was not trusted.", ...problems], true);
    return say("experience not read — nothing changed (see .cv-sync-report.md)");
  }

  if (!saved) {
    const agree = agreesWithSite(sections, cv);
    if (!agree.ok) {
      writeReport([
        `The first reading does not match the CV on the site (experience titles matched: ${Math.round(agree.exp * 100)}%, projects: ${Math.round(agree.proj * 100)}%) — so the CV layout was probably not understood, and nothing was changed.`,
        ...problems,
      ], true);
      return say("first reading does not match the site — nothing changed (see .cv-sync-report.md)");
    }
  }

  /* Sections that failed keep their last good reading */
  for (const [key, value] of Object.entries(saved?.sections ?? {})) if (!(key in sections) && key in CHECKS) sections[key] = value;

  /* 4. Save */
  const data = { hash, read: today(), titleFirst, sections };
  const src = readFileSync(OUT, "utf8");
  const head = src.slice(0, src.indexOf(MARK));
  writeFileSync(OUT, `${head}${MARK}${JSON.stringify(data, null, 2).replace(/\n/g, "\r\n")};\r\n`.replace(/\r?\n/g, "\r\n"));
  if (problems.length) writeReport(problems);
  say(
    `read ${Object.keys(fresh).length} sections (${Object.keys(sections).length} in use)` +
      (problems.length ? ` · ${problems.length} problem(s) — see .cv-sync-report.md` : " · all good"),
  );
}

try {
  main();
} catch (e) {
  console.warn(`::warning::cv:sync — ${e.message}`);
}
