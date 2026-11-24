"use client";

/*
 * ═══ components/certificates/CertificateList.tsx — the /certificates list ═══
 *
 * Every certificate as a card: the scan, who issued it, when, the length or
 * score, a summary, a link to its own page (/certificates/<slug>, every
 * detail) and the issuer's verification link where one exists. Filter
 * buttons by type; "View scan" opens the full image in the lightbox.
 *
 * Data: data/certificates.ts. Words: data/certificates-copy.ts (EN/AR).
 * Pictures: Assets/certificates/<slug>-thumb.webp (npm run thumbs).
 */

import Image from "next/image";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Maximize2, ShieldCheck } from "lucide-react";
import {
  CERTIFICATES,
  certificateAlt,
  certificateGroupCount,
  certificateImagePath,
  certificatePagePath,
  certificateThumbPath,
  certificateWhen,
  type CertificateGroup,
} from "@/data/certificates";
import { CERTS_EN, type CertificatesCopy } from "@/data/certificates-copy";
import { markLoaded, normalizePublicHref, sizeFor } from "@/lib/shared";
import { preloadable } from "@/lib/perf/lazy";
import { CardEffects, TiltCard } from "@/components/ui/Motion";
import { KanjiWatermark, filterTab } from "@/components/ui/kit";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import FadeIn from "@/components/ui/FadeIn";
import OrgLogo from "@/components/ui/OrgLogo";

const Lightbox = preloadable(() => import("@/components/ui/Lightbox"));

/* The filter buttons, in order (labels: data/certificates-copy.ts) */
const FILTERS: (CertificateGroup | "all")[] = ["all", "certifications", "education", "courses", "exams", "badges"];

const VERIFIABLE = CERTIFICATES.filter((c) => c.verifyUrl).length;

const fill = (text: string) =>
  text
    .replace("{all}", String(CERTIFICATES.length))
    .replace("{professional}", String(certificateGroupCount("certifications")))
    .replace("{verifiable}", String(VERIFIABLE));

/* The lightbox holds every scan, in list order */
const SLIDES = CERTIFICATES.map((c) => ({
  src: normalizePublicHref(certificateImagePath(c.slug)),
  title: `${c.title} — ${c.issuer}`,
  description: [certificateWhen(c), c.hours, c.score, c.credentialId && `ID ${c.credentialId}`].filter(Boolean).join(" · ") + `\n${c.summary}`,
}));

type Props = {
  copy?: CertificatesCopy;
  /** Thumbnail sizes by slug (read from the files by the page): a portrait
      scan is shown from its top, a landscape one from its centre */
  sizes?: Readonly<Record<string, { width: number; height: number }>>;
};

