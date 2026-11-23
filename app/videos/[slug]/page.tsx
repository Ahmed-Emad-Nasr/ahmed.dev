/*
 * ═══ app/videos/[slug]/page.tsx — one page per video  ( URL: /videos/<slug> ) ═══
 *
 * The video is the main thing on the page — that is what Google needs to
 * index it and show it in the Videos tab (on /blog, 25 videos side by side
 * were not indexed). Each page: the player, the description, the case it
 * walks through (if any), its topics and three related videos — with
 * VideoObject structured data and the video in sitemap.xml.
 *
 * You never create these pages by hand: add a video to data/youtube.ts and
 * its page exists (lib/videos.ts makes the address from the title).
 * The player is youtube-nocookie (allowed in lib/security.ts → frame-src).
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText, PlayCircle } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { Youtube } from "@/components/ui/BrandIcons";
import { KanjiWatermark, btnOutline, btnPrimary } from "@/components/ui/kit";
import { caseEvidenceLibrary } from "@/data/cases";
import { SITE_VIDEOS, relatedVideos, uploadDate, videoBySlug, videoPath, videoUrl } from "@/lib/videos";
import { absoluteUrl, caseUrl, summarize } from "@/lib/site";
import { formatDate, YOUTUBE_CHANNEL_URL, X_HANDLE } from "@/lib/shared";
import {
  CHANNEL_ID, PERSON_NAME, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, youtubePlayer, youtubeThumb, youtubeWatch,
} from "@/lib/seo";
import { BLOG_ID, VIDEOS_URL } from "@/lib/page-ids";
import { GLOSSARY, VIDEO_NOTES } from "@/data/video-notes";
import FadeIn from "@/components/ui/FadeIn";
import VideoPlayer from "@/components/videos/VideoPlayer";
import CaseLinkGrid from "@/components/blog/CaseLinkGrid";

export function generateStaticParams() {
  return SITE_VIDEOS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const video = videoBySlug(slug);
  if (!video) return { title: "Video not found" };

  const description = summarize(video.description ?? video.title);
  const shareTitle = `${video.title} | Ahmed Emad Nasr`;
  return {
    title: video.title,
    description,
    keywords: [...new Set([...(video.tags ?? []), "Ahmed Emad Nasr", "cybersecurity video", "cybersecurity tutorial"])],
    authors: [{ name: PERSON_NAME }],
    alternates: { canonical: videoPath(video) },
    openGraph: {
      title: shareTitle,
      description: summarize(video.description ?? video.title, 200),
      url: videoUrl(video),
      type: "video.other",
      siteName: "Ahmed Emad Nasr",
      locale: "en_US",
      images: [{ url: youtubeThumb(video.videoId), width: 480, height: 360, alt: video.title }],
      videos: [{ url: youtubePlayer(video.videoId), secureUrl: youtubePlayer(video.videoId), type: "text/html", width: 1280, height: 720 }],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: summarize(video.description ?? video.title, 200),
      site: X_HANDLE,
      creator: X_HANDLE,
      images: [youtubeThumb(video.videoId)],
    },
  };
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = videoBySlug(slug);
  if (!video) notFound();

  const url = videoUrl(video);
  const theCase = video.caseId ? caseEvidenceLibrary.find((c) => c.id === video.caseId) : undefined;
  const more = relatedVideos(video, 3);
  /* The written part of the page (data/video-notes.ts) */
  const notes = VIDEO_NOTES[video.videoId] ?? [];
  const glossaryKey = new Map(Object.keys(GLOSSARY).map((k) => [k.toLowerCase(), k]));
  const terms = [...new Set((video.tags ?? []).flatMap((t) => glossaryKey.get(t.toLowerCase()) ?? []))];
  /* Cases on the same topics: a video tag that is a case's tag, tool or category */
  const topics = new Set((video.tags ?? []).map((t) => t.toLowerCase()));
  const onTopic = caseEvidenceLibrary
    .filter((c) => c.id !== theCase?.id)
    .map((c) => ({ c, score: [...c.tags, ...c.tools, c.category].filter((x) => topics.has(x.toLowerCase())).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.c.date.localeCompare(a.c.date))
    .slice(0, 3)
    .map((x) => x.c);

  const structuredData = jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: video.title,
        description: summarize(video.description ?? video.title, 300),
        isPartOf: { "@id": WEBSITE_ID },
        about: PERSON_REF,
        author: PERSON_REF,
        mainEntity: { "@id": `${url}#video` },
        inLanguage: "en",
      },
      {
        "@type": "VideoObject",
        "@id": `${url}#video`,
        name: video.title,
        description: summarize(video.description ?? video.title, 2000),
        thumbnailUrl: [youtubeThumb(video.videoId)],
        ...(uploadDate(video.publishedAt) ? { uploadDate: uploadDate(video.publishedAt) } : {}),
        embedUrl: youtubePlayer(video.videoId),
        url,
        sameAs: youtubeWatch(video.videoId),
        ...(video.tags?.length ? { keywords: video.tags.join(", ") } : {}),
        creator: PERSON_REF,
        publisher: { "@id": CHANNEL_ID },
        isPartOf: { "@id": BLOG_ID },
        ...(theCase ? { about: { "@id": `${caseUrl(theCase.id)}#article` } } : {}),
      },
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["Videos", VIDEOS_URL],
        [video.title, url],
      ]),
    ],
  });

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <article className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden">
        <KanjiWatermark chars="動画" side="right" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav
            className="mb-10 flex flex-wrap items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.3em]"
            aria-label="Breadcrumb"
          >
            <Link
              prefetch={false}
              href="/videos"
              className="group flex items-center gap-2 text-primary-ink hover:text-foreground transition-colors"
            >
              <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-[3.4px]" aria-hidden="true" />
              All videos
            </Link>
            <span className="text-foreground/20" aria-hidden="true">/</span>
            <span className="text-foreground/60">Video</span>
          </nav>

          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tighter [word-spacing:0.12em] uppercase leading-[0.95] text-foreground [text-wrap:balance]">
            {video.title}
          </h1>
          {video.publishedAt && (
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.25em] text-tertiary">
              <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time> · YouTube · @AhmedEmadNasr-0x3omda
            </p>
          )}

          {/* The video — the main content of the page */}
          <div className="mt-10 relative aspect-video w-full overflow-hidden border border-foreground/10 bg-surface">
            {/* The real player from the start: a watch page must not need a click (components/videos/VideoPlayer.tsx) */}
            <VideoPlayer videoId={video.videoId} title={video.title} />
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-8 items-start">
            <div className="min-w-0">
              {video.description && (
                <p className="text-base md:text-lg text-foreground/75 font-light leading-relaxed">{video.description}</p>
              )}
              {video.tags && video.tags.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Topics">
                  {video.tags.map((tag) => (
                    <li key={tag} className="px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-tertiary bg-tertiary/10 border border-tertiary/25">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <a href={youtubeWatch(video.videoId)} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} w-fit`}>
                <ExternalLink size={13} aria-hidden="true" /> Watch on YouTube
              </a>
              {theCase && (
                <Link prefetch={false} href={`/blog/${theCase.id}`} className={`${btnOutline} w-fit`}>
                  <FileText size={13} aria-hidden="true" /> Read the case
                </Link>
              )}
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className={`${btnOutline} w-fit`}>
                <Youtube size={13} /> The channel
              </a>
            </div>
          </div>

          {(notes.length > 0 || terms.length > 0) && (
            <FadeIn y={24} className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {notes.length > 0 && (
                <section className="border border-foreground/10 bg-surface/50 p-6 md:p-8" aria-labelledby="video-notes-title">
                  <h2 id="video-notes-title" className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink">
                    What the video covers
                  </h2>
                  <ol className="mt-5 space-y-3">
                    {notes.map((n, i) => (
                      <li key={n} className="flex gap-4 text-sm md:text-[0.9375rem] text-foreground/80 leading-relaxed">
                        <span className="font-mono text-xs font-black text-accent tabular-nums shrink-0 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                        {n}
                      </li>
                    ))}
                  </ol>
                </section>
              )}
              {terms.length > 0 && (
                <section className="border border-foreground/10 bg-surface/50 p-6 md:p-8" aria-labelledby="video-terms-title">
                  <h2 id="video-terms-title" className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">
                    Key terms
                  </h2>
                  <dl className="mt-5 space-y-4">
                    {terms.map((t) => (
                      <div key={t}>
                        <dt className="font-mono text-xs font-black uppercase tracking-[0.15em] text-foreground">{t}</dt>
                        <dd className="mt-1 text-sm text-foreground/60 font-light leading-relaxed">{GLOSSARY[t]}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </FadeIn>
          )}

          {theCase && (
            <section className="mt-14 border border-foreground/10 bg-surface/50 p-6 md:p-8" aria-labelledby="video-case-title">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-primary-ink">The written case</p>
              <h2 id="video-case-title" className="mt-3 font-display text-xl md:text-2xl font-black uppercase tracking-tight leading-tight">
                <Link prefetch={false} href={`/blog/${theCase.id}`} className="hover:text-primary-ink transition-colors">
                  {theCase.title}
                </Link>
              </h2>
              {theCase.description && (
                <p className="mt-3 text-sm text-foreground/60 font-light leading-relaxed line-clamp-3">{theCase.description}</p>
              )}
            </section>
          )}

          {onTopic.length > 0 && (
            <section className="mt-20" aria-labelledby="video-cases-title">
              <h2 id="video-cases-title" className="mb-8 flex items-center gap-4 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-primary-ink">
                <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
                Cases on the same topic
              </h2>
              <CaseLinkGrid cases={onTopic} />
            </section>
          )}

          {more.length > 0 && (
            <section className="mt-20" aria-labelledby="video-more-title">
              <h2 id="video-more-title" className="mb-8 flex items-center gap-4 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-primary-ink">
                <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
                More videos
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {more.map((v) => (
                  <li key={v.videoId}>
                    <Link
                      prefetch={false}
                      href={videoPath(v)}
                      className="group spotlight relative flex h-full flex-col bg-surface/60 border border-foreground/5 hover:border-primary/40 transition-colors duration-300 overflow-hidden"
                    >
                      <span className="relative block aspect-video overflow-hidden">
                        <Image
                          src={youtubeThumb(v.videoId)}
                          alt=""
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 bg-primary text-white" aria-hidden="true">
                          <PlayCircle size={20} />
                        </span>
                      </span>
                      <span className="p-5 font-display text-base font-black uppercase tracking-tight leading-tight text-foreground group-hover:text-primary-ink transition-colors">
                        {v.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </PageShell>
  );
}
