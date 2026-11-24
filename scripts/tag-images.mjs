/*
 * tag-images.mjs — writes each certificate's and photo's details INTO the
 * image file itself, so they travel with the picture (Google Images, a
 * download, a re-upload): title, description, keywords, who it shows, who
 * made it, copyright, the date and place, and the page it belongs to.
 *
 *   npm run images:tag          tag every image in Assets/certificates and Assets/gallery
 *   npm run images:tag -- --dry show what it would write
 *
 * The details come from the same data the pages use:
 *   data/certificates.ts   → public/Assets/certificates/<slug>.webp (+ -thumb)
 *   data/gallery-photos.ts → public/Assets/gallery/<slug>.webp      (+ -thumb)
 * so editing an entry there and running this (CI runs it on every deploy)
 * is all it takes. The pixels are never touched: ExifTool only rewrites the
 * metadata blocks (XMP, IPTC-in-XMP and EXIF).
 *
 * Needs ExifTool:  Ubuntu  sudo apt-get install libimage-exiftool-perl
 *                  macOS   brew install exiftool
 *                  Windows https://exiftool.org (exiftool.exe on PATH)
 * Without it the script says so and exits without failing the build.
 */

import { createRequire } from "node:module";
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const DRY = process.argv.includes("--dry");

/* Minimal CommonJS loader for the data's .ts files ("./x" and "@/x" imports) */
const tsFile = (base) => (existsSync(`${base}.ts`) ? `${base}.ts` : `${base}.tsx`);
function load(file) {
  const out = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", "process", out)(
    (p) =>
      p.startsWith(".") ? load(tsFile(resolve(dirname(file), p)))
      : p.startsWith("@/") ? load(tsFile(join(ROOT, p.slice(2))))
      : require(p),
    mod,
    mod.exports,
    process,
  );
  return mod.exports;
}

const exiftool = process.platform === "win32" ? "exiftool.exe" : "exiftool";
if (!DRY && spawnSync(exiftool, ["-ver"], { encoding: "utf8" }).status !== 0) {
  console.log("images:tag skipped: ExifTool is not installed (see the top of scripts/tag-images.mjs).");
  process.exit(0);
}

const { SITE_BASE_URL } = load(join(ROOT, "lib", "site.ts"));
const C = load(join(ROOT, "data", "certificates.ts"));
const P = load(join(ROOT, "data", "gallery-photos.ts"));

const PERSON = "Ahmed Emad Nasr";
const SITE = SITE_BASE_URL;
const YEAR = new Date().getFullYear();

/* EXIF text fields are ASCII: keep the letters ExifTool can store there */
const ascii = (text) => text.normalize("NFKD").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[^\x20-\x7E]/g, "").replace(/\s+/g, " ").trim();
/* "2026-02-15" → "2026:02:15", "2026-08" → "2026:08", "2025" → "2025" */
const exifDate = (iso) => iso?.replace(/-/g, ":");

/** One file's ExifTool arguments */
function args(meta) {
  const a = [
    "-overwrite_original",
    "-m",
    /* XMP (Dublin Core) — what Google Images and most tools read */
    `-XMP-dc:Title=${meta.title}`,
    `-XMP-dc:Description=${meta.description}`,
    `-XMP-dc:Creator=${meta.creator}`,
    `-XMP-dc:Rights=${meta.copyright}`,
    "-XMP-dc:Subject=",
    ...meta.keywords.map((k) => `-XMP-dc:Subject+=${k}`),
    `-XMP-dc:Source=${meta.pageUrl}`,
    `-XMP-dc:Publisher=${meta.publisher}`,
    ...(meta.identifier ? [`-XMP-dc:Identifier=${meta.identifier}`] : []),
    /* IPTC Photo Metadata (in XMP) — headline, caption writer, credit line, copyright notice */
    `-XMP-photoshop:Headline=${meta.title}`,
    `-XMP-photoshop:Credit=${PERSON}`,
    `-XMP-photoshop:Source=${SITE}`,
    `-XMP-photoshop:CaptionWriter=${PERSON}`,
    ...(meta.date ? [`-XMP-photoshop:DateCreated=${meta.date}`] : []),
    ...(meta.place ? [`-XMP-iptcCore:Location=${meta.place}`] : []),
    "-XMP-photoshop:Country=Egypt",
    `-XMP-iptcExt:PersonInImage=${PERSON}`,
    ...(meta.event ? [`-XMP-iptcExt:Event=${meta.event}`] : []),
    /* Licence and where to find the original */
    "-XMP-xmpRights:Marked=True",
    `-XMP-xmpRights:WebStatement=${meta.pageUrl}`,
    `-XMP-xmpRights:UsageTerms=${meta.usage}`,
    `-XMP-plus:LicensorURL=${SITE}`,
    /* EXIF — the old fields many viewers still show (ASCII only) */
    `-EXIF:ImageDescription=${ascii(`${meta.title} - ${meta.description}`).slice(0, 1800)}`,
    `-EXIF:Artist=${ascii(meta.creator)}`,
    `-EXIF:Copyright=${ascii(meta.copyright)}`,
    `-EXIF:XPTitle=${meta.title}`,
    `-EXIF:XPSubject=${meta.event ?? meta.title}`,
    `-EXIF:XPKeywords=${meta.keywords.join(";")}`,
    `-EXIF:XPComment=${meta.description}`,
    `-EXIF:XPAuthor=${meta.creator}`,
    /* Only a full date fits the EXIF date field */
    ...(meta.exifDate?.length === 10 ? [`-EXIF:DateTimeOriginal=${meta.exifDate} 12:00:00`] : []),
  ];
  return a;
}