export default function CertificateList({ copy = CERTS_EN, sizes = {} }: Props) {
  const [filter, setFilter] = useState<CertificateGroup | "all">("all");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const shown = useMemo(
    () => (filter === "all" ? CERTIFICATES : CERTIFICATES.filter((c) => c.group === filter)),
    [filter],
  );

  const openScan = (slug: string) => {
    setIndex(Math.max(0, CERTIFICATES.findIndex((c) => c.slug === slug)));
    setOpen(true);
  };

  return (
    <section
      id="certificates"
      aria-labelledby="certificates-title"
      className="relative pt-8 md:pt-12 pb-24 md:pb-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      <KanjiWatermark chars="証明書" side="left" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          id="certificates-title"
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
                { value: String(CERTIFICATES.length).padStart(2, "0"), label: copy.statAll },
                { value: String(certificateGroupCount("certifications")).padStart(2, "0"), label: copy.statProfessional },
                { value: String(VERIFIABLE).padStart(2, "0"), label: copy.statVerifiable },
              ]}
            />
          }
        />

        <div className="flex flex-wrap gap-2.5 mb-4" role="tablist" aria-label={copy.filterLabel}>
          {FILTERS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              aria-controls="certificate-grid"
              onClick={() => setFilter(id)}
              className={filterTab(filter === id)}
            >
              {copy.filters[id]}{" "}
              <span className="ms-1.5 font-mono text-[0.625rem] tabular-nums">
                ({id === "all" ? CERTIFICATES.length : certificateGroupCount(id)})
              </span>
            </button>
          ))}
        </div>
        <p className="mb-10 text-sm text-foreground/60 font-light" aria-live="polite">
          {copy.groupNotes[filter]}
        </p>

        {/* key: a new filter draws the list afresh, so the cards fade in one
            after another (FadeIn) instead of jumping into their new places */}
        <ol key={filter} id="certificate-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {shown.map((c, idx) => {
            const when = certificateWhen(c);
            const facts = [c.hours, c.score].filter(Boolean) as string[];
            return (
              <FadeIn as="li" y={20} duration={0.5} delay={(idx % 6) * 0.05} key={c.slug} id={c.slug} className="scroll-mt-28">
                <TiltCard max={4} className="spotlight group relative flex h-full flex-col bg-surface/60 border border-foreground/5 hover:border-primary/40 transition-colors duration-300">
                  <CardEffects index={idx + 1} />
                  {/* The scan: opens full size in the lightbox */}
                  <button
                    type="button"
                    onClick={() => openScan(c.slug)}
                    className="relative z-20 block aspect-[4/3] w-full overflow-hidden border-b border-foreground/5 bg-surface cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-4px]"
                    aria-label={`${copy.viewScan}: ${c.title}`}
                  >
                    <Image
                      src={normalizePublicHref(certificateThumbPath(c.slug))}
                      alt={certificateAlt(c)}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className={`img-fade object-cover grayscale group-hover:grayscale-0 group-focus-within:grayscale-0 ${(sizes[c.slug]?.height ?? 0) > (sizes[c.slug]?.width ?? 1) ? "object-top" : "object-center"} transition-[transform,filter] duration-700 group-hover:scale-[1.04]`}
                      onLoad={markLoaded}
                      onError={markLoaded}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute bottom-2 end-2 inline-flex items-center gap-1.5 bg-background/85 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/80">
                      <Maximize2 size={11} aria-hidden="true" /> {copy.viewScan}
                    </span>
                  </button>

                  <div className="relative z-20 flex flex-1 flex-col p-6 md:p-7">
                    <div className="flex items-center gap-3 font-mono text-[0.625rem] text-primary-ink tracking-[0.2em] uppercase mb-3">
                      <OrgLogo name={c.issuer} size="sm" />
                      <span className="min-w-0">
                        <bdi>{c.issuer}</bdi>
                      </span>
                    </div>
                    <h3
                      className={`font-display ${sizeFor(c.title, "text-lg md:text-xl", "text-base md:text-lg")} font-black uppercase text-foreground leading-tight mb-2`}
                    >
                      <Link prefetch={false} href={certificatePagePath(c.slug)} className="hover:text-primary-ink transition-colors">
                        <bdi>{c.title}</bdi>
                      </Link>
                    </h3>
                    {(when || facts.length > 0) && (
                      <p className="mb-3 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-tertiary">
                        <bdi>{[when, ...facts].filter(Boolean).join(" · ")}</bdi>
                      </p>
                    )}
                    <p className="text-sm text-foreground/65 font-light leading-relaxed">
                      <bdi>{c.summary}</bdi>
                    </p>

                    <div className="mt-auto pt-5 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/5 mt-6">
                      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-accent">
                        <bdi>{c.kind}</bdi>
                      </span>
                      <span className="flex flex-wrap items-center gap-4">
                        {c.verifyUrl && (
                          <a
                            href={c.verifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-6 items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/70 hover:text-primary-ink transition-colors"
                          >
                            <ShieldCheck size={12} aria-hidden="true" /> {copy.verify}
                            <ExternalLink size={10} aria-hidden="true" />
                            <span className="sr-only">
                              {c.issuer} {copy.opensIssuer}
                            </span>
                          </a>
                        )}
                        <Link
                          prefetch={false}
                          href={certificatePagePath(c.slug)}
                          className="inline-flex min-h-6 items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-primary-ink hover:text-foreground transition-colors"
                        >
                          {copy.details}
                          <ArrowRight size={11} aria-hidden="true" className="rtl:-scale-x-100" />
                          <span className="sr-only">: {c.title}</span>
                        </Link>
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </FadeIn>
            );
          })}
        </ol>
      </div>

      {open && (
        <Suspense fallback={null}>
          <Lightbox close={() => setOpen(false)} index={index} slides={SLIDES} />
        </Suspense>
      )}
    </section>
  );
}
