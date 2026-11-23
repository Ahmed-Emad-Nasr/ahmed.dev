/*
 * ═══ app/attack/page.tsx — every ATT&CK technique the cases show  ( URL: /attack ) ═══
 *
 * The case library as MITRE ATT&CK sees it: the tactics in kill-chain order,
 * each with the techniques my reports actually show and how many cases show
 * them. Every technique opens its own page (/attack/<T-id>).
 *
 * Nothing to edit here: it is computed from data/attack.ts and data/cases.ts.
 */

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import BackCrumb from "@/components/layout/BackCrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import FadeIn from "@/components/ui/FadeIn";
import { KanjiWatermark } from "@/components/ui/kit";
import { ATTACK_TECHNIQUES } from "@/lib/collections";
import { caseAttackMapping } from "@/data/attack";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { pageMetadata } from "@/lib/page-meta";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords, withAudience } from "@/lib/seo";
import { ATTACK_ID, ATTACK_URL, BLOG_URL } from "@/lib/page-ids";

const TACTICS = [...new Map(ATTACK_TECHNIQUES.map((t) => [t.tactic.id, t.tactic])).values()];
const MAPPED_CASES = Object.keys(caseAttackMapping).length;

const TITLE = "MITRE ATT&CK Techniques in Real Investigations — Ahmed Emad Nasr";
/* The audience line (AUDIENCE in lib/shared.ts) is added to the description */
const DESCRIPTION = withAudience(`${ATTACK_TECHNIQUES.length} MITRE ATT&CK techniques across ${TACTICS.length} tactics, each one seen in my own SOC, DFIR and lab write-ups (${MAPPED_CASES} cases). Pick a technique to read the cases that show it and how it was detected`, 300);

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/attack",
  keywords: pageKeywords(KEYWORDS.attack),
  share: pageShareImage("attack", "Ahmed Emad Nasr — MITRE ATT&CK techniques"),
});

function structuredData() {
  return jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": ATTACK_ID,
        url: ATTACK_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@type": "Thing", name: "MITRE ATT&CK", sameAs: "https://attack.mitre.org/" },
        author: PERSON_REF,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: ATTACK_TECHNIQUES.length,
          itemListElement: ATTACK_TECHNIQUES.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(`/attack/${t.id}`),
            name: `${t.id} ${t.name}`,
          })),
        },
      },
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["Blog", BLOG_URL],
        ["MITRE ATT&CK", ATTACK_URL],
      ]),
    ],
  });
}

export default function AttackPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      <section className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden">
        <KanjiWatermark chars="戦術" side="right" />
        <div className="max-w-7xl mx-auto relative z-10">
          <BackCrumb href="/blog" label="All cases" current="MITRE ATT&CK" />
          <SectionHeader
            as="h1"
            eyebrow="Ahmed Emad Nasr // MITRE ATT&CK"
            japanese="戦術"
            titleA="Techniques"
            titleB="I Have Seen."
            size="lg"
            description={
              <>
                MITRE ATT&amp;CK is the public catalogue security teams use to name what attackers do. Below is every technique that my own
                investigations and labs show — not a list copied from the framework. Pick one to read the cases behind it.
              </>
            }
            aside={
              <CounterChip
                stats={[
                  { value: String(ATTACK_TECHNIQUES.length), label: "Techniques" },
                  { value: String(TACTICS.length), label: "Tactics" },
                  { value: String(MAPPED_CASES), label: "Cases" },
                ]}
              />
            }
          />

          <div className="space-y-16">
            {TACTICS.map((tactic) => {
              const techniques = ATTACK_TECHNIQUES.filter((t) => t.tactic.id === tactic.id);
              return (
                <section key={tactic.id} aria-labelledby={`tactic-${tactic.id}`}>
                  <h2
                    id={`tactic-${tactic.id}`}
                    className="mb-6 flex flex-wrap items-center gap-4 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-primary-ink"
                  >
                    <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
                    {tactic.name}
                    <span className="text-foreground/60 tracking-[0.2em]">{tactic.ta}</span>
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {techniques.map((t, i) => (
                      <FadeIn as="li" key={t.id} y={16} delay={Math.min(i, 6) * 0.06} className="flex">
                        <Link
                          prefetch={false}
                          href={`/attack/${t.id}`}
                          className="group spotlight relative flex w-full items-baseline gap-4 bg-surface/60 border border-foreground/5 px-5 py-4 hover:border-primary/40 transition-colors duration-300"
                        >
                          <span className="font-mono text-xs font-black text-accent tabular-nums shrink-0">{t.id}</span>
                          <span className="flex-1 text-sm text-foreground/80 group-hover:text-foreground transition-colors duration-300">{t.name}</span>
                          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60 shrink-0">
                            {t.caseIds.length} {t.caseIds.length === 1 ? "case" : "cases"}
                          </span>
                        </Link>
                      </FadeIn>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <p className="mt-20 text-sm text-foreground/60 font-light">
            Names and tactics follow{" "}
            <a
              href="https://attack.mitre.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary-ink hover:text-foreground transition-colors duration-300"
            >
              MITRE ATT&amp;CK Enterprise
              <ExternalLink size={12} aria-hidden="true" />
              <span className="sr-only"> (opens attack.mitre.org)</span>
            </a>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}
