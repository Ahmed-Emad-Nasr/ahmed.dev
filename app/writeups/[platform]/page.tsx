/*
 * ═══ app/writeups/[platform]/page.tsx — one platform's write-ups  ( URL: /writeups/<platform> ) ═══
 *
 * /writeups/tryhackme, /writeups/portswigger, /writeups/letsdefend: every
 * case from that platform, newest first, with what they cover (categories,
 * ATT&CK techniques, tools). Built for searches like "TryHackMe SOC write-up".
 *
 * The platforms and their intros live in lib/collections.ts (PLATFORM_PAGES);
 * the cases come from data/cases.ts by their `platform` field.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import BackCrumb from "@/components/layout/BackCrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import CaseLinkGrid from "@/components/blog/CaseLinkGrid";
import { KanjiWatermark, btnOutline, chipNeutral } from "@/components/ui/kit";
import {
  PLATFORM_PAGES,
  casesForPlatform,
  categoriesAcross,
  platformPageBySlug,
  platformProfile,
  techniquesAcross,
  toolsAcross,
} from "@/lib/collections";
import { absoluteUrl, caseUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { pageMetadata } from "@/lib/page-meta";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords } from "@/lib/seo";
import { BLOG_ID, BLOG_URL } from "@/lib/page-ids";

export const dynamicParams = false;

export function generateStaticParams() {
  return PLATFORM_PAGES.map((p) => ({ platform: p.slug }));
}

function describe(slug: string) {
  const page = platformPageBySlug(slug);
  if (!page) return null;
  const cases = casesForPlatform(page.platform);
  const title = `${page.name} Write-ups (${cases.length}) — Ahmed Emad Nasr`;
  const description = `${cases.length} ${page.name} write-ups by Ahmed Emad Nasr, solved step by step with screenshots: ${categoriesAcross(cases)
    .slice(0, 4)
    .map(([c]) => c)
    .join(", ")}.`;
  return { page, cases, title, description };
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }): Promise<Metadata> {
  const found = describe((await params).platform);
  if (!found) return { title: "Platform not found" };
  const { page, title, description } = found;
  return pageMetadata({
    title,
    description,
    path: `/writeups/${page.slug}`,
    keywords: pageKeywords(
      [
        `${page.name} write-ups`,
        `${page.name} writeups`,
        `${page.name} walkthrough`,
        `${page.name} solutions`,
        `${page.platform} write-up`,
      ],
      KEYWORDS.writeups,
    ),
    share: pageShareImage("writeups", `${page.name} write-ups — Ahmed Emad Nasr`),
  });
}

export default async function PlatformWriteupsPage({ params }: { params: Promise<{ platform: string }> }) {
  const found = describe((await params).platform);
  if (!found) notFound();
  const { page, cases, title, description } = found;
  const url = absoluteUrl(`/writeups/${page.slug}`);
  const profile = platformProfile(page);
  const categories = categoriesAcross(cases);
  const techniques = techniquesAcross(cases);
  const tools = toolsAcross(cases);
  const others = PLATFORM_PAGES.filter((p) => p.slug !== page.slug);

  const structuredData = jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: title,
        description,
        inLanguage: "en",
        isPartOf: [{ "@id": WEBSITE_ID }, { "@id": BLOG_ID }],
        author: PERSON_REF,
        about: { "@type": "Organization", name: page.name, ...(profile ? { url: profile } : {}) },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: cases.length,
          itemListElement: cases.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: caseUrl(c.id), name: c.title })),
        },
      },
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["Blog", BLOG_URL],
        [`${page.name} write-ups`, url],
      ]),
    ],
  });

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <section className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden">
        <KanjiWatermark chars={page.japanese} side="right" />
        <div className="max-w-7xl mx-auto relative z-10">
          <BackCrumb href="/blog" label="All cases" current="Write-ups" />
          <SectionHeader
            as="h1"
            eyebrow={`Ahmed Emad Nasr // ${page.name}`}
            japanese={page.japanese}
            titleA={page.platform}
            titleB="Write-ups."
            size="lg"
            description={page.intro}
            aside={
              <div className="flex flex-col items-start gap-4">
                <CounterChip
                  stats={[
                    { value: String(cases.length), label: "Write-ups" },
                    { value: String(categories.length), label: categories.length === 1 ? "Topic" : "Topics" },
                  ]}
                />
                {profile && (
                  <a href={profile} target="_blank" rel="noopener noreferrer" className={btnOutline}>
                    <ExternalLink size={13} aria-hidden="true" /> My {page.platform} profile
                    <span className="sr-only"> (opens {page.platform})</span>
                  </a>
                )}
              </div>
            }
          />

          <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h2 className="mb-4 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">Topics</h2>
              <ul className="flex flex-wrap gap-2">
                {categories.map(([category, n]) => (
                  <li key={category} className={chipNeutral}>
                    {category} · {n}
                  </li>
                ))}
              </ul>
            </div>
            {techniques.length > 0 && (
              <div>
                <h2 className="mb-4 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">ATT&amp;CK techniques</h2>
                <ul className="flex flex-wrap gap-2">
                  {techniques.map((t) => (
                    <li key={t.id}>
                      <Link
                        prefetch={false}
                        href={`/attack/${t.id}`}
                        title={t.name}
                        className={`${chipNeutral} inline-block hover:border-primary hover:text-primary-ink transition-colors duration-300`}
                      >
                        {t.id} · {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tools.length > 0 && (
              <div>
                <h2 className="mb-4 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">Tools</h2>
                <ul className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <li key={tool} className={chipNeutral}>
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <h2 className="mb-8 flex items-center gap-4 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-primary-ink">
            <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
            Every write-up, newest first
          </h2>
          <CaseLinkGrid cases={cases} label="Show more write-ups" />

          <nav className="mt-24 flex flex-wrap items-center gap-4" aria-label="Other platforms">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-foreground/60">More write-ups:</span>
            {others.map((p) => (
              <Link key={p.slug} prefetch={false} href={`/writeups/${p.slug}`} className={btnOutline}>
                {p.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
