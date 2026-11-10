/* Every case's screenshot list, fetched the first time a gallery opens
   (the cards only carry a cover and a count).

   ═══ app/case-screenshots.json/route.ts → the file out/case-screenshots.json ═══
   A folder named "x.json" with a route.ts makes Next write a static JSON file
   at build time. Read by components/blog/CaseLibrarySection.tsx. Nothing to
   edit here: screenshots are listed in data/cases.ts. */

import { caseScreenshotsByEvidenceId } from "@/data/cases";

/* Required by the static export: build this file once, at build time */
export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(caseScreenshotsByEvidenceId), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
