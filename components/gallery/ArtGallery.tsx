"use client";

/*
 * ═══ components/gallery/ArtGallery.tsx — the GALLERY, the end of the home page (#gallery) ═══
 *
 * Top to bottom:
 *   #art                 → title "Proof gallery" + counters
 *   #all-certificates    → certificate cards with filter buttons (CERT_FILTERS)
 *   #visual-archive      → the PHOTOS (classrooms, events), 12 at a time, with
 *                          "show more"; clicking opens the Lightbox. Certificate
 *                          scans are not repeated here — each certificate card
 *                          above opens its own scan.
 *
 * WHERE THE CONTENT COMES FROM
 *   • The images are NUMBERED files:
 *       public/Assets/art-gallery/Images/image_display_thumb/1.webp … 98.webp
 *     GALLERY_IMAGE_COUNT in data/certifications.ts says how many there are.
 *     PORTFOLIO_DATA.artGallery (data/portfolio-data.ts) turns 1…N into the list.
 *   • An image that is a certificate gets its title/description from
 *     ALL_GALLERY_CERTIFICATES in data/certifications.ts (matched by
 *     galleryIndex = the file number). Other images are "photos".
 *
 * HOW TO EDIT
 *   • Add a photo → save it as the next number (99.webp) in that folder and
 *     raise GALLERY_IMAGE_COUNT to 99.
 *   • Add a certificate → same, then add an entry to ALL_GALLERY_CERTIFICATES
 *     with galleryIndex: 99 (title, issuer, kind, group, summary).
 *   • Rename / add a filter group → CERT_FILTERS (and GalleryCertGroup in
 *     data/certifications.ts).
 *   • How many images load at first / per "show more" → FIRST and PAGE.
 *   • Link straight to a scan: /?cert=14#gallery opens image 14 in the lightbox.
 */

import Image from "next/image";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { markLoaded, sizeFor } from "@/lib/shared";
import {
  ALL_GALLERY_CERTIFICATES,
  galleryGroupCount,
  type GalleryCertGroup,
} from "@/data/certifications";
import { CardEffects, TiltCard } from "@/components/ui/Motion";
import { Eyebrow, KanjiWatermark, filterTab } from "@/components/ui/kit";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import { useSearchParams } from "next/navigation";
import { Sparkles, Maximize2, ChevronDown, ExternalLink, ShieldCheck } from "lucide-react";
import { preloadable } from "@/lib/perf/lazy";
import FadeIn from "@/components/ui/FadeIn";
import OrgLogo from "@/components/ui/OrgLogo";
import { GALLERY_EN, type GalleryCopy } from "@/data/gallery-copy";

/* preloadable = fetched in idle time and then rendered without a suspended
   frame: React holds back a suspended→ready swap for ~300ms, which is what
   made the first open feel late. */
const Lightbox = preloadable(() => import("@/components/ui/Lightbox"));

/* Images shown at first, and added by each "show more" click */
const FIRST = 12;
const PAGE = 12;

/* The certificate filter buttons, in order (labels: data/gallery-copy.ts) */
const CERT_FILTERS: (GalleryCertGroup | "all")[] = ["all", "certifications", "education", "courses", "exams", "badges"];

/* The visual archive shows photos only: every numbered image that is not a
   certificate scan (those open from their card in #all-certificates).
   slideIndex = its position in the lightbox, which still holds every image. */
const CERT_INDICES = new Set(ALL_GALLERY_CERTIFICATES.map((c) => c.galleryIndex));
const PHOTOS = PORTFOLIO_DATA.artGallery
  .map((img, i) => ({ ...img, slideIndex: i }))
  .filter((img) => !CERT_INDICES.has(img.slideIndex + 1));

/* ?cert=N in the URL → open image N in the lightbox — on arrival, and again
   when the palette links to another scan while the gallery is open. Its own
   tiny component: useSearchParams makes everything up to the nearest
   Suspense render in the browser only, so only this renders there. */
function CertParam({ onOpen }: { onOpen: (index: number) => void }) {
  const certParam = useSearchParams().get("cert");
  useEffect(() => {
    const idx = Number(certParam) - 1;
    if (certParam && Number.isInteger(idx) && idx >= 0 && idx < PORTFOLIO_DATA.artGallery.length) onOpen(idx);
  }, [certParam, onOpen]);
  return null;
}

/* {certs} {professional} {photos} in the copy → the counts */
const fill = (text: string) =>
  text
    .replace("{certs}", String(ALL_GALLERY_CERTIFICATES.length))
    .replace("{professional}", String(galleryGroupCount("certifications")))
    .replace("{photos}", String(PHOTOS.length));

