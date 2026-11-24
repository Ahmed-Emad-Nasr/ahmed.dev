/* What the command palette searches on /journey (every step, platform,
   recommendation and sport), fetched the first time it opens instead of
   being inlined into every page — like /palette-index.json for the cases.

   ═══ app/journey-index.json/route.ts → the file out/journey-index.json ═══
   Written at build time; read by components/layout/CommandPalette.tsx.
   Its content is JOURNEY_INDEX (data/journey-index.ts). */

import { JOURNEY_INDEX, JOURNEY_KINDS } from "@/data/journey-index";

/* Required by the static export: build this file once, at build time */
export const dynamic = "force-static";

export function GET() {
  return Response.json(JOURNEY_INDEX.map((i) => ({ slug: i.slug, title: i.title, kind: JOURNEY_KINDS[i.kind].label })));
}
