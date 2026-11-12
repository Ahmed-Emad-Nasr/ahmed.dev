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
import { Suspense, useMemo, useState } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { markLoaded } from "@/lib/shared";
import {
  ALL_GALLERY_CERTIFICATES,
  galleryGroupCount,
  type GalleryCertGroup,
} from "@/data/certifications";
import { CardEffects, TiltCard } from "@/components/ui/Motion";
import { Eyebrow, filterTab } from "@/components/ui/kit";
import { useSearchParams } from "next/navigation";
import { Sparkles, Maximize2, ChevronDown } from "lucide-react";
import { preloadable } from "@/lib/perf/lazy";
import FadeIn from "@/components/ui/FadeIn";
import OrgLogo from "@/components/ui/OrgLogo";
import { MOTION_EASE } from "@/lib/motion";

/* preloadable = fetched in idle time and then rendered without a suspended
   frame: React holds back a suspended→ready swap for ~300ms, which is what
   made the first open feel late. */
const Lightbox = preloadable(() => import("@/components/ui/Lightbox"));

/* Images shown at first, and added by each "show more" click */
const FIRST = 12;
const PAGE = 12;

/* The certificate filter buttons (id must be a GalleryCertGroup or "all") */
const CERT_FILTERS: { id: GalleryCertGroup | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "certifications", label: "Certifications" },
  { id: "education", label: "Degree & Programs" },
  { id: "courses", label: "Courses & Training" },
  { id: "exams", label: "Exam Scores" },
  { id: "badges", label: "Verified Badges" },
];

/* The visual archive shows photos only: every numbered image that is not a
   certificate scan (those open from their card in #all-certificates).
   slideIndex = its position in the lightbox, which still holds every image. */
const CERT_INDICES = new Set(ALL_GALLERY_CERTIFICATES.map((c) => c.galleryIndex));
const PHOTOS = PORTFOLIO_DATA.artGallery
  .map((img, i) => ({ ...img, slideIndex: i }))
  .filter((img) => !CERT_INDICES.has(img.slideIndex + 1));

