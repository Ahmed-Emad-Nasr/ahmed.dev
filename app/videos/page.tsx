/*
 * ═══ app/videos/page.tsx — every video on one page  ( URL: /videos ) ═══
 *
 * The channel's videos (newest first) and playlists. Each video card opens
 * that video's own page (/videos/<slug>, app/videos/[slug]/page.tsx), where
 * Google indexes it; this page ties them together so they are easy to find
 * and to search for ("Ahmed Emad Nasr YouTube").
 *
 * Nothing to edit here: videos and playlists come from data/youtube.ts.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ListVideo, Play } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import ShowMore from "@/components/ui/ShowMore";
import { Youtube } from "@/components/ui/BrandIcons";
import { KanjiWatermark, btnOutline } from "@/components/ui/kit";
import { blogYoutubePlaylists } from "@/data/youtube";
import { SITE_VIDEOS, videoPath, videoUrl } from "@/lib/videos";
import { YOUTUBE_CHANNEL_URL, formatDate } from "@/lib/shared";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { CHANNEL_ID, KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords, youtubeThumb } from "@/lib/seo";
import { VIDEOS_ID, VIDEOS_URL } from "@/lib/page-ids";

const TITLE = "Ahmed Emad Nasr — Cybersecurity Videos (YouTube)";
const DESCRIPTION = `${SITE_VIDEOS.length} cybersecurity videos by Ahmed Emad Nasr (0x3omda): SOC and blue-team basics, Wazuh SIEM, malware analysis, networking and GRC — each one explained step by step, with its own page and the written case where there is one.`;

/* This page's own share card (npm run og:cases), else the site card */
const SHARE_IMAGE = pageShareImage("videos", "Ahmed Emad Nasr — cybersecurity videos");

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: pageKeywords(KEYWORDS.videos),
  alternates: { canonical: "/videos" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: VIDEOS_URL,
    type: "website",
    siteName: "Ahmed Emad Nasr",
    locale: "en_US",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    site: "@0x3omda",
    creator: "@0x3omda",
    images: [{ url: SHARE_IMAGE.url, alt: SHARE_IMAGE.alt }],
  },
};

/* JSON-LD: a collection of the video pages (each describes its own video) */
function structuredData() {
  return jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": VIDEOS_ID,
        url: VIDEOS_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        about: PERSON_REF,
        author: PERSON_REF,
        publisher: { "@id": CHANNEL_ID },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: SITE_VIDEOS.length,
          itemListElement: SITE_VIDEOS.map((video, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: videoUrl(video),
            name: video.title,
          })),
        },
      },
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["Videos", VIDEOS_URL],
      ]),
    ],
  });
}

export default function VideosPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      <section className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden">
        <KanjiWatermark chars="動画" side="right" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            as="h1"
            eyebrow="Ahmed Emad Nasr // YouTube"
            japanese="動画"
            titleA="Watch &"
            titleB="Learn."
            size="lg"
            description="Cybersecurity explained on video, step by step: SOC and blue-team basics, Wazuh SIEM, malware analysis, networking and GRC. Each video has its own page, with the written case where there is one."
            aside={
              <div className="flex flex-col items-start gap-4">
                <CounterChip stats={[{ value: String(SITE_VIDEOS.length), label: "Videos" }]} />
                <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className={btnOutline}>
                  <Youtube size={13} /> Open the channel
                </a>
              </div>
            }
          />

          {/* ─── Every video, newest first ─── */}
          <ShowMore as="ul" first={12} step={12} label="Show more videos" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SITE_VIDEOS.map((v, i) => (
              <FadeIn as="li" key={v.videoId} y={24} duration={0.65} delay={(i % 3) * 0.08} className="flex">
                <Link
                  prefetch={false}
                  href={videoPath(v)}
                  className="group spotlight relative flex w-full flex-col bg-surface/60 border border-foreground/5 hover:border-primary/40 transition-colors duration-300 overflow-hidden"
                >
                  <span className="relative block aspect-video overflow-hidden bg-surface">
                    <Image
                      src={youtubeThumb(v.videoId)}
                      alt=""
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-12 h-12 bg-primary text-white" aria-hidden="true">
                      <Play size={18} />
                    </span>
                  </span>
                  <span className="flex flex-1 flex-col p-6">
                    {v.publishedAt && (
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-tertiary">
                        <time dateTime={v.publishedAt}>{formatDate(v.publishedAt)}</time>
                      </span>
                    )}
                    <span className="mt-3 font-display text-lg font-black uppercase tracking-tight leading-tight text-foreground group-hover:text-primary-ink transition-colors">
                      {v.title}
                    </span>
                    {v.description && (
                      <span className="mt-3 text-sm text-foreground/60 font-light leading-relaxed line-clamp-3">{v.description}</span>
                    )}
                  </span>
                </Link>
              </FadeIn>
            ))}
          </ShowMore>

          {/* ─── Playlists ─── */}
          {blogYoutubePlaylists.length > 0 && (
            <section className="mt-24" aria-labelledby="videos-playlists-title">
              <h2 id="videos-playlists-title" className="mb-8 flex items-center gap-4 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-primary-ink">
                <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
                Playlists
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogYoutubePlaylists.map((p) => (
                  <li key={p.playlistId}>
                    <a
                      href={p.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col gap-3 p-6 bg-surface/60 border border-foreground/5 hover:border-primary/40 transition-colors duration-300"
                    >
                      <span className="flex items-center justify-between gap-3 font-mono text-[0.625rem] uppercase tracking-[0.25em] text-tertiary">
                        <span className="inline-flex items-center gap-2">
                          <ListVideo size={13} aria-hidden="true" /> Playlist
                        </span>
                        {p.videoCount ? <span>{p.videoCount} videos</span> : null}
                      </span>
                      <span className="font-display text-lg font-black uppercase tracking-tight leading-tight text-foreground group-hover:text-primary-ink transition-colors">
                        {p.title}
                        <ExternalLink size={13} className="ms-2 inline align-baseline text-foreground/40" aria-hidden="true" />
                        <span className="sr-only"> (opens YouTube)</span>
                      </span>
                      {p.description && <span className="text-sm text-foreground/60 font-light leading-relaxed">{p.description}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>
    </PageShell>
  );
}
