/*
 * ═══ app/page.tsx — the HOME PAGE  ( URL: / ) ═══
 *
 * The pitch (who, roles, proof, experience), contact, with a door to /blog.
 * Section order follows the Sensei-Dev portfolio
 * (github.com/MostafaSensei106/Sensei-Dev, GPL-3.0).
 *
 * This file only ARRANGES the page. The content of each section lives in its
 * component (components/home/*) and its text/data in data/*:
 *
 *   Section on screen      Component                        Content / data
 *   ─────────────────────  ───────────────────────────────  ──────────────────────────
 *   Hero (top)             components/home/HeroSection      data/portfolio-data.ts, data/live-copy.ts
 *   Roles cards  #roles    components/home/RolesCards       inside the component (ROLES)
 *   Numbers strip          components/home/StatsBar         data/live-copy.ts (stats)
 *   Divider                components/ui/SlashDivider
 *   Projects     #work     components/home/WorkShowcase     data/projects.ts (+ GitHub API)
 *   Experience   #experience components/home/ExperienceTimeline  data/experience.ts
 *   Teaching     #teaching components/home/TeachingSection  data/teaching.ts
 *   Platforms    #platforms components/home/PlatformsSection data/platforms.ts (+ TryHackMe API)
 *   Contact      #contact  components/layout/ContactFooter
 *
 * LOADING: the hero is its own chunk and is in the HTML. Every section after
 * it is wrapped in <LazySection>: NOT in the HTML; its code is fetched and the
 * section mounted in idle time or when the reader scrolls near it
 * (lib/perf/lazy.tsx). Off-screen animation loops pause (lib/perf/).
 *
 * HOW TO EDIT
 *   • Reorder sections → move the blocks inside <main> below.
 *   • Add a section:
 *       1. create components/home/MySection.tsx (give its <section> an id),
 *       2. export it from components/home/dynamic.tsx with next/dynamic,
 *       3. add it here:  <LazySection id="my-id" size="lazy-h-my">
 *                          <MySection />
 *                        </LazySection>
 *       4. add `.lazy-h-my { --lazy-h: <height>px; }` in app/globals.css
 *          (its rough height on phone / 48rem / 64rem — keeps scrolling and
 *          #anchor links accurate before it loads),
 *       5. optional: a navbar link → NAV_ITEMS in components/layout/SiteNav.tsx,
 *          and a command palette entry → lib/library-data.ts.
 *   • Remove a section → delete its block here (and its navbar link).
 *   • Page title / description for this page → `metadata` below.
 */

import type { Metadata } from "next";
import { RolesCards } from "@/components/home/RolesCards";
import StatsBar from "@/components/home/StatsBar";
import SiteNav from "@/components/layout/SiteNav";
import PageEffects from "@/lib/perf/PageEffects";
import AppLoader from "@/components/layout/AppLoader";
import {
  HeroSection,
  WorkShowcase,
  ExperienceTimeline,
  TeachingSection,
  PlatformsSection,
  ContactFooter,
  MobileActionBar,
  PaletteHint,
} from "@/components/home/dynamic";
import { getTryHackMeStats } from "@/lib/api/tryhackme";
import { getSyncedWorkItems } from "@/lib/api/github-repos";
import { STATIC_PLATFORMS, tryHackMePlatform } from "@/data/platforms";
import { LIVE_COPY } from "@/data/live-copy";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { knowledgeEducationItems } from "@/data/experience";
import { OG_IMAGE } from "@/lib/site";
import { KEYWORDS, PERSON_IMAGE, PERSON_REF, SITE_URL, WEBSITE_ID, jsonLd } from "@/lib/seo";
import { normalizePublicHref } from "@/lib/shared";
import LazySection from "@/lib/perf/lazy";
import { homeForwardScript } from "@/lib/routes";
import SlashDivider from "@/components/ui/SlashDivider";

/* <head> tags for the home page only (merged over app/layout.tsx's defaults).
   This title is used as-is: the layout's "%s | Ahmed Emad Nasr" template only
   applies to pages in sub-folders (/blog, /gallery…), not to the root page. */
