/*
 * ═══ app/page.tsx — the HOME PAGE  ( URL: / ) ═══
 *
 * THE WHOLE SITE IS THIS ONE PAGE: the pitch (who, roles, proof,
 * experience), contact, then the blog (case library, videos, ATT&CK, rules,
 * triage, home lab, contributions) and the gallery at the very end. Only the
 * single case pages (/blog/<id>, app/blog/[slug]/page.tsx) are separate.
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
 *   Projects     #work     components/home/WorkShowcase     data/portfolio-data.ts (`work`)
 *   Experience   #experience components/home/ExperienceTimeline  data/experience.ts
 *   Teaching     #teaching components/home/TeachingSection  data/teaching.ts
 *   Testimonials #testimonials components/home/Testimonials  data/testimonials.ts
 *   Platforms    #platforms components/home/PlatformsSection data/platforms.ts (+ TryHackMe API)
 *   Contact      #contact  components/layout/ContactFooter
 *   ── Blog ──   #blog     components/ui/AreaIntro          BLOG_DESCRIPTION below
 *   Cases/Videos #cases    components/blog/CaseLibrarySection data/cases.ts, case-details.ts, youtube.ts
 *   ATT&CK       #attack   components/blog/AttackCoverage   data/attack.ts (computed from cases)
 *   Rules        #detections components/blog/DetectionLibrary data/detection-rules.ts
 *   Triage       #triage   components/blog/TriageChallenge  inside the component
 *   Home lab     #lab      components/home/HomeLab          inside the component
 *   Contributions #contributions components/home/ContributionsGrid GitHub calendar (build time)
 *   ── Gallery ── #gallery components/gallery/ArtGallery    data/certifications.ts, portfolio-data.ts
 *   Footer line            components/layout/FooterBar
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
 *       2. export it from components/home/dynamic.tsx (or blog/dynamic.tsx)
 *          with next/dynamic,
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
import { INTRO_SEEN_SCRIPT } from "@/lib/intro";
import {
  HeroSection,
  WorkShowcase,
  ExperienceTimeline,
  TeachingSection,
  Testimonials,
  PlatformsSection,
  ContactFooter,
  PaletteHint,
} from "@/components/home/dynamic";
import {
  AreaIntro,
  CaseLibrarySection,
  HomeLab,
  LazyAttackCoverage,
  LazyContributions,
  LazyDetectionLibrary,
  LazyTriage,
} from "@/components/blog/dynamic";
import { ArtGallery } from "@/components/gallery/dynamic";
import FooterBar from "@/components/layout/FooterBar";
import { getTryHackMeStats } from "@/lib/api/tryhackme";
import { getContributionStats } from "@/lib/api/contributions";
import { attackCoverage, libraryCounts, libraryData } from "@/lib/library-data";
import { blogYoutubePlaylists, blogYoutubeVideos } from "@/data/youtube";
import { PROFILE } from "@/data/profile";
import { STATIC_PLATFORMS, tryHackMePlatform } from "@/data/platforms";
import { LIVE_COPY } from "@/data/live-copy";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { knowledgeEducationItems } from "@/data/experience";
import { OG_IMAGE, summarize } from "@/lib/site";
import {
  CHANNEL_ID, KEYWORDS, PERSON_IMAGE, PERSON_REF, SITE_URL, WEBSITE_ID, jsonLd, youtubeEmbed, youtubeThumb, youtubeWatch,
} from "@/lib/seo";
import LazySection from "@/lib/perf/lazy";
import SlashDivider from "@/components/ui/SlashDivider";

/* The blog part's intro text (under "The Blog.") */
const BLOG_DESCRIPTION =
  "Real security work, written up so anyone can follow it: what was attacked, what I did about it and how to stop it next time. Each case opens with a plain summary; the technical detail — reports, detection rules, MITRE ATT&CK — is underneath for those who want it.";

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
   person, with the experience list, the services offered, the blog and its
   videos, and the gallery. All generated from data/* — no need to edit it here.
   Kept lean on purpose: Next puts this text in the page TWICE (the <script>
   and the page data), so every case and every gallery image listed here was
   paid for twice on the first visit. The case pages and the images are
   already in sitemap.xml (with image and video entries), and each case page
   carries its own full TechArticle JSON-LD. */
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
          { "@id": `${SITE_URL}#blog` },
          { "@id": `${SITE_URL}#gallery` },
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
      /* ── The blog part ── */
      {
        "@type": "Blog",
        "@id": `${SITE_URL}#blog`,
        url: `${SITE_URL}#blog`,
        name: "Ahmed Emad Nasr — Blog",
        description: BLOG_DESCRIPTION,
        author: PERSON_REF,
        publisher: PERSON_REF,
        isPartOf: { "@id": WEBSITE_ID },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}#videos`,
        name: "Cybersecurity video tutorials by Ahmed Emad Nasr",
        numberOfItems: blogYoutubeVideos.length,
        itemListElement: blogYoutubeVideos.map((video, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "VideoObject",
            "@id": `${youtubeWatch(video.videoId)}#video`,
            name: video.title,
            description: summarize(video.description ?? video.title, 160),
            thumbnailUrl: [youtubeThumb(video.videoId)],
            uploadDate: video.publishedAt,
            embedUrl: youtubeEmbed(video.videoId),
            url: youtubeWatch(video.videoId),
            inLanguage: "en",
            creator: PERSON_REF,
            publisher: { "@id": CHANNEL_ID },
          },
        })),
      },
      ...blogYoutubePlaylists.map((playlist) => ({
        "@type": "CreativeWorkSeries",
        "@id": `${playlist.sourceUrl.split("&")[0]}#series`,
        name: playlist.title,
        description: playlist.description,
        url: playlist.sourceUrl.split("&")[0],
        ...(playlist.thumbnailVideoId ? { image: youtubeThumb(playlist.thumbnailVideoId) } : {}),
        inLanguage: "en",
        author: PERSON_REF,
        publisher: { "@id": CHANNEL_ID },
      })),
      /* ── The gallery part (its images are listed in sitemap.xml) ── */
      {
        "@type": "ImageGallery",
        "@id": `${SITE_URL}#gallery`,
        url: `${SITE_URL}#gallery`,
        name: "Proof gallery — Ahmed Emad Nasr",
        description: "Degree, certificates, course records and photos from classrooms and security events.",
        about: PERSON_REF,
        author: PERSON_REF,
      },
    ],
  });
}

