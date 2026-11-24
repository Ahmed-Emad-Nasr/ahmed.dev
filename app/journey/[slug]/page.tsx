/*
 * ═══ app/journey/[slug]/page.tsx — one item of the journey  ( URL: /journey/<slug> ) ═══
 *
 * One page for every step of the path, every training platform, every
 * recommendation and every sport on /journey — with everything the site
 * holds about it, as each certificate has its own page:
 *
 *   the header         title, the organisation / club / writer, when, the summary
 *   the story          the text of the step, platform or sport — or the
 *                      recommendation in full, word for word
 *   the details card   one row per fact (year, roles, profile, numbers …)
 *   the roles          each job / role behind it: dates, every bullet, skills
 *   the write-ups      a platform's latest write-ups, and the page with all
 *   the certificates   each one links to its own page
 *   the photos         from the gallery, with their captions
 *
 * The content comes from data/journey.ts (which reads the files the site
 * already has — nothing is typed twice). A new step, sport or
 * recommendation gets its page by itself.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Briefcase, Camera, FileText, Quote } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import BackCrumb from "@/components/layout/BackCrumb";
import FadeIn from "@/components/ui/FadeIn";
import OrgLogo from "@/components/ui/OrgLogo";
import QuoteText from "@/components/ui/QuoteText";
import { Eyebrow, KanjiWatermark, btnOutline, cardSurface, chipNeutral, ctaPrimary } from "@/components/ui/kit";
import { journeyItem, journeyItems, kindOf, roleMonth, type JourneyItem } from "@/data/journey";
import { journeyPath } from "@/data/journey-index";
import { certificateImagePath, certificatePagePath, certificateWhen } from "@/data/certificates";
import { formatPhotoDate, photoImagePath, photoThumbPath } from "@/data/gallery-photos";
import { getTryHackMeStats } from "@/lib/api/tryhackme";
import { longestWord, normalizePublicHref } from "@/lib/shared";
import { absoluteUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/page-meta";
import { pageShareImage, type ShareImage } from "@/lib/og";
import { imageSize } from "@/lib/image-meta";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords } from "@/lib/seo";
import { JOURNEY_URL } from "@/lib/page-ids";
import type { CSSProperties, ReactNode } from "react";

export const dynamicParams = false;

export function generateStaticParams() {
  return journeyItems().map((i) => ({ slug: i.slug }));
}

/* Photos shown on the page; the rest are a click away in the gallery */
const PHOTOS_SHOWN = 12;

const pageTitle = (i: JourneyItem) => {
  const k = kindOf(i);
  if (i.kind === "path") return `${i.when} — ${i.title}: ${i.subtitle} | Ahmed Emad Nasr`;
  if (i.kind === "recommendation") return `${i.title} recommends Ahmed Emad Nasr | ${k.label}`;
  if (i.kind === "platform") return `Ahmed Emad Nasr on ${i.title} — ${k.noun}`;
  return `Ahmed Emad Nasr — ${i.subtitle} at ${i.title}`;
};

/* The page's picture when shared: a photo of it, else a certificate scan, else the page's card */
function shareOf(i: JourneyItem): ShareImage {
  const photo = i.photos[0];
  if (photo) {
    const src = photoImagePath(photo.slug);
    const size = imageSize(src);
    return { url: absoluteUrl(src), width: size?.width ?? 1200, height: size?.height ?? 630, type: "image/webp", alt: photo.title };
  }
  const cert = i.certificates[0];
  if (cert) {
    const src = certificateImagePath(cert.slug);
    const size = imageSize(src);
    return { url: absoluteUrl(src), width: size?.width ?? 1200, height: size?.height ?? 630, type: "image/webp", alt: cert.title };
  }
  return pageShareImage("journey", `Ahmed Emad Nasr — ${i.title}`);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const i = journeyItem((await params).slug);
  if (!i) return { title: "Not found" };
  return pageMetadata({
    title: pageTitle(i),
    description: i.summary.slice(0, 300),
    path: journeyPath(i.slug),
    keywords: pageKeywords(
      [i.title, i.subtitle, ...i.roles.map((r) => r.subTag), ...i.certificates.map((c) => c.title)],
      i.kind === "sport" ? KEYWORDS.athlete : KEYWORDS.journey,
    ),
    share: shareOf(i),
    type: "article",
  });
}

