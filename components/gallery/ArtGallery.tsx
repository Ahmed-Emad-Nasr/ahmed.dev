"use client";

/*
 * ═══ components/gallery/ArtGallery.tsx — the GALLERY: personal photos (/gallery) ═══
 *
 * Top to bottom:
 *   #art            → title "Visual Archive" + counters + the link to /certificates
 *   filter buttons  → by topic (athletics, teaching, community, internship, university)
 *   the photos      → each with its full caption under it: topic, date, title,
 *                     event and place, what it shows, and — for screenshots of
 *                     official posts — who posted it and when. 12 at a time,
 *                     "show more"; clicking a photo opens it full size.
 *
 * The certificates are NOT here: they have their own page (/certificates,
 * components/certificates/CertificateList.tsx, data/certificates.ts).
 *
 * WHERE THE CONTENT COMES FROM
 *   data/gallery-photos.ts  → every photo, its slug (= file name and #anchor)
 *                             and its details
 *   data/gallery-copy.ts    → the words of the page (English / Arabic)
 *   public/Assets/gallery/<slug>.webp (+ -thumb.webp from npm run thumbs)
 *
 * LINKS
 *   /gallery#<slug>        → scrolls to that photo (shown even if it is
 *                            beyond the first 12 or in another filter)
 *   /gallery?cert=N (old)  → the certificate that was image N, on its own page
 */

import Image from "next/image";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronDown, MapPin, Maximize2, Megaphone } from "lucide-react";
import {
  GALLERY_PHOTOS,
  formatPhotoDate,
  photoCategoryCount,
  photoImagePath,
  photoThumbPath,
  type PhotoCategory,
} from "@/data/gallery-photos";
import { markLoaded, normalizePublicHref } from "@/lib/shared";
import { CardEffects, TiltCard } from "@/components/ui/Motion";
import { KanjiWatermark, filterTab } from "@/components/ui/kit";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import { preloadable } from "@/lib/perf/lazy";
import FadeIn from "@/components/ui/FadeIn";
import { GALLERY_EN, type GalleryCopy } from "@/data/gallery-copy";

/* preloadable = fetched in idle time and then rendered without a suspended frame */
const Lightbox = preloadable(() => import("@/components/ui/Lightbox"));

/* Photos shown at first, and added by each "show more" click */
const FIRST = 12;
const PAGE = 12;

/* The filter buttons, in order (labels: data/gallery-copy.ts) */
const FILTERS: (PhotoCategory | "all")[] = ["all", "athletics", "teaching", "community", "internship", "university"];

const OFFICIAL_POSTS = GALLERY_PHOTOS.filter((p) => p.source).length;

const SLIDES = GALLERY_PHOTOS.map((p) => ({
  src: normalizePublicHref(photoImagePath(p.slug)),
  title: p.title,
  description: [
    [formatPhotoDate(p.date), p.place].filter(Boolean).join(" · "),
    p.description,
    p.source,
  ]
    .filter(Boolean)
    .join("\n"),
}));

/* ?cert=N (old links to a certificate scan) → that certificate's own page.
   Its own tiny component: useSearchParams renders up to the nearest
   Suspense in the browser only. */
function LegacyCertParam({ legacy }: { legacy: Readonly<Record<number, string>> }) {
  const router = useRouter();
  const n = Number(useSearchParams().get("cert"));
  useEffect(() => {
    if (Number.isInteger(n) && legacy[n]) router.replace(`/certificates/${legacy[n]}`);
  }, [n, legacy, router]);
  return null;
}

type Props = {
  copy?: GalleryCopy;
  /** Thumbnail sizes by slug (read from the files by the page) — the grid reserves the right space */
  sizes?: Readonly<Record<string, { width: number; height: number }>>;
  /** Old gallery number → certificate slug, for old ?cert=N links */
  legacyCerts?: Readonly<Record<number, string>>;
  /** How many documents /certificates holds (for the link) */
  certificateCount?: number;
  /** The certificates page in this language */
  certificatesHref?: string;
};

