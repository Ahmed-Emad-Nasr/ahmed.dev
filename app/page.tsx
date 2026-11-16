/*
 * ═══ app/page.tsx — the HOME PAGE  ( URL: / ) ═══
 *
 * The portfolio: the pitch (who, roles, proof, experience) down to contact.
 * The blog, the teaching and the gallery are pages of their own
 * (app/blog/page.tsx, app/teaching/page.tsx, app/gallery/page.tsx — the map
 * of which section lives where is lib/routes.ts).
 * Section order follows the Sensei-Dev portfolio
 * (github.com/MostafaSensei106/Sensei-Dev, GPL-3.0).
 *
 * This file only ARRANGES the page. The content of each section lives in its
 * component (components/home/*) and its text/data in data/*:
 *
 *   Section on screen      Component                        Content / data
 *   ─────────────────────  ───────────────────────────────  ──────────────────────────
 *   Hero (top)             components/home/HeroSection      data/portfolio-data.ts, data/live-copy.ts
 *   Numbers strip          components/home/StatsBar         data/live-copy.ts (stats)
 *   Roles cards  #roles    components/home/RolesCards       inside the component (ROLES)
 *   Divider                components/ui/SlashDivider
 *   Projects     #work     components/home/WorkShowcase     data/portfolio-data.ts (`work`)
 *   Open source  #projects components/home/ProjectsGrid     data/portfolio-data.ts + GitHub API (build time)
 *   Contributions #contributions components/home/ContributionsGrid GitHub calendar (build time)
 *   Ticker band            components/ui/TickerStrip        data/about.ts (TICKER)
 *   Tools        #tools    components/home/ToolsSection     data/about.ts (from data/skills.ts)
 *   Daily drivers #uses    components/home/UsesSection      data/about.ts
 *   Experience   #experience components/home/ExperienceTimeline  data/experience.ts
 *   The path     #path     components/home/PathSection      data/about.ts
 *   Right now    #now      components/home/NowSection       data/about.ts
 *   Recommendations #testimonials components/home/Testimonials data/testimonials.ts
 *   Platforms    #platforms components/home/PlatformsSection data/platforms.ts (+ TryHackMe API)
 *   Process      #process  components/home/ProcessSection   data/about.ts
 *   FAQ          #faq      components/home/FaqSection       data/about.ts
 *   Contact      #contact  components/layout/ContactFooter
 *   Footer line            components/layout/FooterBar
 *
 * LOADING (as on Sensei-Dev): every section is a next/dynamic import — its
 * own JS file — and is rendered into the page's HTML, so the whole page is
 * there from the start and every #anchor works.
 * Off-screen animation loops pause (lib/perf/OffscreenAnimations.tsx).
 *
 * HOW TO EDIT
 *   • Reorder sections → move the blocks inside <main> below.
 *   • Add a section:
 *       1. create components/home/MySection.tsx (give its <section> an id),
 *       2. export it from components/home/dynamic.tsx (or blog/dynamic.tsx)
 *          with next/dynamic,
 *       3. add it here:  <MySection />
 *       4. optional: a navbar link → NAV_ITEMS in components/layout/SiteNav.tsx,
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
import { INTRO_SEEN_SCRIPT } from "@/lib/intro";
import {
  HeroSection,
  WorkShowcase,
  ExperienceTimeline,
  Testimonials,
  PlatformsSection,
  ToolsSection,
  UsesSection,
  PathSection,
  NowSection,
  FaqSection,
  ProcessSection,
  ProjectsGrid,
  ContactFooter,
  PaletteHint,
  SectionRail,
} from "@/components/home/dynamic";
import { ContributionsGrid } from "@/components/blog/dynamic";
import FooterBar from "@/components/layout/FooterBar";
import { getTryHackMeStats } from "@/lib/api/tryhackme";
import { getContributionStats } from "@/lib/api/contributions";
import { getRepoCards, type RepoCard } from "@/lib/api/github-repos";
import { FAQ } from "@/data/about";
import { PROFILE } from "@/data/profile";
import { STATIC_PLATFORMS, tryHackMePlatform } from "@/data/platforms";
import { LIVE_COPY } from "@/data/live-copy";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { knowledgeEducationItems } from "@/data/experience";
import { OG_IMAGE } from "@/lib/site";
import { KEYWORDS, PERSON_IMAGE, PERSON_REF, SITE_URL, WEBSITE_ID, jsonLd } from "@/lib/seo";
import { BLOG_ID, GALLERY_ID, TEACHING_ID } from "@/lib/page-ids";
import SlashDivider from "@/components/ui/SlashDivider";
import TickerStrip from "@/components/ui/TickerStrip";

/* <head> tags for the home page only (merged over app/layout.tsx's defaults).
   This title is used as-is: the layout's "%s | Ahmed Emad Nasr" template only
   applies to pages in sub-folders (the case pages), not to the root page. */
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
    types: { "application/rss+xml": [{ url: "/blog/feed.xml", title: "Ahmed Emad Nasr — Case Library" }] },
  },
  openGraph: {
    title: "Ahmed Emad Nasr | Information Security Officer",
    description:
      "GRC, SOC, incident response & DFIR, IAM and data security: case reports, projects and training by Ahmed Emad Nasr.",
    url: SITE_URL,
    type: "website",
    /* A page-level openGraph replaces the layout's whole object */
    siteName: "Ahmed Emad Nasr",
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
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
};