/** One row of the details list */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] lg:grid-cols-1 xl:grid-cols-[8.5rem_1fr] gap-1 sm:gap-4 lg:gap-1 xl:gap-4 py-3 border-b border-foreground/5 last:border-0">
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/60 pt-0.5">{label}</dt>
      <dd className="min-w-0 text-sm text-foreground/85 leading-relaxed [overflow-wrap:break-word]">{children}</dd>
    </div>
  );
}

/** A section's heading: mono label + count */
function PartTitle({ id, icon, children, count }: { id: string; icon: ReactNode; children: ReactNode; count?: number }) {
  return (
    <h2 id={id} className="mb-6 flex items-center gap-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">
      <span className="text-primary-ink" aria-hidden="true">
        {icon}
      </span>
      {children}
      {count !== undefined && <span className="text-foreground/60">· {count}</span>}
    </h2>
  );
}

const linkClass = "text-primary-ink hover:text-foreground underline underline-offset-4";

function structuredData(i: JourneyItem) {
  const url = absoluteUrl(journeyPath(i.slug));
  const mainEntity =
    i.kind === "recommendation" && i.quote
      ? {
          "@type": "Quotation",
          "@id": `${url}#quote`,
          text: i.quote.quote,
          creator: { "@type": "Person", name: i.quote.author, jobTitle: i.subtitle },
          about: PERSON_REF,
          ...(i.quote.date ? { dateCreated: i.quote.date } : {}),
          inLanguage: i.quote.lang ?? "en",
        }
      : i.kind === "sport"
        ? { "@type": "SportsOrganization", "@id": `${url}#club`, name: i.title, sport: i.subtitle }
        : undefined;
  return jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: pageTitle(i),
        description: i.summary,
        inLanguage: "en",
        about: PERSON_REF,
        isPartOf: { "@id": WEBSITE_ID },
        ...(i.isoDate ? { temporalCoverage: i.isoDate } : {}),
        ...(mainEntity ? { mainEntity: { "@id": mainEntity["@id"] } } : {}),
        mentions: [
          ...i.roles.map((r) => ({ "@type": "Organization", name: r.subTag, url: r.subTagHyperlink })),
          ...i.certificates.map((c) => ({ "@type": "EducationalOccupationalCredential", name: c.title, url: absoluteUrl(certificatePagePath(c.slug)) })),
          ...(i.kind === "platform" ? [{ "@type": "WebSite", name: i.title, url: i.links[0]?.href }] : []),
        ].filter((m, n, all) => all.findIndex((x) => x.name === m.name) === n),
        ...(i.photos.length
          ? {
              image: i.photos.slice(0, PHOTOS_SHOWN).map((p) => ({
                "@type": "ImageObject",
                contentUrl: absoluteUrl(photoImagePath(p.slug)),
                caption: p.title,
                creditText: "Ahmed Emad Nasr",
              })),
            }
          : {}),
      },
      ...(mainEntity ? [mainEntity] : []),
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["The Journey", JOURNEY_URL],
        [i.title, url],
      ]),
    ],
  });
}

