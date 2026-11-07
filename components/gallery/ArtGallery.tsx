"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import {
  ALL_GALLERY_CERTIFICATES,
  type GalleryCertGroup,
} from "@/data/certifications";
import { CardEffects, TiltCard } from "@/components/ui/Motion";
import { Eyebrow, filterTab } from "@/components/ui/kit";
import dynamic from "next/dynamic";
import { Sparkles, Maximize2, ChevronDown } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import Logo from "@/components/ui/Logo";

const Lightbox = dynamic(() => import("@/components/ui/Lightbox"), {
  ssr: false,
});

const FIRST = 12;
const PAGE = 12;

const CERT_FILTERS: { id: GalleryCertGroup | "all"; label: string; hint: string }[] = [
  { id: "all", label: "All", hint: "Every certificate, training programme, exam result and badge." },
  { id: "core", label: "Main certificates", hint: "Professional certifications, internships and long government-funded training programmes." },
  { id: "labs", label: "Labs & training", hint: "Shorter hands-on courses and practice labs that prepared me for the exams." },
  { id: "exams", label: "Exam results", hint: "Official score reports — the mark I got, not only a pass." },
  { id: "badges", label: "Digital badges", hint: "Online badges that can be checked on the issuer's own website." },
];

const CERT_INDICES = new Set(
  ALL_GALLERY_CERTIFICATES.map((c) => c.galleryIndex),
);

