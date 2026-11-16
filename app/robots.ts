/* /robots.txt — lets every crawler in and points it at the sitemap.

   ═══ app/robots.ts ═══
   Written at build time into out/robots.txt.
   Note: crawlers only read robots.txt at the ROOT of a domain — it works as
   is when the site is deployed from Ahmed-Emad-Nasr.github.io or a custom
   domain. From a project repo (a sub-path) it is ignored, and the sitemap is
   found through Search Console instead. */

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/* Required by the static export (see the same line in app/manifest.ts) */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