export default function ArtGallery({
  copy = GALLERY_EN,
  sizes = {},
  legacyCerts = {},
  certificateCount,
  certificatesHref = "/certificates",
}: Props) {
  const [filter, setFilter] = useState<PhotoCategory | "all">("all");
  const [visible, setVisible] = useState(FIRST);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const filtered = useMemo(
    () => (filter === "all" ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter((p) => p.category === filter)),
    [filter],
  );
  const shown = filtered.slice(0, visible);

  /* /gallery#<slug>: make sure that photo is on screen, then scroll to it */
  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    const at = GALLERY_PHOTOS.findIndex((p) => p.slug === slug);
    if (at < 0) return;
    /* The filter starts at "all": show enough photos to include it, then scroll */
    const frame = requestAnimationFrame(() => {
      setVisible((v) => Math.max(v, at + 1));
      requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView({ block: "start" }));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const choose = useCallback((id: PhotoCategory | "all") => {
    setFilter(id);
    setVisible(FIRST);
  }, []);

  const openPhoto = (slug: string) => {
    setIndex(Math.max(0, GALLERY_PHOTOS.findIndex((p) => p.slug === slug)));
    setOpen(true);
  };

  const fill = (text: string) =>
    text.replace("{photos}", String(GALLERY_PHOTOS.length)).replace("{certs}", String(certificateCount ?? ""));

  return (
    <section
      id="art"
      aria-labelledby="art-title"
      className="relative pt-8 md:pt-12 pb-24 md:pb-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      <KanjiWatermark chars="芸術創造" side="left" />
      <Suspense fallback={null}>
        <LegacyCertParam legacy={legacyCerts} />
      </Suspense>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          id="art-title"
          as="h1"
          eyebrow={copy.eyebrow}
          japanese="芸術"
          titleA={copy.titleA}
          titleB={copy.titleB}
          size="lg"
          description={fill(copy.description)}
          aside={
            <CounterChip
              tone="accent"
              stats={[
                { value: String(GALLERY_PHOTOS.length).padStart(2, "0"), label: copy.statPhotos },
                { value: String(OFFICIAL_POSTS).padStart(2, "0"), label: copy.statRaces },
              ]}
            />
          }
        />

        {certificateCount !== undefined && (
          <p className="-mt-4 mb-10 text-sm text-foreground/65">
            {copy.certsBefore}{" "}
            <Link prefetch={false} href={certificatesHref} className="font-semibold text-primary-ink underline underline-offset-4 hover:text-foreground">
              {fill(copy.certsLink)}
            </Link>{" "}
            {copy.certsAfter}
          </p>
        )}

        <div className="flex flex-wrap gap-2.5 mb-10" role="tablist" aria-label={copy.filterLabel}>
          {FILTERS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              aria-controls="photo-grid"
              onClick={() => choose(id)}
              className={filterTab(filter === id)}
            >
              {copy.filters[id]}{" "}
              <span className="ms-1.5 font-mono text-[0.625rem] tabular-nums">
                ({id === "all" ? GALLERY_PHOTOS.length : photoCategoryCount(id)})
              </span>
            </button>
          ))}
        </div>

        <ul id="photo-grid" className="columns-1 md:columns-2 xl:columns-3 gap-6 [&>li]:mb-6">
          {shown.map((p, idx) => {
            const size = sizes[p.slug];
            const when = formatPhotoDate(p.date);
            return (
              <FadeIn as="li" y={16} duration={0.6} delay={(idx % 6) * 0.06} key={p.slug} id={p.slug} className="break-inside-avoid scroll-mt-28">
                <TiltCard max={3} className="spotlight group relative overflow-hidden bg-surface/60 border border-foreground/5 hover:border-primary/40 transition-colors duration-300">
                  <CardEffects index={idx + 1} />
                  <figure className="relative z-20">
                    <button
                      type="button"
                      onClick={() => openPhoto(p.slug)}
                      aria-label={`${copy.openPhoto} ${p.title} ${copy.openPhotoAfter}`}
                      className="relative block w-full overflow-hidden cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-4px]"
                    >
                      <Image
                        src={normalizePublicHref(photoThumbPath(p.slug))}
                        alt={`${p.title}. ${p.description}`}
                        width={size?.width ?? 640}
                        height={size?.height ?? 640}
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className={`img-fade w-full h-auto transition-all duration-700 group-hover:scale-[1.03] ${p.source ? "" : "grayscale group-hover:grayscale-0"}`}
                        onLoad={markLoaded}
                        onError={markLoaded}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        unoptimized
                      />
                      <Maximize2 size={14} aria-hidden="true" className="absolute top-3 end-3 text-white/90 drop-shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <figcaption className="p-5 md:p-6">
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-primary-ink">
                        <span>{copy.filters[p.category]}</span>
                        {when && (
                          <span className="inline-flex items-center gap-1 text-foreground/60">
                            <CalendarDays size={11} aria-hidden="true" />
                            <bdi>{when}</bdi>
                          </span>
                        )}
                      </p>
                      <h2 className="mt-2 font-display text-base md:text-lg font-black uppercase tracking-tight leading-tight text-foreground">
                        <bdi>{p.title}</bdi>
                      </h2>
                      <p className="mt-2 text-xs text-foreground/60 leading-relaxed">
                        <bdi>{p.event}</bdi>
                        {/* the place, unless the event already names it */}
                        {p.place && !p.event.includes(p.place) && (
                          <span className="inline-flex items-center gap-1">
                            {" · "}
                            <MapPin size={11} aria-hidden="true" />
                            <bdi>{p.place}</bdi>
                          </span>
                        )}
                      </p>
                      <p className="mt-3 text-sm text-foreground/75 font-light leading-relaxed">
                        <bdi>{p.description}</bdi>
                      </p>
                      {p.source && (
                        <p className="mt-3 flex gap-2 border-s-2 border-tertiary ps-3 text-xs text-foreground/70 leading-relaxed">
                          <Megaphone size={12} className="mt-0.5 shrink-0 text-tertiary" aria-hidden="true" />
                          <span>
                            {copy.source} <bdi>{p.source}</bdi>
                          </span>
                        </p>
                      )}
                    </figcaption>
                  </figure>
                </TiltCard>
              </FadeIn>
            );
          })}
        </ul>

        {visible < filtered.length && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((n) => Math.min(filtered.length, n + PAGE))}
              className="group flex items-center gap-3 px-8 py-4 border border-foreground/15 border-s-2 border-s-primary bg-foreground/[0.02] text-foreground font-mono font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:-translate-y-[1.7px]"
            >
              <ChevronDown size={14} className="text-primary-ink transition-transform duration-300 group-hover:translate-y-[1.7px]" />
              {copy.showMore}
              <span className="font-mono text-[0.625rem] text-foreground/60 tabular-nums">
                {visible}/{filtered.length}
              </span>
            </button>
          </div>
        )}
      </div>

      {open && (
        <Suspense fallback={null}>
          <Lightbox close={() => setOpen(false)} index={index} slides={SLIDES} />
        </Suspense>
      )}
    </section>
  );
}
