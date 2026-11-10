/* What the command palette searches (every case), fetched the first time it
   opens instead of being inlined into every page

   ═══ app/palette-index.json/route.ts → the file out/palette-index.json ═══
   Written at build time; read by components/layout/CommandPalette.tsx.
   Its content (caseIndex) is built in lib/library-data.ts from data/cases.ts. */

import { caseIndex } from "@/lib/library-data";

/* Required by the static export: build this file once, at build time */
export const dynamic = "force-static";

export function GET() {
  return Response.json(caseIndex);
}