/* JSON-LD for search engines (invisible): this page is a ProfilePage about the
   person, with the experience list, the services offered, the blog and its
   videos, and the gallery. All generated from data/* — no need to edit it here.
   Kept lean on purpose: Next puts this text in the page TWICE (the <script>
   and the page data), so every case and every gallery image listed here was
   paid for twice on the first visit. The case pages and the images are
   already in sitemap.xml (with image and video entries), and each case page
   carries its own full TechArticle JSON-LD. */
function structuredData(repos: RepoCard[]) {
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
          ...(repos.length ? [{ "@id": `${SITE_URL}#projects` }] : []),
          { "@id": BLOG_ID },
          { "@id": TEACHING_ID },
          { "@id": `${SITE_URL}#faq` },
          { "@id": GALLERY_ID },
        ],
      },
      /* ── The questions section (data/about.ts → FAQ) ── */
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}#faq`,
        url: `${SITE_URL}#faq`,
        name: "Fair questions — Ahmed Emad Nasr",
        inLanguage: "en",
        about: PERSON_REF,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      /* ── The open-source repositories (lib/api/github-repos.ts) ── */
      ...(repos.length
        ? [
            {
              "@type": "ItemList",
              "@id": `${SITE_URL}#projects`,
              name: "Open-source repositories by Ahmed Emad Nasr",
              itemListElement: repos.map((repo, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "SoftwareSourceCode",
                  name: repo.title,
                  description: repo.description,
                  codeRepository: repo.url,
                  ...(repo.homepage ? { url: repo.homepage } : {}),
                  ...(repo.language ? { programmingLanguage: repo.language } : {}),
                  ...(repo.license ? { license: `https://spdx.org/licenses/${repo.license}.html` } : {}),
                  author: PERSON_REF,
                },
              })),
            },
          ]
        : []),
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

/* `async` because it runs at BUILD time (static export): it fetches the
   TryHackMe stats and the GitHub contribution calendar once, while
   `npm run build` runs, and bakes them into the page (TryHackMe falls back
   to the saved snapshot in data/platforms.ts if offline). */
