/*
 * ═══ app/journey/page.tsx — the journey  ( URL: /journey ) ═══
 *
 * Everything beyond the CV, moved off the home page: the path year by year,
 * the training platforms, what the people he worked with wrote, and the
 * track. Every item opens its own page, /journey/<slug>
 * (app/journey/[slug]/page.tsx), with all the details the site holds about
 * it — as each certificate and each case has.
 *
 *   Section on screen            Component                                Data
 *   ───────────────────────────  ───────────────────────────────────────  ─────────────────────────────
 *   Title + jump links #journey  (below)                                  data/journey-index.ts (counts)
 *   The Path.        #path       components/journey/PathSection           data/about.ts (PATH)
 *   Proving Grounds. #platforms  components/journey/PlatformsSection      data/platforms.ts (+ TryHackMe API)
 *   In Their Words.  #testimonials components/journey/Testimonials        data/testimonials.ts
 *   Off the Clock.   #athlete    components/journey/AthleteSection        data/about.ts (ATHLETICS)
 *
 * Old links to these sections on the home page (/#path, /#platforms …) land
 * here by themselves (SECTION_PAGE in lib/routes.ts).
 */

import PageShell from "@/components/layout/PageShell";
import PageEffects from "@/lib/perf/PageEffects";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import { KanjiWatermark } from "@/components/ui/kit";
import { AthleteSection, PathSection, PlatformsSection, Testimonials } from "@/components/journey/dynamic";
import { getTryHackMeStats } from "@/lib/api/tryhackme";
import { STATIC_PLATFORMS, tryHackMePlatform } from "@/data/platforms";
import { JOURNEY_INDEX, JOURNEY_KINDS, journeyPath, type JourneyKind } from "@/data/journey-index";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { pageMetadata } from "@/lib/page-meta";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords, withAudience } from "@/lib/seo";
import { JOURNEY_ID, JOURNEY_URL } from "@/lib/page-ids";

const count = (kind: JourneyKind) => JOURNEY_INDEX.filter((i) => i.kind === kind).length;

const TITLE = "Ahmed Emad Nasr — The Journey: path, platforms, recommendations & the track";
const DESCRIPTION = withAudience(
  `Beyond the CV: Ahmed Emad Nasr's path year by year (${count("path")} milestones), the training platforms he practises on (TryHackMe, Hack The Box, CyberDefenders, CyberTalents), recommendations quoted word for word, and his running for Al Ahly SC — each with its own page of details`,
  300,
);

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/journey",
  keywords: pageKeywords(KEYWORDS.journey, KEYWORDS.athlete),
  share: pageShareImage("journey", "Ahmed Emad Nasr — the journey"),
});

const STRUCTURED_DATA = jsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": JOURNEY_ID,
      url: JOURNEY_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "en",
      about: PERSON_REF,
      author: PERSON_REF,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: JOURNEY_INDEX.length,
        itemListElement: JOURNEY_INDEX.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(journeyPath(item.slug)),
          name: item.title,
        })),
      },
    },
    breadcrumbs([
      ["Ahmed Emad Nasr", absoluteUrl("/")],
      ["The Journey", JOURNEY_URL],
    ]),
  ],
});

/* The four parts of the page, in order — the jump links under the title */
const PARTS: JourneyKind[] = ["path", "platform", "recommendation", "sport"];

/* `async`: the TryHackMe numbers are read at build time (the saved snapshot
   in data/platforms.ts when the site can't be reached) */
export default async function JourneyPage() {
  const thm = await getTryHackMeStats();
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }} />
      <PageEffects />

      <section id="journey" aria-labelledby="journey-title" className="relative px-6 md:px-20 pt-36 md:pt-44 pb-4 overflow-hidden">
        {/* 旅路 — the journey */}
        <KanjiWatermark chars="旅路" side="right" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            id="journey-title"
            as="h1"
            eyebrow="Ahmed Emad Nasr // Beyond the CV"
            japanese="旅路"
            titleA="The"
            titleB="Journey."
            size="lg"
            description="How the work came together year by year, where I train, what the people I worked with wrote, and the track. Every item opens its own page with the roles, certificates, photos and links behind it."
            aside={
              <CounterChip
                stats={[
                  { value: String(count("path")).padStart(2, "0"), label: "Milestones" },
                  { value: String(count("platform")).padStart(2, "0"), label: "Platforms" },
                ]}
              />
            }
          />
          <nav aria-label="On this page" className="-mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {PARTS.map((kind) => (
              <a
                key={kind}
                href={`#${JOURNEY_KINDS[kind].anchor}`}
                className="group inline-flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-foreground/70 hover:text-primary-ink transition-colors"
              >
                <span className="text-primary-ink" aria-hidden="true">
                  →
                </span>
                {JOURNEY_KINDS[kind].label}
                <span className="text-foreground/60">· {count(kind)}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* One line per year — each opens its own page (data/about.ts → PATH) */}
      <PathSection />

      {/* Training platforms: TryHackMe as the big card (live stats), others from data/platforms.ts */}
      <div className="tone-blue">
        <PlatformsSection featured={tryHackMePlatform(thm)} thm={thm} others={STATIC_PLATFORMS} />
      </div>

      {/* What others wrote: the LinkedIn recommendations (data/testimonials.ts);
          the students' feedback is on /teaching */}
      <div className="tone-blue">
        <Testimonials />
      </div>

      {/* The athlete: Al Ahly SC, modern pentathlon (data/about.ts → ATHLETICS) */}
      <AthleteSection />
    </PageShell>
  );
}
