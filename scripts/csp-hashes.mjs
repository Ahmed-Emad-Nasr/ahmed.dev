#!/usr/bin/env node
/*
 * scripts/csp-hashes.mjs — runs after every `npm run build` (postbuild).
 *
 * lib/security.ts ships the Content-Security-Policy as a <meta> tag with
 * script-src 'self' 'unsafe-inline', because Next's inline scripts (the
 * hydration data, the theme and loader bootstraps) change on every build.
 * This step reads each built page in out/, takes the SHA-256 of every inline
 * script that page really has, and swaps 'unsafe-inline' for exactly those
 * hashes. The browser then runs those scripts and nothing else inline: an
 * injected <script> or a javascript: URL is blocked, even if some text ever
 * slipped into the HTML unescaped.
 *
 * Nothing to maintain: new inline scripts are hashed on the next build. If a
 * page has inline scripts but no CSP tag, the build fails, so a page can
 * never ship without its policy.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;
const META = /<meta http-equiv="Content-Security-Policy" content="([^"]*)"\/?>/;
const INLINE = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/g;
/* Data blocks the browser never runs: no hash needed */
const DATA_TYPE = /\stype="application\/(ld\+)?json"/;

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (name.endsWith(".html")) yield path;
  }
}

let pages = 0;
let most = 0;
const missing = [];
for (const file of htmlFiles(OUT)) {
  const html = readFileSync(file, "utf8");
  const meta = META.exec(html);
  const hashes = new Set();
  for (const [, attrs, body] of html.matchAll(INLINE)) {
    if (DATA_TYPE.test(attrs) || !body) continue;
    hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
  if (!hashes.size) continue;
  if (!meta) {
    missing.push(file.slice(OUT.length));
    continue;
  }
  /* The policy has to come before the scripts it covers */
  const firstInline = html.search(/<script(?![^>]*\ssrc=)(?![^>]*application\/(ld\+)?json)[^>]*>/);
  if (firstInline !== -1 && firstInline < meta.index) {
    missing.push(`${file.slice(OUT.length)} (CSP tag after an inline script)`);
    continue;
  }
  /* React writes the quotes in the attribute as &#x27; */
  const q = (s) => s.replaceAll("'", "&#x27;");
  const policy = meta[1].replace(q("script-src 'self' 'unsafe-inline'"), q(`script-src 'self' ${[...hashes].join(" ")}`));
  if (policy === meta[1]) {
    missing.push(`${file.slice(OUT.length)} (script-src not in the expected form)`);
    continue;
  }
  writeFileSync(file, html.replace(meta[0], meta[0].replace(meta[1], policy)));
  pages += 1;
  most = Math.max(most, hashes.size);
}

if (missing.length) {
  console.error(`csp-hashes: no usable CSP tag on:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}
console.log(`csp-hashes: ${pages} pages locked to their own inline scripts (up to ${most} each)`);
