/*
 * ═══ app/blog/page.tsx — the BLOG page  ( URL: /blog ) ═══
 *
 * The evidence behind the portfolio: the case library (with the videos),
 * the ATT&CK coverage, the detection rules, the triage challenge and the
 * home lab. One case = its own page (app/blog/[slug]/page.tsx).
 *
 *   Section on screen      Component                          Content / data
 *   ─────────────────────  ─────────────────────────────────  ──────────────────────────
 *   "The Blog." intro #blog components/ui/AreaIntro           BLOG_DESCRIPTION below
 *   Cases/Videos #cases    components/blog/CaseLibrarySection data/cases.ts, case-details.ts, youtube.ts
 *   ATT&CK       #attack   components/blog/AttackCoverage     data/attack.ts (computed from cases)
 *   Rules        #detections components/blog/DetectionLibrary data/detection-rules.ts
 *   Triage       #triage   components/blog/TriageChallenge    inside the component
 *   Home lab     #lab      components/home/HomeLab            inside the component
 *
 * A section moved here from another page? Add its id to SECTION_PAGE in
 * lib/routes.ts, so the navbar, palette and shortcuts find it.
 */

import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import PageEffects from "@/lib/perf/PageEffects";
import SlashDivider from "@/components/ui/SlashDivider";
import {
  AreaIntro,
  AttackCoverage,
  CaseLibrary,
  DetectionLibrary,
  HomeLab,
  TriageChallenge,
} from "@/components/blog/dynamic";
import { attackCoverage, libraryCounts } from "@/lib/library-data";
import { blogYoutubePlaylists, blogYoutubeVideos } from "@/data/youtube";
import { summarize } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import {
  CHANNEL_ID, KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords, youtubeEmbed, youtubeThumb, youtubeWatch,
} from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { BLOG_ID, BLOG_URL } from "@/lib/page-ids";

/* The intro text under "The Blog." */
const BLOG_DESCRIPTION =
  "Real security work, written up so anyone can follow it: what was attacked, what I did about it and how to stop it next time. Each case opens with a plain summary; the technical detail — reports, detection rules, MITRE ATT&CK — is underneath for those who want it.";

/* What a search result shows: the name first, so "Ahmed Emad Nasr blog" matches */
const SEARCH_DESCRIPTION =
  "Ahmed Emad Nasr's cybersecurity blog: incident response, DFIR and malware analysis case studies, SOC investigations, Wazuh detection rules and MITRE ATT&CK mapping.";

/* This page's own share card (npm run og:cases), else the site card */
const SHARE_IMAGE = pageShareImage("blog", "Ahmed Emad Nasr Blog — cybersecurity case studies");

export const metadata: Metadata = {
  /* absolute: the name is already in it (no " | Ahmed Emad Nasr" template) */
  title: { absolute: "Ahmed Emad Nasr Blog — Cybersecurity Case Studies" },
  description: SEARCH_DESCRIPTION,
  keywords: pageKeywords(KEYWORDS.blog, KEYWORDS.response, KEYWORDS.operations),
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": [{ url: "/blog/feed.xml", title: "Ahmed Emad Nasr — Case Library" }] },
  },
  openGraph: {
    title: "Ahmed Emad Nasr Blog — Cybersecurity Case Studies",
    description: SEARCH_DESCRIPTION,
    url: BLOG_URL,
    type: "website",
    siteName: "Ahmed Emad Nasr",
    locale: "en_US",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Emad Nasr Blog — Cybersecurity Case Studies",
    description: SEARCH_DESCRIPTION,
    site: "@0x3omda",
    creator: "@0x3omda",
    images: [{ url: SHARE_IMAGE.url, alt: SHARE_IMAGE.alt }],
  },
};

/* JSON-LD: the blog, the videos and the playlists */
function structuredData() {
  return jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": BLOG_ID,
        url: BLOG_URL,
        name: "Ahmed Emad Nasr — Blog",
        alternateName: ["Ahmed Emad Nasr Blog", "3omda blog"],
        description: BLOG_DESCRIPTION,
        keywords: KEYWORDS.blog.join(", "),
        author: PERSON_REF,
        publisher: PERSON_REF,
        isPartOf: { "@id": WEBSITE_ID },
      },
      {
        "@type": "ItemList",
        "@id": `${BLOG_URL}#videos`,
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
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["Blog", BLOG_URL],
      ]),
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
    ],
  });
}

export default function BlogPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      {/* No UI: #anchor jumps and filtered library links (lib/perf/PageEffects.tsx) */}
      <PageEffects />

      {/* pt: room for the fixed navbar */}
      <div className="pt-28 md:pt-32">
        <AreaIntro
          id="blog"
          as="h1"
          eyebrow="Ahmed Emad Nasr // Blog"
          japanese="記録"
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
      </div>

      {/* The case library (filters, cards) and the videos. Its data
          (/library.json, built by app/library.json/route.ts) is fetched in
          the browser; a skeleton holds #cases until it arrives */}
      <CaseLibrary />

      <SlashDivider label="01 // Detection" japanese="検知" origin="left" />

      {/* ATT&CK and the alert stay red on purpose: there the red means
          heat and severity. */}
      <AttackCoverage coverage={attackCoverage} />
      <div className="tone-blue">
        <DetectionLibrary />
      </div>
      <TriageChallenge />

      <SlashDivider label="02 // Operating model" japanese="実務" origin="right" />
      <div className="tone-blue">
        <HomeLab />
      </div>
    </PageShell>
  );
}
