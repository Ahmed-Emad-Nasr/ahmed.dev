/*
 * ═══ app/attack/[id]/page.tsx — one ATT&CK technique  ( URL: /attack/<T-id> ) ═══
 *
 * One page per technique the cases show (T1059, T1566 …): what it is in
 * plain words, the sub-techniques seen, the cases that show it, the tools
 * used to catch it and the techniques that came with it. Built for searches
 * like "T1059 detection" or "phishing ATT&CK write-up".
 *
 * Nothing to edit here: everything is computed from data/attack.ts and
 * data/cases.ts — map a case to a technique and it appears on this page.
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
  ATTACK_TECHNIQUES,
  casesForTechnique,
  categoriesAcross,
  relatedTechniques,
  subTechniquesSeen,
  techniqueById,
  toolsAcross,
} from "@/lib/collections";
import { absoluteUrl, caseUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { pageMetadata } from "@/lib/page-meta";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords } from "@/lib/seo";
import { ATTACK_ID, ATTACK_URL, BLOG_URL } from "@/lib/page-ids";

/* Any id the cases do not show is a 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  return ATTACK_TECHNIQUES.map((t) => ({ id: t.id }));
}

const mitreUrl = (id: string) => `https://attack.mitre.org/techniques/${id.replace(".", "/")}/`;

/* The text of the page, from the numbers */
function describe(id: string) {
  const technique = techniqueById(id);
  if (!technique) return null;
  const cases = casesForTechnique(technique);
  const n = cases.length;
  const title = `${technique.id} ${technique.name} — ${n} Real ${n === 1 ? "Case" : "Cases"} | Ahmed Emad Nasr`;
  const description = `MITRE ATT&CK ${technique.id} (${technique.name}, ${technique.tactic.name}) as it showed up in ${n} of my investigations and labs: what happened, how it was detected and the tools used — ${cases
    .slice(0, 3)
    .map((c) => c.title.split(" (")[0])
    .join("; ")}.`;
  return { technique, cases, title, description };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const page = describe((await params).id);
  if (!page) return { title: "Technique not found" };
  const { technique, title, description } = page;
  return pageMetadata({
    title,
    description,
    path: `/attack/${technique.id}`,
    keywords: pageKeywords(
      [
        `${technique.id}`,
        `${technique.id} ${technique.name}`,
        `${technique.name} detection`,
        `${technique.id} detection`,
        `${technique.name} investigation`,
        `${technique.tactic.name} ${technique.tactic.ta}`,
      ],
      KEYWORDS.attack,
    ),
    share: pageShareImage("attack", `${technique.id} ${technique.name} — Ahmed Emad Nasr`),
    type: "article",
  });
}

export default async function TechniquePage({ params }: { params: Promise<{ id: string }> }) {
  const page = describe((await params).id);
  if (!page) notFound();
  const { technique, cases, title, description } = page;
  const url = absoluteUrl(`/attack/${technique.id}`);
  const subs = subTechniquesSeen(technique.id);
  const tools = toolsAcross(cases);
  const categories = categoriesAcross(cases);
  const related = relatedTechniques(technique);

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
        isPartOf: [{ "@id": WEBSITE_ID }, { "@id": ATTACK_ID }],
        author: PERSON_REF,
        about: {
          "@type": "DefinedTerm",
          termCode: technique.id,
          name: technique.name,
          url: mitreUrl(technique.id),
          inDefinedTermSet: { "@type": "DefinedTermSet", name: "MITRE ATT&CK Enterprise", url: "https://attack.mitre.org/" },
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: cases.length,
          itemListElement: cases.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: caseUrl(c.id), name: c.title })),
        },
      },
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["Blog", BLOG_URL],
        ["MITRE ATT&CK", ATTACK_URL],
        [`${technique.id} ${technique.name}`, url],
      ]),
    ],
  });

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <section className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden">
        <KanjiWatermark chars="戦術" side="right" />
        <div className="max-w-7xl mx-auto relative z-10">
          <BackCrumb href="/attack" label="All techniques" current={technique.tactic.name} />
          <SectionHeader
            as="h1"
            eyebrow={`MITRE ATT&CK // ${technique.tactic.name} · ${technique.tactic.ta}`}
            japanese="戦術"
            titleA={technique.id}
            titleB={technique.name}
            /* A long name in the fit-to-one-line size would be tiny on a phone: let it wrap */
            size={technique.name.length > 18 ? "default" : "lg"}
            className="[&_h1]:[overflow-wrap:anywhere] [&_h1]:hyphens-auto"
            description={
              <>
                {technique.name} is a technique of the <strong className="font-semibold text-foreground/80">{technique.tactic.name}</strong> tactic in
                MITRE ATT&amp;CK.{" "}
                {cases.length === 1
                  ? `It shows up in one of my write-ups (${categories[0][0]}).`
                  : `It shows up in ${cases.length} of my write-ups — mostly ${categories
                      .slice(0, 2)
                      .map(([c]) => c)
                      .join(" and ")}.`}{" "}
                Each case below shows where it appeared, how it was found and what would stop it next time.
              </>
            }
            aside={
              <div className="flex flex-col items-start gap-4">
                <CounterChip
                  stats={[
                    { value: String(cases.length), label: cases.length === 1 ? "Case" : "Cases" },
                    ...(subs.length ? [{ value: String(subs.length), label: subs.length === 1 ? "Sub-technique" : "Sub-techniques" }] : []),
                  ]}
                />
                <a href={mitreUrl(technique.id)} target="_blank" rel="noopener noreferrer" className={btnOutline}>
                  <ExternalLink size={13} aria-hidden="true" /> {technique.id} on MITRE
                  <span className="sr-only"> (opens attack.mitre.org)</span>
                </a>
              </div>
            }
          />

          {(subs.length > 0 || tools.length > 0) && (
            <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              {subs.length > 0 && (
                <div>
                  <h2 className="mb-4 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">Sub-techniques seen</h2>
                  <ul className="space-y-2">
                    {subs.map((s) => (
                      <li key={s.id} className="flex items-baseline gap-3 text-sm text-foreground/80">
                        <a
                          href={mitreUrl(s.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs font-black text-accent tabular-nums hover:text-foreground transition-colors duration-300"
                        >
                          {s.id}
                          <span className="sr-only"> on MITRE (opens attack.mitre.org)</span>
                        </a>
                        <span>{s.name.split(":").pop()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tools.length > 0 && (
                <div>
                  <h2 className="mb-4 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">Tools used to find it</h2>
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
          )}

          <h2 className="mb-8 flex items-center gap-4 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-primary-ink">
            <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
            The cases
          </h2>
          <CaseLinkGrid cases={cases} />

          {related.length > 0 && (
            <section className="mt-24" aria-labelledby="related-techniques">
              <h2
                id="related-techniques"
                className="mb-8 flex items-center gap-4 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-primary-ink"
              >
                <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
                Seen in the same cases
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map((t) => (
                  <li key={t.id} className="flex">
                    <Link
                      prefetch={false}
                      href={`/attack/${t.id}`}
                      className="group spotlight relative flex w-full items-baseline gap-4 bg-surface/60 border border-foreground/5 px-5 py-4 hover:border-primary/40 transition-colors duration-300"
                    >
                      <span className="font-mono text-xs font-black text-accent tabular-nums shrink-0">{t.id}</span>
                      <span className="flex-1 text-sm text-foreground/80 group-hover:text-foreground transition-colors duration-300">{t.name}</span>
                      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60 shrink-0">{t.tactic.short}</span>
                    </Link>
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
