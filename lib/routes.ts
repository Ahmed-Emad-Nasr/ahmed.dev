/*
 * lib/routes.ts — the site's pages, and which page each section lives on.
 *
 *   /             the portfolio: hero, what I do, projects, tools, experience,
 *                 the path, recommendations, platforms, contact
 *   /blog         the case library, videos, ATT&CK, detection rules, triage,
 *                 home lab (app/blog/page.tsx)
 *   /blog/<id>    one page per case (app/blog/[slug]/page.tsx)
 *   /teaching     the course, where it was taught, student feedback
 *                 (app/teaching/page.tsx)
 *   /gallery      the personal photos (app/gallery/page.tsx)
 *   /certificates every certificate, one page each (app/certificates)
 *
 * SECTION_PAGE below is the one place that knows where a section lives: the
 * navbar, the command palette, the g-shortcuts and old /#cases-style links
 * all ask it. Moving a section to another page = change it here.
 */

/** The page each section id is on. Not listed = the home page. */
export const SECTION_PAGE: Readonly<Record<string, "/blog" | "/teaching" | "/gallery" | "/certificates">> = {
  blog: "/blog",
  cases: "/blog",
  videos: "/blog",
  youtube: "/blog",
  playlists: "/blog",
  attack: "/blog",
  detections: "/blog",
  triage: "/blog",
  lab: "/blog",
  teaching: "/teaching",
  "student-feedback": "/teaching",
  gallery: "/gallery",
  art: "/gallery",
  certificates: "/certificates",
  /* the certificates used to be a section of the gallery: old #all-certificates links */
  "all-certificates": "/certificates",
};

/** "/blog" for "cases", "/" for "work" */
const pageOfSection = (id: string): string => SECTION_PAGE[id] ?? "/";

/* The home page's sections (components/home/*) */
const HOME_SECTIONS = new Set([
  "home", "services", "roles", "process", "work", "projects", "contributions", "tools", "uses",
  "experience", "path", "now", "athlete", "testimonials", "platforms", "faq", "contact",
]);

/** The page of a KNOWN section or case card (#case-…), or null for any other id */
export function knownPageOf(id: string): string | null {
  if (id.startsWith("case-")) return "/blog";
  if (SECTION_PAGE[id]) return SECTION_PAGE[id];
  return HOME_SECTIONS.has(id) ? "/" : null;
}

/**
 * Where a section link goes, on whichever page holds it:
 *   "#work" → "/#work"   "#cases" → "/blog#cases"   "?q=x#cases" → "/blog?q=x#cases"
 *   "?cert=3#all-certificates" → "/gallery?cert=3#all-certificates"
 */
export function sectionHref(target: string): string {
  const at = target.indexOf("#");
  const id = at >= 0 ? decodeURIComponent(target.slice(at + 1)) : "";
  return `${pageOfSection(id)}${target}`;
}

/** Search params that belong to the case library's filters */
export const LIBRARY_PARAMS = ["q", "cat", "tools", "kind", "sort", "view"] as const;

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
