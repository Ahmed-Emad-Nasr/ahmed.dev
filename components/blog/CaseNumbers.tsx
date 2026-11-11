/*
 * ═══ components/blog/CaseNumbers.tsx — the case "by the numbers" ═══
 *
 * The strip right under the one-line verdict on a case page: up to four
 * figures a reader can take in before reading anything — how long it
 * lasted, how many steps were traced, which rules cover it, what was
 * extracted. And, when the case has it, one line on what was prevented.
 *
 * What the figures are and where each one comes from: lib/case-numbers.ts
 * (they are counted from the case's own data, never typed in).
 */

import FadeIn from "@/components/ui/FadeIn";
import PageLink from "@/components/ui/PageLink";
import type { CaseNumber } from "@/lib/case-numbers";

const TILE = "flex h-full flex-col-reverse justify-end gap-2 bg-surface/60 px-5 py-5";

export default function CaseNumbers({ numbers, prevented }: { numbers: readonly CaseNumber[]; prevented?: string }) {
  /* One lonely figure is not a summary */
  if (numbers.length < 2 && !prevented) return null;
  return (
    <FadeIn y={16} duration={0.6} className="mb-10">
      <p className="mb-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.35em] text-foreground/60">
        By the numbers{" "}
        <span className="jp-eyebrow ml-2 text-[0.6875rem] tracking-normal text-foreground/30" lang="ja" aria-hidden="true" data-jp="指標" />
      </p>
      {numbers.length >= 2 && (
        /* gap-px over a tinted background = hairlines between the tiles */
        <dl className="grid grid-cols-2 gap-px border border-foreground/10 bg-foreground/10 md:grid-cols-4">
          {numbers.map((n) => (
            /* A <dl> may only hold <div> groups, so a tile that links is still a
               <div>: the link is its label, stretched over the whole tile */
            <div key={n.label} className={`${TILE} ${n.href ? "relative transition-colors hover:bg-surface focus-within:bg-surface" : ""}`}>
              <dt className="text-sm leading-snug text-foreground/75">
                {n.href ? (
                  <PageLink href={n.href} className="after:absolute after:inset-0">
                    {n.label}
                  </PageLink>
                ) : (
                  n.label
                )}
                {n.note && <span className="mt-1 block font-mono text-[0.625rem] leading-relaxed text-foreground/70">{n.note}</span>}
              </dt>
              <dd className="font-display text-2xl leading-none tracking-tight text-foreground tabular-nums md:text-3xl">{n.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {prevented && (
        <p className="mt-px border border-foreground/10 bg-surface/60 px-5 py-4 text-sm leading-relaxed text-foreground/85">
          <span className="mr-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink">Prevented</span>
          {prevented}
        </p>
      )}
    </FadeIn>
  );
}