export default function ArtGallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  /* ?cert=N in the URL → open image N in the lightbox — on arrival, and
     again when the palette links to another scan while the gallery is open.
     (Never prerendered: LazySection mounts the gallery in the browser.) */
  const certParam = useSearchParams().get("cert");
  /* React's "adjust state when an input changes" pattern: compared while
     rendering, so the lightbox opens in the same pass (no effect + setState) */
  const [seenCertParam, setSeenCertParam] = useState<string | null>(null);
  if (certParam !== seenCertParam) {
    setSeenCertParam(certParam);
    const idx = Number(certParam) - 1;
    if (certParam && Number.isInteger(idx) && idx >= 0 && idx < PORTFOLIO_DATA.artGallery.length) {
      setIndex(idx);
      setOpen(true);
    }
  }
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
        description: `${img.description} Topics: ${img.keywords.join(", ")}.`,
      })),
    [],
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
      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── 01 · Main Header ─── */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <h2
              id="art-title"
              className="font-display title-fit [--title-n:9] font-black tracking-tighter uppercase leading-[0.85]"
            >
              <span className="text-foreground">Proof</span> <br />
              <span className="text-primary italic">Gallery.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base md:text-lg font-light leading-relaxed text-foreground/65 [text-wrap:pretty]">
              The proof behind everything on this site: my degree and{" "}
              {ALL_GALLERY_CERTIFICATES.length} certificates, courses and
              records, then {PHOTOS.length} photos from classrooms and events.
              Click any of them to see it full size.
            </p>
          </div>

          {/* Counter Badges */}
          <div
            className="flex flex-wrap gap-4"
          >
            <div className="relative px-6 py-3 border border-accent/40 bg-surface/60 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent" />
              <div className="flex items-center gap-3">
                <span className="font-mono text-accent text-2xl font-black tabular-nums">
                  {String(galleryGroupCount("certifications")).padStart(2, "0")}
                </span>
                <div className="flex flex-col">
                  <span className="font-mono text-[0.5625rem] text-on-surface-variant tracking-[0.3em] uppercase">
                    Certifications
                  </span>
                  <span className="font-mono text-[0.5625rem] text-on-surface-variant tracking-[0.3em] uppercase">
                    + {ALL_GALLERY_CERTIFICATES.length - galleryGroupCount("certifications")} courses &amp; records
                  </span>
                </div>
              </div>
            </div>

            <div className="relative px-6 py-3 border border-foreground/10 bg-surface/60 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
              <div className="flex items-center gap-3">
                <span className="font-mono text-primary-ink text-2xl font-black tabular-nums">
                  {String(PHOTOS.length).padStart(2, "0")}
                </span>
                <div className="flex flex-col">
                  <span className="font-mono text-[0.5625rem] text-on-surface-variant tracking-[0.3em] uppercase">
                    Photos
                  </span>
                  <span className="font-mono text-[0.5625rem] text-on-surface-variant tracking-[0.3em] uppercase">
                    Classes &amp; events
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 02 · All Certificates Directory (Literally every certificate) ─── */}
        <section
          id="all-certificates"
          className="relative mb-28 scroll-mt-28"
          aria-labelledby="all-certificates-title"
        >
          <Eyebrow japanese="認定">
            The full list // certifications, courses &amp; records
          </Eyebrow>
          <h2
            id="all-certificates-title"
            className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-3"
          >
            All <span className="text-primary italic">Credentials.</span>
          </h2>
          <p className="mb-8 max-w-2xl text-foreground/60 font-light leading-relaxed">
            Everything on paper ({ALL_GALLERY_CERTIFICATES.length} documents),
            sorted by what it really is: {galleryGroupCount("certifications")}{" "}
            professional certifications passed by exam, then my degree and
            programmes, courses and training, exam score reports and the badges
            that verify them. Each card says who issued it and what it covers —
            click one to see the original document.
          </p>

          <div
            className="flex flex-wrap gap-2.5 mb-10"
            role="tablist"
            aria-label="Filter certificates by category"
          >
            {CERT_FILTERS.map((f) => {
              const count =
                f.id === "all"
                  ? ALL_GALLERY_CERTIFICATES.length
                  : ALL_GALLERY_CERTIFICATES.filter((c) => c.group === f.id)
                      .length;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={certFilter === f.id}
                  onClick={() => setCertFilter(f.id)}
                  className={filterTab(certFilter === f.id)}
                >
                  {f.label}{" "}
                  <span className="ml-1.5 font-mono text-[0.625rem] tabular-nums">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert, idx) => {
              const num = String(idx + 1).padStart(2, "0");
              return (
                <FadeIn delay={idx * 0.04} ease={MOTION_EASE} margin="-50px"
                  as="li"
                  key={cert.galleryIndex}
                >
                  <TiltCard className="spotlight group relative h-full bg-surface/60 border border-foreground/5 hover:border-primary/40 transition-colors duration-500">
                    <CardEffects index={Number(num)} />
                    <button
                      type="button"
                      onClick={() => openCertificateScan(cert.galleryIndex)}
                      className="relative z-20 flex flex-col justify-between w-full h-full text-left p-7 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-3 font-mono text-[0.625rem] text-primary-ink tracking-[0.25em] uppercase mb-3 pr-12">
                          {/* who issued it: logo, or initials (data/logos.ts) */}
                          <OrgLogo name={cert.issuer} size="sm" />
                          <span>
                            {num} • {cert.issuer}
                          </span>
                        </div>
                        <h3 className="font-display text-lg md:text-xl font-black uppercase text-foreground mb-3 group-hover:text-primary-ink transition-colors duration-300 leading-tight">
                          {cert.title}
                        </h3>
                        <p className="text-sm text-foreground/60 font-light leading-relaxed">
                          {cert.summary}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-foreground/5 flex items-center justify-between gap-3 w-full">
                        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-accent">
                          {cert.kind}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60 group-hover:text-primary-ink transition-colors">
                          View scan <Maximize2 size={11} />
                        </span>
                      </div>
                    </button>
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
          <Eyebrow japanese="証拠">Classes &amp; events</Eyebrow>
          <h2
            id="visual-archive-title"
            className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-3"
          >
            Visual <span className="text-primary italic">Archive.</span>
          </h2>
          <p className="mb-10 max-w-2xl text-foreground/60 font-light leading-relaxed">
            Photos from the classes I taught, competitions and community
            events ({PHOTOS.length}). The certificate scans open from their
            cards above.
          </p>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {shownArchive.map((img, idx) => (
              <FadeIn delay={(idx % 3) * 0.04} ease={MOTION_EASE} margin="-50px"
                key={img.slideIndex}
                className="break-inside-avoid"
              >
                <TiltCard
                  max={5}
                  className="spotlight relative group overflow-hidden bg-surface border border-foreground/5 transition-all duration-700 hover:border-primary/40"
                >
                  <CardEffects index={idx + 1} />
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-500 z-20 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-500 z-20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-500 z-20 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-500 z-20 pointer-events-none" />

                  <button
                    type="button"
                    onClick={() => {
                      setIndex(img.slideIndex);
                      setOpen(true);
                    }}
                    aria-label={`Open ${img.title} in lightbox`}
                    className="absolute inset-0 z-30 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-4px]"
                  />

                  <Image
                    src={img.thumb}
                    alt={img.description}
                    width={500}
                    height={500}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="img-fade w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    onLoad={markLoaded}
                    onError={markLoaded}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    unoptimized={true}
                  />

                  <div
                    className="gallery-halftone pointer-events-none absolute inset-0 z-[5] opacity-0 transition-[opacity,transform] duration-[900ms] ease-out group-hover:scale-[1.2] group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  <div className="hover-reveal absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 z-10">
                    <div
                      className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, transparent 48%, var(--primary) 48%, var(--primary) 49%, transparent 49%)",
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-primary-ink mb-2">
                        <Sparkles size={12} />
                        <span className="font-mono text-[0.625rem] font-bold tracking-[0.3em] uppercase">
                          Visual Entry{" "}
                          {String(img.slideIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-black text-foreground uppercase tracking-tight">
                        {img.title}
                      </h3>
                      <p className="mt-2 text-xs text-foreground/70 leading-relaxed">
                        {img.description}
                      </p>
                      <p className="mt-2 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-tertiary">
                        {img.category}
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
                className="group flex items-center gap-3 px-8 py-4 border border-foreground/15 border-l-2 border-l-primary bg-foreground/[0.02] backdrop-blur-md text-foreground font-mono font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5"
              >
                <ChevronDown
                  size={14}
                  className="text-primary-ink transition-transform duration-300 group-hover:translate-y-0.5"
                />
                Show more
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
