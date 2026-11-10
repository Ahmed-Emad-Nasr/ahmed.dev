/* /robots.txt — lets every crawler in and points it at the sitemap.

   ═══ app/robots.ts ═══
   Written at build time into out/robots.txt.
   Note: crawlers only read robots.txt at the ROOT of a domain. While the site
   lives under /ahmed.dev on github.io, the file is served at
   /ahmed.dev/robots.txt and the sitemap is found through Search Console and
   the <link rel="canonical"> tags instead; on a custom domain it works as is. */

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
