/* The case library's data (every case card, the filter facets, the counts),
   as its own file instead of inside the home page's HTML

   ═══ app/library.json/route.ts → the file out/library.json ═══
   Written at build time; fetched together with the library's code by
   components/blog/dynamic.tsx (LazyCaseLibrary) — in idle time after the
   page is up, or as the reader nears the library. About 100 KB of the home
   page's first download used to be this data.
   Its content (libraryData) is built in lib/library-data.ts from data/*. */

import { libraryData } from "@/lib/library-data";

/* Required by the static export: build this file once, at build time */
export const dynamic = "force-static";

export function GET() {
  return Response.json(libraryData);
}