/** copy: the words of the page — English by default, GALLERY_AR on /ar/gallery */
export default function ArtGallery({ copy = GALLERY_EN }: { copy?: GalleryCopy }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  /* ?cert=N in the URL → open image N in the lightbox (CertParam below) */
  const openFromUrl = useCallback((idx: number) => {
    setIndex(idx);
    setOpen(true);
  }, []);
  const [certFilter, setCertFilter] = useState<GalleryCertGroup | "all">("all");
  const [visible, setVisible] = useState(FIRST);

  const filteredCerts = useMemo(
    () =>
      certFilter === "all"
        ? ALL_GALLERY_CERTIFICATES
        : ALL_GALLERY_CERTIFICATES.filter((c) => c.group === certFilter),
    [certFilter],
  );

  const shownArchive = PHOTOS.slice(0, visible);

  const lightboxSlides = useMemo(
    () =>
      PORTFOLIO_DATA.artGallery.map((img) => ({
        src: img.src,
        title: img.title,
        description: `${img.description} ${copy.topics} ${img.keywords.join(", ")}.`,
      })),
    [copy.topics],
  );

  const openCertificateScan = (galleryIndex: number) => {
    setIndex(Math.max(0, galleryIndex - 1));
    setOpen(true);
  };


  return (
    <section
      id="art"
      aria-labelledby="art-title"
      className="relative pt-8 md:pt-12 pb-24 md:pb-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      <KanjiWatermark chars="芸術創造" side="left" />
      {/* Reads ?cert= — in its own Suspense so the gallery itself stays in the page's HTML */}
      <Suspense fallback={null}>
        <CertParam onOpen={openFromUrl} />
      </Suspense>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── 01 · Main Header ─── */}
        <SectionHeader
          id="art-title"
          as="h1"
          eyebrow={copy.eyebrow}
          japanese="証明"
          titleA={copy.titleA}
          titleB={copy.titleB}
          size="lg"
          description={fill(copy.description)}
          aside={
            <CounterChip
              tone="accent"
              stats={[
                { value: String(galleryGroupCount("certifications")).padStart(2, "0"), label: copy.statCerts },
                { value: String(PHOTOS.length).padStart(2, "0"), label: copy.statPhotos },
              ]}
            />
          }
        />

        {/* ─── 02 · All Certificates Directory (Literally every certificate) ─── */}
        <section
          id="all-certificates"
          className="relative mb-28 scroll-mt-28"
          aria-labelledby="all-certificates-title"
        >
          <Eyebrow>{copy.listEyebrow}</Eyebrow>
          <h2
            id="all-certificates-title"
            className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-3"
          >
            {copy.listTitleA} <span className="text-primary italic">{copy.listTitleB}</span>
          </h2>
          <p className="mb-8 max-w-2xl text-foreground/60 font-light leading-relaxed">{fill(copy.listText)}</p>

          <div
            className="flex flex-wrap gap-2.5 mb-10"
            role="tablist"
            aria-label={copy.filterLabel}
          >
            {CERT_FILTERS.map((id) => {
              const count =
                id === "all"
                  ? ALL_GALLERY_CERTIFICATES.length
                  : ALL_GALLERY_CERTIFICATES.filter((c) => c.group === id)
                      .length;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={certFilter === id}
                  onClick={() => setCertFilter(id)}
                  className={filterTab(certFilter === id)}
                >
                  {copy.filters[id]}{" "}
                  <span className="ms-1.5 font-mono text-[0.625rem] tabular-nums">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCerts.map((cert, idx) => {
              const num = String(idx + 1).padStart(2, "0");
              return (
                <FadeIn
                  as="li"
                  y={20}
                  duration={0.5}
                  delay={(idx % 6) * 0.05}
                  key={cert.galleryIndex}
                >
                  <TiltCard className="spotlight group relative flex h-full flex-col bg-surface/60 border border-foreground/5 hover:border-primary/40 transition-colors duration-300">
                    <CardEffects index={Number(num)} />
                    <button
                      type="button"
                      onClick={() => openCertificateScan(cert.galleryIndex)}
                      className="relative z-20 flex flex-1 flex-col justify-between w-full text-start p-7 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-3 font-mono text-[0.625rem] text-primary-ink tracking-[0.25em] uppercase mb-3 pe-12">
                          {/* who issued it: logo, or initials (data/logos.ts) */}
                          <OrgLogo name={cert.issuer} size="sm" />
                          <span>
                            {num} • <bdi>{cert.issuer}</bdi>
                          </span>
                        </div>
                        <h3 className={`font-display ${sizeFor(cert.title, "text-lg md:text-xl", "text-base md:text-lg")} font-black uppercase text-foreground mb-3 group-hover:text-primary-ink transition-colors duration-300 leading-tight`}>
                          {/* <bdi>: the English names keep their punctuation in place on /ar/gallery */}
                          <bdi>{cert.title}</bdi>
                        </h3>
                        <p className="text-sm text-foreground/60 font-light leading-relaxed">
                          <bdi>{cert.summary}</bdi>
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-foreground/5 flex items-center justify-between gap-3 w-full">
                        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-accent">
                          <bdi>{cert.kind}</bdi>
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60 group-hover:text-primary-ink transition-colors">
                          {copy.viewScan} <Maximize2 size={11} aria-hidden="true" />
                        </span>
                      </div>
                    </button>
                    {/* The issuer's own verification page (verifyUrl in
                        data/certifications.ts) — only where one exists */}
                    {cert.verifyUrl && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-20 mx-7 mb-6 -mt-3 inline-flex min-h-6 items-center gap-1.5 self-start font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/70 hover:text-primary-ink transition-colors"
                      >
                        <ShieldCheck size={12} aria-hidden="true" />
                        {copy.verifyWith} <bdi>{cert.issuer}</bdi>
                        <ExternalLink size={11} aria-hidden="true" />
                        <span className="sr-only">{copy.opensIssuer}</span>
                      </a>
                    )}
                  </TiltCard>
                </FadeIn>
              );
            })}
          </ol>
        </section>

        {/* ─── 03 · Visual Archive (masonry grid of classroom & event photos) ─── */}
        <section
          id="visual-archive"
          className="relative scroll-mt-28"
          aria-labelledby="visual-archive-title"
        >
          <Eyebrow>{copy.archiveEyebrow}</Eyebrow>
          <h2
            id="visual-archive-title"
            className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-3"
          >
            {copy.archiveTitleA} <span className="text-primary italic">{copy.archiveTitleB}</span>
          </h2>
          <p className="mb-10 max-w-2xl text-foreground/60 font-light leading-relaxed">{fill(copy.archiveText)}</p>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {shownArchive.map((img, idx) => (
              <FadeIn
                y={0}
                scale={0.95}
                duration={0.8}
                delay={(idx % 6) * 0.08}
                key={img.slideIndex}
                className="break-inside-avoid"
              >
                <TiltCard
                  max={5}
                  className="spotlight relative group overflow-hidden bg-surface border border-foreground/5 transition-all duration-300 hover:border-primary/40"
                >
                  <CardEffects index={idx + 1} />
                  <button
                    type="button"
                    onClick={() => {
                      setIndex(img.slideIndex);
                      setOpen(true);
                    }}
                    aria-label={`${copy.openPhoto} ${img.title} ${copy.openPhotoAfter}`}
                    className="absolute inset-0 z-30 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-4px]"
                  />

                  <Image
                    src={img.thumb}
                    alt={img.description}
                    width={500}
                    height={500}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="img-fade w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    onLoad={markLoaded}
                    onError={markLoaded}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    unoptimized={true}
                  />

                  <div className="hover-reveal absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-primary-ink mb-2">
                        <Sparkles size={12} />
                        <span className="font-mono text-[0.625rem] font-bold tracking-[0.3em] uppercase">
                          {copy.visualEntry}{" "}
                          {String(img.slideIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-black text-foreground uppercase tracking-tight">
                        <bdi>{img.title}</bdi>
                      </h3>
                      <p className="mt-2 text-xs text-foreground/70 leading-relaxed">
                        <bdi>{img.description}</bdi>
                      </p>
                      <p className="mt-2 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-tertiary">
                        <bdi>{img.category}</bdi>
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="w-10 h-[1px] bg-primary/40" />
                        <Maximize2
                          size={14}
                          className="text-on-surface-variant"
                        />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </FadeIn>
            ))}
          </div>

          {visible < PHOTOS.length && (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisible((n) => Math.min(PHOTOS.length, n + PAGE))
                }
                className="group flex items-center gap-3 px-8 py-4 border border-foreground/15 border-s-2 border-s-primary bg-foreground/[0.02] text-foreground font-mono font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:-translate-y-[1.7px]"
              >
                <ChevronDown
                  size={14}
                  className="text-primary-ink transition-transform duration-300 group-hover:translate-y-[1.7px]"
                />
                {copy.showMore}
                <span className="font-mono text-[0.625rem] text-foreground/60 tabular-nums">
                  {visible}/{PHOTOS.length}
                </span>
              </button>
            </div>
          )}
        </section>
      </div>

      {open && (
        <Suspense fallback={null}>
          <Lightbox
            close={() => setOpen(false)}
            index={index}
            slides={lightboxSlides}
          />
        </Suspense>
      )}
    </section>
  );
}
