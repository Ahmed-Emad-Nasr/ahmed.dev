/*
 * ═══ app/blog/page.tsx — the BLOG PAGE  ( URL: /blog ) ═══
 *
 * The case library (with "start here" and the videos), ATT&CK coverage,
 * detection rules, the triage challenge, the home lab, the process and the
 * GitHub contributions. Each section is its own chunk
 * (components/blog/dynamic.tsx) and mounts lazily. Old home-page links
 * (/#cases …) are forwarded here (lib/routes.ts).
 *
 *   Section on screen         Component                              Content / data
 *   ────────────────────────  ─────────────────────────────────────  ─────────────────────────
 *   Intro + jump links        components/ui/AreaIntro                the `links` array below
 *   Start here / Cases /      components/blog/CaseLibrarySection     data/cases.ts, data/case-details.ts,
 *   Videos                                                           data/start-here.ts, data/youtube.ts
 *   ATT&CK coverage #attack   components/blog/AttackCoverage         data/attack.ts (computed from cases)
 *   Detection rules           components/blog/DetectionLibrary       data/detection-rules.ts
 *   Triage challenge          components/blog/TriageChallenge        inside the component
 *   Home lab  #lab            components/home/HomeLab                inside the component
 *   Process   #process        components/home/ProcessSection         inside the component
 *   Contributions             components/home/ContributionsGrid      GitHub contributions API (live)
 *
 * A single case page (/blog/<id>) is app/blog/[slug]/page.tsx.
 *
 * HOW TO EDIT
 *   • Add a case report → data/cases.ts (+ its long text in data/case-details.ts).
 *     It shows up in the library, filters, ATT&CK counts and gets its own page.
 *   • Add a video → data/youtube.ts.
 *   • Change the jump links under the title → the `links` prop of <AreaIntro>.
 *   • Add a section → same recipe as the home page (see app/page.tsx header):
 *     component → export in components/blog/dynamic.tsx → <LazySection> here →
 *     .lazy-h-* height in app/globals.css.
 */

import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import LazySection from "@/lib/perf/lazy";
import SlashDivider from "@/components/ui/SlashDivider";
import TickerStrip from "@/components/ui/TickerStrip";
import {
  AreaIntro,
  CaseLibrarySection,
  HomeLab,
  LazyAttackCoverage,
  LazyContributions,
  LazyDetectionLibrary,
  LazyTriage,
  ProcessSection,
} from "@/components/blog/dynamic";
import PageEffects from "@/lib/perf/PageEffects";
import { attackCoverage, libraryCounts, libraryData, libraryStructuredData } from "@/lib/library-data";
import { blogYoutubePlaylists, blogYoutubeVideos } from "@/data/youtube";
import { CHANNEL_ID, PERSON_REF, SITE_URL, jsonLd, youtubeEmbed, youtubeThumb, youtubeWatch } from "@/lib/seo";
import { absoluteUrl, OG_IMAGE } from "@/lib/site";

/* Used for the meta description, the share cards and the text under the title */
const DESCRIPTION =
  "Real security work, written up so anyone can follow it: what was attacked, what I did about it and how to stop it next time. Each case opens with a plain summary; the technical detail — reports, detection rules, MITRE ATT&CK — is underneath for those who want it.";

export const metadata: Metadata = {
  title: "Blog — Case Library, ATT&CK & Videos",
  description: DESCRIPTION,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog — Ahmed Emad Nasr",
    description: DESCRIPTION,
    url: absoluteUrl("/blog"),
    type: "website",
    siteName: "ahmed.dev",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  /* A page-level twitter object replaces the layout's, so site/creator are repeated */
  twitter: {
    card: "summary_large_image",
    site: "@0x3omda",
    creator: "@0x3omda",
    title: "Blog — Ahmed Emad Nasr",
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

/* JSON-LD for search engines (invisible): the blog, the case list and every
   video/playlist. Generated from the data files — nothing to edit here when
   you add cases or videos. */
function structuredData() {
  const blogUrl = absoluteUrl("/blog");
  return jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${blogUrl}#blog`,
        url: blogUrl,
        name: "Ahmed Emad Nasr — Blog",
        description: DESCRIPTION,
        author: PERSON_REF,
        publisher: PERSON_REF,
        isPartOf: { "@id": `${SITE_URL}#website` },
      },
      libraryStructuredData,
      {
        "@type": "ItemList",
        "@id": `${blogUrl}#videos`,
        name: "Cybersecurity video tutorials by Ahmed Emad Nasr",
        numberOfItems: blogYoutubeVideos.length,
        itemListElement: blogYoutubeVideos.map((video, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "VideoObject",
            "@id": `${youtubeWatch(video.videoId)}#video`,
            name: video.title,
            description: video.description ?? video.title,
            thumbnailUrl: [youtubeThumb(video.videoId)],
            uploadDate: video.publishedAt,
            embedUrl: youtubeEmbed(video.videoId),
            url: youtubeWatch(video.videoId),
            inLanguage: "en",
            keywords: (video.tags ?? []).join(", "),
            creator: PERSON_REF,
            author: PERSON_REF,
            publisher: { "@id": CHANNEL_ID },
            isFamilyFriendly: true,
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
        keywords: (playlist.tags ?? []).join(", "),
        inLanguage: "en",
        author: PERSON_REF,
        publisher: { "@id": CHANNEL_ID },
      })),
    ],
  });
}

export default function BlogPage() {
  return (
    /* PageShell (components/layout/PageShell.tsx) = navbar + <main> + footer bar.
       showLoader → also play the intro boot screen on this page. */
    <PageShell showLoader>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      <PageEffects />

      <AreaIntro
        as="h1"
        id="blog-top"
        titleA="The"
        titleB="Blog."
        description={DESCRIPTION}
        /* The pill links under the title: href = a section id on this page,
           n = optional count badge */
        links={[
          { href: "#start-here", label: "Start here" },
          { href: "#cases", label: "Case library", n: libraryCounts.total },
          { href: "#videos", label: "Videos", n: blogYoutubeVideos.length },
          { href: "#attack", label: "Attack techniques covered", n: attackCoverage.techniqueCount },
          { href: "#detections", label: "My alarm rules" },
          { href: "#triage", label: "Try a real alert" },
        ]}
      />

      {/* ─── Start here, the case library (filters, cards) and the videos ─── */}
      <LazySection id="start-here" size="lazy-h-cases">
        {/* The library's data is computed here, at build time, and passed in:
            the raw case files (data/cases.ts, case-details.ts, attack.ts)
            stay on the server */}
        <CaseLibrarySection data={libraryData} />
      </LazySection>

      <SlashDivider label="01 // Detection" japanese="検知" origin="right" />
      <TickerStrip items={["戦術", "技術", "網羅", "証拠", "READ THE RECORD"]} />

      {/* ─── The library on MITRE ATT&CK, the rule pack, one real alert ───
          These "Lazy*" components already wrap themselves in a LazySection
          (see components/blog/dynamic.tsx), so no wrapper is needed here. */}
      <LazyAttackCoverage coverage={attackCoverage} />
      <LazyDetectionLibrary />
      <LazyTriage />

      <SlashDivider label="02 // Operating model" japanese="実務" origin="left" />
      <TickerStrip reverse items={["継続", "改善", "実務", "計測", "BUILD THE RECORD"]} />
      <LazySection id="lab" size="lazy-h-lab">
        <HomeLab />
      </LazySection>
      <LazySection id="process" size="lazy-h-process">
        <ProcessSection />
      </LazySection>
      <LazyContributions />
    </PageShell>
  );
}