export const metadata: Metadata = {
  title: "Ahmed Emad Nasr | Information Security Officer | GRC, SOC, DFIR & IAM",
  /* ≤160 characters: search results cut anything longer mid-sentence */
  description:
    "Information security officer: GRC & compliance, SOC, incident response & DFIR, malware analysis, IAM and data security — with real reports behind each.",
  keywords: [
    ...KEYWORDS.identity,
    "information security officer portfolio",
    "cybersecurity portfolio",
    "GRC analyst portfolio",
    "ISO 27001 PCI DSS gap assessment",
    "IAM and data security",
    "SOC analyst portfolio",
    "incident response reports",
    "DFIR case studies",
    "threat hunting projects",
    "malware analysis reports",
    "MITRE ATT&CK coverage",
    "Wazuh SIEM tutorials",
    "eJPT certified",
    ...KEYWORDS.place,
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ahmed Emad Nasr | Information Security Officer",
    description:
      "GRC, SOC, incident response & DFIR, IAM and data security: case reports, projects and training by Ahmed Emad Nasr.",
    url: SITE_URL,
    type: "website",
    /* A page-level openGraph replaces the layout's whole object */
    siteName: "ahmed.dev",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: "@0x3omda",
    creator: "@0x3omda",
    title: "Ahmed Emad Nasr | Information Security Officer",
    description:
      "GRC assessments, SOC investigations, DFIR and malware analysis, IAM and data security — the work and the reports.",
    images: [OG_IMAGE.url],
  },
};

/* JSON-LD for search engines (invisible): this page is a ProfilePage about the
   person, with the experience list and the services offered. The experience
   list is generated from data/experience.ts — no need to edit it here. */
function structuredData() {
  return jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        /* The one ProfilePage — Person.mainEntityOfPage in layout.tsx points here */
        "@type": "ProfilePage",
        "@id": `${SITE_URL}#profilepage`,
        url: SITE_URL,
        name: "Ahmed Emad Nasr | Information Security Officer",
        description: "The portfolio of Ahmed Emad Nasr, information security officer: GRC, security operations, incident response, forensics, malware analysis, IAM and data security, with case reports, projects, videos and certifications.",
        inLanguage: "en",
        mainEntity: PERSON_REF,
        about: PERSON_REF,
        author: PERSON_REF,
        isPartOf: { "@id": WEBSITE_ID },
        primaryImageOfPage: { "@type": "ImageObject", url: PERSON_IMAGE },
        image: [PERSON_IMAGE, OG_IMAGE.url],
        hasPart: [
          { "@id": `${SITE_URL}#experience-list` },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}#experience-list`,
        name: "Experience, education and training",
        itemListElement: knowledgeEducationItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          /* Jobs as roles at an organisation, education as credentials */
          item:
            item.kind === "education"
              ? {
                  "@type": "EducationalOccupationalCredential",
                  name: item.tag,
                  description: item.desc,
                  credentialCategory: /bachelor|degree/i.test(item.tag) ? "degree" : "certificate",
                  recognizedBy: { "@type": "EducationalOrganization", name: item.subTag, url: item.subTagHyperlink },
                  validFrom: item.startDate,
                  ...("endDate" in item && item.endDate ? { validUntil: item.endDate } : {}),
                }
              : {
                  "@type": "OrganizationRole",
                  roleName: item.tag,
                  description: item.desc,
                  startDate: item.startDate,
                  ...("endDate" in item && item.endDate ? { endDate: item.endDate } : {}),
                  memberOf: { "@type": "Organization", name: item.subTag, url: item.subTagHyperlink },
                },
        })),
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}#service-infosec`,
        name: "Information Security: GRC, Security Operations and Incident Response",
        description: "Governance, risk and compliance assessments, SOC monitoring and triage, incident response and digital forensics, malware analysis, identity and access management, data security, and security training.",
        provider: PERSON_REF,
        areaServed: [{ "@type": "Country", name: "Egypt" }, "Worldwide"],
        availableLanguage: ["en"],
        serviceType: ["Governance, Risk & Compliance", "SOC Monitoring", "Incident Response", "Digital Forensics", "Malware Analysis", "Identity & Access Management", "Data Security", "Security Training"],
        url: `${SITE_URL}#roles`,
      },
    ],
  });
}

