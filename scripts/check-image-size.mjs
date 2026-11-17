/*
 * check-image-size.mjs — warns about any image in public/ over LIMIT_KB.
 * One heavy screenshot can outweigh the rest of a page, and nothing else
 * notices: the build passes, the image just loads slowly on a phone.
 *
 *   npm run check:images
 *
 * It only warns (exit code 0), so a deploy never stops over it. In GitHub
 * Actions each file shows up as a yellow warning on the run's summary page.
 * Fix: convert with the WebP tool (quality ~80) or resize to the width the
 * site shows it at (case screenshots: 1600 px is plenty).
 */

import { readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const LIMIT_KB = 300;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const IMAGE = /\.(webp|avif|jpe?g|png|gif|svg)$/i;

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* files(path);
    else if (IMAGE.test(name)) yield path;
  }
}

const heavy = [];
let count = 0;
for (const file of files(PUBLIC)) {
  count += 1;
  const kb = statSync(file).size / 1024;
  if (kb > LIMIT_KB) heavy.push([relative(ROOT, file).replaceAll("\\", "/"), Math.round(kb)]);
}

heavy.sort((a, b) => b[1] - a[1]);
if (!heavy.length) {
  console.log(`✔ ${count} images, none over ${LIMIT_KB} KB`);
} else {
  const ci = process.env.GITHUB_ACTIONS === "true";
  console.log(`⚠ ${heavy.length} of ${count} images are over ${LIMIT_KB} KB:`);
  for (const [path, kb] of heavy) {
    console.log(ci ? `::warning file=${path}::${kb} KB (limit ${LIMIT_KB} KB) — compress or resize it` : `  ${kb} KB  ${path}`);
  }
}