const jobs = [];

for (const c of C.CERTIFICATES) {
  const when = C.certificateWhen(c);
  const details = [
    `Issued by ${c.issuer}${c.deliveredBy ? ` (${c.deliveredBy})` : ""} to ${PERSON}.`,
    when && `Date: ${when}.`,
    c.hours && `Length: ${c.hours}.`,
    c.score && `Score: ${c.score}.`,
    c.instructor && `Instructor: ${c.instructor}.`,
    c.credentialId && `Credential ID: ${c.credentialId}.`,
    c.verifyUrl && `Verify: ${c.verifyUrl}.`,
  ].filter(Boolean);
  const meta = {
    title: `${c.title} — ${c.issuer} — ${PERSON}`,
    description: `${c.description} ${details.join(" ")}`,
    creator: c.issuer,
    publisher: PERSON,
    copyright: `Certificate issued by ${c.issuer} to ${PERSON}. Scan published by ${PERSON}, ${SITE}`,
    usage: `Shown as proof of ${PERSON}'s credentials. Verify with ${c.issuer}${c.verifyUrl ? `: ${c.verifyUrl}` : ""}.`,
    keywords: C.certificateKeywords(c),
    pageUrl: `${SITE}/certificates/${c.slug}`,
    identifier: c.credentialId,
    date: c.date,
    exifDate: exifDate(c.date),
    event: c.kind,
  };
  for (const file of [C.certificateImagePath(c.slug), C.certificateThumbPath(c.slug)]) jobs.push({ file, meta });
}

for (const p of P.GALLERY_PHOTOS) {
  const when = P.formatPhotoDate(p.date);
  const meta = {
    title: `${p.title} — ${PERSON}`,
    description: [p.description, p.source && `Source: ${p.source}.`, when && `Date: ${when}.`, p.place && `Place: ${p.place}.`]
      .filter(Boolean)
      .join(" "),
    creator: PERSON,
    publisher: PERSON,
    copyright: `© ${YEAR} ${PERSON}, ${SITE}`,
    usage: `Personal photo of ${PERSON}. Please credit ${PERSON} and link ${SITE}/gallery.`,
    keywords: P.photoKeywords(p),
    pageUrl: `${SITE}/gallery#${p.slug}`,
    date: p.date,
    exifDate: exifDate(p.date),
    place: p.place,
    event: p.event,
  };
  for (const file of [P.photoImagePath(p.slug), P.photoThumbPath(p.slug)]) jobs.push({ file, meta });
}

let missing = 0;
const existing = jobs.filter(({ file }) => {
  const ok = existsSync(join(PUBLIC, file));
  if (!ok && !/-thumb\.webp$/.test(file)) {
    missing++;
    console.error(`✖ missing ${file}`);
  }
  return ok;
});

if (DRY) {
  for (const { file, meta } of existing.slice(0, 4)) console.log(`${file}\n  ${meta.title}\n  ${meta.description.slice(0, 160)}…`);
  console.log(`… ${existing.length} files would be tagged.`);
  process.exit(missing ? 1 : 0);
}

/* One ExifTool run for every file: an argument file, -execute between files */
const dir = mkdtempSync(join(tmpdir(), "tag-images-"));
const argFile = join(dir, "args.txt");
const lines = [];
for (const { file, meta } of existing) {
  lines.push(...args(meta), join(PUBLIC, file), "-execute");
}
/* One argument per line: a value may not contain a newline */
writeFileSync(argFile, lines.map((l) => l.replace(/[\r\n]+/g, " ")).join("\n"), "utf8");
const run = spawnSync(exiftool, ["-charset", "utf8", "-charset", "filename=utf8", "-@", argFile], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
rmSync(dir, { recursive: true, force: true });

const updated = (run.stdout.match(/1 image files updated/g) || []).length;
const errors = (run.stderr || "").split("\n").filter((l) => /^Error/.test(l));
for (const e of errors) console.error(e);
console.log(`Tagged ${updated} of ${existing.length} image files (certificates and gallery photos).`);
process.exit(missing || errors.length ? 1 : 0);