export default function ArtGallery() {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const certParam = searchParams ? searchParams.get("cert") : null;

  useEffect(() => {
    if (certParam) {
      const idx = Number(certParam) - 1;
      if (!Number.isNaN(idx) && idx >= 0) {
        setIndex(idx);
        setOpen(true);
      }
    }
  }, [certParam]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [certFilter, setCertFilter] = useState<GalleryCertGroup | "all">("all");
  const [visible, setVisible] = useState(FIRST);

  const filteredCerts = useMemo(
    () =>
      certFilter === "all"
        ? ALL_GALLERY_CERTIFICATES
        : ALL_GALLERY_CERTIFICATES.filter((c) => c.group === certFilter),
    [certFilter],
  );

  /* Photos only: every certificate scan is already one click away in the
     certificate list above, so the archive no longer repeats them */
  const archiveItems = useMemo(
    () =>
      PORTFOLIO_DATA.artGallery
        .map((img, i) => ({ ...img, slideIndex: i }))
        .filter((img) => !CERT_INDICES.has(img.slideIndex + 1)),
    [],
  );

  const shownArchive = archiveItems.slice(0, visible);

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
      className="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── 01 · Main Header ─── */}
        <div className="mb-16 md:mb-20 flex flex-col xl:flex-row justify-between xl:items-end gap-8">
          <FadeIn x={-40} y={0} duration={0.8} className="max-w-3xl">
            <h1
              id="art-title"
              className="font-display title-fit [--title-n:9] font-black tracking-tighter uppercase leading-[0.85]"
            >
              <span className="text-foreground">Proof</span> <br />
              <span className="text-primary italic">Gallery.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg font-light leading-relaxed text-foreground/65 [text-wrap:pretty]">
              Two parts: first every certificate and badge I hold — each card
              says who issued it and what it covers, and opens the original —
              then photos from the classes I teach and the events I joined.
            </p>
          </FadeIn>

          {/* Counter Badges */}
          <FadeIn
            y={20}
            duration={0.6}
            delay={0.3}
            className="flex flex-wrap gap-4"
          >
            <div className="relative px-6 py-3 border border-accent/40 bg-surface/60 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent" />
              <div className="flex items-center gap-3">
                <span className="font-mono text-accent text-2xl font-black tabular-nums">
                  {String(ALL_GALLERY_CERTIFICATES.length).padStart(2, "0")}
                </span>
                <div className="flex flex-col">
                  <span className="font-mono text-[0.5625rem] text-on-surface-variant tracking-[0.3em] uppercase">
                    Certificates
                  </span>
                  <span className="font-mono text-[0.5625rem] text-on-surface-variant tracking-[0.3em] uppercase">
                    &amp; Badges
                  </span>
                </div>
              </div>
            </div>

            <div className="relative px-6 py-3 border border-foreground/10 bg-surface/60 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
              <div className="flex items-center gap-3">
                <span className="font-mono text-primary-ink text-2xl font-black tabular-nums">
                  {String(PORTFOLIO_DATA.artGallery.length - ALL_GALLERY_CERTIFICATES.length).padStart(2, "0")}
                </span>
                <div className="flex flex-col">
                  <span className="font-mono text-[0.5625rem] text-on-surface-variant tracking-[0.3em] uppercase">
                    Photos
                  </span>
                  <span className="font-mono text-[0.5625rem] text-on-surface-variant tracking-[0.3em] uppercase">
                    Teaching &amp; events
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ─── 03 · All Certificates Directory (Literally every certificate) ─── */}
        <section
          id="all-certificates"
          className="relative mb-28 scroll-mt-28"
          aria-labelledby="all-certificates-title"
        >
          <Eyebrow japanese="認定">
            Every certificate
          </Eyebrow>
          <h2
            id="all-certificates-title"
            className="font-display text-[min(1.875rem,8.2vw)] md:text-5xl font-black uppercase tracking-tight text-foreground mb-3"
          >
            All <span className="text-primary italic">Certificates.</span>
          </h2>
          <p className="mb-8 max-w-2xl text-foreground/60 font-light leading-relaxed">
            {ALL_GALLERY_CERTIFICATES.length} in total. Each card says who issued
            it and what it covers in one line. Click a card to see the original
            certificate.
          </p>

          <div
            className="flex flex-wrap gap-2.5 mb-4"
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

          <div className="mb-10" aria-live="polite">
            <p key={certFilter} className="answer-in font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/60">
              {CERT_FILTERS.find((f) => f.id === certFilter)?.hint}
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {/* No tilt: these cards are for reading. The spotlight still follows the pointer. */}
                  <TiltCard max={0} className="spotlight group relative h-full bg-surface/60 border border-foreground/5 hover:border-primary/40 transition-colors duration-500">
                    <CardEffects index={Number(num)} />
                    <button
                      type="button"
                      onClick={() => openCertificateScan(cert.galleryIndex)}
                      className="@container relative z-20 flex flex-col justify-between w-full h-full text-left p-7 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-4 pr-12">
                          <Logo name={cert.issuer} size={36} />
                          <div className="font-mono text-[0.625rem] text-primary-ink tracking-[0.25em] uppercase">
                            {num} • {cert.issuer}
                          </div>
                        </div>
                        <h3 className="font-display text-[min(1.125rem,7.6cqi)] md:text-[min(1.25rem,7.6cqi)] font-black uppercase text-foreground mb-3 group-hover:text-primary-ink transition-colors duration-300 leading-tight">
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
                          View certificate <Maximize2 size={11} />
                        </span>
                      </div>
                    </button>
                  </TiltCard>
                </FadeIn>
              );
            })}
          </ol>
        </section>

        {/* ─── 04 · Visual Archive (Masonry Grid of Scans & Event Photos) ─── */}
        <section
          id="visual-archive"
          className="relative scroll-mt-28"
          aria-labelledby="visual-archive-title"
        >
          <Eyebrow japanese="証拠">Photos</Eyebrow>
          <h2
            id="visual-archive-title"
            className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-3"
          >
            Teaching &amp; <span className="text-primary italic">Events.</span>
          </h2>
          <p className="mb-8 max-w-2xl text-foreground/60 font-light leading-relaxed">
            {archiveItems.length} photos from the classes I teach at AMIT and
            NTI, competitions, hackathons and security events. Click any photo
            to see it full size.
          </p>

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
                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
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
                          Photo {String(idx + 1).padStart(2, "0")}
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

          {visible < archiveItems.length && (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisible((n) => Math.min(archiveItems.length, n + PAGE))
                }
                className="group flex items-center gap-3 px-8 py-4 border border-foreground/15 border-l-2 border-l-primary bg-foreground/[0.02] backdrop-blur-md text-foreground font-mono font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                <ChevronDown
                  size={14}
                  className="text-primary-ink transition-transform duration-300 group-hover:translate-y-0.5"
                />
                Show more
                <span className="font-mono text-[0.625rem] text-foreground/60 tabular-nums">
                  {visible}/{archiveItems.length}
                </span>
              </button>
            </div>
          )}
        </section>
      </div>

      {open && (
        <Lightbox
          close={() => setOpen(false)}
          index={index}
          slides={lightboxSlides}
        />
      )}
    </section>
  );
}
