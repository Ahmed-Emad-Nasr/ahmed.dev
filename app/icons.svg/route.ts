/* Every brand icon and logo of the site in one SVG file ( /icons.svg )

   ═══ app/icons.svg/route.ts → the file out/icons.svg ═══
   Written at build time. Each drawing is a <symbol>:
     #fa-github, #fa-linkedin …  ← components/ui/icon-data.ts (BrandIcons)
     #logo-tryhackme, #logo-cisco … ← data/logo-paths.ts (OrgLogo)
   The page draws them with <svg><use href="…/icons.svg#id" /></svg>: the
   browser downloads this file once and caches it, instead of every page
   (and its page data) carrying the long paths — a single logo was 8 KB.
   Nothing to edit here: add icons in those two files. */

import { ICONS } from "@/components/ui/icon-data";
import { BRAND_PATHS } from "@/data/logo-paths";

/* Required by the static export: build this file once, at build time */
export const dynamic = "force-static";

const symbol = (id: string, viewBox: string, d: string) => `<symbol id="${id}" viewBox="${viewBox}"><path d="${d}"/></symbol>`;

export function GET() {
  const fa = Object.entries(ICONS).map(([name, [w, h, d]]) => symbol(name, `0 0 ${w} ${h}`, d));
  const logos = Object.entries(BRAND_PATHS).map(([key, d]) => symbol(`logo-${key}`, "0 0 24 24", d));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg">${[...fa, ...logos].join("")}</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
}
