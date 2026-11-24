/*
 * ═══ app/certificates/[slug]/page.tsx — one certificate  ( URL: /certificates/<slug> ) ═══
 *
 * Everything about one document: the full scan, who issued it and who
 * delivered it, the date or period, length, score, credential ID, instructor,
 * the name exactly as printed, the full explanation, what it covers, the
 * issuer's verification link, and the image's own details (file, size,
 * caption, keywords, copyright). One page per entry in data/certificates.ts —
 * add an entry there and its page exists.
 *
 * The share card of the page is the scan itself.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Download, ExternalLink, Info, ShieldCheck } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import BackCrumb from "@/components/layout/BackCrumb";
import FadeIn from "@/components/ui/FadeIn";
import OrgLogo from "@/components/ui/OrgLogo";
import { Eyebrow, KanjiWatermark, btnOutline, cardSurface, chipNeutral, ctaPrimary } from "@/components/ui/kit";
import {
  CERTIFICATES,
  certificateAlt,
  certificateBySlug,
  certificateImagePath,
  certificateKeywords,
  certificatePagePath,
  certificateWhen,
  type Certificate,
} from "@/data/certificates";
import { CERTS_EN } from "@/data/certificates-copy";
import { longestWord, normalizePublicHref, splitTitle } from "@/lib/shared";
import { absoluteUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/page-meta";
import { imageSize } from "@/lib/image-meta";
import { KEYWORDS, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords } from "@/lib/seo";
import { CERTIFICATES_URL } from "@/lib/page-ids";
import { certificateCredentialLd, certificateImageLd, certificatePageUrl } from "@/lib/certificates-ld";
import type { CSSProperties, ReactNode } from "react";

export const dynamicParams = false;

export function generateStaticParams() {
  return CERTIFICATES.map((c) => ({ slug: c.slug }));
}

const describe = (c: Certificate) => {
  const when = certificateWhen(c);
  const facts = [when, c.hours, c.score && `score ${c.score}`, c.credentialId && `ID ${c.credentialId}`].filter(Boolean).join(" · ");
  return `${c.title} — ${c.kind} issued by ${c.issuer} to Ahmed Emad Nasr${facts ? ` (${facts})` : ""}. ${c.summary}`;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = certificateBySlug((await params).slug);
  if (!c) return { title: "Certificate not found" };
  const size = imageSize(certificateImagePath(c.slug));
  return pageMetadata({
    title: `${c.title} — ${c.issuer} | Ahmed Emad Nasr`,
    description: describe(c).slice(0, 300),
    path: certificatePagePath(c.slug),
    keywords: pageKeywords(certificateKeywords(c), KEYWORDS.certificates),
    share: {
      url: absoluteUrl(certificateImagePath(c.slug)),
      width: size?.width ?? 1200,
      height: size?.height ?? 630,
      type: "image/webp",
      alt: certificateAlt(c),
    },
    type: "article",
  });
}

/** One row of the details list — only when there is a value */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    /* Label beside the value — or above it where the card is narrow (lg: two columns of page) */
    <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] lg:grid-cols-1 xl:grid-cols-[8.5rem_1fr] gap-1 sm:gap-4 lg:gap-1 xl:gap-4 py-3 border-b border-foreground/5 last:border-0">
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/55 pt-0.5">{label}</dt>
      <dd className="min-w-0 text-sm text-foreground/85 leading-relaxed [overflow-wrap:break-word]">{children}</dd>
    </div>
  );
}

