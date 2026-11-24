/*
 * archive.mjs — keep a public copy of the site on the Wayback Machine (weekly)
 *
 *   SITE_URL=https://… node scripts/archive.mjs
 *
 * Asks the Internet Archive (web.archive.org, free, no account) to save the
 * main pages and the CV PDF as they are today. Whatever happens to GitHub
 * Pages, a dated copy of the portfolio stays readable at
 * https://web.archive.org/web/*\/<site address>. Runs from the weekly "Live
 * site health" workflow. The Archive is slow and sometimes busy: each page
 * gets up to 2 minutes, and a page it can't save is only a warning — this
 * never fails anything.
 */

const SITE = (process.env.SITE_URL || "https://ahmed-emad-nasr.github.io/ahmed.dev").replace(/\/+$/, "");
const PAGES = ["/", "/blog", "/teaching", "/certificates", "/journey", "/gallery", "/cv", "/videos", "/training"];
const warn = (msg) => console.warn(`::warning::archive — ${msg}`);

const save = async (url) => {
  try {
    const res = await fetch(`https://web.archive.org/save/${url}`, {
      headers: { "User-Agent": "ahmed.dev weekly archive (GitHub Actions)" },
      signal: AbortSignal.timeout(120000),
    });
    if (res.ok) console.log(`archive — saved ${url}`);
    else warn(`${url}: the Archive answered HTTP ${res.status}`);
  } catch (e) {
    warn(`${url}: ${e.message}`);
  }
};

/* The CV PDF: its address is the "Download" link on /cv */
let pdf = null;
try {
  const html = await (await fetch(`${SITE}/cv`, { signal: AbortSignal.timeout(20000) })).text();
  const href = html.match(/href="([^"]+\.pdf)"/i)?.[1];
  if (href) pdf = new URL(href, `${SITE}/cv`).href;
} catch {
  /* the pages are still saved */
}

for (const path of PAGES) {
  await save(`${SITE}${path}`);
  /* The Archive limits how fast one visitor may ask */
  await new Promise((r) => setTimeout(r, 10000));
}
if (pdf) await save(pdf);
