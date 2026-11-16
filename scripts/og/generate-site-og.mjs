/*
 * scripts/og/generate-site-og.mjs — the site's share card.
 *
 * Renders scripts/og/og-image.html (1200×630) with Playwright into
 * public/og-image.jpg: the picture shown when the site's link is shared
 * (home page, and any page without a card of its own).
 *
 *   npm run og:site
 *
 * Edit the card in og-image.html (text, colours); the portrait is
 * scripts/og/portrait-cutout.webp — the photo with its background removed.
 */
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.log("og:site skipped: needs Playwright —  npm install && npx playwright install chromium");
  process.exit(0);
}

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
/* JPEG, not PNG: about a third of the size, and WhatsApp drops previews
   whose image is over ~300 KB */
const out = join(ROOT, "public/og-image.jpg");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(join(HERE, "og-image.html")).href, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: "jpeg", quality: 88 });
await browser.close();
console.log("share card → public/og-image.jpg");
