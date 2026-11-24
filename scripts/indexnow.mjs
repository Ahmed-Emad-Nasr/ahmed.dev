/*
 * indexnow.mjs — tell Bing (and Yandex, Seznam, Naver…) about new pages at once.
 *
 *   node scripts/indexnow.mjs --key-file   after the build: writes the key
 *                                          file into out/ (it proves the site is ours)
 *   node scripts/indexnow.mjs              after the deploy: sends the pages
 *                                          the live sitemap marks as changed in
 *                                          the last 3 days, and the home page
 *
 * IndexNow (indexnow.org) is free and needs no account: the key below is
 * published as a file on the site, and one POST names the changed
 * addresses. Google does not use it (it reads sitemap.xml, which the site
 * keeps up to date by itself). A new video, case or Credly badge gets its
 * page into Bing within hours instead of weeks. Never fails the deploy.
 */

import { writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/* Any 32 hex characters; changing it is harmless (the next run publishes the new one) */
const KEY = "fae4ac88d5785465da77891dcd71f47d";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
/* https always (GitHub can hand the address over as http://), localhost aside */
const SITE = (process.env.SITE_URL || "https://ahmed-emad-nasr.github.io/ahmed.dev")
  .replace(/^http:\/\/(?!localhost|127\.0\.0\.1)/i, "https://")
  .replace(/\/+$/, "");
const DAYS = 3;
const warn = (msg) => console.warn(`::warning::indexnow — ${msg}`);

if (process.argv.includes("--key-file")) {
  const out = join(ROOT, "out");
  if (!existsSync(out)) {
    warn("no out/ folder — build first");
  } else {
    writeFileSync(join(out, `${KEY}.txt`), KEY);
    console.log(`indexnow — key file written: out/${KEY}.txt`);
  }
  process.exit(0);
}

try {
  const res = await fetch(`${SITE}/sitemap.xml`, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`sitemap.xml → HTTP ${res.status}`);
  const xml = await res.text();
  const since = Date.now() - DAYS * 86400000;
  const urls = new Set([`${SITE}/`]);
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const mod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (loc && mod && Date.parse(mod) >= since) urls.add(loc);
  }
  const host = new URL(SITE).host;
  const post = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: [...urls].slice(0, 10000) }),
    signal: AbortSignal.timeout(20000),
  });
  /* 200 / 202 = accepted */
  if (post.status === 200 || post.status === 202) console.log(`indexnow — ${urls.size} page(s) sent (HTTP ${post.status})`);
  else warn(`IndexNow answered HTTP ${post.status} ${await post.text().catch(() => "")}`);
} catch (e) {
  warn(e.message);
}