export default async function Home() {
  const [thm, contributions, repos] = await Promise.all([
    getTryHackMeStats(),
    getContributionStats(PROFILE.contact.github),
    getRepoCards(),
  ]);

  return (
    <>
    <main id="main-content" className="relative w-full bg-background text-foreground overflow-x-clip">
      {/* The subtle background texture behind the whole page (globals.css .site-texture) */}
      <div className="site-texture fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(repos) }} />
      {/* Intro boot screen (covers the page for ~2s, then slides away) — on
          every full load; the script before it hides it when coming Back,
          before the first paint (lib/intro.ts) */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_SEEN_SCRIPT }} />
      <AppLoader />
      {/* No UI: handles #anchor arrivals, ?filter links, pre-rendering (lib/perf/PageEffects.tsx) */}
      <PageEffects />
      {/* Top navigation bar */}
      <SiteNav />
      {/* One-time "press Ctrl+K" hint toast (keyboard/mouse devices only) */}
      <PaletteHint />
      {/* Chapter rail on the right edge (1280px+) and the back-to-top button */}
      <SectionRail />

      {/* ═══ 01 · The pitch: who → roles → proof → experience ═══ */}
      {/* Hero: name, title, CTA buttons (Sensei-Dev's hero, GSAP entrance). Text comes from data/profile.ts + data/live-copy.ts */}
      <HeroSection
        description={LIVE_COPY.heroDescription}
        evidenceLabel={LIVE_COPY.heroEvidence}
        projectCount={PORTFOLIO_DATA.work.length}
        languageCodes={PORTFOLIO_DATA.languages.map((l) => l.code).join(" · ")}
      />
      {/* .tone-blue = this section uses the blue of the role cards instead of
          the red (app/globals.css). Red and blue sections alternate down the
          page; add or remove the wrapper to switch one. */}
      <div className="tone-blue">
        <StatsBar stats={LIVE_COPY.stats} />
      </div>
      <RolesCards />

      {/* Decorative divider with a label */}
      <SlashDivider label="01 // Evidence" japanese="証拠" origin="left" />

      {/* Projects grid — the curated list in data/portfolio-data.ts (`work`).
          Passed as a prop so the list travels in the page data, not in JS. */}
      <WorkShowcase items={PORTFOLIO_DATA.work} />

      {/* The GitHub repositories behind the projects (lib/api/github-repos.ts) */}
      <ProjectsGrid repos={repos} />

      {/* Upstream contributions + the GitHub year graph (right after the repos, as in Sensei-Dev) */}
      <div className="tone-blue">
        <ContributionsGrid stats={contributions} />
      </div>

      {/* A band of words drifting past (data/about.ts → TICKER) */}
      <TickerStrip />

      {/* What the work is done with: skill groups, then the daily tools (data/about.ts) */}
      <div className="tone-blue">
        <ToolsSection />
        <UsesSection />
      </div>

      {/* The id is on this wrapper because ExperienceTimeline's own <section> has none */}
      <div id="experience">
        <ExperienceTimeline />
      </div>

      {/* One line per year, then what's happening now (data/about.ts) */}
      <PathSection />
      <NowSection />


      {/* What others wrote: the LinkedIn recommendations (data/testimonials.ts);
          the students' feedback is on /teaching */}
      <div className="tone-blue">
        <Testimonials />
      </div>

      {/* Training platforms: TryHackMe as the big card (live stats), others from data/platforms.ts */}
      <div className="tone-blue">
        <PlatformsSection featured={tryHackMePlatform(thm)} thm={thm} others={STATIC_PLATFORMS} />
      </div>

      {/* How a security job runs: govern → protect → detect → respond */}
      <ProcessSection />

      {/* The questions recruiters ask first — an accordion (data/about.ts) */}
      <FaqSection />

      {/* Contact section + form */}
      <div id="contact" className="mt-20">
        <ContactFooter />
      </div>
    </main>
    {/* The last line of the page: ©, CV, security, license */}
    <footer className="relative bg-background px-6 md:px-20 pb-12">
      <div className="max-w-7xl mx-auto">
        <FooterBar />
      </div>
    </footer>
    </>
  );
}
