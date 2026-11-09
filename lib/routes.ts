/*
 * lib/routes.ts — which page each section lives on.
 *
 *   /       the portfolio: pitch and contact
 *   /blog   the evidence: start here, the case
 *           library, videos, ATT&CK coverage, detection rules, triage
 *   /gallery the visual proof archive & all 48 certificates
 *
 * Everything that links to a section by id (nav, command palette,
 * g-shortcuts, the stats bar, filter links) asks this file where it is.
 * Old links to the blog's sections on the home page (/#cases,
 * /?q=wazuh#cases, /#case-…, /#attack …) are forwarded by
 * homeForwardScript() before the home page paints.
 */

type SitePage = "/" | "/blog" | "/gallery";

/** Section ids that live on /blog (plus every #case-… and #tactic-… anchor) */
const BLOG_IDS = new Set(["start-here", "cases", "videos", "youtube", "attack", "detections", "triage", "lab", "process", "contributions"]);
const BLOG_PREFIX = /^(case|tactic)-/;

/** Section ids that live on /gallery */
const GALLERY_IDS = new Set(["art", "gallery-start-here", "all-certificates", "visual-archive"]);

/** Search params that belong to the case library's filters */
export const LIBRARY_PARAMS = ["q", "cat", "tools", "kind", "sort", "view"] as const;

/** The page a section id lives on */
export function pageOf(id: string): SitePage {
  if (GALLERY_IDS.has(id)) return "/gallery";
  return BLOG_IDS.has(id) || BLOG_PREFIX.test(id) ? "/blog" : "/";
}

/**
 * Inline script for every page (layout.tsx). With a basePath, Next's static
 * export fetches the home page's data from "/ahmed.dev.txt" — outside the
 * site, so on GitHub Pages every client-side trip back home 404'd and fell
 * back to a full reload. The file really is "/ahmed.dev/index.txt"; this
 * points that one request there. `base` is the deploy prefix.
 */
export function homeDataFixScript(base: string): string {
  if (!base) return "";
  const bad = JSON.stringify(`${base}.txt`);
  const good = JSON.stringify(`${base}/index.txt`);
  return `(function(){var f=window.fetch;if(!f)return;window.fetch=function(i,o){try{var r=typeof i==="string"||i instanceof URL,u=new URL(r?String(i):i.url,location.href);if(u.origin===location.origin&&u.pathname===${bad}){u.pathname=${good};i=r?u.href:new Request(u.href,i)}}catch(e){}return f.call(this,i,o)}})();`;
}

/**
 * Inline script for the home page: an old link to one of the blog's or
 * gallery's sections opens the target page with the same filters and anchor.
 * Runs before paint, so the home page never flashes first. `base` is the
 * deploy prefix ("/ahmed.dev" in production).
 */
export function homeForwardScript(base: string): string {
  const ids = JSON.stringify([...BLOG_IDS]);
  const gIds = JSON.stringify([...GALLERY_IDS]);
  const params = JSON.stringify(LIBRARY_PARAMS);
  return `(function(){try{var h=location.hash.slice(1),s=location.search,b=${ids}.indexOf(h)>-1||/^(case|tactic)-/.test(h);
if(${gIds}.indexOf(h)>-1){location.replace(${JSON.stringify(base)}+"/gallery"+s+(h==="art"?"":location.hash));return}
if(!b&&s){var q=new URLSearchParams(s),k=${params};for(var i=0;i<k.length;i++)if(q.has(k[i])){b=true;break}}
if(b)location.replace(${JSON.stringify(base)}+"/blog"+s+location.hash);}catch(e){}})();`;
}