export default async function JourneyItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  /* A platform page shows today's TryHackMe numbers, like /journey */
  const thm = slug === "tryhackme" ? await getTryHackMeStats() : undefined;
  const i = journeyItem(slug, thm);
  if (!i) notFound();

  const kind = kindOf(i);
  const all = journeyItems();
  const position = all.findIndex((x) => x.slug === i.slug);
  const prev = all[position - 1];
  const next = all[position + 1];
  const siblings = all.filter((x) => x.kind === i.kind && x.slug !== i.slug);
  /* The big button: the platform's profile, or the recommendation on LinkedIn */
  const primary = i.kind === "platform" || i.kind === "recommendation" ? i.links.find((l) => l.external) : undefined;
  /* The story, without the sentence already shown under the title */
  const story = i.story.filter((p) => p !== i.summary);
  const photos = i.photos.slice(0, PHOTOS_SHOWN);

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(i) }} />
      <article className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden">
        <KanjiWatermark chars={kind.japanese} side="right" />
        <div className="max-w-7xl mx-auto relative z-10">
          <BackCrumb href={`/journey#${kind.anchor}`} label="The Journey" current={kind.label} />

          <header className="mb-12 md:mb-16">
            <Eyebrow>
              Ahmed Emad Nasr // {kind.noun} · {i.when}
            </Eyebrow>
            <div className="title-box">
              <h1
                style={{ "--word-n": Math.max(longestWord(i.title), 8) } as CSSProperties}
                className="font-display word-fit [--fit-max:1.875rem] md:[--fit-max:3rem] lg:[--fit-max:3.75rem] font-black uppercase tracking-tight leading-[1.02] text-foreground [text-wrap:balance]"
              >
                {i.title}
              </h1>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {(i.kind === "platform" || i.kind === "sport") && <OrgLogo name={i.title} size="md" />}
              <p className="text-base md:text-lg text-foreground/75">
                <strong className="font-semibold text-foreground">{i.subtitle}</strong>
                <span className="text-foreground/60"> · {i.when}</span>
              </p>
            </div>
            {i.kind !== "recommendation" && <p className="mt-6 max-w-3xl text-lg text-foreground/70 font-light leading-relaxed">{i.summary}</p>}
            {primary && (
              <a href={primary.href} target="_blank" rel="noopener noreferrer" className={`${ctaPrimary} mt-8`}>
                {primary.label}
                <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only"> (opens another site)</span>
              </a>
            )}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
            {/* The story — or the recommendation, in full */}
            <FadeIn className="min-w-0">
              {i.quote ? (
                <figure className={`${cardSurface} p-7 md:p-9`}>
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/40 to-transparent" aria-hidden="true" />
                  <Quote size={28} className="mb-5 text-primary/30" aria-hidden="true" />
                  <QuoteText t={i.quote} large />
                  <figcaption className="mt-8 pt-6 border-t border-foreground/10">
                    <p className="font-display text-lg font-black uppercase tracking-tight text-foreground">{i.quote.author}</p>
                    <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/60">{i.quote.source}</p>
                  </figcaption>
                </figure>
              ) : story.length > 0 ? (
                <>
                  <h2 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground mb-5">
                    The <span className="text-primary italic">story.</span>
                  </h2>
                  {story.map((p) => (
                    <p key={p} className="mb-4 text-base md:text-[1.0625rem] text-foreground/80 font-light leading-relaxed">
                      {p}
                    </p>
                  ))}
                </>
              ) : null}
              {i.stats && (
                <ul className="mt-8 first:mt-0 grid grid-cols-2 sm:grid-cols-3 gap-3" aria-label={`${i.title} numbers`}>
                  {i.stats.map((s) => (
                    <li key={s.label} className={`${cardSurface} p-4`}>
                      <span className="block font-display text-2xl font-black text-foreground tabular-nums">{s.value}</span>
                      <span className="mt-1 block font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">{s.label}</span>
                    </li>
                  ))}
                </ul>
              )}
              {i.chips && i.chips.items.length > 0 && (
                <>
                  <h3 className="mt-10 first:mt-0 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">{i.chips.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {i.chips.items.map((t) => (
                      <li key={t} className={chipNeutral}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </FadeIn>

            {/* Every fact, one row each */}
            <FadeIn delay={0.08} className={`${cardSurface} p-6 md:p-8 min-w-0`}>
              <h2 className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink mb-3">The details</h2>
              <dl>
                {i.facts.map((f, n) => (
                  <Row key={`${f.label}-${n}`} label={f.label}>
                    {f.href ? (
                      f.href.startsWith("/") ? (
                        <Link prefetch={false} href={f.href} className={linkClass}>
                          {f.value}
                        </Link>
                      ) : (
                        <a href={f.href} target="_blank" rel="noopener noreferrer" className={`${linkClass} break-all`}>
                          {f.value}
                        </a>
                      )
                    ) : (
                      f.value
                    )}
                  </Row>
                ))}
              </dl>
            </FadeIn>
          </div>

          {/* The roles behind it — every bullet, as on the CV */}
          {i.roles.length > 0 && (
            <section className="mt-20" aria-labelledby="part-roles">
              <PartTitle id="part-roles" icon={<Briefcase size={14} />} count={i.roles.length}>
                {i.roles.length > 1 ? "The roles behind it" : "The role behind it"}
              </PartTitle>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {i.roles.map((r, n) => (
                  <FadeIn key={`${r.subTag}-${r.tag}`} delay={n * 0.06} className={`${cardSurface} p-6 md:p-8 min-w-0`}>
                    <div className="flex items-start gap-3">
                      <OrgLogo name={r.subTag} />
                      <div className="min-w-0">
                        <h3 className="font-display text-lg md:text-xl font-black uppercase tracking-tight leading-tight text-foreground">{r.tag}</h3>
                        <p className="mt-1 text-sm text-foreground/75">
                          <a href={r.subTagHyperlink} target="_blank" rel="noopener noreferrer" className={linkClass}>
                            {r.subTag}
                          </a>
                        </p>
                        <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/60">
                          {roleMonth(r.startDate)} – {roleMonth(r.endDate)} · {r.kind === "work" ? "Work" : r.kind === "volunteer" ? "Volunteer" : "Education"}
                          {r.place ? ` · ${r.place}` : ""}
                        </p>
                      </div>
                    </div>
                    <ul className="mt-5 space-y-2.5">
                      {r.desc.split(" • ").map((b) => (
                        <li key={b} className="flex gap-3 text-sm text-foreground/75 font-light leading-relaxed">
                          <span className="mt-2 h-1 w-1 shrink-0 bg-primary" aria-hidden="true" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Skills">
                      {r.skills.map((s) => (
                        <li key={s} className={chipNeutral}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </FadeIn>
                ))}
              </div>
            </section>
          )}

          {/* A platform's write-ups: the latest, and the page with all */}
          {i.writeups && (
            <section className="mt-20" aria-labelledby="part-writeups">
              <PartTitle id="part-writeups" icon={<FileText size={14} />} count={i.writeups.count}>
                Write-ups from {i.writeups.platform}
              </PartTitle>
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {i.writeups.latest.map((c) => (
                  <li key={c.id}>
                    <Link prefetch={false} href={`/blog/${c.id}`} className={`${cardSurface} group block h-full p-5 hover:border-primary/40 transition-colors`}>
                      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
                        {c.category} · {c.date}
                      </span>
                      <span className="mt-2 block text-sm font-semibold text-foreground group-hover:text-primary-ink">{c.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {i.writeups.href && (
                <Link prefetch={false} href={i.writeups.href} className={`${btnOutline} mt-6`}>
                  All {i.writeups.count} {i.writeups.platform} write-ups <ArrowRight size={13} aria-hidden="true" />
                </Link>
              )}
            </section>
          )}

          {/* The certificates — each opens its own page */}
          {i.certificates.length > 0 && (
            <section className="mt-20" aria-labelledby="part-certificates">
              <PartTitle id="part-certificates" icon={<FileText size={14} />} count={i.certificates.length}>
                Certificates
              </PartTitle>
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {i.certificates.map((c) => (
                  <li key={c.slug}>
                    <Link
                      prefetch={false}
                      href={certificatePagePath(c.slug)}
                      className={`${cardSurface} group flex h-full items-start gap-3 p-5 hover:border-primary/40 transition-colors`}
                    >
                      <OrgLogo name={c.issuer} />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-foreground group-hover:text-primary-ink">{c.title}</span>
                        <span className="mt-1 block font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">
                          {c.issuer}
                          {certificateWhen(c) ? ` · ${certificateWhen(c)}` : ""}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* The photos, with their captions — the full set is in the gallery */}
          {photos.length > 0 && (
            <section className="mt-20" aria-labelledby="part-photos">
              <PartTitle id="part-photos" icon={<Camera size={14} />} count={i.photos.length}>
                {i.photosTitle ?? "Photos"}
              </PartTitle>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {photos.map((p) => {
                  const size = imageSize(photoThumbPath(p.slug));
                  const when = formatPhotoDate(p.date);
                  return (
                    <li key={p.slug}>
                      <Link prefetch={false} href={`/gallery#${p.slug}`} className={`${cardSurface} group block h-full overflow-hidden hover:border-primary/40 transition-colors`}>
                        <Image
                          src={normalizePublicHref(photoThumbPath(p.slug))}
                          alt={p.title}
                          width={size?.width ?? 640}
                          height={size?.height ?? 480}
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="w-full h-auto"
                        />
                        <span className="block p-4">
                          <span className="block text-sm font-semibold text-foreground group-hover:text-primary-ink">{p.title}</span>
                          <span className="mt-1 block font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">
                            {p.event}
                            {when ? ` · ${when}` : ""}
                          </span>
                          <span className="mt-2 block text-xs text-foreground/65 font-light leading-relaxed line-clamp-4">{p.description}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link prefetch={false} href={`/gallery#${i.photos[0]!.slug}`} className={`${btnOutline} mt-6`}>
                {i.photos.length > PHOTOS_SHOWN ? `All ${i.photos.length} photos in the gallery` : "Open them in the gallery"} <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </section>
          )}

          {/* The other links (the organisation's site, LinkedIn, the experience section …) */}
          {i.links.filter((l) => l !== primary).length > 0 && (
            <section className="mt-20" aria-labelledby="part-links">
              <h2 id="part-links" className="mb-5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-foreground/60">
                Links
              </h2>
              <ul className="flex flex-wrap gap-3">
                {i.links
                  .filter((l) => l !== primary)
                  .map((l) => (
                    <li key={l.href}>
                      {l.external ? (
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className={btnOutline}>
                          {l.label} <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                      ) : (
                        <Link prefetch={false} href={l.href} className={btnOutline}>
                          {l.label} <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                      )}
                    </li>
                  ))}
              </ul>
            </section>
          )}

          {siblings.length > 0 && (
            <section className="mt-20" aria-labelledby="part-more">
              <h2 id="part-more" className="mb-5 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-foreground/60">
                More from {kind.label}
              </h2>
              <ul className="flex flex-wrap gap-3">
                {siblings.map((x) => (
                  <li key={x.slug}>
                    <Link prefetch={false} href={journeyPath(x.slug)} className={btnOutline}>
                      {x.kind === "path" ? `${x.when} — ${x.title}` : x.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Previous and next">
            {prev ? (
              <Link prefetch={false} href={journeyPath(prev.slug)} className={`${cardSurface} group p-5 hover:border-primary/40 transition-colors`}>
                <span className="flex items-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
                  <ArrowLeft size={12} aria-hidden="true" /> Previous · {kindOf(prev).label}
                </span>
                <span className="mt-2 block text-sm font-semibold text-foreground group-hover:text-primary-ink">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link prefetch={false} href={journeyPath(next.slug)} className={`${cardSurface} group p-5 text-end hover:border-primary/40 transition-colors`}>
                <span className="flex items-center justify-end gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
                  {kindOf(next).label} · Next <ArrowRight size={12} aria-hidden="true" />
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