export default async function CertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = certificateBySlug((await params).slug);
  if (!c) notFound();

  const url = certificatePageUrl(c);
  const titleParts = splitTitle(c.title);
  const src = certificateImagePath(c.slug);
  const size = imageSize(src);
  const when = certificateWhen(c);
  const keywords = certificateKeywords(c);
  const position = CERTIFICATES.findIndex((x) => x.slug === c.slug);
  const prev = CERTIFICATES[position - 1];
  const next = CERTIFICATES[position + 1];
  const sameIssuer = CERTIFICATES.filter((x) => x.issuer === c.issuer && x.slug !== c.slug).slice(0, 6);

  const structuredData = jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: `${c.title} — ${c.issuer}`,
        description: describe(c),
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": `${url}#credential` },
        primaryImageOfPage: { "@id": `${url}#scan` },
      },
      certificateCredentialLd(c),
      certificateImageLd(c),
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["Certificates", CERTIFICATES_URL],
        [c.title, url],
      ]),
    ],
  });

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <article className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden">
        <KanjiWatermark chars="証明書" side="right" />
        <div className="max-w-7xl mx-auto relative z-10">
          <BackCrumb href="/certificates" label="All certificates" current={c.kind} />

          <header className="mb-12 md:mb-16">
            <Eyebrow>Ahmed Emad Nasr // {CERTS_EN.filters[c.group]}</Eyebrow>
            <div className="title-box">
              <h1
                style={{ "--word-n": Math.max(longestWord(titleParts.main), 8) } as CSSProperties}
                className={`font-display word-fit ${titleParts.main.length > 36 ? "[--fit-max:1.5rem] sm:[--fit-max:1.875rem] md:[--fit-max:2.5rem] lg:[--fit-max:3rem]" : "[--fit-max:1.875rem] md:[--fit-max:3rem] lg:[--fit-max:3.75rem]"} font-black uppercase tracking-tight leading-[1.02] text-foreground [text-wrap:balance]`}
              >
                {titleParts.main}
                {titleParts.sub && (
                  <>
                    <span className="sr-only"> — </span>
                    <span className="mt-3 block font-body text-base md:text-xl font-light normal-case tracking-normal leading-snug text-foreground/70">
                      {titleParts.sub}
                    </span>
                  </>
                )}
              </h1>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <OrgLogo name={c.issuer} size="md" />
              <p className="text-base md:text-lg text-foreground/75">
                {CERTS_EN.issuedBy} <strong className="font-semibold text-foreground">{c.issuer}</strong>
                {when && <span className="text-foreground/55"> · {when}</span>}
              </p>
            </div>
            <p className="mt-6 max-w-3xl text-lg text-foreground/70 font-light leading-relaxed">{c.summary}</p>
            {c.verifyUrl && (
              <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className={`${ctaPrimary} mt-8`}>
                <ShieldCheck size={16} aria-hidden="true" /> Verify with {c.issuer}
                <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only"> (opens the issuer&apos;s site)</span>
              </a>
            )}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
            {/* The scan, full size */}
            <FadeIn as="figure" className="min-w-0">
              <a
                href={normalizePublicHref(src)}
                target="_blank"
                rel="noopener"
                className="block overflow-hidden border border-foreground/10 cursor-zoom-in"
                aria-label={`Open the scan of ${c.title} full size`}
              >
                <Image
                  src={normalizePublicHref(src)}
                  alt={certificateAlt(c)}
                  width={size?.width ?? 1200}
                  height={size?.height ?? 900}
                  unoptimized
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="w-full h-auto"
                />
              </a>
              <figcaption className="mt-3 text-xs text-foreground/60 leading-relaxed">
                {certificateAlt(c)}{" "}
                <a href={normalizePublicHref(src)} download className="inline-flex items-center gap-1 text-primary-ink hover:text-foreground">
                  <Download size={11} aria-hidden="true" /> Original image
                </a>
              </figcaption>
            </FadeIn>

            {/* Every detail printed on it */}
            <FadeIn delay={0.08} className={`${cardSurface} p-6 md:p-8 min-w-0`}>
              <h2 className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink mb-3">The details</h2>
              <dl>
                <Row label="Certificate">{c.title}</Row>
                <Row label="Type">{c.kind}</Row>
                <Row label="Issued by">
                  {c.issuerUrl ? (
                    <a href={c.issuerUrl} target="_blank" rel="noopener noreferrer" className="text-primary-ink hover:text-foreground underline underline-offset-4">
                      {c.issuer}
                    </a>
                  ) : (
                    c.issuer
                  )}
                </Row>
                {c.deliveredBy && <Row label="Delivered by">{c.deliveredBy}</Row>}
                {c.period && <Row label="Period">{c.period}</Row>}
                {c.date && <Row label={c.group === "exams" ? "Exam date" : "Date"}>{certificateWhen({ ...c, period: undefined })}</Row>}
                {c.hours && <Row label="Length">{c.hours}</Row>}
                {c.score && <Row label="Score">{c.score}</Row>}
                {c.credentialId && (
                  <Row label="Credential ID">
                    <code className="font-mono text-[0.8125rem]">{c.credentialId}</code>
                  </Row>
                )}
                {c.instructor && <Row label="Instructor">{c.instructor}</Row>}
                {c.nameOnDocument !== "—" && (
                  <Row label="Name on it">
                    <bdi>{c.nameOnDocument}</bdi>
                  </Row>
                )}
                <Row label="Verify">
                  {c.verifyUrl ? (
                    <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className="text-primary-ink hover:text-foreground underline underline-offset-4 break-all">
                      {c.verifyUrl.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <span className="text-foreground/60">No public verification page — the original document is shown here.</span>
                  )}
                </Row>
              </dl>
            </FadeIn>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-8 lg:gap-12">
            <FadeIn className="min-w-0">
              <h2 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground mb-5">
                About this <span className="text-primary italic">certificate.</span>
              </h2>
              <p className="text-base md:text-[1.0625rem] text-foreground/80 font-light leading-relaxed whitespace-pre-line">{c.description}</p>
              {c.note && (
                <p className="mt-6 flex gap-3 border-s-2 border-tertiary bg-foreground/[0.03] px-4 py-3 text-sm text-foreground/75 leading-relaxed">
                  <Info size={16} className="mt-0.5 shrink-0 text-tertiary" aria-hidden="true" />
                  {c.note}
                </p>
              )}
              <h3 className="mt-10 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">What it covers</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.covers.map((t) => (
                  <li key={t} className={chipNeutral}>
                    {t}
                  </li>
                ))}
              </ul>
            </FadeIn>

            {/* The image's own metadata — the same details are written into the file (scripts/tag-images.mjs) */}
            <FadeIn delay={0.08} className={`${cardSurface} p-6 md:p-8 min-w-0 self-start`}>
              <h2 className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink mb-3">About the image</h2>
              <dl>
                <Row label="File">
                  <code className="font-mono text-[0.75rem]">{src.split("/").pop()}</code>
                </Row>
                {size && <Row label="Size">{`${size.width} × ${size.height} px · WebP`}</Row>}
                <Row label="Caption">{certificateAlt(c)}</Row>
                <Row label="Keywords">{keywords.join(", ")}</Row>
                <Row label="Credit">Ahmed Emad Nasr</Row>
                <Row label="Copyright">Certificate issued by {c.issuer} to Ahmed Emad Nasr. Scan published by Ahmed Emad Nasr.</Row>
              </dl>
            </FadeIn>
          </div>

          {sameIssuer.length > 0 && (
            <section className="mt-20" aria-labelledby="same-issuer">
              <h2 id="same-issuer" className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-foreground/60 mb-5">
                More from {c.issuer}
              </h2>
              <ul className="flex flex-wrap gap-3">
                {sameIssuer.map((x) => (
                  <li key={x.slug}>
                    <Link prefetch={false} href={certificatePagePath(x.slug)} className={btnOutline}>
                      {x.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Previous and next certificate">
            {prev ? (
              <Link prefetch={false} href={certificatePagePath(prev.slug)} className={`${cardSurface} group p-5 hover:border-primary/40 transition-colors`}>
                <span className="flex items-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/55">
                  <ArrowLeft size={12} aria-hidden="true" /> Previous
                </span>
                <span className="mt-2 block text-sm font-semibold text-foreground group-hover:text-primary-ink">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link prefetch={false} href={certificatePagePath(next.slug)} className={`${cardSurface} group p-5 text-end hover:border-primary/40 transition-colors`}>
                <span className="flex items-center justify-end gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/55">
                  Next <ArrowRight size={12} aria-hidden="true" />
                </span>
                <span className="mt-2 block text-sm font-semibold text-foreground group-hover:text-primary-ink">{next.title}</span>
              </Link>
            )}
          </nav>
        </div>
      </article>
    </PageShell>
  );
}
