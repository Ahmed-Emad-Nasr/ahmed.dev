/*
 * sync-credly.mjs — new Credly badges → the /certificates page, by itself.
 *
 *   npm run credly:sync      (GitHub Actions runs it before every deploy)
 *
 * Reads the public badge list of the Credly profile below and writes every
 * badge that is not on the site yet into data/credly-badges.ts (title,
 * issuer, date, skills, the badge's own verification page) with its picture
 * as public/Assets/certificates/credly-<name>.webp. data/certificates.ts adds
 * them to the list (group "Verified Badges"); each gets its own page like any
 * other certificate.
 *
 * Already on the site = a certificate whose verifyUrl is that badge's Credly
 * page (the Red Hat RH124 one, for example): never listed twice. A badge the
 * profile no longer shows stays listed (delete it from the data file by hand).
 * Credly down or the profile private: a warning, and everything is kept as
 * it is — this never fails the deploy.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/* credly.com/users/<this> */
const CREDLY_USER = "ahmed-emad-nasr";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_FILE = join(ROOT, "data", "credly-badges.ts");
const CERT_FILE = join(ROOT, "data", "certificates.ts");
const IMAGE_DIR = join(ROOT, "public", "Assets", "certificates");
const warn = (msg) => console.warn(`::warning::credly:sync — ${msg}`);

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 70)
    .replace(/-$/, "");

const plain = (html = "") =>
  String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "ahmed.dev site sync" }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

/** Every badge on the profile (all pages) */
async function badges() {
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const body = await getJson(`https://www.credly.com/users/${CREDLY_USER}/badges.json?page=${page}`);
    all.push(...(body.data ?? []));
    const pages = body.metadata?.total_pages ?? 1;
    if (page >= pages) break;
  }
  return all;
}

/** The entries already written (kept as they are) */
function savedEntries() {
  if (!existsSync(DATA_FILE)) return [];
  const m = readFileSync(DATA_FILE, "utf8").match(/\/\* DATA \*\/([\s\S]*?);\s*$/);
  try {
    return m ? JSON.parse(m[1]) : [];
  } catch {
    return [];
  }
}

function write(entries) {
  const head = `/*
 * ═══ data/credly-badges.ts — written by scripts/sync-credly.mjs ═══
 *
 * The Credly badges that are not otherwise on the site, read from the public
 * profile credly.com/users/${CREDLY_USER} on every deploy. data/certificates.ts
 * adds them to the list. Edit by hand only to remove one; the next sync
 * never re-adds a badge that is listed in data/certificates.ts.
 */

import type { Certificate } from "@/data/certificates";

export const CREDLY_BADGES: readonly Certificate[] = /* DATA */`;
  writeFileSync(DATA_FILE, `${head}${JSON.stringify(entries, null, 2)};\n`.replace(/\r?\n/g, "\r\n"));
}

async function main() {
  let list;
  try {
    list = await badges();
  } catch (e) {
    warn(`Credly profile unavailable (${e.message}); keeping data/credly-badges.ts as it is`);
    if (!existsSync(DATA_FILE)) write([]);
    return;
  }

  const listed = readFileSync(CERT_FILE, "utf8");
  const saved = savedEntries();
  const known = new Set(saved.map((e) => e.verifyUrl));
  const added = [];
  mkdirSync(IMAGE_DIR, { recursive: true });

  for (const b of list) {
    if (!b?.id || b.state === "rejected") continue;
    const verifyUrl = `https://www.credly.com/badges/${b.id}`;
    /* On the site already: in data/certificates.ts, or written before */
    if (listed.includes(b.id) || known.has(verifyUrl)) continue;

    const t = b.badge_template ?? {};
    const title = t.name ?? "Credly badge";
    const issuer =
      t.issuer?.entities?.find((x) => x.primary)?.entity?.name ??
      b.issuer?.entities?.find((x) => x.primary)?.entity?.name ??
      t.issuer?.summary?.replace(/^issued by\s+/i, "") ??
      "Credly";
    const slug = `credly-${slugify(title)}`;
    const date = b.issued_at_date ?? b.issued_at?.slice(0, 10);
    const description = plain(t.description) || `${title}, a digital badge issued by ${issuer} through Credly.`;
    const skills = (t.skills ?? []).map((s) => (typeof s === "string" ? s : s.name)).filter(Boolean).slice(0, 12);

    /* The badge's picture → WebP next to the other scans */
    const imageUrl = b.image_url ?? t.image_url ?? b.image?.url ?? t.image?.url;
    if (imageUrl && !existsSync(join(IMAGE_DIR, `${slug}.webp`))) {
      try {
        const res = await fetch(imageUrl, { signal: AbortSignal.timeout(20000) });
        if (!res.ok) throw new Error(`${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        await sharp(buf).resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toFile(join(IMAGE_DIR, `${slug}.webp`));
      } catch (e) {
        warn(`${title}: picture not saved (${e.message}) — skipped this time`);
        continue;
      }
    }

    added.push({
      slug,
      title,
      issuer,
      kind: "Verified Badge",
      group: "badges",
      ...(date ? { date } : {}),
      ...(b.expires_at_date ? { note: `Valid until ${b.expires_at_date}, as stated on Credly.` } : {}),
      verifyUrl,
      nameOnDocument: b.issued_to ?? "Ahmed Emad Nasr",
      summary: `${title} — a verified Credly badge issued by ${issuer}${date ? ` on ${date}` : ""}.`,
      description,
      covers: skills.length ? skills : [title],
    });
  }

  if (added.length || !existsSync(DATA_FILE)) write([...saved, ...added]);
  console.log(`credly:sync — ${list.length} badge(s) on the profile · ${added.length} new on the site${added.length ? `: ${added.map((a) => a.title).join(", ")}` : ""}`);
}

main().catch((e) => warn(e.message));