/* `async` because it runs at BUILD time (static export): it fetches the
   TryHackMe stats and the GitHub contribution calendar once, while
   `npm run build` runs, and bakes them into the page (TryHackMe falls back
   to the saved snapshot in data/platforms.ts if offline). */
export default async function Home() {
  const [thm, contributions] = await Promise.all([getTryHackMeStats(), getContributionStats(PROFILE.contact.github)]);

  return (
    <>
    <main id="main-content" className="relative w-full bg-background text-foreground overflow-x-clip">
      {/* The subtle background texture behind the whole page (globals.css .site-texture) */}
      <div className="site-texture fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      {/* Intro boot screen (covers the page for ~2s, then slides away) — once
          per visit: the script before it hides it on a reload or on coming
          back, before the first paint (lib/intro.ts) */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_SEEN_SCRIPT }} />
      <AppLoader />
      {/* No UI: handles #anchor arrivals, ?filter links, pre-rendering (lib/perf/PageEffects.tsx) */}
      <PageEffects />
      {/* Top navigation bar */}
      <SiteNav />
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

      {/* Projects grid — the curated list in data/portfolio-data.ts (`work`).
          Passed as a prop so the list travels in the page data, not in JS. */}
      <LazySection id="work" size="lazy-h-work">
        <WorkShowcase items={PORTFOLIO_DATA.work} />
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

      {/* What others wrote: LinkedIn recommendations + student feedback (data/testimonials.ts) */}
      <div className="tone-blue">
        <LazySection id="testimonials" size="lazy-h-testimonials">
          <Testimonials />
        </LazySection>
      </div>

      {/* Training platforms: TryHackMe as the big card (live stats), others from data/platforms.ts */}
      <div className="tone-blue">
        <LazySection id="platforms" size="lazy-h-platforms">
          <PlatformsSection featured={tryHackMePlatform(thm)} thm={thm} others={STATIC_PLATFORMS} />
        </LazySection>
      </div>

      {/* Contact section + form */}
      <div id="contact" className="mt-20">
        <LazySection size="lazy-h-contact">
          <ContactFooter />
        </LazySection>
      </div>

      {/* ═══ 02 · The blog: the evidence behind everything above ═══ */}
      <SlashDivider label="02 // Blog" japanese="記録" origin="right" />
      <AreaIntro
        id="blog"
        titleA="The"
        titleB="Blog."
        description={BLOG_DESCRIPTION}
        /* The pill links under the title: href = a section id below, n = count badge */
        links={[
          { href: "#cases", label: "Case library", n: libraryCounts.total },
          { href: "#videos", label: "Videos", n: blogYoutubeVideos.length },
          { href: "#attack", label: "Attack techniques covered", n: attackCoverage.techniqueCount },
          { href: "#detections", label: "My alarm rules" },
          { href: "#triage", label: "Try a real alert" },
        ]}
      />

      {/* The case library (filters, cards) and the videos. Its data is
          computed at build time and passed in: the raw case files
          (data/cases.ts, case-details.ts, attack.ts) stay on the server */}
      <LazySection id="cases" size="lazy-h-cases">
        <CaseLibrarySection data={libraryData} />
      </LazySection>

      <SlashDivider label="03 // Detection" japanese="検知" origin="left" />

      {/* These "Lazy*" components wrap themselves in a LazySection
          (components/blog/dynamic.tsx). ATT&CK and the alert stay red on
          purpose: there the red means heat and severity. */}
      <LazyAttackCoverage coverage={attackCoverage} />
      <div className="tone-blue">
        <LazyDetectionLibrary />
      </div>
      <LazyTriage />

      <SlashDivider label="04 // Operating model" japanese="実務" origin="right" />
      <div className="tone-blue">
        <LazySection id="lab" size="lazy-h-lab">
          <HomeLab />
        </LazySection>
      </div>
      <div className="tone-blue">
        <LazyContributions stats={contributions} />
      </div>

      {/* ═══ 03 · The gallery: certificates, records and photos — the very end ═══
          The id is on this wrapper: the gallery's own <section> is #art */}
      <SlashDivider label="05 // Gallery" japanese="証明" origin="left" />
      <div id="gallery">
        <LazySection id="art" size="lazy-h-gallery">
          <ArtGallery />
        </LazySection>
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
