/*
 * lib/routes.ts — the site's pages.
 *
 *   /             THE WHOLE PORTFOLIO, one page: pitch, contact, then the
 *                 blog (#blog: cases, videos, ATT&CK, rules, triage, lab,
 *                 contributions) and the gallery (#gallery) at the end
 *   /blog/<id>    one page per case (app/blog/[slug]/page.tsx)
 *
 * /blog and /gallery used to be pages of their own. Old links to them
 * (/blog?q=wazuh#cases, /gallery?cert=14 …) land on the 404 page, whose
 * legacyPageForwardScript() sends them to the same place on the home page
 * before anything paints.
 */

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

/**
 * Inline script for the 404 page: /blog… and /gallery… were pages before the
 * site became one page. Keeps the filters (?q=…, ?cert=…) and the anchor;
 * with no anchor, opens the matching part (#blog / #gallery). `base` is the
 * deploy prefix ("/ahmed.dev" in production).
 */
export function legacyPageForwardScript(base: string): string {
  const b = JSON.stringify(base);
  return `(function(){try{var p=location.pathname.slice(${b}.length).replace(/\\/+$/,""),t=p==="/blog"?"#blog":p==="/gallery"?"#gallery":"";if(t)location.replace(${b}+"/"+location.search+(location.hash||t));}catch(e){}})();`;
}
