/*
 * BlogGuide — "How to read this blog", for visitors who are not in security:
 * the four kinds of case, the five questions every case page answers, and
 * the handful of words the whole blog leans on. Server Component (no JS);
 * the word list is a <details>, closed until someone wants it.
 */

import { BookOpenText, FlaskConical, FolderSearch, NotebookPen, Wrench } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { Eyebrow } from "@/components/ui/kit";
import { KIND_GUIDE } from "@/lib/case-guide";
import type { CaseKind } from "@/lib/shared";

const KINDS: { id: CaseKind; label: string; icon: typeof FolderSearch }[] = [
  { id: "investigation", label: "Investigation", icon: FolderSearch },
  { id: "project", label: "Project", icon: Wrench },
  { id: "lab", label: "Practice lab", icon: FlaskConical },
  { id: "note", label: "Study notes", icon: NotebookPen },
];

const QUESTIONS = [
  ["The goal", "What the case set out to answer."],
  ["What happened?", "The attack or the weakness, step by step."],
  ["What I did", "My work, in order, and the tools I used."],
  ["How to prevent it", "How to stop it happening again."],
  ["Evidence & files", "Screenshots, clues, and the full technical PDF."],
] as const;

const WORDS = [
  ["SOC", "Security Operations Centre — the team that watches a company's systems and handles security alerts."],
  ["Alert", "An automatic warning from a security tool that something looks like an attack."],
  ["True / false positive", "An alert that was a real attack / an alert that was a false alarm."],
  ["SIEM", "A system that gathers logs from many computers and raises alerts (Wazuh and Splunk are examples)."],
  ["IOC", "A clue an attacker leaves behind: an IP address, a domain, a file fingerprint."],
  ["MITRE ATT&CK", "A public catalogue of attacker techniques, each with an ID such as T1566 (phishing)."],
  ["DFIR", "Digital forensics & incident response — investigating an attack and the evidence it left."],
  ["Detection rule", "An automatic tripwire: when the logs match a pattern, the SIEM raises an alert."],
] as const;

export default function BlogGuide() {
  return (
    <section id="how-to-read" aria-labelledby="how-to-read-title" className="relative px-6 md:px-20 pt-10 pb-8 bg-background scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <FadeIn y={20} duration={0.6} className="relative border border-foreground/10 bg-surface/50 backdrop-blur-sm p-6 md:p-10">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/40 to-transparent" aria-hidden="true" />
          <Eyebrow>New here?</Eyebrow>
          <h2 id="how-to-read-title" className="-mt-2 font-display text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground">
            How to read <span className="text-primary italic">this blog.</span>
          </h2>
          <p className="mt-3 max-w-3xl text-foreground/60 font-light leading-relaxed">
            Every post is a <strong className="font-semibold text-foreground/85">case study</strong>: a piece of real security
            work, written so anyone can follow it. The plain-language summary always comes first; the technical detail
            and the original report come after, for those who want them.
          </p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h3 className="mb-4 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink">Four kinds of case</h3>
              <ul className="grid gap-3">
                {KINDS.map((k, i) => (
                  <FadeIn as="li" key={k.id} y={12} duration={0.55} delay={0.15 + i * 0.07} className="flex gap-3">
                    <k.icon size={16} className="mt-1 shrink-0 text-tertiary" aria-hidden="true" />
                    <p className="text-sm text-foreground/70 font-light leading-relaxed">
                      <strong className="font-semibold text-foreground">{k.label}</strong> — {KIND_GUIDE[k.id].long}
                    </p>
                  </FadeIn>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink">Every case answers five questions</h3>
              <ol className="grid gap-2">
                {QUESTIONS.map(([q, a], i) => (
                  <FadeIn as="li" key={q} y={12} duration={0.55} delay={0.15 + i * 0.07} className="flex items-baseline gap-3 border-b border-foreground/5 pb-2 last:border-b-0">
                    <span className="font-mono text-[0.625rem] font-bold text-primary-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm text-foreground/70 font-light">
                      <strong className="font-semibold text-foreground">{q}</strong> {a}
                    </span>
                  </FadeIn>
                ))}
              </ol>
            </div>
          </div>

          <details className="group/words mt-8 border border-foreground/10 bg-foreground/[0.02]">
            <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-foreground/70 hover:text-foreground [&::-webkit-details-marker]:hidden">
              <BookOpenText size={13} className="mr-2 inline-block text-accent align-[-2px]" aria-hidden="true" />
              Eight words you will see everywhere
              <span className="ml-2 text-primary-ink inline-block transition-transform group-open/words:rotate-90" aria-hidden="true">›</span>
            </summary>
            <dl className="grid gap-x-8 gap-y-3 px-4 pb-4 pt-1 sm:grid-cols-2">
              {WORDS.map(([term, meaning]) => (
                <div key={term}>
                  <dt className="font-mono text-[0.6875rem] font-bold text-accent">{term}</dt>
                  <dd className="mt-0.5 text-sm text-foreground/70 leading-relaxed">{meaning}</dd>
                </div>
              ))}
            </dl>
          </details>
        </FadeIn>
      </div>
    </section>
  );
}