/* Old links to the blog's sections on this page (/#cases …) open /blog */
const FORWARD_SCRIPT = homeForwardScript(normalizePublicHref("/").replace(/\/$/, ""));

/* `async` because it runs at BUILD time (static export): it fetches the
   TryHackMe stats and the GitHub repos once, while `npm run build` runs, and
   bakes the result into the page. Both fall back to saved data if offline. */
export default async function Home() {
  const [thm, workItems] = await Promise.all([getTryHackMeStats(), getSyncedWorkItems()]);

  return (
    <main id="main-content" className="relative w-full bg-background text-foreground overflow-x-clip">
      {/* The subtle background texture behind the whole page (globals.css .site-texture) */}
      <div className="site-texture fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
      <script dangerouslySetInnerHTML={{ __html: FORWARD_SCRIPT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      {/* Intro boot screen (covers the page for ~2s, then slides away) */}
      <AppLoader />
      {/* No UI: handles #anchor arrivals, ?filter links, pre-rendering (lib/perf/PageEffects.tsx) */}
      <PageEffects />
      {/* Top navigation bar */}
      <SiteNav />
      {/* Phone-only bottom bar (CV / cases / contact buttons) */}
      <MobileActionBar />
      {/* One-time "press Ctrl+K" hint toast (keyboard/mouse devices only) */}
      <PaletteHint />

      {/* ═══ 01 · The pitch: who → roles → proof → experience ═══ */}
      {/* Hero: name, title, CTA buttons, mascot. Text comes from data/live-copy.ts */}
      <HeroSection
        description={LIVE_COPY.heroDescription}
        evidenceLabel={LIVE_COPY.heroEvidence}
        projectCount={PORTFOLIO_DATA.work.length}
        languageCodes={PORTFOLIO_DATA.languages.map((l) => l.code).join(" · ")}
      />
      {/* LazySection props:
            id   → the #anchor (kept on the placeholder, so /#roles works before it loads)
            size → the placeholder's height class from app/globals.css (.lazy-h-*) */}
      <LazySection id="roles" size="lazy-h-roles">
        <RolesCards />
      </LazySection>
      {/* .tone-blue = this section uses the blue of the role cards instead of
          the red (app/globals.css). Red and blue sections alternate down the
          page; add or remove the wrapper to switch one. */}
      <div className="tone-blue">
        <LazySection size="lazy-h-stats">
          <StatsBar stats={LIVE_COPY.stats} />
        </LazySection>
      </div>

      {/* Decorative divider with a label */}
      <SlashDivider label="01 // Evidence" japanese="証拠" origin="left" />

      {/* Projects grid. workItems = data/projects.ts merged with GitHub repo info */}
      <LazySection id="work" size="lazy-h-work">
        <WorkShowcase items={workItems} />
      </LazySection>
      {/* The id is on this wrapper because ExperienceTimeline's own <section> has none */}
      <div id="experience">
        <LazySection size="lazy-h-experience">
          <ExperienceTimeline />
        </LazySection>
      </div>

      <LazySection id="teaching" size="lazy-h-teaching">
        <TeachingSection />
      </LazySection>

      {/* Training platforms: TryHackMe as the big card (live stats), others from data/platforms.ts */}
      <div className="tone-blue">
        <LazySection id="platforms" size="lazy-h-platforms">
          <PlatformsSection featured={tryHackMePlatform(thm)} thm={thm} others={STATIC_PLATFORMS} />
        </LazySection>
      </div>

      {/* Contact section + form + footer bar (only on the home page; other pages end with FooterBar) */}
      <div id="contact" className="mt-20">
        <LazySection size="lazy-h-contact">
          <ContactFooter />
        </LazySection>
      </div>
    </main>
  );
}
